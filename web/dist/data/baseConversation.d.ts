import { ChatConversationType, ChatMessageType } from "../../shared/src/types/users";
export declare const newMessage: (id: string, message: Partial<ChatMessageType>) => ChatMessageType;
export declare const newConversation: () => ChatConversationType;
export declare const syncConversation: () => void;
//# sourceMappingURL=baseConversation.d.ts.map