import type { User } from "../store/slices/users.slice";
import { getCurrentUser } from "../services/users.services";

interface Follower {
  followingId: string;
}

export const mapFollowersToUsers = async (following: Follower[]): Promise<User[]> => {
  const results = await Promise.all(
    following.map((f) => getCurrentUser(f.followingId))
  );

  return results.filter((user): user is User => user !== null && user !== undefined);
};
