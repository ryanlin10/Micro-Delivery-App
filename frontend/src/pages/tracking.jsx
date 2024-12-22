import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Circle } from '@react-google-maps/api';


function Tracking() {
    const [delivererLocation, setDelivererLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define styles for the map container
    const mapStyles = {
        height: '400px',
        width: '100%',
    };

    useEffect(() => {
        const fetchDelivererLocation = async () => {
            try {
                // Get product ID from URL
                const productId = window.location.pathname.split('/')[2];

                const response = await axios.get('http://localhost:8000/backend1/deliverer-location/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    },
                    params: { product_id: productId }
                });

                // Log the response to confirm you have the correct data
                console.log("Deliverer location response:", response.data);

                setDelivererLocation(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching deliverer location:', err);
                setError('Failed to fetch deliverer location');
                setLoading(false);
            }
        };

        // Initial fetch
        fetchDelivererLocation();

        // Poll the endpoint every 5 seconds
        const intervalId = setInterval(fetchDelivererLocation, 5000);

        // Cleanup on component unmount
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!delivererLocation) return <div>No location data available</div>;

    // Parse the latitude and longitude to ensure they are numeric
    const lat = parseFloat(delivererLocation.latitude);
    const lng = parseFloat(delivererLocation.longitude);

    return (
        <div>
            <h1>Tracking</h1>
            {/* The map-container class is used for explicit sizing in tracking.css */}
            <div>
                <LoadScript googleMapsApiKey="AIzaSyAlRa-IrhCYiCJKReDOHsEspQffGMY2DtU">
                    <GoogleMap
                        mapContainerStyle={mapStyles}
                        zoom={16}  // Slightly reduced zoom for a broader view
                        center={{ lat, lng }}
                    >
                        <Circle
                            center={{ lat, lng }}
                            radius={30} // Slightly larger radius for better visibility
                            options={{
                                fillColor: "#4285F4", // Google Maps blue
                                fillOpacity: 0.8,
                                strokeColor: "#FFFFFF", // White border
                                strokeOpacity: 1,
                                strokeWeight: 3,
                                zIndex: 1000 // Ensure it appears above other map elements
                            }}
                        />
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
}

export default Tracking;