// GET single, PUT update, DELETE

import { dbconnect} from "@/lib/dbConnection";
import Product from "@/models/Product.model";
import { getUserFromAuthHeader } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(req, { params }) {
  await dbconnect();
  try {
    const { id } = params;
    const product = await Product.findById(id);
    if (!product) return errorResponse("Product not found", 404);
    return successResponse("Product fetched", product);
  } catch (err) {
    return errorResponse(err.message || "Failed", 500);
  }
}

export async function PUT(req, { params }) {
  await dbconnect();
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user || user.role !== "admin") return errorResponse("Forbidden", 403);

    const { id } = params;
    const updates = await req.json();
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) return errorResponse("Product not found", 404);
    return successResponse("Product updated", product);
  } catch (err) {
    return errorResponse(err.message || "Failed", 500);
  }
}

export async function DELETE(req, { params }) {
  await dbconnect();
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user || user.role !== "admin") return errorResponse("Forbidden", 403);

    const { id } = params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return errorResponse("Product not found", 404);
    return successResponse("Product deleted", { id: product._id });
  } catch (err) {
    return errorResponse(err.message || "Failed", 500);
  }
}
