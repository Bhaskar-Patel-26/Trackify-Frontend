import React from "react";

const CTASection = () => {
  return (
    <section className="py-20 bg-blue-600 text-center text-white" id="contact">
      <h2 className="text-4xl font-bold mb-4">
        Start Tracking Smarter, Today.
      </h2>
      <p className="mb-8 text-lg">
        Join thousands of users who trust Trackify to keep their goals and projects on track.
      </p>
      <a
        href="/register"
        className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition"
      >
        Start for Free
      </a>
    </section>
  );
};

export default CTASection;
