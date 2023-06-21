import { ChatConversationType, ChatMessageType, MessageUser, NewChatChatMessageType } from "../types/users";
import { IMainUser } from "./usersHandler";
export declare class ConversationHandler {
    messages: ChatMessageType[];
    users: Map<string, MessageUser>;
    conversation: ChatConversationType;
    constructor(users?: string[]);
    addUser(user: MessageUser): void;
    newMessage(userId: string, content: string): NewChatChatMessageType;
    addMessage(message: ChatMessageType): Promise<void>;
    getConversation(conversationId: string): Promise<ChatConversationType | undefined>;
    getUsers(): IMainUser[];
}
export declare const newMessage: (userId: string, content: string) => ChatMessageType;
