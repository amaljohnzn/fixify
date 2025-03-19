import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [selectedBill, setSelectedBill] = useState(null);
  const [billType, setBillType] = useState(""); // "View Bill" or "Receipt"
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/request/myRequest`, {
          withCredentials: true,
        });

        const completedBookings = data.filter((b) => b.status === "Paid");
        setBookings(
          showCompleted
            ? completedBookings
            : data.filter((b) => b.status !== "Paid")
        );
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
      console.log(`Fetching Bill for bookingId:`, bookingId); // Debug log
  
      const { data } = await axios.get(`${API_URL}/request/${bookingId}/bill`, {
        withCredentials: true,
      });
  
      console.log("Bill API Response:", data); // Debug log
  
      setSelectedBill({
        bookingId,
        providerName: data.provider || "Unknown",
        providerPhone: data.providerPhone || "N/A",
        serviceName: data.serviceName,
        labourCharge: data.labourCharge || 0,
        partsCharge: data.partsCharge || 0,
        totalAmount: data.totalAmount || 0,
        paymentStatus: data.paymentStatus || "Pending",
      });
  
      setBillType("Bill");
    } catch (error) {
      console.error("Failed to load bill:", error);
      alert("Failed to load bill. Please try again.");
    }
  };
  const handleViewReceipt = async (bookingId) => {
    try {
      console.log(`Fetching Receipt for bookingId:`, bookingId); // Debug log
  
      const { data } = await axios.get(`${API_URL}/request/${bookingId}/receipt`, {
        withCredentials: true,
      });
  
      console.log("Receipt API Response:", data); // Debug log
  
      setSelectedBill({
        bookingId: data._id,
        providerName: data.providerName || "Unknown",  // ✅ Corrected
        providerPhone: data.providerPhone || "N/A",   // ✅ Corrected
        serviceName: data.serviceName || "N/A",
        paymentDate: data.paymentDate !== "N/A" ? new Date(data.paymentDate).toLocaleDateString() : "N/A",
        totalAmount: data.totalAmount || 0,
        paymentStatus: data.paymentStatus || "Paid",
      });
      
  
      setBillType("Receipt");
    } catch (error) {
      console.error("Error fetching receipt:", error);
      alert("Failed to load receipt. Please try again.");
    }
  };
  const handleSubmitRating = async (bookingId, rating) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/request/${bookingId}/rate`,
        { rating },
        { withCredentials: true }
      );
  
      alert("Rating submitted successfully! ⭐");
      setSelectedBill(null);
      
      // Refresh bookings to show updated rating
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, rating } : b))
      );
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
    }
  };
  
  
  const handlePayNow = () => {
    if (!selectedBill) return;

    navigate("/payment", {
      state: {
        bookingId: selectedBill.bookingId,
        amount: selectedBill.totalAmount,
      },
    });

    setSelectedBill(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[350px] rounded-lg overflow-hidden shadow-md">
        <img
          src="https://res.cloudinary.com/dandjcp0x/image/upload/v1742313363/cytonn-photography-n95VMLxqM2I-unsplash_rsw8gf.jpg"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">Your Bookings</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8">
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-2xl font-bold">Booking History</h2>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showCompleted ? "View Active Bookings" : "View Completed Bookings"}
          </button>
        </div>

        {loading ? (
          <p className="text-center mt-4">Loading bookings...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-600 mt-4">No bookings found.</p>
        ) : (
          <div className="mt-4 overflow-x-auto mb-4">
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2 border">Service</th>
                  <th className="p-2 border">Provider</th>
                  <th className="p-2 border">Status</th>
                  
                  <th className="p-2 border">Rating</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border">
                    <td className="p-2 border">{booking.serviceName}</td>
                    <td className="p-2 border">{booking.provider?.name || "Not Assigned"}</td>
                    <td className="p-1 border text-center">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          statusColors[booking.status] || "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-2 border text-center">
  {booking.rating ? (
    <span className="text-yellow-500 text-lg">{'✮'.repeat(booking.rating)}</span>
  ) : booking.status === "Paid" ? (
    <div className="flex justify-center space-x-1">
      {[1, 2, 3, 4, 5].map((num) => (
        <span
          key={num}
          className="cursor-pointer text-gray-400 hover:text-yellow-500 text-lg"
          onClick={() => handleSubmitRating(booking._id, num)}
        >
          ★
        </span>
      ))}
    </div>
  ) : (
    <span className="text-gray-400">Not Rated</span>
  )}
</td>

                    <td className="p-2 border text-center">
                      {booking.status === "Completed" && (
                        <button
                          onClick={() => handleViewBill(booking._id, "View Bill")}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          View Bill
                        </button>
                      )}
                      {booking.status === "Paid" && (
                        <button
                          onClick={() => handleViewReceipt(booking._id, "Receipt")}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

{selectedBill && billType === "Bill" && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-bold mb-4">Bill Details</h2>
      <p><strong>Provider:</strong> {selectedBill.providerName}</p>
      <p><strong>Phone:</strong> {selectedBill.providerPhone}</p>
      <p><strong>Service:</strong> {selectedBill.serviceName}</p>
      <p><strong>Parts Charge:</strong> ₹{selectedBill.partsCharge}</p>
      <p><strong>Labour Charge:</strong> ₹{selectedBill.labourCharge}</p>
      <p className="text-lg font-semibold mt-2">Total: ₹{selectedBill.totalAmount}</p>

      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => setSelectedBill(null)}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Close
        </button>
        <button
          onClick={handlePayNow}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Pay Now
        </button>
      </div>
    </div>
  </div>
)}

{selectedBill && billType === "Receipt" && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
      <h2 className="text-lg font-bold mb-4">Payment Receipt</h2>
      <p><strong>Provider:</strong> {selectedBill?.providerName || <span className="text-gray-500">Unknown</span>}</p>
      <p><strong>Phone:</strong> {selectedBill?.providerPhone || <span className="text-gray-500">N/A</span>}</p>
      <p><strong>Service:</strong> {selectedBill?.serviceName || <span className="text-gray-500">N/A</span>}</p>
    
      <p className="text-lg font-semibold mt-2">
        Total Paid: ₹{Number(selectedBill?.totalAmount || 0).toFixed(2)}
      </p>
      <p className="text-green-600 font-bold">Payment Status: {selectedBill?.paymentStatus || "N/A"}</p>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setSelectedBill(null)}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default BookingStatusPage;
