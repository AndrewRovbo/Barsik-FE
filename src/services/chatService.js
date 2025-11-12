import { api } from "./api";

export const getChatMessages = async (chatId, page = 0, size = 20) => {
  const res = await api.get(`/api/chats/${chatId}/messages?page=${page}&size=${size}`);
  return res.data;
};

export const sendMessage = async ({ chatId, senderId, content }) => {
  await api.post(`/api/chats/send`, {
    chatId,
    senderId,
    content,
    type: "TEXT",
  });
};
