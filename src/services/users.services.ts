import { Permission, Role, Query } from "appwrite";
import {
  DATABASE_ID,
  COLLECTION_USERS,
  DEFAULT_PROFILE_IMAGE_ID,
  REDIRECT_URL,
  BUCKET_ID,
} from "../constants/appwrite";
import { account, ID, databases, storage } from "../lib/appwrite.config";
import type { Models } from "appwrite";

interface User {
  userId: string;
  username: string;
  name: string;
  profile_Img: string;
}

export const signUp = async (email: string, password: string, name: string) => {
  try {
    await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    return user;
  } catch (error: any) {
    console.log("Signup failed: ", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    await account.createEmailPasswordSession(email, password);
  } catch (error) {
    console.log("Login failed: ", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.log("Logout failed: ", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const session = await account.get();
    const userDoc: Models.Document = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_USERS,
      session.$id
    );

    const user: User = {
      userId: userDoc.userId,
      username: userDoc.username,
      name: userDoc.name,
      profile_Img: userDoc.profile_Img,
    };

    return user;
  } catch (error) {
    return null;
  }
};

export const sendVerificationEmail = async () => {
  return await account.createVerification(REDIRECT_URL);
};

export const verifyEmail = async (userId: string, secret: string) => {
  return await account.updateVerification(userId, secret);
};

export const getProfileImgUrl = (fileId: string) => {
  return storage.getFileDownload(BUCKET_ID, fileId ?? DEFAULT_PROFILE_IMAGE_ID);
};

export const createUserProfile = async (
  userId: string,
  username: string,
  name: string
) => {
  const userDoc: Models.Document = await databases.createDocument(
    DATABASE_ID,
    COLLECTION_USERS,
    userId,
    {
      userId,
      username,
      name,
      profile_Img: DEFAULT_PROFILE_IMAGE_ID,
    },
    [Permission.read(Role.user(userId)), Permission.update(Role.user(userId))]
  );

  return userDoc;
};

export const isUsernameAvailable = async (
  username: string
): Promise<boolean> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_USERS,
      [Query.equal("username", username)]
    );

    console.log("Username check response:", response);


    // If any document exists with that username, it's taken
    return response.documents.length === 0;
  } catch (error) {
    console.error("Error checking username availability:", error);
    return false; // Assume unavailable on error
  }
};
