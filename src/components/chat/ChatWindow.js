import { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import { getChatMessages } from "../../services/chatService";
import "../../styles/ChatPage.scss";

const ChatWindow = ({ chatId, currentUserId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await getChatMessages(chatId);
        setMessages(res.content || []);
      } catch (e) {
        console.error("Failed to fetch messages:", e);
      }
    };

    fetchMessages();
  }, [chatId]);

  return (
    <div className="chat-window">
      <div className="chat-window__messages">
        {messages.map((msg) => (
          <div
            key={msg.timestamp + msg.senderId}
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
