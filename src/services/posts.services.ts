import { Permission, Query, Role, type Models } from "appwrite";
import {
  BUCKET_ID,
  COLLECTION_POSTS,
  COLLECTION_USERS,
  DATABASE_ID,
} from "../constants/appwrite";
import { databases, ID, storage } from "../lib/appwrite.config";

export interface Post extends Models.Document {
  userId: string;
  caption: string;
  post_Img: string;
}

export interface PostUser extends Models.Document {
  userId: string;
  username: string;
  profile_Img: string;
}

export interface PostWithUserInfo extends Post {
  username: string;
  profile_Img: string;
}

export const createPost = async (
  userId: string,
  caption: string,
  post_Img: string
): Promise<Post> => {
  const post = await databases.createDocument<Post>(
    DATABASE_ID,
    COLLECTION_POSTS,
    ID.unique(),
    {
      userId,
      caption,
      post_Img,
    },
    [Permission.delete(Role.user(userId)), Permission.read(Role.users())]
  );

  return post;
};

export const getPostsWithUserInfo = async (): Promise<PostWithUserInfo[]> => {
  const postsRes = await databases.listDocuments<Post>(
    DATABASE_ID,
    COLLECTION_POSTS
  );
  const posts = postsRes.documents;

  const userIds = [...new Set(posts.map((post) => post.userId))];
  const usersRes = await databases.listDocuments<PostUser>(
    DATABASE_ID,
    COLLECTION_USERS,
    [Query.equal("userId", userIds)]
  );

  const userMap = new Map<string, PostUser>();
  usersRes.documents.forEach((user) => userMap.set(user.userId, user));

  const mergedPosts: PostWithUserInfo[] = posts.map((post) => {
    const user = userMap.get(post.userId);

    return {
      ...post,
      username: user?.username || "noone",
      profile_Img: user?.profile_Img || "",
    };
  });

  return mergedPosts;
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

export const getPostImageUrl = (fileId: string) => {
  const postImgUrl = storage.getFileView(BUCKET_ID, fileId) as string;
  return postImgUrl;
};
