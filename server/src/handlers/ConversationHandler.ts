import {
  ChatConversationType,
  ChatMessageType,
  ChatUserState,
} from "../../../web/types";
import { getFromFile } from "../utlils";
import { IMainUser, uhandler } from "./usersHandler";

type MessageUser = {
  id: string;
  state: ChatUserState;
};
export class ConversationHandler {
  messages: ChatMessageType[] = [];
  users: Map<string, MessageUser>;

  conversation?: ChatConversationType;

  constructor(users?: string[]) {
    this.users = new Map<string, MessageUser>();
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
  // TODO: change this to get the actual conversation, this now just gets the conversation.json
  async getConversation(conversationId: string) {
    const file = await getFromFile<ChatConversationType>(
      "../web/data/conversationjson.json"
    );
    this.conversation = file;
    this.conversation.users.forEach((user) => {
      if (this.users.has(user.id)) {
        this.users.set(user.id, {
          id: user.id,
          state: ChatUserState.online,
        });
      } else {
        this.users.set(user.id, {
          id: user.id,
          state: ChatUserState.offline,
        });
      }
      // console.log(this);
    });

    // console.log(file);
  }
  getUsers(): IMainUser[] {
    let users: IMainUser[] = [];
    this.users.forEach((value, key) => {
      if (uhandler.getUser(key)) {
        const user = uhandler.getUser(key) as IMainUser;
        if (user) users.push(user);
      }
    });
    return users;
  }
}
