import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * GET all products
 * GET by category: /api/products?category=cakes
 */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

