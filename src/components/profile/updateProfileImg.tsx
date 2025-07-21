import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { updateUserImgThunk } from "../../store/thunks/users.thunks";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

function UpdateProfileImg() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.users);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleFileUpload = async () => {
    if (!file || !user) return;

    const result = await dispatch(updateUserImgThunk(file));

    if (updateUserImgThunk.fulfilled.match(result)) {
      setPreview(null);
      setFile(null);
      navigate("/profile");
    } else {
      toast.error("Error updating image");
    }
  };

  return (
    <>
      <Toaster />
      <main className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-2xl bg-[var(--color-light-card)] text-[var(--color-light-text)] dark:bg-[var(--color-dark-card)] dark:text-[var(--color-dark-text)]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Profile Image
        </h2>

        <div
          className="w-64 h-64 border-4 rounded-xl mx-auto flex items-center justify-center relative overflow-hidden 
        bg-[var(--color-light-bg)] border-[var(--color-light-border)] 
        dark:bg-[var(--color-dark-bg)] dark:border-[var(--color-dark-border)]"
        >
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <label
              htmlFor="profileImg"
              className="w-48 h-48 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all 
            bg-[var(--color-light-border)] text-[var(--color-light-text)] 
            hover:bg-[var(--color-light-primary-hover)] 
            dark:bg-[var(--color-dark-border)] dark:text-[var(--color-dark-text)] 
            dark:hover:bg-[var(--color-dark-primary-hover)]"
            >
              <span className="text-4xl font-bold">+</span>
              <span className="text-sm mt-1">Upload Image</span>
              <input
                type="file"
                id="profileImg"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>

        <div className="mt-6 text-center flex justify-evenly">
          <button
            disabled={isLoading}
            onClick={handleFileUpload}
            className="font-semibold py-2 px-6 rounded-lg text-white disabled:opacity-50
          bg-[var(--color-light-primary)] hover:bg-[var(--color-light-primary-hover)] focus:bg-[var(--color-light-primary-focus)]
          dark:bg-[var(--color-dark-primary)] dark:hover:bg-[var(--color-dark-primary-hover)] dark:focus:bg-[var(--color-dark-primary-focus)]"
          >
            {isLoading ? "Uploading..." : "Update"}
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="font-semibold py-2 px-6 rounded-lg text-white disabled:opacity-50
          bg-[var(--color-error)] hover:brightness-90"
          >
            Cancel
          </button>
        </div>
      </main>
    </>
  );
}

export default UpdateProfileImg;
