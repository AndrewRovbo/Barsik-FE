import { useEffect, useState } from "react";
import { getUsers } from "../../services/api";
import "../../styles/ChatPage.scss";

const ChatList = ({ selectedChatId, onSelectChat }) => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await getUsers();
				const data = res.data?.content ?? res.data ?? res;
				setUsers(Array.isArray(data) ? data : []);
			} catch (e) {
				console.error("Failed to fetch users:", e);
				if (e.response?.status === 401) {
					setUsers([]);
				}
			}
		};
		fetchUsers();
	}, []);

	return (
		<div className="chat-list">
			<h2>Your chats</h2>
			<ul>
				<li
					key={0}
					onClick={() => onSelectChat(0)}
					className={selectedChatId === 0 ? "active" : ""}
				>
					General Chat
				</li>

				{users.map((user) => (
					<li
						key={user.id}
						onClick={() => onSelectChat(user.id)}
						className={selectedChatId === user.id ? "active" : ""}
					>
						{user.firstName ?? user.name} — {user.email}
					</li>
				))}
			</ul>
		</div>
	);
};

export default ChatList;
