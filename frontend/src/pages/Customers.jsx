import { useEffect, useState } from "react";
import api from "../api/client";
import Modal from "../components/Modal";

const emptyForm = { name: "", email: "", phone: "", address: "" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const load = () => api.get("/customers").then((res) => setCustomers(res.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (customer) => {
    setForm(customer);
    setEditing(customer.id);
    setError("");
    setModalOpen(true);
  };

  const save = async (event) => {
    event.preventDefault();
    try {
      if (editing) await api.put(`/customers/${editing}`, form);
      else await api.post("/customers", form);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save customer");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this customer?")) return;
    await api.delete(`/customers/${id}`);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Customers</h2>
          <p className="text-slate-600">Manage customer contact information.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>Add Customer</button>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t">
                <td className="p-4 font-semibold">{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone || "-"}</td>
                <td>{customer.address || "-"}</td>
                <td className="space-x-2">
                  <button className="btn btn-secondary" onClick={() => openEdit(customer)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => remove(customer.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <Modal title={editing ? "Edit Customer" : "Add Customer"} onClose={() => setModalOpen(false)}>
          {error && <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Name
              <input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="text-sm font-semibold">
              Email
              <input className="input mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label className="text-sm font-semibold">
              Phone
              <input className="input mt-1" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label className="text-sm font-semibold">
              Address
              <input className="input mt-1" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
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
