import { type Models } from "appwrite";
import { useEffect, useState } from "react";
import { getPostImage, getUserPosts } from "../../services/posts.services";

type UserPostProps = {
  userId?: string;
};

const UserPost = ({ userId }: UserPostProps) => {
  const [posts, setPosts] = useState<Models.Document[]>([]);

  useEffect(() => {
    async function fetchUserPosts() {
      try {
        const userPosts = await getUserPosts(userId!);
        setPosts(userPosts.documents);
      } catch (error) {
        console.error("Failed to fetch user posts", error);
      }
    }

    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);

  return (
    <section className="grid grid-cols-3 gap-0.5 md:gap-1.5 p-4 md:ml-4 md:mr-4 mb-8 md:mb-0">
      {posts.map((post) => (
        <div key={post.$id} className="w-full h-40 md:aspect-square md:h-auto">
          <img
            src={getPostImage(post.post_Img)}
            alt="User post"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </section>
  );
};

export default UserPost;
