import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/signup-login.scss";

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
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
				// важно: просить браузер принять куку от сервера
				credentials: "include"
			});

			if (res.ok) {
				// сервер возвращает LogInResponse { username, roles }
				const body = await res.json();
				// сохраняем краткую информацию о пользователе (токен в httpOnly-cookie)
				localStorage.setItem("user", JSON.stringify({
					email: body.username,
					roles: body.roles
				}));
				// направляем на профиль
				navigate("/profile");
			} else {
				// читаем текст ошибки (бэкенд может возвращать текст)
				const txt = await res.text();
				setError(txt || `Login failed (status ${res.status})`);
			}
		} catch (err) {
			console.error(err);
			setError("Connection error: could not reach server.");
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
