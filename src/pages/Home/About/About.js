import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
    const stats = [
        { icon: '🏍️', number: '500+', label: 'Bikes Available' },
        { icon: '😊', number: '10K+', label: 'Happy Customers' },
        { icon: '⭐', number: '4.9', label: 'Average Rating' },
        { icon: '🚚', number: '24/7', label: 'Fast Delivery' }
    ];

    const features = [
        {
            icon: '✨',
            title: 'Premium Quality',
            description: 'Every bike is carefully selected and inspected to ensure top-notch quality and performance.'
        },
        {
            icon: '💰',
            title: 'Best Prices',
            description: 'Competitive pricing with flexible payment options and amazing deals throughout the year.'
        },
        {
            icon: '🛡️',
            title: 'Warranty Included',
            description: 'All our bikes come with comprehensive warranty coverage for your peace of mind.'
        },
        {
            icon: '🎯',
            title: 'Expert Support',
            description: 'Our dedicated team is always ready to help you find the perfect bike for your needs.'
        }
    ];

    return (
        <div id='about' style={{ backgroundColor: '#f8f9fa', paddingTop: '80px', paddingBottom: '80px' }}>
            <Container>
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '8px 20px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '50px',
                        marginBottom: '20px'
                    }}>
                        <span style={{ color: '#1976d2', fontWeight: '600', fontSize: '14px' }}>
                            WHO WE ARE
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '20px'
                    }}>
                        About BikeZone
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: '#6c757d',
                        maxWidth: '700px',
                        margin: '0 auto',
                        lineHeight: '1.8'
                    }}>
                        Your trusted destination for premium motorcycles. We're passionate about connecting riders 
                        with their dream bikes and delivering exceptional service every step of the way.
                    </p>
                </div>

                {/* Image and Mission Section */}
                <Row className='align-items-center mb-5'>
                    <Col lg={6} className='mb-4 mb-lg-0'>
                        <div style={{
                            position: 'relative',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                        }}>
                            <img 
                                src='https://images.unsplash.com/photo-1762012507743-62d6a3627cb2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
                                alt='About BikeZone'
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'white',
                                padding: '15px 25px',
                                borderRadius: '50px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                            }}>
                                <span style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>
                                    Since 2020
                                </span>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div style={{ paddingLeft: '30px' }}>
                            <h2 style={{
                                fontSize: '36px',
                                fontWeight: '700',
                                color: '#2c3e50',
                                marginBottom: '20px'
                            }}>
                                Our Mission
                            </h2>
                            <p style={{
                                fontSize: '16px',
                                color: '#6c757d',
                                lineHeight: '1.8',
                                marginBottom: '20px'
                            }}>
                                At BikeZone, we believe that everyone deserves to experience the thrill and freedom 
                                of riding a quality motorcycle. Our mission is to make premium bikes accessible to 
                                riders of all levels, from beginners to seasoned enthusiasts.
                            </p>
                            <p style={{
                                fontSize: '16px',
                                color: '#6c757d',
                                lineHeight: '1.8',
                                marginBottom: '30px'
                            }}>
                                We're committed to providing not just bikes, but a complete riding experience - 
                                from expert guidance in choosing the right model to reliable after-sales support 
                                that keeps you on the road with confidence.
                            </p>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '15px 30px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '50px',
                                color: 'white',
                                fontWeight: '600'
                            }}>
                                <span style={{ fontSize: '20px' }}>🏆</span>
                                <span>Trusted by 10,000+ Riders</span>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Stats Section */}
                <Row className='my-5 py-4'>
                    {stats.map((stat, index) => (
                        <Col key={index} lg={3} md={6} className='mb-4'>
                            <div style={{
                                background: 'white',
                                padding: '30px',
                                borderRadius: '16px',
                                textAlign: 'center',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                            }}>
                                <div style={{ fontSize: '40px', marginBottom: '15px' }}>
                                    {stat.icon}
                                </div>
                                <h3 style={{
                                    fontSize: '36px',
                                    fontWeight: '700',
                                    color: '#667eea',
                                    marginBottom: '10px'
                                }}>
                                    {stat.number}
                                </h3>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#6c757d',
                                    margin: '0',
                                    fontWeight: '500'
                                }}>
                                    {stat.label}
                                </p>
                            </div>
                        </Col>
                    ))}
                </Row>

                {/* Features Section */}
                <div style={{ marginTop: '80px' }}>
                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: '700',
                        color: '#2c3e50',
                        textAlign: 'center',
                        marginBottom: '50px'
                    }}>
                        Why Choose BikeZone?
                    </h2>
                    <Row>
                        {features.map((feature, index) => (
                            <Col key={index} lg={3} md={6} className='mb-4'>
                                <Card style={{
                                    border: 'none',
                                    borderRadius: '16px',
                                    padding: '30px',
                                    height: '100%',
                                    background: 'white',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                                }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '28px',
                                        marginBottom: '20px'
                                    }}>
                                        {feature.icon}
                                    </div>
                                    <h4 style={{
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        color: '#2c3e50',
                                        marginBottom: '15px'
                                    }}>
                                        {feature.title}
                                    </h4>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#6c757d',
                                        lineHeight: '1.7',
                                        margin: '0'
                                    }}>
                                        {feature.description}
                                    </p>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default About;