import React from 'react';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import InsuranceCard from './Components/Protected/InsuranceCard';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import "./App.css"
import GuestCard from './Components/GuestCard/GuestCard';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/InsuranceCard" element={<InsuranceCard />} />
                <Route path="/guest-cart" element={<GuestCard/>} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

function ProtectedRoute() {
    // Check if the user is authenticated (you can implement your authentication logic here)
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
        // Redirect to the login page if not authenticated
        return <Navigate to="/login" />;
    }

    // Render the protected component if authenticated
    return <Protected />;
}

export default App;
