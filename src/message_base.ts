module RongIMLib {
    export abstract class MessageContent {

    constructor(data?: any) {
      throw new Error("This method is abstract, you must implement this method in inherited class.");
    }

    static obtain(): MessageContent {
      throw new Error("This method is abstract, you must implement this method in inherited class.");
    }

    abstract encode(): any;

  }
    export abstract class NotificationMessage extends MessageContent { }

    export abstract class StatusMessage extends MessageContent { }

  export interface UserInfoAttachedMessage {
    userInfo: UserInfo;
  }

  export interface ExtraAttachedMessage {

  }
}
