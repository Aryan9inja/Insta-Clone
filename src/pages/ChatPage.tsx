// ChatPage.tsx
import { useState } from "react";
import ChatList from "../components/messaging/chatList";
import ChatRoom from "../components/messaging/chatRoom";
import { useAppSelector } from "../hooks/useRedux";

export default function ChatPage() {
  const userId = useAppSelector((state) => state.users.user?.userId);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [receiverImage, setReceiverImage] = useState<string | null>(null);
  const [receiverUsername, setReceiverUsername] = useState<string | null>(null);

  const handleSelectReceiver = (
    receiverId: string,
    receiverImage: string,
    receiverUsername: string
  ) => {
    setReceiverId(receiverId);
    setReceiverImage(receiverImage);
    setReceiverUsername(receiverUsername);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[var(--color-light-bg)] text-[var(--color-light-text)] dark:bg-[var(--color-dark-bg)] dark:text-[var(--color-dark-text)]">
      {/* Chat List */}
      {(!receiverId || window.innerWidth >= 1024) && (
        <div className="w-full lg:w-1/3 border-r border-[var(--color-light-border)] dark:border-[var(--color-dark-border)]">
          <ChatList onSelectReceiver={handleSelectReceiver} />
        </div>
      )}

      {/* Chat Room */}
      {receiverId && receiverUsername && receiverImage && (
        <div className="w-full lg:w-2/3">
          <ChatRoom
            userId={userId!}
            receiverId={receiverId}
            receiverImage={receiverImage}
            receiverUsername={receiverUsername}
          />
        </div>
      )}
    </div>
  );
}
