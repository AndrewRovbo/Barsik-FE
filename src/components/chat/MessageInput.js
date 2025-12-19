import { useState, useContext } from "react";
import { sendChatMessage } from "../../services/websocketService";
import "../../styles/ChatPage.scss";
import { UserContext } from "../../UserContext";

const MessageInput = ({ chatId, recipientId }) => {  
  const [text, setText] = useState("");
  const { user: currentUser } = useContext(UserContext);

  const submit = () => {
    if (!text.trim()) return;

    const messageData = {
      chatId: chatId ?? 0,  
      content: text,
      type: "MESSAGE",
      timestamp: new Date(),
      senderId: currentUser.id,
      recipientId: chatId !== 0 ? recipientId : null,  
    };

    sendChatMessage(messageData);  
	
    setText("");  
  };

  return (
    <div className="message-input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a message..."
        onKeyPress={(e) => {
          if (e.key === "Enter") submit();  
        }}
      />
      <button onClick={submit}>➤</button>
    </div>
  );
};

export default MessageInput;
