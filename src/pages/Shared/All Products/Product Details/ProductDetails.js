import axios from 'axios';
import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Container, Row, Col, Button, Spinner, Alert, Image, Badge, Card } from 'react-bootstrap';
import { useParams } from 'react-router';
import { Canvas, useThree } from '@react-three/fiber'; 
import * as THREE from 'three';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera, Center } from '@react-three/drei'; 
import PlaceOrderModal from '../../../Place Order/PlaceOrderModal';

// FitCameraToModel Component (unchanged)
const FitCameraToModel = ({ children }) => {
    const { camera, controls } = useThree();
    const groupRef = useRef();

    useEffect(() => {
        if (groupRef.current && controls) {
            const box = new THREE.Box3().setFromObject(groupRef.current);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 1.5; 

            camera.position.copy(center);
            camera.position.z += cameraZ;
            camera.position.y += size.y / 2;
            
            controls.target.copy(center);
            controls.target.y = center.y; 
            controls.maxDistance = cameraZ * 3;
            controls.minDistance = cameraZ / 5;

            camera.updateProjectionMatrix();
            controls.update();
        }
    }, [controls, camera, children]); 

    return <group ref={groupRef}>{children}</group>;
};

// BikeModel Component (unchanged)
const BikeModel = ({ modelUrl }) => {
    const gltf = useGLTF(modelUrl);
    return (
        <Center disablePointers> 
            <primitive object={gltf.scene} scale={1} />
        </Center>
    );
};

// ImageViewer Component (unchanged)
const ImageViewer = ({ imageUrl, rotation, isRotating, handlers }) => {
    return (
        <div 
            {...handlers}
            style={{
                position: 'relative',
                height: '500px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isRotating ? 'grabbing' : 'grab',
                overflow: 'hidden',
                userSelect: 'none',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}
        >
            <Image 
                src={imageUrl} 
                alt="Product"
                fluid
                draggable={false}
                style={{
                    maxWidth: '90%',
                    maxHeight: '90%',
                    objectFit: 'contain',
                    transform: `perspective(1000px) rotateY(${rotation}deg)`,
                    transition: isRotating ? 'none' : 'transform 0.1s ease-out',
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))',
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}
            />
            
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#667eea',
                padding: '10px 20px',
                borderRadius: '30px',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                {Math.round(rotation)}°
            </div>

            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#495057',
                padding: '12px 25px',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: '500',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                🖱️ Drag to rotate • 🔄 Auto-rotating
            </div>
        </div>
    );
};

