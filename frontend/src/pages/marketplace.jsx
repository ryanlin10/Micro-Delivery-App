import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function Marketplace(){
    const [openDeliveries, setOpenDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const url = 'http://localhost:8000/backend1/accept-delivery/';
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/backend1/open-deliveries/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
                });
                console.log('Products response:', response.data);
                setOpenDeliveries(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to fetch products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    const handleAcceptDelivery = async (productId) => {
        navigate(`/active-delivery`);
        console.log(`Navigating to /active-delivery`);

        try {
            const response = await axios.post(url, {
                product_id: productId,
                status: 'accepted',
                user: localStorage.getItem('user')
            }, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            });
            console.log('Accept delivery response:', response.data);
        } catch (error) {
            console.error('Error accepting delivery:', error);
        }

    };
    
    return(
        <div>
            <h1>Open Deliveries</h1>
            <p>Site still in development</p>
            <div className='post1'>
                {openDeliveries.map(openDelivery => {
                    return (
                        <div key={openDelivery.id}>
                            <h2>{openDelivery.product.name}</h2>
                            <p>{openDelivery.product.description}</p>
                            <p>Price of product(each): ${openDelivery.product.price}</p>
                            <p>Commission to be made: ${Math.round(openDelivery.product.price*openDelivery.product.quantity*0.1*100)/100}</p>
                            <p>Dropoff Location: {openDelivery.product.dropoff_location}</p>
                            <p>Pickup Location: {openDelivery.product.pickup_location}</p>
                            <p>Quantity: {openDelivery.product.quantity}</p>
                            <p>Buyer Latitude: {openDelivery.product.buyer_latitude}</p>
                            <p>Buyer Longitude: {openDelivery.product.buyer_longitude}</p>
                            <button style={{width: '100px'}} onClick={() => handleAcceptDelivery(openDelivery.product.id)}>Accept Delivery</button>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Marketplace;