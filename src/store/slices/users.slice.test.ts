import type { User, UserState } from "./users.slice";
import { describe, expect, it } from "vitest";
import userReducer, { resetUserState } from "./users.slice";
import {
  getUserThunk,
  loginThunk,
  logoutThunk,
  signUpThunk,
} from "../thunks/users.thunks";

const mockUser: User = {
  userId: "abc123",
  username: "testuser",
  name: "Test User",
  profile_Img: "ax1gt345",
};

describe("userSlice", () => {
  const initialState: UserState = {
    user: null,
    isLoggedIn: false,
    isLoading: true,
    error: null,
  };

  const getStateAfterAction = (action: any, prevState = initialState) =>
    userReducer(prevState, action);

  it("should return the initial state", () => {
    const nextState = getStateAfterAction({ type: undefined });
    expect(nextState).toEqual(initialState);
  });

  it("should handle resetUserState", () => {
    const prevState: UserState = {
      user: mockUser,
      isLoading: false,
      isLoggedIn: true,
      error: "some error",
    };
    const nextState = getStateAfterAction(resetUserState(), prevState);
    expect(nextState).toEqual(initialState);
  });

  describe("signupThunk", () => {
    it("should handle pending", () => {
      const nextState = getStateAfterAction({ type: signUpThunk.pending.type });
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it("should handle fulfilled", () => {
      const nextState = getStateAfterAction({
        type: signUpThunk.fulfilled.type,
        payload: mockUser,
      });
      expect(nextState.isLoading).toBe(false);
      expect(nextState.isLoggedIn).toBe(true);
      expect(nextState.user).toEqual(mockUser);
    });

    it("should handle reject", () => {
      const errorMsg = "SignUp Failed";
      const nextState = getStateAfterAction({
        type: signUpThunk.rejected.type,
        payload: errorMsg,
      });
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMsg);
    });
  });

  describe("loginThunk", () => {
    it("should handle pending", () => {
      const nextState = getStateAfterAction({ type: loginThunk.pending.type });
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it("should handle fulfilled", () => {
      const nextState = getStateAfterAction({
        type: signUpThunk.fulfilled.type,
        payload: mockUser,
      });
      expect(nextState.isLoading).toBe(false);
      expect(nextState.isLoggedIn).toBe(true);
      expect(nextState.user).toEqual(mockUser);
    });

    it("should handle reject", () => {
      const errorMsg = "Login Failed";
      const nextState = getStateAfterAction({
        type: loginThunk.rejected.type,
        payload: errorMsg,
      });
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMsg);
    });
  });

  describe("getUserThunk", () => {
    it("should handle pending", () => {
      const nextState = getStateAfterAction({
        type: getUserThunk.pending.type,
      });
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it("should handle fulfilled", () => {
      const nextState = getStateAfterAction({
        type: getUserThunk.fulfilled.type,
        payload: mockUser,
      });
      expect(nextState.isLoading).toBe(false);
      expect(nextState.isLoggedIn).toBe(true);
      expect(nextState.user).toEqual(mockUser);
    });

    it("should handle reject", () => {
      const errorMsg = "Get user failed";
      const nextState = getStateAfterAction({
        type: getUserThunk.rejected.type,
        payload: errorMsg,
      });
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMsg);
    });
  });

  describe("logoutThunk", () => {
    it("should handle pending", () => {
      const nextState = getStateAfterAction({
        type: logoutThunk.pending.type,
      });
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it("should handle fulfilled", () => {
      const prevState: UserState = {
        user: mockUser,
        isLoading: false,
        isLoggedIn: true,
        error: "some error",
      };
      const nextState = getStateAfterAction({
        type: logoutThunk.fulfilled.type,
        payload: mockUser,
      },prevState);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.isLoggedIn).toBe(false);
      expect(nextState.user).toBeNull();
    });

    it("should handle reject", () => {
      const errorMsg = "Logout failed";
      const nextState = getStateAfterAction({
        type: getUserThunk.rejected.type,
        payload: errorMsg,
      });
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMsg);
    });
  });
});
