import { IFriend, IUser, IUser as UserType } from "../../shared/types/users";
import { getBadges, getFriendsGames } from "@/data/baseFriends";

type UserClassConstructor = {
  id: string;
};

const getUser = async (id: string): Promise<IUser> => {
  const user: Awaited<UserType> = await fetch(
    `http://127.0.0.1:8090/api/collections/users/records/${id}`
  ).then((res) => res.json());

  return newUser(user);
};

export const getUserByUsername = async (username: string): Promise<IUser> => {
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
  private _info?: IUser;
  id: string;
  constructor({ id }: UserClassConstructor) {
    this.id = id;
  }
  async getUser(): Promise<IUser | undefined> {
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
  data?: Partial<IUser> | undefined | null,
  baseOptions?: Partial<newUserOptions>
): IUser => {
  const options = Object.assign({}, baseOptions, {
    extended: false,
  });

  let user: Partial<IFriend> = {
    email: data?.email ?? "defaultEmail@gmail.com",
    id: data?.id || "-1",
    username: data?.username || "defaultUsername",
    created_at: data?.created_at || new Date().toISOString(),
  };
  if (options.extended) {
    (user.badges = {
      totalBadges: 3,
      badges: getBadges(3),
    }),
      (user.games = getFriendsGames(100));
  }
  return user as IFriend;
};

type newFriendOptions = {
  extended?: boolean;
};
export const newFriend = (
  data?: Partial<IFriend>,
  options?: Partial<newFriendOptions>
): IFriend => {
  const defaultOptions: newFriendOptions = Object.assign({}, options, {
    extended: false,
  });
  let user: any = {
    email: data?.email ?? "",
    id: data?.id || "-1",
    username: data?.username || "",
    status: data?.status || "offline",
    created_at: data?.created_at || new Date().toISOString(),
  };
  if (defaultOptions.extended) {
    user.badges = {
      totalBadges: 3,
      badges: getBadges(3),
    };

    user.games = getFriendsGames(100);
  }
  return user as IFriend;
};
