import { useEffect, useState } from "react";
import api from "../api/client";
import Badge from "../components/Badge";
import Modal from "../components/Modal";

const emptyForm = { name: "", sku: "", description: "", price: 0, stock_quantity: 0, category: "" };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const load = () => api.get("/products").then((res) => setProducts(res.data));

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setForm(product);
    setEditing(product.id);
    setError("");
    setModalOpen(true);
  };

  const save = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), stock_quantity: Number(form.stock_quantity) };
      if (editing) await api.put(`/products/${editing}`, payload);
      else await api.post("/products", payload);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save product");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-slate-600">Manage SKUs, pricing, and inventory stock.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>Add Product</button>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-4">Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-4 font-semibold">{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.category || "-"}</td>
                <td>${Number(product.price).toFixed(2)}</td>
                <td><Badge type={product.stock_quantity <= 5 ? "low" : "ok"}>{product.stock_quantity}</Badge></td>
                <td className="space-x-2">
                  <button className="btn btn-secondary" onClick={() => openEdit(product)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => remove(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <Modal title={editing ? "Edit Product" : "Add Product"} onClose={() => setModalOpen(false)}>
          {error && <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            {["name", "sku", "category"].map((field) => (
              <label key={field} className="text-sm font-semibold capitalize">
                {field}
                <input className="input mt-1" value={form[field] || ""} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required={field !== "category"} />
              </label>
            ))}
            <label className="text-sm font-semibold">
              Price
              <input className="input mt-1" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </label>
            <label className="text-sm font-semibold">
              Stock Quantity
              <input className="input mt-1" type="number" min="0" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} required />
            </label>
            <label className="text-sm font-semibold sm:col-span-2">
              Description
              <textarea className="input mt-1" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <div className="flex gap-2 sm:col-span-2">
              <button className="btn btn-primary" type="submit">Save</button>
              <button className="btn btn-secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
