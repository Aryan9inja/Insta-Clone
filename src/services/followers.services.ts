import { Permission, Query, Role, type Models } from "appwrite";
import { COLLECTION_FOLLOWERS, DATABASE_ID } from "../constants/appwrite";
import { databases, ID } from "../lib/appwrite.config";

export interface Follower extends Models.Document {
  followerId: string;
  followingId: string;
}

export const setNewFollowing = async (
  userId: string,
  newFollowingId: string
): Promise<Follower> => {
  try {
    const FollowerDoc: Follower = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_FOLLOWERS,
      ID.unique(),
      {
        followerId: userId,
        followingId: newFollowingId,
      },
      [Permission.delete(Role.user(userId))]
    );
    return FollowerDoc;
  } catch (error) {
    console.error("Failed to create follower document:", error);
    throw error;
  }
};

export const getFollowers = async (userId: string): Promise<Follower[]> => {
  try {
    const response = await databases.listDocuments<Follower>(
      DATABASE_ID,
      COLLECTION_FOLLOWERS,
      [Query.equal("followingId", userId)]
    );
    return response.documents;
  } catch (error) {
    console.error("Failed to fetch followers:", error);
    throw error;
  }
};

export const getFollowings = async (userId: string): Promise<Follower[]> => {
  try {
    const response = await databases.listDocuments<Follower>(
      DATABASE_ID,
      COLLECTION_FOLLOWERS,
      [Query.equal("followerId", userId)]
    );
    return response.documents;
  } catch (error) {
    console.error("Failed to fetch followings:", error);
    throw error;
  }
};

export const deleteFollowing = async (
  userId: string,
  followingId: string
): Promise<string | null> => {
  try {
    const response = await databases.listDocuments<Follower>(
      DATABASE_ID,
      COLLECTION_FOLLOWERS,
      [
        Query.equal("followerId", userId),
        Query.equal("followingId", followingId),
      ]
    );

    if (response.total === 0) {
      console.warn("No follow relationship found to delete.");
      return null;
    }

    const documentId = response.documents[0].$id;

    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_FOLLOWERS,
      documentId
    );

    return followingId;
  } catch (error) {
    console.error("Failed to delete follow relationship:", error);
    throw error;
  }
};

export const isFollowing = async (
  userId: string,
  otherUserId: string
): Promise<boolean> => {
  try {
    const response = await databases.listDocuments<Follower>(
      DATABASE_ID,
      COLLECTION_FOLLOWERS,
      [
        Query.equal("followerId", userId),
        Query.equal("followingId", otherUserId),
      ]
    );

    return response.total > 0;
  } catch (error) {
    console.error("Failed to check follow status:", error);
    return false;
  }
};
