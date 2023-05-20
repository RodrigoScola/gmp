import {
  ExtendedUser,
  Friend,
  ReturnUserType,
  IUser as UserType,
} from "@/types/types";
import { getBadges, getFriendsGames } from "@/data/baseFriends";

type UserClassConstructor = {
  id: string;
};

const getUser = async (id: string): Promise<ReturnUserType> => {
  const user: Awaited<UserType> = await fetch(
    `http://127.0.0.1:8090/api/collections/users/records/${id}`
  ).then((res) => res.json());

  return newUser(user);
};

export const getUserByUsername = async (
  username: string
): Promise<ReturnUserType> => {
  // const user = await pb.collection("users").getList<UsersResponse>(1, 1, {
  // 	filter: `username = '${username}'`,
  // })
  // if (user.items.length == 0) {
  // 	return newUser()
  // }
  // return newUser(user.items[0])
  return newUser({
    username,
  });
};

export class User {
  private _info?: UserType;
  id: string;
  constructor({ id }: UserClassConstructor) {
    this.id = id;
  }
  async getUser(): Promise<ReturnUserType | undefined> {
    if (this._info) {
      return this._info;
    }
    return await getUser(this.id);
  }
}
export interface newUserOptions {
  extended?: boolean;
}
export const newUser = (
  data?: Partial<UserType<ExtendedUser>> | undefined | null,
  baseOptions?: Partial<newUserOptions>
): ReturnUserType => {
  const options = Object.assign({}, baseOptions, {
    extended: false,
  });

  let user: UserType<ExtendedUser> = {
    email: data?.email ?? "defaultEmail@gmail.com",
    id: data?.id || "-1",
    username: data?.username || "defaultUsername",
    verified: data?.verified || false,
    avatar: data?.avatar || "",
    name: data?.name || "defaultName",
    created: data?.created || new Date().toISOString(),

    updated: data?.updated || new Date().toISOString(),
  };
  if (options.extended) {
    user.expand = {
      badges: {
        totalBadges: 3,
        badges: getBadges(3),
      },
      games: getFriendsGames(100),
    };
  }
  return user;
};

type newFriendOptions = {
  extended?: boolean;
};
export const newFriend = (
  data?: Partial<Friend>,
  options?: Partial<newFriendOptions>
): Friend => {
  const defaultOptions: newFriendOptions = Object.assign({}, options, {
    extended: false,
  });
  let user = {
    email: data?.email ?? "",
    id: data?.id || "-1",
    username: data?.username || "",
    status: data?.status || "offline",
    verified: data?.verified || false,
    avatar: data?.avatar || "",
    name: data?.name || "",
    created: data?.created || new Date().toISOString(),
    updated: data?.updated || new Date().toISOString(),
  };
  if (defaultOptions.extended) {
    user.expand = {
      badges: {
        totalBadges: 3,
        badges: getBadges(3),
      },
      games: getFriendsGames(100),
    };
  }
  return user;
};
