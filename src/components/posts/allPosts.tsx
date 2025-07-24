import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getPostImageUrl,
  getPostsWithUserInfo,
  type PostWithUserInfo,
} from "../../services/posts.services";
import PostCard from "./postCard";
import { getProfileImgUrl } from "../../services/users.services";
import { useNavigate } from "react-router-dom";

export default function AllPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostWithUserInfo[]>([]);

  useEffect(() => {
    (async function setAllPosts() {
      try {
        const allPosts = await getPostsWithUserInfo();
        setPosts(allPosts);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    })();
  }, []);

  return (
    <div
      data-testid="main-container"
      className="md:ml-60 min-h-screen p-4 transition-colors bg-[var(--color-light-bg)] text-[var(--color-light-text)] dark:bg-[var(--color-dark-bg)] dark:text-[var(--color-dark-text)]"
    >
      {/* Centered Container */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-2xl">
          {posts.length === 0 ? (
            <div className="text-center mt-20 text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">No posts yet.</p>
              <p className="text-sm mt-1">Be the first to create a post!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post.$id}
                  username={post.username}
                  user_Img={getProfileImgUrl(post.profile_Img)}
                  post_Img={getPostImageUrl(post.post_Img)}
                  creationTime={post.$createdAt}
                  caption={post.caption}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate("/create")}
        className="fixed bottom-14 right-6 z-50 flex items-center gap-2 px-4 py-3 text-white rounded-full shadow-lg hover:scale-105 transition-all md:bottom-8 md:right-8 bg-[var(--color-light-primary)] dark:bg-[var(--color-dark-primary)] hover:bg-[var(--color-light-primary-hover)] dark:hover:bg-[var(--color-dark-primary-hover)] focus:bg-[var(--color-light-primary-focus)] dark:focus:bg-[var(--color-dark-primary-focus)]"
      >
        <Plus size={20} />
        <span className="hidden md:inline text-sm font-medium">
          Create new post
        </span>
      </button>
    </div>
  );
}
