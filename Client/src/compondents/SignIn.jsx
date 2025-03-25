import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FixifyLogo from "./img/logo.png";
import { Link } from "react-router-dom";

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
        `${API_BASE_URL}/users/login`, 
        { email, password },
        { withCredentials: true }
      );

      console.log("Login Response:", data);

      if (data.role) {
        // Store role in localStorage
        localStorage.setItem("role", data.role);

        // Navigate to home, let Navbar handle role-based links
        navigate("/");

        // Reload to update navbar immediately
        window.location.reload();
      } else {
        setError("Role not found. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div >
     <main className="h-screen flex items-center justify-center  relative ">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative  p-8 rounded-lg shadow-lg w-full max-w-md z-10"
      >
        <div className="text-center">
          <span className="text-2xl font-[Pacifico] text-black">
            <img src={FixifyLogo} alt="Fixify Logo" className="mx-auto w-20 h-20" />
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Sign In</h2>
          <p className="mt-2 text-sm text-600">Log in to your account</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium ">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md  shadow-sm focus:border-black focus:ring-black"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium ">Password</label>
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
        <p className="py-4">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-400 underline">
          Sign Up
        </Link>
      </p>
        
      </motion.div>
    </main>
   </div>
  );
}
