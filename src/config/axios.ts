import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // In Supabase-first architecture, we primarily use the Supabase client.
    // This Axios instance is available for any external API calls if needed.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized — redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
