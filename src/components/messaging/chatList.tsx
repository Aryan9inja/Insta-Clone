import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { getFollowingsThunk } from "../../store/thunks/followers.thunks";
import { mapFollowersToUsers } from "../../utility/mapFollowersToUser";
import type { User } from "../../store/slices/users.slice";
import { getProfileImgUrl } from "../../services/users.services";

interface ChatListProps {
  onSelectReceiver: (receiverId: string) => void;
}

const ChatList = ({ onSelectReceiver }: ChatListProps) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.users.user?.userId);
  const followings = useAppSelector((state) => state.followers.followings);
  const [otherUsers, setOtherUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!userId) return;

    dispatch(getFollowingsThunk(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await mapFollowersToUsers(followings);
      setOtherUsers(users);
    };

    fetchUsers();
  }, [followings]);

  if (!userId) {
    return (
      <div className="text-center mt-10 text-red-500">
        Please relogin to use this page
      </div>
    );
  }

  const handleChatOpen = (otherUserId: string) => {
    onSelectReceiver(otherUserId);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Your Chats</h2>

      {otherUsers.length === 0 ? (
        <p className="text-gray-500 text-sm">
          You're not following anyone yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {otherUsers.map((user) => (
            <li
              key={user.userId}
              className="flex items-center gap-3 p-3 bg-white rounded shadow cursor-pointer hover:bg-gray-100"
              onClick={() => handleChatOpen(user.userId)}
            >
              <img
                src={getProfileImgUrl(user.profile_Img)}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">@{user.userId}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
