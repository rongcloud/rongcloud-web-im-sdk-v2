module RongIMLib {
    export class RongIMClient {
        private _connectionChannel: ConnectionChannel;
        private _localStorageProvider;
        private _appKey: string;
        private static _instance: RongIMClient = new RongIMClient();

        /**
         * 构造函数。
         * 不能通过此函数获取 RongIMClient 实例。
         * 请使用 RongIMClient.getInstrance() 获取 RongIMClient 实例。
         */
        constructor() {
            if (!RongIMClient._instance) {
                throw new Error("Instantiation failed: Use RongIMClient.getInstance() instead of new.");
            }

            RongIMClient._instance = this;
        }

        /**
         * 获取 RongIMClient 实例。
         * 需在执行 init 方法初始化 SDK 后再获取，否则返回 null 值。
         */
        static getInstance(): RongIMClient {
            if (RongIMClient._instance) {
                return RongIMClient._instance;
            } else {
                return null;
            }
        }

        /**
         * 初始化 SDK，在整个应用全局只需要调用一次。
         *
         * @param appKey    开发者后台申请的 AppKey，用来标识应用。
         */
        init(appKey: string, forceConnectionChannel?: ConnectionChannel, localStorageProvider?: LocalStorageProvider) {
            RongIMClient._instance = this;
            this._appKey = appKey;
            this._connectionChannel = forceConnectionChannel;

            if (localStorageProvider) {
                this._localStorageProvider = localStorageProvider;
            } else {
                // Use default provider by browser engine and version.
            }

            this.registerMessageType("RC:TxtMsg", MessageTag.ISPERSISTED | MessageTag.ISCOUNTED)
        }

        /**
         * 连接服务器，在整个应用全局只需要调用一次，断线后 SDK 会自动重连。
         *
         * @param token     从服务端获取的用户身份令牌（Token）。
         * @param callback  连接回调，返回连接的成功或者失败状态。
         */
        connect(token: string, callback: ConnectCallback) {

        }

        /**
         * 断开连接，但是保留当前用户与设备的登录关系，继续接收推送（Push）消息。
         */
        disconnect() {

        }

        /**
         * 断开连接，并且注销当前用户与设备的登录关系，不再接收推送（Push）消息。
         * TODO: Should there be a callback?
         *
         * @param callback  操作成功或者失败的回调。
         */
        logout(callback: OperationCallback) {

        }

        /**
         * 设置连接状态变化的监听器。
         *
         * @param listener  连接状态变化的监听器。
         */
        setConnectionStatusListener(listener: ConnectionStatusListener) {

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
            return null;
        }

        /**
         * 获取当前使用的本地储存提供者。
         */
        getLocalStorageProvider(): LocalStorageProvider {
            return null;
        }

        /**
         * 获取当前连接用户的 UserId。
         */
        getCurrentUserId(): string {
            return null;
        }

        /**
         * 获取当前连接用户的信息。
         */
        getCurrentUserInfo(callback: ResultCallback<UserInfo>) {

        }

        /**
         * 提交用户数据到服务器，以便后台业务（如：客服系统）使用。
         *
         * @param userData  用户数据信息。
         * @param callback  操作成功或者失败的回调。
         */
        syncUserData(userData: UserData, callback: OperationCallback) {

        }

        /**
         * 获取本地时间与服务器时间的差值，单位为毫秒。
         *
         * @param callback  获取的回调，返回时间差值。
         */
        getDeltaTime(callback: ResultCallback<number>) {

        }

        /**
         * 清除 Web Notification 通知数据。
         */
        clearWebNotifications() {

        }

        // #region Message

        /**
         * 注册消息类型，用于注册用户自定义的消息。
         * 内建的消息类型已经注册过，不需要再次注册。
         *
         * @param objectName  用户数据信息。
         * @param msgTag      操作成功或者失败的回调。
         */
        registerMessageType(objectName: string, msgTag: MessageTag) {

        }

        /**
         * 设置接收消息的监听器。
         *
         * @param listener  接收消息的监听器。
         */
        setOnReceiveMessageListener(listener: OnReceiveMessageListener) {

        }

        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {

        }

        clearMessagesUnreadStatus(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {

        }

        deleteMessages(messageIds: number[], callback: ResultCallback<boolean>) {

        }

        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback, resultCallback: ResultCallback<Message>, pushContent?: string, pushData?: string) {

        }

        // sendMessage(message: Message, sendCallback: SendMessageCallback, resultCallback: ResultCallback<Message>, pushContent?: string, pushData?: string) {
        //
        // }

        sendStatusMessage(message: Message, sendCallback: SendMessageCallback, resultCallback: ResultCallback<Message>) {

        }

        sendTextMessage() {

        }

        insertMessage(conversationType: ConversationType, targetId: string, senderUserId: string, content: MessageContent, callback: ResultCallback<Message>) {

        }

        getHistoryMessages(conversationType: ConversationType, targetId: string, oldestMessageId: number, count: number, callback: ResultCallback<Message[]>, objectName?: string) {

        }

        // TODO: Date or Number ?
        getRemoteHistoryMessages(conversationType: ConversationType, targetId: string, dateTime: Date, count: number, callback: ResultCallback<Message[]>) {

        }

        hasUnreadMessages(appkey: string, token: string, callback: ConnectCallback) {

        }

        getTotalUnreadCount(callback: ResultCallback<number>) {

        }

        getConversationUnreadCount(callback: ResultCallback<number>, ...conversationTypes: ConversationType[]) {

        }

        getUnreadCount(conversationType: ConversationType, targetId: string) {

        }

        setMessageExtra(messageId: number, value: string, callback: ResultCallback<boolean>) {

        }

        setMessageReceivedStatus(messageId: number, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>) {

        }

        setMessageSentStatus(messageId: number, sentStatus: SentStatus, callback: ResultCallback<boolean>) {

        }

        // #endregion Message

        // #region TextMessage Draft

        clearTextMessageDraft(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {

        }

        getTextMessageDraft(conversationType: ConversationType, targetId: string, callback: ResultCallback<string>) {

        }

        saveTextMessageDraft(conversationType: ConversationType, targetId: string, value: string, callback: ResultCallback<boolean>) {

        }

        // #endregion TextMessage Draft

        // #region Conversation

        clearConversations(callback: ResultCallback<boolean>, ...conversationTypes: ConversationType[]) {

        }

        getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>) {

        }

        getConversationList(callback: ResultCallback<Conversation[]>, ...conversationTypes: ConversationType[]) {

        }

        getGroupConversationList(callback: ResultCallback<Conversation[]>) {

        }

        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {

        }

        setConversationToTop(conversationType: ConversationType, targetId: string, isTop: boolean, callback: ResultCallback<boolean>) {

        }

        // #endregion Conversation

        // #region Notifications

        getConversationNotificationStatus(conversationType: ConversationType, targetId: string, callback: ResultCallback<ConversationNotificationStatus>) {

        }

        setConversationNotificationStatus(conversationType: ConversationType, targetId: string, notificationStatus: ConversationNotificationStatus, callback: ResultCallback<ConversationNotificationStatus>) {

        }

        getNotificationQuietHours(callback: GetNotificationQuietHoursCallback) {

        }

        removeNotificationQuietHours(callback: OperationCallback) {

        }

        setNotificationQuietHours(startTime: string, spanMinutes: number, callback: OperationCallback) {

        }

        // #endregion Notifications

        // #region Discussion

        addMemberToDiscussion(discussionId: string, userIdList: string[], callback: OperationCallback) {
        }

        createDiscussion(name: string, userIdList: string[], callback: CreateDiscussionCallback) {

        }

        getDiscussion(discussionId: string, callback: ResultCallback<Discussion>) {

        }

        quitDiscussion(discussionId: string, callback: OperationCallback) {

        }

        removeMemberFromDiscussion(discussionId: string, userId: string, callback: OperationCallback) {

        }

        setDiscussionInviteStatus(discussionId: string, status: DiscussionInviteStatus, callback: OperationCallback) {

        }

        setDiscussionName(discussionId, name, callback: OperationCallback) {

        }

        // #endregion Discussion

        // #region Group

        joinGroup(groupId: string, groupName: string, callback: OperationCallback) {

        }

        quitGroup(groupId: string, callback: OperationCallback) {

        }

        syncGroup(groups: Group[], callback: OperationCallback) {

        }

        // #endregion Group

        // #region ChatRoom

        joinChatRoom(chatroomId: string, messageCount: number, callback: OperationCallback) {

        }

        quitChatRoom(chatroomId: string, callback: OperationCallback) {

        }

        // #endregion ChatRoom

        // #region Public Service

        getPublicServiceList(callback: ResultCallback<PublicServiceProfile[]>) {

        }

        getPublicServiceProfile(publicServiceType: PublicServiceType, publicServiceId: string, callback: ResultCallback<PublicServiceProfile>) {

        }

        searchPublicService(searchType: SearchType, keywords: string, callback: ResultCallback<PublicServiceProfile[]>) {

        }

        searchPublicServiceByType(publicServiceType: PublicServiceType, searchType: SearchType, keywords: string, callback: ResultCallback<PublicServiceProfile[]>) {

        }

        subscribePublicService(publicServiceType: PublicServiceType, publicServiceId: string, callback: OperationCallback) {

        }

        unsubscribePublicService(publicServiceType: PublicServiceType, publicServiceId: string, callback: OperationCallback) {

        }

        // #endregion Public Service

        // #region Blacklist

        addToBlacklist(userId: string, callback: OperationCallback) {

        }

        getBlacklist(callback: GetBlacklistCallback) {

        }

        getBlacklistStatus(userId: string, callback: ResultCallback<BlacklistStatus>) {

        }

        removeFromBlacklist(userId: string, callback: OperationCallback) {

        }

        // #endregion Blacklist

        // #region Real-time Location Service

        addRealTimeLocationListener(conversationType: ConversationType, targetId: string, listener: RealTimeLocationListener) {

        }

        getRealTimeLocation(conversationType: ConversationType, targetId: string) {

        }

        getRealTimeLocationCurrentState(conversationType: ConversationType, targetId: string) {

        }

        getRealTimeLocationParticipants(conversationType: ConversationType, targetId: string) {

        }

        joinRealTimeLocation(conversationType: ConversationType, targetId: string) {

        }

        quitRealTimeLocation(conversationType: ConversationType, targetId: string) {

        }

        startRealTimeLocation(conversationType: ConversationType, targetId: string) {

        }

        updateRealTimeLocationStatus(conversationType: ConversationType, targetId: string, latitude: number, longitude: number) {

        }

        // #endregion Real-time Location Service
    }
}
