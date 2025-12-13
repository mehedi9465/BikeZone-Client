import './Banner.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Carousel, Image, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Banner = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('Fetching banner products...');
        setLoading(true);

        axios.get('https://bikezone-server.onrender.com/products')
            .then((response) => {
                console.log('Products loaded:', response.data?.length);
                if (response.data) {
                    // Limit to first 5 products for banner
                    setProducts(response.data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error loading products:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className='banner-loading'>
                <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }} />
                <p className='mt-3 text-white'>Loading awesome bikes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='banner-error'>
                <Alert variant="danger" className='m-5 rounded-4 shadow-lg'>
                    <Alert.Heading>😕 Oops! Something went wrong</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </Alert>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className='banner-empty'>
                <Alert variant="warning" className='m-5 rounded-4 shadow-lg'>
                    <Alert.Heading>🏍️ No bikes available yet!</Alert.Heading>
                    <p>Check back soon for amazing deals.</p>
                </Alert>
            </div>
        );
    }

    return (
        <>
            <div className='casual-banner' id='banner'>
                <Carousel interval={4000} indicators={true} controls={true} pause="hover">
                    {products.map((product, index) => (
                        <Carousel.Item key={product._id || index}>
                            <div className='banner-slide'>
                                {/* Decorative Elements */}
                                <div className='gradient-blob blob-1'></div>
                                <div className='gradient-blob blob-2'></div>
                                <div className='gradient-blob blob-3'></div>

                                <div className='container'>
                                    <div className='row align-items-center py-5'>
                                        {/* Left Content */}
                                        <div className='col-lg-6 col-md-12 text-white mb-4 mb-lg-0 content-section'>
                                            {/* Badges */}
                                            <div className='mb-3 d-flex gap-2 flex-wrap animate-fade-in'>
                                                {index === 0 && (
                                                    <Badge bg="danger" className='casual-badge pulse-badge'>
                                                        🔥 Hot Deal
                                                    </Badge>
                                                )}
                                                <Badge bg="warning" text="dark" className='casual-badge'>
                                                    ⚡ Fast Delivery
                                                </Badge>
                                                <Badge bg="success" className='casual-badge'>
                                                    ✨ Premium Quality
                                                </Badge>
                                            </div>

                                            {/* Title */}
                                            <h1 className='display-3 fw-bold mb-4 hero-title animate-slide-up'>
                                                {product?.title}
                                            </h1>

                                            {/* Description */}
                                            {product?.engine && (
                                                <p className='lead mb-4 fs-4 hero-subtitle animate-slide-up-delayed'>
                                                    {product.engine}
                                                </p>
                                            )}

                                            {/* Features */}
                                            <div className='mb-4 d-flex flex-wrap gap-3 animate-fade-in-delayed'>
                                                <div className='feature-pill'>
                                                    <span className='feature-icon'>⭐</span>
                                                    <span>4.8 Rating</span>
                                                </div>
                                                <div className='feature-pill'>
                                                    <span className='feature-icon'>🏆</span>
                                                    <span>Top Rated</span>
                                                </div>
                                                <div className='feature-pill'>
                                                    <span className='feature-icon'>💯</span>
                                                    <span>Verified</span>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            {product?.price && (
                                                <div className='mb-4 price-section animate-fade-in-delayed'>
                                                    <span className='price-label'>Starting from</span>
                                                    <span className='price-value'>
                                                        ৳{product.price.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}

                                            {/* CTA Buttons */}
                                            <div className='d-flex flex-wrap gap-3 mt-4 animate-slide-up-delayed'>
                                                <Button 
                                                    as={Link}
                                                    to={`/products/${product._id}`}  // Changed "product" to "products"
                                                    size="lg" 
                                                    className='cta-primary'
                                                >
                                                    🛒 View Details
                                                </Button>
                                                <Button 
                                                    as={Link}
                                                    to="/products"
                                                    size="lg" 
                                                    variant="outline-light" 
                                                    className='cta-secondary'
                                                >
                                                    Browse All Bikes →
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Right Image */}
                                        <div className='col-lg-6 col-md-12 text-center image-section'>
                                            <div className='bike-image-container animate-float'>
                                                <Image 
                                                    src={product?.img} 
                                                    alt={product?.title}
                                                    className='bike-image'
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/600x400?text=Bike+Image';
                                                    }}
                                                />
                                                <div className='image-glow'></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>

            <style jsx>{`
                /* Banner Base */
                
            `}</style>
        </>
    );
};

export default Banner;