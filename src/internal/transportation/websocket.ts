module RongIMLib {
    export class SocketTransportation implements Transportation {
        url: string;
        connectStatus: string;
        socket: WebSocket;
        //构造函数传入参数
        constructor(url: string) {
            this.url = url;
        }
        //创建通道
        createTransport(): any {
            this.socket = new WebSocket("ws://" + this.url);
            this.addEvent();
        }
        //传送消息流
        send(data: any): any {
            if (this.connectStatus == "close") return;
            //TODO 逻辑判断
            this.socket.send(data);
        }
        //接收服务器返回消息
        onData(data: any): string {
            //TODO 转换数据，触发事件，告知client，将数据回显
            return undefined;
        }
        //处理通道关闭操作
        onClose(): any {
            this.connectStatus = "close";
        }
        //通道异常操作
        onError(error: any): void {
            throw new Error(error);
        }
        addEvent(): void {
            var self = this;
            self.socket.onopen = function() {
                self.connectStatus = "connected";
            }
            self.socket.onmessage = function(ev) {
                self.onData(ev.data);
            }
            self.socket.onerror = function(ev) {
                self.onError(ev);
            }
            self.socket.close = function() {
                self.onClose();
            }
        }
    }
}
