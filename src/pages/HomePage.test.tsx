import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

// Mock the child components
vi.mock("../components/posts/allPosts", () => ({
  default: () => <div data-testid="all-posts">All Posts Component</div>,
}));

vi.mock("../components/ui/menu", () => ({
  default: () => <div data-testid="menu">Menu Component</div>,
}));

describe("HomePage", () => {
  describe("Rendering", () => {
    it("should render all main components", () => {
      render(<HomePage />);

      expect(screen.getByTestId("menu")).toBeInTheDocument();
      expect(screen.getByTestId("all-posts")).toBeInTheDocument();
    });

    it("should render Menu component first", () => {
      const { container } = render(<HomePage />);

      const menuElement = screen.getByTestId("menu");

      // Check that Menu appears before AllPosts in the DOM
      expect(container.firstChild?.firstChild).toBe(menuElement);
    });

    it("should wrap AllPosts in main element with correct classes", () => {
      render(<HomePage />);

      const mainElement = screen.getByRole("main");
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toHaveClass("mb-10", "md:mb-0");
      
      // Check that AllPosts is inside the main element
      expect(mainElement).toContainElement(screen.getByTestId("all-posts"));
    });
  });

  describe("Layout Structure", () => {
    it("should have correct HTML structure", () => {
      const { container } = render(<HomePage />);

      // Check the main container div
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer.tagName).toBe("DIV");

      // Check that it contains Menu and main elements
      expect(mainContainer.children).toHaveLength(2);
      expect(mainContainer.children[0]).toBe(screen.getByTestId("menu"));
      expect(mainContainer.children[1]).toBe(screen.getByRole("main"));
    });

    it("should apply responsive margin classes to main element", () => {
      render(<HomePage />);

      const mainElement = screen.getByRole("main");
      
      // Check for mobile-first margin bottom and desktop override
      expect(mainElement).toHaveClass("mb-10"); // Mobile: margin-bottom: 2.5rem
      expect(mainElement).toHaveClass("md:mb-0"); // Desktop: margin-bottom: 0
    });
  });

  describe("Component Integration", () => {
    it("should render Menu and AllPosts without any props", () => {
      // This test ensures that both components can be rendered without any required props
      expect(() => render(<HomePage />)).not.toThrow();
    });

    it("should maintain component isolation", () => {
      render(<HomePage />);

      // Each component should be rendered independently
      expect(screen.getByTestId("menu")).toBeInTheDocument();
      expect(screen.getByTestId("all-posts")).toBeInTheDocument();
      
      // They should not be nested within each other
      expect(screen.getByTestId("menu")).not.toContainElement(screen.getByTestId("all-posts"));
      expect(screen.getByTestId("all-posts")).not.toContainElement(screen.getByTestId("menu"));
    });
  });

  describe("Accessibility", () => {
    it("should have a main landmark", () => {
      render(<HomePage />);

      const mainElement = screen.getByRole("main");
      expect(mainElement).toBeInTheDocument();
    });

    it("should have semantic HTML structure", () => {
      render(<HomePage />);

      // Check that main content is properly wrapped in main element
      const mainElement = screen.getByRole("main");
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toContainElement(screen.getByTestId("all-posts"));
    });
  });

  describe("Responsive Design", () => {
    it("should apply mobile-first design approach", () => {
      render(<HomePage />);

      const mainElement = screen.getByRole("main");
      
      // Default mobile styling
      expect(mainElement).toHaveClass("mb-10");
      
      // Desktop override
      expect(mainElement).toHaveClass("md:mb-0");
    });
  });
});