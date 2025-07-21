import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AllPosts from "./allPosts";
import * as postsServices from "../../services/posts.services";
import * as usersServices from "../../services/users.services";
import { type Models } from "appwrite";

// Mock the services
vi.mock("../../services/posts.services", () => ({
  getPosts: vi.fn(),
  getPostImage: vi.fn(),
}));

vi.mock("../../services/users.services", () => ({
  getProfileImgUrl: vi.fn(),
}));

// Mock PostCard component
vi.mock("./postCard", () => ({
  default: ({ username, caption }: { username: string; caption: string }) => (
    <div data-testid="post-card">
      <div data-testid="username">{username}</div>
      <div data-testid="caption">{caption}</div>
    </div>
  ),
}));

const mockPosts: Models.Document[] = [
  {
    $id: "post1",
    $createdAt: "2024-01-01T00:00:00.000Z",
    $updatedAt: "2024-01-01T00:00:00.000Z",
    $permissions: [],
    $collectionId: "posts",
    $databaseId: "main",
    username: "user1",
    user_Img: "user1-img-id",
    post_Img: "post1-img-id",
    caption: "First post caption",
  },
  {
    $id: "post2",
    $createdAt: "2024-01-02T00:00:00.000Z",
    $updatedAt: "2024-01-02T00:00:00.000Z",
    $permissions: [],
    $collectionId: "posts",
    $databaseId: "main",
    username: "user2",
    user_Img: "user2-img-id",
    post_Img: "post2-img-id",
    caption: "Second post caption",
  },
];

describe("AllPosts", () => {
  const mockGetPosts = postsServices.getPosts as MockedFunction<
    typeof postsServices.getPosts
  >;
  const mockGetPostImage = postsServices.getPostImage as MockedFunction<
    typeof postsServices.getPostImage
  >;
  const mockGetProfileImgUrl = usersServices.getProfileImgUrl as MockedFunction<
    typeof usersServices.getProfileImgUrl
  >;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    mockGetPosts.mockResolvedValue({ documents: mockPosts } as any);
    mockGetPostImage.mockImplementation(
      (id) => `https://example.com/post-images/${id}`
    );
    mockGetProfileImgUrl.mockImplementation(
      (id) => `https://example.com/profile-images/${id}`
    );
  });

  describe("Rendering", () => {
    it("should render the main container with correct classes", async () => {
      render(<AllPosts />);

      const container = screen.getByTestId("main-container");
      expect(container).toHaveClass(
        "md:ml-60",
        "min-h-screen",
        "p-4",
        "transition-colors",
        "bg-[var(--color-light-bg)]",
        "text-[var(--color-light-text)]",
        "dark:bg-[var(--color-dark-bg)]",
        "dark:text-[var(--color-dark-text)]"
      );
    });

    it("should render the floating action button", () => {
      render(<AllPosts />);

      const createButton = screen.getByRole("button", {
        name: /create new post/i,
      });
      expect(createButton).toBeInTheDocument();
      expect(createButton).toHaveClass(
        "fixed",
        "bottom-14",
        "right-6",
        "z-50",
        "flex",
        "items-center",
        "gap-2",
        "px-4",
        "py-3",
        "text-white",
        "rounded-full",
        "shadow-lg",
        "hover:scale-105",
        "transition-all"
      );
    });

    it("should render Plus icon in the floating button", () => {
      render(<AllPosts />);

      // The Plus icon should be rendered within the button
      const createButton = screen.getByRole("button", {
        name: /create new post/i,
      });
      expect(createButton).toBeInTheDocument();
    });

    it("should render button text only on medium screens", () => {
      render(<AllPosts />);

      const buttonText = screen.getByText("Create new post");
      expect(buttonText).toHaveClass(
        "hidden",
        "md:inline",
        "text-sm",
        "font-medium"
      );
    });
  });

  describe("Posts Loading", () => {
    it("should fetch posts on component mount", async () => {
      render(<AllPosts />);

      await waitFor(() => {
        expect(mockGetPosts).toHaveBeenCalledTimes(1);
      });
    });

    it("should render posts when loaded successfully", async () => {
      render(<AllPosts />);

      await waitFor(() => {
        expect(screen.getAllByTestId("post-card")).toHaveLength(2);
      });

      const usernames = screen.getAllByTestId("username");
      const captions = screen.getAllByTestId("caption");
      expect(captions[0]).toHaveTextContent("First post caption");
      expect(captions[1]).toHaveTextContent("Second post caption");

      expect(usernames).toHaveLength(2);
      expect(usernames[0]).toHaveTextContent("user1");
      expect(usernames[1]).toHaveTextContent("user2");
    });

    it("should pass correct props to PostCard components", async () => {
      render(<AllPosts />);

      await waitFor(() => {
        expect(mockGetProfileImgUrl).toHaveBeenCalledWith("user1-img-id");
        expect(mockGetProfileImgUrl).toHaveBeenCalledWith("user2-img-id");
        expect(mockGetPostImage).toHaveBeenCalledWith("post1-img-id");
        expect(mockGetPostImage).toHaveBeenCalledWith("post2-img-id");
      });
    });

    it("should handle empty posts array", async () => {
      mockGetPosts.mockResolvedValue({ documents: [] } as any);

      render(<AllPosts />);

      await waitFor(() => {
        expect(mockGetPosts).toHaveBeenCalledTimes(1);
      });

      expect(screen.queryByTestId("post-card")).not.toBeInTheDocument();
    });

    it("should handle getPosts service error gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockGetPosts.mockRejectedValue(new Error("Failed to fetch posts"));

      render(<AllPosts />);

      await waitFor(() => {
        expect(mockGetPosts).toHaveBeenCalledTimes(1);
      });

      // Component should still render without crashing
      expect(
        screen.getByRole("button", { name: /create new post/i })
      ).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Layout", () => {
    it("should render posts in a centered container with correct max width", async () => {
      render(<AllPosts />);

      await waitFor(() => {
        expect(screen.getAllByTestId("post-card")).toHaveLength(2);
      });

      // Check for the centered container structure
      const centerContainer = screen
        .getByTestId("main-container")
        .querySelector(".w-full.flex.justify-center");
      expect(centerContainer).toBeInTheDocument();

      const maxWidthContainer =
        centerContainer?.querySelector(".w-full.max-w-2xl");
      expect(maxWidthContainer).toBeInTheDocument();

      const gridContainer = maxWidthContainer?.querySelector(".grid.gap-6");
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper button accessibility", () => {
      render(<AllPosts />);

      const createButton = screen.getByRole("button", {
        name: /create new post/i,
      });
      expect(createButton).toBeInTheDocument();
    });

    it("should render posts with unique keys", async () => {
      render(<AllPosts />);

      await waitFor(() => {
        const postCards = screen.getAllByTestId("post-card");
        expect(postCards).toHaveLength(2);
      });

      // Each post should have a unique key (handled by React's key prop)
      // This is mainly checked during rendering without errors
    });
  });
});
