const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const ServiceRequest = require("../Models/serviceRequest");
const ProviderEarnings = require("../Models/providerEarnings");
const Service = require("../Models/serviceModel")


//  Get all service providers
const getAllProviders = asyncHandler(async (req, res) => {
  const providers = await User.find({ role: "provider" }).select("-password");
  res.json(providers);
});

const verifyProvider = asyncHandler(async (req, res) => {
    console.log("🔹 Received request:", req.body);
  
    const { providerId, status } = req.body;
    if (!providerId || !status) {
      console.error("❌ Missing providerId or status");
      return res.status(400).json({ message: "ProviderId and status are required" });
    }
  
    if (!["Approved", "Rejected"].includes(status)) {
      console.error("❌ Invalid status:", status);
      return res.status(400).json({ message: "Invalid status. Must be 'Approved' or 'Rejected'." });
    }
  
    try {
      const provider = await User.findById(providerId);
      if (!provider || provider.role !== "provider") {
        console.error("❌ Provider not found:", providerId);
        return res.status(404).json({ message: "Provider not found." });
      }
  
      console.log(`✅ Updating provider ${providerId} to status: ${status}`);
      provider.verificationStatus = status;
  
      // ✅ Fix: Validate only modified fields
      await provider.save({ validateModifiedOnly: true });
  
      console.log(`✅ Provider ${providerId} updated successfully`);
      res.json({ message: `Provider verification updated to ${status}` });
    } catch (error) {
      console.error("❌ Error updating provider verification:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });
  

  const getAllBookings = asyncHandler(async (req, res) => {
    try {
      const { status } = req.query;
      console.log("🔹 Received filter status:", status);
  
      let filter = {};
      if (status && status !== "all") {
        filter.status = status.charAt(0).toUpperCase() + status.slice(1); // Capitalize first letter
      }
  
      console.log("🛠 Applying filter:", filter);
  
      const bookings = await ServiceRequest.find(filter)
        .populate("provider", "name phone")
        .populate("client", "name");
  
      console.log("✅ Fetched bookings count:", bookings.length);
      res.json({ success: true, bookings });
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      res.status(500).json({ success: false, message: "Error fetching bookings" });
    }
  });
  
  
  const getPendingBookings = asyncHandler(async (req, res) => {
    try {
      const pendingBookings = await ServiceRequest.find({ status: "Pending" })
        .populate("provider", "name phone")
        .populate("client", "name");
  
      res.json({ success: true, bookings: pendingBookings });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching pending bookings" });
    }
  });
  

//admin earnins
const getAdminEarnings = asyncHandler(async (req, res) => {
  const earnings = await ProviderEarnings.find();

  let totalRevenue = 0;
  let totalCommission = 0;
  let earningsBreakdown = {};

  earnings.forEach(entry => {
    totalRevenue += entry.totalAmount;
    totalCommission += entry.commission;

    if (!earningsBreakdown[entry.serviceName]) {
      earningsBreakdown[entry.serviceName] = {
        totalAmount: 0,
        commission: 0,
        providerEarnings: 0
      };
    }

    earningsBreakdown[entry.serviceName].totalAmount += entry.totalAmount;
    earningsBreakdown[entry.serviceName].commission += entry.commission;
    earningsBreakdown[entry.serviceName].providerEarnings += entry.providerEarnings;
  });

  const formattedEarningsBreakdown = Object.keys(earningsBreakdown).map(service => ({
    serviceName: service,
    totalAmount: earningsBreakdown[service].totalAmount,
    commission: earningsBreakdown[service].commission,
    providerEarnings: earningsBreakdown[service].providerEarnings
  }));

  res.json({
    totalRevenue,
    totalCommission,
    earningsBreakdown: formattedEarningsBreakdown
  });
});
const getAdminReport = asyncHandler(async (req, res) => {
  // Count total users, providers, services
  const totalUsers = await User.countDocuments();
  const totalProviders = await User.countDocuments({ role: "provider" });
  const totalServices = await Service.countDocuments();

  // Calculate total revenue and commission
  const earnings = await ProviderEarnings.aggregate([
      {
          $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
              totalCommission: { $sum: "$commission" }
          }
      }
  ]);

  const totalRevenue = earnings[0]?.totalRevenue || 0;
  const totalCommission = earnings[0]?.totalCommission || 0;

  // Get top earning providers
  const topProviders = await ProviderEarnings.aggregate([
      {
          $group: {
              _id: "$provider",
              totalEarnings: { $sum: "$providerEarnings" }
          }
      },
      { $sort: { totalEarnings: -1 } },
      { $limit: 5 },
      {
          $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "provider"
          }
      },
      {
          $unwind: "$provider"
      },
      {
          $project: {
              _id: "$provider._id",
              name: "$provider.name",
              phone: "$provider.phone",
              totalEarnings: 1
          }
      }
  ]);

  // Count new users this month
  const newUsersThisMonth = await User.countDocuments({
      createdAt: {
          $gte: new Date(new Date().setDate(1)) // First day of the current month
      }
  });

  // Count rejected service requests
  const rejectedRequests = await ServiceRequest.countDocuments({ status: "Rejected" });

  // Get top requested services
  const topServices = await ServiceRequest.aggregate([
      {
          $group: {
              _id: "$serviceName",
              count: { $sum: 1 }
          }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
  ]);

  // Calculate average rating per provider
  const providerRatings = await ServiceRequest.aggregate([
      {
          $match: { status: "Paid", rating: { $ne: null } } // Only consider rated & paid requests
      },
      {
          $group: {
              _id: "$provider",
              avgRating: { $avg: "$rating" }
          }
      },
      {
          $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "provider"
          }
      },
      {
          $unwind: "$provider"
      },
      {
          $project: {
              _id: "$provider._id",
              name: "$provider.name",
              phone: "$provider.phone",
              avgRating: { $round: ["$avgRating", 1] } // Round to 1 decimal place
          }
      }
  ]);

  // Calculate overall average rating across all providers
  const totalRatings = await ServiceRequest.aggregate([
      {
          $match: { status: "Paid", rating: { $ne: null } }
      },
      {
          $group: {
              _id: null,
              avgRating: { $avg: "$rating" }
          }
      }
  ]);

  const avgRating = totalRatings[0]?.avgRating ? totalRatings[0].avgRating.toFixed(1) : "No Ratings Yet";

  res.json({
      totalUsers,
      totalProviders,
      totalServices,
      totalRevenue,
      totalCommission,
      topProviders,
      newUsersThisMonth,
      rejectedRequests,
      topServices,
      avgRating,
      providerRatings // Includes provider-specific ratings
  });
});


module.exports = { getAllProviders, verifyProvider, getAllBookings, getPendingBookings, getAdminEarnings ,getAdminReport};


