"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHandlerConnection = void 0;
const server_1 = require("../server");
const users_1 = require("../../../shared/types/users");
const usersHandler_1 = require("../../../shared/handlers/usersHandler");
const room_1 = require("../../../shared/handlers/room");
const gameHandlers_1 = require("../../../shared/handlers/gameHandlers");
const db_1 = require("../lib/db");
const userHandlerConnection = (userHandler, socket) => {
    const socketuser = (0, server_1.getUserFromSocket)(socket);
    const socketUser = Object.assign(Object.assign({}, socketuser), { socketId: socket.id });
    usersHandler_1.uhandler.addUser(socketUser);
    if (socketuser) {
        socket.data.user = socketuser;
    }
    socket.on("get_friends", (userid, callback) => __awaiter(void 0, void 0, void 0, function* () {
        const user = usersHandler_1.uhandler.getUser(userid);
        if (!user)
            return;
        const friends = yield user.friends.getFriends();
        callback(friends);
    }));
    socket.on("add_friend", (friendId, _) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        // console.log(friendId);
        const user = usersHandler_1.uhandler.getUser(friendId);
        const currentUser = usersHandler_1.uhandler.getUser((_a = (0, server_1.getUserFromSocket)(socket)) === null || _a === void 0 ? void 0 : _a.id);
        if (!user || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.user))
            return;
        const isFriend = yield (currentUser === null || currentUser === void 0 ? void 0 : currentUser.friends.getRequest(user.id));
        if (!isFriend) {
            yield (currentUser === null || currentUser === void 0 ? void 0 : currentUser.friends.addFriendRequest(user.id));
        }
        if ((isFriend === null || isFriend === void 0 ? void 0 : isFriend.status) == "pending") {
            socket.to(user === null || user === void 0 ? void 0 : user.socketId).emit("add_friend_response", {
                created_at: (_b = currentUser.user.created_at) !== null && _b !== void 0 ? _b : "",
                id: currentUser.user.id,
                username: (_c = currentUser.user.username) !== null && _c !== void 0 ? _c : "",
                email: (_d = currentUser.user.email) !== null && _d !== void 0 ? _d : "",
            });
        }
    }));
    socket.on("add_friend_answer", (user, response) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        if (response == "accepted") {
            const currentUser = usersHandler_1.uhandler.getUser((_e = (0, server_1.getUserFromSocket)(socket)) === null || _e === void 0 ? void 0 : _e.id);
            if (!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.user))
                return;
            const reqId = yield currentUser.friends.getRequest(user.id);
            const { data } = yield db_1.db
                .from("connections")
                .update({
                status: "accepted",
            })
                .eq("id", reqId === null || reqId === void 0 ? void 0 : reqId.id)
                .single();
            console.log(data);
            // const a = await db
            //   .from("connections")
            //   .update({ status: "accepted" })
            //   .eq("id", accepted?.id);
            // change definition to accepted
        }
        else {
            // change definition to declined
        }
    }));
    socket.on("game_invite", (gameName, userId) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const user = usersHandler_1.uhandler.getUser(userId);
        const mainUser = usersHandler_1.uhandler.getUser((_a = (0, server_1.getUserFromSocket)(socket)) === null || _a === void 0 ? void 0 : _a.id);
        if (!user || !mainUser)
            return;
        const gameInvite = usersHandler_1.uhandler.invites.addInvite({
            id: mainUser.user.id,
            created_at: (_b = mainUser.user.created_at) !== null && _b !== void 0 ? _b : "",
            email: (_c = mainUser.user.email) !== null && _c !== void 0 ? _c : "",
            username: (_d = mainUser.user.username) !== null && _d !== void 0 ? _d : "",
        }, {
            created_at: (_e = user.user.created_at) !== null && _e !== void 0 ? _e : "",
            email: (_f = user.user.email) !== null && _f !== void 0 ? _f : "",
            id: user.user.id,
            username: (_g = user.user.username) !== null && _g !== void 0 ? _g : "",
        }, gameName);
        if (!gameInvite)
            return;
        // console.log(gameInvite);
        // console.log(user.socketId);
        userHandler
            .to(user.user.socketId)
            .emit("game_invite", gameInvite.gameName, mainUser.user.id);
    });
    socket.on("game_invite_response", (action, invite, callback) => {
        if (action == "accepted") {
            const ninvite = usersHandler_1.uhandler.invites.acceptInvite(invite.inviteId);
            if (!ninvite)
                return;
            room_1.roomHandler.createRoom(ninvite === null || ninvite === void 0 ? void 0 : ninvite.roomId, new room_1.GameRoom(ninvite === null || ninvite === void 0 ? void 0 : ninvite.roomId, (0, gameHandlers_1.getGame)(ninvite === null || ninvite === void 0 ? void 0 : ninvite.gameName)));
            const to = usersHandler_1.uhandler.getUser(ninvite.to.id);
            const from = usersHandler_1.uhandler.getUser(ninvite.from.id);
            console.log(to, from);
            if (!to || !from)
                return;
            console.log("this ga");
            userHandler.to(to.user.socketId).emit("game_invite_accepted", ninvite);
            userHandler.to(to.socketId).emit("game_invite_accepted", ninvite);
            userHandler.to(from.socketId).emit("game_invite_accepted", ninvite);
            userHandler
                .to(from.user.socketId)
                .emit("game_invite_accepted", ninvite);
            callback(invite);
        }
        else if (action == "declined") {
        }
    });
    socket.on("disconnect", () => {
        var _a;
        if (socket.data.user) {
            usersHandler_1.uhandler.updateUser((_a = socket.data.user) === null || _a === void 0 ? void 0 : _a.id, {
                currentState: users_1.UserState.offline,
            });
        }
    });
};
exports.userHandlerConnection = userHandlerConnection;
