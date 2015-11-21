module RongIMLib {
    export abstract class MessageContent {
    constructor(data?: any) {
      throw new Error("This method is abstract, you must implement this method in inherited class.");
    }
    static obtain(): MessageContent {
      throw new Error("This method is abstract, you must implement this method in inherited class.");
    }

    abstract encode(): any;

    abstract getMessage():RongIMMessage;
  }
    export abstract class NotificationMessage extends MessageContent { }

    export abstract class StatusMessage extends MessageContent { }

  export interface UserInfoAttachedMessage {
    userInfo: UserInfo;
  }

  export interface ExtraAttachedMessage {

  }

  // TODO: 内部接口都写到 internal 目录中
  export interface InFMessageHandler {

    putCallback(callbackObj: any, _publishMessageId: any, _msg: any): any;

    setConnectCallback(_connectCallback: any): void;

    onReceived(msg: any): void;

    handleMessage(msg: any): void;

  }
}
