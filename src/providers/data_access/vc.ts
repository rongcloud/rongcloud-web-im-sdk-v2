module RongIMLib {
    export class VCDataProvider implements DataAccessProvider {

        database: any;

        addon: Addon;

        messageListener: OnReceiveMessageListener;

        connectListener: ConnectionStatusListener;

        userId: string = "";

        constructor(addon: any) {
            this.addon = addon;
        }

        init(appKey: string): void {
            this.addon.initWithAppkey(appKey);
        }

        connect(token: string, callback: ConnectCallback, userId?: string): void {
            this.userId = userId;
            this.addon.connectWithToken(token, userId);
        }



        logout(): void {
            this.disconnect();
        }

        disconnect(): void {
            this.addon.disconnect(true);
        }

        setConnectionStatusListener(listener: ConnectionStatusListener): void {
            this.connectListener = listener;
            this.addon.setConnectionStatusListener(function(result: number): void {
                switch (result) {
                    case 10:
                        listener.onChanged(ConnectionStatus.CONNECTING);
                        break;
                    case 11:
                        // 连接失败
                        listener.onChanged(ConnectionStatus.NETWORK_UNAVAILABLE);
                        break;
                    case 0:
                        listener.onChanged(ConnectionStatus.CONNECTED);
                        break;
                }
            });
        }

        setOnReceiveMessageListener(listener: OnReceiveMessageListener): void {
            var me = this;
            me.messageListener = listener;
            me.addon.setOnReceiveMessageListener(function(result: string): void {
                listener.onReceived(me.buildMessage(result), 0);
            });
        }



        sendTypingStatusMessage(conversationType: ConversationType, targetId: string, messageName: string, sendCallback: SendMessageCallback): void {
            var me = this;
            if (messageName in RongIMClient.MessageParams) {
                me.sendMessage(conversationType, targetId, TypingStatusMessage.obtain(RongIMClient.MessageParams[messageName].objectName, ""), {
                    onSuccess: function() {
                        setTimeout(function() {
                            sendCallback.onSuccess();
                        });
                    },
                    onError: function(errorCode: ErrorCode) {
                        setTimeout(function() {
                            sendCallback.onError(errorCode, null);
                        });
                    }
                });
            }
        }

        sendTextMessage(conversationType: ConversationType, targetId: string, content: string, sendMessageCallback: SendMessageCallback): void {
            var msgContent = TextMessage.obtain(content);
            this.sendMessage(conversationType, targetId, msgContent, sendMessageCallback);
        }

        getRemoteHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void {
            try {
                var ret: string = this.addon.getHistoryMessages(conversationType, targetId, timestamp ? timestamp : -1, count);
                var list: any[] = ret ? JSON.parse(ret).list : [], msgs: Message[] = [], me = this;
                list.reverse();
                for (let i = 0, len = list.length; i < len; i++) {
                    msgs[i] = me.buildMessage(list[i].obj);
                }
                callback.onSuccess(msgs);
            } catch (e) {
                callback.onError(ErrorCode.TIMEOUT);
            }
        }



        getRemoteConversationList(callback: ResultCallback<Conversation[]>, conversationTypes: ConversationType[], count: number): void {
            try {
                var result: string = this.addon.getConversationList();
                var list: any[] = JSON.parse(result).list, convers: Conversation[] = [], me = this;
                list.reverse();
                for (let i = 0, len = list.length; i < len; i++) {
                    convers[i] = me.buildConversation(list[i].obj);
                }
                callback.onSuccess(convers);
            } catch (e) {
                callback.onError(ErrorCode.CONVER_GETLIST_ERROR);
            }
        }

        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void {
            try {
                this.addon.removeConversation(conversationType, targetId);
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(ErrorCode.CONVER_REMOVE_ERROR);
            }
        }

        joinChatRoom(chatRoomId: string, messageCount: number, callback: OperationCallback): void {
            this.addon.joinChatRoom(chatRoomId, messageCount,
                function() {
                    callback.onSuccess();
                },
                function(error: ErrorCode) {
                    callback.onError(error);
                });
        }

        quitChatRoom(chatRoomId: string, callback: OperationCallback): void {
            this.addon.quitChatRoom(chatRoomId,
                function() {
                    callback.onSuccess();
                },
                function(error: ErrorCode) {
                    callback.onError(error);
                });
        }

        addToBlacklist(userId: string, callback: OperationCallback): void {
            this.addon.addToBlacklist(userId,
                function() {
                    callback.onSuccess();
                },
                function(error: ErrorCode) {
                    callback.onError(error);
                });

        }

        getBlacklist(callback: GetBlacklistCallback): void {
            this.addon.getBlacklist(
                function(blacklistors: string[]) {
                    callback.onSuccess(blacklistors);
                },
                function(error: ErrorCode) {
                    callback.onError(error);
                });
        }

        getBlacklistStatus(userId: string, callback: ResultCallback<string>): void {
            this.addon.getBlacklistStatus(userId,
                function(result: string) {
                    callback.onSuccess(result);
                },
                function(error: ErrorCode) {
                    callback.onError(error);
                });
        }

        removeFromBlacklist(userId: string, callback: OperationCallback): void {
            this.addon.removeFromBlacklist(userId,
                function() {
                    callback.onSuccess();
                },
                function(error: ErrorCode) {
                    callback.onError(error);
                });
        }


        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback, mentiondMsg?: boolean, pushText?: string, appData?: string): void {

            this.addon.sendMessage(conversationType,
                targetId, RongIMClient.MessageParams[messageContent.messageName].objectName, messageContent.encode(), pushText, appData, function(progress: any) {
                },
                function(message: string) {
                    sendCallback.onSuccess(JSON.parse(message));
                },
                function(message: Message, code: ErrorCode) {
                    sendCallback.onError(code, message);
                });
        }

        registerMessageType(messageType: string, objectName: string, messageTag: MessageTag, messageContent: any): void {
            this.addon.registerMessageType(objectName, messageTag.getMessageTag());
        }



        addMessage(conversationType: ConversationType, targetId: string, message: Message, callback?: ResultCallback<Message>): void {
            var msg: string = this.addon.insertMessage(conversationType, targetId, message.senderUserId, message.objectName, message.content.encode(),
                function() {
                    callback.onSuccess(me.buildMessage(msg));
                },
                function() {
                    callback.onError(ErrorCode.MSG_INSERT_ERROR);
                }), me = this;
        }

        removeMessage(conversationType: ConversationType, targetId: string, delMsgs: DeleteMessage[], callback: ResultCallback<boolean>): void {

        }

        removeLocalMessage(conversationType: ConversationType, targetId: string, timestamps: number[], callback: ResultCallback<boolean>): void {
            try {
                this.addon.deleteMessages(timestamps);
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(ErrorCode.MSG_DEL_ERROR);
            }
        }

        getMessage(messageId: string, callback: ResultCallback<Message>): void {
            try {
                var msg: Message = this.addon.getMessage(messageId);
                callback.onSuccess(msg);
            } catch (e) {
                callback.onError(ErrorCode.GET_MESSAGE_BY_ID_ERROR);
            }
        }

        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void {
            try {
                this.addon.clearMessages(conversationType, targetId);
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(ErrorCode.CONVER_GET_ERROR);
            }
        }


        getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>): void {
            try {
                var ret: string = this.addon.getConversation(conversationType, targetId);
                callback.onSuccess(this.buildConversation(ret));
            } catch (e) {
                callback.onError(ErrorCode.CONVER_GET_ERROR);
            }
        }

        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[], count?: number): void {
            this.getRemoteConversationList(callback, conversationTypes, count);
        }

        clearConversations(conversationTypes: ConversationType[], callback: ResultCallback<boolean>): void {
            try {
                this.addon.clearConversations();
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(ErrorCode.CONVER_CLEAR_ERROR);
            }
        }

        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void {
            this.getRemoteHistoryMessages(conversationType, targetId, timestamp, count, callback);
        }

        getTotalUnreadCount(callback: ResultCallback<number>, conversationTypes?: number[]): void {
            try {
                var result: number;
                if (conversationTypes) {
                    result = this.addon.getTotalUnreadCount(conversationTypes);
                } else {
                    result = this.addon.getTotalUnreadCount();
                }
                callback.onSuccess(result);
            } catch (e) {
                callback.onError(ErrorCode.CONVER_TOTAL_UNREAD_ERROR);
            }
        }

        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>): void {
            this.getTotalUnreadCount(callback, conversationTypes);
        }

        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>): void {
            try {
                var result: number = this.addon.getUnreadCount(conversationType, targetId);
                callback.onSuccess(result);
            } catch (e) {
                callback.onError(ErrorCode.CONVER_TYPE_UNREAD_ERROR);
            }
        }

        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void {
            try {
                var result = this.addon.clearConversations(conversationType, targetId);
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(ErrorCode.CONVER_CLEAR_ERROR);
            }
        }

        setConversationToTop(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void {
            try {
                this.addon.setConversationToTop(conversationType, targetId, true);
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(ErrorCode.CONVER_SETOP_ERROR);
            }
        }

        setMessageReceivedStatus(messageId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>): void {
            try {
                this.addon.setMessageReceivedStatus(messageId, receivedStatus);
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(ErrorCode.TIMEOUT);
            }
        }

        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>): void {
            try {
                this.addon.setMessageSentStatus(messageId, sentStatus);
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(ErrorCode.TIMEOUT);
            }
        }




        hasRemoteUnreadMessages(token: string, callback: ResultCallback<Boolean>): void {
            callback.onSuccess(false);
        }

        updateMessage(message: Message, callback?: ResultCallback<Message>): void { }

        updateMessages(conversationType: ConversationType, targetId: string, key: string, value: any, callback: ResultCallback<boolean>): void { }

        getChatRoomInfo(chatRoomId: string, count: number, order: GetChatRoomType, callback: ResultCallback<any>): void { }

        reconnect(callback: ConnectCallback): void { }

        sendReceiptResponse(conversationType: ConversationType, targetId: string, sendCallback: SendMessageCallback): void { }

        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>): void { }

        getAllConversations(callback: ResultCallback<Conversation[]>): void { }

        getConversationByContent(keywords: string, callback: ResultCallback<Conversation[]>): void { }

        getMessagesFromConversation(conversationType: ConversationType, targetId: string, keywords: string, callback: ResultCallback<Message[]>): void { }

        getFileToken(fileType: FileType, callback: ResultCallback<string>): void { }

        getFileUrl(fileType: FileType, fileName: string, oriName: string, callback: ResultCallback<string>): void { }

        addMemberToDiscussion(discussionId: string, userIdList: string[], callback: OperationCallback): void { }

        createDiscussion(name: string, userIdList: string[], callback: CreateDiscussionCallback): void { }

        getDiscussion(discussionId: string, callback: ResultCallback<Discussion>): void { }

        quitDiscussion(discussionId: string, callback: OperationCallback): void { }

        removeMemberFromDiscussion(discussionId: string, userId: string, callback: OperationCallback): void { }

        setDiscussionInviteStatus(discussionId: string, status: DiscussionInviteStatus, callback: OperationCallback): void { }

        setDiscussionName(discussionId: string, name: string, callback: OperationCallback): void { }

        joinGroup(groupId: string, groupName: string, callback: OperationCallback): void { }

        quitGroup(groupId: string, callback: OperationCallback): void { }

        syncGroup(groups: Array<Group>, callback: OperationCallback): void { }

        addConversation(conversation: Conversation, callback: ResultCallback<boolean>): void { }

        updateConversation(conversation: Conversation): Conversation {
            return null;
        }

        private buildMessage(result: string): Message {
            var message: Message = new Message(), ret: any = JSON.parse(result);
            message.conversationType = ret.conversationType;
            message.targetId = ret.targetId;
            message.messageDirection = ret.direction;
            message.senderUserId = ret.senderUserId;
            message.receivedStatus = ret.status;
            message.sentTime = ret.sentTime;
            message.objectName = ret.objectName;
            message.content = JSON.parse(ret.content);
            message.messageId = ret.messageId;
            message.messageUId = ret.messageUid;
            return message;
        }

        private buildConversation(val: string): Conversation {
            var conver: Conversation = new Conversation(),
                c: any = JSON.parse(val),
                lastestMsg: any = c.lastestMsg ? JSON.parse(c.lastestMsg) : {};
            conver.conversationTitle = c.title;
            conver.conversationType = c.conversationType;
            conver.draft = c.draft;
            conver.isTop = c.isTop;
            conver.latestMessage = lastestMsg;
            conver.latestMessageId = lastestMsg.messageId;
            conver.objectName = lastestMsg.objectName;
            conver.receivedStatus = ReceivedStatus.READ;
            conver.sentTime = lastestMsg.sentTime;
            conver.senderUserId = lastestMsg.senderUserId;
            conver.sentStatus = lastestMsg.status;
            return conver;
        }
    }
}
