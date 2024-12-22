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
                setDelivering(response.data.length > 0);
                setLoading(false);

                // If delivering is active, start location updates
                if (response.data.length > 0) {
                    // Initial location update
                    getAndSendLocation();
                    
                    // Set up interval for location updates every 10 seconds
                    const intervalId = setInterval(getAndSendLocation, 10000);
                    
                    // Clean up interval on unmount
                    return () => clearInterval(intervalId);
                }
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const getAndSendLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('Deliverer location:', latitude, longitude);

                    // Send location to backend
                    axios.post('http://localhost:8000/backend1/update-deliverer-location/', {
                        latitude,
                        longitude
                    }, {
                        headers: { Authorization: `Token ${token}` }
                    }).then(response => {
                        console.log('Location updated:', response.data);
                    }).catch(error => {
                        console.error('Error updating location:', error);
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const handleAcceptDelivery = async (e, delivery) => {
        e.preventDefault();
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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