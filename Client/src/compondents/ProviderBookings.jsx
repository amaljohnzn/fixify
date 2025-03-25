import { useEffect, useState } from "react";
import axios from "axios";

const ProviderBooking = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pastJobs, setPastJobs] = useState([]);
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPagePast, setCurrentPagePast] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchPendingRequests();
    fetchPastJobs();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/request/pending`,
        { withCredentials: true }
      );
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  const fetchPastJobs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/request/past-jobs`,
        { withCredentials: true }
      );
      setPastJobs(response.data);
    } catch (error) {
      console.error("Error fetching past jobs:", error);
    }
  };

  const acceptRequest = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URI}/request/${id}/accept`,
        {},
        { withCredentials: true }
      );
      fetchPendingRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Pagination Logic
  const paginate = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] rounded-lg overflow-hidden shadow-md">
        <img
          src="https://res.cloudinary.com/dandjcp0x/image/upload/v1742319419/truth-concept-composition-detective-desk_1_xvd0do.jpg"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">Manage Bookings</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Left Side: Pending Requests */}
        <div className=" p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
          {pendingRequests.length > 0 ? (
            paginate(pendingRequests, currentPagePending).map((request) => (
              <div key={request._id} className="border p-3 rounded-md mb-3">
                <p><strong>Client:</strong> {request.client?.name || "N/A"}</p>
                <p><strong>Phone:</strong> <a href={`tel:${request.client?.phone}`} className="text-blue-500">{request.client?.phone || "N/A"}</a></p>
                <p><strong>Location:</strong> {request.location || "N/A"}</p>
                <p><strong>Service:</strong> {request.serviceName}</p>
                <button
                  onClick={() => acceptRequest(request._id)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Accept
                </button>
              </div>
            ))
          ) : (
            <img src="https://res.cloudinary.com/dandjcp0x/image/upload/v1742319192/5362172_oanmdh.jpg" alt="No pending requests" className="mx-auto w-70" />
          )}
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setCurrentPagePending((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-300 rounded-md mx-1"
            >
              Prev
            </button>
            <button
              onClick={() =>
                setCurrentPagePending((prev) =>
                  prev * itemsPerPage < pendingRequests.length ? prev + 1 : prev
                )
              }
              className="px-3 py-1 bg-gray-300 rounded-md mx-1"
            >
              Next
            </button>
          </div>
        </div>

        {/* Right Side: Past Jobs */}
        <div className=" p-4 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Past Jobs</h2>
          {pastJobs.length > 0 ? (
            paginate(pastJobs, currentPagePast).map((job) => (
              <div key={job._id} className="border p-3 rounded-md mb-3">
                <p><strong>Client:</strong> {job.clientName}</p>
                <p><strong>Service:</strong> {job.serviceName}</p>
                <p><strong>Status:</strong> {job.status}</p>
                <p><strong>Amount:</strong> {job.totalAmount}</p>

              </div>
            ))
          ) : (
            <p>No past jobs.</p>
          )}
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setCurrentPagePast((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-300 rounded-md mx-1"
            >
              Prev
            </button>
            <button
              onClick={() =>
                setCurrentPagePast((prev) =>
                  prev * itemsPerPage < pastJobs.length ? prev + 1 : prev
                )
              }
              className="px-3 py-1 bg-gray-300 rounded-md mx-1"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderBooking;
