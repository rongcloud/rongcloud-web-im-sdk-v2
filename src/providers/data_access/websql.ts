module RongIMLib {
    export class WebSQLDataProvider implements DataAccessProvider {
        addConversation(conversation: Conversation, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        addMessage(conversationType: ConversationType, targetId: string, message: MessageContent, callback?: ResultCallback<Message>) {
            throw new Error("Not implemented yet");
        }

        removeMessage(conversationType: ConversationType, targetId: string, messageIds: number[], callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        updateMessage(message: Message, callback?: ResultCallback<Message>) {
            throw new Error("Not implemented yet");
        }

        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        updateMessages(conversationType: ConversationType, targetId: string, key: string, value: any, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        getConversation(conversationType: ConversationType, targetId: string): Conversation {
            throw new Error("Not implemented yet");
        }

        getConversationList(callback: ResultCallback<Conversation[]>,conversationTypes?: ConversationType[]) {
            throw new Error("Not implemented yet");
        }

        clearConversations(conversationTypes: ConversationType[], callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback) {
            throw new Error("Not implemented yet");
        }

        getTotalUnreadCount(callback: ResultCallback<number>) {
            throw new Error("Not implemented yet");
        }

        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>) {
            throw new Error("Not implemented yet");
        }

        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>) {
            throw new Error("Not implemented yet");
        }

        setConversationToTop(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        setMessageReceivedStatus(messageId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }
    }
}
