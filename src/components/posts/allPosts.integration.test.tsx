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
vi.mock("../../services/posts.services");
vi.mock("../../services/users.services");

const mockPosts: Models.Document[] = [
  {
    $id: "post1",
    $createdAt: "2024-01-01T00:00:00.000Z",
    $updatedAt: "2024-01-01T00:00:00.000Z",
    $permissions: [],
    $collectionId: "posts",
    $databaseId: "main",
    username: "alice",
    user_Img: "alice-avatar-id",
    post_Img: "post1-image-id",
    caption: "Beautiful sunset at the beach! 🌅",
  },
  {
    $id: "post2",
    $createdAt: "2024-01-01T10:00:00.000Z",
    $updatedAt: "2024-01-01T10:00:00.000Z",
    $permissions: [],
    $collectionId: "posts",
    $databaseId: "main",
    username: "bob",
    user_Img: "bob-avatar-id",
    post_Img: "post2-image-id",
    caption: "Morning coffee ☕",
  },
  {
    $id: "post3",
    $createdAt: "2024-01-01T15:00:00.000Z",
    $updatedAt: "2024-01-01T15:00:00.000Z",
    $permissions: [],
    $collectionId: "posts",
    $databaseId: "main",
    username: "charlie",
    user_Img: "charlie-avatar-id",
    post_Img: "post3-image-id",
    caption: "", // Empty caption
  },
];

