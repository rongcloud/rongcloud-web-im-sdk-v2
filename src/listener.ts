module RongIMLib {
    export interface ConnectionStatusListener {
        onChanged(status: number): void;
    }

    export interface OnReceiveMessageListener {
        onReceived(message: Message, left: number, hasMore: boolean): void;
    }

    export interface OnRTCReceiveMessageListener {
        onReceived(message: Message): void;
    }

    export interface RealTimeLocationListener {
        onError(errorCode: RealTimeLocationErrorCode): void;
        onParticipantsJoin(userId: string): void;
        onParticipantsQuit(userId: string): void;
        onReceiveLocation(latitude: number, longitude: number, userId: string): void;
        onStatusChange(status: RealTimeLocationStatus): void;
    }
}
