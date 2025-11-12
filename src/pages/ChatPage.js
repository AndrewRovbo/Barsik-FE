import { useState } from "react";
import "../styles/ChatPage.scss";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import ChatNavMenue from "../components/chat/ChatNavMenue";

const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);


  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser.id ?? 1; 

  return (
    <div className="chat-page">
      <ChatList onSelectChat={setSelectedChatId} />
      {selectedChatId && (
        <ChatWindow chatId={selectedChatId} currentUserId={currentUserId} />
      )}
      <ChatNavMenue />
    </div>
  );
};

export default ChatPage;
