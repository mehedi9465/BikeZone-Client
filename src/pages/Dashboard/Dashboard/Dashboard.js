import React from 'react';
import { Col, Image, ListGroup, ListGroupItem, Row, Button, Nav } from 'react-bootstrap';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import AdminRoute from '../../../Admin Route/AdminRoute';
import useAuth from '../../../hooks/useAuth';
import PrivateRoute from '../../../Private Route/PrivateRoute';
import AddProduct from '../Add  Product/AddProduct';
import DashboardHome from '../Dashboard Home/DashboardHome';
import MakeAdmin from '../Make Admin/MakeAdmin';
import ManageAllOrder from '../Manage All Order/ManageAllOrder';
import ManageProducts from '../Manage Product/ManageProducts';
import MyOrders from '../My Orders/MyOrders';
import Pay from '../Pay/Pay';
import Review from '../Review/Review';
import UpdateProducts from '../Update Products/UpdateProducts';
import './Dashboard.css'

const Dashboard = () => {
    const { user, logOut, isAdmin } = useAuth();
    console.log(isAdmin);
    let { path, url } = useRouteMatch();

    return (
        <div className='dashboard overflow-x-hidden'>
        
            <Row className='h-100'>
                <Col className=' p-0 border border-end' xl={2} lg={2} md={2} sm={3} xs={12}>
                    <Row>
                        <div className='pt-5 pb-3 px-0 text-center'>
                            {
                                user?.photoURL? 
                                <Image className='rounded-circle img-fluid' src={user?.photoURL} fluid/>
                                :
                                <Image className='rounded-circle' src='https://cdn-icons-png.flaticon.com/512/236/236831.png' width='96' fluid/>
                            }
                            <p className='lead mt-3 w-75 mx-auto'>{user?.displayName}</p>
                        </div>
                    </Row>
                    {
                        isAdmin ?
                        <Nav className='d-flex justify-content-center'>
                            <Nav.Link as={Link} to={`${url}`}>
                                <Button className='rounded-pill ' size='sm' variant='outline-secondary'><Image src='https://cdn-icons-png.flaticon.com/512/3596/3596992.png' width='18' />&nbsp;  Home</Button>
                            </Nav.Link>
                            <Nav.Link as={Link} to={`${url}/manageAllOrders`}>
                                <Button className='rounded-pill ' size='sm' variant='outline-secondary'><Image src='https://cdn-icons-png.flaticon.com/512/3596/3596992.png' width='18' />&nbsp;  Manage All Orders</Button>
                            </Nav.Link>
                            <Nav.Link as={Link} to={`${url}/addProducts`}>
                                <Button className='rounded-pill ' size='sm' variant='outline-secondary'><Image src='https://cdn-icons-png.flaticon.com/512/3596/3596992.png' width='18' />&nbsp;  Add Products</Button>
                            </Nav.Link>
                            <Nav.Link as={Link} to={`${url}/manageProducts`}>
                                <Button className='rounded-pill ' size='sm' variant='outline-secondary'><Image src='https://cdn-icons-png.flaticon.com/512/3596/3596992.png' width='18' />&nbsp;  Manage Products</Button>
                            </Nav.Link>
                            <Nav.Link as={Link} to={`${url}/makeAdmin`}>
                                <Button className='rounded-pill ' size='sm' variant='outline-secondary'><Image src='https://cdn-icons-png.flaticon.com/512/3596/3596992.png' width='18' />&nbsp;  Make Admin</Button>
                            </Nav.Link>
                            <Nav.Link>
                                <Button onClick={logOut} className='rounded-pill ' size='sm' variant='outline-secondary'><Image src='https://cdn-icons-png.flaticon.com/512/3596/3596992.png' width='18' />&nbsp;  Logout</Button>
                            </Nav.Link>
                        </Nav>
                        :
                        <Nav className='d-flex justify-content-center'>
                            <Nav.Link as={Link} to={`${url}`}>
                                <Button className='rounded-pill ' size='sm' variant='outline-secondary'><Image src='https://cdn-icons-png.flaticon.com/512/3596/3596992.png' width='18' />&nbsp;  Home</Button>
                            </Nav.Link>
                            <Nav.Link as={Link} to={`${url}/pay`}>
                                <Button className='rounded-pill ' size='sm' variant='outline-secondary'><Image src='https://cdn-icons-png.flaticon.com/512/3596/3596992.png' width='18' />&nbsp;  Pay</Button>
                            </Nav.Link>
                            <Nav.Link as={Link} to={`${url}/myOrders`}>
                                <Button className='rounded-pill ' size='sm' variant='outline-secondary'><Image src='https://cdn-icons-png.flaticon.com/512/3596/3596992.png' width='18' />&nbsp;  My Orders</Button>
                            </Nav.Link>
                            <Nav.Link as={Link} to={`${url}/review`}>
                                <Button className='rounded-pill ' size='sm' variant='outline-secondary'><Image src='https://cdn-icons-png.flaticon.com/512/3596/3596992.png' width='18' />&nbsp;  Review</Button>
                            </Nav.Link>
                            <Nav.Link>
                                <Button onClick={logOut} className='rounded-pill ' size='sm' variant='outline-secondary'><Image src='https://cdn-icons-png.flaticon.com/512/3596/3596992.png' width='18' />&nbsp;  Logout</Button>
                            </Nav.Link>
                        </Nav>
                    }
                    
                    {/* <ListGroup>
                        <ListGroupItem className='bg-transparent border-0 px-0 d-flex'> <Button variant='outline-dark border-end-0 rounded-0' className='w-100'><Image src='https://cdn-icons-png.flaticon.com/512/2331/2331889.png' width='25' /> &nbsp; &nbsp; Pay</Button></ListGroupItem>
                        <ListGroupItem className='bg-transparent border-0 px-0 d-flex'> <Button variant='outline-dark border-end-0 rounded-0' className='w-100'><Image src='https://cdn-icons-png.flaticon.com/512/2331/2331889.png' width='25' /> &nbsp; &nbsp; Pay</Button></ListGroupItem>
                        <ListGroupItem className='bg-transparent border-0 px-0 d-flex'> <Button variant='outline-dark border-end-0 rounded-0' className='w-100'><Image src='https://cdn-icons-png.flaticon.com/512/2331/2331889.png' width='25' /> &nbsp; &nbsp; Pay</Button></ListGroupItem>
                        <ListGroupItem className='bg-transparent border-0 px-0 d-flex'> <Button variant='outline-dark border-end-0 rounded-0' className='w-100'><Image src='https://cdn-icons-png.flaticon.com/512/2331/2331889.png' width='25' /> &nbsp; &nbsp; Pay</Button></ListGroupItem>
                    </ListGroup> */}
                </Col>
                
                <Col className='ps-0 pe-0' xl={10} lg={10} md={10} sm={9} xs={12}>
                <h1 className='w-100 bg-info text-white display-5 py-2 text-center'>Dashboard</h1>
                    <Switch>
                        <PrivateRoute exact path={path}>
                            <DashboardHome></DashboardHome>
                        </PrivateRoute>
                        <PrivateRoute path={`${path}/pay`}>
                            <Pay></Pay>
                        </PrivateRoute>
                        <PrivateRoute path={`${path}/myOrders`}>
                            <MyOrders></MyOrders>
                        </PrivateRoute>
                        <PrivateRoute path={`${path}/review`}>
                            <Review></Review>
                        </PrivateRoute>
                        <AdminRoute path={`${path}/manageProducts`}>
                            <ManageProducts url={url}></ManageProducts>
                        </AdminRoute>
                        <AdminRoute path={`${path}/manageAllOrders`}>
                            <ManageAllOrder></ManageAllOrder>
                        </AdminRoute>
                        <AdminRoute path={`${path}/addProducts`}>
                            <AddProduct></AddProduct>
                        </AdminRoute>
                        <AdminRoute path={`${path}/makeAdmin`}>
                            <MakeAdmin></MakeAdmin>
                        </AdminRoute>
                        <AdminRoute path={`${path}/:productId`}>
                            <UpdateProducts></UpdateProducts>
                        </AdminRoute>
                    </Switch>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;