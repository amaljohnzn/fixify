import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "./img/logo.png";
import Darkmode from "./Darkmode";

const Navbar = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    console.log("Stored Role:", storedRole); // Debugging: check role in console
    setRole(storedRole);
  }, []);

  return (
    <header className="bg-white shadow-sm fixed w-full z-50">
      <nav className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo on the left */}
          <div className="flex items-center">
            <Link to="/">
              <img src={logo} alt="Fixify Logo" className="h-10" />
            </Link>
          </div>

          {/* Navigation Links & Icons on the right */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="hidden md:flex space-S-1">
              <Link to="/" className="btn btn-ghost normal-case">
                Home
              </Link>

              <Link to="/about" className="btn btn-ghost normal-case">
                About
              </Link>
              <Link to="/contact" className="btn btn-ghost normal-case">
                Contact
              </Link>

              {!role && (
                <>
                  <Link to="/signin" className="btn btn-ghost normal-case">
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn btn-ghost normal-case">
                    Sign Up
                  </Link>
                </>
              )}

              {/* Role-based navigation */}
              {role === "admin" && (
                <>
                  <Link to="/providers" className="btn btn-ghost normal-case">
                    Providers
                  </Link>
                  <Link to="/report" className="btn btn-ghost normal-case">
                    Report
                  </Link>
                  <Link to="/revenue" className="btn btn-ghost normal-case">
                    Revenue
                  </Link>
                  <Link to="/bookingList" className="btn btn-ghost normal-case">
                    Booking List
                  </Link>
                  <Link to="/servicemgnt" className="btn btn-ghost normal-case">
                    Service Manage
                  </Link>
                </>
              )}

              {role === "provider" && (
                <>
                  
                  <Link
                    to="/providerBooking"
                    className="btn btn-ghost normal-case"
                  >
                    Provider Booking
                  </Link>
                  <Link to="/works" className="btn btn-ghost normal-case">
                    Works
                  </Link>
                  <Link to="/earnings" className="btn btn-ghost normal-case">
                    Earnings
                  </Link>
                </>
              )}

              {role === "client" && (
                <>
                  <Link to="/bookingStatus"
                    className="btn btn-ghost normal-case" >
                    Booking Status
                  </Link>
                  <Link to="/service" className="btn btn-ghost normal-case">
                    Services
                  </Link>
                </>
              )}
            </div>

            {/* Notification & Profile Section */}
            {role && (
              <div className="flex items-center space-x-4">
               

                {/* Profile Icon with Dropdown */}
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-9 rounded-full">
                      <img
                        alt="User Profile"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-white rounded-box shadow mt-3 w-52 p-2"
                  >
                    <li>
                      <Link to="/profile" className="btn btn-ghost normal-case">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="btn btn-ghost normal-case"
                      >
                        Settings
                      </Link>
                    </li>

                    <li>
                      <Link to="logout" className="btn btn-ghost normal-case">
                        Logout
                      </Link>
                    </li>

                    <Darkmode />
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
