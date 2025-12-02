import axios from 'axios';

// В development используем прокси (настроен в package.json и setupProxy.js), чтобы избежать CORS
// В production используем полный URL из переменной окружения
// Важно: в development baseURL должен быть пустым или относительным, чтобы работал прокси
const isDevelopment = process.env.NODE_ENV === 'development';

// Принудительно используем пустой baseURL в development, чтобы прокси работал
// Если REACT_APP_API_URL установлена, она будет использована (но это отключит прокси)
// ВАЖНО: В development всегда используем пустой baseURL для работы прокси
const API_URL = isDevelopment 
	? '' 
	: (process.env.REACT_APP_API_URL || 'http://localhost:8080');

// Логирование для отладки (только в development)
if (isDevelopment) {
	console.log('API Configuration:', {
		NODE_ENV: process.env.NODE_ENV,
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		API_URL: API_URL || '(empty - using proxy)',
		'Using proxy': !API_URL || API_URL === ''
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
	// В development используем прокси, поэтому не указываем полный URL
	// Proxy настроен в package.json и будет перенаправлять запросы на backend
});

// Interceptor для добавления JWT токена в заголовок Authorization
api.interceptors.request.use(
	(config) => {
		const token = getJwtToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		} else {
			// Debug: log when token is not found
			if (isDevelopment && config.url?.includes('/auth/')) {
				console.log('No JWT token found in cookies for request:', config.url);
				console.log('Available cookies:', document.cookie);
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Interceptor для обработки ответов - извлекаем токен из Set-Cookie заголовка
api.interceptors.response.use(
	(response) => {
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
		if (error.response?.status === 401) {
			// Если токен истек или невалиден, можно перенаправить на страницу входа
			console.error('Unauthorized: JWT token is missing or invalid');
			console.error('Request URL:', error.config?.url);
			console.error('Available cookies:', document.cookie);
			// Можно добавить логику перенаправления:
			// if (window.location.pathname !== '/log-in') {
			//   window.location.href = '/log-in';
			// }
		}
		return Promise.reject(error);
	}
);

export const getUsers = () => api.get('/api/users'); 
export const createUser = (user) => api.post('/api/users', user);
export const updateUser = (id, userData) => api.put(`/api/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/api/users/${id}`);
