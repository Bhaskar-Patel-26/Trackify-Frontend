import React from "react";

const features = [
  {
    title: "Smart Task Tracking",
    desc: "Visualize your work with powerful task boards, statuses, and priorities — stay in control, from idea to completion.",
  },
  {
    title: "Team Collaboration",
    desc: "Invite your teammates, assign roles, and get real-time updates. Keep everyone aligned with comments and notifications.",
  },
  {
    title: "Analytics & Insights",
    desc: "Turn your productivity data into actionable insights. Track performance, completion trends, and milestones with beautiful charts.",
  },
  {
    title: "Goal Planning",
    desc: "Define goals, set milestones, and measure progress with Trackify’s integrated planning tools.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white" id="features">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose Trackify?</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold mb-3 text-blue-600">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
