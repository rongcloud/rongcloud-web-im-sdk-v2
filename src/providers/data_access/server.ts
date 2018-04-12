module RongIMLib {
    export class ServerDataProvider implements DataAccessProvider {

        userStatusListener: Function = null;

        init(appKey: string, options?: any): void {
            new FeatureDectector(options.appCallback);
        }

        connect(token: string, callback: ConnectCallback) {
            RongIMClient.bridge = Bridge.getInstance();
            RongIMClient._memoryStore.token = token;
            RongIMClient._memoryStore.callback = callback;

            var isConnecting = false, isConnected = false;
            if (Bridge._client && Bridge._client.channel) {
                isConnecting = (Bridge._client.channel.connectionStatus == ConnectionStatus.CONNECTING);
                isConnected = (Bridge._client.channel.connectionStatus == ConnectionStatus.CONNECTED);
                
            }
            if (isConnected || isConnecting) {
                return;
            }
            var isGreater = (RongIMClient.otherDeviceLoginCount > 5);
            if (isGreater) {
                callback.onError(ConnectionStatus.ULTRALIMIT);
                return;
            }
            //循环设置监听事件，追加之后清空存放事件数据
            for (let i = 0, len = RongIMClient._memoryStore.listenerList.length; i < len; i++) {
                RongIMClient.bridge["setListener"](RongIMClient._memoryStore.listenerList[i]);
            }
            RongIMClient._memoryStore.listenerList.length = 0;
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
        }
        /*
            config.auto: 默认 false, true 启用自动重连，启用则为必选参数
            config.rate: 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
            config.url: 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
        */
        reconnect(callback: ConnectCallback, config?: any): void {
            var store = RongIMLib.RongIMClient._memoryStore;
            var token = store.token;
            if (!token) {
                throw new Error('reconnect: token is empty.');
            }
            if (Bridge._client && Bridge._client.channel && Bridge._client.channel.connectionStatus != ConnectionStatus.CONNECTED && Bridge._client.channel.connectionStatus != ConnectionStatus.CONNECTING) {
                config = config || {};
                var key = config.auto ? 'auto' : 'custom';
                var handler:{[key: string]: any} = {
                    auto: function(){
                        var repeatConnect = function(options: any){
                            var step = options.step();
                            var done = 'done';
                            var url = options.url;
                            var ping = function(){
                                RongUtil.request({
                                    url: url,
                                    success: function(){
                                        options.done();
                                    },
                                    error: function(){
                                        repeat();
                                    }
                                });
                            };
                            var repeat = function(){
                                var next = step();
                                if (next == 'done') {
                                    var error = ConnectionStatus.NETWORK_UNAVAILABLE;
                                    options.done(error);
                                    return;
                                }
                                setTimeout(ping, next);
                            };
                            repeat();
                        }
                        var protocol = RongIMClient._memoryStore.depend.protocol;
                        var url = config.url || 'cdn.ronghub.com/RongIMLib-2.2.6.min.js';
                        var pathConfig = {
                            protocol: protocol,
                            path: url
                        };
                        url = RongUtil.formatProtoclPath(pathConfig);
                        var rate = config.rate || [100, 1000, 3000, 6000, 10000, 18000];
                        //结束标识
                        rate.push('done');

                        var opts = {
                            url: url,
                            step: function(){
                                var index = 0;
                                return function(){
                                    var time = rate[index];
                                    index++;
                                    return time;
                                }
                            },
                            done: function(error: ConnectionStatus){
                                if (error) {
                                    callback.onError(error);
                                    return;
                                }
                                RongIMClient.connect(token, callback);
                            }
                        };
                        repeatConnect(opts);
                    },
                    custom: function(){
                        RongIMClient.connect(token, callback);
                    }
                };
                handler[key]();
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
            if (RongUtil.supportLocalStorage()) {
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
                        me.sendMessage(conversationType, targetId, rspMsg, <SendMessageCallback>{
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
                me.sendMessage(conversationType, targetId, TypingStatusMessage.obtain(RongIMClient.MessageParams[messageName].objectName, ""), <SendMessageCallback>{
                    onSuccess: function() {
                        setTimeout(function() {
                            sendCallback.onSuccess();
                        });
                    },
                    onError: function(errorCode: ErrorCode) {
                        setTimeout(function() {
                            sendCallback.onError(errorCode, null);
                        });
                    },
                    onBefore: function(){}
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
            if(count <= 1) {
                throw new Error("the count must be greater than 1.");
            }
            var modules = new RongIMClient.Protobuf.HistoryMessageInput(), self = this;
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
                    var read = RongIMLib.SentStatus.READ;
                    if (RongUtil.supportLocalStorage()) {
                        for (var i = 0, len = list.length; i < len; i++) {
                            tempMsg = MessageUtil.messageParser(list[i]);
                            tempDir = JSON.parse(RongIMClient._storageProvider.getItem(Bridge._client.userId + tempMsg.messageUId + "SENT"));
                            if (tempDir) {
                                tempMsg.receiptResponse || (tempMsg.receiptResponse = {});
                                tempMsg.receiptResponse[tempMsg.messageUId] = tempDir.count;
                            }
                            tempMsg.sentStatus = read
                            tempMsg.targetId = targetId;
                            list[i] = tempMsg;
                        }
                    } else {
                        for (var i = 0, len = list.length; i < len; i++) {
                            var tempMsg:Message = MessageUtil.messageParser(list[i]);
                            tempMsg.sentStatus = read;
                            list[i] = tempMsg;
                        }
                    }
                    setTimeout(function() {
                        callback.onSuccess(list, !!data.hasMsg);
                    });
                },
                onError: function(error: ErrorCode) {
                    setTimeout(function(){
                        callback.onError(error);
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
            var modules = new RongIMClient.Protobuf.RelationsInput(), self = this;
            modules.setType(1);
            if (typeof count == 'undefined') {
                modules.setCount(0);
            } else {
                modules.setCount(count);
            }
            RongIMClient.bridge.queryMsg(26, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function(list: any) {
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
                        setTimeout(function(){
                            callback.onSuccess(convers);
                        });
                    } else {
                        setTimeout(function(){
                            callback.onSuccess(RongIMClient._memoryStore.conversationList);
                        });
                    }
                },
                onError: function(error: ErrorCode) {
                    callback.onError(error);
                }
            }, "RelationsOutput");
        }

        addMemberToDiscussion(discussionId: string, userIdList: string[], callback: OperationCallback): void {
            var modules = new RongIMClient.Protobuf.ChannelInvitationInput();
            modules.setUsers(userIdList);
            RongIMClient.bridge.queryMsg(0, MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, {
                onSuccess: function() {
                    setTimeout(function() {
                        callback.onSuccess();
                    });
                },
                onError: function(error: ErrorCode) {
                    setTimeout(function(){
                        callback.onError(error);
                    });
                }
            });
        }

        createDiscussion(name: string, userIdList: string[], callback: CreateDiscussionCallback): void {
            var modules = new RongIMClient.Protobuf.CreateDiscussionInput(), self = this;
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
                onError: function(error: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(error);
                    });
                }
            }, "CreateDiscussionOutput");
        }

        getDiscussion(discussionId: string, callback: ResultCallback<Discussion>): void {
            var modules = new RongIMClient.Protobuf.ChannelInfoInput();
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
            var modules = new RongIMClient.Protobuf.LeaveChannelInput();
            modules.setNothing(1);
            RongIMClient.bridge.queryMsg(7, MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, {
                onSuccess: function() {
                    setTimeout(function() {
                        callback.onSuccess();
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            });
        }

        removeMemberFromDiscussion(discussionId: string, userId: string, callback: OperationCallback): void {
            var modules = new RongIMClient.Protobuf.ChannelEvictionInput();
            modules.setUser(userId);
            RongIMClient.bridge.queryMsg(9, MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, {
                onSuccess: function() {
                    setTimeout(function() {
                        callback.onSuccess();
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            });
        }

        setDiscussionInviteStatus(discussionId: string, status: DiscussionInviteStatus, callback: OperationCallback): void {
            var modules = new RongIMClient.Protobuf.ModifyPermissionInput();
            modules.setOpenStatus(status.valueOf());
            RongIMClient.bridge.queryMsg(11, MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, {
                onSuccess: function(x: any) {
                    setTimeout(function() {
                        callback.onSuccess();
                    });
                }, onError: function(error: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(error);
                    });
                }
            });
        }

        setDiscussionName(discussionId: string, name: string, callback: OperationCallback): void {
            var modules = new RongIMClient.Protobuf.RenameChannelInput();
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

        joinChatRoom(chatroomId: string, messageCount: number, callback: OperationCallback): void {
            var e = new RongIMClient.Protobuf.ChrmInput();
            e.setNothing(1);
            Bridge._client.chatroomId = chatroomId;
            RongIMClient.bridge.queryMsg(19, MessageUtil.ArrayForm(e.toArrayBuffer()), chatroomId, {
                onSuccess: function() {
                    setTimeout(function(){
                        callback.onSuccess();
                    });
                    var modules = new RongIMClient.Protobuf.ChrmPullMsg();
                    messageCount == 0 && (messageCount = -1);
                    modules.setCount(messageCount);
                    modules.setSyncTime(0);
                    Bridge._client.queryMessage("chrmPull", MessageUtil.ArrayForm(modules.toArrayBuffer()), chatroomId, 1, {
                        onSuccess: function(collection: any) {
                            var list = collection.list;
                            var sync = RongIMLib.MessageUtil.int64ToTimestamp(collection.syncTime);
                            var latestMessage = list[list.length - 1];
                            if (latestMessage) {
                                latestMessage = RongIMLib.MessageUtil.messageParser(latestMessage);
                                sync = latestMessage.sentTime;                                
                            }
                            RongIMClient._memoryStore.lastReadTime.set(chatroomId + RongIMLib.Bridge._client.userId + "CST", sync);
                            var _client = RongIMLib.Bridge._client;
                            for (var i = 0, mlen = list.length; i < mlen; i++) {
                                var uId = 'R' + list[i].msgId;
                                if (!(uId in _client.cacheMessageIds)) {
                                    _client.cacheMessageIds[uId] = true;
                                    var cacheUIds = RongUtil.keys(_client.cacheMessageIds);
                                    if (cacheUIds.length > 10) {
                                        uId = cacheUIds[0];
                                        delete _client.cacheMessageIds[uId];
                                    }
                                    if (RongIMLib.RongIMClient._memoryStore.filterMessages.length > 0) {
                                        for (var j = 0, flen = RongIMLib.RongIMClient._memoryStore.filterMessages.length; j < flen; j++) {
                                            if (RongIMLib.RongIMClient.MessageParams[RongIMLib.RongIMClient._memoryStore.filterMessages[j]].objectName != list[i].classname) {
                                               _client.handler.onReceived(list[i]);
                                            }
                                        }
                                    }
                                    else {
                                       _client.handler.onReceived(list[i]);
                                    }   
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
                onError: function(error: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(error);
                    });
                }
            }, "ChrmOutput");
        }

        getChatRoomInfo(chatRoomId: string, count: number, order: GetChatRoomType, callback: ResultCallback<any>): void {
            var modules = new RongIMClient.Protobuf.QueryChatroomInfoInput();
            modules.setCount(count);
            modules.setOrder(order);
            RongIMClient.bridge.queryMsg("queryChrmI", MessageUtil.ArrayForm(modules.toArrayBuffer()), chatRoomId, {
                onSuccess: function(ret: any) {
                    var userInfos = ret.userInfos;
                    userInfos.forEach(function(item:any){
                        item.time = RongIMLib.MessageUtil.int64ToTimestamp(item.time)
                    });
                    setTimeout(function() {
                        callback.onSuccess(ret);
                    });
                },
                onError: function(errcode: ErrorCode) {
                    setTimeout(function(){
                        callback.onError(errcode);
                    });
                }
            }, "QueryChatroomInfoOutput");
        }

        quitChatRoom(chatroomId: string, callback: OperationCallback): void {
            var e = new RongIMClient.Protobuf.ChrmInput();
            e.setNothing(1);
            RongIMClient.bridge.queryMsg(17, MessageUtil.ArrayForm(e.toArrayBuffer()), chatroomId, {
                onSuccess: function() {
                    setTimeout(function() {
                        callback.onSuccess();
                    });
                },
                onError: function(errcode: ErrorCode) {
                    setTimeout(function(){
                        callback.onError(errcode);
                    });
                }
            }, "ChrmOutput");
        }

        setChatroomHisMessageTimestamp(chatRoomId:string, timestamp:number):void{
            RongIMClient._memoryStore.lastReadTime.set('chrhis_' + chatRoomId, timestamp);
        }

        getChatRoomHistoryMessages(chatRoomId:string, count:number, order:number, callback:any):void{
            var modules = new RongIMClient.Protobuf.HistoryMsgInput();
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
                        callback.onError(error);
                    });
                }
            }, "HistoryMsgOuput");
        }

        setMessageStatus(conversationType: ConversationType, targetId: string, timestamp:number, status: string, callback:ResultCallback<Boolean>):void{
            setTimeout(function(){
                callback.onSuccess(true);
            });
        }

        addToBlacklist(userId: string, callback: OperationCallback): void {
            var modules = new RongIMClient.Protobuf.Add2BlackListInput();
            modules.setUserId(userId);
            RongIMClient.bridge.queryMsg(21, MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, {
                onSuccess: function() {
                    setTimeout(function(){
                        callback.onSuccess();
                    });
                },
                onError: function(error: ErrorCode) {
                    setTimeout(function(){
                        callback.onError(error);
                    });
                }
            });
        }

        getBlacklist(callback: GetBlacklistCallback): void {
            var modules = new RongIMClient.Protobuf.QueryBlackListInput();
            modules.setNothing(1);
            RongIMClient.bridge.queryMsg(23, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function(list: any){
                    setTimeout(function(){
                        callback.onSuccess(list);
                    });
                },
                onError: function(error: ErrorCode) {
                    setTimeout(function(){
                        callback.onError(error);
                    });
                }
            }, "QueryBlackListOutput");
        }

        getBlacklistStatus(userId: string, callback: ResultCallback<string>): void {
            var modules = new RongIMClient.Protobuf.BlackListStatusInput();
            modules.setUserId(userId);
            RongIMClient.bridge.queryMsg(24, MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, {
                onSuccess: function(status: number) {
                    setTimeout(function() {
                        callback.onSuccess(BlacklistStatus[status]);
                    });
                }, onError: function(error: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(error);
                    });
                }
            });
        }

        removeFromBlacklist(userId: string, callback: OperationCallback): void {
            var modules = new RongIMClient.Protobuf.RemoveFromBlackListInput();
            modules.setUserId(userId);
            RongIMClient.bridge.queryMsg(22, MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, {
                onSuccess: function() {
                    setTimeout(function(){
                        callback.onSuccess();
                    });
                },
                onError: function(error: ErrorCode) {
                    setTimeout(function(){
                        callback.onError(error);
                    });
                }
            });
        }

        getFileToken(fileType: FileType, callback: ResultCallback<string>): void {
            if (!(/(1|2|3|4)/.test(fileType.toString()))) {
                setTimeout(function() {
                    callback.onError(ErrorCode.QNTKN_FILETYPE_ERROR);
                })
                return;
            }
            var modules = new RongIMClient.Protobuf.GetQNupTokenInput();
            modules.setType(fileType);
            RongIMClient.bridge.queryMsg(30, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function(data: any) {
                    setTimeout(function() {
                        callback.onSuccess(data);
                    });
                },
                onError: function(errcode: ErrorCode) {
                    setTimeout(function(){
                        callback.onError(errcode);
                    });
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
            var modules = new RongIMClient.Protobuf.GetQNdownloadUrlInput();
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
                    setTimeout(function(){
                        callback.onError(errcode);
                    });
                }
            }, "GetQNdownloadUrlOutput");
        }

        /*
            methodType 1 : 多客服(客服后台使用);   2 : 消息撤回 
            params.userIds : 定向消息接收者
        */
        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback, mentiondMsg?: boolean, pushText?: string, appData?: string, methodType?: number, params?:any): void {
            if (!Bridge._client.channel) {
                setTimeout(function(){
                    sendCallback.onError(RongIMLib.ErrorCode.RC_NET_UNAVAILABLE, null);
                });
                return;
            }
            if (!Bridge._client.channel.socket.socket.connected) {
                setTimeout(function(){
                    sendCallback.onError(ErrorCode.TIMEOUT, null);
                });
                throw new Error("connect is timeout! postion:sendMessage");
            }

            var isGroup = (conversationType == ConversationType.DISCUSSION || conversationType == ConversationType.GROUP);

            var modules = new RongIMClient.Protobuf.UpStreamMessage();
            if (mentiondMsg && isGroup) {
                modules.setSessionId(7);
            } else {
                modules.setSessionId(RongIMClient.MessageParams[messageContent.messageName].msgTag.getMessageTag());
            }

            pushText && modules.setPushText(pushText);
            appData && modules.setAppData(appData);

            if (isGroup && messageContent.messageName == RongIMClient.MessageType["ReadReceiptResponseMessage"]) {
                var rspMsg: ReadReceiptResponseMessage = <ReadReceiptResponseMessage>messageContent;
                if (rspMsg.receiptMessageDic) {
                    var ids: string[] = [];
                    for (var key in rspMsg.receiptMessageDic) {
                        ids.push(key);
                    }
                    modules.setUserId(ids);
                }
            }
            if (isGroup && messageContent.messageName == RongIMClient.MessageType["SyncReadStatusMessage"]) {
                modules.setUserId(Bridge._client.userId);
            }

            params = params || {};
            var userIds = params.userIds;
            if (isGroup && userIds) {
                modules.setUserId(userIds);
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
                    if(data && data.timestamp) {
                        RongIMClient._memoryStore.lastReadTime.set('converST_' + Bridge._client.userId + conversationType + targetId, data.timestamp);
                    }
                    if ((conversationType == ConversationType.DISCUSSION || conversationType == ConversationType.GROUP) && messageContent.messageName == RongIMClient.MessageType["ReadReceiptRequestMessage"]) {
                        var reqMsg: ReadReceiptRequestMessage = <ReadReceiptRequestMessage>msg.content;
                        var sentkey: string = Bridge._client.userId + reqMsg.messageUId + "SENT";
                        RongIMClient._storageProvider.setItem(sentkey, JSON.stringify({ count: 0, dealtime: data.timestamp, userIds: {} }));
                    }
                   
                    if (RongIMClient.MessageParams[msg.messageType].msgTag.getMessageTag() == 3) {
                        var cacheConversation = RongIMClient._memoryStore.converStore;
                        cacheConversation.sentStatus = msg.sentStatus;
                        cacheConversation.latestMessage = msg;
                        me.updateConversation(cacheConversation);
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
                        cacheConversation && me.updateConversation(cacheConversation);
                        msg.sentTime = data.timestamp;
                        msg.messageUId = data.messageUId;
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
            sendCallback.onBefore && sendCallback.onBefore(RongIMLib.MessageIdHandler.messageId);
            msg.messageId = RongIMLib.MessageIdHandler.messageId + "";
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
            callback && callback.onSuccess(true);
        }

        updateConversation(conversation: Conversation): Conversation {
            var conver: Conversation;
            for (let i = 0, len = RongIMClient._memoryStore.conversationList.length; i < len; i++) {
                var item = RongIMClient._memoryStore.conversationList[i];
                if (conversation.conversationType === item.conversationType && conversation.targetId === item.targetId) {
                    conversation.conversationTitle && (item.conversationTitle = conversation.conversationTitle);
                    conversation.senderUserName && (item.senderUserName = conversation.senderUserName);
                    conversation.senderPortraitUri && (item.senderPortraitUri = conversation.senderPortraitUri);
                    conversation.latestMessage && (item.latestMessage = conversation.latestMessage);
                    conversation.sentStatus && (item.sentStatus = conversation.sentStatus);
                    break;
                }
            }
            return conver;
        }

        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            var mod = new RongIMClient.Protobuf.RelationsInput();
            mod.setType(conversationType);
            RongIMClient.bridge.queryMsg(27, MessageUtil.ArrayForm(mod.toArrayBuffer()), targetId, {
                onSuccess: function() {
                    var conversations = RongIMClient._memoryStore.conversationList
                    var len = conversations.length;
                    for(var i=0; i<len; i++){
                        if(conversations[i].conversationType == conversationType && targetId == conversations[i].targetId) {
                            conversations.splice(i,1);
                            break;
                        }
                    }
                    callback.onSuccess(true);
                }, onError: function(error: ErrorCode) {
                    setTimeout(function() {
                      callback.onError(error);
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


        clearRemoteHistoryMessages(params: any, callback: ResultCallback<boolean>) {
            var modules = new RongIMClient.Protobuf.CleanHisMsgInput();
            var conversationType = params.conversationType;

            var _topic: {[s: string]: any} = {
                1: 'cleanPMsg',
                2: 'cleanDMsg',
                3: 'cleanGMsg',
                5: 'cleanCMsg',
                6: 'cleanSMsg'
            };
            var topic = _topic[conversationType];
            if (!topic) {
                callback.onError(ErrorCode.CLEAR_HIS_TYPE_ERROR);
                return;
            }
            var timestamp = params.timestamp;

            if (typeof timestamp != 'number') {
                callback.onError(ErrorCode.CLEAR_HIS_TIME_ERROR);
                return;
            }
            modules.setDataTime(timestamp);
            
            var targetId = params.targetId;
            modules.setTargetId(targetId);

            RongIMClient.bridge.queryMsg(topic, MessageUtil.ArrayForm(modules.toArrayBuffer()), targetId, {
                onSuccess: function(result: any) {
                    callback.onSuccess(!result);
                }, onError: function(error: ErrorCode) {
                    // error 1 历史消息云存储没有开通、传入时间大于服务器时间 清除失败，1 与其他错误码冲突，所以自定义错误码返回
                    if (error == 1) {
                        error = ErrorCode.CLEAR_HIS_ERROR;
                    }
                    setTimeout(function() {
                      callback.onError(error);
                    });
                }
            });
        }

        clearHistoryMessages(params: any, callback: ResultCallback<boolean>):void{
           this.clearRemoteHistoryMessages(params, callback);
        }
        // 兼容老版本
        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>):void{
           
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
                            setTimeout(function(){
                                callback.onError(errorCode);
                            });
                        }
                    }, null);
                }
            }
            setTimeout(function(){
                callback.onSuccess(true);
            });
        }

        getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>) {
            var conver: Conversation = null;
            for (let i = 0, len = RongIMClient._memoryStore.conversationList.length; i < len; i++) {
                if (RongIMClient._memoryStore.conversationList[i].conversationType == conversationType && RongIMClient._memoryStore.conversationList[i].targetId == targetId) {
                    conver = RongIMClient._memoryStore.conversationList[i];
                    if (RongUtil.supportLocalStorage()) {
                        var count = RongIMClient._storageProvider.getItem("cu" + Bridge._client.userId + conversationType + targetId);
                        if (conver.unreadMessageCount == 0) {
                            conver.unreadMessageCount = Number(count);
                        }
                    }
                }
            }
            setTimeout(function() {
                callback.onSuccess(conver);
            });
        }

        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[], count?: number,isHidden?:boolean) {
            var isSync = RongIMClient._memoryStore.isSyncRemoteConverList;
            var list = RongIMClient._memoryStore.conversationList;
            if (!isSync) {
                setTimeout(function() {
                    callback.onSuccess(list);
                });
                return;
            }

            RongIMClient.getInstance().getRemoteConversationList(<ResultCallback<Conversation[]>>{
                    onSuccess: function(list: Conversation[]) {
                        if (RongUtil.supportLocalStorage()) {
                            Array.forEach(RongIMClient._memoryStore.conversationList, function(item: Conversation) {
                                var count = RongIMClient._storageProvider.getItem("cu" + Bridge._client.userId + item.conversationType + item.targetId);
                                if (item.unreadMessageCount == 0) {
                                    item.unreadMessageCount = Number(count);
                                }
                            });
                        }
                        RongIMClient._memoryStore.isSyncRemoteConverList = false;
                        setTimeout(function() {
                            callback.onSuccess(list);
                        });
                    },
                    onError: function(errorcode: ErrorCode) {
                        setTimeout(function() {
                            callback.onError(errorcode);
                        });
                    }
                }, conversationTypes, count,isHidden);
        }

        clearConversations(conversationTypes: ConversationType[], callback: ResultCallback<boolean>) {
            Array.forEach(conversationTypes, function(conversationType: ConversationType) {
                Array.forEach(RongIMClient._memoryStore.conversationList, function(conver: Conversation) {
                    if (conversationType == conver.conversationType) {
                        RongIMClient.getInstance().removeConversation(conver.conversationType, conver.targetId, { onSuccess: function() { }, onError: function() { } });
                    }
                });
            });
            setTimeout(function() {
                callback.onSuccess(true);
            });
        }

        setMessageContent(messageId: number, content:any, objectname:string):void{
            
        };

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
            setTimeout(function(){
                callback.onSuccess(count);
            });
        }

        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>) {
            this.getConversation(conversationType, targetId, {
                onSuccess: function(conver: Conversation) {
                    setTimeout(function(){
                        callback.onSuccess(conver ? conver.unreadMessageCount : 0);
                    });
                },
                onError: function(error: ErrorCode) {
                    setTimeout(function(){
                        callback.onError(error);
                    });
                }
            });
        }

        clearUnreadCountByTimestamp(conversationType: ConversationType, targetId: string, timestamp:number, callback: ResultCallback<boolean>) : void{
            setTimeout(function(){
                callback.onSuccess(true);
            });   
        }

        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            RongIMClient._storageProvider.removeItem("cu" + Bridge._client.userId + conversationType + targetId);
            this.getConversation(conversationType, targetId, {
                onSuccess: function(conver: Conversation) {
                    if (conver) {
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
                    setTimeout(function(){
                        callback.onSuccess(true);
                    });
                },
                onError: function(error: ErrorCode) {
                    setTimeout(function(){
                        callback.onError(error);
                    });
                }
            });


        }
        setConversationToTop(conversationType: ConversationType, targetId: string, isTop: boolean, callback: ResultCallback<boolean>) {
            var me = this;
            this.getConversation(conversationType, targetId, {
                onSuccess: function(conver: Conversation) {
                    conver.isTop = isTop;
                    me.addConversation(conver, callback);
                    setTimeout(function(){
                        callback.onSuccess(true);
                    });
                },
                onError: function(error: ErrorCode) {
                    setTimeout(function(){
                        callback.onError(error);
                    });
                }
            });

        }

        getConversationNotificationStatus(params:any, callback: any):void{
            var targetId = params.targetId;
            var conversationType = params.conversationType;
            var notification = RongIMClient._memoryStore.notification;
            var getKey = function(){
                return conversationType + '_' + targetId;
            };
            
            var key = getKey();

            var status = notification[key];

            if (typeof status == 'number') {
                callback.onSuccess(status);
                return;
            }

            var topics: any = {
                1: 'qryPPush',
                3: 'qryDPush'
            };

            var topic = topics[conversationType];

            if (!topic) {
                var error = 8001;
                callback.onError(error);
                return;
            }
            var modules = new RongIMClient.Protobuf.BlockPushInput();
            modules.setBlockeeId(targetId);
            
            var userId = RongIMLib.Bridge._client.userId;

            var success = function(status: any){
                notification[key] = status;
                setTimeout(function(){
                    callback.onSuccess(status);
                });
            };
            RongIMLib.RongIMClient.bridge.queryMsg(topic, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, {
                onSuccess: function (status: any) {
                   success(status);
                }, onError: function (e: any) {
                    if (e == 1) {
                        success(e);
                    }else{
                        setTimeout(function(){
                            callback.onError(e);
                        });
                    }
                }
            });
        }

        setConversationNotificationStatus(params:any, callback: any):void{
            var conversationType = params.conversationType;
            var targetId = params.targetId;
            var status = params.status;

            var getKey = function(){
                return conversationType + '_' + status;
            };

            var topics:any = {
                '1_1': 'blkPPush',
                '3_1': 'blkDPush',
                '1_0': 'unblkPPush',
                '3_0': 'unblkDPush'
            };

            var key = getKey();

            var notification = RongIMClient._memoryStore.notification;
            notification[key] = status;

            var topic = topics[key];
            if (!topic) {
                var error = 8001;
                setTimeout(function(){
                    callback.onError(error);
                });
                return;
            }

            var modules = new RongIMClient.Protobuf.BlockPushInput();
            modules.setBlockeeId(targetId);
            
            var userId = RongIMLib.Bridge._client.userId;

            RongIMLib.RongIMClient.bridge.queryMsg(topic, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, {
                onSuccess: function (status:any) {
                    setTimeout(function(){
                        callback.onSuccess(status);
                    });
                }, onError: function (e:any) {
                    setTimeout(function(){
                        callback.onError(e);
                    });
                }
            });
        }

        getUserStatus(userId:string, callback:ResultCallback<UserStatus>) : void{
            var modules = new RongIMClient.Protobuf.GetUserStatusInput();
            userId = RongIMLib.Bridge._client.userId;
            RongIMLib.RongIMClient.bridge.queryMsg(35, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, {
                onSuccess: function (status: any) {
                    status = RongInnerTools.convertUserStatus(status);
                    setTimeout(function(){
                        callback.onSuccess(status);
                    });
                }, onError: function (e: any) {
                    setTimeout(function(){
                        callback.onError(e);
                    });
                }
            }, 'GetUserStatusOutput');
            // callback.onSuccess(new UserStatus());
        }

        setUserStatus(status:number, callback:ResultCallback<boolean>) : void{
            var modules = new RongIMClient.Protobuf.SetUserStatusInput();
            var userId:string = RongIMLib.Bridge._client.userId;    
            if (status) {
                modules.setStatus(status); 
            }  
            RongIMLib.RongIMClient.bridge.queryMsg(36, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, {
                onSuccess: function (status: any) {
                    setTimeout(function(){
                        callback.onSuccess(true);
                    });
                }, onError: function (e: any) {
                    setTimeout(function(){
                        callback.onError(e);
                    });
                }
            }, 'SetUserStatusOutput');
        }

        subscribeUserStatus(userIds:string[], callback?:ResultCallback<boolean>) : void{
            var modules = new RongIMClient.Protobuf.SubUserStatusInput();
            var userId = RongIMLib.Bridge._client.userId;       
            modules.setUserid(userIds);
            RongIMLib.RongIMClient.bridge.queryMsg(37, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, {
                onSuccess: function (status: any) {
                    setTimeout(function(){
                        callback && callback.onSuccess(true);
                    });
                }, onError: function (e: any) {
                    setTimeout(function(){
                        callback && callback.onError(e);
                    });
                }
            }, 'SubUserStatusOutput');
        }


        setUserStatusListener(params:any, callback?: Function):void{
            RongIMClient.userStatusListener = callback;
            var userIds = params.userIds || [];
            if (userIds.length) {
               RongIMClient._dataAccessProvider.subscribeUserStatus(userIds);
            }
        }

        clearListeners(): void{

        }
        
        setServerInfo(info:any):void{
            
        }

        getUnreadMentionedMessages(conversationType:ConversationType, targetId:string):any{
            return null;       
        }

        setConversationHidden(conversationType: ConversationType, targetId: string,isHidden:boolean):void {
           
        }

        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>) {
            setTimeout(function(){
                callback.onSuccess(true);
            });
        }

        setMessageReceivedStatus(messageId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>) {
            setTimeout(function(){
                callback.onSuccess(true);
            });
        }

        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>) {
            setTimeout(function(){
                callback.onSuccess(true);
            });
        }

        getAllConversations(callback: ResultCallback<Conversation[]>): void {
            setTimeout(function(){
                callback.onSuccess([]);
            });
        }

        getConversationByContent(keywords: string, callback: ResultCallback<Conversation[]>): void {
            setTimeout(function(){
                callback.onSuccess([]);
            });
        }

        getMessagesFromConversation(conversationType: ConversationType, targetId: string, keywords: string, callback: ResultCallback<Message[]>): void {
            setTimeout(function(){
                callback.onSuccess([]);
            });
        }

        searchConversationByContent(keyword: string, callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[]): void {
            setTimeout(function(){
                callback.onSuccess([]);
            });
        }

        searchMessageByContent(conversationType: ConversationType, targetId: string, keyword: string, timestamp: number, count: number, total: number, callback: ResultCallback<Message[]>): void {
            setTimeout(function(){
                callback.onSuccess([]);
            });
        }

        getDelaTime():number{
            return RongIMClient._memoryStore.deltaTime;
        }
        
        getCurrentConnectionStatus(): number{
            var client:any = RongIMLib.Bridge._client || {};
            var channel = client.channel || {};
            var status = RongIMLib.ConnectionStatus.CONNECTION_CLOSED;
            if (typeof channel.connectionStatus == 'number') {
                status = channel.connectionStatus;
            }
            return status;
        }
        
        getAgoraDynamicKey(engineType: number, channelName: string, callback: ResultCallback<string>) {
            var modules = new RongIMClient.Protobuf.VoipDynamicInput();
            modules.setEngineType(engineType);
            modules.setChannelName(channelName);
            RongIMClient.bridge.queryMsg(32, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function(result: any){
                    setTimeout(function(){
                        callback.onSuccess(result);
                    });
                },
                onError: function(errorCode: ErrorCode){
                    setTimeout(function(){
                        callback.onError(errorCode);
                    });
                }
            }, "VoipDynamicOutput");
        }

        setDeviceInfo(deviceId: string):void{
        
        }

        setEnvironment(isPrivate: boolean):void{
        
        }
        
        getPublicServiceProfile(publicServiceType: ConversationType, publicServiceId: string, callback: ResultCallback<PublicServiceProfile>) {
            var profile: PublicServiceProfile = RongIMClient._memoryStore.publicServiceMap.get(publicServiceType, publicServiceId);
            setTimeout(function(){
                callback.onSuccess(profile);
            });
        }

        getRemotePublicServiceList(callback?: ResultCallback<PublicServiceProfile[]>, pullMessageTime?: any) {
            if (RongIMClient._memoryStore.depend.openMp) {
                var modules = new RongIMClient.Protobuf.PullMpInput(), self = this;
                if (!pullMessageTime) {
                    modules.setTime(0);
                } else {
                    modules.setTime(pullMessageTime);
                }
                modules.setMpid("");
                RongIMClient.bridge.queryMsg(28, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                    onSuccess: function(data: Array<PublicServiceProfile>) {
                        //TODO 找出最大时间
                        // self.lastReadTime.set(conversationType + targetId, MessageUtil.int64ToTimestamp(data.syncTime));
                        RongIMClient._memoryStore.publicServiceMap.publicServiceList.length = 0;
                        RongIMClient._memoryStore.publicServiceMap.publicServiceList = data;
                        setTimeout(function(){
                            callback && callback.onSuccess(data);
                        });
                    },
                    onError: function(errorCode: ErrorCode) { 
                        setTimeout(function(){
                            callback && callback.onError(errorCode);
                        });
                    }
                }, "PullMpOutput");
            }
        }

    }
}
