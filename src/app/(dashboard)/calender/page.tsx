'use client';

import { useState, useEffect, JSX } from 'react';

type EventCategory = 'academic' | 'exam' | 'event' | 'holiday' | 'meeting';

type CalendarEvent = {
  id: number;
  title: string;
  category: EventCategory;
  start: string;
  end: string;
  desc: string;
  location: string;
};

const mockEvents: CalendarEvent[] = [
  { id: 1, title: 'Midterm Exams Begin', category: 'exam', start: '2025-10-14', end: '2025-10-14', desc: 'All classes', location: 'All Classrooms' },
  { id: 2, title: 'Parent–Teacher Meeting', category: 'meeting', start: '2025-10-20', end: '2025-10-20', desc: 'Quarterly meeting with parents', location: 'Auditorium' },
  { id: 3, title: 'Fee Due Date', category: 'academic', start: '2025-10-25', end: '2025-10-25', desc: 'Month-end fee collection', location: 'Accounts Office' },
  { id: 4, title: 'Sports Day', category: 'event', start: '2025-11-02', end: '2025-11-02', desc: 'Annual sports day celebration', location: 'Main Ground' },
  { id: 5, title: 'Diwali Holiday', category: 'holiday', start: '2025-10-21', end: '2025-10-21', desc: 'School closed for Diwali', location: '' },
  { id: 6, title: 'Science Fair', category: 'event', start: '2025-10-28', end: '2025-10-28', desc: 'Annual science exhibition', location: 'Science Lab' },
  { id: 7, title: 'Staff Meeting', category: 'meeting', start: '2025-10-10', end: '2025-10-10', desc: 'Monthly staff coordination meeting', location: 'Conference Room' },
];

const categoryColors = {
  academic: 'bg-indigo-100 border-l-4 border-l-indigo-500',
  exam: 'bg-rose-100 border-l-4 border-l-rose-500',
  event: 'bg-emerald-100 border-l-4 border-l-emerald-500',
  holiday: 'bg-amber-100 border-l-4 border-l-amber-500',
  meeting: 'bg-cyan-100 border-l-4 border-l-cyan-500',
};

