module RongIMLib {
    //消息基类
    export class RongIMMessage {
        msgType: string = "unknown";
        message: any;
        receiveTime: any;
        converType: number;
        msgDirection: number;
        msgId: string;
        objName: string;
        receivedStatus: any;
        sendUserId: string;
        sentStatus: any;
        sentTime: any;
        targetId: string;
        pushContent: any;
        constructor(message: any) {
            this.message = message || {};
        }
        getPushContent(): any {
            return this.pushContent;
        }
        getDetail(): any {
            return this.message;
        }
        getMessageTag(): any {
            return [MessageTag.ISPERSISTED, MessageTag.ISCOUNTED];
        }
        getContent(): any {
            return this.message.content;
        }
        getConversationType(): number {
            return this.converType;
        }
        getExtra(): string {
            return this.message.extra;
        }
        getMessageDirection(): any {
            return this.msgDirection;
        }
        getMessageId(): string {
            return this.msgId;
        }
        getObjectName(): string {
            return this.objName;
        }
        getReceivedStatus(): any {
            return this.receivedStatus;
        }
        getReceivedTime(): any {
            return this.receiveTime;
        }
        getSenderUserId(): string {
            return this.sendUserId;
        }
        getSentStatus(): any {
            return this.sentStatus;
        }
        getTargetId(): string {
            return this.targetId;
        }
        getMessageType(): any {
            return this.msgType;
        }
        getSentTime(): any {
            return this.sentTime;
        }
        setPushContent(pushContent: any) {
            this.pushContent = pushContent;
        };
        setContent(c: any, d: any) {
            this.message[d || "content"] = c;
        };
        setConversationType(c: number) {
            this.converType = c;
        };
        setExtra(c: string) {
            this.message.extra = c;
        };
        setMessageDirection(c: any) {
            this.msgDirection = c;
        };
        setMessageId(msgId: string) {
            this.msgId = msgId;
        };
        setObjectName(objName: string) {
            this.objName = objName;
        };
        setReceivedStatus(status: any) {
            this.receivedStatus = status;
        };
        setSenderUserId(userId: string) {
            this.sendUserId = userId;
        };
        setSentStatus(status: any) {
            return !!(this.sentStatus = status)
        };
        setSentTime(sentTime: any) {
            this.sentTime = MessageUtil.int64ToTimestamp(sentTime);
        };
        setTargetId(targetId: string) {
            this.targetId = targetId;
        };
        setReceivedTime(receiveTime: any) {
            this.receiveTime = receiveTime;
        };
        setMessageType(msgType: any) {
            this.msgType = msgType;
        }
        toJSONString(): any {
            var c = {
                "receivedTime": this.receiveTime,
                "messageType": this.msgType,
                "details": this.message,
                "conversationType": this.converType,
                "direction": this.msgDirection,
                "messageId": this.msgId,
                "objectName": this.objName,
                "senderUserId": this.sendUserId,
                "sendTime": this.sentTime,
                "targetId": this.targetId
            };
            return JSON.stringify(c)
        }
    }
    export class TextMessage extends RongIMMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        //此处直接赋值对象为以后添加扩展属性埋下伏笔
        static message: any;
        constructor(message?: any) {
            super(message);
            if (!TextMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead.");
            }
            if (typeof message == "string") {
                message.content = this.message;
            } else {
                if (!("content" in message)) throw new Error("content attribute does not exist position:sendMessage");
                this.message = message;
            }
            super.setObjectName("RC:TxtMsg");
        }
        static obtain(content: string): TextMessage {
            TextMessage.message = new TextMessage(content);
            return TextMessage.message;
        }
        encode(): any {
            var c = new Modules.UpStreamMessage();
            c.setSessionId(0);
            c.setClassname(TextMessage.message.getObjectName());
            c.setContent(JSON.stringify(TextMessage.message.getDetail()));
            var val = c.toArrayBuffer();
            if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
                return [].slice.call(new Int8Array(val))
            }
            return val
        }
        getMessage(): TextMessage {
            return TextMessage.message;
        }
    }

    export class VoiceMessage extends RongIMMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        extra: string;
        duration: number;
        private _base64Content: string;

        constructor(data?: string) {
            super(this);
            if (!VoiceMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead.");
            }
        }

        static obtain(base64Content: string, duration: number): VoiceMessage {
            var message = new VoiceMessage();

            message._base64Content = base64Content;
            message.duration = duration;

            return message;
        }

        encode(): string {
            return JSON.stringify(this);
        }
        getMessage(): RongIMMessage {
            return this.message;
        }
    }

    export class ImageMessage extends RongIMMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        extra: string;

        constructor(data: string) {
            super(this);
        }

        static obtain(content: string): ImageMessage {
            return undefined;
        }

        encode(): string {
            return JSON.stringify(this);
        }
        getMessage(): RongIMMessage {
            return this.message;
        }
    }

    export class LocationMessage extends RongIMMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        extra: string;
        latitude: number;
        longitude: number;
        poi: string;
        imgUri: string;

        constructor(data: string) {
            super(this);
        }

        static obtain(latitude: number, longitude: number, poi: string, imgUri: string): LocationMessage {
            return undefined;
        }

        encode(): string {
            return JSON.stringify(this);
        }
        getMessage(): RongIMMessage {
            return this.message;
        }
    }

    export class UnknownMessage extends RongIMMessage implements MessageContent {
        constructor(data: string, objectName: string) {
            super(this);
        }

        encode(): string {
            return JSON.stringify(this);
        }
        getMessage(): RongIMMessage {
            return this.message;
        }
    }
}
