const BASE_URL = process.env.APP_DOMAIN || "https://ecommerce-store.blitz-box.site";

export const metadata = {
  title: "Products | Blitz Store Pakistan",
  description:
    "Browse the Blitz Store catalog featuring quality essentials, electronics, home products, and trending picks with secure checkout and nationwide delivery.",
  alternates: {
    canonical: `${BASE_URL}/products`,
  },
  openGraph: {
    title: "Products | Blitz Store Pakistan",
    description:
      "Explore premium products, everyday essentials, and best-selling items from Blitz Store Pakistan.",
    url: `${BASE_URL}/products`,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProductsLayout({ children }) {
  return children;
}
