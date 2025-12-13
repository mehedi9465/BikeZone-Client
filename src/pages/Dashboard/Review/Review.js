import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { Form, Button, Container, Row, Col, Image, Card, Alert, Spinner } from 'react-bootstrap';
import Rating from 'react-rating';
import swal from 'sweetalert';
import useAuth from '../../../hooks/useAuth';

const Review = () => {
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [rate, setRate] = useState(0);
    const [reviewData, setReviewData] = useState({});
    const [dependency, setDependency] = useState({});
    const [loading, setLoading] = useState(false);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const { user } = useAuth();

    // Get unique bike models from orders
    const uniqueBikeModels = useMemo(() => {
        const bikeModels = orders.map(order => order.bikeModel).filter(Boolean);
        return [...new Set(bikeModels)];
    }, [orders]);

    useEffect(() => {
        if (user?.email) {
            setOrdersLoading(true);
            axios.get(`https://bikezone-server.onrender.com/orders/${user.email}`)
                .then(({ data }) => {
                    setOrders(data);
                })
                .catch(error => {
                    console.error('Error fetching orders:', error);
                    swal({
                        title: "Error",
                        text: "Failed to load your orders",
                        icon: "error",
                        button: "OK",
                    });
                })
                .finally(() => {
                    setOrdersLoading(false);
                });
        }
    }, [user?.email]);

    useEffect(() => {
        if (user?.email) {
            axios.get(`https://bikezone-server.onrender.com/reviews?email=${user.email}`)
                .then(({ data }) => {
                    setReviews(data);
                })
                .catch(error => {
                    console.error('Error fetching reviews:', error);
                });
        }
    }, [user?.email, dependency]);

    const handleOnBlur = e => {
        const { name, value } = e.target;
        setReviewData(prev => ({ ...prev, [name]: value }));
    };

    const handleOnChange = e => {
        const { name, value } = e.target;
        setReviewData(prev => ({ ...prev, [name]: value }));
    };

    const handleOnSubmit = e => {
        e.preventDefault();
        
        if (!reviewData.reviewText || !reviewData.bikeModel || rate === 0) {
            swal({
                title: "Missing Information",
                text: "Please fill all fields and provide a rating",
                icon: "warning",
                button: "OK",
            });
            return;
        }

        setLoading(true);
        const payload = {
            ...reviewData,
            rating: rate,
            displayName: user?.displayName,
            email: user?.email,
            img: user?.photoURL,
        };

        axios.post('https://bikezone-server.onrender.com/reviews', payload)
            .then(({ data }) => {
                setDependency(data);
                setReviewData({});
                setRate(0);
                e.target.reset();
                swal({
                    title: data.insertedId || data.acknowledged ? "Posted Successfully!" : "Something Went Wrong!",
                    icon: data.insertedId || data.acknowledged ? "success" : "error",
                    button: "OK",
                });
            })
            .catch(error => {
                console.error('Error submitting review:', error);
                swal({
                    title: "Error",
                    text: "Failed to submit review. Please try again.",
                    icon: "error",
                    button: "OK",
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col lg={10}>
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-2">Share Your Experience</h2>
                        <p className="text-muted">Help others make informed decisions with your feedback</p>
                    </div>

                    {/* Form Card */}
                    <Card className="border-0 shadow-lg mb-5" style={{ borderRadius: '15px' }}>
                        <Card.Body className="p-4 p-md-5">
                            <h4 className="mb-4 fw-semibold">Write a Review</h4>

                            <Form onSubmit={handleOnSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Select Bike Model *</Form.Label>
                                    <Form.Select 
                                        name="bikeModel" 
                                        onChange={handleOnChange}
                                        onBlur={handleOnBlur}
                                        required
                                        disabled={ordersLoading}
                                        style={{ height: '50px', borderRadius: '10px' }}
                                    >
                                        <option value="">
                                            {ordersLoading ? 'Loading your orders...' : 'Choose a bike model...'}
                                        </option>
                                        {uniqueBikeModels.map(bikeModel => (
                                            <option key={bikeModel} value={bikeModel}>
                                                {bikeModel}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {!ordersLoading && uniqueBikeModels.length === 0 && (
                                        <Alert variant="info" className="mt-3 mb-0">
                                            <small>You need to purchase a bike before leaving a review.</small>
                                        </Alert>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Your Rating *</Form.Label>
                                    <div className="d-flex align-items-center gap-3 p-3 bg-light" style={{ borderRadius: '10px' }}>
                                        <Rating
                                            emptySymbol={<img src="https://cdn-icons-png.flaticon.com/32/616/616821.png" alt="empty star" />}
                                            fullSymbol={<img src="https://cdn-icons-png.flaticon.com/32/616/616489.png" alt="full star" />}
                                            onChange={setRate}
                                            initialRating={rate}
                                            fractions={2}
                                        />
                                        <span className="fw-bold text-primary">
                                            {rate > 0 ? `${rate} Star${rate !== 1 ? 's' : ''}` : 'Select rating'}
                                        </span>
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Your Review *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        name="reviewText"
                                        onChange={handleOnChange}
                                        onBlur={handleOnBlur}
                                        placeholder="Share your experience with this bike..."
                                        required
                                        style={{ borderRadius: '10px' }}
                                    />
                                </Form.Group>

                                <div className="text-center">
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        disabled={loading || uniqueBikeModels.length === 0}
                                        className="px-5 py-2"
                                        style={{ borderRadius: '25px', fontWeight: '600' }}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    className="me-2"
                                                />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Review'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Reviews List */}
                    <div className="mb-4">
                        <h4 className="fw-bold mb-4">Your Reviews ({reviews.length})</h4>

                        {reviews.length === 0 ? (
                            <Card className="border-0 shadow-sm text-center py-5" style={{ borderRadius: '15px' }}>
                                <Card.Body>
                                    <p className="text-muted mb-0">You haven't written any reviews yet.</p>
                                </Card.Body>
                            </Card>
                        ) : (
                            reviews.map(review => (
                                <Card key={review._id} className="border-0 shadow-sm mb-3" style={{ borderRadius: '15px' }}>
                                    <Card.Body className="p-4">
                                        <Row>
                                            <Col xs={12} md={2} className="text-center text-md-start mb-3 mb-md-0">
                                                <Image
                                                    src={user?.photoURL || 'https://via.placeholder.com/60'}
                                                    roundedCircle
                                                    height="70"
                                                    width="70"
                                                    className="border border-2"
                                                />
                                                <p className="fw-bold mt-2 mb-0 small">{user?.displayName}</p>
                                            </Col>

                                            <Col xs={12} md={10}>
                                                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-3">
                                                    <h5 className="mb-2 mb-md-0 fw-semibold">{review.bikeModel}</h5>
                                                    <Rating
                                                        readonly
                                                        initialRating={review.rating}
                                                        emptySymbol={<img src="https://cdn-icons-png.flaticon.com/32/616/616821.png" alt="empty star" />}
                                                        fullSymbol={<img src="https://cdn-icons-png.flaticon.com/32/616/616489.png" alt="full star" />}
                                                    />
                                                </div>

                                                <p className="text-muted mb-0" style={{ lineHeight: '1.7' }}>
                                                    {review.reviewText}
                                                </p>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Review;