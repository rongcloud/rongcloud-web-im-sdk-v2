//用于连接通道
module RongIMLib {
    export enum Qos {

        AT_MOST_ONCE = 0,

        AT_LEAST_ONCE = 1,

        EXACTLY_ONCE = 2,

        DEFAULT = 3
    }

    export enum Type {

        CONNECT = 1,

        CONNACK = 2,

        PUBLISH = 3,

        PUBACK = 4,

        QUERY = 5,

        QUERYACK = 6,

        QUERYCON = 7,

        SUBSCRIBE = 8,

        SUBACK = 9,

        UNSUBSCRIBE = 10,

        UNSUBACK = 11,

        PINGREQ = 12,

        PINGRESP = 13,

        DISCONNECT = 14
    }
    var _topic: any = ["invtDiz", "crDiz", "qnUrl", "userInf", "dizInf", "userInf", "joinGrp", "quitDiz", "exitGrp", "evctDiz",
        ["", "ppMsgP", "pdMsgP", "pgMsgP", "chatMsg", "pcMsgP", "", "pmcMsgN", "pmpMsgN"], "pdOpen", "rename", "uGcmpr", "qnTkn", "destroyChrm",
        "createChrm", "exitChrm", "queryChrm", "joinChrm", "pGrps", "addBlack", "rmBlack", "getBlack", "blackStat", "addRelation", "qryRelation", "delRelation", "pullMp", "schMp", "qnTkn", "qnUrl", "qryVoipK", "delMsg", "qryCHMsg"];
    export class Channel {
        socket: Socket;
        static _ConnectionStatusListener: any;
        static _ReceiveMessageListener: any;
        connectionStatus: number = -1;
        url: string;
        self: any;
        delOnChangedCount: number = 0;
        constructor(address: any, cb: any, self: Client) {
            this.url = address.host + "/websocket?appId=" + self.appId + "&token=" + encodeURIComponent(self.token) + "&sdkVer=" + self.sdkVer + "&apiVer=" + self.apiVer;
            this.self = self;
            this.socket = Socket.getInstance().createServer();
            this.socket.connect(this.url, cb);
            //注册状态改变观察者
            if (typeof Channel._ConnectionStatusListener == "object" && "onChanged" in Channel._ConnectionStatusListener) {
                var me = this;
                me.socket.on("StatusChanged", function(code: any) {
                    me.connectionStatus = code;
                    if (code === ConnectionStatus.NETWORK_UNAVAILABLE) {
                        var temp = RongIMClient._storageProvider.getItemKey("navi");
                        var naviServer = RongIMClient._storageProvider.getItem(temp);
                        var naviPort = naviServer.split(",")[0].split(":")[1];
                        naviPort && naviPort.length < 4 || RongIMClient._storageProvider.setItem("rongSDK", "");
                        // TODO  判断拆分 naviServer 后的数组长度。
                        if (!RongIMClient._memoryStore.depend.isPolling && naviPort && naviPort.length < 4) {
                            Bridge._client.handler.connectCallback.pauseTimer();
                            var temp = RongIMClient._storageProvider.getItemKey("navi");
                            var server = RongIMClient._storageProvider.getItem("RongBackupServer");
                            if (server) {
                                var arrs = server.split(",");
                                if (arrs.length < 2) {
                                    throw new Error("navi server is empty,postion:StatusChanged");
                                }
                                RongIMClient._storageProvider.setItem(temp, RongIMLib.RongIMClient._storageProvider.getItem("RongBackupServer"));
                                var url = RongIMLib.Bridge._client.channel.socket.currentURL;
                                Bridge._client.channel.socket.currentURL = arrs[0] + url.substring(url.indexOf("/"), url.length);
                                if (Bridge._client.channel && Bridge._client.channel.connectionStatus != ConnectionStatus.CONNECTED && Bridge._client.channel.connectionStatus != ConnectionStatus.CONNECTING) {
                                    RongIMClient.connect(RongIMLib.RongIMClient._memoryStore.token, RongIMClient._memoryStore.callback);
                                }
                            }
                        }
                    }
                    if (code === ConnectionStatus.DISCONNECTED && !RongIMClient._memoryStore.otherDevice) {
                        Channel._ConnectionStatusListener.onChanged(ConnectionStatus.DISCONNECTED);
                        self.clearHeartbeat();
                        return;
                    } else if (code === ConnectionStatus.DISCONNECTED && RongIMClient._memoryStore.otherDevice) {
                        return;
                    }
                    Channel._ConnectionStatusListener.onChanged(code);
                    if (RongIMClient._memoryStore.otherDevice) {
                        if (me.delOnChangedCount > 5) {
                            delete Channel._ConnectionStatusListener["onChanged"];
                        }
                        me.delOnChangedCount++;
                    }
                });

            } else {
                throw new Error("setConnectStatusListener:Parameter format is incorrect");
            }
            //注册message观察者
            this.socket.on("message", self.handler.handleMessage);
            //注册断开连接观察者
            this.socket.on("disconnect", function(status: number) {
                self.channel.socket.fire("StatusChanged", status ? status : 2);
            });
        }
        writeAndFlush(val: any) {
            this.socket.send(val);
        }
        reconnect(callback: any) {
            MessageIdHandler.clearMessageId();
            this.socket = this.socket.reconnect();
            if (callback) {
                this.self.reconnectObj = callback;
            }
        }
        disconnect(status: number) {
            this.socket.disconnect(status);
        }
    }
    export class Socket {
        //消息通道常量，所有和通道相关判断均用 XHR_POLLING WEBSOCKET两属性
        public static XHR_POLLING: string = "xhr-polling";
        public static WEBSOCKET: string = "websocket";
        socket: any = null;
        _events: any = {};
        currentURL: string;
        static getInstance(): Socket {
            return new Socket();
        }
        connect(url: string, cb: any): any {
            if (this.socket) {
                if (url) {
                    RongIMLib.RongIMClient._storageProvider.setItem("rongSDK", this.checkTransport());
                    this.on("connect", cb || new Function);
                }
                if (url) {
                    this.currentURL = url;
                }
                this.socket.createTransport(url);
            }
            return this;
        }
        createServer(): any {
            var transport = this.getTransport(this.checkTransport());
            if (transport === null) {
                throw new Error("the channel was not supported");
            }
            return transport;
        }
        getTransport(transportType: string): any {
            if (transportType == Socket.XHR_POLLING) {
                this.socket = new PollingTransportation(this);
            } else if (transportType == Socket.WEBSOCKET) {
                this.socket = new SocketTransportation(this);
            }
            return this;
        }
        send(data: any) {
            if (this.socket) {
                if (this.checkTransport() == Socket.WEBSOCKET) {
                    this.socket.send(data);
                } else {
                    this.socket.send(this._encode(data));
                }
            }
        }
        onMessage(data: any) {
            this.fire("message", data);
        }
        disconnect(status: number) {
            if (ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT === status) {
                RongIMClient._memoryStore.otherDevice = true;
            }
            this.socket.disconnect(status);
            this.fire("disconnect", status);
            return this;
        }
        reconnect(): any {
            if (this.currentURL) {
                return this.connect(this.currentURL, null);
            } else {
                throw new Error("reconnect:no have URL");
            }
        }
        /**
         * [checkTransport 返回通道类型]
         */
        checkTransport(): string {
            if (RongIMClient._memoryStore.depend.isPolling) {
                Transportations._TransportType = Socket.XHR_POLLING;
            }
            return Transportations._TransportType;
        }
        fire(x: any, args?: any) {
            if (x in this._events) {
                for (var i = 0, ii = this._events[x].length; i < ii; i++) {
                    this._events[x][i](args);
                }
            }
            return this;
        }
        on(x: any, func: any) {
            if (!(typeof func == "function" && x)) {
                return this;
            }
            if (x in this._events) {
                MessageUtil.indexOf(this._events, func) == -1 && this._events[x].push(func);
            } else {
                this._events[x] = [func];
            }
            return this;
        }
        removeEvent(x: any, fn: any) {
            if (x in this._events) {
                for (var a = 0, l = this._events[x].length; a < l; a++) {
                    if (this._events[x][a] == fn) {
                        this._events[x].splice(a, 1);
                    }
                }
            }
            return this;
        }
        _encode(x: any) {
            var str = "?messageid=" + x.getMessageId() + "&header=" + x.getHeaderFlag() + "&sessionid=" + RongIMClient._storageProvider.getItem("sId" + Navigation.Endpoint.userId);
            if (!/(PubAckMessage|QueryConMessage)/.test(x._name)) {
                str += "&topic=" + x.getTopic() + "&targetid=" + (x.getTargetId() || "");
            }
            return {
                url: str,
                data: "getData" in x ? x.getData() : ""
            };
        }
    }
    //连接端消息累
    export class Client {
        timeoutMillis: number = 100000;
        timeout_: number = 0;
        appId: string;
        token: string;
        sdkVer: string = "2.2.4";
        apiVer: any = Math.floor(Math.random() * 1e6);
        channel: Channel = null;
        handler: any = null;
        userId: string = "";
        reconnectObj: any = {};
        heartbeat: any = 0;
        pullMsgHearbeat: any = 0;
        chatroomId: string = "";
        static userInfoMapping: any = {};
        SyncTimeQueue: any = [];
        cacheMessageIds: any = [];
        constructor(token: string, appId: string) {
            this.token = token;
            this.appId = appId;
            this.SyncTimeQueue.state = "complete";
        }
        resumeTimer() {
            if (!this.timeout_) {
                this.timeout_ = setTimeout(function() {
                    if (!this.timeout_) {
                        return;
                    }
                    try {
                        this.channel.disconnect();
                    } catch (e) {
                        throw new Error(e);
                    }
                    clearTimeout(this.timeout_);
                    this.timeout_ = 0;
                    this.channel.reconnect();
                    this.channel.socket.fire("StatusChanged", 5);
                }, this.timeoutMillis);
            }
        }
        pauseTimer() {
            if (this.timeout_) {
                clearTimeout(this.timeout_);
                this.timeout_ = 0;
            }
        }
        connect(_callback: any) {
            if (Navigation.Endpoint.host) {
                if (Transportations._TransportType == Socket.WEBSOCKET) {
                    if (!window.WebSocket) {
                        _callback.onError(ConnectionState.UNACCEPTABLE_PROTOCOL_VERSION);
                        return;
                    }
                }
                //实例消息处理类
                this.handler = new MessageHandler(this);
                //设置连接回调
                this.handler.setConnectCallback(_callback);
                //实例通道类型
                var me = this;
                this.channel = new Channel(Navigation.Endpoint, function() {
                    Transportations._TransportType == Socket.WEBSOCKET && me.keepLive();
                }, this);
                //触发状态改变观察者
                this.channel.socket.fire("StatusChanged", 1);
            } else {
                //没有返回地址就手动抛出错误
                _callback.onError(ConnectionState.NOT_AUTHORIZED);
            }
        }
        checkSocket(callback: any) {
            var me = this;
            me.channel.writeAndFlush(new PingReqMessage());
            var checkTimeout: number = setInterval(function() {
                if (!RongIMClient._memoryStore.isFirstPingMsg) {
                    callback.onSuccess();
                    clearInterval(checkTimeout);
                } else {
                    if (count > 15) {
                        clearInterval(checkTimeout);
                        callback.onError();
                    }
                }
                count++;
            }, 200), count: number = 0;
        }
        keepLive() {
            if (this.heartbeat > 0) {
                clearInterval(this.heartbeat);
            }
            var me = this;
            me.heartbeat = setInterval(function() {
                me.resumeTimer();
                me.channel.writeAndFlush(new PingReqMessage());
            }, 30000);
            if (me.pullMsgHearbeat > 0) {
                clearInterval(me.pullMsgHearbeat);
            }
            me.pullMsgHearbeat = setInterval(function() {
                me.syncTime(undefined, undefined, undefined, false);
            }, 180000);
        }
        clearHeartbeat() {
            clearInterval(this.heartbeat);
            this.heartbeat = 0;
            this.pauseTimer();
            clearInterval(this.pullMsgHearbeat);
            this.pullMsgHearbeat = 0;
        }
        publishMessage(_topic: any, _data: any, _targetId: any, _callback: any, _msg: any) {
            var msgId = MessageIdHandler.messageIdPlus(this.channel.reconnect);
            if (!msgId) {
                return;
            }
            var msg = new PublishMessage(_topic, _data, _targetId);
            msg.setMessageId(msgId);
            if (_callback) {
                msg.setQos(Qos.AT_LEAST_ONCE);
                this.handler.putCallback(new PublishCallback(_callback.onSuccess, _callback.onError), msg.getMessageId(), _msg);
            } else {
                msg.setQos(Qos.AT_MOST_ONCE);
            }
            this.channel.writeAndFlush(msg);

        }
        queryMessage(_topic: string, _data: any, _targetId: string, _qos: any, _callback: any, pbtype: any) {
            if (_topic == "userInf") {
                if (Client.userInfoMapping[_targetId]) {
                    _callback.onSuccess(Client.userInfoMapping[_targetId]);
                    return;
                }
            }
            var msgId = MessageIdHandler.messageIdPlus(this.channel.reconnect);
            if (!msgId) {
                return;
            }
            var msg = new QueryMessage(_topic, _data, _targetId);
            msg.setMessageId(msgId);
            msg.setQos(_qos);
            this.handler.putCallback(new QueryCallback(_callback.onSuccess, _callback.onError), msg.getMessageId(), pbtype);
            this.channel.writeAndFlush(msg);
        }
        invoke(isPullMsg?: boolean, chrmId?: string, offlineMsg?: boolean) {
            var time: string, modules: any, str: string, me = this, target: string, temp: any = this.SyncTimeQueue.shift();
            if (temp == undefined) {
                return;
            }
            this.SyncTimeQueue.state = "pending";
            if (temp.type != 2) {
                //普通消息
                time = offlineMsg ? RongIMClient._storageProvider.getItem(this.userId) || 0 : RongIMClient._memoryStore.lastReadTime.get(this.userId) || 0;
                modules = new Modules.SyncRequestMsg();
                modules.setIspolling(false);
                str = "pullMsg";
                target = this.userId;
            } else {
                //聊天室消息
                target = chrmId || me.chatroomId;
                time = RongIMClient._memoryStore.lastReadTime.get(target + Bridge._client.userId + "CST") || 0;
                modules = new Modules.ChrmPullMsg();
                modules.setCount(0);
                str = "chrmPull";
                if (!target) {
                    throw new Error("syncTime:Received messages of chatroom but was not init");
                }
            }
            //判断服务器给的时间是否消息本地存储的时间，小于的话不执行拉取操作，进行一下步队列操作
            if (temp.pulltime <= time) {
                this.SyncTimeQueue.state = "complete";
                this.invoke(isPullMsg, target);
                return;
            }
            if (isPullMsg && 'setIsPullSend' in modules) {
                modules.setIsPullSend(true);
            }
            modules.setSyncTime(time);
            //发送queryMessage请求
            this.queryMessage(str, MessageUtil.ArrayForm(modules.toArrayBuffer()), target, Qos.AT_LEAST_ONCE, {
                onSuccess: function(collection: any) {
                    var sync = MessageUtil.int64ToTimestamp(collection.syncTime), symbol = target;
                    //把返回时间戳存入本地，普通消息key为userid，聊天室消息key为userid＋'CST'；value都为服务器返回的时间戳
                    if (str == "chrmPull") {
                        symbol += Bridge._client.userId + "CST";
                    }

                    if(offlineMsg) {
                        RongIMClient._storageProvider.setItem(symbol, sync);
                        //防止因离线消息造成会话列表不为空而无法从服务器拉取会话列表。
                        RongIMClient._memoryStore.isSyncRemoteConverList = true;
                    }else{
                        RongIMClient._memoryStore.lastReadTime.set(symbol, sync);
                    }
                    me.SyncTimeQueue.state = "complete";
                    me.invoke(isPullMsg, target);
                    //把拉取到的消息逐条传给消息监听器
                    var list = collection.list;
                    for (let i = 0, len = list.length, count = len; i < len; i++) {
                        if (!(list[i].msgId in me.cacheMessageIds)) {
                            Bridge._client.handler.onReceived(list[i], undefined, offlineMsg,--count);
                            var arrLen = me.cacheMessageIds.unshift(list[i].msgId);
                            if (arrLen > 20) me.cacheMessageIds.length = 20;
                        }
                    }
                },
                onError: function(error: ErrorCode) {
                    me.SyncTimeQueue.state = "complete";
                    me.invoke(isPullMsg, target);
                }
            }, "DownStreamMessages");
        }
        syncTime(_type?: any, pullTime?: any, chrmId?: string, offlineMsg?: boolean) {
            this.SyncTimeQueue.push({ type: _type, pulltime: pullTime });
            //如果队列中只有一个成员并且状态已经完成就执行invoke方法
            if (this.SyncTimeQueue.length == 1 && this.SyncTimeQueue.state == "complete") {
                this.invoke(!_type, chrmId, offlineMsg);
            }
        }
        __init(f: any) {
            this.channel = new Channel(Navigation.Endpoint, f, this);
        }
    }
    //连接类，实现imclient与connect_client的连接
    export class Bridge {
        static _client: Client;
        static getInstance(): Bridge {
            return new Bridge();
        }
        //连接服务器
        connect(appKey: string, token: string, callback: any): Client {
            if (!window["Modules"]) {
                RongIMClient._memoryStore.hasModules = false;
                return;
            }
            Bridge._client = new Navigation().connect(appKey, token, callback);
            return Bridge._client;
        }
        setListener(_changer: any): void {
            if (typeof _changer == "object") {
                if (typeof _changer.onChanged == "function") {
                    Channel._ConnectionStatusListener = _changer;
                } else if (typeof _changer.onReceived == "function") {
                    Channel._ReceiveMessageListener = _changer;
                }
            }
        }
        reconnect(callabck: any): void {
            Bridge._client.channel.reconnect(callabck);
        }
        disconnect() {
            Bridge._client.clearHeartbeat();
            Bridge._client.channel.disconnect(2);
        }
        //执行queryMessage请求
        queryMsg(topic: any, content: any, targetId: string, callback: any, pbname?: string): void {
            if (typeof topic != "string") {
                topic = _topic[topic];
            }
            Bridge._client.queryMessage(topic, content, targetId, Qos.AT_MOST_ONCE, callback, pbname);
        }
        //发送消息 执行publishMessage 请求
        pubMsg(topic: number, content: string, targetId: string, callback: any, msg: any,methodType?: number): void {
            if(typeof methodType == 'number') {
                if(methodType == MethodType.CUSTOMER_SERVICE) {
                    Bridge._client.publishMessage("pcuMsgP", content, targetId, callback, msg);
                }else if(methodType == MethodType.RECALL){
                    Bridge._client.publishMessage("recallMsg", content, targetId, callback, msg);
                }
            }else{
                Bridge._client.publishMessage(_topic[10][topic], content, targetId, callback, msg);
            }
        }
    }
    export class MessageHandler {
        map: any = {};
        syncMsgMap: any;
        _onReceived: any;
        connectCallback: any = null;
        _client: Client;
        constructor(client: Client) {
            if (!Channel._ReceiveMessageListener) {
                throw new Error("please set onReceiveMessageListener");
            }
            this._onReceived = Channel._ReceiveMessageListener.onReceived;
            this._client = client;
            this.syncMsgMap = new Object;
        }
        //把对象推入回调对象队列中，并启动定时器
        putCallback(callbackObj: any, _publishMessageId: any, _msg: any): any {
            var item: any = {
                Callback: callbackObj,
                Message: _msg
            };
            item.Callback.resumeTimer();
            this.map[_publishMessageId] = item;
        }
        //设置连接回调对象，启动定时器
        setConnectCallback(_connectCallback: any): void {
            if (_connectCallback) {
                this.connectCallback = new ConnectAck(_connectCallback.onSuccess, _connectCallback.onError, this._client);
                this.connectCallback.resumeTimer();
            }
        }

