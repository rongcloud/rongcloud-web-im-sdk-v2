module RongIMLib {

    export enum MentionedType {
        ALL = 1,
        PART = 2
    }

    export enum MethodType {
        CUSTOMER_SERVICE = 1, 
        RECALL = 2
    }

    export enum BlacklistStatus {
        /**
         * 在黑名单中。
         */
        IN_BLACK_LIST = 0,

        /**
         * 不在黑名单中。
         */
        NOT_IN_BLACK_LIST = 1
    }

    export enum ConnectionChannel {

        XHR_POLLING = 0,

        WEBSOCKET = 1,
        //外部调用
        HTTP = 0,
        //外部调用
        HTTPS = 1
    }

    export enum CustomerType {

        ONLY_ROBOT = 1,

        ONLY_HUMAN = 2,

        ROBOT_FIRST = 3,

        HUMAN_FIRST = 4

    }

    export enum GetChatRoomType {

        NONE = 0,

        SQQUENCE = 1,

        REVERSE = 2
    }

    export enum ConnectionStatus {
        /**
         * 连接成功。
         */
        CONNECTED = 0,

        /**
         * 连接中。
         */
        CONNECTING = 1,

        /**
         * 断开连接。
         */
        DISCONNECTED = 2,

        /**
         * 用户账户在其他设备登录，本机会被踢掉线。
         */
        KICKED_OFFLINE_BY_OTHER_CLIENT = 6,

        /**
         * 网络不可用。
         */
        NETWORK_UNAVAILABLE = 3,

        /**
         * 域名错误
         */
        DOMAIN_INCORRECT = 12,
        /**
        *  连接关闭。
        */
        CONNECTION_CLOSED = 4
    }

    export enum ConversationNotificationStatus {
        /**
         * 免打扰状态，关闭对应会话的通知提醒。
         */
        DO_NOT_DISTURB,

        /**
         * 提醒。
         */
        NOTIFY
    }

    export enum ConversationType {
        NONE = 0,
        PRIVATE = 1,
        DISCUSSION = 2,
        GROUP = 3,
        CHATROOM = 4,
        CUSTOMER_SERVICE = 5,
        SYSTEM = 6,
        //默认关注 MC
        APP_PUBLIC_SERVICE = 7,
        //手工关注 MP
        PUBLIC_SERVICE = 8
    }

    export enum DiscussionInviteStatus {
        /**
         * 开放邀请。
         */
        OPENED = 0,

        /**
         * 关闭邀请。
         */
        CLOSED = 1
    }

    export enum ErrorCode {

        /**
         * 发送频率过快
         */
        SEND_FREQUENCY_TOO_FAST = 20604,

        RC_MSG_UNAUTHORIZED = 20406,
        /**
         * 群组 Id 无效
         */
        RC_DISCUSSION_GROUP_ID_INVALID = 20407,
        /**
         * 群组被禁言
         */
        FORBIDDEN_IN_GROUP = 22408,
        /**
         * 不在讨论组。
         */
        NOT_IN_DISCUSSION = 21406,
        /**
         * 不在群组。
         */
        NOT_IN_GROUP = 22406,
        /**
         * 不在聊天室。
         */
        NOT_IN_CHATROOM = 23406,
        /**
         *聊天室被禁言
         */
        FORBIDDEN_IN_CHATROOM = 23408,
        /**
         * 聊天室中成员被踢出
         */
        RC_CHATROOM_USER_KICKED = 23409,
        /**
         * 聊天室不存在
         */
        RC_CHATROOM_NOT_EXIST = 23410,
        /**
         * 聊天室成员已满
         */
        RC_CHATROOM_IS_FULL = 23411,
        /**
         * 获取聊天室信息参数无效
         */
        RC_CHATROOM_PATAMETER_INVALID = 23412,
        /**
         * 聊天室异常
         */
        CHATROOM_GET_HISTORYMSG_ERROR = 23413,
        /**
         * 没有打开聊天室消息存储
         */
        CHATROOM_NOT_OPEN_HISTORYMSG_STORE  = 23414,

        TIMEOUT = -1,
        /**
         * 未知原因失败。
         */
        UNKNOWN = -2,

        /**
         * 加入讨论失败
         */
        JOIN_IN_DISCUSSION = 21407,
        /**
         * 创建讨论组失败
         */
        CREATE_DISCUSSION = 21408,
        /**
         * 设置讨论组邀请状态失败
         */
        INVITE_DICUSSION = 21409,



        /**
         *获取用户失败
         */
        GET_USERINFO_ERROR = 23407,

        /**
         * 在黑名单中。
         */
        REJECTED_BY_BLACKLIST = 405,

        /**
         * 通信过程中，当前 Socket 不存在。
         */
        RC_NET_CHANNEL_INVALID = 30001,

        /**
         * Socket 连接不可用。
         */
        RC_NET_UNAVAILABLE = 30002,

        /**
         * 通信超时。
         */
        RC_MSG_RESP_TIMEOUT = 30003,

        /**
         * 导航操作时，Http 请求失败。
         */
        RC_HTTP_SEND_FAIL = 30004,

        /**
         * HTTP 请求失败。
         */
        RC_HTTP_REQ_TIMEOUT = 30005,

        /**
         * HTTP 接收失败。
         */
        RC_HTTP_RECV_FAIL = 30006,

        /**
         * 导航操作的 HTTP 请求，返回不是200。
         */
        RC_NAVI_RESOURCE_ERROR = 30007,

        /**
         * 导航数据解析后，其中不存在有效数据。
         */
        RC_NODE_NOT_FOUND = 30008,

        /**
         * 导航数据解析后，其中不存在有效 IP 地址。
         */
        RC_DOMAIN_NOT_RESOLVE = 30009,

        /**
         * 创建 Socket 失败。
         */
        RC_SOCKET_NOT_CREATED = 30010,

        /**
         * Socket 被断开。
         */
        RC_SOCKET_DISCONNECTED = 30011,

        /**
         * PING 操作失败。
         */
        RC_PING_SEND_FAIL = 30012,

        /**
         * PING 超时。
         */
        RC_PONG_RECV_FAIL = 30013,
        /**
         * 消息发送失败。
         */
        RC_MSG_SEND_FAIL = 30014,

        /**
         * 做 connect 连接时，收到的 ACK 超时。
         */
        RC_CONN_ACK_TIMEOUT = 31000,

        /**
         * 参数错误。
         */
        RC_CONN_PROTO_VERSION_ERROR = 31001,

        /**
         * 参数错误，App Id 错误。
         */
        RC_CONN_ID_REJECT = 31002,

        /**
         * 服务器不可用。
         */
        RC_CONN_SERVER_UNAVAILABLE = 31003,

        /**
         * Token 错误。
         */
        RC_CONN_USER_OR_PASSWD_ERROR = 31004,

        /**
         * App Id 与 Token 不匹配。
         */
        RC_CONN_NOT_AUTHRORIZED = 31005,

        /**
         * 重定向，地址错误。
         */
        RC_CONN_REDIRECTED = 31006,

        /**
         * NAME 与后台注册信息不一致。
         */
        RC_CONN_PACKAGE_NAME_INVALID = 31007,

        /**
         * APP 被屏蔽、删除或不存在。
         */
        RC_CONN_APP_BLOCKED_OR_DELETED = 31008,

        /**
         * 用户被屏蔽。
         */
        RC_CONN_USER_BLOCKED = 31009,

        /**
         * Disconnect，由服务器返回，比如用户互踢。
         */
        RC_DISCONN_KICK = 31010,

        /**
         * Disconnect，由服务器返回，比如用户互踢。
         */
        RC_DISCONN_EXCEPTION = 31011,

        /**
         * 协议层内部错误。query，上传下载过程中数据错误。
         */
        RC_QUERY_ACK_NO_DATA = 32001,

        /**
         * 协议层内部错误。
         */
        RC_MSG_DATA_INCOMPLETE = 32002,

        /**
         * 未调用 init 初始化函数。
         */
        BIZ_ERROR_CLIENT_NOT_INIT = 33001,

        /**
         * 数据库初始化失败。
         */
        BIZ_ERROR_DATABASE_ERROR = 33002,

        /**
         * 传入参数无效。
         */
        BIZ_ERROR_INVALID_PARAMETER = 33003,

        /**
         * 通道无效。
         */
        BIZ_ERROR_NO_CHANNEL = 33004,

        /**
         * 重新连接成功。
         */
        BIZ_ERROR_RECONNECT_SUCCESS = 33005,
        /**
         * 连接中，再调用 connect 被拒绝。
         */
        BIZ_ERROR_CONNECTING = 33006,
        /**
         * 消息漫游服务未开通
         */
        MSG_ROAMING_SERVICE_UNAVAILABLE = 33007,

        MSG_INSERT_ERROR = 33008,

        MSG_DEL_ERROR = 33009,

        /**
         * 删除会话失败
         */
        CONVER_REMOVE_ERROR = 34001,
        /**
         *拉取历史消息
         */
        CONVER_GETLIST_ERROR = 34002,
        /**
         * 会话指定异常
         */
        CONVER_SETOP_ERROR = 34003,
        /**
         * 获取会话未读消息总数失败
         */
        CONVER_TOTAL_UNREAD_ERROR = 34004,
        /**
         * 获取指定会话类型未读消息数异常
         */
        CONVER_TYPE_UNREAD_ERROR = 34005,
        /**
         * 获取指定用户ID&会话类型未读消息数异常
         */
        CONVER_ID_TYPE_UNREAD_ERROR = 34006,

        CONVER_CLEAR_ERROR = 34007,

        CONVER_GET_ERROR = 34008,

        //群组异常信息
        /**
         *
         */
        GROUP_SYNC_ERROR = 35001,
        /**
         * 匹配群信息系异常
         */
        GROUP_MATCH_ERROR = 35002,

        //聊天室异常
        /**
         * 加入聊天室Id为空
         */
        CHATROOM_ID_ISNULL = 36001,
        /**
         * 加入聊天室失败
         */
        CHARTOOM_JOIN_ERROR = 36002,
        /**
         * 拉取聊天室历史消息失败
         */
        CHATROOM_HISMESSAGE_ERROR = 36003,
        //黑名单异常
        /**
         * 加入黑名单异常
         */
        BLACK_ADD_ERROR = 37001,
        /**
         * 获得指定人员再黑名单中的状态异常
         */
        BLACK_GETSTATUS_ERROR = 37002,
        /**
         * 移除黑名单异常
         */
        BLACK_REMOVE_ERROR = 37003,
        /**
         * 获取草稿失败
         */
        DRAF_GET_ERROR = 38001,
        /**
         * 保存草稿失败
         */
        DRAF_SAVE_ERROR = 38002,
        /**
         * 删除草稿失败
         */
        DRAF_REMOVE_ERROR = 38003,
        /**
         * 关注公众号失败
         */
        SUBSCRIBE_ERROR = 39001,
        /**
         * 关注公众号失败
         */
        QNTKN_FILETYPE_ERROR = 41001,
        /**
         * 获取七牛token失败
         */
        QNTKN_GET_ERROR = 41002,
        /**
         * cookie被禁用
         */
        COOKIE_ENABLE = 51001,

        GET_MESSAGE_BY_ID_ERROR = 61001,

        // 没有注册DeviveId 也就是用户没有登陆
        HAVNODEVICEID = 24001,

        // 已经存在
        DEVICEIDISHAVE = 24002,

        // 成功
        SUCCESS = 0,

        // 没有对应的用户或token
        FEILD = 24009,

        // voip为空
        VOIPISNULL = 24013,

        // 不支持的Voip引擎
        NOENGINETYPE = 24010,

        // channleName 是空
        NULLCHANNELNAME = 24011,

        // 生成Voipkey失败
        VOIPDYANMICERROR = 24012,

        // 没有配置voip
        NOVOIP = 24014,

        // 服务器内部错误
        INTERNALERRROR = 24015,

        //VOIP close
        VOIPCLOSE = 24016,

        CLOSE_BEFORE_OPEN = 51001,

        ALREADY_IN_USE = 51002,

        INVALID_CHANNEL_NAME = 51003,

        VIDEO_CONTAINER_IS_NULL = 51004,

        /**
        * 删除消息数组长度为 0 .
        */
        DELETE_MESSAGE_ID_IS_NULL = 61001,
        /*!
        己方取消已发出的通话请求
        */
        CANCEL = 1,
        /*!
         己方拒绝收到的通话请求
         */
        REJECT = 2,
        /*!
         己方挂断
         */
        HANGUP = 3,
        /*!
         己方忙碌
         */
        BUSYLINE = 4,
        /*!
         己方未接听
         */
        NO_RESPONSE = 5,
        /*!
         己方不支持当前引擎
         */
        ENGINE_UN_SUPPORTED = 6,
        /*!
         己方网络出错
         */
        NETWORK_ERROR = 7,
        /*!
         对方取消已发出的通话请求
         */
        REMOTE_CANCEL = 11,

        /*!
         对方拒绝收到的通话请求
         */
        REMOTE_REJECT = 12,
        /*!
         通话过程对方挂断
         */
        REMOTE_HANGUP = 13,

        /*!
         对方忙碌
         */
        REMOTE_BUSYLINE = 14,
        /*!
         对方未接听
         */
        REMOTE_NO_RESPONSE = 15,
        /*!
         对方网络错误
         */
        REMOTE_ENGINE_UN_SUPPORTED = 16,
        /*!
         对方网络错误
         */
        REMOTE_NETWORK_ERROR = 17,
        /*!
         VoIP 不可用
         */
        VOIP_NOT_AVALIABLE = 18

    }
    export enum VoIPMediaType {

        MEDIA_AUDIO = 1,

        MEDIA_VEDIO = 2,
    }

    export enum MediaType {
        /**
         * 图片。
         */
        IMAGE = 1,

        /**
         * 声音。
         */
        AUDIO = 2,

        /**
         * 视频。
         */
        VIDEO = 3,

        /**
         * 通用文件。
         */
        FILE = 100
    }

    export enum MessageDirection {
        /**
         * 发送消息。
         */
        SEND = 1,

        /**
         * 接收消息。
         */
        RECEIVE = 2
    }

    export enum FileType {
        IMAGE = 1,
        AUDIO = 2,
        VIDEO = 3,
        FILE = 4
    }

    export enum RealTimeLocationErrorCode {
        /**
         * 未初始化 RealTimeLocation 实例
         */
        RC_REAL_TIME_LOCATION_NOT_INIT = -1,

        /**
         * 执行成功。
         */
        RC_REAL_TIME_LOCATION_SUCCESS = 0,

        /**
         * 获取 RealTimeLocation 实例时返回
         * GPS 未打开。
         */
        RC_REAL_TIME_LOCATION_GPS_DISABLED = 1,
        /**
         * 获取 RealTimeLocation 实例时返回
         * 当前会话不支持位置共享。
         */
        RC_REAL_TIME_LOCATION_CONVERSATION_NOT_SUPPORT = 2,

        /**
         * 获取 RealTimeLocation 实例时返回
         * 对方已发起位置共享。
         */
        RC_REAL_TIME_LOCATION_IS_ON_GOING = 3,
        /**
         * Join 时返回
         * 当前位置共享已超过最大支持人数。
         */
        RC_REAL_TIME_LOCATION_EXCEED_MAX_PARTICIPANT = 4,

        /**
         * Join 时返回
         * 加入位置共享失败。
         */
        RC_REAL_TIME_LOCATION_JOIN_FAILURE = 5,

        /**
         * Start 时返回
         * 发起位置共享失败。
         */
        RC_REAL_TIME_LOCATION_START_FAILURE = 6,

        /**
         * 网络不可用。
         */
        RC_REAL_TIME_LOCATION_NETWORK_UNAVAILABLE = 7
    }

    export enum RealTimeLocationStatus {
        /**
         * 空闲状态 （默认状态）
         * 对方或者自己都未发起位置共享业务，或者位置共享业务已结束。
         */
        RC_REAL_TIME_LOCATION_STATUS_IDLE = 0,

        /**
         * 呼入状态 （待加入）
         * 1. 对方发起了位置共享业务，此状态下，自己只能选择加入。
         * 2. 自己从已连接的位置共享中退出。
         */
        RC_REAL_TIME_LOCATION_STATUS_INCOMING = 1,

        /**
         * 呼出状态 =（自己创建）
         * 1. 自己发起位置共享业务，对方只能选择加入。
         * 2. 对方从已连接的位置共享业务中退出。
         */
        RC_REAL_TIME_LOCATION_STATUS_OUTGOING = 2,

        /**
         * 连接状态 （自己加入）
         * 对方加入了自己发起的位置共享，或者自己加入了对方发起的位置共享。
         */
        RC_REAL_TIME_LOCATION_STATUS_CONNECTED = 3
    }

    export enum ReceivedStatus {

        READ = 0x1, // 已读

        LISTENED = 0x2, // 已听

        DOWNLOADED = 0x4, // 已下载

        RETRIEVED = 0x8, 

        UNREAD = 0
    }

    export enum ReadStatus{
        
        READ = 0x1, // 已读

        LISTENED = 0x2, // 已听

        DOWNLOADED = 0x4, // 已下载

        RETRIEVED = 0x8, 

        UNREAD = 0
    }

    export enum SearchType {
        /**
         * 精确。
         */
        EXACT = 0,

        /**
         * 模糊。
         */
        FUZZY = 1
    }

    export enum SentStatus {
        /**
         * 发送中。
         */
        SENDING = 10,

        /**
         * 发送失败。
         */
        FAILED = 20,

        /**
         * 已发送。
         */
        SENT = 30,

        /**
         * 对方已接收。
         */
        RECEIVED = 40,

        /**
         * 对方已读。
         */
        READ = 50,

        /**
         * 对方已销毁。
         */
        DESTROYED = 60
    }


    export enum ConnectionState {

        ACCEPTED = 0,

        UNACCEPTABLE_PROTOCOL_VERSION = 1,

        IDENTIFIER_REJECTED = 2,

        SERVER_UNAVAILABLE = 3,
        /**
         * token无效
         */
        TOKEN_INCORRECT = 4,

        NOT_AUTHORIZED = 5,

        REDIRECT = 6,

        PACKAGE_ERROR = 7,

        APP_BLOCK_OR_DELETE = 8,

        BLOCK = 9,

        TOKEN_EXPIRE = 10,

        DEVICE_ERROR = 11
    }
}
