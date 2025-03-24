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
    <label className="swap swap-rotate">
      {/* Toggle Switch */}
      <input type="checkbox" onChange={toggleTheme} checked={theme === "dark"} />
      
      {/* Sun Icon */}
      <svg
        className="swap-on fill-current w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
      </svg>

      {/* Moon Icon */}
      <svg
        className="swap-off fill-current w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="4"></circle>
      </svg>
    </label>
  );
}

export default Darkmode;
