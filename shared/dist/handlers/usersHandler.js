"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerHandler = exports.UsersHandlers = exports.uhandler = exports.MainUser = void 0;
const users_1 = require("../types/users");
const FriendHandler_1 = require("./FriendHandler");
const GameInvitehandler_1 = require("./GameInvitehandler");
class MainUser {
    constructor(user) {
        this.currentState = user.currentState;
        if (user.game) {
            this.game = user.game;
        }
        this.id = user.id;
        this.socketId = user.socketId;
        this.user = user.user;
        this.friends = new FriendHandler_1.FriendHandler(this.user.id);
    }
}
exports.MainUser = MainUser;
class MainUserHandler {
    constructor() {
        this.users = new Map();
        this.userNames = new Map();
        this.invites = new GameInvitehandler_1.GameInviteHandler();
    }
    addUser(user) {
        user.id = user.id.toString();
        const mainUser = new MainUser({
            currentState: users_1.UserState.online,
            game: {
                gameId: null,
                state: users_1.UserGameState.waiting,
            },
            user,
            id: user.id,
            socketId: user.socketId,
        });
        this.users.set(user.id, mainUser);
        if (user.username) {
            this.userNames.set(user.username, user.id);
        }
        return mainUser;
    }
    updateUser(userId, info) {
        const user = this.users.get(userId);
        if (!user)
            return;
        const nuser = Object.assign(Object.assign(Object.assign({}, user), info), { socketId: user.socketId });
        this.users.set(userId, new MainUser(nuser));
        return this.getUser(userId);
    }
    getUsers() {
        const users = Array.from(this.users.values());
        return users.map((user) => user);
    }
    getUser(id) {
        // console.log(this.users.get(id));
        const user = this.users.get(id);
        if (user) {
            return user;
        }
        return;
    }
    getUserByUsername(username) {
        if (!this.userNames.has(username))
            return;
        return this.userNames.get(username);
    }
    deleteUser(id) {
        this.users.delete(id);
    }
}
exports.uhandler = new MainUserHandler();
class UsersHandlers {
    constructor() {
        this.users = new Map();
    }
    addUser(user) {
        // if (!user.id) return;
        this.users.set(user.id, user);
    }
    updateUser(userId, info) {
        const user = this.users.get(userId);
        if (!user)
            return;
        const nuser = Object.assign(Object.assign({}, user), info);
        this.users.set(userId, nuser);
    }
    getUsers() {
        return Array.from(this.users.values());
    }
    getUser(id) {
        const user = this.users.get(id);
        return user;
    }
    deleteUser(id) {
        this.users.delete(id);
    }
}
exports.UsersHandlers = UsersHandlers;
class PlayerHandler {
    constructor() {
        this.players = {};
    }
    addPlayer(player) {
        if (this.players[player.id])
            return;
        this.players[player.id] = player;
    }
    getPlayers() {
        return Object.values(this.players);
    }
    getPlayer(playerId) {
        return this.players[playerId];
    }
    removePlayer(playerId) {
        delete this.players[playerId];
    }
    hasPlayer(playerId) {
        return !!this.players[playerId];
    }
}
exports.PlayerHandler = PlayerHandler;
