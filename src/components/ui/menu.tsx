import { NavLink } from "react-router-dom";
import { Home, Search, MessageCircle, User, Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme"; 

const menuItems = [
  { name: "Home", icon: <Home size={24} />, path: "/" },
  { name: "Search", icon: <Search size={24} />, path: "/search" },
  { name: "Message", icon: <MessageCircle size={24} />, path: "/messages" },
  { name: "Profile", icon: <User size={24} />, path: "/profile" },
];

export default function Menu() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Sidebar for md+ screens */}
      <div className="hidden md:flex flex-col justify-between fixed top-0 left-0 h-full w-60 border-r bg-light-bg dark:bg-dark-bg p-4 shadow-sm transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold mb-6 text-light-primary dark:text-dark-primary transition-colors">
            MyApp
          </h1>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300
                hover:bg-light-card dark:hover:bg-dark-card
                ${
                  isActive
                    ? "bg-light-card dark:bg-dark-card font-semibold text-light-primary dark:text-dark-primary"
                    : "text-light-text dark:text-dark-text"
                }`
              }
            >
              {item.icon}
              <span className="text-base">{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-3 mt-6 rounded-lg text-light-text dark:text-dark-text hover:bg-light-card dark:hover:bg-dark-card transition-all"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          <span className="text-sm">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      {/* Bottom nav for small screens */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden flex justify-around items-center bg-light-bg dark:bg-dark-bg border-t border-light-card dark:border-dark-card py-2 z-50 transition-colors duration-300">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={item.name}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs transition-all duration-300
              ${
                isActive
                  ? "text-light-primary dark:text-dark-primary font-semibold translate-y-[-4px]"
                  : "text-light-text dark:text-dark-text"
              }`
            }
          >
            {item.icon}
          </NavLink>
        ))}

        {/* Theme toggle icon-only button */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Light Mode" : "Dark Mode"}
          className="flex flex-col items-center justify-center text-xs transition-all duration-300 text-light-text dark:text-dark-text"
        >
          {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </>
  );
}
