"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  setSearch,
  setProductNo,
  setCategory,
  setPrice,
  setAnalytics,
  fetchProducts,
} from "@/redux/productsSliceTunk/productfetchSliceTunk";
import { useEffect } from "react";
import { categories } from "./index";

export default function NavbarProduct() {
  const dispatch = useDispatch();
  const { search, product_no, category, price, analytics, page, limit } =
    useSelector((state) => state.products);

  // Fetch products whenever filters/search/sort change
  useEffect(() => {
    dispatch(
      fetchProducts({
        q: search,
        product_no,
        category,
        price,
        analytics,
        page,
        limit,
      })
    );
  }, [search, product_no, category, price, analytics, page, limit, dispatch]);
  useEffect(() => {
  console.log("Products slice updated:", {

    search,
    product_no,
    category,
    price,
    analytics,
    page,
    limit,
  });
}, [search, product_no, category, price, analytics, page, limit]);


  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white shadow-md rounded-md">
      {/* Name/Description Search */}
      <input
        type="text"
        placeholder="Search by name/description..."
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Product No Search */}
      <input
        type="text"
        placeholder="Search by Product No..."
        value={product_no || ""}
        onChange={(e) => dispatch(setProductNo(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Category */}
      <select
        value={category}
        onChange={(e) => dispatch(setCategory(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* Price */}
<input
  type="number"
  placeholder="Enter price (50, 80, 120...)"
  value={price || ""}
  onChange={(e) => dispatch(setPrice(e.target.value))}
  className="border px-3 py-2 rounded w-40"
/>
      {/* Analytics */}
      <select
        value={analytics}
        onChange={(e) => dispatch(setAnalytics(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">None</option>
        <option value="best_sellers">Best Sellers</option>
        <option value="trending">Trending</option>
        <option value="featured">Featured</option>
      </select>
    </div>
  );
}
