import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Revenue = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URI}/admin/earning`,
          { withCredentials: true }
        );
        setEarnings(data);
      } catch (err) {
        setError("Failed to fetch earnings");
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (


    <div >
    {/* Hero Section */}
<section className="relative h-[500px] overflow-hidden">
  <img
    src="https://res.cloudinary.com/dandjcp0x/image/upload/v1742313367/alexander-grey-8lnbXtxFGZw-unsplash_fvyfcd.jpg"
    alt="Hero"
    className="w-full h-full object-cover object-center"
  />
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Centered Heading */}
  <div className="absolute inset-0 flex items-center justify-center">
    <h1 className="text-4xl md:text-5xl font-bold text-white text-center drop-shadow-lg">
      Welcome to Fixify Revenue Section
    </h1>
  </div>
</section>
  {/*  main area  */}
  <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-xl font-bold">
            ₹{earnings.totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="p-4 border rounded-lg shadow ">
          <h2 className="text-lg font-semibold">Total Commission</h2>
          <p className="text-xl font-bold">
            ₹{earnings.totalCommission.toFixed(2)}
          </p>
        </div>
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold">Provider Earnings</h2>
          <p className="text-xl font-bold">
            ₹{(earnings.totalRevenue - earnings.totalCommission).toFixed(2)}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-4">Earnings Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={earnings.earningsBreakdown}>
          <XAxis dataKey="serviceName" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="totalAmount" fill="#4f46e5" name="Total Revenue" />
          <Bar dataKey="commission" fill="#22c55e" name="Commission" />
          <Bar
            dataKey="providerEarnings"
            fill="#ef4444"
            name="Provider Earnings"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
    </div>
  
  );
};

export default Revenue;
