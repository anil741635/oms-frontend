import { useState } from "react";

function DeleteProduct(){
    const[id,setId]=useState("");
    const deleteProduct=()=>{
        fetch(`http://localhost:8080/products/${id}`,{
            method:"DELETE",
        })
        .then((res)=>res.text())
        .then((data)=>{
            console.log(data)
            alert("data deleted successfully");
        })
        .catch(err=>console.log(err))
    }
    return(
        <div className="form-box">
            <h2>delete product</h2>
            <input type="number" name="id" placeholder="id" onChange={(e)=>setId(e.target.value)}></input>
            <br></br>
            <button onClick={deleteProduct}>delete</button>
        </div>
    )
}
export default DeleteProduct;