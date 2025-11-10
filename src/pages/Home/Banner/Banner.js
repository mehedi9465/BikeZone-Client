import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Carousel, Image, Spinner, Alert } from 'react-bootstrap';

const Banner = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('=== BANNER: Starting fetch ===');
        setLoading(true);

        axios.get('https://bikezone-server.onrender.com/products')
            .then((response) => {
                console.log('=== BANNER: Full Response ===', response);
                console.log('=== BANNER: Response Data ===', response.data);
                console.log('=== BANNER: Data Type ===', typeof response.data);
                console.log('=== BANNER: Is Array? ===', Array.isArray(response.data));
                console.log('=== BANNER: Length ===', response.data?.length);

                if (response.data) {
                    setProducts(response.data);
                    console.log('=== BANNER: Products Set Successfully ===');
                } else {
                    console.error('=== BANNER: No data in response ===');
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('=== BANNER: ERROR ===', err);
                console.error('=== BANNER: Error Message ===', err.message);
                console.error('=== BANNER: Error Response ===', err.response);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Log current state
    console.log('=== BANNER: Current State ===');
    console.log('Products:', products);
    console.log('Loading:', loading);
    console.log('Error:', error);

    if (loading) {
        return (
            <div className='text-center my-5 py-5'>
                <Spinner animation="border" variant="primary" />
                <p className='mt-3'>Loading bikes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className='m-5'>
                <Alert.Heading>Error Loading Products</Alert.Heading>
                <p>{error}</p>
                <hr />
                <p className='mb-0'>
                    <strong>Debug Steps:</strong><br />
                    1. Open browser console (F12)<br />
                    2. Check the error messages<br />
                    3. Try visiting: <a href="https://bikezone-server.onrender.com/products" target="_blank" rel="noopener noreferrer">
                        https://bikezone-server.onrender.com/products
                    </a><br />
                    4. Make sure your server is running
                </p>
            </Alert>
        );
    }

    if (!products || products.length === 0) {
        return (
            <Alert variant="warning" className='m-5'>
                <Alert.Heading>No Products Found</Alert.Heading>
                <p>The server returned an empty array. Please add products to your database.</p>
                <hr />
                <p className='mb-0'>
                    Check console for more details or visit: <a href="https://bikezone-server.onrender.com/products" target="_blank" rel="noopener noreferrer">
                        API Endpoint
                    </a>
                </p>
            </Alert>
        );
    }

    return (
        <Carousel id='banner' className='my-5' interval={3000}>
            {products.map((product, index) => (
                <Carousel.Item key={product._id || index} className='py-5 my-5'>
                    <div className='d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 px-3'>
                        <Image 
                            src={product?.img} 
                            width='600'
                            alt={product?.title || 'Bike'}
                            style={{ maxWidth: '100%', height: 'auto' }}
                            onError={(e) => {
                                console.error('Image failed to load:', product?.img);
                                e.target.src = 'https://via.placeholder.com/600x400?text=Bike+Image';
                            }}
                        />
                        <div className='text-center text-md-start'>
                            <p className='display-4 fw-bold'>{product?.title}</p>
                            <p className='lead'>{product?.engine}</p>
                        </div>
                    </div>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default Banner;