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
exports.newMessage = exports.ConversationHandler = void 0;
const db_1 = require("../db");
const users_1 = require("../types/users");
const usersHandler_1 = require("./usersHandler");
class ConversationHandler {
    constructor(users) {
        this.messages = [];
        this.conversation = {
            id: "",
            messages: [],
            users: [],
        };
        this.users = new Map();
        this.conversation = {
            id: "",
            messages: [],
            users: [],
        };
        if (users === null || users === void 0 ? void 0 : users.length) {
            users.forEach((user) => {
                this.addUser({
                    id: user,
                    state: users_1.UserState.inChat,
                });
            });
        }
    }
    addUser(user) {
        if (!this.users.has(user.id)) {
            this.users.set(user.id, user);
        }
    }
    newMessage(userId, content) {
        return this.newMessage(userId, content);
    }
    addMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db
                .from("messages")
                .insert({
                message: message.message,
                conversationId: Number(this.conversation.id),
                userId: message.userId,
                created: message.created,
            })
                .select();
            this.messages.push(message);
        });
    }
    getConversation(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: file } = yield db_1.db
                .from("conversations")
                .select("*")
                .eq("id", conversationId)
                .single();
            if (!file)
                return;
            this.conversation.users.forEach((user) => {
                if (this.users.has(user.id)) {
                    this.users.set(user.id, {
                        id: user.id,
                        state: users_1.UserState.online,
                    });
                }
                else {
                    this.users.set(user.id, {
                        id: user.id,
                        state: users_1.UserState.offline,
                    });
                }
            });
            return this.conversation;
        });
    }
    getUsers() {
        let users = [];
        this.users.forEach((_, key) => {
            if (usersHandler_1.uhandler.getUser(key)) {
                const user = usersHandler_1.uhandler.getUser(key);
                if (user)
                    users.push(user);
            }
        });
        return users;
    }
}
exports.ConversationHandler = ConversationHandler;
const newMessage = (userId, content) => {
    return {
        created: new Date().toISOString(),
        userId,
        id: Date.now().toString(),
        message: content,
    };
};
exports.newMessage = newMessage;
