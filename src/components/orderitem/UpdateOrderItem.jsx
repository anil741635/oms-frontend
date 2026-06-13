import { useState } from "react";

function UpdateOrderItem(){
    const[id,setId]=useState("");
    const[orderItem,setOrderItem]=useState({
        quantity:"",
        price:"",
        orderId:"",
        productId:""
    });
    const handleChange=(e)=>{
        setOrderItem({...orderItem,[e.target.name]:e.target.value

        });
    };
    const updateOrderItem=()=>{
        const data={
            quantity:orderItem.quantity,
           order:{
            id:orderItem.orderId
           },
            product:{
                id:orderItem.productId
            }
        };
        fetch(`http://localhost:8080/orderitems/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })
        .then(async (res) => {
            const data = await res.json();
            alert("orderItem updated successfully");
        })
        .catch(error => console.log(error));
    }
    return(
        <div className="form-box">
            <h2>update orderItem</h2>
            <input type="number" placeholder="id" onChange={(e)=>setId(e.target.value)}></input>
            <input type="number" name="quantity" placeholder="quantity"
            onChange={handleChange}></input>
            <br></br>
            <input type="number" name="orderId" placeholder="order id"
            onChange={handleChange}></input>
            <br></br>
            <input type="number" name="productId" placeholder="prodcut id"
            onChange={handleChange}></input>
            <br></br>
            <button onClick={updateOrderItem}>save</button>
        </div>
    )
}
export default UpdateOrderItem;