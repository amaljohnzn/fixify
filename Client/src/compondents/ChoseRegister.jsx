import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./img/logo.png";
import { Link } from "react-router-dom";


const ChooseRegister = () => {
  const navigate = useNavigate();
  
  return (
   <div>
     <div 
      className="vh-100 d-flex align-items-center justify-content-center position-relative " 
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dandjcp0x/image/upload/v1741587811/WhatsApp_Image_2025-03-10_at_11.52.38_47042ed3s_cgns0e.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Background Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

      {/* Main Card */}
      <div className=" border-2 border-white  bg-gray-100 text-black p-4 rounded shadow-lg text-center relative" style={{ width: "380px" }}>
        
        {/* Logo */}
        <img 
  src={logo} 
  alt="Fixify Logo" 
  className="mb-3 mx-auto d-block" 
  style={{ width: "120px", height: "auto" }} 
/>

        <h4 className="fw-bold">Choose Your Account Type</h4>
        <p className="text-muted">Select the type of account you want to create</p>

        {/* Account Selection */}
        <div className="d-flex justify-content-center gap-3">
          <div
            className="border p-3 rounded text-center flex-fill cursor-pointer"
            onClick={() => navigate("/providerRegister")}
            style={{ cursor: "pointer" }}
          >
            <i className="fas fa-user-tie fa-2x mb-2"></i>
            <h5 className="fw-semibold">Service Provider</h5>
            <p className="text-muted">I want to offer my services</p>
          </div>
          
          <div
            className="border p-3 rounded text-center flex-fill cursor-pointer"
            onClick={() => navigate("/clientRegister")}
            style={{ cursor: "pointer" }}
          >
            <i className="fas fa-user fa-2x mb-2"></i>
            <h5 className="fw-semibold">Client</h5>
            <p className="text-muted">I want to hire services</p>
          </div>
        </div>
        <p className="py-4">
        Already have an account?{" "}
        <Link to="/signin" className="text-blue-500 underline">
          Sign In
        </Link>
      </p>

      </div>
    </div>
   </div>
  );
};

export default ChooseRegister;
