import React, { useState, useEffect } from "react";

function Darkmode() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      {/* Toggle Background */}
      <div className="w-12 h-6 bg-gray peer-checked:bg-gray-800 rounded-full relative transition-all duration-300">
        {/* Sun Icon (Light Mode) */}
        <svg
          className="absolute left-1 top-1 w-4 h-4 text-yellow-500 peer-checked:hidden transition-all"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
          </g>
        </svg>

        {/* Moon Icon (Dark Mode) */}
        <svg
          className="absolute right-1 top-1 w-4 h-4 text-white hidden peer-checked:block transition-all"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          </g>
        </svg>
      </div>

      {/* Toggle Button */}
      <div className="absolute top-0.5 left-1 w-5 h-5 bg-white rounded-full peer-checked:left-6 transition-all duration-300 shadow-md"></div>
   Theme </label>
  );
}

export default Darkmode;
