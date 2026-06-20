import { useState } from "react";

function DeleteOrder(){
    const[id,setId]=useState("");
    const deleteOrder=()=>{
        fetch(`http://localhost:8080/orders/${id}`,{
            method:"DELETE",
        })
        .then(()=>{
            alert("order deleted successfully");
        })
        .catch(error=>console.log(error.message))
    }
    return(
        <div className="form-box delete">
            <h2>delete order</h2>
            <input type="number" placeholder="id" onChange={(e)=>setId(e.target.value)}></input>
            <button onClick={deleteOrder}>delete order</button>
        </div>
    )
}
export default DeleteOrder;