import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Menu, LogOut } from "lucide-react";

const Topbar = ({ onMenuClick }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="flex items-center justify-between border-b border-emerald-100 bg-linear-to-r from-white to-emerald-50 px-4 py-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-emerald-100 lg:hidden"
        >
          <Menu className="h-6 w-6 text-emerald-600" />
        </button>

        <div>
          <p className="text-xs text-emerald-600 sm:text-sm">Welcome back</p>
          <h1 className="text-base font-semibold text-gray-800 sm:text-lg">
            {user?.name || "User"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden rounded-full bg-linear-to-r from-emerald-500 to-teal-500 px-3 py-1 text-xs font-medium text-white shadow-sm sm:inline-block">
          {user?.role?.toUpperCase() || "ROLE"}
        </span>
        <Button
          variant="outline"
          onClick={logout}
          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        >
          <LogOut className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
