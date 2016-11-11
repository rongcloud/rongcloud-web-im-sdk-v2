module RongIMLib {
    export interface DataAccessProvider {

        database: any;

        init(appKey: string): void;

        connect(token: string, callback: ConnectCallback, userId?: string): void;

        reconnect(callback: ConnectCallback): void;

        logout(): void;

        disconnect(): void;

        setConnectionStatusListener(listener: ConnectionStatusListener): void;

        setOnReceiveMessageListener(listener: OnReceiveMessageListener): void;

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

        joinGroup(groupId: string, groupName: string, callback: OperationCallback): void;

        quitGroup(groupId: string, callback: OperationCallback): void;

        syncGroup(groups: Array<Group>, callback: OperationCallback): void;

        joinChatRoom(chatroomId: string, messageCount: number, callback: OperationCallback): void;

        getChatRoomInfo(chatRoomId: string, count: number, order: GetChatRoomType, callback: ResultCallback<any>): void;

        quitChatRoom(chatroomId: string, callback: OperationCallback): void;

        addToBlacklist(userId: string, callback: OperationCallback): void;

        getBlacklist(callback: GetBlacklistCallback): void;

        getBlacklistStatus(userId: string, callback: ResultCallback<string>): void;

        removeFromBlacklist(userId: string, callback: OperationCallback): void;

        getFileToken(fileType: FileType, callback: ResultCallback<string>): void;

        getFileUrl(fileType: FileType, fileName: string, oriName: string, callback: ResultCallback<string>): void;

        sendMessage(conversationType: ConversationType, targetId: string, messageContent: MessageContent, sendCallback: SendMessageCallback, mentiondMsg?: boolean, pushText?: string, appData?: string, methodType?: number): void;

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

        getHistoryMessages(conversationType: ConversationType, targetId: string, timestamp: number, count: number, callback: GetHistoryMessagesCallback): void;

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

        getUserStatus(userId:string, callback:ResultCallback<UserStatus>) : void;

        setUserStatus(userId:number, callback:ResultCallback<boolean>) : void;

        setOnReceiveStatusListener(callback:Function) : void;

        subscribeUserStatus(userIds:string[], callback:ResultCallback<boolean> ): void;

        clearUnreadCountByTimestamp(conversationType: ConversationType, targetId: string, timestamp:number, callback: ResultCallback<boolean>) : void;
    }
}
