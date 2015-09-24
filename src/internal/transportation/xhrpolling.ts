module RongIMLib {
    export class PollingTransportation implements Transportation {
        url: string;
        polling: any;
        allowWithCrendentials: boolean;
        isXHR: boolean = true;
        empty: Function = new Function;
        method: string;
        //连接状态 true:已连接 ,false:未连接
        connected: boolean = false;
        //是否关闭： true:已关闭 ,false：未关闭
        isClose: boolean = false;
        queue: Array<any>;
        //构造函数传入参数
        constructor(url: string, method: string) {
            if (!url || !method) throw new Error("Url or method is empty,Please check them!");
            this.url = "http://" + url;
            this.method = method;
            return this;
        }
        /**
         * [createTransport 创建Polling，打开请求连接]
         * @return {PollingTransportation} [此处与websocket略有区别，此处不返回Polling对象]
         */
        createTransport(): any {
            var request = this.XmlHtppRequest();
            this.polling = request;
            this.createPolling(this.url, this.method);
            return this;
        }
        /**
         * [send 发送消息，Method:POST]
         * queue 为消息队列，待通道可用发送所有等待消息
         * @param  {string} data [需要传入comet格式数据，此处只负责通讯通道，数据转换在外层处理]
         */
        send(data: any): void {
            if (!this.connected) this.queue.push(data);
            if (this.isClose) throw new Error("The Connection is closed,Please open the Connection!!!");
            this.createPolling(this.url, this.method);
            this.polling.send(data);
        }
        //接收服务器返回消息
        onData(data?: any): string {
            //TODO 转换数据，触发事件，告知client，将数据回显
            console.log(data)
            return "";
        }
        //处理通道关闭操作
        onClose(): any {
            this.polling = this.empty;
        }
        //通道异常操作
        onError(error: any): void {
            throw new Error(error);
        }
        //绑定事件
        addEvent(): void {
            var self = this;
            if (self.isXHR) {
                self.polling.onreadystatechange = function() {
                    //readyState=1：A request has been opened, but the send method has not been called.
                    //readyState=4: All the data has been received.
                    if (self.polling.readyState == 1){
                        self.connected = true;
                        //发送消息队列中未发送的消息
                        self.doQueue();
                    }
                    if (4 != self.polling.readyState) return;
                    //204为错误状态码，在IE原生的XHR会被转换成200，而在IE的ActiveX版本中会被转换为1223,所以此处判断200 和 1223
                    if (200 == self.polling.status || 1223 == self.polling.status) {
                        self.onPollingSuccess();
                    } else if (/^(400|403)$/.test(self.polling.status)) {
                        self.onPollingError();
                    } else {
                        self.onError(self.polling.status);
                    }
                }
            } else {
                self.polling.onload = function() {
                    this.onload = self.empty;
                    if (this.responseText == 'lost params') {
                        self.onPollingError();
                    } else {
                        self.onPollingSuccess();
                    }
                };
                self.polling.onerror = function() {
                    self.onError(self.polling.responseText);
                };
            }
        }
        /**
         * [XmlHtppRequest 生产XMLHttpRequest、XDoMainRequest]
         * @return {any} [description]
         */
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
        createPolling(url: string, method: string) {
            this.polling.open(method, url);
            this.addEvent();
        }
        checkWithCredentials(): boolean {
            if (!('XMLHttpRequest' in window)) return false;
            var xmlRequest = new XMLHttpRequest();
            return xmlRequest.withCredentials !== undefined;
        }
        doQueue(): void {
            if (this.connected) {
                for (let i = 0, len = this.queue.length; i < len; i++) {
                    this.send(this.queue[i]);
                }
            }
        }
        disconnect(): void {

        }
        reconnect(): void {

        }
        /**
         * [onPollingSuccess polling正常执行时调用此方法，用来校验是进行下次连接请求]
         */
        onPollingSuccess(): void {
            //把数据返回，随后判断状态是否开启下次请求
            this.onData(this.polling.responseText);
            if (/"headerCode":-32,/.test(this.polling.respnseText)) return;
            this.createTransport();
        }
        /**
         * [onPollingError polling断开连接执行的方法，清楚当前缓存的临时对象]
         */
        onPollingError(): void {
            this.disconnect();
        }
    }
}
