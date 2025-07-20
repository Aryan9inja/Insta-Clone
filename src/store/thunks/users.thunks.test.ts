import { configureStore } from "@reduxjs/toolkit";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  signUpThunk,
  loginThunk,
  logoutThunk,
  getUserThunk,
} from "./users.thunks";
import * as userServices from "../../services/users.services";
import { account } from "../../lib/appwrite.config";
import type { Models } from "appwrite";

vi.mock("../../services/users.services", () => ({
  signUp: vi.fn(),
  login: vi.fn(),
  getCurrentUser: vi.fn(),
  logout: vi.fn(),
  createUserProfile: vi.fn(),
}));

vi.mock("../../lib/appwrite.config", () => ({
  account: {
    get: vi.fn(),
  },
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      users: (state = {}) => state,
    },
  });
};

describe("User Thunks", () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("signUpThunk", () => {
    const mockSignupFormData = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      username: "testuser",
    };

    const mockAccountUser: Models.User<Models.Preferences> = {
      $id: "user_123",
      email: "test@example.com",
      name: "Test User",
      $createdAt: "2023-01-01T00:00:00.000Z",
      $updatedAt: "2023-01-01T00:00:00.000Z",
      status: true,
      registration: "2023-01-01T00:00:00.000Z",
      passwordUpdate: "2023-01-01T00:00:00.000Z",
      emailVerification: false,
      phone: "",
      phoneVerification: false,
      prefs: {},
      accessedAt: "2023-01-01T00:00:00.000Z",
      labels: [],
      mfa: false,
      targets: [],
    };

    const mockFullUser = {
      userId: "user123",
      username: "testuser",
      name: "Test User",
      profile_Img: "default-img-id",
    };

    it("should handle successful signup", async () => {
      // Arrange
      vi.mocked(userServices.signUp).mockResolvedValue(mockAccountUser);
      vi.mocked(userServices.createUserProfile).mockResolvedValue({} as any);
      vi.mocked(userServices.getCurrentUser).mockResolvedValue(mockFullUser);

      // Act
      const result = await store.dispatch(signUpThunk(mockSignupFormData));

      // Assert
      expect(result.type).toBe("users/signup/fulfilled");
      expect(result.payload).toEqual(mockFullUser);
      expect(userServices.signUp).toHaveBeenCalledWith(
        mockSignupFormData.email,
        mockSignupFormData.password,
        mockSignupFormData.name
      );
      expect(userServices.createUserProfile).toHaveBeenCalledWith(
        mockAccountUser.$id,
        mockSignupFormData.username,
        mockSignupFormData.name
      );
      expect(userServices.getCurrentUser).toHaveBeenCalledWith(
        mockAccountUser.$id
      );
    });

    it("should handle signup failure with error message", async () => {
      // Arrange
      const errorMessage = "Email already exists";
      vi.mocked(userServices.signUp).mockRejectedValue(new Error(errorMessage));

      // Act
      const result = await store.dispatch(signUpThunk(mockSignupFormData));

      // Assert
      expect(result.type).toBe("users/signup/rejected");
      expect(result.payload).toBe(errorMessage);
    });

    it("should handle signup failure without error message", async () => {
      // Arrange
      vi.mocked(userServices.signUp).mockRejectedValue(new Error());

      // Act
      const result = await store.dispatch(signUpThunk(mockSignupFormData));

      // Assert
      expect(result.type).toBe("users/signup/rejected");
      expect(result.payload).toBe("Signup Failed");
    });

    it("should handle createUserProfile failure", async () => {
      // Arrange
      vi.mocked(userServices.signUp).mockResolvedValue(mockAccountUser);
      vi.mocked(userServices.createUserProfile).mockRejectedValue(
        new Error("Profile creation failed")
      );

      // Act
      const result = await store.dispatch(signUpThunk(mockSignupFormData));

      // Assert
      expect(result.type).toBe("users/signup/rejected");
      expect(result.payload).toBe("Profile creation failed");
    });
  });

  describe("loginThunk", () => {
    const mockLoginFormData = {
      email: "test@example.com",
      password: "password123",
    };

    const mockUser: Models.User<Models.Preferences> = {
      $id: "user123",
      email: "test@example.com",
      name: "Test User",
      $createdAt: "2023-01-01T00:00:00.000Z",
      $updatedAt: "2023-01-01T00:00:00.000Z",
      status: true,
      registration: "2023-01-01T00:00:00.000Z",
      passwordUpdate: "2023-01-01T00:00:00.000Z",
      emailVerification: false,
      phone: "",
      phoneVerification: false,
      prefs: {},
      accessedAt: "2023-01-01T00:00:00.000Z",
      labels: [],
      mfa: false,
      targets: [],
    };

    const mockFullUser = {
      userId: "user123",
      username: "testuser",
      name: "Test User",
      profile_Img: "default-img-id",
    };

    it("should handle successful login", async () => {
      // Arrange
      vi.mocked(userServices.login).mockResolvedValue(mockUser);
      vi.mocked(userServices.getCurrentUser).mockResolvedValue(mockFullUser);

      // Act
      const result = await store.dispatch(loginThunk(mockLoginFormData));

      // Assert
      expect(result.type).toBe("users/login/fulfilled");
      expect(result.payload).toEqual(mockFullUser);
      expect(userServices.login).toHaveBeenCalledWith(
        mockLoginFormData.email,
        mockLoginFormData.password
      );
      expect(userServices.getCurrentUser).toHaveBeenCalledWith(mockUser.$id);
    });

    it("should handle login failure with error message", async () => {
      // Arrange
      const errorMessage = "Invalid credentials";
      vi.mocked(userServices.login).mockRejectedValue(new Error(errorMessage));

      // Act
      const result = await store.dispatch(loginThunk(mockLoginFormData));

      // Assert
      expect(result.type).toBe("users/login/rejected");
      expect(result.payload).toBe(errorMessage);
    });

    it("should handle login failure without error message", async () => {
      // Arrange
      vi.mocked(userServices.login).mockRejectedValue(new Error());

      // Act
      const result = await store.dispatch(loginThunk(mockLoginFormData));

      // Assert
      expect(result.type).toBe("users/login/rejected");
      expect(result.payload).toBe("Login failed");
    });

    it("should handle getCurrentUser failure after successful login", async () => {
      // Arrange
      vi.mocked(userServices.login).mockResolvedValue(mockUser);
      vi.mocked(userServices.getCurrentUser).mockRejectedValue(
        new Error("Failed to get user profile")
      );

      // Act
      const result = await store.dispatch(loginThunk(mockLoginFormData));

      // Assert
      expect(result.type).toBe("users/login/rejected");
      expect(result.payload).toBe("Failed to get user profile");
    });
  });

  describe("logoutThunk", () => {
    it("should handle successful logout", async () => {
      // Arrange
      vi.mocked(userServices.logout).mockResolvedValue(undefined);

      // Act
      const result = await store.dispatch(logoutThunk());

      // Assert
      expect(result.type).toBe("users/logout/fulfilled");
      expect(result.payload).toBe(true);
      expect(userServices.logout).toHaveBeenCalledTimes(1);
    });

    it("should handle logout failure with error message", async () => {
      // Arrange
      const errorMessage = "Session not found";
      vi.mocked(userServices.logout).mockRejectedValue(new Error(errorMessage));

      // Act
      const result = await store.dispatch(logoutThunk());

      // Assert
      expect(result.type).toBe("users/logout/rejected");
      expect(result.payload).toBe(errorMessage);
    });

    it("should handle logout failure without error message", async () => {
      // Arrange
      vi.mocked(userServices.logout).mockRejectedValue(new Error());

      // Act
      const result = await store.dispatch(logoutThunk());

      // Assert
      expect(result.type).toBe("users/logout/rejected");
      expect(result.payload).toBe("Logout failed");
    });
  });

  describe("getUserThunk", () => {
    const mockAccountUser: Models.User<Models.Preferences> = {
      $id: "user_123",
      email: "test@example.com",
      name: "Test User",
      $createdAt: "2023-01-01T00:00:00.000Z",
      $updatedAt: "2023-01-01T00:00:00.000Z",
      status: true,
      registration: "2023-01-01T00:00:00.000Z",
      passwordUpdate: "2023-01-01T00:00:00.000Z",
      emailVerification: false,
      phone: "",
      phoneVerification: false,
      prefs: {},
      accessedAt: "2023-01-01T00:00:00.000Z",
      labels: [],
      mfa: false,
      targets: [],
    };

    const mockFullUser = {
      userId: "user123",
      username: "testuser",
      name: "Test User",
      profile_Img: "default-img-id",
    };

    it("should handle successful user fetch", async () => {
      // Arrange
      vi.mocked(account.get).mockResolvedValue(mockAccountUser);
      vi.mocked(userServices.getCurrentUser).mockResolvedValue(mockFullUser);

      // Act
      const result = await store.dispatch(getUserThunk());

      // Assert
      expect(result.type).toBe("users/getUser/fulfilled");
      expect(result.payload).toEqual(mockFullUser);
      expect(account.get).toHaveBeenCalledTimes(1);
      expect(userServices.getCurrentUser).toHaveBeenCalledWith(
        mockAccountUser.$id
      );
    });

    it("should handle account.get failure", async () => {
      // Arrange
      const errorMessage = "User not authenticated";
      vi.mocked(account.get).mockRejectedValue(new Error(errorMessage));

      // Act
      const result = await store.dispatch(getUserThunk());

      // Assert
      expect(result.type).toBe("users/getUser/rejected");
      expect(result.payload).toBe(errorMessage);
      expect(account.get).toHaveBeenCalledTimes(1);
      expect(userServices.getCurrentUser).not.toHaveBeenCalled();
    });

    it("should handle getCurrentUser failure", async () => {
      // Arrange
      vi.mocked(account.get).mockResolvedValue(mockAccountUser);
      vi.mocked(userServices.getCurrentUser).mockRejectedValue(
        new Error("User profile not found")
      );

      // Act
      const result = await store.dispatch(getUserThunk());

      // Assert
      expect(result.type).toBe("users/getUser/rejected");
      expect(result.payload).toBe("User profile not found");
      expect(account.get).toHaveBeenCalledTimes(1);
      expect(userServices.getCurrentUser).toHaveBeenCalledWith(
        mockAccountUser.$id
      );
    });

    it("should handle failure without error message", async () => {
      // Arrange
      vi.mocked(account.get).mockRejectedValue(new Error());

      // Act
      const result = await store.dispatch(getUserThunk());

      // Assert
      expect(result.type).toBe("users/getUser/rejected");
      expect(result.payload).toBe("Failed to fetch current user");
    });
  });
});
