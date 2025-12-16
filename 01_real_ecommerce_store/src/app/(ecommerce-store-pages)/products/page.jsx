// components/Layout.jsx
import NavbarProduct from "@/app/(ecommerce-store-pages)/navbarProducts/NavbarProduct";
import ProductLayout from "@/app/(ecommerce-store-pages)/productLayout/ProductLayout";

export default function Layout() {
  return (
    <div>
      <NavbarProduct />
      <ProductLayout />
    </div>
  );
}
