import React from "react";

const FooterSection = () => {
  return (
    <footer className="py-8 bg-gray-900 text-gray-400 text-center">
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {["About", "Features", "Pricing", "Privacy Policy", "Contact"].map(
          (item) => (
            <a
              key={item}
              href={`/${item.toLowerCase().replace(" ", "-")}`}
              className="hover:text-white transition"
            >
              {item}
            </a>
          )
        )}
      </div>
      <p className="text-sm">© 2025 Trackify. All rights reserved.</p>
    </footer>
  );
};

export default FooterSection;
