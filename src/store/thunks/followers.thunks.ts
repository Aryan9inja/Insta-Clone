import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteFollowing,
  getFollowers,
  getFollowings,
  setNewFollowing,
  isFollowing,
} from "../../services/followers.services";
import type { Follower } from "../../services/followers.services";

export const setNewFollowingThunk = createAsyncThunk<
  Follower,
  { userId: string; newFollowingId: string },
  { rejectValue: string }
>(
  "followers/setNewFollowing",
  async ({ userId, newFollowingId }, { rejectWithValue }) => {
    try {
      return await setNewFollowing(userId, newFollowingId);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Unable to follow");
    }
  }
);

export const getFollowersThunk = createAsyncThunk<
  Follower[],
  string,
  { rejectValue: string }
>("followers/getFollowers", async (userId, { rejectWithValue }) => {
  try {
    return await getFollowers(userId);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Can't get followers list");
  }
});

export const getFollowingsThunk = createAsyncThunk<
  Follower[],
  string,
  { rejectValue: string }
>("followers/getFollowings", async (userId, { rejectWithValue }) => {
  try {
    return await getFollowings(userId);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Can't get followings list");
  }
});

export const deleteFollowingThunk = createAsyncThunk<
  string,
  { userId: string; followingId: string },
  { rejectValue: string }
>(
  "followers/deleteFollowing",
  async ({ userId, followingId }, { rejectWithValue }) => {
    try {
      const result = await deleteFollowing(userId, followingId);
      if (!result) {
        return rejectWithValue("No follow relationship found to delete.");
      }
      return followingId;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Unable to delete follow");
    }
  }
);

export const isFollowingThunk = createAsyncThunk<
  boolean,
  { userId: string; otherUserId: string },
  { rejectValue: string }
>(
  "followers/isFollowing",
  async ({ userId, otherUserId }, { rejectWithValue }) => {
    try {
      return await isFollowing(userId, otherUserId);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Unable to check follow status");
    }
  }
);
