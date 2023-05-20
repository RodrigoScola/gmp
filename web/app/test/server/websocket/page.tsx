"use client";

import { RPSOptionsValues } from "@/types/types";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function WEBSOCKETPAGETEST() {
  const socket = io("wss://localhost:3001/game", {
    path: "/",
  });

  // const [isConnected, setIsConnected] = useState(socket.connected);
  // const [fooEvents, setFooEvents] = useState<any[]>([]);

  // useEffect(() => {
  //   function onConnect() {
  //     setIsConnected(true);
  //   }
  //   function onDisconnect() {
  //     setIsConnected(false);
  //   }
  //   function onFooEvent(value: any) {
  //     setFooEvents((fooEvents) => [...fooEvents, value]);
  //   }
  //   socket.on("connect", onConnect);
  //   socket.on("disconnect", onDisconnect);
  //   socket.on("message", onFooEvent);
  //   return () => {
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //     socket.off("foo", onFooEvent);
  //   };

  // },[])
  // console.log(isConnected)

  // console.log(fooEvents)
  return <div></div>;
}
