"use client";

import { baseUser } from "@/constants";
import { useEffect, useState } from "react";
import { useEffectOnce } from "usehooks-ts";

export default function WEBSOCKETPAGETEST() {
  const [ws, setWs] = useState<WebSocket | null>();
  useEffectOnce(() => {
    setWs(
      new WebSocket("ws://localhost:3001/ws", )
    );
  });

  useEffect(() => {
    if (!ws) return;
    ws.onmessage = (e) => {
      console.log(e.data);
    };
    ws.onopen = () => {
      console.log("open");
     
    }
  }, [ws]);

  return (
    <div>
      <button
        onClick={() => {
 ws?.send( JSON.stringify(baseUser))
        }}
      >
        s
      </button>
    </div>
  );
}
