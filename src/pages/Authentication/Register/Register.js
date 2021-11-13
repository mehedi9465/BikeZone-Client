import React, { useState } from 'react';
import { Col, Container, Form, Row, Button, Spinner, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router';
import swal from 'sweetalert';
import useAuth from '../../../hooks/useAuth';

const Register = () => {
    const [registerData, setRegisterData] = useState({});
    const { registerUser, isLoading, error, user } = useAuth();
    const history = useHistory();

    const handleOnBlur = e => {
        const field = e.target.name;
        const value = e.target.value;
        const newInfo = { ...registerData };
        newInfo[field] = value; 
        setRegisterData(newInfo);
    }

    const handleSubmit = e => {
        e.preventDefault();
        if(registerData?.password === registerData?.password2){
            registerUser(registerData?.displayName, registerData?.email.toLowerCase(), registerData?.password)
            history.push('/');
        }
        else{
            swal({
                title: "Password did not matched!",
                icon: "error",
                button: "ok",
              });
        }
    } 

    const handleError = () => {
       
    }

    return (
        <Container className='my-5'>
        <Row className='justify-content-center my-5 py-5'>
            <Col xl={6} lg={7} md={9} sm={10} xs={9}>
                <h1 className='display-2 text-center'>Register</h1>
                {
                        isLoading? 
                        <Spinner className='mt-5' animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        :
                        <>
                        <Form className='my-5' onSubmit={handleSubmit}>
                                <Form.Floating className="mb-3">
                                    <Form.Control
                                    required
                                    placeholder='Name'
                                    type="text"
                                    name='displayName'
                                    onBlur={handleOnBlur}
                                    />
                                    <label htmlFor="floatingInputCustom">Name</label>
                                </Form.Floating>

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
                                    onError={handleError}
                                    />
                                    <label htmlFor="floatingInputCustom">Passowrd</label>
                                </Form.Floating>

                                <Form.Floating className="my-4">
                                    <Form.Control
                                    required
                                    placeholder='Password'
                                    type="password"
                                    name='password2'
                                    onBlur={handleOnBlur}
                                    />
                                    <label htmlFor="floatingInputCustom">Passowrd</label>
                                </Form.Floating>
                                <Button type='submit' className='w-100 py-2' variant='outline-secondary'>Register</Button>
                            </Form>
                            {
                            user?.email &&
                            <Alert variant="success">Successfully Registered!</Alert>
                            }

                            {
                                error &&
                                <Alert variant="danger">{error}</Alert>
                            }
                        </>
                    }
            </Col>
        </Row>
    </Container>
    );
};

export default Register;