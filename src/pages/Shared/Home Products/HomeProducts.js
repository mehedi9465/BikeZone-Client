import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import DisplayProduct from '../All Products/Display Product/DisplayProduct';

const HomeProducts = () => {
    const [products, setProducts] = useState([]);
    const history = useHistory();

    const handleButtonProcess = () => {
        history.push('/products')
    }

    // const randomNumber1 = Math.round(Math.random() * 10);
    // const randomNumber2 = Math.round(Math.random() * 10);
    // const randomNumber3 = Math.round(Math.random() * 10);
    const displayProducts = [...products.slice(0, 6)];
    console.log(displayProducts);

    useEffect(() => {
        axios.get('https://bikezone-server.onrender.com/products')
        .then(({ data }) => {
            if(data[0]){
                setProducts(data)
            }
        })
    }, [])

    return (
        <Container id='products' className='d-flex flex-column justify-content-center align-items-center my-5 py-5'>
        <h1 className='text-center display-4 mb-4'>Products</h1>
            <Row xl={3} lg={2} md={2} sm={1} xs={1}>
                {
                    displayProducts.map(product => <DisplayProduct key={product?._id} product={product}></DisplayProduct>)
                }
            </Row>
            <Button onClick={handleButtonProcess} className='px-5 mt-3' size='sm' variant='outline-primary'>Sell All</Button>
        </Container>
    );
};

export default HomeProducts;