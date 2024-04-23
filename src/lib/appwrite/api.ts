import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
import { ID } from "appwrite";

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


export async function signInAccount(user: { email: string, password: string }) {
  try {
    const session = await account.createSession(user.email, user.password)

    return session
  } catch (error) {
    console.log(error);

  }
}
