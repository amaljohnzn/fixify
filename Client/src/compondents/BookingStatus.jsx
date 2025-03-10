import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URI;

const BookingStatusPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/request/myRequest`, {
          withCredentials: true, // Ensure authenticated request
        });
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <>
<br />
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>

      {loading ? (
        <p className="text-center">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings found.</p>
      ) : (
        <div className="space-y-4">
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
      className="w-15 h-15 rounded-full object-cover border mb-4"
    />
    <p className="text-gray-600 mb-4">
      Provider: {booking.provider ? booking.provider.name : "Not Assigned"}
    </p>
  </div>
  {booking.provider && (
    <p className="text-gray-600">Phone: {booking.provider.phone}</p>
  )}
</div>

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
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default BookingStatusPage;
