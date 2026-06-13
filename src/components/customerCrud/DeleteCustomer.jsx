import "./Customer.css";
import { useState } from "react";

function DeleteCustomer(){
    const[id,setId]=useState("");
    const deleteCustomer=()=>{
        fetch(`http://localhost:8080/customers/${id}`,{
            method:"DELETE",
        })
        .then(()=> alert("customer deleted successfully"));
    };
    return(
        <div className="form-box">
            <h2>delete customer by id</h2>
            <input type="number" placeholder="id" onChange={(e)=>setId(e.target.value)}></input>
            <button onClick={deleteCustomer}>delete customer</button>
        </div>
    )
}
export default DeleteCustomer;