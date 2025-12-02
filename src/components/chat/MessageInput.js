import { useState } from "react";
import { sendChatMessage } from "../../services/websocketService";
import "../../styles/ChatPage.scss";

const MessageInput = ({ chatId, currentUserId }) => {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;

    sendChatMessage({
      chatId,
      senderId: currentUserId,
      content: text,
      type: "TEXT",
    });

    setText("");
  };

  return (
    <div className="message-input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Напишите сообщение..."
      />
      <button onClick={submit}>➤</button>
    </div>
  );
};

export default MessageInput;