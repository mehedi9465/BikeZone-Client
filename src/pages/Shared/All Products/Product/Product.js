import React from 'react';
import { Card, Col, Button } from 'react-bootstrap';
import { useHistory } from 'react-router';

const Product = ({ product }) => {
    const history = useHistory();

    const handleOnClick = () => {
        history.push(`/products/${product?._id}`);
    }

    return (
        <Col className='justify-content-center'>
                <Card id='card' className='px-3 pt-3 my-3 text-center' style={{ width: '22rem' , margin: 'auto' }}>
                <Card.Img id='img' className='m-0' variant="top" src={product?.img} height='180' fluid/>
                <Card.Body>
                <Card.Title className='my-4'>{product?.title}</Card.Title>
                <Card.Text>
                    <p className=''>{product?.title} has powerful {product?.engine} Engine with {product?.displacement} Displacement</p>
                    <p className='py-2'>৳ {product?.price}</p>
                </Card.Text>
                <Button onClick={handleOnClick} className='my-1 py-2 w-100' size='sm' variant='outline-secondary'>Quick View</Button>
            </Card.Body>
            </Card>
        </Col>
    );
};

export default Product;