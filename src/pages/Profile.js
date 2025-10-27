// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function PrettyJson({ data }) {
  if (data === null) return <em>null</em>;
  if (data === undefined) return <em>undefined</em>;
  return <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{JSON.stringify(data, null, 2)}</pre>;
}

export default function Profile() {
  const navigate = useNavigate();

  const [localUser, setLocalUser] = useState(null);
  const [cookieString, setCookieString] = useState("");
  const [profile, setProfile] = useState(null);
  const [profileMeta, setProfileMeta] = useState({ status: null, headers: null });
  const [allUsers, setAllUsers] = useState(null);
  const [allUsersMeta, setAllUsersMeta] = useState({ status: null, headers: null });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorProfile, setErrorProfile] = useState(null);
  const [errorUsers, setErrorUsers] = useState(null);

  useEffect(() => {
    // загрузка данных из localStorage и document.cookie при первом рендере
    try {
      const raw = localStorage.getItem("user");
      setLocalUser(raw ? JSON.parse(raw) : null);
    } catch (e) {
      setLocalUser(null);
    }
    setCookieString(document.cookie || "");
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // попытаться получить профиль по нескольким путям — взять первый удачный
  async function fetchProfile() {
    setLoadingProfile(true);
    setErrorProfile(null);
    setProfile(null);
    setProfileMeta({ status: null, headers: null });

    const endpoints = [
      "/api/auth/me",
      "/api/profile",
      "/api/users/me",
      "/api/user/me"
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" }
        });

        // сохраняем статус/заголовки для диагностики
        const headersObj = {};
        res.headers.forEach((v, k) => (headersObj[k] = v));

        if (res.ok) {
          // пытаемся распарсить JSON; если не JSON — сохранить текст
          let body;
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            body = await res.json();
          } else {
            body = await res.text();
          }

          setProfile(body);
          setProfileMeta({ status: res.status, headers: headersObj, url });
          setLoadingProfile(false);
          return;
        } else {
          // если 401/403 — вернуть явную ошибку
          const txt = await res.text().catch(() => null);
          // записываем информацию, но продолжаем пробовать другие endpoint'ы
          setProfileMeta({ status: res.status, headers: headersObj, url, body: txt });
        }
      } catch (e) {
        // сетевые ошибки — записываем и пробуем дальше
        setProfileMeta(prev => ({ ...prev, networkError: String(e) }));
      }
    }

    setErrorProfile("Profile endpoint not found or returned error. See meta for details.");
    setLoadingProfile(false);
  }

  // попытка получить список пользователей (если backend предоставляет /api/users)
  async function fetchAllUsers() {
    setLoadingUsers(true);
    setErrorUsers(null);
    setAllUsers(null);
    setAllUsersMeta({ status: null, headers: null });

    const url = "/api/users";
    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" }
      });

      const headersObj = {};
      res.headers.forEach((v, k) => (headersObj[k] = v));

      if (res.ok) {
        const contentType = res.headers.get("content-type") || "";
        const body = contentType.includes("application/json") ? await res.json() : await res.text();
        setAllUsers(body);
        setAllUsersMeta({ status: res.status, headers: headersObj, url });
      } else {
        const txt = await res.text().catch(() => null);
        setAllUsersMeta({ status: res.status, headers: headersObj, url, body: txt });
        setErrorUsers(`Request failed with status ${res.status}`);
      }
    } catch (e) {
      setErrorUsers(String(e));
      setAllUsersMeta(prev => ({ ...prev, networkError: String(e) }));
    } finally {
      setLoadingUsers(false);
    }
  }

  function refreshLocal() {
    try {
      const raw = localStorage.getItem("user");
      setLocalUser(raw ? JSON.parse(raw) : null);
    } catch (e) {
      setLocalUser(null);
    }
    setCookieString(document.cookie || "");
  }

  function clearLocalAuth() {
    localStorage.removeItem("user");
    refreshLocal();
  }

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto", fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Profile — debug view</h1>
        <div>
          <NavLink to="/" style={{ marginRight: 12 }}>Home</NavLink>
          <button onClick={() => navigate(-1)} style={{ marginRight: 8 }}>Back</button>
          <button onClick={() => { clearLocalAuth(); }}>Clear local auth</button>
        </div>
      </div>

      <section style={{ marginTop: 20 }}>
        <h2>Local storage & cookies</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <h3>localStorage.getItem("user")</h3>
            <PrettyJson data={localUser} />
            <button onClick={refreshLocal} style={{ marginTop: 8 }}>Refresh local</button>
          </div>
          <div style={{ flex: 1 }}>
            <h3>document.cookie</h3>
            <div style={{ wordBreak: "break-all" }}>{cookieString || <em>(empty)</em>}</div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
              Примечание: httpOnly-куки недоступны через `document.cookie`.
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>Profile endpoint</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 8 }}>
              <button onClick={fetchProfile} disabled={loadingProfile} style={{ marginRight: 8 }}>
                {loadingProfile ? "Loading…" : "Fetch profile (try endpoints)"}
              </button>
              <button onClick={() => { setProfile(null); setProfileMeta({ status: null, headers: null }); setErrorProfile(null); }}>
                Clear
              </button>
            </div>

            <div>
              <strong>Result:</strong>
              <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 8 }}>
                {loadingProfile ? <div>Loading…</div> : errorProfile ? <div style={{ color: "crimson" }}>{errorProfile}</div> : <PrettyJson data={profile} />}
              </div>
            </div>
          </div>

          <div style={{ width: 320 }}>
            <strong>Meta</strong>
            <div style={{ border: "1px solid #eee", padding: 10, marginTop: 8 }}>
              <div><b>Last status:</b> {profileMeta.status ?? "—"}</div>
              <div style={{ marginTop: 6 }}><b>URL used:</b> {profileMeta.url ?? "—"}</div>
              <div style={{ marginTop: 6 }}><b>Headers:</b><PrettyJson data={profileMeta.headers} /></div>
              {profileMeta.body && <div><b>Body (non-JSON):</b><PrettyJson data={profileMeta.body} /></div>}
              {profileMeta.networkError && <div style={{ color: "crimson" }}><b>Network error:</b> {profileMeta.networkError}</div>}
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>All users (diagnostic)</h2>
        <div style={{ marginBottom: 8 }}>
          <button onClick={fetchAllUsers} disabled={loadingUsers} style={{ marginRight: 8 }}>
            {loadingUsers ? "Loading…" : "Fetch /api/users"}
          </button>
          <button onClick={() => { setAllUsers(null); setAllUsersMeta({ status: null, headers: null }); setErrorUsers(null); }}>
            Clear
          </button>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ border: "1px solid #ddd", padding: 12 }}>
              {loadingUsers ? <div>Loading…</div> : errorUsers ? <div style={{ color: "crimson" }}>{errorUsers}</div> : <PrettyJson data={allUsers} />}
            </div>
          </div>

          <div style={{ width: 320 }}>
            <strong>Meta</strong>
            <div style={{ border: "1px solid #eee", padding: 10, marginTop: 8 }}>
              <div><b>Last status:</b> {allUsersMeta.status ?? "—"}</div>
              <div style={{ marginTop: 6 }}><b>URL:</b> {allUsersMeta.url ?? "/api/users"}</div>
              <div style={{ marginTop: 6 }}><b>Headers:</b><PrettyJson data={allUsersMeta.headers} /></div>
              {allUsersMeta.networkError && <div style={{ color: "crimson" }}><b>Network error:</b> {allUsersMeta.networkError}</div>}
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 30, marginBottom: 60 }}>
        <h2>Quick actions</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { localStorage.removeItem("user"); refreshLocal(); }} title="Remove local user">Remove local user</button>
          <button onClick={() => { /* placeholder for logout if backend supports */ alert("If backend supports logout, call /api/auth/logout here"); }}>
            Logout (placeholder)
          </button>
        </div>
      </section>
    </div>
  );
}
