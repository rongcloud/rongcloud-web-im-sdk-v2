module RongIMLib {
    export class BaseNotificationMessage extends RongIMMessage {
        constructor(c: any) {
            super(c);
        }
        getMessageTag(): Array<string> {
            return [MessageTag[1], MessageTag[2]]
        }
    }
    export class InformationNotificationMessage extends BaseNotificationMessage implements NotificationMessage, UserInfoAttachedMessage {
        static message: InformationNotificationMessage;
        public userInfo: UserInfo;
        public extra: string;
        constructor(message: any) {
            super(message);
            super.setMessageType(MessageType[9]);
            super.setObjectName("RC:InfoNtf");
        }
        static obtain(content: string): InformationNotificationMessage {
            return new InformationNotificationMessage({ content: content, extra: "" });
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
            return val;
        }
        getMessage(): InformationNotificationMessage {
            return InformationNotificationMessage.message;
        }
    }
    export class ContactNotificationMessage extends BaseNotificationMessage implements NotificationMessage, UserInfoAttachedMessage {
        public userInfo: UserInfo;
        public extra: string;
        static message: ContactNotificationMessage;
        static CONTACT_OPERATION_ACCEPT_RESPONSE: string = "ContactOperationAcceptResponse";
        static CONTACT_OPERATION_REJECT_RESPONSE: string = "ContactOperationRejectResponse";
        static CONTACT_OPERATION_REQUEST: string = "ContactOperationRequest";
        constructor(message: any) {
            super(message);
            super.setMessageType(MessageType[10]);
            super.setObjectName("RC:ContactNtf");

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
        encode(): any {
            var c = new Modules.UpStreamMessage();
            c.setSessionId(0);
            c.setClassname(TextMessage.message.getObjectName());
            c.setContent(JSON.stringify(TextMessage.message.getDetail()));
            var val = c.toArrayBuffer();
            if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
                return [].slice.call(new Int8Array(val))
            }
            return val;
        }
        getMessage(): ContactNotificationMessage {
            return ContactNotificationMessage.message;
        }
        getOperation(): any {
            return super.getDetail().operation;
        }
        setOperation(operation: any) {
            super.setContent(operation, "operation");
        }
        setMessage(m: any) {
            super.setContent(m, "message");
        }
        getSourceUserId(): string {
            return super.getDetail().sourceUserId;
        }
        setSourceUserId(m: string) {
            super.setContent(m, 'sourceUserId');
        }
        getTargetUserId(): string {
            return super.getDetail().targetUserId;
        };
        setTargetUserId(m: string) {
            super.setContent(m, 'targetUserId');
        }
    }
    export class ProfileNotificationMessage extends BaseNotificationMessage implements NotificationMessage, UserInfoAttachedMessage {
        static message: ProfileNotificationMessage;
        public userInfo: UserInfo;
        public extra: string;
        constructor(message: any) {
            super(message);
            super.setMessageType(MessageType[11]);
            super.setObjectName("RC:ProfileNtf");
        }
        static obtain(operation: string, data: string): ProfileNotificationMessage {
            return new ProfileNotificationMessage({
                operation: operation,
                data: data,
                extra: ""
            });
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
            return val;
        }
        getMessage(): ProfileNotificationMessage {
            return ProfileNotificationMessage.message;
        }
        getOperation(): any {
            return super.getDetail().operation;
        }
        setOperation(o: any) {
            super.setContent(o, 'operation');
        }
        getData(): any {
            return super.getDetail().data;
        }
        setData(o: any) {
            super.setContent(o, "data");
        }
    }
    export class CommandNotificationMessage extends BaseNotificationMessage implements NotificationMessage, UserInfoAttachedMessage {
        static message: CommandNotificationMessage;
        public userInfo: UserInfo;
        public extra: string;
        constructor(message: any) {
            super(message);
            super.setMessageType(MessageType[11]);
            super.setObjectName("RC:ProfileNtf");
        }
        static obtain(x: string, data: string): CommandNotificationMessage {
            return new CommandNotificationMessage({
                name: x,
                data: data,
                extra: ""
            });
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
            return val;
        }
        getMessage(): CommandNotificationMessage {
            return CommandNotificationMessage.message;
        }
        getName(): any {
            return super.getDetail().name;
        }
        setName(o: any) {
            super.setContent(o, 'name');
        }
        getData(): any {
            return super.getDetail().data;
        }
        setData(o: any) {
            super.setContent(o, "data");
        }
    }
    export class DiscussionNotificationMessage extends BaseNotificationMessage implements NotificationMessage, UserInfoAttachedMessage {
        //TODO
        static message: DiscussionNotificationMessage;
        public userInfo: UserInfo;
        public extra: string;
        constructor(message: any) {
            super(message);

        }
        static obtain(content: string): DiscussionNotificationMessage {
            return new DiscussionNotificationMessage({ content: content, extra: "" });
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
            return val;
        }
        getMessage(): DiscussionNotificationMessage {
            return DiscussionNotificationMessage.message;
        }
    }
}
