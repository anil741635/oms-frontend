import { useState } from "react";

function AddProduct(){
    const[product,setProduct]=useState({
        name:"",
        price:"",
        stock:""

    });
    const handleChange=(e)=>{
            setProduct({...product,[e.target.name]:e.target.value
        });
    };
    const saveProduct=()=>{
        fetch("http://localhost:8080/products",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(product)
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            alert("product added successfully");
        })
    }
    return(
        <div className="form-box product">
            <h2>add product</h2>
            <input name="name" placeholder="product name" onChange={handleChange}></input>
            <br>
            </br>
            <input name="price" placeholder="price" onChange={handleChange}></input>
            <br></br>
            <input name="stock" placeholder="stock" onChange={handleChange}></input>
            <br></br>
            <button onClick={saveProduct}>save</button>
        </div>
    )
}
export default AddProduct;