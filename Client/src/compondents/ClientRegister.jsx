import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import background from "./img/signup.png";
import logo from "./img/logo.png";

const API_URL = import.meta.env.VITE_SERVER_URI;

const Register = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    console.log("Submitting form data:", formData);
    console.log("API URL:", API_URL);

    try {
      const res = await axios.post(`${API_URL}/users/register/client`, formData);
      setMessage(res.data.message);
      
      // Redirect user to login or home page after successful registration
      setTimeout(() => {
        navigate("/signIn"); // Change "/login" to the appropriate route
      }, 2000); // Delay for user to see the success message

    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
    <br /><br />
    <div

style={{
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundImage: `url(${background})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
}}
>
<div
  style={{
    width: "400px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  }}
>
  {/* Logo */}
  <img
    src={logo}
    alt="Fixify Logo"
    style={{ width: "80px", marginBottom: "10px" }}
  />
  <h3 style={{ color: "black", marginBottom: "10px" }}>Sign Up</h3>
  <p style={{ color: "gray", marginBottom: "20px" }}>Join our community today</p>

  {message && <div className="alert alert-success">{message}</div>}
  {error && <div className="alert alert-danger">{error}</div>}

  <form onSubmit={handleSubmit}>
    <div className="mb-3">
      <label className="form-label" style={{ color: "black", textAlign: "left", display: "block" }}>Full Name</label>
      <input type="text" name="name" className="form-control" placeholder="Enter your full name" onChange={handleChange} required />
    </div>
    <div className="mb-3">
      <label className="form-label" style={{ color: "black", textAlign: "left", display: "block" }}>Mobile Number</label>
      <input type="text" name="phone" className="form-control" placeholder="Enter your mobile number" onChange={handleChange} required />
    </div>
    <div className="mb-3">
      <label className="form-label" style={{ color: "black", textAlign: "left", display: "block" }}>Email</label>
      <input type="email" name="email" className="form-control" placeholder="Enter your email" onChange={handleChange} required />
    </div>
    <div className="mb-3">
      <label className="form-label" style={{ color: "black", textAlign: "left", display: "block" }}>Password</label>
      <input type="password" name="password" className="form-control" placeholder="Create a password" onChange={handleChange} required />
    </div>
    <div className="mb-3">
      <label className="form-label" style={{ color: "black", textAlign: "left", display: "block" }}>Location</label>
      <input type="text" name="address" className="form-control" placeholder="Enter your location" onChange={handleChange} required />
    </div>
    <button type="submit" className="btn btn-dark w-100" style={{ padding: "10px", fontWeight: "bold" }}>Sign Up</button>
  </form>
</div>
</div>
    </>
    
  );
};

export default Register;
