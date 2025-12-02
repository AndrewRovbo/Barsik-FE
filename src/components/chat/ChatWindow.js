import { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import { getChatMessages } from "../../services/chatService";
import { connectWebSocket } from "../../services/websocketService";

const ChatWindow = ({ chatId, currentUserId, isEmpty }) => {
  const [messages, setMessages] = useState([]);

  // загружаем историю
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const load = async () => {
      const res = await getChatMessages(chatId);
      setMessages(res.content || []);
    };
    load();
  }, [chatId]);

  // подключение к WebSocket (1 раз)
  useEffect(() => {
    const handler = (msg) => {
      // получаем по WS только новые сообщения
      if (msg.chatId === chatId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    connectWebSocket(currentUserId, handler);
  }, []);

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
      <div className="chat-window__messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-window__message ${
              msg.senderId === currentUserId ? "from-owner" : "from-sitter"
            }`}
          >
            <div className="chat-window__bubble">
              <p>{msg.content}</p>
              <span className="msg-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <MessageInput chatId={chatId} currentUserId={currentUserId} />
    </div>
  );
};

export default ChatWindow;