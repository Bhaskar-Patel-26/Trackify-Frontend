import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
            Trackify
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <a href="#features" className="hover:text-blue-600 transition">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-blue-600 transition">
            How It Works
          </a>
          <a href="#pricing" className="hover:text-blue-600 transition">
            Pricing
          </a>
          <a href="#contact" className="hover:text-blue-600 transition">
            Contact
          </a>
        </div>

        {/* Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Logout
              </button>
              <Link
                to="/projects"
                className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="flex flex-col items-center py-4 space-y-4 text-gray-700 font-medium">
            <a href="#features" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">Features</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">How It Works</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">Pricing</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="hover:text-blue-600">Contact</a>
            <div className="flex flex-col gap-3 w-full px-6">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="border border-blue-600 text-blue-600 rounded-xl py-2 text-center hover:bg-blue-50 transition"
                  >
                    Logout
                  </button>
                  <Link
                    to="/projects"
                    onClick={() => setMenuOpen(false)}
                    className="bg-blue-600 text-white rounded-xl py-2 text-center hover:bg-blue-700 transition"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="border border-blue-600 text-blue-600 rounded-xl py-2 text-center hover:bg-blue-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="bg-blue-600 text-white rounded-xl py-2 text-center hover:bg-blue-700 transition"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
