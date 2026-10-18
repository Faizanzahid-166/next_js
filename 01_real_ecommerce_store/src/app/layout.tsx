//"use client"; // <--- Add this if this layout will host client pages like verify-otp
import type { Metadata } from "next";
import MetaPixel from "@/components/MetaPixel";

import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// redux store taunk
import Providers from "@/redux/Providers";
// import { store } from "@/redux/store";

// import components
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import { Toaster } from "sonner";
import JsonLd, { getOrganizationSchema, getWebSiteSchema } from "@/components/seo/JsonLd";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const baseUrl =
  process.env.APP_DOMAIN || "https://ecommerce-store.blitz-box.site";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Blitz Store – Premium Online Shopping in Pakistan | COD & EasyPaisa",
    template: "%s | Blitz Store Pakistan",
  },
  description:
    "Shop premium products at Blitz Store Pakistan. Nationwide delivery, Cash on Delivery (COD) & EasyPaisa payments accepted. Quality goods at honest prices.",
  keywords: [
    "online shopping Pakistan",
    "Blitz Store",
    "COD Pakistan",
    "EasyPaisa shopping",
    "buy online Pakistan",
    "premium products Pakistan",
    "e-commerce Pakistan",
  ],
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: "/favicon-icon.png",
    shortcut: "/favicon-icon.png",
    apple: "/favicon-icon.png",
  },
  openGraph: {
    title: "Blitz Store – Premium Online Shopping in Pakistan",
    description:
      "Shop premium products at Blitz Store Pakistan. Nationwide delivery, COD & EasyPaisa payments. Quality goods at honest prices.",
    locale: "en_PK",
    url: baseUrl,
    siteName: "Blitz Store",
    type: "website",
    images: [
      {
        url: `${baseUrl}/Blitz-ecommerce-store-logo.png`,
        width: 1200,
        height: 630,
        alt: "Blitz Store banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blitz Store – Premium Online Shopping in Pakistan",
    description:
      "Shop premium products at Blitz Store Pakistan. COD & EasyPaisa payments accepted.",
    images: [`${baseUrl}/Blitz-ecommerce-store-logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "0ba85b668fba533b",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">

        {/* Meta Pixel (Facebook Pixel) */}
         <MetaPixel />

        {/* redux store provider */}
        <Providers>
           
        {/* Navbar (global) */}
        <Navbar />

        {/* Structured Data: Organization + WebSite */}
        <JsonLd data={getOrganizationSchema(baseUrl)} />
        <JsonLd data={getWebSiteSchema(baseUrl)} />

        {/* Main content (replacement for Outlet) */}
        <main className="mx-auto px-auto"> 
          {children}
        </main>

        {/* Footer (global) */}
        <Footer />

        <Toaster
          position="top-right"
          richColors
          offset={150}
          toastOptions={{
            duration: 1000,
          }}
        />

        </Providers>
      </body>
    </html>
  );
}
