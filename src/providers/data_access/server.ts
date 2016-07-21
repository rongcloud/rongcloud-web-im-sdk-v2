module RongIMLib {
    export class ServerDataProvider implements DataAccessProvider {
        database: DBUtil = new DBUtil();
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

        updateConversation(conversation: Conversation): Conversation {
            var conver: Conversation;
            for (let i = 0, len = RongIMClient._memoryStore.conversationList.length; i < len; i++) {
                if (conversation.conversationType === RongIMClient._memoryStore.conversationList[i].conversationType && conversation.targetId === RongIMClient._memoryStore.conversationList[i].targetId) {
                    RongIMClient._memoryStore.conversationList[i].conversationTitle = conversation.conversationTitle;
                    RongIMClient._memoryStore.conversationList[i].senderUserName = conversation.senderUserName;
                    RongIMClient._memoryStore.conversationList[i].senderPortraitUri = conversation.senderPortraitUri;
                    break;
                }
            }
            return conver;
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

        getMessage(messageId: string, callback: ResultCallback<Message>) {
            callback.onSuccess(new Message());
        }

        addMessage(conversationType: ConversationType, targetId: string, message: Message, callback?: ResultCallback<Message>) {
            if (callback) {
                callback.onSuccess(message);
            }
        }

        removeMessage(conversationType: ConversationType, targetId: string, messageIds: string[], callback: ResultCallback<boolean>) {
            callback.onSuccess(true);
        }

        removeLocalMessage(conversationType: ConversationType, targetId: string, timestamps: number[], callback: ResultCallback<boolean>) {
            callback.onSuccess(true);
        }

        updateMessage(message: Message, callback?: ResultCallback<Message>) {
            if (callback) {
                callback.onSuccess(message);
            }
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

        getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>) {
            var conver: Conversation = null;
            for (let i = 0, len = RongIMClient._memoryStore.conversationList.length; i < len; i++) {
                if (RongIMClient._memoryStore.conversationList[i].conversationType == conversationType && RongIMClient._memoryStore.conversationList[i].targetId == targetId) {
                    conver = RongIMClient._memoryStore.conversationList[i];
                    if (MessageUtil.supportLargeStorage()) {
                        var count = LocalStorageProvider.getInstance().getItem("cu" + Bridge._client.userId + conversationType + targetId);
                        if (conver.unreadMessageCount == 0) {
                            conver.unreadMessageCount = Number(count);
                        }
                    }
                }
            }
            callback.onSuccess(conver);
        }

        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[], count?: number) {
            if (RongIMClient._memoryStore.conversationList.length == 0 || RongIMClient._memoryStore.isSyncRemoteConverList || (typeof count != undefined && RongIMClient._memoryStore.conversationList.length < count)) {
                RongIMClient.getInstance().getRemoteConversationList(<ResultCallback<Conversation[]>>{
                    onSuccess: function(list: Conversation[]) {
                        if (MessageUtil.supportLargeStorage()) {
                            Array.forEach(RongIMClient._memoryStore.conversationList, function(item: Conversation) {
                                var count = LocalStorageProvider.getInstance().getItem("cu" + Bridge._client.userId + item.conversationType + item.targetId);
                                if (item.unreadMessageCount == 0) {
                                    item.unreadMessageCount = Number(count);
                                }
                            });
                        }
                        RongIMClient._memoryStore.isSyncRemoteConverList = false;
                        callback.onSuccess(list);
                    },
                    onError: function(errorcode: ErrorCode) {
                        callback.onSuccess([]);
                    }
                }, conversationTypes, count);
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
                    if (count) {
                        RongIMClient._memoryStore.conversationList.length = count;
                    }
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
            this.getConversation(conversationType, targetId, {
                onSuccess: function(conver: Conversation) {
                    callback.onSuccess(conver ? conver.unreadMessageCount : 0);
                },
                onError: function(error: ErrorCode) {
                    callback.onError(error);
                }
            });
        }

        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            this.getConversation(conversationType, targetId, {
                onSuccess: function(conver: Conversation) {
                    if (conver) {
                        if (RongIMLib.MessageUtil.supportLargeStorage()) {
                            LocalStorageProvider.getInstance().removeItem("cu" + Bridge._client.userId + conversationType + targetId);
                        }
                        conver.unreadMessageCount = 0;
                        conver.mentionedMsg = null;
                        var mentioneds = RongIMClient._cookieHelper.getItem("mentioneds_" + Bridge._client.userId);
                        if (mentioneds) {
                            var info: any = JSON.parse(mentioneds);
                            delete info[conversationType + "_" + targetId];
                            if (!MessageUtil.isEmpty(info)) {
                                RongIMClient._cookieHelper.setItem("mentioneds_" + Bridge._client.userId, JSON.stringify(info), true);
                            } else {
                                RongIMClient._cookieHelper.removeItem("mentioneds_" + Bridge._client.userId);
                            }
                        }
                    }
                    callback.onSuccess(true);
                },
                onError: function(error: ErrorCode) {
                    callback.onError(error);
                }
            });


        }
        setConversationToTop(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            var me = this;
            this.getConversation(conversationType, targetId, {
                onSuccess: function(conver: Conversation) {
                    me.addConversation(conver, callback);
                    callback.onSuccess(true);
                },
                onError: function(error: ErrorCode) {
                    callback.onError(error);
                }
            });

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
