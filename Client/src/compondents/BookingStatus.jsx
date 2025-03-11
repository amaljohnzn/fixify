import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URI;

const BookingStatusPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bill, setBill] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_URL}/request/myRequest`, {
        withCredentials: true,
      });

      console.log("API Response:", data);

      // ✅ Filter out paid bookings (fix for case sensitivity)
      const unpaidBookings = data.filter(
        (booking) => booking.paymentStatus?.toLowerCase() !== "paid"
      );

      console.log("Filtered Unpaid Bookings:", unpaidBookings);
      setBookings(unpaidBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 🔹 Fetch bill details
  const handleViewBill = async (bookingId) => {
    try {
      const { data } = await axios.get(`${API_URL}/request/${bookingId}/bill`, {
        withCredentials: true,
      });
      setBill(data);
      setShowBillModal(true);
    } catch (err) {
      console.error("Error fetching bill:", err);
      alert("Failed to load bill. Please try again.");
    }
  };

  // 🔹 Handle Payment
  const handlePayNow = () => {
    if (bill) {
      navigate("/payment", { state: { amount: bill.totalAmount } });
    }
  };

  return (
    <>
      <br />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>

        {loading ? (
          <p className="text-center">Loading bookings...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-600">No bookings found.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="p-4 border rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{booking.serviceName}</h3>
                  <div className="flex items-center space-x-2">
                    <img
                      src={
                        booking.provider?.image ||
                        "https://res.cloudinary.com/dandjcp0x/image/upload/v1741581578/66b4eb9e-a52d-4c1d-a6a9-96ddcdadba65_jkawgw.jpg"
                      }
                      alt={booking.provider?.name || "Provider"}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <p className="text-gray-600">
                      Provider: {booking.provider ? booking.provider.name : "Not Assigned"}
                    </p>
                  </div>
                  {booking.provider && (
                    <p className="text-gray-600">Phone: {booking.provider.phone}</p>
                  )}
                </div>

                <div className="flex flex-col items-end">
                  {/* 🔹 Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : booking.status === "Accepted"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {booking.status}
                  </span>

                  {/* 🔹 View Bill Button (Only for Completed Bookings) */}
                  {booking.status === "Completed" && (
                    <button
                      onClick={() => handleViewBill(booking._id)}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View Bill
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Bill Modal */}
      {showBillModal && bill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Bill Details</h3>
            <p><strong>Service:</strong> {bill.serviceName}</p>
            <p><strong>Provider:</strong> {bill.provider} ({bill.providerPhone})</p>
            <p><strong>Labour Charge:</strong> ₹{bill.labourCharge}</p>
            <p><strong>Parts Charge:</strong> ₹{bill.partsCharge}</p>
            <p><strong>Total Amount:</strong> ₹{bill.totalAmount}</p>
            <p><strong>Payment Status:</strong> {bill.paymentStatus}</p>

            <div className="mt-4 flex justify-between">
              {/* 🔹 Pay Now Button */}
              {bill.paymentStatus.toLowerCase() !== "paid" && (
                <button
                  onClick={handlePayNow}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Pay Now
                </button>
              )}
              
              <button
                onClick={() => setShowBillModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingStatusPage;
