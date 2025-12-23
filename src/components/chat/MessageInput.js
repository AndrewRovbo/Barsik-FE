import { useState, useContext } from "react";
import { sendChatMessage } from "../../services/websocketService";
import "../../styles/ChatPage.scss";
import { UserContext } from "../../UserContext";

const MessageInput = ({ chatId, recipientId }) => {  
  const [text, setText] = useState("");
  const { user: currentUser } = useContext(UserContext);

  const submit = () => {
    if (!text.trim() || !currentUser) return;

    const messageData = {
      chatId: chatId ?? 0,             // 0 = глобальный чат
      content: text.trim(),
      type: "MESSAGE",
      timestamp: new Date().toISOString(),
      senderId: currentUser.id,
      recipientId: chatId !== 0 ? recipientId : null,  
    };

    sendChatMessage(messageData);  // отправка через WS
    setText("");                    // очистка поля
  };

  return (
    <div className="message-input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a message..."
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();  // Enter = отправка
        }}
      />
      <button onClick={submit}>➤</button>
    </div>
  );
};

export default MessageInput;
