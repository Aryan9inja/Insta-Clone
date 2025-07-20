import { Permission, Query, Role, type Models } from "appwrite";
import {
  BUCKET_ID,
  COLLECTION_POSTS,
  DATABASE_ID,
} from "../constants/appwrite";
import { databases, ID, storage } from "../lib/appwrite.config";

export const createPost = async (
  userId: string,
  caption: string = "",
  post_Img: string,
  username: string,
  user_Img: string
) => {
  const post: Models.Document = await databases.createDocument(
    DATABASE_ID,
    COLLECTION_POSTS,
    ID.unique(),
    {
      userId,
      caption,
      post_Img,
      username,
      user_Img
    },
    [Permission.delete(Role.user(userId)), Permission.read(Role.users())]
  );

  return post;
};

export const getPosts = async (): Promise<
  Models.DocumentList<Models.Document>
> => {
  const posts = await databases.listDocuments(DATABASE_ID, COLLECTION_POSTS);
  return posts;
};

export const getUserPosts = async (
  userId: string
): Promise<Models.DocumentList<Models.Document>> => {
  const userPosts = await databases.listDocuments(
    DATABASE_ID,
    COLLECTION_POSTS,
    [Query.equal("userId", userId)]
  );
  return userPosts;
};

export const getPostImage = (fileId: string) => {
  const postImgUrl = storage.getFileView(BUCKET_ID, fileId) as string;
  return postImgUrl;
};
