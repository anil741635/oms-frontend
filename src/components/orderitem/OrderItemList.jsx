import { useState } from "react";

function OrderItemList(){
    const[orderItems,setOrderItems]=useState([])
    const[id,setId]=useState("");
    const[orderItem,setOrderItem]=useState(null);
    const fetchOrderItmes=()=>{
        fetch("http://localhost:8080/orderitems")
        .then(res=>res.json())
        .then(data=>setOrderItems(data))
        .catch(error=>console.log(error.message))
    }
    const getOrderItem=()=>{
        fetch(`http://localhost:8080/orderitems/${id}`)
        .then(res=>res.json())
        .then(data=> setOrderItem(data))
        .catch(error=>console.log(error.message))
    };
    return(
        <div className="form-box">
            <h2>get orderItem by id</h2>
            <input type="number" placeholder="id" onChange={(e)=>setId(e.target.value)}></input>
            <br></br>
            <button onClick={getOrderItem}>get orderitem</button>
            {orderItem && (
                <div>
                    <h3> order item details</h3>
                    <p>ID:{orderItem.id}</p>
                    <p>quantity:{orderItem.quantity}</p>
                    <p>order id:{orderItem.order?.id}</p>
                    <p>product id:{orderItem.product?.id}</p>
                    </div>
            )}
            <h2>get all orderItems</h2>
            <button onClick={fetchOrderItmes}>get all orderItems</button>
            <table border="1">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>quantity</th>
                        <th>price</th>
                        <th>order id</th>
                        <th>prodcut id</th>
                    </tr>
                </thead>
                <tbody>{
                orderItems.map((item)=>(
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                        <td>{item.order?.id}</td>
                        <td>{item.product?.id}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
export default OrderItemList;