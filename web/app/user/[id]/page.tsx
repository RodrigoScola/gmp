"use client";
import { GameData, getGameData } from "@/../shared/src/game/gameUtils";
import { LogoutButton } from "@/Components/buttons/LogoutButton";
import { FriendsTab } from "@/Components/tabs/FriendsTab";
import { db } from "@/db/supabase";
import { useUser } from "@/hooks/useUser";
import { chatSocket } from "@/lib/socket";
import { Avatar } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { GameNames, gameNames } from "../../../../shared/src/types/game";
import { IUser } from "../../../../shared/src/types/users";

export default function PROFILEPAGE({
     params,
}: {
     params: {
          id: string;
     };
}) {
     const { user: currentUser, getFriends, friends } = useUser();
     const [user, setUser] = useState<IUser>({
          created_at: Date.now().toString(),
          email: "defaultemail@gmail.com",
          id: "defaultid",
          username: params.id,
     });
     useEffect(() => {
          if (!chatSocket.connected) {
               chatSocket.auth = {
                    user: currentUser,
               };
               chatSocket.connect();
          }
          return () => {
               if (chatSocket.connected) chatSocket.disconnect();
          };
     }, []);

     const [conversationId, setConversationId] = useState<string | null>(null);
     const getInformation = async () => {
          if (!currentUser) return;
          if (!params.id) return;
          const user = await db
               .from("profiles")
               .select("*")
               .eq("username", params.id)
               .single();
          if (!user.data) return;
          setUser(user.data);
          chatSocket.emit(
               "find_conversation",
               currentUser.id,
               user.data.id,
               (data) => {
                    console.log(data);
                    setConversationId(data.id as string);
               }
          );
     };
     useEffectOnce(() => {
          getInformation();
     });
     useEffect(() => {
          getFriends();
     }, [user.id]);

     const [gamesArr, setGamesArr] = useState<IUser[][]>([]);
     useEffect(() => {
          const arr: IUser[][] = [0, 1, 2, 3].map((_, i) => {
               const choice = Math.random() < 0.5;
               const user1 = {
                    created_at: Date.now().toString(),
                    email: "handomizando@gmail.com",
                    id: "asdfp9asd",
                    username: user.username,
               };
               const user2 = {
                    created_at: Date.now().toString(),
                    email: "opponent@gmail.com",
                    id: "thisopponentid",
                    username: "oppponent",
               };
               return choice ? [user1, user2] : [user2, user1];
          });
          setGamesArr(arr);
     }, []);
     return (
          <div className="flex flex-row gap-2">
               <div className="w-fit m-auto mt-2 rounded-md lg:px-24 px-12   bg-gradient-to-b from-gray-800 to-90% to-gray-900/40 py-2 ">
                    <div className="m-auto w-full  ">
                         <div className="w-full flex  justify-start gap-3 items-center">
                              <div>
                                   {user?.id && (
                                        <Avatar
                                             name={user.username
                                                  .split("")
                                                  .join(" ")}
                                             size={"2xl"}
                                        />
                                   )}
                              </div>
                              <div className="flex flex-col gap-2">
                                   <h1 className="text-4xl font-ginto font-normal capitalize text-white ">
                                        {user.username}
                                   </h1>
                                   <div className="inline-flex gap-3 mb-2">
                                        <div>23 friends</div>
                                        <div>2 Badges</div>
                                   </div>
                                   <div>
                                        {user.id !== currentUser?.id ? (
                                             <Link
                                                  className="button bg-white  text-gray-900"
                                                  href={`user/${conversationId}/chat`}
                                             >
                                                  Start a Chat
                                             </Link>
                                        ) : (
                                             <div>
                                                  <LogoutButton />
                                             </div>
                                        )}
                                   </div>
                              </div>
                         </div>
                    </div>
                    <div className="">
                         <p className="text-2xl py-4  font-whitney font-semibold shadow-sm ">
                              Game Stats
                         </p>
                         <div className="flex gap-2 justify-evenly">
                              <GameStatCard game="Tic Tac Toe" kd={0.3} />
                              <GameStatCard game="connect Four" kd={0.4} />
                              <GameStatCard
                                   game="Rock Paper Scissors"
                                   kd={20}
                              />
                              <GameStatCard game="Simon Says" kd={0.3} />
                         </div>
                    </div>
                    <div className="">
                         <h3 className="text-2xl font-whitney py-4 font-semibold shadow-sm ">
                              Matches
                         </h3>
                         <ul className="space-y-8 pb-6">
                              {gamesArr.map(([user1, user2], i) => {
                                   return (
                                        <li key={i}>
                                             <GameMatchCard
                                                  user1={user1}
                                                  user2={user2}
                                             />
                                        </li>
                                   );
                              })}
                         </ul>
                    </div>
               </div>
               <FriendsTab friends={friends} />
          </div>
     );
}

type GameStatCardProps = {
     kd: number;
     game: GameNames;
};
type GameMatchCardProps = {
     user2: IUser;
     user1: IUser;
};
const GameMatchCard = (props: GameMatchCardProps) => {
     const [randomGame, _] = useState<GameData>(
          getGameData(gameNames[Math.floor(Math.random() * gameNames.length)])
     );

     return (
          <div className="flex flex-row    rounded-md ">
               <div className="text-center">
                    <p className="font-whitney text-left pt-2 text-md  text-gray-300/60">
                         25 min ago *{" "}
                         <span className="capitalize">{randomGame.name}</span>
                    </p>
                    <p className="text-3xl  font-ginto font-bold capitalize ">
                         {props.user1.username} vs {props.user2.username}
                    </p>
               </div>
          </div>
     );
};

const GameStatCard = (props: GameStatCardProps) => {
     return (
          <div className="bg-gray-600  shadow-lg border rounded-lg p-2  border-gray-600">
               <div>
                    <p className=" text-center font-ginto shadow-sm font-bold text-3xl">
                         {props.kd} KD
                    </p>
               </div>
               <div>
                    <p className="text-xl font-whitney ">{props.game}</p>
               </div>
          </div>
     );
};
