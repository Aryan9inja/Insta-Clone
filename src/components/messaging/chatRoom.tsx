import { useChatSocket } from "../../hooks/useChatSocket";
import ChatRoomHeader from "./chatRoomHeader";
import ChatRoomInput from "./chatRoomInput";
import ChatRoomWindow from "./chatRoomWindow";

interface Props {
  userId: string;
  receiverId: string;
  receiverImage: string;
  receiverUsername: string;
}

const ChatRoom = ({
  userId,
  receiverId,
  receiverImage,
  receiverUsername,
}: Props) => {
  const { messages, sendMessage, fetchHistory, hasMore, loading, page } =
    useChatSocket(userId, receiverId);

  return (
    <div className="flex flex-col h-screen">
      <ChatRoomHeader
        receiverImage={receiverImage}
        receiverUsername={receiverUsername}
      />

      <ChatRoomWindow
        userId={userId}
        messages={messages}
        fetchHistory={fetchHistory}
        hasMore={hasMore}
        loading={loading}
        page={page}
      />

      <ChatRoomInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatRoom;
