const styles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  low: "bg-red-100 text-red-800",
  ok: "bg-green-100 text-green-800"
};

export default function Badge({ children, type = "ok" }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[type] || styles.ok}`}>
      {children}
    </span>
  );
}
