import { FriendHandler } from "../../../../../shared/src/handlers/FriendHandler";
import { RenderChatMesages } from "@/Components/RenderChat2";
export default async function CHATPAGE({ params: { id }, }) {
    const conversationBlob = await fetch("http://localhost:3001/conversation/" + id);
    const conversationJson = (await conversationBlob.json());
    const isFriend = await new FriendHandler(conversationJson.users[0].id).isFriend(conversationJson.users[1].id);
    console.log(isFriend);
    return (<div id="chatlog">
      <RenderChatMesages isFriend={isFriend} conversation={conversationJson}/>
    </div>);
}
