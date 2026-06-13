import { useState } from "react";

function UpdateOrder(){
    const[id,setId]=useState("");
    const[order,setOrder]=useState({
        totalAmount:"",
        orderDate:"",
        status:"",
        customerId:""
    });
    const handleChange=(e)=>{
        setOrder({...order,[e.target.name]:e.target.value})
    }
    const updateOrder=()=>{
        const orderData={
            totalAmount:order.totalAmount,
            orderDate:order.orderDate,
            status:order.status,
            customer:{
                id:order.customerId
            }
        };
        fetch(`http://localhost:8080/orders/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(orderData)
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            alert("order updated successfully");
        })
        .catch(error=>console.log(error.message))
    }
    return(
        <div className="form-box">
            <h2> update order</h2>
            <input type="number" placeholder="id"
            onChange={(e)=>setId(e.target.value)}></input>
            <br></br>
            <input type="number" name="totalAmount" placeholder="total amount"
            onChange={handleChange}></input>
            <br></br>
            <input type="date" name="orderDate" placeholder="date"
            onChange={handleChange}></input>
            <br></br>
            <input type="text" name="status" placeholder="status"
            onChange={handleChange}></input>
            <br></br>
            <input type="number"name="customerId" placeholder="customer id"
            onChange={handleChange}></input>
            <br></br>
            <button onClick={updateOrder}>update order</button>
        </div>
    )
}
export default UpdateOrder;