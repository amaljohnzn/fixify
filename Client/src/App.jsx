
import React from "react";
//import './App.css'
import { Toaster } from "react-hot-toast";
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
import Earnings from "./compondents/Earnings";
import Payment from "./compondents/Payment";
import Providers from "./compondents/Providers"
import Revenue from "./compondents/Revenue";
import Report from "./compondents/Report";
import BookingList from "./compondents/BookingList"


function App() {
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} /> 
   <Router>
      <div className="bg-base-100 text-base-content min-h-screen">
        <Navbar className="fixed top-0 left-0 w-full z-50" />  
     <main className="pt-14">
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
          <Route path="/earnings" element={<Earnings/>} />
          <Route path="/payment" element={<Payment/>} />
          <Route path="/report" element={<Report/>} />
          <Route path="/bookingList" element={<BookingList/>} />
          <Route path="/revenue" element={<Revenue/>} />
          <Route path="/providers" element={<Providers/>} />





        </Routes>
     </main>
        
        <Footer/>
      </div>
    </Router>
    </>
    
  );
}

export default App;
