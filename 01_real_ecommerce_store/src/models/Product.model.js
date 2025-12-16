import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  category: { type: String },
  brand: { type: String },
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  rating: { rate: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
