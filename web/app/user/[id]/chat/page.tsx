import { FriendHandler } from "@/../server/src/handlers/FriendHandler";
import { RenderChatMesages } from "@/Components/RenderChat2";
import { ChatConversationType } from "@/types/users";

export default async function CHATPAGE({
  params: { id },
}: {
  params: { id: string };
}) {
  const conversationBlob = await fetch(
    "http://localhost:3001/conversation/" + id
  );
  const conversationJson: ChatConversationType =
    (await conversationBlob.json()) as ChatConversationType;

  const isFriend = await new FriendHandler(
    conversationJson.users[0].id
  ).isFriend(conversationJson.users[1].id);
  console.log(isFriend);
  return (
    <div id="chatlog">
      <RenderChatMesages isFriend={isFriend} conversation={conversationJson} />
    </div>
  );
}