export default function CalendarPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'academic' as EventCategory,
    startDate: '',
    endDate: '',
    description: '',
    location: '',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showToast = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    return { year, month, daysInMonth, startDay };
  };

  const getEventsForDate = (date: Date, dayOfMonth: number) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    let filtered = events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === dayOfMonth &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });

    if (categoryFilter) {
      filtered = filtered.filter((e) => e.category === categoryFilter);
    }

    return filtered;
  };

  const isToday = (dayOfMonth: number) => {
    const today = new Date();
    return (
      dayOfMonth === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const openAddEventModal = (date?: Date) => {
    const dateStr = date ? date.toISOString().split('T')[0] : '';
    setFormData({
      title: '',
      category: 'academic',
      startDate: dateStr,
      endDate: dateStr,
      description: '',
      location: '',
    });
    setSelectedEvent(null);
    setShowModal(true);
  };

  const openEditEventModal = (event: CalendarEvent) => {
    setFormData({
      title: event.title,
      category: event.category,
      startDate: event.start,
      endDate: event.end,
      description: event.desc,
      location: event.location,
    });
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleSaveEvent = () => {
    if (!formData.title.trim()) {
      showToast('Please enter event title', 'warn');
      return;
    }

    if (selectedEvent) {
      // Edit existing event
      setEvents(
        events.map((e) =>
          e.id === selectedEvent.id
            ? {
                ...e,
                title: formData.title,
                category: formData.category,
                start: formData.startDate,
                end: formData.endDate,
                desc: formData.description,
                location: formData.location,
              }
            : e
        )
      );
      showToast('Event updated successfully!', 'success');
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        id: Math.max(...events.map((e) => e.id), 0) + 1,
        title: formData.title,
        category: formData.category,
        start: formData.startDate,
        end: formData.endDate,
        desc: formData.description,
        location: formData.location,
      };
      setEvents([...events, newEvent]);
      showToast('Event saved successfully!', 'success');
    }

    setShowModal(false);
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter((e) => e.id !== selectedEvent.id));
      showToast('Event deleted successfully!', 'success');
      setShowModal(false);
    }
  };

  const renderCalendar = () => {
    const { year, month, daysInMonth, startDay } = getDaysInMonth(currentDate);
    const weeks: JSX.Element[] = [];
    let cells: JSX.Element[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      cells.push(
        <td key={`empty-${i}`} className="py-2 pr-2 align-top text-center text-slate-300 border border-slate-100">
          &nbsp;
        </td>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(currentDate, day);
      const today = isToday(day);
      const cellDate = new Date(year, month, day);

      cells.push(
        <td
          key={day}
          className="py-2 pr-2 align-top text-center border border-slate-100 min-w-[120px] max-w-[120px] cursor-pointer hover:bg-slate-50"
          onClick={() => openAddEventModal(cellDate)}
        >
          <div className={`font-medium mb-1 ${today ? 'text-indigo-600' : 'text-slate-900'}`}>{day}</div>
          {dayEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className={`text-xs p-1 mb-1 rounded cursor-pointer ${categoryColors[event.category] || 'bg-slate-100'}`}
              onClick={(e) => {
                e.stopPropagation();
                openEditEventModal(event);
              }}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-slate-500">+{dayEvents.length - 3} more</div>
          )}
        </td>
      );

      // Start a new week after Saturday
      if ((startDay + day) % 7 === 0 || day === daysInMonth) {
        // Fill remaining cells if it's the last week
        if (day === daysInMonth) {
          const remaining = 7 - ((startDay + day) % 7);
          if (remaining < 7) {
            for (let i = 0; i < remaining; i++) {
              cells.push(
                <td key={`empty-end-${i}`} className="py-2 pr-2 align-top text-center text-slate-300 border border-slate-100">
                  &nbsp;
                </td>
              );
            }
          }
        }
        weeks.push(<tr key={`week-${weeks.length}`}>{cells}</tr>);
        cells = [];
      }
    }

    return weeks;
  };

  if (!isMounted) {
    return null;
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-[100]">
          <div
            className={`px-4 py-2 rounded-lg shadow text-white text-sm ${
              toast.type === 'success'
                ? 'bg-emerald-600'
                : toast.type === 'warn'
                ? 'bg-amber-600'
                : toast.type === 'error'
                ? 'bg-rose-600'
                : 'bg-slate-900'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {selectedEvent ? 'Edit Event' : 'Add Event'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Event Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="academic">Academic</option>
                    <option value="exam">Exams</option>
                    <option value="event">Events</option>
                    <option value="holiday">Holidays</option>
                    <option value="meeting">Meetings</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Event description..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., Auditorium, Main Ground"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleSaveEvent}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Event
                </button>
                {selectedEvent && (
                  <button
                    onClick={handleDeleteEvent}
                    className="px-4 py-2 border border-rose-300 text-rose-700 rounded-lg hover:bg-rose-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <a href="/dashboard" className="hover:text-slate-700">
            Dashboard
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span className="text-slate-700">Calendar</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">School Calendar</h1>
            <p className="text-slate-600 mt-1">{monthName}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
            <button
              onClick={() => openAddEventModal(new Date())}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
              </svg>
              Add Event
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCurrentView('month')}
            className={`px-4 py-2 rounded-lg ${
              currentView === 'month'
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => {
              setCurrentView('agenda');
              showToast('Agenda view selected', 'info');
            }}
            className={`px-4 py-2 rounded-lg ${
              currentView === 'agenda'
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Agenda
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{monthName}</h2>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">All Categories</option>
                <option value="academic">Academic</option>
                <option value="exam">Exams</option>
                <option value="event">Events</option>
                <option value="holiday">Holidays</option>
                <option value="meeting">Meetings</option>
              </select>
              <button
                onClick={() => showToast('Exporting calendar events...', 'info')}
                className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Export
              </button>
            </div>
          </div>

          {currentView === 'month' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500">
                  <tr>
                    <th className="py-2 pr-2 text-center">Sun</th>
                    <th className="py-2 pr-2 text-center">Mon</th>
                    <th className="py-2 pr-2 text-center">Tue</th>
                    <th className="py-2 pr-2 text-center">Wed</th>
                    <th className="py-2 pr-2 text-center">Thu</th>
                    <th className="py-2 pr-2 text-center">Fri</th>
                    <th className="py-2 pr-2 text-center">Sat</th>
                  </tr>
                </thead>
                <tbody className="divide-y">{renderCalendar()}</tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-3">
              {events
                .filter((e) => !categoryFilter || e.category === categoryFilter)
                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                .map((event) => (
                  <div
                    key={event.id}
                    onClick={() => openEditEventModal(event)}
                    className={`p-3 rounded-r-lg cursor-pointer hover:opacity-80 ${categoryColors[event.category]}`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-slate-600">
                      {new Date(event.start).toLocaleDateString()} • {event.location || event.desc}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <footer className="text-center text-sm text-slate-500 mt-8">© 2025 eCampus — All rights reserved.</footer>
      </div>
    </>
  );
}
