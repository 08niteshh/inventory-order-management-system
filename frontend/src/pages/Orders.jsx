import { useEffect, useState } from "react";
import api from "../api/client";
import Badge from "../components/Badge";
import Modal from "../components/Modal";

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ customer_id: "", items: [{ product_id: "", quantity: 1 }] });

  const load = async () => {
    const [orderRes, customerRes, productRes] = await Promise.all([
      api.get("/orders"),
      api.get("/customers"),
      api.get("/products")
    ]);
    setOrders(orderRes.data);
    setCustomers(customerRes.data);
    setProducts(productRes.data);
  };

  useEffect(() => { load(); }, []);

  const updateItem = (index, field, value) => {
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    setForm({ ...form, items });
  };

  const addLine = () => setForm({ ...form, items: [...form.items, { product_id: "", quantity: 1 }] });
  const removeLine = (index) => setForm({ ...form, items: form.items.filter((_, i) => i !== index) });

  const createOrder = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        customer_id: Number(form.customer_id),
        items: form.items.map((item) => ({ product_id: Number(item.product_id), quantity: Number(item.quantity) }))
      };
      await api.post("/orders", payload);
      setModalOpen(false);
      setForm({ customer_id: "", items: [{ product_id: "", quantity: 1 }] });
      setError("");
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to create order");
    }
  };

  const updateStatus = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this order?")) return;
    await api.delete(`/orders/${id}`);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-slate-600">Create orders and track fulfillment status.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Create Order</button>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
              <div>
                <h3 className="text-lg font-bold">Order #{order.id}</h3>
                <p className="text-sm text-slate-500">{order.customer.name} - ${Number(order.total_amount).toFixed(2)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge type={order.status}>{order.status}</Badge>
                <select className="input w-auto" value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}>
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <button className="btn btn-danger" onClick={() => remove(order.id)}>Delete</button>
              </div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-2">Product</th>
                    <th>SKU</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="py-3 font-semibold">{item.product.name}</td>
                      <td>{item.product.sku}</td>
                      <td>{item.quantity}</td>
                      <td>${Number(item.unit_price).toFixed(2)}</td>
                      <td>${Number(item.line_total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <Modal title="Create Order" onClose={() => setModalOpen(false)}>
          {error && <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={createOrder} className="space-y-4">
            <label className="text-sm font-semibold">
              Customer
              <select className="input mt-1" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} required>
                <option value="">Select customer</option>
                {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} ({customer.email})</option>)}
              </select>
            </label>
            <div className="space-y-3">
              {form.items.map((item, index) => (
                <div key={index} className="grid gap-3 rounded-xl border p-3 sm:grid-cols-[1fr_120px_auto]">
                  <select className="input" value={item.product_id} onChange={(e) => updateItem(index, "product_id", e.target.value)} required>
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - stock {product.stock_quantity}
                      </option>
                    ))}
                  </select>
                  <input className="input" type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} required />
                  <button className="btn btn-secondary" type="button" onClick={() => removeLine(index)} disabled={form.items.length === 1}>Remove</button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-secondary" type="button" onClick={addLine}>Add Product Line</button>
              <button className="btn btn-primary" type="submit">Create Order</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
