import React, { useState } from 'react';
import api from '../API/api';

import { useNavigate } from 'react-router-dom';
function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            
            const response = await api.post('/register', { username, password });
            console.log(response)
            if(response.status == 201)
            {
            console.log(response.data)  
            navigate("/login")
            }
            

            // Handle successful registration, e.g., show a success message or redirect
        } catch (error) {
            // Handle registration error, e.g., show an error message
        }
    };

    return (
        <div className='register-wrapper'>
            <div className='register-container'>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleRegister}>Register</button>
        </div>
        </div>
    );
}

export default Register;
