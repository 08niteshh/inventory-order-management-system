import { Boxes, LayoutDashboard, ShoppingCart, Users } from "lucide-react";

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Boxes },
  { id: "customers", label: "Customers", icon: Users },
  { id: "orders", label: "Orders", icon: ShoppingCart }
];

export default function Navbar({ active, onChange }) {
  return (
    <aside className="w-full border-b bg-white p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <h1 className="mb-5 text-xl font-bold text-slate-900">Inventory System</h1>
      <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                active === item.id ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
