"use client"
import { useUser } from "@/hooks/useUser"
import { ChatConversationType } from "@/types"

export const RenderChatMesages = (props: { chatMessages: ChatConversationType }) => {
	const user = useUser()

	return (
		<div>
			{props.chatMessages.messages.map((message) => {
				return (
					<div className={`${user.id == message.userId ? "bg-red-50" : ""}`}>
						<p>{message.message}</p>
					</div>
				)
			})}
		</div>
	)
}
