require("dotenv").config(); // Make sure this is at the top of your server entry file

const nodemailer = require("nodemailer");
const Contact = require("../Models/contactModel");

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    // Setup Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email Options
    const mailOptions = {
      from: `"Fixify Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, 
      subject: "Response",
      html: `
        <h2>New Message from Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Message sent successfully!" });

  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
