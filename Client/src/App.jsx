
import React from "react";
import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChooseRegister from "./compondents/ChoseRegister";
import ClientRegister from "./compondents/ClientRegister";
import ProviderRegister from "./compondents/ProviderRegister";
import SignIn from "./compondents/SignIn";
import Navbar from "./compondents/Navbar";
import Home from "./compondents/Home";
import Profile from "./compondents/Profile";
import Logout from "./compondents/Logout";
import Service from "./compondents/Service";
import ContactUs from "./compondents/Contact";
import About from "./compondents/About";
import ServiceManagement from "./compondents/ServiceMangment";
import Booking from "./compondents/Booking";
import BookingStatus from "./compondents/BookingStatus";
import Footer from "./compondents/Footer";
import ProviderBookings from "./compondents/ProviderBookings";
import Works from "./compondents/Works";
function App() {
  return (
    <>
    <Router>
      <div className="min-h-screen bg-gray-100">
     <Navbar/> 
        <Routes>
          <Route path="/signup" element={<ChooseRegister />} />
          <Route path="/clientRegister" element={<ClientRegister/>} />
          <Route path="/providerRegister" element={<ProviderRegister />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/service" element={<Service />} />
          <Route path="/contact" element={<ContactUs/>} />
          <Route path="/about" element={<About />} />
          <Route path="/servicemgnt" element={<ServiceManagement />} />
          <Route path="/booking" element={<Booking/>} />
          <Route path="/bookingStatus" element={<BookingStatus/>} />
          <Route path="/providerBooking" element={<ProviderBookings/>} />
          <Route path="/works" element={<Works/>} />




        </Routes>
        <Footer/>
      </div>
    </Router>
    </>
    
  );
}

export default App;
