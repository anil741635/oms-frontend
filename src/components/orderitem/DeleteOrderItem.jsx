import { useState } from "react";

function DeleteOrderItem(){
    const[id,setId]=useState("");
    const deleteOrderItem=()=>{
        fetch(`http://localhost:8080/orderitems/${id}`,{
            method:"DELETE"
        })
        .then(()=>{
            alert("data deleted successfully")
        })
        .catch((error)=>console.log(error.message));
    };
    return(
        <div className="form-box delete">
            <h2> delete orderItem</h2>
            <input type="number" placeholder="id"
            onChange={(e)=>setId(e.target.value)}></input>
            <br></br>
            <button onClick={deleteOrderItem}>delete order item</button>
        </div>
    )
}
export default DeleteOrderItem;