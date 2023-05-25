"use client";
import Profile from "@/images/profile.webp";
import Image from "next/image";
import Link from "next/link";
import { useEffectOnce } from "usehooks-ts";
import { useState } from "react";
import { db } from "@/db/supabase";
import { useUser } from "@/hooks/useUser";
import { FriendsList } from "@/Components/Friends/FriendsComponents";
import { Card, CardBody, CardHeader } from "@chakra-ui/react";
export default function PROFILEPAGE({ params, }) {
    const { user: currentUser, getFriends } = useUser();
    const [user, setUser] = useState({
        created_at: Date.now().toString(),
        email: "defaultemail@gmail.com",
        id: "defaultid",
        username: "defaultusername",
    });
    const [userFriends, setUserfriends] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const getInformation = async () => {
        const user = await db
            .from("profiles")
            .select("*")
            .eq("username", params.id)
            .single();
        if (!user.data)
            return;
        setUser(user.data);
        let d = await db
            .rpc("find_conversation", {
            user1_id: currentUser.id,
            user2_id: user.data.id,
        })
            .single();
        let nconversationId = d.data?.id;
        if (!nconversationId) {
            const { data: nconv } = await db
                .from("conversations")
                .insert({
                user1: currentUser.id,
                user2: user.data.id,
            })
                .select("*")
                .single();
            nconversationId = nconv?.id;
        }
        const f = await getFriends();
        if (f?.length) {
            setUserfriends(f);
        }
        setConversationId(nconversationId?.toString() ?? "");
    };
    useEffectOnce(() => {
        getInformation();
    });
    console.log(userFriends);
    return (<div className="grid grid-cols-7">
      <div className="col-span-6">
        <div className="m-auto w-fit">
          <div className="flex">
            {user?.id && (<Image src={Profile.src} width={150} height={150} alt={`profile image for ${user.id}`}/>)}
            <div className="">
              <h1 className="text-4xl">{user.username}</h1>
              {user.id !== currentUser.id && (<Link href={`user/${conversationId}/chat`}>Start a Chat</Link>)}
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
          <GameStatCard game="Tic Tac Toe" kd={0.3}/>
          <GameStatCard game="connect Four" kd={0.4}/>
          <GameStatCard game="Rock Paper Scissors" kd={20}/>
          <GameStatCard game="Simon Says" kd={0.3}/>
        </div>
        <div className="w-fit m-auto">
          <h3 className="text-3xl text-center">Matches</h3>
          <ul className="space-y-2">
            {new Array(4).fill(0).map((_, i) => {
            return (<li key={i}>
                  <GameMatchCard user1={{
                    created_at: Date.now().toString(),
                    email: "handomizando@gmail.com",
                    id: "asdfp9asd",
                    username: "snuffy",
                }} user2={{
                    created_at: Date.now().toString(),
                    email: "opponent@gmail.com",
                    id: "thisopponentid",
                    username: "oppponent",
                }} image={Profile.src}/>
                </li>);
        })}
          </ul>
          <div>Loading Icon</div>
        </div>
      </div>
      <div>
        <FriendsList friends={userFriends}/>
      </div>
    </div>);
}
const GameMatchCard = (props) => {
    return (<div className="flex flex-row">
      <Image src={props.image} width={75} height={50} alt={`profile image for ${props.user1.id}`}/>
      <div className="">
        <p>25 min ago</p>
        <p className="text-4xl">
          {props.user1.username} vs {props.user2.username}
        </p>
      </div>
    </div>);
};
const GameStatCard = (props) => {
    return (<Card>
      <CardHeader>
        <p className="text-3xl">{props.kd} kd</p>
      </CardHeader>
      <CardBody>
        <p className="text-xl">{props.game}</p>
      </CardBody>
    </Card>);
};
