import { RedirectPage } from "@/Components/RedirectPage";
import { RenderChatMesages } from "@/Components/RenderChat2";
import { serverURl } from "@/constants";
import { FriendHandler } from "../../../../../shared/src/handlers/FriendHandler";
export default async function CHATPAGE({ params: { id }, }) {
    const conversationBlob = await fetch(serverURl + "/conversation/" + id, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!conversationBlob.ok) {
        return <div>Conversation not found</div>;
    }
    let conversationJson = (await conversationBlob.json());
    console.log(conversationJson);
    if ("message" in conversationJson) {
        conversationJson = conversationJson;
        return (<div className="m-auto w-fit">
                    <div>{conversationJson.message}</div>
                    <div>
                         <RedirectPage />
                    </div>
               </div>);
    }
    const isFriend = await new FriendHandler(conversationJson.users[0].id).isFriend(conversationJson.users[1].id);
    console.log(conversationJson);
    return (<div id="chatlog">
               <RenderChatMesages isFriend={isFriend} conversation={conversationJson}/>
          </div>);
}
