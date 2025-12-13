import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Image, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router';
import swal from 'sweetalert';

const ManageProducts = ({ url }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const history = useHistory();

    useEffect(() => {
        setLoading(true);
        axios.get('https://bikezone-server.onrender.com/products')
        .then(({ data }) => {
            setProducts(data);
            setLoading(false);
        })
        .catch(error => {
            console.error(error);
            setLoading(false);
        });
    }, []);

    const handleUpdate = id => {
        history.push(`${url}/${id}`);
    }

    const handleDelete = (id) => {
        swal({
            title: "Are you sure?",
            text: "This product will be permanently deleted!",
            icon: "warning",
            dangerMode: true,
            buttons: ["Cancel", "Delete"],
        }).then(result => {
            if(result){
                axios.delete(`https://bikezone-server.onrender.com/products/${id}`)
                .then(({ data }) => {
                    if(data.deletedCount === 1){
                        swal({
                            title: "Deleted!",
                            text: "Product has been deleted successfully",
                            icon: "success",
                            button: "OK",
                        });
                        const filtered = products.filter(product => product._id !== id);
                        setProducts(filtered);
                    }
                    else{
                        swal({
                            title: "Failed!",
                            text: "Something went wrong",
                            icon: "error",
                            button: "OK",
                        });
                    }
                });
            }
        });
    }

    const filteredProducts = products.filter(product => 
        product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.emission?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.price?.toString().includes(searchTerm)
    );

    return (
        <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header Section */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '25px 30px',
                marginBottom: '25px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                        <h2 style={{ margin: '0', fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>
                            Manage Products
                        </h2>
                        <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
                            Total Products: <span style={{ fontWeight: '600', color: '#495057' }}>{filteredProducts.length}</span>
                        </p>
                    </div>
                    
                    {/* Search Bar */}
                    <div style={{ position: 'relative', width: '300px' }}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 40px 10px 15px',
                                borderRadius: '8px',
                                border: '1px solid #dee2e6',
                                fontSize: '14px',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
                        />
                        <span style={{
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '18px'
                        }}>
                            🔍
                        </span>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <Spinner animation="border" variant="primary" />
                    <p style={{ marginTop: '15px', color: '#6c757d' }}>Loading products...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '60px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>📦</div>
                    <h3 style={{ color: '#6c757d', fontWeight: '500' }}>No products found</h3>
                    <p style={{ color: '#adb5bd' }}>Try adjusting your search</p>
                </div>
            ) : (
                /* Products Table */
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                    <th style={{ padding: '18px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                                        Product Name
                                    </th>
                                    <th style={{ padding: '18px 20px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                                        Emission
                                    </th>
                                    <th style={{ padding: '18px 20px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                                        Engine
                                    </th>
                                    <th style={{ padding: '18px 20px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                                        Price
                                    </th>
                                    <th style={{ padding: '18px 20px', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr 
                                        key={product?._id}
                                        style={{ 
                                            borderBottom: '1px solid #e9ecef',
                                            transition: 'background 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        <td style={{ padding: '20px', fontSize: '14px', color: '#2c3e50', fontWeight: '500' }}>
                                            {product?.title}
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'center', fontSize: '14px', color: '#6c757d' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                background: '#e3f2fd',
                                                color: '#1976d2',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                {product?.emission || 'N/A'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'center', fontSize: '14px', color: '#6c757d' }}>
                                            {product?.displacement || 'N/A'}
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'center', fontSize: '16px', fontWeight: '600', color: '#28a745' }}>
                                            ${product?.price}
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                                <Button
                                                    onClick={() => handleUpdate(product?._id)}
                                                    style={{
                                                        background: '#e3f2fd',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '8px 12px',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = '#2196f3';
                                                        e.target.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = '#e3f2fd';
                                                        e.target.style.transform = 'scale(1)';
                                                    }}
                                                    title="Edit Product"
                                                >
                                                    <Image 
                                                        src='https://i.ibb.co/kmZWhGK/1601884.png' 
                                                        width='20'
                                                        alt='Edit'
                                                    />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(product?._id)}
                                                    style={{
                                                        background: '#ffebee',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '8px 12px',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = '#ef5350';
                                                        e.target.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = '#ffebee';
                                                        e.target.style.transform = 'scale(1)';
                                                    }}
                                                    title="Delete Product"
                                                >
                                                    <Image 
                                                        src='https://i.ibb.co/jDqXJSc/3221897.png' 
                                                        width='20'
                                                        alt='Delete'
                                                    />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;