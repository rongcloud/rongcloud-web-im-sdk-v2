module RongIMLib {
    export class WebSQLDataProvider implements DataAccessProvider {

        database: DBUtil = new DBUtil();

        init(appKey: string): void {

        }

        connect(token: string, callback: ConnectCallback) {
            RongIMClient.bridge = Bridge.getInstance();
            RongIMClient._memoryStore.token = token;
            RongIMClient._memoryStore.callback = callback;
            if (Bridge._client && Bridge._client.channel && Bridge._client.channel.connectionStatus == ConnectionStatus.CONNECTED && Bridge._client.channel.connectionStatus == ConnectionStatus.CONNECTING) {
                return;
            }
            RongIMClient.bridge.connect(RongIMClient._memoryStore.appKey, token, {
                onSuccess: function(data: string) {
                    setTimeout(function() {
                        callback.onSuccess(data);
                    });
                },
                onError: function(e: ConnectionState) {
                    if (e == ConnectionState.TOKEN_INCORRECT || !e) {
                        setTimeout(function() {
                            callback.onTokenIncorrect();
                        });
                    } else {
                        setTimeout(function() {
                            callback.onError(e);
                        });
                    }
                }
            });
            //循环设置监听事件，追加之后清空存放事件数据
            for (let i = 0, len = RongIMClient._memoryStore.listenerList.length; i < len; i++) {
                RongIMClient.bridge["setListener"](RongIMClient._memoryStore.listenerList[i]);
            }
            RongIMClient._memoryStore.listenerList.length = 0;
        }

        reconnect(callback: ConnectCallback): void {
            if (Bridge._client && Bridge._client.channel && Bridge._client.channel.connectionStatus != ConnectionStatus.CONNECTED && Bridge._client.channel.connectionStatus != ConnectionStatus.CONNECTING) {
                RongIMClient.bridge.reconnect(callback);
            }
        }

        logout(): void {
            RongIMClient.bridge.disconnect();
            RongIMClient.bridge = null;
        }

        disconnect(): void {
            RongIMClient.bridge.disconnect();
        }
        sendReceiptResponse(conversationType: ConversationType, targetId: string, sendCallback: SendMessageCallback): void {
            var rspkey: string = Bridge._client.userId + conversationType + targetId + 'RECEIVED', me = this;
            if (MessageUtil.supportLargeStorage()) {
                var valObj: any = JSON.parse(RongIMClient._storageProvider.getItem(rspkey));
                if (valObj) {
                    var vals: any[] = [];
                    for (let key in valObj) {
                        var tmp: any = {};
                        tmp[key] = valObj[key].uIds;
                        valObj[key].isResponse || vals.push(tmp);
                    }
                    if (vals.length == 0) {
                        sendCallback.onSuccess();
                        return;
                    }
                    var interval = setInterval(function() {
                        if (vals.length == 1) {
                            clearInterval(interval);
                        }
                        var obj = vals.splice(0, 1)[0];
                        var rspMsg = new RongIMLib.ReadReceiptResponseMessage({ receiptMessageDic: obj });
                        me.sendMessage(conversationType, targetId, rspMsg, {
                            onSuccess: function(msg) {
                                var senderUserId = MessageUtil.getFirstKey(obj);
                                valObj[senderUserId].isResponse = true;
                                RongIMClient._storageProvider.setItem(rspkey, JSON.stringify(valObj));
                                sendCallback.onSuccess(msg);
                            },
                            onError: function(error: ErrorCode, msg: Message) {
                                sendCallback.onError(error, msg);
                            }
                        });
                    }, 200);
                } else {
                    sendCallback.onSuccess();
                }

            } else {
                sendCallback.onSuccess();
            }
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

        sendRecallMessage(content:any, sendMessageCallback: SendMessageCallback, user?:UserInfo): void {
           var msg = new RecallCommandMessage({conversationType : content.conversationType, targetId : content.targetId, sentTime:content.sentTime, messageUId : content.messageUId, extra : content.extra, user : content.user});
           this.sendMessage(content.conversationType, content.targetId, msg, sendMessageCallback, false, null, null, 2);
        }

        getRemoteHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void {

            var modules = new Modules.HistoryMessageInput(), self = this;
            modules.setTargetId(targetId);
            if (timestamp === 0 || timestamp > 0) {
                modules.setDataTime(timestamp);
            } else {
                modules.setDataTime(RongIMClient._memoryStore.lastReadTime.get(conversationType + targetId));
            }
            modules.setSize(count);
            RongIMClient.bridge.queryMsg(HistoryMsgType[conversationType], MessageUtil.ArrayForm(modules.toArrayBuffer()), targetId, {
                onSuccess: function(data: any) {
                    RongIMClient._memoryStore.lastReadTime.set(conversationType + targetId, MessageUtil.int64ToTimestamp(data.syncTime));
                    var list = data.list.reverse(), tempMsg: Message = null, tempDir: any;
                    if (MessageUtil.supportLargeStorage()) {
                        for (var i = 0, len = list.length; i < len; i++) {
                            tempMsg = MessageUtil.messageParser(list[i]);
                            tempDir = JSON.parse(RongIMClient._storageProvider.getItem(Bridge._client.userId + tempMsg.messageUId + "SENT"));
                            if (tempDir) {
                                tempMsg.receiptResponse || (tempMsg.receiptResponse = {});
                                tempMsg.receiptResponse[tempMsg.messageUId] = tempDir.count;
                            }
                            list[i] = tempMsg;
                        }
                    } else {
                        for (var i = 0, len = list.length; i < len; i++) {
                            list[i] = MessageUtil.messageParser(list[i]);
                        }
                    }
                    setTimeout(function() {
                        callback.onSuccess(list, !!data.hasMsg);
                    });
                },
                onError: function(error: ErrorCode) {
                    setTimeout(function() {
                        if (error === ErrorCode.TIMEOUT) {
                            callback.onError(error);
                        } else {
                            callback.onSuccess([], false);
                        }
                    });
                }
            }, "HistoryMessagesOuput");
        }

        hasRemoteUnreadMessages(token: string, callback: ResultCallback<Boolean>): void {
            var xss: any = null;
            window.RCCallback = function(x: any) {
                setTimeout(function() { callback.onSuccess(!!+x.status); });
                xss.parentNode.removeChild(xss);
            };
            xss = document.createElement("script");
            xss.src = RongIMClient._memoryStore.depend.api + "/message/exist.js?appKey=" + encodeURIComponent(RongIMClient._memoryStore.appKey) + "&token=" + encodeURIComponent(token) + "&callBack=RCCallback&_=" + Date.now();
            document.body.appendChild(xss);
            xss.onerror = function() {
                setTimeout(function() { callback.onError(ErrorCode.UNKNOWN); });
                xss.parentNode.removeChild(xss);
            };
        }

        getRemoteConversationList(callback: ResultCallback<Conversation[]>, conversationTypes: ConversationType[], count: number): void {
            var modules = new Modules.RelationsInput(), self = this;
            modules.setType(1);
            if (typeof count == 'undefined') {
                modules.setCount(0);
            } else {
                modules.setCount(count);
            }
            RongIMClient.bridge.queryMsg(26, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function(list: any) {
                    RongIMClient._memoryStore.conversationList.length = 0;
                    if (list.info) {
                        list.info = list.info.reverse();
                        for (var i = 0, len = list.info.length; i < len; i++) {
                            RongIMClient.getInstance().pottingConversation(list.info[i]);
                        }
                    }
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
                },
                onError: function(error: ErrorCode) {
                    if (error === ErrorCode.TIMEOUT) {
                        callback.onError(error);
                    } else {
                        callback.onSuccess([]);
                    }
                }
            }, "RelationsOutput");
        }

        addMemberToDiscussion(discussionId: string, userIdList: string[], callback: OperationCallback): void {
            var modules = new Modules.ChannelInvitationInput();
            modules.setUsers(userIdList);
            RongIMClient.bridge.queryMsg(0, MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, {
                onSuccess: function() {
                    setTimeout(function() {
                        callback.onSuccess();
                    });
                },
                onError: function() {
                    setTimeout(function() {
                        callback.onError(ErrorCode.JOIN_IN_DISCUSSION);
                    });
                }
            });
        }

        createDiscussion(name: string, userIdList: string[], callback: CreateDiscussionCallback): void {
            var modules = new Modules.CreateDiscussionInput(), self = this;
            modules.setName(name);
            RongIMClient.bridge.queryMsg(1, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function(discussId: string) {
                    if (userIdList.length > 0) {
                        self.addMemberToDiscussion(discussId, userIdList, <OperationCallback>{
                            onSuccess: function() { },
                            onError: function(error) {
                                setTimeout(function() {
                                    callback.onError(error);
                                });
                            }
                        });
                    }
                    setTimeout(function() {
                        callback.onSuccess(discussId);
                    });
                },
                onError: function() {
                    setTimeout(function() {
                        callback.onError(ErrorCode.CREATE_DISCUSSION);
                    });
                }
            }, "CreateDiscussionOutput");
        }

        getDiscussion(discussionId: string, callback: ResultCallback<Discussion>): void {
            var modules = new Modules.ChannelInfoInput();
            modules.setNothing(1);
            RongIMClient.bridge.queryMsg(4, MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, {
                onSuccess: function(data: any) {
                    setTimeout(function() {
                        callback.onSuccess(data);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            }, "ChannelInfoOutput");
        }

        quitDiscussion(discussionId: string, callback: OperationCallback): void {
            var modules = new Modules.LeaveChannelInput();
            modules.setNothing(1);
            RongIMClient.bridge.queryMsg(7, MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback);
        }

        removeMemberFromDiscussion(discussionId: string, userId: string, callback: OperationCallback): void {
            var modules = new Modules.ChannelEvictionInput();
            modules.setUser(userId);
            RongIMClient.bridge.queryMsg(9, MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback);
        }

        setDiscussionInviteStatus(discussionId: string, status: DiscussionInviteStatus, callback: OperationCallback): void {
            var modules = new Modules.ModifyPermissionInput();
            modules.setOpenStatus(status.valueOf());
            RongIMClient.bridge.queryMsg(11, MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, {
                onSuccess: function(x: any) {
                    setTimeout(function() {
                        callback.onSuccess();
                    });
                }, onError: function() {
                    setTimeout(function() {
                        callback.onError(ErrorCode.INVITE_DICUSSION);
                    });
                }
            });
        }

        setDiscussionName(discussionId: string, name: string, callback: OperationCallback): void {
            var modules = new Modules.RenameChannelInput();
            modules.setName(name);
            RongIMClient.bridge.queryMsg(12, MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, {
                onSuccess: function() {
                    setTimeout(function() {
                        callback.onSuccess();
                    });
                },
                onError: function(errcode: ErrorCode) {
                    callback.onError(errcode);
                }
            });
        }

        joinGroup(groupId: string, groupName: string, callback: OperationCallback): void {
            var modules = new Modules.GroupInfo();
            modules.setId(groupId);
            modules.setName(groupName);
            var _mod = new Modules.GroupInput();
            _mod.setGroupInfo([modules]);
            RongIMClient.bridge.queryMsg(6, MessageUtil.ArrayForm(_mod.toArrayBuffer()), groupId, {
                onSuccess: function() {
                    setTimeout(function() {
                        callback.onSuccess();
                    });
                },
                onError: function(errcode: ErrorCode) {
                    callback.onError(errcode);
                }
            }, "GroupOutput");
        }

        quitGroup(groupId: string, callback: OperationCallback): void {
            var modules = new Modules.LeaveChannelInput();
            modules.setNothing(1);
            RongIMClient.bridge.queryMsg(8, MessageUtil.ArrayForm(modules.toArrayBuffer()), groupId, {
                onSuccess: function() {
                    setTimeout(function() {
                        callback.onSuccess();
                    });
                },
                onError: function(errcode: ErrorCode) {
                    callback.onError(errcode);
                }
            });
        }

        syncGroup(groups: Array<Group>, callback: OperationCallback): void {
            //去重操作
            for (var i: number = 0, part: Array<string> = [], info: Array<any> = [], len: number = groups.length; i < len; i++) {
                if (part.length === 0 || !(groups[i].id in part)) {
                    part.push(groups[i].id);
                    var groupinfo = new Modules.GroupInfo();
                    groupinfo.setId(groups[i].id);
                    groupinfo.setName(groups[i].name);
                    info.push(groupinfo);
                }
            }
            var modules = new Modules.GroupHashInput();
            modules.setUserId(Bridge._client.userId);
            modules.setGroupHashCode(md5(part.sort().join("")));
            RongIMClient.bridge.queryMsg(13, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function(result: number) {
                    //1为群信息不匹配需要发送给服务器进行同步，0不需要同步
                    if (result === 1) {
                        var val = new Modules.GroupInput();
                        val.setGroupInfo(info);
                        RongIMClient.bridge.queryMsg(20, MessageUtil.ArrayForm(val.toArrayBuffer()), Bridge._client.userId, {
                            onSuccess: function() {
                                setTimeout(function() {
                                    callback.onSuccess();
                                });
                            },
                            onError: function() {
                                setTimeout(function() {
                                    callback.onError(ErrorCode.GROUP_MATCH_ERROR);
                                });
                            }
                        }, "GroupOutput");
                    } else {
                        setTimeout(function() {
                            callback.onSuccess();
                        });
                    }
                },
                onError: function() {
                    setTimeout(function() {
                        callback.onError(ErrorCode.GROUP_SYNC_ERROR);
                    });
                }
            }, "GroupHashOutput");
        }

        joinChatRoom(chatroomId: string, messageCount: number, callback: OperationCallback): void {
            var e = new Modules.ChrmInput();
            e.setNothing(1);
            Bridge._client.chatroomId = chatroomId;
            RongIMClient.bridge.queryMsg(19, MessageUtil.ArrayForm(e.toArrayBuffer()), chatroomId, {
                onSuccess: function() {
                    callback.onSuccess();
                    var modules = new Modules.ChrmPullMsg();
                    messageCount == 0 && (messageCount = -1);
                    modules.setCount(messageCount);
                    modules.setSyncTime(0);
                    Bridge._client.queryMessage("chrmPull", MessageUtil.ArrayForm(modules.toArrayBuffer()), chatroomId, 1, {
                        onSuccess: function(collection: any) {
                            var sync = MessageUtil.int64ToTimestamp(collection.syncTime);
                            RongIMClient._storageProvider.setItem(chatroomId + Bridge._client.userId + "CST", sync);
                            var list = collection.list;
                            if (RongIMClient._memoryStore.filterMessages.length > 0) {
                                for (var i = 0, mlen = list.length; i < mlen; i++) {
                                    for (let j = 0, flen = RongIMClient._memoryStore.filterMessages.length; j < flen; j++) {
                                        if (RongIMClient.MessageParams[RongIMClient._memoryStore.filterMessages[j]].objectName != list[i].classname) {
                                            Bridge._client.handler.onReceived(list[i]);
                                        }
                                    }
                                }
                            } else {
                                for (var i = 0, len = list.length; i < len; i++) {
                                    Bridge._client.handler.onReceived(list[i]);
                                }
                            }

                        },
                        onError: function(x: any) {
                            setTimeout(function() {
                                callback.onError(ErrorCode.CHATROOM_HISMESSAGE_ERROR);
                            });
                        }
                    }, "DownStreamMessages");
                },
                onError: function() {
                    setTimeout(function() {
                        callback.onError(ErrorCode.CHARTOOM_JOIN_ERROR);
                    });
                }
            }, "ChrmOutput");
        }

        getChatRoomInfo(chatRoomId: string, count: number, order: GetChatRoomType, callback: ResultCallback<any>): void {
            var modules = new Modules.QueryChatroomInfoInput();
            modules.setCount(count);
            modules.setOrder(order);
            RongIMClient.bridge.queryMsg("queryChrmI", MessageUtil.ArrayForm(modules.toArrayBuffer()), chatRoomId, {
                onSuccess: function(list: any[]) {
                    setTimeout(function() {
                        callback.onSuccess(list);
                    });
                },
                onError: function(errcode: ErrorCode) {
                    callback.onError(errcode);
                }
            }, "QueryChatroomInfoOutput");
        }

        quitChatRoom(chatroomId: string, callback: OperationCallback): void {
            var e = new Modules.ChrmInput();
            e.setNothing(1);
            RongIMClient.bridge.queryMsg(17, MessageUtil.ArrayForm(e.toArrayBuffer()), chatroomId, {
                onSuccess: function() {
                    setTimeout(function() {
                        callback.onSuccess();
                    });
                },
                onError: function(errcode: ErrorCode) {
                    callback.onError(errcode);
                }
            }, "ChrmOutput");
        }

        setChatroomHisMessageTimestamp(chatRoomId:string, timestamp:number):void{
             RongIMClient._memoryStore.lastReadTime.set('chrhis_' + chatRoomId, timestamp);
        }
        
        getChatRoomHistoryMessages(chatRoomId:string, count:number, order:number, callback:ResultCallback<Message>):void{
            var modules = new Modules.HistoryMsgInput();
            modules.setTargetId(chatRoomId);
            var timestamp = RongIMClient._memoryStore.lastReadTime.get('chrhis_' + chatRoomId) || 0;
            modules.setTime(timestamp);
            modules.setCount(count);
            modules.setOrder(order);
            RongIMClient.bridge.queryMsg(34, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function(data: any) {
                    RongIMClient._memoryStore.lastReadTime.set('chrhis_' + chatRoomId, MessageUtil.int64ToTimestamp(data.syncTime))
                    var list = data.list.reverse();
                    for (var i = 0, len = list.length; i < len; i++) {
                        list[i] = MessageUtil.messageParser(list[i]);
                    }
                    setTimeout(function() {
                        callback.onSuccess(list, !!data.hasMsg);
                    });
                },
                onError: function(error: ErrorCode) {
                    setTimeout(function() {
                        if (error === ErrorCode.TIMEOUT) {
                            callback.onError(error);
                        } else {
                            callback.onSuccess([], false);
                        }
                    });
                }
            }, "HistoryMsgOuput");
        }

        addToBlacklist(userId: string, callback: OperationCallback): void {
            var modules = new Modules.Add2BlackListInput();
            modules.setUserId(userId);
            RongIMClient.bridge.queryMsg(21, MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, {
                onSuccess: function() {
                    callback.onSuccess();
                },
                onError: function() {
                    callback.onError(ErrorCode.BLACK_ADD_ERROR);
                }
            });
        }

        getBlacklist(callback: GetBlacklistCallback): void {
            var modules = new Modules.QueryBlackListInput();
            modules.setNothing(1);
            RongIMClient.bridge.queryMsg(23, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, callback, "QueryBlackListOutput");
        }

        getBlacklistStatus(userId: string, callback: ResultCallback<string>): void {
            var modules = new Modules.BlackListStatusInput();
            modules.setUserId(userId);
            RongIMClient.bridge.queryMsg(24, MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, {
                onSuccess: function(status: number) {
                    setTimeout(function() {
                        callback.onSuccess(BlacklistStatus[status]);
                    });
                }, onError: function() {
                    setTimeout(function() {
                        callback.onError(ErrorCode.BLACK_GETSTATUS_ERROR);
                    });
                }
            });
        }

        removeFromBlacklist(userId: string, callback: OperationCallback): void {
            var modules = new Modules.RemoveFromBlackListInput();
            modules.setUserId(userId);
            RongIMClient.bridge.queryMsg(22, MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, {
                onSuccess: function() {
                    callback.onSuccess();
                },
                onError: function() {
                    callback.onError(ErrorCode.BLACK_REMOVE_ERROR);
                }
            });
        }

        getFileToken(fileType: FileType, callback: ResultCallback<string>): void {
            if (!(/(1|2|3|4)/.test(fileType.toString()))) {
                callback.onError(ErrorCode.QNTKN_FILETYPE_ERROR);
                return;
            }
            var modules = new Modules.GetQNupTokenInput();
            modules.setType(fileType);
            RongIMClient.bridge.queryMsg(30, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function(data: any) {
                    setTimeout(function() {
                        callback.onSuccess(data);
                    });
                },
                onError: function(errcode: ErrorCode) {
                    callback.onError(errcode);
                }
            }, "GetQNupTokenOutput");
        }

        getFileUrl(fileType: FileType, fileName: string, oriName: string, callback: ResultCallback<string>): void {
            if (!(/(1|2|3|4)/.test(fileType.toString()))) {
                setTimeout(function() {
                    callback.onError(ErrorCode.QNTKN_FILETYPE_ERROR);
                });
                return;
            }
            var modules = new Modules.GetQNdownloadUrlInput();
            modules.setType(fileType);
            modules.setKey(fileName);
            if (oriName) {
                modules.setFileName(oriName);
            }
            RongIMClient.bridge.queryMsg(31, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function(data: any) {
                    setTimeout(function() {
                        callback.onSuccess(data);
                    });
                },
                onError: function(errcode: ErrorCode) {
                    callback.onError(errcode);
                }
            }, "GetQNdownloadUrlOutput");
        }

       // methodType 1 : 多客服(客服后台使用);   2 : 消息撤回 
        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback, mentiondMsg?: boolean, pushText?: string, appData?: string, methodType?: number): void {
            if (!Bridge._client.channel) {
                sendCallback.onError(RongIMLib.ErrorCode.RC_NET_UNAVAILABLE, null);
                return;
            }
            if (!Bridge._client.channel.socket.socket.connected) {
                sendCallback.onError(ErrorCode.TIMEOUT, null);
                throw new Error("connect is timeout! postion:sendMessage");
            }

            var modules = new Modules.UpStreamMessage();
            if (mentiondMsg && (conversationType == ConversationType.DISCUSSION || conversationType == ConversationType.GROUP)) {
                modules.setSessionId(7);
            } else {
                modules.setSessionId(RongIMClient.MessageParams[messageContent.messageName].msgTag.getMessageTag());
            }

            pushText && modules.setPushText(pushText);
            appData && modules.setAppData(appData);

            if ((conversationType == ConversationType.DISCUSSION || conversationType == ConversationType.GROUP) && messageContent.messageName == RongIMClient.MessageType["ReadReceiptResponseMessage"]) {
                var rspMsg: ReadReceiptResponseMessage = <ReadReceiptResponseMessage>messageContent;
                if (rspMsg.receiptMessageDic) {
                    var ids: string[] = [];
                    for (var key in rspMsg.receiptMessageDic) {
                        ids.push(key);
                    }
                    modules.setUserId(ids);
                }
            }
            if ((conversationType == ConversationType.DISCUSSION || conversationType == ConversationType.GROUP) && messageContent.messageName == RongIMClient.MessageType["SyncReadStatusMessage"]) {
                modules.setUserId(Bridge._client.userId);
            }
            modules.setClassname(RongIMClient.MessageParams[messageContent.messageName].objectName);
            modules.setContent(messageContent.encode());
            var content: any = modules.toArrayBuffer();
            if (Object.prototype.toString.call(content) == "[object ArrayBuffer]") {
                content = [].slice.call(new Int8Array(content));
            }
            var c: Conversation = null, me = this, msg: Message = new RongIMLib.Message();
            this.getConversation(conversationType, targetId, <ResultCallback<Conversation>>{
                onSuccess: function(conver: Conversation) {
                    c = conver;
                    if (RongIMClient.MessageParams[messageContent.messageName].msgTag.getMessageTag() == 3) {
                        if (!c) {
                            c = RongIMClient.getInstance().createConversation(conversationType, targetId, "");
                        }
                        c.sentTime = new Date().getTime();
                        c.sentStatus = SentStatus.SENDING;
                        c.senderUserName = "";
                        c.senderUserId = Bridge._client.userId;
                        c.notificationStatus = ConversationNotificationStatus.DO_NOT_DISTURB;
                        c.latestMessage = msg;
                        c.unreadMessageCount = 0;
                        RongIMClient._dataAccessProvider.addConversation(c, <ResultCallback<boolean>>{ onSuccess: function(data) { } });
                    }
                    RongIMClient._memoryStore.converStore = c;
                }
            });
            msg.content = messageContent;
            msg.conversationType = conversationType;
            msg.senderUserId = Bridge._client.userId;
            msg.objectName = RongIMClient.MessageParams[messageContent.messageName].objectName;
            msg.targetId = targetId;
            msg.sentTime = new Date().getTime();
            msg.messageDirection = MessageDirection.SEND;
            msg.sentStatus = SentStatus.SENT;
            msg.messageType = messageContent.messageName;


            RongIMClient.bridge.pubMsg(conversationType.valueOf(), content, targetId, {
                onSuccess: function(data: any) {
                    data && data.timestamp && RongIMClient._storageProvider.setItem('converST_' + Bridge._client.userId + conversationType + targetId, data.timestamp);
                    if ((conversationType == ConversationType.DISCUSSION || conversationType == ConversationType.GROUP) && messageContent.messageName == RongIMClient.MessageType["ReadReceiptRequestMessage"]) {
                        var reqMsg: ReadReceiptRequestMessage = <ReadReceiptRequestMessage>msg.content;
                        var sentkey: string = Bridge._client.userId + reqMsg.messageUId + "SENT";
                        RongIMClient._storageProvider.setItem(sentkey, JSON.stringify({ count: 0, dealtime: data.timestamp, userIds: {} }));
                    }
                    if (RongIMClient.MessageParams[msg.messageType].msgTag.getMessageTag() == 3) {
                        RongIMClient._memoryStore.converStore.latestMessage = msg;
                        RongIMClient._dataAccessProvider.addMessage(conversationType, targetId, msg, {
                            onSuccess: function(ret: Message) {
                                msg = ret;
                                msg.messageUId = data.messageUId;
                                msg.sentTime = data.timestamp;
                                msg.sentStatus = SentStatus.SENT;
                                msg.messageId = data.messageId;
                                RongIMClient._dataAccessProvider.updateMessage(msg);
                            },
                            onError: function() { }
                        });
                    }
                    setTimeout(function() {
                        msg.sentTime = data.timestamp;
                        sendCallback.onSuccess(msg);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    msg.sentStatus = SentStatus.FAILED;
                    if (RongIMClient.MessageParams[msg.messageType].msgTag.getMessageTag() == 3) {
                        RongIMClient._memoryStore.converStore.latestMessage = msg;
                    }
                    RongIMClient._dataAccessProvider.addMessage(conversationType, targetId, msg, {
                        onSuccess: function(ret: Message) {
                            msg.messageId = ret.messageId;
                            RongIMClient._dataAccessProvider.updateMessage(msg);
                        },
                        onError: function() { }
                    });
                    setTimeout(function() {
                        sendCallback.onError(errorCode, msg);
                    });
                }
            }, null, methodType);
        }

        setConnectionStatusListener(listener: ConnectionStatusListener): void {
            if (RongIMClient.bridge) {
                RongIMClient.bridge.setListener(listener);
            } else {
                RongIMClient._memoryStore.listenerList.push(listener);
            }
        }

        setOnReceiveMessageListener(listener: OnReceiveMessageListener): void {
            if (RongIMClient.bridge) {
                RongIMClient.bridge.setListener(listener);
            } else {
                RongIMClient._memoryStore.listenerList.push(listener);
            }
        }

        registerMessageType(messageType: string, objectName: string, messageTag: MessageTag, messageContent: any): void {
            if (!messageType) {
                throw new Error("messageType can't be empty,postion -> registerMessageType");
            }
            if (!objectName) {
                throw new Error("objectName can't be empty,postion -> registerMessageType");
            }
            if (Object.prototype.toString.call(messageContent) == "[object Array]") {
                var regMsg = RongIMLib.ModelUtil.modleCreate(messageContent, messageType);
                RongIMClient.RegisterMessage[messageType] = regMsg;
            } else if (Object.prototype.toString.call(messageContent) == "[object Function]" || Object.prototype.toString.call(messageContent) == "[object Object]") {
                if (!messageContent.encode) {
                    throw new Error("encode method has not realized or messageName is undefined-> registerMessageType");
                }
                if (!messageContent.decode) {
                    throw new Error("decode method has not realized -> registerMessageType");
                }
            } else {
                throw new Error("The index of 3 parameter was wrong type  must be object or function or array-> registerMessageType");
            }
            registerMessageTypeMapping[objectName] = messageType;
        }

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

        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[], count?: number,isHidden?:boolean) {
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
                }, conversationTypes, count,isHidden);
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

        clearUnreadCountByTimestamp(conversationType: ConversationType, targetId: string, timestamp:number, callback: ResultCallback<boolean>) : void{
            callback.onSuccess(true);   
        }


        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            var sSql: string = "select * from t_conversation_" + this.database.userId + " t where t.conversationType = ? and t.targetId = ?";
            var uSql: string = "update t_conversation_" + this.database.userId + " set content = ? where conversationType = ? and targetId = ?", me = this;
            this.database.execSearchByParams(sSql, [conversationType, targetId], function(results: any[], rowsAffected: number) {
                var mentioneds = RongIMClient._storageProvider.getItem("mentioneds_" + Bridge._client.userId + '_' + conversationType + '_' + targetId);
                if (mentioneds) {
                    var info: any = JSON.parse(mentioneds);
                    delete info[conversationType + "_" + targetId];
                    if (!MessageUtil.isEmpty(info)) {
                        RongIMClient._storageProvider.setItem("mentioneds_" + Bridge._client.userId + '_' + conversationType + '_' + targetId, JSON.stringify(info));
                    } else {
                        RongIMClient._storageProvider.removeItem("mentioneds_" + Bridge._client.userId + '_' + conversationType + '_' + targetId);
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

        setConversationToTop(conversationType: ConversationType, targetId: string, isTop: boolean, callback: ResultCallback<boolean>) {
            var sql: string = "update t_conversation_" + this.database.userId + " set isTop = ? where conversationType = ? and targetId = ?";
            this.database.execUpdateByParams(sql, [conversationType, isTop, targetId]);
            callback.onSuccess(true);
        }

        setConversationHidden(conversationType: ConversationType, targetId: string,isHidden:boolean):void {
           
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

        setServerInfo(info:any):void{
            
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

        getUnreadMentionedMessages(conversationType:ConversationType, targetId:string):any{
            return null;
        }

        searchConversationByContent(keyword: string, callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[]): void {
            callback.onSuccess([]);
        }

        searchMessageByContent(conversationType: ConversationType, targetId: string, keyword: string, timestamp: number, count: number, total: number, callback: ResultCallback<Message[]>): void {
            callback.onSuccess([]);
        }

        getDelaTime():number{
            return 0;
        }

        getUserStatus(userId:string, callback:ResultCallback<UserStatus>) : void{
            callback.onSuccess(new UserStatus());
        }

        setUserStatus(userId:number, callback:ResultCallback<boolean>) : void{
            callback.onSuccess(true);
        }

        subscribeUserStatus(userIds:string[], callback:ResultCallback<boolean>) : void{
           callback.onSuccess(true);
        }

        clearListeners(): void{

        }

        setOnReceiveStatusListener(callback:Function) : void{
           callback();
        }
    }
}