// Model3DViewer Component (unchanged)
const Model3DViewer = React.forwardRef(({ modelUrl, onError }, ref) => {
    return (
        <div style={{ 
            height: '500px', 
            borderRadius: '20px', 
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}>
            <Canvas shadows onError={onError}> 
                <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={50} /> 
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
                <pointLight position={[-10, 5, 10]} intensity={0.5} />
                <Environment preset="city" />
                
                <OrbitControls 
                    makeDefault
                    enableZoom={true}
                    enablePan={false}
                    autoRotate={true}
                    autoRotateSpeed={2}
                />

                <Suspense fallback={<group />}>
                    <FitCameraToModel>
                        <BikeModel modelUrl={modelUrl} /> 
                    </FitCameraToModel>
                </Suspense>
            </Canvas>
            
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#495057',
                padding: '12px 25px',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: '500',
                pointerEvents: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                🖱️ Drag to rotate • Scroll to zoom • 🔄 Auto-rotating
            </div>
        </div>
    );
});

// Error Boundary (unchanged)
const ErrorBoundary = ({ children, fallback, onError }) => {
    const [hasError, setHasError] = useState(false);
    
    useEffect(() => {
        const handleError = (error) => {
            console.error("Caught a rendering error:", error);
            setHasError(true);
            if (onError) onError();
        };
        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, [onError]);
    
    if (hasError) return fallback;
    return children;
};

const ProductDetails = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { productId } = useParams();
    const [modalShow, setModalShow] = useState(false);
    const [modelLoadError, setModelLoadError] = useState(false); 
    const [rotation, setRotation] = useState(0);
    const [isRotating, setIsRotating] = useState(false);
    const autoRotateRef = useRef(null);
    const touchStartX = useRef(0);

    useEffect(() => {
        setLoading(true);
        axios.get(`https://bikezone-server.onrender.com/products/${productId}`)
            .then(({ data }) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error loading product:', err);
                setError(err.message);
                setLoading(false);
            });
    }, [productId]);

    useEffect(() => {
        if (product && !product.model3d || modelLoadError && !isRotating) { 
            autoRotateRef.current = setInterval(() => {
                setRotation(prev => (prev + 0.5) % 360);
            }, 16);
        }
        return () => {
            if (autoRotateRef.current) clearInterval(autoRotateRef.current);
        };
    }, [product, isRotating, modelLoadError]);

    const handleMouseDown = () => {
        setIsRotating(true);
        if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };

    const handleMouseUp = () => setIsRotating(false);

    const handleMouseMove = (e) => {
        if (isRotating) {
            setRotation(prev => (prev + e.movementX * 0.5) % 360);
        }
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };

    const handleTouchMove = (e) => {
        const deltaX = e.touches[0].clientX - touchStartX.current;
        setRotation(prev => (prev + deltaX * 0.3) % 360);
        touchStartX.current = e.touches[0].clientX;
    };

    const imageHandlers = {
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseUp,
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove
    };

    if (loading) {
        return (
            <Container className='py-5 text-center' style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                    <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
                    <p className='mt-4' style={{ fontSize: '18px', color: '#6c757d' }}>Loading product details...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className='py-5'>
                <Alert variant="danger" style={{ borderRadius: '16px', padding: '30px', textAlign: 'center' }}>
                    <Alert.Heading style={{ fontSize: '28px' }}>😕 Error</Alert.Heading>
                    <p style={{ fontSize: '16px' }}>{error}</p>
                    <Button variant="outline-danger" onClick={() => window.history.back()} style={{ borderRadius: '50px', padding: '10px 30px' }}>
                        Go Back
                    </Button>
                </Alert>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container className='py-5'>
                <Alert variant="warning" style={{ borderRadius: '16px', padding: '30px', textAlign: 'center' }}>
                    <Alert.Heading style={{ fontSize: '28px' }}>⚠️ Product Not Found</Alert.Heading>
                    <Button variant="outline-warning" onClick={() => window.history.back()} style={{ borderRadius: '50px', padding: '10px 30px' }}>
                        Go Back
                    </Button>
                </Alert>
            </Container>
        );
    }
    
    const has3DModel = product.model3d && !modelLoadError;

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '50px', paddingBottom: '50px' }}>
            <Container>
                {/* Breadcrumb */}
                <div style={{ marginBottom: '30px' }}>
                    <span style={{ color: '#6c757d', fontSize: '14px' }}>
                        Home / Products / <span style={{ color: '#667eea', fontWeight: '600' }}>{product?.title}</span>
                    </span>
                </div>

                <Row className='g-5'>
                    {/* 3D Viewer Column */}
                    <Col lg={6}>
                        <div style={{ position: 'sticky', top: '100px' }}>
                            {has3DModel ? (
                                <ErrorBoundary
                                    fallback={
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '500px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px' }}>
                                            <Alert variant="warning" className='w-75 text-center m-0'>
                                                3D Model Failed to Load. Showing 2D view.
                                            </Alert>
                                        </div>
                                    }
                                    onError={() => setModelLoadError(true)}
                                >
                                    <Suspense fallback={
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '500px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px' }}>
                                            <Spinner animation="border" variant="light" />
                                            <span className="ms-3 text-white">Loading 3D model...</span>
                                        </div>
                                    }>
                                        <Model3DViewer modelUrl={product.model3d} />
                                    </Suspense>
                                </ErrorBoundary>
                            ) : (
                                <>
                                    <ImageViewer 
                                        imageUrl={product?.img}
                                        rotation={rotation}
                                        isRotating={isRotating}
                                        handlers={imageHandlers}
                                    />
                                    
                                    {/* Rotation Controls */}
                                    <div className="d-flex gap-2 mt-3 justify-content-center flex-wrap">
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm"
                                            onClick={() => setRotation(prev => (prev - 45) % 360)}
                                            style={{ borderRadius: '50px', fontWeight: '500' }}
                                        >
                                            ← Left
                                        </Button>
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm"
                                            onClick={() => setRotation(0)}
                                            style={{ borderRadius: '50px', fontWeight: '500' }}
                                        >
                                            Front
                                        </Button>
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm"
                                            onClick={() => setRotation(90)}
                                            style={{ borderRadius: '50px', fontWeight: '500' }}
                                        >
                                            Side
                                        </Button>
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm"
                                            onClick={() => setRotation(180)}
                                            style={{ borderRadius: '50px', fontWeight: '500' }}
                                        >
                                            Back
                                        </Button>
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm"
                                            onClick={() => setRotation(prev => (prev + 45) % 360)}
                                            style={{ borderRadius: '50px', fontWeight: '500' }}
                                        >
                                            Right →
                                        </Button>
                                    </div>
                                </>
                            )}

                            {/* Model Type Badge */}
                            <div className="mt-3 text-center">
                                <Badge 
                                    bg={has3DModel ? 'success' : 'secondary'}
                                    style={{ 
                                        padding: '10px 20px', 
                                        fontSize: '14px', 
                                        borderRadius: '50px',
                                        fontWeight: '500'
                                    }}
                                >
                                    {has3DModel ? '✨ Interactive 3D Model' : '📷 Image View'}
                                </Badge>
                            </div>
                        </div>
                    </Col>

                    {/* Product Details Column */}
                    <Col lg={6}>
                        {/* Header Card */}
                        <Card style={{ 
                            border: 'none', 
                            borderRadius: '20px', 
                            marginBottom: '25px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                        }}>
                            <Card.Body style={{ padding: '35px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <Badge bg="primary" style={{ 
                                        padding: '8px 16px', 
                                        fontSize: '12px', 
                                        borderRadius: '50px',
                                        fontWeight: '600',
                                        marginBottom: '15px'
                                    }}>
                                        PREMIUM BIKE
                                    </Badge>
                                </div>
                                
                                <h1 style={{ 
                                    fontSize: '36px', 
                                    fontWeight: '800', 
                                    color: '#2c3e50',
                                    marginBottom: '20px',
                                    lineHeight: '1.2'
                                }}>
                                    {product?.title}
                                </h1>

                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '15px',
                                    marginBottom: '25px'
                                }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        padding: '15px 30px',
                                        borderRadius: '15px'
                                    }}>
                                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500' }}>
                                            Price
                                        </div>
                                        <div style={{ color: 'white', fontSize: '32px', fontWeight: '800' }}>
                                            ৳{product?.price?.toLocaleString()}
                                        </div>
                                    </div>
                                    
                                    {product?.inStock !== false && (
                                        <Badge bg="success" style={{ 
                                            padding: '12px 20px', 
                                            fontSize: '14px', 
                                            borderRadius: '12px',
                                            fontWeight: '600'
                                        }}>
                                            ✓ In Stock
                                        </Badge>
                                    )}
                                </div>

                                <Button 
                                    onClick={() => setModalShow(true)} 
                                    size='lg'
                                    style={{
                                        width: '100%',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '15px',
                                        padding: '18px',
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                                    }}
                                >
                                    🛒 Place Order Now
                                </Button>
                            </Card.Body>
                        </Card>

                        {/* Specifications Card */}
                        <Card style={{ 
                            border: 'none', 
                            borderRadius: '20px', 
                            marginBottom: '25px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                        }}>
                            <Card.Body style={{ padding: '35px' }}>
                                <h4 style={{ 
                                    fontSize: '24px', 
                                    fontWeight: '700', 
                                    color: '#2c3e50',
                                    marginBottom: '25px'
                                }}>
                                    📋 Specifications
                                </h4>

                                <Row className='g-3'>
                                    <Col xs={6}>
                                        <div style={{ 
                                            background: '#f8f9fa', 
                                            padding: '20px', 
                                            borderRadius: '12px' 
                                        }}>
                                            <div style={{ color: '#6c757d', fontSize: '13px', fontWeight: '500', marginBottom: '5px' }}>
                                                Displacement
                                            </div>
                                            <div style={{ color: '#2c3e50', fontSize: '16px', fontWeight: '700' }}>
                                                {product?.displacement}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <div style={{ 
                                            background: '#f8f9fa', 
                                            padding: '20px', 
                                            borderRadius: '12px' 
                                        }}>
                                            <div style={{ color: '#6c757d', fontSize: '13px', fontWeight: '500', marginBottom: '5px' }}>
                                                Cylinders
                                            </div>
                                            <div style={{ color: '#2c3e50', fontSize: '16px', fontWeight: '700' }}>
                                                {product?.cylinders}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <div style={{ 
                                            background: '#f8f9fa', 
                                            padding: '20px', 
                                            borderRadius: '12px' 
                                        }}>
                                            <div style={{ color: '#6c757d', fontSize: '13px', fontWeight: '500', marginBottom: '5px' }}>
                                                Emission
                                            </div>
                                            <div style={{ color: '#2c3e50', fontSize: '16px', fontWeight: '700' }}>
                                                {product?.emission}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <div style={{ 
                                            background: '#f8f9fa', 
                                            padding: '20px', 
                                            borderRadius: '12px' 
                                        }}>
                                            <div style={{ color: '#6c757d', fontSize: '13px', fontWeight: '500', marginBottom: '5px' }}>
                                                Gear
                                            </div>
                                            <div style={{ color: '#2c3e50', fontSize: '16px', fontWeight: '700' }}>
                                                {product?.gear} Speed
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <div style={{ 
                                            background: '#f8f9fa', 
                                            padding: '20px', 
                                            borderRadius: '12px' 
                                        }}>
                                            <div style={{ color: '#6c757d', fontSize: '13px', fontWeight: '500', marginBottom: '5px' }}>
                                                Fuel Capacity
                                            </div>
                                            <div style={{ color: '#2c3e50', fontSize: '16px', fontWeight: '700' }}>
                                                {product?.fuel_capacity}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <div style={{ 
                                            background: '#f8f9fa', 
                                            padding: '20px', 
                                            borderRadius: '12px' 
                                        }}>
                                            <div style={{ color: '#6c757d', fontSize: '13px', fontWeight: '500', marginBottom: '5px' }}>
                                                Mileage
                                            </div>
                                            <div style={{ color: '#2c3e50', fontSize: '16px', fontWeight: '700' }}>
                                                {product?.milage} KMPL
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Performance Card */}
                        <Card style={{ 
                            border: 'none', 
                            borderRadius: '20px', 
                            marginBottom: '25px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white'
                        }}>
                            <Card.Body style={{ padding: '35px' }}>
                                <h4 style={{ 
                                    fontSize: '24px', 
                                    fontWeight: '700', 
                                    marginBottom: '25px'
                                }}>
                                    ⚡ Performance
                                </h4>

                                <Row className='g-3'>
                                    <Col xs={6}>
                                        <div style={{ 
                                            background: 'rgba(255,255,255,0.15)', 
                                            padding: '20px', 
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(10px)'
                                        }}>
                                            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '500', marginBottom: '5px' }}>
                                                Max Power
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: '700' }}>
                                                {product?.max_power}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <div style={{ 
                                            background: 'rgba(255,255,255,0.15)', 
                                            padding: '20px', 
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(10px)'
                                        }}>
                                            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '500', marginBottom: '5px' }}>
                                                Max Torque
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: '700' }}>
                                                {product?.max_torque}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Description Card */}
                        {product?.description && (
                            <Card style={{ 
                                border: 'none', 
                                borderRadius: '20px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                            }}>
                                <Card.Body style={{ padding: '35px' }}>
                                    <h4 style={{ 
                                        fontSize: '24px', 
                                        fontWeight: '700', 
                                        color: '#2c3e50',
                                        marginBottom: '20px'
                                    }}>
                                        📖 About This Bike
                                    </h4>
                                    <p style={{ 
                                        fontSize: '16px', 
                                        lineHeight: '1.8', 
                                        color: '#6c757d',
                                        margin: '0'
                                    }}>
                                        {product?.description}
                                    </p>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>

                {/* Place Order Modal */}
                <PlaceOrderModal
                    show={modalShow}
                    bikemodel={product?.title}
                    bikeprice={product?.price}
                    onHide={() => setModalShow(false)}
                />
            </Container>
        </div>
    );
};

export default ProductDetails;