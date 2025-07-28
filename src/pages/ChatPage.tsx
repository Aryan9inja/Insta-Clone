import { useState } from "react";
import ChatList from "../components/messaging/chatList";
import ChatRoom from "../components/messaging/chatRoom";
import { useAppSelector } from "../hooks/useRedux";

export default function ChatPage() {
  const userId = useAppSelector((state) => state.users.user?.userId);
  const [receiverId, setReceiverId] = useState<string | null>(null);

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Chat List */}
      {(!receiverId || window.innerWidth >= 1024) && (
        <div className="w-full lg:w-1/3 border-r">
          <ChatList onSelectReceiver={setReceiverId} />
        </div>
      )}

      {/* Chat Room */}
      {receiverId && (
        <div className="w-full lg:w-2/3">
          <ChatRoom userId={userId!} RECEIVER_ID={receiverId} />
        </div>
      )}
    </div>
  );
}
