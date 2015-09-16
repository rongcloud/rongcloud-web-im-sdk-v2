module RongIMLib {
    export class XHRPolling implements Transportation {
        url: string;
        //构造函数传入参数
        constructor(url: string) {
            this.url = url;
        }
        //创建通道
        createTransport(): any {

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

        }
        //通道异常操作
        onError(error: any): void {

        }
        //绑定事件
        addEvent(): void {

        }
        //创建request对象，判断是否支持XMLHttpRequest or XdoMainRequest
        createResueat(): any {
            if ('XDomainRequest' in window)
                return new window["XDomainRequest"]();
            if ('XMLHttpRequest' in window && this.checkWithCredentials())
                return new XMLHttpRequest();
        }
        checkWithCredentials(): boolean {
            if (!('XMLHttpRequest' in window))return false;
            var xmlRequest = new XMLHttpRequest();
            return xmlRequest.withCredentials !== undefined;
        }
    }
}
