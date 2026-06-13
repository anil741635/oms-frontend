import "./Customer.css";
import { useEffect, useState } from "react";

function CustomerList() {

    const [customer, setCustomer] = useState([]);
    const [id, setId] = useState("");
    const [cust, setCust] = useState(null);

    useEffect(() => {
        fetchCustomer();
    }, []);

    const fetchCustomer = () => {
        fetch("http://localhost:8080/customers")
            .then((res) => res.json())
            .then((data) => setCustomer(data));
    };

    const getCustomer = () => {
        fetch(`http://localhost:8080/customers/${id}`)
            .then((res) => res.json())
            .then((data) => setCust(data))
            .catch(err => console.log(err));
    };

    return (
        <div className="form-box">

            <h2>Search Customer By ID</h2>

            <input
                placeholder="ID"
                onChange={(e) => setId(e.target.value)}
            />

            <button onClick={getCustomer}>
                Search Customer
            </button>

            {cust && (
                <div>
                    <p>ID: {cust.id}</p>
                    <p>Name: {cust.name}</p>
                    <p>Phone: {cust.phone}</p>
                    <p>Email: {cust.email}</p>
                </div>
            )}

            <h2>Customers</h2>
            
            <table border={3}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                    </tr>
                </thead>

                <tbody>
                    {customer.map((cust) => (
                        <tr key={cust.id}>
                            <td>{cust.id}</td>
                            <td>{cust.name}</td>
                            <td>{cust.phone}</td>
                            <td>{cust.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default CustomerList;