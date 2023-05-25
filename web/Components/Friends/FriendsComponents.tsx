"use client";
import { IFriend } from "../../../shared/src/types/users";
import { Popover, PopoverTrigger, PopoverContent } from "@chakra-ui/react";
import { ComponentProps, FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Profile from "@/images/profile.webp";
import { useFriend } from "@/hooks/useFriends";
import { chatSocket } from "@/lib/socket";
import { useUser } from "@/hooks/useUser";
export interface FriendsListProps {
  friends?: IFriend[];
}
export interface FriendCardProps {
  friend: IFriend;
}
const FriendCardOpen = ({
  friend,
  ...props
}: ComponentProps<"div"> & FriendCardProps) => {
  // const drawer = useDrawer();
  const handleFriend = useFriend(friend.id);
  const { user } = useUser();

  const [message, setMessage] = useState<string>("");
  const handleNewMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!chatSocket.connected) {
      chatSocket.auth = {
        roomId: "aoaoidfjoiasjdf",
        user: user,
      };
      chatSocket.connect();
    }
    console.log(friend.id);
    chatSocket.emit(
      "send_message",
      {
        message,
        userId: user.id,
      },
      (data: any) => {
        if (data.received == true) {
          window.location.pathname = `user/${friend.id}/chat`;
        }
      }
    );
  };

  return (
    <div {...props} className=" bg-blue-200 z-10 ">
      <div>
        <Image
          src={Profile.src}
          alt={`profile image for ${friend.username}`}
          width={75}
          height={75}
        />
        <Link href={`/user/${friend.username}`}>{friend.username}</Link>
        <div className="flex">
          {/* {friend.expand?.badges?.badges?.map((badge) => {
            return <div key={friend?.id + "_" + badge?.id}>{badge?.name}</div>;
          })} */}
        </div>
      </div>
      <div>Friends Since 1 - Feb - 2023</div>
      <Popover>
        <PopoverTrigger>
          <div>Invite to game</div>
        </PopoverTrigger>
        <PopoverContent className=" gap-2 z-50">
          <div
            onClick={() => {
              handleFriend.sendInvite("connect Four");
            }}
          >
            connect4
          </div>
          <div
            onClick={() => {
              handleFriend.sendInvite("Tic Tac Toe");
            }}
          >
            tic tac toe
          </div>
          <div
            onClick={() => {
              handleFriend.sendInvite("Rock Paper Scissors");
            }}
          >
            rock paper scissors
          </div>
        </PopoverContent>
      </Popover>
      <div>
        <h3>Stats</h3>
        <div className="grid grid-cols-2">
          {/* {Object.values(friend?.expand?.games ?? []).map((game) => {
            return (
              <div key={game.id}>
                <p>{game.name}</p>
                <p>Wins {game.won}</p>
                <p>Losses {game.lost}</p>
              </div>
            );
          })} */}
        </div>
      </div>
      <div>
        <p>Note: </p>
        <p>{friend.note}</p>
      </div>
      <div>
        <form onSubmit={handleNewMessage}>
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder={`message @${friend.username}`}
          />
        </form>
      </div>
    </div>
  );
};

export const FriendCard = (props: ComponentProps<"div"> & FriendCardProps) => {
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <div>{props.friend.username}</div>
        </PopoverTrigger>
        <PopoverContent className="text-black p-0 mr-4 left-20 z-10">
          <FriendCardOpen friend={props.friend} />
        </PopoverContent>
      </Popover>
    </>
  );
};

export const FriendsList = ({ friends }: FriendsListProps) => {
  return (
    <div className="space-y-3 ">
      {friends?.map((friend) => {
        return <FriendCard key={friend.id} friend={friend} />;
      })}
    </div>
  );
};