        onReceived(msg: any, pubAckItem?: any, offlineMsg?: boolean, leftCount?: number): void {
            //实体对象
            var entity: any,
                //解析完成的消息对象
                message: any,
                //会话对象
                con: Conversation;
            if (msg._name != "PublishMessage") {
                entity = msg;
                RongIMClient._storageProvider.setItem(this._client.userId, MessageUtil.int64ToTimestamp(entity.dataTime));
            } else {
                if (msg.getTopic() == "s_ntf") {
                    entity = Modules.NotifyMsg.decode(msg.getData());
                    this._client.syncTime(entity.type, MessageUtil.int64ToTimestamp(entity.time), entity.chrmId);
                    return;
                } else if (msg.getTopic() == "s_msg") {
                    entity = Modules.DownStreamMessage.decode(msg.getData());
                    var timestamp = MessageUtil.int64ToTimestamp(entity.dataTime);
                    RongIMClient._storageProvider.setItem(this._client.userId, timestamp);
                    RongIMClient._memoryStore.lastReadTime.get(this._client.userId, timestamp);
                } else {
                    if (Bridge._client.sdkVer && Bridge._client.sdkVer == "1.0.0") {
                        return;
                    }
                    entity = Modules.UpStreamMessage.decode(msg.getData());
                    var tmpTopic = msg.getTopic();
                    var tmpType = tmpTopic.substr(0, 2);
                    if (tmpType == "pp") {
                        entity.type = 1;
                    } else if (tmpType == "pd") {
                        entity.type = 2;
                    } else if (tmpType == "pg") {
                        entity.type = 3;
                    } else if (tmpType == "ch") {
                        entity.type = 4;
                    } else if (tmpType == "pc") {
                        entity.type = 5;
                    }
                    //复用字段，targetId 以此为准
                    entity.groupId = msg.getTargetId();
                    entity.fromUserId = this._client.userId;
                    entity.dataTime = Date.parse(new Date().toString());
                }
                if (!entity) {
                    return;
                }
            }
            //解析实体对象为消息对象。
            message = MessageUtil.messageParser(entity, this._onReceived, offlineMsg);
            if (pubAckItem) {
                message.messageUId = pubAckItem.getMessageUId();
                message.sentTime = pubAckItem.getTimestamp();
            }
            if (message === null) {
                return;
            }

            // 设置会话时间戳并且判断是否传递 message  发送消息未处理会话时间戳
            // key：'converST_' + 当前用户 + conversationType + targetId
            // RongIMClient._storageProvider.setItem('converST_' + Bridge._client.userId + message.conversationType + message.targetId, message.sentTime);
            var stKey: string = 'converST_' + Bridge._client.userId + message.conversationType + message.targetId;
            var stValue = RongIMClient._memoryStore.lastReadTime.get(stKey);
            if (stValue) {
                if (message.sentTime > stValue) {
                    RongIMClient._memoryStore.lastReadTime.set(stKey, message.sentTime);
                } else {
                    return;
                }
            } else {
                RongIMClient._memoryStore.lastReadTime.set(stKey, message.sentTime);
            } 
            if (RongIMClient.MessageParams[message.messageType].msgTag.getMessageTag() == 3) {
                RongIMClient._dataAccessProvider.getConversation(message.conversationType, message.targetId, {
                    onSuccess: function(con: Conversation) {
                        if (!con) {
                            con = RongIMClient.getInstance().createConversation(message.conversationType, message.targetId, "");
                        }

                        if (message.messageDirection == MessageDirection.RECEIVE && (entity.status & 64) == 64) {
                            var mentioneds = RongIMClient._storageProvider.getItem("mentioneds_" + Bridge._client.userId + '_' + message.conversationType + '_' + message.targetId);
                            var key: string = message.conversationType + '_' + message.targetId, info: any = {};
                            if (message.content && message.content.mentionedInfo) {
                                info[key] = { uid: message.messageUId, time: message.sentTime, mentionedInfo: message.content.mentionedInfo };
                                RongIMClient._storageProvider.setItem("mentioneds_" + Bridge._client.userId + '_' + message.conversationType + '_' + message.targetId, JSON.stringify(info));
                                mentioneds = JSON.stringify(info);
                            }
                            if (mentioneds) {
                                var info: any = JSON.parse(mentioneds);
                                con.mentionedMsg = info[key];
                            }
                        }

                        if (con.conversationType != 0 && message.senderUserId != Bridge._client.userId && message.receivedStatus != ReceivedStatus.RETRIEVED && message.messageType != RongIMClient.MessageType["ReadReceiptRequestMessage"] && message.messageType != RongIMClient.MessageType["ReadReceiptResponseMessage"]) {
                            con.unreadMessageCount = con.unreadMessageCount + 1;
                            if (MessageUtil.supportLargeStorage()) {
                                var count = RongIMClient._storageProvider.getItem("cu" + Bridge._client.userId + con.conversationType + con.targetId); // 与本地存储会话合并
                                RongIMClient._storageProvider.setItem("cu" + Bridge._client.userId + con.conversationType + message.targetId, Number(count) + 1);
                            }
                        }
                        con.receivedTime = new Date().getTime();
                        con.receivedStatus = ReceivedStatus.UNREAD;
                        message.receivedStatus = ReceivedStatus.UNREAD;
                        con.senderUserId = message.sendUserId;
                        con.notificationStatus = ConversationNotificationStatus.DO_NOT_DISTURB;
                        con.latestMessageId = message.messageId;
                        con.latestMessage = message
                        con.sentTime = message.sentTime;
                        RongIMClient._dataAccessProvider.addConversation(con, { onSuccess: function(data) { }, onError: function() { } });
                    },
                    onError: function(error: ErrorCode) { }
                });

            }

            if (message.conversationType == ConversationType.CUSTOMER_SERVICE && (message.messageType == "ChangeModeResponseMessage" || message.messageType == "SuspendMessage" || message.messageType == "HandShakeResponseMessage" ||
                message.messageType == "TerminateMessage" || message.messageType == "CustomerStatusUpdateMessage" || message.messageType == "TextMessage" || message.messageType == "InformationNotificationMessage")) {
                if (!RongIMLib.RongIMClient._memoryStore.custStore["isInit"]) {
                    return;
                }
            }

            if (message.conversationType == ConversationType.CUSTOMER_SERVICE && message.messageType != "HandShakeResponseMessage") {
                if (!RongIMClient._memoryStore.custStore[message.targetId]) {
                    return;
                }

                if (message.messageType == "TerminateMessage") {
                    if (RongIMClient._memoryStore.custStore[message.targetId].sid != message.content.sid) {
                        return;
                    }
                }
            }

            if (message.messageType === RongIMClient.MessageType["HandShakeResponseMessage"]) {
                var session = message.content.data;
                RongIMClient._memoryStore.custStore[message.targetId] = session;
                if (session.serviceType == CustomerType.ONLY_HUMAN || session.serviceType == CustomerType.HUMAN_FIRST) {
                    if (session.notAutoCha == "1") {
                        RongIMClient.getInstance().switchToHumanMode(message.targetId, {
                            onSuccess: function() { },
                            onError: function() { }
                        });
                    }
                }
            }

            var d = new Date(), m = d.getMonth() + 1, date = d.getFullYear() + '/' + (m.toString().length == 1 ? '0' + m : m) + '/' + d.getDate();
            //new Date(date).getTime() - message.sentTime < 1 逻辑判断 超过 1 天未收的 ReadReceiptRequestMessage 离线消息自动忽略。
            var dealtime: boolean = new Date(date).getTime() - message.sentTime < 0;

            if (MessageUtil.supportLargeStorage() && message.messageType === RongIMClient.MessageType["ReadReceiptRequestMessage"] && dealtime && message.messageDirection == MessageDirection.SEND) {
                var sentkey: string = Bridge._client.userId + message.content.messageUId + "SENT";
                RongIMClient._storageProvider.setItem(sentkey, JSON.stringify({ count: 0, dealtime: message.sentTime, userIds: {} }));
            } else if (MessageUtil.supportLargeStorage() && message.messageType === RongIMClient.MessageType["ReadReceiptRequestMessage"] && dealtime) {
                var reckey: string = Bridge._client.userId + message.conversationType + message.targetId + 'RECEIVED',
                    recData: any = JSON.parse(RongIMClient._storageProvider.getItem(reckey));
                if (recData) {
                    if (message.senderUserId in recData) {
                        if (recData[message.senderUserId].uIds && recData[message.senderUserId].uIds && recData[message.senderUserId].uIds.indexOf(message.content.messageUId) == -1) {
                            // 如果是前一天的 MessaageUId 把数组清空。
                            new Date(date).getTime() - recData[message.senderUserId].dealtime < 0 || (recData[message.senderUserId].uIds.length = 0);
                            recData[message.senderUserId].uIds.push(message.content.messageUId);
                            recData[message.senderUserId].dealtime = message.sentTime;
                            recData[message.senderUserId].isResponse = false;
                            RongIMClient._storageProvider.setItem(reckey, JSON.stringify(recData));
                        } else {
                            return;
                        }
                    } else {
                        var objSon: any = { uIds: [message.content.messageUId], dealtime: message.sentTime, isResponse: false };
                        recData[message.senderUserId] = objSon;
                        RongIMClient._storageProvider.setItem(reckey, JSON.stringify(recData));
                    }
                } else {
                    var obj: any = {};
                    obj[message.senderUserId] = { uIds: [message.content.messageUId], dealtime: message.sentTime, isResponse: false };
                    RongIMClient._storageProvider.setItem(reckey, JSON.stringify(obj));
                }
            }

            if (MessageUtil.supportLargeStorage() && message.messageType === RongIMClient.MessageType["ReadReceiptResponseMessage"] && dealtime) {
                var receiptResponseMsg: ReadReceiptResponseMessage = <ReadReceiptResponseMessage>message.content,
                    uIds: string[] = receiptResponseMsg.receiptMessageDic[Bridge._client.userId], sentkey = "", sentObj: any;
                message.receiptResponse || (message.receiptResponse = {});
                if (uIds) {
                    var cbuIds: string[] = [];
                    for (let i = 0, len = uIds.length; i < len; i++) {
                        sentkey = Bridge._client.userId + uIds[i] + "SENT";
                        sentObj = JSON.parse(RongIMClient._storageProvider.getItem(sentkey));
                        if (sentObj && !(message.senderUserId in sentObj.userIds)) {
                            if (new Date(date).getTime() - sentObj.dealtime > 0) {
                                RongIMClient._storageProvider.removeItem(sentkey);
                            } else {
                                cbuIds.push(uIds[i]);
                                sentObj.count += 1;
                                sentObj.userIds[message.senderUserId] = message.sentTime;
                                message.receiptResponse[uIds[i]] = sentObj.count;
                                RongIMClient._storageProvider.setItem(sentkey, JSON.stringify(sentObj));
                            }
                        }
                    }
                    receiptResponseMsg.receiptMessageDic[Bridge._client.userId] = cbuIds;
                    message.content = receiptResponseMsg;
                }
            }

            var that = this;
            if (RongIMClient._voipProvider && ['AcceptMessage', 'RingingMessage', 'HungupMessage', 'InviteMessage', 'MediaModifyMessage', 'MemberModifyMessage'].indexOf(message.messageType) > -1) {
                RongIMClient._voipProvider.onReceived(message);
            } else {
                var lcount = leftCount || 0;
                RongIMClient._dataAccessProvider.addMessage(message.conversationType, message.targetId, message, {
                    onSuccess: function(ret: Message) {
                        that._onReceived(ret, lcount);
                    },
                    onError: function(error: ErrorCode) {
                        that._onReceived(message, lcount);
                    }
                });
            }
        }

