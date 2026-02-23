import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50">
      <div className="flex h-screen">
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex h-screen flex-1 flex-col">
          <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
