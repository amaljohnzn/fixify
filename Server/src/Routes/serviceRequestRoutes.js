const express = require("express");
const router = express.Router();
const { protect, provider } = require("../middleware/authmiddleware");       
const {
  createServiceRequest,
  getPendingRequests,
  acceptServiceRequest,
  getAcceptedRequests,
  getClientRequests,confirmPayment,viewBill,completeServiceRequest,submitRating,getPastBookingsForProvider,createPaymentIntent,getCompletedServices,getReceipt
} = require("../Controller/serviceRequestController");

// Client creates a new service request
router.post("/", protect, createServiceRequest);

// Providers get all pending service requests
router.get("/pending", protect, provider, getPendingRequests);

// Provider accepts a service request
router.put("/:id/accept", protect, provider, acceptServiceRequest);

// Provider gets their accepted service requests
router.get("/accepted", protect, provider, getAcceptedRequests);

// satus check client
router.get("/myRequest", protect, getClientRequests)

// Provider marks as completed
router.put("/:id/complete", protect, provider, completeServiceRequest); 
router.get("/completed", protect, getCompletedServices);

// Client views bill
router.get("/:id/bill", protect, viewBill); 
router.get("/:id/receipt", getReceipt);
//router.get("/paid", protect, getpaidService);

// Client makes payment
router.put("/:id/pay", protect, confirmPayment); 
router.post("/:id/create-payment-intent", createPaymentIntent);

// Client submits a rating after payment
router.post("/:id/rate", protect, submitRating);

router.get("/past-jobs", protect, getPastBookingsForProvider);






module.exports = router;

