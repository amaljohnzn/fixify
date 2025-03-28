import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

    // Fetch services from the backend
   
  const handleNavigate = () => {
    navigate("/service");
  };
 
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[700px] overflow-hidden">
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

     
    {/* Why Choose Us */}
<section className="py-16 bg--100">
  <div className="container mx-auto text-center">
    <h2 className="text-3xl font-bold  mb-6">Why Choose Us</h2>
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
          <h3 className="text-lg font-semibold ">{item.name}</h3>
          <p className="text-600">{item.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold  mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {["Book Online", "Choose Service", "Get Quote", "Service Delivery"].map((step, index) => (
              <div key={step} className="text-center">
                <div className="h-12 w-12 bg-black text-white flex items-center justify-center rounded-full mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold ">{step}</h3>
                <p className="text-600">Step {index + 1} of our seamless service process.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
