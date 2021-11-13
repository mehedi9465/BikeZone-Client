import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Image, Carousel, CarouselItem } from 'react-bootstrap';
import useAuth from '../../../../hooks/useAuth';
// import Carousel from 'react-elastic-carousel';
import Rating from 'react-rating';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        axios.get('http://localhost:4000/reviews')
        .then(({ data }) => setReviews(data))
    }, []);

    console.log(reviews);

    return (
        <Container id='review' className='my-5 py-5'>
        <h1 className='text-center display-4 mb-4'>Testmonial</h1>
            <Row className='bg-light py-5 rounded'>
                <Col>
                <Carousel className='mt-5'>
                {
                    reviews.map(review => <CarouselItem className='bg-light  my-4 rounded-3' key={review?._id}>
                        {
                            review?.img ?
                            <div className='text-center d-flex flex-column w-75 mx-auto p-4'>
                                <span className='fs-5'> <Image className='rounded-circle' src={review?.img} height='40'/> &nbsp; <b>{review?.displayName}</b> reviewed on <b>{review?.bikeModel}</b></span>
                                <div>
                                <Rating className='mt-4 mx-auto'
                                readonly
                                initialRating = {review?.rating}
                                emptySymbol={
                                    <img src="https://cdn-icons-png.flaticon.com/32/616/616821.png" />
                                }
                                fullSymbol={
                                    <img src="https://cdn-icons-png.flaticon.com/32/616/616489.png" />
                                }
                                />
                                {/* <span className='fs-5'>({review?.rating})</span>  */}
                                </div>
                                <p className='lead mt-3'>{review?.reviewText}</p>
                            </div>
                        :
                        <div className='d-flex flex-column justify-content-start p-4'>
                            <span className='fs-5'> <Image className='rounded-circle' src='https://cdn-icons-png.flaticon.com/512/236/236831.png' height='40'/> &nbsp; <b>{review?.displayName}</b> reviewed on <b>{review?.bikeModel}</b></span>
                            <div>
                            <Rating className='mt-4 mx-auto'
                            readonly
                            initialRating = {review?.rating}
                            emptySymbol={
                                <img src="https://cdn-icons-png.flaticon.com/32/616/616821.png" />
                            }
                            fullSymbol={
                                <img src="https://cdn-icons-png.flaticon.com/32/616/616489.png" />
                            }
                            />
                            </div>
                            <p className='lead mt-3'>{review?.reviewText}</p>
                        </div>
                        }
                    </CarouselItem>)
                }
                </Carousel>
                </Col>
            </Row>
        </Container>
    );
};

export default Reviews;