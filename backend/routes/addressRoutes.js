import express from "express";
import Address from "../models/Address.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all addresses for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Add a new address
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, phone, house, street, city, state, pincode } = req.body;
    
    if (!name || !phone || !house || !street || !city || !state || !pincode) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const newAddress = new Address({
      user: req.userId,
      name,
      phone,
      house,
      street,
      city,
      state,
      pincode
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
