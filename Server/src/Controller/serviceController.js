const Service = require("../Models/serviceModel");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;

// Add a new service with image upload
const addService = asyncHandler(async (req, res) => {
    const { name, description, category, priceRange } = req.body;

    // Check if the service already exists
    const existingService = await Service.findOne({ name });
    if (existingService) {
        res.status(400);
        throw new Error("Service already exists");
    }

    // Upload image to Cloudinary (if available)
    let imageUrl = "";
    if (req.file) {
        const uploadResponse = await cloudinary.uploader.upload(req.file.path);
        imageUrl = uploadResponse.secure_url;
    }

    // Create the service with image
    const service = await Service.create({
        name,
        description,
        category,
        priceRange,
        image: imageUrl,
    });

    res.status(201).json(service);
});

// Update service by _id
const updateService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, category, priceRange } = req.body;

    let service = await Service.findById(id);

    if (!service) {
        res.status(404);
        throw new Error("Service not found");
    }

    // Delete old image from Cloudinary if a new image is uploaded
    if (req.file) {
        if (service.image) {
            const publicId = service.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }

        // Upload new image
        const uploadResponse = await cloudinary.uploader.upload(req.file.path);
        service.image = uploadResponse.secure_url;
    }

    // Update fields
    service.name = name || service.name;
    service.description = description || service.description;
    service.category = category || service.category;
    service.priceRange = priceRange || service.priceRange;

    const updatedService = await service.save();
    res.json(updatedService);
});

// Get all services
const getServices = asyncHandler(async (req, res) => {
    const services = await Service.find();
    res.json(services);
});

// Delete a service by _id
const deleteService = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
        res.status(404);
        throw new Error("Service not found");
    }

    // Delete image from Cloudinary
    if (service.image) {
        const publicId = service.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
    }

    await service.deleteOne();
    res.json({ message: `Service '${service.name}' removed successfully` });
});

module.exports = { addService, updateService, getServices, deleteService };
