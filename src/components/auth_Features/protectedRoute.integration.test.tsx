import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { useAppSelector } from "../../hooks/useRedux";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("../../hooks/useRedux", () => ({
  useAppSelector: vi.fn(),
}));
const mockUseAppSelector = useAppSelector as Mock;

const createMockStore = () => {
  return configureStore({
    reducer: {
      users: (state = {}) => state,
    },
  });
};

const LoginPage = () => <div data-testid="login-page">Login Page</div>;
const DashboardPage = () => (
  <div data-testid="dashboard-page">Dashboard Page</div>
);

const TestApp = () => {
  const store = createMockStore();

  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("ProtectedRoute Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should integrate properly with React Router when user is authenticated", async () => {
    mockUseAppSelector.mockReturnValue({
      user: { id: "1", username: "testuser" },
      isLoading: false,
    });

    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
  });

  it("should redirect to login and show login page when user is not authenticated", async () => {
    mockUseAppSelector.mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("dashboard-page")).not.toBeInTheDocument();
  });

  it("should show loading state and not redirect during authentication check", async () => {
    mockUseAppSelector.mockReturnValue({
      user: null,
      isLoading: true,
    });

    render(<TestApp />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-page")).not.toBeInTheDocument();
  });
});
