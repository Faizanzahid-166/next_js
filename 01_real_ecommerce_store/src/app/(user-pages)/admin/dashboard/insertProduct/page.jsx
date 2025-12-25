"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchProducts,
  setPage,
  setLimit,
  clearSelectedProduct,
} from "@/redux/productsSliceTunk/productfetchSliceTunk";
import {
  insertProduct,
  editProduct,
  deleteProduct,
} from "@/redux/adminSliceTunk/adminProductRoleSliceTunk";
import NavbarProduct from "./NavbarProduct";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const { items, loading, error, page, totalPages, limit } =
    useSelector((state) => state.products);
  const { message } = useSelector((state) => state.adminproduct);

  const [editingProductId, setEditingProductId] = useState(null);
  const { total } = useSelector((state) => state.products);
  const [form, setForm] = useState({
    product_no: "",
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image_url: "",
  });

  // Fetch products on page load or page/limit change
  useEffect(() => {
    dispatch(fetchProducts({ page, limit }));
  }, [dispatch, page, limit]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = (product) => {
    setEditingProductId(product.id);
    setForm({ ...product });
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setForm({
      product_no: "",
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      image_url: "",
    });
    dispatch(clearSelectedProduct());
  };

  // inside saveProduct
const saveProduct = () => {
  if (!form.name || !form.price || !form.category) {
    toast.error("Name, Price, and Category are required!");
    return;
  }

  if (editingProductId) {
    dispatch(editProduct({ id: editingProductId, productData: form }))
      .then(() => {
        cancelEdit();
        dispatch(fetchProducts({ page, limit }));
        toast.success("Product updated successfully!");
      })
      .catch(() => {
        toast.error("Failed to update product.");
      });
  } else {
    dispatch(insertProduct({ productData: form }))
      .then(() => {
        setForm({
          product_no: "",
          name: "",
          price: "",
          category: "",
          stock: "",
          description: "",
          image_url: "",
        });
        dispatch(fetchProducts({ page, limit }));
        toast.success("Product added successfully!");
      })
      .catch(() => {
        toast.error("Failed to add product.");
      });
  }
};

// inside handleDelete
const handleDelete = (id) => {
  if (window.confirm("Are you sure?")) {
    dispatch(deleteProduct({ id }))
      .then(() => {
        dispatch(fetchProducts({ page, limit }));
        toast.success("Product deleted successfully!");
      })
      .catch(() => {
        toast.error("Failed to delete product.");
      });
  }
};
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Panel – Products</h1>
        <h2 className="text-lg font-semibold">
        Total Products: {total}
        </h2>

        {/* Filters/Search */}
        <NavbarProduct />

        {/* Messages */}
        {message && <p className="text-green-600 mb-2">{message}</p>}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Product Form */}
        <div className="border p-4 mb-6 rounded bg-gray-50">
          <h2 className="font-semibold mb-2">
            {editingProductId ? "Edit Product" : "Add Product"}
          </h2>
          <div className="flex flex-wrap gap-2 mb-2">
            {["product_no", "name", "price", "category", "stock", "image_url"].map(
              (field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.replace("_", " ")}
                  value={form[field]}
                  onChange={handleChange}
                  className="border p-1 rounded flex-1"
                />
              )
            )}
          </div>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-1 rounded w-full mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={saveProduct}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              {editingProductId ? "Update Product" : "Add Product"}
            </button>
            {editingProductId && (
              <button
                onClick={cancelEdit}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "ID",
                      "No",
                      "Name",
                      "Price",
                      "Category",
                      "Stock",
                      "Description",
                      "Image",
                      "Action",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-sm font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((product) => {
                    const isEditing = editingProductId === product.id;
                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{product.id}</td>
                        <td className="px-4 py-3">{product.product_no}</td>
                        <td className="px-4 py-3">{product.name}</td>
                        <td className="px-4 py-3">{product.price}</td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3">{product.stock}</td>
                        <td className="px-4 py-3">{product.description}</td>
                        <td className="px-4 py-3">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          {!isEditing && (
                            <>
                              <button
                                onClick={() => startEdit(product)}
                                className="px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => dispatch(setPage(page - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => dispatch(setPage(page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
