'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type Section = {
  name: string;
  capacity: number;
  alias: string;
};

type Schedule = {
  [key: string]: { start: string; end: string };
};

const teachers = [
  { id: 'EMP-001', name: 'Ayesha Khan' },
  { id: 'EMP-002', name: 'Ali Raza' },
  { id: 'EMP-003', name: 'Sara Ahmed' },
  { id: 'EMP-004', name: 'Hassan Ali' },
  { id: 'EMP-005', name: 'Bilal Ahmed' },
];

export default function CreateClassPage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    classGrade: '',
    academicYear: '2025–26',
    shift: 'Morning',
    roomNo: '',
    classCode: '',
    classTeacher: '',
    coTeacher: '',
    feePlan: '',
    allowWaitlist: false,
    enableAttendance: true,
  });

  const [sections, setSections] = useState<Section[]>([{ name: 'A', capacity: 30, alias: '' }]);
  const [subjects, setSubjects] = useState<Set<string>>(new Set());
  const [subjectInput, setSubjectInput] = useState('');
  const [schedule, setSchedule] = useState<{ [key: string]: { enabled: boolean; start: string; end: string } }>({
    Mon: { enabled: false, start: '08:00', end: '14:00' },
    Tue: { enabled: false, start: '08:00', end: '14:00' },
    Wed: { enabled: false, start: '08:00', end: '14:00' },
    Thu: { enabled: false, start: '08:00', end: '14:00' },
    Fri: { enabled: false, start: '08:00', end: '14:00' },
    Sat: { enabled: false, start: '08:00', end: '14:00' },
    Sun: { enabled: false, start: '08:00', end: '14:00' },
  });

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const showToast = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Generate class code
  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setFormData({ ...formData, classCode: code });
  };

  // Section handlers
  const addSection = () => {
    setSections([...sections, { name: '', capacity: 30, alias: '' }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: keyof Section, value: string | number) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const totalCapacity = sections.reduce((sum, sec) => sum + (sec.capacity || 0), 0);

  // Subject handlers
  const addSubject = () => {
    if (!subjectInput.trim()) return;
    const newSubjects = new Set(subjects);
    subjectInput.split(',').map(s => s.trim()).filter(Boolean).forEach(s => newSubjects.add(s));
    setSubjects(newSubjects);
    setSubjectInput('');
  };

  const removeSubject = (subject: string) => {
    const newSubjects = new Set(subjects);
    newSubjects.delete(subject);
    setSubjects(newSubjects);
  };

  // Schedule handlers
  const toggleDay = (day: string) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], enabled: !schedule[day].enabled }
    });
  };

  const updateScheduleTime = (day: string, field: 'start' | 'end', value: string) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], [field]: value }
    });
  };

  const copyMondayToAll = () => {
    if (!schedule.Mon.enabled) {
      showToast('Enable Monday and set timings first.', 'warn');
      return;
    }
    const newSchedule = { ...schedule };
    ['Tue', 'Wed', 'Thu', 'Fri'].forEach(day => {
      newSchedule[day] = { ...schedule.Mon };
    });
    setSchedule(newSchedule);
    showToast('Copied Monday timings to Tue–Fri', 'success');
  };

  // Form validation
  const validateForm = () => {
    if (!formData.classGrade) {
      showToast('Please select Grade', 'warn');
      return false;
    }
    if (!formData.classTeacher) {
      showToast('Please assign a Class Teacher', 'warn');
      return false;
    }
    if (sections.length === 0 || sections.some(s => !s.name || !s.capacity)) {
      showToast('Add at least one valid section', 'warn');
      return false;
    }
    return true;
  };

  // Form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      sections,
      totalCapacity,
      subjects: Array.from(subjects),
      schedule: Object.entries(schedule)
        .filter(([_, val]) => val.enabled)
        .reduce((acc, [day, val]) => ({ ...acc, [day]: { start: val.start, end: val.end } }), {}),
    };

    console.log('Create Class payload:', payload);
    showToast('Class saved successfully!', 'success');
    setTimeout(() => router.push('/dashboard'), 1500);
  };

  const handleReset = () => {
    setFormData({
      classGrade: '',
      academicYear: '2025–26',
      shift: 'Morning',
      roomNo: '',
      classCode: '',
      classTeacher: '',
      coTeacher: '',
      feePlan: '',
      allowWaitlist: false,
      enableAttendance: true,
    });
    setSections([{ name: 'A', capacity: 30, alias: '' }]);
    setSubjects(new Set());
    setSubjectInput('');
  };

  const selectedTeacher = teachers.find(t => t.id === formData.classTeacher);

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-[100]">
          <div className={`px-4 py-2 rounded-lg shadow text-white ${
            toast.type === 'success' ? 'bg-emerald-600' :
            toast.type === 'warn' ? 'bg-amber-600' :
            toast.type === 'error' ? 'bg-rose-600' : 'bg-slate-900'
          }`}>
            {toast.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <a href="/dashboard" className="hover:text-slate-700">Dashboard</a>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 6 6 6-6 6"/>
          </svg>
          <span className="text-slate-700">Create Class</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold">Create New Class</h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="classForm"
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              Save Class
            </button>
          </div>
        </div>

        {/* Form + Side Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Form Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold">Class Information</h3>
            </div>
            <div className="p-5">
              <form id="classForm" onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Details */}
                <section>
                  <h4 className="text-md font-medium text-slate-700 mb-4 pb-2 border-b border-slate-200">Basic Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="classGrade" className="block text-sm font-medium text-slate-700 mb-2">
                        Grade *
                      </label>
                      <select
                        id="classGrade"
                        value={formData.classGrade}
                        onChange={(e) => setFormData({ ...formData, classGrade: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        required
                      >
                        <option value="">Select Grade</option>
                        <option>PG</option><option>Nur</option><option>Prep</option>
                        <option>I</option><option>II</option><option>III</option><option>IV</option><option>V</option>
                        <option>VI</option><option>VII</option><option>VIII</option>
                        <option>IX-Sci</option><option>IX-Arts</option>
                        <option>X-Sci</option><option>X-Arts</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="academicYear" className="block text-sm font-medium text-slate-700 mb-2">
                        Academic Year *
                      </label>
                      <select
                        id="academicYear"
                        value={formData.academicYear}
                        onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      >
                        <option>2024–25</option>
                        <option>2025–26</option>
                        <option>2026–27</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="shift" className="block text-sm font-medium text-slate-700 mb-2">
                        Shift
                      </label>
                      <select
                        id="shift"
                        value={formData.shift}
                        onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      >
                        <option>Morning</option>
                        <option>Evening</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="roomNo" className="block text-sm font-medium text-slate-700 mb-2">
                          Room No.
                        </label>
                        <input
                          id="roomNo"
                          value={formData.roomNo}
                          onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                          placeholder="e.g., 204"
                        />
                      </div>
                      <div>
                        <label htmlFor="classCode" className="block text-sm font-medium text-slate-700 mb-2">
                          Class Code
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="classCode"
                            value={formData.classCode}
                            onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="Auto"
                          />
                          <button
                            type="button"
                            onClick={generateCode}
                            className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Sections */}
                <section>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-md font-medium text-slate-700">Sections</h4>
                    <button
                      type="button"
                      onClick={addSection}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"/>
                      </svg>
                      Add Section
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">
                    Add one or more sections (e.g., A, B) and set capacity per section.
                  </p>
                  <div className="space-y-3">
                    {sections.map((section, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-4">
                          <label className="block text-sm text-slate-600 mb-1">Section Name *</label>
                          <input
                            type="text"
                            value={section.name}
                            onChange={(e) => updateSection(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                            required
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <label className="block text-sm text-slate-600 mb-1">Capacity *</label>
                          <input
                            type="number"
                            min="1"
                            value={section.capacity}
                            onChange={(e) => updateSection(index, 'capacity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                            required
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <label className="block text-sm text-slate-600 mb-1">Alias (optional)</label>
                          <input
                            type="text"
                            value={section.alias}
                            onChange={(e) => updateSection(index, 'alias', e.target.value)}
                            placeholder="e.g., Seven-A"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                          />
                        </div>
                        <div className="sm:col-span-12">
                          <button
                            type="button"
                            onClick={() => removeSection(index)}
                            className="text-rose-600 hover:text-rose-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-sm text-slate-600">
                    Total Capacity: <b>{totalCapacity}</b>
                  </div>
                </section>

                {/* Assign Staff */}
                <section>
                  <h4 className="text-md font-medium text-slate-700 mb-4 pb-2 border-b border-slate-200">Assign Staff</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="classTeacher" className="block text-sm font-medium text-slate-700 mb-2">
                        Class Teacher *
                      </label>
                      <select
                        id="classTeacher"
                        value={formData.classTeacher}
                        onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        required
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="coTeacher" className="block text-sm font-medium text-slate-700 mb-2">
                        Co-Teacher (optional)
                      </label>
                      <select
                        id="coTeacher"
                        value={formData.coTeacher}
                        onChange={(e) => setFormData({ ...formData, coTeacher: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      >
                        <option value="">None</option>
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                {/* Subjects */}
                <section>
                  <h4 className="text-md font-medium text-slate-700 mb-2">Subjects</h4>
                  <p className="text-sm text-slate-500 mb-3">
                    Type a subject and press Enter or comma to add. Click on a chip to remove.
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          addSubject();
                        }
                      }}
                      className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="e.g., English, Math, Physics"
                    />
                    <button
                      type="button"
                      onClick={addSubject}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.from(subjects).map(sub => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => removeSubject(sub)}
                        className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-sm hover:bg-slate-200"
                        title="Remove"
                      >
                        {sub} ×
                      </button>
                    ))}
                  </div>
                </section>

                {/* Schedule */}
                <section>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-md font-medium text-slate-700">Weekly Schedule (optional)</h4>
                    <button
                      type="button"
                      onClick={copyMondayToAll}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      Copy Mon to all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {Object.keys(schedule).map(day => (
                      <div key={day} className="p-3 rounded-lg border border-slate-200">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={schedule[day].enabled}
                            onChange={() => toggleDay(day)}
                            className="h-4 w-4"
                          />
                          <span className="font-medium">{day}day</span>
                        </label>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <input
                            type="time"
                            value={schedule[day].start}
                            onChange={(e) => updateScheduleTime(day, 'start', e.target.value)}
                            disabled={!schedule[day].enabled}
                            className="px-2 py-1 rounded-md border border-slate-300 disabled:bg-slate-100"
                          />
                          <input
                            type="time"
                            value={schedule[day].end}
                            onChange={(e) => updateScheduleTime(day, 'end', e.target.value)}
                            disabled={!schedule[day].enabled}
                            className="px-2 py-1 rounded-md border border-slate-300 disabled:bg-slate-100"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Fees & Enrollment */}
                <section>
                  <h4 className="text-md font-medium text-slate-700 mb-4 pb-2 border-b border-slate-200">
                    Fees & Enrollment
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="feePlan" className="block text-sm font-medium text-slate-700 mb-2">
                        Fee Plan
                      </label>
                      <select
                        id="feePlan"
                        value={formData.feePlan}
                        onChange={(e) => setFormData({ ...formData, feePlan: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      >
                        <option value="">Select Fee Plan</option>
                        <option value="std">Standard Plan (Monthly)</option>
                        <option value="adv">Advanced Science Plan</option>
                        <option value="arts">Arts Stream Plan</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.allowWaitlist}
                          onChange={(e) => setFormData({ ...formData, allowWaitlist: e.target.checked })}
                          className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-slate-700">Allow waitlist</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.enableAttendance}
                          onChange={(e) => setFormData({ ...formData, enableAttendance: e.target.checked })}
                          className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-slate-700">Enable attendance</span>
                      </label>
                    </div>
                  </div>
                </section>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Save Class
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Side Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow p-5">
              <h3 className="font-semibold">Summary</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-slate-500">Grade</div>
                  <div className="text-slate-900 font-semibold">{formData.classGrade || '—'}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-slate-500">Year</div>
                  <div className="text-slate-900 font-semibold">{formData.academicYear}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-slate-500">Sections</div>
                  <div className="text-slate-900 font-semibold">{sections.length}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-slate-500">Capacity</div>
                  <div className="text-slate-900 font-semibold">{totalCapacity}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-slate-500">Class Teacher</div>
                  <div className="text-slate-900 font-semibold">{selectedTeacher?.name || '—'}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-slate-500">Subjects</div>
                  <div className="text-slate-900 font-semibold">{subjects.size}</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">Summary updates as you fill the form.</p>
            </div>

            <div className="bg-white rounded-2xl shadow p-5">
              <h3 className="font-semibold">Tips</h3>
              <ul className="mt-3 text-sm list-disc pl-5 space-y-1 text-slate-600">
                <li>Use sections to split large grades (e.g., VII-A, VII-B).</li>
                <li>Attach a fee plan now or later from Finance.</li>
                <li>Schedule is optional and can be edited after creation.</li>
              </ul>
            </div>
          </div>
        </div>

        <footer className="text-center text-sm text-slate-500 mt-8">
          © 2025 eCampus — All rights reserved.
        </footer>
      </div>
    </>
  );
}
