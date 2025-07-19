import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { signUpThunk } from "../../store/users.thunks";
import * as userServices from "../../services/users.services";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../../store/users.slice";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import SignUpForm from "./signUpForm";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

vi.mock("../../store/users.thunks");
vi.mock("../../services/users.services");
vi.mock("sonner", () => ({
  Toaster: () => <div data-testid="toaster" />,
  toast: {
    error: vi.fn(),
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
        <SignUpForm />
      </BrowserRouter>
    </Provider>
  );
};

const validFormData = {
  name: "Test User",
  username: "testuser",
  email: "test@example.com",
  password: "password123",
};

const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
  const nameInput = document.getElementById("name") as HTMLInputElement;
  const usernameInput = document.getElementById("username") as HTMLInputElement;
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;

  await user.type(nameInput, validFormData.name);
  await user.type(usernameInput, validFormData.username);
  await user.type(emailInput, validFormData.email);
  await user.type(passwordInput, validFormData.password);
};

describe("SignUp Form", () => {
  let user: ReturnType<typeof userEvent.setup>;
  const mockSignUpThunk = signUpThunk as unknown as Mock;
  const mockIsUsernameAvailable = userServices.isUsernameAvailable as Mock;
  const mockSendVerificationEmail = userServices.sendVerificationEmail as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();

    mockSignUpThunk.mockImplementation((data) => async () => ({
      type: "signUpThunk/fulfilled",
      payload: { userId: "123", username: data.username },
    }));

    mockIsUsernameAvailable.mockResolvedValue(true);
    mockSendVerificationEmail.mockResolvedValue(true);

    (signUpThunk.fulfilled as any).match = vi.fn().mockImplementation(
      (action) => action.type === "signUpThunk/fulfilled"
    );
    (signUpThunk.rejected as any).match = vi.fn().mockImplementation(
      (action) => action.type === "signUpThunk/rejected"
    );
  });

  describe("rendering", () => {
    it("should render all form elements", () => {
      renderWithProvider();

      expect(
        screen.getByRole("heading", { name: /create account/i })
      ).toBeInTheDocument();

      expect(document.getElementById("name")).toBeInTheDocument();
      expect(document.getElementById("username")).toBeInTheDocument();
      expect(document.getElementById("email")).toBeInTheDocument();
      expect(document.getElementById("password")).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /create account/i })
      ).toBeInTheDocument();
      expect(screen.getByText("Already a user?")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /login/i })
      ).toBeInTheDocument();
    });

    it("should render error message when error exists in state", () => {
      const store = createMockStore({ error: "Server error occurred" });
      renderWithProvider(store);

      expect(screen.getByText("Server error occurred")).toBeInTheDocument();
    });

    it("should show loading state when isLoading is true", () => {
      const store = createMockStore({ isLoading: true });
      renderWithProvider(store);

      expect(screen.getByText(/creating account.../i)).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should show validation errors for empty fields", async () => {
      renderWithProvider();

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(
          screen.getByText(/Username must be at least 3 characters/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
        expect(
          screen.getByText(/Password must be at least 8 characters/i)
        ).toBeInTheDocument();
      });
    });

    it("should show validation error for invalid email", async () => {
      renderWithProvider();

      const emailInput = document.getElementById("email") as HTMLInputElement;
      await user.type(emailInput, "Invalid-email");

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("should check username availability before signup", async () => {
      renderWithProvider();
      await fillForm(user);

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockIsUsernameAvailable).toHaveBeenCalledWith(
          validFormData.username
        );
      });
    });

    it("should show error toast when username is not available", async () => {
      mockIsUsernameAvailable.mockResolvedValue(false);
      renderWithProvider();
      await fillForm(user);

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Username already taken");
        expect(mockSignUpThunk).not.toHaveBeenCalled();
      });
    });

    it("should dispatch signUpThunk and navigate when successful", async () => {
      const store = createMockStore();
      const mockDispatch = vi.fn().mockResolvedValue({
        type: "signUpThunk/fulfilled",
        payload: { userId: "123", username: "testuser" },
      });
      store.dispatch = mockDispatch;

      renderWithProvider(store);
      await fillForm(user);

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSendVerificationEmail).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/verify-email");
      });
    });

    it("should show error toast on signup failure", async () => {
      const store = createMockStore();
      const mockDispatch = vi.fn().mockResolvedValue({
        type: "signUpThunk/rejected",
        error: { message: "Signup failed" },
      });
      store.dispatch = mockDispatch;

      renderWithProvider(store);
      await fillForm(user);

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Signup failed");
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate to login when login button is clicked", async () => {
      renderWithProvider();

      const loginButton = screen.getByRole("button", { name: /login/i });
      await user.click(loginButton);

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  describe("Accessibility", () => {
    it("should have proper form structure", () => {
      renderWithProvider();

      expect(document.getElementById("name")).toBeInTheDocument();
      expect(document.getElementById("username")).toBeInTheDocument();
      expect(document.getElementById("email")).toBeInTheDocument();
      expect(document.getElementById("password")).toBeInTheDocument();
    });

    it("should have password input type", () => {
      renderWithProvider();
      const passwordInput = document.getElementById("password");
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Form Input Changes", () => {
    it("should update input values when user types", async () => {
      renderWithProvider();

      const nameInput = document.getElementById("name") as HTMLInputElement;
      const usernameInput = document.getElementById("username") as HTMLInputElement;
      const emailInput = document.getElementById("email") as HTMLInputElement;
      const passwordInput = document.getElementById("password") as HTMLInputElement;

      await user.type(nameInput, "John Doe");
      await user.type(usernameInput, "johndoe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInput, "password123");

      expect(nameInput).toHaveValue("John Doe");
      expect(usernameInput).toHaveValue("johndoe");
      expect(emailInput).toHaveValue("john@example.com");
      expect(passwordInput).toHaveValue("password123");
    });
  });
});
