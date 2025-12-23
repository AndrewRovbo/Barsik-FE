import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let jwtToken = null;
let chatSubscription = null; // для подписки на личный чат

export const setJwtToken = (token) => {
	jwtToken = token;
};

/**
 * Подключение к WebSocket.
 * @param {function} onMessageReceived - колбэк для получения сообщений
 * @param {number} currentChatId - выбранный чат
 */
export const connectWebSocket = (onMessageReceived, currentChatId = null) => {
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

		// Подписка на личный чат
		if (currentChatId !== null) {
			if (chatSubscription) {
				chatSubscription.unsubscribe();
			}
			chatSubscription = client.subscribe(`/topic/chat.${currentChatId}`, (message) => {
				try {
					onMessageReceived(JSON.parse(message.body));
				} catch (e) {
					console.error("Error parsing WS message", e);
				}
			});
		}

		// Подписка на глобальный чат
		client.subscribe("/topic/global", (message) => {
			try {
				onMessageReceived(JSON.parse(message.body));
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

/**
 * Отправка сообщения
 * @param {object} msg - сообщение с chatId, senderId, content и т.д.
 */
export const sendChatMessage = (msg) => {
	if (!stompClient || !stompClient.connected) {
		console.warn("WS not connected");
		return;
	}

	const destination =
		msg.chatId === 0 ? "/app/chat.broadcast" : "/app/chat.sendMessage";

	stompClient.publish({
		destination,
		body: JSON.stringify(msg),
	});

	console.log("Sending message", JSON.stringify(msg));
};

/**
 * Смена чата: отписка от предыдущего и подписка на новый
 * @param {number} newChatId 
 * @param {function} onMessageReceived 
 */
export const switchChat = (newChatId, onMessageReceived) => {
	if (!stompClient || !stompClient.connected) return;

	// Отписываемся от старого чата
	if (chatSubscription) {
		chatSubscription.unsubscribe();
	}

	// Подписка на новый чат
	chatSubscription = stompClient.subscribe(`/topic/chat.${newChatId}`, (message) => {
		try {
			onMessageReceived(JSON.parse(message.body));
		} catch (e) {
			console.error("Error parsing WS message", e);
		}
	});
};
