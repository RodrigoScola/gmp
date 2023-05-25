import { getBadges, getFriendsGames } from "@/data/baseFriends";
const getUser = async (id) => {
    const user = await fetch(`http://127.0.0.1:8090/api/collections/users/records/${id}`).then((res) => res.json());
    return newUser(user);
};
export const getUserByUsername = async (username) => {
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
    constructor({ id }) {
        this.id = id;
    }
    async getUser() {
        if (this._info) {
            return this._info;
        }
        return await getUser(this.id);
    }
}
export const newUser = (data, baseOptions) => {
    const options = Object.assign({}, baseOptions, {
        extended: false,
    });
    let user = {
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
    return user;
};
export const newFriend = (data, options) => {
    const defaultOptions = Object.assign({}, options, {
        extended: false,
    });
    let user = {
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
    return user;
};
