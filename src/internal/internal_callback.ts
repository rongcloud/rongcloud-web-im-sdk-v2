module RongIMLib {

  export interface InFMessageCallback {

  }

  export interface InFPublishCallback {

  }

  export interface InFQueryCallback {

  }
  export interface InFMessageHandler {

    putCallback(callbackObj: any, _publishMessageId: any, _msg: any): any;

    setConnectCallback(_connectCallback: any): void;

    onReceived(msg: any): void;

    handleMessage(msg: any): void;

  }
}
