import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { getFollowingsThunk } from "../../store/thunks/followers.thunks";
import { mapFollowersToUsers } from "../../utility/mapFollowersToUser";
import type { User } from "../../store/slices/users.slice";
import { getProfileImgUrl } from "../../services/users.services";
import { StepBack } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatListProps {
  onSelectReceiver: (
    receiverId: string,
    receiverImage: string,
    receiverUsername: string
  ) => void;
}

const ChatList = ({ onSelectReceiver }: ChatListProps) => {
  const navigate=useNavigate()

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
      <div className="text-center mt-10 text-[var(--color-error)]">
        Please relogin to use this page
      </div>
    );
  }

  const handleChatOpen = (
    otherUserId: string,
    otherUserProfileImg: string,
    otherUserUsername: string
  ) => {
    onSelectReceiver(otherUserId, otherUserProfileImg, otherUserUsername);
  };

  return (
    <div className="max-w-md mx-auto p-4 text-[var(--color-light-text)] dark:text-[var(--color-dark-text)]">
      <div className="flex gap-2">
      <div><StepBack onClick={()=>navigate("/")} size={30}/></div>
      <h2 className="text-xl font-semibold mb-4">Your Chats</h2></div>

      {otherUsers.length === 0 ? (
        <p className="text-sm text-[var(--color-light-border)] dark:text-[var(--color-dark-border)]">
          You're not following anyone yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {otherUsers.map((user) => (
            <li
              key={user.userId}
              onClick={() =>
                handleChatOpen(user.userId, user.profile_Img, user.username)
              }
              className="flex items-center gap-3 p-3 rounded shadow cursor-pointer
                bg-[var(--color-light-card)] hover:bg-[var(--color-light-primary-hover)] 
                dark:bg-[var(--color-dark-card)] dark:hover:bg-[var(--color-dark-primary-hover)] 
                transition-colors"
            >
              <img
                src={getProfileImgUrl(user.profile_Img)}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-[var(--color-light-text)] dark:text-[var(--color-dark-text)]">
                  {user.username}
                </p>
                <p className="text-sm text-[var(--color-light-border)] dark:text-[var(--color-dark-border)]">
                  @{user.userId}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
