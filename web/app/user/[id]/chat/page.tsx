import { RenderChatMesages } from "@/Components/RenderChatMessages"
import { getFromFile } from "@/lib/utils"
import { ChatConversationType } from "@/types"

export default async function CHATPAGE() {
	const conversation: ChatConversationType = await getFromFile("./data/conversationjson.json")

	return (
		<div>
			<div id="chatlog">
				<RenderChatMesages chatMessages={conversation} />
			</div>
			<input />
		</div>
	)
}
