import { useEffect, useState, useContext, useRef } from "react";
import MessageInput from "./MessageInput";
import { connectWebSocket } from "../../services/websocketService";
import { UserContext } from "../../UserContext";
import "../../styles/ChatPage.scss";

const ChatWindow = ({ selectedChatId, users, chatPartner }) => {
  const [messages, setMessages] = useState([]);
  const { user: currentUser } = useContext(UserContext);
  const messagesEndRef = useRef(null);
  const wsClientRef = useRef(null);
   const chatId = selectedChatId === 0 ? 0 : 1;
  // Очистка сообщений при смене чата
  useEffect(() => {
    setMessages([]);
  }, [selectedChatId]);

  // WS-подписка на выбранный чат
  useEffect(() => {
    

    const handleMessage = (msg) => {
      const isMe = currentUser.id === msg.senderId;
      const senderInfo = users.find(u => u.id === msg.senderId);
      const senderName = senderInfo?.firstName ?? senderInfo?.name ?? (isMe ? "Me" : "Unknown");
      const senderAvatar = senderInfo?.avatarUrl ?? "/default-avatar.png";

      setMessages(prev => [...prev, { ...msg, isMe, senderName, senderAvatar }]);
    };

    // Подключаем WS к выбранному чату
    const client = connectWebSocket(handleMessage, chatId);
    wsClientRef.current = client;

    return () => {
      // Отключаем WS при смене чата
      client.deactivate();
      wsClientRef.current = null;
    };
  }, [chatId, currentUser, users]);

  // Автопрокрутка вниз при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!users) return null;

  return (
    <div className="chat-window">
      <div className="chat-window__header">
        {chatId === 0 ? (
          <h3>General chat</h3>
        ) : chatPartner ? (
          <h3>{chatPartner.firstName ?? chatPartner.name}</h3>
        ) : (
          <h3>Chat</h3>
        )}
      </div>

      <div className="chat-window__messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-window__message ${msg.isMe ? "from-me" : "from-oth"}`}>
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
