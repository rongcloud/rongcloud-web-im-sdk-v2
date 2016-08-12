/// <reference path="../dts/helper.d.ts"/>
module RongIMLib {
    export class MessageCallback {
        timeoutMillis: number;
        timeout: any = null;
        onError: any = null;
        constructor(error: any) {
            if (error && typeof error == "number") {
                this.timeoutMillis = error;
            } else {
                this.timeoutMillis = 30000;
                this.onError = error;
            }
        }
        resumeTimer() {
            var me: MessageCallback = this;
            if (this.timeoutMillis > 0 && !this.timeout) {
                this.timeout = setTimeout(function() {
                    me.readTimeOut(true);
                }, this.timeoutMillis);
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
                this.onError(ErrorCode.TIMEOUT);
            } else {
                this.pauseTimer();
            }
        }
    }
    export class CallbackMapping {
        publicServiceList: Array<PublicServiceProfile> = [];
        profile: PublicServiceProfile;
        static getInstance(): CallbackMapping {
            return new CallbackMapping();
        }
        pottingProfile(item: any) {
            var temp: any;
            this.profile = new PublicServiceProfile();
            temp = JSON.parse(item.extra);
            this.profile.isGlobal = temp.isGlobal;
            this.profile.introduction = temp.introduction;
            this.profile.menu = <Array<PublicServiceMenuItem>>temp.menu;
            this.profile.hasFollowed = temp.follow;
            this.profile.publicServiceId = item.mpid;
            this.profile.name = item.name;
            this.profile.portraitUri = item.portraitUrl;
            this.profile.conversationType = item.type == "mc" ? ConversationType.APP_PUBLIC_SERVICE : ConversationType.PUBLIC_SERVICE;
            this.publicServiceList.push(this.profile);
        }
        mapping(entity: any, tag: string): any {
            switch (tag) {
                case "GetUserInfoOutput":
                    var userInfo = new UserInfo(entity.userId, entity.userName, entity.userPortrait);
                    return userInfo;
                case "GetQNupTokenOutput":
                    return {
                        deadline: MessageUtil.int64ToTimestamp(entity.deadline),
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
                    disInfo.creatorId = entity.adminUserId;
                    disInfo.id = entity.channelId;
                    disInfo.memberIdList = entity.firstTenUserIds;
                    disInfo.name = entity.channelName;
                    disInfo.isOpen = entity.openStatus;
                    return disInfo;
                case "GroupHashOutput":
                    return entity.result;
                case "QueryBlackListOutput":
                    return entity.userIds;
                case "SearchMpOutput":
                case "PullMpOutput":
                    if (entity.info) {
                        var self = this;
                        Array.forEach(entity.info, function(item: any) {
                            setTimeout(self.pottingProfile(item), 100);
                        });
                    }
                    return this.publicServiceList;
                default:
                    return entity;
            }
        }
    }
    export class PublishCallback extends MessageCallback {
        _cb: any;
        _timeout: any;
        constructor(_cb: any, _timeout: any) {
            super(_timeout);
            this._cb = _cb;
            this._timeout = _timeout;
        }
        process(_status: number, messageUId: string, timestamp: number, _msg: any) {
            this.readTimeOut();
            if (_status == 0) {
                if (_msg) {
                    _msg.setSentStatus = _status;
                }
                RongIMClient._cookieHelper.setItem(Bridge._client.userId, timestamp);
                this._cb({ messageUId: messageUId, timestamp: timestamp });
            } else {
                this._timeout(_status);
            }
        }
        readTimeOut(x?: any) {
            MessageCallback.prototype.readTimeOut.call(this, x);
        }
    }
    export class QueryCallback extends MessageCallback {
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
                    Client.userInfoMapping[data.userId] = data;
                }
                this._cb(data);
            } else {
                status > 0 ? this._timeout(status) : this._cb(status);
            }
        }
        readTimeOut(x?: any) {
            MessageCallback.prototype.readTimeOut.call(this, x);
        }
    }
    export class ConnectAck extends MessageCallback {
        _client: Client;
        _cb: any;
        _timeout: any;
        constructor(_cb: any, _timeout: any, client: Client) {
            super(_timeout);
            this._client = client;
            this._cb = _cb;
            this._timeout = _timeout;
        }
        process(status: number, userId: string, timestamp: number) {
            this.readTimeOut();
            if (status == 0) {
                var naviStr = RongIMClient._cookieHelper.getItem(RongIMClient._cookieHelper.getItemKey("navi"));
                var naviKey = RongIMClient._cookieHelper.getItemKey("navi");

                var arr = decodeURIComponent(naviStr).split(",");
                if (!arr[1]) {
                    naviStr = encodeURIComponent(naviStr) + userId;
                    RongIMClient._cookieHelper.setItem(naviKey, naviStr);
                }
                if (RongIMClient._memoryStore.isUseWebSQLProvider) {
                    RongIMClient._dataAccessProvider.database.init(userId);
                }
                this._client.userId = userId;
                var self = this, temp = RongIMLib.RongIMClient._cookieHelper.getItemKey("navi");
                var naviServer = RongIMLib.RongIMClient._cookieHelper.getItem(temp);
                // TODO  判断拆分 naviServer 后的数组长度。
                var naviPort = naviServer.split(",")[0].split(":")[1];
                if (!RongIMClient._memoryStore.global["WEB_XHR_POLLING"] && RongIMClient._memoryStore.isFirstPingMsg && naviPort.length < 4) {
                    Bridge._client.checkSocket({
                        onSuccess: function() {
                            if (!RongIMClient.isNotPullMsg) {
                                self._client.syncTime(undefined, undefined, undefined, true);
                            }
                        },
                        onError: function() {
                            RongIMClient._memoryStore.isFirstPingMsg = false;
                            RongIMClient.getInstance().disconnect();
                            var temp: string = RongIMClient._cookieHelper.getItemKey("navi");
                            var server: string = RongIMClient._cookieHelper.getItem("RongBackupServer");
                            var arrs: string[] = server.split(",");
                            if (arrs.length < 2) {
                                throw new Error("navi server is empty");
                            }
                            RongIMClient._cookieHelper.setItem(temp, RongIMClient._cookieHelper.getItem("RongBackupServer"));
                            var url: string = RongIMLib.Bridge._client.channel.socket.currentURL;
                            RongIMLib.Bridge._client.channel.socket.currentURL = arrs[0] + url.substring(url.indexOf("/"), url.length);
                            RongIMClient.connect(RongIMLib.RongIMClient._memoryStore.token, RongIMClient._memoryStore.callback);
                        }
                    });
                } else {
                    if (!RongIMLib.RongIMClient.isNotPullMsg) {
                        self._client.syncTime(undefined, undefined, undefined, true);
                    }
                }

                if (this._client.reconnectObj.onSuccess) {
                    this._client.reconnectObj.onSuccess(userId);
                    delete this._client.reconnectObj.onSuccess;
                } else {
                    var me = this;
                    setTimeout(function() { me._cb(userId); }, 500);
                }
                Bridge._client.channel.socket.fire("StatusChanged", 0);
                RongIMLib.RongIMClient._memoryStore.connectAckTime = timestamp;
                if (!(new Date().getTime() - timestamp)) {
                    RongIMClient._memoryStore.deltaTime = 0;
                } else {
                    RongIMClient._memoryStore.deltaTime = new Date().getTime() - timestamp;
                }

            } else if (status == 6) {
                //重定向 连错 CMP
                var x: any = {};
                var me = this;
                new Navigation().getServerEndpoint(this._client.token, this._client.appId, function() {
                    me._client.clearHeartbeat();
                    new Client(me._client.token, me._client.appId).__init.call(x, function() {
                        Transportations._TransportType == "websocket" && me._client.keepLive();
                    });
                    me._client.channel.socket.fire("StatusChanged", 2);
                }, me._timeout, false);
            } else {
                Bridge._client.channel.socket.socket._status = status;
                if (this._client.reconnectObj.onError) {
                    this._client.reconnectObj.onError(status);
                    delete this._client.reconnectObj.onError;
                } else {
                    this._timeout(status);
                }
            }
        }
        readTimeOut(x?: any) {
            MessageCallback.prototype.readTimeOut.call(this, x);
        }
    }
}
