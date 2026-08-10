import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout({ page, onNavigate, userEmail, children }) {
  return (
    <div className="app-shell">
      <Sidebar active={page} onNavigate={onNavigate} />
      <div className="app-main">
        <Topbar page={page} userEmail={userEmail} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
