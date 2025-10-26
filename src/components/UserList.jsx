import React, { useState, useEffect } from 'react';
import { getUsers, createUser } from '../services/api';

function normalizeUsers(payload) {
  // payload может быть:
  // - массив []
  // - объект с полем content: { content: [...] }
  // - объект с полем users: { users: [...] }
  // - единичный объект (пользователь)
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;      // axios-стиль, если передали whole response
  const maybe = payload.data ?? payload;                    // если передали response или прямой JSON
  if (Array.isArray(maybe)) return maybe;
  if (Array.isArray(maybe.content)) return maybe.content;   // Spring Data Page
  if (Array.isArray(maybe.users)) return maybe.users;       // custom wrapper
  // если это одиночный объект пользователя — вернуть массив из одного элемента
  return [maybe];
}

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      // Нормализуем и сохраняем
      const normalized = normalizeUsers(response);
      setUsers(normalized);
      // полезно видеть в консоли что именно пришло
      console.log('Normalized users:', normalized);
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    const newUser = { name: 'John', email: 'john@example.com' };
    try {
      const response = await createUser(newUser);
      // response может быть axios-ответом или json
      const newUserData = response?.data ?? response;
      setUsers(prev => [...prev, newUserData]);
    } catch (err) {
      console.error('Error creating user:', err);
      alert('Error creating user - check your console');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data. Check the console (F12).</div>;

  // безопасный рендер — если users не массив, покажем сообщение
  if (!Array.isArray(users) || users.length === 0) {
    return (
      <div>
        <h2>Users</h2>
        <button onClick={handleCreateUser}>Create user</button>
        <div>No users found.</div>
      </div>
    );
  }

  return (
    <div>
      <h2>Users</h2>
      <button onClick={handleCreateUser}>Create user</button>
      <ul>
        {users.map(user => (
          <li key={user.id ?? user.email ?? Math.random()}>
            {user.name} — {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
