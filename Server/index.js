const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
require("dotenv").config();
const connectDB = require('./src/Config/db');
const userRoutes = require("./src/Routes/userRoutes");
const serviceRoutes = require("./src/Routes/serviceRoutes")
const serviceRequest = require('./src/Routes/serviceRequestRoutes')
const adminRoute = require("./src/Routes/adminRoute")
const providerRoute = require("./src/Routes/providerRoute")
const contactRoutes = require("./src/Routes/contactRoute");
var cors = require('cors')

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,      
  methods: ['GET', 'POST', 'PATCH', 'DELETE','PUT'],
  allowedHeaders: ['Content-Type', 'Authorization','Cookie']
}));



app.use("/api/users", userRoutes);
app.use("/api/service", serviceRoutes); 
app.use("/api/request", serviceRequest); 
app.use("/api/admin", adminRoute); 
app.use("/api/provider", providerRoute); 
app.use("/api/contact", contactRoutes);


app.get("/", (req, res) => {
  res.send("Hello, World!");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
