module RongIMLib {

    export class InformationNotificationMessage implements NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        content: string;
        extra: string;
        messageName: string = "InformationNotificationMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> InformationNotificationMessage.");
            }
            this.content = message.content;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        static obtain(content: string): InformationNotificationMessage {
            return new InformationNotificationMessage({ content: content, extra: "" });
        }

        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }
    export class CommandMessage implements MessageContent, ExtraAttachedMessage {
        content: string;
        extra: string;
        messageName: string = "CommandMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> CommandMessage.");
            }
            this.content = message.content;
            this.extra = message.extra;
        }
        static obtain(content: string): CommandMessage {
            return new CommandMessage({ content: content, extra: "" });
        }
        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }
    export class ContactNotificationMessage implements NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        static CONTACT_OPERATION_ACCEPT_RESPONSE: string = "ContactOperationAcceptResponse";
        static CONTACT_OPERATION_REJECT_RESPONSE: string = "ContactOperationRejectResponse";
        static CONTACT_OPERATION_REQUEST: string = "ContactOperationRequest";
        operation: string;
        targetUserId: string;
        sourceUserId: string;
        message: string;
        extra: string;
        messageName: string = "ContactNotificationMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ContactNotificationMessage.");
            }
            this.operation = message.operation;
            this.targetUserId = message.targetUserId;
            this.message = message.message;
            this.extra = message.extra;
            this.sourceUserId = message.sourceUserId;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        static obtain(operation: string, sourceUserId: string, targetUserId: string, message: string): InformationNotificationMessage {
            return new InformationNotificationMessage({ operation: operation, sourceUserId: sourceUserId, targetUserId: targetUserId, message: message });
        }

        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }
    export class ProfileNotificationMessage implements MessageContent, NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        operation: string;
        data: string;
        extra: string;
        messageName: string = "ProfileNotificationMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ProfileNotificationMessage.");
            }
            this.operation = message.operation;
            this.data = message.data;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        static obtain(operation: string, data: string): ProfileNotificationMessage {
            return new ProfileNotificationMessage({ operation: operation, data: data });
        }

        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }
    export class CommandNotificationMessage implements MessageContent, NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        data: string;
        name: string;
        extra: string;
        messageName: string = "CommandNotificationMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ProfileNotificationMessage.");
            }
            this.data = message.data;
            this.name = message.name;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }

        static obtain(name: string, data: string): CommandNotificationMessage {
            return new CommandNotificationMessage({ name: name, data: data, extra: "" });
        }

        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }
    export class DiscussionNotificationMessage implements MessageContent, NotificationMessage, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        extra: string;
        extension: string;
        type: number;
        isHasReceived: boolean;
        operation: string;
        messageName: string = "DiscussionNotificationMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> DiscussionNotificationMessage.");
            }
            this.extra = message.extra;
            this.extension = message.extension;
            this.type = message.type;
            this.isHasReceived = message.isHasReceived;
            this.operation = message.operation;
            this.userInfo = message.userInfo;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

}
