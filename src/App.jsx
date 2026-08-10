import { useEffect, useState } from "react";
import Layout from "./components/layout/Layout";
import { ToastProvider } from "./context/ToastProvider";
import Dashboard from "./pages/Dashboard";
import CustomersPage from "./pages/CustomersPage";
import OrderItemsPage from "./pages/OrderItemsPage";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import "./App.css";

const PAGES = {
  dashboard: Dashboard,
  customers: CustomersPage,
  products: ProductsPage,
  orders: OrdersPage,
  orderitems: OrderItemsPage,
};

function getPageFromHash() {
  const hash = window.location.hash.replace("#/", "").trim();
  return PAGES[hash] ? hash : "dashboard";
}

function App() {
  const [page, setPage] = useState(getPageFromHash);

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (key) => {
    window.location.hash = `/${key}`;
    setPage(key);
  };

  const PageComponent = PAGES[page];

  return (
    <ToastProvider>
      <Layout page={page} onNavigate={navigate} userEmail="anil@gmail.com">
        <PageComponent onNavigate={navigate} />
      </Layout>
    </ToastProvider>
  );
}

export default App;
