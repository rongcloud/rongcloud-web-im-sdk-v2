module RongIMLib {
    export class IsTypingStatusMessage implements StatusMessage {
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

    export class HandshakeMessage implements NotificationMessage {
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
