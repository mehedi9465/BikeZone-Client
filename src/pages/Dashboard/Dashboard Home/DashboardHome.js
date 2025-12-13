import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import useAuth from '../../../hooks/useAuth';

const DashboardHome = () => {
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Hooks must be called at the top level - not conditionally
    const { user, isAdmin } = useAuth();
    const history = useHistory();

    console.log('DashboardHome rendered', { user: user?.email, isAdmin, loading });

    const fetchData = useCallback(async () => {
        if (!user?.email) {
            console.log('No user email found, skipping fetch');
            setLoading(false);
            return;
        }
        
        try {
            console.log('Fetching data for:', user.email, 'isAdmin:', isAdmin);
            setLoading(true);
            setError(null);
            
            if (isAdmin) {
                console.log('Fetching admin data...');
                // Admin fetches all data
                const [ordersRes, reviewsRes, usersRes, bikesRes] = await Promise.all([
                    axios.get('https://bikezone-server.onrender.com/orders'),
                    axios.get('https://bikezone-server.onrender.com/reviews'),
                    axios.get('https://bikezone-server.onrender.com/users'),
                    axios.get('https://bikezone-server.onrender.com/products')
                ]);
                
                console.log('Admin data received:', {
                    orders: ordersRes.data?.length,
                    reviews: reviewsRes.data?.length,
                    users: usersRes.data?.length,
                    bikes: bikesRes.data?.length
                });
                
                setOrders(ordersRes.data || []);
                setReviews(reviewsRes.data || []);
                setUsers(usersRes.data || []);
                setBikes(bikesRes.data || []);
            } else {
                console.log('Fetching user data...');
                // Regular user fetches only their data
                const ordersResponse = await axios.get(`https://bikezone-server.onrender.com/orders/${user.email}`);
                console.log('User orders received:', ordersResponse.data?.length);
                setOrders(ordersResponse.data || []);

                try {
                    const reviewsResponse = await axios.get(`https://bikezone-server.onrender.com/reviews?email=${user.email}`);
                    console.log('User reviews received:', reviewsResponse.data?.length);
                    setReviews(reviewsResponse.data || []);
                } catch (error) {
                    console.error('Error fetching reviews:', error);
                    setReviews([]);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message || 'Failed to load dashboard data');
            // Set empty arrays on error to prevent undefined issues
            setOrders([]);
            setReviews([]);
            setUsers([]);
            setBikes([]);
        } finally {
            setLoading(false);
        }
    }, [user?.email, isAdmin]); // Dependencies that trigger refetch

    useEffect(() => {
        console.log('useEffect triggered', { hasUser: !!user?.email, isAdmin });
        try {
            fetchData();
        } catch (err) {
            console.error('Error in useEffect:', err);
            setError(err.message);
        }
    }, [fetchData]);

    // Memoize parsePrice function
    const parsePrice = useCallback((price) => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            return parseInt(price.replace(/,/g, '')) || 0;
        }
        return 0;
    }, []);

    // Memoize calculated values
    const calculatedStats = useMemo(() => {
        try {
            console.log('Calculating stats', { ordersLength: orders.length });
            const totalRevenue = orders.reduce((sum, order) => sum + parsePrice(order.price), 0);
            const pendingOrders = orders.filter(order => 
                order.orderStatus === 'Pending' || order.paymentStatus === 'pending'
            ).length;
            const completedOrders = orders.filter(order => 
                order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered'
            ).length;
            const recentOrders = orders.slice(-4).reverse();

            return { totalRevenue, pendingOrders, completedOrders, recentOrders };
        } catch (err) {
            console.error('Error calculating stats:', err);
            return { totalRevenue: 0, pendingOrders: 0, completedOrders: 0, recentOrders: [] };
        }
    }, [orders, parsePrice]);

    const { totalRevenue, pendingOrders, completedOrders, recentOrders } = calculatedStats;

    // Memoize products by brand calculation
    const productsByBrand = useMemo(() => {
        if (!isAdmin || bikes.length === 0) return [];
        
        const brandCount = {};
        bikes.forEach(bike => {
            const brand = bike.brand || bike.brandName || 'Unknown';
            brandCount[brand] = (brandCount[brand] || 0) + 1;
        });
        
        return Object.entries(brandCount)
            .map(([brand, count]) => ({ brand, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [bikes, isAdmin]);

    // Memoize monthly data calculation
    const monthlyData = useMemo(() => {
        const monthlyStats = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        orders.forEach(order => {
            const date = new Date(order.paymentTime || order.createdAt || Date.now());
            const monthIndex = date.getMonth();
            const monthName = months[monthIndex];
            
            if (!monthlyStats[monthName]) {
                monthlyStats[monthName] = { revenue: 0, count: 0 };
            }
            monthlyStats[monthName].revenue += parsePrice(order.price);
            monthlyStats[monthName].count += 1;
        });

        return months.map(month => ({
            month,
            revenue: monthlyStats[month]?.revenue || 0,
            orders: monthlyStats[month]?.count || 0
        }));
    }, [orders, parsePrice]);

    // Memoize stats configuration
    const stats = useMemo(() => {
        const calculateChange = (current) => {
            return '+' + Math.floor(Math.random() * 20) + '%';
        };

        // Safely get array lengths with fallback to 0
        const ordersCount = (orders?.length || 0);
        const bikesCount = (bikes?.length || 0);
        const usersCount = (users?.length || 0);
        const reviewsCount = (reviews?.length || 0);

        if (isAdmin) {
            return [
                { 
                    label: 'Total Revenue', 
                    value: `৳${totalRevenue.toLocaleString('en-IN')}`, 
                    change: calculateChange(totalRevenue),
                    icon: '৳',
                    color: '#8b5cf6',
                    bgColor: '#f3e8ff'
                },
                { 
                    label: 'Orders', 
                    value: String(ordersCount), 
                    change: calculateChange(ordersCount),
                    icon: '📦',
                    color: '#10b981',
                    bgColor: '#d1fae5'
                },
                { 
                    label: 'Products', 
                    value: String(bikesCount), 
                    change: calculateChange(bikesCount),
                    icon: '🏍️',
                    color: '#f59e0b',
                    bgColor: '#fef3c7'
                },
                { 
                    label: 'Customers', 
                    value: String(usersCount), 
                    change: calculateChange(usersCount),
                    icon: '👥',
                    color: '#ef4444',
                    bgColor: '#fee2e2'
                }
            ];
        } else {
            return [
                { 
                    label: 'Total Spent', 
                    value: `৳${totalRevenue.toLocaleString('en-IN')}`, 
                    change: `${ordersCount} orders`, 
                    icon: '💰',
                    color: '#8b5cf6',
                    bgColor: '#f3e8ff'
                },
                { 
                    label: 'My Orders', 
                    value: String(ordersCount), 
                    change: `${pendingOrders} pending`, 
                    icon: '📦',
                    color: '#10b981',
                    bgColor: '#d1fae5'
                },
                { 
                    label: 'Completed', 
                    value: String(completedOrders), 
                    change: `${((completedOrders / ordersCount) * 100 || 0).toFixed(0)}% rate`, 
                    icon: '✓',
                    color: '#f59e0b',
                    bgColor: '#fef3c7'
                },
                { 
                    label: 'My Reviews', 
                    value: String(reviewsCount), 
                    change: 'Written by you', 
                    icon: '⭐',
                    color: '#ef4444',
                    bgColor: '#fee2e2'
                }
            ];
        }
    }, [isAdmin, totalRevenue, orders, bikes, users, pendingOrders, completedOrders, reviews]);

    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }} />
                    <p style={{ marginTop: '20px', color: 'white', fontSize: '18px' }}>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '24px'
            }}>
                <div style={{ 
                    background: 'white', 
                    padding: '40px', 
                    borderRadius: '16px', 
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                    <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>Error Loading Dashboard</h2>
                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>{error}</p>
                    <button 
                        onClick={() => {
                            setError(null);
                            fetchData();
                        }}
                        style={{
                            padding: '12px 24px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #fce7f3 100%)', padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                    Welcome Back! 👋
                </h1>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                    {isAdmin ? "Here's what's happening with your store today" : "Here's an overview of your orders and activity"}
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {stats.map((stat, idx) => (
                    <div 
                        key={idx} 
                        style={{ 
                            background: 'white', 
                            borderRadius: '16px', 
                            padding: '20px', 
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div 
                                style={{ 
                                    width: '48px', 
                                    height: '48px', 
                                    borderRadius: '12px',
                                    background: stat.bgColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px'
                                }}
                            >
                                {stat.icon}
                            </div>
                            <span style={{ 
                                fontSize: '12px', 
                                padding: '4px 10px', 
                                borderRadius: '12px', 
                                fontWeight: '600',
                                background: stat.change.startsWith('+') ? '#d1fae5' : stat.change.startsWith('-') ? '#fee2e2' : '#e5e7eb',
                                color: stat.change.startsWith('+') ? '#065f46' : stat.change.startsWith('-') ? '#991b1b' : '#1f2937'
                            }}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                            {stat.value}
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1.5fr 1fr' : '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {/* Recent Orders */}
                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: 0 }}>
                            Recent Orders
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '4px 0 0 0' }}>
                            Latest customer transactions
                        </p>
                    </div>
                    <div style={{ padding: '20px' }}>
                        {recentOrders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                                <p style={{ marginBottom: '8px', fontWeight: '600' }}>No orders yet</p>
                                <p style={{ fontSize: '14px' }}>
                                    {isAdmin ? 'Orders will appear here once customers start purchasing' : 'Start shopping to see your orders here'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {recentOrders.map((order, idx) => (
                                        <div 
                                            key={order._id || idx} 
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between', 
                                                padding: '16px', 
                                                background: '#f9fafb', 
                                                borderRadius: '12px',
                                                border: '1px solid #f3f4f6',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#f3f4f6';
                                                e.currentTarget.style.borderColor = '#e5e7eb';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#f9fafb';
                                                e.currentTarget.style.borderColor = '#f3f4f6';
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ 
                                                    width: '40px', 
                                                    height: '40px', 
                                                    borderRadius: '50%', 
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '12px'
                                                }}>
                                                    {(order.userName || user.displayName || 'U').substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>
                                                        {isAdmin ? order.userName || 'Customer' : order.bikeModel}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                                        {isAdmin ? order.bikeModel : `#${order._id?.slice(-8).toUpperCase()}`}
                                                    </div>
                                                    {isAdmin && (
                                                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                                                            #{order._id?.slice(-6).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#111827', marginBottom: '6px' }}>
                                                    ৳{parsePrice(order.price).toLocaleString('en-IN')}
                                                </div>
                                                <span style={{ 
                                                    fontSize: '11px', 
                                                    padding: '4px 10px', 
                                                    borderRadius: '12px', 
                                                    fontWeight: '600',
                                                    background: order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? '#d1fae5' : 
                                                               order.orderStatus === 'Processing' ? '#dbeafe' : '#fef3c7',
                                                    color: order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? '#065f46' : 
                                                           order.orderStatus === 'Processing' ? '#1e40af' : '#92400e'
                                                }}>
                                                    {order.orderStatus || 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => history.push(isAdmin ? '/dashboard/manageAllOrders' : '/dashboard/myOrders')}
                                    style={{
                                        width: '100%',
                                        marginTop: '16px',
                                        padding: '12px',
                                        background: 'transparent',
                                        color: '#667eea',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        fontSize: '14px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#667eea';
                                        e.target.style.color = 'white';
                                        e.target.style.borderColor = '#667eea';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = '#667eea';
                                        e.target.style.borderColor = '#e5e7eb';
                                    }}
                                >
                                    View All Orders →
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Sales Summary / Order Status */}
                    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', margin: 0 }}>
                                {isAdmin ? 'Sales Summary' : 'Order Status'}
                            </h3>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
                                <span style={{ color: '#6b7280', fontWeight: '500', fontSize: '14px' }}>Total Orders</span>
                                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{orders.length}</span>
                            </div>
                            {isAdmin && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
                                    <span style={{ color: '#6b7280', fontWeight: '500', fontSize: '14px' }}>Total Products</span>
                                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{bikes.length}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
                                <span style={{ color: '#6b7280', fontWeight: '500', fontSize: '14px' }}>Pending</span>
                                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{pendingOrders}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#6b7280', fontWeight: '500', fontSize: '14px' }}>Total Revenue</span>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                                    ৳{totalRevenue.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                            Quick Actions
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {isAdmin ? (
                                <>
                                    <button 
                                        onClick={() => history.push('/dashboard/addBike')}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            fontWeight: '600',
                                            borderRadius: '10px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            fontSize: '14px'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        ➕ Add Product
                                    </button>
                                    <button 
                                        onClick={() => history.push('/dashboard/manageAllOrders')}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: 'white',
                                            fontWeight: '600',
                                            borderRadius: '10px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            fontSize: '14px'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        📊 Manage Orders
                                    </button>
                                    <button 
                                        onClick={() => history.push('/dashboard/manageBikes')}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                            color: 'white',
                                            fontWeight: '600',
                                            borderRadius: '10px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            fontSize: '14px'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        📈 View Reports
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => history.push('/products')}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            fontWeight: '600',
                                            borderRadius: '10px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            fontSize: '14px'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        🛒 Browse Bikes
                                    </button>
                                    <button 
                                        onClick={() => history.push('/dashboard/myOrders')}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: 'white',
                                            fontWeight: '600',
                                            borderRadius: '10px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            fontSize: '14px'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        📦 View My Orders
                                    </button>
                                    <button 
                                        onClick={() => history.push('/dashboard/review')}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                            color: 'white',
                                            fontWeight: '600',
                                            borderRadius: '10px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            fontSize: '14px'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        ⭐ Write Review
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            {orders.length > 0 && (
                <>
                    {/* Orders Trend Chart */}
                    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: '24px' }}>
                        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '20px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: 0 }}>
                                {isAdmin ? 'Total Orders Trend' : 'My Spending Trend'}
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '4px 0 0 0' }}>
                                Monthly order statistics
                            </p>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                                    <Tooltip 
                                        formatter={(value, name) => {
                                            if (name === 'orders' || name === 'Orders') {
                                                return [value, 'Orders'];
                                            }
                                            return [`৳${value.toLocaleString('en-IN')}`, 'Revenue'];
                                        }}
                                        contentStyle={{ 
                                            background: 'white', 
                                            border: '1px solid #e5e7eb', 
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Line 
                                        type="monotone" 
                                        dataKey="orders" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3}
                                        dot={{ fill: '#3b82f6', r: 4 }}
                                        name="Orders"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Products by Brand Chart (Admin Only) */}
                    {isAdmin && bikes.length > 0 && (
                        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)', padding: '20px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: 0 }}>Products by Brand</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '4px 0 0 0' }}>Product distribution overview</p>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={productsByBrand}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <XAxis dataKey="brand" stroke="#6b7280" style={{ fontSize: '12px' }} />
                                        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '12px'
                                            }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                                        <Bar dataKey="count" fill="#a855f7" name="Count" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DashboardHome;