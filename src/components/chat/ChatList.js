import { useEffect, useState } from "react";
import { getUsers } from "../../services/api";
import "../../styles/ChatPage.scss";

const ChatList = ({ onSelectChat }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);
      } catch (e) {
        console.error("Failed to fetch users:", e);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="chat-list">
      <h2>Your chats</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => onSelectChat(user.id)}>
            {user.name} — {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;