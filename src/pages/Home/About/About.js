import React from 'react';
import { Container, Image } from 'react-bootstrap';

const About = () => {
    return (
        <>
            <h1 className='text-center display-4 mt-5'>About</h1>
            <Container className='mb-5 mt-4 py-5 bg-light' id='about'>
                <Image className='d-block mx-auto  py-5' src='https://i.ibb.co/VqjzQ3q/3815602.png' fluid width='256'/>
                <p className='lead w-75 text-center mx-auto mt-3'>Our mission is to reduce the positive cases of covid. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex culpa obcaecati autem itaque velit mollitia, magnam ipsum corporis vitae eos magni repudiandae molestias quis est doloremque tenetur a soluta totam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea earum est quasi doloremque iusto eum porro itaque quidem, saepe, ducimus, deleniti quam non harum accusantium sapiente odit iste labore voluptatum.</p>
            </Container>
        </>
    );
};

export default About;