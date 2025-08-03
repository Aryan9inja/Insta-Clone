import { useState } from "react";

interface Props {
  sendMessage: (message: string) => void;
}

const ChatRoomInput = ({ sendMessage }: Props) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="p-4 border-t flex items-center gap-2">
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type a message"
        className="flex-1 flex border rounded-xl px-4 py-2"
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        Send
      </button>
    </div>
  );
};

export default ChatRoomInput;