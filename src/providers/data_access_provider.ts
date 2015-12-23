module RongIMLib {
    export interface DataAccessProvider {
        addConversation(conversation: Conversation, callback: ResultCallback<boolean>): void;

        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;

        addMessage(conversationType: ConversationType, targetId: string, message: MessageContent, callback: ResultCallback<Message>): void;

        removeMessage(conversationType: ConversationType, targetId: string, messageId: number[], callback: ResultCallback<boolean>): void;

        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;

        updateMessages(conversationType: ConversationType, targetId: string, key: string, value: any, callback: ResultCallback<boolean>): void;

        getConversation(conversationType: ConversationType, targetId: string): Conversation;

        getConversationList(callback: ResultCallback<Conversation[]>): void;

        clearConversations(conversationTypes: ConversationType[], callback: ResultCallback<boolean>): void;

        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: ResultCallback<Message[]>): void;

        getTotalUnreadCount(callback: ResultCallback<number>): void;

        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>): void;

        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>): void;

        setConversationToTop(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;
    }
}
