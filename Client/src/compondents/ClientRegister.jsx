import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import background from "./img/signup.png";
import logo from "./img/logo.png";

const API_URL = import.meta.env.VITE_SERVER_URI;

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    console.log("Submitting form data:", formData);
    console.log("API URL:", API_URL);

    try {
      const res = await axios.post(`${API_URL}/users/register/client`, formData);
      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/signIn");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
    
      className="flex justify-center items-center min-h-screen bg-cover bg-center mt-8"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="w-96 bg-white p-4 rounded-lg shadow-lg text-center">
        {/* Logo */}
        <img src={logo} alt="Fixify Logo" className="w-20 mb-1 mx-auto" />

        <h3 className="text-black mb-1 text-xl font-semibold">Sign Up</h3>
        <p className="text-gray-600 mb-3">Join our community today</p>

        {message && <div className="bg-green-100 text-green-800 p-2 rounded mb-1">{message}</div>}
        {error && <div className="bg-red-100 text-red-800 p-1 rounded mb-1">{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { label: "Full Name", name: "name", type: "text", placeholder: "Enter your full name" },
            { label: "Mobile Number", name: "phone", type: "text", placeholder: "Enter your mobile number" },
            { label: "Email", name: "email", type: "email", placeholder: "Enter your email" },
            { label: "Password", name: "password", type: "password", placeholder: "Create a password" },
            { label: "Location", name: "address", type: "text", placeholder: "Enter your location" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name} className="mb-3 text-left">
              <label className="block text-black font-medium mb-1">{label}</label>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
          <button type="submit" className="w-full bg-black text-white py-2 font-bold rounded hover:bg-gray-800 transition">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
