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
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("role", data.role);
    } catch (error) {
      alert("Profile update failed. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-10 text-lg">Loading profile...</div>;

  return (<>
  
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center " style={{ backgroundImage: "url('https://res.cloudinary.com/dandjcp0x/image/upload/v1742378809/john-schnobrich-2FPjlAyMQTA-unsplash_mgyejv.jpg')" }}>
    
      <div className="bg-[#b0c4b1] shadow-xl rounded-2xl p-8 w-full max-w-lg mt-20 mb-10 ">
        <div className="flex flex-col items-center">
          <img src="https://res.cloudinary.com/dandjcp0x/image/upload/v1742379138/profile_mhgbnh.jpg" alt="Profile" className="w-24 h-24 rounded-full mb-4 border-4 border-gray-300" />
        </div >
        <h2 className="text-3xl font-semibold text-center mb-4 ">Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-2">
          
          <div >
            <label className="block text-sm font-medium">Name</label>
            <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} className="w-full p-3 border rounded-lg  focus:ring-2 focus:ring-gray-400" />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" value={user.email} disabled className="w-full p-3 border rounded-lg  cursor-not-allowed" />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input type="text" value={user.phone} disabled className="w-full p-3 border rounded-lg  cursor-not-allowed" />
          </div>

         

          <div>
            <label className="block text-sm font-medium">Registration Date</label>
            <input type="text" value={new Date(user.registrationDate).toLocaleDateString()} disabled className="w-full p-3 border rounded-lg  cursor-not-allowed" />
          </div>
         

          {user.role === "provider" && (
            <>
              <div>
            <label className="block text-sm font-medium">Address</label>
            <input type="text" value={user.address}  disabled className="w-full p-3 border rounded-lg  cursor-not-allowed" />
          </div>
              <div>
                <label className="block text-sm font-medium">Experience (Years)</label>
                <input type="text" value={user.experience} onChange={(e) => setUser({ ...user, experience: e.target.value })} className="w-full p-3 border rounded-lg  focus:ring-2 focus:ring-gray-400" />
              </div>

              <div>
                <label className="block text-sm font-medium">Verification Status</label>
                <input type="text" value={user.verificationStatus} disabled className="w-full p-3 border rounded-lg  cursor-not-allowed" />
              </div>
            </>
          )}
          {user.role === "client" && (
<div>
<div>
            <label className="block text-sm font-medium">Address</label>
            <input type="text" value={user.address} onChange={(e) => setUser({ ...user, address: e.target.value })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400" />
          </div>
          <button type="submit" className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200">
            Update Profile
          </button>

</div>
            
         
        )}

        
        </form>
      </div>
    </div>
  </>
  
  );
};

export default ProfilePage;
