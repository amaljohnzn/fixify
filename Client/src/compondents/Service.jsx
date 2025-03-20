import { useEffect, useState } from "react";
import axios from "axios";
import serviceHero from "./img/servicehero.jpg"; // Hero section image
import serviceCard from "./img/serviceCard.jpg"; // Default service card image
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_SERVER_URI;

// Predefined descriptions for categories
const CATEGORY_DESCRIPTION = {
  Plumbing: "15+ years experience in residential and commercial plumbing.",
  Electrical: "15+ years experience in electrical wiring and appliance repairs.",
  Carpentry: "15+ years experience in custom woodwork and furniture repairs.",
  Painting: "15+ years experience in interior and exterior painting.",
  Cleaning: "15+ years experience in deep cleaning and sanitization.",
  Default: "15+ years experience in home and commercial maintenance.",
};

// Predefined skills for each category
const CATEGORY_SKILLS = {
  Plumbing: ["Installation", "Emergency Repairs", "Maintenance"],
  Electrical: ["Wiring", "Appliance Repair", "Installation"],
  Carpentry: ["Furniture Assembly", "Custom Woodwork", "Repairs"],
  Painting: ["Interior Painting", "Exterior Painting", "Wallpapering"],
  Cleaning: ["Deep Cleaning", "Regular Maintenance", "Sanitization"],
  Default: ["Installation", "Repairs", "Maintenance"],
};

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Services");
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 8; // Number of services per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/service`);
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // ** Filtered Services **
  const filteredServices = services.filter((service) => {
    const matchesCategory =
      category === "All Services" || service.category?.toLowerCase() === category.toLowerCase();
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ** Pagination Logic **
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  const startIndex = (currentPage - 1) * servicesPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + servicesPerPage);

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-150 flex items-center text-white"
        style={{ backgroundImage: `url(${serviceHero})` }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold">Find Trusted Services</h1>
          <p className="mt-2 text-lg">Book skilled professionals for your home and business needs.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-8xl mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Our Services </h2>
          </div>

          {/* Filters */}
          <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <option>All Services</option>
              <option>Plumbing</option>
              <option>Electrical</option>
              <option>Carpentry</option>
              <option>Painting</option>
            </select>

            <input
              type="text"
              placeholder="Search professionals..."
              className="border rounded-lg px-3 py-2 text-sm w-60"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading ? (
              <p className="text-center col-span-full">Loading services...</p>
            ) : paginatedServices.length === 0 ? (
              <p className="text-center col-span-full">No service providers found.</p>
            ) : (
              paginatedServices.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition flex flex-col justify-between"
                  style={{ minHeight: "320px" }} // Smaller card size
                >
                  {/* Profile Image */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={service.image || serviceCard}
                      alt={service.name}
                      className="w-22 h-22 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-md">{service.name}</h4>
                      <p className="text-gray-500 text-sm">{service.role}</p>
                      {/* Rating */}
                      <div className="flex items-center text-yellow-500 text-xs">
                        {"★★★★★"} <span className="ml-1 text-gray-600">(5)</span>
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <p className="text-gray-600 text-sm mb-3">
                    {CATEGORY_DESCRIPTION[service.category] || CATEGORY_DESCRIPTION["Default"]}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {([...(CATEGORY_SKILLS[service.category] || CATEGORY_SKILLS["Default"]), ...(service.skills || [])])
                      .slice(0, 3)
                      .map((skill, index) => (
                        <span key={index} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                  </div>

                  {/* Book Now Button */}
                  <div className="mt-auto">
                    <button
                      onClick={() =>
                        navigate("/booking", {
                          state: {
                            serviceId: service._id,
                            serviceName: service.name,
                            category: service.category,
                            priceRange: service.priceRange,
                          },
                        })
                      }
                      className="w-full bg-black text-white px-3 py-2 rounded-md flex justify-center items-center gap-2 text-sm hover:bg-gray-900"
                    >
                      <span>Book Now →</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 mx-2 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">{currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 mx-2 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
