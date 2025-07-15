import { createSlice } from "@reduxjs/toolkit";
import {
  signUpThunk,
  loginThunk,
  getUserThunk,
  logoutThunk,
} from "./users.thunks";

interface User {
  userId: string;
  username: string;
  name: string;
  profile_Img: string;
}

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.user = null;
      state.isLoading = false;
      state.isLoggedIn = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Signup User
      .addCase(signUpThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      //Login User
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      //Get User Info
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      //Logout User
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
