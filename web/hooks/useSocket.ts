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
};
