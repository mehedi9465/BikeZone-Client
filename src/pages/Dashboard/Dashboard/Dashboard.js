import React from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
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
    let { path, url } = useRouteMatch();

    const adminMenuItems = [
        { path: '', label: 'Home', icon: '🏠' },
        { path: '/manageAllOrders', label: 'Manage All Orders', icon: '📋' },
        { path: '/addProducts', label: 'Add Products', icon: '➕' },
        { path: '/manageProducts', label: 'Manage Products', icon: '📦' },
        { path: '/makeAdmin', label: 'Make Admin', icon: '👤' }
    ];

    const userMenuItems = [
        { path: '', label: 'Home', icon: '🏠' },
        { path: '/pay', label: 'Pay', icon: '💳' },
        { path: '/myOrders', label: 'My Orders', icon: '🛒' },
        { path: '/review', label: 'Review', icon: '⭐' }
    ];

    const menuItems = isAdmin ? adminMenuItems : userMenuItems;

    return (
        <div className='dashboard' style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Row className='g-0' style={{ minHeight: '100vh' }}>
                {/* Sidebar */}
                <Col xl={2} lg={3} md={3} sm={4} xs={12} style={{ 
                    backgroundColor: '#ffffff',
                    boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
                    minHeight: '100vh'
                }}>
                    {/* User Profile Section */}
                    <div style={{ 
                        padding: '30px 20px',
                        textAlign: 'center',
                        borderBottom: '1px solid #e9ecef'
                    }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            margin: '0 auto 15px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '4px solid #e9ecef',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}>
                            {user?.photoURL ? 
                                <Image 
                                    src={user.photoURL} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                :
                                <Image 
                                    src='https://cdn-icons-png.flaticon.com/512/236/236831.png' 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            }
                        </div>
                        <h6 style={{ 
                            fontWeight: '600',
                            color: '#2c3e50',
                            marginBottom: '5px',
                            fontSize: '16px'
                        }}>
                            {user?.displayName}
                        </h6>
                        <span style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            backgroundColor: isAdmin ? '#e3f2fd' : '#f3e5f5',
                            color: isAdmin ? '#1976d2' : '#7b1fa2',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                        }}>
                            {isAdmin ? 'Admin' : 'User'}
                        </span>
                    </div>

                    {/* Navigation Menu */}
                    <nav style={{ padding: '20px 15px' }}>
                        {menuItems.map((item, index) => (
                            <Link 
                                key={index}
                                to={`${url}${item.path}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 15px',
                                    marginBottom: '8px',
                                    borderRadius: '10px',
                                    backgroundColor: '#f8f9fa',
                                    color: '#495057',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '14px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e3f2fd';
                                    e.currentTarget.style.color = '#1976d2';
                                    e.currentTarget.style.transform = 'translateX(5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    e.currentTarget.style.color = '#495057';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                                >
                                    <span style={{ fontSize: '20px', marginRight: '12px' }}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </div>
                            </Link>
                        ))}

                        {/* Logout Button */}
                        <div 
                            onClick={logOut}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 15px',
                                marginTop: '20px',
                                borderRadius: '10px',
                                backgroundColor: '#ffebee',
                                color: '#c62828',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                fontWeight: '500',
                                fontSize: '14px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#ef5350';
                                e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#ffebee';
                                e.currentTarget.style.color = '#c62828';
                            }}
                        >
                            <span style={{ fontSize: '20px', marginRight: '12px' }}>🚪</span>
                            Logout
                        </div>
                    </nav>
                </Col>
                
                {/* Main Content Area */}
                <Col xl={10} lg={9} md={9} sm={8} xs={12} style={{ 
                    padding: '0',
                    backgroundColor: '#f8f9fa'
                }}>
                    {/* Top Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '25px 40px',
                        color: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                        <h1 style={{ 
                            fontSize: '32px',
                            fontWeight: '700',
                            margin: '0',
                            letterSpacing: '-0.5px'
                        }}>
                            Dashboard
                        </h1>
                        <p style={{ 
                            margin: '5px 0 0 0',
                            fontSize: '14px',
                            opacity: '0.9'
                        }}>
                            Welcome to your {isAdmin ? 'admin' : 'personal'} dashboard
                        </p>
                    </div>

                    {/* Content Area */}
                    <div style={{ padding: '0' }}>
                        <Switch>
                            <PrivateRoute exact path={path}>
                                <DashboardHome />
                            </PrivateRoute>
                            <PrivateRoute path={`${path}/pay`}>
                                <Pay />
                            </PrivateRoute>
                            <PrivateRoute path={`${path}/myOrders`}>
                                <MyOrders />
                            </PrivateRoute>
                            <PrivateRoute path={`${path}/review`}>
                                <Review />
                            </PrivateRoute>
                            <AdminRoute path={`${path}/manageProducts`}>
                                <ManageProducts url={url} />
                            </AdminRoute>
                            <AdminRoute path={`${path}/manageAllOrders`}>
                                <ManageAllOrder />
                            </AdminRoute>
                            <AdminRoute path={`${path}/addProducts`}>
                                <AddProduct />
                            </AdminRoute>
                            <AdminRoute path={`${path}/makeAdmin`}>
                                <MakeAdmin />
                            </AdminRoute>
                            <AdminRoute path={`${path}/:productId`}>
                                <UpdateProducts />
                            </AdminRoute>
                        </Switch>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;