import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';

function ActiveDelivery() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [code, setCode] = useState('');
    const token = localStorage.getItem('token');
    const [delivering, setDelivering] = useState(false);


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

        if (deliveries.length === 0) {
            setDelivering(false);
        }else{
            setDelivering(true);
        }
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleAcceptDelivery = async (e, delivery) => {
        e.preventDefault(); // Prevent default form submission
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        try {
            const response = await axios.post(
                'http://localhost:8000/backend1/delivery_authentication/',
                {
                    code: code,
                    product_id: delivery.product.id,
                    user: user
                },
                {
                    headers: { Authorization: `Token ${token}` }
                }
            );

            if (response.data.message === 'success') {
                alert('Delivery accepted');
                // Optionally, update the state to remove the completed delivery
                setDeliveries(deliveries.filter(d => d.id !== delivery.id));
            } else {
                alert('Delivery failed');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred while completing the delivery');
        }
    };
    


    const handleChange = (e) => {
        setCode(e.target.value);
    };

    return (
        <div className="active-delivery">
            <h1>Active Deliveries</h1>
            <p> Delivering Status: {delivering ? 'Active' : 'Inactive'}</p>
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
                        <p>Quantity: {delivery.product?.quantity}</p>
                        <form onSubmit={(e) => handleAcceptDelivery(e, delivery)}>
                            <input type="text" placeholder="Enter authentication code from customer" name="code" onChange={handleChange} value={code} />
                            <button type="submit">Complete Delivery</button>
                        </form>
                    </div>
                ))
            )}
        </div>
    );
}

export default ActiveDelivery;