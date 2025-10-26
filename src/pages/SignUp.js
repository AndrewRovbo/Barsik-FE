import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/signup-login.scss";

import back from "../img/icons/back.png";
import google from "../img/icons/google-logo.webp";

function SignUp() {
  const navigate = useNavigate();

  // контролируемые поля
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("OWNER"); // новое поле для роли (по умолчанию "OWNER")

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !password || password !== confirm) {
      setError("Проверьте поля: email и пароли.");
      return;
    }

    const payload = {
      email,
      password,
      role // добавляем роль
    };

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 201 || res.ok) {
        const text = await res.text();
        setSuccessMsg(text || "Пользователь успешно зарегистрирован.");
        setTimeout(() => navigate("/profile"), 800);
      } else {
        const errText = await res.text();
        setError(`Ошибка регистрации: ${errText}`);
      }
    } catch (err) {
      console.error("register failed", err);
      setError("Не удалось подключиться к серверу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrap">
      <button className="btn-back">
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

        {/* Роль пользователя */}
        <div className="field">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="OWNER">OWNER</option>
            <option value="SITTER">SITTER</option>
          </select>
        </div>

        <button type="submit" className="btn-register" disabled={loading}>
          {loading ? "Registering..." : "REGISTER"}
        </button>
      </form>

      <div className="divider">
        <hr/><div className="or">or</div><hr/>
      </div>

      <div className="google" onClick={() => alert("Google sign-in placeholder")}>
        <img src={google} alt="Google sign-in"/>
      </div>

      <div className="signup-foot">Already have an account? <NavLink to="/log-in">Log in</NavLink></div>

      {/* Ошибки и успешные сообщения */}
      {error && <div className="error">{error}</div>}
      {successMsg && <div className="success">{successMsg}</div>}
    </div>
  );
}

export default SignUp;
