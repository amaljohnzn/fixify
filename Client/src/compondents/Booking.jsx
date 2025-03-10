import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URI || "http://localhost:4006/api"; // Fallback API

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract service details from state
  const { serviceName, category, priceRange } = location.state || {};

  const [phone, setPhone] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceName || !userLocation || !phone) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/request`, // Backend endpoint
        { serviceName, location: userLocation, phone },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // ✅ Include credentials (cookies/session)
        }
      );

      alert("Booking Successful!");
      navigate("/"); // Redirect to home after booking
    } catch (error) {
      console.error("Booking Failed:", error.response?.data?.message || error.message);
      alert("Failed to book service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    
    <>
    <br />
    <div className="max-w-lg mx-auto p-28 bg-white rounded-lg shadow mt-20">
      <h2 className="text-2xl font-bold mb-2">Service : {serviceName}</h2>
      <p className="text-gray-600">Category: {category || "General Service"}</p>
      
      <p className="text-gray-600 font-semibold">Price Range: {priceRange || "Not specified"}</p>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input
          type="text"
          placeholder="Enter Location"
          value={userLocation}
          onChange={(e) => setUserLocation(e.target.value)}
          className="w-full border rounded p-2 mb-4"
          required
        />
        <input
          type="tel"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded p-2 mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
    </>
  );
};

export default BookingPage;
