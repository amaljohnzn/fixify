import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion
import FixifyLogo from "./img/logo.png"

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_SERVER_URI;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/users/login`, 
        { email, password },
        { withCredentials: true }
      );

      console.log(data);
      
        navigate("/");
      
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex items-center justify-center bg-gray-50 relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dandjcp0x/image/upload/v1742378862/jeshoots-com-9n1USijYJZ4-unsplash_eg3sfc.jpg')",
        }}
      ></div>
      {/* Overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/40"></div>

      {/* Animated Sign-In Form */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} // Start hidden and below
        animate={{ opacity: 1, y: 0 }} // Fade in and move up
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-10"
      >
        <div className="text-center">
          <span className="text-2xl font-[Pacifico] text-black"> <img src={FixifyLogo} alt="Fixify Logo" className="mx-auto w-20 h-20" /></span>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">Log in to your account</p>
        </div>

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Animated Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}
