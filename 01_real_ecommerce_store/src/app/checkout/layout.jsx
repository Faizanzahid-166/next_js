import { Suspense } from "react";

export const metadata = {
  title: "Checkout — Blitz Store",
  description: "Complete your purchase at Blitz Store. No account required — checkout as a guest or log in to track your order.",
};

export default function CheckoutLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-neutral-400 animate-pulse">Loading checkout…</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
