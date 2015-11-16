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
            return [MessageTag[1], MessageTag[2]];
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
        encode() {
            var c = new Modules.UpStreamMessage();
            c.setSessionId(3);
            c.setClassname(this.getObjectName());
            c.setContent(JSON.stringify(this.getDetail()));
            var val = c.toArrayBuffer();
            if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
                return [].slice.call(new Int8Array(val))
            }
            return val
        }
    }
    export class InformationNotificationMessage extends RongIMMessage implements UserInfoAttachedMessage, ExtraAttachedMessage {
        static message: InformationNotificationMessage;
        public userInfo: UserInfo;
        constructor(message: any) {
            super(message);
            this.setMessageType(MessageType.InformationNotificationMessage);
            this.setObjectName("RC:InfoNtf");
        }
        static obtain(content: string): InformationNotificationMessage {
            InformationNotificationMessage.message = new InformationNotificationMessage({ content: content, extra: "" });
            return InformationNotificationMessage.message;
        }
        getMessage(): InformationNotificationMessage {
            return InformationNotificationMessage.message;
        }
    }
    export class ContactNotificationMessage extends RongIMMessage implements NotificationMessage, UserInfoAttachedMessage {
        public userInfo: UserInfo;
        public extra: string;
        static message: ContactNotificationMessage;
        static CONTACT_OPERATION_ACCEPT_RESPONSE: string = "ContactOperationAcceptResponse";
        static CONTACT_OPERATION_REJECT_RESPONSE: string = "ContactOperationRejectResponse";
        static CONTACT_OPERATION_REQUEST: string = "ContactOperationRequest";
        constructor(message: any) {
            super(message);
            this.setMessageType(MessageType[10]);
            this.setObjectName("RC:ContactNtf");

        }
        static obtain(operation: string, sourceUserId: string, targetUserId: string, message: string): InformationNotificationMessage {
            return new InformationNotificationMessage({
                operation: operation,
                sourceUserId: sourceUserId,
                targetUserId: targetUserId,
                message: message,
                extra: ""
            });
        }
        getMessage(): ContactNotificationMessage {
            return ContactNotificationMessage.message;
        }
        getOperation(): any {
            return this.getDetail().operation;
        }
        setOperation(operation: any) {
            this.setContent(operation, "operation");
        }
        setMessage(m: any) {
            this.setContent(m, "message");
        }
        getSourceUserId(): string {
            return this.getDetail().sourceUserId;
        }
        setSourceUserId(m: string) {
            this.setContent(m, 'sourceUserId');
        }
        getTargetUserId(): string {
            return this.getDetail().targetUserId;
        };
        setTargetUserId(m: string) {
            this.setContent(m, 'targetUserId');
        }
    }
    export class ProfileNotificationMessage extends RongIMMessage implements NotificationMessage, UserInfoAttachedMessage {
        static message: ProfileNotificationMessage;
        public userInfo: UserInfo;
        public extra: string;
        constructor(message: any) {
            super(message);
            this.setMessageType(MessageType.ProfileNotificationMessage);
            this.setObjectName("RC:ProfileNtf");
        }
        static obtain(operation: string, data: string): ProfileNotificationMessage {
            return new ProfileNotificationMessage({
                operation: operation,
                data: data,
                extra: ""
            });
        }
        getMessage(): ProfileNotificationMessage {
            return ProfileNotificationMessage.message;
        }
        getOperation(): any {
            return this.getDetail().operation;
        }
        setOperation(o: any) {
            this.setContent(o, 'operation');
        }
        getData(): any {
            return this.getDetail().data;
        }
        setData(o: any) {
            this.setContent(o, "data");
        }
    }
    export class CommandNotificationMessage extends RongIMMessage implements NotificationMessage, UserInfoAttachedMessage {
        static message: CommandNotificationMessage;
        public userInfo: UserInfo;
        public extra: string;
        constructor(message: any) {
            super(message);
            this.setMessageType(MessageType.CommandNotificationMessage);
            this.setObjectName("RC:ProfileNtf");
        }
        static obtain(x: string, data: string): CommandNotificationMessage {
            return new CommandNotificationMessage({
                name: x,
                data: data,
                extra: ""
            });
        }
        getMessage(): CommandNotificationMessage {
            return CommandNotificationMessage.message;
        }
        getName(): any {
            return super.getDetail().name;
        }
        setName(o: any) {
            this.setContent(o, 'name');
        }
        getData(): any {
            return this.getDetail().data;
        }
        setData(o: any) {
            this.setContent(o, "data");
        }
    }
    export class DiscussionNotificationMessage extends RongIMMessage implements NotificationMessage, UserInfoAttachedMessage {
        static message: DiscussionNotificationMessage;
        public userInfo: UserInfo;
        public extra: string;
        public isReceived: boolean = false;
        constructor(message: any) {
            super(message);
            this.setMessageType(MessageType.DiscussionNotificationMessage);
            this.setObjectName("RC:DizNtf");

        }
        getMessage(): DiscussionNotificationMessage {
            return DiscussionNotificationMessage.message;
        }
        getExtension(): any {
            return this.getDetail().extension;
        }
        getOperator(): any {
            return this.getDetail().operator;
        }
        getType(): any {
            return this.getDetail().type;
        }
        isHasReceived(): boolean {
            return this.isReceived;
        }
        setHasReceived(isRece: boolean) {
            this.isReceived = !!isRece;
        }
        setOperator(a: any) {
            this.setContent(a, "operator")
        }
        setType(a: any) {
            this.setContent(a, "type");
            //1:加入讨论组 2：退出讨论组 3:讨论组改名 4：讨论组群主T人
        }
    }

}
