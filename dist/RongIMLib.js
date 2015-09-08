var RongIMLib;
(function (RongIMLib) {
    (function (BlacklistStatus) {
        BlacklistStatus[BlacklistStatus["IN_BLACK_LIST"] = 0] = "IN_BLACK_LIST";
        BlacklistStatus[BlacklistStatus["NOT_IN_BLACK_LIST"] = 1] = "NOT_IN_BLACK_LIST";
    })(RongIMLib.BlacklistStatus || (RongIMLib.BlacklistStatus = {}));
    var BlacklistStatus = RongIMLib.BlacklistStatus;
    (function (ConnectionChannel) {
        ConnectionChannel[ConnectionChannel["XHR_POLLING"] = 0] = "XHR_POLLING";
        ConnectionChannel[ConnectionChannel["FLASH"] = 1] = "FLASH";
        ConnectionChannel[ConnectionChannel["WEBSOCKET"] = 2] = "WEBSOCKET";
    })(RongIMLib.ConnectionChannel || (RongIMLib.ConnectionChannel = {}));
    var ConnectionChannel = RongIMLib.ConnectionChannel;
    (function (ConnectionStatus) {
        ConnectionStatus[ConnectionStatus["CONNECTED"] = 0] = "CONNECTED";
        ConnectionStatus[ConnectionStatus["CONNECTING"] = 1] = "CONNECTING";
        ConnectionStatus[ConnectionStatus["DISCONNECTED"] = 2] = "DISCONNECTED";
        ConnectionStatus[ConnectionStatus["KICKED_OFFLINE_BY_OTHER_CLIENT"] = 6] = "KICKED_OFFLINE_BY_OTHER_CLIENT";
        ConnectionStatus[ConnectionStatus["NETWORK_UNAVAILABLE"] = -1] = "NETWORK_UNAVAILABLE";
    })(RongIMLib.ConnectionStatus || (RongIMLib.ConnectionStatus = {}));
    var ConnectionStatus = RongIMLib.ConnectionStatus;
    (function (ConversationNotificationStatus) {
        ConversationNotificationStatus[ConversationNotificationStatus["DO_NOT_DISTURB"] = 0] = "DO_NOT_DISTURB";
        ConversationNotificationStatus[ConversationNotificationStatus["NOTIFY"] = 1] = "NOTIFY";
    })(RongIMLib.ConversationNotificationStatus || (RongIMLib.ConversationNotificationStatus = {}));
    var ConversationNotificationStatus = RongIMLib.ConversationNotificationStatus;
    (function (ConversationType) {
        ConversationType[ConversationType["NONE"] = 0] = "NONE";
        ConversationType[ConversationType["PRIVATE"] = 1] = "PRIVATE";
        ConversationType[ConversationType["DISCUSSION"] = 2] = "DISCUSSION";
        ConversationType[ConversationType["GROUP"] = 3] = "GROUP";
        ConversationType[ConversationType["CHATROOM"] = 4] = "CHATROOM";
        ConversationType[ConversationType["CUSTOMER_SERVICE"] = 5] = "CUSTOMER_SERVICE";
        ConversationType[ConversationType["SYSTEM"] = 6] = "SYSTEM";
        ConversationType[ConversationType["APP_PUBLIC_SERVICE"] = 7] = "APP_PUBLIC_SERVICE";
        ConversationType[ConversationType["PUBLIC_SERVICE"] = 8] = "PUBLIC_SERVICE";
    })(RongIMLib.ConversationType || (RongIMLib.ConversationType = {}));
    var ConversationType = RongIMLib.ConversationType;
    (function (DiscussionInviteStatus) {
        DiscussionInviteStatus[DiscussionInviteStatus["OPENED"] = 0] = "OPENED";
        DiscussionInviteStatus[DiscussionInviteStatus["CLOSED"] = 1] = "CLOSED";
    })(RongIMLib.DiscussionInviteStatus || (RongIMLib.DiscussionInviteStatus = {}));
    var DiscussionInviteStatus = RongIMLib.DiscussionInviteStatus;
    (function (ErrorCode) {
        ErrorCode[ErrorCode["UNKNOWN"] = -1] = "UNKNOWN";
        ErrorCode[ErrorCode["CONNECTED"] = 0] = "CONNECTED";
        ErrorCode[ErrorCode["NOT_IN_DISCUSSION"] = 21406] = "NOT_IN_DISCUSSION";
        ErrorCode[ErrorCode["NOT_IN_GROUP"] = 22406] = "NOT_IN_GROUP";
        ErrorCode[ErrorCode["NOT_IN_CHATROOM"] = 23406] = "NOT_IN_CHATROOM";
        ErrorCode[ErrorCode["REJECTED_BY_BLACKLIST"] = 405] = "REJECTED_BY_BLACKLIST";
        ErrorCode[ErrorCode["RC_NET_CHANNEL_INVALID"] = 30001] = "RC_NET_CHANNEL_INVALID";
        ErrorCode[ErrorCode["RC_NET_UNAVAILABLE"] = 30002] = "RC_NET_UNAVAILABLE";
        ErrorCode[ErrorCode["RC_MSG_RESP_TIMEOUT"] = 30003] = "RC_MSG_RESP_TIMEOUT";
        ErrorCode[ErrorCode["RC_HTTP_SEND_FAIL"] = 30004] = "RC_HTTP_SEND_FAIL";
        ErrorCode[ErrorCode["RC_HTTP_REQ_TIMEOUT"] = 30005] = "RC_HTTP_REQ_TIMEOUT";
        ErrorCode[ErrorCode["RC_HTTP_RECV_FAIL"] = 30006] = "RC_HTTP_RECV_FAIL";
        ErrorCode[ErrorCode["RC_NAVI_RESOURCE_ERROR"] = 30007] = "RC_NAVI_RESOURCE_ERROR";
        ErrorCode[ErrorCode["RC_NODE_NOT_FOUND"] = 30008] = "RC_NODE_NOT_FOUND";
        ErrorCode[ErrorCode["RC_DOMAIN_NOT_RESOLVE"] = 30009] = "RC_DOMAIN_NOT_RESOLVE";
        ErrorCode[ErrorCode["RC_SOCKET_NOT_CREATED"] = 30010] = "RC_SOCKET_NOT_CREATED";
        ErrorCode[ErrorCode["RC_SOCKET_DISCONNECTED"] = 30011] = "RC_SOCKET_DISCONNECTED";
        ErrorCode[ErrorCode["RC_PING_SEND_FAIL"] = 30012] = "RC_PING_SEND_FAIL";
        ErrorCode[ErrorCode["RC_PONG_RECV_FAIL"] = 30013] = "RC_PONG_RECV_FAIL";
        ErrorCode[ErrorCode["RC_MSG_SEND_FAIL"] = 30014] = "RC_MSG_SEND_FAIL";
        ErrorCode[ErrorCode["RC_CONN_ACK_TIMEOUT"] = 31000] = "RC_CONN_ACK_TIMEOUT";
        ErrorCode[ErrorCode["RC_CONN_PROTO_VERSION_ERROR"] = 31001] = "RC_CONN_PROTO_VERSION_ERROR";
        ErrorCode[ErrorCode["RC_CONN_ID_REJECT"] = 31002] = "RC_CONN_ID_REJECT";
        ErrorCode[ErrorCode["RC_CONN_SERVER_UNAVAILABLE"] = 31003] = "RC_CONN_SERVER_UNAVAILABLE";
        ErrorCode[ErrorCode["RC_CONN_USER_OR_PASSWD_ERROR"] = 31004] = "RC_CONN_USER_OR_PASSWD_ERROR";
        ErrorCode[ErrorCode["RC_CONN_NOT_AUTHRORIZED"] = 31005] = "RC_CONN_NOT_AUTHRORIZED";
        ErrorCode[ErrorCode["RC_CONN_REDIRECTED"] = 31006] = "RC_CONN_REDIRECTED";
        ErrorCode[ErrorCode["RC_CONN_PACKAGE_NAME_INVALID"] = 31007] = "RC_CONN_PACKAGE_NAME_INVALID";
        ErrorCode[ErrorCode["RC_CONN_APP_BLOCKED_OR_DELETED"] = 31008] = "RC_CONN_APP_BLOCKED_OR_DELETED";
        ErrorCode[ErrorCode["RC_CONN_USER_BLOCKED"] = 31009] = "RC_CONN_USER_BLOCKED";
        ErrorCode[ErrorCode["RC_DISCONN_KICK"] = 31010] = "RC_DISCONN_KICK";
        ErrorCode[ErrorCode["RC_DISCONN_EXCEPTION"] = 31011] = "RC_DISCONN_EXCEPTION";
        ErrorCode[ErrorCode["RC_QUERY_ACK_NO_DATA"] = 32001] = "RC_QUERY_ACK_NO_DATA";
        ErrorCode[ErrorCode["RC_MSG_DATA_INCOMPLETE"] = 32002] = "RC_MSG_DATA_INCOMPLETE";
        ErrorCode[ErrorCode["BIZ_ERROR_CLIENT_NOT_INIT"] = 33001] = "BIZ_ERROR_CLIENT_NOT_INIT";
        ErrorCode[ErrorCode["BIZ_ERROR_DATABASE_ERROR"] = 33002] = "BIZ_ERROR_DATABASE_ERROR";
        ErrorCode[ErrorCode["BIZ_ERROR_INVALID_PARAMETER"] = 33003] = "BIZ_ERROR_INVALID_PARAMETER";
        ErrorCode[ErrorCode["BIZ_ERROR_NO_CHANNEL"] = 33004] = "BIZ_ERROR_NO_CHANNEL";
        ErrorCode[ErrorCode["BIZ_ERROR_RECONNECT_SUCCESS"] = 33005] = "BIZ_ERROR_RECONNECT_SUCCESS";
        ErrorCode[ErrorCode["BIZ_ERROR_CONNECTING"] = 33006] = "BIZ_ERROR_CONNECTING";
    })(RongIMLib.ErrorCode || (RongIMLib.ErrorCode = {}));
    var ErrorCode = RongIMLib.ErrorCode;
    (function (MediaType) {
        MediaType[MediaType["IMAGE"] = 1] = "IMAGE";
        MediaType[MediaType["AUDIO"] = 2] = "AUDIO";
        MediaType[MediaType["VIDEO"] = 3] = "VIDEO";
        MediaType[MediaType["FILE"] = 100] = "FILE";
    })(RongIMLib.MediaType || (RongIMLib.MediaType = {}));
    var MediaType = RongIMLib.MediaType;
    (function (MessageDirection) {
        MessageDirection[MessageDirection["SEND"] = 1] = "SEND";
        MessageDirection[MessageDirection["RECEIVE"] = 2] = "RECEIVE";
    })(RongIMLib.MessageDirection || (RongIMLib.MessageDirection = {}));
    var MessageDirection = RongIMLib.MessageDirection;
    (function (MessageTag) {
        MessageTag[MessageTag["NONE"] = 0] = "NONE";
        MessageTag[MessageTag["ISPERSISTED"] = 1] = "ISPERSISTED";
        MessageTag[MessageTag["ISCOUNTED"] = 2] = "ISCOUNTED";
    })(RongIMLib.MessageTag || (RongIMLib.MessageTag = {}));
    var MessageTag = RongIMLib.MessageTag;
    (function (PublicServiceType) {
        PublicServiceType[PublicServiceType["APP_PUBLIC_SERVICE"] = 7] = "APP_PUBLIC_SERVICE";
        PublicServiceType[PublicServiceType["PUBLIC_SERVICE"] = 8] = "PUBLIC_SERVICE";
    })(RongIMLib.PublicServiceType || (RongIMLib.PublicServiceType = {}));
    var PublicServiceType = RongIMLib.PublicServiceType;
    (function (RealTimeLocationErrorCode) {
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_NOT_INIT"] = -1] = "RC_REAL_TIME_LOCATION_NOT_INIT";
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_SUCCESS"] = 0] = "RC_REAL_TIME_LOCATION_SUCCESS";
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_GPS_DISABLED"] = 1] = "RC_REAL_TIME_LOCATION_GPS_DISABLED";
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_CONVERSATION_NOT_SUPPORT"] = 2] = "RC_REAL_TIME_LOCATION_CONVERSATION_NOT_SUPPORT";
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_IS_ON_GOING"] = 3] = "RC_REAL_TIME_LOCATION_IS_ON_GOING";
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_EXCEED_MAX_PARTICIPANT"] = 4] = "RC_REAL_TIME_LOCATION_EXCEED_MAX_PARTICIPANT";
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_JOIN_FAILURE"] = 5] = "RC_REAL_TIME_LOCATION_JOIN_FAILURE";
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_START_FAILURE"] = 6] = "RC_REAL_TIME_LOCATION_START_FAILURE";
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_NETWORK_UNAVAILABLE"] = 7] = "RC_REAL_TIME_LOCATION_NETWORK_UNAVAILABLE";
    })(RongIMLib.RealTimeLocationErrorCode || (RongIMLib.RealTimeLocationErrorCode = {}));
    var RealTimeLocationErrorCode = RongIMLib.RealTimeLocationErrorCode;
    (function (RealTimeLocationStatus) {
        RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_IDLE"] = 0] = "RC_REAL_TIME_LOCATION_STATUS_IDLE";
        RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_INCOMING"] = 1] = "RC_REAL_TIME_LOCATION_STATUS_INCOMING";
        RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_OUTGOING"] = 2] = "RC_REAL_TIME_LOCATION_STATUS_OUTGOING";
        RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_CONNECTED"] = 3] = "RC_REAL_TIME_LOCATION_STATUS_CONNECTED";
    })(RongIMLib.RealTimeLocationStatus || (RongIMLib.RealTimeLocationStatus = {}));
    var RealTimeLocationStatus = RongIMLib.RealTimeLocationStatus;
    (function (ReceivedStatus) {
        ReceivedStatus[ReceivedStatus["READ"] = 1] = "READ";
        ReceivedStatus[ReceivedStatus["LISTENED"] = 2] = "LISTENED";
        ReceivedStatus[ReceivedStatus["DOWNLOADED"] = 4] = "DOWNLOADED";
    })(RongIMLib.ReceivedStatus || (RongIMLib.ReceivedStatus = {}));
    var ReceivedStatus = RongIMLib.ReceivedStatus;
    (function (SearchType) {
        SearchType[SearchType["EXACT"] = 0] = "EXACT";
        SearchType[SearchType["FUZZY"] = 1] = "FUZZY";
    })(RongIMLib.SearchType || (RongIMLib.SearchType = {}));
    var SearchType = RongIMLib.SearchType;
    (function (SentStatus) {
        SentStatus[SentStatus["SENDING"] = 10] = "SENDING";
        SentStatus[SentStatus["FAILED"] = 20] = "FAILED";
        SentStatus[SentStatus["SENT"] = 30] = "SENT";
        SentStatus[SentStatus["RECEIVED"] = 40] = "RECEIVED";
        SentStatus[SentStatus["READ"] = 50] = "READ";
        SentStatus[SentStatus["DESTROYED"] = 60] = "DESTROYED";
    })(RongIMLib.SentStatus || (RongIMLib.SentStatus = {}));
    var SentStatus = RongIMLib.SentStatus;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var RongIMClient = (function () {
        function RongIMClient() {
            console.log('constructor');
        }
        RongIMClient.getInstance = function () {
            console.log('getInstance');
            return RongIMClient._instance;
        };
        RongIMClient.init = function (appKey, forceConnectionChannel, forceLocalStorageProvider) {
            console.log('init');
            if (!RongIMClient._instance) {
                RongIMClient._instance = new RongIMClient();
            }
            RongIMClient._appKey = appKey;
            RongIMClient._connectionChannel = forceConnectionChannel;
            if (forceLocalStorageProvider) {
                RongIMClient._storageProvider = forceLocalStorageProvider;
                RongIMClient._dataAccessProvider = forceLocalStorageProvider.getDataAccessProvider();
            }
            else {
            }
            RongIMClient.registerMessageType("RC:TxtMsg", RongIMLib.MessageTag.ISPERSISTED | RongIMLib.MessageTag.ISCOUNTED);
        };
        RongIMClient.connect = function (token, callback) {
            return RongIMClient._instance;
        };
        RongIMClient.registerMessageType = function (objectName, msgTag) {
        };
        RongIMClient.setConnectionStatusListener = function (listener) {
        };
        RongIMClient.setOnReceiveMessageListener = function (listener) {
        };
        RongIMClient.prototype.disconnect = function () {
        };
        RongIMClient.prototype.logout = function (callback) {
        };
        RongIMClient.prototype.getCurrentConnectionStatus = function () {
            return null;
        };
        RongIMClient.prototype.getConnectionChannel = function () {
            return RongIMClient._connectionChannel;
        };
        RongIMClient.prototype.getStorageProvider = function () {
            return RongIMClient._storageProvider;
        };
        RongIMClient.prototype.getCurrentUserId = function () {
            return this._currentUserId;
        };
        RongIMClient.prototype.getCurrentUserInfo = function (callback) {
        };
        RongIMClient.prototype.syncUserData = function (userData, callback) {
        };
        RongIMClient.prototype.getDeltaTime = function (callback) {
        };
        RongIMClient.prototype.clearMessages = function (conversationType, targetId, callback) {
            RongIMClient._dataAccessProvider.clearMessages(conversationType, targetId);
        };
        RongIMClient.prototype.clearMessagesUnreadStatus = function (conversationType, targetId, callback) {
            RongIMClient._dataAccessProvider.updateMessages(conversationType, targetId, "readStatus", false);
        };
        RongIMClient.prototype.deleteMessages = function (conversationType, targetId, messageIds, callback) {
        };
        RongIMClient.prototype.sendMessage = function (conversationType, targetId, messageContent, sendCallback, resultCallback, pushContent, pushData) {
        };
        RongIMClient.prototype.sendStatusMessage = function (message, sendCallback, resultCallback) {
        };
        RongIMClient.prototype.sendTextMessage = function () {
        };
        RongIMClient.prototype.insertMessage = function (conversationType, targetId, senderUserId, content, callback) {
        };
        RongIMClient.prototype.getHistoryMessages = function (conversationType, targetId, oldestMessageId, count, callback, objectName) {
        };
        RongIMClient.prototype.getRemoteHistoryMessages = function (conversationType, targetId, dateTime, count, callback) {
        };
        RongIMClient.prototype.hasUnreadMessages = function (appkey, token, callback) {
        };
        RongIMClient.prototype.getTotalUnreadCount = function (callback) {
        };
        RongIMClient.prototype.getConversationUnreadCount = function (callback) {
            var conversationTypes = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                conversationTypes[_i - 1] = arguments[_i];
            }
        };
        RongIMClient.prototype.getUnreadCount = function (conversationType, targetId) {
        };
        RongIMClient.prototype.setMessageExtra = function (messageId, value, callback) {
        };
        RongIMClient.prototype.setMessageReceivedStatus = function (messageId, receivedStatus, callback) {
        };
        RongIMClient.prototype.setMessageSentStatus = function (messageId, sentStatus, callback) {
        };
        RongIMClient.prototype.clearTextMessageDraft = function (conversationType, targetId, callback) {
        };
        RongIMClient.prototype.getTextMessageDraft = function (conversationType, targetId, callback) {
        };
        RongIMClient.prototype.saveTextMessageDraft = function (conversationType, targetId, value, callback) {
        };
        RongIMClient.prototype.clearConversations = function (callback) {
            var conversationTypes = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                conversationTypes[_i - 1] = arguments[_i];
            }
            conversationTypes.forEach(function (conversationType) {
                RongIMClient._dataAccessProvider;
            });
        };
        RongIMClient.prototype.getConversation = function (conversationType, targetId, callback) {
        };
        RongIMClient.prototype.getConversationList = function (callback) {
            var conversationTypes = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                conversationTypes[_i - 1] = arguments[_i];
            }
        };
        RongIMClient.prototype.removeConversation = function (conversationType, targetId, callback) {
        };
        RongIMClient.prototype.setConversationToTop = function (conversationType, targetId, isTop, callback) {
        };
        RongIMClient.prototype.getConversationNotificationStatus = function (conversationType, targetId, callback) {
        };
        RongIMClient.prototype.setConversationNotificationStatus = function (conversationType, targetId, notificationStatus, callback) {
        };
        RongIMClient.prototype.getNotificationQuietHours = function (callback) {
        };
        RongIMClient.prototype.removeNotificationQuietHours = function (callback) {
        };
        RongIMClient.prototype.setNotificationQuietHours = function (startTime, spanMinutes, callback) {
        };
        RongIMClient.prototype.addMemberToDiscussion = function (discussionId, userIdList, callback) {
        };
        RongIMClient.prototype.createDiscussion = function (name, userIdList, callback) {
        };
        RongIMClient.prototype.getDiscussion = function (discussionId, callback) {
        };
        RongIMClient.prototype.quitDiscussion = function (discussionId, callback) {
        };
        RongIMClient.prototype.removeMemberFromDiscussion = function (discussionId, userId, callback) {
        };
        RongIMClient.prototype.setDiscussionInviteStatus = function (discussionId, status, callback) {
        };
        RongIMClient.prototype.setDiscussionName = function (discussionId, name, callback) {
        };
        RongIMClient.prototype.joinGroup = function (groupId, groupName, callback) {
        };
        RongIMClient.prototype.quitGroup = function (groupId, callback) {
        };
        RongIMClient.prototype.syncGroup = function (groups, callback) {
        };
        RongIMClient.prototype.joinChatRoom = function (chatroomId, messageCount, callback) {
        };
        RongIMClient.prototype.quitChatRoom = function (chatroomId, callback) {
        };
        RongIMClient.prototype.getPublicServiceList = function (callback) {
        };
        RongIMClient.prototype.getPublicServiceProfile = function (publicServiceType, publicServiceId, callback) {
        };
        RongIMClient.prototype.searchPublicService = function (searchType, keywords, callback) {
        };
        RongIMClient.prototype.searchPublicServiceByType = function (publicServiceType, searchType, keywords, callback) {
        };
        RongIMClient.prototype.subscribePublicService = function (publicServiceType, publicServiceId, callback) {
        };
        RongIMClient.prototype.unsubscribePublicService = function (publicServiceType, publicServiceId, callback) {
        };
        RongIMClient.prototype.addToBlacklist = function (userId, callback) {
        };
        RongIMClient.prototype.getBlacklist = function (callback) {
        };
        RongIMClient.prototype.getBlacklistStatus = function (userId, callback) {
        };
        RongIMClient.prototype.removeFromBlacklist = function (userId, callback) {
        };
        RongIMClient.prototype.addRealTimeLocationListener = function (conversationType, targetId, listener) {
        };
        RongIMClient.prototype.getRealTimeLocation = function (conversationType, targetId) {
        };
        RongIMClient.prototype.getRealTimeLocationCurrentState = function (conversationType, targetId) {
        };
        RongIMClient.prototype.getRealTimeLocationParticipants = function (conversationType, targetId) {
        };
        RongIMClient.prototype.joinRealTimeLocation = function (conversationType, targetId) {
        };
        RongIMClient.prototype.quitRealTimeLocation = function (conversationType, targetId) {
        };
        RongIMClient.prototype.startRealTimeLocation = function (conversationType, targetId) {
        };
        RongIMClient.prototype.updateRealTimeLocationStatus = function (conversationType, targetId, latitude, longitude) {
        };
        return RongIMClient;
    })();
    RongIMLib.RongIMClient = RongIMClient;
})(RongIMLib || (RongIMLib = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RongIMLib;
(function (RongIMLib) {
    var MessageContent = (function () {
        function MessageContent(data) {
            throw new Error("This method is abstract, you must implement this method in inherited class.");
        }
        MessageContent.obtain = function () {
            throw new Error("This method is abstract, you must implement this method in inherited class.");
        };
        return MessageContent;
    })();
    RongIMLib.MessageContent = MessageContent;
    var NotificationMessage = (function (_super) {
        __extends(NotificationMessage, _super);
        function NotificationMessage() {
            _super.apply(this, arguments);
        }
        return NotificationMessage;
    })(MessageContent);
    RongIMLib.NotificationMessage = NotificationMessage;
    var StatusMessage = (function (_super) {
        __extends(StatusMessage, _super);
        function StatusMessage() {
            _super.apply(this, arguments);
        }
        return StatusMessage;
    })(MessageContent);
    RongIMLib.StatusMessage = StatusMessage;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var IsTypingStatusMessage = (function () {
        function IsTypingStatusMessage(data) {
        }
        IsTypingStatusMessage.prototype.encode = function () {
            return undefined;
        };
        return IsTypingStatusMessage;
    })();
    RongIMLib.IsTypingStatusMessage = IsTypingStatusMessage;
    var HandshakeMessage = (function () {
        function HandshakeMessage(data) {
        }
        HandshakeMessage.prototype.encode = function () {
            return undefined;
        };
        return HandshakeMessage;
    })();
    RongIMLib.HandshakeMessage = HandshakeMessage;
    var SuspendMessage = (function () {
        function SuspendMessage(data) {
        }
        SuspendMessage.prototype.encode = function () {
            return undefined;
        };
        return SuspendMessage;
    })();
    RongIMLib.SuspendMessage = SuspendMessage;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var InformationNotificationMessage = (function () {
        function InformationNotificationMessage(data) {
        }
        InformationNotificationMessage.obtain = function (message) {
            return undefined;
        };
        InformationNotificationMessage.prototype.encode = function () {
            return undefined;
        };
        return InformationNotificationMessage;
    })();
    RongIMLib.InformationNotificationMessage = InformationNotificationMessage;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var TextMessage = (function () {
        function TextMessage(data) {
            if (!TextMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead.");
            }
        }
        TextMessage.obtain = function (content) {
            var message = new TextMessage();
            message.content = content;
            return message;
        };
        TextMessage.prototype.encode = function () {
            return JSON.stringify(this);
        };
        return TextMessage;
    })();
    RongIMLib.TextMessage = TextMessage;
    var VoiceMessage = (function () {
        function VoiceMessage(data) {
            if (!VoiceMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead.");
            }
        }
        VoiceMessage.obtain = function (base64Content, duration) {
            var message = new VoiceMessage();
            message._base64Content = base64Content;
            message.duration = duration;
            return message;
        };
        VoiceMessage.prototype.encode = function () {
            return JSON.stringify(this);
        };
        return VoiceMessage;
    })();
    RongIMLib.VoiceMessage = VoiceMessage;
    var ImageMessage = (function () {
        function ImageMessage(data) {
        }
        ImageMessage.obtain = function (content) {
            return undefined;
        };
        ImageMessage.prototype.encode = function () {
            return JSON.stringify(this);
        };
        return ImageMessage;
    })();
    RongIMLib.ImageMessage = ImageMessage;
    var LocationMessage = (function () {
        function LocationMessage(data) {
        }
        LocationMessage.obtain = function (latitude, longitude, poi, imgUri) {
            return undefined;
        };
        LocationMessage.prototype.encode = function () {
            return JSON.stringify(this);
        };
        return LocationMessage;
    })();
    RongIMLib.LocationMessage = LocationMessage;
    var UnknownMessage = (function () {
        function UnknownMessage(data) {
        }
        UnknownMessage.prototype.encode = function () {
            return JSON.stringify(this);
        };
        return UnknownMessage;
    })();
    RongIMLib.UnknownMessage = UnknownMessage;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var Conversation = (function () {
        function Conversation(conversationTitle, conversationType, draft, isTop, latestMessage, latestMessageId, notificationStatus, objectName, ReceivedStatus, receivedTime, senderUserId, senderUserName, sentStatus, sentTime, targetId, unreadMessageCount) {
            this.conversationTitle = conversationTitle;
            this.conversationType = conversationType;
            this.draft = draft;
            this.isTop = isTop;
            this.latestMessage = latestMessage;
            this.latestMessageId = latestMessageId;
            this.notificationStatus = notificationStatus;
            this.objectName = objectName;
            this.ReceivedStatus = ReceivedStatus;
            this.receivedTime = receivedTime;
            this.senderUserId = senderUserId;
            this.senderUserName = senderUserName;
            this.sentStatus = sentStatus;
            this.sentTime = sentTime;
            this.targetId = targetId;
            this.unreadMessageCount = unreadMessageCount;
        }
        return Conversation;
    })();
    RongIMLib.Conversation = Conversation;
    var Discussion = (function () {
        function Discussion(creatorId, id, memberIdList, name, isOpen) {
            this.creatorId = creatorId;
            this.id = id;
            this.memberIdList = memberIdList;
            this.name = name;
            this.isOpen = isOpen;
        }
        return Discussion;
    })();
    RongIMLib.Discussion = Discussion;
    var Group = (function () {
        function Group(id, name, portraitUri) {
            this.id = id;
            this.name = name;
            this.portraitUri = portraitUri;
        }
        return Group;
    })();
    RongIMLib.Group = Group;
    var Message = (function () {
        function Message(content, conversationType, extra, messageDirection, messageId, objectName, receivedStatus, receivedTime, senderUserId, sentStatus, sentTime, targetId) {
            this.content = content;
            this.conversationType = conversationType;
            this.extra = extra;
            this.messageDirection = messageDirection;
            this.messageId = messageId;
            this.objectName = objectName;
            this.receivedStatus = receivedStatus;
            this.receivedTime = receivedTime;
            this.senderUserId = senderUserId;
            this.sentStatus = sentStatus;
            this.sentTime = sentTime;
            this.targetId = targetId;
        }
        return Message;
    })();
    RongIMLib.Message = Message;
    var PublicServiceProfile = (function () {
        function PublicServiceProfile(name, portraitUri, publicServiceId, hasFollowed, introduction, isGolbal) {
            this.name = name;
            this.portraitUri = portraitUri;
            this.publicServiceId = publicServiceId;
            this.hasFollowed = hasFollowed;
            this.introduction = introduction;
            this.isGolbal = isGolbal;
        }
        return PublicServiceProfile;
    })();
    RongIMLib.PublicServiceProfile = PublicServiceProfile;
    var UserData = (function () {
        function UserData(accountInfo, appVersion, clientInfo, contactInfo, extra, personalInfo) {
            this.accountInfo = accountInfo;
            this.appVersion = appVersion;
            this.clientInfo = clientInfo;
            this.contactInfo = contactInfo;
            this.extra = extra;
            this.personalInfo = personalInfo;
        }
        return UserData;
    })();
    RongIMLib.UserData = UserData;
    var UserInfo = (function () {
        function UserInfo(userId, name, portraitUri) {
            this.userId = userId;
            this.name = name;
            this.portraitUri = portraitUri;
        }
        return UserInfo;
    })();
    RongIMLib.UserInfo = UserInfo;
    var UserData;
    (function (UserData) {
        var AccountInfo = (function () {
            function AccountInfo(appUserId, nickname, username) {
                this.appUserId = appUserId;
                this.nickname = nickname;
                this.username = username;
            }
            return AccountInfo;
        })();
        UserData.AccountInfo = AccountInfo;
        var ClientInfo = (function () {
            function ClientInfo(carrier, device, mobilePhoneManufacturer, network, os, systemVersion) {
                this.carrier = carrier;
                this.device = device;
                this.mobilePhoneManufacturer = mobilePhoneManufacturer;
                this.network = network;
                this.os = os;
                this.systemVersion = systemVersion;
            }
            return ClientInfo;
        })();
        UserData.ClientInfo = ClientInfo;
        var ContactInfo = (function () {
            function ContactInfo(address, email, qq, tel, weiBo, weiXin) {
                this.address = address;
                this.email = email;
                this.qq = qq;
                this.tel = tel;
                this.weiBo = weiBo;
                this.weiXin = weiXin;
            }
            return ContactInfo;
        })();
        UserData.ContactInfo = ContactInfo;
        var PersonalInfo = (function () {
            function PersonalInfo(age, birthday, comment, job, portraitUri, realName, sex) {
                this.age = age;
                this.birthday = birthday;
                this.comment = comment;
                this.job = job;
                this.portraitUri = portraitUri;
                this.realName = realName;
                this.sex = sex;
            }
            return PersonalInfo;
        })();
        UserData.PersonalInfo = PersonalInfo;
    })(UserData = RongIMLib.UserData || (RongIMLib.UserData = {}));
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var DataAccessProviderBase = (function () {
        function DataAccessProviderBase() {
        }
        DataAccessProviderBase.prototype.composeConversationKey = function (conversationType, targetId) {
            return "_rc_ct_" + conversationType + "_" + targetId;
        };
        return DataAccessProviderBase;
    })();
    RongIMLib.DataAccessProviderBase = DataAccessProviderBase;
})(RongIMLib || (RongIMLib = {}));
//# sourceMappingURL=RongIMLib.js.map