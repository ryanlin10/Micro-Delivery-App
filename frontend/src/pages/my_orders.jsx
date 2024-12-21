import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyOrders() {
    const [myOrders, setMyOrders] = useState([]);
    const token = localStorage.getItem('token');
    const url = 'http://localhost:8000/backend1/myorders/';
    const user = localStorage.getItem('user');
    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const response = await axios.get(url, { headers: { Authorization: `Token ${token}` } , user: user});
                setMyOrders(response.data);
            } catch (error) {
                console.error('Error fetching my orders:', error);
            }
        };
        fetchMyOrders();
    }, [url, token]);

    return (
        <div>
            <h1>My Orders</h1>
            {myOrders.map((order) => (
                <div key={order.id}>
                    <h2>{order.name}</h2>
                    <p>{order.description}</p>
                    <p>Price: {order.price}</p>
                    <p>Authentication Code: {order.authentication_code}</p>
                    <p>Pickup Location: {order.pickup_location}</p>
                    <p>Dropoff Location: {order.dropoff_location}</p>
                </div>
            ))}
        </div>
    );
}

export default MyOrders;