import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [OrderItemSchema],
  totalPrice: { type: Number, required: true },
  address: {
    fullName: String, phone: String, city: String, country: String, street: String, postalCode: String
  },
  paymentMethod: { type: String, enum: ["COD", "CARD"], default: "COD" },
  status: { type: String, enum: ["pending","paid","shipped","delivered","cancelled"], default: "pending" }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
