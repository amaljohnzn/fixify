import { useState } from "react";
import axios from "axios";
import FixifyLogo from "./img/logo.png";

const API_URL = import.meta.env.VITE_SERVER_URI;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    otp: "",
  });
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requestOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users/request-otp`, formData, { withCredentials: true });
      alert("OTP sent to your email");
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "OTP request failed");
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users/verify-otp`, { email: formData.email, otp: formData.otp }, { withCredentials: true });
      alert("Account registered successfully!");
      window.location.href = "/signin";
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center " style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?construction,tools')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className=" shadow-lg rounded-lg p-8 w-full max-w-md backdrop-blur-lg">
        <div className="flex flex-col items-center mb-4">
          <img src={FixifyLogo} alt="Fixify Logo" className="w-20" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2">Sign Up</h2>
        <p className="text-gray-500 text-center mb-4">Join our community today</p>
        {step === 1 ? (
          <form onSubmit={requestOTP} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Mobile Number</label>
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your mobile number" className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create a password" className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Location</label>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Enter your location" className="w-full p-3 border rounded-lg" required />
            </div>
            <button type="submit" className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200">
              Sign Up
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOTP} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Enter OTP</label>
              <input name="otp" value={formData.otp} onChange={handleChange} placeholder="Enter OTP sent to email" className="w-full p-3 border rounded-lg" required />
            </div>
            <button type="submit" className="w-full bg-gray-600 text-white p-3 rounded-lg font-semibold hover:bg-black-700 transition duration-200">
              Verify OTP
            </button>
          </form>
        )}
        <p className="text-center mt-4">Already have an account? <a href="/signin" className="text-blue-600 hover:underline">Sign In</a></p>
      </div>
    </div>
  );
};

export default RegisterPage;