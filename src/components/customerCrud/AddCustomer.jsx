import "./Customer.css";
import { useState } from "react";

function AddCustomer(){
    const[customer,setCustomer]=useState({
        name:"",
        phone:"",
        email:""
    });
    const handleChange=(e)=>{
        setCustomer({...customer,[e.target.name]:e.target.value
        });
    };
    const saveCustomer=()=>{
        fetch("http://localhost:8080/customers",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(customer)
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            alert("new customer added succesfully");
        })
    };
    return (
        <div className="form-box customer">
            <h2>add customer</h2>
            <input name="name" 
            placeholder="enter customer name"
             onChange={handleChange}>
             </input>
            <br></br>
             <input name="phone" 
            placeholder="customer phone number"
             onChange={handleChange}>
             </input>
            <br></br>
             <input name="email" 
            placeholder="enter email"
             onChange={handleChange}>
             </input>
             <br></br>
             <button onClick={()=>saveCustomer()}>save customer</button>
        </div>
    );

}
export default AddCustomer;