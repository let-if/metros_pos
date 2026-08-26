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
  let url = import.meta.env.VITE_API_URL;
  
  if (!url) {
    if (import.meta.env.PROD) {
      url = 'https://metros-pos.onrender.com';
    } else {
      url = 'http://localhost:5000';
    }
  }

  // Ensure it always ends with /api cleanly without duplicating
  return url.endsWith('/api') ? url : `${url.endsWith('/') ? url.slice(0, -1) : url}/api`;
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