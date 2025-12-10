import { useEffect, useState } from "react";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import ChatNavMenue from "../components/chat/ChatNavMenu";
import { getUsers } from "../services/api";

const ChatPage = () => {
	const [selectedChatId, setSelectedChatId] = useState(0);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await getUsers();
				const data = res.data?.content ?? res.data ?? res;
				setUsers(Array.isArray(data) ? data : []);
			} catch (e) {
				console.error("Failed to fetch users:", e);
			}
		};
		fetchUsers();
	}, []);

	return (
		<div className="chat-page">
			<ChatList selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />
			<ChatWindow chatId={selectedChatId} isEmpty={false} users={users} />
			<ChatNavMenue />
		</div>
	);
};

export default ChatPage;
