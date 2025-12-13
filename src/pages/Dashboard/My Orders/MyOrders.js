import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import swal from 'sweetalert';
import useAuth from '../../../hooks/useAuth';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.email) {
            setLoading(true);
            axios.get(`https://bikezone-server.onrender.com/orders/${user.email}`)
                .then(({ data }) => {
                    console.log(data);
                    setOrders(data || []);
                })
                .catch(error => {
                    console.error('Error fetching orders:', error);
                    setOrders([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user?.email]);

    const handleDelete = (id) => {
        swal({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            buttons: ["Cancel", "Yes, delete it!"],
            dangerMode: true,
        }).then(result => {
            if (result) {
                axios.delete(`https://bikezone-server.onrender.com/orders/${id}`)
                    .then(({ data }) => {
                        if (data.deletedCount === 1) {
                            swal({
                                title: "Successfully Deleted!",
                                icon: "success",
                                button: "OK",
                            });
                            const filtered = orders.filter(order => order._id !== id);
                            setOrders(filtered);
                        } else {
                            swal({
                                title: "Something went wrong!",
                                icon: "error",
                                button: "OK",
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting order:', error);
                        swal({
                            title: "Failed to delete!",
                            icon: "error",
                            button: "OK",
                        });
                    });
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return { bg: '#d1fae5', text: '#065f46' };
            case 'shipped':
                return { bg: '#dbeafe', text: '#1e40af' };
            case 'processing':
                return { bg: '#fef3c7', text: '#92400e' };
            case 'pending':
                return { bg: '#fee2e2', text: '#991b1b' };
            default:
                return { bg: '#f3f4f6', text: '#1f2937' };
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #fce7f3 100%)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <Spinner animation="border" style={{ width: '3rem', height: '3rem', color: '#667eea' }} />
                    <p style={{ marginTop: '20px', color: '#6b7280', fontSize: '16px' }}>Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #fce7f3 100%)',
            padding: '40px 20px'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: '700',
                        color: '#1f2937',
                        marginBottom: '8px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        My Orders 📦
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '16px' }}>
                        Track and manage all your orders in one place
                    </p>
                </div>

                {/* Orders Summary */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Orders</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{orders.length}</div>
                    </div>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Pending</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
                            {orders.filter(o => o.orderStatus === 'Pending').length}
                        </div>
                    </div>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Shipped</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
                            {orders.filter(o => o.orderStatus === 'Shipped').length}
                        </div>
                    </div>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Delivered</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
                            {orders.filter(o => o.orderStatus === 'Delivered').length}
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '60px',
                        textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
                        <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                            No orders yet
                        </h3>
                        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                            Start shopping to see your orders here
                        </p>
                        <button
                            onClick={() => window.location.href = '/bikes'}
                            style={{
                                padding: '12px 32px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Browse Bikes
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {orders.map((order, index) => {
                            const statusColor = getStatusColor(order?.orderStatus);
                            const canDelete = order?.orderStatus !== 'Shipped' && order?.orderStatus !== 'Delivered';

                            return (
                                <div
                                    key={order?._id || index}
                                    style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        transition: 'all 0.3s',
                                        border: '2px solid transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                >
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'auto 1fr auto',
                                        gap: '24px',
                                        alignItems: 'center'
                                    }}>
                                        {/* Order Icon */}
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '28px'
                                        }}>
                                            🏍️
                                        </div>

                                        {/* Order Details */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: '500' }}>
                                                    CUSTOMER NAME
                                                </div>
                                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                                                    {order?.customerName || 'N/A'}
                                                </div>
                                            </div>

                                            <div>
                                                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: '500' }}>
                                                    BIKE MODEL
                                                </div>
                                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                                                    {order?.bikeModel || 'N/A'}
                                                </div>
                                            </div>

                                            <div>
                                                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: '500' }}>
                                                    PRICE
                                                </div>
                                                <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
                                                    ৳{order?.price?.toLocaleString('en-IN') || '0'}
                                                </div>
                                            </div>

                                            <div>
                                                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: '500' }}>
                                                    DELIVERY LOCATION
                                                </div>
                                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                                                    📍 {order?.deliveryLocation || 'N/A'}
                                                </div>
                                            </div>

                                            <div>
                                                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: '500' }}>
                                                    ORDER STATUS
                                                </div>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '6px 12px',
                                                    borderRadius: '8px',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    background: statusColor.bg,
                                                    color: statusColor.text
                                                }}>
                                                    {order?.orderStatus || 'Pending'}
                                                </span>
                                            </div>

                                            <div>
                                                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: '500' }}>
                                                    ORDER ID
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', fontFamily: 'monospace' }}>
                                                    #{order?._id?.slice(-8).toUpperCase()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div>
                                            <button
                                                onClick={() => handleDelete(order?._id)}
                                                disabled={!canDelete}
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '10px',
                                                    border: 'none',
                                                    background: canDelete ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : '#f3f4f6',
                                                    color: canDelete ? 'white' : '#9ca3af',
                                                    cursor: canDelete ? 'pointer' : 'not-allowed',
                                                    transition: 'all 0.3s',
                                                    fontSize: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (canDelete) {
                                                        e.target.style.transform = 'scale(1.1)';
                                                        e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (canDelete) {
                                                        e.target.style.transform = 'scale(1)';
                                                        e.target.style.boxShadow = 'none';
                                                    }
                                                }}
                                                title={canDelete ? 'Delete Order' : 'Cannot delete shipped/delivered orders'}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;