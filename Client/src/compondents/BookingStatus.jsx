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
  const [bill, setBill] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false); // Toggle Active/Completed
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_URL}/request/myRequest`, {
        withCredentials: true,
      });

      const activeBookings = data.filter((b) =>
        ["Pending", "Accepted", "Completed"].includes(b.status)
      );
      const completedBookings = data.filter((b) => b.status === "Paid");

      setBookings(showCompleted ? completedBookings : activeBookings);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [showCompleted]);

  const handleViewBill = async (bookingId) => {
    try {
      const { data } = await axios.get(`${API_URL}/request/${bookingId}/bill`, {
        withCredentials: true,
      });
      setBill({ ...data, bookingId });
      setShowBillModal(true);
    } catch {
      alert("Failed to load bill. Please try again.");
    }
  };

  const handlePayNow = () => {
    if (bill?.bookingId) {
      navigate("/payment", {
        state: { bookingId: bill.bookingId, amount: bill.totalAmount },
      });
    } else {
      alert("Error: Booking ID is missing. Please try again.");
    }
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
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
            {currentBookings.map((booking) => (
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
                      <a
                        href={`tel:${booking.provider.phone}`}
                        className="text-blue-500 underline"
                      >
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
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      View Bill
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(Math.ceil(bookings.length / bookingsPerPage))].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Bill Modal */}
      {showBillModal && bill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Bill Details</h3>
            <p><strong>Service:</strong> {bill.serviceName}</p>
            <p><strong>Provider:</strong> {bill.provider} ({bill.providerPhone})</p>
            <p><strong>Labour Charge:</strong> ₹{bill.labourCharge}</p>
            <p><strong>Parts Charge:</strong> ₹{bill.partsCharge}</p>
            <p><strong>Total Amount:</strong> ₹{bill.totalAmount}</p>
            <p><strong>Payment Status:</strong> {bill.paymentStatus}</p>
            <div className="mt-4 flex justify-between">
              {bill.paymentStatus.toLowerCase() !== "paid" && (
                <button onClick={handlePayNow} className="px-4 py-2 bg-green-500 text-white rounded">
                  Pay Now
                </button>
              )}
              <button onClick={() => setShowBillModal(false)} className="px-4 py-2 bg-red-500 text-white rounded">
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
