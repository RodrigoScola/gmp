import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
export declare const useSocket: <K extends {
    [key: string]: any;
}, T extends Socket<DefaultEventsMap, DefaultEventsMap> = Socket<DefaultEventsMap, DefaultEventsMap>>(socket: T, authParams: K, events: (socket: T) => void) => void;
//# sourceMappingURL=useSocket.d.ts.map