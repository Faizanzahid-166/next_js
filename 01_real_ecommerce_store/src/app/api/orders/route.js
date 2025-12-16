// POST (create order), GET list (user)
import { dbconnect } from "@/lib/dbConnection";
import Order from "@/models/Order.model";
import Cart from "@/models/Cart.model";
import Product from "@/models/Product.model";
import { getUserFromAuthHeader } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(req) {
  await dbconnect();
  const user = await getUserFromAuthHeader(req);
  if (!user) return errorResponse("Unauthorized", 401);

  const { address, paymentMethod } = await req.json();
  // Use cart to create order
  const cart = await Cart.findOne({ user: user._id }).populate("items.product");
  if (!cart || cart.items.length === 0) return errorResponse("Cart is empty", 400);

  let total = 0;
  const items = cart.items.map(i => {
    const price = i.product.discountPrice || i.product.price;
    total += price * i.quantity;
    return { product: i.product._id, quantity: i.quantity, price };
  });

  const order = await Order.create({
    user: user._id,
    items,
    totalPrice: total,
    address,
    paymentMethod,
    status: "pending"
  });

  // Reduce stock
  for (const i of cart.items) {
    await Product.findByIdAndUpdate(i.product._id, { $inc: { stock: -i.quantity } });
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  return successResponse("Order created", order, 201);
}

export async function GET(req) {
  await dbconnect();
  const user = await getUserFromAuthHeader(req);
  if (!user) return errorResponse("Unauthorized", 401);

  const url = new URL(req.url);
  const adminView = url.searchParams.get("admin") === "1";

  if (adminView && user.role !== "admin") return errorResponse("Forbidden", 403);

  const filter = adminView ? {} : { user: user._id };
  const orders = await Order.find(filter).sort({ createdAt: -1 }).populate("items.product").populate("user", "name email");
  return successResponse("Orders list", orders);
}
