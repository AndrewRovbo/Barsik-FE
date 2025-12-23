import { useEffect, useState, useContext } from "react";
import { getUsers, getUserChats } from "../../services/api";
import "../../styles/ChatPage.scss";
import { UserContext } from "../../UserContext"; // Подключаем контекст с текущим пользователем

const ChatList = ({ selectedChatId, onSelectChat, setChatPartner }) => {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useContext(UserContext); // Получаем текущего пользователя из контекста

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];

        // Фильтруем текущего пользователя
        const filteredUsers = data.filter(user => user.id !== currentUser.id);
        setUsers(filteredUsers);
      } catch (e) {
        console.error("Failed to fetch users:", e);
      }
    };

    fetchUsers();
  }, [currentUser]); // Делаем запрос пользователей, когда меняется currentUser

  const handleChatSelection = (userId) => {
    onSelectChat(userId);

    // Найдем собеседника по ID
    const chatPartner = users.find(user => user.id === userId);
    setChatPartner(chatPartner);
  };

  return (
    <div className="chat-list">
      <h2>Your chats</h2>
      <ul>
        <li
          key={0}
          onClick={() => handleChatSelection(0)}
          className={selectedChatId === 0 ? "active" : ""}
        >
          General Chat
        </li>

        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => handleChatSelection(user.id)}
            className={selectedChatId === user.id ? "active" : ""}
          >
            {user.firstName ?? user.name} — {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
