import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

    // Fetch services from the backend
   
  const handleNavigate = () => {
    navigate("/service");
  };
  const services = [
    {
      name: "Plumbing",
      image: "https://res.cloudinary.com/dandjcp0x/image/upload/v1741586056/plumbing_dux8xj.jpg",

      description: "High-quality plumbing services for your needs.",
    },
    {
      name: "Electrical",
      image: "https://res.cloudinary.com/dandjcp0x/image/upload/v1741585910/male-electrician-works-switchboard-with-electrical-connecting-cable_g1yko2.jpg",
      description: "Expert electrical services to keep you powered.",
    },
    {
      name: "Painting",
      image: "https://res.cloudinary.com/dandjcp0x/image/upload/v1741586017/paint_lgeata.jpg",

      description: "Custom Painting solutions for your home.",
    },
  ];

  return (
    <div >
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3768914/pexels-photo-3768914.jpeg"
          alt="Hero"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">Welcome to Fixify</h1>
            <p className="text-xl mb-8">Your trusted home service partner</p>
          </div>
        </div>
      </section>

       {/* Our Services */}
       <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {/* Render Services */}
            {services.map((service) => (
              <div key={service.name} className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
                <div className="flex justify-center mb-4">
                  <img src={service.image} alt={service.name} className="h-16 w-16 object-cover rounded-full" />
                </div>
                <h3 className="text-lg font-semibold text-black">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}

            {/* "Explore More" Card */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <img 
                  src="https://res.cloudinary.com/dandjcp0x/image/upload/v1741587051/low-angle-people-working-with-drill_sezaqq.jpg" 
                  alt="More Services" 
                  className="h-16 w-16 object-cover rounded-full" 
                />
              </div>
              <h3 className="text-lg font-semibold text-black">More</h3>
              <p className="text-gray-600">Explore all professional services...</p>
              <button 
                onClick={handleNavigate}
                className="mt-4 border border-black text-black px-4 py-2 rounded"
              >
                Explore More
              </button>
            </div>
          </div>
        </div>
      </section>
    {/* Why Choose Us */}
<section className="py-16 bg--100">
  <div className="container mx-auto text-center">
    <h2 className="text-3xl font-bold text-black mb-6">Why Choose Us</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
      {[
        {
          name: "Professional Team",
          image: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg",
          description: "Highly skilled and experienced professionals.",
        },
        {
          name: "24/7 Support",
          image: "https://images.pexels.com/photos/8867439/pexels-photo-8867439.jpeg",
          description: "Always available to assist you, anytime.",
        },
        {
          name: "Affordable Pricing",
          image: "https://images.pexels.com/photos/4386371/pexels-photo-4386371.jpeg",
          description: "Best services at budget-friendly prices.",
        },
        {
          name: "Quality Work",
          image: "https://images.pexels.com/photos/6474294/pexels-photo-6474294.jpeg",
          description: "We ensure top-notch service every time.",
        }
      ].map((item) => (
        <div key={item.name} className="text-center">
          <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-full mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black">{item.name}</h3>
          <p className="text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {["Book Online", "Choose Service", "Get Quote", "Service Delivery"].map((step, index) => (
              <div key={step} className="text-center">
                <div className="h-12 w-12 bg-black text-white flex items-center justify-center rounded-full mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-black">{step}</h3>
                <p className="text-gray-600">Step {index + 1} of our seamless service process.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