        handleMessage(msg: any): void {
            if (!msg) {
                return;
            }
            switch (msg._name) {
                case "ConnAckMessage":
                    Bridge._client.handler.connectCallback.process(msg.getStatus(), msg.getUserId(), msg.getTimestamp());
                    break;
                case "PublishMessage":
                    if (!msg.getSyncMsg() && msg.getQos() != 0) {
                        Bridge._client.channel.writeAndFlush(new PubAckMessage(msg.getMessageId()));
                    }
                    // TODO && ->
                    if (msg.getSyncMsg() && !RongIMClient._memoryStore.depend.isPolling) {
                        Bridge._client.handler.syncMsgMap[msg.getMessageId()] = msg;
                    } else {
                        //如果是PublishMessage就把该对象给onReceived方法执行处理
                        Bridge._client.handler.onReceived(msg);
                    }
                    break;
                case "QueryAckMessage":
                    if (msg.getQos() != 0) {
                        Bridge._client.channel.writeAndFlush(new QueryConMessage(msg.getMessageId()));
                    }
                    var temp = Bridge._client.handler.map[msg.getMessageId()];
                    if (temp) {
                        //执行回调操作
                        temp.Callback.process(msg.getStatus(), msg.getData(), msg.getDate(), temp.Message);
                        delete Bridge._client.handler.map[msg.getMessageId()];
                    }
                    break;
                case "PubAckMessage":
                    var item = Bridge._client.handler.map[msg.getMessageId()];
                    if (item) {
                        item.Callback.process(msg.getStatus() || 0, msg.getMessageUId(), msg.getTimestamp(), item.Message, msg.getMessageId());
                        delete Bridge._client.handler.map[msg.getMessageId()];
                    } else {
                        Bridge._client.handler.onReceived(Bridge._client.handler.syncMsgMap[msg.messageId], msg);
                        delete Bridge._client.handler.syncMsgMap[msg.getMessageId()];
                    }
                    break;
                case "PingRespMessage":
                    if (RongIMClient._memoryStore.isFirstPingMsg) {
                        RongIMClient._memoryStore.isFirstPingMsg = false;
                    } else {
                        Bridge._client.pauseTimer();
                    }
                    break;
                case "DisconnectMessage":
                    Bridge._client.channel.disconnect(msg.getStatus());
                    break;
                default:
            }
        }
    }
}
