import React, { useState } from 'react';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
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
        
        // Password validation
        if(registerData?.password !== registerData?.password2){
            swal({
                title: "Password Mismatch!",
                text: "Passwords do not match. Please try again.",
                icon: "error",
                button: "OK",
            });
            return;
        }

        // Password strength validation
        if(registerData?.password.length < 6){
            swal({
                title: "Weak Password!",
                text: "Password must be at least 6 characters long.",
                icon: "error",
                button: "OK",
            });
            return;
        }

        // Call registerUser with history parameter
        registerUser(
            registerData?.displayName, 
            registerData?.email.toLowerCase(), 
            registerData?.password,
            history
        );
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
                            Create Account
                        </h2>
                        <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>
                            Join BikeZone today
                        </p>
                    </div>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Spinner animation="border" style={{ color: '#667eea' }} />
                            <p style={{ marginTop: '15px', color: '#6c757d' }}>Creating your account...</p>
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
                                    ✓ Successfully registered!
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

                            {/* Register Form */}
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={labelStyle}>Full Name</label>
                                    <input
                                        required
                                        placeholder='Enter your full name'
                                        type="text"
                                        name='displayName'
                                        onBlur={handleOnBlur}
                                        style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                        onBlurCapture={(e) => e.target.style.borderColor = '#dee2e6'}
                                    />
                                </div>

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
                                        placeholder='Enter your password (min 6 characters)'
                                        type="password"
                                        name='password'
                                        onBlur={handleOnBlur}
                                        style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                        onBlurCapture={(e) => e.target.style.borderColor = '#dee2e6'}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={labelStyle}>Confirm Password</label>
                                    <input
                                        required
                                        placeholder='Re-enter your password'
                                        type="password"
                                        name='password2'
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
                                    Create Account
                                </Button>
                            </form>

                            {/* Sign In Link */}
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>
                                    Already have an account?{' '}
                                    <Link 
                                        to="/login"
                                        style={{ 
                                            color: '#667eea', 
                                            fontWeight: '600',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            </div>

                            {/* Terms */}
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <p style={{ color: '#adb5bd', fontSize: '12px', margin: 0 }}>
                                    By signing up, you agree to our Terms of Service and Privacy Policy
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

export default Register;