import { RenderChatMesages } from "@/Components/RenderChat2";
import { getUserByUsername } from "@/db/User";
import { ChatConversationType } from "@/types/types";

export default async function CHATPAGE({
  params: { id },
}: {
  params: { id: string };
}) {
  const conversation: ChatConversationType = await fetch(
    "http://localhost:3000/api/chat/snuffy/?page=1"
  ).then((r) => r.json());

  const user = await getUserByUsername(id);

  return (
    <div id="chatlog">
      <RenderChatMesages user={user} chatMessages={conversation} />
    </div>
  );
}
