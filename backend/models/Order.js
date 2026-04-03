import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: { type: Number, required: true },
        image: String,
      }
    ],
    address: {
      name: String,
      phone: String,
      house: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "COD",
    },
    status: {
      type: String,
      required: true,
      default: "Pending", // Pending, Processing, Shipped, Delivered, Cancelled
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
