import React, { useState } from 'react';
import './Login.css';
import { auth, db } from './firebase';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import setCookie from './utils/setCookie';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();
    const signInUSer = async() => {
        if(password == null || email == null) {
            console.error("Invalid credentials");
            return ;
        }

        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            const user = response.user;
            const collectionRef = collection(db, 'Employee-Details');
            const q = query(collectionRef, where('Mail_ID', '==', user.email));
            
            const snapshot = await getDocs(q);
            if(!snapshot.empty) {
                const docSnapshot = snapshot.docs[0];
                const docId = docSnapshot.id;
                console.log("Doc id: ", docId);
                setCookie('user_id', docId);
            }
            else {
                console.log("No matching document found");
            }
            
            if(response != null) {
                navigate('/');
            }
        } catch (error) {
            console.error("Error logging in: ", error);
        }
    }

    const signInWithGoogle = async() => {
        try {
            const response = await signInWithPopup(auth, provider);
            const user = response.user;  
            const collectionRef = collection(db, 'Employee-Details');
            const q = query(collectionRef, where('Mail_ID', '==', user.email));
            
            const snapshot = await getDocs(q);
            if(!snapshot.empty) {
                const docSnapshot = snapshot.docs[0];
                const docId = docSnapshot.id;
                console.log("Doc id: ", docId);
                setCookie('user_id', docId);
            }
            else {
                console.log("No matching document found");
            }
            
            if(response != null) {
                navigate('/');
            }
        } catch (error) {
            console.error("Error loggin in: ", error);
        }              
    }

    return (
        <div className='login-body'>
            <div className='login-form'>
                <h1>Login</h1>
                <input type='email' value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder='Email' required />
                <input type='password' value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder='Password' required/>
                <button onClick={signInUSer}>Login</button>
                <button onClick={signInWithGoogle}>Continue with google</button>
            </div>            
        </div>
    );
}

export default Login;
