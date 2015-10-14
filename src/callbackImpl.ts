/// <reference path="./dts/util.d.ts"/>
module RongIMLib {
    export class MessageCallback implements InFMessageCallback {
        timeoutMillis: number;
        timeout: any = null
        onError: any = null
        constructor(error: any) {
            if (error && typeof error == "number") {
                this.timeoutMillis = error;
            } else {
                this.timeoutMillis = 6000;
                this.onError = error;
            }
        }
        resumeTimer() {
            if (this.timeoutMillis > 0 && !this.timeout) {
                this.timeout = setTimeout(function() {
                    this.readTimeOut(true);
                }, this.timeoutMillis)
            }
        }
        pauseTimer() {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
        }
        readTimeOut(isTimeout: boolean) {
            if (isTimeout && this.onError) {
                this.onError(ErrorCode.TIMEOUT)
            } else {
                this.pauseTimer();
            }
        }
    }
    export class CallbackMapping {
        static getInstance(): CallbackMapping {
            return new CallbackMapping();
        }
        mapping(entity: any, tag: string): any {
            switch (tag) {
                case "GetUserInfoOutput":
                    var userInfo = new UserInfo();
                    userInfo.setUserId(entity.userId);
                    userInfo.setUserName(entity.userName);
                    userInfo.setPortraitUri(entity.userPortrait);
                    return userInfo;
                case "GetQNupTokenOutput":
                    return {
                        deadline:MessageUtil.int64ToTimestamp(entity.deadline),
                        token: entity.token
                    };
                case "GetQNdownloadUrlOutput":
                    return {
                        downloadUrl: entity.downloadUrl
                    };
                case "CreateDiscussionOutput":
                    return entity.id;
                case "ChannelInfoOutput":
                    var disInfo = new Discussion();
                    disInfo.setCreatorId(entity.adminUserId);
                    disInfo.setId(entity.channelId);
                    disInfo.setMemberIdList(entity.firstTenUserIds);
                    disInfo.setName(entity.channelName);
                    disInfo.setOpen(entity.openStatus);
                    return disInfo;
                case "GroupHashOutput":
                    return entity.result;
                case "QueryBlackListOutput":
                    return entity.userIds;
                default:
                    return entity;
            }
        }
    }
    export class PublishCallback extends MessageCallback implements InFPublishCallback {
        _cb: any;
        _timeout: any;
        constructor(_cb: any, _timeout: any) {
            super(_timeout);
            this._cb = _cb;
            this._timeout = _timeout;
        }
        process(_status: number, _serverTime: any, _msg: any) {
            this.readTimeOut();
            if (_status == 0) {
                if (_msg) {
                    _msg.setSentStatus(_status);
                }
                this._cb();
            } else {
                this._timeout(ErrorCode.UNKNOWN)
            }
        }
        readTimeOut(x?: any) {
            PublishCallback.prototype.readTimeOut.call(this, x);
        }
    }
    export class QueryCallback extends MessageCallback implements InFQueryCallback {
        _cb: any;
        _timeout: any;
        constructor(_cb: any, _timeout: any) {
        super(_timeout);
            this._cb = _cb;
            this._timeout = _timeout;
        }
        process(status: number, data: any, serverTime: any, pbtype: any) {
            this.readTimeOut();
            if (pbtype && data && status == 0) {
                try {
                        data = CallbackMapping.getInstance().mapping(Modules[pbtype].decode(data), pbtype);
                } catch (e) {
                    this._timeout(ErrorCode.UNKNOWN);
                    return;
                }
                if ("GetUserInfoOutput" == pbtype) {
                    //pb类型为GetUserInfoOutput的话就把data放入userinfo缓存队列
                    Client.userInfoMapping[data.getUserId()] = data;
                }
                this._cb(data);
            } else {
                status > 0 ? this._timeout(status) : this._cb(status)
            }
        }
        readTimeOut(x?: any) {
            QueryCallback.prototype.readTimeOut.call(this, x);
        }
    }
}
