import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/signup-login.scss";
import { api } from "../services/api";

import back from "../img/icons/back.png";

function LogIn() {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (!email || !password) {
			setError("Email and password are required.");
			return;
		}

		setLoading(true);

		try {
			const res = await api.post("/api/auth/login", { email, password });

			// Debug: log the response to see what we're getting
			console.log('Login response:', {
				data: res.data,
				headers: res.headers,
				status: res.status
			});

			// Store user info in localStorage (including token if present)
			const userData = {
				email: res.data.username,
				roles: res.data.roles
			};
			
			// Also store token in user data if present
			if (res.data.token || res.data.accessToken || res.data.jwt) {
				userData.token = res.data.token || res.data.accessToken || res.data.jwt;
			}
			
			localStorage.setItem("user", JSON.stringify(userData));

			// If the backend returns a token in the response body, store it in a cookie
			// This allows the api interceptor to add it to the Authorization header
			if (res.data.token || res.data.accessToken || res.data.jwt) {
				const token = res.data.token || res.data.accessToken || res.data.jwt;
				// Set cookie that can be read by JavaScript (non-httpOnly)
				// Expires in 7 days
				const expires = new Date();
				expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
				document.cookie = `JWT_TOKEN=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
				console.log('Token stored in cookie');
			} else {
				console.log('No token found in response body. Backend might be setting httpOnly cookie.');
			}

			navigate("/");
		} catch (err) {
			console.error(err);
			if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
				// Проверяем, не является ли это CORS ошибкой
				if (err.message?.includes('CORS') || err.message?.includes('Access-Control')) {
					setError("CORS error: Please check backend CORS configuration. Make sure the server is not sending duplicate Access-Control-Allow-Credentials headers.");
				} else {
					setError("Connection error: could not reach server. Please make sure the backend server is running on port 8080.");
				}
			} else if (err.response?.status === 401) {
				setError("Incorrect email or password. Please try again.");
			} else if (err.response?.data) {
				setError(err.response.data.message || err.response.data || `Login failed (status ${err.response.status})`);
			} else if (err.request) {
				setError("Connection error: could not reach server.");
			} else {
				setError("An unexpected error occurred. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-wrap">
			<button className="btn-back" aria-label="Back">
				<NavLink to="/"><img src={back} alt="Back" /></NavLink>
			</button>

			<h1 className="signup-title">WELCOME BACK</h1>

			<form id="loginForm" noValidate onSubmit={handleSubmit}>
				<div className="field">
					<input
						type="email"
						name="email"
						placeholder="Email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div className="field">
					<input
						type="password"
						name="password"
						placeholder="Password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<button type="submit" className="btn-submit" disabled={loading}>
					{loading ? "Signing in..." : "LOG IN"}
				</button>
			</form>

			<div className="signup-foot">No account yet? <NavLink to="/sign-up">Sign up</NavLink></div>

			{error && <div className="error" role="alert">{error}</div>}
		</div>
	);
}

export default LogIn;
