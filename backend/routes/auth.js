import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🔹 In-memory OTP store (Demo Only)
const otpStore = {};

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * SEND OTP (Demo Mode - No DB storage)
 */
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const otp = generateOTP();

    // Store OTP in memory for 5 minutes
    otpStore[phone] = {
      otp,
      expiry: Date.now() + 5 * 60 * 1000,
    };

    console.log(`🔐 OTP for ${phone}: ${otp}`);

    res.json({
      message: "OTP generated (check server console)",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * VERIFY OTP
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const record = otpStore[phone];

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiry < Date.now()) {
      delete otpStore[phone];
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ OTP verified → remove from memory
    delete otpStore[phone];

    // ✅ Create user if not exists
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
