import { FriendHandler } from "../../../../../shared/src/handlers/FriendHandler";
import { RenderChatMesages } from "@/Components/RenderChat2";
import { ChatConversationType } from "../../../../../shared/src/types/users";
import { RedirectPage } from "@/Components/RedirectPage";

export default async function CHATPAGE({
  params: { id },
}: {
  params: { id: string };
}) {
  const conversationBlob = await fetch(
    "http://localhost:3001/conversation/" + id
  );
  if (!conversationBlob.ok) {
    return <div>Conversation not found</div>;
  }
  let conversationJson: ChatConversationType | { message: string } =
    (await conversationBlob.json()) as ChatConversationType;
  if ("message" in conversationJson) {
    conversationJson = conversationJson as { message: string };
    return (
      <div className="m-auto w-fit">
        <div>{conversationJson.message}</div>
        <div>
          <RedirectPage />
        </div>
      </div>
    );
  }
  const isFriend = await new FriendHandler(
    conversationJson.users[0].id
  ).isFriend(conversationJson.users[1].id);
  return (
    <div id="chatlog">
      <RenderChatMesages isFriend={isFriend} conversation={conversationJson} />
    </div>
  );
}
