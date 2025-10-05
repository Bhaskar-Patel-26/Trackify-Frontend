import React from "react";

const plans = [
  { name: "Free", desc: "For individuals and freelancers", price: "₹0/month" },
  { name: "Pro", desc: "For small teams with collaboration tools", price: "₹499/month" },
  { name: "Enterprise", desc: "For large teams needing advanced analytics", price: "Contact Us" },
];

const PricingSection = () => {
  return (
    <section className="py-20 bg-gray-50" id="pricing">
      <h2 className="text-3xl font-bold text-center mb-12">
        Simple & Transparent Pricing
      </h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className="p-8 bg-white rounded-2xl shadow-sm border hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-gray-600 mb-4">{plan.desc}</p>
            <p className="text-2xl font-bold text-blue-600 mb-6">{plan.price}</p>
            <a
              href="/register"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Get Started
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
