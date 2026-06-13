import "./Customer.css";
import { useState } from "react";

function UpdateCustomer(){
    const[id,setId]=useState("");
    const[name,setName]=useState("");
    const[phone,setPhone]=useState("");
    const[email,setEmail]=useState("");
    const update=()=>{
        fetch(`http://localhost:8080/customers/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                phone:phone,
                email:email
            })
        })
        .then((res)=>res.json())
        .then((data)=>console.log(data));
    }
    return(
        <div className="form-box">
            <h2>update customer</h2>
            <input placeholder="customer id" onChange={(e)=>setId(e.target.value)}></input>
            <br></br>
            <input placeholder="name" onChange={(e)=>setName(e.target.value)}></input>
            <br>
            </br>
            <input placeholder="phone" onChange={(e)=>setPhone(e.target.value)}></input>
            <br></br>
            <input placeholder="email" onChange={(e)=>setEmail(e.target.value)}></input>
            <br></br>
            <button onClick={update}> update save</button>
        </div>
    )
}
export default UpdateCustomer;