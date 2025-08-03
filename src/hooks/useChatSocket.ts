import { useEffect, useRef, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { getMessageHistory } from "../services/chat.services";

const SocketServerUrl = import.meta.env.VITE_SOCKET_SERVER_URL;

interface Message {
  from: string;
  content: string;
  timestamp?: string;
}

export const useChatSocket = (userId: string, receiverId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);

  const fetchHistory = useCallback(async (pageToFetch = 1) => {
    if (!userId || !receiverId) return;
    if (isFetchingRef.current) return;
    if (!hasMore && pageToFetch > 1) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const response = await getMessageHistory(userId, receiverId, pageToFetch);
      const { messages: fetchedMessages, totalPages } = response;

      if (!fetchedMessages || !Array.isArray(fetchedMessages)) return;

      const formatted = fetchedMessages.map((msg: any) => ({
        from: msg.senderId,
        content: msg.content,
        timestamp: msg.createdAt,
      }));

      formatted.reverse();

      if (pageToFetch === 1) {
        setMessages(formatted);
        setPage(2);
      } else {
        setMessages((prev) => [...formatted, ...prev]);
        setPage(pageToFetch + 1);
      }

      setHasMore(pageToFetch < totalPages);
    } catch {
      //
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [userId, receiverId, hasMore, page]);

  useEffect(() => {
    if (!userId || !receiverId) return;
    setMessages([]);
    setPage(1);
    setHasMore(true);
    isFetchingRef.current = false;

    const timeoutId = setTimeout(() => {
      fetchHistory(1);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [userId, receiverId]);

  useEffect(() => {
    if (!userId) return;

    const socket = io(SocketServerUrl);

    socket.on("connect", () => {
      socket.emit("register", { userId });
    });

    socket.on("registered", () => {});

    socket.on("receive_message", (payload) => {
      setMessages((prev) => [
        ...prev,
        {
          from: payload.from,
          content: payload.message.content,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socket.on("message_sent", () => {});

    socket.on("error", () => {});

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !socketRef.current || !userId) return;

    const messagePayload = {
      receiverId,
      message: {
        senderId: userId,
        receiverId,
        content,
      },
    };

    socketRef.current.emit("send_message", messagePayload);
    setMessages((prev) => [
      ...prev,
      {
        from: userId,
        content,
      },
    ]);
  }, [userId, receiverId]);

  return {
    messages,
    sendMessage,
    fetchHistory,
    hasMore,
    loading,
    page,
  };
};