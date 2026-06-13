import {useEffect, useState} from "react";
function ProductList(){
    const[products,setProducts]=useState([]);
    const[id,setId]=useState("");
    const[product,setProduct]=useState(null);
    useEffect(()=>{
        getProducts();
    },[])
    const getProducts=()=>{
        fetch("http://localhost:8080/products")
        .then((res)=>res.json())
        .then((data)=>setProducts(data))
        .catch(err=>console.log(err))
    }
    const getProduct=(id)=>{
        fetch(`http://localhost:8080/products/${id}`,)
        .then((res)=>res.json())
        .then((data)=>setProduct(data))
        .catch(err=>console.log(err))
    }
    return(
        <div className="form-box">
            <h2>search product by id</h2>
            <input type="number" placeholder="id" onChange={(e)=>setId(e.target.value)}></input>
            <button onClick={()=>getProduct(id)}>search product</button>
            {product &&(
                <div>
                    <p>ID:{product.id}</p>
                    <p>name:{product.name}</p>
                    <p>price:{product.price}</p>
                    <p>stock:{product.stock}</p>
                </div>
            )}
            <h2>all products</h2>
            <button onClick={getProducts}>get all products</button>
            <table border={2}>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>price</th>
                        <th>stock</th>
                    </tr>
                </thead>
                <tbody>
                     {products.map((pro)=>(
                    <tr key={pro.id}>
                        <td>{pro.id}</td>
                        <td>{pro.name}</td>
                        <td>{pro.price}</td>
                        <td>{pro.stock}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            
        </div>
    );

}
export default ProductList;