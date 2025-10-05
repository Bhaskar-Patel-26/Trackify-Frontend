import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Register data:", formData);
    // TODO: Add registration logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18171D] px-4">
      <div className="w-full max-w-md bg-[#1F1E25] rounded-2xl shadow-lg p-8 border border-gray-800">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create Account ✨
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Join Trackify and start organizing smarter
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#18171D] text-white border border-[#3F3F46] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#18171D] text-white border border-[#3F3F46] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#18171D] text-white border border-[#3F3F46] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-[#18171D] text-white border border-[#3F3F46] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
