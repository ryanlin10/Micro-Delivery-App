import '../styles/sell.css';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerified } from '../context/verifiedcontext';
import { useEffect } from 'react';
function Sell() {
    const { verified } = useVerified();
    const url = 'http://localhost:8000/backend1/sell/';
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',

    });
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const [coordinates, setCoordinates] = useState({
        latitude: null,
        longitude: null
    });
    
    const { name, description, price, quantity, dropoff_location, pickup_location} = formData;
    useEffect(() => {
        if (verified === false) {
            setMessage('You need to verify your email to sell items');
            return;
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoordinates({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.log("Unable to retrieve location:", error);
                    setMessage("Please enable location services to continue");
                }
            );
        } else {
            console.log("Geolocation not supported");
            setMessage("Your browser doesn't support location services");
        }
    }, [verified]);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (verified === false) {
            setMessage('You need to verify your email to sell items');
            return;
        }
        
        if (!coordinates.latitude || !coordinates.longitude) {
            setMessage('Please enable location services to continue');
            return;
        }

        try {
            const response = await axios.post(url, {
                name,
                description,
                price,
                quantity,
                dropoff_location,
                pickup_location,
                buyer_latitude: coordinates.latitude,
                buyer_longitude: coordinates.longitude
            }, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            console.log(response.data);
            setMessage(response.data.message);
            navigate('/thankyou');
        } catch (error) {
            if (error.response?.data?.error === 'You do not have enough credit to place this order') {
                setFormData({
                    ...formData,
                    price: '',
                    quantity: '',
                    name: '',
                    description: '',
                });
            }
            console.error('Error:', error.response?.data);
            setMessage(error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <>
            <div style={{ display: !verified ? 'block' : 'none' }}>
                <h1>You need to verify your email to Buy Things</h1>
                <button onClick={() => navigate('/verify')}>Verify Email</button>
            </div>
            <div style={{ display: verified ? 'block' : 'none' }}>
                <h1>Buy your item</h1>
            </div>
            <div className="sell-description">
                <p>Local deliverers will bring it shortly</p>
                <p>Enter the details of the item you would like to buy</p>
            </div>

            <div className="sell-form">
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name of Product" name="name" onChange={handleChange} value={name} />
                    <input type="text" placeholder="Description" name="description" onChange={handleChange} value={description} />
                    <input type="number" placeholder="Price" name="price" onChange={handleChange} value={price} />
                    <input type="number" placeholder="Quantity" name="quantity" onChange={handleChange} value={quantity} />
                    <input type="text" placeholder="Dropoff Location" name="dropoff_location" onChange={handleChange} value={dropoff_location} />
                    <input type="text" placeholder="Pickup Location" name="pickup_location" onChange={handleChange} value={pickup_location} />
                    <p>Delivery fee: ${(price*quantity*0.1).toFixed(2)}</p>
                    <p>Commission: ${(price*quantity*0.05).toFixed(2)}</p>
                    <p>Total cost: ${Math.round(price*quantity + price*quantity*0.1 + price*quantity*0.05)}</p>
                    <button type="submit">Place Order</button>
                </form>
            </div>
            <div className="error-message">
                {message && <p>{message}</p>}
            </div>
        </>
    );
}

export default Sell;