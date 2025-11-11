import axios from 'axios';
import { SERVER_URL } from '../constants/constants.js';

const BASE_URL = SERVER_URL; 

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

api.interceptors.response.use(
    (response) => response,
    async error => {
        const original_request = error.config;

        if (error.response?.status === 401 && !original_request._retry) {
            original_request._retry = true;
            try {
                await refresh_token();
                return api(original_request);
            } catch (refreshError) {
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const send_chat_message = async (message) => {
    const response = await api.post('/chat/', { message });
    return response.data;
}

export const login_user = async (username, password) => {
    const response = await api.post('/token/', { username, password });
    return response.data;
}

const refresh_token = async () => {
    const response = await api.post('/token/refresh/');
    return response.data
}

export const register_user = async (username, password, email) => {
    const response = await api.post('/register/', { username, password, email });
    return response.data;
}

export const logout_user = async () => {
    const response = await api.post('/logout/');
    return response.data;
}


export const is_authenticated  = async () => {
    const response = await api.get('/is_authenticated/');
    return response.data;
}