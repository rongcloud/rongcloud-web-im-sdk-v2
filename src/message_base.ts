module RongIMLib {
    export abstract class MessageContent {
        messageName: string;

        constructor(data?: any) {
            throw new Error("This method is abstract, you must implement this method in inherited class.");
        }

        static obtain(): MessageContent {
            throw new Error("This method is abstract, you must implement this method in inherited class.");
        }

        abstract encode(): string;

    }
    export abstract class NotificationMessage extends MessageContent { }

    export abstract class StatusMessage extends MessageContent { }

    export interface UserInfoAttachedMessage {
        userInfo: UserInfo;
    }

    export interface ExtraAttachedMessage {
        extra: string;
    }

    export class ModelUtil {
        static modelClone(object: any): any {
            var obj: any = {};
            for (var item in object) {
                if (item != "messageName") {
                    obj[item] = object[item];
                }
            }
            return obj;
        }
        static modleCreate(fields: string[]): any {
            if (fields.length < 1) {
                throw new Error("Array is empty  -> registerMessageType.modleCreate");
            }
            var Object = function(message: any) {
                for (var index in fields) {
                    if (message[fields[index]]) {
                        Object.prototype[fields[index]] = message[fields[index]];
                    }
                }
                this.encode = function() {
                    return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
                }
            }
            return Object;
        }
    }
}
