import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let jwtToken = null;

export const setJwtToken = (token) => {
	jwtToken = token;
};

export const connectWebSocket = (onMessageReceived) => {
	if (stompClient) {
		stompClient.deactivate();
		stompClient = null;
	}

	const socket = new SockJS("http://localhost:8080/ws"); 

	const client = new Client({
		webSocketFactory: () => socket,
		reconnectDelay: 5000,
		connectHeaders: {
			Authorization: jwtToken ? `Bearer ${jwtToken}` : "",
		},
	});

	client.onConnect = () => {
		console.log("WS connected");

		client.subscribe("/user/queue/messages", (msg) => {
			try {
				onMessageReceived(JSON.parse(msg.body));
			} catch (e) {
				console.error("Error parsing WS message", e);
			}
		});

		client.subscribe("/topic/global", (msg) => {
			try {
				onMessageReceived(JSON.parse(msg.body));
			} catch (e) {
				console.error("Error parsing WS message", e);
			}
		});
	};

	client.onStompError = (frame) => {
		console.error("STOMP error", frame);
	};

	client.onWebSocketError = (evt) => {
		console.error("WebSocket error", evt);
	};

	client.onWebSocketClose = (evt) => {
		console.log("WebSocket closed", evt);
	};

	client.activate();
	stompClient = client;

	return client; 
};

export const sendChatMessage = (msg) => {
	if (!stompClient || !stompClient.connected) {
		console.warn("WS not connected");
		return;
	}
console.log("MESSA", msg);
	const destination =
		msg.chatId === 0 ? "/app/chat.broadcast" : "/app/chat.sendMessage";
console.log("dest", destination);
	stompClient.publish({
		destination,
		body: JSON.stringify(msg),
	});
	console.log("Sending message", JSON.stringify(msg));
};


