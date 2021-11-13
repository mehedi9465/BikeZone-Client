import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Image } from 'react-bootstrap';
import Rating from 'react-rating';
import swal from 'sweetalert';
import useAuth from '../../../hooks/useAuth';

const Review = () => {
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [rate, setRate] = useState(0);
    const [reviewData, setReviewData] = useState({});
    const [dependency, setDependency] = useState({});
    const { user } = useAuth();

    useEffect(() => {
        axios.get(`https://protected-fortress-94189.herokuapp.com/orders/${user?.email}`)
        .then(({ data }) => {
            console.log(data);
            setOrders(data);
        })
    }, [user?.email]);

    useEffect(() => {
        axios.get(`https://protected-fortress-94189.herokuapp.com/reviews?email=${user?.email}`)
        .then(({ data }) => {
            console.log(data);
            setReviews(data);
        })
    }, [user?.email, dependency]);

    const handleOnBlur = e =>{
        const field = e.target.name;
        const value = e.target.value;
        const newInfo = { ...reviewData };
        newInfo[field] = value;
        setReviewData(newInfo)
    }

    const handleOnSubmit = e => {
        e.preventDefault();
        reviewData.rating = rate;
        reviewData.displayName = user?.displayName;
        reviewData.email = user?.email;
        reviewData.img = user?.photoURL;
        axios.post('https://protected-fortress-94189.herokuapp.com/reviews', reviewData)
        .then(({data}) => {
            setDependency(data)
            if(data.insertedId || data.acknowledged){
                swal({
                    title: "Posted Successfully!",
                    icon: "success",
                    button: "ok",
                  });
            }
            else {
                swal({
                    title: "Something Went Wrong!",
                    icon: "error",
                    button: "ok",
                  });
            }
        })
        console.log(reviewData);
    }

    return (
        <div>
            <Form className='d-flex flex-column justify-content-center align-items-center mt-5' onSubmit={handleOnSubmit}>
            <textarea className='form-control w-50 mx-auto' name="reviewText"  rows="10" onBlur={handleOnBlur} />
            <select className='form-control w-50 mx-auto mt-3' name="bikeModel" onBlur={handleOnBlur} >
                <option selected disabled value="">Choose...</option>
                {
                    orders.map(order => <option value={order?.bikeModel}>{order?.bikeModel}</option>)
                }
                
            </select>
            <Rating className='mt-4 mx-auto'
            emptySymbol={
                <img src="https://cdn-icons-png.flaticon.com/32/616/616821.png" />
            }
            fullSymbol={
                <img src="https://cdn-icons-png.flaticon.com/32/616/616489.png" />
            }
            onChange={(rate) => setRate(rate)} 
            fractions={5}
            /> <br />
            <Button variant='outline-primary' className='mt-3 mb-4' type='submit'>Submit</Button>
            </Form>
                {
                    reviews.map(review => <Row className='bg-light w-50 mx-auto my-4 rounded-3' key={review?._id}>
                        <div className='d-flex flex-column justify-content-start p-4'>
                            <span className='fs-5'> <Image className='rounded-circle' src={user?.photoURL} height='40'/> {user?.displayName} reviewed on {review?.bikeModel}</span>
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
                    </Row>)
                }
        </div>
    );
};

export default Review;