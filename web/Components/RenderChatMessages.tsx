"use client";

import { useFriend } from "@/hooks/useFriends";
import { useObject } from "@/hooks/useObject";
import { useRefetch } from "@/hooks/useRefetch";
import { useUser } from "@/hooks/useUser";
import { ChatConversationType, ChatMessageType, ReturnUserType } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUpdateEffect } from "usehooks-ts";

const newMessage = (content: string, userId: string): ChatMessageType => {
  return {
    created: Date.now().toString(),
    userId,
    id: Date.now().toString(),
    message: content,
  };
};

export const RenderChatMesages = (props: {
  chatMessages: ChatConversationType;
  user: ReturnUserType;
}) => {
  const { user } = useUser();
  const friend = useFriend();

  useEffect(() => {
    if (user) {
      const friendId = props.chatMessages.users.find((i) => i.id != user.id);
      if (friendId) {
        friend.setFriendId(friendId.id);
        setAllChat(props.chatMessages);
      }
    }
  }, [user.id]);
  const [currentChat, setCurrentChat] = useState<string>("");
  const documentRef = useRef<HTMLFormElement>(null);
  const [allChat, setAllChat] = useState<ChatConversationType>({
    id: "string",
    messages: [],
    users: [],
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const d = useRefetch<ChatConversationType>(
    `http://localhost:3000/api/chat/snuffy/?page=${currentPage}`
  );

  const lmessage = useRefetch<ChatConversationType>(
    `http://localhost:3000/api/chat/snuffy/?first=${currentPage}`
  );

  useUpdateEffect(() => {
    if (
      !lmessage?.data ||
      lmessage.data.messages[0].message ==
        allChat.messages[allChat.messages.length - 1].message
    )
      return;
    if (lmessage.data.messages[0]) {
      const m = lmessage.data.messages[0];

      setAllChat((curr) => ({
        ...curr,
        messages: [...allChat.messages, m],
      }));
    }
  }, [currentPage]);

  useUpdateEffect(() => {
    if (!d?.data) return;
    if (d.data.messages[0].id == allChat.messages[0].id) return;
    const m = d.data.messages.concat(allChat.messages);
    setAllChat((current) => ({
      ...current,
      messages: m,
    }));
  }, [d]);

  const lastMessage = useMemo(() => {
    if (!allChat?.messages.length) return;
    return allChat.messages[allChat.messages.length - 1];
  }, [allChat]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNewMessage = (e: HTMLFormElement) => {
    e.preventDefault();
    const message = newMessage(currentChat, user.id);
    setAllChat((current) => ({
      ...current,
      messages: [...allChat.messages, message],
    }));
    setCurrentPage((curr) => curr + 1);
    setCurrentChat("");
  };

  useUpdateEffect(() => {
    window.scrollTo({
      top: inputRef.current?.offsetTop,
    });
  }, [lastMessage]);

  return (
    <div>
      <div className="sticky top-0 flex justify-between bg-red-300">
        <p>{props.user.username}</p>
        <Popover>
          <PopoverTrigger>
            <div>Invite to game</div>
          </PopoverTrigger>
          <PopoverContent className="flex gap-2">
            <div
              onClick={() => {
                friend.sendInvite("connect Four");
              }}
            >
              connect4
            </div>
            <div
              onClick={() => {
                friend.sendInvite("Tic Tac Toe");
              }}
            >
              tic tac toe
            </div>
            <div
              onClick={() => {
                friend.sendInvite("Rock Paper Scissors");
              }}
            >
              rock paper scissors
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2 px-6 text-white">
        {allChat?.messages.map((message, i) => {
          if (allChat.messages[0].userId !== message.userId) {
            return (
              <div key={i + message.created} className="flex justify-end">
                <div className=" bg-blue-700 flex items-center p-1 rounded-full right-0 w-fit space-x-2">
                  <div className="flex text-sm text-gray-400/50">
                    <p>{new Date(message.created).getHours()} : </p>
                    <p>{new Date(message.created).getMinutes()}</p>
                  </div>
                  <p>{message.message}</p>
                </div>
              </div>
            );
          } else {
            return (
              <div key={i} className="flex justify-start">
                <div className=" bg-blue-700 flex items-center p-1 rounded-full right-0 w-fit space-x-2">
                  <div className="flex text-sm text-gray-400/50">
                    <p>{new Date(message.created).getHours()} : </p>
                    <p>{new Date(message.created).getMinutes()}</p>
                  </div>
                  <p>{message.message}</p>
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className="px-6">
        <form ref={documentRef} onSubmit={handleNewMessage}>
          <input
            className="w-full mt-2"
            value={currentChat}
            onChange={(e) => {
              setCurrentChat(e.target.value);
            }}
            ref={inputRef}
            type="text"
          />
        </form>
      </div>
    </div>
  );
};
