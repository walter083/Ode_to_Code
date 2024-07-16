import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import getCookie from './utils/getCookie';
import Graph from './Graph';
import ChatBot from './ChatBot';

const Home = () => {

    const navigate = useNavigate();    

    useEffect(() => {
        const user_id = getCookie('user_id');
        console.log("User id: ", user_id);

        if (!user_id) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <>
            <Graph/>
            <ChatBot/>
        </>
    );
}

export default Home;
