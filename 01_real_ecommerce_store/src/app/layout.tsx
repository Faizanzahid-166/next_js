//"use client"; // <--- Add this if this layout will host client pages like verify-otp
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// redux store taunk
import Providers from "@/redux/Providers";
// import { store } from "@/redux/store";

// import components
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import { Toaster } from "sonner";

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
  process.env.APP_DOMAIN ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Blitz Store – Premium Shopping, Delivered",
  description: "Shop the latest collection at Blitz Store. Fast delivery, EasyPaisa & COD payments accepted.",
  icons: {
    icon: "/favicon-icon.png",
    shortcut: "/favicon-icon.png",
    apple: "/favicon-icon.png",
  },
  openGraph: {
    title: "Blitz Store – Premium Shopping, Delivered",
    description: "Shop the latest collection at Blitz Store. Fast delivery, EasyPaisa & COD payments accepted.",
    url: baseUrl,
    siteName: "Blitz Store",
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Blitz Store banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blitz Store – Premium Shopping, Delivered",
    description: "Shop the latest collection at Blitz Store. Fast delivery, EasyPaisa & COD payments accepted.",
    images: [`${baseUrl}/og-image.png`],
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

        {/* redux store provider */}
        <Providers>
           
        {/* Navbar (global) */}
        <Navbar />

        {/* Main content (replacement for Outlet) */}
        <main className="mx-auto px-auto"> 
          {children}
        </main>

        {/* Footer (global) */}
        <Footer />

        <Toaster position="top-right" richColors />

        </Providers>
      </body>
    </html>
  );
}
