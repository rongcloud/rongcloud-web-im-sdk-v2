module RongIMLib {
    export class ServerDataProvider implements DataAccessProvider {
        addConversation(conversation: Conversation, callback: ResultCallback<boolean>) {
            var isAdd: boolean = true;
            for (let i = 0, len = RongIMClient._memoryStore.conversationList.length; i < len; i++) {
                if (RongIMClient._memoryStore.conversationList[i].conversationType === conversation.conversationType && RongIMClient._memoryStore.conversationList[i].targetId === conversation.targetId) {
                    RongIMClient._memoryStore.conversationList.unshift(RongIMClient._memoryStore.conversationList.splice(i, 1)[0]);
                    isAdd = false;
                    break;
                }
            }
            if (isAdd) {
                RongIMClient._memoryStore.conversationList.unshift(conversation);
            }
            callback.onSuccess(true);
        }

        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            for (let i = 0, len = RongIMClient._memoryStore.conversationList.length; i < len; i++) {
                if (RongIMClient._memoryStore.conversationList[i].conversationType === conversationType && RongIMClient._memoryStore.conversationList[i].targetId === targetId) {
                    RongIMClient._memoryStore.conversationList.splice(i, 1);
                    if (MessageUtil.supportLargeStorage()) {
                        LocalStorageProvider.getInstance().removeItem("cu" + Bridge._client.userId + conversationType + targetId);
                    }
                    break;
                }
            }
            callback.onSuccess(true);
        }

        addMessage(conversationType: ConversationType, targetId: string, message: MessageContent, callback?: ResultCallback<Message>) {
            if (callback) {
                callback.onSuccess(new Message());
            }
        }

        removeMessage(conversationType: ConversationType, targetId: string, messageIds: number[], callback: ResultCallback<boolean>) {
            callback.onSuccess(true);
        }

        updateMessage(message: Message, callback?: ResultCallback<Message>) {
            callback.onSuccess(message);
        }

        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            callback.onSuccess(true);
        }

        updateMessages(conversationType: ConversationType, targetId: string, key: string, value: any, callback: ResultCallback<boolean>) {
            var me = this;
            if (key == "readStatus") {
                if (RongIMClient._memoryStore.conversationList.length > 0) {
                    me.getConversationList(<ResultCallback<Conversation[]>>{
                        onSuccess: function(list: Conversation[]) {
                            Array.forEach(list, function(conver: Conversation) {
                                if (conver.conversationType == conversationType && conver.targetId == targetId) {
                                    conver.unreadMessageCount = 0;
                                }
                            });
                        },
                        onError: function(errorCode: ErrorCode) {
                            callback.onError(errorCode);
                        }
                    }, null);
                }
            }
            callback.onSuccess(true);
        }

        getConversation(conversationType: ConversationType, targetId: string): Conversation {
            var conver: Conversation = null;
            for (let i = 0, len = RongIMClient._memoryStore.conversationList.length; i < len; i++) {
                if (RongIMClient._memoryStore.conversationList[i].conversationType == conversationType && RongIMClient._memoryStore.conversationList[i].targetId == targetId) {
                    conver = RongIMClient._memoryStore.conversationList[i];
                    if (MessageUtil.supportLargeStorage()) {
                        var count = LocalStorageProvider.getInstance().getItem("cu" + Bridge._client.userId + conversationType + targetId);
                        conver.unreadMessageCount == 0 ? conver.unreadMessageCount = Number(count) : null;
                    }
                }
            }
            return conver;
        }

        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[]) {
            if (RongIMClient._memoryStore.conversationList.length == 0) {
                RongIMClient.getInstance().getRemoteConversationList(<ResultCallback<Conversation[]>>{
                    onSuccess: function(list: Conversation[]) {
                        if (MessageUtil.supportLargeStorage()) {
                            Array.forEach(RongIMClient._memoryStore.conversationList, function(item: Conversation) {
                                var count = LocalStorageProvider.getInstance().getItem("cu" + Bridge._client.userId + item.conversationType + item.targetId);
                                item.unreadMessageCount == 0 ? item.unreadMessageCount = Number(count) : null;
                            });
                        }
                        callback.onSuccess(list);
                    },
                    onError: function(errorcode: ErrorCode) {
                        callback.onSuccess([]);
                    }
                }, conversationTypes);
            } else {
                if (conversationTypes) {
                    var convers: Conversation[] = [];
                    Array.forEach(conversationTypes, function(converType: ConversationType) {
                        Array.forEach(RongIMClient._memoryStore.conversationList, function(item: Conversation) {
                            if (item.conversationType == converType) {
                                convers.push(item);
                            }
                        });
                    });
                    callback.onSuccess(convers);
                } else {
                    callback.onSuccess(RongIMClient._memoryStore.conversationList);
                }
            }
        }

        clearConversations(conversationTypes: ConversationType[], callback: ResultCallback<boolean>) {
            Array.forEach(conversationTypes, function(conversationType: ConversationType) {
                Array.forEach(RongIMClient._memoryStore.conversationList, function(conver: Conversation) {
                    if (conversationType == conver.conversationType) {
                        RongIMClient.getInstance().removeConversation(conver.conversationType, conver.targetId, { onSuccess: function() { }, onError: function() { } });
                    }
                });
            });
            callback.onSuccess(true);
        }

        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback) {
            RongIMClient.getInstance().getRemoteHistoryMessages(conversationType, targetId, timestamp, count, callback);
        }

        getTotalUnreadCount(callback: ResultCallback<number>) {
            var count: number = 0;
            Array.forEach(RongIMClient._memoryStore.conversationList, function(conver: Conversation) {
                count += conver.unreadMessageCount;
            });
            callback.onSuccess(count);
        }

        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>) {
            var count: number = 0;
            Array.forEach(conversationTypes, function(converType: number) {
                Array.forEach(RongIMClient._memoryStore.conversationList, function(conver: Conversation) {
                    if (conver.conversationType == converType) {
                        count += conver.unreadMessageCount;
                    }
                });
            });
            callback.onSuccess(count);
        }

        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>) {
            var conver: Conversation = this.getConversation(conversationType, targetId);
            callback.onSuccess(conver ? conver.unreadMessageCount : 0);
        }

        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            var conver: Conversation = this.getConversation(conversationType, targetId);
            if (conver) {
                if (RongIMLib.MessageUtil.supportLargeStorage()) {
                    LocalStorageProvider.getInstance().removeItem("cu" + Bridge._client.userId +conversationType + targetId);
                }
                conver.unreadMessageCount = 0;
            }
            callback.onSuccess(true);
        }

        setConversationToTop(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            var conver: Conversation = this.getConversation(conversationType, targetId);
            this.addConversation(conver, callback);
        }

        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>) {
            callback.onSuccess(true);
        }

        setMessageReceivedStatus(messageId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>) {
            callback.onSuccess(true);
        }

        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>) {
            callback.onSuccess(true);
        }
    }
}
