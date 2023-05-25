"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePlayState = exports.UserGameState = exports.UserState = void 0;
var UserState;
(function (UserState) {
    UserState["typing"] = "typing";
    UserState["inChat"] = "inChat";
    UserState["online"] = "online";
    UserState["offline"] = "offline";
})(UserState = exports.UserState || (exports.UserState = {}));
var UserGameState;
(function (UserGameState) {
    UserGameState["playing"] = "playing";
    UserGameState["waiting"] = "waiting";
    UserGameState["selecting"] = "selecting";
    UserGameState["idle"] = "idle";
})(UserGameState = exports.UserGameState || (exports.UserGameState = {}));
var GamePlayState;
(function (GamePlayState) {
    GamePlayState[GamePlayState["selecting"] = 0] = "selecting";
    GamePlayState[GamePlayState["waiting"] = 1] = "waiting";
    GamePlayState[GamePlayState["playing"] = 2] = "playing";
    GamePlayState[GamePlayState["results"] = 3] = "results";
    GamePlayState[GamePlayState["end"] = 4] = "end";
})(GamePlayState = exports.GamePlayState || (exports.GamePlayState = {}));
