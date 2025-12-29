// app/layout.js

import "./globals.css";
import Providers from "@/redux/Providers";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* redux store provider */}
        <Providers>
          {/* Navbar (global) */}
          <Navbar />

          {/* Main content */}
          <main className="mx-auto px-4">{children}</main>

          {/* Toaster notifications */}
          <Toaster position="top-right" />

          {/* Footer (global) */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
