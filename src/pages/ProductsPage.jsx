import { useMemo, useState } from "react";
import { productApi } from "../api/client";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Icon from "../components/common/Icon";
import Modal from "../components/common/Modal";
import Spinner from "../components/common/Spinner";
import { useEntityData } from "../hooks/useEntityData";

const EMPTY_FORM = { name: "", price: "", stock: "" };

function ProductsPage() {
  const { items, loading, error, create, update, remove } = useEntityData(productApi, { label: "Product" });
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
    return items.filter((p) => String(p.id).includes(q) || (p.name || "").toLowerCase().includes(q));
  }, [items, search]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({ name: product.name || "", price: product.price ?? "", stock: product.stock ?? "" });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (form.price === "" || Number(form.price) < 0) errs.price = "Enter a valid price";
    if (form.stock === "" || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock)))
      errs.stock = "Enter a valid stock quantity";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = { name: form.name, price: Number(form.price), stock: Number(form.stock) };
    const ok = editing ? await update(editing.id, payload) : await create(payload);
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
          <input placeholder="Search by name or ID" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Icon name="plus" size={16} /> Add Product
        </button>
      </div>

      <div className="card">
        {loading ? (
          <Spinner label="Loading products..." />
        ) : error ? (
          <div className="alert alert-error">
            <Icon name="alert" size={18} />
            <span>{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="box"
            title="No products found"
            message={search ? "Try a different search." : "Add your first product to get started."}
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>{p.name}</td>
                  <td>₹{Number(p.price || 0).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${Number(p.stock) <= 5 ? "badge-cancelled" : "badge-delivered"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="icon-btn" onClick={() => openEdit(p)} aria-label="Edit">
                      <Icon name="edit" size={16} />
                    </button>
                    <button className="icon-btn danger" onClick={() => setPendingDelete(p)} aria-label="Delete">
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
          title={editing ? "Edit Product" : "Add Product"}
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
                placeholder="e.g. Wireless Mouse"
              />
              {formErrors.name && <span className="field-error">{formErrors.name}</span>}
            </label>
            <label>
              Price
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. 799"
              />
              {formErrors.price && <span className="field-error">{formErrors.price}</span>}
            </label>
            <label>
              Stock
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="e.g. 25"
              />
              {formErrors.stock && <span className="field-error">{formErrors.stock}</span>}
            </label>
          </form>
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          message={`Delete product "${pendingDelete.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

export default ProductsPage;
