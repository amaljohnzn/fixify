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
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/admin/providers`, { withCredentials: true });
        console.log("Fetched providers:", data);
        setProviders(data);
      } catch (error) {
        console.error("Fetch Error:", error);
        setError("Failed to fetch providers.");
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  // ✅ Fix: Updated handleVerification to update state correctly
  const handleVerification = async (providerId, status) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/verify-provider`,
        { providerId, status },
        { withCredentials: true }
      );

      console.log("API Response:", response.data); // ✅ Debugging API Response

      // ✅ Ensure state updates correctly
      setProviders((prev) =>
        prev.map((provider) =>
          provider._id === providerId ? { ...provider, verificationStatus: status } : provider
        )
      );
    } catch (error) {
      console.error("Verification Error:", error);
      alert("Failed to update provider status.");
    }
  };

  // ✅ Sort: Pending providers appear first
  const filteredProviders = providers
    .filter((provider) => (filter === "All" ? true : provider.verificationStatus === filter))
    .sort((a, b) => (a.verificationStatus === "Pending"  ? -1 : 1));

  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = filteredProviders.slice(indexOfFirstProvider, indexOfLastProvider);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Hero"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">Provider Verification & View</h1>
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
                  <th className="p-2">Documents</th>
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
                    
                    {/* Clickable Image */}
                    <td className="p-2">
                      {Array.isArray(provider.documents) && provider.documents.length > 0 ? (
                        <ul>
                          {provider.documents.map((doc, index) => (
                            doc?.url ? (
                              <li key={index} className="mb-2">
                                <img
                                  src={doc.url}
                                  alt={`Document ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                                  onClick={() => setSelectedImage(doc.url)}
                                  onError={(e) => (e.target.style.display = "none")}
                                />
                              </li>
                            ) : (
                              <li key={index}>Invalid Document</li>
                            )
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No Documents</p>
                      )}
                    </td>

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

            {/* Pagination */}
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

      {/* Image Popup Modal */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-4 bg-white rounded-lg shadow-lg">
            <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 text-xl text-gray-700 hover:text-black">❌</button>
            <img src={selectedImage} alt="Preview" className="max-w-full max-h-[80vh] pointer-events-auto" />
          </div>
        </div>
      )}
    </>
  );
};

export default Providers;
