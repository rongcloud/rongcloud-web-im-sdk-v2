module RongIMLib {
  export interface DataAccessProvider {
    addConversation(conversation: Conversation): void;

    removeConversation(conversationType: ConversationType, targetId: string): void;

    clearConversations(conversationType: ConversationType): void;

    addMessage(conversationType: ConversationType, targetId: string, message: Message): void;

    removeMessage(conversationType: ConversationType, targetId: string, messageId: number): void;

    clearMessages(conversationType: ConversationType, targetId: string): void;

    updateMessages(conversationType: ConversationType, targetId: string, key: string, value: any): void;
  }

  export class DataAccessProviderBase {
    composeConversationKey(conversationType: ConversationType, targetId: string): string {
      //var conversationTypeValue: number = conversationType;
      return `_rc_ct_${conversationType}_${targetId}`;
    }
  }
}
