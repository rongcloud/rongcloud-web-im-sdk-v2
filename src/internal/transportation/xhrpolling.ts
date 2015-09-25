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
        requests: any;
        sendPollingKey: string = "send";
        connectPollingKey: string = "connect";
        requestParams: any;
        queue: Array<any>;
        constructor() {
            this.requests = new Object;
            this.requestParams = new Object;
            this.requestParams[this.connectPollingKey] = new Object;
            this.requestParams[this.sendPollingKey] = new Object;
            this.queue = [];
            return this;
        }
        /**
         * [createTransport 创建Polling，打开请求连接]
         * @return {PollingTransportation} [此处与websocket略有区别，此处不返回Polling对象]
         */
        createTransport(url: string, method: string): any {
            if (!url || !method) throw new Error("Url or method is empty,Please check them!");
            var request = this.XmlHtppRequest();
            this.requests[this.connectPollingKey] = request;
            this.requestParams[this.connectPollingKey]["url"] = url;
            this.requestParams[this.connectPollingKey]["method"] = method;
            this.createPolling(this.requestParams[this.connectPollingKey]["url"], this.requestParams[this.connectPollingKey]["method"], this.connectPollingKey);
            return this;
        }
        /**
         * [send 发送消息，Method:POST]
         * queue 为消息队列，待通道可用发送所有等待消息
         * @param  {string} data [需要传入comet格式数据，此处只负责通讯通道，数据转换在外层处理]
         */
        send(data: any, url: string, method: string): void {
            if (!this.connected) this.queue.push(data);
            if (this.isClose) throw new Error("The Connection is closed,Please open the Connection!!!");
            var request = this.XmlHtppRequest();
            this.requests[this.sendPollingKey] = request;
            this.requestParams[this.sendPollingKey]["url"] = url;
            this.requestParams[this.sendPollingKey]["method"] = method;
            this.createPolling(this.requestParams[this.sendPollingKey]["url"], this.requestParams[this.sendPollingKey]["method"], this.sendPollingKey);
            if ('setRequestHeader' in this.requests[this.sendPollingKey]) {
                this.requests[this.sendPollingKey].setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
            }
            var self = this;
            setTimeout(function(){
                self.requests[self.sendPollingKey].send(data);
            },2000)
        }
        //接收服务器返回消息
        onData(data?: any): string {
            //TODO 转换数据，触发事件，告知client，将数据回显
            return "";
        }
        onClose(isrecon?: boolean): any {
            if (this.isXHR) {
                //connect-request
                if (this.requests[this.connectPollingKey]) {
                    this.requests[this.connectPollingKey].onreadystatechange = this.requests[this.connectPollingKey].onload = this.empty;
                    this.requests[this.connectPollingKey].abort();
                    delete this.requests[this.connectPollingKey];
                    if (!isrecon) {
                        this.requestParams[this.connectPollingKey] = "";
                        this.requestParams[this.sendPollingKey] = "";
                    }
                }
                //send-request
                if (this.requests[this.sendPollingKey]) {
                    this.requests[this.sendPollingKey].onreadystatechange = this.requests[this.sendPollingKey].onload = this.empty;
                    this.requests[this.sendPollingKey].abort();
                    delete this.requests[this.sendPollingKey];
                    if (!isrecon) {
                        this.resetParams();
                    }
                }
            } else {
                if (this.requests[this.connectPollingKey]) {
                    this.requests[this.connectPollingKey].onload = this.requests[this.connectPollingKey].onload = this.empty;
                    this.requests[this.connectPollingKey].abort();
                    delete this.requests[this.connectPollingKey];
                    if (!isrecon) {
                        this.requestParams[this.connectPollingKey] = "";
                        this.requestParams[this.sendPollingKey] = "";
                    }
                }
                //send-request
                if (this.requests[this.sendPollingKey]) {
                    this.requests[this.sendPollingKey].onload = this.requests[this.sendPollingKey].onload = this.empty;
                    this.requests[this.sendPollingKey].abort();
                    delete this.requests[this.sendPollingKey];
                    if (!isrecon) {
                        this.resetParams();
                    }
                }
            }
        }
        resetParams(): void {
            this.requestParams[this.connectPollingKey] = "";
            this.requestParams[this.sendPollingKey] = "";
        }
        onError(error: any): void {
            throw new Error(error);
        }
        addEvent(key?: string): void {
            var self = this, polling = self.requests[key];
            if (self.isXHR) {
                polling.onreadystatechange = function() {
                    //readyState=1：A request has been opened, but the send method has not been called.
                    //readyState=4: All the data has been received.
                    if (polling.readyState == 1) {
                        self.connected = true;
                        //发送消息队列中未发送的消息
                        self.doQueue(key);
                    }
                    if (4 != polling.readyState) return;
                    //204为错误状态码，在IE原生的XHR会被转换成200，而在IE的ActiveX版本中会被转换为1223,所以此处判断200 和 1223
                    if (200 == polling.status || 1223 == polling.status) {
                        self.onPollingSuccess(key);
                    } else if (/^(400|403)$/.test(polling.status)) {
                        self.onPollingError();
                    } else {
                        self.onError(polling.status);
                    }
                }
            } else {
                polling.onload = function() {
                    this.onload = self.empty;
                    if (this.responseText == 'lost params') {
                        self.onPollingError();
                    } else {
                        self.onPollingSuccess(key);
                    }
                };
                polling.onerror = function() {
                    self.onError(polling.responseText);
                };
            }
        }
        XmlHtppRequest(): any {
            var hasCORS = typeof XMLHttpRequest !== 'undefined' && 'withCredentials' in new XMLHttpRequest(), self = this;
            if ('undefined' != typeof XMLHttpRequest && hasCORS) {
                self.allowWithCrendentials = true;
                //isXHR 此处无需设置，默认true
                return new XMLHttpRequest();
            } else if ('undefined' != typeof XDomainRequest) {
                self.isXHR = false;
                return new XDomainRequest();
            } else {
                return new Function;
            }
        }
        createPolling(url: string, method: string, key: string) {
            this.requests[key].open(method, url);
            this.addEvent(key);
        }
        checkWithCredentials(): boolean {
            if (!('XMLHttpRequest' in window)) return false;
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
        reconnect(): void {
            this.onClose(true);
            this.createTransport(this.requestParams[this.connectPollingKey]["url"], this.requestParams[this.connectPollingKey]["method"]);
        }
        onPollingSuccess(key?: string): void {
            //把数据返回，随后判断状态是否开启下次请求
            var responseText = this.requests[key].responseText;
            this.onData(responseText);
            if (/"headerCode":-32,/.test(responseText)) return;
            this.createTransport(this.requestParams[key].url, this.requestParams[key].method);
        }
        onPollingError(): void {
            this.disconnect();
        }
    }
}
