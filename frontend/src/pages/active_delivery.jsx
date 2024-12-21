import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';

function ActiveDelivery() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [code, setCode] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('token');
        axios
            .get('http://localhost:8000/backend1/active-delivery/', {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                setDeliveries(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleAcceptDelivery = (deliveryId) => {
        const token = localStorage.getItem('token');

        const response = axios.post(`http://localhost:8000/backend1/delivery_authentication/`, {
            headers: { Authorization: `Token ${token}` }, 
            code: code
        });
        console.log(response);
    };
    const handleChange = (e) => {
        setCode(e.target.value);
    };
    return (
        <div className="active-delivery">
            <h1>Active Deliveries</h1>
            {deliveries.length === 0 ? (
                <p>No active deliveries found.</p>
            ) : (
                deliveries.map(delivery => (
                    <div key={delivery.id} style={{ marginBottom: "1rem" }}>
                        <h2>{delivery.product?.name}</h2>
                        <p>{delivery.product?.description}</p>
                        <p>Price: {delivery.product?.price}</p>
                        <p>Dropoff Location: {delivery.product?.dropoff_location}</p>
                        <p>Pickup Location: {delivery.product?.pickup_location}</p>
                        <form onSubmit={handleAcceptDelivery(delivery.id)}>
                            <input type = "text" placeholder = "Enter authentication code from customer" name = "code" onChange={handleChange} value={code}/>
                            <button type = "submit">Complete Delivery</button>
                        </form>
                    </div>
                ))
            )}
        </div>
    );
}

export default ActiveDelivery;