export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Dashboard", href: "/" },

  // Students
  { label: "Add Student", href: "/students/add" },
  { label: "Apply Leaves (Students)", href: "/students/apply-leaves" },
  { label: "Mark Attendance (Students)", href: "/students/mark-attendance" },

  // Staff
  { label: "Add Staff", href: "/staff/add" },
  { label: "Apply Leaves (Staff)", href: "/staff/apply-leaves" },
  { label: "Mark Attendance (Staff)", href: "/staff/mark-attendance" },

  // Classes
  { label: "Create Class", href: "/classes/create" },

  // Finance
  { label: "Fee Collection", href: "/finance/fee-collection" },
  { label: "Fee Invoices", href: "/finance/fee-invoices" },
  { label: "Pending Dues", href: "/finance/pending-dues" },

  // Income
  { label: "Add Income", href: "/income/add" },
  { label: "Income List", href: "/income/list" },

  // Academics
  { label: "Exam Schedule", href: "/academics/exam-schedule" },
  { label: "Marks Entry", href: "/academics/marks-entry" },
  { label: "Report Cards", href: "/academics/report-cards" },
  { label: "Calendar", href: "/academics/calendar" },

  // Reports
  { label: "Student Reports", href: "/reports/student" },
  { label: "Attendance Reports", href: "/reports/attendance" },

  // Settings
  { label: "Users", href: "/settings/users" },
  { label: "Roles", href: "/settings/roles" }
];