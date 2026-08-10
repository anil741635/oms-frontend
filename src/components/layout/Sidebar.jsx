import Icon from "../common/Icon";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "grid" },
  { key: "customers", label: "Customers", icon: "users" },
  { key: "products", label: "Products", icon: "box" },
  { key: "orders", label: "Orders", icon: "cart" },
  { key: "orderitems", label: "Order Items", icon: "list" },
];

function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">OM</span>
        <span className="brand-name">OrderHub</span>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${active === item.key ? "active" : ""}`}
            onClick={() => onNavigate(item.key)}
          >
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Order Management System</p>
        <p className="sidebar-version">v1.0</p>
      </div>
    </aside>
  );
}

export default Sidebar;
export { NAV_ITEMS };
