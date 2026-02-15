import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ["cakes", "brownies", "cupcakes", "pastries"]
    },
    price: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0 // percentage discount
    },
    description: {
      type: String
    },
    image: {
      type: String, // image URL
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
