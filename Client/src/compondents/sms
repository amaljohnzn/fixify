import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./components/style.css"

import MyNavbar from "./components/MyNavbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Customer from "./components/Customer";
import AdminDash from "./components/AdminDashboard";
import Product from "./components/Product";
import Cart from "./components/Cart";
import Logout from "./components/Logout";
import Payment from "./components/Payment";
import ProductManagment from "./components/ProductManagment";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  
  
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("https://mkart-amaljohnzns-projects.vercel.app/Customer/profile", {
          withCredentials: true,
        });

        if (response.data?.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    fetchUser();
  }, []);

 

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  return (
    <div >
<Router>
      <MyNavbar 
        isAuthenticated={isAuthenticated} 
        user={user} 
        cartItems={cartItems} 
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated}  />} />1

        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/AdminDash" element={<AdminDash />} />

        <Route path="/product" element={<Product addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />} />
        <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/ProductManagment" element={<ProductManagment />} />


      </Routes>
    </Router>
    </div>
    
  );
}

export default App;
