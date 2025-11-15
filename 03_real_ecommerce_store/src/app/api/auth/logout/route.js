import { clearAuthCookieHeader } from "@/lib/auth";
import { successResponse } from "@/lib/response";


export async function POST() {
const header = clearAuthCookieHeader();
return successResponse("Logged out", null, 200, { "Set-Cookie": header });
}