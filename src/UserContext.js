import React, { createContext, useState, useEffect } from "react";

// Создаём Context
export const UserContext = createContext();

// Провайдер, который будет оборачивать всё приложение
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // При загрузке приложения читаем localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Сохраняем user и в state, и в localStorage
  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, saveUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
