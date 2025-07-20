import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getPostImage, getPosts } from "../../services/posts.services";
import { type Models } from "appwrite";
import PostCard from "./postCard";
import { getProfileImgUrl } from "../../services/users.services";

export default function AllPosts() {
  const [posts, setPosts] = useState<Models.Document[]>([]);

  useEffect(() => {
    (async function setAllPosts() {
      const allPosts = await getPosts();
      setPosts(allPosts.documents);
    })();
  }, []);

  return (
    <div className="md:ml-60 min-h-screen p-4 transition-colors bg-[var(--color-light-bg)] text-[var(--color-light-text)] dark:bg-[var(--color-dark-bg)] dark:text-[var(--color-dark-text)]">
      {/* Centered Container */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.$id}
                username={post.username}
                user_Img={getProfileImgUrl(post.user_Img)}
                post_Img={getPostImage(post.post_Img)}
                creationTime={post.$createdAt}
                caption={post.caption}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-14 right-6 z-50 flex items-center gap-2 px-4 py-3 text-white rounded-full shadow-lg hover:scale-105 transition-all md:bottom-8 md:right-8 bg-[var(--color-light-primary)] dark:bg-[var(--color-dark-primary)] hover:bg-[var(--color-light-primary-hover)] dark:hover:bg-[var(--color-dark-primary-hover)] focus:bg-[var(--color-light-primary-focus)] dark:focus:bg-[var(--color-dark-primary-focus)]">
        <Plus size={20} />
        <span className="hidden md:inline text-sm font-medium">
          Create new post
        </span>
      </button>
    </div>
  );
}
