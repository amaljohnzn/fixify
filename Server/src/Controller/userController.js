const User = require("../Models/userModel");
const Service =require("../Models/serviceModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
//const cloudinary = require("../Config/cloudinary"); 
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const tempUsers = {}; // Temporary storage for users awaiting OTP verification

const requestOTP = asyncHandler(async (req, res) => {

  const { name, email, phone, password, address } = req.body;  // Accept extra details

  if (!email || !name || !phone || !password || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const otp = generateOTP();
  const hashedOTP = await bcrypt.hash(otp, 10); // Securely hash the OTP

  // ✅ Store user data temporarily
  tempUsers[email] = { name, email, phone, password, address, hashedOTP };

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Fixify Registration",
      text: `Your OTP is: ${otp}`,  
    });

    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
});




const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!tempUsers[email]) {
    return res.status(400).json({ message: "No OTP request found. Please request OTP first." });
  }

  const tempUser = tempUsers[email];

  // Verify OTP
  const isMatch = await bcrypt.compare(otp, tempUser.hashedOTP);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // 🔥 Ensure password is defined before hashing
  if (!tempUser.password) {
    return res.status(400).json({ message: "No password found. Please restart the registration process." });
  }

  // Hash password before storing user
  const hashedPassword = await bcrypt.hash(tempUser.password, 10);

  // Create user in the database
  const user = await User.create({
    name: tempUser.name,
    email,
    password: hashedPassword,
    phone: tempUser.phone,
    address: tempUser.address,
    role: "client",
    isVerified: true,
  });

  // Remove tempUser from storage after verification
  delete tempUsers[email];

  res.status(201).json({ message: "Account verified and registered successfully.", user });
});



const registerProvider = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, experience } = req.body;
  let { servicesOffered } = req.body;

  // Ensure servicesOffered is an array
  if (typeof servicesOffered === "string") {
      try {
          servicesOffered = JSON.parse(servicesOffered); // Convert string to array
      } catch (error) {
          return res.status(400).json({ message: "Invalid services format" });
      }
  }

  if (!Array.isArray(servicesOffered) || servicesOffered.length === 0) {
      return res.status(400).json({ message: "Services offered must be a non-empty array" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
      return res.status(400).json({ message: "User already exists" });
  }

  // Normalize and validate services
  const normalizedServices = servicesOffered.map(service => service.trim().toLowerCase());
  const serviceRegexArray = normalizedServices.map(service => new RegExp(`^${service}$`, "i"));

  const matchedServices = await Service.find({
      name: { $in: serviceRegexArray }
  }).select("name");

  if (!matchedServices || matchedServices.length !== normalizedServices.length) {
      return res.status(400).json({ message: "Some services do not exist. Please check service names." });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Handle document uploads from Multer & Cloudinary
  let documents = [];
  if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path); // Upload to Cloudinary
          return {
              url: result.secure_url,
              public_id: result.public_id,
              fileType: result.resource_type,
          };
      });

      documents = await Promise.all(uploadPromises);
  }

  // Create provider
  const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: "provider",
      servicesOffered: matchedServices.map(service => service.name),
      experience,
      documents, // ✅ Now correctly formatted
      verificationStatus: "Pending",
  });

  if (!user) {
      return res.status(500).json({ message: "User registration failed" });
  }
  res.status(201).json({
    message: "Provider registered successfully",
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    servicesOffered: user.servicesOffered,
    documents: user.documents,
    verificationStatus: user.verificationStatus
});


});





//  Register an admin
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    verificationStatus: user.verificationStatus,
  });
});

//  Login user (Client, Provider, or Admin)
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,  
      secure: true , 
      sameSite: "None",  
      //maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

  
    res.json({
      message: "Login successful",
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//  Logout user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), 
  });

  res.status(200).json({ message: "Logged out successfully" });
});

//  Get user profile (Client, Provider, or Admin)
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    const userProfile = {
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      registrationDate: user.createdAt, // Include registration date
    };

    // If the user is a service provider, add provider-specific details
    if (user.role === "provider") {
      userProfile.servicesOffered = user.servicesOffered || []; // Ensure array
      userProfile.experience = user.experience || "";
      userProfile.verificationStatus = user.verificationStatus || "Pending";
    }

    res.json(userProfile);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


// Update user profile (Client, Provider, or Admin)

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    // Update provider-specific fields
    if (user.role === "provider") {
      user.servicesOffered = req.body.servicesOffered || user.servicesOffered;
      user.experience = req.body.experience || user.experience;
      user.verificationStatus = req.body.verificationStatus || user.verificationStatus;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      role: updatedUser.role,
      registrationDate: updatedUser.createdAt,
      servicesOffered: updatedUser.servicesOffered || [],
      experience: updatedUser.experience || "",
      verificationStatus: updatedUser.verificationStatus || "Pending",
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


const updatePassword = asyncHandler(async (req, res) => {
  console.log("🔹 Password update request received");
  console.log("Request body:", req.body);
  console.log("User from request:", req.user);

  if (!req.user) {
     console.log("❌ User not found in request");
     return res.status(401).json({ message: "Not authorized, user not found" });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
     console.log("❌ Missing fields");
     return res.status(400).json({ message: "Please provide both current and new passwords" });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
     console.log("❌ User not found in database");
     return res.status(404).json({ message: "User not found" });
  }

  console.log("🔹 Checking password...");
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
     console.log("❌ Incorrect current password");
     return res.status(400).json({ message: "Current password is incorrect" });
  }

  console.log("🔹 Updating password...");
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  console.log("✅ Password updated successfully");
  res.json({ message: "Password updated successfully" });
});



module.exports = {
  //registerClient,

  registerProvider,
  registerAdmin,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,requestOTP, verifyOTP
};
