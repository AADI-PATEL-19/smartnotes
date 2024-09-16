import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/', // Adjust according to your API base URL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // This ensures that cookies, such as CSRF tokens, are sent with requests
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];

        if (token) {
            config.headers['X-CSRFToken'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
