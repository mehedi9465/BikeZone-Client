import React, { useState } from 'react';
import { Card, Col, Badge } from 'react-bootstrap';

const DisplayProduct = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

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
                        {product?.title} has powerful {product?.engine} Engine with {product?.displacement} Displacement
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
                        {product?.emission && (
                            <span className='badge bg-light text-dark border' style={{ fontSize: '0.7rem' }}>
                                {product.emission}
                            </span>
                        )}
                    </div>

                    {/* Price and Stock */}
                    <div className='mt-auto'>
                        <div className='d-flex justify-content-between align-items-center mb-2'>
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

export default DisplayProduct;