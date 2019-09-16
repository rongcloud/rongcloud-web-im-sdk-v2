module RongIMLib {
    export class VCDataProvider implements DataAccessProvider {

        // C++ 需要的 SDK 版本号
        version: string = '2.8.27';

        addon: Addon;

        messageListener: OnReceiveMessageListener;

        connectListener: ConnectionStatusListener;

        userId: string = "";

        connectCallback: ConnectCallback;

        useConsole: boolean = false;

        appKey: string = "";

        token: string = "";

        constructor(addon: any) {
            this.addon = addon;
        }

        init(appKey: string, config?: any): void {
            this.appKey = appKey;
            this.useConsole && console.log("init");

            config = config || {};
            config.version = this.version;
            var sdkInfo = this.addon.initWithAppkey(appKey, config.dbPath, config);
            if (sdkInfo) {
                sdkInfo = JSON.parse(sdkInfo);
            }
            // 0 不存不计数  1 只存不计数 3 存且计数
            this.addon.registerMessageType("RC:VcMsg", 3);
            this.addon.registerMessageType("RC:ImgTextMsg", 3);
            this.addon.registerMessageType("RC:FileMsg", 3);
            this.addon.registerMessageType("RC:LBSMsg", 3);
            this.addon.registerMessageType("RC:PSImgTxtMsg", 3);
            this.addon.registerMessageType("RC:PSMultiImgTxtMsg", 3);
            this.addon.registerMessageType("RCJrmf:RpMsg", 3);
            this.addon.registerMessageType("RCJrmf:RpOpendMsg", 1);
            this.addon.registerMessageType("RC:GrpNtf", 1);
            this.addon.registerMessageType("RC:DizNtf", 0);

            this.addon.registerMessageType("RC:InfoNtf", 0);
            this.addon.registerMessageType("RC:ContactNtf", 0);
            this.addon.registerMessageType("RC:ProfileNtf", 0);
            this.addon.registerMessageType("RC:CmdNtf", 0);
            this.addon.registerMessageType("RC:CmdMsg", 0);
            this.addon.registerMessageType("RC:TypSts", 0);
            this.addon.registerMessageType("RC:CsChaR", 0);
            this.addon.registerMessageType("RC:CsHsR", 0);
            this.addon.registerMessageType("RC:CsEnd", 0);
            this.addon.registerMessageType("RC:CsSp", 0);
            this.addon.registerMessageType("RC:CsUpdate", 0);
            this.addon.registerMessageType("RC:CsContact", 0);
            this.addon.registerMessageType("RC:ReadNtf", 0);
            this.addon.registerMessageType("RC:VCAccept", 0);
            this.addon.registerMessageType("RC:VCRinging", 0);
            this.addon.registerMessageType("RC:VCSummary", 0);
            this.addon.registerMessageType("RC:VCHangup", 0);
            this.addon.registerMessageType("RC:VCInvite", 0);
            this.addon.registerMessageType("RC:VCModifyMedia", 0);
            this.addon.registerMessageType("RC:VCModifyMem", 0);
            this.addon.registerMessageType("RC:PSCmd", 0);
            this.addon.registerMessageType("RC:RcCmd", 0);
            this.addon.registerMessageType("RC:SRSMsg", 0);
            this.addon.registerMessageType("RC:RRReqMsg", 0);
            this.addon.registerMessageType("RC:RRRspMsg", 0);
            return sdkInfo;
        }

        connect(token: string, callback: ConnectCallback, userId?: string, serverConf?: any): void {
            this.useConsole && console.log("connect");
            this.userId = userId;
            this.connectCallback = callback;
            RongIMLib.Bridge._client = <any>{
                userId: userId
            };
            serverConf = serverConf || {};
            var openmp: boolean = !!serverConf.openMp;
            var openus: boolean = !!serverConf.openUS;
            if (serverConf.type) {
                this.addon.setEnvironment(true);
            }
            this.addon.connectWithToken(token, userId, serverConf.serverList, openmp, openus);
        }

        setServerInfo(info: any): void {
            'setServerInfo' in this.addon && this.addon.setServerInfo(info.navi);
        }

        logout(): void {
            this.useConsole && console.log("logout");
            this.disconnect();
        }

        disconnect(): void {
            this.useConsole && console.log("disconnect");
            this.addon.disconnect(true);
        }

        clearListeners(): void {
            this.addon.setOnReceiveStatusListener();
            this.addon.setConnectionStatusListener();
            this.addon.setOnReceiveMessageListener();
        }

        clearData(): boolean {
            this.useConsole && console.log("clearData");
            return this.addon.clearData();
        }

        setConnectionStatusListener(listener: ConnectionStatusListener): void {
            var me = this;
            /**
            ConnectionStatus_TokenIncorrect = 31004,
            ConnectionStatus_Connected = 0,
            ConnectionStatus_KickedOff = 6,	// 其他设备登录
            ConnectionStatus_Connecting = 10,// 连接中
            ConnectionStatus_SignUp = 12, // 未登录
            ConnectionStatus_NetworkUnavailable = 1, // 连接断开
            ConnectionStatus_ServerInvalid = 8, // 断开
            ConnectionStatus_ValidateFailure = 9,//断开
            ConnectionStatus_Unconnected = 11,//断开
            ConnectionStatus_DisconnExecption = 31011 //断开
            RC_NAVI_MALLOC_ERROR   = 30000,//断开
            RC_NAVI_NET_UNAVAILABLE= 30002,//断开
            RC_NAVI_SEND_FAIL      = 30004,//断开
            RC_NAVI_REQ_TIMEOUT    = 30005,//断开
            RC_NAVI_RECV_FAIL      = 30006,//断开
            RC_NAVI_RESOURCE_ERROR = 30007,//断开
            RC_NAVI_NODE_NOT_FOUND = 30008,//断开
            RC_NAVI_DNS_ERROR      = 30009,//断开
            */

            me.connectListener = listener;
            this.useConsole && console.log("setConnectionStatusListener");
            me.addon && me.addon.setConnectionStatusListener(function (result: any): void {
                switch (result) {
                    case 10:
                        setTimeout(function () {
                            listener.onChanged(ConnectionStatus.CONNECTING);
                        });
                        break;
                    case 31004:
                        setTimeout(function () {
                            me.connectCallback.onTokenIncorrect();
                        });
                        break;
                    case 1:
                    case 8:
                    case 9:
                    case 11:
                    case 12:
                    case 31011:
                    case 30000:
                    case 30002:
                        setTimeout(function () {
                            listener.onChanged(ConnectionStatus.DISCONNECTED);
                        });
                        break;
                    case 0:
                    case 33005:
                        setTimeout(function () {
                            me.connectCallback.onSuccess(me.userId);
                            listener.onChanged(ConnectionStatus.CONNECTED);
                        });
                        break;
                    case 6:
                        setTimeout(function () {
                            listener.onChanged(ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT);
                        });
                        break;
                    default:
                        setTimeout(function () {
                            listener.onChanged(result);
                        });
                        break;
                }
            });
        }

        setOnReceiveMessageListener(listener: OnReceiveMessageListener): void {
            var me = this, localCount = 0;
            me.messageListener = listener;
            this.useConsole && console.log("setOnReceiveMessageListener");
            me.addon && me.addon.setOnReceiveMessageListener(function (result: string, leftCount: number, offline: boolean, hasMore: boolean): void {
                var message: Message = me.buildMessage(result);
                message.offLineMessage = offline;
                setTimeout(function () {
                    var voipMsgTypes = ['AcceptMessage', 'RingingMessage', 'HungupMessage', 'InviteMessage', 'MediaModifyMessage', 'MemberModifyMessage'];
                    var isVoIPMsg = voipMsgTypes.indexOf(message.messageType) > -1;
                    if (isVoIPMsg) {
                        RongIMClient._voipProvider && RongIMClient._voipProvider.onReceived(message);
                    } else if (message.conversationType == 12) {
                        RongIMClient.RTCListener(message);
                        RongIMClient.RTCInnerListener(message);
                        RongIMClient.RTCSignalLisener(message);
                    } else {
                        listener.onReceived(message, leftCount, hasMore);
                    }
                });
            });
        }



        sendTypingStatusMessage(conversationType: ConversationType, targetId: string, messageName: string, sendCallback: SendMessageCallback): void {
            var me = this;
            this.useConsole && console.log("sendTypingStatusMessage");
            if (messageName in RongIMClient.MessageParams) {
                me.sendMessage(conversationType, targetId, TypingStatusMessage.obtain(RongIMClient.MessageParams[messageName].objectName, ""), {
                    onSuccess: function () {
                        setTimeout(function () {
                            sendCallback.onSuccess();
                        });
                    },
                    onError: function (errorCode: ErrorCode) {
                        setTimeout(function () {
                            sendCallback.onError(errorCode, null);
                        });
                    },
                    onBefore: function () { }
                });
            }
        }

        setMessageStatus(conversationType: ConversationType, targetId: string, timestamp: number, status: string, callback: ResultCallback<Boolean>): void {
            this.addon.updateMessageReceiptStatus(conversationType, targetId, timestamp);
            callback.onSuccess(true);
        }

        sendTextMessage(conversationType: ConversationType, targetId: string, content: string, sendMessageCallback: SendMessageCallback): void {
            var msgContent = TextMessage.obtain(content);
            this.useConsole && console.log("sendTextMessage");
            this.sendMessage(conversationType, targetId, msgContent, sendMessageCallback);
        }

        getRemoteHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback, config?: any): void {
            try {
                var me = this;
                me.useConsole && console.log("getRemoteHistoryMessages");
                me.addon.getRemoteHistoryMessages(conversationType, targetId, timestamp ? timestamp : 0, count, function (ret: string, hasMore: number) {
                    var list: any[] = ret ? JSON.parse(ret).list : [], msgs: Message[] = [];
                    list.reverse();
                    for (var i = 0, len = list.length; i < len; i++) {
                        var message = me.buildMessage(list[i].obj);
                        message.sentStatus = RongIMLib.SentStatus.READ;
                        msgs[i] = message;
                    }
                    callback.onSuccess(msgs, hasMore ? true : false);
                }, function (errorCode: ErrorCode) {
                    callback.onError(errorCode);
                });
            } catch (e) {
                callback.onError(e);
            }
        }

        getRemoteConversationList(callback: ResultCallback<Conversation[]>, conversationTypes: ConversationType[], count: number, isGetHiddenConvers: boolean): void {
            try {
                this.useConsole && console.log("getRemoteConversationList");
                var converTypes: number[] = conversationTypes || [1, 2, 3, 4, 5, 6, 7, 8];
                var result: string = this.addon.getConversationList(converTypes);
                var list: any[] = JSON.parse(result).list, convers: Conversation[] = [], me = this, index: number = 0;
                list.reverse();
                isGetHiddenConvers = typeof isGetHiddenConvers === 'boolean' ? isGetHiddenConvers : false;
                for (let i = 0, len = list.length; i < len; i++) {
                    var tmpObj = list[i].obj, obj: any = JSON.parse(tmpObj);
                    if (obj != "") {
                        if (obj.isHidden == 1 && isGetHiddenConvers) {
                            continue;
                        }
                        convers[index] = me.buildConversation(tmpObj);
                        index++;
                    }
                }
                convers.reverse();
                var len = convers.length;
                count = count || len;
                if (len > count) {
                    convers.length = count;
                }
                callback.onSuccess(convers);
            } catch (e) {
                callback.onError(e);
            }
        }

        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void {
            try {
                this.useConsole && console.log("removeConversation");
                this.addon.removeConversation(conversationType, targetId);
                var conversations = RongIMClient._memoryStore.conversationList
                var len = conversations.length;
                for (var i = 0; i < len; i++) {
                    if (conversations[i].conversationType == conversationType && targetId == conversations[i].targetId) {
                        conversations.splice(i, 1);
                        break;
                    }
                }
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(e);
            }
        }

        joinChatRoom(chatRoomId: string, messageCount: number, callback: OperationCallback): void {
            this.useConsole && console.log("joinChatRoom");
            this.addon.joinChatRoom(chatRoomId, messageCount,
                function () {
                    callback.onSuccess();
                },
                function (error: ErrorCode) {
                    callback.onError(error);
                });
        }

        quitChatRoom(chatRoomId: string, callback: OperationCallback): void {
            this.useConsole && console.log("quitChatRoom");
            this.addon.quitChatRoom(chatRoomId,
                function () {
                    callback.onSuccess();
                },
                function (error: ErrorCode) {
                    callback.onError(error);
                });
        }

        addToBlacklist(userId: string, callback: OperationCallback): void {
            this.useConsole && console.log("addToBlacklist");
            this.addon.addToBlacklist(userId,
                function () {
                    callback.onSuccess();
                },
                function (error: ErrorCode) {
                    callback.onError(error);
                });

        }

        getBlacklist(callback: GetBlacklistCallback): void {
            this.useConsole && console.log("getBlacklist");
            this.addon.getBlacklist(
                function (blacklistors: string[]) {
                    callback.onSuccess(blacklistors);
                },
                function (error: ErrorCode) {
                    callback.onError(error);
                });
        }

        getBlacklistStatus(userId: string, callback: ResultCallback<string>): void {
            this.useConsole && console.log("getBlacklistStatus");
            this.addon.getBlacklistStatus(userId,
                function (result: string) {
                    callback.onSuccess(result);
                },
                function (error: ErrorCode) {
                    callback.onError(error);
                });
        }

        removeFromBlacklist(userId: string, callback: OperationCallback): void {
            this.useConsole && console.log("removeFromBlacklist");
            this.addon.removeFromBlacklist(userId,
                function () {
                    callback.onSuccess();
                },
                function (error: ErrorCode) {
                    callback.onError(error);
                });
        }


        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback, mentiondMsg?: boolean, pushText?: string, appData?: string, methodType?: number, params?: any): void {
            var me = this, users: string[] = [];
            me.useConsole && console.log("sendMessage");

            params = params || {};

            var isGroup = (conversationType == ConversationType.DISCUSSION || conversationType == ConversationType.GROUP);

            if (isGroup && messageContent.messageName == RongIMClient.MessageType["ReadReceiptResponseMessage"]) {
                users = [];
                var rspMsg: ReadReceiptResponseMessage = <ReadReceiptResponseMessage>messageContent;
                if (rspMsg.receiptMessageDic) {
                    var ids: string[] = [];
                    for (var key in rspMsg.receiptMessageDic) {
                        ids.push(key);
                    }
                    users = ids;
                }
            }

            if (isGroup && messageContent.messageName == RongIMClient.MessageType["SyncReadStatusMessage"]) {
                users = [];
                users.push(me.userId);
            }

            var userIds = params.userIds;
            if (isGroup && userIds) {
                users = userIds;
            }
            var msg: string = me.addon.sendMessage(conversationType,
                targetId, RongIMClient.MessageParams[messageContent.messageName].objectName, messageContent.encode(), pushText || "", appData || "", function (progress: any) {
                },
                function (message: string, code: number) {
                    var msg = me.buildMessage(message)
                    var errorCode = ErrorCode.SENSITIVE_REPLACE;
                    if (code == errorCode) {
                        return sendCallback.onError(errorCode, msg);
                    }
                    sendCallback.onSuccess(msg);
                },
                function (message: string, code: ErrorCode) {
                    sendCallback.onError(code, me.buildMessage(message));
                }, users, mentiondMsg);
            var tempMessage: any = JSON.parse(msg);
            sendCallback.onBefore && sendCallback.onBefore(tempMessage.messageId);
            RongIMLib.MessageIdHandler.messageId = tempMessage.messageId;
        }

        registerMessageType(messageType: string, objectName: string, messageTag: MessageTag, messageContent: any, searchProps: string[]): void {
            this.useConsole && console.log("registerMessageType");
            this.addon.registerMessageType(objectName, messageTag.getMessageTag(), searchProps);
            var regMsg = RongIMLib.ModelUtil.modleCreate(messageContent, messageType);
            RongIMLib.RongIMClient.RegisterMessage[messageType] = regMsg;
            RongIMClient.RegisterMessage[messageType].messageName = messageType;
            registerMessageTypeMapping[objectName] = messageType;
            RongIMClient.MessageType[messageType] = messageType;
            RongIMClient.MessageParams[messageType] = { objectName: objectName, msgTag: messageTag };
            typeMapping[objectName] = messageType;
        }

        registerMessageTypes(messages: any): void {
            var types: any = [];

            var getProtos = function (proto: any) {
                var protos: any = [];
                for (var p in proto) {
                    protos.push(p);
                }
                return protos;
            };
            //转换消息为自定义消息参数格式
            for (var name in messages) {
                var message = messages[name];

                var proto = message.proto;
                var protos = getProtos(proto);

                var flag = message.flag || 3;
                var tag = MessageTag.getTagByStatus(flag);
                flag = new RongIMLib.MessageTag(tag.isCounted, tag.isPersited);
                types.push({
                    type: name,
                    name: message.name,
                    flag: flag,
                    protos: protos
                });
            }

            var register = function (message: any) {
                var type = message.type;
                var name = message.name;
                var flag = message.flag;
                var protos = message.protos;
                RongIMClient.registerMessageType(type, name, flag, protos);
            };
            for (var i = 0, len = types.length; i < len; i++) {
                var message: any = types[i];
                register(message);
            }
        }

        addMessage(conversationType: ConversationType, targetId: string, message: any, callback?: ResultCallback<Message>): void {
            this.useConsole && console.log("addMessage");
            var direction = message.direction;
            var msg: string = this.addon.insertMessage(conversationType, targetId, message.senderUserId, message.objectName, JSON.stringify(message.content),
                function () {
                    callback.onSuccess(me.buildMessage(msg));
                },
                function () {
                    callback.onError(ErrorCode.MSG_INSERT_ERROR);
                }, direction), me = this;
        }

        removeMessage(conversationType: ConversationType, targetId: string, delMsgs: DeleteMessage[], callback: ResultCallback<boolean>): void {

        }

        removeLocalMessage(conversationType: ConversationType, targetId: string, timestamps: number[], callback: ResultCallback<boolean>): void {
            try {
                this.useConsole && console.log("removeLocalMessage");
                this.addon.deleteMessages(timestamps);
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(e);
            }
        }

        getMessage(messageId: string, callback: ResultCallback<Message>): void {
            try {
                this.useConsole && console.log("getMessage");
                var msg: Message = this.buildMessage(<string>this.addon.getMessage(messageId));
                callback.onSuccess(msg);
            } catch (e) {
                callback.onError(e);
            }
        }

        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void {
            try {
                this.useConsole && console.log("clearMessages");
                this.addon.clearMessages(conversationType, targetId);
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(e);
            }
        }

        // Web 端接口，桌面版无需实现
        setUnreadCount(conversationType: ConversationType, targetId: string, count: number) {

        }

        getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>): any {
            try {
                this.useConsole && console.log("getConversation");
                var ret: string = this.addon.getConversation(conversationType, targetId);
                callback.onSuccess(this.buildConversation(ret));
            } catch (e) {
                callback.onError(e);
            }
        }

        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[], count?: number, isGetHiddenConvers?: boolean): void {
            this.useConsole && console.log("getConversationList");
            this.getRemoteConversationList(callback, conversationTypes, count, isGetHiddenConvers);
        }

        clearCache() {
            var memoryStore = RongIMClient._memoryStore || {};
            memoryStore.conversationList = [];
            memoryStore.isSyncRemoteConverList;
        }

        clearConversations(conversationTypes: ConversationType[], callback: ResultCallback<boolean>): void {
            try {
                this.useConsole && console.log("clearConversations");
                this.addon.clearConversations();
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(e);
            }
        }

        setMessageContent(messageId: number, content: any, objectName: string): void {
            content = JSON.stringify(content);
            this.addon.setMessageContent(messageId, content, objectName);
        }

        setMessageSearchField(messageId: number, content: any, searchFiles: string): void {
            content = JSON.stringify(content);
            this.addon.setMessageContent(messageId, content, searchFiles);
        }

        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback, objectname?: string, direction?: boolean): void {
            this.useConsole && console.log("getHistoryMessages");
            if (count <= 0) {
                callback.onError(ErrorCode.TIMEOUT);
                return;
            }
            objectname = objectname || '';
            direction = typeof direction == 'undefined' || direction;
            try {
                var ret: string = this.addon.getHistoryMessages(conversationType, targetId, timestamp ? timestamp : 0, count, objectname, direction);
                var list: any[] = ret ? JSON.parse(ret).list : [], msgs: Message[] = [], me = this;
                list.reverse();
                for (var i = 0, len = list.length; i < len; i++) {
                    var message = me.buildMessage(list[i].obj);
                    msgs[i] = message;
                }
                callback.onSuccess(msgs, len == count);
            } catch (e) {
                callback.onError(e);
            }
        }

        clearRemoteHistoryMessages(params: any, callback: ResultCallback<boolean>): void {
            var conversationType = params.conversationType;
            var targetId = params.targetId;
            var timestamp = params.timestamp;
            var _topic: { [s: string]: any } = {
                1: true,
                2: true,
                3: true,
                5: true,
                6: true
            };
            var topic = _topic[conversationType];
            if (!topic) {
                callback.onError(ErrorCode.CLEAR_HIS_TYPE_ERROR);
                return;
            }

            if (typeof timestamp != 'number') {
                callback.onError(ErrorCode.CLEAR_HIS_TIME_ERROR);
                return;
            }

            this.addon.clearRemoteHistoryMessages(+conversationType, targetId, timestamp, function () {
                callback.onSuccess(true);
            }, function (errorCode: any) {
                if (errorCode == 1) {
                    // 没有开通历史消息云存储
                    errorCode = ErrorCode.CLEAR_HIS_ERROR;
                }
                callback.onError(errorCode);
            });
        }

        clearHistoryMessages(params: any, callback: ResultCallback<boolean>): void {
            var conversationType = +params.conversationType;
            var targetId = params.targetId;
            try {
                this.addon.clearMessages(conversationType, targetId);
                var isSuccess = true;
                callback.onSuccess(isSuccess);
            } catch (e) {
                console.log(e);
                callback.onError(ErrorCode.CLEAR_HIS_ERROR);
            }
        }


        getTotalUnreadCount(callback: ResultCallback<number>, conversationTypes?: number[]): void {
            try {
                var result: number;
                this.useConsole && console.log("getTotalUnreadCount");
                if (conversationTypes) {
                    result = this.addon.getTotalUnreadCount(conversationTypes);
                } else {
                    result = this.addon.getTotalUnreadCount();
                }
                callback.onSuccess(result);
            } catch (e) {
                callback.onError(e);
            }
        }

        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>): void {
            this.useConsole && console.log("getConversationUnreadCount");
            this.getTotalUnreadCount(callback, conversationTypes);
        }

        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>): void {
            try {
                this.useConsole && console.log("getUnreadCount");
                var result: number = this.addon.getUnreadCount(conversationType, targetId);
                callback.onSuccess(result);
            } catch (e) {
                callback.onError(e);
            }
        }

        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void {
            try {
                this.useConsole && console.log("clearUnreadCount");
                var result = this.addon.clearUnreadCount(conversationType, targetId);
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(e);
            }
        }

        clearTotalUnreadCount(callback: ResultCallback<boolean>): void {
            this.useConsole && console.log("clearTotalUnreadCount");
        }

        clearUnreadCountByTimestamp(conversationType: ConversationType, targetId: string, timestamp: number, callback: ResultCallback<boolean>): void {
            try {
                this.useConsole && console.log("clearUnreadCountByTimestamp");
                var result = this.addon.clearUnreadCountByTimestamp(conversationType, targetId, timestamp);
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(e);
            }
        }

        setConversationToTop(conversationType: ConversationType, targetId: string, isTop: boolean, callback: ResultCallback<boolean>): void {
            try {
                this.useConsole && console.log("setConversationToTop");
                this.addon.setConversationToTop(conversationType, targetId, isTop);
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(e);
            }
        }

        setConversationHidden(conversationType: ConversationType, targetId: string, isHidden: boolean): void {
            this.addon.setConversationHidden(conversationType, targetId, isHidden);
        }

        setMessageReceivedStatus(messageId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>): void {
            try {
                this.useConsole && console.log("setMessageReceivedStatus");
                this.addon.setMessageReceivedStatus(messageId, receivedStatus);
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(e);
            }
        }

        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>): void {
            try {
                this.useConsole && console.log("setMessageSentStatus");
                this.addon.setMessageSentStatus(messageId, sentStatus);
                callback.onSuccess(true);
            } catch (e) {
                callback.onError(e);
            }
        }

        getFileToken(fileType: FileType, callback: ResultCallback<any>): void {
            this.useConsole && console.log("getFileToken");
            this.addon.getUploadToken(fileType, function (token: string) {
                callback.onSuccess({ token: token });
            },
                function (errorCode: ErrorCode) {
                    callback.onError(errorCode);
                }
            );
        }

        getFileUrl(fileType: FileType, fileName: string, oriName: string, callback: ResultCallback<any>): void {
            this.useConsole && console.log("getFileUrl");
            this.addon.getDownloadUrl(fileType, fileName, oriName,
                function (url: string) {
                    callback.onSuccess({ downloadUrl: url });
                },
                function (errorCode: ErrorCode) {
                    callback.onError(errorCode);
                }
            );
        }

        searchConversationByContent(keyword: string, callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[]): void {
            var converTypes: ConversationType[] = [];
            if (typeof conversationTypes == 'undefined') {
                converTypes = [1, 2, 3, 4, 5, 6, 7];
            } else {
                converTypes = conversationTypes;
            }
            try {
                this.useConsole && console.log("searchConversationByContent");
                var result: string = this.addon.searchConversationByContent(converTypes, keyword);
                var list: any[] = JSON.parse(result).list, convers: Conversation[] = [], me = this;
                list.reverse();
                for (let i = 0, len = list.length; i < len; i++) {
                    convers[i] = me.buildConversation(list[i].obj);
                }
                callback.onSuccess(convers);
            } catch (e) {
                callback.onError(e);
            }
        }

        searchMessageByContent(conversationType: ConversationType, targetId: string, keyword: string, timestamp: number, count: number, total: number, callback: ResultCallback<Message[]>): void {
            var me = this
            try {
                this.useConsole && console.log("searchMessageByContent");
                this.addon.searchMessageByContent(conversationType, targetId, keyword, timestamp, count, total, function (ret: string, matched: number) {
                    var list: any[] = ret ? JSON.parse(ret).list : [], msgs: Message[] = [];
                    list.reverse();
                    for (let i = 0, len = list.length; i < len; i++) {
                        msgs[i] = me.buildMessage(list[i].obj);
                    }
                    callback.onSuccess(msgs, matched);
                });

            } catch (e) {
                callback.onError(e);
            }

        }

        getChatRoomInfo(chatRoomId: string, count: number, order: GetChatRoomType, callback: ResultCallback<any>): void {
            this.useConsole && console.log("getChatRoomInfo");
            this.addon.getChatroomInfo(chatRoomId, count, order, function (ret: string, count: number) {
                var list: any[] = ret ? JSON.parse(ret).list : [], chatRoomInfo: any = { userInfos: [], userTotalNums: count };
                if (list.length > 0) {
                    for (let i = 0, len = list.length; i < len; i++) {
                        chatRoomInfo.userInfos.push(JSON.parse(list[i].obj));
                    }
                }
                callback.onSuccess(chatRoomInfo);
            }, function (errcode: ErrorCode) {
                callback.onError(errcode);
            });
        }

        setChatroomHisMessageTimestamp(chatRoomId: string, timestamp: number): void {

        }

        getChatRoomHistoryMessages(chatRoomId: string, count: number, order: number, callback: ResultCallback<Message>): void {

        }

        getDelaTime(): number {
            return this.addon.getDeltaTime();
        }

        getUserStatus(userId: string, callback: ResultCallback<UserStatus>): void {
            var me = this;
            this.addon.getUserStatus(userId, function (status: string) {
                var entity = RongInnerTools.convertUserStatus({
                    status: status,
                    userId: ''
                });
                callback.onSuccess(entity);
            }, function (code: ErrorCode) {
                callback.onError(code);
            });
        }

        setUserStatus(status: number, callback: ResultCallback<boolean>): void {
            this.addon.setUserStatus(status, function () {
                callback.onSuccess(true);
            }, function (code: ErrorCode) {
                callback.onError(code);
            });
        }

        subscribeUserStatus(userIds: string[], callback: ResultCallback<boolean>): void {
            this.addon.subscribeUserStatus(userIds, function () {
                callback && callback.onSuccess(true);
            }, function (code: ErrorCode) {
                callback && callback.onError(code);
            });
        }

        setUserStatusListener(params: any, callback: Function): void {
            var me = this;
            this.addon.setOnReceiveStatusListener(function (userId: string, status: string) {
                var entity = RongInnerTools.convertUserStatus({
                    userId: userId,
                    status: status
                });
                RongIMClient.userStatusObserver.notify({
                    key: userId,
                    entity: entity
                });
            });
            var userIds = params.userIds || [];
            if (userIds.length) {
                RongIMClient._dataAccessProvider.subscribeUserStatus(userIds);
            }
        }

        getUnreadMentionedMessages(conversationType: ConversationType, targetId: string): any {
            var me = this;
            var mentions = JSON.parse(me.addon.getUnreadMentionedMessages(conversationType, targetId)).list;
            for (var i = 0, len = mentions.length; i < len; i++) {
                var temp = JSON.parse(mentions[i].obj);
                temp.content = JSON.parse(temp.content);
                mentions[i] = temp;
            }
            return mentions;
        }

        hasRemoteUnreadMessages(token: string, callback: ResultCallback<Boolean>): void {
            callback.onSuccess(false);
        }

        sendRecallMessage(content: any, sendMessageCallback: SendMessageCallback): void {
            var me = this;
            me.addon.recallMessage("RC:RcCmd", JSON.stringify(content), content.push || "",
                function () {
                    content.objectName = 'RC:RcCmd';
                    sendMessageCallback.onSuccess(me.buildMessage(JSON.stringify(content)));
                },
                function (errorCode: any) {
                    sendMessageCallback.onError(errorCode);
                });
        }

        updateMessage(message: Message, callback?: ResultCallback<Message>): void { }

        updateMessages(conversationType: ConversationType, targetId: string, key: string, value: any, callback: ResultCallback<boolean>): void { }

        reconnect(callback: ConnectCallback): void { }

        sendReceiptResponse(conversationType: ConversationType, targetId: string, sendCallback: SendMessageCallback): void { }

        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>): void { }

        addMemberToDiscussion(discussionId: string, userIdList: string[], callback: OperationCallback): void { }

        createDiscussion(name: string, userIdList: string[], callback: CreateDiscussionCallback): void { }

        getDiscussion(discussionId: string, callback: ResultCallback<Discussion>): void { }

        quitDiscussion(discussionId: string, callback: OperationCallback): void { }

        removeMemberFromDiscussion(discussionId: string, userId: string, callback: OperationCallback): void { }

        setDiscussionInviteStatus(discussionId: string, status: DiscussionInviteStatus, callback: OperationCallback): void { }

        setDiscussionName(discussionId: string, name: string, callback: OperationCallback): void { }

        setEnvironment(isPrivate: boolean): void {
            this.addon.setEnvironment(isPrivate);
        }

        addConversation(conversation: Conversation, callback: ResultCallback<boolean>): void { }

        updateConversation(conversation: Conversation): Conversation {
            return null;
        }

        getConversationNotificationStatus(params: any, callback: any): void {
            var conversationType = params.conversationType;
            var targetId = params.targetId;

            var notification = RongIMClient._memoryStore.notification;
            var key = conversationType + '_' + targetId;

            var status = notification[key];
            if (typeof status == 'number') {
                callback.onSuccess(status);
                return;
            }

            this.addon.getConversationNotificationStatus(conversationType, targetId, function (status: any) {
                notification[key] = status;
                callback.onSuccess(status);
            },
                function (error: any) {
                    callback.onError(error);
                });
        }

        setConversationNotificationStatus(params: any, callback: any): void {
            var conversationType = params.conversationType;
            var targetId = params.targetId;
            var status = params.status;

            var notification = RongIMClient._memoryStore.notification;
            var key = conversationType + '_' + targetId;

            notification[key] = status;

            var notify: boolean = !!status;

            this.addon.setConversationNotificationStatus(conversationType, targetId, notify, function () {
                callback.onSuccess(status);
            },
                function (error: any) {
                    callback.onError(error);
                });
        }

        getCurrentConnectionStatus(): number {
            return this.addon.getConnectionStatus();
        }

        getAgoraDynamicKey(engineType: number, channelName: string, callback: ResultCallback<string>) {
            var extra = "";
            this.addon.getVoIPKey(engineType, channelName, extra,
                function (token: string) {
                    callback.onSuccess(token);
                },
                function (errorCode: any) {
                    callback.onError(errorCode);
                });
        }

        getPublicServiceProfile(publicServiceType: ConversationType, publicServiceId: string, callback: ResultCallback<PublicServiceProfile>) {
            var profile = RongIMClient._memoryStore.publicServiceMap.get(publicServiceType, publicServiceId);
            callback.onSuccess(profile);
        }

        setDeviceInfo(device: any): void {
            var id = device.id || '';
            this.addon.setDeviceId(id);
        }

        getRemotePublicServiceList(callback?: ResultCallback<PublicServiceProfile[]>, pullMessageTime?: any) {
            var publicList: any[] = [];
            var ret = this.addon.getAccounts();
            var transformProto = function (ret: any) {
                var result: { [key: string]: any } = {
                    hasFollowed: false,
                    isGlobal: false,
                    menu: null
                };
                if (!ret.obj) {
                    var error = { error: ret }
                    throw new Error('公众账号数据格式错误: ' + JSON.stringify(error));
                }
                var obj = JSON.parse(ret.obj);
                var protoMap: { [key: string]: any } = {
                    aType: 'conversationType',
                    aId: 'publicServiceId',
                    aName: 'introduction',
                    aUri: 'portraitUri',
                    follow: 'hasFollowed',
                    isGlobal: 'isGlobal'
                };
                for (var key in obj) {
                    var val = obj[key];
                    if (key == 'aExtra') {
                        var extra = JSON.parse(val);
                        result["hasFollowed"] = extra.follow;
                        result["isGlobal"] = extra.isGlobal;
                        result["menu"] = extra.menu;
                    }
                    var uId = protoMap[key];
                    if (uId) {
                        result[uId] = val;
                    }
                }
                return result;
            };
            if (ret) {
                ret = JSON.parse(ret);
                var list = ret.list;
                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i];
                    item = transformProto(item);
                    publicList.push(item);
                }
            }
            if (publicList.length > 0) {
                RongIMClient._memoryStore.publicServiceMap.publicServiceList.length = 0;
                RongIMClient._memoryStore.publicServiceMap.publicServiceList = publicList;
            }
            callback.onSuccess(RongIMClient._memoryStore.publicServiceMap.publicServiceList);
        }

        private buildMessage(result: string): Message {
            var message: Message = new Message(), ret: any = JSON.parse(result);
            message.conversationType = ret.conversationType;
            message.targetId = ret.targetId;
            message.messageDirection = ret.direction;
            message.senderUserId = ret.senderUserId;
            if (ret.direction == MessageDirection.RECEIVE) {
                message.receivedStatus = ret.status;
            } else if (ret.direction == MessageDirection.SEND) {
                message.sentStatus = ret.status;
            }
            message.sentTime = ret.sentTime;
            message.objectName = ret.objectName;
            var content = ret.content ? JSON.parse(ret.content) : ret.content;
            var messageType = typeMapping[ret.objectName] || registerMessageTypeMapping[ret.objectName];
            if (content) {
                content.messageName = messageType;
            }
            message.content = content;
            message.messageId = ret.messageId;
            message.messageUId = ret.messageUid;
            message.messageType = messageType;
            return message;
        }

        private buildConversation(val: string): Conversation {
            if (val === '') {
                return null;
            }
            var conver: Conversation = new Conversation(),
                c: any = JSON.parse(val),
                lastestMsg: any = c.lastestMsg ? this.buildMessage(c.lastestMsg) : {};
            conver.conversationTitle = c.title;
            conver.conversationType = c.conversationType;
            conver.draft = c.draft;
            conver.isTop = c.isTop;
            conver.isHidden = c.isHidden;
            lastestMsg.conversationType = c.conversationType;
            lastestMsg.targetId = c.targetId;
            conver.latestMessage = lastestMsg;
            conver.latestMessageId = lastestMsg.messageId;
            conver.latestMessage.messageType = typeMapping[lastestMsg.objectName] || registerMessageTypeMapping[lastestMsg.objectName];
            conver.objectName = lastestMsg.objectName;
            conver.receivedStatus = ReceivedStatus.READ;
            conver.sentTime = lastestMsg.sentTime;
            conver.senderUserId = lastestMsg.senderUserId;
            conver.sentStatus = lastestMsg.status;
            conver.targetId = c.targetId;
            conver.unreadMessageCount = c.unreadCount;
            conver.hasUnreadMention = c.m_hasUnreadMention;
            var mentions = this.getUnreadMentionedMessages(c.conversationType, c.targetId);
            if (mentions.length > 0) {
                // 取最后一条 @ 消息,原因：和 web 互相兼容
                var mention = mentions.pop();
                conver.mentionedMsg = { uid: mention.messageUid, time: mention.sentTime, mentionedInfo: mention.content.mentionedInfo, sendUserId: mention.senderUserId };
            }
            return conver;
        }


        getRTCUserInfoList(room: Room, callback: ResultCallback<any>) {
            this.addon.getRTCUsers(room.id, 1,
                function (result: any) { //第二个参数为空，没有意义
                    callback.onSuccess(result);
                },
                function (error: any) {
                    callback.onError(error);
                });
        }
        getRTCRoomInfo(room: Room, callback: ResultCallback<any>) {
            var order = 2;
            this.addon.getRTCResouce(room.id, order,
                function (result: any) {
                    callback.onSuccess(JSON.parse(result));
                },
                function (error: any) {
                    callback.onError(error);
                });
        }
        joinRTCRoom(room: Room, callback: ResultCallback<any>) {
            var id = room.id;
            var type: number = room.type || 0;
            this.addon.joinRTCRoom(id, type,
                function (result: string, token: string) {
                    var res = JSON.parse(result);
                    var users: { [s: string]: any } = {};
                    var list = res.list;
                    RongUtil.forEach(list, function (item: any) {
                        var userId = item.id;
                        var tmpData: { [s: string]: any } = {};
                        RongUtil.forEach(item.data, function (data: any) {
                            var key = data.key;
                            var value = data.value;
                            tmpData[key] = value;
                        });
                        users[userId] = tmpData;
                    });
                    callback.onSuccess({
                        users: users,
                        token: token
                    });
                },
                function (error: any) {
                    callback.onError(error);
                });
        }

        quitRTCRoom(room: Room, callback: ResultCallback<boolean>) {
            this.addon.exitRTCRoom(room.id,
                function () {
                    callback.onSuccess(true);
                },
                function (error: any) {
                    callback.onError(error);
                });
        }

        RTCPing(room: Room, callback: ResultCallback<boolean>) {
            this.addon.sendRTCPing(room.id,
                function () {
                    callback.onSuccess(true)
                },
                function (error: any) {
                    callback.onError(error);
                });
        }
        setRTCData(roomId: string, key: string, value: string, isInner: boolean, apiType: RTCAPIType, callback: ResultCallback<boolean>, message?: any) {
            var context = this;
            var hanlders: { [s: string]: any } = {
                room_inner: function (roomId: string, key: string, value: string, name: string, content: string, success: Function, error: Function) {
                    context.addon.setRTCInnerData(roomId, RTCAPIType.ROOM, key, value, name, content, success, error);
                },
                room_outer: function (roomId: string, key: string, value: string, name: string, content: string, success: Function, error: Function) {
                    context.addon.setRTCOuterData(roomId, RTCAPIType.ROOM, key, value, name, content, success, error);
                },
                user_inner: function (roomId: string, key: string, value: string, name: string, content: string, success: Function, error: Function) {
                    context.addon.setRTCInnerData(roomId, RTCAPIType.PERSON, key, value, name, content, success, error);
                },
                user_outer: function (roomId: string, key: string, value: string, name: string, content: string, success: Function, error: Function) {
                    context.addon.setRTCOuterData(roomId, RTCAPIType.PERSON, key, value, name, content, success, error);
                }
            };
            var type = RTCAPIType.PERSON == apiType ? 'user' : 'room';
            var direction = isInner ? 'inner' : 'outer';
            var tpl = '{type}_{direction}';
            var name = RongUtil.tplEngine(tpl, {
                type: type,
                direction: direction
            });
            var handler = hanlders[name];
            if (handler) {
                message = message || {};
                var name: string = message.name;
                var content = message.content;
                handler(roomId, key, value, name, content, function () {
                    callback.onSuccess(true);
                }, function (code: any) {
                    callback.onError(code);
                });
            }
        }
        setRTCRoomData(roomId: string, key: string, value: string, isInner: boolean, callback: ResultCallback<boolean>, message?: any) {
            this.setRTCData(roomId, key, value, isInner, RTCAPIType.ROOM, callback, message);
        }
        getRTCData(roomId: string, keys: string[], isInner: boolean, apiType: RTCAPIType, callback: ResultCallback<any>) {
            var context = this;
            var hanlders: { [s: string]: any } = {
                room_inner: function (roomId: string, keys: any, success: Function, error: Function) {
                    context.addon.getRTCInnerData(roomId, RTCAPIType.ROOM, keys, success, error);
                },
                room_outer: function (roomId: string, keys: any, success: Function, error: Function) {
                    context.addon.getRTCOuterData(roomId, RTCAPIType.ROOM, keys, success, error);
                }
            };
            var type = RTCAPIType.PERSON == apiType ? 'user' : 'room';
            var direction = isInner ? 'inner' : 'outer';
            var tpl = '{type}_{direction}';
            var name = RongUtil.tplEngine(tpl, {
                type: type,
                direction: direction
            });
            var handler = hanlders[name];
            if (handler) {
                handler(roomId, keys, function (result: string) {
                    var res = JSON.parse(result);
                    var props: { [s: string]: any } = {};
                    var list = res.list;
                    RongUtil.forEach(list, function (item: any) {
                        props[item.key] = item.value;
                    });
                    callback.onSuccess(props);
                }, function (code: any) {
                    callback.onError(code);
                });
            }
        }
        getRTCRoomData(roomId: string, keys: string[], isInner: boolean, callback: ResultCallback<any>, message?: any) {
            this.getRTCData(roomId, keys, isInner, RTCAPIType.ROOM, callback);
        }
        removeRTCData(roomId: string, keys: string[], isInner: boolean, apiType: RTCAPIType, callback: ResultCallback<boolean>, message?: any){
            var context = this;
            var hanlders: { [s: string]: any } = {
                room_inner: function (roomId: string, keys: string, name: string, content: string, success: Function, error: Function) {
                    context.addon.deleteRTCInnerData(roomId, RTCAPIType.ROOM, keys, name, content, success, error);
                },
                room_outer: function (roomId: string, keys: string, name: string, content: string, success: Function, error: Function) {
                    context.addon.deleteRTCOuterData(roomId, RTCAPIType.ROOM, keys, name, content, success, error);
                },
                user_inner: function (roomId: string, keys: string, name: string, content: string, success: Function, error: Function) {
                    
                },
                user_outer: function (roomId: string, keys: string, name: string, content: string, success: Function, error: Function) {
                    
                }
            };
            var type = RTCAPIType.PERSON == apiType ? 'user' : 'room';
            var direction = isInner ? 'inner' : 'outer';
            var tpl = '{type}_{direction}';
            var name = RongUtil.tplEngine(tpl, {
                type: type,
                direction: direction
            });
            var handler = hanlders[name];
            if (handler) {
                message = message || {};
                var name: string = message.name || '';
                var content = message.content || '';
                handler(roomId, keys, name, content, function () {
                    callback.onSuccess(true);
                }, function (code: any) {
                    callback.onError(code);
                });
            }
        }
        removeRTCRoomData(roomId: string, keys: string[], isInner: boolean, callback: ResultCallback<boolean>, message?: any) {
            this.removeRTCData(roomId, keys, isInner, RTCAPIType.ROOM, callback);
        }
        getNavi() {
            var nav: any = this.addon.getNav();
            return nav[this.userId];
        }
        // 信令 SDK 新增
        setRTCOutData(roomId: string, data: any, type: number, callback: ResultCallback<boolean>, message?: any) {
            
        }
        // 信令 SDK 新增
        getRTCOutData(roomId: string, userId: string[], callback: ResultCallback<any>) {

        }
        setRTCUserInfo(room: Room, info: any, callback: ResultCallback<boolean>) {

        }

        removeRTCUserInfo(room: Room, info: any, callback: ResultCallback<boolean>) {

        }

        getRTCUserList(room: Room, callback: ResultCallback<any>) {

        }

        setRTCRoomInfo(room: Room, data: any, callback: ResultCallback<boolean>) {

        }

        removeRTCRoomInfo(room: Room, data: any, callback: ResultCallback<boolean>) {

        }

        setRTCUserData(roomId: string, key: string, value: string, isInner: boolean, callback: ResultCallback<boolean>, message?: any) {
            this.setRTCData(roomId, key, value, isInner, RTCAPIType.PERSON, callback, message);
        }
        getRTCUserData(roomId: string, key: string[], isInner: boolean, callback: ResultCallback<any>, message?: any) {

        }
        removeRTCUserData(roomId: string, key: string[], isInner: boolean, callback: ResultCallback<boolean>, message?: any) {

        }

        getRTCToken(room: any, callback: ResultCallback<any>) {

        }
        setRTCState(room: any, content: any, callback: ResultCallback<any>) {

        }
    }
}
