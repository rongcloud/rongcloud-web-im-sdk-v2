module RongIMLib {
    export class PollingTransportation implements Transportation {
        empty: Function = new Function;
        queue: Array<any>;
        sendxhr: any;
        xhr: any;
        socket: Socket;
        url: string;
        connected: boolean = false;
        constructor(socket: Socket) {
            this.queue = [];
            this.socket = socket;
            return this;
        }

        createTransport(url: string, method?: string): any {
            if (!url) { throw new Error("Url is empty,Please check it!"); };
            this.url = url;
            var sid = RongIMClient._cookieHelper.getItem(Navigation.Endpoint.userId + "sId"), me = this;
            if (sid) {
                setTimeout(function() {
                    me.onSuccess("{\"status\":0,\"userId\":\"" + Navigation.Endpoint.userId + "\",\"headerCode\":32,\"messageId\":0,\"sessionid\":\"" + sid + "\"}");
                    me.connected = true;
                }, 500);
                return this;
            }
            this.getRequest(url, true);
            return this;
        }
        private requestFactory(url: string, method: string, multipart?: boolean) {
            var reqest = this.XmlHttpRequest();
            if (multipart) { reqest.multipart = true; }
            reqest.open(method || "GET", MessageUtil.schemeArrs[RongIMClient.schemeType][0] + "://" + url);
            if (method == "POST" && "setRequestHeader" in reqest) {
                reqest.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
            }
            return reqest;
        }
        private getRequest(url: string, isconnect?: boolean) {
            var me = this;
            me.xhr = this.requestFactory(url, "GET");
            if ("onload" in me.xhr) {
                me.xhr.onload = function() {
                    me.xhr.onload = me.empty;
                    if (this.responseText == "lost params") {
                        me.onError();
                    } else {
                        me.onSuccess(this.responseText, isconnect);
                    }
                };
                me.xhr.onerror = function() {
                    me.disconnect();
                };
            } else {
                me.xhr.onreadystatechange = function() {
                    if (me.xhr.readyState == 4) {
                        me.xhr.onreadystatechange = me.empty;
                        if (/^(200|202)$/.test(me.xhr.status)) {
                            me.onSuccess(me.xhr.responseText, isconnect);
                        } else if (/^(400|403)$/.test(me.xhr.status)) {
                            me.onError();
                        } else {
                            me.disconnect();
                        }

                    }
                };
            }
            me.xhr.send();
        }
        /**
         * [send 发送消息，Method:POST]
         * queue 为消息队列，待通道可用发送所有等待消息
         * @param  {string} data [需要传入comet格式数据，此处只负责通讯通道，数据转换在外层处理]
         */
        send(data: any): void {
            var me = this;
            this.sendxhr = this.requestFactory(Navigation.Endpoint.host + "/websocket" + data.url, "POST");
            if ("onload" in me.sendxhr) {
                me.sendxhr.onload = function() {
                    me.sendxhr.onload = me.empty;
                    me.onData(me.sendxhr.responseText);
                };
                me.sendxhr.onerror = function() {
                    me.sendxhr.onerror = me.empty;
                };
            } else {
                me.sendxhr.onreadystatechange = function() {
                    if (me.sendxhr.readyState == 4) {
                        this.onreadystatechange = this.empty;
                        if (/^(202|200)$/.test(me.sendxhr.status)) {
                            me.onData(me.sendxhr.responseText);
                        }
                    }
                };
            }

            me.sendxhr.send(JSON.stringify(data.data));
        }

        onData(data?: any, header?: any): string {
            if (!data || data == "lost params") {
                return;
            }
            var self = this, val = JSON.parse(data);
            if (val.userId) {
                Navigation.Endpoint.userId = val.userId;
            }
            if (header) {
                RongIMClient._cookieHelper.setItem(Navigation.Endpoint.userId + "sId", header);
            }
            if (!MessageUtil.isArray(val)) {
                val = [val];
            }
            Array.forEach(val, function(m: any) {
                self.socket.fire("message", new RongIMLib.MessageInputStream(m, true).readMessage());
            });
            return "";
        }

        XmlHttpRequest(): any {
            var hasCORS = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest(), self = this;
            if ("undefined" != typeof XMLHttpRequest && hasCORS) {
                return new XMLHttpRequest();
            } else if ("undefined" != typeof XDomainRequest) {
                return new XDomainRequest();
            } else {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
        }

        onClose(): void {
            if (this.xhr) {
                if (this.xhr.onload) {
                    this.xhr.onreadystatechange = this.xhr.onload = this.empty;
                } else {
                    this.xhr.onreadystatechange = this.empty;
                }
                this.xhr.abort();
                this.xhr = null;
            }
            if (this.sendxhr) {
                if (this.sendxhr.onload) {
                    this.sendxhr.onreadystatechange = this.sendxhr.onload = this.empty;
                } else {
                    this.sendxhr.onreadystatechange = this.empty;
                }
                this.sendxhr.abort();
                this.sendxhr = null;
            }
        }
        disconnect(): void {
            RongIMClient._cookieHelper.removeItem(Navigation.Endpoint.userId + "sId");
            RongIMLib.RongIMClient._cookieHelper.removeItem(Navigation.Endpoint.userId + "msgId");
            this.onClose();
        }

        reconnect(): void {
            this.disconnect();
            this.createTransport(this.url);
        }

        onSuccess(responseText: string, isconnect?: any): void {
            var txt = responseText.match(/"sessionid":"\S+?(?=")/);
            this.onData(responseText, txt ? txt[0].slice(13) : 0);
            if (/"headerCode":-32,/.test(responseText)) {
                RongIMClient._cookieHelper.removeItem(Navigation.Endpoint.userId + "sId");
                RongIMLib.RongIMClient._cookieHelper.removeItem(Navigation.Endpoint.userId + "msgId");
                return;
            }
            this.getRequest(Navigation.Endpoint.host + "/pullmsg.js?sessionid=" + RongIMClient._cookieHelper.getItem(Navigation.Endpoint.userId + "sId"));
            this.connected = true;
            isconnect && this.socket.fire("connect");
        }

        onError(): void {
            RongIMClient._cookieHelper.removeItem(Navigation.Endpoint.userId + "sId");
            RongIMLib.RongIMClient._cookieHelper.removeItem(Navigation.Endpoint.userId + "msgId");
            this.onClose();
            this.connected = false;
            this.socket.fire("disconnect");
        }

    }
}
