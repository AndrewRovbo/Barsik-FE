import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/signup-login.scss";
import { api } from "../services/api";

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
			const res = await api.post("/api/auth/register", payload);

			console.log('Registration response:', res.data);
			setSuccessMsg("User registered successfully. Please log in.");
			setTimeout(() => {
				navigate("/log-in");
			}, 1500);
		} catch (err) {
			console.error('Registration error:', err);
			
			if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
				setError("Connection error: Backend server is not running. Make sure the backend is started on port 8080.");
			} else if (err.response?.status === 400) {
				setError(err.response.data?.message || "Invalid input data. Please check your email and password.");
			} else if (err.response?.status === 409) {
				setError("Email already exists. Please use a different email.");
			} else if (err.response?.status === 500) {
				setError("Server error. Please try again later.");
			} else if (err.response?.data?.message) {
				setError(err.response.data.message);
			} else if (err.response?.data) {
				setError(typeof err.response.data === 'string' ? err.response.data : "Registration failed. Please try again.");
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
					{loading ? "REGISTERING..." : "REGISTER"}
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