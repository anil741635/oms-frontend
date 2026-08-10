import { useEffect, useState } from "react";
import { customerApi, orderApi, orderItemApi, productApi } from "../api/client";
import EmptyState from "../components/common/EmptyState";
import Icon from "../components/common/Icon";
import Spinner from "../components/common/Spinner";
import StatCard from "../components/common/StatCard";

function Dashboard({ onNavigate }) {
  const [data, setData] = useState({ customers: [], products: [], orders: [], orderItems: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [customers, products, orders, orderItems] = await Promise.all([
          customerApi.getAll(),
          productApi.getAll(),
          orderApi.getAll(),
          orderItemApi.getAll(),
        ]);
        if (!cancelled) {
          setData({
            customers: customers || [],
            products: products || [],
            orders: orders || [],
            orderItems: orderItems || [],
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Spinner label="Loading dashboard..." />;

  if (error) {
    return (
      <div className="alert alert-error">
        <Icon name="alert" size={18} />
        <span>{error}</span>
      </div>
    );
  }

  const { customers, products, orders, orderItems } = data;
  const revenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const lowStock = products.filter((p) => Number(p.stock) <= 5);
  const recentOrders = [...orders].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5);

  return (
    <div className="page">
      <div className="stat-grid">
        <StatCard icon="users" label="Total Customers" value={customers.length} />
        <StatCard icon="box" label="Total Products" value={products.length} />
        <StatCard icon="cart" label="Total Orders" value={orders.length} />
        <StatCard icon="package" label="Revenue" value={`₹${revenue.toLocaleString()}`} tone="success" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <button className="link-btn" onClick={() => onNavigate("orders")}>
              View all
            </button>
          </div>
          {recentOrders.length === 0 ? (
            <EmptyState icon="cart" title="No orders yet" message="Orders will appear here once created." />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>#{o.customer?.id ?? "-"}</td>
                    <td>₹{Number(o.totalAmount || 0).toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${(o.status || "").toLowerCase()}`}>{o.status || "—"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Low Stock Products</h3>
            <button className="link-btn" onClick={() => onNavigate("products")}>
              View all
            </button>
          </div>
          {lowStock.length === 0 ? (
            <EmptyState icon="box" title="All stocked up" message="No products are running low." />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>{p.name}</td>
                    <td>
                      <span className="badge badge-cancelled">{p.stock}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Order Items Overview</h3>
          <button className="link-btn" onClick={() => onNavigate("orderitems")}>
            View all
          </button>
        </div>
        <p className="muted">
          {orderItems.length} item{orderItems.length === 1 ? "" : "s"} across all orders.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
