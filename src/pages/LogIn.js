import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/signup-login.scss";
import { api } from "../services/api";
import { setJwtToken, connectWebSocket } from '../services/websocketService';
import { UserContext } from "../UserContext";
import back from "../img/icons/back.png";
import { useTranslation } from 'react-i18next';

function LogIn() {
	const { t } = useTranslation();
	const navigate = useNavigate();
const { saveUser } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (!email || !password) {
			setError(t('login.errors.required', 'Email and password are required.'));
			return;
		}

		setLoading(true);

		try {
			const res = await api.post("/api/auth/login", { email, password });

			console.log('Login response:', {
				data: res.data,
				status: res.status,
				statusText: res.statusText
			});

			const userData = {
				email: res.data.username || res.data.Username || res.data.email || email,
				roles: res.data.roles || []
			};
			
			if (res.data.token || res.data.accessToken || res.data.jwt) {
				userData.token = res.data.token || res.data.accessToken || res.data.jwt;
			}
			
			localStorage.setItem("user", JSON.stringify(userData));
            saveUser(userData);
			if (res.data.token || res.data.accessToken || res.data.jwt) {
				const token = res.data.token || res.data.accessToken || res.data.jwt;
				const expires = new Date();
				expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
				setJwtToken(token);
				
				document.cookie = `JWT_TOKEN=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
				connectWebSocket((message) => {
					console.log("New message:", message);
				});
				console.log('Token stored in cookie');
			}

			navigate("/");
		} catch (err) {
			console.error('Login error:', err);
			
			if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
				setError(t('login.errors.connection', 'Connection error: Backend server is not running. Make sure the backend is started on port 8080.'));
			} else if (err.response?.status === 400) {
				setError(err.response.data?.message || t('login.errors.invalid_format', 'Invalid email or password format.'));
			} else if (err.response?.status === 401) {
				setError(t('login.errors.invalid_credentials', 'Incorrect email or password. Please try again.'));
			} else if (err.response?.status === 500) {
				setError(t('login.errors.server', 'Server error. Please try again later.'));
			} else if (err.response?.data?.message) {
				setError(err.response.data.message);
			} else if (err.response?.data) {
				setError(typeof err.response.data === 'string' ? err.response.data : t('login.errors.failed', 'Login failed. Please try again.'));
			} else if (err.request) {
				setError(t('login.errors.no_response', 'No response from server. Check if backend is running.'));
			} else {
				setError(t('login.errors.unexpected', 'An unexpected error occurred. Please try again.'));
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-wrap">
			<button className="btn-back" aria-label={t('auth.back','Back')}>
				<NavLink to="/"><img src={back} alt={t('auth.back','Back')} /></NavLink>
			</button>

			<h1 className="signup-title">{t('login.title','WELCOME BACK')}</h1>

			<form id="loginForm" noValidate onSubmit={handleSubmit}>
				<div className="field">
					<input
						type="email"
						name="email"
						placeholder={t('login.email_placeholder','Email')}
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div className="field">
					<input
						type="password"
						name="password"
						placeholder={t('login.password_placeholder','Password')}
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<button type="submit" className="btn-submit" disabled={loading}>
					{loading ? t('login.signing_in','Signing in...') : t('login.log_in','LOG IN')}
				</button>
			</form>

				<div className="signup-foot">{t('login.no_account','No account yet?')} <NavLink to="/sign-up">{t('login.sign_up','Sign up')}</NavLink></div>

			{error && <div className="error" role="alert">{error}</div>}
		</div>
	);
}

export default LogIn;