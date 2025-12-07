import axios from 'axios';

// ВАЖНО: используем полный URL для обхода CORS проблем
// В production это будет через прокси на одном домене с фронтенду
const isDevelopment = process.env.NODE_ENV === 'development';

// В development используем полный URL бэкенда
// В production используем относительный URL (будет проксирован через прокси на фронтенде)
const API_URL = isDevelopment 
	? 'http://localhost:8080' 
	: '';

// Логирование для отладки (только в development)
if (isDevelopment) {
	console.log('API Configuration:', {
		NODE_ENV: process.env.NODE_ENV,
		API_URL: API_URL || '(empty - using relative URLs)',
		FULL_API_URL: API_URL
	});
}

// Функция для получения JWT токена из cookies или localStorage
const getJwtToken = () => {
	// Сначала проверяем cookies
	const cookies = document.cookie.split(';');
	for (let cookie of cookies) {
		const [name, value] = cookie.trim().split('=');
		if (name === 'JWT_TOKEN') {
			return value;
		}
	}
	
	// Если не найдено в cookies, проверяем localStorage
	try {
		const userData = localStorage.getItem('user');
		if (userData) {
			const user = JSON.parse(userData);
			if (user.token || user.accessToken || user.jwt) {
				return user.token || user.accessToken || user.jwt;
			}
		}
	} catch (e) {
		// Игнорируем ошибки парсинга
	}
	
	return null;
};

export const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true, // Отправлять cookies
});

// Interceptor для добавления JWT токена в заголовок Authorization
api.interceptors.request.use(
	(config) => {
		const token = getJwtToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		} else {
			// Debug: log when token is not found for auth requests
			if (isDevelopment && config.url?.includes('/auth/')) {
				console.log('No JWT token found for request:', config.url);
				console.log('This is expected for login/signup requests');
			}
		}
		
		// Debug: log request details
		if (isDevelopment) {
			console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
				data: config.data,
				headers: config.headers
			});
		}
		
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Interceptor для обработки ответов
api.interceptors.response.use(
	(response) => {
		// Debug: log response
		if (isDevelopment) {
			console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
		}
		
		// Если это ответ на логин, проверяем Set-Cookie заголовки
		if (response.config.url?.includes('/auth/login') && response.headers['set-cookie']) {
			const setCookieHeaders = Array.isArray(response.headers['set-cookie']) 
				? response.headers['set-cookie'] 
				: [response.headers['set-cookie']];
			
			for (const cookieHeader of setCookieHeaders) {
				// Ищем JWT токен в Set-Cookie заголовках
				const jwtMatch = cookieHeader.match(/JWT_TOKEN=([^;]+)/);
				if (jwtMatch) {
					const token = jwtMatch[1];
					// Сохраняем токен в cookie, доступную для JavaScript
					const expires = new Date();
					expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 дней
					document.cookie = `JWT_TOKEN=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
					if (isDevelopment) {
						console.log('JWT token extracted from Set-Cookie header and stored');
					}
				}
			}
		}
		return response;
	},
	(error) => {
		if (isDevelopment) {
			console.error(`[API Error] ${error.response?.status || 'Network'} ${error.config?.url}`, {
				message: error.message,
				response: error.response?.data,
				status: error.response?.status
			});
		}
		
		if (error.response?.status === 401) {
			// JWT истек или невалиден
			console.error('Unauthorized: JWT token is missing or invalid');
			// Очищаем токен
			document.cookie = 'JWT_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			localStorage.removeItem('user');
		}
		return Promise.reject(error);
	}
);

export const getUsers = () => api.get('/api/users' ); 
export const createUser = (user) => api.post('/api/users', user);
export const updateUser = (id, userData) => api.put(`/api/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/api/users/${id}`);