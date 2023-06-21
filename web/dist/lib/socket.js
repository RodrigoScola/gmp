import { socketUrl } from "@/constants";
import { io } from "socket.io-client";
export const socket = io(socketUrl, {
    transports: ["websocket"],
    autoConnect: false,
});
export const chatSocket = io(`${socketUrl}/chat`, {
    transports: ["websocket"],
    autoConnect: false,
});
export const usersSocket = io(`${socketUrl}/users`, {
    transports: ["websocket"],
    autoConnect: false,
});
export const userSocket = io(`${socketUrl}/user`, {
    transports: ["websocket"],
    autoConnect: false,
});
export const queueSocket = io(`${socketUrl}/gamequeue`, {
    transports: ["websocket"],
    autoConnect: false,
});
export const newSocketAuth = (params) => {
    return {
        user: params.user,
        roomId: params.roomId,
        gameName: params.gameName,
    };
};
