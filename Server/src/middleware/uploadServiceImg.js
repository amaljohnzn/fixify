const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config(); // Ensure environment variables are loaded

// Configure Cloudinary (Already configured in the existing middleware)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage for Service Images
const serviceImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "service_images", // Separate folder for service images
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 300, height: 300, crop: "fill" }], // Ensures small, square images
  },
});

// Initialize Multer for Service Images
const uploadServiceImage = multer({ storage: serviceImageStorage });

module.exports = uploadServiceImage;
