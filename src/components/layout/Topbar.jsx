const TITLES = {
  dashboard: ["Dashboard", "Overview of your store performance"],
  customers: ["Customers", "Manage your customer records"],
  products: ["Products", "Manage your product catalog"],
  orders: ["Orders", "Track and manage customer orders"],
  orderitems: ["Order Items", "Manage the line items within orders"],
};

function Topbar({ page, userEmail }) {
  const [title, subtitle] = TITLES[page] || ["", ""];
  const initials = userEmail ? userEmail[0].toUpperCase() : "?";

  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>
        <p className="topbar-subtitle">{subtitle}</p>
      </div>
      <div className="topbar-user">
        <div className="user-avatar">{initials}</div>
        <div className="user-meta">
          <span className="user-name">Signed in as</span>
          <span className="user-email">{userEmail}</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
