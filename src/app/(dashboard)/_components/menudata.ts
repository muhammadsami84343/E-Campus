// components/menuData.ts
export type MenuLink = { type: "link"; label: string; href: string };
export type MenuGroup = { type: "group"; label: string; children: MenuNode[] };
export type MenuNode = MenuLink | MenuGroup;

// NOTE: Update hrefs to your actual Next.js routes (removed .html)
export const menu: MenuNode[] = [
  { type: "link", label: "Dashboard", href: "/" },

  {
    type: "group",
    label: "Students",
    children: [
      { type: "link", label: "Add Student", href: "/addstudent" },
      { type: "link", label: "Apply Leaves", href: "/applystudentleave" },
      { type: "link", label: "Mark Attendance", href: "/markstudentattendance" },
    ],
  },

  {
    type: "group",
    label: "Staff",
    children: [
      { type: "link", label: "Add Staff", href: "/addstaff" },
      { type: "link", label: "Apply Leaves", href: "/staffapplyleave" },
      { type: "link", label: "Mark Attendance", href: "/staffmarkattendence" },
    ],
  },

  {
    type: "group",
    label: "Classes",
    children: [{ type: "link", label: "Create Class", href: "/createclass" }],
  },

  {
    type: "group",
    label: "Finance",
    children: [
      {
        type: "group",
        label: "Fees & Dues",
        children: [
          { type: "link", label: "Fee Collection", href: "/feecollection" },
          { type: "link", label: "Fee Invoices", href: "/feeinvoices" },
          { type: "link", label: "Pending Dues", href: "/pendingdues" },
        ],
      },
      {
        type: "group",
        label: "Income",
        children: [
          { type: "link", label: "Add Income", href: "/addincome" },
          { type: "link", label: "Income List", href: "/incomelist" },
        ],
      },
    ],
  },

  {
    type: "group",
    label: "Academics",
    children: [
      {
        type: "group",
        label: "Exams",
        children: [
          { type: "link", label: "Exam Schedule", href: "/examschedule" },
          { type: "link", label: "Marks Entry", href: "/marksentry" },
          { type: "link", label: "Report Cards", href: "/reportcards" },
        ],
      },
      { type: "link", label: "Calendar", href: "/calender" },
    ],
  },

  {
    type: "group",
    label: "Reports",
    children: [
      { type: "link", label: "Student Reports", href: "/studentreports" },
      { type: "link", label: "Attendance Reports", href: "/attendancereports" },
    ],
  },

  {
    type: "group",
    label: "Settings",
    children: [
      { type: "link", label: "Users", href: "/users" },
      { type: "link", label: "Roles", href: "/roles" },
    ],
  },
];