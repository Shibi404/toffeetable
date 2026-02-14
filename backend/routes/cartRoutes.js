import express from "express";
import Cart from "../models/Cart.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/cart – Get current user's cart (populated)
 */
router.get("/", async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate(
      "items.productId"
    );

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/cart/add – Add product or increment quantity
 * Body: { productId }
 */
router.post("/add", async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      cart = await Cart.create({
        userId: req.userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      const existing = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }

      await cart.save();
    }

    // Return populated cart
    cart = await Cart.findOne({ userId: req.userId }).populate(
      "items.productId"
    );

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/cart/update – Set quantity for a product
 * Body: { productId, quantity }
 */
router.put("/update", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
      return res
        .status(400)
        .json({ message: "productId and quantity are required" });
    }

    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    const populated = await Cart.findOne({ userId: req.userId }).populate(
      "items.productId"
    );

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /api/cart/remove/:productId – Remove a product from cart
 */
router.delete("/remove/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );

    await cart.save();

    const populated = await Cart.findOne({ userId: req.userId }).populate(
      "items.productId"
    );

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
