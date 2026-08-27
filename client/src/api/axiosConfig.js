
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://metros-pos.onrender.com/api',
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
// import axios from 'axios';

// export const apiClient = axios.create({
//   // 👇 CHANGE THIS LINE FOR LOCAL TESTING
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