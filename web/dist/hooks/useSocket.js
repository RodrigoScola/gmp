"use client";
import { useEffect } from "react";
export const useSocket = (socket, authParams, events) => {
    useEffect(() => {
        if (!socket.connected) {
            socket.auth = authParams;
            socket.connect();
        }
        events(socket);
        return () => {
            if (socket.connected) {
                socket.disconnect();
            }
        };
    }, []);
};
