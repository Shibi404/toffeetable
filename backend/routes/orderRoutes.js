import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create a new order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, address, totalAmount, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }
    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }
    if (!totalAmount) {
      return res.status(400).json({ message: "Total amount is required" });
    }

    const newOrder = new Order({
      user: req.userId,
      items,
      address,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
      status: "Pending" // Will be updated by admin later
    });

    const savedOrder = await newOrder.save();

    // Clear the cart for the user
    await Cart.findOneAndUpdate(
      { user: req.userId },
      { items: [] }
    );

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// (Optional for later) Get user's orders
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
