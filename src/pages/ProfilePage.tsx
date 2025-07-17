import UserInfo from "../components/profile/userInfo";
import Menu from "../components/ui/menu"; 

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors">
      <Menu />

      <main className="pt-6 md:ml-60">
        <UserInfo />
      </main>
    </div>
  );
}
