import { useAppSelector } from "../../hooks/useRedux";
import { useState } from "react";
import { getProfileImgUrl } from "../../services/users.services";
import { createPost, uploadPostImage } from "../../services/posts.services";
import { useNavigate } from "react-router-dom";

const NewPostForm = () => {
  const navigate = useNavigate();

  const username = useAppSelector((state) => state.users.user?.username);
  const profile_Img = useAppSelector((state) => state.users.user?.profile_Img);
  const userId = useAppSelector((state) => state.users.user?.userId);

  const [postImg, setPostImg] = useState<string | null>(null);
  const [postFile, setPostFile] = useState<File | null>(null);

  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostFile(file);
      const reader = new FileReader();
      reader.onload = () => setPostImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postFile || !caption.trim()) return;

    try {
      setLoading(true);

      const uploadedFile = await uploadPostImage(postFile);

      await createPost(userId!, caption.trim(), uploadedFile);

      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Error creating post: ", error);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-4/12 rounded-xl overflow-hidden mb-3 mt-3 shadow-md bg-[var(--color-light-card)] dark:bg-[var(--color-dark-card)]"
    >
      <div className="flex items-center gap-3 p-4">
        <img
          src={getProfileImgUrl(profile_Img!)}
          alt={username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-sm text-[var(--color-light-text)] dark:text-[var(--color-dark-text)]">
            {username}
          </p>
          <p className="text-xs text-[var(--color-light-border)] dark:text-[var(--color-dark-border)]">
            0s ago
          </p>
        </div>
      </div>

      <div className="relative w-full h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-400 dark:border-gray-600 cursor-pointer">
        {!postImg ? (
          <label className="flex flex-col items-center justify-center w-full h-full text-gray-400 dark:text-gray-500 text-sm font-medium cursor-pointer">
            <span className="text-3xl">+</span>
            <span>Choose File</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        ) : (
          <img
            src={postImg}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}
      </div>

      <div className="px-4 py-2">
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="w-full text-sm p-2 border rounded-lg bg-transparent text-[var(--color-light-text)] dark:text-[var(--color-dark-text)] border-[var(--color-light-border)] dark:border-[var(--color-dark-border)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="px-4 py-2">
        <button
          disabled={!postImg || !caption.trim()}
          type="submit"
          className={`w-full py-2 rounded-lg font-medium transition 
      ${
        !postImg || !caption.trim() || loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
};

export default NewPostForm;
