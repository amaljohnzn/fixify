import { useEffect, useState } from "react";
import axios from "axios";

const ProviderBooking = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pastJobs, setPastJobs] = useState([]);

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

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      {/* Left Side: Pending Requests */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <div key={request._id} className="border p-3 rounded-md mb-3">
              <p><strong>Client:</strong> {request.clientName}</p>
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
          <p>No pending requests.</p>
        )}
      </div>

      {/* Right Side: Past Jobs */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Past Jobs</h2>
        {pastJobs.length > 0 ? (
          pastJobs.map((job) => (
            <div key={job._id} className="border p-3 rounded-md mb-3">
              <p><strong>Client:</strong> {job.clientName}</p>
              <p><strong>Service:</strong> {job.serviceName}</p>
              <p><strong>Status:</strong> {job.status}</p>
            </div>
          ))
        ) : (
          <p>No past jobs.</p>
        )}
      </div>
    </div>
  );
};

export default ProviderBooking;
