import axios from "axios";

const BaseURL = import.meta.env.VITE_SOCKET_SERVER_URL;

export const getMessageHistory = async (
  userId1: string,
  userId2: string,
  page = 1,
  limit = 15
) => {
  const res = await axios.get(
    `${BaseURL}/chat/messages/${userId1}/${userId2}?page=${page}&limit=${limit}`
  );
  return {
    messages: res.data.messages,
    total: res.data.total,
    totalPages: res.data.totalPages,
  };
};
