import { useEffect, useMemo, useState } from "react";
import { customerApi, orderApi } from "../api/client";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Icon from "../components/common/Icon";
import Modal from "../components/common/Modal";
import Spinner from "../components/common/Spinner";
import { useEntityData } from "../hooks/useEntityData";

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const emptyForm = () => ({
  totalAmount: "",
  orderDate: new Date().toISOString().slice(0, 10),
  status: "PENDING",
  customerId: "",
});

function buildPayload(form) {
  return {
    totalAmount: Number(form.totalAmount),
    orderDate: form.orderDate,
    status: form.status,
    customer: { id: Number(form.customerId) },
  };
}

function OrdersPage() {
  const { items, loading, error, create, update, remove } = useEntityData(orderApi, {
    label: "Order",
    createFn: (form) => orderApi.create(form.customerId, buildPayload(form)),
    updateFn: (id, form) => orderApi.update(id, buildPayload(form)),
  });

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [formErrors, setFormErrors] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    customerApi
      .getAll()
      .then(setCustomers)
      .catch(() => setCustomers([]));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((o) => {
      const matchesSearch = !q || String(o.id).includes(q) || String(o.customer?.id ?? "").includes(q);
      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (order) => {
    setEditing(order);
    setForm({
      totalAmount: order.totalAmount ?? "",
      orderDate: order.orderDate ?? "",
      status: order.status ?? "PENDING",
      customerId: order.customer?.id ?? "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (form.totalAmount === "" || Number(form.totalAmount) < 0) errs.totalAmount = "Enter a valid amount";
    if (!form.orderDate) errs.orderDate = "Order date is required";
    if (!form.customerId) errs.customerId = "Select a customer";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const ok = editing ? await update(editing.id, form) : await create(form);
    setSaving(false);
    if (ok) setModalOpen(false);
  };

  const handleDelete = async () => {
    const ok = await remove(pendingDelete.id);
    if (ok) setPendingDelete(null);
  };

  const customerName = (id) => customers.find((c) => c.id === id)?.name;

  return (
    <div className="page">
      <div className="page-toolbar">
        <div className="search-box">
          <Icon name="search" size={16} />
          <input
            placeholder="Search by order or customer ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={openAdd}>
          <Icon name="plus" size={16} /> Add Order
        </button>
      </div>

      <div className="card">
        {loading ? (
          <Spinner label="Loading orders..." />
        ) : error ? (
          <div className="alert alert-error">
            <Icon name="alert" size={18} />
            <span>{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="cart" title="No orders found" message="Try adjusting filters or add a new order." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{customerName(o.customer?.id) || `#${o.customer?.id ?? "-"}`}</td>
                  <td>₹{Number(o.totalAmount || 0).toLocaleString()}</td>
                  <td>{o.orderDate}</td>
                  <td>
                    <span className={`badge badge-${(o.status || "").toLowerCase()}`}>{o.status}</span>
                  </td>
                  <td className="actions-cell">
                    <button className="icon-btn" onClick={() => openEdit(o)} aria-label="Edit">
                      <Icon name="edit" size={16} />
                    </button>
                    <button className="icon-btn danger" onClick={() => setPendingDelete(o)} aria-label="Delete">
                      <Icon name="trash" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal
          title={editing ? "Edit Order" : "Add Order"}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          }
        >
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Customer
              <select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
                <option value="">Select a customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.id} — {c.name}
                  </option>
                ))}
              </select>
              {formErrors.customerId && <span className="field-error">{formErrors.customerId}</span>}
            </label>
            <label>
              Total Amount
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.totalAmount}
                onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                placeholder="e.g. 1499"
              />
              {formErrors.totalAmount && <span className="field-error">{formErrors.totalAmount}</span>}
            </label>
            <label>
              Order Date
              <input
                type="date"
                value={form.orderDate}
                onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
              />
              {formErrors.orderDate && <span className="field-error">{formErrors.orderDate}</span>}
            </label>
            <label>
              Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </form>
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          message={`Delete order #${pendingDelete.id}? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

export default OrdersPage;
