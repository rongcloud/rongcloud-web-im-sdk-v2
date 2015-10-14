//用于连接通道
module RongIMLib {
    var _topic: any = ["invtDiz", "crDiz", "qnUrl", "userInf", "dizInf", "userInf", "joinGrp", "quitDiz", "exitGrp", "evctDiz",
        ["chatMsg", "pcMsgP", "pdMsgP", "pgMsgP", "ppMsgP"], "pdOpen", "rename", "uGcmpr", "qnTkn", 'destroyChrm',
        'createChrm', 'exitChrm', 'queryChrm', 'joinChrm', "pGrps", "addBlack", "rmBlack", "getBlack", "blackStat", "addRelation", 'qryRelation', 'delRelation'];
    export class Channel {
        socket: Socket;
        static _ConnectionStatusListener: any;
        static _ReceiveMessageListener: any;
        url: string;
        self: any;
        constructor(address: any, cb: any, self: Client) {
            this.url = address.host + "/websocket?appId=" + self.appId + "&token=" + encodeURIComponent(self.token) + "&sdkVer=" + self.sdkVer + "&apiVer=" + self.apiVer;
            this.self = self;
            this.socket = Socket.getInstance().createServer();
            this.socket.connect(this.url, cb);
            //注册状态改变观察者
            if (typeof Channel._ConnectionStatusListener == "object" && "onChanged" in Channel._ConnectionStatusListener) {
                this.socket.on("StatusChanged", function(code: any) {
                    //如果参数为DisconnectionStatus，就停止心跳，其他的不停止心跳。每3min连接一次服务器
                    if (code in DisconnectionStatus) {
                        Channel._ConnectionStatusListener.onChanged(ConnectionStatus.DISCONNECTED);
                        self.clearHeartbeat();
                        return;
                    }
                    Channel._ConnectionStatusListener.onChanged(code)
                })
            } else {
                throw new Error("setConnectStatusListener:Parameter format is incorrect")
            }
            //注册message观察者
            this.socket.on("message", self.handler.handleMessage);
            //注册断开连接观察者
            this.socket.on("disconnect", function() {
                self.channel.socket.fire("StatusChanged", 4);
            })
        }
        writeAndFlush(val: any) {
            this.socket.send(val);
        }
        reconnect(callback: any) {
            new MessageIdHandler().clearMessageId();
            this.socket = this.socket.reconnect();
            if (callback) {
                this.self.reconnectObj = callback;
            }
        }
        disconnect(x?: any) {
            this.socket.disconnect(x);
        }
    }
    export class Socket {
        //消息通道常量，所有和通道相关判断均用 XHR_POLLING WEBSOCKET两属性
        public static XHR_POLLING: string = "xhr-polling"
        public static WEBSOCKET: string = "websocket";
        socket: any = null;
        _events: any = {};
        currentURL: string;
        constructor() {
            throw "Not implemented yet";
        }
        static getInstance(): Socket {
            return new Socket();
        }
        connect(url: string, cb: any): any {
            if (this.socket) {
                if (url) {
                    this.on("connect", cb || function() { })
                }
                if (url) {
                    this.currentURL = url;
                }
                this.socket.createTransport(url)
            }
            return this;
        }
        createServer(): any {
            var transport = this.getTransport(this.checkTransport());
            if (transport === null) {
                throw new Error("the channel was not supported")
            }
            return transport;
        }
        getTransport(transportType: string): any {
            if (transportType == Socket.XHR_POLLING) {
                this.socket = new SocketTransportation(this);
            } else if (transportType == Socket.WEBSOCKET) {
                this.socket = new PollingTransportation(this);
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
        disconnect(callback?: any) {
            if (callback) {
                this.fire("StatusChanged", callback)
            }
            this.socket.disconnect();
            return this;
        }
        reconnect(): any {
            if (this.currentURL) {
                return this.connect(null, null);
            } else {
                throw new Error("reconnect:no have URL");
            }
        }
        /**
         * [checkTransport 返回通道类型]
         * WEB_XHR_POLLING:是否选择comet方式进行连接
         * @return {string} [通道类型 xhr-polling 或 websocket]
         */
        checkTransport(): string {
            if (window["WEB_XHR_POLLING"] && window["WEB_XHR_POLLING"] == true) {
                Transports._TransportType = Socket.XHR_POLLING;
            }
            return Transports._TransportType;
        }
        fire(x: any, args: any) {
            if (x in this._events) {
                for (var i = 0, ii = this._events[x].length; i < ii; i++) {
                    this._events[x][i](args);
                }
            }
            return this
        }
        on(x: any, func: any) {
            if (!(typeof func == "function" && x)) {
                return this
            }
            if (x in this._events) {
                MessageUtil.indexOf(this._events, func) == -1 && this._events[x].push(func)
            } else {
                this._events[x] = [func];
            }
            return this
        }
        removeEvent(x: any, fn: any) {
            if (x in this._events) {
                for (var a = 0, l = this._events[x].length; a < l; a++) {
                    if (this._events[x][a] == fn) {
                        this._events[x].splice(a, 1)
                    }
                }
            }
            return this
        }
        _encode(x: any) {
            var str = "?messageid=" + x.getMessageId() + "&header=" + x.getHeaderFlag() + "&sessionid=" + CookieHelper.createStorage().getItem(Navigate.Endpoint.userId + "sId");
            if (!/(PubAckMessage|QueryConMessage)/.test(x.constructor._name)) {
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
        sdkVer: string = "1.1.0";
        apiVer: any = Math.floor(Math.random() * 1e6);
        channel: Channel = null;
        handler: any = null;
        userId: string = "";
        reconnectObj: any = {};
        heartbeat: any = 0;
        chatroomId: string = '';
        static userInfoMapping: any = {};
        SyncTimeQueue: any;
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
                        this.channel.disconnect()
                    } catch (e) {
                    }
                    clearTimeout(this.timeout_);
                    this.timeout_ = 0;
                    this.channel.reconnect();
                    this.channel.socket.fire("StatusChanged", 5);
                }, this.timeoutMillis)
            }
        }
        pauseTimer() {
            if (this.timeout_) {
                clearTimeout(this.timeout_);
                this.timeout_ = 0;
            }
        }
        connect(_callback: any) {
            if (Navigate.Endpoint.host) {
                if (Transports._TransportType == Socket.WEBSOCKET) {
                    if (!window.WebSocket) {
                        _callback.onError(ConnectionState.UNACCEPTABLE_PROTOCOL_VERSION);
                        return;
                    }
                    //判断是否是flashsocket  是的话就加载代理文件
                    'loadFlashPolicyFile' in WebSocket && WebSocket.loadFlashPolicyFile();
                }
                //实例消息处理类
                // this.handler = new MessageHandler(this);TODO
                //设置连接回调
                this.handler.setConnectCallback(_callback);
                //实例通道类型
                this.channel = new Channel(Navigate.Endpoint, function() {
                    Transports._TransportType == Socket.WEBSOCKET && this.keepLive()
                }, this);
                //触发状态改变观察者
                this.channel.socket.fire("StatusChanged", 1)
            } else {
                //没有返回地址就手动抛出错误
                _callback.onError(ConnectionState.NOT_AUTHORIZED);
            }
        }
        keepLive() {
            if (this.heartbeat > 0) {
                clearInterval(this.heartbeat);
            }
            this.heartbeat = setInterval(function() {
                this.resumeTimer();
                this.channel.writeAndFlush(new PingReqMessage());
                console.log("keep live pingReqMessage sending appId " + this.appId);
            }, 180000);
        }
        clearHeartbeat() {
            clearInterval(this.heartbeat);
            this.heartbeat = 0;
            this.pauseTimer();
        }
        publishMessage(_topic: any, _data: any, _targetId: any, _callback: any, _msg: any) {
            var msgId = new MessageIdHandler().messageIdPlus(this.channel.reconnect);
            if (!msgId) {
                return;
            }
            var msg = new PublishMessage(_topic, _data, _targetId);
            msg.setMessageId(msgId);
            if (_callback) {
                msg.setQos(Qos.AT_LEAST_ONCE);
                this.handler.putCallback(new PublishCallback(_callback.onSuccess, _callback.onError), msg.getMessageId(), _msg)
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
            var msgId = new MessageIdHandler().messageIdPlus(this.channel.reconnect);
            if (!msgId) {
                return;
            }
            var msg = new QueryMessage(_topic, _data, _targetId);
            msg.setMessageId(msgId);
            msg.setQos(_qos);
            this.handler.putCallback(new QueryCallback(_callback.onSuccess, _callback.onError), msg.getMessageId(), pbtype);
            this.channel.writeAndFlush(msg)
        }
        invoke() {
            var time: string, modules: any, str: string, target: string, temp: any = this.SyncTimeQueue.shift();
            if (temp == undefined) {
                return;
            }
            this.SyncTimeQueue.state = "pending";
            if (temp.type != 2) {
                //普通消息
                time = CookieHelper.createStorage().getItem(this.userId) || 0;
                modules = new Modules.SyncRequestMsg();
                modules.setIspolling(false);
                str = 'pullMsg';
                target = this.userId;
            } else {
                //聊天室消息
                time = CookieHelper.createStorage().getItem(this.userId + "CST") || 0;
                modules = new Modules.ChrmPullMsg();
                modules.setCount(0);
                str = 'chrmPull';
                if (this.chatroomId === '') {
                    //受到聊天室消息，但是本地没有加入聊天室就手动抛出一个错误
                    throw new Error("syncTime:Received messages of chatroom but was not init");
                }
                target = this.chatroomId;
            }
            //判断服务器给的时间是否消息本地存储的时间，小于的话不执行拉取操作，进行一下步队列操作
            if (temp.pulltime <= time) {
                this.SyncTimeQueue.state = "complete";
                this.invoke();
                return;
            }
            modules.setSyncTime(time);
            //发送queryMessage请求
            this.queryMessage(str, MessageUtil.ArrayForm(modules.toArrayBuffer()), target, Qos.AT_LEAST_ONCE, {
                onSuccess: function(collection: any) {
                    var sync = MessageUtil.int64ToTimestamp(collection.syncTime),
                        symbol = this.userId;
                    if (str == "chrmPull") {
                        symbol += 'CST';
                    }
                    //把返回时间戳存入本地，普通消息key为userid，聊天室消息key为userid＋'CST'；value都为服务器返回的时间戳
                    CookieHelper.createStorage().setItem(symbol, sync);
                    //把拉取到的消息逐条传给消息监听器
                    var list = collection.list;
                    for (var i = 0; i < list.length; i++) {
                        // bridge._client.handler.onReceived(list[i])
                        // TODO
                    }
                    this.SyncTimeQueue.state = "complete";
                    this.invoke();
                },
                onError: function() {
                    this.SyncTimeQueue.state = "complete";
                    this.invoke();
                }
            }, "DownStreamMessages");
        }
        syncTime(_type: any, pullTime: any) {
            this.SyncTimeQueue.push({ type: _type, pulltime: pullTime });
            //如果队列中只有一个成员并且状态已经完成就执行invoke方法
            if (this.SyncTimeQueue.length == 1 && this.SyncTimeQueue.state == "complete") {
                this.invoke()
            }
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
            Bridge._client = new Navigate().connect(appKey, token, callback);
            return Bridge._client;
        }
        setListener(_changer: any): void {
            if (typeof _changer == "object") {
                if (typeof _changer.onChanged == 'function') {
                    Channel._ConnectionStatusListener = _changer;
                } else if (typeof _changer.onReceived == 'function') {
                    Channel._ReceiveMessageListener = _changer;
                }
            }
        }
        reConnect(callabck: any): void {
            Bridge._client.channel.reconnect(callabck);
        }
        disConnect() {
            Bridge._client.clearHeartbeat();
            Bridge._client.channel.disconnect()
        }
        //执行queryMessage请求
        queryMsg(topic: string, content: string, targetId: string, callback: any, pbname: string): void {
            if (typeof topic != "string") {
                topic = _topic[topic]
            }
            Bridge._client.queryMessage(topic, content, targetId, Qos.AT_MOST_ONCE, callback, pbname);
        }
        //发送消息 执行publishMessage 请求
        pubMsg(topic: string, content: string, targetId: string, callback: any, msg: any): void {
            Bridge._client.publishMessage(_topic[10][topic], content, targetId, callback, msg)
        }
    }
}