describe("AllPosts Integration Tests", () => {
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

    // Setup realistic service responses
    mockGetPosts.mockResolvedValue({ documents: mockPosts } as any);
    mockGetPostImage.mockImplementation(
      (id) => `https://storage.example.com/posts/${id}.jpg`
    );
    mockGetProfileImgUrl.mockImplementation(
      (id) => `https://storage.example.com/avatars/${id}.jpg`
    );
  });

  describe("Full Component Integration", () => {
    it("should complete the full data loading and rendering flow", async () => {
      render(<AllPosts />);

      // Initially, no posts should be visible
      expect(screen.queryByText("alice")).not.toBeInTheDocument();

      // Wait for posts to load
      await waitFor(() => {
        expect(mockGetPosts).toHaveBeenCalledTimes(1);
      });

      // Check that all posts are rendered
      await waitFor(() => {
        expect(screen.getByText("alice")).toBeInTheDocument();
        expect(screen.getByText("bob")).toBeInTheDocument();
        expect(screen.getByText("charlie")).toBeInTheDocument();
      });

      // Verify captions
      expect(
        screen.getByText("Beautiful sunset at the beach! 🌅")
      ).toBeInTheDocument();
      expect(screen.getByText("Morning coffee ☕")).toBeInTheDocument();
      // Post with empty caption should not display caption
    });

    it("should handle service integration correctly", async () => {
      render(<AllPosts />);

      await waitFor(() => {
        expect(mockGetPosts).toHaveBeenCalledTimes(1);
      });

      // Verify that image services are called for each post
      await waitFor(() => {
        expect(mockGetPostImage).toHaveBeenCalledWith("post1-image-id");
        expect(mockGetPostImage).toHaveBeenCalledWith("post2-image-id");
        expect(mockGetPostImage).toHaveBeenCalledWith("post3-image-id");

        expect(mockGetProfileImgUrl).toHaveBeenCalledWith("alice-avatar-id");
        expect(mockGetProfileImgUrl).toHaveBeenCalledWith("bob-avatar-id");
        expect(mockGetProfileImgUrl).toHaveBeenCalledWith("charlie-avatar-id");
      });
    });

    it("should pass complete data to PostCard components", async () => {
      render(<AllPosts />);

      await waitFor(() => {
        expect(screen.getByText("alice")).toBeInTheDocument();
      });

      // Check that profile images have correct URLs
      const aliceAvatar = screen.getByAltText("alice") as HTMLImageElement;
      expect(aliceAvatar.src).toBe(
        "https://storage.example.com/avatars/alice-avatar-id.jpg"
      );

      // Check that post images have correct URLs
      const postImages = screen.getAllByAltText("Post") as HTMLImageElement[];
      expect(postImages[0].src).toBe(
        "https://storage.example.com/posts/post1-image-id.jpg"
      );
    });
  });

  describe("Error Handling Integration", () => {
    it("should handle getPosts service failure gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockGetPosts.mockRejectedValue(new Error("Network error"));

      render(<AllPosts />);

      await waitFor(() => {
        expect(mockGetPosts).toHaveBeenCalledTimes(1);
      });

      // Component should still render the UI structure
      expect(screen.getByText("Create new post")).toBeInTheDocument();

      // No posts should be displayed
      expect(screen.queryByText("alice")).not.toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it("should handle image service failures gracefully", async () => {
      mockGetPostImage.mockImplementation(() => {
        console.error("Post image failed to load");
        return "https://storage.example.com/posts/fallback.jpg";
      });

      mockGetProfileImgUrl.mockImplementation(() => {
        console.error("Profile image failed to load");
        return "https://storage.example.com/avatars/fallback.jpg";
      });

      render(<AllPosts />);

      await waitFor(() => {
        expect(mockGetPosts).toHaveBeenCalledTimes(1);
      });

      // Posts should still render even if image services fail
      await waitFor(() => {
        expect(screen.getByText("alice")).toBeInTheDocument();
        expect(screen.getByText("bob")).toBeInTheDocument();
        expect(screen.getByText("charlie")).toBeInTheDocument();
      });
    });
  });

  describe("Performance Integration", () => {
    it("should not make duplicate service calls on re-renders", async () => {
      const { rerender } = render(<AllPosts />);

      await waitFor(() => {
        expect(mockGetPosts).toHaveBeenCalledTimes(1);
      });

      // Re-render the component
      rerender(<AllPosts />);

      // Should not make additional calls due to useEffect dependency array
      expect(mockGetPosts).toHaveBeenCalledTimes(1);
    });

    it("should handle large number of posts efficiently", async () => {
      const largeMockPosts = Array.from({ length: 50 }, (_, i) => ({
        $id: `post${i + 1}`,
        $createdAt: new Date(Date.now() - i * 60000).toISOString(),
        $updatedAt: new Date(Date.now() - i * 60000).toISOString(),
        $permissions: [],
        $collectionId: "posts",
        $databaseId: "main",
        username: `user${i + 1}`,
        user_Img: `user${i + 1}-avatar-id`,
        post_Img: `post${i + 1}-image-id`,
        caption: `Post ${i + 1} caption`,
      }));

      mockGetPosts.mockResolvedValue({ documents: largeMockPosts } as any);

      render(<AllPosts />);

      await waitFor(() => {
        expect(mockGetPosts).toHaveBeenCalledTimes(1);
      });

      // Check that rendering completes without performance issues
      await waitFor(() => {
        expect(screen.getByText("user1")).toBeInTheDocument();
        expect(screen.getByText("user50")).toBeInTheDocument();
      });

      // Verify image services are called for all posts
      expect(mockGetPostImage).toHaveBeenCalledTimes(50);
      expect(mockGetProfileImgUrl).toHaveBeenCalledTimes(50);
    });
  });

  describe("Real-world Scenarios", () => {
    it("should handle posts with various caption formats", async () => {
      const diversePosts: Models.Document[] = [
        {
          ...mockPosts[0],
          caption: "Simple caption",
        },
        {
          ...mockPosts[1],
          caption: "Caption with emojis 😀🎉✨",
        },
        {
          ...mockPosts[2],
          caption:
            "Very long caption that goes on and on and might wrap to multiple lines to test the layout and formatting of longer text content",
        },
      ];

      mockGetPosts.mockResolvedValue({ documents: diversePosts } as any);

      render(<AllPosts />);

      await waitFor(() => {
        expect(screen.getByText("Simple caption")).toBeInTheDocument();
        expect(
          screen.getByText("Caption with emojis 😀🎉✨")
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Very long caption that goes on and on/)
        ).toBeInTheDocument();
      });
    });

    it("should handle posts from different time periods", async () => {
      const timeDiversePosts: Models.Document[] = [
        {
          ...mockPosts[0],
          $createdAt: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
        },
        {
          ...mockPosts[1],
          $createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          ...mockPosts[2],
          $createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
      ];

      mockGetPosts.mockResolvedValue({ documents: timeDiversePosts } as any);

      render(<AllPosts />);

      await waitFor(() => {
        expect(screen.getByText(/30 seconds ago/)).toBeInTheDocument();
        expect(screen.getByText(/1 hours ago/)).toBeInTheDocument();
        expect(screen.getByText(/1 days ago/)).toBeInTheDocument();
      });
    });
  });
});
