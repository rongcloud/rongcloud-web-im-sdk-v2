module RongIMLib {
    export class RongIMClient {
        // Basic properties.

        // Business properties.
        private _currentUserId: string;

        //token
        static _token: string;

        // Static properties.
        private static _instance: RongIMClient;
        private static _appKey: string;
        private static _connectionChannel: ConnectionChannel;
        private static _storageProvider: StorageProvider;
        private static _dataAccessProvider: DataAccessProvider;
        //桥连接类
        static bridge: Bridge;
        //存放监听数组
        static listenerList: Array<any> = [];


        /**
         * 构造函数。
         * 不能通过此函数获取 RongIMClient 实例。
         * 请使用 RongIMClient.getInstrance() 获取 RongIMClient 实例。
         */
        constructor() {
            console.log("constructor");

        }

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
        static init(appKey: string, forceConnectionChannel?: ConnectionChannel, forceLocalStorageProvider?: StorageProvider): void {
            if (!RongIMClient._instance) {
                RongIMClient._instance = new RongIMClient();
            }

            RongIMClient._appKey = appKey;
            RongIMClient._connectionChannel = forceConnectionChannel;

            if (forceLocalStorageProvider) {
                RongIMClient._storageProvider = forceLocalStorageProvider;
                RongIMClient._dataAccessProvider = forceLocalStorageProvider.getDataAccessProvider();
            } else {
                // Use default provider by browser engine and version.
            }
            // RongIMClient.registerMessageType("RC:TxtMsg", MessageTag.ISPERSISTED | MessageTag.ISCOUNTED);
        }

        /**
         * 连接服务器，在整个应用全局只需要调用一次，断线后 SDK 会自动重连。
         *
         * @param token     从服务端获取的用户身份令牌（Token）。
         * @param callback  连接回调，返回连接的成功或者失败状态。
         */
        static connect(token: string, callback: ConnectCallback): RongIMClient {
            CheckParam.getInstance().check(["string", "object"], true, "connect")
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
         *
         * @param objectName  用户数据信息。
         * @param msgTag      操作成功或者失败的回调。
         */
        static registerMessageType(objectName: string, msgTag: MessageTag): void {
            throw new Error("Not implemented yet");
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
         * 获取当前连接用户的信息。
         */
        getCurrentUserInfo(callback: ResultCallback<UserInfo>) {
            throw new Error("Not implemented yet");
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

        clearMessagesUnreadStatus(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            RongIMClient._dataAccessProvider.updateMessages(conversationType, targetId, "readStatus", false);
        }

        deleteMessages(conversationType: ConversationType, targetId: string, messageIds: number[], callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
        }

        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback, resultCallback: ResultCallback<Message>, pushContent?: string, pushData?: string) {
            throw new Error("Not implemented yet");
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

        getHistoryMessages(conversationType: ConversationType, targetId: string, oldestMessageId: number, count: number, callback: ResultCallback<Message[]>, objectName?: string) {
            throw new Error("Not implemented yet");
        }

        // TODO: Date or Number ?
        getRemoteHistoryMessages(conversationType: ConversationType, targetId: string, dateTime: Date, count: number, callback: ResultCallback<Message[]>) {
            throw new Error("Not implemented yet");
        }

        hasUnreadMessages(appkey: string, token: string, callback: ConnectCallback) {
            throw new Error("Not implemented yet");
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
            throw new Error("Not implemented yet");
        }

        getConversationList(callback: ResultCallback<Conversation[]>, ...conversationTypes: ConversationType[]) {
            throw new Error("Not implemented yet");
        }

        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
            throw new Error("Not implemented yet");
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

        addMemberToDiscussion(discussionId: string, userIdList: string[], callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }

        createDiscussion(name: string, userIdList: string[], callback: CreateDiscussionCallback) {
            throw new Error("Not implemented yet");
        }

        getDiscussion(discussionId: string, callback: ResultCallback<Discussion>) {
            throw new Error("Not implemented yet");
        }

        quitDiscussion(discussionId: string, callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }

        removeMemberFromDiscussion(discussionId: string, userId: string, callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }

        setDiscussionInviteStatus(discussionId: string, status: DiscussionInviteStatus, callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }

        setDiscussionName(discussionId: string, name: string, callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }

        // #endregion Discussion

        // #region Group

        joinGroup(groupId: string, groupName: string, callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }

        quitGroup(groupId: string, callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }

        syncGroup(groups: Group[], callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }

        // #endregion Group

        // #region ChatRoom

        joinChatRoom(chatroomId: string, messageCount: number, callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }

        quitChatRoom(chatroomId: string, callback: OperationCallback) {
            throw new Error("Not implemented yet");
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

        addToBlacklist(userId: string, callback: OperationCallback) {
            throw new Error("Not implemented yet");
        }

        getBlacklist(callback: GetBlacklistCallback) {
            throw new Error("Not implemented yet");
        }

        getBlacklistStatus(userId: string, callback: ResultCallback<BlacklistStatus>) {
            throw new Error("Not implemented yet");
        }

        removeFromBlacklist(userId: string, callback: OperationCallback) {
            throw new Error("Not implemented yet");
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
        define('RongIMLib', [], function () {
            return RongIMClient;
        });
    } else {
        window.RongIMClient = RongIMClient;
    }
}
