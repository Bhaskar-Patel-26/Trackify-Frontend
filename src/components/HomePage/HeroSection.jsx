import React from "react";

const HeroSection = () => {
  return (
    <section className="text-center mt-20 py-20 bg-gradient-to-b from-gray-50 to-white">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
        Stay Organized. Stay Ahead. <br />
        <span className="text-blue-600">Track Everything That Matters.</span>
      </h1>
      <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
        Trackify helps teams and individuals plan, track, and achieve their goals
        effortlessly — from daily tasks to long-term projects — all in one smart
        dashboard.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <a
          href="/register"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        No credit card required • Free forever for individuals
      </p>
    </section>
  );
};

export default HeroSection;
