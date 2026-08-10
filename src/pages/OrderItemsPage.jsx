import { useEffect, useMemo, useState } from "react";
import { orderApi, orderItemApi, productApi } from "../api/client";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Icon from "../components/common/Icon";
import Modal from "../components/common/Modal";
import Spinner from "../components/common/Spinner";
import { useEntityData } from "../hooks/useEntityData";

const emptyForm = () => ({ quantity: "", orderId: "", productId: "" });

function buildPayload(form) {
  return {
    quantity: Number(form.quantity),
    order: { id: Number(form.orderId) },
    product: { id: Number(form.productId) },
  };
}

function OrderItemsPage() {
  const { items, loading, error, create, update, remove } = useEntityData(orderItemApi, {
    label: "Order item",
    createFn: (form) => orderItemApi.create(buildPayload(form)),
    updateFn: (id, form) => orderItemApi.update(id, buildPayload(form)),
  });

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [formErrors, setFormErrors] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    orderApi
      .getAll()
      .then(setOrders)
      .catch(() => setOrders([]));
    productApi
      .getAll()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        String(i.id).includes(q) ||
        String(i.order?.id ?? "").includes(q) ||
        String(i.product?.id ?? "").includes(q)
    );
  }, [items, search]);

  const productName = (id) => products.find((p) => p.id === id)?.name;
  const selectedProduct = products.find((p) => p.id === Number(form.productId));

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ quantity: item.quantity ?? "", orderId: item.order?.id ?? "", productId: item.product?.id ?? "" });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.orderId) errs.orderId = "Select an order";
    if (!form.productId) errs.productId = "Select a product";
    if (form.quantity === "" || Number(form.quantity) <= 0) errs.quantity = "Enter a valid quantity";
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
            placeholder="Search by item, order or product ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Icon name="plus" size={16} /> Add Order Item
        </button>
      </div>

      <div className="card">
        {loading ? (
          <Spinner label="Loading order items..." />
        ) : error ? (
          <div className="alert alert-error">
            <Icon name="alert" size={18} />
            <span>{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="list" title="No order items found" message="Add products to an order to see them here." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Order</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td>#{i.id}</td>
                  <td>#{i.order?.id ?? "-"}</td>
                  <td>{productName(i.product?.id) || `#${i.product?.id ?? "-"}`}</td>
                  <td>{i.quantity}</td>
                  <td>₹{Number(i.price || 0).toLocaleString()}</td>
                  <td className="actions-cell">
                    <button className="icon-btn" onClick={() => openEdit(i)} aria-label="Edit">
                      <Icon name="edit" size={16} />
                    </button>
                    <button className="icon-btn danger" onClick={() => setPendingDelete(i)} aria-label="Delete">
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
          title={editing ? "Edit Order Item" : "Add Order Item"}
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
              Order
              <select value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })}>
                <option value="">Select an order</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    #{o.id} — ₹{o.totalAmount}
                  </option>
                ))}
              </select>
              {formErrors.orderId && <span className="field-error">{formErrors.orderId}</span>}
            </label>
            <label>
              Product
              <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
                <option value="">Select a product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} — {p.name} (stock: {p.stock})
                  </option>
                ))}
              </select>
              {formErrors.productId && <span className="field-error">{formErrors.productId}</span>}
            </label>
            <label>
              Quantity
              <input
                type="number"
                min="1"
                step="1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="e.g. 2"
              />
              {formErrors.quantity && <span className="field-error">{formErrors.quantity}</span>}
              {selectedProduct && Number(form.quantity) > Number(selectedProduct.stock) && (
                <span className="field-warning">Only {selectedProduct.stock} in stock</span>
              )}
            </label>
          </form>
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          message={`Delete order item #${pendingDelete.id}? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

export default OrderItemsPage;
