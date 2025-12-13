import React, { useState, useEffect } from "react";
import { Container, Image, Nav, Navbar, NavDropdown, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import './Navigation.css';
import { HashLink } from 'react-router-hash-link';

const Navigation = () => {
    const { user, logOut, isAdmin } = useAuth(); // Added isAdmin
    const [scrolled, setScrolled] = useState(false);

    // Add scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
        <Navbar 
            className={`w-100 sticky-top casual-navbar ${scrolled ? 'scrolled' : ''}`} 
            variant='dark' 
            expand="md"
        >
        <Container>
            {/* Logo/Brand */}
            <Navbar.Brand as={Link} to="/" className="brand-casual">
                <div className="d-flex align-items-center gap-1">
                    <div className="logo-container">
                        <Image 
                            src='https://i.ibb.co/09BwKNp/2684195.png' 
                            width='36' 
                            height='36'
                            fluid
                            alt="BikeZone"
                        />
                    </div>
                    <span className="brand-text">BikeZone</span>
                    <Badge bg="warning" text="dark" className="ms-2 new-badge">New</Badge>
                </div>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto align-items-center gap-1">
                    <Nav.Link as={HashLink} to="/#banner" className="casual-link">
                        🏠 Home
                    </Nav.Link>
                    <Nav.Link as={HashLink} to="/#products" className="casual-link">
                        🏍️ Bikes
                    </Nav.Link>
                    <Nav.Link as={HashLink} to="/#about" className="casual-link">
                        💡 About
                    </Nav.Link>
                    <Nav.Link as={HashLink} to="/#review" className="casual-link">
                        ⭐ Reviews
                    </Nav.Link>
                    <Nav.Link as={Link} to="/products" className="casual-link explore-link">
                        🚀 Explore All
                    </Nav.Link>
                </Nav>
            
                {user?.email ? (
                    <Nav className='d-flex justify-content-center align-items-center gap-2'>
                        <div className="user-badge">
                            <span className="welcome-text d-none d-lg-inline">
                                Hey, {user?.displayName?.split(' ')[0] || 'User'}!
                            </span>
                            {isAdmin && (
                                <Badge bg="danger" className="ms-2">Admin</Badge>
                            )}
                        </div>
                        <NavDropdown 
                            title={
                                <div className="avatar-wrapper">
                                    <Image 
                                        className='user-avatar' 
                                        src={user?.photoURL || 'https://cdn-icons-png.flaticon.com/512/236/236831.png'} 
                                        height='40'
                                        width='40'
                                        alt="User"
                                    />
                                    <span className="online-indicator"></span>
                                </div>
                            } 
                            id="user-nav-dropdown"
                            align="end"
                            className="user-dropdown"
                        >
                            <div className="dropdown-header-custom">
                                <Image 
                                    src={user?.photoURL || 'https://cdn-icons-png.flaticon.com/512/236/236831.png'} 
                                    width="50"
                                    height="50"
                                    className="rounded-circle mb-2"
                                    alt="Profile"
                                />
                                <div className="fw-bold">{user?.displayName || 'User'}</div>
                                <small className="text-muted">{user?.email}</small>
                                {isAdmin && (
                                    <Badge bg="danger" className="mt-1">Administrator</Badge>
                                )}
                            </div>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to='/dashboard' className="dropdown-item-custom">
                                <span className="item-icon">🏠</span>
                                <span>Dashboard</span>
                            </NavDropdown.Item>
                            
                            {/* Show "My Orders" only for regular users, NOT for admins */}
                            {!isAdmin && (
                                <NavDropdown.Item as={Link} to='dashboard/myOrders' className="dropdown-item-custom">
                                    <span className="item-icon">📦</span>
                                    <span>My Orders</span>
                                </NavDropdown.Item>
                            )}
                            
                            <NavDropdown.Item as={Link} to='/favorites' className="dropdown-item-custom">
                                <span className="item-icon">❤️</span>
                                <span>Favorites</span>
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={logOut} className="dropdown-item-custom logout-item">
                                <span className="item-icon">👋</span>
                                <span>Sign Out</span>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                ) : (
                    <Nav className="gap-1">
                        <Nav.Link as={Link} to="/login" className="btn-casual login-btn">
                            Login
                        </Nav.Link>
                        <Nav.Link as={Link} to="/register" className="btn-casual signup-btn">
                            Sign Up
                        </Nav.Link>
                    </Nav>
                )}
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
};

export default Navigation;