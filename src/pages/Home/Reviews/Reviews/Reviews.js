import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Reviews.css';
import { Col, Container, Row, Image, Spinner, Alert, Card, Button, Form } from 'react-bootstrap';
import useAuth from '../../../../hooks/useAuth';
import Rating from 'react-rating';
import './Reviews.css';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [displayCount, setDisplayCount] = useState(3);
    const [selectedBike, setSelectedBike] = useState('all');
    const [selectedRating, setSelectedRating] = useState('all');
    const { user } = useAuth();

    // Fetch reviews
    useEffect(() => {
        console.log('Starting to fetch reviews...');
        setLoading(true);
        
        axios.get('https://bikezone-server.onrender.com/reviews')
            .then((response) => {
                if (response.data && Array.isArray(response.data)) {
                    // Remove any potential duplicates based on _id
                    const uniqueReviews = response.data.filter((review, index, self) =>
                        index === self.findIndex((r) => r._id === review._id)
                    );
                    console.log('Total reviews loaded:', uniqueReviews.length);
                    setReviews(uniqueReviews);
                } else {
                    setReviews([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching reviews:', err);
                setError(err.message || 'Failed to load reviews');
                setLoading(false);
            });
    }, []);

    // Fetch products for bike names
    useEffect(() => {
        axios.get('https://bikezone-server.onrender.com/products')
            .then((response) => {
                if (response.data && Array.isArray(response.data)) {
                    setProducts(response.data);
                }
            })
            .catch((err) => {
                console.error('Error fetching products:', err);
            });
    }, []);

    const handleShowMore = () => {
        setDisplayCount(prevCount => prevCount + 3);
    };

    const handleShowLess = () => {
        setDisplayCount(3);
        document.getElementById('review')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Filter reviews based on selected bike and rating
    const filteredReviews = reviews.filter(review => {
        const bikeMatch = selectedBike === 'all' || review.bikeModel === selectedBike;
        const ratingMatch = selectedRating === 'all' || review.rating === parseInt(selectedRating);
        return bikeMatch && ratingMatch;
    });

    // Get unique bike models from reviews
    const uniqueBikeModels = [...new Set(reviews.map(review => review.bikeModel))];

    // Use ALL reviews for left-side statistics
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    // Rating distribution based on ALL reviews
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(r => r.rating === star).length;
        return {
            star,
            count,
            percentage: reviews.length > 0
                ? ((count / reviews.length) * 100).toFixed(0)
                : 0
        };
    });

    if (loading) {
        return (
            <div id='review' className="reviews-section">
                <Container>
                    <div className='reviews-loading'>
                        <Spinner animation="border" role="status" variant="primary" className="reviews-loading-spinner">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className='reviews-loading-text'>Loading customer reviews...</p>
                    </div>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div id='review' className="reviews-section">
                <Container>
                    <Alert variant="danger" className='reviews-alert text-center'>
                        <Alert.Heading>😕 Oops! Something went wrong</Alert.Heading>
                        <p>{error}</p>
                        <p className='mb-0'>
                            <small>Please try refreshing the page.</small>
                        </p>
                    </Alert>
                </Container>
            </div>
        );
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div id='review' className="reviews-section">
                <Container>
                    <Alert variant="info" className='reviews-alert text-center empty-state'>
                        <div className="empty-state-icon">💬</div>
                        <p className='empty-state-text'>No reviews available yet. Be the first to share your experience!</p>
                    </Alert>
                </Container>
            </div>
        );
    }

    const displayedReviews = filteredReviews.slice(0, displayCount);
    const hasMore = displayCount < filteredReviews.length;

    return (
        <div id='review' className="reviews-section">
            <Container>
                {/* Header Section */}
                <div className="reviews-header">
                    <div className="reviews-badge">
                        <span className="reviews-badge-text">
                            ⭐ REVIEWS
                        </span>
                    </div>
                    <h1 className="reviews-title">
                        Happy Customers
                    </h1>
                    <p className="reviews-subtitle">
                        Don't just take our word for it - hear what our customers have to say!
                    </p>
                </div>

                {/* Stats and Filters Section */}
                <Row className='mb-5'>
                    {/* Left: Stats */}
                    <Col lg={6} className='mb-4 mb-lg-0'>
                        <Card className="reviews-card">
                            <Card.Body className="reviews-card-body">
                                <h4 className="reviews-card-title">
                                    📊 Overall Rating
                                </h4>
                                
                                <div className="overall-rating-container">
                                    <div className="overall-rating-number">
                                        {averageRating}
                                    </div>
                                    
                                    <div className="overall-rating-text">
                                        Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                                    </div>
                                </div>

                                {/* Rating Distribution */}
                                <div>
                                    {ratingDistribution.map(({ star, count, percentage }) => (
                                        <div 
                                            key={star} 
                                            className={`rating-bar-container ${selectedRating === star.toString() ? 'active' : ''}`}
                                            onClick={() => setSelectedRating(selectedRating === star.toString() ? 'all' : star.toString())}
                                        >
                                            <span className="rating-bar-label">
                                                {star}★
                                            </span>
                                            <div className="rating-bar-progress">
                                                <div className="rating-bar-fill" style={{ width: `${percentage}%` }} />
                                            </div>
                                            <span className="rating-bar-count">
                                                {count}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Show filter info if active */}
                                {(selectedBike !== 'all' || selectedRating !== 'all') && (
                                    <div className="filter-info-box">
                                        <strong>Filtered:</strong> Showing {filteredReviews.length} of {reviews.length} reviews
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Right: Filters */}
                    <Col lg={6}>
                        <Card className="reviews-card">
                            <Card.Body className="reviews-card-body">
                                <h4 className="reviews-card-title">
                                    🔍 Filter Reviews
                                </h4>

                                {/* Bike Selection */}
                                <Form.Group className='mb-4'>
                                    <Form.Label className="filter-label">
                                        Choose Bike Model
                                    </Form.Label>
                                    <Form.Select 
                                        value={selectedBike}
                                        onChange={(e) => {
                                            setSelectedBike(e.target.value);
                                            setDisplayCount(3);
                                        }}
                                        className="filter-select"
                                    >
                                        <option value="all">All Bikes</option>
                                        {uniqueBikeModels.map((bike, index) => (
                                            <option key={index} value={bike}>{bike}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                {/* Rating Filter */}
                                <Form.Group>
                                    <Form.Label className="filter-label">
                                        Filter by Rating
                                    </Form.Label>
                                    <div className="rating-filter-buttons">
                                        <button
                                            className={`rating-filter-btn ${selectedRating === 'all' ? 'active' : ''}`}
                                            onClick={() => {
                                                setSelectedRating('all');
                                                setDisplayCount(3);
                                            }}
                                        >
                                            All Stars
                                        </button>
                                        {[5, 4, 3, 2, 1].map(star => (
                                            <button
                                                key={star}
                                                className={`rating-filter-btn ${selectedRating === star.toString() ? 'active' : ''}`}
                                                onClick={() => {
                                                    setSelectedRating(selectedRating === star.toString() ? 'all' : star.toString());
                                                    setDisplayCount(3);
                                                }}
                                            >
                                                {star} ★
                                            </button>
                                        ))}
                                    </div>
                                </Form.Group>

                                {/* Active Filters Info */}
                                {(selectedBike !== 'all' || selectedRating !== 'all') && (
                                    <div className="active-filters-box">
                                        <span className="active-filters-text">
                                            {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} found
                                        </span>
                                        <button
                                            className="clear-filters-btn"
                                            onClick={() => {
                                                setSelectedBike('all');
                                                setSelectedRating('all');
                                                setDisplayCount(3);
                                            }}
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Reviews Grid */}
                {filteredReviews.length === 0 ? (
                    <Alert variant="info" className='reviews-alert text-center empty-state'>
                        <div className="empty-state-icon">🔍</div>
                        <h4>No reviews found</h4>
                        <p className='mb-0'>Try adjusting your filters to see more reviews.</p>
                    </Alert>
                ) : (
                    <>
                        <Row>
                            {displayedReviews.map((review) => (
                                <Col key={review?._id} lg={4} md={6} className='mb-4'>
                                    <Card className="review-card">
                                        <div className="review-card-stripe" />
                                        
                                        <Card.Body className="review-card-body">
                                            <div className="review-author">
                                                <div className="review-avatar">
                                                    <Image 
                                                        src={review?.img || 'https://cdn-icons-png.flaticon.com/512/236/236831.png'} 
                                                        alt={review?.displayName}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://cdn-icons-png.flaticon.com/512/236/236831.png';
                                                        }}
                                                    />
                                                </div>
                                                <div className="review-author-info">
                                                    <h5 className="review-author-name">
                                                        {review?.displayName}
                                                    </h5>
                                                    <p className="review-bike-model">
                                                        {review?.bikeModel}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="review-rating">
                                                <Rating 
                                                    readonly
                                                    initialRating={review?.rating || 5}
                                                    emptySymbol={
                                                        <img 
                                                            src="https://cdn-icons-png.flaticon.com/32/616/616821.png" 
                                                            alt="Empty star"
                                                            style={{ margin: '0 2px' }}
                                                        />
                                                    }
                                                    fullSymbol={
                                                        <img 
                                                            src="https://cdn-icons-png.flaticon.com/32/616/616489.png" 
                                                            alt="Filled star"
                                                            style={{ margin: '0 2px' }}
                                                        />
                                                    }
                                                />
                                            </div>

                                            <p className="review-text">
                                                "{review?.reviewText}"
                                            </p>

                                            <div className="review-icon">
                                                💬
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Show More / Show Less Buttons */}
                        {filteredReviews.length > 3 && (
                            <div className="show-more-section">
                                {hasMore ? (
                                    <button
                                        onClick={handleShowMore}
                                        className="show-more-btn"
                                    >
                                        Show More Reviews ({filteredReviews.length - displayCount} remaining)
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleShowLess}
                                        className="show-less-btn"
                                    >
                                        Show Less
                                    </button>
                                )}
                                <p className="reviews-count-text">
                                    Showing {displayedReviews.length} of {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Bottom CTA */}
                <div className="reviews-cta">
                    <h3 className="reviews-cta-title">
                        Love Your Bike? Share Your Story!
                    </h3>
                    <p className="reviews-cta-text">
                        Your feedback helps us serve you better and guides other riders in making the right choice.
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default Reviews;