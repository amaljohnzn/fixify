import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterProvider() {
  const { register, handleSubmit, reset } = useForm();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      if (key === "documents") {
        for (let i = 0; i < data[key].length; i++) {
          formData.append("documents", data[key][i]);
        }
      } else if (key === "servicesOffered") {
        formData.append(key, JSON.stringify([data[key]]));
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URI}/users/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
      reset();

      // Redirect to another page (e.g., login or dashboard)
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="pt-20 min-h-screen flex items-center justify-center bg-gray-50 relative" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="max-w-3xl w-full space-y-8 bg-white p-8 rounded-lg shadow-sm relative z-10">
        <div className="text-center">
          <span className="text-2xl font-[Pacifico] text-custom">Fixify</span>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Service Provider Sign Up</h2>
          <p className="mt-2 text-sm text-gray-600">Join our professional service provider network</p>
        </div>
        {message && <p className="text-center text-red-500">{message}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
            <div>
              <label className="block text-sm font-medium text-gray-700">Services Offered</label>
              <input {...register("servicesOffered")} className="w-full mt-1 p-2 border rounded" required />
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
          <button type="submit" className="w-full bg-black text-white py-2 rounded">Register as Service Provider</button>
        </form>
      </div>
    </main>
  );
}
