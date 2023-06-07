"use client";
import { LogoutButton } from "@/Components/buttons/LogoutButton";
import { FriendsTab } from "@/Components/tabs/FriendsTab";
import { db } from "@/db/supabase";
import { useUser } from "@/hooks/useUser";
import Profile from "@/images/profile.webp";
import { chatSocket } from "@/lib/socket";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { GameNames } from "../../../../shared/src/types/game";
import { IFriend, IUser } from "../../../../shared/src/types/users";

export default function PROFILEPAGE({
     params,
}: {
     params: {
          id: string;
     };
}) {
     const { user: currentUser, getFriends } = useUser();
     const [user, setUser] = useState<IUser>({
          created_at: Date.now().toString(),
          email: "defaultemail@gmail.com",
          id: "defaultid",
          username: "defaultusername",
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

     const [userFriends, setUserfriends] = useState<IFriend[]>([]);
     const [conversationId, setConversationId] = useState<string | null>(null);
     const getInformation = async () => {
          if (!currentUser) return;
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

          const f = await getFriends();
          if (f?.length) {
               setUserfriends(f);
          }
     };
     useEffectOnce(() => {
          getInformation();
     });
     return (
          <div className="flex flex-row ">
               <div className="w-fit m-auto mt-2 rounded-md px-24 bg-gray-700 ">
                    <div className="m-auto w-full  ">
                         <div className="w-full flex  justify-start gap-2 items-center">
                              <div>
                                   {user?.id && (
                                        <Image
                                             src={Profile.src}
                                             width={150}
                                             height={150}
                                             alt={`profile image for ${user.id}`}
                                        />
                                   )}
                              </div>
                              <div className="">
                                   <h1 className="text-4xl font-ginto font-normal capitalize text-white ">
                                        {user.username}
                                   </h1>
                                   <div className="inline-flex gap-3">
                                        <div>23 friends</div>
                                        <div>2 Badges</div>
                                   </div>
                                   <div>
                                        {user.id !== currentUser?.id ? (
                                             <Link
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
                         <div className="flex justify-evenly">
                              <GameStatCard game="Tic Tac Toe" kd={0.3} />
                              <GameStatCard game="connect Four" kd={0.4} />
                              <GameStatCard
                                   game="Rock Paper Scissors"
                                   kd={20}
                              />
                              <GameStatCard game="Simon Says" kd={0.3} />
                         </div>
                    </div>
                    <div className="w-fit m-auto">
                         <h3 className="text-2xl font-whitney py-4 font-semibold shadow-sm ">
                              Matches
                         </h3>
                         <ul className="space-y-2">
                              {new Array(4).fill(0).map((_, i) => {
                                   return (
                                        <li key={i}>
                                             <GameMatchCard
                                                  user1={{
                                                       created_at:
                                                            Date.now().toString(),
                                                       email: "handomizando@gmail.com",
                                                       id: "asdfp9asd",
                                                       username: user.username,
                                                  }}
                                                  user2={{
                                                       created_at:
                                                            Date.now().toString(),
                                                       email: "opponent@gmail.com",
                                                       id: "thisopponentid",
                                                       username: "oppponent",
                                                  }}
                                                  image={Profile.src}
                                             />
                                        </li>
                                   );
                              })}
                         </ul>
                    </div>
               </div>
               <FriendsTab friends={userFriends} />
          </div>
     );
}

type GameStatCardProps = {
     kd: number;
     game: GameNames;
};
type GameMatchCardProps = {
     image: string;
     user2: IUser;
     user1: IUser;
};
const GameMatchCard = (props: GameMatchCardProps) => {
     return (
          <div className="flex flex-row   p-2 rounded-md shadow-md">
               <Image
                    src={props.image}
                    width={75}
                    height={50}
                    alt={`profile image for ${props.user1.id}`}
               />
               <div className="">
                    <p className="font-whitney text-gray-300/60">25 min ago</p>
                    <p className="text-4xl font-ginto font-bold capitalize ">
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
