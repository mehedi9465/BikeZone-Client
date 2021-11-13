import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import Product from '../Product/Product';

const Products = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/products')
        .then(({ data }) => setProducts(data))
    }, [])

    return (
        <Container>
            <Row className='my-5'>
                {
                    products.map(product => <Product key={product?._id} product={product}>
                        <Button></Button>
                    </Product>)
                }
            </Row>
        </Container>
    );
};

export default Products;