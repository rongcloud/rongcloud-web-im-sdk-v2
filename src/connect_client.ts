//用于连接通道
module RongIMLib {
    export class Channel {
        socket: Socket;
        static _ConnectionStatusListener: any;
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
        disconnect(x: any) {
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
        disconnect(callback: any) {
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
                //this.handler.putCallback(new PublishCallback(_callback.onSuccess, _callback.onError), msg.getMessageId(), _msg)
                //TODO
            } else {
                msg.setQos(Qos.AT_MOST_ONCE);
            }
            this.channel.writeAndFlush(msg);

        }
        queryMessage() {


        }
        invoke() {




        }
        syncTime() {


        }
    }
}
