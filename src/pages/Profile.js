// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/*
  Profile (debug view)
  - Показывает данные, найденные в:
    1) location.state (если пришли сюда с navigate(..., { state }))
    2) localStorage.getItem('signupData')
    3) попытка GET на стандартные профили: /api/auth/me, /api/users/me, /api/profile, /api/me
  - НЕ включает CSS (как ты просил).
*/

const API_BASE = process.env.REACT_APP_API_BASE_URL || "/api";

function Profile() {
  const location = useLocation();
  const [dataSource, setDataSource] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Попытка получить данные при загрузке
  useEffect(() => {
    // 1) location.state
    if (location && location.state && Object.keys(location.state).length > 0) {
      setData(location.state);
      setDataSource("location.state");
      return;
    }

    // 2) localStorage
    try {
      const ls = localStorage.getItem("signupData");
      if (ls) {
        const parsed = JSON.parse(ls);
        setData(parsed);
        setDataSource("localStorage (signupData)");
        return;
      }
    } catch (e) {
      // ignore parse errors
      console.warn("profile: failed to parse signupData from localStorage", e);
    }

    // 3) попытка запросов к бэку (если доступен и аутентификация настроена)
    const tryFetchProfile = async () => {
      setLoading(true);
      setError(null);
      const candidates = [
        "/auth/me",
        "/users/me",
        "/profile",
        "/me",
        "/users/current", // на всякий случай
      ];

      for (const path of candidates) {
        try {
          const url = `${API_BASE}${path}`;
          // credentials: 'include' нужен если бэкенд кладёт httpOnly cookie (например JWT_TOKEN)
          const resp = await fetch(url, { method: "GET", credentials: "include" });
          if (resp.ok) {
            // пробуем распарсить json
            let body = null;
            try {
              body = await resp.json();
            } catch (e) {
              body = await resp.text();
            }
            setData(body);
            setDataSource(`GET ${url}`);
            setLoading(false);
            return;
          } else {
            // если 401/403/404 — пробуем следующий путь
            // читаем тело ошибки для диагностики, но не прерываем цикл
            try {
              const errText = await resp.text();
              console.debug(`profile: ${url} -> ${resp.status} ${errText}`);
            } catch {}
          }
        } catch (e) {
          // сервер может быть недоступен или CORS; просто логируем и пробуем дальше
          console.debug("profile: fetch error for", path, e);
        }
      }

      setError("Данные не найдены в location.state/localStorage и бэкенд не ответил (см. консоль).");
      setLoading(false);
    };

    tryFetchProfile();
  }, [location]);

  // Кнопка: удалить локально сохранённые данные
  const handleClearLocal = () => {
    localStorage.removeItem("signupData");
    setData(null);
    setDataSource("localStorage cleared");
    setError(null);
  };

  // Копирование в буфер обмена
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      alert("Данные скопированы в буфер обмена (формат JSON).");
    } catch (e) {
      alert("Не удалось скопировать: " + e);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Profile (debug view)</h2>

      <div>
        <strong>Источник данных:</strong> {dataSource || "— не определён —"}
      </div>

      {loading && <div>Загрузка с сервера...</div>}

      {error && (
        <div style={{ marginTop: 12, color: "crimson" }}>
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={handleCopy} disabled={!data}>
          Скопировать JSON в буфер
        </button>{" "}
        <button onClick={handleClearLocal}>Очистить signupData в localStorage</button>
      </div>

      <div style={{ marginTop: 16 }}>
        {!data && !loading && <div>Данных для отображения нет.</div>}

        {data && (
          <div>
            <h3>Данные (структура и значения)</h3>

            {/* Если это объект — выводим пару ключ:значение в читабельном виде */}
            {typeof data === "object" && !Array.isArray(data) ? (
              <table cellPadding="6" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Поле</th>
                    <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Значение</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data).map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ verticalAlign: "top", borderBottom: "1px solid #f0f0f0" }}>{k}</td>
                      <td style={{ verticalAlign: "top", borderBottom: "1px solid #f0f0f0" }}>
                        {typeof v === "object" ? (
                          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{JSON.stringify(v, null, 2)}</pre>
                        ) : (
                          String(v)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Если это массив или строка/число — просто показать JSON
              <pre style={{ background: "#f8f8f8", padding: 12 }}>{JSON.stringify(data, null, 2)}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
