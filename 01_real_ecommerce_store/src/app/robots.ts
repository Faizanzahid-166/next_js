import type { MetadataRoute } from "next";

const BASE_URL = process.env.APP_DOMAIN || "https://ecommerce-store.blitz-box.site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/checkout",
          "/customer/",
          "/admin/",
          "/login",
          "/signup",
          "/verify-otp",
          "/forgot-password",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
