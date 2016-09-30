declare function md5(str: string): any;
declare var Modules: any;
declare var require: any;
declare var module: any;
declare var define: any;
declare var exports: any;
declare var dcodeIO: any;
declare var Polling: any;
declare var escape: any;
declare var AMR: any;
declare var swfobject: any;
declare var openDatabase: any;
declare var AgoraRTC: any;
declare var Qiniu: any;
declare var plupload: any;
declare var QiniuJsSDK: any;
declare interface AgoraRTC {
    init: any;
    join: any;
    unpublish: any;
    publish: any;
    on: any;
    subscribe: any;
    leave: any;
}
declare class XDomainRequest { }
declare interface Navigator {
    webkitGetUserMedia: any;
    mozGetUserMedia: any;
    msGetUserMedia: any;
    getUserMedia: any;
    cancelAnimationFrame: any;
    webkitCancelAnimationFrame: any;
    mozCancelAnimationFrame: any;
    requestAnimationFrame: any;
    webkitRequestAnimationFrame: any;
    mozRequestAnimationFrame: any;
}
declare interface Window {
    WebSocket: WebSocket;
    Notifications: any;
    RCCallback: any;
    RongIMClient: any;
    getServerEndpoint: any;
    WEB_XHR_POLLING: any;
    SCHEMETYPE: any;
    XDomainRequest: any;
    JSON: any;
    Modules: any;
    handleFileSelect: any;
    AudioContext: any;
    webkitAudioContext: any;
    webkitURL: any;
}
declare interface Document {
    createStyleSheet: any;
}
declare interface HTMLScriptElement {
    onreadystatechange: any;
    readyState: any;
}
declare interface Date {
    toGMTString: any;
}

declare interface ArrayConstructor {
    forEach: any;
}

declare interface Document {
    attachEvent: any;
    detachEvent: any;
}

declare interface Addon {
    initWithAppkey(appKey: string): void;

    connectWithToken(token: string, userId: string): void;

    reconnect(callback: RongIMLib.ConnectCallback): void;

    logout(): void;

    disconnect(isDisconnect:boolean): void;

    setConnectionStatusListener(listener: Function): void;

    setOnReceiveMessageListener(listener: Function): void;

    sendReceiptResponse(conversationType: RongIMLib.ConversationType, targetId: string, sendCallback: RongIMLib.SendMessageCallback): void;

    sendTypingStatusMessage(conversationType: RongIMLib.ConversationType, targetId: string, messageName: string, sendCallback: RongIMLib.SendMessageCallback): void;

    sendTextMessage(conversationType: RongIMLib.ConversationType, targetId: string, content: string, sendMessageCallback: RongIMLib.SendMessageCallback): void;

    getRemoteHistoryMessages(conversationType: RongIMLib.ConversationType, targetId: string, timestamp: number, count: number, callback: RongIMLib.GetHistoryMessagesCallback): void;

    hasRemoteUnreadMessages(token: string, callback: RongIMLib.ResultCallback<Boolean>): void;

    getRemoteConversationList(callback: RongIMLib.ResultCallback<RongIMLib.Conversation[]>, conversationTypes: RongIMLib.ConversationType[], count: number): void;

    removeConversation(conversationType: RongIMLib.ConversationType, targetId: string, callback: RongIMLib.ResultCallback<boolean>): void;

    addMemberToDiscussion(discussionId: string, userIdList: string[], callback: RongIMLib.OperationCallback): void;

    createDiscussion(name: string, userIdList: string[], callback: RongIMLib.CreateDiscussionCallback): void;

    getDiscussion(discussionId: string, callback: RongIMLib.ResultCallback<RongIMLib.Discussion>): void;

    quitDiscussion(discussionId: string, callback: RongIMLib.OperationCallback): void;

    removeMemberFromDiscussion(discussionId: string, userId: string, callback: RongIMLib.OperationCallback): void;

    setDiscussionInviteStatus(discussionId: string, status: RongIMLib.DiscussionInviteStatus, callback: RongIMLib.OperationCallback): void;

    setDiscussionName(discussionId: string, name: string, callback: RongIMLib.OperationCallback): void;

    joinGroup(groupId: string, groupName: string, callback: RongIMLib.OperationCallback): void;

    quitGroup(groupId: string, callback: RongIMLib.OperationCallback): void;

    syncGroup(groups: Array<RongIMLib.Group>, callback: RongIMLib.OperationCallback): void;

    joinChatRoom(chatroomId: string, messageCount: number, success: Function, error: Function): void;

    getChatRoomInfo(chatRoomId: string, count: number, order: RongIMLib.GetChatRoomType, callback: RongIMLib.ResultCallback<any>): void;

    quitChatRoom(chatroomId: string, success: Function, error: Function): void;

    addToBlacklist(userId: string, success: Function, error: Function): void;

    getBlacklist(success: Function, error: Function): void;

    getBlacklistStatus(userId: string, success: Function, error: Function): void;

    removeFromBlacklist(userId: string, success: Function, error: Function): void;

    getFileToken(fileType: RongIMLib.FileType, callback: RongIMLib.ResultCallback<string>): void;

    getFileUrl(fileType: RongIMLib.FileType, fileName: string, oriName: string, callback: RongIMLib.ResultCallback<string>): void;

    sendMessage(conversationType: RongIMLib.ConversationType, targetId: string, objectname: string, messageContent: string, pushText: string, appData: string, progress: Function, success: Function, error: Function): void;

    registerMessageType(messageType: string, persistentFlag: number): void;

    addConversation(conversation: RongIMLib.Conversation, callback: RongIMLib.ResultCallback<boolean>): void;

    updateConversation(conversation: RongIMLib.Conversation): RongIMLib.Conversation;

    removeConversation(conversationType: RongIMLib.ConversationType, targetId: string): RongIMLib.Conversation;

    insertMessage(conversationType: number, targetId: string, senderUserId: string, objectName: string, content: string, success: Function, error: Function): string;

    deleteMessages(delMsgs: number[]): void;

    getMessage(messageId: string): RongIMLib.Message;

    updateMessage(message: RongIMLib.Message, callback?: RongIMLib.ResultCallback<RongIMLib.Message>): void;

    clearMessages(conversationType: RongIMLib.ConversationType, targetId: string): void;

    updateMessages(conversationType: RongIMLib.ConversationType, targetId: string, key: string, value: any, callback: RongIMLib.ResultCallback<boolean>): void;

    getConversation(conversationType: RongIMLib.ConversationType, targetId: string): string;

    getConversationList(): string;

    clearConversations(conversationType?: number, targetId?: string): void;

    getHistoryMessages(conversationType: RongIMLib.ConversationType, targetId: string, timestamp: number, count: number): string;

    getTotalUnreadCount(conversationTypes?: number[]): number;

    getConversationUnreadCount(conversationTypes: RongIMLib.ConversationType[], callback: RongIMLib.ResultCallback<number>): void;

    getUnreadCount(conversationType: RongIMLib.ConversationType, targetId: string): number;

    clearUnreadCount(conversationType: RongIMLib.ConversationType, targetId: string, callback: RongIMLib.ResultCallback<boolean>): void;

    setConversationToTop(conversationType: RongIMLib.ConversationType, targetId: string, isTop: boolean): void;

    setMessageExtra(messageId: string, value: string, callback: RongIMLib.ResultCallback<boolean>): void;

    setMessageReceivedStatus(messageId: string, receivedStatus: RongIMLib.ReceivedStatus): void;

    setMessageSentStatus(messageId: string, sentStatus: RongIMLib.SentStatus): void;
}
