import React, { useState } from "react";
import Navbar from "../components/Dashboard/Navbar";
import Sidebar from "../components/Dashboard/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#18171D] text-gray-200">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#1F1E25]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
