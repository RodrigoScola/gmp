"use client";
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
export const useSocket = <
     K extends {
          [key: string]: any;
     },
     T extends Socket<DefaultEventsMap, DefaultEventsMap> = Socket<
          DefaultEventsMap,
          DefaultEventsMap
     >
>(
     socket: T,
     authParams: K,
     events: (socket: T) => void
) => {
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
