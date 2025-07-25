import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  deleteFollowingThunk,
  isFollowingThunk,
  setNewFollowingThunk,
  getFollowersThunk,
  getFollowingsThunk,
} from "../store/thunks/followers.thunks";

export const useFollowers = (otherUserId?: string) => {
  const dispatch = useAppDispatch();
  const { followers, followings, isFollowingMap, error, loading } =
    useAppSelector((state) => state.followers);
  const currentUserId = useAppSelector((state) => state.users.user?.userId);

  useEffect(() => {
    if (otherUserId && isFollowingMap[otherUserId] === undefined) {
      dispatch(isFollowingThunk({ userId: currentUserId!, otherUserId }));
    }
  }, [dispatch, otherUserId, isFollowingMap]);

  const followUser = useCallback(
    (userId: string, otherUserId: string) => {
      dispatch(setNewFollowingThunk({ userId, newFollowingId: otherUserId }))
        .unwrap()
        .then(() => {
          dispatch(getFollowingsThunk(otherUserId!));
          dispatch(isFollowingThunk({ userId: currentUserId!, otherUserId }));
        });
    },
    [dispatch]
  );

  const unfollowUser = (currentUserId: string, otherUserId: string) => {
    dispatch(
      deleteFollowingThunk({ userId: currentUserId, followingId: otherUserId })
    )
      .unwrap()
      .then(() => {
        dispatch(getFollowersThunk(otherUserId));
        dispatch(isFollowingThunk({ userId: currentUserId, otherUserId }));
      });
  };

  const checkFollowStatus = useCallback(
    (userId: string, otherUserId: string) => {
      dispatch(isFollowingThunk({ userId, otherUserId }));
    },
    [dispatch]
  );

  const loadFollowers = useCallback(
    (userId: string) => {
      dispatch(getFollowersThunk(userId));
    },
    [dispatch]
  );

  const loadFollowings = useCallback(
    (userId: string) => {
      dispatch(getFollowingsThunk(userId));
    },
    [dispatch]
  );

  return {
    followers,
    followings,
    isFollowing: otherUserId ? isFollowingMap[otherUserId] : undefined,
    followUser,
    unfollowUser,
    checkFollowStatus,
    loadFollowers,
    loadFollowings,
    loading,
    error,
  };
};
