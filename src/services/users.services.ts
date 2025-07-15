import { Permission, Query, Role } from "appwrite";
import {
  DATABASE_ID,
  COLLECTION_USERS,
  DEFAULT_PROFILE_IMAGE_ID,
  REDIRECT_URL,
} from "../constants/appwrite";
import { account, ID, databases } from "../lib/appwrite.config";
import type { Models } from "appwrite";

interface User {
  userId: string;
  username: string;
  name: string;
  profile_Img: string;
}

export const signUp = async (
  email: string,
  password: string,
  name: string,
  username: string
) => {
  try {
    const existingUsers = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_USERS,
      [Query.equal("username", username)]
    );

    if (existingUsers.total > 0) {
      throw new Error("Username already taken");
    }

    await account.create(ID.unique(), email, password, name);

    await account.createEmailPasswordSession(email, password);

    const user = await account.get();

    await databases.createDocument(
      DATABASE_ID,
      COLLECTION_USERS,
      user.$id,
      {
        userId: user.$id,
        username,
        name,
        profile_Img: DEFAULT_PROFILE_IMAGE_ID,
      },
      [
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
      ]
    );

    await account.createVerification(REDIRECT_URL);

    const enrichedUser = {
      userId: user.$id,
      username,
      name,
      profile_Img: DEFAULT_PROFILE_IMAGE_ID,
    };

    return enrichedUser;
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
