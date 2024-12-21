import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Mydeliveries() {
    const [mydeliveries, setMydeliveries] = useState([]);
    const url = 'http://localhost:8000/backend1/mydeliveries/';
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Token ${token}`
    };
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchMydeliveries = async () => {
            try {
                const response = await axios.get(url, { headers: headers });
                console.log('Mydeliveries response:', response.data);
                setMydeliveries(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching mydeliveries:', error);
                setError('Failed to fetch mydeliveries');
                setLoading(false);
            }
        };

        fetchMydeliveries();
    }, []);

    return (
        <div>
            <h1>My Deliveries</h1>
            {mydeliveries.map(mydelivery => {
                return (
                    <div key={mydelivery.id}>
                        <h2>{mydelivery.product.name}</h2>
                        <p>{mydelivery.product.description}</p>
                        <p>{mydelivery.product.price}</p>
                        <p>{mydelivery.dropoff_location}</p>
                        <p>{mydelivery.pickup_location}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default Mydeliveries;