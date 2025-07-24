import { useEffect, useState } from "react";
import UserPost from "../components/posts/userPosts";
import UserInfo from "../components/profile/userInfo";
import Menu from "../components/ui/menu";
import { useAppSelector } from "../hooks/useRedux";
import SearchProfile from "../components/profile/searchProfile";
import { useParams } from "react-router-dom";
import { getCurrentUser } from "../services/users.services";
import type { User } from "../store/slices/users.slice";

export default function ProfilePage() {
  const { id: dynamicUserId } = useParams<{ id: string }>();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { user } = useAppSelector((state) => state.users);
  const userId = user?.userId;

  const [profileData, setProfileData] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId === dynamicUserId) {
        setProfileData(user);
      } else if (dynamicUserId) {
        const dynamicUser = await getCurrentUser(dynamicUserId);
        setProfileData(dynamicUser);
      }
    };
    fetchProfile();
  }, [userId, dynamicUserId, user]);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors">
      <Menu onSearchClick={() => setIsSearchOpen(true)} />

      <main className="pt-6 md:ml-60">
        {profileData && (
          <UserInfo
            profile_Img={profileData.profile_Img}
            username={profileData.username}
            name={profileData.name}
          />
        )}
        {dynamicUserId && <UserPost userId={dynamicUserId} />}
      </main>

      {isSearchOpen && <SearchProfile onClose={() => setIsSearchOpen(false)} />}
    </div>
  );
}
