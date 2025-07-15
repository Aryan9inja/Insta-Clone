import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  signUp,
  login,
  getCurrentUser,
  logout,
} from "../services/users.services";
import type { SignupFormData } from "../schemas/signUp.schema";
import type { LoginFormData } from "../schemas/login.schema";

export const signUpThunk = createAsyncThunk(
  "users/signup",
  async (formData: SignupFormData, { rejectWithValue }) => {
    try {
      return await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.username
      );
    } catch (error: any) {
      return rejectWithValue(error?.message || "Signup Failed");
    }
  }
);

export const loginThunk = createAsyncThunk(
  "users/login",
  async (formData: LoginFormData, { rejectWithValue }) => {
    try {
      await login(formData.email, formData.password);

      return await getCurrentUser();
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
      return await getCurrentUser();
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch current user");
    }
  }
);
