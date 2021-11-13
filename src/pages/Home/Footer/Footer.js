import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const Footer = () => {
    return (
        <div className='sticky-bottom bg-dark text-light py-5'>
            <Container className='text-justify'>
                <Row xl={4} lg={4} md={4} sm={2} xs={1} className='gy-4 justify-content-center'>
                    <Col className='text-center'>
                        <h6 className='mb-4 text-uppercase w-50 text-start mx-auto'>Company</h6>
                        <p className='my-2 w-50 text-start mx-auto'><small>About Us</small></p>
                        <p className='my-2 w-50 text-start mx-auto'><small>Company</small></p>
                        <p className='my-2 w-50 text-start mx-auto'><small>Press & Blog</small></p>
                        <p className='my-2 w-50 text-start mx-auto'><small>Privacy Policy</small></p>
                        <p className='my-2 w-50 text-start mx-auto'><small>Faq</small></p>
                    </Col>

                    <Col>
                        <h6 className='mb-4 text-uppercase w-75 text-start mx-auto'>Open Hour</h6>
                        <p className='my-2 w-75 text-start mx-auto'><small>Monday 11am-8pm</small></p>
                        <p className='my-2 w-75 text-start mx-auto'><small>Tuesday-Thursday 11am-8pm</small></p>
                        <p className='my-2 w-75 text-start mx-auto'><small>Friday 10am-6pm</small></p>
                        <p className='my-2 w-75 text-start mx-auto'><small>Saturday 10am-6pm</small></p>
                        <p className='my-2 w-75 text-start mx-auto'><small>Sunday 10am-6pm</small></p>
                    </Col>

                    <Col>
                        <h6 className='mb-4 text-uppercase w-50 text-start mx-auto'>Places</h6>
                        <p className='my-2 w-50 text-start mx-auto'><small>Dhaka</small></p>
                        <p className='my-2 w-50 text-start mx-auto'><small>Sylhet</small></p>
                        <p className='my-2 w-50 text-start mx-auto'><small>Rajshahi</small></p>
                        <p className='my-2 w-50 text-start mx-auto'><small>Chittagaon</small></p>
                        <p className='my-2 w-50 text-start mx-auto'><small>Rangamati</small></p>
                    </Col>

                    <Col>
                       <h6 className='mb-4 text-uppercase w-75 text-start mx-auto'>Maiden Tour</h6>
                        <p className='my-2 w-75 text-start mx-auto'><small>We have been providing</small></p>
                        <p className='my-2 w-75 text-start mx-auto'><small>quality coverage, superior</small></p>
                        <p className='my-2 w-75 text-start mx-auto'><small>value and personal service</small></p>
                        <p className='my-2 w-75 text-start mx-auto'><small>to client since 2000</small></p>
                        <p className='my-2 w-75 text-start mx-auto'><small>Faq</small></p>
                    </Col>
                </Row>
                <hr />
            </Container>
            <p className='text-center'><small>©️ 2021, Maiden Tourism - Travel Multipurpose Theme. All right reserve</small></p>
        </div>
    );
};

export default Footer;