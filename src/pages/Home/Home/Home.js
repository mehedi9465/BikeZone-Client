import React from 'react';
import HomeProducts from '../../Shared/Home Products/HomeProducts';
import About from '../About/About';
import Banner from '../Banner/Banner';
import Footer from '../Footer/Footer';
import Reviews from '../Reviews/Reviews/Reviews';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <HomeProducts></HomeProducts>
            <About></About>
            <Reviews></Reviews>
            <Footer></Footer>
        </div>
    );
};

export default Home;