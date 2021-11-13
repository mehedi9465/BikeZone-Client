import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CarouselItem, Image, Row, Carousel } from 'react-bootstrap';
// import Carousel from 'react-elastic-carousel';

const Banner = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('https://protected-fortress-94189.herokuapp.com/products')
        .then(({ data }) => setProducts(data))
    }, [])

    return (
        // <Carousel enableAutoPlay='true' autoPlaySpeed='4000' className='py-5 my-5'>
        //         {
        //             products.map(product => 
        //             <Row>
        //                 <div className='d-flex justify-content-center align-items-center'>
        //                     <Image src={product?.img} width='600'/>
        //                     <div>
        //                         <p className='display-4'>{product?.title}</p>
        //                         <p>{product?.engine}</p>
        //                     </div>
        //                 </div>
        //             </Row>)
        //         }
            
        // </Carousel>
        <Carousel id='banner' className='my-5'>
            {
                products.map(product => 
                <CarouselItem className='py-5 my-5'>
                    <div className='d-flex justify-content-center align-items-center'>
                        <Image src={product?.img} width='600'/>
                        <div>
                        <p className='display-4'>{product?.title}</p>
                            <p>{product?.engine}</p>
                        </div>
                    </div>
                </CarouselItem>)
            }
        </Carousel>
    );
};

export default Banner;