import { useState } from "react";
import { sendMessage } from "../../services/chatService";
import "../../styles/ChatPage.scss";

const MessageInput = ({ chatId, currentUserId }) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage({ chatId, senderId: currentUserId, content: message });
      setMessage("");
    } catch (e) {
      console.error("Failed to send message:", e);
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>➤</button>
    </div>
  );
};

export default MessageInput;
