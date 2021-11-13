import axios from 'axios';
import React, { useState } from 'react';
import { Col, Container, Form, Row, Button } from 'react-bootstrap';
import swal from 'sweetalert';

const AddProduct = () => {
    const [productInfo, setProductInfo] = useState({});

    const handleOnBlur = e => {
        const field = e.target.name;
        const value = e.target.value;
        const newInfo = { ...productInfo };
        newInfo[field] = value;
        setProductInfo(newInfo)
    } 

    const handleOnSubmit = e => {
        e.preventDefault();
        axios.post('https://protected-fortress-94189.herokuapp.com/products', productInfo)
        .then(({ data }) => {
            if(data.insertedId){
                swal({
                    title: "Successfully Added!",
                    icon: "success",
                    button: "ok",
                  });
            }
            else{
                swal({
                    title: "Failed to add!",
                    icon: "error",
                    button: "ok",
                  });
            }
        })
    }
    return (
        <>
            <Container>
                <Row className='justify-content-center my-5 py-5'>
                    <Col xl={8} lg={9} md={10} sm={9} xs={9}>
                    <Form validated onSubmit={handleOnSubmit}>
                    <Row className="mb-3">
                        <Form.Group
                        as={Col}
                        md="4"
                        className="position-relative"
                        >
                        <Form.Label>Bike Model</Form.Label>
                        <Form.Control
                            onBlur={handleOnBlur}
                            type="text"
                            name="title"
                        />
                        </Form.Group>

                        <Form.Group
                        as={Col}
                        md="4"
                        className="position-relative"
                        >
                        <Form.Label>Max Power</Form.Label>
                        <Form.Control
                            onBlur={handleOnBlur}
                            type="text"
                            name="max_power"
                        />
                        </Form.Group>

                        <Form.Group
                        as={Col}
                        md="4"
                        className="position-relative"
                        >
                        <Form.Label>Max Torque</Form.Label>
                        <Form.Control
                            onBlur={handleOnBlur}
                            type="text"
                            name="max_torque"
                        />
                        </Form.Group>

                    </Row>

                    <Row className="mb-3">
                        <Form.Group
                        as={Col}
                        md="3"
                        className="position-relative"
                        >
                        <Form.Label>Displacement</Form.Label>
                        <Form.Control
                            onBlur={handleOnBlur}
                            type="text"
                            name="displacement"
                        />
                        </Form.Group>

                        <Form.Group
                        as={Col}
                        md="3"
                        className="position-relative"
                        >
                        <Form.Label>Cylinders</Form.Label>
                        <Form.Control
                            onBlur={handleOnBlur}
                            type="number"
                            name="cylinders"
                        />
                        </Form.Group>

                        <Form.Group
                        as={Col}
                        md="3"
                        className="position-relative"
                        >
                        <Form.Label>Emission</Form.Label>
                        <Form.Control
                            onBlur={handleOnBlur}
                            type="text"
                            name="emission"
                        />
                        </Form.Group>
                        <Form.Group
                        as={Col}
                        md="3"
                        className="position-relative"
                        >
                        <Form.Label>Gear</Form.Label>
                        <Form.Control
                            onBlur={handleOnBlur}
                            type="number"
                            name="gear"
                        />
                        </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                        <Form.Group
                        as={Col}
                        md="3"
                        className="position-relative"
                        >
                        <Form.Label>Fuel</Form.Label>
                        <Form.Control
                            onBlur={handleOnBlur}
                            type="text"
                            name="fuel_capacity"
                        />
                        </Form.Group>

                        <Form.Group
                        as={Col}
                        md="3"
                        className="position-relative"
                        >
                        <Form.Label>Milage</Form.Label>
                        <Form.Control
                            onBlur={handleOnBlur}
                            type="number"
                            name="milage"
                        />
                        </Form.Group>

                        <Form.Group
                        as={Col}
                        md="3"
                        className="position-relative"
                        >
                        <Form.Label>Image Link</Form.Label>
                        <Form.Control
                            onBlur={handleOnBlur}
                            type="text"
                            name="img"
                        />
                        </Form.Group>

                        <Form.Group
                        as={Col}
                        md="3"
                        className="position-relative"
                        >
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            onBlur={handleOnBlur}
                            type="text"
                            name="price"
                        />
                        </Form.Group>
                    </Row>

                    <Row>
                    <Form.Group
                        as={Col}
                        md="5"
                        className="position-relative"
                        >
                        <Form.Label>Engine</Form.Label>
                        <Form.Control
                            onBlur={handleOnBlur}
                            type="text"
                            name="engine"
                        />
                    </Form.Group>

                    <Form.Group
                        as={Col}
                        md="7"
                        className="position-relative"
                        >
                        <Form.Label>Description</Form.Label>
                        <textarea onBlur={handleOnBlur} className='form-control' name="description" />
                    </Form.Group>
                    </Row>

                    <Button className='mt-4' type="submit">Add Product</Button>
                    </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AddProduct;