module RongIMLib {
    export interface OperationCallback {
        onError(error: ErrorCode): void;
        onSuccess(info?: any): void;
    }

    export interface ResultCallback<T> {
        onError(error: ErrorCode): void;
        onSuccess(result: T): void;
    }

    export interface ConnectCallback extends ResultCallback<string> {
        onSuccess(userId: string): void;
        onTokenIncorrect(error: ConnectionState): void;
    }

    export interface CreateDiscussionCallback extends ResultCallback<string> {
        onSuccess(discussionId: string): void;
    }

    export interface GetBlacklistCallback extends ResultCallback<string[]> {
        onSuccess(userIds: string[]): void;
    }

    export interface GetNotificationQuietHoursCallback {
        onError(error: ErrorCode): void;

        /**
         * 获取消息通知免打扰时间成功。
         *
         * @param startTime   起始时间 格式 HH:MM:SS。
         * @param spanMinutes 间隔分钟数 0 &lt; spanMins &lt; 1440。
         */
        onSuccess(startTime: string, spanMinutes: number): void;
    }

    export interface SendImageMessageCallback {

    }
    export interface SendMessageCallback {
        onError(error: ErrorCode, result: Message): void;
        onSuccess(result: Message): void;
    }
    export interface GetHistoryMessagesCallback {
        onError(error: ErrorCode): void;
        onSuccess(result: Message[], hasMoreMessages: boolean): void;
    }
}
