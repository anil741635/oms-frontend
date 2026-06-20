import { useState } from "react";

function AddOrder(){
    const[order,setOrder]=useState({
        totalAmount:"",
        orderDate:"",
        status:"",
        customerId:""
    })
    const handleChange=(e)=>{
        setOrder({...order,[e.target.name]:e.target.value
        });
    };
    const addOrder=()=>{
        const orderData={
            totalAmount:order.totalAmount,
            orderDate:order.orderDate,
            status:order.status,
            customer:{
                id:order.customerId
            }
        }
        fetch(`http://localhost:8080/orders/${order.customerId}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(orderData)
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            alert("order added");
        })
        .catch(error=>console.log(error.message))
    }
    return(
        <div className="form-box order">
            <h2>add order</h2>
            <input type="number" name="totalAmount" placeholder="total amount" 
            onChange={handleChange}></input>
            <br></br>
            <input type="date" name="orderDate" placeholder="order date" 
            onChange={handleChange}></input>
            <br></br>
            <input type="text" name="status" placeholder="status" 
            onChange={handleChange}></input>
            <br></br>
            <input type="number" name="customerId" placeholder="customer id"
            onChange={handleChange}></input>
            <br></br>
            <button onClick={addOrder}>save</button>
        </div>
    )
}
export default AddOrder;