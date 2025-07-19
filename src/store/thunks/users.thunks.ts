import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  signUp,
  login,
  getCurrentUser,
  logout,
  createUserProfile,
} from "../../services/users.services";
import type { SignupFormData } from "../../schemas/signUp.schema";
import type { LoginFormData } from "../../schemas/login.schema";
import { account } from "../../lib/appwrite.config";

export const signUpThunk = createAsyncThunk(
  "users/signup",
  async (formData: SignupFormData, { rejectWithValue }) => {
    try {
      const acountUser = await signUp(
        formData.email,
        formData.password,
        formData.name
      );

      await createUserProfile(acountUser.$id, formData.username, formData.name);

      const fullUser = getCurrentUser(acountUser.$id);
      return fullUser;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Signup Failed");
    }
  }
);

export const loginThunk = createAsyncThunk(
  "users/login",
  async (formData: LoginFormData, { rejectWithValue }) => {
    try {
      const user = await login(formData.email, formData.password);

      return await getCurrentUser(user.$id);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Login failed");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "users/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      return true;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Logout failed");
    }
  }
);

export const getUserThunk = createAsyncThunk(
  "users/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await account.get();

      const fullUser = await getCurrentUser(user.$id);
      console.log("Fetched full user:", fullUser);
      return fullUser;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch current user");
    }
  }
);
