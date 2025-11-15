// GET: list products (supports ?q=&category=&page=&limit=)
// GET list, POST create (admin)
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/Product.model";
import { getUserFromAuthHeader } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(req) {
  await dbConnect();
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    const category = url.searchParams.get("category") || "";
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 12);
    const skip = (page - 1) * limit;

    const filter = {};
    if (q) filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } }
    ];
    if (category) filter.category = category;

    const [items, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments(filter)
    ]);

    return successResponse("Products list", { items, total, page, limit });
  } catch (err) {
    return errorResponse(err.message || "Failed to list products", 500);
  }
}

export async function POST(req) {
  await dbconnect();
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user || user.role !== "admin") return errorResponse("Forbidden", 403);

    const body = await req.json();
    // validate fields...
    const product = await Product.create(body);
    return successResponse("Product created", product, 201);
  } catch (err) {
    return errorResponse(err.message || "Failed to create product", 500);
  }
}
