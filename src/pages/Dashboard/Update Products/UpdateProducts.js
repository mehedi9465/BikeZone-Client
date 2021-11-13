import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Row, Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import swal from 'sweetalert';
const UpdateProducts = () => {
    const [productInfo, setProductInfo] = useState({});
    const [dependency, setDependency] = useState({});
    const { productId } = useParams();

    useEffect(() => {
        axios.get(`https://protected-fortress-94189.herokuapp.com/products/${productId}`)
        .then(({ data }) => setProductInfo(data))    
    }, [productId])
    
    const handleOnChange = e => {
        const field = e.target.name;
        const value = e.target.value;
        const newInfo = { ...productInfo };
        newInfo[field] = value;
        setProductInfo(newInfo);
    } 
    
    const handleOnSubmit = e => {
        console.log(e);
        e.preventDefault();
        console.log(productInfo);
        axios.put('https://protected-fortress-94189.herokuapp.com/products', productInfo)
        .then(({ data }) => {
            console.log(data);
            if(data.modifiedCount){
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
            setDependency(data)
        })
    }

    // const reset = e => {
    //     e.target.input.value = '';
    //     e.target.input.textarea = '';
    // }

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
                            onChange={handleOnChange}
                            type="text"
                            name="title"
                            defaultValue={productInfo?.title}
                        />
                        </Form.Group>

                        <Form.Group
                        as={Col}
                        md="4"
                        className="position-relative"
                        >
                        <Form.Label>Max Power</Form.Label>
                        <Form.Control
                            onChange={handleOnChange}
                            type="text"
                            name="max_power"
                            defaultValue={productInfo?.max_power}
                        />
                        </Form.Group>

                        <Form.Group
                        as={Col}
                        md="4"
                        className="position-relative"
                        >
                        <Form.Label>Max Torque</Form.Label>
                        <Form.Control
                            onChange={handleOnChange}
                            type="text"
                            name="max_torque"
                            defaultValue={productInfo?.max_torque}
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
                            onChange={handleOnChange}
                            type="text"
                            name="displacement"
                            defaultValue={productInfo?.displacement}
                        />
                        </Form.Group>

                        <Form.Group
                        as={Col}
                        md="3"
                        className="position-relative"
                        >
                        <Form.Label>Cylinders</Form.Label>
                        <Form.Control
                            onChange={handleOnChange}
                            type="number"
                            name="cylinders"
                            defaultValue={productInfo?.cylinders}
                        />
                        </Form.Group>

                        <Form.Group
                        as={Col}
                        md="3"
                        className="position-relative"
                        >
                        <Form.Label>Emission</Form.Label>
                        <Form.Control
                            onChange={handleOnChange}
                            type="text"
                            name="emission"
                            defaultValue={productInfo?.emission}
                        />
                        </Form.Group>
                        <Form.Group
                        as={Col}
                        md="3"
                        className="position-relative"
                        >
                        <Form.Label>Gear</Form.Label>
                        <Form.Control
                            onChange={handleOnChange}
                            type="number"
                            name="gear"
                            defaultValue={productInfo?.gear}
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
                            onChange={handleOnChange}
                            type="text"
                            name="fuel_capacity"
                            defaultValue={productInfo?.fuel_capacity}
                        />
                        </Form.Group>

                        <Form.Group
                        as={Col}
                        md="3"
                        className="position-relative"
                        >
                        <Form.Label>Milage</Form.Label>
                        <Form.Control
                            onChange={handleOnChange}
                            type="number"
                            name="milage"
                            defaultValue={productInfo?.milage}
                        />
                        </Form.Group>

                        <Form.Group
                        as={Col}
                        md="3"
                        className="position-relative"
                        >
                        <Form.Label>Image Link</Form.Label>
                        <Form.Control
                            onChange={handleOnChange}
                            type="text"
                            name="img"
                            defaultValue={productInfo?.img}
                        />
                        </Form.Group>

                        <Form.Group
                        as={Col}
                        md="3"
                        className="position-relative"
                        >
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            onChange={handleOnChange}
                            type="text"
                            name="price"
                            defaultValue={productInfo?.price}
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
                            onChange={handleOnChange}
                            type="text"
                            name="engine"
                            defaultValue={productInfo?.engine}
                        />
                    </Form.Group>

                    <Form.Group
                        as={Col}
                        md="7"
                        className="position-relative"
                        >
                        <Form.Label>Description</Form.Label>
                        <textarea 
                        onChange={handleOnChange} 
                        className='form-control' 
                        name="description"
                        defaultValue={productInfo?.description} 
                        />
                    </Form.Group>
                    </Row>

                    <Button className='mt-4' type="submit">Update Product</Button>
                    </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default UpdateProducts;