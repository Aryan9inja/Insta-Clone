import AllPosts from "../components/posts/allPosts";
import Menu from "../components/ui/menu";

function HomePage() {
  return (
    <div>
      <Menu />
      <main className="mb-10 md:mb-0">
        <AllPosts/>
      </main>
    </div>
  );
}

export default HomePage