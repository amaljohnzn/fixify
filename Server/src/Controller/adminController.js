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

//  Approve or Reject provider verification
const verifyProvider = asyncHandler(async (req, res) => {
  const { providerId, status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status. Must be 'Approved' or 'Rejected'.");
  }

  const provider = await User.findById(providerId);
  if (!provider || provider.role !== "provider") {
    res.status(404);
    throw new Error("Provider not found.");
  }

  provider.verificationStatus = status;
  await provider.save();

  res.json({ message: `Provider verification updated to ${status}` });
});


//  Get all service bookings 
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await ServiceRequest.find().populate("provider", "name phone").populate("client", "name");
  res.json(bookings);
});

//  Get only pending service requests
const getPendingBookings = asyncHandler(async (req, res) => {
  const pendingBookings = await ServiceRequest.find({ status: "Pending" })
    .populate("provider", "name phone")
    .populate("client", "name");

  res.json(pendingBookings);
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

