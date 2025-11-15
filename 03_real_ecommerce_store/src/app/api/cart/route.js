// GET (user's cart), POST (update cart)
import { dbconnect } from "@/lib/dbConnection";
import Cart from "@/models/Cart.model";
import Product from "@/models/Product.model";
import { getUserFromAuthHeader } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(req) {
  await dbconnect();
  const user = await getUserFromAuthHeader(req);
  if (!user) return errorResponse("Unauthorized", 401);

  let cart = await Cart.findOne({ user: user._id }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: user._id, items: [] });
    cart = await cart.populate("items.product");
  }
  return successResponse("Cart fetched", cart);
}

export async function POST(req) {
  await dbconnect();
  const user = await getUserFromAuthHeader(req);
  if (!user) return errorResponse("Unauthorized", 401);

  const { items } = await req.json(); // expect [{ product: productId, quantity }]
  if (!Array.isArray(items)) return errorResponse("Invalid items", 400);

  // Validate product ids & stock
  for (const it of items) {
    const p = await Product.findById(it.product);
    if (!p) return errorResponse(`Product ${it.product} not found`, 404);
    if (it.quantity > p.stock) return errorResponse(`Insufficient stock for ${p.title}`, 400);
  }

  let cart = await Cart.findOneAndUpdate(
    { user: user._id },
    { items },
    { upsert: true, new: true }
  );

  cart = await cart.populate("items.product");
  return successResponse("Cart updated", cart);
}
