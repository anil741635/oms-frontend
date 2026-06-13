import AddCustomer from "./components/customerCrud/AddCustomer";
import CustomerList from "./components/customerCrud/CustomerList";
import DeleteCustomer from "./components/customerCrud/DeleteCustomer";
import UpdateCustomer from "./components/customerCrud/UpdateCustomer";
import AddOrder from "./components/order/AddOrder";
import DeleteOrder from "./components/order/DeleteOrder";
import OrderList from "./components/order/OrderList";
import UpdateOrder from "./components/order/UpdateOrder";
import AddOrderItem from "./components/orderitem/AddOrderItem";
import DeleteOrderItem from "./components/orderitem/DeleteOrderItem";
import OrderItemList from "./components/orderitem/OrderItemList";
import UpdateOrderItem from "./components/orderitem/UpdateOrderItem";
import AddProduct from "./components/productCrud/AddProduct";
import DeleteProduct from "./components/productCrud/DeleteProduct";
import ProductList from "./components/productCrud/ProductList";
import UpdateProduct from "./components/productCrud/UpdateProduct";
function App(){
  return(
    <>
    <CustomerList/>
    <AddCustomer/>
    <DeleteCustomer/>
    <UpdateCustomer/>
    <ProductList/>
    <AddProduct/>
    <UpdateProduct/>
    <DeleteProduct/>
    <OrderList/>
    <AddOrder/>
    <UpdateOrder/>
    <DeleteOrder/>
    <OrderItemList/>
    <AddOrderItem/>
    <UpdateOrderItem/>
    <DeleteOrderItem/>
    </>
  )
}
export default App;