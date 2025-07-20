import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, vi, describe, it, expect, type Mock } from "vitest";
import ProtectedRoute from "./protectedRoute";
import { render, screen } from "@testing-library/react";
import { useAppSelector } from "../../hooks/useRedux";

vi.mock("../../hooks/useRedux", () => ({
    useAppSelector: vi.fn(),
}));
const mockUseAppSelector = useAppSelector as Mock;

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => {
      mockNavigate(to);
      return <div data-testid="navigate">{`Redirecting to ${to}`}</div>;
    },
  };
});

const createMockStore = () => {
  return configureStore({
    reducer: {
      users: (state = {}) => state,
    },
  });
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createMockStore();
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

const TestChildren = () => (
  <div data-testid="protected-content">Protected Content</div>
);

describe("Protected Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when user is authenticated", () => {
    beforeEach(() => {
      mockUseAppSelector.mockReturnValue({
        user: { id: "1", username: "testuser" },
        isLoading: false,
      });
    });

    it("should render children when user is logged in", () => {
      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestChildren />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
      expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
    });

    it("should not redirect when user exists", () => {
      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestChildren />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("when user is not authentcated", () => {
    beforeEach(() => {
      mockUseAppSelector.mockReturnValue({
        user: null,
        isLoading: false,
      });
    });

    it("should redirect to login when user is null", () => {
      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestChildren />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId("navigate")).toBeInTheDocument();
      expect(screen.getByText("Redirecting to /login")).toBeInTheDocument();
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("should redirect to /login path", () => {
      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestChildren />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("should redirect when user is undefined", () => {
      mockUseAppSelector.mockReturnValue({
        user: undefined,
        isLoading: false,
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestChildren />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId("navigate")).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("should redirect when user is false", () => {
      mockUseAppSelector.mockReturnValue({
        user: false,
        isLoading: false,
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestChildren />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId("navigate")).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  describe("when loading", () => {
    beforeEach(() => {
      mockUseAppSelector.mockReturnValue({
        user: null,
        isLoading: true,
      });
    });

    it("should show loading when isLoading is true", () => {
      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestChildren />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
      expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
    });

    it("should not redirect while loading", () => {
      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestChildren />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should show loading even when user exists but isLoading is true", () => {
      mockUseAppSelector.mockReturnValue({
        user: { id: "1", username: "testuser" },
        isLoading: true,
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestChildren />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });
  });

  describe("children rendering", () => {
    beforeEach(() => {
      mockUseAppSelector.mockReturnValue({
        user: { id: "1", username: "testuser" },
        isLoading: false,
      });
    });

    it("should render multiple children", () => {
      render(
        <TestWrapper>
          <ProtectedRoute>
            <div data-testid="child-1">Child 1</div>
            <div data-testid="child-2">Child 2</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
    });

    it("should render complex nested children", () => {
      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>
              <h1 data-testid="title">Dashboard</h1>
              <div data-testid="content">
                <p>Welcome to the protected area</p>
              </div>
            </div>
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId("title")).toBeInTheDocument();
      expect(screen.getByTestId("content")).toBeInTheDocument();
      expect(
        screen.getByText("Welcome to the protected area")
      ).toBeInTheDocument();
    });

    it("should handle string children", () => {
      render(
        <TestWrapper>
          <ProtectedRoute>Protected text content</ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText("Protected text content")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle empty user object", () => {
      mockUseAppSelector.mockReturnValue({
        user: {},
        isLoading: false,
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestChildren />
          </ProtectedRoute>
        </TestWrapper>
      );

      // Empty object is truthy, so it should render children
      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
      expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
    });

    it("should handle missing isLoading property", () => {
      mockUseAppSelector.mockReturnValue({
        user: { id: "1", username: "testuser" },
        // isLoading is undefined
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestChildren />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    it("should handle missing user property", () => {
      mockUseAppSelector.mockReturnValue({
        // user is undefined
        isLoading: false,
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestChildren />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId("navigate")).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
