import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FixifyLogo from "./img/logo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_SERVER_URI;

export default function RegisterProvider() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/service`, { withCredentials: true })
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);

  const handleServiceSelect = (serviceName) => {
    let updatedServices = selectedServices.includes(serviceName)
      ? selectedServices.filter((s) => s !== serviceName)
      : [...selectedServices, serviceName];

    setSelectedServices(updatedServices);
    setValue("servicesOffered", updatedServices);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".service-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true); // Start loading
    setMessage("");
    setSuccess(false);

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "documents") {
        for (let i = 0; i < data[key].length; i++) {
          formData.append("documents", data[key][i]);
        }
      } else if (key === "servicesOffered") {
        formData.append(key, JSON.stringify(selectedServices));
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      const response = await axios.post(`${API_URL}/users/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success(response.data.message);
      setMessage(response.data.message);
      setSuccess(true);
      reset();
      setTimeout(() => {
        navigate("/signIn");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
      setSuccess(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
   <div >
     <main
      className="pt-10 pb-4 min-h-screen flex items-center justify-center bg-gray-50 relative text-black "
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="max-w-3xl w-full space-y-2 bg-white p-4 rounded-lg shadow-sm relative z-10">
        <div className="text-center">
          <img src={FixifyLogo} alt="Fixify Logo" className="mx-auto w-20 h-20" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Service Provider Sign Up</h2>
          <p className="mt-2 text-sm text-gray-600">Join our professional service provider network</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="flex items-center justify-center bg-green-300 text-white py-3 px-4 rounded-lg shadow-md">
            <span className="mr-2">✔</span> {message}
          </div>
        )}

        <form className="mt-8 space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input {...register("name")} className="w-full mt-1 p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input {...register("email")} type="email" className="w-full mt-1 p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input {...register("password")} type="password" className="w-full mt-1 p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input {...register("phone")} type="tel" className="w-full mt-1 p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input {...register("address")} className="w-full mt-1 p-2 border rounded" required />
            </div>

            {/* Services Offered - Dropdown */}
            <div className="md:col-span-2 relative service-dropdown">
              <label className="block text-sm font-medium text-gray-700">Services Offered</label>
              <div className="relative mt-1">
                <button
                  type="button"
                  className="w-full p-2 border rounded bg-gray-100 text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                >
                  {selectedServices.length > 0 ? selectedServices.join(", ") : "Select Services"}
                </button>
                {dropdownOpen && (
                  <div className="absolute mt-1 w-full bg-white border rounded shadow-md max-h-40 overflow-auto">
                    {services.length > 0 ? (
                      services.map((service, index) => (
                        <label key={index} className="block px-4 py-2 cursor-pointer hover:bg-gray-100">
                          <input
                            type="checkbox"
                            value={service.name}
                            checked={selectedServices.includes(service.name)}
                            onChange={() => handleServiceSelect(service.name)}
                            className="mr-2"
                          />
                          {service.name}
                        </label>
                      ))
                    ) : (
                      <p className="text-gray-500 p-2">Loading services...</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input {...register("experience")} type="number" className="w-full mt-1 p-2 border rounded" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Verification Documents</label>
              <input {...register("documents")} type="file" multiple className="w-full mt-1 p-2 border rounded" required />
            </div>

          </div>

          {/* Submit Button with Loader */}
          <span>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                 <>
                 <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full mr-2"></span>
                 Registering...
               </>

              ) : (
                "Register as Service Provider"
              )}
            </button>
          </span>
        </form>
        <p className="py-4">
        Already have an account?{" "}
        <Link to="/signin" className="text-blue-500 underline">
          Sign In
        </Link>
      </p>
      </div>
    </main>
   </div>
  );
}
