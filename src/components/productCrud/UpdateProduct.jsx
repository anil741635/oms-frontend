
import { useState } from "react";

function UpdateProduct(){
    const[id,setId]=useState("");
    const[product,setProduct]=useState({
        name:"",
        price:"",
        stock:""
    })
    const handleChange=(e)=>{
            setProduct({...product,[e.target.name]:e.target.value
        });
    };
    const updateProduct=()=>{
        fetch(`http://localhost:8080/products/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(product)
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            alert("product updated successfully");
        })
    }
    return(
        <div className="form-box">
            <h2>update product</h2>
            <input type="number" placeholder="product id" onChange={(e)=>setId(e.target.value)}></input>
            <br></br>
            <input name="name" placeholder="product name" onChange={handleChange}></input>
            <br>
            </br>
            <input name="price" placeholder="price" onChange={handleChange}></input>
            <br></br>
            <input name="stock" placeholder="stock" onChange={handleChange}></input>
            <br></br>
            <button onClick={updateProduct}>save</button>
        </div>
    )
}
export default UpdateProduct;