import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/signup-login.scss";
import { api } from "../services/api";
import { setJwtToken, connectWebSocket } from '../services/websocketService';
import { UserContext } from "../UserContext";
import back from "../img/icons/back.png";

function LogIn() {
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
			setError("Email and password are required.");
			return;
		}

		setLoading(true);

		try {
			const res = await api.post("/api/auth/login", { email, password });

			// Debug: log the response
			console.log('Login response:', {
				data: res.data,
				status: res.status,
				statusText: res.statusText
			});

			// Store user info in localStorage
			// Support both 'username' and 'Username' field names from backend
			const userData = {
				email: res.data.username || res.data.Username || res.data.email || email,
				roles: res.data.roles || []
			};
			
			// Store token if present
			if (res.data.token || res.data.accessToken || res.data.jwt) {
				userData.token = res.data.token || res.data.accessToken || res.data.jwt;
			}
			
			localStorage.setItem("user", JSON.stringify(userData));
            saveUser(userData);
			// Store token in cookie if present in response body
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
				setError("Connection error: Backend server is not running. Make sure the backend is started on port 8080.");
			} else if (err.response?.status === 400) {
				setError(err.response.data?.message || "Invalid email or password format.");
			} else if (err.response?.status === 401) {
				setError("Incorrect email or password. Please try again.");
			} else if (err.response?.status === 500) {
				setError("Server error. Please try again later.");
			} else if (err.response?.data?.message) {
				setError(err.response.data.message);
			} else if (err.response?.data) {
				setError(typeof err.response.data === 'string' ? err.response.data : "Login failed. Please try again.");
			} else if (err.request) {
				setError("No response from server. Check if backend is running.");
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