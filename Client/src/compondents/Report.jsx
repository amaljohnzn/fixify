import { useEffect, useState } from "react";
import axios from "axios";

const Report = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URI}/admin/report`, {
          withCredentials: true,
        });
        console.log("Fetched Report Data:", data); // Debugging
        setReport(data);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <p className="text-center text-gray-500 text-lg font-medium animate-pulse">Loading...</p>;
  if (error) return <p className="text-center text-red-600 text-lg font-medium">{error}</p>;

  return (
    <>
     {/* Hero Section */}
     <section className="relative h-[500px] overflow-hidden ">
      <img
        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1920&amp;q=80"

          
        alt="Hero"
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Report & Analiysis</h1>
        </div>
      </div>
    </section>
<br />

    <div className="p-10 max-w-7xl mx-auto min-h-screen  ">
      
      <h1 className="text-4xl font-bold  text-center mb-12 tracking-tight">
        Admin Report Dashboard
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {[
          { label: "Total Users", value: report.totalUsers },
          { label: "Total Providers", value: report.totalProviders },
          { label: "Total Services", value: report.totalServices },
          { label: "Total Revenue", value: `₹${report.totalRevenue.toFixed(2)}` },
          { label: "Total Commission", value: `₹${report.totalCommission.toFixed(2)}` },
          { label: "New Users This Month", value: report.newUsersThisMonth },
        ].map((item, index) => (
          <div
            key={index}
            className="p-6  rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <h2 className="text-sm font-semibold  uppercase tracking-wider">{item.label}</h2>
            <p className="text-3xl font-extrabold  mt-3">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Top Providers Table */}
      <h2 className="text-2xl font-bold  mb-6 tracking-tight">Top Providers</h2>
      <div className=" rounded-2xl shadow-lg border border-gray-100 p-6 mb-12 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm font-semibold uppercase tracking-wider">
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Total Earnings</th>
            </tr>
          </thead>
          <tbody>
            {report.topProviders.map((provider) => (
              <tr
                key={provider._id}
                className="border-t border-gray-100  transition-colors duration-150"
              >
                <td className="py-4 px-6 ">{provider.name}</td>
                <td className="py-4 px-6  font-medium">₹{provider.totalEarnings.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Services */}
      <h2 className="text-2xl font-bold  mb-6 tracking-tight">Most Requested Services</h2>
      <ul className="rounded-2xl shadow-lg border border-gray-100 p-6 mb-12">
        {report.topServices.map((service) => (
          <li
            key={service._id}
            className="py-4  border-b border-gray-100 last:border-none flex justify-between items-center"
          >
            <span className="font-medium">{service._id}</span>
            <span className="text-sm font-semibold   px-3 py-1 rounded-full">
              {service.count} requests
            </span>
          </li>
        ))}
      </ul>
      <br /> <br />

    
  

      {/* Overall Rating */}
      <h2 className="text-2xl font-bold  mb-6 tracking-tight ">Average Provider Rating</h2>
      <p className="text-4xl font-extrabold  mb-12 flex items-center justify-center">
        <span className="text-yellow-500 mr-2">⭐</span> {report.avgRating}
      </p>
<br /><br />
      {/* Provider Ratings Table */}
      {report.providerRatings && report.providerRatings.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Provider Ratings</h2>
          <div className=" rounded-2xl shadow-lg border border-gray-100 p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="  bg-gray-300 text-black text-sm font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Average Rating</th>
                </tr>
              </thead>
              <tbody>
                {report.providerRatings.map((provider) => (
                  <tr
                    key={provider._id}
                    className="border-t border-gray-100  transition-colors duration-150"
                  >
                    <td className="py-4 px-6 ">{provider.name}</td>
                    <td className="py-4 px-6  font-medium">
                      <span className="text-yellow-500 mr-1">⭐</span> {provider.avgRating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
    </>
  
  );
};

export default Report;