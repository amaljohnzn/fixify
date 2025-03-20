import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URI;

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axios.post(`${API_URL}/users/logout`, {}, { withCredentials: true });

        // Clear local storage and auth state
        localStorage.removeItem("role");
        if (onLogout) onLogout(); // Call parent logout function
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {

        navigate("/", { replace: true }); // Redirect after logout
        window.location.reload();
      }
    };

    logoutUser();
  }, [navigate, onLogout]);

  return <div className="flex justify-center items-center h-screen text-lg">Logging out...</div>;
};

export default Logout;
