"use client";
import { FriendsList } from "@/Components/Friends/FriendsComponents";
import { useFriends } from "@/hooks/useFriends";
import { useUser } from "@/hooks/useUser";
// import { getUrl } from "@/lib/utils";
import { IFriend } from "@/types/users";
import Link from "next/link";
import { useState } from "react";
import { useEffectOnce } from "usehooks-ts";
export default function Home() {
  const { user } = useUser();
  const [userFriends, setFriends] = useState<IFriend[]>([]);
  const friends = useFriends();
  useEffectOnce(() => {
    friends?.getFriends(user.id).then((friends) => {
      setFriends(friends);
    });
    console.log(user.id);
    console.log(userFriends);
  });
  return (
    <div className="flex flex-row">
      <div className="flex flex-col text-white w-screen h-screen">
        <div className="w-fit m-auto text-5xl">
          <h1>The Game Zone</h1>
        </div>
        <div className=" m-auto w-fit mt-10">
          <Link className="border rounded-md p-2" href={"/play"}>
            Play a game
          </Link>
        </div>
      </div>
      <div>
        <div className="text-white">
          <FriendsList friends={userFriends} />
        </div>
      </div>
    </div>
  );
}
