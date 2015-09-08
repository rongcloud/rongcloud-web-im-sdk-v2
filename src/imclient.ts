module RongIMLib {
  export class RongIMClient {
    // Basic properties.

    // Business properties.
    private _currentUserId: string;

    // Static properties.
    private static _instance: RongIMClient;
    private static _appKey: string;
    private static _connectionChannel: ConnectionChannel;
    private static _storageProvider: StorageProvider;
    private static _dataAccessProvider: DataAccessProvider;

    /**
     * 构造函数。
     * 不能通过此函数获取 RongIMClient 实例。
     * 请使用 RongIMClient.getInstrance() 获取 RongIMClient 实例。
     */
    constructor() {
      console.log('constructor');

    }

    /**
     * 获取 RongIMClient 实例。
     * 需在执行 init 方法初始化 SDK 后再获取，否则返回 null 值。
     */
    static getInstance(): RongIMClient {
      console.log('getInstance');
      return RongIMClient._instance;
    }

    /**
     * 初始化 SDK，在整个应用全局只需要调用一次。
     *
     * @param appKey    开发者后台申请的 AppKey，用来标识应用。
     */
    static init(appKey: string, forceConnectionChannel?: ConnectionChannel, forceLocalStorageProvider?: StorageProvider): void {
      console.log('init');
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

      RongIMClient.registerMessageType("RC:TxtMsg", MessageTag.ISPERSISTED | MessageTag.ISCOUNTED);
    }

    /**
     * 连接服务器，在整个应用全局只需要调用一次，断线后 SDK 会自动重连。
     *
     * @param token     从服务端获取的用户身份令牌（Token）。
     * @param callback  连接回调，返回连接的成功或者失败状态。
     */
    static connect(token: string, callback: ConnectCallback): RongIMClient {
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

    }

    /**
     * 设置连接状态变化的监听器。
     *
     * @param listener  连接状态变化的监听器。
     */
    static setConnectionStatusListener(listener: ConnectionStatusListener): void {

    }

    /**
     * 设置接收消息的监听器。
     *
     * @param listener  接收消息的监听器。
     */
    static setOnReceiveMessageListener(listener: OnReceiveMessageListener): void {

    }

    /**
     * 断开连接，但是保留当前用户与设备的登录关系，继续接收推送（Push）消息。
     */
    disconnect(): void {

    }

    /**
     * 断开连接，并且注销当前用户与设备的登录关系，不再接收推送（Push）消息。
     * TODO: Should there be a callback?
     *
     * @param callback  操作成功或者失败的回调。
     */
    logout(callback: OperationCallback): void {

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

    // #region Message

    clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
      RongIMClient._dataAccessProvider.clearMessages(conversationType, targetId);
    }

    clearMessagesUnreadStatus(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>) {
      RongIMClient._dataAccessProvider.updateMessages(conversationType, targetId, "readStatus", false);
    }

    deleteMessages(conversationType: ConversationType, targetId: string, messageIds: number[], callback: ResultCallback<boolean>) {

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
      conversationTypes.forEach(conversationType => {
        RongIMClient._dataAccessProvider;

      });
    }

    getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>) {

    }

    getConversationList(callback: ResultCallback<Conversation[]>, ...conversationTypes: ConversationType[]) {

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

    setDiscussionName(discussionId: string, name: string, callback: OperationCallback) {

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
