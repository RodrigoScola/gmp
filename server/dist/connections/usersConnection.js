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
exports.usersHandlerConnection = void 0;
const server_1 = require("../server");
const users_1 = require("../../../shared/types/users");
const usersHandler_1 = require("../../../shared/handlers/usersHandler");
const db_1 = require("../lib/db");
const usersHandlerConnection = (_, socket) => {
    const socketuser = (0, server_1.getUserFromSocket)(socket);
    const socketUser = Object.assign(Object.assign({}, socketuser), { socketId: socket.id });
    usersHandler_1.uhandler.addUser(socketUser);
    if (socketuser) {
        socket.data.user = socketuser;
    }
    socket.on("search_users", (username, callback) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("ad");
        const users = yield db_1.db
            .from("profiles")
            .select("*")
            .ilike("username", `%${username}%`);
        console.log(users);
        if (callback) {
            callback(users.data);
        }
    }));
    socket.on("disconnect", () => {
        var _a;
        if (socket.data.user) {
            usersHandler_1.uhandler.updateUser((_a = socket.data.user) === null || _a === void 0 ? void 0 : _a.id, {
                currentState: users_1.UserState.offline,
            });
        }
    });
};
exports.usersHandlerConnection = usersHandlerConnection;
