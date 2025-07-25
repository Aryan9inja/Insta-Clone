import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Follower } from "../../services/followers.services";
import {
  setNewFollowingThunk,
  getFollowersThunk,
  getFollowingsThunk,
  deleteFollowingThunk,
  isFollowingThunk,
} from "../thunks/followers.thunks";

interface FollowersState {
  followers: Follower[];
  followings: Follower[];
  isFollowingMap: Record<string, boolean>;
  loading: boolean;
  error: string | null;
}

const initialState: FollowersState = {
  followers: [],
  followings: [],
  isFollowingMap: {},
  loading: false,
  error: null,
};

const followersSlice = createSlice({
  name: "followers",
  initialState,
  reducers: {
    clearFollowersState: (state) => {
      state.followers = [];
      state.followings = [];
      state.isFollowingMap = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // set new following
    builder
      .addCase(setNewFollowingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        setNewFollowingThunk.fulfilled,
        (state, action: PayloadAction<Follower>) => {
          state.loading = false;
          state.isFollowingMap[action.payload.followingId] = true;
          state.followers.push(action.payload);
        }
      )
      .addCase(setNewFollowingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to follow user";
      });

    // getFollowers
    builder
      .addCase(getFollowersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getFollowersThunk.fulfilled,
        (state, action: PayloadAction<Follower[]>) => {
          state.loading = false;
          state.followers = action.payload;
        }
      )
      .addCase(getFollowersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch followers list";
      });

    // getFollowings
    builder
      .addCase(getFollowingsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getFollowingsThunk.fulfilled,
        (state, action: PayloadAction<Follower[]>) => {
          state.loading = false;
          state.followings = action.payload;
        }
      )
      .addCase(getFollowingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch followings list";
      });

    // deleteFollowing
    builder
      .addCase(deleteFollowingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteFollowingThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          const followingId = action.payload;
          state.isFollowingMap[followingId] = false;
          state.followers = state.followers.filter(
            (f) => f.followerId !== action.payload
          );
        }
      )
      .addCase(deleteFollowingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete follow relationship";
      });

    // isFollowing
    builder
      .addCase(isFollowingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(isFollowingThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { otherUserId } = action.meta.arg;
        state.isFollowingMap[otherUserId] = action.payload;
      })
      .addCase(isFollowingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to check follow status";
      });
  },
});

export const { clearFollowersState } = followersSlice.actions;
export default followersSlice.reducer;
