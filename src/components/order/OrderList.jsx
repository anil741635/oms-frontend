import { useEffect, useState } from "react";

function OrderList(){
    const[orders,setOrders]=useState([]);
    const[id,setId]=useState("");
    const[order,setOrder]=useState(null);
    useEffect(()=>{
        fetchOrders();
    },[]);
    const fetchOrders=()=>{
        fetch("http://localhost:8080/orders")
        .then(res=>res.json())
        .then(data=>setOrders(data))
        .catch(error=>console.log(error.message))
    }
    const getOrder=()=>{
        fetch(`http://localhost:8080/orders/${id}`)
        .then(res=>res.json())
        .then(data=>setOrder(data))
        .catch(error=>console.log(error.message))
    }
    return(
        <div className="form-box">
            <h2> get order by id</h2>
            <input name="id" placeholder="id" value={id} onChange={(e)=>setId(e.target.value)}></input>
            <button onClick={getOrder}>get order</button>
            {order &&(
                <div>
                    <h3>order details</h3>
                    <p>ID:{order.id}</p>
                    <p>amount:{order.totalAmount}</p>
                    <p>order_date:{order.orderDate}</p>
                    <p>status:{order.status}</p>
                    <p>customer_id:{order.customer?.id}</p>
                    </div>
            )}
           
            <button onClick={fetchOrders}>get all orders</button>
            <table border="1">
                <thead>
                    <tr>
                        <td>id</td>
                        <td>amount</td>
                        <td>order date</td>
                        <td>status</td>
                        <td>customer id</td>
                    </tr>
                </thead>
                <tbody> 
                    {orders.map((order)=>(
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.totalAmount}</td>
                            <td>{order.orderDate}</td>
                            <td>{order.status}</td>
                            <td>{order.customer?.id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default OrderList;