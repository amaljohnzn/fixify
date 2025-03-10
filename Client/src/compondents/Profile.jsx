import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URI;

const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "", address: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/users/profile`, { withCredentials: true });
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error.response?.data?.message || error.message);
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
    } catch (error) {
      alert("Profile update failed. Please try again.");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    try {
      await axios.put(`${API_URL}/users/profile/password`, passwordData, { withCredentials: true });
      alert("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      alert("Password update failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <br />
        <h2 className="text-3xl font-semibold tracking-wide mb-8">Profile</h2>

        {/* Profile Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-6 p-6 rounded-xl shadow-lg bg-gray-100">
          <h3 className="text-lg font-semibold">Personal Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input type="text" name="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} className="w-full p-2 border rounded bg-gray-200 focus:ring-2 focus:ring-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" name="email" value={user.email} disabled className="w-full p-2 border rounded bg-gray-300 cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input type="text" name="phone" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} className="w-full p-2 border rounded bg-gray-200 focus:ring-2 focus:ring-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium">Address</label>
              <input type="text" name="address" value={user.address} onChange={(e) => setUser({ ...user, address: e.target.value })} className="w-full p-2 border rounded bg-gray-200 focus:ring-2 focus:ring-gray-400" />
            </div>
          </div>

          <button type="submit" className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200">
            Update Profile
          </button>
        </form>

        {/* Password Update Form */}
        <form onSubmit={handleUpdatePassword} className="mt-8 space-y-6 p-6 rounded-xl shadow-lg bg-gray-100">
          <h3 className="text-lg font-semibold">Change Password</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Current Password</label>
              <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full p-2 border rounded bg-gray-200 focus:ring-2 focus:ring-gray-400" required />
            </div>

            <div>
              <label className="block text-sm font-medium">New Password</label>
              <input type="password" name="newPassword" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full p-2 border rounded bg-gray-200 focus:ring-2 focus:ring-gray-400" required />
            </div>

            <div>
              <label className="block text-sm font-medium">Confirm New Password</label>
              <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full p-2 border rounded bg-gray-200 focus:ring-2 focus:ring-gray-400" required />
            </div>
          </div>

          <button type="submit" className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
