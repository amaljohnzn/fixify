import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URI; // Load from .env

const Logout = ({ setIsAuthenticated, setUser }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axios.post(`${API_URL}/users/logout`, {}, { withCredentials: true });

        // Clear authentication state
        setIsAuthenticated(false);
        setUser(null);
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        setLoading(false);
      }
    };

    logoutUser();
  }, [setIsAuthenticated, setUser]);

  // Redirect only after logout completes
  useEffect(() => {
    if (!loading) {
      navigate("/", { replace: true });
    }
  }, [loading, navigate]);

  return <div className="flex justify-center items-center h-screen text-lg">Logging out...</div>;
};

export default Logout;
