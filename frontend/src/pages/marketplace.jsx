import axios from 'axios';
import { useState, useEffect } from 'react';

function Marketplace(){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/backend1/products/');
                console.log('Products response:', response.data);
                setProducts(response.data);
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
    
    if (buttonClicked) {
        navigate('/');
    }
    return(
        <div>
            <h1>Open Deliveries</h1>
            <p>Site still in development</p>
            <div className='post1'>
                {products.map(product => {
                    return (
                        <div key={product.id}>
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>${product.price}</p>
                            <p>Dropoff Location: {product.dropoff_location}</p>
                            <p>Pickup Location: {product.pickup_location}</p>
                            <button style={{width: '100px'}}>Accept Delivery</button>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Marketplace;