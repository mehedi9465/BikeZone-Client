import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Image, Spinner } from 'react-bootstrap';
import swal from 'sweetalert';

const ManageAllOrder = () => {
    const [orders, setOrders] = useState([]);
    const [dependency, setDependencey] = useState({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        setLoading(true);
        axios.get('https://bikezone-server.onrender.com/orders')
        .then(({ data }) => {
            setOrders(data);
            setLoading(false);
        })
        .catch(error => {
            console.error(error);
            setLoading(false);
        });
    }, [dependency]);

    const handleDelete = (id) => {
        swal({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            dangerMode: true,
            buttons: ["Cancel", "Delete"],
        }).then(result => {
            if(result){
                axios.delete(`https://bikezone-server.onrender.com/orders/${id}`)
                .then(({ data }) => {
                    if(data.deletedCount === 1){
                        swal({
                            title: "Deleted!",
                            text: "Order has been deleted successfully",
                            icon: "success",
                            button: "OK",
                        });
                        const filtered = orders.filter(order => order._id !== id);
                        setOrders(filtered);
                    }
                    else{
                        swal("Failed!", "Failed to delete order", "error");
                    }
                });
            }
        });
    }

    const handleShipping = (id) => {
        swal({
            title: "Start Shipping?",
            text: "Do you want to mark this order as shipped?",
            icon: "info",
            buttons: ["Cancel", "Yes, Ship it!"],
        }).then(result => {
            if(result){
                axios.put(`https://bikezone-server.onrender.com/orders/shipping/${id}`)
                .then(({ data }) => {
                    if(data.modifiedCount === 1){
                        swal({
                            title: "Successfully Shipped!",
                            icon: "success",
                            button: "OK",
                        });
                        setDependencey(data);
                    }
                    else{
                        swal({
                            title: "Something went wrong!",
                            icon: "error",
                            button: "OK",
                        });
                    }
                });
            }
        });
    }

    const filteredOrders = filter === 'all' 
        ? orders 
        : orders.filter(order => order?.orderStatus?.toLowerCase() === filter);

    const getStatusStyle = (status) => {
        switch(status?.toLowerCase()) {
            case 'shipped':
                return {
                    background: '#d4edda',
                    color: '#155724',
                    border: '1px solid #c3e6cb'
                };
            case 'pending':
                return {
                    background: '#fff3cd',
                    color: '#856404',
                    border: '1px solid #ffeaa7'
                };
            default:
                return {
                    background: '#e2e3e5',
                    color: '#383d41',
                    border: '1px solid #d6d8db'
                };
        }
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header Section */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '25px 30px',
                marginBottom: '25px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                        <h2 style={{ margin: '0', fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>
                            Manage Orders
                        </h2>
                        <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
                            Total Orders: <span style={{ fontWeight: '600', color: '#495057' }}>{filteredOrders.length}</span>
                        </p>
                    </div>
                    
                    {/* Filter Buttons */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {['all', 'pending', 'shipped'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '8px',
                                    border: filter === status ? '2px solid #667eea' : '1px solid #dee2e6',
                                    background: filter === status ? '#667eea' : 'white',
                                    color: filter === status ? 'white' : '#495057',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textTransform: 'capitalize'
                                }}
                                onMouseEnter={(e) => {
                                    if (filter !== status) {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.color = '#667eea';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (filter !== status) {
                                        e.target.style.borderColor = '#dee2e6';
                                        e.target.style.color = '#495057';
                                    }
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <Spinner animation="border" variant="primary" />
                    <p style={{ marginTop: '15px', color: '#6c757d' }}>Loading orders...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '60px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>📦</div>
                    <h3 style={{ color: '#6c757d', fontWeight: '500' }}>No orders found</h3>
                    <p style={{ color: '#adb5bd' }}>Try adjusting your filters</p>
                </div>
            ) : (
                /* Orders Table */
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                    <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                                        Customer Name
                                    </th>
                                    <th style={{ padding: '18px 20px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                                        Price
                                    </th>
                                    <th style={{ padding: '18px 20px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                                        Location
                                    </th>
                                    <th style={{ padding: '18px 20px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                                        Status
                                    </th>
                                    <th style={{ padding: '18px 20px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr 
                                        key={order?._id}
                                        style={{ 
                                            borderBottom: '1px solid #e9ecef',
                                            transition: 'background 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        <td style={{ padding: '20px', fontSize: '14px', color: '#2c3e50', fontWeight: '500' }}>
                                            {order?.customerName}
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'center', fontSize: '16px', fontWeight: '600', color: '#28a745' }}>
                                            ${order?.price}
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'center', fontSize: '14px', color: '#6c757d' }}>
                                            {order?.deliveryLocation}
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'center' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '6px 16px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                textTransform: 'capitalize',
                                                ...getStatusStyle(order?.orderStatus)
                                            }}>
                                                {order?.orderStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                                {order?.orderStatus?.toLowerCase() !== 'shipped' && (
                                                    <Button
                                                        onClick={() => handleShipping(order?._id)}
                                                        style={{
                                                            background: '#e3f2fd',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            padding: '8px 12px',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.background = '#2196f3';
                                                            e.target.style.transform = 'scale(1.05)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.background = '#e3f2fd';
                                                            e.target.style.transform = 'scale(1)';
                                                        }}
                                                    >
                                                        <Image 
                                                            src='https://cdn-icons-png.flaticon.com/512/600/600186.png' 
                                                            width='20'
                                                            title="Ship Order"
                                                        />
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={() => handleDelete(order?._id)}
                                                    style={{
                                                        background: '#ffebee',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '8px 12px',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = '#ef5350';
                                                        e.target.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = '#ffebee';
                                                        e.target.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <Image 
                                                        src='https://i.ibb.co/jDqXJSc/3221897.png' 
                                                        width='20'
                                                        title="Delete Order"
                                                    />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAllOrder;