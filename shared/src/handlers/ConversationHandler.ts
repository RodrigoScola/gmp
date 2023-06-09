import { db } from "../db"
import {
     ChatConversationType,
     ChatMessageType,
     IUser,
     MessageUser,
     NewChatChatMessageType,
     UserState,
} from "../types/users"
import { IMainUser, uhandler } from "./usersHandler"

export class ConversationHandler {
     messages: ChatMessageType[] = []
     users: Map<string, MessageUser>

     conversation: ChatConversationType = {
          id: "",
          messages: [],
          users: [],
     }

     constructor(users?: string[]) {
          this.users = new Map<string, MessageUser>()
          this.conversation = {
               id: "",
               messages: [],
               users: [],
          }
          if (users?.length) {
               users.forEach((user) => {
                    this.addUser({
                         id: user,
                         state: UserState.inChat,
                    })
               })
          }
     }
     async createConversation(user1: string, user2: string) {
          const conversation = await db.rpc("find_conversation", {
               user1_id: user1,
               user2_id: user2,
          })
          if (conversation) return conversation.data

          const { data } = await db
               .from("conversations")
               .insert({
                    user1,
                    user2,
                    created_at: new Date().toISOString(),
               })
               .select()
               .single()

          return data?.id
     }
     addUser(user: MessageUser): void {
          if (!this.users.has(user.id)) {
               this.users.set(user.id, user)
          }
     }
     newMessage(userId: string, content: string): NewChatChatMessageType {
          return this.newMessage(userId, content)
     }
     async addMessage(message: ChatMessageType) {
          console.log(this.conversation)
          await db
               .from("messages")
               .insert({
                    message: message.message,
                    conversationId: Number(this.conversation.id),
                    userId: message.userId,
                    created: message.created,
               })
               .select()
          this.messages.push(message)
          console.log(this.messages)
     }
     async getConversation(conversationId: string) {
          const { data: file } = await db
               .from("conversations")
               .select("*")
               .eq("id", conversationId)
               .single()

          console.log(file)
          if (!file) return

          this.conversation.id = file.id
          this.conversation.users = [{ id: file!.user1 }, { id: file!.user2 }]
          this.conversation.users.forEach(
               (user: Partial<IUser> & { id: string }) => {
                    if (this.users.has(user.id)) {
                         this.users.set(user.id, {
                              id: user.id,
                              state: UserState.online,
                         })
                    } else {
                         this.users.set(user.id, {
                              id: user.id,
                              state: UserState.offline,
                         })
                    }
               }
          )
          return this.conversation
     }
     getUsers(): IMainUser[] {
          let users: IMainUser[] = []
          this.users.forEach((_, key) => {
               if (uhandler.getUser(key)) {
                    const user = uhandler.getUser(key) as IMainUser
                    if (user) users.push(user)
               }
          })
          return users
     }
}
export const newMessage = (
     userId: string,
     content: string
): ChatMessageType => {
     return {
          created: new Date().toISOString(),
          userId,
          id: Date.now().toString(),
          message: content,
     }
}
