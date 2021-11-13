import React from 'react';
import { Card, Col, ListGroup } from 'react-bootstrap';
import './DisplayProduct.css'

const DisplayProduct = ({ product }) => {

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
                {/* <ListGroup variant="flush">
                    <ListGroup.Item className='px-0'>Emission: {product?.emission} &nbsp; &nbsp; &nbsp; Gear: {product?.gear}</ListGroup.Item>
                    <ListGroup.Item className='px-0'>Max Power: {product?.max_power}</ListGroup.Item>
                    <ListGroup.Item className='px-0'>Max Torque: {product?.max_torque}</ListGroup.Item>
                    <ListGroup.Item className='px-0'>Start at: {product?.price}</ListGroup.Item>
                </ListGroup> */}
            </Card.Body>
            </Card>
        </Col>
    );
};

export default DisplayProduct;