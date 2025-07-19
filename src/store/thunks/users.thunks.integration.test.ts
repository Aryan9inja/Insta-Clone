import { configureStore } from "@reduxjs/toolkit";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { signUpThunk, loginThunk, getUserThunk } from "./users.thunks";
import * as userServices from "../../services/users.services";
import { account } from "../../lib/appwrite.config";
import { createSlice } from "@reduxjs/toolkit";
import type { UserState } from "../slices/users.slice";

// Mocks
vi.mock("../../services/users.services");
vi.mock("../../lib/appwrite.config");

// Initial state
const initialState: UserState = {
  user: null,
  isLoading: false,
  isLoggedIn: false,
  error: null,
};

// Slice for testing
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Setup store and type
const createTestStore = () =>
  configureStore({
    reducer: {
      users: usersSlice.reducer,
    },
  });

type RootState = ReturnType<ReturnType<typeof createTestStore>["getState"]>;
type TestAppDispatch = ReturnType<typeof createTestStore>["dispatch"];

// Tests
describe("User Thunks Integration Tests", () => {
  let store: ReturnType<typeof createTestStore>;
  let dispatch: TestAppDispatch;

  beforeEach(() => {
    store = createTestStore();
    dispatch = store.dispatch;
    vi.clearAllMocks();
  });

  it("should handle complete signup flow", async () => {
    const formData = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      username: "testuser",
    };

    const mockAccountUser = { $id: "user123" };
    const mockFullUser = {
      userId: "user123",
      username: "testuser",
      name: "Test User",
      profile_Img: "img-id",
    };

    vi.mocked(userServices.signUp).mockResolvedValue(mockAccountUser as any);
    vi.mocked(userServices.createUserProfile).mockResolvedValue({} as any);
    vi.mocked(userServices.getCurrentUser).mockResolvedValue(mockFullUser);

    const result = await dispatch(signUpThunk(formData));

    const state = store.getState() as RootState;

    expect(result.type).toBe(signUpThunk.fulfilled.type);
    expect(state.users.user).toEqual(mockFullUser);
    expect(state.users.isLoading).toBe(false);
    expect(state.users.error).toBe(null);
  });

  it("should handle complete login and get user flow", async () => {
    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    const mockAccountUser = {
      $id: "user123",
      $createdAt: "",
      $updatedAt: "",
      name: "Test User",
      email: "test@example.com",
      registration: "",
      status: true,
      passwordUpdate: "",
      emailVerification: false,
      prefs: {},
    };

    const mockFullUser = {
      userId: "user123",
      username: "testuser",
      name: "Test User",
      profile_Img: "img-id",
    };

    vi.mocked(userServices.login).mockResolvedValue(mockAccountUser as any);
    vi.mocked(userServices.getCurrentUser).mockResolvedValue(mockFullUser);
    vi.mocked(account.get).mockResolvedValue(mockAccountUser as any);

    const loginResult = await dispatch(loginThunk(loginData));
    const getUserResult = await dispatch(getUserThunk());

    const state = store.getState() as RootState;

    expect(loginResult.type).toBe(loginThunk.fulfilled.type);
    expect(getUserResult.type).toBe(getUserThunk.fulfilled.type);
    expect(state.users.user).toEqual(mockFullUser);
    expect(state.users.isLoading).toBe(false);
    expect(state.users.error).toBe(null);
  });

  it("should handle error states properly", async () => {
    const loginData = {
      email: "invalid@example.com",
      password: "wrongpassword",
    };

    vi.mocked(userServices.login).mockRejectedValue(
      new Error("Invalid credentials")
    );

    const result = await dispatch(loginThunk(loginData));
    const state = store.getState() as RootState;

    expect(result.type).toBe(loginThunk.rejected.type);
    expect(state.users.user).toBe(null);
    expect(state.users.isLoading).toBe(false);
    expect(state.users.error).toBe("Invalid credentials");
  });
});
