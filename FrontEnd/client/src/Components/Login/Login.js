import React, { useState } from 'react';
import api from '../API/api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await api.post('/login', { username, password });
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            // Handle successful login, e.g., show a success message or redirect
        } catch (error) {
            // Handle login error, e.g., show an error message
        }
    };

    return (
        <div>
            <h2>Login</h2>
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
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
