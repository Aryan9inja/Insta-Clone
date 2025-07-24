import NewPostForm from "../components/posts/newPostForm";

function CreatePostPage() {
  return (
    <main className="flex h-dvh justify-center items-center p-2 bg-light-bg dark:bg-dark-bg">
      <NewPostForm />
    </main>
  );
}

export default CreatePostPage;
