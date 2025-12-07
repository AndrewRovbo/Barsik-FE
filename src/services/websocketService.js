import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let jwtToken = null;

// Устанавливаем JWT для подключения
export const setJwtToken = (token) => {
  jwtToken = token;
};

// Подключение к WebSocket
export const connectWebSocket = (onMessageReceived) => {
  // Если уже есть клиент — деактивируем старый
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }

  const socket = new SockJS("http://localhost:8080/ws"); 

  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000, // автоподключение
    connectHeaders: {
      Authorization: jwtToken ? `Bearer ${jwtToken}` : "",
    },
  });

  client.onConnect = () => {
    console.log("WS connected");

    // Подписка на личные сообщения
    client.subscribe("/user/queue/messages", (msg) => {
      try {
        onMessageReceived(JSON.parse(msg.body));
      } catch (e) {
        console.error("Error parsing WS message", e);
      }
    });

    // Подписка на общий чат
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

  const destination =
    msg.chatId === 0 ? "/app/chat.broadcast" : "/app/chat.sendMessage";

  stompClient.publish({
    destination,
    body: JSON.stringify(msg),
  });
};
