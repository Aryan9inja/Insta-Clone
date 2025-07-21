import UserPost from "../components/posts/userPosts";
import UserInfo from "../components/profile/userInfo";
import Menu from "../components/ui/menu";
import { useAppSelector } from "../hooks/useRedux";

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.users);
  const userId = user?.userId;
  const profile_Img = user?.profile_Img;
  const username = user?.username;
  const name = user?.name;

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors">
      <Menu />

      <main className="pt-6 md:ml-60">
        <UserInfo profile_Img={profile_Img} username={username} name={name} />
        <UserPost userId={userId}/>
      </main>
    </div>
  );
}
