import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_SERVER_URI;

const Works = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [charges, setCharges] = useState({});
  const [showReceipt, setShowReceipt] = useState(null);

  axios.defaults.withCredentials = true;

  // Fetch Accepted & Completed Requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const [acceptedData, completedData] = await Promise.all([
          axios.get(`${API_URL}/request/accepted`),
          axios.get(`${API_URL}/request/completed`),
        ]);

        setAcceptedRequests(acceptedData.data || []);
        setCompletedRequests(completedData.data || []);
      } catch (error) {
        toast.error("Failed to fetch requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle charge input change
  const handleChargeChange = (id, field, value) => {
    setCharges((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Complete request and move to completed list
  const completeRequest = async (id) => {
    const { labourCharge = 0, partsCharge = 0 } = charges[id] || {};

    if (labourCharge < 0 || partsCharge < 0) {
      toast.error("Charges cannot be negative.");
      return;
    }

    if (!window.confirm("Are you sure you want to complete this request?"))
      return;

    try {
      setCompleting(true);
      await axios.put(`${API_URL}/request/${id}/complete`, {
        labourCharge: Number(labourCharge),
        partsCharge: Number(partsCharge),
      });

      // Find and move the request
      const completedReq = acceptedRequests.find((req) => req._id === id);
      if (completedReq) {
        completedReq.labourCharge = labourCharge;
        completedReq.partsCharge = partsCharge;
        completedReq.totalAmount = labourCharge + partsCharge;
        completedReq.status = "Completed";
        completedReq.paymentStatus = "Pending";

        setAcceptedRequests((prev) => prev.filter((req) => req._id !== id));
        setCompletedRequests((prev) => [completedReq, ...prev]);
      }

      toast.success("Service request completed successfully.");
    } catch (error) {
      toast.error("Failed to complete request.");
    } finally {
      setCompleting(false);
    }
  };

  return (
   <div className="pt-14">
     
      <section className="relative h-[500px] overflow-hidden">
        <img
          src="https://res.cloudinary.com/dandjcp0x/image/upload/v1742313363/nico-smit-HjFUevA2g1k-unsplash_qebyc7.jpg"
          alt="Hero"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-7xl font-bold mb-6">my onGoing Works</h1>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto p-8  shadow-md rounded-lg">
        {/* Accepted Requests */}
        <h2 className="text-2xl font-semibold mb-4">Accepted Requests</h2>
        {loading ? (
          <p>Loading...</p>
        ) : acceptedRequests.length === 0 ? (
          <p >No accepted requests at the moment.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left  text-black">
                <th className="border p-2">Name</th>

                <th className="border p-2">Location</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {acceptedRequests.map((request) => (
                <tr key={request._id} className="border">
                  <td className="p-2">{request.clientName || "N/A"}</td>
                  <td className="p-2">{request.location || "N/A"}</td>
                  <td className="p-2 ">
                    {request.clientPhone || "N/A"}
                    <a
                      href={`tel:${request.clientPhone }`}
                      className="px-2 py-2 pl- bg-green-500 text-white rounded hover:bg-green-500 "
                    >
                      Call Now
                    </a>
                  </td>
                  <td className="p-2 flex gap-2">
                    <input
                      type="number"
                      placeholder="Labour Charge"
                      className="border p-1 w-24"
                      value={charges[request._id]?.labourCharge || ""}
                      onChange={(e) =>
                        handleChargeChange(
                          request._id,
                          "labourCharge",
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="number"
                      placeholder="Parts Charge"
                      className="border p-1 w-24"
                      value={charges[request._id]?.partsCharge || ""}
                      onChange={(e) =>
                        handleChargeChange(
                          request._id,
                          "partsCharge",
                          e.target.value
                        )
                      }
                    />
                    <button
                      className="bg-blue-600 text-white p-1 rounded"
                      onClick={() => completeRequest(request._id)}
                      disabled={completing}
                    >
                      {completing ? "Processing..." : "Complete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <br />
        <br />
        {/* Completed Requests */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">Completed Requests</h2>
        {loading ? (
          <p>Loading...</p>
        ) : completedRequests.length === 0 ? (
          <p className="text-gray-500">No completed requests yet.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left text-black">
                <th className="border p-2">Name</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Payment Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {completedRequests.map((request) => (
                <tr key={request._id} className="border">
                  <td className="p-2">{request.client?.name || "N/A"}</td>
                  <td className="p-2">{request.client?.phone || "N/A"}</td>
                  <td className="p-2">₹{request.totalAmount}</td>
                  <td className="p-2">{request.paymentStatus}</td>
                  <td className="p-2">
                    <button
                      className="bg-green-600 text-white p-1 rounded mr-2"
                      onClick={() => setShowReceipt(request)}
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Receipt Modal */}
        {showReceipt && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-[#778da9] p-12 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold">Receipt</h2>
              <p>
                <strong>Name:</strong> {showReceipt.client?.name}
              </p>
              <p>
                <strong>Phone:</strong> {showReceipt.client?.phone}
              </p>
              <p>
                <strong>Labour Charge:</strong> ${showReceipt.labourCharge}
              </p>
              <p>
                <strong>Parts Charge:</strong> ${showReceipt.partsCharge}
              </p>
              <p>
                <strong>Total Amount:</strong> ${showReceipt.totalAmount}
              </p>
              <p>
                <strong>Payment Status:</strong> {showReceipt.paymentStatus}
              </p>
              <button
                className="mt-4 bg-red-500 text-white p-2 rounded"
                onClick={() => setShowReceipt(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    
   </div>
  );
};

export default Works;
