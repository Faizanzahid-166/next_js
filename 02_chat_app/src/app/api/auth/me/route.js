import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { successResponse, errorResponse } from "@/lib/response";
import mongodb from "@/lib/mongodb";

export async function GET(req) {
  try {
    await mongodb();

    const user = await getUserFromCookies();

    // Debugging
    // const cookieStore = (await import("next/headers")).cookies;
    // const allCookies = await cookieStore();
    // console.table([
    //   { name: "cookieStore", value: JSON.stringify(allCookies.getAll()) },
    //   { name: "tokenCookie", value: JSON.stringify(allCookies.get("token")) },
    //   { name: "user", value: JSON.stringify(user) },
    // ]);

    if (!user) return errorResponse("Unauthorized", 401);

    return successResponse("User fetched", user);
  } catch (err) {
    return errorResponse(err.message || "Failed", 500);
  }
}
