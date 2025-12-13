import axios from 'axios';
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Card } from 'react-bootstrap';
import swal from 'sweetalert';
import useAuth from '../../hooks/useAuth';

const PlaceOrderModal = (props) => {
    const [orderData, setOrderData] = useState({});
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [mapUrl, setMapUrl] = useState('');
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const { user } = useAuth();

    const handleOnBlur = e => {
        const field = e.target.name;
        const value = e.target.value;
        const newInfo = { ...orderData };
        newInfo[field] = value;
        setOrderData(newInfo);
    };

    const setDefaultValues = () => {
        // Format price with commas
        const formattedPrice = props?.bikeprice?.toLocaleString('en-IN');
        
        // Determine payment status based on payment method
        const paymentStatus = paymentMethod === 'cod' ? 'pending' : 'paid';
        
        return {
            "customerName": user?.displayName || '',
            "customerEmail": user?.email || '',
            "bikeModel": props.bikemodel,
            "price": formattedPrice,
            "orderStatus": "Pending",
            "deliveryLocation": selectedAddress || orderData.deliveryLocation || '',
            "coordinates": coordinates,
            "paymentMethod": paymentMethod,
            "paymentStatus": paymentStatus,
            "paymentTime": new Date().toISOString()
        };
    };

    const handlePaymentConfirmation = async () => {
        setShowPaymentPopup(false);
        setIsProcessing(true);

        const defaultValues = setDefaultValues();
        const order = {
            ...orderData,
            ...defaultValues
        };
        
        try {
            // Create order first
            const { data } = await axios.post('https://bikezone-server.onrender.com/orders', order);
            
            if (data.insertedId) {
                // Determine payment status based on payment method
                const paymentStatus = paymentMethod === 'cod' ? 'pending' : 'paid';
                
                // Create payment record
                const paymentData = {
                    orderId: data.insertedId,
                    transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    customerName: user?.displayName,
                    customerEmail: user?.email,
                    customerPhone: orderData.customerPhone,
                    bikeModel: props.bikemodel,
                    amount: parseInt(props.bikeprice),
                    price: props.bikeprice,
                    paymentMethod: paymentMethod,
                    paymentStatus: paymentStatus,
                    orderStatus: order.orderStatus,
                    date: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    deliveryLocation: selectedAddress || orderData.deliveryLocation
                };

                // Save payment to database
                try {
                    await axios.post('https://bikezone-server.onrender.com/payments', paymentData);
                } catch (paymentError) {
                    console.error('Payment record creation failed:', paymentError);
                    // Continue even if payment record fails
                }

                // Process payment
                await processPayment(data.insertedId);
            } else {
                swal({
                    title: "Something Went Wrong!",
                    icon: "error",
                    button: "OK"
                });
            }
        } catch (error) {
            console.error('Order submission error:', error);
            swal({
                title: "Error!",
                text: "Failed to place order. Please try again.",
                icon: "error",
                button: "OK"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const processPayment = async (orderId) => {
        if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
            swal({
                title: "Payment Successful!",
                text: `Payment processed via ${paymentMethod.toUpperCase()}`,
                icon: "success",
                buttons: false,
                timer: 2000
            });
            
            // TODO: Integrate with actual payment gateway
            // const response = await axios.post('/api/payment/bkash/create', {
            //     orderId, amount: props.bikeprice
            // });
            // window.location.href = response.data.bkashURL;
            
            setTimeout(() => {
                swal({
                    title: "Order Placed Successfully!",
                    text: "Payment completed. You will receive a confirmation email shortly.",
                    icon: "success",
                    button: "OK"
                });
                props.onHide();
                resetForm();
            }, 2000);
            
        } else if (paymentMethod === 'card') {
            swal({
                title: "Payment Successful!",
                text: "Card payment processed successfully",
                icon: "success",
                buttons: false,
                timer: 2000
            });
            
            setTimeout(() => {
                swal({
                    title: "Order Placed Successfully!",
                    text: "Payment completed. Order confirmed!",
                    icon: "success",
                    button: "OK"
                });
                props.onHide();
                resetForm();
            }, 2000);
            
        } else if (paymentMethod === 'cod') {
            swal({
                title: "Order Placed!",
                text: "Pay cash when your bike is delivered. Payment status: Pending",
                icon: "success",
                button: "OK"
            });
            props.onHide();
            resetForm();
        }
    };

    const resetForm = () => {
        setCurrentStep(1);
        setSelectedAddress('');
        setCoordinates(null);
        setPaymentMethod('');
        setOrderData({});
        setMapUrl('');
        setShowPaymentPopup(false);
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        
        if (currentStep === 1) {
            if (!orderData.customerPhone) {
                swal({
                    title: "Phone Required",
                    text: "Please enter your phone number",
                    icon: "warning",
                    button: "OK"
                });
                return;
            }
            setCurrentStep(2);
            return;
        }
        
        if (currentStep === 2) {
            if (!selectedAddress && !orderData.deliveryLocation) {
                swal({
                    title: "Location Required",
                    text: "Please enter your delivery address",
                    icon: "warning",
                    button: "OK"
                });
                return;
            }
            setCurrentStep(3);
            return;
        }
        
        if (currentStep === 3) {
            if (!paymentMethod) {
                swal({
                    title: "Payment Method Required",
                    text: "Please select a payment method",
                    icon: "warning",
                    button: "OK"
                });
                return;
            }
            
            // Show payment popup instead of directly processing
            setShowPaymentPopup(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            swal({
                title: "Getting Location...",
                text: "Please wait",
                icon: "info",
                buttons: false,
                timer: 1500
            });
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    setCoordinates({ lat, lng });
                    
                    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
                    setMapUrl(url);
                    
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.display_name) {
                                setSelectedAddress(data.display_name);
                                swal({
                                    title: "Location Found!",
                                    text: "Your current location has been set",
                                    icon: "success",
                                    timer: 1500,
                                    buttons: false
                                });
                            }
                        })
                        .catch(err => {
                            console.error('Geocoding error:', err);
                            swal({
                                title: "Location Set",
                                text: "Please enter your address manually",
                                icon: "info",
                                button: "OK"
                            });
                        });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    swal({
                        title: "Location Error",
                        text: "Could not get your location. Please enter address manually.",
                        icon: "warning",
                        button: "OK"
                    });
                }
            );
        } else {
            swal({
                title: "Not Supported",
                text: "Geolocation is not supported by your browser. Please enter address manually.",
                icon: "warning",
                button: "OK"
            });
        }
    };

    const searchAddress = () => {
        const address = selectedAddress || orderData.deliveryLocation;
        if (address && address.length > 3) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lng = parseFloat(data[0].lon);
                        
                        setCoordinates({ lat, lng });
                        
                        const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
                        setMapUrl(url);
                        
                        swal({
                            title: "Location Found!",
                            text: "Address has been located on map",
                            icon: "success",
                            timer: 1500,
                            buttons: false
                        });
                    } else {
                        swal({
                            title: "Address Not Found",
                            text: "Please try a more specific address",
                            icon: "warning",
                            button: "OK"
                        });
                    }
                })
                .catch(err => {
                    console.error('Search error:', err);
                    swal({
                        title: "Search Failed",
                        text: "Could not search for address",
                        icon: "error",
                        button: "OK"
                    });
                });
        }
    };

    const renderPaymentInstructions = () => {
        switch (paymentMethod) {
            case 'bkash':
                return (
                    <div className="text-center">
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>📱</div>
                        <h4 style={{ color: '#E2136E', fontWeight: '700', marginBottom: '20px' }}>
                            bKash Payment
                        </h4>
                        <Card className="mb-3" style={{ background: '#fff5f8', border: '2px dashed #E2136E' }}>
                            <Card.Body>
                                <h6 style={{ fontWeight: '600', marginBottom: '15px' }}>Payment Instructions:</h6>
                                <ol style={{ textAlign: 'left', paddingLeft: '20px' }}>
                                    <li className="mb-2">Go to your bKash Mobile Menu</li>
                                    <li className="mb-2">Choose "Send Money"</li>
                                    <li className="mb-2">Enter Merchant Number: <strong>01XXXXXXXXX</strong></li>
                                    <li className="mb-2">Enter Amount: <strong>৳{props.bikeprice?.toLocaleString()}</strong></li>
                                    <li className="mb-2">Enter Reference: <strong>Your Phone Number</strong></li>
                                    <li>Complete the payment</li>
                                </ol>
                            </Card.Body>
                        </Card>
                        <Alert variant="success">
                            <small><strong>Status:</strong> Payment will be marked as "Paid" after confirmation</small>
                        </Alert>
                    </div>
                );
            
            case 'nagad':
                return (
                    <div className="text-center">
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>💰</div>
                        <h4 style={{ color: '#F26522', fontWeight: '700', marginBottom: '20px' }}>
                            Nagad Payment
                        </h4>
                        <Card className="mb-3" style={{ background: '#fff8f5', border: '2px dashed #F26522' }}>
                            <Card.Body>
                                <h6 style={{ fontWeight: '600', marginBottom: '15px' }}>Payment Instructions:</h6>
                                <ol style={{ textAlign: 'left', paddingLeft: '20px' }}>
                                    <li className="mb-2">Open Nagad App</li>
                                    <li className="mb-2">Select "Send Money"</li>
                                    <li className="mb-2">Enter Merchant Number: <strong>01XXXXXXXXX</strong></li>
                                    <li className="mb-2">Enter Amount: <strong>৳{props.bikeprice?.toLocaleString()}</strong></li>
                                    <li className="mb-2">Add Reference: <strong>Your Phone Number</strong></li>
                                    <li>Confirm payment</li>
                                </ol>
                            </Card.Body>
                        </Card>
                        <Alert variant="success">
                            <small><strong>Status:</strong> Payment will be marked as "Paid" after confirmation</small>
                        </Alert>
                    </div>
                );
            
            case 'card':
                return (
                    <div className="text-center">
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>💳</div>
                        <h4 style={{ color: '#667eea', fontWeight: '700', marginBottom: '20px' }}>
                            Card Payment
                        </h4>
                        <Card className="mb-3" style={{ background: '#f5f7ff', border: '2px dashed #667eea' }}>
                            <Card.Body>
                                <h6 style={{ fontWeight: '600', marginBottom: '15px' }}>Accepted Cards:</h6>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px' }}>
                                    <span style={{ fontSize: '30px' }}>💳</span>
                                    <span style={{ fontSize: '30px' }}>🏦</span>
                                    <span style={{ fontSize: '30px' }}>💰</span>
                                </div>
                                <p style={{ marginBottom: '10px' }}>
                                    <strong>• Visa • Mastercard • American Express</strong>
                                </p>
                                <p style={{ marginBottom: '0', color: '#6c757d' }}>
                                    Your payment information is encrypted and secure
                                </p>
                            </Card.Body>
                        </Card>
                        <Alert variant="success">
                            <small><strong>Status:</strong> Payment will be marked as "Paid" after processing</small>
                        </Alert>
                    </div>
                );
            
            case 'cod':
                return (
                    <div className="text-center">
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>💵</div>
                        <h4 style={{ color: '#28a745', fontWeight: '700', marginBottom: '20px' }}>
                            Cash on Delivery
                        </h4>
                        <Card className="mb-3" style={{ background: '#f5fff8', border: '2px dashed #28a745' }}>
                            <Card.Body>
                                <h6 style={{ fontWeight: '600', marginBottom: '15px' }}>Payment Instructions:</h6>
                                <div style={{ textAlign: 'left', paddingLeft: '20px' }}>
                                    <p className="mb-2">✓ Pay in cash when you receive your bike</p>
                                    <p className="mb-2">✓ Our delivery person will collect the payment</p>
                                    <p className="mb-2">✓ Please keep exact amount ready</p>
                                    <p className="mb-2">✓ You can inspect the bike before payment</p>
                                    <p className="mb-0">✓ Receipt will be provided after payment</p>
                                </div>
                            </Card.Body>
                        </Card>
                        <Alert variant="warning">
                            <small><strong>Status:</strong> Payment will remain "Pending" until delivery</small>
                        </Alert>
                        <Alert variant="success">
                            <small><strong>Amount to Pay:</strong> ৳{props.bikeprice?.toLocaleString()}</small>
                        </Alert>
                    </div>
                );
            
            default:
                return null;
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <h5 className="mb-4" style={{ color: '#667eea', fontWeight: '600' }}>
                            📋 Order Details
                        </h5>
                        
                        <Form.Floating className="mb-3">
                            <Form.Control
                                id="customerName"
                                placeholder='Name'
                                required
                                disabled
                                type="text"
                                defaultValue={user?.displayName}
                                name='customerName'
                                onBlur={handleOnBlur}
                            />
                            <label htmlFor="customerName">Name</label>
                        </Form.Floating>

                        <Form.Floating className="mb-3">
                            <Form.Control
                                id="customerEmail"
                                placeholder='Email'
                                required
                                disabled
                                type="email"
                                defaultValue={user?.email}
                                name='customerEmail'
                                onBlur={handleOnBlur}
                            />
                            <label htmlFor="customerEmail">Email</label>
                        </Form.Floating>

                        <Form.Floating className="mb-3">
                            <Form.Control
                                id="customerPhone"
                                placeholder='Phone'
                                required
                                type="tel"
                                name='customerPhone'
                                onBlur={handleOnBlur}
                            />
                            <label htmlFor="customerPhone">Phone Number</label>
                        </Form.Floating>

                        <Form.Floating className="mb-3">
                            <Form.Control
                                id="bikeModel"
                                placeholder='Bike Model'
                                required
                                type="text"
                                defaultValue={props.bikemodel}
                                disabled
                                name='bikeModel'
                                onBlur={handleOnBlur}
                            />
                            <label htmlFor="bikeModel">Bike Model</label>
                        </Form.Floating>

                        <Form.Floating className="mb-3">
                            <Form.Control
                                id="price"
                                placeholder='Price'
                                required
                                disabled
                                defaultValue={`৳${props.bikeprice?.toLocaleString()}`}
                                name='price'
                                onBlur={handleOnBlur}
                            />
                            <label htmlFor="price">Price</label>
                        </Form.Floating>
                    </>
                );
            
            case 2:
                return (
                    <>
                        <h5 className="mb-4" style={{ color: '#667eea', fontWeight: '600' }}>
                            📍 Delivery Location
                        </h5>
                        
                        <Alert variant="info" className="mb-3">
                            <small>
                                <strong>📍 Use GPS</strong> to get your current location or enter your address manually
                            </small>
                        </Alert>

                        <Button 
                            variant="outline-primary" 
                            className="mb-3 w-100"
                            onClick={getCurrentLocation}
                            style={{ 
                                borderRadius: '10px',
                                fontWeight: '600',
                                padding: '12px'
                            }}
                        >
                            📍 Use My Current Location
                        </Button>

                        <Form.Floating className="mb-3">
                            <Form.Control
                                id="deliveryLocation"
                                placeholder='Enter your delivery address'
                                type="text"
                                name='deliveryLocation'
                                value={selectedAddress || orderData.deliveryLocation || ''}
                                onChange={(e) => {
                                    setSelectedAddress(e.target.value);
                                    handleOnBlur(e);
                                }}
                                required
                            />
                            <label htmlFor="deliveryLocation">Delivery Address</label>
                        </Form.Floating>

                        <Button 
                            variant="outline-secondary" 
                            className="mb-3 w-100"
                            onClick={searchAddress}
                            style={{ 
                                borderRadius: '10px',
                                fontWeight: '500',
                                padding: '10px'
                            }}
                        >
                            🔍 Find Address on Map
                        </Button>

                        {mapUrl && (
                            <div style={{ 
                                height: '300px', 
                                borderRadius: '12px', 
                                overflow: 'hidden',
                                marginBottom: '15px',
                                border: '2px solid #e9ecef',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                            }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight="0"
                                    marginWidth="0"
                                    src={mapUrl}
                                    title="Location Map"
                                />
                            </div>
                        )}

                        {selectedAddress && (
                            <Alert variant="success" className="mb-3">
                                <strong>📍 Delivery Address:</strong><br />
                                <small>{selectedAddress}</small>
                            </Alert>
                        )}

                        <Form.Floating>
                            <Form.Control
                                as="textarea"
                                id="deliveryNotes"
                                placeholder='Delivery instructions'
                                style={{ height: '80px' }}
                                name='deliveryNotes'
                                onBlur={handleOnBlur}
                            />
                            <label htmlFor="deliveryNotes">Delivery Instructions (Optional)</label>
                        </Form.Floating>
                    </>
                );
            
            case 3:
                return (
                    <>
                        <h5 className="mb-4" style={{ color: '#667eea', fontWeight: '600' }}>
                            💳 Payment Method
                        </h5>

                        <Row className="g-3 mb-4">
                            <Col xs={6}>
                                <Card 
                                    className={`text-center p-3 ${paymentMethod === 'bkash' ? 'border-primary' : ''}`}
                                    style={{ 
                                        cursor: 'pointer', 
                                        borderWidth: '2px',
                                        borderRadius: '15px',
                                        transition: 'all 0.3s',
                                        boxShadow: paymentMethod === 'bkash' ? '0 4px 15px rgba(102,126,234,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                    onClick={() => setPaymentMethod('bkash')}
                                >
                                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>📱</div>
                                    <div style={{ fontWeight: '600', color: '#E2136E' }}>bKash</div>
                                    <small style={{ color: '#6c757d' }}>Mobile Banking</small>
                                </Card>
                            </Col>

                            <Col xs={6}>
                                <Card 
                                    className={`text-center p-3 ${paymentMethod === 'nagad' ? 'border-primary' : ''}`}
                                    style={{ 
                                        cursor: 'pointer', 
                                        borderWidth: '2px',
                                        borderRadius: '15px',
                                        transition: 'all 0.3s',
                                        boxShadow: paymentMethod === 'nagad' ? '0 4px 15px rgba(102,126,234,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                    onClick={() => setPaymentMethod('nagad')}
                                >
                                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>💰</div>
                                    <div style={{ fontWeight: '600', color: '#F26522' }}>Nagad</div>
                                    <small style={{ color: '#6c757d' }}>Mobile Banking</small>
                                </Card>
                            </Col>

                            <Col xs={6}>
                                <Card 
                                    className={`text-center p-3 ${paymentMethod === 'card' ? 'border-primary' : ''}`}
                                    style={{ 
                                        cursor: 'pointer', 
                                        borderWidth: '2px',
                                        borderRadius: '15px',
                                        transition: 'all 0.3s',
                                        boxShadow: paymentMethod === 'card' ? '0 4px 15px rgba(102,126,234,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>💳</div>
                                    <div style={{ fontWeight: '600', color: '#667eea' }}>Card</div>
                                    <small style={{ color: '#6c757d' }}>Credit/Debit</small>
                                </Card>
                            </Col>

                            <Col xs={6}>
                                <Card 
                                    className={`text-center p-3 ${paymentMethod === 'cod' ? 'border-primary' : ''}`}
                                    style={{ 
                                        cursor: 'pointer', 
                                        borderWidth: '2px',
                                        borderRadius: '15px',
                                        transition: 'all 0.3s',
                                        boxShadow: paymentMethod === 'cod' ? '0 4px 15px rgba(102,126,234,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                    onClick={() => setPaymentMethod('cod')}
                                >
                                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>💵</div>
                                    <div style={{ fontWeight: '600', color: '#28a745' }}>Cash</div>
                                    <small style={{ color: '#6c757d' }}>On Delivery</small>
                                </Card>
                            </Col>
                        </Row>

                        {paymentMethod && (
                            <Alert variant="info" className="mb-3">
                                <strong>✓ Selected:</strong> {
                                    paymentMethod === 'bkash' ? 'bKash Mobile Banking' :
                                    paymentMethod === 'nagad' ? 'Nagad Mobile Banking' :
                                    paymentMethod === 'card' ? 'Credit/Debit Card Payment' :
                                    'Cash on Delivery'
                                }
                                {paymentMethod !== 'cod' && (
                                    <div style={{ marginTop: '8px', color: '#28a745', fontWeight: '600' }}>
                                        ✓ Payment will be marked as "Paid"
                                    </div>
                                )}
                                {paymentMethod === 'cod' && (
                                    <div style={{ marginTop: '8px', color: '#856404', fontWeight: '600' }}>
                                        ⏳ Payment will remain "Pending" until delivery
                                    </div>
                                )}
                            </Alert>
                        )}

                        <Card style={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none', 
                            borderRadius: '15px',
                            color: 'white'
                        }}>
                            <Card.Body className="p-4">
                                <h6 style={{ fontWeight: '600', marginBottom: '20px', fontSize: '18px' }}>
                                    📦 Order Summary
                                </h6>
                                <div className="d-flex justify-content-between mb-2">
                                    <span style={{ opacity: 0.9 }}>Bike Model:</span>
                                    <strong>{props.bikemodel}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span style={{ opacity: 0.9 }}>Price:</span>
                                    <strong>৳{props.bikeprice?.toLocaleString()}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span style={{ opacity: 0.9 }}>Delivery:</span>
                                    <strong className="text-warning">Free</strong>
                                </div>
                                <div style={{ 
                                    borderTop: '2px solid rgba(255,255,255,0.3)', 
                                    paddingTop: '15px',
                                    marginTop: '15px'
                                }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span style={{ fontSize: '20px', fontWeight: '700' }}>Total:</span>
                                        <strong style={{ fontSize: '24px' }}>
                                            ৳{props.bikeprice?.toLocaleString()}
                                        </strong>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </>
                );
            
            default:
                return null;
        }
    };

    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => {
                    props.onHide();
                    resetForm();
                }}
            >
                <Modal.Header closeButton style={{ borderBottom: '2px solid #f0f0f0' }}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>🛒 Place Your Order</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#6c757d', fontWeight: 'normal', marginTop: '5px' }}>
                            Step {currentStep} of 3
                        </div>
                    </Modal.Title>
                </Modal.Header>
                
                <Form onSubmit={handleOnSubmit}>
                    <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ 
                                    color: currentStep >= 1 ? '#667eea' : '#6c757d',
                                    fontWeight: currentStep === 1 ? '600' : '400',
                                    fontSize: '13px'
                                }}>📋 Details</span>
                                <span style={{ 
                                    color: currentStep >= 2 ? '#667eea' : '#6c757d',
                                    fontWeight: currentStep === 2 ? '600' : '400',
                                    fontSize: '13px'
                                }}>📍 Location</span>
                                <span style={{ 
                                    color: currentStep >= 3 ? '#667eea' : '#6c757d',
                                    fontWeight: currentStep === 3 ? '600' : '400',
                                    fontSize: '13px'
                                }}>💳 Payment</span>
                            </div>
                            <div style={{ 
                                height: '6px', 
                                background: '#e9ecef', 
                                borderRadius: '3px',
                                overflow: 'hidden'
                            }}>
                                <div style={{ 
                                    height: '100%', 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    width: `${(currentStep / 3) * 100}%`,
                                    transition: 'width 0.3s ease',
                                    borderRadius: '3px'
                                }} />
                            </div>
                        </div>

                        {renderStepContent()}
                    </Modal.Body>
                    
                    <Modal.Footer style={{ borderTop: '2px solid #f0f0f0' }}>
                        {currentStep > 1 && (
                            <Button 
                                variant='outline-secondary' 
                                onClick={handleBack}
                                style={{ borderRadius: '10px', fontWeight: '500' }}
                            >
                                ← Back
                            </Button>
                        )}
                        <Button 
                            type='submit' 
                            variant='primary'
                            disabled={isProcessing}
                            style={{ 
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                minWidth: '140px',
                                fontWeight: '600'
                            }}
                        >
                            {isProcessing ? '⏳ Processing...' : 
                             currentStep === 3 ? '✓ Confirm Order' : 
                             'Next →'}
                        </Button>
                        <Button 
                            variant='outline-danger' 
                            onClick={() => {
                                props.onHide();
                                resetForm();
                            }}
                            style={{ borderRadius: '10px', fontWeight: '500' }}
                        >
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Payment Popup Modal */}
            <Modal
                show={showPaymentPopup}
                onHide={() => setShowPaymentPopup(false)}
                size="md"
                centered
                backdrop="static"
            >
                <Modal.Header 
                    closeButton 
                    style={{ 
                        borderBottom: '2px solid #f0f0f0',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                    }}
                >
                    <Modal.Title style={{ fontWeight: '700' }}>
                        💳 Payment Confirmation
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body style={{ padding: '30px' }}>
                    {renderPaymentInstructions()}
                </Modal.Body>
                
                <Modal.Footer style={{ borderTop: '2px solid #f0f0f0', padding: '20px' }}>
                    <Button 
                        variant='outline-secondary' 
                        onClick={() => setShowPaymentPopup(false)}
                        style={{ borderRadius: '10px', fontWeight: '500' }}
                    >
                        ← Go Back
                    </Button>
                    <Button 
                        variant='success'
                        onClick={handlePaymentConfirmation}
                        disabled={isProcessing}
                        style={{ 
                            borderRadius: '10px',
                            fontWeight: '600',
                            minWidth: '160px',
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            border: 'none'
                        }}
                    >
                        {isProcessing ? '⏳ Processing...' : '✓ Proceed to Pay'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PlaceOrderModal;