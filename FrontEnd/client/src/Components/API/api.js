import axios from 'axios';

// Create an Axios instance with a base URL pointing to your Flask backend
const api = axios.create({
    baseURL: 'http://localhost:5000', // Replace with the actual base URL of your Flask backend
});

export default api;
