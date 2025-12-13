import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import swal from 'sweetalert';

const MakeAdmin = () => {
    const [email, setEmail] = useState('');
    const [adminList, setAdminList] = useState([]);
    const [dependency, setDependency] = useState({});
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true);

    useEffect(() => {
        setListLoading(true);
        axios.get('https://bikezone-server.onrender.com/users/admin')
        .then(({data}) => {
            setAdminList(data);
            setListLoading(false);
        })
        .catch(error => {
            console.error(error);
            setListLoading(false);
        });
    }, [dependency]);

    const handleOnSubmit = e => {
        e.preventDefault();
        setLoading(true);
        axios.put(`https://bikezone-server.onrender.com/users/admin/${email.toLowerCase()}`)
        .then(({ data }) => {
            setLoading(false);
            if(data.modifiedCount){
                swal({
                    title: "Success!",
                    text: "User has been made admin successfully",
                    icon: "success",
                    button: "OK",
                });
                e.target.reset();
                setEmail('');
            }
            else if(data.matchedCount && !data.modifiedCount){
                swal({
                    title: "Already an Admin!",
                    text: "This user is already an admin",
                    icon: "info",
                    button: "OK",
                });
            }
            else{
                swal({
                    title: "User Not Found!",
                    text: "No user found with this email",
                    icon: "error",
                    button: "OK",
                });
            }
            setDependency(data);
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

    const handleOnBlur = e => {
        setEmail(e.target.value);
    }

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
                        Make Admin
                    </h2>
                    <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
                        Promote users to admin by entering their email address
                    </p>
                </div>

                {/* Make Admin Form */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '40px',
                    marginBottom: '25px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    maxWidth: '600px',
                    margin: '0 auto 25px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ 
                            fontSize: '48px', 
                            marginBottom: '15px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold'
                        }}>
                            👑
                        </div>
                        <h4 style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                            Grant Admin Access
                        </h4>
                        <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>
                            Enter the email address of the user you want to promote
                        </p>
                    </div>

                    <Form onSubmit={handleOnSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontWeight: '600',
                                fontSize: '14px',
                                color: '#495057',
                                marginBottom: '8px'
                            }}>
                                User Email Address *
                            </label>
                            <input
                                required
                                type="email"
                                name='email'
                                placeholder="Enter user email"
                                onBlur={handleOnBlur}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    fontSize: '14px',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlurCapture={(e) => e.target.style.borderColor = '#dee2e6'}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '8px',
                                border: 'none',
                                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '14px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease'
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
                                    Processing...
                                </>
                            ) : (
                                '👑 Make Admin'
                            )}
                        </Button>
                    </Form>
                </div>

                {/* Admin List */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ 
                        padding: '20px 30px', 
                        background: '#f8f9fa',
                        borderBottom: '1px solid #e9ecef'
                    }}>
                        <h4 style={{ margin: '0', fontSize: '20px', fontWeight: '600', color: '#2c3e50' }}>
                            Current Admins
                        </h4>
                        <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
                            Total Admins: <span style={{ fontWeight: '600', color: '#495057' }}>{adminList.length}</span>
                        </p>
                    </div>

                    {listLoading ? (
                        <div style={{ textAlign: 'center', padding: '60px' }}>
                            <Spinner animation="border" variant="primary" />
                            <p style={{ marginTop: '15px', color: '#6c757d' }}>Loading admins...</p>
                        </div>
                    ) : adminList.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>👤</div>
                            <h5 style={{ color: '#6c757d', fontWeight: '500' }}>No admins yet</h5>
                            <p style={{ color: '#adb5bd', fontSize: '14px' }}>Start by promoting your first admin</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                        <th style={{ 
                                            padding: '18px 30px', 
                                            textAlign: 'left', 
                                            fontWeight: '600', 
                                            color: '#495057', 
                                            fontSize: '14px',
                                            width: '40%'
                                        }}>
                                            Name
                                        </th>
                                        <th style={{ 
                                            padding: '18px 30px', 
                                            textAlign: 'left', 
                                            fontWeight: '600', 
                                            color: '#495057', 
                                            fontSize: '14px',
                                            width: '50%'
                                        }}>
                                            Email Address
                                        </th>
                                        <th style={{ 
                                            padding: '18px 30px', 
                                            textAlign: 'center', 
                                            fontWeight: '600', 
                                            color: '#495057', 
                                            fontSize: '14px',
                                            width: '10%'
                                        }}>
                                            Role
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminList.map((admin, index) => (
                                        <tr 
                                            key={admin?._id}
                                            style={{ 
                                                borderBottom: '1px solid #e9ecef',
                                                transition: 'background 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                        >
                                            <td style={{ padding: '20px 30px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        fontSize: '16px'
                                                    }}>
                                                        {admin?.displayName?.charAt(0).toUpperCase() || 'A'}
                                                    </div>
                                                    <span style={{ 
                                                        fontSize: '14px', 
                                                        color: '#2c3e50', 
                                                        fontWeight: '500' 
                                                    }}>
                                                        {admin?.displayName || 'Admin User'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ 
                                                padding: '20px 30px', 
                                                fontSize: '14px', 
                                                color: '#6c757d' 
                                            }}>
                                                {admin?.email}
                                            </td>
                                            <td style={{ padding: '20px 30px', textAlign: 'center' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '6px 16px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                                    color: 'white'
                                                }}>
                                                    👑 Admin
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default MakeAdmin;