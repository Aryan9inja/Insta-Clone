import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PostCard from "./postCard";

const defaultProps = {
  username: "testuser",
  user_Img: "https://example.com/user-avatar.jpg",
  post_Img: "https://example.com/post-image.jpg",
  creationTime: "2024-01-01T12:00:00.000Z",
  caption: "This is a test caption",
};

describe("PostCard", () => {
  describe("Rendering", () => {
    it("should render all required elements", () => {
      render(<PostCard {...defaultProps} />);

      // Check header elements
      expect(screen.getByText(defaultProps.username)).toBeInTheDocument();
      
      // Check images
      const userImage = screen.getByAltText(defaultProps.username);
      expect(userImage).toBeInTheDocument();
      expect(userImage).toHaveAttribute("src", defaultProps.user_Img);

      const postImage = screen.getByAltText("Post");
      expect(postImage).toBeInTheDocument();
      expect(postImage).toHaveAttribute("src", defaultProps.post_Img);

      // Check caption
      expect(screen.getByText(defaultProps.caption)).toBeInTheDocument();
    });

    it("should render with correct CSS classes", () => {
      const { container } = render(<PostCard {...defaultProps} />);

      const postCard = container.firstChild as HTMLElement;
      expect(postCard).toHaveClass(
        "w-full",
        "md:w-8/12",
        "rounded-xl",
        "overflow-hidden",
        "mb-3",
        "mt-3",
        "shadow-md",
        "bg-[var(--color-light-card)]",
        "dark:bg-[var(--color-dark-card)]"
      );
    });

    it("should render user avatar with correct classes", () => {
      render(<PostCard {...defaultProps} />);

      const userImage = screen.getByAltText(defaultProps.username);
      expect(userImage).toHaveClass(
        "w-10",
        "h-10",
        "rounded-full",
        "object-cover"
      );
    });

    it("should render post image with correct classes", () => {
      render(<PostCard {...defaultProps} />);

      const postImage = screen.getByAltText("Post");
      expect(postImage).toHaveClass(
        "w-full",
        "max-h-[500px]",
        "object-contain"
      );
    });

    it("should render username with correct styling", () => {
      render(<PostCard {...defaultProps} />);

      const usernameElement = screen.getByText(defaultProps.username);
      expect(usernameElement).toHaveClass(
        "font-medium",
        "text-sm",
        "text-[var(--color-light-text)]",
        "dark:text-[var(--color-dark-text)]"
      );
    });
  });

  describe("Time Display", () => {
    it("should display seconds ago for recent posts", () => {
      const recentTime = new Date(Date.now() - 30 * 1000).toISOString(); // 30 seconds ago
      render(<PostCard {...defaultProps} creationTime={recentTime} />);

      expect(screen.getByText(/30 seconds ago/)).toBeInTheDocument();
    });

    it("should display minutes ago for posts from minutes ago", () => {
      const minutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 minutes ago
      render(<PostCard {...defaultProps} creationTime={minutesAgo} />);

      expect(screen.getByText(/5 minutes ago/)).toBeInTheDocument();
    });

    it("should display hours ago for posts from hours ago", () => {
      const hoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(); // 3 hours ago
      render(<PostCard {...defaultProps} creationTime={hoursAgo} />);

      expect(screen.getByText(/3 hours ago/)).toBeInTheDocument();
    });

    it("should display days ago for posts from days ago", () => {
      const daysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 days ago
      render(<PostCard {...defaultProps} creationTime={daysAgo} />);

      expect(screen.getByText(/2 days ago/)).toBeInTheDocument();
    });

    it("should display time with correct styling", () => {
      render(<PostCard {...defaultProps} />);

      const timeElement = screen.getByText(/ago/);
      expect(timeElement).toHaveClass(
        "text-xs",
        "text-[var(--color-light-border)]",
        "dark:text-[var(--color-dark-border)]"
      );
    });
  });

  describe("Caption Handling", () => {
    it("should render caption when provided", () => {
      render(<PostCard {...defaultProps} />);

      expect(screen.getByText(defaultProps.caption)).toBeInTheDocument();
    });

    it("should not render caption section when caption is empty string", () => {
      render(<PostCard {...defaultProps} caption="" />);

      expect(screen.queryByText(defaultProps.caption)).not.toBeInTheDocument();
      
      // Check that caption container is not rendered
      const { container } = render(<PostCard {...defaultProps} caption="" />);
      const captionContainer = container.querySelector(".px-4.py-2");
      expect(captionContainer).not.toBeInTheDocument();
    });

    it("should not render caption section when caption is undefined", () => {
      render(<PostCard {...defaultProps} caption={undefined} />);

      // Check that no caption is rendered
      const { container } = render(<PostCard {...defaultProps} caption={undefined} />);
      const captionContainer = container.querySelector(".px-4.py-2");
      expect(captionContainer).not.toBeInTheDocument();
    });

    it("should render caption with correct styling", () => {
      render(<PostCard {...defaultProps} />);

      const captionElement = screen.getByText(defaultProps.caption);
      expect(captionElement).toHaveClass(
        "text-sm",
        "text-[var(--color-light-text)]",
        "dark:text-[var(--color-dark-text)]"
      );
    });
  });

  describe("Header Layout", () => {
    it("should render header with correct layout classes", () => {
      const { container } = render(<PostCard {...defaultProps} />);

      const header = container.querySelector(".flex.items-center.gap-3.p-4");
      expect(header).toBeInTheDocument();
    });

    it("should render user info in correct container", () => {
      const { container } = render(<PostCard {...defaultProps} />);

      // Check that username and time are in the same container
      const userInfoContainer = container.querySelector("div > p");
      expect(userInfoContainer).toBeInTheDocument();
    });
  });

  describe("Image Accessibility", () => {
    it("should have proper alt text for user image", () => {
      render(<PostCard {...defaultProps} />);

      const userImage = screen.getByAltText(defaultProps.username);
      expect(userImage).toBeInTheDocument();
    });

    it("should have proper alt text for post image", () => {
      render(<PostCard {...defaultProps} />);

      const postImage = screen.getByAltText("Post");
      expect(postImage).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long usernames", () => {
      const longUsername = "a".repeat(100);
      render(<PostCard {...defaultProps} username={longUsername} />);

      expect(screen.getByText(longUsername)).toBeInTheDocument();
    });

    it("should handle very long captions", () => {
      const longCaption = "This is a very long caption that goes on and on. ".repeat(20);
      render(<PostCard {...defaultProps} caption={longCaption} />);

      expect(screen.getByText(/This is a very long caption that goes on and on\./)).toBeInTheDocument();
    });

    it("should handle special characters in username", () => {
      const specialUsername = "user@#$%^&*()_+";
      render(<PostCard {...defaultProps} username={specialUsername} />);

      expect(screen.getByText(specialUsername)).toBeInTheDocument();
    });

    it("should handle future dates gracefully", () => {
      const futureTime = new Date(Date.now() + 60 * 1000).toISOString(); // 1 minute in future
      render(<PostCard {...defaultProps} creationTime={futureTime} />);

      // Should still render without crashing
      expect(screen.getByText(defaultProps.username)).toBeInTheDocument();
    });
  });

  describe("getTimeAgo function edge cases", () => {
    it("should handle exactly 1 second", () => {
      const oneSecondAgo = new Date(Date.now() - 1000).toISOString();
      render(<PostCard {...defaultProps} creationTime={oneSecondAgo} />);

      expect(screen.getByText(/1 seconds ago/)).toBeInTheDocument();
    });

    it("should handle exactly 1 minute", () => {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
      render(<PostCard {...defaultProps} creationTime={oneMinuteAgo} />);

      expect(screen.getByText(/1 minutes ago/)).toBeInTheDocument();
    });

    it("should handle exactly 1 hour", () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      render(<PostCard {...defaultProps} creationTime={oneHourAgo} />);

      expect(screen.getByText(/1 hours ago/)).toBeInTheDocument();
    });

    it("should handle exactly 1 day", () => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      render(<PostCard {...defaultProps} creationTime={oneDayAgo} />);

      expect(screen.getByText(/1 days ago/)).toBeInTheDocument();
    });
  });
});