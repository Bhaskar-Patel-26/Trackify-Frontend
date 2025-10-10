import { Bell, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center px-6 py-3 border-b border-[#2A2A31] bg-[#18171D] shadow-sm">
      <div className="text-xl font-semibold text-white">
        Dashboard
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-5">
        {/* Notification Bell */}
        <button className="relative hover:opacity-80 transition">
          <Bell className="w-5 h-5 text-gray-300" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
            1
          </span>
        </button>

        {/* User Info */}
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-gray-300" />
          <span className="text-gray-200 font-medium">
            {user?.name || "User"}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center space-x-1 text-gray-300 hover:text-red-500 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
