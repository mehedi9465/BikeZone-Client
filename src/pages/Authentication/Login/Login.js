import React, { useState } from 'react';
import { Container, Form, Button, Image, Spinner, Alert } from 'react-bootstrap';
import { useHistory, useLocation, Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const Login = () => {
    const [loginData, setLoginData] = useState({});
    const { googleSignIn, loginUser, isLoading, error, user } = useAuth();
    
    const location = useLocation();
    const history = useHistory();

    const handleSubmit = e => {
        e.preventDefault();
        loginUser(loginData?.email.toLowerCase(), loginData?.password, location, history);
    }

    const handleOnBlur = e => {
        const field = e.target.name;
        const value = e.target.value;
        const newInfo = { ...loginData };
        newInfo[field] = value;
        setLoginData(newInfo);
    }

    const inputStyle = {
        padding: '14px 16px',
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
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px'
        }}>
            <Container style={{ maxWidth: '480px' }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '40px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}>
                    {/* Logo/Header */}
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ 
                            fontSize: '48px', 
                            marginBottom: '15px',
                            filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.4))'
                        }}>
                            🚴
                        </div>
                        <h2 style={{ 
                            margin: '0', 
                            fontSize: '32px', 
                            fontWeight: '700', 
                            color: '#2c3e50',
                            marginBottom: '8px'
                        }}>
                            Welcome Back
                        </h2>
                        <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>
                            Sign in to continue to BikeZone
                        </p>
                    </div>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Spinner animation="border" style={{ color: '#667eea' }} />
                            <p style={{ marginTop: '15px', color: '#6c757d' }}>Signing you in...</p>
                        </div>
                    ) : (
                        <>
                            {/* Alerts */}
                            {user?.email && (
                                <Alert 
                                    variant="success" 
                                    style={{ 
                                        borderRadius: '8px', 
                                        marginBottom: '20px',
                                        fontSize: '14px'
                                    }}
                                >
                                    ✓ Successfully logged in!
                                </Alert>
                            )}

                            {error && (
                                <Alert 
                                    variant="danger" 
                                    style={{ 
                                        borderRadius: '8px', 
                                        marginBottom: '20px',
                                        fontSize: '14px'
                                    }}
                                >
                                    ✕ {error}
                                </Alert>
                            )}

                            {/* Login Form */}
                            <Form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={labelStyle}>Email Address</label>
                                    <input
                                        required
                                        placeholder='Enter your email'
                                        type="email"
                                        name='email'
                                        onBlur={handleOnBlur}
                                        style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                        onBlurCapture={(e) => e.target.style.borderColor = '#dee2e6'}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={labelStyle}>Password</label>
                                    <input
                                        required
                                        placeholder='Enter your password'
                                        type="password"
                                        name='password'
                                        onBlur={handleOnBlur}
                                        style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                        onBlurCapture={(e) => e.target.style.borderColor = '#dee2e6'}
                                    />
                                </div>

                                <Button 
                                    type='submit' 
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        marginBottom: '20px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                >
                                    Sign In
                                </Button>
                            </Form>

                            {/* Divider */}
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                margin: '20px 0',
                                gap: '10px'
                            }}>
                                <div style={{ flex: 1, height: '1px', background: '#dee2e6' }}></div>
                                <span style={{ color: '#6c757d', fontSize: '14px' }}>or</span>
                                <div style={{ flex: 1, height: '1px', background: '#dee2e6' }}></div>
                            </div>

                            {/* Google Sign In */}
                            <Button  
                                onClick={() => googleSignIn(location, history)} 
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6',
                                    background: 'white',
                                    color: '#495057',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    marginBottom: '20px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#f8f9fa';
                                    e.target.style.borderColor = '#667eea';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'white';
                                    e.target.style.borderColor = '#dee2e6';
                                }}
                            >
                                <Image 
                                    src='https://cdn-icons-png.flaticon.com/512/2991/2991148.png' 
                                    width='20'
                                    alt="Google"
                                />
                                Continue with Google
                            </Button>

                            {/* Sign Up Link */}
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>
                                    Don't have an account?{' '}
                                    <Link 
                                        to="/register"
                                        style={{ 
                                            color: '#667eea', 
                                            fontWeight: '600',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p style={{ color: 'white', fontSize: '14px', opacity: 0.9 }}>
                        © 2024 BikeZone. All rights reserved.
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default Login;