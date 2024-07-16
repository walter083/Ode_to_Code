import React from 'react';
import './Sidebar.css';
import TaskIcon from '@mui/icons-material/Task';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import UploadIcon from '@mui/icons-material/Upload';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isShow, navigate, removeCookie }) => { 
    const navigate1 = useNavigate();   
    return (
        <div className={`sidebar ${isShow ? 'show' : ''}`}>
            <ul className='sidebar-list'>
                <li onClick={() => {navigate1('/todo')}} ><TaskIcon/>Task Manager</li>
                <li onClick={() => {navigate1('/scheduleAppointment')}} ><CalendarMonthIcon />Appointment</li>
                <li onClick={() => {navigate1('/dataEntry')}}><UploadIcon />Data Entry</li>
                <li onClick={() => {navigate1('/viewData')}} ><MenuBookIcon />View Data</li>
            </ul>
            <ul>
                <li className='logout-list' onClick={() => { removeCookie('user_id'); navigate('/login') }}><LogoutIcon />Logout</li>
            </ul>
        </div>
    );
}

export default Sidebar;
