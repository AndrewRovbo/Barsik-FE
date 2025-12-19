import { useEffect, useState, useContext } from "react";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import ChatNavMenue from "../components/chat/ChatNavMenu";
import { getUsers } from "../services/api";
import { UserContext } from "../UserContext";

const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(0);  // Сохраняем ID выбранного чата
  const [chatPartner, setChatPartner] = useState(null);  // Сохраняем информацию о выбранном партнере чата
  const [users, setUsers] = useState([]);  // Список пользователей
  const { user: currentUser } = useContext(UserContext); // Получаем текущего пользователя из контекста

  // Получаем список пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();

        // Проверяем и логируем данные
        const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];

        // Фильтруем текущего пользователя
        const filteredUsers = data;

        setUsers(filteredUsers);
      } catch (e) {
        console.error("Failed to fetch users:", e);
      }
    };

    fetchUsers();
  }, [currentUser]); // Добавляем currentUser в зависимости, чтобы всегда получать актуальных пользователей

  return (
    <div className="chat-page">
      {/* Передаем setChatPartner в ChatList, чтобы при выборе собеседника обновлять состояние */}
      <ChatList selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} setChatPartner={setChatPartner} />
      
      {/* Передаем информацию о выбранном чате и собеседнике в ChatWindow */}
      <ChatWindow chatId={selectedChatId} users={users} chatPartner={chatPartner} />

      <ChatNavMenue />
    </div>
  );
};

export default ChatPage;
