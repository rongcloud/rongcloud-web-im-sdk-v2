module RongIMLib {
    export class RongIMClient {
        /**
         * [schemeType 选择连接方式]
         * SSL自动设置schemeType为ConnectionChannel.HTTPS
         * HTTP或WS自动设置 schemeType为ConnectionChannel.HTTP
         * @type {number}
         */
        static schemeType: number;
        static MessageType: { [s: string]: any } = {};
        static MessageParams: { [s: string]: any };
        static RegisterMessage: { [s: string]: any } = {};
        static _memoryStore: any = {};
        static isNotPullMsg: boolean = false;
        static _cookieHelper: CookieProvider;
        static _dataAccessProvider: DataAccessProvider;
        private static _instance: RongIMClient;
        private static bridge: Bridge;
        static getInstance(): RongIMClient {
            if (!RongIMClient._instance) {
                throw new Error("RongIMClient is not initialized. Call .init() method first.");
            }
            return RongIMClient._instance;
        }
        /**
         * 初始化 SDK，在整个应用全局只需要调用一次。
         * @param appKey    开发者后台申请的 AppKey，用来标识应用。
         * @param dataAccessProvider 必须是DataAccessProvider的实例
         */

        static init(appKey: string, dataAccessProvider?: DataAccessProvider): void {
            if (!RongIMClient._instance) {
                RongIMClient._instance = new RongIMClient();
            }
            if (window["SCHEMETYPE"] == "http") {
                RongIMClient.schemeType = ConnectionChannel.HTTP;
            } else if (window["SCHEMETYPE"] == "https") {
                RongIMClient.schemeType = ConnectionChannel.HTTPS;
            } else {
                if (document.location.protocol == "http:") {
                    RongIMClient.schemeType = ConnectionChannel.HTTP;
                } else {
                    RongIMClient.schemeType = ConnectionChannel.HTTPS;
                }
            }
            if (!window["WEB_XHR_POLLING"]) {
                var browser = navigator.appName;
                var b_version = navigator.appVersion;
                var version = b_version.split(";");
                if (version.length > 1) {
                    var trim_Version = parseInt(version[1].replace(/[ ]/g, "").replace(/MSIE/g, ""));
                    if (trim_Version < 10) {
                        window["WEB_XHR_POLLING"] = true;
                    }
                }
            }
            var pather = new FeaturePatcher();
            pather.patchAll();
            RongIMClient._memoryStore = {
                token: "",
                callback: null,
                hasModules: true,
                global: window,
                lastReadTime: new LimitableMap(),
                conversationList: [],
                appKey: appKey,
                publicServiceMap: new PublicServiceMap(),
                listenerList: [],
                providerType: 1,
                deltaTime: 0,
                filterMessages: [],
                isSyncRemoteConverList: false,
                isUseWebSQLProvider: false,
                otherDevice: false,
                custStore: {},
                converStore: {}
            };
            RongIMClient._cookieHelper = new CookieProvider();
            if (dataAccessProvider && Object.prototype.toString.call(dataAccessProvider) == "[object Object]") {
                RongIMClient._dataAccessProvider = dataAccessProvider;
                RongIMClient._memoryStore.isUseWebSQLProvider = true;
            } else {
                RongIMClient._dataAccessProvider = new ServerDataProvider();
            }
            RongIMClient.MessageParams = {
                TextMessage: { objectName: "RC:TxtMsg", msgTag: new MessageTag(true, true) },
                ImageMessage: { objectName: "RC:ImgMsg", msgTag: new MessageTag(true, true) },
                DiscussionNotificationMessage: { objectName: "RC:DizNtf", msgTag: new MessageTag(true, true) },
                VoiceMessage: { objectName: "RC:VcMsg", msgTag: new MessageTag(true, true) },
                RichContentMessage: { objectName: "RC:ImgTextMsg", msgTag: new MessageTag(true, true) },
                HandshakeMessage: { objectName: "", msgTag: new MessageTag(true, true) },
                UnknownMessage: { objectName: "", msgTag: new MessageTag(true, true) },
                LocationMessage: { objectName: "RC:LBSMsg", msgTag: new MessageTag(true, true) },
                InformationNotificationMessage: { objectName: "RC:InfoNtf", msgTag: new MessageTag(true, true) },
                ContactNotificationMessage: { objectName: "RC:ContactNtf", msgTag: new MessageTag(true, true) },
                ProfileNotificationMessage: { objectName: "RC:ProfileNtf", msgTag: new MessageTag(true, true) },
                CommandNotificationMessage: { objectName: "RC:CmdNtf", msgTag: new MessageTag(true, true) },
                CommandMessage: { objectName: "RC:CmdMsg", msgTag: new MessageTag(false, false) },
                TypingStatusMessage: { objectName: "RC:TypSts", msgTag: new MessageTag(false, false) },

                ChangeModeResponseMessage: { objectName: "RC:CsChaR", msgTag: new MessageTag(false, false) },
                ChangeModeMessage: { objectName: "RC:CSCha", msgTag: new MessageTag(false, false) },
                EvaluateMessage: { objectName: "RC:CsEva", msgTag: new MessageTag(false, false) },
                HandShakeMessage: { objectName: "RC:CsHs", msgTag: new MessageTag(false, false) },
                HandShakeResponseMessage: { objectName: "RC:CsHsR", msgTag: new MessageTag(false, false) },
                SuspendMessage: { objectName: "RC:CsSp", msgTag: new MessageTag(false, false) },//主动发送
                TerminateMessage: { objectName: "RC:CsEnd", msgTag: new MessageTag(false, false) },
                CustomerStatusUpdateMessage: { objectName: "RC:CsUpdate", msgTag: new MessageTag(false, false) },
                ReadReceiptMessage: { objectName: "RC:ReadNtf", msgTag: new MessageTag(false, false) }
            };
            RongIMClient.MessageType = {
                TextMessage: "TextMessage",
                ImageMessage: "ImageMessage",
                DiscussionNotificationMessage: "DiscussionNotificationMessage",
                VoiceMessage: "VoiceMessage",
                RichContentMessage: "RichContentMessage",
                HandshakeMessage: "HandshakeMessage",
                UnknownMessage: "UnknownMessage",
                LocationMessage: "LocationMessage",
                InformationNotificationMessage: "InformationNotificationMessage",
                ContactNotificationMessage: "ContactNotificationMessage",
                ProfileNotificationMessage: "ProfileNotificationMessage",
                CommandNotificationMessage: "CommandNotificationMessage",
                CommandMessage: "CommandMessage",
                TypingStatusMessage: "TypingStatusMessage",
                ChangeModeResponseMessage: "ChangeModeResponseMessage",
                ChangeModeMessage: "ChangeModeMessage",
                EvaluateMessage: "EvaluateMessage",
                HandShakeMessage: "HandShakeMessage",
                HandShakeResponseMessage: "HandShakeResponseMessage",
                SuspendMessage: "SuspendMessage",
                TerminateMessage: "TerminateMessage",
                CustomerStatusUpdateMessage: "CustomerStatusUpdateMessage"
            };
        }

        /**
         * 连接服务器，在整个应用全局只需要调用一次，断线后 SDK 会自动重连。
         *
         * @param token     从服务端获取的用户身份令牌（Token）。
         * @param callback  连接回调，返回连接的成功或者失败状态。
         */
        static connect(token: string, callback: ConnectCallback): RongIMClient {
            CheckParam.getInstance().check(["string", "object"], "connect", true);
            RongIMClient.bridge = Bridge.getInstance();
            RongIMClient._memoryStore.token = token;
            RongIMClient._memoryStore.callback = callback;
            if (!navigator.cookieEnabled) {
                setTimeout(function() {
                    callback.onError(ErrorCode.COOKIE_ENABLE);
                });
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
            return RongIMClient._instance;
        }
        static reconnect(callback: ConnectCallback) {
            RongIMClient.bridge.reconnect(callback);
        }
        /**
         * 注册消息类型，用于注册用户自定义的消息。
         * 内建的消息类型已经注册过，不需要再次注册。
         * 自定义消息声明需放在执行顺序最高的位置（在RongIMClient.init(appkey)之后即可）
         * @param objectName  消息内置名称
         */
        static registerMessageType(messageType: string, objectName: string, messageTag: MessageTag, messageContent: any): void {
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
            RongIMClient.RegisterMessage[messageType].messageName = messageType;
            RongIMClient.MessageType[messageType] = messageType;
            RongIMClient.MessageParams[messageType] = { objectName: objectName, msgTag: messageTag };
            registerMessageTypeMapping[objectName] = messageType;
        }

        /**
         * 设置连接状态变化的监听器。
         *
         * @param listener  连接状态变化的监听器。
         */
        static setConnectionStatusListener(listener: ConnectionStatusListener): void {
            if (RongIMClient.bridge) {
                RongIMClient.bridge.setListener(listener);
            } else {
                RongIMClient._memoryStore.listenerList.push(listener);
            }
        }

        /**
         * 设置接收消息的监听器。
         *
         * @param listener  接收消息的监听器。
         */
        static setOnReceiveMessageListener(listener: OnReceiveMessageListener): void {
            if (RongIMClient.bridge) {
                RongIMClient.bridge.setListener(listener);
            } else {
                RongIMClient._memoryStore.listenerList.push(listener);
            }
        }
        /**
         * 清理所有连接相关的变量
         */
        logout() {
            RongIMClient.bridge.disconnect();
            RongIMClient.bridge = null;
        }
        /**
         * 断开连接。
         */
        disconnect(): void {
            RongIMClient.bridge.disconnect();
        }

        startCustomService(custId: string, callback: any): void {
            if (!custId || !callback) return;
            var msg: MessageContent = new HandShakeMessage();
            var me = this;
            RongIMClient.getInstance().sendMessage(ConversationType.CUSTOMER_SERVICE, custId, msg, {
                onSuccess: function(data: any) {
                    if (data.isBlack) {
                        callback.onError();
                        me.stopCustomeService(custId, {
                            onSuccess: function() { },
                            onError: function() { }
                        });
                    } else {
                        RongIMClient._memoryStore.custStore[custId] = data;
                        callback.onSuccess();
                    }
                },
                onError: function() {
                    callback.onError();
                }
            });
        }

        stopCustomeService(custId: string, callback: any): void {
            if (!custId || !callback) return;
            var session: any = RongIMClient._memoryStore.custStore[custId];
            if (!session) return;
            var msg = new SuspendMessage({ sid: session.sid, uid: session.uid, pid: session.pid });
            this.sendCustMessage(custId, msg, {
                onSuccess: function() {
                    // delete RongIMClient._memoryStore.custStore[custId];
                    setTimeout(function() {
                        callback.onSuccess();
                    });
                },
                onError: function() {
                    setTimeout(function() {
                        callback.onError();
                    });
                }
            });
        }

        switchToHumanMode(custId: string, callback: any): void {
            if (!custId || !callback) return;
            var session: any = RongIMClient._memoryStore.custStore[custId];
            if (!session) return;
            var msg = new ChangeModeMessage({ sid: session.sid, uid: session.uid, pid: session.pid });
            this.sendCustMessage(custId, msg, callback)
        }

        evaluateRebotCustomService(custId: string, isRobotResolved: boolean, sugest: string, callback: any): void {
            if (!custId || !callback) return;
            var session: any = RongIMClient._memoryStore.custStore[custId];
            if (!session) return;
            var msg = new EvaluateMessage({ sid: session.sid, uid: session.uid, pid: session.pid, isRobotResolved: isRobotResolved, sugest: sugest, type: 0 });
            this.sendCustMessage(custId, msg, callback);
        }

        evaluateHumanCustomService(custId: string, humanValue: number, sugest: string, callback: any): void {
            if (!custId || !callback) return;
            var session: any = RongIMClient._memoryStore.custStore[custId];
            if (!session) return;
            var msg = new EvaluateMessage({ sid: session.sid, uid: session.uid, pid: session.pid, humanValue: humanValue, sugest: sugest, type: 1 });
            this.sendCustMessage(custId, msg, callback);
        }

        private sendCustMessage(custId: string, msg: MessageContent, callback: any): void {
            RongIMClient.getInstance().sendMessage(ConversationType.CUSTOMER_SERVICE, custId, msg, {
                onSuccess: function(data: any) {
                    callback.onSuccess();
                },
                onError: function() {
                    callback.onError();
                }
            });
        }
        /**
         * 获取当前连接的状态。
         */
        getCurrentConnectionStatus(): ConnectionStatus {
            return Bridge._client.channel.connectionStatus;
        }

        /**
         * 获取当前使用的连接通道。
         */
        getConnectionChannel(): ConnectionChannel {
            if (Transportations._TransportType == Socket.XHR_POLLING) {
                return ConnectionChannel.XHR_POLLING;
            } else if (Transportations._TransportType == Socket.WEBSOCKET) {
                return ConnectionChannel.WEBSOCKET;
            }
        }

        /**
         * 获取当前使用的本地储存提供者。 TODO
         */
        getStorageProvider(): string {
            if (RongIMClient._memoryStore.providerType == 1) {
                return "ServerDataProvider";
            } else {
                return "OtherDataProvider";
            }
        }
        /**
         * 过滤聊天室消息（拉取最近聊天消息）
         * @param {string[]} msgFilterNames
         */
        setFilterMessages(msgFilterNames: string[]): void {
            if (Object.prototype.toString.call(msgFilterNames) == "[object Array]") {
                RongIMClient._memoryStore.filterMessages = msgFilterNames;
            }
        }

        /**
         * 获取当前连接用户的 UserId。
         */
        getCurrentUserId(): string {
            return Bridge._client.userId;
        }

        /**
         * [getCurrentUserInfo 获取当前用户信息]
         * @param  {ResultCallback<UserInfo>} callback [回调函数]
         */
        // getCurrentUserInfo(callback: ResultCallback<UserInfo>) {
        //     CheckParam.getInstance().check(["object"], "getCurrentUserInfo");
        //     this.getUserInfo(Bridge._client.userId, callback);
        // }
        /**
         * 获得用户信息
         * @param  {string}                   userId [用户Id]
         * @param  {ResultCallback<UserInfo>} callback [回调函数]
         */
        // getUserInfo(userId: string, callback: ResultCallback<UserInfo>) {
        //     CheckParam.getInstance().check(["string", "object"], "getUserInfo");
        //     var user = new Modules.GetUserInfoInput();
        //     user.setNothing(1);
        //     RongIMClient.bridge.queryMsg(5, MessageUtil.ArrayForm(user.toArrayBuffer()), userId, {
        //         onSuccess: function(info: any) {
        //             var userInfo = new UserInfo(info.userId, info.name, info.portraitUri);
        //             callback.onSuccess(userInfo);
        //         },
        //         onError: function(err: any) {
        //             callback.onError(err);
        //         }
        //     }, "GetUserInfoOutput");
        // }
        /**
         * 获取服务器时间与本地时间的差值，单位为毫秒。
         * 计算公式：差值 = 本地时间毫秒数 - 服务器时间毫秒数
         * @param callback  获取的回调，返回差值。
         */
        getDeltaTime(): number {
            return RongIMClient._memoryStore.deltaTime;
        }

        // #region Message

        getMessage(messageId: string, callback: ResultCallback<Message>) {
            RongIMClient._dataAccessProvider.getMessage(messageId, callback);
        }

        deleteLocalMessages(conversationType: ConversationType, targetId: string, messageIds: number[], callback: ResultCallback<boolean>) {
            RongIMClient._dataAccessProvider.removeLocalMessage(conversationType, targetId, messageIds, callback);
        }

        updateMessage(message: Message, callback?: ResultCallback<Message>) {
            RongIMClient._dataAccessProvider.updateMessage(message, callback);
        }

        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            RongIMClient._dataAccessProvider.clearMessages(conversationType, targetId, {
                onSuccess: function(bool: boolean) {
                    setTimeout(function() {
                        callback.onSuccess(bool);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            });
        }
        /**TODO 清楚本地存储的未读消息，目前清空内存中的未读消息
         * [clearMessagesUnreadStatus 清空指定会话未读消息]
         * @param  {ConversationType}        conversationType [会话类型]
         * @param  {string}                  targetId         [用户id]
         * @param  {ResultCallback<boolean>} callback         [返回值，参数回调]
         */
        clearMessagesUnreadStatus(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            RongIMClient._dataAccessProvider.updateMessages(conversationType, targetId, "readStatus", null, {
                onSuccess: function(bool: boolean) {
                    setTimeout(function() {
                        callback.onSuccess(bool);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            });
        }
        /**
         * [deleteMessages 删除消息记录。]
         * @param  {ConversationType}        conversationType [description]
         * @param  {string}                  targetId         [description]
         * @param  {number[]}                messageIds       [description]
         * @param  {ResultCallback<boolean>} callback         [description]
         */
        deleteMessages(conversationType: ConversationType, targetId: string, messageUIds: string[], callback: ResultCallback<boolean>) {
            RongIMClient._dataAccessProvider.removeMessage(conversationType, targetId, messageUIds, {
                onSuccess: function(bool: boolean) {
                    setTimeout(function() {
                        callback.onSuccess(bool);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            });
        }
        sendLocalMessage(message: Message, callback: SendMessageCallback) {
            CheckParam.getInstance().check(["object", "object"], "sendLocalMessage");
            RongIMClient._dataAccessProvider.updateMessage(message);
            this.sendMessage(message.conversationType, message.targetId, message.content, callback);
        }
        /**
         * [sendMessage 发送消息。]
         * @param  {ConversationType}        conversationType [会话类型]
         * @param  {string}                  targetId         [目标Id]
         * @param  {MessageContent}          messageContent   [消息类型]
         * @param  {SendMessageCallback}     sendCallback     []
         * @param  {ResultCallback<Message>} resultCallback   [返回值，函数回调]
         * @param  {string}                  pushContent      []
         * @param  {string}                  pushData         []
         */
        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback) {
            CheckParam.getInstance().check(["number", "string", "object", "object"], "sendMessage");
            if (!Bridge._client.channel) {
                sendCallback.onError(RongIMLib.ErrorCode.RC_NET_UNAVAILABLE, null);
                return;
            }
            if (!Bridge._client.channel.socket.socket.connected) {
                sendCallback.onError(ErrorCode.TIMEOUT, null);
                throw new Error("connect is timeout! postion:sendMessage");
            }

            var modules = new Modules.UpStreamMessage();
            modules.setSessionId(RongIMClient.MessageParams[messageContent.messageName].msgTag.getMessageTag());
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
                    if (RongIMClient.MessageParams[msg.messageType].msgTag.getMessageTag() == 3) {
                        if (!c) {
                            c = me.createConversation(conversationType, targetId, "");
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
                    if (RongIMClient.MessageParams[msg.messageType].msgTag.getMessageTag() == 3) {
                        RongIMClient._memoryStore.converStore.latestMessage = msg;
                        RongIMClient._dataAccessProvider.addMessage(conversationType, targetId, msg, {
                            onSuccess: function(ret: Message) {
                                msg = ret;
                                msg.messageUId = data.messageUId;
                                msg.sentTime = data.timestamp;
                                msg.sentStatus = SentStatus.SENT;
                                RongIMClient._dataAccessProvider.updateMessage(msg);
                            },
                            onError: function() { }
                        });
                    }
                    setTimeout(function() {
                        sendCallback.onSuccess(msg);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    msg.sentStatus = SentStatus.FAILED;
                    RongIMClient._memoryStore.converStore.latestMessage = msg;
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
            }, null);
        }

        sendTypingStatusMessage(conversationType: ConversationType, targetId: string, messageName: string, sendCallback: SendMessageCallback) {
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
        /**
         * [sendStatusMessage description]
         * @param  {MessageContent}          messageContent [description]
         * @param  {SendMessageCallback}     sendCallback   [description]
         * @param  {ResultCallback<Message>} resultCallback [description]
         */
        sendStatusMessage(messageContent: MessageContent, sendCallback: SendMessageCallback, resultCallback: ResultCallback<Message>) {
            throw new Error("Not implemented yet");
        }
        /**
         * [sendTextMessage 发送TextMessage快捷方式]
         * @param  {string}                  content        [消息内容]
         * @param  {ResultCallback<Message>} resultCallback [返回值，参数回调]
         */
        sendTextMessage(conversationType: ConversationType, targetId: string, content: string, sendMessageCallback: SendMessageCallback) {
            var msgContent = TextMessage.obtain(content);
            this.sendMessage(conversationType, targetId, msgContent, sendMessageCallback);
        }
        /**
         * [insertMessage 向本地插入一条消息，不发送到服务器。]
         * @param  {ConversationType}        conversationType [description]
         * @param  {string}                  targetId         [description]
         * @param  {string}                  senderUserId     [description]
         * @param  {MessageContent}          content          [description]
         * @param  {ResultCallback<Message>} callback         [description]
         */
        insertMessage(conversationType: ConversationType, targetId: string, senderUserId: string, content: MessageContent, callback: ResultCallback<Message>) {
            var msg = new Message();
            msg.conversationType = conversationType;
            msg.targetId = targetId;
            msg.senderUserId = senderUserId;
            msg.content = content;
            msg.sentTime = +new Date;
            msg.messageType = content.messageName;
            RongIMClient._dataAccessProvider.addMessage(conversationType, targetId, msg, callback);
        }
        /**
         * [getHistoryMessages 拉取历史消息记录。]
         * @param  {ConversationType}          conversationType [会话类型]
         * @param  {string}                    targetId         [用户Id]
         * @param  {number|null}               pullMessageTime  [拉取历史消息起始位置(格式为毫秒数)，可以为null]
         * @param  {number}                    count            [历史消息数量]
         * @param  {ResultCallback<Message[]>} callback         [回调函数]
         * @param  {string}                    objectName       [objectName]
         */
        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback) {
            CheckParam.getInstance().check(["number", "string", "number|null|global|object", "number", "object"], "getHistoryMessages");
            if (count > 20) {
                throw new Error("HistroyMessage count must be less than or equal to 20!");
            }
            if (conversationType.valueOf() < 0) {
                throw new Error("ConversationType must be greater than -1");
            }
            RongIMClient._dataAccessProvider.getHistoryMessages(conversationType, targetId, timestamp, count, callback);
        }

        /**
         * [getRemoteHistoryMessages 拉取某个时间戳之前的消息]
         * @param  {ConversationType}          conversationType [description]
         * @param  {string}                    targetId         [description]
         * @param  {Date}                      dateTime         [description]
         * @param  {number}                    count            [description]
         * @param  {ResultCallback<Message[]>} callback         [description]
         */
        getRemoteHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback) {
            CheckParam.getInstance().check(["number", "string", "number|null|global|object", "number", "object"], "getRemoteHistoryMessages");
            if (count > 20) {
                callback.onError(ErrorCode.RC_CONN_PROTO_VERSION_ERROR);
                return;
            }
            if (conversationType.valueOf() < 0) {
                callback.onError(ErrorCode.RC_CONN_PROTO_VERSION_ERROR);
                return;
            }
            var modules = new Modules.HistoryMessageInput(), self = this;
            modules.setTargetId(targetId);
            if (timestamp === 0) {
                modules.setDataTime(timestamp);
            } else {
                modules.setDataTime(RongIMClient._memoryStore.lastReadTime.get(conversationType + targetId));
            }
            modules.setSize(count);
            RongIMClient.bridge.queryMsg(HistoryMsgType[conversationType], MessageUtil.ArrayForm(modules.toArrayBuffer()), targetId, {
                onSuccess: function(data: any) {
                    RongIMClient._memoryStore.lastReadTime.set(conversationType + targetId, MessageUtil.int64ToTimestamp(data.syncTime));
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
            }, "HistoryMessagesOuput");
        }
        /**
         * [hasRemoteUnreadMessages 是否有未接收的消息，jsonp方法]
         * @param  {string}          appkey   [appkey]
         * @param  {string}          token    [token]
         * @param  {ConnectCallback} callback [返回值，参数回调]
         */
        hasRemoteUnreadMessages(token: string, callback: ResultCallback<Boolean>) {
            var xss: any = null;
            window.RCCallback = function(x: any) {
                setTimeout(function() { callback.onSuccess(!!+x.status); });
                xss.parentNode.removeChild(xss);
            };
            xss = document.createElement("script");
            xss.src = MessageUtil.schemeArrs[RongIMClient.schemeType][0] + "://api.cn.ronghub.com/message/exist.js?appKey=" + encodeURIComponent(RongIMClient._memoryStore.appKey) + "&token=" + encodeURIComponent(token) + "&callBack=RCCallback&_=" + Date.now();
            document.body.appendChild(xss);
            xss.onerror = function() {
                setTimeout(function() { callback.onError(ErrorCode.UNKNOWN); });
                xss.parentNode.removeChild(xss);
            };
        }
        getTotalUnreadCount(callback: ResultCallback<number>) {
            RongIMClient._dataAccessProvider.getTotalUnreadCount({
                onSuccess: function(count: number) {
                    setTimeout(function() {
                        callback.onSuccess(count);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            });
        }
        /**
         * [getConversationUnreadCount 指定多种会话类型获取未读消息数]
         * @param  {ResultCallback<number>} callback             [返回值，参数回调。]
         * @param  {ConversationType[]}     ...conversationTypes [会话类型。]
         */
        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>) {
            RongIMClient._dataAccessProvider.getConversationUnreadCount(conversationTypes, {
                onSuccess: function(count: number) {
                    setTimeout(function() {
                        callback.onSuccess(count);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            });
        }
        /**
         * [getUnreadCount 指定用户、会话类型的未读消息总数。]
         * @param  {ConversationType} conversationType [会话类型]
         * @param  {string}           targetId         [用户Id]
         */
        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>) {
            RongIMClient._dataAccessProvider.getUnreadCount(conversationType, targetId, {
                onSuccess: function(count: number) {
                    setTimeout(function() {
                        callback.onSuccess(count);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            });
        }
        /**
         * 清楚会话未读消息数
         * @param  {ConversationType}        conversationType 会话类型
         * @param  {string}                  targetId         目标Id
         * @param  {ResultCallback<boolean>} callback         返回值，函数回调
         */
        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            RongIMClient._dataAccessProvider.clearUnreadCount(conversationType, targetId, {
                onSuccess: function(bool: boolean) {
                    setTimeout(function() {
                        callback.onSuccess(bool);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            });
        }

        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>) {
            RongIMClient._dataAccessProvider.setMessageExtra(messageId, value, {
                onSuccess: function(bool: boolean) {
                    setTimeout(function() {
                        callback.onSuccess(bool);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            });
        }

        setMessageReceivedStatus(messageUId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>) {
            RongIMClient._dataAccessProvider.setMessageReceivedStatus(messageUId, receivedStatus, {
                onSuccess: function(bool: boolean) {
                    setTimeout(function() {
                        callback.onSuccess(bool);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            });
        }

        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>) {
            RongIMClient._dataAccessProvider.setMessageSentStatus(messageId, sentStatus, {
                onSuccess: function(bool: boolean) {
                    setTimeout(function() {
                        callback.onSuccess(bool);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            });
        }

        // #endregion Message

        // #region TextMessage Draft
        /**
         * clearTextMessageDraft 清除指定会话和消息类型的草稿。
         * @param  {ConversationType}        conversationType 会话类型
         * @param  {string}                  targetId         目标Id
         */
        clearTextMessageDraft(conversationType: ConversationType, targetId: string): boolean {
            CheckParam.getInstance().check(["number", "string", "object"], "clearTextMessageDraft");
            var key: string = "darf_" + conversationType + "_" + targetId;
            delete RongIMClient._memoryStore[key];
            return true;
        }
        /**
         * [getTextMessageDraft 获取指定消息和会话的草稿。]
         * @param  {ConversationType}       conversationType [会话类型]
         * @param  {string}                 targetId         [目标Id]
         */
        getTextMessageDraft(conversationType: ConversationType, targetId: string): string {
            CheckParam.getInstance().check(["number", "string", "object"], "getTextMessageDraft");
            if (targetId == "" || conversationType < 0) {
                throw new Error("params error : " + ErrorCode.DRAF_GET_ERROR);
            }
            var key: string = "darf_" + conversationType + "_" + targetId;
            return RongIMClient._memoryStore[key];
        }
        /**
         * [saveTextMessageDraft description]
         * @param  {ConversationType}        conversationType [会话类型]
         * @param  {string}                  targetId         [目标Id]
         * @param  {string}                  value            [草稿值]
         */
        saveTextMessageDraft(conversationType: ConversationType, targetId: string, value: string): boolean {
            CheckParam.getInstance().check(["number", "string", "string", "object"], "saveTextMessageDraft");
            var key: string = "darf_" + conversationType + "_" + targetId;
            RongIMClient._memoryStore[key] = value;
            return true;
        }

        // #endregion TextMessage Draft

        // #region Conversation
        clearConversations(callback: ResultCallback<boolean>, ...conversationTypes: ConversationType[]) {
            if (conversationTypes.length == 0) {
                conversationTypes = [RongIMLib.ConversationType.CHATROOM,
                    RongIMLib.ConversationType.CUSTOMER_SERVICE,
                    RongIMLib.ConversationType.DISCUSSION,
                    RongIMLib.ConversationType.GROUP,
                    RongIMLib.ConversationType.PRIVATE,
                    RongIMLib.ConversationType.SYSTEM,
                    RongIMLib.ConversationType.PUBLIC_SERVICE,
                    RongIMLib.ConversationType.APP_PUBLIC_SERVICE];
            }
            RongIMClient._dataAccessProvider.clearConversations(conversationTypes, {
                onSuccess: function(bool: boolean) {
                    setTimeout(function() {
                        callback.onSuccess(bool);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            });
        }
        /**
         * [getConversation 获取指定会话，此方法需在getConversationList之后执行]
         * @param  {ConversationType}             conversationType [会话类型]
         * @param  {string}                       targetId         [目标Id]
         * @param  {ResultCallback<Conversation>} callback         [返回值，函数回调]
         */
        getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>) {
            CheckParam.getInstance().check(["number", "string", "object"], "getConversation");
            RongIMClient._dataAccessProvider.getConversation(conversationType, targetId, {
                onSuccess: function(conver: Conversation) {
                    setTimeout(function() {
                        callback.onSuccess(conver);
                    });
                },
                onError: function(error: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(error);
                    });
                }
            });

        }
        /**
         * [pottingConversation 组装会话列表]
         * @param {any} tempConver [临时会话]
         * conver_conversationType_targetId_no.
         * msg_conversationType_targetId_no.
         */
        private pottingConversation(tempConver: any): void {
            var self = this, isUseReplace: boolean = false;
            RongIMClient._dataAccessProvider.getConversation(tempConver.type, tempConver.userId, {
                onSuccess: function(conver: Conversation) {
                    if (!conver) {
                        conver = new Conversation();
                    } else {
                        isUseReplace = true;
                    }
                    conver.conversationType = tempConver.type;
                    conver.targetId = tempConver.userId;
                    conver.latestMessage = MessageUtil.messageParser(tempConver.msg);
                    conver.latestMessageId = conver.latestMessage.messageId;
                    conver.objectName = conver.latestMessage.objectName;
                    conver.receivedStatus = conver.latestMessage.receivedStatus;
                    conver.receivedTime = conver.latestMessage.receiveTime;
                    conver.sentStatus = conver.latestMessage.sentStatus;
                    conver.sentTime = conver.latestMessage.sentTime;
                    if (!isUseReplace) {
                        if (MessageUtil.supportLargeStorage()) {
                            var count = LocalStorageProvider.getInstance().getItem("cu" + Bridge._client.userId + tempConver.type + tempConver.userId);
                            conver.unreadMessageCount = Number(count);
                        } else {
                            conver.unreadMessageCount = 0;
                        }
                    }
                    // if (conver.conversationType == ConversationType.PRIVATE) {
                    //     self.getUserInfo(tempConver.userId, <ResultCallback<UserInfo>>{
                    //         onSuccess: function(info: UserInfo) {
                    //             conver.conversationTitle = info.name;
                    //             conver.senderUserName = info.name;
                    //             conver.senderUserId = info.userId;
                    //             conver.senderPortraitUri = info.portraitUri;
                    //         },
                    //         onError: function(error: ErrorCode) { }
                    //     });
                    // } else
                    if (conver.conversationType == ConversationType.DISCUSSION) {
                        self.getDiscussion(tempConver.userId, {
                            onSuccess: function(info: Discussion) {
                                conver.conversationTitle = info.name;
                            },
                            onError: function(error: ErrorCode) { }
                        });
                    }
                    RongIMClient._dataAccessProvider.addConversation(conver, <ResultCallback<boolean>>{ onSuccess: function(data: boolean) { } });
                },
                onError: function(error: ErrorCode) { }
            });

        }

        private sortConversationList(conversationList: Conversation[]) {
            var convers: Conversation[] = [];
            for (var i = 0, len = conversationList.length; i < len; i++) {
                if (conversationList[i].isTop) {
                    convers.push(conversationList[i]);
                    conversationList.splice(i, 1);
                    continue;
                }
                for (var j = 0; j < len - i - 1; j++) {
                    if (conversationList[j].sentTime < conversationList[j + 1].sentTime) {
                        var swap = conversationList[j];
                        conversationList[j] = conversationList[j + 1];
                        conversationList[j + 1] = swap;
                    }
                }
            }
            RongIMClient._memoryStore.conversationList = convers.concat(conversationList);
        }
        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes: ConversationType[]) {
            CheckParam.getInstance().check(["object", "null|array|object|global"], "getConversationList");
            var me = this;
            RongIMClient._dataAccessProvider.getConversationList(<ResultCallback<Conversation[]>>{
                onSuccess: function(data: Conversation[]) {
                    if (conversationTypes) {
                        setTimeout(function() {
                            callback.onSuccess(data);
                        });
                    } else {
                        if (RongIMClient._memoryStore.isUseWebSQLProvide) {
                            me.sortConversationList(RongIMClient._memoryStore.conversationList);
                        }
                        setTimeout(function() {
                            callback.onSuccess(RongIMClient._memoryStore.conversationList);
                        });
                    }
                },
                onError: function(error: ErrorCode) {
                    if (error === ErrorCode.TIMEOUT) {
                        callback.onError(error);
                    } else {
                        callback.onSuccess([]);
                    }
                }
            }, conversationTypes);
        }
        getRemoteConversationList(callback: ResultCallback<Conversation[]>, conversationTypes: ConversationType[]) {
            CheckParam.getInstance().check(["object", "null|array|object|global"], "getRemoteConversationList");
            var modules = new Modules.RelationsInput(), self = this;
            modules.setType(1);
            RongIMClient.bridge.queryMsg(26, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function(list: any) {
                    if (list.info) {
                        for (var i = 0, len = list.info.length; i < len; i++) {
                            self.pottingConversation(list.info[i]);
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

        updateConversation(conversation: Conversation): Conversation {
            return RongIMClient._dataAccessProvider.updateConversation(conversation);
        }

        /**
         * [createConversation 创建会话。]
         * @param  {number}  conversationType [会话类型]
         * @param  {string}  targetId         [目标Id]
         * @param  {string}  converTitle      [会话标题]
         * @param  {boolean} islocal          [是否同步到服务器，ture：同步，false:不同步]
         */
        createConversation(conversationType: number, targetId: string, converTitle: string): Conversation {
            CheckParam.getInstance().check(["number", "string", "string"], "createConversation");
            var conver = new Conversation();
            conver.targetId = targetId;
            conver.conversationType = conversationType;
            conver.conversationTitle = converTitle;
            conver.latestMessage = {};
            conver.unreadMessageCount = 0;
            return conver;
        }
        //TODO 删除本地和服务器、删除本地和服务器分开
        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            CheckParam.getInstance().check(["number", "string", "object"], "removeConversation");
            var mod = new Modules.RelationsInput();
            mod.setType(conversationType);
            RongIMClient.bridge.queryMsg(27, MessageUtil.ArrayForm(mod.toArrayBuffer()), targetId, {
                onSuccess: function() {
                    RongIMClient._dataAccessProvider.removeConversation(conversationType, targetId, {
                        onSuccess: function() {
                            setTimeout(function() {
                                callback.onSuccess(true);
                            });
                        },
                        onError: function() {
                            setTimeout(function() {
                                callback.onError(ErrorCode.CONVER_REMOVE_ERROR);
                            });
                        }
                    });
                }, onError: function() {
                    setTimeout(function() {
                        callback.onError(ErrorCode.CONVER_REMOVE_ERROR);
                    });
                }
            });
        }

        setConversationToTop(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            CheckParam.getInstance().check(["number", "string", "object"], "setConversationToTop");
            RongIMClient._dataAccessProvider.setConversationToTop(conversationType, targetId, {
                onSuccess: function(bool: boolean) {
                    setTimeout(function() {
                        callback.onSuccess(bool);
                    });
                },
                onError: function(errorCode: ErrorCode) {
                    setTimeout(function() {
                        callback.onError(errorCode);
                    });
                }
            });
        }

        // #endregion Conversation

        // #region Notifications
        /**
         * [getConversationNotificationStatus 获取指定用户和会话类型免提醒。]
         * @param  {ConversationType}                               conversationType [会话类型]
         * @param  {string}                                         targetId         [目标Id]
         * @param  {ResultCallback<ConversationNotificationStatus>} callback         [返回值，函数回调]
         */
        getConversationNotificationStatus(conversationType: ConversationType, targetId: string, callback: ResultCallback<ConversationNotificationStatus>) {
            throw new Error("Not implemented yet");
        }
        /**
         * [setConversationNotificationStatus 设置指定用户和会话类型免提醒。]
         * @param  {ConversationType}                               conversationType [会话类型]
         * @param  {string}                                         targetId         [目标Id]
         * @param  {ResultCallback<ConversationNotificationStatus>} callback         [返回值，函数回调]
         */
        setConversationNotificationStatus(conversationType: ConversationType, targetId: string, notificationStatus: ConversationNotificationStatus, callback: ResultCallback<ConversationNotificationStatus>) {
            throw new Error("Not implemented yet");
        }
        /**
         * [getNotificationQuietHours 获取免提醒消息时间。]
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
        getNotificationQuietHours(callback: GetNotificationQuietHoursCallback) {
            throw new Error("Not implemented yet");
        }
        /**
         * [removeNotificationQuietHours 移除免提醒消息时间。]
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
        removeNotificationQuietHours(callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }
        /**
         * [setNotificationQuietHours 设置免提醒消息时间。]
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
        setNotificationQuietHours(startTime: string, spanMinutes: number, callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }

        // #endregion Notifications

        // #region Discussion
        /**
         * [addMemberToDiscussion   加入讨论组]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {string[]}          userIdList   [讨论中成员]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
        addMemberToDiscussion(discussionId: string, userIdList: string[], callback: OperationCallback) {
            CheckParam.getInstance().check(["string", "array", "object"], "addMemberToDiscussion");
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
        /**
         * [createDiscussion 创建讨论组]
         * @param  {string}                   name       [讨论组名称]
         * @param  {string[]}                 userIdList [讨论组成员]
         * @param  {CreateDiscussionCallback} callback   [返回值，函数回调]
         */
        createDiscussion(name: string, userIdList: string[], callback: CreateDiscussionCallback) {
            CheckParam.getInstance().check(["string", "array", "object"], "createDiscussion");
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
        /**
         * [getDiscussion 获取讨论组信息]
         * @param  {string}                     discussionId [讨论组Id]
         * @param  {ResultCallback<Discussion>} callback     [返回值，函数回调]
         */
        getDiscussion(discussionId: string, callback: ResultCallback<Discussion>) {
            CheckParam.getInstance().check(["string", "object"], "getDiscussion");
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
        /**
         * [quitDiscussion 退出讨论组]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
        quitDiscussion(discussionId: string, callback: OperationCallback) {
            CheckParam.getInstance().check(["string", "object"], "quitDiscussion");
            var modules = new Modules.LeaveChannelInput();
            modules.setNothing(1);
            RongIMClient.bridge.queryMsg(7, MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback);
        }
        /**
         * [removeMemberFromDiscussion 将指定成员移除讨论租]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {string}            userId       [被移除的用户Id]
         * @param  {OperationCallback} callback     [返回值，参数回调]
         */
        removeMemberFromDiscussion(discussionId: string, userId: string, callback: OperationCallback) {
            CheckParam.getInstance().check(["string", "string", "object"], "removeMemberFromDiscussion");
            var modules = new Modules.ChannelEvictionInput();
            modules.setUser(userId);
            RongIMClient.bridge.queryMsg(9, MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback);
        }
        /**
         * [setDiscussionInviteStatus 设置讨论组邀请状态]
         * @param  {string}                 discussionId [讨论组Id]
         * @param  {DiscussionInviteStatus} status       [邀请状态]
         * @param  {OperationCallback}      callback     [返回值，函数回调]
         */
        setDiscussionInviteStatus(discussionId: string, status: DiscussionInviteStatus, callback: OperationCallback) {
            CheckParam.getInstance().check(["string", "number", "object"], "setDiscussionInviteStatus");
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
        /**
         * [setDiscussionName 设置讨论组名称]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {string}            name         [讨论组名称]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
        setDiscussionName(discussionId: string, name: string, callback: OperationCallback) {
            CheckParam.getInstance().check(["string", "string", "object"], "setDiscussionName");
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

        // #endregion Discussion

        // #region Group
        /**
         * [加入群组]
         * @param  {string}            groupId   [群组Id]
         * @param  {string}            groupName [群组名称]
         * @param  {OperationCallback} callback  [返回值，函数回调]
         */
        joinGroup(groupId: string, groupName: string, callback: OperationCallback) {
            CheckParam.getInstance().check(["string", "string", "object"], "joinGroup");
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
        /**
         * [退出群组]
         * @param  {string}            groupId  [群组Id]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
        quitGroup(groupId: string, callback: OperationCallback) {
            CheckParam.getInstance().check(["string", "object"], "quitGroup");
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
        /**
         * [同步群组信息]
         * @param  {Array<Group>}      groups   [群组列表]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
        syncGroup(groups: Array<Group>, callback: OperationCallback) {
            CheckParam.getInstance().check(["array", "object"], "syncGroup");
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

        // #endregion Group

        // #region ChatRoom
        /**
         * [加入聊天室。]
         * @param  {string}            chatroomId   [聊天室Id]
         * @param  {number}            messageCount [拉取消息数量，-1为不拉去消息]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
        joinChatRoom(chatroomId: string, messageCount: number, callback: OperationCallback) {
            CheckParam.getInstance().check(["string", "number", "object"], "joinChatRoom");
            if (chatroomId != "") {
                Bridge._client.chatroomId = chatroomId;
            } else {
                setTimeout(function() {
                    callback.onError(ErrorCode.CHATROOM_ID_ISNULL);
                });
                return;
            }
            var e = new Modules.ChrmInput();
            e.setNothing(1);
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
                            RongIMClient._cookieHelper.setItem(Bridge._client.userId + "CST", sync);
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

        getChatRoomInfo(chatRoomId: string, count: number, order: GetChatRoomType, callback: ResultCallback<any>) {
            CheckParam.getInstance().check(["string","number", "number", "object"], "getChatRoomInfo");
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
        /**
         * [退出聊天室]
         * @param  {string}            chatroomId [聊天室Id]
         * @param  {OperationCallback} callback   [返回值，函数回调]
         */
        quitChatRoom(chatroomId: string, callback: OperationCallback) {
            CheckParam.getInstance().check(["string", "object"], "quitChatRoom");
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

        // #endregion ChatRoom

        // #region Public Service
        getRemotePublicServiceList(mpId?: string, conversationType?: number, pullMessageTime?: any, callback?: ResultCallback<PublicServiceProfile[]>) {
            var modules = new Modules.PullMpInput(), self = this;
            if (!pullMessageTime) {
                modules.setTime(0);
            } else {
                modules.setTime(RongIMClient._memoryStore.lastReadTime.get(conversationType + Bridge._client.userId));
            }
            modules.setMpid("");
            RongIMClient.bridge.queryMsg(28, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function(data: Array<PublicServiceProfile>) {
                    //TODO 找出最大时间
                    // self.lastReadTime.set(conversationType + targetId, MessageUtil.int64ToTimestamp(data.syncTime));
                    RongIMClient._memoryStore.publicServiceMap.publicServiceList.length = 0;
                    RongIMClient._memoryStore.publicServiceMap.publicServiceList = data;
                },
                onError: function() { }
            }, "PullMpOutput");

        }
        /**
         * [getPublicServiceList ]获取已经的公共账号列表
         * @param  {ResultCallback<PublicServiceProfile[]>} callback [返回值，参数回调]
         */
        getPublicServiceList(callback: ResultCallback<PublicServiceProfile[]>) {
            CheckParam.getInstance().check(["object"], "getPublicServiceList");
            callback.onSuccess(RongIMClient._memoryStore.publicServiceMap.publicServiceList);
        }
        /**
         * [getPublicServiceProfile ]   获取某公共服务信息。
         * @param  {PublicServiceType}                    publicServiceType [公众服务类型。]
         * @param  {string}                               publicServiceId   [公共服务 Id。]
         * @param  {ResultCallback<PublicServiceProfile>} callback          [公共账号信息回调。]
         */
        getPublicServiceProfile(publicServiceType: ConversationType, publicServiceId: string, callback: ResultCallback<PublicServiceProfile>) {
            CheckParam.getInstance().check(["number", "string", "object"], "getPublicServiceProfile");
            var profile: PublicServiceProfile = RongIMClient._memoryStore.publicServiceMap.get(publicServiceType, publicServiceId);
            callback.onSuccess(profile);
        }

        /**
         * [pottingPublicSearchType ] 公众好查询类型
         * @param  {number} bussinessType [ 0-all 1-mp 2-mc]
         * @param  {number} searchType    [0-exact 1-fuzzy]
         */
        private pottingPublicSearchType(bussinessType: number, searchType: number): number {
            var bits = 0;
            if (bussinessType == 0) {
                bits |= 3;
                if (searchType == 0) {
                    bits |= 12;
                } else {
                    bits |= 48;
                }
            }
            else if (bussinessType == 1) {
                bits |= 1;
                if (searchType == 0) {
                    bits |= 8;
                } else {
                    bits |= 32;
                }
            }
            else {
                bits |= 2;
                if (bussinessType == 0) {
                    bits |= 4;
                } else {
                    bits |= 16;
                }
            }
            return bits;
        }
        /**
         * [searchPublicService ]按公众服务类型搜索公众服务。
         * @param  {SearchType}                             searchType [搜索类型枚举。]
         * @param  {string}                                 keywords   [搜索关键字。]
         * @param  {ResultCallback<PublicServiceProfile[]>} callback   [搜索结果回调。]
         */
        searchPublicService(searchType: SearchType, keywords: string, callback: ResultCallback<PublicServiceProfile[]>) {
            CheckParam.getInstance().check(["number", "string", "object"], "searchPublicService");
            var modules = new Modules.SearchMpInput();
            modules.setType(this.pottingPublicSearchType(0, searchType));
            modules.setId(keywords);
            RongIMClient.bridge.queryMsg(29, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, callback, "SearchMpOutput");
        }
        /**
         * [searchPublicServiceByType ]按公众服务类型搜索公众服务。
         * @param  {PublicServiceType}                      publicServiceType [公众服务类型。]
         * @param  {SearchType}                             searchType        [搜索类型枚举。]
         * @param  {string}                                 keywords          [搜索关键字。]
         * @param  {ResultCallback<PublicServiceProfile[]>} callback          [搜索结果回调。]
         */
        searchPublicServiceByType(publicServiceType: ConversationType, searchType: SearchType, keywords: string, callback: ResultCallback<PublicServiceProfile[]>) {
            CheckParam.getInstance().check(["number", "number", "string", "object"], "searchPublicServiceByType");
            var type: number = publicServiceType == ConversationType.APP_PUBLIC_SERVICE ? 2 : 1;
            var modules: any = new Modules.SearchMpInput();
            modules.setType(this.pottingPublicSearchType(type, searchType));
            modules.setId(keywords);
            RongIMClient.bridge.queryMsg(29, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, callback, "SearchMpOutput");
        }
        /**
         * [subscribePublicService ] 订阅公众号。
         * @param  {PublicServiceType} publicServiceType [公众服务类型。]
         * @param  {string}            publicServiceId   [公共服务 Id。]
         * @param  {OperationCallback} callback          [订阅公众号回调。]
         */
        subscribePublicService(publicServiceType: ConversationType, publicServiceId: string, callback: OperationCallback) {
            CheckParam.getInstance().check(["number", "string", "object"], "subscribePublicService");
            var modules = new Modules.MPFollowInput(), me = this, follow = publicServiceType == ConversationType.APP_PUBLIC_SERVICE ? "mcFollow" : "mpFollow";
            modules.setId(publicServiceId);
            RongIMClient.bridge.queryMsg(follow, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function() {
                    me.getRemotePublicServiceList(null, null, null, <ResultCallback<PublicServiceProfile[]>>{
                        onSuccess: function() { },
                        onError: function() { }
                    });
                    callback.onSuccess();
                },
                onError: function() {
                    callback.onError(ErrorCode.SUBSCRIBE_ERROR);
                }
            }, "MPFollowOutput");
        }
        /**
         * [unsubscribePublicService ] 取消订阅公众号。
         * @param  {PublicServiceType} publicServiceType [公众服务类型。]
         * @param  {string}            publicServiceId   [公共服务 Id。]
         * @param  {OperationCallback} callback          [取消订阅公众号回调。]
         */
        unsubscribePublicService(publicServiceType: ConversationType, publicServiceId: string, callback: OperationCallback) {
            CheckParam.getInstance().check(["number", "string", "object"], "unsubscribePublicService");
            var modules = new Modules.MPFollowInput(), me = this, follow = publicServiceType == ConversationType.APP_PUBLIC_SERVICE ? "mcUnFollow" : "mpUnFollow";
            modules.setId(publicServiceId);
            RongIMClient.bridge.queryMsg(follow, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function() {
                    RongIMClient._memoryStore.publicServiceMap.remove(publicServiceType, publicServiceId);
                    callback.onSuccess();
                },
                onError: function() {
                    callback.onError(ErrorCode.SUBSCRIBE_ERROR);
                }
            }, "MPFollowOutput");
        }

        // #endregion Public Service

        // #region Blacklist
        /**
         * [加入黑名单]
         * @param  {string}            userId   [将被加入黑名单的用户Id]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
        addToBlacklist(userId: string, callback: OperationCallback) {
            CheckParam.getInstance().check(["string", "object"], "addToBlacklist");
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
        /**
         * [获取黑名单列表]
         * @param  {GetBlacklistCallback} callback [返回值，函数回调]
         */
        getBlacklist(callback: GetBlacklistCallback) {
            CheckParam.getInstance().check(["object"], "getBlacklist");
            var modules = new Modules.QueryBlackListInput();
            modules.setNothing(1);
            RongIMClient.bridge.queryMsg(23, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, callback, "QueryBlackListOutput");
        }
        /**
         * [得到指定人员再黑名单中的状态]
         * @param  {string}                          userId   [description]
         * @param  {ResultCallback<BlacklistStatus>} callback [返回值，函数回调]
         */
        //TODO 如果人员不在黑名单中，获取状态会出现异常
        getBlacklistStatus(userId: string, callback: ResultCallback<string>) {
            CheckParam.getInstance().check(["string", "object"], "getBlacklistStatus");
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
        /**
         * [将指定用户移除黑名单]
         * @param  {string}            userId   [将被移除的用户Id]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
        removeFromBlacklist(userId: string, callback: OperationCallback) {
            CheckParam.getInstance().check(["string", "object"], "removeFromBlacklist");
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

        getFileToken(fileType: FileType, callback: ResultCallback<string>) {
            CheckParam.getInstance().check(["number", "object"], "getQnTkn");
            if (!(/(1|2|3)/.test(fileType.toString()))) {
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

        getFileUrl(fileType: FileType, fileName: String, callback: ResultCallback<string>) {
            CheckParam.getInstance().check(["number", "string", "object"], "getQnTkn");
            if (!(/(1|2|3)/.test(fileType.toString()))) {
                setTimeout(function() {
                    callback.onError(ErrorCode.QNTKN_FILETYPE_ERROR);
                });
                return;
            }
            var modules = new Modules.GetQNdownloadUrlInput();
            modules.setType(fileType);
            modules.setKey(fileName);
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
        };
        // #endregion Blacklist

        // #region Real-time Location Service

        addRealTimeLocationListener(conversationType: ConversationType, targetId: string, listener: RealTimeLocationListener) {
            throw new Error("Not implemented yet");
        }

        getRealTimeLocation(conversationType: ConversationType, targetId: string) {
            throw new Error("Not implemented yet");
        }

        getRealTimeLocationCurrentState(conversationType: ConversationType, targetId: string) {
            throw new Error("Not implemented yet");
        }

        getRealTimeLocationParticipants(conversationType: ConversationType, targetId: string) {
            throw new Error("Not implemented yet");
        }

        joinRealTimeLocation(conversationType: ConversationType, targetId: string) {
            throw new Error("Not implemented yet");
        }

        quitRealTimeLocation(conversationType: ConversationType, targetId: string) {
            throw new Error("Not implemented yet");
        }

        startRealTimeLocation(conversationType: ConversationType, targetId: string) {
            throw new Error("Not implemented yet");
        }

        updateRealTimeLocationStatus(conversationType: ConversationType, targetId: string, latitude: number, longitude: number) {
            throw new Error("Not implemented yet");
        }

        // #endregion Real-time Location Service
    }
    //兼容AMD CMD
    if ("function" === typeof require && "object" === typeof module && module && module.id && "object" === typeof exports && exports) {
        module.exports = RongIMLib;
    } else if ("function" === typeof define && define.amd) {
        if (window["WEB_XHR_POLLING"]) {
            define("RongIMLib", ['md5'], function() {
                return RongIMLib;
            });
        } else {
            var lurl: string = window["SCHEMETYPE"] ? window["SCHEMETYPE"] + "://cdn.ronghub.com/Long.js" : "//cdn.ronghub.com/Long.js";
            var burl: string = window["SCHEMETYPE"] ? window["SCHEMETYPE"] + "://cdn.ronghub.com/byteBuffer.js" : "//cdn.ronghub.com/byteBuffer.js";
            var purl: string = window["SCHEMETYPE"] ? window["SCHEMETYPE"] + "://cdn.ronghub.com/protobuf-min-2.8.js" : "//cdn.ronghub.com/protobuf-min-2.8.js";
            define("RongIMLib", ['md5', lurl, burl, purl], function() {
                return RongIMLib;
            });
        }
    } else {
        window.RongIMClient = RongIMClient;
    }
}
