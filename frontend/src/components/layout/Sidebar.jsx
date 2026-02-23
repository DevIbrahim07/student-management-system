import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/config/navigation";
import { useAuthStore } from "@/store/authStore";
import { X } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform border-r border-border bg-linear-to-b from-emerald-50 to-white p-4 shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 hover:bg-emerald-100 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-8 mt-2">
          <h2 className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-lg font-bold text-transparent">
            Student Management
          </h2>
          <p className="mt-1 text-xs text-emerald-600">
            {user?.role?.toUpperCase()} Portal
          </p>
        </div>

        <nav className="space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                }`
              }
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
