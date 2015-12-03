module RongIMLib {
    export class PollingTransportation implements Transportation {
        allowWithCrendentials: boolean;
        isXHR: boolean = true;
        empty: Function = new Function;
        //连接状态 true:已连接 ,false:未连接
        connected: boolean = false;
        //是否关闭： true:已关闭 ,false：未关闭
        isClose: boolean = false;
        //存放请求连接对象
        requestParams: any;
        queue: Array<any>;
        _sendXhr: any;
        _xhr: any;
        _socket: Socket;
        constructor(socket: Socket) {
            this.queue = [];
            this._socket = socket;
            return this;
        }
        /**
         * [createTransport 创建Polling，打开请求连接]
         * @return {PollingTransportation} [此处与websocket略有区别，此处不返回Polling对象]
         */
        createTransport(url: string, method?: string): any {
            if (!url){throw new Error("Url is empty,Please check it!");};
            var sid = RongIMClient._storageProvider.getItem(Navigate.Endpoint.userId + "sId"), me = this;
            if (sid) {
                setTimeout(function() {
                    me.onPollingSuccess("{\"status\":0,\"userId\":\"" + Navigate.Endpoint.userId + "\",\"headerCode\":32,\"messageId\":0,\"sessionid\":\"" + sid + "\"}");
                    me.connected = true;
                }, 500);
                return this;
            }
            this._get(url);
            return this;
        }
        _request(url: string, method: string, multipart?: boolean) {
            var req = this.XmlHttpRequest();
            if (multipart) {req.multipart = true;}
            req.open(method || "GET", MessageUtil.schemeArrs[RongIMClient.schemeType][SchemeType.XHR] + "://" + url);
            if (method == "POST" && "setRequestHeader" in req) {
                req.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
            }
            return req;
        }
        _get(url: string, args?: any) {
            var me = this;
            this._xhr = this._request(url, "GET");
            if ("onload" in this._xhr) {
                this._xhr.onload = function() {
                    this.onload = this.empty;
                    if (this.responseText == "lost params") {
                        me.status400(me);
                    } else {
                        me.status200(this.responseText, args);
                    }
                };
                this._xhr.onerror = function() {
                    this.disconnect();
                };
            } else {
                me._xhr.onreadystatechange = function() {
                    if (me._xhr.readyState == 4) {
                        me._xhr.onreadystatechange = me.empty;
                        if (/^(200|202)$/.test(me._xhr.status)) {
                            me.status200(me._xhr.responseText, args);
                        } else if (/^(400|403)$/.test(me._xhr.status)) {
                            me.status400(me);
                        } else {
                            me.disconnect();
                        }

                    }
                };
            }
            this._xhr.send();
        }
        /**
         * [send 发送消息，Method:POST]
         * queue 为消息队列，待通道可用发送所有等待消息
         * @param  {string} data [需要传入comet格式数据，此处只负责通讯通道，数据转换在外层处理]
         */
        send(data: any, url?: string, method?: string): void {
            var me: PollingTransportation = this;
            if (!this.connected) {this.queue.push(data);}
            if (this.isClose) {throw new Error("The Connection is closed,Please open the Connection!!!");}
            this._sendXhr = this._request(Navigate.Endpoint.host + "/websocket" + data.url, "POST");
            if ("onload" in this._sendXhr) {
                this._sendXhr.onload = function() {
                    this.onload = this.empty;
                    me.onData(this.responseText);
                };
                this._sendXhr.onerror = function() {
                    this.onerror = this.empty;
                };
            } else {
                this._sendXhr.onreadystatechange = function() {
                    if (me._sendXhr.readyState == 4) {
                        this.onreadystatechange = this.empty;
                        if (/^(202|200)$/.test(me._sendXhr.status)) {
                            me.onData(me._sendXhr.responseText);
                        }
                    }
                };
            }

            this._sendXhr.send(JSON.stringify(data.data));
        }
        //接收服务器返回消息
        onData(data?: any, header?: any): string {
            if (!data || data == "lost params") {
                return;
            }
            var self = this, val = JSON.parse(data);
            if (val.userId) {
                Navigate.Endpoint.userId = val.userId;
            }
            if (header) {
                RongIMClient._storageProvider.setItem(Navigate.Endpoint.userId + "sId", header);
            }
            if (!MessageUtil.isArray(val)) {
                val = [val];
            }
            Array.forEach(val, function(x: any) {
                self._socket.fire("message", new RongIMLib.MessageInputStream(x, true).readMessage());
            });
            return "";
        }
        onClose(isrecon?: boolean): any {
            if (this._xhr) {
                if (this._xhr.onload) {
                    this._xhr.onreadystatechange = this._xhr.onload = this.empty;
                }else{
                    this._xhr.onreadystatechange = this.empty;
                }
                this._xhr.abort();
                this._xhr = null;
            }
            if (this._sendXhr) {
                if (this._sendXhr.onload) {
                    this._sendXhr.onreadystatechange = this._sendXhr.onload = this.empty;
                }else{
                    this._sendXhr.onreadystatechange = this.empty;
                }
                this._sendXhr.abort();
                this._sendXhr = null;
            }
        }
        onError(error: any): void {
            throw new Error(error);
        }
        XmlHttpRequest(): any {
            var hasCORS = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest(), self = this;
            if ("undefined" != typeof XMLHttpRequest && hasCORS) {
                self.allowWithCrendentials = true;
                //isXHR 此处无需设置，默认true
                return new XMLHttpRequest();
            } else if ("undefined" != typeof XDomainRequest) {
                self.isXHR = false;
                return new XDomainRequest();
            } else {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        checkWithCredentials(): boolean {
            if (!("XMLHttpRequest" in window)){return false;}
            var xmlRequest = new XMLHttpRequest();
            return xmlRequest.withCredentials !== undefined;
        }
        doQueue(key?: string): void {
            if (this.connected) {
                for (let i = 0, len = this.queue.length; i < len; i++) {
                    this.send(this.queue[i], this.requestParams[key].url, this.requestParams[key].method);
                }
            }
        }
        disconnect(): void {
            this.onClose(false);
        }
        reconnect(): any {
            return null;
        }
        onPollingSuccess(a: any, b?: any): void {
            this.onData(a, b);
            if (/"headerCode":-32,/.test(a)){return;}
            this._get(Navigate.Endpoint.host + "/pullmsg.js?sessionid=" + RongIMClient._storageProvider.getItem(Navigate.Endpoint.userId + "sId"), true);
        }
        onPollingError(): void {
            this.disconnect();
        }
        addEvent() {}
        status200(text: string, arg: any) {
            var txt = text.match(/"sessionid":"\S+?(?=")/);
            this.onPollingSuccess(text, txt ? txt[0].slice(13) : void 0);
            this.connected = true;
            arg || this._socket.fire("connect");
        }
        status400(self: any) {
            RongIMClient._storageProvider.removeItem(Navigate.Endpoint.userId + "sId");
            this.disconnect();
            this._socket.fire("disconnect");
            this.connected = false;
            this.isClose = true;
        }
    }
}
