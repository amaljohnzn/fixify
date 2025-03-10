import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 text-center text-sm">
      {/* Social Media Icons */}
      <div className="flex justify-center space-x-4 mb-2">
        <a href="#" className="text-gray-400 hover:text-white text-lg">
          <i className="fab fa-facebook"></i>
        </a>
        <a href="#" className="text-gray-400 hover:text-white text-lg">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" className="text-gray-400 hover:text-white text-lg">
          <i className="fab fa-instagram"></i>
        </a>
      </div>

      {/* Copyright */}
      <p>© 2024 Fixify. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
