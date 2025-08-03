import { useRef, useEffect, useState } from "react";

interface Message {
  from: string;
  content: string;
}

interface Props {
  userId: string;
  messages: Message[];
  fetchHistory: (page?: number) => Promise<void>;
  hasMore: boolean;
  loading: boolean;
  page: number;
}

const ChatRoomWindow = ({
  userId,
  messages,
  fetchHistory,
  hasMore,
  loading,
  page,
}: Props) => {
  const windowRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const previousMessagesLength = useRef(0);
  const shouldScrollToBottom = useRef(true);

  useEffect(() => {
    if (!windowRef.current) return;
    if (shouldScrollToBottom.current && !isLoadingOlder) {
      setTimeout(() => {
        if (windowRef.current) {
          windowRef.current.scrollTop = windowRef.current.scrollHeight;
        }
      }, 0);
    }
    shouldScrollToBottom.current = true;
  }, [messages, isLoadingOlder]);

  useEffect(() => {
    if (!windowRef.current || !isLoadingOlder) return;
    if (messages.length > previousMessagesLength.current) {
      const messageElements = windowRef.current.children;
      const newMessagesCount = messages.length - previousMessagesLength.current;
      if (messageElements.length > newMessagesCount) {
        const targetElement = messageElements[newMessagesCount] as HTMLElement;
        if (targetElement) {
          targetElement.scrollIntoView({ block: "start" });
        }
      }
      setIsLoadingOlder(false);
      previousMessagesLength.current = messages.length;
    }
  }, [messages, isLoadingOlder]);

  const handleScroll = async () => {
    if (!windowRef.current || loading || !hasMore) return;
    const { scrollTop } = windowRef.current;
    if (scrollTop < 100 && hasMore && !loading && !isLoadingOlder) {
      setIsLoadingOlder(true);
      shouldScrollToBottom.current = false;
      previousMessagesLength.current = messages.length;
      try {
        await fetchHistory(page);
      } catch {
        setIsLoadingOlder(false);
      }
    }
  };

  if (messages.length === 0 && loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">
          No messages yet. Start the conversation!
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative min-h-0 p-2">
      {(loading || isLoadingOlder) && messages.length > 0 && (
        <div className="absolute top-0 left-0 right-0 p-2 text-center text-gray-500 text-sm bg-white/90 backdrop-blur-sm z-10 border-b">
          Loading older messages...
        </div>
      )}

      <div
        ref={windowRef}
        onScroll={handleScroll}
        className={`h-full overflow-y-auto px-4 flex flex-col gap-2 ${
          (loading || isLoadingOlder) && messages.length > 0
            ? "pt-12 pb-3"
            : "py-3"
        }`}
        style={{
          maxHeight: "100%",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[60%] px-4 py-2 rounded-xl ${
              msg.from === userId
                ? "self-end bg-blue-400 text-white"
                : "self-start bg-gray-400 text-gray-900"
            }`}
          >
            <div>{msg.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomWindow;
