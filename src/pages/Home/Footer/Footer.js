import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className='bg-dark text-light pt-5 pb-3 mt-auto'>
            <Container>
                {/* Main Footer Content */}
                <Row className='g-4 mb-4'>
                    {/* Company Section */}
                    <Col xs={12} sm={6} lg={3}>
                        <h5 className='mb-3 text-uppercase fw-bold border-bottom border-primary pb-2'>
                            Company
                        </h5>
                        <ul className='list-unstyled'>
                            <li className='mb-2'>
                                <a href='#about' className='text-light text-decoration-none hover-link'>
                                    About Us
                                </a>
                            </li>
                            <li className='mb-2'>
                                <a href='#company' className='text-light text-decoration-none hover-link'>
                                    Our Company
                                </a>
                            </li>
                            <li className='mb-2'>
                                <a href='#blog' className='text-light text-decoration-none hover-link'>
                                    Press & Blog
                                </a>
                            </li>
                            <li className='mb-2'>
                                <a href='#privacy' className='text-light text-decoration-none hover-link'>
                                    Privacy Policy
                                </a>
                            </li>
                            <li className='mb-2'>
                                <a href='#faq' className='text-light text-decoration-none hover-link'>
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </Col>

                    {/* Open Hours Section */}
                    <Col xs={12} sm={6} lg={3}>
                        <h5 className='mb-3 text-uppercase fw-bold border-bottom border-primary pb-2'>
                            ⏰ Open Hours
                        </h5>
                        <ul className='list-unstyled open-hours'>
                            <li className='mb-2'>
                                <span className='text-light'>Monday: </span>
                                <span className='text-muted'>11am - 8pm</span>
                            </li>
                            <li className='mb-2'>
                                <span className='text-light'>Tue - Thu: </span>
                                <span className='text-muted'>11am - 8pm</span>
                            </li>
                            <li className='mb-2'>
                                <span className='text-light'>Friday: </span>
                                <span className='text-muted'>10am - 6pm</span>
                            </li>
                            <li className='mb-2'>
                                <span className='text-light'>Saturday: </span>
                                <span className='text-muted'>10am - 6pm</span>
                            </li>
                            <li className='mb-2'>
                                <span className='text-light'>Sunday: </span>
                                <span className='text-muted'>10am - 6pm</span>
                            </li>
                        </ul>
                    </Col>

                    {/* Locations Section */}
                    <Col xs={12} sm={6} lg={3}>
                        <h5 className='mb-3 text-uppercase fw-bold border-bottom border-primary pb-2'>
                            📍 Our Locations
                        </h5>
                        <ul className='list-unstyled'>
                            <li className='mb-2'>
                                <a href='#dhaka' className='text-light text-decoration-none hover-link'>
                                    📌 Dhaka
                                </a>
                            </li>
                            <li className='mb-2'>
                                <a href='#sylhet' className='text-light text-decoration-none hover-link'>
                                    📌 Sylhet
                                </a>
                            </li>
                            <li className='mb-2'>
                                <a href='#rajshahi' className='text-light text-decoration-none hover-link'>
                                    📌 Rajshahi
                                </a>
                            </li>
                            <li className='mb-2'>
                                <a href='#chittagong' className='text-light text-decoration-none hover-link'>
                                    📌 Chittagong
                                </a>
                            </li>
                            <li className='mb-2'>
                                <a href='#rangamati' className='text-light text-decoration-none hover-link'>
                                    📌 Rangamati
                                </a>
                            </li>
                        </ul>
                    </Col>

                    {/* About BikeZone Section */}
                    <Col xs={12} sm={6} lg={3}>
                        <h5 className='mb-3 text-uppercase fw-bold border-bottom border-primary pb-2'>
                            🏍️ BikeZone
                        </h5>
                        <p className='text-light mb-3' style={{ lineHeight: '1.7', fontSize: '0.95rem' }}>
                            We have been providing quality coverage, superior value and personal service to clients since 2000.
                        </p>
                        
                        {/* Contact Info */}
                        <div className='mb-3'>
                            <div className='d-flex align-items-start mb-2'>
                                <span className='me-2'>📞</span>
                                <a href='tel:+8801234567890' className='text-light text-decoration-none hover-link'>
                                    +880 123-456-7890
                                </a>
                            </div>
                            <div className='d-flex align-items-start mb-3'>
                                <span className='me-2'>✉️</span>
                                <a href='mailto:info@bikezone.com' className='text-light text-decoration-none hover-link' style={{ wordBreak: 'break-word' }}>
                                    info@bikezone.com
                                </a>
                            </div>
                        </div>

                        {/* Social Media */}
                        <h6 className='mb-2 fw-bold'>Follow Us:</h6>
                        <div className='d-flex gap-2 flex-wrap'>
                            <a href='https://facebook.com' target='_blank' rel='noopener noreferrer' 
                               className='social-icon' 
                               aria-label='Facebook'
                               title='Facebook'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' 
                               className='social-icon' 
                               aria-label='Instagram'
                               title='Instagram'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href='https://twitter.com' target='_blank' rel='noopener noreferrer' 
                               className='social-icon' 
                               aria-label='Twitter'
                               title='Twitter'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>
                            <a href='https://youtube.com' target='_blank' rel='noopener noreferrer' 
                               className='social-icon' 
                               aria-label='YouTube'
                               title='YouTube'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </a>
                        </div>
                    </Col>
                </Row>

                {/* Divider */}
                <hr className='border-secondary my-4' />

                {/* Bottom Bar */}
                <Row className='align-items-center'>
                    <Col xs={12} md={6} className='text-center text-md-start mb-3 mb-md-0'>
                        <p className='mb-0 text-muted small'>
                            © {new Date().getFullYear()} BikeZone - A trusted bike seller. All rights reserved.
                        </p>
                    </Col>
                    <Col xs={12} md={6} className='text-center text-md-end'>
                        <a href='#terms' className='text-muted text-decoration-none hover-link me-3 small'>
                            Terms of Service
                        </a>
                        <a href='#privacy' className='text-muted text-decoration-none hover-link small'>
                            Privacy Policy
                        </a>
                    </Col>
                </Row>
            </Container>

            <style jsx>{`
                footer {
                    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
                }

                .hover-link {
                    transition: all 0.3s ease;
                    font-size: 0.95rem;
                }
                
                .hover-link:hover {
                    color: #0d6efd !important;
                    padding-left: 3px;
                }
                
                .social-icon {
                    color: #ffffff;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    text-decoration: none;
                }
                
                .social-icon:hover {
                    background: #0d6efd;
                    transform: translateY(-3px);
                    color: white !important;
                    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.4);
                }
                
                .border-primary {
                    border-color: #0d6efd !important;
                }

                .open-hours li {
                    font-size: 0.9rem;
                }

                h5 {
                    font-size: 1rem;
                }

                ul {
                    padding-left: 0;
                }

                li {
                    font-size: 0.95rem;
                }
                
                /* Responsive adjustments */
                @media (max-width: 991px) {
                    .col-lg-3 {
                        margin-bottom: 1.5rem;
                    }
                }

                @media (max-width: 767px) {
                    h5 {
                        font-size: 1.1rem;
                        text-align: left;
                    }

                    .open-hours {
                        max-width: 100%;
                    }

                    .social-icon {
                        width: 40px;
                        height: 40px;
                    }
                }

                @media (max-width: 575px) {
                    footer {
                        padding-left: 15px;
                        padding-right: 15px;
                    }

                    h5 {
                        font-size: 1rem;
                        margin-bottom: 1rem;
                    }

                    li, .hover-link {
                        font-size: 0.9rem;
                    }

                    .open-hours span {
                        font-size: 0.85rem;
                    }

                    .social-icon {
                        width: 38px;
                        height: 38px;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;