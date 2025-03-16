//const Stripe = require("stripe");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const ServiceRequest = require("../Models/serviceRequest");
const User = require("../Models/serviceModel");
const ProviderEarnings = require("../Models/providerEarnings");

dotenv.config();
//const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not configured in environment variables");
  }

// Create a new service request
const createServiceRequest = asyncHandler(async (req, res) => {
    const { serviceName, location, phone } = req.body;

    if (!serviceName || !location || !phone) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const newRequest = await ServiceRequest.create({
        serviceName,
        location,
        phone,
        client: req.user._id,
        status: "Pending",
    });

    res.status(201).json({
        _id: newRequest._id,
        serviceName: newRequest.serviceName,
        status: newRequest.status,
        provider: newRequest.provider,
        location: newRequest.location,
        phone: newRequest.phone,
        paymentStatus: newRequest.paymentStatus,
        createdAt: newRequest.createdAt,
    });
});

//Get all pending service requests (For providers)
const getPendingRequests = asyncHandler(async (req, res) => {
    const pendingRequests = await ServiceRequest.find({
        status: "Pending",
        provider: null,
        serviceName: { $in: req.user.servicesOffered },
    })
        .populate("client", "name phone location")
        .sort({ createdAt: -1 });

    const formattedRequests = pendingRequests.map(request => ({
        _id: request._id,
        client: request.client
            ? {
                _id: request.client._id,
                name: request.client.name,
                phone: request.client.phone,
                location: request.client.location
            }
            : null,
        serviceName: request.serviceName,
        status: request.status,
        createdAt: request.createdAt,
    }));

    res.json(formattedRequests);
});


//  Accept a service request
const acceptServiceRequest = asyncHandler(async (req, res) => {
    const serviceRequest = await ServiceRequest.findById(req.params.id).populate("client", "name");

    if (!serviceRequest) {
        res.status(404);
        throw new Error("Service request not found");
    }

    if (serviceRequest.status !== "Pending") {
        res.status(400);
        throw new Error("Request is already accepted");
    }

    serviceRequest.status = "Accepted";
    serviceRequest.provider = req.user.id;
    await serviceRequest.save();

    res.json({
        message: "Request accepted",
        serviceRequest: {
            _id: serviceRequest._id,
            client: serviceRequest.client._id,
            clientName: serviceRequest.client.name,
            serviceName: serviceRequest.serviceName,
            status: serviceRequest.status,
            location: serviceRequest.location,
            paymentStatus: "Pending",
            createdAt: serviceRequest.createdAt,
        },
    });
});


const getAcceptedRequests = asyncHandler(async (req, res) => {
    const requests = await ServiceRequest.find({
        provider: req.user.id,
        status: "Accepted"
    })
        .populate("client", "name phone location") // Ensure 'phone' is populated
        .sort({ createdAt: -1 });

    const formattedRequests = requests.map(request => ({
        _id: request._id,
        client: request.client ? request.client._id : null,
        clientName: request.client ? request.client.name : null,
        clientPhone: request.client ? request.client.phone : null,  // ✅ Include phone
        serviceName: request.serviceName,
        status: request.status,
        location: request.location,
        paymentStatus: "Pending",
        createdAt: request.createdAt,
    }));

    res.json(formattedRequests);
});

//  Get client requests status
const getClientRequests = asyncHandler(async (req, res) => {
    const requests = await ServiceRequest.find({ client: req.user.id })
        .select("serviceName status provider")
        .populate("provider", "name phone"); // Populate only name & phone from provider

    res.json(requests);
});


// Mark service request as completed with charges
const completeServiceRequest = asyncHandler(async (req, res) => {
    const labourCharge = Number(req.body.labourCharge) || 0;
    const partsCharge = Number(req.body.partsCharge) || 0;

    const serviceRequest = await ServiceRequest.findById(req.params.id);

    if (!serviceRequest) {
        res.status(404);
        throw new Error("Service request not found");
    }

    if (serviceRequest.provider.toString() !== req.user.id) {
        res.status(403);
        throw new Error("You can only complete your assigned requests");
    }

    if (serviceRequest.status !== "Accepted") {
        res.status(400);
        throw new Error("Request is not in an accepted state");
    }

    const totalAmount = labourCharge + partsCharge;

    serviceRequest.status = "Completed";
    serviceRequest.labourCharge = labourCharge;
    serviceRequest.partsCharge = partsCharge;
    serviceRequest.totalAmount = totalAmount;

    await serviceRequest.save();
    res.json({ message: "Work marked as completed", serviceRequest });
});

