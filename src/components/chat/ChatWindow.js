import { useEffect, useState, useContext, useRef } from "react";
import MessageInput from "./MessageInput";
import { connectWebSocket } from "../../services/websocketService";
import { UserContext } from "../../UserContext";
import "../../styles/ChatPage.scss";

const ChatWindow = ({ chatId, isEmpty, users }) => {
  const [messages, setMessages] = useState([]);
  const { user: currentUser } = useContext(UserContext);
  const messagesEndRef = useRef(null);


  const chatPartner = chatId !== 0 ? users.find((u) => u.id === chatId) : null;

  useEffect(() => {
    if (!currentUser) return;

    const handleMessage = (msg) => {
      const isMe = currentUser.email === msg.senderEmail;
console.log("Current user from context:", currentUser);
      if ((chatId === 0 && msg.chatId === 0) || (chatId !== 0 && msg.chatId === chatId)) {
        setMessages((prev) => [...prev, { ...msg, isMe }]);
      }
    };

    connectWebSocket(handleMessage);
  }, [chatId, currentUser]);

 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isEmpty) {
    return (
      <div className="chat-window chat-window--empty">
        <div className="empty-message">
          <h2>Выберите чат</h2>
          <p>Чтобы начать общение, выберите диалог слева.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Заголовок чата */}
      <div className="chat-window__header">
        {chatId === 0 ? (
          <h3>Общий чат</h3>
        ) : chatPartner ? (
          <h3>{chatPartner.firstName ?? chatPartner.name}</h3>
        ) : (
          <h3>Чат</h3>
        )}
      </div>

      {/* Сообщения */}
      <div className="chat-window__messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-window__message ${msg.isMe ? "from-me" : "from-oth"}`}
          >
            {/* Аватар слева для чужих, справа для своих */}
            {!msg.isMe && <div className="msg-avatar" />}
            
            <div className="chat-window__bubble">
              <p>{msg.content}</p>
              <span className="msg-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {msg.isMe && <div className="msg-avatar" />}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput chatId={chatId} />
    </div>
  );
};

export default ChatWindow;
