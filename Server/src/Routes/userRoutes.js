const express = require("express");
const { registerClient, registerProvider, registerAdmin, loginUser, getUserProfile, updateUserProfile,logoutUser,updatePassword } = require("../Controller/userController");
const { protect, admin, provider } = require("../middleware/authmiddleware");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.post("/register/client", registerClient);
//router.post("/register/provider", registerProvider);
router.post("/register/admin", registerAdmin);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
//router.post("/register/provider", upload.single("documents"), registerProvider);
router.post("/register", upload.array("documents", 5), registerProvider);

// Protected Routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
//router.put("/profile/password", protect, updatePassword);
module.exports = router;







