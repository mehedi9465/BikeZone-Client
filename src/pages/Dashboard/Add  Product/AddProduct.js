import axios from 'axios';
import React, { useState } from 'react';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import swal from 'sweetalert';

const AddProduct = () => {
    const [productInfo, setProductInfo] = useState({});
    const [loading, setLoading] = useState(false);

    const handleOnBlur = e => {
        const field = e.target.name;
        const value = e.target.value;
        const newInfo = { ...productInfo };
        newInfo[field] = value;
        setProductInfo(newInfo);
    } 

    const handleOnSubmit = e => {
        e.preventDefault();
        setLoading(true);
        axios.post('https://bikezone-server.onrender.com/products', productInfo)
        .then(({ data }) => {
            setLoading(false);
            if(data.insertedId){
                swal({
                    title: "Success!",
                    text: "Product has been added successfully",
                    icon: "success",
                    button: "OK",
                });
                e.target.reset();
                setProductInfo({});
            }
            else{
                swal({
                    title: "Failed!",
                    text: "Failed to add product",
                    icon: "error",
                    button: "OK",
                });
            }
        })
        .catch(error => {
            setLoading(false);
            swal({
                title: "Error!",
                text: "Something went wrong",
                icon: "error",
                button: "OK",
            });
        });
    }

    const inputStyle = {
        padding: '12px 16px',
        fontSize: '14px',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        transition: 'all 0.3s ease',
        width: '100%'
    };

    const labelStyle = {
        fontWeight: '600',
        fontSize: '14px',
        color: '#495057',
        marginBottom: '8px',
        display: 'block'
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Container>
                {/* Header */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '25px 30px',
                    marginBottom: '25px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <h2 style={{ margin: '0', fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>
                        Add New Product
                    </h2>
                    <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
                        Fill in the details to add a new bike to your inventory
                    </p>
                </div>

                {/* Form Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '40px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <Form onSubmit={handleOnSubmit}>
                        {/* Basic Information Section */}
                        <div style={{ marginBottom: '30px' }}>
                            <h5 style={{ 
                                fontSize: '18px', 
                                fontWeight: '600', 
                                color: '#2c3e50',
                                marginBottom: '20px',
                                paddingBottom: '10px',
                                borderBottom: '2px solid #e9ecef'
                            }}>
                                Basic Information
                            </h5>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Bike Model *</label>
                                    <input
                                        onBlur={handleOnBlur}
                                        type="text"
                                        name="title"
                                        placeholder="Enter bike model"
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Price *</label>
                                    <input
                                        onBlur={handleOnBlur}
                                        type="text"
                                        name="price"
                                        placeholder="Enter price"
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Image URL *</label>
                                    <input
                                        onBlur={handleOnBlur}
                                        type="text"
                                        name="img"
                                        placeholder="Enter image link"
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Engine Specifications Section */}
                        <div style={{ marginBottom: '30px' }}>
                            <h5 style={{ 
                                fontSize: '18px', 
                                fontWeight: '600', 
                                color: '#2c3e50',
                                marginBottom: '20px',
                                paddingBottom: '10px',
                                borderBottom: '2px solid #e9ecef'
                            }}>
                                Engine Specifications
                            </h5>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Max Power</label>
                                    <input
                                        onBlur={handleOnBlur}
                                        type="text"
                                        name="max_power"
                                        placeholder="e.g., 15 bhp"
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Max Torque</label>
                                    <input
                                        onBlur={handleOnBlur}
                                        type="text"
                                        name="max_torque"
                                        placeholder="e.g., 12 Nm"
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Displacement</label>
                                    <input
                                        onBlur={handleOnBlur}
                                        type="text"
                                        name="displacement"
                                        placeholder="e.g., 150cc"
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Cylinders</label>
                                    <input
                                        onBlur={handleOnBlur}
                                        type="number"
                                        name="cylinders"
                                        placeholder="e.g., 1"
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Emission</label>
                                    <input
                                        onBlur={handleOnBlur}
                                        type="text"
                                        name="emission"
                                        placeholder="e.g., BS6"
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Gear</label>
                                    <input
                                        onBlur={handleOnBlur}
                                        type="number"
                                        name="gear"
                                        placeholder="e.g., 5"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <label style={labelStyle}>Engine Type</label>
                                <input
                                    onBlur={handleOnBlur}
                                    type="text"
                                    name="engine"
                                    placeholder="e.g., 4-Stroke, Single Cylinder"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Performance Section */}
                        <div style={{ marginBottom: '30px' }}>
                            <h5 style={{ 
                                fontSize: '18px', 
                                fontWeight: '600', 
                                color: '#2c3e50',
                                marginBottom: '20px',
                                paddingBottom: '10px',
                                borderBottom: '2px solid #e9ecef'
                            }}>
                                Performance
                            </h5>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Fuel Capacity</label>
                                    <input
                                        onBlur={handleOnBlur}
                                        type="text"
                                        name="fuel_capacity"
                                        placeholder="e.g., 12 liters"
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Mileage</label>
                                    <input
                                        onBlur={handleOnBlur}
                                        type="number"
                                        name="milage"
                                        placeholder="e.g., 45 km/l"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div style={{ marginBottom: '30px' }}>
                            <h5 style={{ 
                                fontSize: '18px', 
                                fontWeight: '600', 
                                color: '#2c3e50',
                                marginBottom: '20px',
                                paddingBottom: '10px',
                                borderBottom: '2px solid #e9ecef'
                            }}>
                                Description
                            </h5>
                            
                            <label style={labelStyle}>Product Description</label>
                            <textarea 
                                onBlur={handleOnBlur} 
                                name="description"
                                rows="5"
                                placeholder="Enter detailed description of the bike..."
                                style={{
                                    ...inputStyle,
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        {/* Submit Button */}
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
                            <Button
                                type="button"
                                style={{
                                    padding: '12px 30px',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6',
                                    background: 'white',
                                    color: '#495057',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={() => {
                                    document.querySelector('form').reset();
                                    setProductInfo({});
                                }}
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '12px 40px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            style={{ marginRight: '8px' }}
                                        />
                                        Adding...
                                    </>
                                ) : (
                                    '➕ Add Product'
                                )}
                            </Button>
                        </div>
                    </Form>
                </div>
            </Container>
        </div>
    );
};

export default AddProduct;