import React, { useState } from 'react';
import './Navbar.css'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const [imageUrl, setImageUrl] = useState('https://i.pinimg.com/474x/81/8a/1b/818a1b89a57c2ee0fb7619b95e11aebd.jpg');
    const navigate = useNavigate();

    return (
        <div className='navbar'>            
            <nav>
                <ul className='navbar-list'>
                    <li onClick={() => {navigate('/')}}>Home</li>
                    <li onClick={null}>About Us</li>
                    <li onClick={() => {navigate('/scheduleAppointment')}}>Appointment</li>
                    <li onClick={() => {navigate('/dataEntry')}}>Data Entry</li>
                    <li onClick={null}><img src={imageUrl} alt='Profile Image'/></li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;
