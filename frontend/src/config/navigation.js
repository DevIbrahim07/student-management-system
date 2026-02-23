export const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/dashboard",
    roles: ["admin", "teacher", "student"],
  },
  {
    label: "Students",
    to: "/students",
    roles: ["admin", "teacher"],
  },
  {
    label: "Subjects",
    to: "/subjects",
    roles: ["admin", "teacher", "student"],
  },
  {
    label: "Marks",
    to: "/marks",
    roles: ["admin", "teacher", "student"],
  },
  {
    label: "Attendance",
    to: "/attendance",
    roles: ["admin", "teacher", "student"],
  },
  {
    label: "Analytics",
    to: "/analytics",
    roles: ["admin", "teacher"],
  },
];
