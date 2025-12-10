import { useState } from "react";
import { sendChatMessage } from "../../services/websocketService";
import "../../styles/ChatPage.scss";

const MessageInput = ({ chatId }) => {
	const [text, setText] = useState("");

	const submit = () => {
		if (!text.trim()) return;

		sendChatMessage({
			chatId: chatId ?? 0,
			content: text,
			type:  "MESSAGE",
			timestamp: new Date(),
		});

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
