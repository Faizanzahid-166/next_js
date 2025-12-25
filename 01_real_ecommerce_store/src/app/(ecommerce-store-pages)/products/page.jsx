"use client";

import { useSelector, useDispatch } from "react-redux";
import { setPage } from "@/redux/productsSliceTunk/productfetchSliceTunk";
import Link from "next/link";

export default function Product() {
  const dispatch = useDispatch();
  const { items, loading, page, totalPages } = useSelector(
    (state) => state.products
  );

  // Debug log for items and current page
  console.log("Products:", items);
  console.log("Current page:", page, "of", totalPages);

  if (loading)
    return (
      <p className="h-screen text-center text-gray-500 mt-10">Loading products...</p>
    );

  return (
    <div className="mb-15 px-4 py-6">
      {/* Product Grid */}
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`} // dynamic route
            className="block bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-blue-600 font-bold mt-2">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page <= 1}
          onClick={() => {
            console.log("Going to previous page:", page - 1);
            dispatch(setPage(page - 1));
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => {
            console.log("Going to next page:", page + 1);
            dispatch(setPage(page + 1));
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
