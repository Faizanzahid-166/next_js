import NavbarProduct from "./navbarProducts/NavbarProduct";

export default function EcommerceLayout({ children }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <NavbarProduct />
      {children}
    </section>
  );
}
