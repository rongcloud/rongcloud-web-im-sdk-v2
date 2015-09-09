module RongIMLib {
    export interface Transportation {
        /**
        *连接服务器
        *@params url:连接服务器地址
        */
        connect(url: string): any;
        /**
        *断开连接
        */
        disconnect(): void;
        /**
        *发送消息
        *@params message :消息类型，暂定为所有Message的抽象类
        */
        sned(message: MessageContent): void;
        /**
        *格式化服务器返回消息
        *@params data type is json or arrayBuffer
        *        comet:json,websocket:arrayBuffer
        */
        decodeData(data: any): any;
    }
}
