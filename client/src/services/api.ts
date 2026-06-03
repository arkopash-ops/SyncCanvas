import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.response.use(
    (res) => res,
    (error => {
        const requestUrl = error.config?.url ?? '';
        const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

        if (error.response?.status === 401 && !isAuthRequest) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    })
);

export default api;
