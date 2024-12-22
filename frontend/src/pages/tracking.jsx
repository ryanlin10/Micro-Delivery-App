import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Circle } from '@react-google-maps/api';

function Tracking() {
    const [delivererLocation, setDelivererLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [key, setKey] = useState(0);
    const [distance, setDistance] = useState(null);
    const url1 = 'http://localhost:8000/backend1/deliverer-location/';
    const mapStyles = {
        height: '400px',
        width: '100%',
    };

    // Outer pulse circle for deliverer
    const pulseCircleOptions = {
        strokeColor: '#4A90E2',
        strokeOpacity: 0.2,
        strokeWeight: 1,
        fillColor: '#4A90E2',
        fillOpacity: 0.1,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        radius: 10,
        zIndex: 1
    };

    // Middle circle
    const middleCircleOptions = {
        strokeColor: '#4A90E2',
        strokeOpacity: 0.3,
        strokeWeight: 2,
        fillColor: '#4A90E2',
        fillOpacity: 0.15,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        radius: 5,
        zIndex: 2
    };

    // Inner circle (dot)
    const innerCircleOptions = {
        strokeColor: '#4A90E2',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#4A90E2',
        fillOpacity: 0.8,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        radius: 1,
        zIndex: 3
    };

    // Calculate distance between two points in kilometers
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
        return distance;
    };

    // Get user's location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting user location:', error);
                    setError('Please enable location services to track distance');
                }
            );
        } else {
            setError("Your browser doesn't support geolocation");
        }
    }, []);

    // Fetch deliverer location
    useEffect(() => {
        let intervalId = null;
        
        const fetchDelivererLocation = async () => {
            try {
                const productId = window.location.pathname.split('/')[2];
                const response = await axios.get(url1, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    },
                    params: { product_id: productId }
                });

                if (response.data && response.data.latitude && response.data.longitude) {
                    setDelivererLocation(response.data);
                    setKey(prevKey => prevKey + 1);
                    
                    // Calculate distance if both locations are available
                    if (userLocation) {
                        const dist = calculateDistance(
                            parseFloat(response.data.latitude),
                            parseFloat(response.data.longitude),
                            userLocation.latitude,
                            userLocation.longitude
                        );
                        setDistance(dist);
                    }
                    
                    setLoading(false);
                } else {
                    setError('Invalid location data received');
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching deliverer location:', err);
                setError('Failed to fetch deliverer location');
                setLoading(false);
            }
        };

        fetchDelivererLocation();
        intervalId = setInterval(fetchDelivererLocation, 5000);

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [userLocation]); // Add userLocation as dependency

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!delivererLocation || !delivererLocation.latitude || !delivererLocation.longitude) {
        return <div>No location data available</div>;
    }

    const lat = parseFloat(delivererLocation.latitude);
    const lng = parseFloat(delivererLocation.longitude);

    if (isNaN(lat) || isNaN(lng)) {
        return <div>Invalid location data</div>;
    }

    // Calculate map bounds to fit both points
    const bounds = userLocation ? {
        lat: (lat + userLocation.latitude) / 2,
        lng: (lng + userLocation.longitude) / 2
    } : { lat, lng };

    return (
        <div>
            <h1>Tracking</h1>
            <div>
                <LoadScript googleMapsApiKey="AIzaSyAlRa-IrhCYiCJKReDOHsEspQffGMY2DtU">
                    <GoogleMap
                        mapContainerStyle={mapStyles}
                        zoom={18}
                        center={{ lat, lng }}
                    >
                        {/* Outer pulse circle */}
                        <Circle
                            key={`pulse-${key}`}
                            center={{ lat, lng }}
                            options={pulseCircleOptions}
                        />
                        <Circle
                            key={`middle-${key}`}
                            center={{ lat, lng }}
                            options={middleCircleOptions}
                        />
                        <Circle
                            key={`inner-${key}`}
                            center={{ lat, lng }}
                            options={innerCircleOptions}
                        />

                    </GoogleMap>
                </LoadScript>
            </div>
            <div style={{ marginTop: '20px' }}>


                {distance && (
                    <p>Distance to deliverer: {distance.toFixed(2)} km ({(distance * 1000).toFixed(0)} meters)</p>
                )}
                <p>Last Updated: {new Date().toLocaleTimeString()}</p>
            </div>
        </div>
    );
}

export default Tracking;