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

    return(
        <div>
            <h1>Marketplace</h1>
            <p>Site still in development</p>
            <div className='post1'>
                {products.map(product => {
                    console.log('Product image_url:', product.image_url);
                    return (
                        <div key={product.id}>
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>${product.price}</p>
                            {product.image_url && (
                                <img 
                                    src={product.image_url} 
                                    alt={product.name}
                                    style={{ maxWidth: '200px' }}
                                    onError={(e) => console.error('Image loading error:', e)}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Marketplace;