import User from "@/models/User.model";
import bcrypt from "bcryptjs";

export async function createRootAdmin() {
  const rootEmail = process.env.DEFAULT_ADMIN_EMAIL || "";
  const rootPassword = process.env.DEFAULT_ADMIN_PASSWORD || "";

  // Check if root admin already exists
  const admin = await User.findOne({ email: rootEmail });

  if (admin) {
    console.log("Root admin already exists");
    return;
  }

  // Create new root admin
  const hashedPassword = await bcrypt.hash(rootPassword, 10);

  await User.create({
    name: "Root Admin",
    email: rootEmail,
    password: hashedPassword,
    role: "admin",
    isRoot: true,          // ✅ mark as root
    emailVerified: true,
  });

   console.log("✅ Root admin created:", rootEmail);
}
