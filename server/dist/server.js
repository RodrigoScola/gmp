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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomId = exports.gameId = exports.getUserFromSocket = exports.userHandler = exports.usersHandler = exports.chatHandler = exports.io = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app);
const socket_io_1 = require("socket.io");
const room_1 = require("../../shared/handlers/room");
const chatConnection_1 = require("./connections/chatConnection");
const userConnection_1 = require("./connections/userConnection");
const gameQueueConnection_1 = require("./connections/gameQueueConnection");
const db_1 = require("./lib/db");
const usersHandler_1 = require("../../shared/handlers/usersHandler");
const usersConnection_1 = require("./connections/usersConnection");
const gameConnection_1 = require("./connections/gameConnection");
exports.io = new socket_io_1.Server(server);
exports.chatHandler = exports.io.of("/chat");
exports.chatHandler.on("connection", (socket) => (0, chatConnection_1.chatHandlerConnection)(exports.chatHandler, socket));
exports.usersHandler = exports.io.of("/users");
exports.usersHandler.on("connection", (socket) => (0, usersConnection_1.usersHandlerConnection)(exports.usersHandler, socket));
exports.userHandler = exports.io.of("/user");
exports.userHandler.on("connection", (socket) => (0, userConnection_1.userHandlerConnection)(exports.userHandler, socket));
const getUserFromSocket = (socket) => {
    const u = socket.handshake.auth["user"];
    if (!u) {
        return;
    }
    return u;
};
exports.getUserFromSocket = getUserFromSocket;
const gamequeueHandler = exports.io.of("/gamequeue");
gamequeueHandler.on("connection", (socket) => (0, gameQueueConnection_1.gamequeueHandlerConnection)(gamequeueHandler, socket));
exports.io.on("connection", (socket) => (0, gameConnection_1.gameHandlerConnection)(exports.io, socket));
exports.gameId = "a0s9df0a9sdjf";
const getRoomId = (socket) => socket.handshake.auth["roomId"];
exports.getRoomId = getRoomId;
app.get("/conversation/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conversationId = req.params.roomId;
    const { data } = yield db_1.db
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single();
    if (!data)
        return;
    let users = yield Promise.all([
        db_1.db.from("profiles").select("*").eq("id", data["user1"]).single(),
        db_1.db.from("profiles").select("*").eq("id", data["user2"]).single(),
    ]);
    users = users.map((user) => user.data);
    const messages = yield db_1.db
        .from("messages")
        .select("*")
        .eq("conversationId", conversationId)
        .order("created");
    res.json({
        id: data["id"],
        users: users,
        messages: messages.data,
    });
}));
app.get("/user/:usernameorId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const username = req.params.usernameorId;
    let user = (_a = usersHandler_1.uhandler.getUser(username)) === null || _a === void 0 ? void 0 : _a.user;
    if (!user) {
        const { data, error } = yield db_1.db
            .from("profiles")
            .select("*")
            .eq("username", username)
            .single();
        if (!error) {
            usersHandler_1.uhandler.addUser(Object.assign({ socketId: "" }, data));
        }
    }
    res.send(user);
}));
app.get("/:roomId", (req, res) => {
    const room = (0, room_1.getRoom)(req.params.roomId);
    if (!room) {
        res.send({
            room: {},
        });
        return;
    }
    res.send(room);
});
server.listen(3001, () => {
    console.log("listening on *:3001");
});
