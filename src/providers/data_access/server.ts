module RongIMLib {
    export class ServerDataProvider implements DataAccessProvider {
        database: DBUtil = new DBUtil();

        init(appKey: string): void {
            new FeatureDectector();
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

        sendRecallMessage(content:any, sendMessageCallback: SendMessageCallback): void {
           var msg = new RecallCommandMessage({conversationType : content.conversationType, targetId : content.targetId, sentTime:content.sentTime, messageUId : content.messageUId, extra : content.extra, user : content.user});
           this.sendMessage(content.conversationType, content.senderUserId, msg, sendMessageCallback, false, null, null, 2);
        }

        sendTextMessage(conversationType: ConversationType, targetId: string, content: string, sendMessageCallback: SendMessageCallback): void {
            var msgContent = TextMessage.obtain(content);
            this.sendMessage(conversationType, targetId, msgContent, sendMessageCallback);
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
                    conversation.conversationTitle && (RongIMClient._memoryStore.conversationList[i].conversationTitle = conversation.conversationTitle);
                    conversation.senderUserName && (RongIMClient._memoryStore.conversationList[i].senderUserName = conversation.senderUserName);
                    conversation.senderPortraitUri && (RongIMClient._memoryStore.conversationList[i].senderPortraitUri = conversation.senderPortraitUri);
                    conversation.latestMessage && (RongIMClient._memoryStore.conversationList[i].latestMessage = conversation.latestMessage);
                    break;
                }
            }
            return conver;
        }

        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            var mod = new Modules.RelationsInput();
            mod.setType(conversationType);
            RongIMClient.bridge.queryMsg(27, MessageUtil.ArrayForm(mod.toArrayBuffer()), targetId, {
                onSuccess: function() {
                      callback.onSuccess(true);
                }, onError: function() {
                    setTimeout(function() {
                      callback.onError(ErrorCode.CONVER_REMOVE_ERROR);
                    });
                }
            });
        }

        getMessage(messageId: string, callback: ResultCallback<Message>) {
            callback.onSuccess(new Message());
        }

        addMessage(conversationType: ConversationType, targetId: string, message: Message, callback?: ResultCallback<Message>) {
            if (callback) {
                callback.onSuccess(message);
            }
        }

        removeMessage(conversationType: ConversationType, targetId: string, messageIds: DeleteMessage[], callback: ResultCallback<boolean>) {
            RongIMClient.getInstance().deleteRemoteMessages(conversationType, targetId, messageIds, callback);
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
                        var count = RongIMClient._storageProvider.getItem("cu" + Bridge._client.userId + conversationType + targetId);
                        if (conver.unreadMessageCount == 0) {
                            conver.unreadMessageCount = Number(count);
                        }
                    }
                }
            }
            callback.onSuccess(conver);
        }

        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[], count?: number,isHidden?:boolean) {
            if (RongIMClient._memoryStore.conversationList.length == 0 || RongIMClient._memoryStore.isSyncRemoteConverList || (typeof count != undefined && RongIMClient._memoryStore.conversationList.length < count)) {
                RongIMClient.getInstance().getRemoteConversationList(<ResultCallback<Conversation[]>>{
                    onSuccess: function(list: Conversation[]) {
                        if (MessageUtil.supportLargeStorage()) {
                            Array.forEach(RongIMClient._memoryStore.conversationList, function(item: Conversation) {
                                var count = RongIMClient._storageProvider.getItem("cu" + Bridge._client.userId + item.conversationType + item.targetId);
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
                }, conversationTypes, count,isHidden);
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
                    if (count > 0) {
                        convers.length = count;
                    }
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

        getTotalUnreadCount(callback: ResultCallback<number>, conversationTypes?: number[]) {
            var count: number = 0;
            if (conversationTypes) {
                for (var i = 0, len = conversationTypes.length; i < len; i++) {
                    Array.forEach(RongIMClient._memoryStore.conversationList, function(conver: Conversation) {
                        if (conver.conversationType == conversationTypes[i]) {
                            count += conver.unreadMessageCount;
                        }
                    });
                }
            } else {
                Array.forEach(RongIMClient._memoryStore.conversationList, function(conver: Conversation) {
                    count += conver.unreadMessageCount;
                });
            }
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

        clearUnreadCountByTimestamp(conversationType: ConversationType, targetId: string, timestamp:number, callback: ResultCallback<boolean>) : void{
            callback.onSuccess(true);   
        }

        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            this.getConversation(conversationType, targetId, {
                onSuccess: function(conver: Conversation) {
                    if (conver) {
                        if (RongIMLib.MessageUtil.supportLargeStorage()) {
                            RongIMClient._storageProvider.removeItem("cu" + Bridge._client.userId + conversationType + targetId);
                        }
                        conver.unreadMessageCount = 0;
                        conver.mentionedMsg = null;
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
                    }
                    callback.onSuccess(true);
                },
                onError: function(error: ErrorCode) {
                    callback.onError(error);
                }
            });


        }
        setConversationToTop(conversationType: ConversationType, targetId: string, isTop: boolean, callback: ResultCallback<boolean>) {
            var me = this;
            this.getConversation(conversationType, targetId, {
                onSuccess: function(conver: Conversation) {
                    conver.isTop = isTop;
                    me.addConversation(conver, callback);
                    callback.onSuccess(true);
                },
                onError: function(error: ErrorCode) {
                    callback.onError(error);
                }
            });

        }

        clearListeners(): void{

        }
        
        setServerInfo(info:any):void{
            
        }

        getUnreadMentionedMessages(conversationType:ConversationType, targetId:string, callback:ResultCallback<any>):void{
            callback.onSuccess({});          
        }

        setConversationHidden(conversationType: ConversationType, targetId: string,isHidden:boolean):void {
           
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

        getAllConversations(callback: ResultCallback<Conversation[]>): void {
            callback.onSuccess([]);
        }

        getConversationByContent(keywords: string, callback: ResultCallback<Conversation[]>): void {
            callback.onSuccess([]);
        }

        getMessagesFromConversation(conversationType: ConversationType, targetId: string, keywords: string, callback: ResultCallback<Message[]>): void {
            callback.onSuccess([]);
        }

        searchConversationByContent(keyword: string, callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[]): void {
            callback.onSuccess([]);
        }

        searchMessageByContent(conversationType: ConversationType, targetId: string, keyword: string, timestamp: number, count: number, total: number, callback: ResultCallback<Message[]>): void {
            callback.onSuccess([]);
        }

        getDelaTime():number{
            return RongIMClient._memoryStore.deltaTime;
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

        setOnReceiveStatusListener(callback:Function) : void{
           callback();
        }
    }
}
