import { RedirectPage } from "@/Components/RedirectPage"
import { RenderChatMesages } from "@/Components/RenderChat2"
import { serverURl } from "@/constants"
import { FriendHandler } from "../../../../../../shared/src/handlers/FriendHandler"
import { ChatConversationType } from "../../../../../../shared/src/types/users"

export default async function CHATPAGE({
     params: { id },
}: {
     params: { id: string }
}) {
     const conversationBlob = await fetch(serverURl + "/conversation/" + id, {
          headers: {
               "Content-Type": "application/json",
          },
     })
     if (!conversationBlob.ok) {
          return <div>Conversation not found</div>
     }
     let conversationJson: ChatConversationType | { message: string } =
          (await conversationBlob.json()) as ChatConversationType
     if ("message" in conversationJson) {
          conversationJson = conversationJson as { message: string }
          return (
               <div className="m-auto w-fit">
                    <div>{conversationJson.message}</div>
                    <div>
                         <RedirectPage />
                    </div>
               </div>
          )
     }
     const isFriend = await new FriendHandler(
          conversationJson.users[0].id
     ).isFriend(conversationJson.users[1].id)

     return (
          <RenderChatMesages
               isFriend={isFriend}
               conversation={conversationJson}
          />
     )
}
