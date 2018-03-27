module RongIMLib {
    export class RongCallLib implements VoIPProvider {
        _memorySessions: any = {
            timeoutMillis: 30000,
            resolution: "480p",
            maxFrameRate: 15,
            videoSize: { height: 300, width: 400 },
            container: {
                local: null,
                remote: null
            },
            remoteStreamList: {},
            startVoIPTime: 0,
            isActiveCall: false,
            message: null,
            getChildNode: function(localId: string, remoteStreamId: string){
                var remoteWindow = document.createElement("div");
                    remoteWindow.id = localId + '_' + remoteStreamId;
                    remoteWindow.className = 'rong-calllib-remote';
                return remoteWindow;
            }
        };
        static _instance: RongCallLib = null;
        static _rongIMClient: RongIMClient;
        constructor(opt: any) {
            var that = this;
            if (opt && opt.container) {
                that._memorySessions.container = opt.container;
            } else {
                throw new Error("Error:VIDEO_CONTAINER_IS_NULL.");
            }
            var script: any = document.createElement("script");
            var head: any = document.getElementsByTagName("head")[0];
            script.src = "//cdn.ronghub.com/AgoraRtcAgentSDK-1.4.2.js";
            head.appendChild(script);
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
            this._instance = new RongCallLib(opt);
            this._rongIMClient = RongIMClient.getInstance();
            RongIMClient._voipProvider = this._instance;
        }

        static getInstance(): RongCallLib {
            if (!this._instance) {
                throw new Error("RongCallLib is not init!");
            }
            return this._instance;
        }

        startCall(converType: ConversationType, targetId: string, userIds: string[], mediaType: VoIPMediaType, extra: string, callback: any) {
            if (this._memorySessions["isActiveCall"]) {
                callback.onError(ErrorCode.BUSYLINE);
                return;
            }
            var that = this;
            var channelId =  'chnl_' + targetId;
            if(channelId.length > 63) {
                channelId = channelId.substr(0, 63);
            }
            that._memorySessions.startCallback = callback;
            that._memorySessions["mediaType"] = mediaType;
            RongCallLib._rongIMClient.getAgoraDynamicKey(1, channelId, {
                onSuccess: function(data: any) {
                    that._memorySessions[channelId] = new ChannelInfo(channelId, data.dynamicKey);
                    var msg = new InviteMessage({ callId: channelId, engineType: 1, channelInfo: that._memorySessions[channelId], mediaType: mediaType, inviteUserIds: userIds, extra: extra });
                    that.sendMessage(converType, targetId, msg, {
                        onSuccess: function(data: any) {
                            callback.onSuccess();
                            that._memorySessions["sentTime"] = data.sentTime;
                            that._memorySessions["timer"] = setTimeout(function() {
                                that.hungupCall(converType, targetId, ErrorCode.REMOTE_BUSYLINE);
                            }, that._memorySessions.timeoutMillis);
                        },
                        onError: callback.onError
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
            var channelInfo: ChannelInfo = that._memorySessions['chnl_'+ targetId];
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

        joinCall(mediaType: VoIPMediaType, callback: any) {
            if (this._memorySessions["isActiveCall"]) {
                callback.onError(ErrorCode.BUSYLINE);
                return;
            }
            var that = this;
            var inviteMsg = <InviteMessage>that._memorySessions.message.content;
            RongCallLib._rongIMClient.getAgoraDynamicKey(1, inviteMsg.callId, {
                onSuccess: function(data: any) {
                    that._memorySessions.client.init(data.dynamicKey, function(obj: any) {
                        var msg = new AcceptMessage({ callId: inviteMsg.callId, mediaType: inviteMsg.mediaType });
                        that.sendMessage(that._memorySessions.message.conversationType, that._memorySessions.message.targetId, msg, {
                            onSuccess: function(message: any) {
                                that._memorySessions.client.join(data.dynamicKey, inviteMsg.callId, message.sentTime & 0x7fffffff, function(uid: string) {
                                    that._memorySessions["startVoIPTime"] = +new Date;
                                    that._memorySessions["isActiveCall"] = true;
                                    that._memorySessions["mediaType"] = inviteMsg.mediaType;
                                    that.initLocalStream(uid, inviteMsg.mediaType);
                                    callback.onSuccess();
                                });
                            },
                            onError: callback.onError
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
            var that = this, 
            channelInfo = that._memorySessions['chnl_' + targetId], 
            msg = new MediaModifyMessage({ callId: channelInfo.Id, mediaType: VoIPMediaType.MEDIA_AUDIO });

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

        mute(callback: Function):void{
            var memory = this._memorySessions,
                stream = memory.localStream;

            stream.audioEnabled = false;
            memory.client.disableAudio(stream, function() {
                callback();
            });
        }

        unmute(callback: Function):void{
            var memory = this._memorySessions, 
                stream = memory.localStream;

            stream.audioEnabled = true;
            memory.client.enableAudio(stream, function() {
                callback();
            });
        }

        audioToVideo(conversationType: ConversationType, targetId: string, callback:any):void{
            var info = {
                conversationType: conversationType,
                targetId: targetId,
                type: VoIPMediaType.MEDIA_VEDIO,
                disable: false,
                method: 'enableVideo',
                callback: callback
            };
            this.switchMedia(info);
        }

        videoToAudio(conversationType: ConversationType, targetId: string, callback: any):void{
            var info = {
                conversationType: conversationType,
                targetId: targetId,
                type: VoIPMediaType.MEDIA_AUDIO,
                disable: true,
                method: 'disableViode',
                callback: callback
            };
            this.switchMedia(info);
        }

        private switchMedia(info: any):void{
            var channelInfo = this._memorySessions['chnl_' + info.targetId], 
                msg = new RongIMLib.MediaModifyMessage({ callId: channelInfo.Id, mediaType: info.type });
            var me = this;
            me.sendMessage(info.conversationType, info.targetId, msg);
            var client = me._memorySessions.client,
                stream = me._memorySessions.localStream;
            var item:any = {
                disableVideo: function(){
                    stream.videoEnabled = true;
                    stream.close();
                    me.closeRemoteStream();
                },
                enableVideo: function(){
                    me.initLocalStream(me._memorySessions.uid, info.type);
                }
            };
            item[info.method]();  
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
            var that = this;
            var localWindow = that._memorySessions.container.local;
            var remoteWindow = that._memorySessions.container.remote;
            if (stream) {
                stream.close();
                localWindow.removeChild(localWindow);
            } else {
                var remoteList = that._memorySessions.remoteStreamList;
                for (var key in remoteList) {
                    remoteList[key].close();
                    localWindow.removeChild(remoteWindow);
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
                that._memorySessions.client.enableAudio(that._memorySessions.localStream);
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
            var session = that._memorySessions;
            var local = session.container.local
            if (!stream) {
                session.localStream.play(local.id);
            } else {
                var remoteWindow = session.getChildNode(local.id, stream.getId());
                session.container.remote = remoteWindow;
                console.log(stream.getId());
                local.appendChild(remoteWindow);

                stream.play(remoteWindow.id, function(err: any){
                    throw new Error(err);
                });
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
            var that = this, channelInfo = that._memorySessions['chnl_' + message.targetId];
            switch (message.messageType) {
                case RongIMClient.MessageType["InviteMessage"]:
                    var ret = <InviteMessage>message.content;
                    if (that._memorySessions["isActiveCall"]) {
                        var rejectMsg = new HungupMessage({ callId: ret.callId, reason: ErrorCode.REMOTE_BUSYLINE });
                        that.sendMessage(message.conversationType, message.targetId, rejectMsg);
                        return;
                    }
                    that._memorySessions["isActiveCall"] = true;
                    that._memorySessions.message = message;
                    that._memorySessions['chnl_' + message.targetId] = { Id: ret.callId, Key: "" };
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
            RongCallLib._rongIMClient.sendMessage(converType, targetId, msg, <SendMessageCallback>{
                onSuccess: function(message: any) {
                    if (callback) {
                        callback.onSuccess(message);
                    }
                },
                onError: function(error: ErrorCode) {
                    if (callback) {
                        callback.onError(error);
                    }
                },
                onBefore: function(){}
            });
        }
    }
}
