"use client"

import { GameInvite, IUser } from "@/../shared/src/types/users"
import { baseUrl } from "@/constants"
import { useSocket } from "@/hooks/useSocket"
import { useNotification } from "@/hooks/useToast"
import { useUser } from "@/hooks/useUser"
import { userSocket } from "@/lib/socket"
import { Modal, ModalContent, Text, useColorMode } from "@chakra-ui/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useEffectOnce } from "usehooks-ts"
import { ChangeUsernameComponent } from "./ChangeUsername"
import { MessageReceivedNotification } from "./MessageReceivedNotification"
import { AddFiendComponent } from "./Notifications/AddFriend"
import { GameInviteComponent } from "./Notifications/GameInvite"

export const Nav = () => {
     const { user } = useUser()
     // NOTE: this is a hack to get the username to show up in the nav bar
     const [username, setUsername] = useState<string>("")
     useEffect(() => {
          if (user) {
               setUsername(user.username)
          }
     }, [user])
     const { colorMode, setColorMode } = useColorMode()
     useEffectOnce(() => {
          if (colorMode == "light") {
               setColorMode("dark")
          }
     })

     const { addNotification, removeNotification } = useNotification()
     useSocket<{ user: IUser | null }>(
          userSocket,
          {
               user: user,
          },
          () => {
               userSocket.auth = {
                    user: user,
               }
               userSocket.on("add_friend_response", (data) => {
                    addNotification("Game Request", {
                         duration: 15000,
                         isClosable: true,
                         render: (a) => (
                              <AddFiendComponent friend={data} {...a} />
                         ),
                    })
               })
               userSocket.on("notification_message", (data) => {
                    addNotification(
                         `${data.user.username} sent you a message`,
                         {
                              render: () => (
                                   <div
                                        onClick={() => {
                                             window.location.href = `${baseUrl}/user/${data.conversationId}/chat`
                                        }}
                                   >
                                        <MessageReceivedNotification
                                             username={data.user.username ?? ""}
                                        />
                                   </div>
                              ),
                         }
                    )
               })
               userSocket.on("game_invite", (data: GameInvite) => {
                    addNotification(`Game Request from ${data.inviteId}`, {
                         duration: 15000,
                         render: () => (
                              <GameInviteComponent
                                   onClose={() => {
                                        removeNotification(
                                             `Game Request from ${data.inviteId}`
                                        )
                                   }}
                                   gameInvite={data}
                              />
                         ),
                    })
               })
               userSocket.on("game_invite_accepted", (data) => {
                    console.log("game acepted")
                    window.location.href = `/play/${data.roomId}/?gamename=${data.gameName}`
               })
          }
     )
     const [canChangeUsername, setCanChangeUsername] = useState<boolean>(false)
     useEffect(() => {
          if (user) {
               if (!user.username && user.id.length > 0) {
                    console.log(user)
                    setCanChangeUsername(true)
               }
          }
     }, [user])

     return (
          <div className="  bg-gray-800  ">
               <nav className="flex justify-around m-auto w-[90%] items-center py-2 flex-row">
                    <Link className="text-4xl" href={`${baseUrl}`}>
                         <h3 className="font-ginto font-black">TGZ</h3>
                    </Link>
                    {canChangeUsername && user && (
                         <Modal
                              isOpen={canChangeUsername}
                              onClose={() => setCanChangeUsername(false)}
                         >
                              <ModalContent>
                                   <ChangeUsernameComponent
                                        currentUser={user}
                                        onClose={() => {
                                             setCanChangeUsername(false)
                                        }}
                                   />
                              </ModalContent>
                         </Modal>
                    )}
                    <div>
                         {username ? (
                              <Link href={`/user/${username}`}>
                                   <Text className="font-bold selectable px-2 py-1 rounded-lg capitalize">
                                        {username}
                                   </Text>
                              </Link>
                         ) : (
                              <div className="flex flex-row gap-2">
                                   <Link href={`${baseUrl}/login`}>login</Link>
                                   <Link href={`${baseUrl}/register`}>
                                        create account
                                   </Link>
                              </div>
                         )}
                    </div>
               </nav>
          </div>
     )
}
