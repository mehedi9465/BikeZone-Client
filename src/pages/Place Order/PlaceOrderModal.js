import axios from 'axios';
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import swal from 'sweetalert';
import useAuth from '../../hooks/useAuth';

const PlaceOrderModal = (props) => {
    const [orderData, setOrderData] = useState({});
    const { user } = useAuth()

    const handleOnBlur = e => {
        const field = e.target.name;
        const value = e.target.value;
        const newInfo = { ...orderData }
        newInfo[field] = value;
        setOrderData(newInfo)
    }

    const setDefaultValues = () => {
        const setInfo = {
            "customerName": user?.displayName,
            "customerEmail": user?.email,
            "bikeModel": props.bikemodel,
            "price": props?.bikeprice,
            "orderStatus": "Pending"
        }
        return setInfo;
    }

    const handleOnSubmit = e => {
        e.preventDefault();
        const defaultValues = setDefaultValues();
        const order = {
            ...orderData,
            ...defaultValues
        }
        axios.post('https://protected-fortress-94189.herokuapp.com/orders', order)
        .then(({ data }) => {
            if(data.insertedId){
                swal({
                  title: "Order is Under Review!",
                  icon: "warning",
                  button: "ok",
                });
              }
              else{
                swal({
                  title: "Something Went Wrong!",
                  icon: "error",
                  button: "ok",
                });
              }
        })
        console.log(orderData);
    }

    return (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
            Place Your Order
            </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
            
            <Form.Floating className="mb-3">
                <Form.Control
                id="floatingInputCustom"
                placeholder='Name'
                required
                disabled
                type="text"
                defaultValue={user?.displayName}
                name='customerName'
                onBlur={handleOnBlur}
                />
                <label htmlFor="floatingInputCustom">Name</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
                <Form.Control
                id="floatingInputCustom"
                placeholder='Email'
                required
                disabled
                type="email"
                defaultValue={user?.email}
                name='customerEmail'
                onBlur={handleOnBlur}
                />
                <label htmlFor="floatingInputCustom">Email</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
                <Form.Control
                id="floatingInputCustom"
                placeholder='Phone'
                required
                type="number"
                name='customerPhone'
                onBlur={handleOnBlur}
                />
                <label htmlFor="floatingInputCustom">Phone</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
                <Form.Control
                id="floatingInputCustom"
                placeholder='Bike Model'
                required
                type="text"
                defaultValue={props.bikemodel}
                disabled
                name='bikeModel'
                onBlur={handleOnBlur}
                />
                <label htmlFor="floatingInputCustom">Bike Model</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
                <Form.Control
                id="floatingInputCustom"
                placeholder='Price'
                required
                disabled
                defaultValue={props.bikeprice}
                name='price'
                onBlur={handleOnBlur}
                />
                <label htmlFor="floatingInputCustom">Price</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
                <Form.Control
                id="floatingInputCustom"
                placeholder='Delivery Location'
                type="text"
                name='deliveryLocation'
                onBlur={handleOnBlur}
                />
                <label htmlFor="floatingInputCustom">Delivery Location</label>
            </Form.Floating>

        </Modal.Body>
        <Modal.Footer>
            <Button type='submit' variant='outline-primary' onClick={props.onHide}>Proceed</Button>
            <Button variant='outline-danger' onClick={props.onHide}>Cancel</Button>
        </Modal.Footer>
        </Form>
        </Modal>
    );
};

export default PlaceOrderModal;