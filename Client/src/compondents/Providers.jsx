import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SERVER_URI;

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const providersPerPage = 7;

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/admin/providers`, { withCredentials: true });
        setProviders(data);
      } catch (error) {
        setError("Failed to fetch providers.");
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const handleVerification = async (providerId, status) => {
    try {
      await axios.put(
        `${API_BASE_URL}/admin/verify-provider`,
        { providerId, status },
        { withCredentials: true }
      );
      setProviders((prev) =>
        prev.map((provider) =>
          provider._id === providerId ? { ...provider, verificationStatus: status } : provider
        )
      );
    } catch (error) {
      alert("Failed to update provider status.");
    }
  };

  const filteredProviders = providers.filter((provider) =>
    filter === "All" ? true : provider.verificationStatus === filter
  );

  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = filteredProviders.slice(indexOfFirstProvider, indexOfLastProvider);
  
  return (
    <>
    {/* Hero Section */}
    <section className="relative h-[500px] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1920&amp;q=80"
          
        alt="Hero"
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Provider Verification & View</h1>
        </div>
      </div>
    </section>
    
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-4 flex gap-2">
        {["All", "Pending", "Approved", "Rejected"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded ${filter === status ? "bg-blue-600 text-white" : "bg-gray-300"}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>
      
      {loading ? (
        <p>Loading providers...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white p-4 rounded shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Provider Name</th>
                <th className="p-2">Contact Info</th>
                <th className="p-2">Service Type</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProviders.map((provider) => (
                <tr key={provider._id} className="border-b">
                  <td className="p-2">{provider.name}</td>
                  <td className="p-2">{provider.email} <br /> {provider.phone}</td>
                  <td className="p-2">{provider.servicesOffered?.join(", ") || "N/A"}</td>
                  <td className="p-2">{provider.verificationStatus}</td>
                  <td className="p-2">
                    {provider.verificationStatus === "Pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerification(provider._id, "Approved")}
                          className="px-3 py-1 bg-green-500 text-white rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerification(provider._id, "Rejected")}
                          className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={indexOfLastProvider >= filteredProviders.length}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
    </>
    
   
  );
};

export default Providers;
