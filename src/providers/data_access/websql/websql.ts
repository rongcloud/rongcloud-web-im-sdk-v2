module RongIMLib {
    export class WebSQLDataProvider implements DataAccessProvider {

        database: DBUtil = new DBUtil();

        updateConversation(conversation: Conversation): Conversation {
            var sql: string = "update t_conversation_" + this.database.userId + " set content = ?,sentTime = ?,istop = ? where conversationType = ? and targetId = ?";
            this.database.execUpdateByParams(sql, [JSON.stringify(conversation), conversation.sentTime, conversation.isTop, conversation.conversationType, conversation.targetId]);
            return conversation;
        }
        addConversation(conver: Conversation, callback: ResultCallback<boolean>) {
            var me = this;
            var sSql: string = "select * from t_conversation_" + me.database.userId + " t where t.conversationType = ? and t.targetId = ?";
            me.database.execSearchByParams(sSql, [Number(conver.conversationType), conver.targetId], function(results: any[], rowsAffected: number) {
                if (results.length > 0 && rowsAffected) {
                    me.updateConversation(conver);
                } else {
                    var iSql: string = "insert into t_conversation_" + me.database.userId + "(conversationType,targetId,content,sentTime,isTop) values(?,?,?,?,?)";
                    me.database.execUpdateByParams(iSql, [conver.conversationType, conver.targetId, JSON.stringify(conver), conver.sentTime, conver.isTop]);
                }
                callback.onSuccess(true);
            });
        }

        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            var sql: string = "delete from t_conversation_" + this.database.userId + "  where conversationType = ? and targetId = ?";
            this.database.execUpdateByParams(sql, [conversationType, targetId]);
            callback.onSuccess(true);
        }


        getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>): void {
            var sql: string = "select t.content from t_conversation_" + this.database.userId + " t where t.conversationType = ? and t.targetId = ?",
                conver: Conversation = null;
            this.database.execSearchByParams(sql, [Number(conversationType), targetId], function(results: any[], rowsAffected: number) {
                var conver: Conversation;
                if (results.length > 0 && rowsAffected) {
                    conver = JSON.parse(results[0].content);
                }
                callback.onSuccess(conver);
            });
        }

        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[], count?: number) {
            if (RongIMClient._memoryStore.isSyncRemoteConverList) {
                RongIMClient.getInstance().getRemoteConversationList({
                    onSuccess: function(list) {
                        RongIMClient._memoryStore.conversationList = list;
                        for (let i = 0, len = list.length; i < len; i++) {
                            me.addConversation(list[i], {
                                onSuccess: function() { },
                                onError: function() { }
                            });
                        }
                        RongIMClient._memoryStore.isSyncRemoteConverList = false;
                    },
                    onError: function(errorCode: ErrorCode) {
                        callback.onError(errorCode);
                    }
                }, conversationTypes, count);
            }
            //查询置顶会话。
            var tSql: string = "select * from t_conversation_" + this.database.userId + " t where t.isTop = 1 ";
            //排序查询会话。
            var oSql: string = "select * from t_conversation_" + this.database.userId + " c where c.isTop != 1 order by c.sentTime ";
            var me = this;
            if (conversationTypes) {
                tSql += " and t.conversationType in (" + conversationTypes.join(",") + ")";
                oSql += " and c.conversationType in (" + conversationTypes.join(",") + ")";
            }
            tSql += " union " + oSql;
            this.database.execSearch(tSql, function(results: any[]) {
                if (results.length > 0) {
                    var convers: Conversation[] = [];
                    for (let i = 0, len = results.length; i < len; i++) {
                        convers.push(JSON.parse(results[i].content));
                    }
                    RongIMClient._memoryStore.conversationList = convers;
                }
                callback.onSuccess(RongIMClient._memoryStore.conversationList);
            });
        }

        clearConversations(conversationTypes: ConversationType[], callback: ResultCallback<boolean>) {
            var sql: string = "delete from t_conversation_" + this.database.userId + " where conversationType in (?)";
            this.database.execUpdateByParams(sql, [conversationTypes.join(",")]);
            Array.forEach(conversationTypes, function(conversationType: ConversationType) {
                Array.forEach(RongIMClient._memoryStore.conversationList, function(conver: Conversation) {
                    if (conversationType == conver.conversationType) {
                        RongIMClient.getInstance().removeConversation(conver.conversationType, conver.targetId, { onSuccess: function() { }, onError: function() { } });
                    }
                });
            });
            callback.onSuccess(true);
        }

        getMessage(messageUId: string, callback: ResultCallback<Message>) {
            var sql: string = "select * from t_message_" + this.database.userId + " t where t.messageUId = ?";
            this.database.execSearchByParams(sql, [messageUId], function(results: any[], rowsAffected: number) {
                if (results.length > 0 && rowsAffected) {
                    var msg: Message = JSON.parse(results[0].content);
                    callback.onSuccess(msg);
                } else {
                    callback.onSuccess(null);
                }
            });
        }

        addMessage(conversationType: ConversationType, targetId: string, message: Message, callback?: ResultCallback<Message>) {
            var sql: string = "insert into t_message_" + this.database.userId + " (messageType,messageUId,conversationType,targetId,sentTime,content,localMsg)" +
                "values(?,?,?,?,?,?,?)";
            var localmsg: number = message.messageUId ? 0 : 1;
            this.database.execUpdateByParams(sql, [message.messageType, message.messageUId, message.conversationType, message.targetId, message.sentTime, JSON.stringify(message), localmsg]);
            if (callback) {
                var searchSql: string = "select t.id from t_message_" + this.database.userId + " t where t.sentTime = ? and t.conversationType = ? and t.targetId = ?";
                this.database.execSearchByParams(searchSql, [message.sentTime, conversationType, targetId], function(results: any[], rowsAffected: number) {
                    rowsAffected && (message.messageId = results[0].id);
                    callback.onSuccess(message);
                });
            }
        }

        removeMessage(conversationType: ConversationType, targetId: string, delMsgs: DeleteMessage[], callback: ResultCallback<boolean>) {
            if (delMsgs.length == 0) {
                return;
            }
            var arr: any = [];
            for (let i = 0, len = delMsgs.length; i < len; i++) {
                arr.push(delMsgs[i].msgId);
            }
            var sql: string = "delete from t_message_" + this.database.userId + " where messageUId in (?)";
            this.database.execUpdateByParams(sql, arr.join(','));
        }
        removeLocalMessage(conversationType: ConversationType, targetId: string, messageIds: number[], callback: ResultCallback<boolean>) {
            if (messageIds.length == 0) {
                return;
            }
            var sql: string = "delete from t_message_" + this.database.userId + " where id in (" + messageIds.join(",") + ") and conversationType = ? and targetId = ? and localMsg = 1";
            this.database.execUpdateByParams(sql, [conversationType, targetId]);
            callback.onSuccess(true);
        }
        updateMessage(message: Message, callback?: ResultCallback<Message>) {
            var sql: string = "update t_message_" + this.database.userId + " set messageUId = ?,sentTime = ?,content = ?,localMsg = ? where id = ?";
            this.database.execUpdateByParams(sql, [message.messageUId, message.sentTime, JSON.stringify(message), message.isLocalMessage, message.messageId]);
        }
        //TODO
        updateMessages(conversationType: ConversationType, targetId: string, key: string, value: any, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            var sql: string = "delete from t_message_" + this.database.userId + " where conversationType = ? and targetId = ? ";
            this.database.execUpdateByParams(sql, [conversationType, targetId]);
            callback.onSuccess(true);
        }

        getHistoryMessages(conversationType: ConversationType, targetId: string, timestrap: number, count: number, callback: GetHistoryMessagesCallback) {
            var sql: string = "select * from (select * from t_message_" + this.database.userId + " t where t.conversationType = ? and t.targetId = ? ";
            var params: any[] = [conversationType, targetId], results: Message[] = [], me = this;
            if (timestrap !== 0) {
                var times = RongIMClient._memoryStore.lastReadTime.get(conversationType + targetId);
                if (times != 0) {
                    sql += "and t.sentTime < ? ";
                    params.push(times);
                    timestrap = times;
                }
            }
            sql += "order by t.sentTime desc limit ?) order by sentTime ";
            params.push(count);
            me.database.execSearchByParams(sql, params, function(result: any[], rowsAffected: number) {
                for (var i = 0, len: number = result.length; i < len; i++) {
                    results.push(JSON.parse(result[i].content));
                }
                if (len < count) {
                    RongIMClient.getInstance().getRemoteHistoryMessages(conversationType, targetId, timestrap, count - result.length, {
                        onSuccess: function(list: Message[], hasMsg: boolean) {
                            for (var i = 0, len = list.length; i < len; i++) {
                                !list[i].targetId ? list[i].targetId = targetId : null;
                                RongIMClient._dataAccessProvider.addMessage(list[i].conversationType, list[i].targetId, list[i], {
                                    onSuccess: function(message: Message) { },
                                    onError: function() { }
                                });
                            }
                            me.database.execSearchByParams(sql, params, function(result: any[]) {
                                var ret: Message[] = [];
                                for (var i = 0, len: number = result.length; i < len; i++) {
                                    ret.push(JSON.parse(result[i].content));
                                }
                                callback.onSuccess(ret, hasMsg);
                            });
                        },
                        onError: function(error: ErrorCode) { }
                    });
                } else {
                    //TODO 可能存在 len 和 count 相等并且服务器没有历史消息，导致多拉取一次历史消息。
                    callback.onSuccess(results, true);
                    RongIMClient._memoryStore.lastReadTime.set(conversationType + targetId, result[len - 1].sentTime);
                }
            });
        }

        getTotalUnreadCount(callback: ResultCallback<number>, conversationTypes?: number[]) {
            var sql: string = "select t.content from t_conversation_" + this.database.userId + " t";
            this.database.execSearch(sql, function(results: any[]) {
                var count: number = 0;
                if (conversationTypes) {
                    for (let j = 0, len = conversationTypes.length; j < len; j++) {
                        for (let i = 0, len = results.length; i < len; i++) {
                            var conver: Conversation = JSON.parse(results[i].content);
                            if (conver.conversationType == conversationTypes[j]) {
                                count += conver.unreadMessageCount;
                            }
                        }
                    }
                } else {
                    for (let i = 0, len = results.length; i < len; i++) {
                        var conver: Conversation = JSON.parse(results[i].content);
                        count += conver.unreadMessageCount;
                    }
                }
                callback.onSuccess(count);
            });
        }

        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>) {
            if (conversationTypes.length == 0) {
                callback.onSuccess(0);
                return;
            }
            var sql: string = "select t.content from t_conversation_" + this.database.userId + " t where t.conversationType in (" + conversationTypes.join(",") + ")";
            this.database.execSearchByParams(sql, [], function(results: any[]) {
                var count: number = 0;
                for (let i = 0, len = results.length; i < len; i++) {
                    var conver: Conversation = JSON.parse(results[i].content);
                    count += conver.unreadMessageCount;
                }
                callback.onSuccess(count);
            });
        }

        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>) {
            var sql: string = "select t.content from t_conversation_" + this.database.userId + " t where t.conversationType = ? and t.targetId = ?";
            this.database.execSearchByParams(sql, [conversationType, targetId], function(results: any[]) {
                var count: number = 0;
                for (let i = 0, len = results.length; i < len; i++) {
                    var conver: Conversation = JSON.parse(results[i].content);
                    count += conver.unreadMessageCount;
                }
                callback.onSuccess(count);
            });
        }

        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            var sSql: string = "select * from t_conversation_" + this.database.userId + " t where t.conversationType = ? and t.targetId = ?";
            var uSql: string = "update t_conversation_" + this.database.userId + " set content = ? where conversationType = ? and targetId = ?", me = this;
            this.database.execSearchByParams(sSql, [conversationType, targetId], function(results: any[], rowsAffected: number) {
                var mentioneds = RongIMClient._cookieHelper.getItem("mentioneds_" + Bridge._client.userId + '_' + conversationType + '_' + targetId);
                if (mentioneds) {
                    var info: any = JSON.parse(mentioneds);
                    delete info[conversationType + "_" + targetId];
                    if (!MessageUtil.isEmpty(info)) {
                        RongIMClient._cookieHelper.setItem("mentioneds_" + Bridge._client.userId + '_' + conversationType + '_' + targetId, JSON.stringify(info), true);
                    } else {
                        RongIMClient._cookieHelper.removeItem("mentioneds_" + Bridge._client.userId + '_' + conversationType + '_' + targetId);
                    }
                }
                if (results.length == 0 && !rowsAffected) {
                    callback.onSuccess(false);
                } else {
                    var conver: Conversation = JSON.parse(results[0].content);
                    conver.unreadMessageCount = 0;
                    conver.mentionedMsg = null;
                    me.database.execUpdateByParams(uSql, [JSON.stringify(conver), conversationType, targetId]);
                    callback.onSuccess(true);
                }
            });
        }

        setConversationToTop(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            var sql: string = "update t_conversation_" + this.database.userId + " set isTop = 1 where conversationType = ? and targetId = ?";
            this.database.execUpdateByParams(sql, [conversationType, targetId]);
            callback.onSuccess(true);
        }
        setMessageExtra(messageUId: string, value: string, callback: ResultCallback<boolean>) {
            var sSql: string = "select t.content from t_message_" + this.database.userId + " t where t.messageUId = ?";
            var uSql: string = "UPADTE t_message_" + this.database.userId + " t SET t.content = ? where t.messageUId = ?";
            this.database.execSearchByParams(sSql, [messageUId], function(results: any[], rowsAffected: number) {
                if (results.length == 0 && !rowsAffected) {
                    callback.onSuccess(false);
                } else {
                    var msg: Message = JSON.parse(results[0].content);
                    msg.extra = value;
                    this.database.execUpdateByParams(uSql, [JSON.stringify(msg), messageUId]);
                }
            });
        }

        setMessageReceivedStatus(messageUId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>) {
            var sSql: string = "select t.content from t_message_" + this.database.userId + " t where t.messageUId = ?";
            var uSql: string = "update t_message_" + this.database.userId + " set content = ? where messageUId = ?", me = this;
            this.database.execSearchByParams(sSql, [messageUId], function(results: any[], rowsAffected: number) {
                if (results.length == 0 && !rowsAffected) {
                    callback.onSuccess(false);
                } else {
                    var msg: Message = JSON.parse(results[0].content);
                    msg.receivedStatus = receivedStatus;
                    me.database.execUpdateByParams(uSql, [JSON.stringify(msg), messageUId]);
                    callback.onSuccess(true);
                }
            });
        }
        dropTable(sql: string): void {
            this.database.execUpdate(sql);
        }
        setMessageSentStatus(messageUId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>) {
            var sSql: string = "select t.content from t_message_" + this.database.userId + " t where t.messageUId = ?";
            var uSql: string = "update t_message_" + this.database.userId + " set content = ? where messageUId = ?";
            this.database.execSearchByParams(sSql, [messageUId], function(results: any[], rowsAffected: number) {
                if (results.length == 0 && !rowsAffected) {
                    callback.onSuccess(false);
                } else {
                    var msg: Message = JSON.parse(results[0].content);
                    msg.sentStatus = sentStatus;
                    this.database.execUpdateByParams(uSql, [JSON.stringify(msg), messageUId]);
                    callback.onSuccess(true);
                }
            });
        }
    }
}
