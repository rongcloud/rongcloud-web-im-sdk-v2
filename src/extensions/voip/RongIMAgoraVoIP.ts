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
        status: ErrorCode;
        constructor(message: any) {
            this.caller = message.caller;
            this.inviter = message.inviter;
            this.mediaType = message.mediaType;
            this.memberIdList = message.memberIdList;
            this.startTime = message.startTime;
            this.connectedTime = message.connectedTime;
            this.duration = message.duration;
            this.status = message.status;
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
            childScreenCls: "",
            remoteStreamList: {},
            startVoIPTime: 0,
            isActiveCall: false,
            message: null
        };
        static _instance: RongIMAgoraVoIP = null;
        static _rongIMClient: RongIMClient;
        constructor(opt: any) {
            var that = this;
            if (opt && opt.container) {
                that._memorySessions.container = opt.container;
            } else {
                throw new Error("Error:VIDEO_CONTAINER_IS_NULL.");
            }
            var str: string = window["SCHEMETYPE"] ? window["SCHEMETYPE"] + "://cdn.ronghub.com/AgoraRtcAgentSDK-1.4.2.js" : "//cdn.ronghub.com/AgoraRtcAgentSDK-1.4.2.js";
            var script: any = document.createElement("script");
            var head: any = document.getElementsByTagName("head")[0];
            script.src = str;
            head.appendChild(script);
            if (opt && opt.childScreenCls) {
                that._memorySessions.childScreenCls = opt.childScreenCls;
            }
            script.onload = function() {
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
        }
        static init(opt: any) {
            this._instance = new RongIMAgoraVoIP(opt);
            this._rongIMClient = RongIMClient.getInstance();
            RongIMClient._voipProvider = this._instance;
        }

        static getInstance(): RongIMAgoraVoIP {
            if (!this._instance) {
                throw new Error("RongIMAgoraVoIP is not init!");
            }
            return this._instance;
        }

        startCall(converType: ConversationType, targetId: string, userIds: string[], mediaType: VoIPMediaType, extra: string, callback: ResultCallback<ErrorCode>) {
            if (this._memorySessions["isActiveCall"]) {
                callback.onError(ErrorCode.BUSYLINE);
                return;
            }
            var cookieKey = 'chnl' + Bridge._client.userId + '_' + converType + '_' + targetId, channelId = cookieKey + '_' + (+new Date), that = this;
            that._memorySessions.startCallback = callback;
            that._memorySessions["mediaType"] = mediaType;
            RongIMAgoraVoIP._rongIMClient.getAgoraDynamicKey(1, channelId, {
                onSuccess: function(data: any) {
                    that._memorySessions[cookieKey] = new ChannelInfo(channelId, data.dynamicKey);
                    var msg = new InviteMessage({ callId: channelId, engineType: 1, channelInfo: that._memorySessions[cookieKey], mediaType: mediaType, inviteUserIds: userIds, extra: extra });
                    that.sendMessage(converType, targetId, msg, {
                        onSuccess: function(data: any) {
                            that._memorySessions["sentTime"] = data.sentTime;
                            that._memorySessions["timer"] = setTimeout(function() {
                                that.hungupCall(converType, targetId, ErrorCode.REMOTE_BUSYLINE);
                            }, that._memorySessions.timeoutMillis);
                        },
                        onError: function() { }
                    });
                },
                onError: function(error: ErrorCode) {
                    callback.onError(error);
                }
            });

        }

        hungupCall(converType: ConversationType, targetId: string, reason: ErrorCode) {
            var that = this, isSend = false;
            that.closeRemoteStream();
            if (!that.isEmptyObject() || that._memorySessions["isActiveCall"]) {
                that._memorySessions.client.leave();
                that._memorySessions.client.close();
            }
            that._memorySessions["isActiveCall"] = false;
            var channelInfo: ChannelInfo = that._memorySessions['chnl' + Bridge._client.userId + '_' + converType + '_' + targetId];
            if (channelInfo) {
                var msg = new HungupMessage({ callId: channelInfo.Id, reason: ErrorCode.REMOTE_HANGUP });
                that.sendMessage(converType, targetId, msg);
            }
            var content = new HungupMessage({ callId: Bridge._client.userId, reason: reason });
            var msgContent = new Message();
            msgContent.conversationType = converType;
            msgContent.targetId = targetId;
            msgContent.messageDirection = MessageDirection.SEND;
            msgContent.messageType = "HungupMessage";
            msgContent.content = content;
            that.onReceived(msgContent);
        }

        joinCall(mediaType: VoIPMediaType, callback: ResultCallback<ErrorCode>) {
            if (this._memorySessions["isActiveCall"]) {
                callback.onError(ErrorCode.BUSYLINE);
                return;
            }
            var that = this;
            var inviteMsg = <InviteMessage>that._memorySessions.message.content;
            RongIMAgoraVoIP._rongIMClient.getAgoraDynamicKey(1, inviteMsg.channelInfo.Id, {
                onSuccess: function(data: any) {
                    that._memorySessions.client.init(data.dynamicKey, function(obj: any) {
                        var msg = new AcceptMessage({ callId: inviteMsg.channelInfo.Id, mediaType: mediaType });
                        that.sendMessage(that._memorySessions.message.conversationType, that._memorySessions.message.targetId, msg, {
                            onSuccess: function(message: any) {
                                that._memorySessions.client.join(data.dynamicKey, inviteMsg.channelInfo.Id, message.sentTime & 0x7fffffff, function(uid: string) {
                                    that._memorySessions["startVoIPTime"] = +new Date;
                                    that._memorySessions["isActiveCall"] = true;
                                    that._memorySessions["mediaType"] = inviteMsg.mediaType;
                                    that.initLocalStream(uid, inviteMsg.mediaType);
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

        changeMediaType(converType: ConversationType, targetId: string, mediaType: VoIPMediaType, callback: OperationCallback) {
            var that = this, channelInfo = that._memorySessions['chnl' + RongIMLib.Bridge._client.userId + '_' + converType + '_' + targetId], msg = new MediaModifyMessage({ callId: channelInfo.Id, mediaType: VoIPMediaType.MEDIA_AUDIO });
            if (mediaType == RongIMLib.VoIPMediaType.MEDIA_VEDIO) {
                that.sendMessage(converType, targetId, msg);
                if (!that._memorySessions.localStream.videoEnabled) {
                    that._memorySessions.localStream.videoEnabled = true;
                    that._memorySessions.localStream.close();
                    that.closeRemoteStream();
                    callback.onSuccess();
                }
            }
            else if (mediaType == RongIMLib.VoIPMediaType.MEDIA_AUDIO) {
                if (!that._memorySessions.localStream.audioEnabled) {
                    that._memorySessions.localStream.audioEnabled = true;
                    that._memorySessions.client.disableAudio(that._memorySessions.localStream, function() {
                        callback.onSuccess();
                    });
                }
                else {
                    that._memorySessions.localStream.audioEnabled = false;
                    that._memorySessions.client.enableAudio(that._memorySessions.localStream, function() {
                        callback.onSuccess();
                    });
                }
            }
        }

        getSummaryMessage(message: Message): SummaryMessage {
            var that = this, startTime = this._memorySessions["startVoIPTime"], dateTime: number = startTime == 0 ? 0 : +new Date - startTime;
            that._memorySessions["startVoIPTime"] = 0;
            var hungupMsg = <HungupMessage>message.content;
            return new SummaryMessage({
                caller: Bridge._client.userId,
                inviter: message.targetId,
                mediaType: that._memorySessions["mediaType"],
                startTime: startTime,
                duration: Math.floor(dateTime / 1000),
                status: hungupMsg.reason
            });
        }

        closeRemoteStream(stream?: any) {
            var that = this, div = document.getElementById(that._memorySessions.container);
            if (stream) {
                stream.close();
                div.removeChild(document.getElementById(that._memorySessions.container + '_' + stream.getId()));
            } else {
                var that = this;
                for (var key in that._memorySessions.remoteStreamList) {
                    that._memorySessions.remoteStreamList[key].close();
                    div.removeChild(document.getElementById(that._memorySessions.container + '_' + that._memorySessions.remoteStreamList[key].getId()));
                    delete that._memorySessions.remoteStreamList[key];
                }
            }
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
            if (mediaType == RongIMLib.VoIPMediaType.MEDIA_AUDIO) {
                that._memorySessions.client.disableVideo(that._memorySessions.localStream);
                that._memorySessions.localStream.audioEnabled = false;
                that._memorySessions.localStream.videoEnabled = true;
            } else {
                that._memorySessions.localStream.audioEnabled = false;
                that._memorySessions.localStream.videoEnabled = false;
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

        }

        displayStream(stream?: any) {
            var that = this;
            if (!stream) {
                that._memorySessions.localStream.play(that._memorySessions.container);
            } else {
                var div = document.createElement("div");
                div.id = that._memorySessions.container + '_' + stream.getId();
                div.setAttribute("class", that._memorySessions.childScreenCls);
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

        onReceived(message: Message): boolean {
            var that = this, channelInfo = that._memorySessions['chnl' + Bridge._client.userId + '_' + message.conversationType + '_' + message.targetId];
            switch (message.messageType) {
                case RongIMClient.MessageType["InviteMessage"]:
                    var ret = <InviteMessage>message.content;
                    if (that._memorySessions["isActiveCall"]) {
                        var rejectMsg = new HungupMessage({ callId: ret.callId, reason: ErrorCode.REMOTE_BUSYLINE });
                        that.sendMessage(message.conversationType, message.targetId, rejectMsg);
                        return;
                    }
                    that._memorySessions.message = message;
                    that._memorySessions['chnl' + RongIMLib.Bridge._client.userId + '_' + message.conversationType + '_' + message.targetId] = ret.channelInfo;
                    var msg: RingingMessage = new RingingMessage({ callId: ret.callId });
                    that.sendMessage(message.conversationType, message.targetId, msg);
                    var content = <InviteMessage>message.content;
                    that._memorySessions["mediaType"] = content.mediaType;
                    Channel._ReceiveMessageListener.onReceived(message);
                    break;
                case RongIMClient.MessageType["RingingMessage"]:
                    Channel._ReceiveMessageListener.onReceived(message);
                    break;
                case RongIMClient.MessageType["AcceptMessage"]:
                    if (!channelInfo) return;
                    clearTimeout(that._memorySessions["timer"]);
                    var accMsg: AcceptMessage = <AcceptMessage>message.content;
                    that._memorySessions["mediaType"] = accMsg.mediaType;
                    that._memorySessions.client.init(channelInfo.Key, function(obj: any) {
                        that._memorySessions.client.join(channelInfo.Key, channelInfo.Id, that._memorySessions["sentTime"] & 0x7fffffff, function(uid: string) {
                            that._memorySessions["startVoIPTime"] = +new Date;
                            that._memorySessions["isActiveCall"] = true;
                            that.initLocalStream(uid, accMsg.mediaType);
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
                    Channel._ReceiveMessageListener.onReceived(message);
                    break;
                case RongIMClient.MessageType["HungupMessage"]:
                    clearTimeout(that._memorySessions["timer"]);
                    if (!that.isEmptyObject()) {
                        that._memorySessions.client.leave();
                        that._memorySessions.client.close();
                        that.closeRemoteStream();
                    }
                    message.messageType = "SummaryMessage";
                    message.content = that.getSummaryMessage(message);
                    that._memorySessions["isActiveCall"] = false;
                    Channel._ReceiveMessageListener.onReceived(message);
                    break;
                case RongIMClient.MessageType["MediaModifyMessage"]:
                    var modMsg: MediaModifyMessage = <MediaModifyMessage>message.content;
                    if (modMsg.mediaType == RongIMLib.VoIPMediaType.MEDIA_AUDIO) {
                        that._memorySessions.localStream.close();
                        that.closeRemoteStream();
                    }
                    RongIMLib.Channel._ReceiveMessageListener.onReceived(message);
                    break;
                case RongIMClient.MessageType["MemberModifyMessage"]:
                    Channel._ReceiveMessageListener.onReceived(message);
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
