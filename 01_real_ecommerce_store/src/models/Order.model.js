import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      min: 1,
    },
    image_url: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      country: String,
      postalCode: String,
    },

    pricing: {
      subTotal: {
        type: Number,
        required: true,
      },
      deliveryCharge: {
        type: Number,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
    },

  payment: {
  method: {
    type: String,
    enum: ["COD", "STRIPE", "PAIKER"], // main type
    required: true,
  },
 channel: {
    type: String,
    enum: ["EASYPAISA", "BANK"], // only used for COD
    default: null,                // ensure it exists even if null
  },
  status: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING",
  },
      paidAt: Date,

      transactionId: String,
        proofImage: String, // URL of uploaded proof (image)

      gatewayData: {   // for Stripe / Paiker
        stripeSessionId: String,
        paikerOrderId: String,
        rawResponse: Object, // optional (debugging)
      },
    },

    status: {
      type: String,
      enum: ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
