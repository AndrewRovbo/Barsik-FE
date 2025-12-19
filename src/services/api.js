import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const API_URL = isDevelopment ? 'http://localhost:8080' : '';

if (isDevelopment) {
  console.log('API Configuration:', {
    NODE_ENV: process.env.NODE_ENV,
    API_URL: API_URL || '(empty - using relative URLs)',
  });
}

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // важно для HttpOnly cookie
});

// Логирование запросов и ответов в dev
api.interceptors.request.use(config => {
  if (isDevelopment) {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      data: config.data,
      headers: config.headers,
    });
  }
  return config;
});

api.interceptors.response.use(
  response => {
    if (isDevelopment) {
      console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  error => {
    if (isDevelopment) {
      console.error(`[API Error] ${error.response?.status || 'Network'} ${error.config?.url}`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }

    // При 401 удаляем локальные данные (не токен, он HttpOnly)
    if (error.response?.status === 401) {
      console.error('Unauthorized: JWT token is missing or invalid');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const getUsers = () => api.get('/api/users', { withCredentials: true });
export const createUser = (user) => api.post('/api/users', user, { withCredentials: true });
export const updateUser = (id, userData) =>
  api.put(`/api/users/${id}`, userData, { withCredentials: true });
export const deleteUser = (id) =>
  api.delete(`/api/users/${id}`, { withCredentials: true });

export const getChatMessages = (chatId, page = 0, size = 20) =>
  api.get(`/api/chats/${chatId}/messages?page=${page}&size=${size}`, {
    withCredentials: true,
  });

export const sendMessage = (message) =>
  api.post('/api/chats/send', message, { withCredentials: true });