import React from "react";
import { Container, Image, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import './Navigation.css';
import { HashLink } from 'react-router-hash-link';

const Navigation = () => {
    const { user, logOut } = useAuth();
    
    return (
        <Navbar className='w-100 sticky-top' id='navbar' bg='dark' variant='dark' expand="md">
        <Container>
            <Navbar.Brand href="#home"> <Image src='https://i.ibb.co/09BwKNp/2684195.png' width='32' fluid/> BikeZone</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
                <Nav.Link as={HashLink} to="/#banner">Home</Nav.Link>
                <Nav.Link as={HashLink} to="/#products">Products</Nav.Link>
                <Nav.Link as={HashLink} to="/#about">About</Nav.Link>
                <Nav.Link as={HashLink} to="/#review">Reviews</Nav.Link>
            </Nav>
            
                {
                    user?.email &&
                    <>
                        {
                            user?.photoURL ?

                            <Nav className='d-flex justify-content-center align-items-center'>
                            <NavDropdown title={<Image className='rounded-circle' src={user?.photoURL} height='28'/>} id="basic-nav-dropdown">
                            <NavDropdown.Item>{user?.displayName}</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={logOut} >LogOut</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link as={Link} to='/dashboard'>
                                <Button className='rounded-pill ' size='sm' variant='outline-secondary'><Image src='https://cdn-icons-png.flaticon.com/512/3596/3596992.png' width='18' />&nbsp;  Dashboard</Button>
                            </Nav.Link>
                            </Nav>
                            :
                            <Nav className='d-flex justify-content-center align-items-center'>
                            <NavDropdown title={<Image className='rounded-circle my-2' src='https://cdn-icons-png.flaticon.com/512/236/236831.png' height='28'/>} id="basic-nav-dropdown">
                            <NavDropdown.Item>{user?.displayName}</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={logOut} >LogOut</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link as={Link} to='/dashboard'>
                                <Button className='rounded-pill ' size='sm' variant='outline-secondary'><Image src='https://cdn-icons-png.flaticon.com/512/3596/3596992.png' width='18' />&nbsp;  Dashboard</Button>
                            </Nav.Link>
                            </Nav>
                        }
                    </>
                }

                {
                !user?.email &&
                <Nav>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </Nav>
                }
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
};

export default Navigation;