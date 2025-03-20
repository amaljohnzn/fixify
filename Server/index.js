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
  origin: process.env.FRONTEND_URL, // Allow only your frontend
  credentials: true, // Allow cookies (important for JWT)
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));

// ✅ Handle preflight requests properly
app.options("*", cors());


app.use("/users", userRoutes);
app.use("/service", serviceRoutes); 
app.use("/request", serviceRequest); 
app.use("/admin", adminRoute); 
app.use("/provider", providerRoute); 
app.use("/contact", contactRoutes);


app.get("/", (req, res) => {
  res.send("Hello, World!");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