//  View bill 
const viewBill = asyncHandler(async (req, res) => {
    const serviceRequest = await ServiceRequest.findById(req.params.id)
        .populate("provider", "name phone");

    if (!serviceRequest) {
        res.status(404);
        throw new Error("Service request not found");
    }

    if (serviceRequest.client.toString() !== req.user.id) {
        res.status(403);
        throw new Error("You can only view your own service bills");
    }

    if (serviceRequest.status !== "Completed") {
        res.status(400);
        throw new Error("This service is not yet completed");
    }

    res.json({
        serviceName: serviceRequest.serviceName,
        provider: serviceRequest.provider.name,
        providerPhone: serviceRequest.provider.phone,
        labourCharge: serviceRequest.labourCharge,
        partsCharge: serviceRequest.partsCharge,
        totalAmount: serviceRequest.totalAmount,
        paymentStatus: serviceRequest.paymentStatus
    });
});
const createPaymentIntent = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const serviceRequest = await ServiceRequest.findById(req.params.id);

    if (!serviceRequest) {
        return res.status(404).json({ message: "Service request not found" });
    }

    if (serviceRequest.status !== "Completed") {
        return res.status(400).json({ message: "Service must be completed before payment" });
    }

    try {
        // Create a PaymentIntent in Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe uses cents
            currency: "usd", // Change to your currency
            metadata: { serviceRequestId: serviceRequest._id.toString() },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ message: "Failed to create payment intent" });
    }
});
// confirm payment
const confirmPayment = asyncHandler(async (req, res) => {
    const serviceRequest = await ServiceRequest.findById(req.params.id);

    if (!serviceRequest) {
        return res.status(404).json({ message: "Service request not found" });
    }

    if (serviceRequest.status !== "Completed") {
        return res.status(400).json({ message: "Service must be completed before payment" });
    }

    if (serviceRequest.paymentStatus === "Paid") {
        return res.status(400).json({ message: "This service has already been paid for" });
    }

    try {
        // Calculate commission and provider earnings
        const commissionAmount = serviceRequest.totalAmount * 0.1;  // 10% to Fixify
        const providerEarningsAmount = serviceRequest.totalAmount * 0.9;  // 90% to Provider

        // Update service request status
        serviceRequest.status = "Paid";
        serviceRequest.paymentStatus = "Paid";
        serviceRequest.paymentId = req.body.paymentId;

        await serviceRequest.save();

        // Save provider earnings record
        await ProviderEarnings.create({
            provider: serviceRequest.provider,
            serviceRequest: serviceRequest._id,
            serviceName: serviceRequest.serviceName,
            totalAmount: serviceRequest.totalAmount,
            providerEarnings: providerEarningsAmount,
            commission: commissionAmount,
            balance: providerEarningsAmount
        });

        console.log("Updated Service Request & Provider Earnings:", serviceRequest);

        res.json({ message: "Payment successful", serviceRequest });
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ message: "Failed to process payment" });
    }
});

// Submit a rating after payment
const submitRating = asyncHandler(async (req, res) => {
    const rating = Number(req.body.rating);

    if (rating < 1 || rating > 5) {
        res.status(400);
        throw new Error("Rating must be between 1 and 5");
    }

    const serviceRequest = await ServiceRequest.findById(req.params.id);

    if (!serviceRequest) {
        res.status(404);
        throw new Error("Service request not found");
    }

    if (serviceRequest.client.toString() !== req.user.id) {
        res.status(403);
        throw new Error("You can only rate your own service requests");
    }

    if (serviceRequest.status !== "Paid") {
        res.status(400);
        throw new Error("You can only rate a service after payment is completed");
    }

    serviceRequest.rating = rating;
    await serviceRequest.save();

    // 🔄 Update Provider's Average Rating
    if (serviceRequest.provider) {
        await updateProviderRating(serviceRequest.provider);
    }

    res.json({ message: "Rating submitted successfully", serviceRequest });
});

// Function to Update Provider's Average Rating
const updateProviderRating = async (providerId) => {
    const ratings = await ServiceRequest.aggregate([
        { $match: { provider: providerId, rating: { $ne: null } } }, 
        { $group: { _id: "$provider", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    if (ratings.length > 0) {
        await User.findByIdAndUpdate(providerId, { 
            rating: ratings[0].avgRating, 
            ratingCount: ratings[0].count 
        });
    }
};
const getPastBookingsForProvider = asyncHandler(async (req, res) => {
    const pastJobs = await ServiceRequest.find({
        provider: req.user.id,
        status: "Paid" // Only show Paid bookings
    })
    .populate("client", "name phone location") // Populate client details
    .sort({ createdAt: -1 });

    const formattedJobs = pastJobs.map(job => ({
        _id: job._id,
        clientName: job.client ? job.client.name : "N/A",
        clientPhone: job.client ? job.client.phone : "N/A",
        serviceName: job.serviceName,
        location: job.location,
        status: job.status,
        paymentStatus: job.paymentStatus || "Paid",
        createdAt: job.createdAt
    }));

    res.json(formattedJobs); // ✅ Send response
});



module.exports = {
    createServiceRequest,
    getPendingRequests,
    acceptServiceRequest,
    getAcceptedRequests,
    getClientRequests,
    confirmPayment,
    viewBill,
    completeServiceRequest,
    submitRating,
    getPastBookingsForProvider,createPaymentIntent
};
