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

export interface UserProfile extends Models.Document {
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
    const user = await account.get();
    return user;
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

export const getCurrentUser = async (userId: string): Promise<User | null> => {
  try {
    const docList = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_USERS,
      [Query.equal("userId", userId)]
    );

    const userDoc = docList.documents[0];

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
  return storage.getFileView(BUCKET_ID, fileId);
};

export const createUserProfile = async (
  userId: string,
  username: string,
  name: string
) => {
  const userDoc: Models.Document = await databases.createDocument(
    DATABASE_ID,
    COLLECTION_USERS,
    ID.unique(),
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

    return response.documents.length === 0;
  } catch (error) {
    console.error("Error checking username availability:", error);
    return false; // Assume unavailable on error
  }
};

export const updateProfileImage = async (userId: string, file: File) => {
  try {
    const UserDocArray = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_USERS,
      [Query.equal("userId", userId)]
    );
    const currentUserDoc = UserDocArray.documents[0];
    const currentProfileImage = currentUserDoc.profile_Img;

    const newFile = await storage.createFile(BUCKET_ID, ID.unique(), file, [
      Permission.read(Role.any()),
      Permission.update(Role.user(userId)),
    ]);
    if (currentProfileImage !== DEFAULT_PROFILE_IMAGE_ID) {
      await storage.deleteFile(BUCKET_ID, currentProfileImage);
    }

    await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_USERS,
      currentUserDoc.$id,
      {
        profile_Img: newFile.$id,
      }
    );
    return true;
  } catch (error) {
    throw new Error("Problem updating profile image !!");
  }
};

export const searchUsers = async (
  searchTerm: string
): Promise<UserProfile[] | null> => {
  try {
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm || trimmedTerm.length < 2) {
      return [];
    }

    const response = await databases.listDocuments<UserProfile>(
      DATABASE_ID,
      COLLECTION_USERS,
      [
        Query.or([
          Query.search("username", trimmedTerm),
          Query.search("name", trimmedTerm),
        ]),
        Query.limit(20),
        Query.orderAsc("username"),
      ]
    );

    return response.documents;
  } catch (error) {
    console.error("Error searching users:", error);
    return null;
  }
};
