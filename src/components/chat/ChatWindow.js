import { useEffect, useState, useContext, useRef } from "react";
import MessageInput from "./MessageInput";
import { connectWebSocket } from "../../services/websocketService";
import { UserContext } from "../../UserContext";
import "../../styles/ChatPage.scss";

const ChatWindow = ({ chatId, users, chatPartner }) => {
  const [messages, setMessages] = useState([]);
  const { user: currentUser } = useContext(UserContext);
  const messagesEndRef = useRef(null);

  // Определяем партнера чата для личных сообщений
  

  // Обработчик входящих сообщений
  useEffect(() => {
    if (!currentUser) return;

    const handleMessage = (msg) => {
      const isMe = currentUser.id === msg.senderId;

      // Получаем данные о пользователе (имя и аватарка)
      const senderInfo = users.find(u => u.id === msg.senderId);
	 
      const senderName = senderInfo?.firstName ?? senderInfo?.name ?? (isMe ? "Me" : "Unknown");
      const senderAvatar = senderInfo?.avatarUrl ?? "/default-avatar.png";

      // Обрабатываем только те сообщения, которые соответствуют выбранному чату
      if ((chatId === 0 && msg.chatId === 0) || (chatId !== 0 && msg.chatId === chatId)) {
        setMessages(prev => [...prev, { ...msg, isMe, senderName, senderAvatar }]);
      }
    };

    // Подключаем WebSocket для получения сообщений
	setMessages([]);
    connectWebSocket(handleMessage);
  }, [chatId, currentUser, users]);

  // Прокрутка чата вниз при обновлении сообщений
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!users) return null;

  return (
    <div className="chat-window">
      <div className="chat-window__header">
        {chatId === 0 ? (
          <h3>General chat</h3> // Общий чат
        ) : chatPartner ? (
          <h3>{chatPartner.firstName ?? chatPartner.name}</h3> // Личный чат с партнером
        ) : (
          <h3>Chat</h3> // Стандартное название чата
        )}
      </div>

      <div className="chat-window__messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-window__message ${msg.isMe ? "from-me" : "from-oth"}`}
          >
            <div className="msg-avatar">
              <img src={msg.senderAvatar} alt={msg.senderName} />
            </div>

            <div className="chat-window__bubble">
              {!msg.isMe && <strong>{msg.senderName}</strong>}
              <p>{msg.content}</p>
              <span className="msg-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput chatId={chatId} recipientId={chatPartner?.id} />
    </div>
  );
};

export default ChatWindow;
