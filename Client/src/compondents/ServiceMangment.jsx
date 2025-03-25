import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URI + "/service";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [customCategory, setCustomCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    priceRange: "",
    image: null,
  });

  const serviceCategories = [
    "Plumbing",
    "Electrical Repairs",
    "House Cleaning",
    "Furniture Assembly",
    "Painting Services",
    "AC Repair & Servicing",
    "Carpentry Work",
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_URL, { withCredentials: true });
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services", err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const finalCategory = customCategory ? customCategory : formData.category;
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "category") {
        form.append("category", finalCategory);
      } else if (formData[key]) {
        form.append(key, formData[key]);
      }
    });

    try {
      if (editMode) {
        await axios.put(`${API_URL}/update/${selectedService._id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      } else {
        await axios.post(`${API_URL}/add`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      }
      setShowForm(false);
      fetchServices();
    } catch (error) {
      console.error("Error saving service", error);
    }
    setSubmitting(false);
  };

  return (
    
    <div className=" min-h-screen pt-14">
      
    {/* Hero Section */}
    <section className="relative h-[500px] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        alt="Hero"
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Welcome to Service Management</h1>
          <p className="text-xl mb-8">Add, update, or remove services from your platform</p>
        </div>
      </div>
    </section>
      <div className="container mx-auto p-6">
        <div className="flex justify-end">
          <button
            className="bg-black text-white px-4 py-2 rounded-md shadow hover:bg-gray-800"
            onClick={() => {
              setShowForm(true);
              setEditMode(false);
              setFormData({ name: "", category: "", description: "", priceRange: "", image: null });
            }}
          >
            Add New Service
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center mt-6">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className=" mt-6 shadow-md rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-200 text-black">
                <tr>
                  <th className="p-4">Service Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.length > 0 ? (
                  services.map((service) => (
                    <tr key={service._id} className="border-t hover:bg-gray-100 ">
                      <td className="p-4 flex items-center gap-3">
                        <img src={service.image} alt={service.name} className="w-10 h-10 rounded-full" />
                        <span className="font-medium">{service.name}</span>
                      </td>
                      <td className="p-4">{service.category}</td>
                      <td className="p-4">{service.description}</td>
                      
                      <td className="p-4 font-semibold whitespace-nowrap">{service.priceRange}</td>

                        
                      <td className="p-4 flex justify-center gap-3">
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded-md shadow hover:bg-yellow-600"
                          onClick={() => {
                            setFormData({
                              name: service.name,
                              category: service.category,
                              description: service.description,
                              priceRange: service.priceRange,
                              image: null,
                            });
                            setSelectedService(service);
                            setEditMode(true);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md shadow hover:bg-red-600"
                          onClick={async () => {
                            if (!confirm("Are you sure you want to delete this service?")) return;
                            await axios.delete(`${API_URL}/delete/${service._id}`, { withCredentials: true });
                            setServices(services.filter((s) => s._id !== service._id));
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No services available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editMode ? "Edit Service" : "Add New Service"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" name="name" placeholder="Service Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border p-2 rounded" required />
              <select
  name="category"
  value={formData.category} // Ensures it retains the existing category
  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
  className="border p-2 rounded"
  required
>
  <option value="">Select Category</option>
  {serviceCategories.map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</select>

      
      
      
          <textarea name="description" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="border p-2 rounded" required />
              
              <input type="file" name="image" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} className="border p-2 rounded" />

              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
                  {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {editMode ? "Updating..." : "Adding..."}
                </button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
