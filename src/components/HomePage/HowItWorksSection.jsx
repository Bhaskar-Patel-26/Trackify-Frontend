import React from "react";

const steps = [
  {
    step: "1",
    title: "Create your account",
    desc: "Sign up and set up your workspace in seconds.",
  },
  {
    step: "2",
    title: "Add and organize tasks",
    desc: "Use boards or lists to structure your workflow.",
  },
  {
    step: "3",
    title: "Track and analyze",
    desc: "Monitor progress and view insights in real-time.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-gray-50" id="how-it-works">
      <h2 className="text-3xl font-bold text-center mb-12">How Trackify Works</h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 max-w-6xl mx-auto">
        {steps.map((item, idx) => (
          <div key={idx} className="text-center max-w-sm">
            <div className="text-blue-600 font-bold text-2xl mb-2">
              Step {item.step}
            </div>
            <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-gray-500 mt-8">Simple setup, powerful results.</p>
    </section>
  );
};

export default HowItWorksSection;
