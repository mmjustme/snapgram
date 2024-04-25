import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
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
