import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URI;

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, currentPage, itemsPerPage]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let fetchedBookings = [];

      if (statusFilter === "completed & paid") {
        const completedResponse = await axios.get(
          `${API_URL}/admin/bookings?status=completed`,
          { withCredentials: true }
        );
        const paidResponse = await axios.get(
          `${API_URL}/admin/bookings?status=paid`,
          { withCredentials: true }
        );
        const completedBookings = completedResponse.data.bookings || [];
        const paidBookings = paidResponse.data.bookings || [];

        const mergedBookings = [
          ...completedBookings,
          ...paidBookings.filter(
            (paidBooking) =>
              !completedBookings.some(
                (completedBooking) => completedBooking._id === paidBooking._id
              )
          ),
        ];
        fetchedBookings = mergedBookings;
      } else {
        const { data } = await axios.get(
          `${API_URL}/admin/bookings?status=${statusFilter}`,
          { withCredentials: true }
        );
        fetchedBookings = data.bookings || [];
      }

      // ** Set Total Count Before Pagination **
      setTotalBookings(fetchedBookings.length);

      // ** Paginate the results **
      const startIdx = (currentPage - 1) * itemsPerPage;
      const paginatedBookings = fetchedBookings.slice(startIdx, startIdx + itemsPerPage);

      setBookings(paginatedBookings);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     {/* Hero Section */}
     <section className="relative h-[400px] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
        alt="Hero"
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Bookings</h1>
        </div>
      </div>
    </section>
    <div className="p-6 bg-white shadow-md rounded-lg">
        
   

        {/* Status Filter Buttons */}
        <div className="mb-4 flex gap-2 flex-wrap mt-6">
          {["all", "pending", "accepted", "completed & paid"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 border rounded-lg text-sm font-semibold transition ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-black text-white hover:bg-gray-700"
              }`}
            >
              {status
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </button>
          ))}
        </div>
  
        {/* Table for Bookings */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-4 font-bold text-base min-w-[150px]">Client</th>
                <th className="p-4 font-bold text-base min-w-[200px]">Provider</th>
                <th className="p-4 font-bold text-base min-w-[100px]">Status</th>
                <th className="p-4 font-bold text-base min-w-[150px]">Booked At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((booking, index) => {
                  const normalizedStatus = booking.status?.toLowerCase();
                  const formattedTime = new Date(booking.createdAt).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });
  
                  return (
                    <tr
                      key={booking._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } border-b last:border-none hover:bg-gray-100 transition-colors`}
                    >
                      {/* Client Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://i.pravatar.cc/40?u=${booking.client?._id || index}`}
                            alt="Client Avatar"
                            className="w-10 h-10 rounded-full border"
                          />
                          <span className="font-medium truncate">
                            {booking.client?.name || "N/A"}
                          </span>
                        </div>
                      </td>
  
                      {/* Provider Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              booking.provider?.image ||
                              "https://res.cloudinary.com/dandjcp0x/image/upload/v1741581578/66b4eb9e-a52d-4c1d-a6a9-96ddcdadba65_jkawgw.jpg"
                            }
                            alt={booking.provider?.name || "Provider"}
                            className="w-10 h-10 rounded-full border"
                          />
                          <div>
                            <span className="font-medium truncate">
                              {booking.provider?.name || "Not Assigned"}
                            </span>
                            <p className="text-sm text-gray-500 truncate">
                              {booking.provider?.phone || ""}
                            </p>
                          </div>
                        </div>
                      </td>
  
                      {/* Booking Status with Colors */}
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full capitalize text-center inline-block ${
                            normalizedStatus === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : normalizedStatus === "accepted"
                              ? "bg-blue-100 text-blue-700"
                              : normalizedStatus === "completed"
                              ? "bg-green-100 text-green-700"
                              : normalizedStatus === "paid"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {booking.status || "Unknown"}
                        </span>
                      </td>
  
                      {/* Booking Time */}
                      <td className="p-4 text-gray-700">{formattedTime}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  
        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
  
          <span className="text-sm">
            Page {currentPage} of {Math.ceil(totalBookings / itemsPerPage)}
          </span>
  
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage * itemsPerPage >= totalBookings}
            className="px-4 py-2 border rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  
  );
};

export default BookingList;
