import { useState } from "react";
import Navbar from "./components/Navbar";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";

export default function App() {
  const [active, setActive] = useState("dashboard");

  const pages = {
    dashboard: <Dashboard />,
    products: <Products />,
    customers: <Customers />,
    orders: <Orders />
  };

  return (
    <div className="min-h-screen md:flex">
      <Navbar active={active} onChange={setActive} />
      <main className="flex-1 p-4 md:p-8">{pages[active]}</main>
    </div>
  );
}
