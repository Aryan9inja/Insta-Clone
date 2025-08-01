import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { getMessageHistory } from "../services/chat.services";

const SocketServerUrl = import.meta.env.VITE_SOCKET_SERVER_URL;

interface Messgae {
  from: string;
  content: string;
}

export const useChatSocket = (userId: string, receiverId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Messgae[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getMessageHistory(userId, receiverId);
        const formatted = res.map((msg: any) => ({
          from: msg.senderId,
          content: msg.content,
          timestamp: msg.createdAt,
        }));

        setMessages(formatted);
      } catch (error) {
        console.error("Failed to fetch message history", error);
      }
    };

    if (userId && receiverId) {
      fetchHistory();
    }
  }, [userId, receiverId]);

  useEffect(() => {
    if (!userId) return;

    const socket = io(SocketServerUrl);

    socket.on("connect", () => {
      socket.emit("register", { userId });

      socket.on("registered", (data) => {
        console.log("Registered: ", data);
      });
    });

    socket.on("receive_message", (payload) => {
      setMessages((prev) => [
        ...prev,
        { from: payload.from, content: payload.message.content },
      ]);
    });

    socket.on("message_sent", (payload) => {
      console.log("Message sent confirmation: ", payload);
    });

    socket.on("error", (err) => {
      console.log("Socket Error: ", err);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const sendMessage = (content: string) => {
    if (!content.trim() || !socketRef || !userId) return;

    const messagePayload = {
      receiverId,
      message: {
        senderId: userId,
        receiverId,
        content,
      },
    };

    socketRef.current?.emit("send_message", messagePayload);
    setMessages((prev) => [...prev, { from: userId, content }]);
  };

  return { messages, sendMessage };
};
