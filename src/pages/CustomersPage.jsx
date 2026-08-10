import { useMemo, useState } from "react";
import { customerApi } from "../api/client";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Icon from "../components/common/Icon";
import Modal from "../components/common/Modal";
import Spinner from "../components/common/Spinner";
import { useEntityData } from "../hooks/useEntityData";

const EMPTY_FORM = { name: "", phone: "", email: "" };

function CustomersPage() {
  const { items, loading, error, create, update, remove } = useEntityData(customerApi, { label: "Customer" });
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (c) =>
        String(c.id).includes(q) ||
        (c.name || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.phone || "").includes(q)
    );
  }, [items, search]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (customer) => {
    setEditing(customer);
    setForm({ name: customer.name || "", phone: customer.phone || "", email: customer.email || "" });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
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

  return (
    <div className="page">
      <div className="page-toolbar">
        <div className="search-box">
          <Icon name="search" size={16} />
          <input
            placeholder="Search by name, email, phone or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Icon name="plus" size={16} /> Add Customer
        </button>
      </div>

      <div className="card">
        {loading ? (
          <Spinner label="Loading customers..." />
        ) : error ? (
          <div className="alert alert-error">
            <Icon name="alert" size={18} />
            <span>{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="users"
            title="No customers found"
            message={search ? "Try a different search." : "Add your first customer to get started."}
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td className="actions-cell">
                    <button className="icon-btn" onClick={() => openEdit(c)} aria-label="Edit">
                      <Icon name="edit" size={16} />
                    </button>
                    <button className="icon-btn danger" onClick={() => setPendingDelete(c)} aria-label="Delete">
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
          title={editing ? "Edit Customer" : "Add Customer"}
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
              Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Priya Sharma"
              />
              {formErrors.name && <span className="field-error">{formErrors.name}</span>}
            </label>
            <label>
              Phone
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. 9876543210"
              />
              {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. priya@example.com"
              />
              {formErrors.email && <span className="field-error">{formErrors.email}</span>}
            </label>
          </form>
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          message={`Delete customer "${pendingDelete.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

export default CustomersPage;
