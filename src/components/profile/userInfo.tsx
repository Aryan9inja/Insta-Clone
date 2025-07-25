import CustomButton from "../ui/button";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { logoutThunk } from "../../store/thunks/users.thunks";
import { getProfileImgUrl } from "../../services/users.services";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { useEffect } from "react";
import { useFollowers } from "../../hooks/useFollowers";

interface UserInfoProps {
  profile_Img?: string;
  username?: string;
  name?: string;
  userId?: string;
}

export default function UserInfo({
  profile_Img,
  username,
  name,
  userId,
}: UserInfoProps) {
  const navigate = useNavigate();
  const profileUsername = useAppSelector((state) => state.users.user?.username);
  const currentUserId = useAppSelector((state) => state.users.user?.userId);
  const dispatch = useAppDispatch();

  // Followers hook
  const {
    followers,
    followings,
    isFollowing,
    followUser,
    unfollowUser,
    loadFollowers,
    loadFollowings,
  } = useFollowers(userId);

  const otherUser = username !== profileUsername;

  useEffect(() => {
    if (userId) {
      loadFollowers(userId);
      loadFollowings(userId);
    }
  }, [userId]);

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate("/login");
  };

  const handleFollowToggle = () => {
    if (!currentUserId || !userId) return;
    if (isFollowing) {
      unfollowUser(currentUserId, userId);
    } else {
      followUser(currentUserId, userId);
    }
  };

  return (
    <div className="pt-2 px-4 md:px-8 min-h-[25vh] flex items-center gap-10">
      {/* Profile picture */}
      <div className="w-30 h-30 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-light-primary dark:border-dark-primary">
        <div
          className={`relative w-30 h-30 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-light-primary dark:border-dark-primary group ${
            otherUser ? "cursor-default" : "cursor-pointer"
          }`}
          onClick={!otherUser ? () => navigate("/updateProfile") : undefined}
        >
          <img
            src={getProfileImgUrl(profile_Img || "")}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          {!otherUser && (
            <div className="absolute inset-0 bg-gray-600 flex items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity">
              <Pencil className="text-white w-6 h-6" />
            </div>
          )}
        </div>
      </div>

      {/* User info */}
      <div className="flex flex-col justify-center items-start flex-1">
        <h2 className="text-xl md:text-2xl font-semibold text-light-primary dark:text-dark-primary">
          {username}
        </h2>
        <p className="text-sm md:text-base text-light-text dark:text-dark-text mt-1">
          {name}
        </p>

        {/* Followers/Following counts */}
        <div className="mt-3 flex gap-4">
          <span className="text-sm md:text-base text-light-primary dark:text-dark-primary">
            {followers?.length ?? 0} Followers
          </span>
          <span className="text-sm md:text-base text-light-primary dark:text-dark-primary">
            {followings?.length ?? 0} Following
          </span>
        </div>

        <div className="mt-4">
          {otherUser ? (
            <CustomButton
              label={isFollowing ? "Unfollow" : "Follow"}
              onClick={handleFollowToggle}
            />
          ) : (
            <CustomButton label="Logout" onClick={handleLogout} />
          )}
        </div>
      </div>
    </div>
  );
}
