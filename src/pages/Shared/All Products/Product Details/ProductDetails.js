import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Image, ListGroup, ListGroupItem, Row, Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import PlaceOrderModal from '../../../Place Order/PlaceOrderModal';

const ProductDetails = () => {
    const [product, setProduct] = useState([]);
    const { productId } = useParams();
    const [modalShow, setModalShow] = React.useState(false);

    useEffect(() => {
        axios.get(`https://bikezone-server.onrender.com/products/${productId}`)
        .then(({ data }) => setProduct(data))
    }, []);
    console.log(product);
    return (
        <Container className='py-5'>
            <Row className='mt-5'>
                <Col>
                    <Image src={product?.img} width='480' fluid/>
                </Col>
                <Col>
                    <ListGroup className='text-left'>
                        <ListGroupItem><b className='fs-3'>{product?.title}</b></ListGroupItem>
                        <ListGroupItem><b>Displacement:</b> {product?.displacement} &nbsp; &nbsp; <b>Cylinders:</b> {product?.cylinders}</ListGroupItem>
                        <ListGroupItem><b>Emission:</b> {product?.emission} &nbsp; &nbsp; <b>Gear:</b> {product?.gear} Speed Gear Box</ListGroupItem>
                        <ListGroupItem><b>Fuel:</b> {product?.fuel_capacity} &nbsp; &nbsp; <b>Milage:</b> {product?.milage} KMPL</ListGroupItem>
                        <ListGroupItem><b>Max Power:</b> {product?.max_power}</ListGroupItem>
                        <ListGroupItem><b>Max Torque:</b> {product?.max_torque}</ListGroupItem>
                        <ListGroupItem><b>Price: </b>{product?.price}</ListGroupItem>
                        <Button onClick={() => setModalShow(true)} className='my-3 py-2' variant='outline-secondary'>Place Order</Button>
                    </ListGroup>
                </Col>
            </Row>       
            <Row><p className='lead mt-5'>{product?.description}</p></Row>
            <>
                <PlaceOrderModal
                    show={modalShow}
                    bikemodel={product?.title}
                    bikeprice={product?.price}
                    onHide={() => setModalShow(false)}
                />
            </>    
        </Container>
    );
};

export default ProductDetails;