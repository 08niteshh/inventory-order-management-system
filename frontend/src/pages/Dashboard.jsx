import { useEffect, useState } from "react";
import api from "../api/client";
import Badge from "../components/Badge";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data)).catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>;
  if (!data) return <div className="text-slate-600">Loading dashboard...</div>;

  const cards = [
    ["Products", data.total_products],
    ["Customers", data.total_customers],
    ["Orders", data.total_orders],
    ["Revenue", `$${Number(data.total_revenue).toFixed(2)}`]
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-600">Overview of inventory, customers, and sales.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold">Low Stock Alerts</h3>
          <div className="space-y-3">
            {data.low_stock_items.length === 0 && <p className="text-sm text-slate-500">No low stock products.</p>}
            {data.low_stock_items.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-slate-500">SKU: {product.sku}</p>
                </div>
                <Badge type="low">{product.stock_quantity} left</Badge>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-bold">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-2">Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="py-3">#{order.id}</td>
                    <td>{order.customer.name}</td>
                    <td><Badge type={order.status}>{order.status}</Badge></td>
                    <td>${Number(order.total_amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
