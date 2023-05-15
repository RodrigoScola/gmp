import { ChatMessageType, ChatUserState } from "../../../web/types";

type MessageUser = {
  id: string;
  state: ChatUserState;
};
export class MessageHandler {
  messages: ChatMessageType[] = [];
  users: Record<string, MessageUser> = {};
  constructor(users?: string[]) {
    if (users?.length) {
      users.forEach((user) => {
        this.addUser(user);
      });
    }
  }

  newMessage(userId: string, content: string): ChatMessageType {
    return {
      created: new Date().toISOString(),
      userId,
      id: Date.now().toString(),
      message: content,
    };
  }
  addMessage(message: ChatMessageType) {
    this.messages.push(message);
  }
  addUser(userId: string) {
    if (this.users[userId]) return;
    this.users[userId] = {
      id: userId,
      state: ChatUserState.online,
    };
  }
}
