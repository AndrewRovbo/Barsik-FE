import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/signup-login.scss";

import back from "../img/icons/back.png";
import google from "../img/icons/google-logo.webp";

function SignUp() {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [role, setRole] = useState("OWNER");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [successMsg, setSuccessMsg] = useState(null);

	const validate = () => {
		if (!email) return "Email is required";
		const re = /\S+@\S+\.\S+/;
		if (!re.test(email)) return "Enter a valid email";
		if (password.length < 8) return "Password must be at least 8 characters";
		if (password !== confirm) return "Passwords do not match";
		return null;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccessMsg(null);

		const v = validate();
		if (v) {
			setError(v);
			return;
		}

		const payload = {
			email,
			password,
			role
		};

		setLoading(true);
		try {
			const base = process.env.REACT_APP_API_URL || "";
			const res = await fetch(`${base}/api/auth/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
				credentials: "include"
			});

			if (res.status === 201) {
				const text = await res.text();
				setSuccessMsg(text || "User registered successfully");

				const loginRes = await fetch(`${base}/api/auth/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
					credentials: "include"
				});

				if (loginRes.ok) {
					const body = await loginRes.json();
					localStorage.setItem("user", JSON.stringify({
						email: body.username,
						roles: body.roles
					}));

					navigate("/");
				} else {
					setError("Login failed after registration.");
				}

			} else {
				const errText = await res.text();
				setError(errText || `Registration failed (status ${res.status})`);
			}
		} catch (err) {
			setError("Connection error: could not reach server.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-wrap">
			<button className="btn-back" aria-label="Back">
				<NavLink to="/"><img src={back} alt="Back" /></NavLink>
			</button>

			<h1 className="signup-title">JOIN US!</h1>

			<form id="joinForm" noValidate onSubmit={handleSubmit}>
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

				<div className="field">
					<input
						type="password"
						name="confirm"
						placeholder="Confirm password"
						required
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
					/>
				</div>

				<div className="field">
					<label htmlFor="role">Role</label>
					<select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
						<option value="OWNER">OWNER</option>
						<option value="SITTER">SITTER</option>
					</select>
				</div>

				<button type="submit" className="btn-submit" disabled={loading}>
					{loading ? "Registering..." : "REGISTER"}
				</button>
			</form>

			<div className="divider">
				<hr/><div className="or">or</div><hr/>
			</div>

			<div className="google" onClick={() => alert("Google sign-in placeholder")}>
				<img src={google} alt="Google sign-in" />
			</div>

			<div className="signup-foot">Already have an account? <NavLink to="/log-in">Log in</NavLink></div>

			{error && <div className="error" role="alert">{error}</div>}
			{successMsg && <div className="success" role="status">{successMsg}</div>}
		</div>
	);
}

export default SignUp;
