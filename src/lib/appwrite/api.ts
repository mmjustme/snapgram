import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

// create user
export async function createUserAccount(user: INewUser) {
  try {
    // create user in the Auth appwrite
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    // see function saveUserToDB
    const newUser = await saveUserToDB({
      // $id - exmp how is appwrite save id
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarUrl,
      // this param come from user(sign-up form) not newAccount
      username: user.username,
    });

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// save user to DB
export async function saveUserToDB(user: {
  // this block define what user we want to save in a Databases
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  //  ? - mean it is optinal value
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user,
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (error) {
    console.log(error);
  }
}

// for authContext to understand is user AUTH
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const getCurrentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      // what we're trying to fetch
      [Query.equal("accountId", currentAccount.$id)],
    );

    if (!getCurrentUser) throw Error;

    return getCurrentUser.documents[0];
  } catch (error) {
    console.log(error, "!");
  }
}

// signOut
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function CreatePost(post: INewPost) {
  try {
    // 1.Upload img to storge, fn descr.below
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // 2.Get File URL, fn descr.below
    const fileUrl = getFilePreview(uploadedFile.$id);

    // if sm go wrong we need also delete file and show Error
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // 3.Convert tags in to array
    // replace(/ /g,'') - find and replace space with empty sttring
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // 4. Save post in DB
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      },
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file,
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      // width & heigh & position & quality
      2000,
      2000,
      "top",
      100,
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)],
  );

  if (!posts) throw Error;

  return posts;
}

// like save delete POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      },
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      },
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId,
    );

    if (!statusCode) throw Error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// getPostBy ID
export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

