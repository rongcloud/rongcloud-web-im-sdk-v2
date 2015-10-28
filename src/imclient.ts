module RongIMLib {
    export class RongIMClient {
        // Basic properties.

        // Business properties.
        private _currentUserId: string;
        //储存上次读取消息时间
        private lastReadTime: LimitableMap = new LimitableMap();
        //token
        static _token: string;
        //判断是否推送消息
        static isNotPullMsg: boolean = false;
        static _storageProvider: StorageProvider;
        /**
         * [schemeType 选择连接方式]
         * SSL需要设置schemeType为SchemeType.SSL
         * HTTP或WS需要设置 schemeType为SchemeType.HSL(默认)
         * 若改变连接方式此属性必须在RongIMClient.init之前赋值
         * expmale:
         * RongIMLib.RongIMClient.schemeType = RongIMLib.SchemeType.SSL
         * @type {number}
         */
        static schemeType: number = SchemeType.HSL;
        // Static properties.
        private static _instance: RongIMClient;
        private static _appKey: string;
        private static _connectionChannel: ConnectionChannel;
        private static _dataAccessProvider: DataAccessProvider;
        //缓存会话列表
        private conversationList: any = [];
        //桥连接类
        static bridge: Bridge;
        //存放监听数组
        static listenerList: Array<any> = [];


        /**
         * 构造函数。
         * 不能通过此函数获取 RongIMClient 实例。
         * 请使用 RongIMClient.getInstrance() 获取 RongIMClient 实例。
         */
        constructor() { }
        /**
         * 获取 RongIMClient 实例。
         * 需在执行 init 方法初始化 SDK 后再获取，否则返回 null 值。
         */
        static getInstance(): RongIMClient {
            if (!RongIMClient._appKey) {
                throw new Error("Not yet instantiated RongIMClient");
            }
            return RongIMClient._instance;
        }

        /**
         * 初始化 SDK，在整个应用全局只需要调用一次。
         *
         * @param appKey    开发者后台申请的 AppKey，用来标识应用。
         */
        static init(appKey: string): void {
            if (!RongIMClient._instance) {
                RongIMClient._instance = new RongIMClient();
            }
            RongIMClient._appKey = appKey;
            RongIMClient._storageProvider = MessageUtil.createStorageFactory();
        }

        /**
         * 连接服务器，在整个应用全局只需要调用一次，断线后 SDK 会自动重连。
         *
         * @param token     从服务端获取的用户身份令牌（Token）。
         * @param callback  连接回调，返回连接的成功或者失败状态。
         */
        static connect(token: string, callback: ConnectCallback): RongIMClient {
            CheckParam.getInstance().check(["string", "object"], "connect", true)
            RongIMClient.bridge = Bridge.getInstance();
            RongIMClient.bridge.connect(RongIMClient._appKey, token, callback);
            //循环设置监听事件，追加之后清空存放事件数据
            for (let i = 0, len = RongIMClient.listenerList.length; i < len; i++) {
                RongIMClient.bridge["setListener"](RongIMClient.listenerList[i]);
            }
            RongIMClient.listenerList.length = 0;
            return RongIMClient._instance;
        }

        /**
         * 注册消息类型，用于注册用户自定义的消息。
         * 内建的消息类型已经注册过，不需要再次注册。
         * 自定义消息声明需放在执行顺序最高的位置（在RongIMClient.init(appkey)之后即可）
         * @param objectName  用户数据信息。
         */
        static registerMessageType(objectName: string, messageType: string, fieldName: Array<string>[]): void {
            if (!RongIMClient._instance) throw new Error("unInitException");
            CheckParam.getInstance().check(["string", "string", "array"], "registerMessageType");
            if (objectName == "") throw new Error("objectName can't be empty,postion -> registerMessageType");
            registerMessageTypeMapping[objectName] = messageType;
            var str = "var temp = RongIMLib." + messageType + " = function(c) {" +
                "var p = RongIMLib.RongIMMessage.call(this, c);" +
                "RongIMLib.MessageType[messageType] = messageType;" +
                "this.message = c;" +
                "this.setMessageType(messageType);" +
                "this.setObjectName(objectName);" +
                "for (var i = 0; i < fieldName.length; i++) {" +
                "var item = fieldName[i];" +
                "this['set' + item] = (function(na) {" +
                "return function(a) {" +
                "this.setContent(a, na);" +
                "}" +
                "})(item);" +
                "this['get' + item] = (function(na) {" +
                "return function() {" +
                "return this.getDetail()[na];" +
                "}" +
                "})(item);" +
                "}" +
                "this.getMessage=function(){return this}" +
                "}; temp.prototype = new RongIMLib.RongIMMessage;";
            eval(str);
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
                RongIMClient.listenerList.push(listener);
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
                RongIMClient.listenerList.push(listener);
            }
        }

        /**
         * 断开连接，但是保留当前用户与设备的登录关系，继续接收推送（Push）消息。
         */
        disconnect(): void {
            RongIMClient.bridge.disConnect();
        }

        /**
         * 断开连接，并且注销当前用户与设备的登录关系，不再接收推送（Push）消息。
         * TODO: Should there be a callback?
         *
         * @param callback  操作成功或者失败的回调。
         */
        logout(callback: OperationCallback): void {
            throw new Error("Not implemented yet");
        }

        /**
         * 获取当前连接的状态。
         */
        getCurrentConnectionStatus(): ConnectionStatus {
            return null;
        }

        /**
         * 获取当前使用的连接通道。
         */
        getConnectionChannel(): ConnectionChannel {
            return RongIMClient._connectionChannel;
        }

        /**
         * 获取当前使用的本地储存提供者。
         */
        getStorageProvider(): StorageProvider {
            return RongIMClient._storageProvider;
        }

        /**
         * 获取当前连接用户的 UserId。
         */
        getCurrentUserId(): string {
            return this._currentUserId;
        }

        /**
         * [getCurrentUserInfo 获取当前用户信息]
         * @param  {ResultCallback<UserInfo>} callback [回调函数]
         */
        getCurrentUserInfo(callback: ResultCallback<UserInfo>) {
            CheckParam.getInstance().check(["object"], "getCurrentUserInfo");
            this.getUserInfo(Bridge._client.userId, callback);
        }
        /**
         * 获得用户信息
         * @param  {string}                   userId [用户Id]
         * @param  {ResultCallback<UserInfo>} callback [回调函数]
         */
        getUserInfo(userId: string, callback: ResultCallback<UserInfo>) {
            CheckParam.getInstance().check(["string", "object"], "getUserInfo");
            var user = new Modules.GetUserInfoInput();
            user.setNothing(1);
            RongIMClient.bridge.queryMsg(5, MessageUtil.ArrayForm(user.toArrayBuffer()), userId, {
                onSuccess: function(info: any) {
                    var userInfo = new UserInfo();
                    userInfo.setUserId(info.userId);
                    userInfo.setUserName(info.name);
                    userInfo.setPortraitUri(info.portraitUri);
                    callback.onSuccess(userInfo);
                },
                onError: function(err: any) {
                    callback.onError(err);
                }
            }, "GetUserInfoOutput");
        }
        /**
         * 提交用户数据到服务器，以便后台业务（如：客服系统）使用。
         *
         * @param userData  用户数据信息。
         * @param callback  操作成功或者失败的回调。
         */
        syncUserData(userData: UserData, callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }

        /**
         * 获取本地时间与服务器时间的差值，单位为毫秒。
         *
         * @param callback  获取的回调，返回时间差值。
         */
        getDeltaTime(callback: ResultCallback<number>) {
            throw new Error("Not implemented yet");
        }

        // #region Message

        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            RongIMClient._dataAccessProvider.clearMessages(conversationType, targetId);
        }
        /**
         * [clearMessagesUnreadStatus 清空指定会话未读消息]
         * @param  {ConversationType}        conversationType [会话类型]
         * @param  {string}                  targetId         [用户id]
         * @param  {ResultCallback<boolean>} callback         [返回值，参数回调]
         */
        clearMessagesUnreadStatus(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            RongIMClient._dataAccessProvider.updateMessages(conversationType, targetId, "readStatus", false);
        }

        deleteMessages(conversationType: ConversationType, targetId: string, messageIds: number[], callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback, resultCallback: ResultCallback<Message>, pushContent?: string, pushData?: string) {
            CheckParam.getInstance().check(["number", "string", "object", "null", "object"], "sendMessage");
            if (!Bridge._client.channel.socket.socket.connected) {
                resultCallback.onError(ErrorCode.TIMEOUT);
                throw new Error("connect is timeout! postion:sendMessage")
            }
            if (!(messageContent instanceof RongIMMessage)) {
                //TODO 自定义消息类型如何处理 MessageContent 不许new
                throw new Error("wrong parameter! postion:sendMessage")
            }
            var content: any = messageContent.encode(), msg: RongIMMessage = messageContent.getMessage(), j: any;
            msg.setConversationType(conversationType);
            msg.setMessageDirection(MessageDirection.SEND);
            if (!msg.getMessageId()) msg.setMessageId(conversationType + "_" + ~~(Math.random() * 0xffffff));
            msg.setSentStatus(SentStatus.SENDING);
            msg.setSenderUserId(Bridge._client.userId);
            msg.setSentTime((new Date()).getTime());
            msg.setTargetId(targetId);
            if (/ISCOUNTED/.test(msg.getMessageTag())) {
                //TODO
            }
            RongIMClient.bridge.pubMsg(conversationType.valueOf(), content, targetId, resultCallback, msg);
        }

        // sendMessage(message: Message, sendCallback: SendMessageCallback, resultCallback: ResultCallback<Message>, pushContent?: string, pushData?: string) {
        //
        // }

        sendStatusMessage(message: Message, sendCallback: SendMessageCallback, resultCallback: ResultCallback<Message>) {
            throw new Error("Not implemented yet");
        }

        sendTextMessage() {
            throw new Error("Not implemented yet");
        }

        insertMessage(conversationType: ConversationType, targetId: string, senderUserId: string, content: MessageContent, callback: ResultCallback<Message>) {
            throw new Error("Not implemented yet");
        }
        /**
         * [getHistoryMessages 拉取历史消息记录]
         * @param  {ConversationType}          conversationType [会话类型]
         * @param  {string}                    targetId         [用户Id]
         * @param  {number|null}               pullMessageTime  [拉取历史消息起始位置(格式为毫秒数)，可以为null]
         * @param  {number}                    count            [历史消息数量]
         * @param  {ResultCallback<Message[]>} callback         [回调函数]
         * @param  {string}                    objectName       [objectName]
         */
        getHistoryMessages(conversationType: ConversationType, targetId: string, pullMessageTime: number, count: number, callback: ResultCallback<Message[]>, objectName?: string) {
            CheckParam.getInstance().check(["number", "string", "number|null", "number", "object"], "getHistoryMessages");
            if (count > 20) {
                console.log("HistroyMessage count must be less than or equal to 20!")
                callback.onError(ErrorCode.RC_CONN_PROTO_VERSION_ERROR);
                return;
            }
            if (conversationType.valueOf() == 0) {
                console.log("ConversationType must be greater than 0")
                callback.onError(ErrorCode.RC_CONN_PROTO_VERSION_ERROR);
                return;
            }
            var modules = new Modules.HistoryMessageInput(), self = this;
            modules.setTargetId(targetId);
            if (!pullMessageTime) {
                modules.setDataTime(this.lastReadTime.get(conversationType + targetId));
            } else {
                modules.setDataTime(new Date(pullMessageTime));
            }
            modules.setSize(count);
            RongIMClient.bridge.queryMsg(HistoryMsgType[conversationType], MessageUtil.ArrayForm(modules.toArrayBuffer()), targetId, {
                onSuccess: function(data: any) {
                    var list = data.list.reverse();
                    self.lastReadTime.set(conversationType + targetId, MessageUtil.int64ToTimestamp(data.syncTime));
                    for (var i = 0; i < list.length; i++) {
                        list[i] = MessageUtil.messageParser(list[i]);
                    }
                    callback.onSuccess(list, !!data.hasMsg);
                },
                onError: function() {
                    callback.onError(ErrorCode.UNKNOWN);
                }
            }, "HistoryMessagesOuput");
        }

        // TODO: Date or Number ?
        getRemoteHistoryMessages(conversationType: ConversationType, targetId: string, dateTime: Date, count: number, callback: ResultCallback<Message[]>) {
            throw new Error("Not implemented yet");
        }
        /**
         * [hasUnreadMessages 是否有未接收的消息，jsonp方法]
         * @param  {string}          appkey   [appkey]
         * @param  {string}          token    [token]
         * @param  {ConnectCallback} callback [返回值，参数回调]
         */
        hasUnreadMessages(appkey: string, token: string, callback: ResultCallback<Boolean>) {
            window.RCcallback = function(x: any) {
                callback.onSuccess(!!+x.status);
                xss.parentNode.removeChild(xss);
            };
            var xss = document.createElement("script");
            xss.src = "http://api.cn.rong.io/message/exist.js?appKey=" + encodeURIComponent(appkey) + "&token=" + encodeURIComponent(token) + "&callBack=RCcallback&_=" + Date.now();
            document.body.appendChild(xss);
            xss.onerror = function() {
                callback.onError(ErrorCode.UNKNOWN);
                xss.parentNode.removeChild(xss);
            };
        }

        getTotalUnreadCount(callback: ResultCallback<number>) {
            throw new Error("Not implemented yet");
        }

        getConversationUnreadCount(callback: ResultCallback<number>, ...conversationTypes: ConversationType[]) {
            throw new Error("Not implemented yet");
        }

        getUnreadCount(conversationType: ConversationType, targetId: string) {
            throw new Error("Not implemented yet");
        }

        setMessageExtra(messageId: number, value: string, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        setMessageReceivedStatus(messageId: number, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        setMessageSentStatus(messageId: number, sentStatus: SentStatus, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        // #endregion Message

        // #region TextMessage Draft

        clearTextMessageDraft(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        getTextMessageDraft(conversationType: ConversationType, targetId: string, callback: ResultCallback<string>) {
            throw new Error("Not implemented yet");
        }

        saveTextMessageDraft(conversationType: ConversationType, targetId: string, value: string, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        // #endregion TextMessage Draft

        // #region Conversation

        clearConversations(callback: ResultCallback<boolean>, ...conversationTypes: ConversationType[]) {
            conversationTypes.forEach(conversationType => {
                RongIMClient._dataAccessProvider;
            });
        }

        getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>) {
            CheckParam.getInstance().check(["number", "string", "object"], "getConversation");
            return this.conversationList.get(conversationType, targetId);
        }

        getConversationList(callback: ResultCallback<Conversation[]>, ...conversationTypes: ConversationType[]) {
            CheckParam.getInstance().check(["object"], "getConversationList");
            var modules = new Modules.RelationsInput(), self = this;
            modules.setType(1);
            RongIMClient.bridge.queryMsg(26, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function(list: any) {
                    //TODO 等待修改server接口，直接同步推相关信息
                    //userId -> sendUserId
                    //type conversationType
                    if (list.info) {
                        for (let i = 0, len = list.info.length; i < len; i++) {
                            var tempConver = list.info[i], conver = new Conversation();
                            conver.conversationType = tempConver.type;
                            // if (tempConver.type == ConversationType.PRIVATE) {
                            //     self.getUserInfo(tempConver.userId, <ResultCallback<UserInfo>>{
                            //         onSuccess: function(info: UserInfo) {
                            //             conver.conversationTitle = info.getUserName();
                            //             conver.senderUserName = info.getUserName();
                            //             conver.senderUserId = info.getUserId();
                            //             conver.targetId = Bridge._client.userId;
                            //         },
                            //         onError: function(error: any) {
                            //             console.log("getUserInfo error:" + error + ",postion->getConversationList.getUserInfo")
                            //         }
                            //     });
                            // }
                            self.conversationList.push(conver);
                        }
                    }
                    callback.onSuccess(self.conversationList)
                },
                onError: function() {
                    callback.onError(ErrorCode.CONVER_GETLIST_ERROR);
                }
            }, "RelationsOutput");
        }

        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            CheckParam.getInstance().check(["number", "string", "object"], "removeConversation");
            var d = MessageUtil.remove(this.conversationList, function(f: any) {
                return f.getTargetId() == targetId && f.getConversationType() == conversationType
            });
            if (!d) return;
            var mod = new Modules.RelationInfo();
            mod.setType(C2S[conversationType.valueOf()]);
            mod.setUserId(targetId);
            RongIMClient.bridge.queryMsg(27, MessageUtil.ArrayForm(mod.toArrayBuffer()), targetId, {
                onSuccess: function() {
                    callback.onSuccess(true);
                }, onError: function() {
                    callback.onError(ErrorCode.CONVER_REMOVE_ERROR);
                }
            });
        }

        setConversationToTop(conversationType: ConversationType, targetId: string, isTop: boolean, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        // #endregion Conversation

        // #region Notifications

        getConversationNotificationStatus(conversationType: ConversationType, targetId: string, callback: ResultCallback<ConversationNotificationStatus>) {
            throw new Error("Not implemented yet");
        }

        setConversationNotificationStatus(conversationType: ConversationType, targetId: string, notificationStatus: ConversationNotificationStatus, callback: ResultCallback<ConversationNotificationStatus>) {
            throw new Error("Not implemented yet");
        }

        getNotificationQuietHours(callback: GetNotificationQuietHoursCallback) {
            throw new Error("Not implemented yet");
        }

        removeNotificationQuietHours(callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }

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
                    callback.onSuccess();
                },
                onError: function() {
                    callback.onError(ErrorCode.JOIN_IN_DISCUSSION);
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
                    self.addMemberToDiscussion(discussId, userIdList, <OperationCallback>{
                        onSuccess: function() { },
                        onError: function(error) {
                            callback.onError(error);
                        }
                    });
                    callback.onSuccess(discussId);
                },
                onError: function() {
                    callback.onError(ErrorCode.CREATE_DISCUSSION);
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
            RongIMClient.bridge.queryMsg(4, MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback, "ChannelInfoOutput");
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
                    callback.onSuccess();
                }, onError: function() {
                    callback.onError(ErrorCode.INVITE_DICUSSION);
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
            RongIMClient.bridge.queryMsg(12, MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback);
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
            RongIMClient.bridge.queryMsg(6, MessageUtil.ArrayForm(_mod.toArrayBuffer()), groupId, callback, "GroupOutput");
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
            RongIMClient.bridge.queryMsg(8, MessageUtil.ArrayForm(modules.toArrayBuffer()), groupId, callback);
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
            modules.setGroupHashCode(MD5(part.sort().join("")));
            RongIMClient.bridge.queryMsg(13, MessageUtil.ArrayForm(modules.toArrayBuffer()), Bridge._client.userId, {
                onSuccess: function(result: number) {
                    //1为群信息不匹配需要发送给服务器进行同步，0不需要同步
                    if (result === 1) {
                        var val = new Modules.GroupInput();
                        val.setGroupInfo(info);
                        RongIMClient.bridge.queryMsg(20, MessageUtil.ArrayForm(val.toArrayBuffer()), Bridge._client.userId, {
                            onSuccess: function() {
                                callback.onSuccess();
                            },
                            onError: function() {
                                callback.onError(ErrorCode.GROUP_MATCH_ERROR);
                            }
                        }, "GroupOutput");
                    } else {
                        callback.onSuccess();
                    }
                },
                onError: function() {
                    callback.onError(ErrorCode.GROUP_SYNC_ERROR);
                }
            }, "GroupHashOutput");
        }

        // #endregion Group

        // #region ChatRoom
        /**
         * [加入聊天室]
         * @param  {string}            chatroomId   [聊天室Id]
         * @param  {number}            messageCount [拉取消息数量，-1为不拉去消息]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
        joinChatRoom(chatroomId: string, messageCount: number, callback: OperationCallback) {
            CheckParam.getInstance().check(["string", "number", "object"], "joinChatRoom");
            if (chatroomId != "") {
                Bridge._client.chatroomId = chatroomId;
            } else {
                callback.onError(ErrorCode.CHATROOM_ID_ISNULL);
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
                            RongIMClient._storageProvider.setItem(Bridge._client.userId + 'CST', sync);
                            var list = collection.list;
                            for (var i = 0; i < list.length; i++) {
                                Bridge._client.handler.onReceived(list[i])
                            }
                        },
                        onError: function(x: any) {
                            callback.onError(ErrorCode.CHATROOM_HISMESSAGE_ERROR);
                        }
                    }, "DownStreamMessages");
                },
                onError: function() {
                    callback.onError(ErrorCode.CHARTOOM_JOIN_ERROR);
                }
            }, "ChrmOutput");
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
            RongIMClient.bridge.queryMsg(17, MessageUtil.ArrayForm(e.toArrayBuffer()), chatroomId, callback, "ChrmOutput")
        }

        // #endregion ChatRoom

        // #region Public Service

        getPublicServiceList(callback: ResultCallback<PublicServiceProfile[]>) {
            throw new Error("Not implemented yet");
        }

        getPublicServiceProfile(publicServiceType: PublicServiceType, publicServiceId: string, callback: ResultCallback<PublicServiceProfile>) {
            throw new Error("Not implemented yet");
        }

        searchPublicService(searchType: SearchType, keywords: string, callback: ResultCallback<PublicServiceProfile[]>) {
            throw new Error("Not implemented yet");
        }

        searchPublicServiceByType(publicServiceType: PublicServiceType, searchType: SearchType, keywords: string, callback: ResultCallback<PublicServiceProfile[]>) {
            throw new Error("Not implemented yet");
        }

        subscribePublicService(publicServiceType: PublicServiceType, publicServiceId: string, callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }

        unsubscribePublicService(publicServiceType: PublicServiceType, publicServiceId: string, callback: OperationCallback) {
            throw new Error("Not implemented yet");
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
            this.getCurrentUserInfo(<ResultCallback<UserInfo>>{
                onSuccess: function(info: UserInfo) {
                    var uId = info.getUserId();
                    modules.setUserId(userId);
                    RongIMClient.bridge.queryMsg(21, MessageUtil.ArrayForm(modules.toArrayBuffer()), uId, callback);
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
            this.getCurrentUserInfo({
                onSuccess: function(info) {
                    var uId = info.getUserId();
                    modules.setUserId(userId);
                    RongIMClient.bridge.queryMsg(24, MessageUtil.ArrayForm(modules.toArrayBuffer()), uId, {
                        onSuccess: function(status: number) {
                            callback.onSuccess(BlacklistStatus[status]);
                        }, onError: function() {
                            callback.onError(ErrorCode.BLACK_GETSTATUS_ERROR);
                        }
                    });
                },
                onError: function() {
                    callback.onError(ErrorCode.BLACK_GETSTATUS_ERROR);
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
            this.getCurrentUserInfo({
                onSuccess: function(info) {
                    var uId = info.getUserId();
                    modules.setUserId(userId);
                    RongIMClient.bridge.queryMsg(22, MessageUtil.ArrayForm(modules.toArrayBuffer()), uId, callback);
                },
                onError: function() {
                    console.log(ErrorCode.BLACK_REMOVE_ERROR);
                }
            });
        }

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
        //
    }
    //兼容AMD CMD
    if ("function" === typeof require && "object" === typeof module && module && module.id && "object" === typeof exports && exports) {
        module.exports = RongIMClient
    } else if ("function" === typeof define && define.amd) {
        define('RongIMLib', [], function() {
            return RongIMClient;
        });
    } else {
        window.RongIMClient = RongIMClient;
    }
}
