import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Marketplace(){
    const [openDeliveries, setOpenDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [coordinates, setCoordinates] = useState({
        latitude: null,
        longitude: null
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const url = 'http://localhost:8000/backend1/accept-delivery/';

    // Function to calculate distance between two points
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in km
        return distance.toFixed(2);
    };

    // Get deliverer's location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoordinates({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setMessage('Please enable location services to see nearby deliveries');
                }
            );
        } else {
            setMessage("Your browser doesn't support location services");
        }
    }, []);

    // Fetch and sort deliveries based on distance
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/backend1/open-deliveries/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                });

                // Add distance to each delivery
                const deliveriesWithDistance = response.data.map(delivery => ({
                    ...delivery,
                    distance: coordinates.latitude && coordinates.longitude ? 
                        calculateDistance(
                            coordinates.latitude,
                            coordinates.longitude,
                            delivery.product.pickup_latitude,
                            delivery.product.pickup_longitude
                        ) : null
                }));

                // Sort by distance
                deliveriesWithDistance.sort((a, b) => {
                    if (!a.distance) return 1;
                    if (!b.distance) return -1;
                    return a.distance - b.distance;
                });

                setOpenDeliveries(deliveriesWithDistance);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to fetch products');
                setLoading(false);
            }
        };

        if (coordinates.latitude && coordinates.longitude) {
            fetchProducts();
        }
    }, [coordinates]);

    const handleAcceptDelivery = async (productId) => {
        try {
            const response = await axios.post(url, 
                { product_id: productId },
                {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                }
            );
            
            // Show success message
            setMessage('Delivery accepted successfully!');
            
            // Remove the accepted delivery from the list
            setOpenDeliveries(prev => prev.filter(delivery => delivery.product.id !== productId));
            
            // Redirect to active deliveries page
            navigate('/active-delivery');
        } catch (error) {
            console.error('Error accepting delivery:', error);
            setMessage(error.response?.data?.error || 'Failed to accept delivery');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return(
        <div>
            <h1>Open Deliveries</h1>
            {message && <div className="alert">{message}</div>}

            <div className='post1'>
                {openDeliveries.map(openDelivery => (
                    <div key={openDelivery.id} className="delivery-card">
                        <h2>{openDelivery.product.name}</h2>
                        <p>{openDelivery.product.description}</p>
                        <p>Price of product(each): ${openDelivery.product.price}</p>
                        <p>Delivery fee to be made: ${(openDelivery.product.price*openDelivery.product.quantity*0.1).toFixed(2)}</p>
                        <p>Dropoff Location: {openDelivery.product.dropoff_location}</p>
                        <p>Dropoff Coordinates: {openDelivery.product.dropoff_coordinates}</p>
                        <p>Pickup Location: {openDelivery.product.pickup_location_name}</p>
                        <p>Pickup Coordinates: {openDelivery.product.pickup_location}</p>
                        <p>Quantity: {openDelivery.product.quantity}</p>
                        {openDelivery.distance && (
                            <p className="distance">Distance to pickup: {openDelivery.distance} km</p>
                        )}
                        <button 
                            style={{width: '100px'}} 
                            onClick={() => handleAcceptDelivery(openDelivery.product.id)}
                        >
                            Accept Delivery
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Marketplace;