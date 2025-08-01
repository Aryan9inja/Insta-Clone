import { useState } from "react";
import { getProfileImgUrl } from "../../services/users.services";
import { useChatSocket } from "../../hooks/useChatSocket";

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
  const [message, setMessage] = useState("");
  const { messages, sendMessage } = useChatSocket(userId, RECEIVER_ID);

  const handleSend = () => {
    sendMessage(message);
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
      <div className="flex-1 overflow-y-auto px-4 py-3 min-h-[40rem]">
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
      <div className="p-4 border-t flex items-center gap-2">
        <input
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-5 py-2 text-sm text-white rounded-full bg-[var(--color-light-primary)] dark:bg-[var(--color-dark-primary)]"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
