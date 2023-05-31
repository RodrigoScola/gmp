"use client";
import Profile from "@/images/profile.webp";
import Image from "next/image";
import Link from "next/link";
import { useEffectOnce } from "usehooks-ts";
import { useEffect, useState } from "react";
import { IFriend, IUser } from "../../../../shared/src/types/users";
import { db } from "@/db/supabase";
import { useUser } from "@/hooks/useUser";
import { FriendsList } from "@/Components/Friends/FriendsComponents";
import { GameNames } from "../../../../shared/src/types/game";
import { Card, CardBody, CardHeader } from "@chakra-ui/react";
import { LogoutButton } from "@/Components/buttons/LogoutButton";
import { AddNewFriend } from "@/Components/Friends/AddNewFriend";
import { chatSocket } from "@/lib/socket";

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
          <div className="grid grid-cols-7">
               <div className="col-span-6">
                    <div className="m-auto w-fit">
                         <div className="flex">
                              {user?.id && (
                                   <Image
                                        src={Profile.src}
                                        width={150}
                                        height={150}
                                        alt={`profile image for ${user.id}`}
                                   />
                              )}
                              <div className="">
                                   <h1 className="text-4xl">{user.username}</h1>
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
                                   <ul className="flex gap-2">
                                        {/* {user.badges?.badges?.map((badge, i) => {
                  return (
                    <li key={`badge_${i}`} id={`badge${i}`} className="">
                      <Tooltip text={badge.description}>{badge.name}</Tooltip>
                    </li>
                  );
                })} */}
                                   </ul>
                              </div>
                         </div>
                         <div className="inline-flex gap-3">
                              <div>23 friends</div>
                              <div>2 Badges</div>
                         </div>
                    </div>
                    <div className="flex justify-center gap-4">
                         <GameStatCard game="Tic Tac Toe" kd={0.3} />
                         <GameStatCard game="connect Four" kd={0.4} />
                         <GameStatCard game="Rock Paper Scissors" kd={20} />
                         <GameStatCard game="Simon Says" kd={0.3} />
                    </div>
                    <div className="w-fit m-auto">
                         <h3 className="text-3xl text-center">Matches</h3>
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
                         <div>Loading Icon</div>
                    </div>
               </div>
               <div>
                    <AddNewFriend />
                    <FriendsList friends={userFriends} />
               </div>
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
          <div className="flex flex-row">
               <Image
                    src={props.image}
                    width={75}
                    height={50}
                    alt={`profile image for ${props.user1.id}`}
               />
               <div className="">
                    <p>25 min ago</p>
                    <p className="text-4xl">
                         {props.user1.username} vs {props.user2.username}
                    </p>
               </div>
          </div>
     );
};

const GameStatCard = (props: GameStatCardProps) => {
     return (
          <Card>
               <CardHeader>
                    <p className="text-3xl">{props.kd} kd</p>
               </CardHeader>
               <CardBody>
                    <p className="text-xl">{props.game}</p>
               </CardBody>
          </Card>
     );
};
