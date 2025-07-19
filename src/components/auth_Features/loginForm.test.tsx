import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "./loginForm";
import userReducer from "../../store/slices/users.slice";
import { loginThunk } from "../../store/thunks/users.thunks";
import { toast } from "sonner";

const mockLoginThunk = vi.fn();
vi.mock("../../store/users.thunks", () => ({
  loginThunk: mockLoginThunk,
}));
vi.mock("sonner", () => ({
  Toaster: () => <div data-testid="toaster" />,
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      users: userReducer,
    },
    preloadedState: {
      users: {
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: null,
        ...initialState,
      },
    },
  });
};

const renderWithProvider = (store = createMockStore()) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </Provider>
  );
};

const validLoginData = {
  email: "test@example.com",
  password: "password123",
};

const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(document.getElementById("email")!, validLoginData.email);
  await user.type(
    document.getElementById("password")!,
    validLoginData.password
  );
};

describe("LoginForm", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();

    mockLoginThunk.mockImplementation((data) => async () => ({
      type: "loginThunk/fulfilled",
      payload: { userId: "123", username: data.email },
    }));

    (loginThunk.fulfilled as any).match = vi
      .fn()
      .mockImplementation((action) => action.type === "loginThunk/fulfilled");
    (loginThunk.rejected as any).match = vi
      .fn()
      .mockImplementation((action) => action.type === "loginThunk/rejected");
  });

  describe("Rendering", () => {
    it("should render all elements", () => {
      renderWithProvider();

      expect(
        screen.getByRole("heading", { name: /login to your account/i })
      ).toBeInTheDocument();

      expect(document.getElementById("email")).toBeInTheDocument();
      expect(document.getElementById("password")).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /login/i })
      ).toBeInTheDocument();
      expect(screen.getByText("New here?")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create an account/i })
      ).toBeInTheDocument();
    });

    it("should show error message when error exists in state", () => {
      const store = createMockStore({ error: "Invalid credentials" });
      renderWithProvider(store);

      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    it("should show loading state when isLoading is true", () => {
      const store = createMockStore({ isLoading: true });
      renderWithProvider(store);

      expect(screen.getByText(/logging in\.\.\./i)).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("should show validation errors for empty fields", async () => {
      renderWithProvider();

      const loginBtn = screen.getByRole("button", { name: /login/i });
      await user.click(loginBtn);

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
        expect(
          screen.getByText(/password must be at least 8 characters/i)
        ).toBeInTheDocument();
      });
    });

    it("should show error for invalid email", async () => {
      renderWithProvider();

      const emailInput = document.getElementById("email")!;
      await user.type(emailInput, "invalid-email");

      const loginBtn = screen.getByRole("button", { name: /login/i });
      await user.click(loginBtn);

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("should dispatch loginThunk and navigate on success", async () => {
      const store = createMockStore();
      const mockDispatch = vi.fn().mockResolvedValue({
        type: "loginThunk/fulfilled",
        payload: { userId: "123" },
      });
      store.dispatch = mockDispatch;

      renderWithProvider(store);
      await fillForm(user);

      const loginBtn = screen.getByRole("button", { name: /login/i });
      await user.click(loginBtn);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/");
        expect(toast.success).toHaveBeenCalledWith("Login successful");
      });
    });

    it("should show toast on login failure", async () => {
      const store = createMockStore();
      const mockDispatch = vi.fn().mockResolvedValue({
        type: "loginThunk/rejected",
        error: { message: "Invalid credentials" },
      });
      store.dispatch = mockDispatch;

      renderWithProvider(store);
      await fillForm(user);

      const loginBtn = screen.getByRole("button", { name: /login/i });
      await user.click(loginBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Login failed. Please check your credentials."
        );
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate to signup page when button clicked", async () => {
      renderWithProvider();

      const signupBtn = screen.getByRole("button", {
        name: /create an account/i,
      });
      await user.click(signupBtn);

      expect(mockNavigate).toHaveBeenCalledWith("/signup");
    });
  });

  describe("Accessibility & Inputs", () => {
    it("should update input values when typing", async () => {
      renderWithProvider();

      const emailInput = document.getElementById("email") as HTMLInputElement;
      const passwordInput = document.getElementById(
        "password"
      ) as HTMLInputElement;

      await user.type(emailInput, validLoginData.email);
      await user.type(passwordInput, validLoginData.password);

      expect(emailInput).toHaveValue(validLoginData.email);
      expect(passwordInput).toHaveValue(validLoginData.password);
    });

    it("should have password input type", () => {
      renderWithProvider();
      const passwordInput = document.getElementById("password");
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });
});
