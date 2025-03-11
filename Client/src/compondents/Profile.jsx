import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URI;

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    registrationDate: "",
    servicesOffered: [],
    experience: "",
    verificationStatus: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/users/profile`, { withCredentials: true });
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${API_URL}/users/profile`, user, { withCredentials: true });
      setUser(data);
      alert("Profile updated successfully!");
      // Store user details in local storage
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("role", data.role);
    } catch (error) {
      alert("Profile update failed. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-10 text-lg">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-semibold tracking-wide mb-8">Profile</h2>

        <form onSubmit={handleUpdateProfile} className="space-y-6 p-6 rounded-xl shadow-lg bg-gray-100">
          <h3 className="text-lg font-semibold">Personal Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} className="w-full p-2 border rounded bg-gray-200 focus:ring-2 focus:ring-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" value={user.email} disabled className="w-full p-2 border rounded bg-gray-300 cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input type="text" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} className="w-full p-2 border rounded bg-gray-200 focus:ring-2 focus:ring-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium">Address</label>
              <input type="text" value={user.address} onChange={(e) => setUser({ ...user, address: e.target.value })} className="w-full p-2 border rounded bg-gray-200 focus:ring-2 focus:ring-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium">Registration Date</label>
              <input type="text" value={new Date(user.registrationDate).toLocaleDateString()} disabled className="w-full p-2 border rounded bg-gray-300 cursor-not-allowed" />
            </div>

            {user.role === "provider" && (
              <>
                <h3 className="text-lg font-semibold mt-6">Service Provider Details</h3>

                <div>
                  <label className="block text-sm font-medium">Services Offered</label>
                  <input type="text" value={user.servicesOffered.join(", ")} onChange={(e) => setUser({ ...user, servicesOffered: e.target.value.split(",") })} className="w-full p-2 border rounded bg-gray-200 focus:ring-2 focus:ring-gray-400" />
                </div>

                <div>
                  <label className="block text-sm font-medium">Experience (Years)</label>
                  <input type="text" value={user.experience} onChange={(e) => setUser({ ...user, experience: e.target.value })} className="w-full p-2 border rounded bg-gray-200 focus:ring-2 focus:ring-gray-400" />
                </div>

                <div>
                  <label className="block text-sm font-medium">Verification Status</label>
                  <input type="text" value={user.verificationStatus} disabled className="w-full p-2 border rounded bg-gray-300 cursor-not-allowed" />
                </div>
              </>
            )}
          </div>

          <button type="submit" className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
