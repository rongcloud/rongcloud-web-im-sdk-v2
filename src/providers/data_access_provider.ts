module RongIMLib {
    export interface DataAccessProvider {

        init(appKey: string, config?: any): void;

        connect(token: string, callback: ConnectCallback, userId?: string, serverConf?: any): void;

        reconnect(callback: ConnectCallback, config?: any): void;

        logout(): void;

        disconnect(): void;

        setConnectionStatusListener(listener: ConnectionStatusListener): void;

        setOnReceiveMessageListener(listener: OnReceiveMessageListener): void;

        clearListeners(): void;

        sendReceiptResponse(conversationType: ConversationType, targetId: string, sendCallback: SendMessageCallback): void;

        sendTypingStatusMessage(conversationType: ConversationType, targetId: string, messageName: string, sendCallback: SendMessageCallback): void;

        sendTextMessage(conversationType: ConversationType, targetId: string, content: string, sendMessageCallback: SendMessageCallback): void;

        sendRecallMessage(conent:any, sendMessageCallback: SendMessageCallback, user?:UserInfo): void;

        getRemoteHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void;

        hasRemoteUnreadMessages(token: string, callback: ResultCallback<Boolean>): void;

        getRemoteConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[], count?: number,isGetHiddenConvers?:boolean): void;

        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;

        addMemberToDiscussion(discussionId: string, userIdList: string[], callback: OperationCallback): void;

        createDiscussion(name: string, userIdList: string[], callback: CreateDiscussionCallback): void;

        getDiscussion(discussionId: string, callback: ResultCallback<Discussion>): void;

        quitDiscussion(discussionId: string, callback: OperationCallback): void;

        removeMemberFromDiscussion(discussionId: string, userId: string, callback: OperationCallback): void;

        setDiscussionInviteStatus(discussionId: string, status: DiscussionInviteStatus, callback: OperationCallback): void;

        setDiscussionName(discussionId: string, name: string, callback: OperationCallback): void;

        joinChatRoom(chatroomId: string, messageCount: number, callback: OperationCallback): void;

        getChatRoomInfo(chatRoomId: string, count: number, order: GetChatRoomType, callback: ResultCallback<any>): void;

        setChatroomHisMessageTimestamp(chatRoomId:string, timestamp:number):void;
        
        getChatRoomHistoryMessages(chatRoomId:string, count:number, order:number, callback:ResultCallback<Message>):void;

        quitChatRoom(chatroomId: string, callback: OperationCallback): void;

        addToBlacklist(userId: string, callback: OperationCallback): void;

        getBlacklist(callback: GetBlacklistCallback): void;

        getBlacklistStatus(userId: string, callback: ResultCallback<string>): void;

        removeFromBlacklist(userId: string, callback: OperationCallback): void;

        getFileToken(fileType: FileType, callback: ResultCallback<string>): void;

        getFileUrl(fileType: FileType, fileName: string, oriName: string, callback: ResultCallback<string>): void;

        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback, mentiondMsg?: boolean, pushText?: string, appData?: string, methodType?: number, params?:any): void;

        registerMessageType(messageType: string, objectName: string, messageTag: MessageTag, messageContent: any): void;

        addConversation(conversation: Conversation, callback: ResultCallback<boolean>): void;

        updateConversation(conversation: Conversation): Conversation;

        removeConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;

        addMessage(conversationType: ConversationType, targetId: string, message: Message, callback?: ResultCallback<Message>): void;

        removeMessage(conversationType: ConversationType, targetId: string, delMsgs: DeleteMessage[], callback: ResultCallback<boolean>): void;

        removeLocalMessage(conversationType: ConversationType, targetId: string, timestamps: number[], callback: ResultCallback<boolean>): void;

        getMessage(messageId: string, callback: ResultCallback<Message>): void;

        updateMessage(message: Message, callback?: ResultCallback<Message>): void;

        clearMessages(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;

        updateMessages(conversationType: ConversationType, targetId: string, key: string, value: any, callback: ResultCallback<boolean>): void;

        getConversation(conversationType: ConversationType, targetId: string, callback: ResultCallback<Conversation>): void;

        getConversationList(callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[], count?: number,isGetHiddenConvers?:boolean): void;

        clearConversations(conversationTypes: ConversationType[], callback: ResultCallback<boolean>): void;

        clearHistoryMessages(params: any, callback: ResultCallback<boolean>): void;

        clearRemoteHistoryMessages(params: any, callback: ResultCallback<boolean>): void;

        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback, objectname?:string, directrion?:boolean): void;

        getTotalUnreadCount(callback: ResultCallback<number>, conversationTypes?: number[]): void;

        getConversationUnreadCount(conversationTypes: ConversationType[], callback: ResultCallback<number>): void;

        getUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<number>): void;

        clearUnreadCount(conversationType: ConversationType, targetId: string, callback: ResultCallback<boolean>): void;

        setConversationToTop(conversationType: ConversationType, targetId: string, isTop: boolean, callback: ResultCallback<boolean>): void;

        setConversationHidden(conversationType:ConversationType,targetId:string,isHidden:boolean):void;

        setMessageExtra(messageId: string, value: string, callback: ResultCallback<boolean>): void;

        setMessageReceivedStatus(messageId: string, receivedStatus: ReceivedStatus, callback: ResultCallback<boolean>): void;

        setMessageSentStatus(messageId: string, sentStatus: SentStatus, callback: ResultCallback<boolean>): void;

        searchConversationByContent(keyword: string, callback: ResultCallback<Conversation[]>, conversationTypes?: ConversationType[]): void;

        searchMessageByContent(conversationType: ConversationType, targetId: string, keyword: string, timestamp: number, count: number, total: number, callback: ResultCallback<Message[]>): void;
   
        getDelaTime():number;

        setServerInfo(info:any):void;

        getUserStatus(userId: string, callback:ResultCallback<UserStatus>) : void;

        setUserStatus(status: number, callback:ResultCallback<boolean>) : void;

        setUserStatusListener(params:any, callback: Function) : void;

        subscribeUserStatus(userIds:string[], callback?:ResultCallback<boolean> ): void;
        
        clearUnreadCountByTimestamp(conversationType: ConversationType, targetId: string, timestamp:number, callback: ResultCallback<boolean>) : void;

        getUnreadMentionedMessages(conversationType:ConversationType, targetId:string):any;

        setMessageStatus(conersationType:ConversationType, targetId: string, timestamp:number, status: string, callback: ResultCallback<boolean>): void;

        setMessageContent(messageId: number, content: any, objectName: string):void;

        getConversationNotificationStatus(params:any, callback:any):void;

        setConversationNotificationStatus(params:any, callback:any):void;

        getCurrentConnectionStatus():number;

        setEnvironment(isPrivate: boolean):void;

        getAgoraDynamicKey(engineType: number, channelName: string, callback: ResultCallback<string>):void;

        getRemotePublicServiceList(callback?: ResultCallback<PublicServiceProfile[]>, pullMessageTime?: any):void;

        getPublicServiceProfile(publicServiceType: number, publicServiceId: string, callback:any): void;

        setDeviceInfo(device: any):void;

        registerMessageTypes(messages: any):void;

        clearData():boolean;
    }
}
