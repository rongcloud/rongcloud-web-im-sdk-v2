module RongIMLib {
    export interface Transportation {
        //创建通道
        createTransport():any;
        //传送消息流
        send(data:any):any;
        //接收服务器返回消息
        onData(data?:any):string;
        //处理通道关闭操作
        onClose():any;
        //通道异常操作
        onError(error:any):void;
        //绑定事件
        addEvent():void;
        //断开连接
        disconnect():void;
        //重新连接
        reconnect():void;
    }
}
