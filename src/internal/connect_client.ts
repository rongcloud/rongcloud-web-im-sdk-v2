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
    var _topic: any = [
        "invtDiz", "crDiz", "qnUrl", "userInf", "dizInf", "userInf", "joinGrp", "quitDiz", "exitGrp", "evctDiz",
        ["", "ppMsgP", "pdMsgP", "pgMsgP", "chatMsg", "pcMsgP", "", "pmcMsgN", "pmpMsgN", "", "", "", "prMsgS", "prMsgP"],
        "pdOpen", "rename", "uGcmpr", "qnTkn", "destroyChrm", "createChrm", "exitChrm", "queryChrm",
        "joinChrm", "pGrps", "addBlack", "rmBlack", "getBlack", "blackStat",
        "addRelation", "qryRelation", "delRelation", "pullMp", "schMp", "qnTkn",
        "qnUrl", "qryVoipK", "delMsg", "qryCHMsg", "getUserStatus", "setUserStatus",
        "subUserStatus", "cleanHisMsg"
    ];
    export class Channel {
        socket: Socket;
        static _ConnectionStatusListener: any;
        static _ReceiveMessageListener: any;
        connectionStatus: number = -1;
        url: string;
        self: any;
        timer: any;
        constructor(cb: any, self: Client) {
            var appId = self.appId;
            var token = encodeURIComponent(self.token);
            var sdkVer = self.sdkVer;
            var apiVer = self.apiVer;

            this.self = self;
            this.socket = Socket.getInstance().createServer();

            var that = this;
            var storage = RongIMClient._storageProvider;

            var servers: any = storage.getItem('servers');
            servers = JSON.parse(servers) || [];
            servers = RongUtil.getValidWsUrlList(servers);

            var depend = RongIMClient._memoryStore.depend;

            var startConnect = function (host: string) {
                var tpl = '{host}/websocket?appId={appId}&token={token}&sdkVer={sdkVer}&apiVer={apiVer}';
                that.url = RongUtil.tplEngine(tpl, {
                    host: host,
                    appId: appId,
                    token: token,
                    sdkVer: sdkVer,
                    apiVer: apiVer
                });
                that.socket.connect(that.url, cb);

                // 临时兼容 Comet 逻辑，Comet 中用到
                var userId = storage.getItem('rong_current_user');
                Navigation.Endpoint = {
                    host: host,
                    userId: userId
                };
            };
            var connectMap: { [s: string]: any } = {
                wsFromGet: function () {
                    // 所有链接计算器，超过 15 秒后认为所有 CMP 地址均不可用
                    var totalTimer = new Timer({
                        timeout: 1 * 1000 * 15
                    });

                    var timers: any[] = [];
                    var xhrs: any[] = [];
                    var isFinished = false;

                    var clearHandler = function () {
                        for (var i = 0; i < timers.length; i++) {
                            var timer = timers[i];
                            clearTimeout(timer);
                        }

                        for (var i = 0; i < xhrs.length; i++) {
                            var xhr = xhrs[i];
                            xhr.abort();
                        }
                        timers.length = 0;
                        xhrs.length = 0;
                    };

                    var request = function (config: any, callback: Function) {
                        var url = config.url;
                        var time = config.time;

                        if (isFinished) {
                            return;
                        }
                        var timer = setTimeout(function () {
                            var onSuccess = function () {
                                if (isFinished) {
                                    return;
                                }
                                clearHandler();
                                isFinished = true;
                                totalTimer.pause();
                                callback(url);
                            };
                            var xhr = MessageUtil.detectCMP({
                                url: url,
                                success: onSuccess,
                                fail: function (code: number) {
                                    console.log(code);
                                }
                            });
                            xhrs.push(xhr);
                        }, time);
                        timers.push(timer);
                    };

                    var snifferCallback = function (url: string) {
                        var reg = /(http|https):\/\/([^\/]+)/i;
                        var host = url.match(reg)[2];
                        RongIMClient.currentServer = host;
                        startConnect(host);
                    }

                    var snifferTpl = '{protocol}{server}/ping?r={random}';
                    for (var i = 0; i < servers.length; i++) {
                        var server = servers[i];
                        if (server) {
                            server = RongUtil.tplEngine(snifferTpl, {
                                protocol: depend.protocol,
                                server: server,
                                random: RongUtil.getTimestamp()
                            });
                            request({
                                url: server,
                                time: i * 1000
                            }, snifferCallback);
                        }
                    }

                    totalTimer.resume(function () {
                        Navigation.clear();
                        clearHandler();
                        that.socket.fire("StatusChanged", ConnectionStatus.NETWORK_UNAVAILABLE);
                    });
                },
                wsFromEl: function () {
                    var totalTimer = new RongIMLib.Timer({
                        timeout: 1 * 1000 * 15
                    });
                    var timers: Array<any> = [];
                    var elements: Array<any> = [];
                    var isFinished = false;
                    var clearHandler = function () {
                        for (var i = 0; i < timers.length; i++) {
                            var timer = timers[i];
                            clearTimeout(timer);
                        }
                        for (var i = 0; i < elements.length; i++) {
                            var el = elements[i];
                            document.body.removeChild(el);
                        }
                    };
                    var request = function (config: any, callback: any) {
                        var url = config.url;
                        var time = config.time;
                        if (isFinished) {
                            return;
                        }
                        var timer = setTimeout(function () {
                            var el = document.createElement('script');
                            el.src = url;
                            document.body.appendChild(el);
                            el.onerror = function () {
                                if (isFinished) {
                                    return;
                                }
                                clearHandler();
                                isFinished = true;
                                totalTimer.pause();
                                var url = el.src;
                                callback(url);
                            }
                            elements.push(el);
                        }, time);
                        timers.push(timer);
                    };
                    var snifferCallback = function (url: string) {
                        var reg = /(http|https):\/\/([^\/]+)/i;
                        var host = url.match(reg)[2];
                        startConnect(host);
                    };
                    var snifferTpl = '//{server}/{path}';
                    for (var i = 0; i < servers.length; i++) {
                        var server = RongUtil.tplEngine(snifferTpl, {
                            server: servers[i],
                            path: i
                        });
                        request({
                            url: server,
                            time: i * 1000
                        }, snifferCallback);
                    }
                    totalTimer.resume(function () {
                        clearHandler();
                        that.socket.fire("StatusChanged", ConnectionStatus.NETWORK_UNAVAILABLE);
                    });
                },
                comet: function () {
                    var host = servers[0];
                    startConnect(host);
                }
            };

            var isPolling = depend.isPolling;
            var isWSPingJSONP = depend.isWSPingJSONP;
            if (isPolling) {
                connectMap['comet']();
            } else {
                var connectType = isWSPingJSONP ? 'wsFromEl' : 'wsFromGet';
                connectMap[connectType]();
            }

            //注册状态改变观察者
            var StatusEvent = Channel._ConnectionStatusListener;
            var hasEvent = (typeof StatusEvent == "object");
            var me = this;
            me.socket.on("StatusChanged", function (code: any) {
                if (RongIMLib.Bridge && RongIMLib.Bridge._client && RongIMLib.Bridge._client.channel && me !== RongIMLib.Bridge._client.channel) {
                    return;
                }
                if (!hasEvent) {
                    throw new Error("setConnectStatusListener:Parameter format is incorrect");
                }
                var isNetworkUnavailable = (code == ConnectionStatus.NETWORK_UNAVAILABLE);
                var isWebSocket = !RongIMClient._memoryStore.depend.isPolling;
                if (RongIMClient.isFirstConnect && isNetworkUnavailable && isWebSocket) {
                    code = ConnectionStatus.WEBSOCKET_UNAVAILABLE;
                }
                if (isNetworkUnavailable) {
                    var storage = RongIMClient._storageProvider;
                    var servers: any = storage.getItem('servers');
                    servers = JSON.parse(servers);
                    var currentServer = RongIMClient.currentServer;
                    if (currentServer) {
                        var index = RongUtil.indexOf(servers, currentServer);
                        // 如果 currentServer 是 servers 的最后一个，不再替换位置
                        if (!RongUtil.isEqual(index, -1)) {
                            var server = servers.splice(index, 1)[0];
                            servers.push(server);
                            storage.setItem('servers', JSON.stringify(servers));
                        }
                    }
                }
                me.connectionStatus = code;
                setTimeout(function () {
                    StatusEvent.onChanged(code);
                });

                var isDisconnected = (code == ConnectionStatus.DISCONNECTED);
                if (isDisconnected) {
                    self.clearHeartbeat();
                }

                var isOtherDevice = (code == ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT);
                if (isOtherDevice) {
                    // 累计其他设备登陆次数，超过 5 次后，自动销毁内部对象
                    // 删除位置：ServerDataProivder.prototype.connect
                    RongIMClient.otherDeviceLoginCount++;
                }

                var isConnected = (code == ConnectionStatus.CONNECTED);
                if (isConnected) {
                    RongIMClient.isFirstConnect = false;
                }
                var isWebsocketUnAvailable = (code == ConnectionStatus.WEBSOCKET_UNAVAILABLE);
                if (isWebsocketUnAvailable) {
                    me.changeConnectType();
                    RongIMClient.isFirstConnect = false;
                    RongIMClient.connect(self.token, RongIMClient._memoryStore.callback);
                }
            });

            //注册message观察者
            this.socket.on("message", self.handler.handleMessage);
            //注册断开连接观察者
            this.socket.on("disconnect", function (status: number) {
                that.socket.fire("StatusChanged", status ? status : 2);
            });
        }
        changeConnectType() {
            RongIMClient._memoryStore.depend.isPolling = !RongIMClient._memoryStore.depend.isPolling;
            new FeatureDectector();
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
        disconnect(status?: number) {
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
            this.socket.disconnect(status);
            this.fire("disconnect", status);
            return this;
        }
        reconnect(): any {
            if (this.currentURL && RongIMClient._storageProvider.getItem("rongSDK")) {
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
        timeoutMillis: number = 6000;
        timeout_: number = 0;
        appId: string;
        token: string;
        sdkVer: string = '';
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
            this.sdkVer = RongIMClient.sdkver;
        }
        resumeTimer() {
            var me = this;
            this.timeout_ = setTimeout(function () {
                me.channel.disconnect(ConnectionStatus.NETWORK_UNAVAILABLE);
            }, this.timeoutMillis);
        }
        pauseTimer() {
            if (this.timeout_) {
                clearTimeout(this.timeout_);
                this.timeout_ = 0;
            }
        }
        connect(_callback: any) {
            //实例消息处理类
            this.handler = new MessageHandler(this);
            //设置连接回调
            this.handler.setConnectCallback(_callback);
            //实例通道类型
            var me = this;
            this.channel = new Channel(function () {
                Transportations._TransportType == Socket.WEBSOCKET && me.keepLive();
            }, this);
            //触发状态改变观察者
            this.channel.socket.fire("StatusChanged", ConnectionStatus.CONNECTING);

            //没有返回地址就手动抛出错误
            //_callback.onError(ConnectionState.NOT_AUTHORIZED);
        }
        checkSocket(callback: any) {
            var me = this;
            me.channel.writeAndFlush(new PingReqMessage());
            var count: number = 0
            var checkTimeout: number = setInterval(function () {
                if (!RongIMClient._memoryStore.isFirstPingMsg) {
                    clearInterval(checkTimeout);
                    callback.onSuccess();
                } else {
                    if (count > 15) {
                        clearInterval(checkTimeout);
                        callback.onError();
                    }
                }
                count++;
            }, 100);
        }
        keepLive() {
            if (this.heartbeat > 0) {
                clearInterval(this.heartbeat);
            }
            var me = this;
            me.heartbeat = setInterval(function () {
                me.resumeTimer();
                me.channel.writeAndFlush(new PingReqMessage());
            }, 30000);
            if (me.pullMsgHearbeat > 0) {
                clearInterval(me.pullMsgHearbeat);
            }
            me.pullMsgHearbeat = setInterval(function () {
                me.syncTime(true, undefined, undefined, false);
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
            var time: number, modules: any, str: string, me = this, target: string, temp: any = this.SyncTimeQueue.shift();
            if (temp == undefined) {
                return;
            }
            this.SyncTimeQueue.state = "pending";
            var localSyncTime = SyncTimeUtil.get();
            var sentBoxTime = localSyncTime.sent;
            if (temp.type != 2) {
                //普通消息
                time = localSyncTime.received;
                modules = new RongIMClient.Protobuf.SyncRequestMsg();
                modules.setIspolling(false);
                str = "pullMsg";
                target = this.userId;

                modules.setSendBoxSyncTime(sentBoxTime);
            } else {
                //聊天室消息
                target = temp.chrmId || me.chatroomId;
                time = RongIMClient._memoryStore.lastReadTime.get(target + Bridge._client.userId + "CST") || 0;
                modules = new RongIMClient.Protobuf.ChrmPullMsg();
                modules.setCount(0);
                str = "chrmPull";
                if (!target) {
                    throw new Error("syncTime:Received messages of chatroom but was not init");
                }
            }
            //判断服务器给的时间是否消息本地存储的时间，小于的话不执行拉取操作，进行一下步队列操作
            if (temp.pulltime <= time) {
                this.SyncTimeQueue.state = "complete";
                this.invoke(isPullMsg, target, offlineMsg);
                return;
            }
            if (isPullMsg && 'setIsPullSend' in modules) {
                modules.setIsPullSend(true);
            }
            modules.setSyncTime(time);
            //发送queryMessage请求
            this.queryMessage(str, MessageUtil.ArrayForm(modules.toArrayBuffer()), target, Qos.AT_LEAST_ONCE, {
                onSuccess: function (collection: any) {
                    var sync = MessageUtil.int64ToTimestamp(collection.syncTime), symbol = target;
                    //把返回时间戳存入本地，普通消息key为userid，聊天室消息key为userid＋'CST'；value都为服务器返回的时间戳
                    var isChrmPull = str == 'chrmPull';
                    if (isChrmPull) {
                        symbol += Bridge._client.userId + "CST";
                        RongIMClient._memoryStore.lastReadTime.set(symbol, sync);
                    } else {
                        var storage = RongIMClient._storageProvider;
                        if (sync > storage.getItem(symbol)) {
                            storage.setItem(symbol, sync);
                        }
                    }
                    //把拉取到的消息逐条传给消息监听器
                    var list = collection.list;
                    var isPullFinished = collection.finished;
                    // chrmPull 没有 finished 字段，自动设置为拉取完成
                    if (isChrmPull) {
                        isPullFinished = true;
                    }
                    // 兼容长轮训 finished 为空的造成丢消息情况
                    if (typeof isPullFinished == 'undefined') {
                        isPullFinished = true;
                    }
                    RongIMClient._memoryStore.isPullFinished = isPullFinished;
                    var connectAckTime = RongIMClient._memoryStore.connectAckTime;
                    let len = list.length;
                    for (let i = 0, count = len; i < len; i++) {
                        count -= 1;
                        var message = list[i];
                        var sentTime = RongIMLib.MessageUtil.int64ToTimestamp(message.dataTime);
                        var isSender = message.direction == RongIMLib.MessageDirection.SEND;
                        var compareTime = isSender ? sentBoxTime : time;
                        if (sentTime > compareTime) {
                            var isSyncMessage = false;
                            var isOffLineMessage = sentTime < connectAckTime;
                            Bridge._client.handler.onReceived(message, undefined, isOffLineMessage, count, isSyncMessage, isPullFinished);
                        }
                    }
                    if (len <= 200 && str == 'pullMsg') {
                        var Conversation = RongIMClient._dataAccessProvider.Conversation;
                        var conversationList = RongIMClient._memoryStore.conversationList;
                        Conversation._notify(conversationList);
                    }
                    me.SyncTimeQueue.state = "complete";
                    me.invoke(isPullMsg, target, offlineMsg);
                },
                onError: function (error: ErrorCode) {
                    me.SyncTimeQueue.state = "complete";
                    me.invoke(isPullMsg, target, offlineMsg);
                }
            }, "DownStreamMessages");
        }
        syncTime(_type?: any, pullTime?: any, chrmId?: string, offlineMsg?: boolean) {
            this.SyncTimeQueue.push({ type: _type, pulltime: pullTime, chrmId: chrmId });
            //如果队列中只有一个成员并且状态已经完成就执行invoke方法
            if (this.SyncTimeQueue.length == 1 && this.SyncTimeQueue.state == "complete") {
                this.invoke(!_type, chrmId, offlineMsg);
            }
        }
        __init(f: any) { //实例消息处理类
            this.handler = new MessageHandler(this);
            //设置连接回调
            this.handler.setConnectCallback(RongIMClient._memoryStore.callback);
            this.channel = new Channel(f, this);
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
            if (!RongIMClient.Protobuf) {
                return;
            }
            Bridge._client = new Navigation().connect(appKey, token, callback);
            return Bridge._client;
        }
        setListener(): void {
            Channel._ConnectionStatusListener = {
                onChanged: (status: number) => {
                    RongUtil.forEach(RongIMClient.statusListeners, (watch: any) => {
                        RongUtil.isFunction(watch) && watch(status);
                    });
                }
            };
            Channel._ReceiveMessageListener = {
                onReceived: (msg: any, count: number, hasMore: boolean) => {
                    RongUtil.forEach(RongIMClient.messageListeners, (watch: any) => {
                        RongUtil.isFunction(watch) && watch(msg, count, hasMore);
                    });
                }
            };
        }
        reconnect(callabck: any): void {
            Bridge._client.channel.reconnect(callabck);
        }
        disconnect() {
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
        pubMsg(topic: number, content: string, targetId: string, callback: any, msg: any, methodType?: number): void {
            if (typeof methodType == 'number') {
                if (methodType == MethodType.CUSTOMER_SERVICE) {
                    Bridge._client.publishMessage("pcuMsgP", content, targetId, callback, msg);
                } else if (methodType == MethodType.RECALL) {
                    Bridge._client.publishMessage("recallMsg", content, targetId, callback, msg);
                }
            } else {
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
            }
        }

        handleChrmKVPullMsg(msg: any): void {
            try {
                var pbtype = 'ChrmNotifyMsg';
                var data = CallbackMapping.getInstance().mapping(RongIMClient.Protobuf[pbtype].decode(msg.data), pbtype);
                if (data.type === 2) { // 拉取
                    var timestamp = MessageUtil.int64ToTimestamp(data.time);
                    ChrmKVHandler.pull(data.chrmId, timestamp);
                }
            } catch(e) {
            }
        }

        onReceived(msg: any, pubAckItem?: any, offlineMsg?: boolean, leftCount?: number, isSync?: boolean): void {
            //实体对象
            var entity: any,
                //解析完成的消息对象
                message: any,
                //会话对象
                con: Conversation,
                // 是否为直发消息
                isStraightMsg:boolean = false;
            if (msg._name != "PublishMessage") {
                entity = msg;
                RongIMClient._storageProvider.setItem(this._client.userId, MessageUtil.int64ToTimestamp(entity.dataTime));
            } else {
                if (msg.getTopic() == "s_ntf") {
                    entity = RongIMClient.Protobuf.NotifyMsg.decode(msg.getData());
                    this._client.syncTime(entity.type, MessageUtil.int64ToTimestamp(entity.time), entity.chrmId);
                    return;
                } else if (msg.getTopic() == "s_msg") {
                    isStraightMsg = true;
                    entity = RongIMClient.Protobuf.DownStreamMessage.decode(msg.getData());
                    var timestamp = MessageUtil.int64ToTimestamp(entity.dataTime);
                    RongIMClient._storageProvider.setItem(this._client.userId, timestamp);
                    RongIMClient._memoryStore.lastReadTime.get(this._client.userId, timestamp);
                } else if (msg.getTopic() == "s_stat") {
                    entity = RongIMLib.RongIMClient.Protobuf.GetUserStatusOutput.decode(msg.getData());
                    entity = RongInnerTools.convertUserStatus(entity);
                    RongIMClient.userStatusObserver.notify({
                        key: entity.userId,
                        entity: entity
                    });
                    return;
                } else if (msg.getTopic() === 's_cmd') { // 聊天室
                    this.handleChrmKVPullMsg(msg);
                    return;
                } else {
                    if (Bridge._client.sdkVer && Bridge._client.sdkVer == "1.0.0") {
                        return;
                    }
                    entity = RongIMClient.Protobuf.UpStreamMessage.decode(msg.getData());
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
            var isPullFinished = RongIMClient._memoryStore.isPullFinished;
            // PullMsg 没有拉取完成，抛弃所有直发在线消息，抛弃的消息会在 PullMsg 中返回
            if (!isPullFinished && !offlineMsg && isStraightMsg) {
                return;
            }
            //解析实体对象为消息对象。
            message = MessageUtil.messageParser(entity, this._onReceived, offlineMsg);
            var isRTCMessage = message.conversationType == 12;
            if (isRTCMessage) {
                RongIMClient.RTCListener(message);
                RongIMClient.RTCInnerListener(message);
                RongIMClient.RTCSignalLisener(message);
                return;
            }
            var isRecall = (msg.getTopic && msg.getTopic() == "recallMsg");
            if (isRecall) {
                var content = message.content;
                message.conversationType = content.conversationType;
                message.targetId = content.targetId;
                message.messageId = null;
            }

            if (pubAckItem) {
                message.messageUId = pubAckItem.getMessageUId();
                message.sentTime = pubAckItem.getTimestamp();
                RongIMClient._storageProvider.setItem(this._client.userId, message.sentTime);
            }
            if (message === null) {
                return;
            }
            var isChatroomMessage = message.conversationType == ConversationType.CHATROOM;
            if (!isChatroomMessage) {
                var msgTag = RongIMLib.RongIMClient.MessageParams[message.messageType].msgTag.getMessageTag();
                if (msgTag >= 0) {
                    RongIMLib.SyncTimeUtil.set(message);
                }
                var isSend = (message.messageDirection == RongIMLib.MessageDirection.SEND);
                if (isSend) {
                    var storageProvider = RongIMLib.RongIMClient._storageProvider;
                    var userId = RongIMLib.Bridge._client.userId;
                    var lastSentTime = storageProvider.getItem('last_sentTime_' + userId) || 0;
                    if (message.sentTime <= lastSentTime && !isSync) {
                        return;
                    }
                }
            }
            // 设置会话时间戳并且判断是否传递 message  发送消息未处理会话时间戳
            // key：'converST_' + 当前用户 + conversationType + targetId
            // RongIMClient._storageProvider.setItem('converST_' + Bridge._client.userId + message.conversationType + message.targetId, message.sentTime);

            // var isPersited = (RongIMClient.MessageParams[message.messageType].msgTag.getMessageTag() > 0);

            var msgTag = RongIMClient.MessageParams[message.messageType].msgTag.getMessageTag();
            var isPersited = msgTag === 3 || msgTag === 2;
            if (isPersited) {
                con = RongIMClient._dataAccessProvider.getConversation(message.conversationType, message.targetId, {
                    onSuccess: function () { },
                    onError: function () { }
                });
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

                var isReceiver = message.messageDirection == RongIMLib.MessageDirection.RECEIVE;
                if (isReceiver && message.senderUserId != Bridge._client.userId) {
                    con.unreadMessageCount = con.unreadMessageCount + 1;
                    if (RongUtil.supportLocalStorage()) {
                        // var originUnreadCount = RongIMClient._storageProvider.getItem("cu" + Bridge._client.userId + con.conversationType + con.targetId); // 与本地存储会话合并
                        // var newUnreadCount = Number(originUnreadCount) + 1;
                        // RongIMClient._storageProvider.setItem("cu" + Bridge._client.userId + con.conversationType + message.targetId, newUnreadCount);
                        var newUnreadCount = UnreadCountHandler.add(con.conversationType, message.targetId, 1, message.sentTime);
                        con.unreadMessageCount = newUnreadCount;
                    }
                }
                con.receivedTime = new Date().getTime();
                con.receivedStatus = message.receivedStatus;
                con.senderUserId = message.sendUserId;
                con.notificationStatus = ConversationNotificationStatus.DO_NOT_DISTURB;
                con.latestMessageId = message.messageId;
                con.latestMessage = message
                con.sentTime = message.sentTime;
                RongIMClient._dataAccessProvider.addConversation(con, { onSuccess: function (data) {
                    if (!offlineMsg) {
                        const Conversation = RongIMClient._dataAccessProvider.Conversation;
                        const conversationList = RongIMClient._memoryStore.conversationList;
                        Conversation._notify(conversationList);
                    }
                }, onError: function () { } });
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
                            onSuccess: function () { },
                            onError: function () { }
                        });
                    }
                }
            }

            var d = new Date(), m = d.getMonth() + 1, date = d.getFullYear() + '/' + (m.toString().length == 1 ? '0' + m : m) + '/' + d.getDate();
            //new Date(date).getTime() - message.sentTime < 1 逻辑判断 超过 1 天未收的 ReadReceiptRequestMessage 离线消息自动忽略。
            var dealtime: boolean = new Date(date).getTime() - message.sentTime < 0;

            if (RongUtil.supportLocalStorage() && message.messageType === RongIMClient.MessageType["ReadReceiptRequestMessage"] && dealtime && message.messageDirection == MessageDirection.SEND) {
                var sentkey: string = Bridge._client.userId + message.content.messageUId + "SENT";
                RongIMClient._storageProvider.setItem(sentkey, JSON.stringify({ count: 0, dealtime: message.sentTime, userIds: {} }));
            } else if (RongUtil.supportLocalStorage() && message.messageType === RongIMClient.MessageType["ReadReceiptRequestMessage"] && dealtime) {
                var reckey: string = Bridge._client.userId + message.conversationType + message.targetId + 'RECEIVED',
                    recData: any = JSON.parse(RongIMClient._storageProvider.getItem(reckey));
                if (recData) {
                    if (message.senderUserId in recData) {
                        if (recData[message.senderUserId].uIds && recData[message.senderUserId].uIds && recData[message.senderUserId].uIds.indexOf(message.content.messageUId) == -1) {
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

            if (RongUtil.supportLocalStorage() && message.messageType === RongIMClient.MessageType["ReadReceiptResponseMessage"] && dealtime) {
                var receiptResponseMsg: ReadReceiptResponseMessage = <ReadReceiptResponseMessage>message.content,
                    uIds: string[] = receiptResponseMsg.receiptMessageDic[Bridge._client.userId], sentkey = "", sentObj: any;
                message.receiptResponse || (message.receiptResponse = {});
                if (uIds) {
                    var cbuIds: string[] = [];
                    for (let i = 0, len = uIds.length; i < len; i++) {
                        sentkey = Bridge._client.userId + uIds[i] + "SENT";
                        sentObj = JSON.parse(RongIMClient._storageProvider.getItem(sentkey));
                        if (sentObj && !(message.senderUserId in sentObj.userIds)) {
                            cbuIds.push(uIds[i]);
                            sentObj.count += 1;
                            sentObj.userIds[message.senderUserId] = message.sentTime;
                            message.receiptResponse[uIds[i]] = sentObj.count;
                            RongIMClient._storageProvider.setItem(sentkey, JSON.stringify(sentObj));
                        }
                    }
                    receiptResponseMsg.receiptMessageDic[Bridge._client.userId] = cbuIds;
                    message.content = receiptResponseMsg;
                }
            }

            var that = this;
            if (RongIMClient._voipProvider && ['AcceptMessage', 'RingingMessage', 'HungupMessage', 'InviteMessage', 'MediaModifyMessage', 'MemberModifyMessage'].indexOf(message.messageType) > -1) {
                setTimeout(function () {
                    RongIMClient._voipProvider.onReceived(message);
                });
            } else {
                var count = leftCount || 0;
                var hasMore = !isPullFinished;
                that._onReceived(message, count, hasMore);
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
                        var userId = RongIMLib.Bridge._client.userId;
                        RongIMLib.RongIMClient._storageProvider.setItem('last_sentTime_' + userId, msg.timestamp);
                        Bridge._client.handler.onReceived(Bridge._client.handler.syncMsgMap[msg.messageId], msg, null, null, true);
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
