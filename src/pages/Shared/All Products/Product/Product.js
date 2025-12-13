import React, { useState } from 'react';
import { Card, Col, Button, Badge } from 'react-bootstrap';
import { useHistory } from 'react-router';

const Product = ({ product }) => {
    const history = useHistory();
    const [isHovered, setIsHovered] = useState(false);

    const handleOnClick = () => {
        history.push(`/products/${product?._id}`);
    }

    return (
        <Col xs={12} sm={6} md={6} lg={4} xl={3} className='mb-4'>
            <Card 
                className='product-card h-100 border-0 shadow'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                }}
                onClick={handleOnClick}
            >
                {/* Image Section */}
                <div className='position-relative overflow-hidden' style={{ borderRadius: '15px 15px 0 0', height: '220px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                    <Card.Img 
                        variant="top" 
                        src={product?.img} 
                        style={{
                            height: '100%',
                            objectFit: 'contain',
                            padding: '1rem',
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                            transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Bike+Image';
                        }}
                    />
                    
                    {/* Badges */}
                    <div className='position-absolute top-0 start-0 m-3 d-flex gap-2'>
                        {product?.featured && (
                            <Badge bg="warning" text="dark" className='px-2 py-1 rounded-pill'>
                                ⭐ Featured
                            </Badge>
                        )}
                        {product?.newArrival && (
                            <Badge bg="success" className='px-2 py-1 rounded-pill'>
                                ✨ New
                            </Badge>
                        )}
                    </div>

                    {/* Quick View Overlay */}
                    <div 
                        className='position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
                        style={{
                            background: 'rgba(102, 126, 234, 0.9)',
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.3s ease'
                        }}
                    >
                        <div className='text-center text-white'>
                            <div className='mb-2' style={{ fontSize: '2rem' }}>👁️</div>
                            <div className='fw-bold'>Quick View</div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <Card.Body className='d-flex flex-column'>
                    {/* Title */}
                    <Card.Title className='fw-bold mb-2' style={{ 
                        fontSize: '1.1rem',
                        minHeight: '50px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {product?.title}
                    </Card.Title>

                    {/* Description */}
                    <Card.Text className='text-muted small mb-3 flex-grow-1' style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '40px'
                    }}>
                        {product?.engine || `${product?.displacement} engine with powerful performance`}
                    </Card.Text>

                    {/* Features */}
                    <div className='d-flex gap-2 mb-3 flex-wrap'>
                        {product?.displacement && (
                            <span className='badge bg-light text-dark border' style={{ fontSize: '0.7rem' }}>
                                {product.displacement}
                            </span>
                        )}
                        {product?.gear && (
                            <span className='badge bg-light text-dark border' style={{ fontSize: '0.7rem' }}>
                                {product.gear} Gear
                            </span>
                        )}
                    </div>

                    {/* Price and Button */}
                    <div className='mt-auto'>
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <div>
                                <div className='text-muted small'>Starting from</div>
                                <div className='fw-bold' style={{ 
                                    fontSize: '1.5rem',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    ৳{product?.price?.toLocaleString()}
                                </div>
                            </div>
                            {product?.inStock !== false && (
                                <Badge bg="success" className='px-2 py-1'>
                                    In Stock
                                </Badge>
                            )}
                        </div>

                        <Button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOnClick();
                            }}
                            className='w-100 fw-bold'
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '10px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            View Details
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <style jsx>{`
                .product-card {
                    border-radius: 15px;
                    overflow: hidden;
                }

                .product-card:hover {
                    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3) !important;
                }

                /* Smooth image transition */
                .product-card img {
                    will-change: transform;
                }

                /* Badge animations */
                .badge {
                    font-weight: 600;
                    letter-spacing: 0.3px;
                }

                /* Button hover effect */
                .btn:active {
                    transform: scale(0.98);
                }

                /* Responsive adjustments */
                @media (max-width: 576px) {
                    .product-card {
                        margin: 0 auto;
                        max-width: 350px;
                    }
                }
            `}</style>
        </Col>
    );
};

export default Product;