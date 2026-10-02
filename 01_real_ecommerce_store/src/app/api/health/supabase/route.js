import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
    try {
        // 1. Verify cron secret
        const secret = request.headers.get("x-cron-secret");

        if (secret !== process.env.CRON_SECRET) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Lightweight Supabase request
        const { error } = await supabase
            .from("03_ecommerce_store_products")
            .select("id")
            .limit(1);

        // 3. Handle database error
        if (error) {
            console.error("Supabase keep-alive failed:", error.message);

            return NextResponse.json(
                {
                    success: false,
                    message: "Supabase request failed",
                },
                { status: 500 }
            );
        }

        // 4. Successful request
        return NextResponse.json({
            success: true,
            message: "Supabase keep-alive successful",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Keep-alive error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}