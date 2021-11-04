import Crypto from "crypto";
import { IResolvers } from "graphql-tools";
import { Google } from "../../../lib/api";
import { Database, User, Viewer } from "src/lib/types";
import { LogInArgs } from "./types";

// login to google with the front-end sent token code.
const loginViaGoogle = async (
  code: string,
  token: string,
  db: Database
): Promise<User | undefined> => {
  const { user } = await Google.login(code);

  if (!user) {
    throw new Error("Google login failed!");
  }

  // grabbing all => names/photos/emails List from user google account.
  const userNamesList = user.names && user.names.length ? user.names : null;
  const userPhotosList = user.photos && user.photos.length ? user.photos : null;
  const userEmailsList =
    user.emailAddresses && user.emailAddresses.length
      ? user.emailAddresses
      : null;

  // user display name
  const userName = userNamesList ? userNamesList[0].displayName : null;

  //user Id
  const userId =
    userNamesList &&
      userNamesList[0].metadata &&
      userNamesList[0].metadata?.source
      ? userNamesList[0].metadata.source.id
      : null;

  const userAvatar = userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;

  //user email
  const userEmail = userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error(`Google login failed!`);
  }


  const updateRes = await db.users.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        token,
      },
    },
    {
      returnDocument: "after"
    }

  );

  let viewer = updateRes.value;

  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id: userId,
      token,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      income: 0,
      bookings: [],
      listings: [],
    });


    //here we need to get the inserted user back : FIX
    console.log(insertResult.insertedId);
    let insertedUser = await db.users.findOne({ _id: insertResult.insertedId });
    console.log("User inserted: ", insertedUser);
    viewer = insertedUser;


  }

  return viewer as User | undefined;

};

export const viewerResolver: IResolvers = {
  Query: {
    authUrl: () => {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error(`Failed to query Google Auth Url: ${error}`);
      }
    },
  },
  Mutation: {
    // Mutation ====
    logIn: async (
      _root: undefined,
      { input }: LogInArgs,
      { db }: { db: Database }
    ): Promise<Viewer> => {
      try {
        const code = input ? input.code : null;

        const token = Crypto.randomBytes(16).toString("hex");

        const viewer: User | undefined = code
          ? await loginViaGoogle(code, token, db)
          : undefined;

        if (!viewer) {
          return {
            didRequest: true,
          };
        }

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to login: ${error}`);
      }
    },

    // Mutation ====
    logOut: (): Viewer => {

      try {

        return {
          didRequest: true,
        }

      } catch (error) {
        throw new Error(`Failed to logout: ${error}`)
      }
    },
  },

  //this to match the typescript types with Graphql return types #------
  Viewer: {
    id: (viewer: Viewer): string | undefined => {
      return viewer._id;
    },
    hasWallet: (viewer: Viewer): boolean | undefined => {
      return viewer.walletId ? true : undefined;
    },
  },
};
// -----#
