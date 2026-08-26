// // client/src/api/axiosConfig.js
// import axios from 'axios';

// export const apiClient = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Automatically inject JWT token from localStorage if available
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('meret_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
// client/src/api/axiosConfig.js
import axios from 'axios';

// Automatically use Render backend in production, or fallback to local if developing locally
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Fallback for production builds if env var is missing on Vercel
  if (import.meta.env.PROD) {
    return 'https://metros-pos.onrender.com/api';
  }
  // Default for local development
  return 'http://localhost:5000/api';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token from localStorage if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('meret_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);