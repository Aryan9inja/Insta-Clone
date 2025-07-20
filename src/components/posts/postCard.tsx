const getTimeAgo = (creationTime: string) => {
  const postTime = new Date(creationTime).getTime();
  const diffInSeconds = (Date.now() - postTime) / 1000;

  if (diffInSeconds < 60) return `${Math.floor(diffInSeconds)} seconds ago`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

interface PostCardProps {
  username: string;
  user_Img: string;
  post_Img: string;
  caption?: string;
  creationTime: string;
}

const PostCard = ({
  username,
  user_Img,
  post_Img,
  caption = "",
  creationTime,
}: PostCardProps) => {
  return (
    <div className="w-full md:w-8/12 rounded-xl overflow-hidden mb-3 mt-3 shadow-md bg-[var(--color-light-card)] dark:bg-[var(--color-dark-card)]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={user_Img}
          alt={username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-sm text-[var(--color-light-text)] dark:text-[var(--color-dark-text)]">
            {username}
          </p>
          <p className="text-xs text-[var(--color-light-border)] dark:text-[var(--color-dark-border)]">
            {getTimeAgo(creationTime)}
          </p>
        </div>
      </div>

      {/* Post Image */}
      <img
        src={post_Img}
        alt="Post"
        className="w-full max-h-[500px] object-contain"
      />

      {/* Caption */}
      {caption && (
        <div className="px-4 py-2">
          <p className="text-sm text-[var(--color-light-text)] dark:text-[var(--color-dark-text)]">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
};

export default PostCard;
