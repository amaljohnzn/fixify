import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_SERVER_URI;

const Works = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);
    const [charges, setCharges] = useState({});

    // Axios global settings to send credentials
    axios.defaults.withCredentials = true;

    // Fetch accepted requests
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/request/accepted`, {
                    withCredentials: true, // Ensures cookies/tokens are sent
                });
                console.log("Fetched Requests:", data); 
                setRequests(data);
            } catch (error) {
                toast.error("Failed to fetch requests.");
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    // Handle input change for charges
    const handleChargeChange = (id, field, value) => {
        setCharges((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
    };

    // Mark request as completed
    const completeRequest = async (id) => {
        const { labourCharge = 0, partsCharge = 0 } = charges[id] || {};

        if (labourCharge < 0 || partsCharge < 0) {
            toast.error("Charges cannot be negative.");
            return;
        }

        const confirmComplete = window.confirm("Are you sure you want to complete this request?");
        if (!confirmComplete) return;

        try {
            setCompleting(true);
            await axios.put(
                `${API_URL}/request/${id}/complete`,
                { labourCharge: Number(labourCharge), partsCharge: Number(partsCharge) },
                { withCredentials: true }
            );

            setRequests((prev) => prev.filter((req) => req._id !== id));
            toast.success("Service request completed successfully.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to complete request.");
        } finally {
            setCompleting(false);
        }
    };

    return (
        <>
        <br />
        <br />
        <br />
        

        <div className="max-w-4xl mx-auto p-16 bg-white shadow-md rounded-lg ">
            <h2 className="text-2xl font-semibold mb-4">Accepted Requests</h2>

            {loading ? (
                <p>Loading requests...</p>
            ) : requests.length === 0 ? (
                <p>No accepted requests.</p>
            ) : (
                requests.map((request) => (
                    <div key={request._id} className="border rounded-lg p-4 mb-4 shadow-sm">
                        <h3 className="font-semibold">{request.serviceName}</h3>
                        <p><strong>Client:</strong> {request.clientName || "N/A"}</p>
                        <p><strong>Location:</strong> {request.location}</p>
                        <p><strong>Status:</strong> {request.status}</p>

                        {/* Display Phone Number and Call Option */}
                        {request.clientPhone && (
                            <div className="mt-2 flex items-center gap-2">
                                <p><strong>Phone:</strong> {request.clientPhone}</p>
                                <a 
                                    href={`tel:${request.clientPhone}`} 
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Call Now
                                </a>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-3">
                            <input
                                type="number"
                                placeholder="Labour Charge"
                                className="p-2 border rounded w-32"
                                value={charges[request._id]?.labourCharge || ""}
                                onChange={(e) => handleChargeChange(request._id, "labourCharge", e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Parts Charge"
                                className="p-2 border rounded w-32"
                                value={charges[request._id]?.partsCharge || ""}
                                onChange={(e) => handleChargeChange(request._id, "partsCharge", e.target.value)}
                            />
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={() => completeRequest(request._id)}
                                disabled={completing}
                            >
                                {completing ? "Completing..." : "Complete"}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
        </>
        
    );
};

export default Works;
