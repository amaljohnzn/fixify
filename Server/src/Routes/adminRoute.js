const express = require("express");
const { protect, admin } = require("../middleware/authmiddleware");
const { getAllProviders, verifyProvider, getAllBookings, getPendingBookings,getAdminEarnings,getAdminReport } = require("../Controller/adminController");

const router = express.Router();

//  Get all service providers (Pending, Approved, Rejected)
router.get("/providers", protect, admin, getAllProviders);

//  Verify provider (Approve/Reject)
router.put("/verify-provider", protect, admin, verifyProvider);

//  Get all service bookings (Requests)
router.get("/bookings", protect, admin, getAllBookings);

//  Get only pending bookings
router.get("/pending-bookings", protect, admin, getPendingBookings);

// Get earnings info
router.get("/earning", protect, admin,getAdminEarnings );


// Admin Report Route (Only accessible by Admin)
router.get("/report", protect, admin, getAdminReport);

module.exports = router;
