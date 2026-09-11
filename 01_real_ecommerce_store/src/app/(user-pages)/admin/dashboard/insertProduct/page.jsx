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
import { getProductImages, getPrimaryImageUrl } from "@/lib/productImages";
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
    images: [],
  });

  // Fetch products on page load or page/limit change
  useEffect(() => {
    dispatch(fetchProducts({ page, limit }));
  }, [dispatch, page, limit]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const invalid = files.find((f) => !f.type.startsWith("image/"));
    if (invalid) {
      toast.error("Please upload only image files");
      return;
    }

    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/upload-image", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to upload image");

        setForm((prev) => ({
          ...prev,
          images: [...(prev.images || []), data.url],
        }));
      }

      toast.success("Image(s) uploaded successfully! ✨");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!form.image_url) return toast.error("Enter an image URL to add");
    setForm((prev) => ({ ...prev, images: [...(prev.images || []), prev.image_url], image_url: "" }));
  };

  const removeImageAt = (i) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
  };

  const startEdit = (product) => {
    setEditingProductId(product.id);
    const parsedImages = getProductImages(product);
    setForm({
      ...product,
      images: parsedImages,
      image_url: "",
    });
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

  const saveProduct = () => {
    if (!form.name || !form.price || !form.category) {
      toast.error("Name, Price, and Category are required!");
      return;
    }

    if (editingProductId) {
      dispatch(editProduct({ id: editingProductId, productData: form }))
        .unwrap()
        .then(() => {
          cancelEdit();
          dispatch(fetchProducts({ page, limit }));
          toast.success("Product updated successfully!");
        })
        .catch((err) => {
          const errorMsg = typeof err === "string" ? err : err?.message || err?.error || "Failed to update product.";
          toast.error(errorMsg);
        });
    } else {
      dispatch(insertProduct({ productData: form }))
        .unwrap()
        .then(() => {
          setForm({
            product_no: "",
            name: "",
            price: "",
            category: "",
            stock: "",
            description: "",
            image_url: "",
            images: [],
          });
          dispatch(fetchProducts({ page, limit }));
          toast.success("Product added successfully!");
        })
        .catch((err) => {
          const errorMsg = typeof err === "string" ? err : err?.message || err?.error || "Failed to add product.";
          toast.error(errorMsg);
        });
    }
  };

  // inside handleDelete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct({ id }))
        .unwrap()
        .then(() => {
          dispatch(fetchProducts({ page, limit }));
          toast.success("Product deleted successfully!");
        })
        .catch((err) => {
          const errorMsg = typeof err === "string" ? err : err?.message || err?.error || "Failed to delete product.";
          toast.error(errorMsg);
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
          <div className="flex flex-wrap gap-2 mb-3">
            {["product_no", "name", "price", "category", "stock"].map(
              (field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.replace("_", " ")}
                  value={form[field]}
                  onChange={handleChange}
                  className="border p-2 rounded flex-1 min-w-[150px]"
                />
              )
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start mb-3">
            <div className="flex-1 w-full">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="image_url"
                  placeholder="Image URL (paste then click Add)"
                  value={form.image_url}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
                <button onClick={handleAddImageUrl} className="px-3 py-2 bg-gray-200 rounded">Add</button>
              </div>
              <div className="mt-2 text-sm text-neutral-600">Or upload one or more images from your desktop:</div>
            </div>
            <div className="w-full md:w-auto flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="image-file-upload"
                multiple
                disabled={uploading}
              />
              <label
                htmlFor="image-file-upload"
                className={`px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer transition bg-white hover:bg-gray-50 flex items-center gap-2 border-gray-300 ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-700">📁 Upload images</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {form.images && form.images.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {form.images.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded overflow-hidden border">
                  <img src={src} alt={`img-${i}`} className="w-full h-full object-cover" />
                  <button onClick={() => removeImageAt(i)} className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded">×</button>
                </div>
              ))}
            </div>
          )}

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-3"
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
                        <td className="px-4 py-3">Rs. {product.price}</td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3">{product.stock}</td>
                        <td className="px-4 py-3">{product.description}</td>
                        <td className="px-4 py-3">
                          {(() => {
                            const productImgs = getProductImages(product);
                            const primaryImg = productImgs[0];
                            return (
                              <div className="flex items-center gap-2">
                                <img
                                  src={primaryImg}
                                  alt={product.name}
                                  className="w-14 h-14 object-cover rounded border"
                                />
                                {productImgs.length > 1 && (
                                  <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                                    +{productImgs.length - 1}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
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
