import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    // Reads the URL from .env instead of hardcoding it
    // In production this will point to your deployed Railway/Render backend
});

export default api;