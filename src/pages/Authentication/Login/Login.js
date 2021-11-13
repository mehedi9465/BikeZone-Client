import React, { useState } from 'react';
import { Col, Container, Form, Row, Button, Image, Spinner, Alert } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router';
import useAuth from '../../../hooks/useAuth';

const Login = () => {
    const [loginData, setLoginData] = useState({});
    const { googleSignIn, loginUser, isLoading, error, user } = useAuth();
    
    const location = useLocation();
    const history = useHistory();

    const handleSubmit = e => {
        e.preventDefault();
        console.log(loginData);
        loginUser(loginData?.email.toLowerCase(), loginData?.password, location, history)
        console.log(loginData);
    }

    const handleOnBlur = e => {
        const field = e.target.name;
        const value = e.target.value;
        const newInfo = { ...loginData };
        newInfo[field] = value
        setLoginData(newInfo);
    }

    return (
        <Container className='my-5'>
            <Row className='justify-content-center my-5 py-5'>
                <Col xl={6} lg={7} md={9} sm={10} xs={9}>
                    <h1 className='display-2 text-center'>Login</h1>
                    {
                        isLoading? 
                        <div className='h-100 d-flex justify-content-center align-items-center'>
                            <Spinner className='mt-5' animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                        :
                        <>
                        <Form className='my-5' onSubmit={handleSubmit}>
                                <Form.Floating className="mb-3">
                                    <Form.Control
                                    required
                                    placeholder='Email'
                                    type="email"
                                    name='email'
                                    onBlur={handleOnBlur}
                                    />
                                    <label htmlFor="floatingInputCustom">Email</label>
                                </Form.Floating>

                                <Form.Floating className="my-4">
                                    <Form.Control
                                    required
                                    placeholder='Password'
                                    type="password"
                                    name='password'
                                    onBlur={handleOnBlur}
                                    />
                                    <label htmlFor="floatingInputCustom">Passowrd</label>
                                </Form.Floating>
                                <Button type='submit' className='w-100 py-2' variant='outline-secondary'>Login</Button>
                            </Form>
                            <p >Or Sign in with</p>
                            <Button  onClick={() => googleSignIn(location, history)} className='rounded-pill mb-5' variant='outline-dark'> <Image src='https://cdn-icons-png.flaticon.com/512/2991/2991148.png' width='25' />&nbsp; &nbsp; &nbsp; &nbsp; Google &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</Button>
                        </>
                    }
                        {
                            user?.email &&
                            <Alert variant="success">Successfully logged in!</Alert>
                        }

                        {
                            error &&
                            <Alert variant="danger">{error}</Alert>
                        }
                </Col>
            </Row>
        </Container>
    );
};

export default Login;