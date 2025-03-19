const express = require("express");
const router = express.Router();
const { submitContactForm } = require("../Controller/contactController");
const { protect,  } = require("../middleware/authmiddleware");

router.post("/", protect, submitContactForm);

module.exports = router;
