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
exports.FriendHandler = void 0;
const db_1 = require("../db");
class FriendHandler {
    constructor(userId) {
        this._friends = new Map();
        this.userId = userId;
    }
    get friends() {
        if (this._friends.size)
            return Array.from(this._friends.values());
        return [];
    }
    getFriends(userId = this.userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, data } = yield db_1.db.rpc("get_friends", {
                userid: userId,
            });
            if (error)
                return [];
            let { data: friendsProfile } = yield db_1.db
                .from("profiles")
                .select("*")
                .in("id", data);
            friendsProfile = friendsProfile;
            friendsProfile === null || friendsProfile === void 0 ? void 0 : friendsProfile.forEach((friend) => {
                this._friends.set(friend.id, friend);
            });
            return friendsProfile;
        });
    }
    getRequest(userId, userId2 = this.userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let { error, data } = yield db_1.db
                .rpc("find_matching_rows", {
                user1_id: userId2,
                user2_id: userId,
            })
                .single();
            if (error || !data)
                return;
            return {
                id: data.id,
                status: data.status,
                users: [this.userId, userId],
            };
        });
    }
    addFriendRequest(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield db_1.db
                .from("connections")
                .insert({
                friend1: this.userId,
                friend2: userId,
                status: "pending",
            })
                .select()
                .single();
            return data;
        });
    }
    isFriend(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const d = yield db_1.db
                .rpc("find_matching_rows", {
                user1_id: this.userId,
                user2_id: userId,
            })
                .single();
            if (d.error)
                return false;
            return true;
        });
    }
}
exports.FriendHandler = FriendHandler;
