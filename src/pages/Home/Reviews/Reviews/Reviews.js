import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Image, Carousel, Spinner, Alert } from 'react-bootstrap';
import useAuth from '../../../../hooks/useAuth';
import Rating from 'react-rating';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        console.log('Starting to fetch reviews...');
        setLoading(true);
        
        axios.get('https://bikezone-server.onrender.com/reviews')
            .then((response) => {
                console.log('Response received:', response);
                console.log('Response data:', response.data);
                console.log('Data type:', Array.isArray(response.data));
                console.log('Number of reviews:', response.data?.length);
                
                if (response.data && Array.isArray(response.data)) {
                    setReviews(response.data);
                } else {
                    console.error('Data is not an array:', response.data);
                    setReviews([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching reviews:', err);
                console.error('Error response:', err.response);
                console.error('Error message:', err.message);
                setError(err.message || 'Failed to load reviews');
                setLoading(false);
            });
    }, []);

    console.log('Current reviews state:', reviews);
    console.log('Loading state:', loading);
    console.log('Error state:', error);

    if (loading) {
        return (
            <Container id='review' className='my-5 py-5'>
                <h1 className='text-center display-4 mb-4'>Testimonials</h1>
                <div className='text-center py-5'>
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className='mt-3'>Loading testimonials...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container id='review' className='my-5 py-5'>
                <h1 className='text-center display-4 mb-4'>Testimonials</h1>
                <Alert variant="danger" className='text-center'>
                    <Alert.Heading>Error Loading Reviews</Alert.Heading>
                    <p>{error}</p>
                    <p className='mb-0'>
                        <small>Please check the console for more details or try refreshing the page.</small>
                    </p>
                </Alert>
            </Container>
        );
    }

    if (!reviews || reviews.length === 0) {
        return (
            <Container id='review' className='my-5 py-5'>
                <h1 className='text-center display-4 mb-4'>Testimonials</h1>
                <Alert variant="info" className='text-center'>
                    <p className='mb-0'>No reviews available yet. Be the first to leave a review!</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container id='review' className='my-5 py-5'>
            <h1 className='text-center display-4 mb-4'>Testimonials</h1>
            <Row className='bg-light py-5 rounded'>
                <Col>
                    <Carousel className='mt-5' interval={5000}>
                        {reviews.map(review => (
                            <Carousel.Item className='bg-light my-4 rounded-3' key={review?._id}>
                                {review?.img ? (
                                    <div className='text-center d-flex flex-column w-75 mx-auto p-4'>
                                        <span className='fs-5'>
                                            <Image 
                                                className='rounded-circle' 
                                                src={review.img} 
                                                height='40'
                                                width='40'
                                                alt={`${review.displayName}'s avatar`}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/236/236831.png';
                                                }}
                                            />
                                            &nbsp; <b>{review.displayName}</b> reviewed on <b>{review.bikeModel}</b>
                                        </span>
                                        <div>
                                            <Rating 
                                                className='mt-4 mx-auto'
                                                readonly
                                                initialRating={review.rating}
                                                emptySymbol={
                                                    <img 
                                                        src="https://cdn-icons-png.flaticon.com/32/616/616821.png" 
                                                        alt="Empty star"
                                                    />
                                                }
                                                fullSymbol={
                                                    <img 
                                                        src="https://cdn-icons-png.flaticon.com/32/616/616489.png" 
                                                        alt="Filled star"
                                                    />
                                                }
                                            />
                                        </div>
                                        <p className='lead mt-3'>{review.reviewText}</p>
                                    </div>
                                ) : (
                                    <div className='d-flex flex-column justify-content-start p-4'>
                                        <span className='fs-5'>
                                            <Image 
                                                className='rounded-circle' 
                                                src='https://cdn-icons-png.flaticon.com/512/236/236831.png' 
                                                height='40'
                                                width='40'
                                                alt="Default user avatar"
                                            />
                                            &nbsp; <b>{review.displayName}</b> reviewed on <b>{review.bikeModel}</b>
                                        </span>
                                        <div>
                                            <Rating 
                                                className='mt-4 mx-auto'
                                                readonly
                                                initialRating={review.rating}
                                                emptySymbol={
                                                    <img 
                                                        src="https://cdn-icons-png.flaticon.com/32/616/616821.png" 
                                                        alt="Empty star"
                                                    />
                                                }
                                                fullSymbol={
                                                    <img 
                                                        src="https://cdn-icons-png.flaticon.com/32/616/616489.png" 
                                                        alt="Filled star"
                                                    />
                                                }
                                            />
                                        </div>
                                        <p className='lead mt-3'>{review.reviewText}</p>
                                    </div>
                                )}
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Col>
            </Row>
        </Container>
    );
};

export default Reviews;