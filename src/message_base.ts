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
        user: UserInfo;
    }

    export interface ExtraAttachedMessage {
        extra: string;
    }

    export class ModelUtil {
        static modelClone(object: any): any {
            var obj: any = {};
            for (var item in object) {
                if (item != "messageName" && "encode" != item) {
                    obj[item] = object[item];
                }
            }
            return obj;
        }
        static modleCreate(fields: string[], msgType: string): any {
            if (fields.length < 1) {
                throw new Error("Array is empty  -> registerMessageType.modleCreate");
            }
            var Object = function(message: any) {
                var me = this;
                for (var index in fields) {
                    if (message[fields[index]]) {
                        me[fields[index]] = message[fields[index]];
                    }
                }
                Object.prototype.messageName = msgType;
                Object.prototype.encode = function() {
                    return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
                };
            };
            return Object;
        }
    }
}
