import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000";

interface Props {
  userId: string;
  RECEIVER_ID: string;
}

const ChatRoom = ({ userId, RECEIVER_ID }: Props) => {
  const socketRef = useRef<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ from: string; content: string }[]>(
    []
  );

  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_SERVER_URL);

    socket.on("connect", () => {
      console.log("Connected to server");

      // Register the user
      socket.emit("register", { userId });

      socket.on("registered", (data) => {
        console.log("Registered:", data);
      });

      socket.on("receive_message", (payload) => {
        console.log("Received:", payload);
        setMessages((prev) => [
          ...prev,
          { from: payload.from, content: payload.message.content },
        ]);
      });

      socket.on("message_sent", (payload) => {
        console.log("Message sent confirmation:", payload);
      });

      socket.on("error", (err) => {
        console.error("Socket error:", err);
      });
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const sendMessage = () => {
    if (!message.trim() || !socketRef.current || !userId) return;

    const messagePayload = {
      receiverId: RECEIVER_ID,
      message: {
        senderId: userId,
        receiverId: RECEIVER_ID,
        content: message,
      },
    };

    socketRef.current.emit("send_message", messagePayload);

    setMessages((prev) => [...prev, { from: userId, content: message }]);
    setMessage("");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">ChatRoom</h2>
      <div className="bg-gray-100 p-3 rounded-md h-64 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.from === userId ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded ${
                msg.from === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
