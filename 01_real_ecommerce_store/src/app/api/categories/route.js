// list & create in categories

import { dbconnect } from "@/lib/dbConnection";
import Category from "@/models/Category.model";
import { getUserFromAuthHeader } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET() {
  await dbconnect();
  const items = await Category.find().sort({ name: 1 });
  return successResponse("Categories", items);
}

export async function POST(req) {
  await dbconnect();
  const user = await getUserFromAuthHeader(req);
  if (!user || user.role !== "admin") return errorResponse("Forbidden", 403);
  try {
    const body = await req.json();
    const cat = await Category.create(body);
    return successResponse("Category created", cat, 201);
  } catch (err) {
    return errorResponse(err.message || "Failed", 500);
  }
}
