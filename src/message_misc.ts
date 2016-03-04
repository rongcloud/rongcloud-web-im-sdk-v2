module RongIMLib {
    export class IsTypingStatusMessage implements StatusMessage {
        messageName: string = "IsTypingStatusMessage";
        constructor(data: string) {
            var msg = data;
        }
        encode(): string {
            return undefined;
        }
        getMessage(): any {
var str = "{\"content\": \"法轮功杯子rongcloud\", \"extra\": null}"
            return null;
        }
    }

    export class HandshakeMessage implements NotificationMessage {
        messageName: string = "HandshakeMessage";
        constructor(data: string) {
            var msg = data;
        }
        encode(): string {
            return undefined;
        }
        getMessage(): any {
            return null;
        }
    }

    export class SuspendMessage implements NotificationMessage {
        messageName: string = "SuspendMessage";
        constructor(data: string) {
            var msg = data;
        }
        encode(): string {
            return undefined;
        }
        getMessage(): any {
            return null;
        }
    }
}
