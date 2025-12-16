"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  setSearch,
  setCategory,
  setPrice,
  setSort,
  setAnalytics,
  setFilters,
  fetchProducts,
} from "@/redux/productsSliceTunk/productfetchSliceTunk";
import { useEffect } from "react";
import {categories } from './index'

export default function NavbarProduct() {
  const dispatch = useDispatch();
  const { search, category, price, sort, analytics, filters, page, limit } =
    useSelector((state) => state.products);

  // Fetch products whenever filters/search/sort change
  useEffect(() => {
    dispatch(
      fetchProducts({
        q: search,
        category,
        price,
        sort,
        analytics,
        ...filters,
        page,
        limit,
      })
    );
  }, [search, category, price, sort, analytics, filters, page, limit, dispatch]);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white shadow-md rounded-md">
      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
      />

      {/* Category */}
      <select
        value={category}
        onChange={(e) => dispatch(setCategory(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
       {categories.map((cat) => (
        <option key={cat.value} value={cat.value}>
        {cat.label}
        </option>
        ))}
      </select>

      {/* Price */}
      <input
       type="number"
        placeholder="Enter price..."
       value={price}
       onChange={(e) => {
       let value = parseFloat(e.target.value);
        if (isNaN(value) || value < 0) value = ""; // reset if negative or invalid
       dispatch(setPrice(value));
       }}
       className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
      />


      {/* Sort */}
      {/* <select
        value={sort}
        onChange={(e) => dispatch(setSort(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Default</option>
        <option value="price_asc">Price Ascending</option>
        <option value="price_desc">Price Descending</option>
        <option value="rating">Top Rated</option>
      </select> */}

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
