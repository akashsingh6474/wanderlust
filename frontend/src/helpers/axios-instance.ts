import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_PATH || 'http://localhost:5050';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Ensure cookies are sent
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
