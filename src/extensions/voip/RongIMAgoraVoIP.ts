module RongIMLib {
    export class ChannelInfo {
        constructor(
            public Id: string,
            public Key: string) { }
    }

    export class AcceptMessage implements MessageContent {
        messageName: string = "AcceptMessage";
        callId: string;
        mediaType: VoIPMediaType;
        constructor(message: any) {
            this.callId = message.callId;
            this.mediaType = message.mediaType;
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class RingingMessage implements MessageContent {
        messageName: string = "RingingMessage";
        callId: string;
        constructor(message: any) {
            this.callId = message.callId;
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class SummaryMessage implements MessageContent {
        messageName: string = "SummaryMessage";
        caller: string;
        inviter: string;
        mediaType: VoIPMediaType;
        memberIdList: string[];
        startTime: number;
        connectedTime: number;
        duration: number;
        constructor(message: any) {
            this.caller = message.caller;
            this.inviter = message.inviter;
            this.mediaType = message.mediaType;
            this.memberIdList = message.memberIdList;
            this.startTime = message.startTime;
            this.connectedTime = message.connectedTime;
            this.duration = message.duration;
        }
        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class HungupMessage implements MessageContent {
        messageName: string = "HungupMessage";
        callId: string;
        reason: string;
        constructor(message: any) {
            this.callId = message.callId;
            this.reason = message.reason;
        }
        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class InviteMessage implements MessageContent {
        messageName: string = "InviteMessage";
        callId: string;
        engineType: number;
        channelInfo: ChannelInfo;
        mediaType: VoIPMediaType;
        inviteUserIds: string[];
        extra: string;
        constructor(message: any) {
            this.callId = message.callId;
            this.engineType = message.engineType;
            this.channelInfo = message.channelInfo;
            this.mediaType = message.mediaType;
            this.extra = message.extra;
            this.inviteUserIds = message.inviteUserIds;
        }
        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class MediaModifyMessage implements MessageContent {
        messageName: string = "MediaModifyMessage";
        callId: string;
        mediaType: VoIPMediaType;
        constructor(message: any) {
            this.callId = message.callId;
            this.mediaType = message.mediaType;
        }
        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class MemberModifyMessage implements MessageContent {
        messageName: string = "MemberModifyMessage";
        modifyMemType: number;
        callId: string;
        caller: string;
        engineType: number;
        channelInfo: ChannelInfo;
        mediaType: VoIPMediaType;
        extra: string;
        inviteUserIds: string[];
        existedMemberStatusList: string[];
        constructor(message: any) {
            this.modifyMemType = message.modifyMemType;
            this.callId = message.callId;
            this.caller = message.caller;
            this.engineType = message.engineType;
            this.channelInfo = message.channelInfo;
            this.mediaType = message.mediaType;
            this.extra = message.extra;
            this.inviteUserIds = message.inviteUserIds;
            this.existedMemberStatusList = message.existedMemberStatusList;
        }
        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class RongIMAgoraVoIP implements VoIPProvider {
        _memorySessions: any = {
            timeoutMillis: 30000,
            resolution: "480p",
            maxFrameRate: 15,
            videoSize: { height: 300, width: 400 },
            container: "",
            remoteStreamList: {},
            startVoIPTime: 0,
            isActiveCall: false
        };
        static _instance: RongIMAgoraVoIP = null;
        static _rongIMClient: RongIMClient;
        constructor() {
            var that = this;
            that._memorySessions.client = AgoraRTC.createRtcClient();
            that._memorySessions.client.on('stream-added', function(evt: any) {
                var stream = evt.stream;
                that._memorySessions.client.subscribe(stream, function(err: any) {
                    console.log("Subscribe stream failed", err);
                });
            });

            that._memorySessions.client.on('peer-leave', function(evt: any) {
                for (var key in that._memorySessions.remoteStreamList) {
                    if (key == evt.uid) {
                        that._memorySessions.remoteStreamList[key].stop();
                        delete that._memorySessions.remoteStreamList[key];
                        break;
                    }
                }
                if (that.isEmptyObject()) {
                    that._memorySessions.localStream.stop();
                    that._memorySessions.client.close();
                }
            });

            that._memorySessions.client.on('stream-subscribed', function(evt: any) {
                var stream = evt.stream;
                that._memorySessions.remoteStreamList[stream.getId()] = stream;
                that.displayStream(stream);
            });

            that._memorySessions.client.on("stream-removed", function(evt: any) {
                var stream = evt.stream;
            });
        }
        static init(rongIMClient: RongIMClient) {
            this._instance = new RongIMAgoraVoIP();
            this._rongIMClient = rongIMClient;
        }

        static getInstance(): RongIMAgoraVoIP {
            if (!this._instance) {
                throw new Error("RongIMAgoraVoIP is not init!");
            }
            return this._instance;
        }

        startCall(converType: ConversationType, targetId: string, userIds: string[], mediaType: VoIPMediaType, extra: string, opt: any, callback: ResultCallback<ErrorCode>) {
            if (this._memorySessions["isActiveCall"]) {
                callback.onError(ErrorCode.BUSYLINE);
                return;
            }
            var cookieKey = 'chnl' + Bridge._client.userId + '_' + converType + '_' + targetId, channelId = cookieKey + '_' + (+new Date), that = this;
            that._memorySessions.startCallback = callback;
            if (opt && opt.size) that._memorySessions.videoSize = opt.size;
            if (opt && opt.container) {
                that._memorySessions.container = opt.container;
            } else {
                callback.onError(ErrorCode.VIDEO_CONTAINER_IS_NULL);
                return;
            }
            that._memorySessions["mediaType"] = mediaType;
            RongIMAgoraVoIP._rongIMClient.getAgoraDynamicKey(1, channelId, {
                onSuccess: function(data: any) {
                    that._memorySessions[cookieKey] = new ChannelInfo(channelId, data.dynamicKey);
                    var msg = new InviteMessage({ callId: channelId, engineType: 1, channelInfo: that._memorySessions[cookieKey], mediaType: mediaType, inviteUserIds: userIds, extra: extra });
                    that.sendMessage(converType, targetId, msg, {
                        onSuccess: function(data: any) {
                            that._memorySessions["sentTime"] = data.sentTime;
                        },
                        onError: function() { }
                    });
                },
                onError: function(error: ErrorCode) {
                    callback.onError(error);
                }
            });

        }

        hangupCall(converType: ConversationType, targetId: string, reason: string, callback: any) {
            var that = this;
            that._memorySessions.client.leave();
            that._memorySessions.client.close();
            for (var key in that._memorySessions.remoteStreamList) {
                that._memorySessions.remoteStreamList[key].stop();
                delete that._memorySessions.remoteStreamList[key];
            }
            that._memorySessions["isActiveCall"] = false;
            callback(that.getSummaryMessage(<Message>{ targetId: targetId }));
        }

        joinCall(message: Message, mediaType: VoIPMediaType, opt: any, callback: ResultCallback<ErrorCode>) {
            if (this._memorySessions["isActiveCall"]) {
                callback.onError(ErrorCode.BUSYLINE);
                return;
            }
            var that = this;
            var inviteMsg = <InviteMessage>message.content;
            if (opt && opt.container) {
                that._memorySessions.container = opt.container;
            }
            RongIMAgoraVoIP._rongIMClient.getAgoraDynamicKey(1, inviteMsg.channelInfo.Id, {
                onSuccess: function(data: any) {
                    that._memorySessions.client.init(data.dynamicKey, function(obj: any) {
                        var msg = new AcceptMessage({ callId: inviteMsg.channelInfo.Id, mediaType: mediaType });
                        that.sendMessage(message.conversationType, message.targetId, msg, {
                            onSuccess: function(message: any) {
                                that._memorySessions.client.join(data.dynamicKey, inviteMsg.channelInfo.Id, message.sentTime & 0x7fffffff, function(uid: string) {
                                    that._memorySessions["startVoIPTime"] = +new Date;
                                    that._memorySessions["isActiveCall"] = true;
                                    that.initLocalStream(uid, mediaType);
                                });
                            },
                            onError: function() {
                            }
                        });

                    }, function(err: any) {
                        if (err) {
                            switch (err.reason) {
                                case 'CLOSE_BEFORE_OPEN':
                                    callback.onError(ErrorCode.CLOSE_BEFORE_OPEN);
                                    break;
                                case 'ALREADY_IN_USE':
                                    callback.onError(ErrorCode.ALREADY_IN_USE);
                                    break;
                                case "INVALID_CHANNEL_NAME":
                                    callback.onError(ErrorCode.INVALID_CHANNEL_NAME);
                                    break;
                            }
                        }
                    });
                },
                onError: function(error: ErrorCode) {
                    callback.onError(error);
                }
            });
        }
        getSummaryMessage(message: Message): SummaryMessage {
            var startTime = this._memorySessions["startVoIPTime"], dateTime: number = +new Date - startTime;
            this._memorySessions["startVoIPTime"] = 0;
            return new SummaryMessage({
                caller: Bridge._client.userId,
                inviter: message.targetId,
                mediaType: this._memorySessions["mediaType"],
                startTime: startTime,
                duration: Math.floor(dateTime / 1000)
            });
        }

        isEmptyObject(): boolean {
            var isEmpty: boolean = true, that = this;
            for (var key in that._memorySessions["remoteStreamList"]) {
                isEmpty = false;
                break;
            }
            return isEmpty;
        }

        initLocalStream(uId: string, mediaType: VoIPMediaType) {
            var that = this, videoProfile = that.generateVideoProfile();
            if (that._memorySessions.localStream) {
                that._memorySessions.client.unpublish(that._memorySessions.localStream, function(err: any) {
                    console.log("Unpublish failed with error: ", err);
                });
                that._memorySessions.localStream.close();
            }
            that._memorySessions.localStream = AgoraRTC.createStream({
                streamID: uId,
                local: true
            });
            // if (mediaType == VoIPMediaType.MEDIA_AUDIO) {
            //     that._memorySessions.localStream.disableVideo();
            // }
            that._memorySessions.localStream.setVideoProfile(videoProfile);
            that._memorySessions.localStream.init(function() {
                var size = that._memorySessions.videoSize;
                that.displayStream();
                that._memorySessions.client.publish(that._memorySessions.localStream, function(err: any) { });
                that._memorySessions.client.on('stream-published');
            }, function(err: any) {
                console.log("Local stream init failed.", err);
            });
        }

        displayStream(stream?: any) {
            var that = this;
            if (!stream) {
                that._memorySessions.localStream.play(that._memorySessions.container);
            } else {
                var div = document.createElement("div");
                div.id = that._memorySessions.container + '_' + stream.getId();
                div.setAttribute("class", "viode_container");
                document.getElementById(that._memorySessions.container).appendChild(div);
                stream.play(div.id);
            }
        }

        generateVideoProfile() {
            var result = "480P_2", that = this;
            switch (that._memorySessions.resolution) {
                case '120p':
                    result = "120P";
                    break;
                case '240p':
                    result = "240P";
                    break;
                case '360p':
                    result = "360P";
                    break;
                case '480p':
                    if (that._memorySessions.maxFrameRate === 15) {
                        result = "480P";
                    } else {
                        result = "480P_2";
                    }
                    break;
                case '720p':
                    if (that._memorySessions.maxFrameRate === 15) {
                        result = "720P";
                    } else {
                        result = "720P_2";
                    }
                    break;
                case '1080p':
                    if (that._memorySessions.maxFrameRate === 15) {
                        result = "1080P";
                    } else {
                        result = "1080P_2";
                    }
                    break;
                default:
                    break;
            }
            return result;
        }

        onReceived(message: Message, imOnReceived: any): boolean {
            var that = this, channelInfo = that._memorySessions['chnl' + Bridge._client.userId + '_' + message.conversationType + '_' + message.targetId];
            switch (message.messageType) {
                case RongIMClient.MessageType["InviteMessage"]:
                    var ret = <InviteMessage>message.content;
                    if (that._memorySessions["isActiveCall"]) {
                        var rejectMsg = new HungupMessage({ callId: ret.callId, reason: ErrorCode.REMOTE_BUSYLINE });
                        return;
                    }
                    var msg: RingingMessage = new RingingMessage({ callId: ret.callId });
                    that.sendMessage(message.conversationType, message.targetId, msg);
                    imOnReceived(message);
                    break;
                case RongIMClient.MessageType["RingingMessage"]:
                    imOnReceived(message);
                    break;
                case RongIMClient.MessageType["AcceptMessage"]:
                    if (!channelInfo) return;
                    var accMsg: AcceptMessage = <AcceptMessage>message.content;
                    that._memorySessions["mediaType"] = accMsg.mediaType;
                    that._memorySessions.client.init(channelInfo.Key, function(obj: any) {
                        that._memorySessions.client.join(channelInfo.Key, channelInfo.Id, that._memorySessions["sentTime"] & 0x7fffffff, function(uid: string) {
                            that._memorySessions["startVoIPTime"] = +new Date;
                            that._memorySessions["isActiveCall"] = true;
                            that.initLocalStream(uid,accMsg.mediaType);
                        });
                    }, function(err: any) {
                        if (err) {
                            switch (err.reason) {
                                case 'CLOSE_BEFORE_OPEN':
                                    that._memorySessions.startCallback.onError(ErrorCode.CLOSE_BEFORE_OPEN);
                                    break;
                                case 'ALREADY_IN_USE':
                                    that._memorySessions.startCallback.onError(ErrorCode.ALREADY_IN_USE);
                                    break;
                                case "INVALID_CHANNEL_NAME":
                                    that._memorySessions.startCallback.onError(ErrorCode.INVALID_CHANNEL_NAME);
                                    break;
                            }
                        }
                    });
                    break;
                case RongIMClient.MessageType["HungupMessage"]:
                    that._memorySessions.client.leave();
                    that._memorySessions.client.close();
                    message.messageType = "SummaryMessage";
                    message.content = that.getSummaryMessage(message);
                    that._memorySessions["isActiveCall"] = false;
                    imOnReceived(message);
                    break;
                case RongIMClient.MessageType["MediaModifyMessage"]:
                    break;
                case RongIMClient.MessageType["MemberModifyMessage"]:
                    break;
            }
            return true;
        }

        private sendMessage(converType: ConversationType, targetId: string, msg: MessageContent, callback?: ResultCallback<ErrorCode>) {
            RongIMAgoraVoIP._rongIMClient.sendMessage(converType, targetId, msg, {
                onSuccess: function(message: any) {
                    if (callback) {
                        callback.onSuccess(message);
                    }
                },
                onError: function(error: ErrorCode) {
                    if (callback) {
                        callback.onError(error);
                    }
                }
            });
        }
    }
}
