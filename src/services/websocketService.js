// websocketService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const connectWebSocket = (userId, onMessageReceived) => {
  const client = new Client({
    webSocketFactory: () =>
      new SockJS("http://localhost:8080/ws", null, {
        withCredentials: true, // ✅ Очень важно! Cookie отправляется
      }),
    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    console.log("WebSocket connected");

    // Подписки
    client.subscribe(`/user/${userId}/queue/messages`, (msg) => {
      onMessageReceived(JSON.parse(msg.body));
    });

    client.subscribe("/chat.broadcastToOnline", (msg) => {
      onMessageReceived(JSON.parse(msg.body));
    });

    client.subscribe("/topic/status", (msg) => {
      console.log("STATUS:", JSON.parse(msg.body));
    });
  };

  client.activate();
  stompClient = client;
};

export const sendChatMessage = (chatMessage) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(chatMessage),
    });
  }
};