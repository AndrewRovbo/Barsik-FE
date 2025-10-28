import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

export const getUsers = () => axios.get('/api/users'); 
export const createUser = (user) => axios.post('/api/users', user);
// export const getUsers = () => api.get('/api/users');
// export const createUser = (userData) => api.post('/api/users', userData);
export const updateUser = (id, userData) => api.put(`/api/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/api/users/${id}`);
