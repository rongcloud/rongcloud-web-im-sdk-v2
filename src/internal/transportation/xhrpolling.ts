module RongIMLib {
    export class XHRPolling implements Transportation {
        url: string;
        connectStatus: string;
        polling: any;
        allowWithCrendentials: boolean;
        isXHR: boolean = true;
        empty: Function = new Function;
        //构造函数传入参数
        constructor(url: string) {
            this.url = url;
        }
        //创建通道
        createTransport(): any {
            var request = this.createHtppRequest();
            this.polling=request;
        }
        //传送消息流
        send(data: any): any {

        }
        //接收服务器返回消息
        onData(data: any): string {
            return null;
        }
        //处理通道关闭操作
        onClose(): any {
            this.connectStatus = "close";
        }
        //通道异常操作
        onError(error: any): void {

        }
        //绑定事件
        addEvent(): void {

        }
        /***
        *返回XMLHttpRequest或者XdomainRequest
        *设置参数 isXHR、allowWithCrendentials
        */
        createHtppRequest(): any {
            var hasCORS = typeof XMLHttpRequest !== 'undefined' && 'withCredentials' in new XMLHttpRequest(), self = this;
            if ('undefined' != typeof XMLHttpRequest && hasCORS) {
                self.allowWithCrendentials=true;
                //isXHR 此处无需设置，默认true
                return new XMLHttpRequest();
            } else if ('undefined' != typeof XDomainRequest) {
                self.isXHR = false;
                return new XDomainRequest();
            } else {
                return new Function;
            }
        }
        checkWithCredentials(): boolean {
            if (!('XMLHttpRequest' in window)) return false;
            var xmlRequest = new XMLHttpRequest();
            return xmlRequest.withCredentials !== undefined;
        }
    }
}
