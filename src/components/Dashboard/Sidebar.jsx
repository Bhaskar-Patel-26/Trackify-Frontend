import { NavLink } from "react-router-dom";
import logo from "../../assets/logo_only_img.png";
import { FolderKanban, ListChecks } from "lucide-react";

const links = [
  { name: "Projects", icon: <FolderKanban className="w-5 h-5" />, path: "/projects"},
  { name: "Issues", icon: <ListChecks className="w-5 h-5" />, path: "/issues" },
];

const Sidebar = () => {
  return (
    <aside className="w-56 h-screen bg-[#1A1A22] border-r border-[#2A2A31] pt-2">
      <div className="flex items-center justify-start mb-10 ml-4">
        <img src={logo} alt="logo" className="w-10 h-10" />
        <span className="text-white text-2xl font-bold ml-3">Trackify</span>
      </div>
      <nav className="px-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-[#24242D] hover:text-blue-400"
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
