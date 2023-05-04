"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playRouter = void 0;
const express_1 = require("express");
exports.playRouter = (0, express_1.Router)();
const server_1 = require("../server");
server_1.io.on('connection', (socket) => {
    console.log('this is the room');
});
exports.playRouter.param("roomId", (req, res, next, roomId) => {
    req.room = {
        id: roomId
    };
    next();
});
exports.playRouter.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});
