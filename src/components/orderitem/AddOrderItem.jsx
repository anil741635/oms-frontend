import { useState } from "react";

function AddOrderItem() {
    const [orderItem, setOrderItem] = useState({
        quantity: "",
        price: "",
        orderId: "",
        productId: ""
    });

    const handleChange = (e) => {
        setOrderItem({
            ...orderItem,
            [e.target.name]: e.target.value
        });
    };

    const addOrderItem = () => {
        const data = {
            quantity: orderItem.quantity,
            order: {
                id: orderItem.orderId
            },
            product: {
                id: orderItem.productId
            }
        };

        fetch("http://localhost:8080/orderitems", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(async (res) => {
            const response = await res.json();
            if (!res.ok) {
                if (response.message?.includes("not enough stock")) {
                    alert("Not enough stock available");
                } else {
                    alert(response.message || "Failed to add order item");
                }
                return;
            }
            console.log(response);
            alert("Order Item Added Successfully");
        })
        .catch((error) => {
            console.log(error);
            alert("Server Error");
        });
    };

    return (
        <div className="form-box orderitem">
            <h2>Add Order Item</h2>
            <input type="number" name="quantity" placeholder="Quantity"
                onChange={handleChange}/>
            <br />
            <input type="number" name="orderId" placeholder="Order ID"
                onChange={handleChange}/>
            <br />
            <input  type="number"   name="productId"    placeholder="Product ID"
                onChange={handleChange}/>
            <br />
            <button onClick={addOrderItem}>Save</button>
        </div>
    );
}

export default AddOrderItem;