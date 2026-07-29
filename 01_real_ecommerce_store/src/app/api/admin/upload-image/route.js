import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const bucketName = formData.get("bucket") || "03-ecommerce-images";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Make sure bucket exists (or ignores error if it already does)
    try {
      await supabaseServer.storage.createBucket(bucketName, {
        public: true,
      });
    } catch (e) {
      console.warn("createBucket error (safe to ignore if bucket exists):", e.message);
    }

    // Generate unique name
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const { error } = await supabaseServer.storage
      .from(bucketName)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabaseServer.storage
      .from(bucketName)
      .getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      bucket: bucketName,
    });
  } catch (error) {
    console.error("Upload image catch block error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
