import { useState } from "react";
import axios from "axios";
import contactimg from "./img/contact.jpg"; 

const API_URL = import.meta.env.VITE_SERVER_URI;

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/contact`, formData);
      setSuccess("Your message has been sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
      window.alert("Message sent successfully!");

    } catch (error) {
      setSuccess("Failed to send message. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <main className="pt-14">
       <section className="relative h-[500px] bg--900">
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/dandjcp0x/image/upload/v1741665499/anthony-indraus-Bb9jWuTMPUk-unsplash_xitcxx.jpg" 
            className="w-full h-full object-cover"
            alt="Hero Image"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold  mb-6">
              Quality Home Services You Can Trust
            </h1>
            
          <p> We’re available 24/7 to ensure you get the best experience. Let’s connect!</p>
          </div>
        </div>
      </section>
      <section className="pt-8 pb-16 bg--50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Left - Contact Form */}
            <div className=" p-8 rounded-lg shadow-sm h-full flex flex-col">
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              
              {success && <p className="mb-4 text-green-600">{success}</p>}
              
              <form className="space-y-6 flex-grow" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom focus:border-custom"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block -700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom focus:border-custom"
                    placeholder="Your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom focus:border-custom"
                    placeholder="Your phone number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom focus:border-custom h-32"
                    placeholder="Your message"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full  shadow-xl  py-3 rounded-lg font-medium hover:bg-custom/90"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Right - Contact Info & Business Hours */}
            <div className="flex flex-col h-full">
              {/* Image */}
              <div className="h-64 mb-4">
                <img
                  src={contactimg}
                  alt="Contact Us"
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                />
              </div>

              {/* Contact Information */}
              <div className=" p-6 rounded-xl shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-custom mr-2"></i>
                    <p className="text-600">Kochin Business Street, Kochi, Kerala</p>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-phone text-custom mr-2"></i>
                    <p className="text-600">+91 9182736450</p>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-custom mr-2"></i>
                    <p className="text-600">contact@fixify.com</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className=" p-6 rounded-xl shadow-xl mt-4 flex-grow">
                <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-600">Monday - Friday</span>
                    <span className="text-800">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-600">Saturday</span>
                    <span className="text-800">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-600">Sunday</span>
                    <span className="text-800">Closed</span>
                  </div>
                </div>
              </div>

              {/* Send Message Button - Right Side */}
             
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactUs;
