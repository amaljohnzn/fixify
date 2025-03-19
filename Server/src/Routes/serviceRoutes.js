const express = require("express");
const { addService, updateService, getServices, deleteService } = require("../Controller/serviceController");
const { protect, admin } = require("../middleware/authmiddleware");
const uploadServiceImage = require("../middleware/uploadServiceImg");

const router = express.Router();

// Public Route - Get all services
router.get("/", getServices);

// Protected Routes - Only Admins can add, update, delete services
router.post("/add", protect, admin, uploadServiceImage.single("image"), addService);
router.put("/update/:id", protect, admin, uploadServiceImage.single("image"), updateService);
router.delete("/delete/:id", protect, admin, deleteService);

module.exports = router;

