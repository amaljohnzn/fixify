import React from "react";
import { Link } from "react-router-dom";
import logo from "./img/logo.png";

const Navbar = () => {
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
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-black font-medium no-underline hover:text-gray-600">Home</Link>
              <Link to="/service" className="text-black font-medium no-underline hover:text-gray-600">Services</Link>
              <Link to="/about" className="text-black font-medium no-underline hover:text-gray-600">About</Link>
              <Link to="/contact" className="text-black font-medium no-underline hover:text-gray-600">Contact</Link>
              <Link to="/signin" className="text-black font-medium no-underline hover:text-gray-600">Sign In</Link>
              <Link to="/signup" className="text-black font-medium no-underline hover:text-gray-600">Sign Up</Link>
              <Link to="/servicemgnt" className="text-black font-medium no-underline hover:text-gray-600">ServiceManage</Link>
              <Link to="/bookingStatus" className="text-black font-medium  hover:text-gray-600">BookingStatus</Link>



            </div>

            {/* Notification & Profile Section */}
            <div className="flex items-center space-x-4">
              
              {/* Notification Icon */}
              <div className="relative cursor-pointer">
                <button className="btn btn-ghost btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405C18.983 14.612 19 14.325 19 14V11c0-3.866-3.134-7-7-7S5 7.134 5 11v3c0 .325.017.612.405 1.595L4 17h5m6 0a3 3 0 01-6 0" />
                  </svg>
                  <span className="badge badge-sm bg-red-500 text-white absolute -top-1 -right-1">.</span>
                </button>
              </div>

              {/* Profile Icon with Dropdown */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-9 rounded-full">
                    <img alt="User Profile" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box shadow mt-3 w-52 p-2">
                  <li><Link to="/profile" className="text-black hover:text-gray-600">Profile</Link></li>
                  <li><Link to="/settings" className="text-black hover:text-gray-600">Settings</Link></li>
                  <li><Link to="logout" className="text-black hover:text-gray-600">Logout</Link></li>
                </ul>
              </div>
            
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
