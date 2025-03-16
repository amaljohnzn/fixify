import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";

const API_URL = import.meta.env.VITE_SERVER_URI;

const statusColors = {
  Pending: "bg-yellow-200 text-yellow-800",
  Accepted: "bg-blue-200 text-blue-800",
  Completed: "bg-green-200 text-green-800",
  Paid: "bg-purple-200 text-purple-800",
};

const BookingStatusPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/request/myRequest`, {
          withCredentials: true,
        });

        // Separate completed (Paid) and active bookings
        const completedBookings = data.filter((b) => b.status === "Paid");
        setBookings(showCompleted ? completedBookings : data.filter((b) => b.status !== "Paid"));
      } catch {
        setError("Failed to load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [showCompleted]);

  const handleViewBill = async (bookingId) => {
    try {
      const { data } = await axios.get(`${API_URL}/request/${bookingId}/bill`, {
        withCredentials: true,
      });
      navigate("/payment", {
        state: { bookingId, amount: data.totalAmount },
      });
    } catch {
      alert("Failed to load bill. Please try again.");
    }
  };

  const handleRating = async (bookingId, selectedRating) => {
    try {
      await axios.post(
        `${API_URL}/request/${bookingId}/rate`,
        { rating: selectedRating },
        { withCredentials: true }
      );

      // ✅ Update rating in state after successful submission
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b._id === bookingId ? { ...b, rating: selectedRating } : b
        )
      );
      alert("Rating submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
      <button
        onClick={() => setShowCompleted(!showCompleted)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {showCompleted ? "View Active Bookings" : "View Completed Bookings"}
      </button>

      {loading ? (
        <p className="text-center">Loading bookings...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings found.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking._id} className="p-4 border rounded-lg flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {booking.provider?.image && (
                  <img
                    src={booking.provider.image}
                    alt="Provider"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{booking.serviceName}</h3>
                  <p className="text-gray-600">Provider: {booking.provider?.name || "Not Assigned"}</p>
                  {booking.provider?.phone && (
                    <a href={`tel:${booking.provider.phone}`} className="text-blue-500 underline">
                      Call Provider
                    </a>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
                {booking.status === "Completed" && (
                  <button
                    onClick={() => handleViewBill(booking._id)}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View Bill
                  </button>
                )}
                {booking.status === "Paid" && (
                  <div className="mt-2 flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`cursor-pointer ${
                          booking.rating >= star ? "text-yellow-500" : "text-gray-400"
                        } ${booking.rating ? "pointer-events-none" : ""}`} // ⛔ Prevent clicking again
                        onClick={() => !booking.rating && handleRating(booking._id, star)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingStatusPage;
