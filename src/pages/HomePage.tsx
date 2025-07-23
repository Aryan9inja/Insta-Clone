import { useState } from "react";
import AllPosts from "../components/posts/allPosts";
import Menu from "../components/ui/menu";
import SearchProfile from "../components/profile/searchProfile";

function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div>
      <Menu onSearchClick={() => setIsSearchOpen(true)} />
      <main className="mb-10 md:mb-0">
        <AllPosts />
      </main>

      {isSearchOpen && <SearchProfile onClose={() => setIsSearchOpen(false)} />}
    </div>
  );
}

export default HomePage;
