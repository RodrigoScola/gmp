<<<<<<< HEAD
import { useCallback, useEffect } from "react";
import { Socket } from "socket.io-client";

export const useSocket = <T>(
     socket: Socket,
     events: (socket: Socket) => void,
     auth?: T
) => {
     const socketEvents = useCallback(
          (socket: Socket) => events(socket),
          [events]
     );

     useEffect(() => {
          if (auth) {
               socket.auth = auth;
          }
          console.log("asdf");
          socket.connect();
          socketEvents(socket);
     });
=======
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
>>>>>>> 8e02ec11482aa4e4c7e27cd19ffd90ea7c3d049a
};
