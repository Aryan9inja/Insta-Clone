import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getProfileImgUrl } from "../../services/users.services";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

interface Props {
  userId: string;
  RECEIVER_ID: string;
  receiverImage: string;
  receiverUsername: string;
}

const ChatRoom = ({
  userId,
  RECEIVER_ID,
  receiverImage,
  receiverUsername,
}: Props) => {
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
      socket.emit("register", { userId });

      socket.on("registered", (data) => {
        console.log("Registered:", data);
      });

      socket.on("receive_message", (payload) => {
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
    <div className="flex flex-col h-full bg-[var(--color-light-bg)] dark:bg-[var(--color-dark-bg)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b shadow-sm bg-[var(--color-light-card)] dark:bg-[var(--color-dark-card)] border-[var(--color-light-border)] dark:border-[var(--color-dark-border)]">
        <img
          src={getProfileImgUrl(receiverImage)}
          alt={receiverUsername}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-light-text)] dark:text-[var(--color-dark-text)]">
            {receiverUsername}
          </h2>
          <p className="text-sm text-[var(--color-light-border)] dark:text-[var(--color-dark-border)]">
            @{RECEIVER_ID}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-[var(--color-light-bg)] dark:bg-[var(--color-dark-bg)] min-h-[40rem]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 flex ${
              msg.from === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm ${
                msg.from === userId
                  ? "text-white rounded-br-none bg-[var(--color-light-primary)] dark:bg-[var(--color-dark-primary)]"
                  : "text-[var(--color-light-text)] bg-[var(--color-light-card)] dark:text-[var(--color-dark-text)] dark:bg-[var(--color-dark-card)] rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-[var(--color-light-card)] dark:bg-[var(--color-dark-card)] border-[var(--color-light-border)] dark:border-[var(--color-dark-border)] flex items-center gap-2">
        <input
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none 
          text-[var(--color-light-text)] dark:text-[var(--color-dark-text)] 
          border-[var(--color-light-border)] dark:border-[var(--color-dark-border)] 
          bg-[var(--color-light-bg)] dark:bg-[var(--color-dark-bg)] 
          focus:ring-2 focus:ring-[var(--color-light-primary)] dark:focus:ring-[var(--color-dark-primary)]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2 text-sm text-white rounded-full 
          bg-[var(--color-light-primary)] hover:bg-[var(--color-light-primary-hover)] focus:bg-[var(--color-light-primary-focus)] 
          dark:bg-[var(--color-dark-primary)] dark:hover:bg-[var(--color-dark-primary-hover)] dark:focus:bg-[var(--color-dark-primary-focus)]"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
