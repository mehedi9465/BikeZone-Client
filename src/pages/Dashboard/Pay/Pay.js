import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Card, Badge, Table, Spinner, Alert, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';

const Pay = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const receiptRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.email) {
            fetchOrders();
        }
    }, [user?.email]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`https://bikezone-server.onrender.com/orders/${user.email}`);
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: { variant: 'success', icon: '✓', text: 'Completed' },
            shipped: { variant: 'success', icon: '🚚', text: 'Shipped' },
            paid: { variant: 'success', icon: '✓', text: 'Paid' },
            pending: { variant: 'warning', icon: '⏳', text: 'Pending' },
            failed: { variant: 'danger', icon: '✗', text: 'Failed' },
            processing: { variant: 'info', icon: '⚡', text: 'Processing' },
            refunded: { variant: 'secondary', icon: '↩', text: 'Refunded' }
        };

        const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
        return (
            <Badge bg={config.variant} style={{ fontSize: '13px', padding: '8px 12px' }}>
                {config.icon} {config.text}
            </Badge>
        );
    };

    const getPaymentMethodIcon = (method) => {
        const icons = {
            bkash: '📱',
            nagad: '💰',
            card: '💳',
            cod: '💵'
        };
        return icons[method?.toLowerCase()] || '💳';
    };

    const getPaymentMethodName = (method) => {
        const names = {
            bkash: 'bKash',
            nagad: 'Nagad',
            card: 'Credit/Debit Card',
            cod: 'Cash on Delivery'
        };
        return names[method?.toLowerCase()] || method || 'N/A';
    };

    const parsePrice = (price) => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            return parseInt(price.replace(/,/g, '')) || 0;
        }
        return 0;
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const receiptContent = receiptRef.current.innerHTML;
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Receipt - Order #${selectedOrder._id?.slice(-8).toUpperCase()}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        padding: 20px;
                        background: white;
                    }
                    
                    .receipt-container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        border: 2px solid #667eea;
                        border-radius: 15px;
                        overflow: hidden;
                    }
                    
                    .receipt-header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    
                    .company-name {
                        font-size: 32px;
                        font-weight: 700;
                        margin-bottom: 5px;
                    }
                    
                    .company-tagline {
                        font-size: 14px;
                        opacity: 0.9;
                    }
                    
                    .receipt-title {
                        font-size: 24px;
                        font-weight: 700;
                        margin-top: 20px;
                        padding-top: 20px;
                        border-top: 2px solid rgba(255,255,255,0.3);
                    }
                    
                    .receipt-body {
                        padding: 30px;
                    }
                    
                    .order-info {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px dashed #e0e0e0;
                    }
                    
                    .info-block {
                        flex: 1;
                    }
                    
                    .info-label {
                        color: #666;
                        font-size: 12px;
                        margin-bottom: 5px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    
                    .info-value {
                        color: #333;
                        font-size: 15px;
                        font-weight: 600;
                    }
                    
                    .section-title {
                        color: #667eea;
                        font-size: 16px;
                        font-weight: 700;
                        margin: 25px 0 15px 0;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #f0f0f0;
                    }
                    
                    .customer-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                        margin-bottom: 25px;
                    }
                    
                    .customer-item {
                        background: #f8f9ff;
                        padding: 12px;
                        border-radius: 8px;
                    }
                    
                    .product-box {
                        background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
                        border: 2px solid #e9ecef;
                        border-radius: 12px;
                        padding: 20px;
                        margin-bottom: 25px;
                    }
                    
                    .product-name {
                        font-size: 20px;
                        font-weight: 700;
                        color: #2d3748;
                        margin-bottom: 10px;
                    }
                    
                    .product-price {
                        font-size: 24px;
                        font-weight: 700;
                        color: #667eea;
                        text-align: right;
                    }
                    
                    .payment-status-box {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                        margin-bottom: 25px;
                    }
                    
                    .status-card {
                        text-align: center;
                        padding: 20px;
                        border-radius: 12px;
                        border: 2px dashed #ccc;
                    }
                    
                    .status-icon {
                        font-size: 36px;
                        margin-bottom: 10px;
                    }
                    
                    .summary-box {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 25px;
                        border-radius: 12px;
                        margin-top: 25px;
                    }
                    
                    .summary-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 12px;
                        font-size: 15px;
                    }
                    
                    .summary-total {
                        border-top: 2px solid rgba(255,255,255,0.3);
                        padding-top: 15px;
                        margin-top: 15px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    .total-label {
                        font-size: 18px;
                        font-weight: 700;
                    }
                    
                    .total-amount {
                        font-size: 28px;
                        font-weight: 700;
                    }
                    
                    .receipt-footer {
                        background: #f8f9fa;
                        padding: 20px 30px;
                        text-align: center;
                        border-top: 2px solid #e0e0e0;
                    }
                    
                    .footer-text {
                        color: #666;
                        font-size: 13px;
                        margin-bottom: 5px;
                    }
                    
                    .status-badge {
                        display: inline-block;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-weight: 600;
                        font-size: 14px;
                        margin: 15px 0;
                    }
                    
                    .status-completed, .status-shipped, .status-paid {
                        background: #d4edda;
                        color: #155724;
                    }
                    
                    .status-pending {
                        background: #fff3cd;
                        color: #856404;
                    }
                    
                    @media print {
                        body {
                            padding: 0;
                        }
                        
                        .receipt-container {
                            border: none;
                            box-shadow: none;
                        }
                    }
                </style>
            </head>
            <body>
                ${receiptContent}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    const getEffectiveStatus = (order) => {
        // Check paymentStatus first, then orderStatus
        const status = order.paymentStatus || order.orderStatus;
        return status?.toLowerCase();
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        const effectiveStatus = getEffectiveStatus(order);
        
        if (filter === 'completed') {
            return effectiveStatus === 'completed' || effectiveStatus === 'shipped' || effectiveStatus === 'paid';
        }
        return effectiveStatus === filter;
    });

    const totalAmount = filteredOrders.reduce((sum, order) => {
        return sum + parsePrice(order.price);
    }, 0);

    const completedCount = orders.filter(o => {
        const status = getEffectiveStatus(o);
        return status === 'completed' || status === 'shipped' || status === 'paid';
    }).length;
    
    const pendingCount = orders.filter(o => getEffectiveStatus(o) === 'pending').length;

    if (loading) {
        return (
            <Container className="py-5">
                <div className="text-center">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-3 text-muted">Loading payment history...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col lg={11}>
                    {/* Header */}
                    <div className="mb-5">
                        <h2 className="fw-bold mb-2" style={{ color: '#667eea' }}>💳 Payment History</h2>
                        <p className="text-muted">View and manage all your payment transactions</p>
                    </div>

                    {/* Stats Cards */}
                    <Row className="g-4 mb-4">
                        <Col md={3}>
                            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                                <Card.Body className="p-4">
                                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
                                    <h3 className="mb-1 fw-bold">৳{totalAmount.toLocaleString('en-IN')}</h3>
                                    <small className="text-muted">Total Spent</small>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3}>
                            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                                <Card.Body className="p-4">
                                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>📊</div>
                                    <h3 className="mb-1 fw-bold">{orders.length}</h3>
                                    <small className="text-muted">Total Transactions</small>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3}>
                            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                                <Card.Body className="p-4">
                                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>✓</div>
                                    <h3 className="mb-1 fw-bold">{completedCount}</h3>
                                    <small className="text-muted">Completed</small>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3}>
                            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                                <Card.Body className="p-4">
                                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
                                    <h3 className="mb-1 fw-bold">{pendingCount}</h3>
                                    <small className="text-muted">Pending</small>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Filter */}
                    <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <Row className="align-items-center">
                                <Col md={6}>
                                    <h5 className="mb-0 fw-semibold">Transaction List</h5>
                                </Col>
                                <Col md={6}>
                                    <Form.Select 
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        style={{ borderRadius: '10px' }}
                                    >
                                        <option value="all">All Transactions</option>
                                        <option value="completed">Completed/Paid</option>
                                        <option value="paid">Paid</option>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="failed">Failed</option>
                                        <option value="refunded">Refunded</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Payment List */}
                    {filteredOrders.length === 0 ? (
                        <Card className="border-0 shadow-sm text-center py-5" style={{ borderRadius: '15px' }}>
                            <Card.Body>
                                <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.5 }}>📭</div>
                                <h5 className="mb-2">No Payments Found</h5>
                                <p className="text-muted mb-0">
                                    {filter === 'all' 
                                        ? "You haven't made any payments yet." 
                                        : `No ${filter} payments found.`}
                                </p>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                            <Card.Body className="p-0">
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead style={{ background: '#f8f9fa' }}>
                                            <tr>
                                                <th className="border-0 p-4">Order ID</th>
                                                <th className="border-0 p-4">Date</th>
                                                <th className="border-0 p-4">Bike Model</th>
                                                <th className="border-0 p-4">Payment Method</th>
                                                <th className="border-0 p-4">Amount</th>
                                                <th className="border-0 p-4">Status</th>
                                                <th className="border-0 p-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.map((order) => (
                                                <tr key={order._id}>
                                                    <td className="p-4">
                                                        <span className="font-monospace text-primary fw-semibold">
                                                            #{order._id?.slice(-8).toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        {order.paymentTime || order.createdAt ? 
                                                            new Date(order.paymentTime || order.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })
                                                            : 'N/A'
                                                        }
                                                    </td>
                                                    <td className="p-4 fw-semibold">{order.bikeModel}</td>
                                                    <td className="p-4">
                                                        <span style={{ fontSize: '20px', marginRight: '8px' }}>
                                                            {getPaymentMethodIcon(order.paymentMethod)}
                                                        </span>
                                                        {getPaymentMethodName(order.paymentMethod)}
                                                    </td>
                                                    <td className="p-4">
                                                        <strong style={{ fontSize: '16px' }}>
                                                            ৳{parsePrice(order.price).toLocaleString('en-IN')}
                                                        </strong>
                                                    </td>
                                                    <td className="p-4">
                                                        {getStatusBadge(order.paymentStatus || order.orderStatus)}
                                                    </td>
                                                    <td className="p-4">
                                                        <Button 
                                                            variant="outline-primary" 
                                                            size="sm"
                                                            style={{ borderRadius: '8px' }}
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setShowDetailsModal(true);
                                                            }}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    )}

                    {/* Info Alert */}
                    {orders.length > 0 && (
                        <Alert variant="info" className="mt-4" style={{ borderRadius: '12px' }}>
                            <div className="d-flex align-items-start">
                                <div style={{ fontSize: '24px', marginRight: '15px' }}>ℹ️</div>
                                <div>
                                    <strong>Need help with a payment?</strong>
                                    <p className="mb-0 mt-1">
                                        Contact our support team at <strong>support@bikezone.com</strong> or call{' '}
                                        <strong>+880-XXX-XXXXXX</strong>
                                    </p>
                                </div>
                            </div>
                        </Alert>
                    )}
                </Col>
            </Row>

            {/* Order Details Modal */}
            <Modal
                show={showDetailsModal}
                onHide={() => setShowDetailsModal(false)}
                size="lg"
                centered
            >
                <Modal.Header 
                    closeButton 
                    style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none'
                    }}
                >
                    <Modal.Title style={{ fontWeight: '700' }}>
                        📦 Order Details
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body style={{ padding: '0' }}>
                    {selectedOrder && (
                        <>
                            {/* Order Header */}
                            <div style={{ 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                padding: '30px',
                                color: 'white'
                            }}>
                                <Row>
                                    <Col md={6}>
                                        <p style={{ opacity: 0.9, marginBottom: '5px', fontSize: '14px' }}>Order ID</p>
                                        <h5 className="font-monospace" style={{ fontWeight: '700' }}>
                                            #{selectedOrder._id?.slice(-8).toUpperCase()}
                                        </h5>
                                    </Col>
                                    <Col md={6} className="text-md-end">
                                        <p style={{ opacity: 0.9, marginBottom: '5px', fontSize: '14px' }}>Order Date</p>
                                        <h5 style={{ fontWeight: '600' }}>
                                            {selectedOrder.paymentTime || selectedOrder.createdAt ? 
                                                new Date(selectedOrder.paymentTime || selectedOrder.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                                : 'N/A'
                                            }
                                        </h5>
                                    </Col>
                                </Row>
                            </div>

                            {/* Customer Information */}
                            <div style={{ padding: '30px' }}>
                                <h6 style={{ 
                                    color: '#667eea', 
                                    fontWeight: '700', 
                                    marginBottom: '20px',
                                    fontSize: '18px'
                                }}>
                                    👤 Customer Information
                                </h6>
                                <Row className="g-3 mb-4">
                                    <Col md={6}>
                                        <Card style={{ 
                                            background: '#f8f9ff', 
                                            border: 'none',
                                            borderRadius: '12px'
                                        }}>
                                            <Card.Body className="p-3">
                                                <small className="text-muted d-block mb-1">Name</small>
                                                <strong style={{ fontSize: '15px' }}>{selectedOrder.customerName}</strong>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card style={{ 
                                            background: '#f8f9ff', 
                                            border: 'none',
                                            borderRadius: '12px'
                                        }}>
                                            <Card.Body className="p-3">
                                                <small className="text-muted d-block mb-1">Email</small>
                                                <strong style={{ fontSize: '15px' }}>{selectedOrder.customerEmail}</strong>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card style={{ 
                                            background: '#f8f9ff', 
                                            border: 'none',
                                            borderRadius: '12px'
                                        }}>
                                            <Card.Body className="p-3">
                                                <small className="text-muted d-block mb-1">Phone</small>
                                                <strong style={{ fontSize: '15px' }}>
                                                    {selectedOrder.customerPhone || 'N/A'}
                                                </strong>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card style={{ 
                                            background: '#f8f9ff', 
                                            border: 'none',
                                            borderRadius: '12px'
                                        }}>
                                            <Card.Body className="p-3">
                                                <small className="text-muted d-block mb-1">Delivery Location</small>
                                                <strong style={{ fontSize: '15px' }}>
                                                    {selectedOrder.deliveryLocation}
                                                </strong>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                {/* Product Information */}
                                <h6 style={{ 
                                    color: '#667eea', 
                                    fontWeight: '700', 
                                    marginBottom: '20px',
                                    fontSize: '18px'
                                }}>
                                    🏍️ Product Information
                                </h6>
                                <Card style={{ 
                                    background: 'linear-gradient(135deg, #f8f9ff 0%, #fff 100%)',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '15px',
                                    marginBottom: '25px'
                                }}>
                                    <Card.Body className="p-4">
                                        <Row className="align-items-center">
                                            <Col md={8}>
                                                <h5 className="mb-2" style={{ fontWeight: '700', color: '#2d3748' }}>
                                                    {selectedOrder.bikeModel}
                                                </h5>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Badge bg="secondary" style={{ fontSize: '12px' }}>
                                                        Bike
                                                    </Badge>
                                                    <span className="text-muted">Quantity: 1</span>
                                                </div>
                                            </Col>
                                            <Col md={4} className="text-md-end">
                                                <h4 style={{ fontWeight: '700', color: '#667eea', marginBottom: '0' }}>
                                                    ৳{parsePrice(selectedOrder.price).toLocaleString('en-IN')}
                                                </h4>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                {/* Payment & Status Information */}
                                <h6 style={{ 
                                    color: '#667eea', 
                                    fontWeight: '700', 
                                    marginBottom: '20px',
                                    fontSize: '18px'
                                }}>
                                    💳 Payment & Status
                                </h6>
                                <Row className="g-3 mb-4">
                                    <Col md={6}>
                                        <Card style={{ 
                                            background: '#fff5f8', 
                                            border: '2px dashed #E2136E',
                                            borderRadius: '12px'
                                        }}>
                                            <Card.Body className="p-3 text-center">
                                                <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                                                    {getPaymentMethodIcon(selectedOrder.paymentMethod)}
                                                </div>
                                                <small className="text-muted d-block mb-1">Payment Method</small>
                                                <strong style={{ fontSize: '15px' }}>
                                                    {getPaymentMethodName(selectedOrder.paymentMethod)}
                                                </strong>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card style={{ 
                                            background: '#f0fff4', 
                                            border: '2px dashed #28a745',
                                            borderRadius: '12px'
                                        }}>
                                            <Card.Body className="p-3 text-center">
                                                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📦</div>
                                                <small className="text-muted d-block mb-1">Order Status</small>
                                                <strong style={{ fontSize: '15px' }}>
                                                    {selectedOrder.orderStatus}
                                                </strong>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <div className="text-center mb-3">
                                    {getStatusBadge(selectedOrder.paymentStatus || selectedOrder.orderStatus)}
                                </div>

                                {/* Order Summary */}
                                <Card style={{ 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    borderRadius: '15px',
                                    color: 'white'
                                }}>
                                    <Card.Body className="p-4">
                                        <h6 style={{ fontWeight: '600', marginBottom: '20px' }}>
                                            Order Summary
                                        </h6>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span style={{ opacity: 0.9 }}>Subtotal:</span>
                                            <strong>৳{parsePrice(selectedOrder.price).toLocaleString('en-IN')}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3">
                                            <span style={{ opacity: 0.9 }}>Delivery Fee:</span>
                                            <strong className="text-warning">Free</strong>
                                        </div>
                                        <div style={{ 
                                            borderTop: '2px solid rgba(255,255,255,0.3)', 
                                            paddingTop: '15px'
                                        }}>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span style={{ fontSize: '18px', fontWeight: '700' }}>Total Amount:</span>
                                                <strong style={{ fontSize: '24px' }}>
                                                    ৳{parsePrice(selectedOrder.price).toLocaleString('en-IN')}
                                                </strong>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </>
                    )}
                </Modal.Body>
                
                <Modal.Footer style={{ borderTop: '2px solid #f0f0f0', padding: '20px 30px' }}>
                    <Button 
                        variant="outline-secondary" 
                        onClick={() => setShowDetailsModal(false)}
                        style={{ borderRadius: '10px', fontWeight: '500' }}
                    >
                        Close
                    </Button>
                    <Button 
                        style={{ 
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            fontWeight: '600'
                        }}
                        onClick={handlePrint}
                    >
                        🖨️ Print Receipt
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Hidden Receipt Template for Printing */}
            <div style={{ display: 'none' }}>
                <div ref={receiptRef}>
                    {selectedOrder && (
                        <div className="receipt-container">
                            {/* Receipt Header */}
                            <div className="receipt-header">
                                <div className="company-name">🏍️ BIKEZONE</div>
                                <div className="company-tagline">Premium Motorcycle Sales & Service</div>
                                <div className="receipt-title">PAYMENT RECEIPT</div>
                            </div>

                            {/* Receipt Body */}
                            <div className="receipt-body">
                                {/* Order Information */}
                                <div className="order-info">
                                    <div className="info-block">
                                        <div className="info-label">Receipt Number</div>
                                        <div className="info-value">#{selectedOrder._id?.slice(-8).toUpperCase()}</div>
                                    </div>
                                    <div className="info-block" style={{ textAlign: 'center' }}>
                                        <div className="info-label">Transaction Date</div>
                                        <div className="info-value">
                                            {selectedOrder.paymentTime || selectedOrder.createdAt ? 
                                                new Date(selectedOrder.paymentTime || selectedOrder.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                                : 'N/A'
                                            }
                                        </div>
                                    </div>
                                    <div className="info-block" style={{ textAlign: 'right' }}>
                                        <div className="info-label">Status</div>
                                        <div className={`status-badge status-${(selectedOrder.paymentStatus || selectedOrder.orderStatus)?.toLowerCase()}`}>
                                            {(selectedOrder.paymentStatus || selectedOrder.orderStatus)?.toUpperCase()}
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div className="section-title">👤 Customer Information</div>
                                <div className="customer-grid">
                                    <div className="customer-item">
                                        <div className="info-label">Full Name</div>
                                        <div className="info-value">{selectedOrder.customerName}</div>
                                    </div>
                                    <div className="customer-item">
                                        <div className="info-label">Email Address</div>
                                        <div className="info-value">{selectedOrder.customerEmail}</div>
                                    </div>
                                    <div className="customer-item">
                                        <div className="info-label">Phone Number</div>
                                        <div className="info-value">{selectedOrder.customerPhone || 'N/A'}</div>
                                    </div>
                                    <div className="customer-item">
                                        <div className="info-label">Delivery Location</div>
                                        <div className="info-value">{selectedOrder.deliveryLocation}</div>
                                    </div>
                                </div>

                                {/* Product Information */}
                                <div className="section-title">🏍️ Product Details</div>
                                <div className="product-box">
                                    <table style={{ width: '100%' }}>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="product-name">{selectedOrder.bikeModel}</div>
                                                    <div style={{ color: '#666', fontSize: '14px' }}>
                                                        Category: Motorcycle • Quantity: 1
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                                                    <div className="product-price">
                                                        ৳{parsePrice(selectedOrder.price).toLocaleString('en-IN')}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Payment & Order Status */}
                                <div className="section-title">💳 Payment & Order Information</div>
                                <div className="payment-status-box">
                                    <div className="status-card" style={{ background: '#fff5f8', borderColor: '#E2136E' }}>
                                        <div className="status-icon">{getPaymentMethodIcon(selectedOrder.paymentMethod)}</div>
                                        <div className="info-label">Payment Method</div>
                                        <div className="info-value">{getPaymentMethodName(selectedOrder.paymentMethod)}</div>
                                    </div>
                                    <div className="status-card" style={{ background: '#f0fff4', borderColor: '#28a745' }}>
                                        <div className="status-icon">📦</div>
                                        <div className="info-label">Order Status</div>
                                        <div className="info-value">{selectedOrder.orderStatus}</div>
                                    </div>
                                </div>

                                {/* Payment Summary */}
                                <div className="summary-box">
                                    <h6 style={{ fontWeight: '700', marginBottom: '20px', fontSize: '16px' }}>
                                        Payment Summary
                                    </h6>
                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <strong>৳{parsePrice(selectedOrder.price).toLocaleString('en-IN')}</strong>
                                    </div>
                                    <div className="summary-row">
                                        <span>Delivery Fee</span>
                                        <strong style={{ color: '#ffd700' }}>FREE</strong>
                                    </div>
                                    <div className="summary-row">
                                        <span>Tax & Other Charges</span>
                                        <strong>৳0</strong>
                                    </div>
                                    <div className="summary-total">
                                        <span className="total-label">Total Amount Paid</span>
                                        <span className="total-amount">৳{parsePrice(selectedOrder.price).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Receipt Footer */}
                            <div className="receipt-footer">
                                <div className="footer-text" style={{ fontWeight: '600', marginBottom: '10px' }}>
                                    Thank you for your purchase!
                                </div>
                                <div className="footer-text">
                                    📧 support@bikezone.com • 📞 +880-XXX-XXXXXX
                                </div>
                                <div className="footer-text">
                                    🌐 www.bikezone.com • 📍 Dhaka, Bangladesh
                                </div>
                                <div className="footer-text" style={{ marginTop: '15px', fontSize: '11px' }}>
                                    This is a computer-generated receipt and does not require a signature.
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default Pay;