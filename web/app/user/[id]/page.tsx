"use client";
import Profile from "@/images/profile.webp";
import Image from "next/image";
import { Tooltip } from "@/Components/Tooltip";
import Link from "next/link";
import { useEffectOnce } from "usehooks-ts";
import { useState } from "react";
import { IUser } from "@/types/users";
import { db } from "@/db/supabase";
import { useUser } from "@/hooks/useUser";

export default function PROFILEPAGE({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { user: currentUser } = useUser();
  const [user, setUser] = useState<IUser>({
    created_at: Date.now().toString(),
    email: "defaultemail@gmail.com",
    id: "defaultid",
    username: "defaultusername",
  });
  const [conversationId, setConversationId] = useState<string | null>(null);
  const getInformation = async () => {
    const user = await db
      .from("profiles")
      .select("*")
      .eq("username", params.id)
      .single();

    if (!user.data) return;
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

    setConversationId(nconversationId);
  };
  useEffectOnce(() => {
    getInformation();
  });

  return (
    <div>
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
            <Link href={`user/${conversationId}/chat`}>Start a Chat</Link>
            <ul className="flex gap-2">
              {user.expand?.badges?.badges?.map((badge, i) => {
                return (
                  <li key={`badge_${i}`} id={`badge${i}`} className="">
                    <Tooltip text={badge.description}>{badge.name}</Tooltip>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="inline-flex gap-3">
          <div>23 friends</div>
          <div>2 Badges</div>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <div className="h-40 w-40 bg-red-50 rounded-lg flex justify-center flex-col items-center">
          <p className="text-3xl">0.3 kd</p>
          <p className="text-xl">Tic tac toe</p>
        </div>
        <div className="h-40 w-40 bg-red-50 rounded-lg flex justify-center flex-col items-center">
          <p className="text-3xl">0.9 kd</p>
          <p className="text-xl">4 square</p>
        </div>
        <div className="h-40 w-40 bg-red-50 rounded-lg flex justify-center flex-col items-center">
          <p className="text-3xl">20 kd</p>
          <p className="text-xl">Rock paper scissors</p>
        </div>

        <div className="h-40 w-40 bg-red-50 rounded-lg flex justify-center flex-col items-center">
          <p className="text-3xl">199</p>
          <p className="text-xl">Simon Says</p>
        </div>
      </div>
      <div className="w-fit m-auto">
        <h3 className="text-3xl text-center">Matches</h3>
        <ul className="space-y-2">
          <li className="w-full bg-red-50">
            <div className="flex flex-row">
              <div></div>
              <div className="">
                <div className="inline-flex gap-3">
                  <p>25 min ago</p>
                  <p>*</p>
                  <p>New Record</p>
                </div>
                <p className="text-4xl">29 rounds</p>
              </div>
            </div>
          </li>
          {new Array(4).fill(0).map((_, i) => {
            return (
              <li key={i}>
                <div className="flex flex-row">
                  <Image
                    src={Profile.src}
                    width={75}
                    height={50}
                    alt={`profile image for ${user.id}`}
                  />
                  <div className="bg-blue-50">
                    <p>25 min ago</p>
                    <p className="text-4xl">first user vs second user</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div>Loading Icon</div>
      </div>
    </div>
  );
}
