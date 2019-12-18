var Polling = {
        SetUserStatusInput: function(){
            var a = {};
            this.setStatus = function(b){
                a.status = b;
            };
            this.toArrayBuffer = function(){
                return a;
            };
        },
        SetUserStatusOutput: function(){
            var a = {};
            this.setNothing = function(b){
                a.nothing = b;
            };
            this.toArrayBuffer = function(){
                return a;
            };
        },
        GetUserStatusInput: function(){
            var a = {};
            this.setNothing = function(b){
                a.nothing = b;
            };
            this.toArrayBuffer = function(){
                return a;
            };
        },

        GetUserStatusOutput: function(){
            var a = {};
            this.setStatus = function(b){
                a.status = b;
            };
            this.setSubUserId = function(b){
                a.subUserId = b;
            };
            this.toArrayBuffer = function(){
                return a;
            };
        },
        VoipDynamicInput: function(){
            var a = {};
            this.setEngineType = function(b){
                a.engineType = b;
            };
            this.setChannelName = function(b){
                a.channelName = b;
            };
            this.setChannelExtra = function(b){
                a.channelExtra = b;
            };
            this.toArrayBuffer = function(){
                return a;
            };
        },
        VoipDynamicOutput: function(){
            var a = {};
            this.setDynamicKey = function(b){
                a.dynamicKey = b;
            };
            this.toArrayBuffer = function(){
                return a;
            };
        },
        SubUserStatusInput: function(){
            var a = {};
            this.setUserid = function(b){
                a.userid = b;
            };
            this.toArrayBuffer = function(){
                return a;
            };
        },
        SubUserStatusOutput: function(){
            var a = {};
            this.setNothing = function(b){
               a.nothing = b;
            };
            this.toArrayBuffer = function(){
                return a;
            };
        },
        CleanHisMsgInput: function(){
            var a = {};
            this.setTargetId = function(b){
                a.targetId = b;
            };
            this.setDataTime = function(b){
                a.dataTime = b;
            };
            this.setConversationType = function(b){
                a.conversationType = b;
            };
            this.toArrayBuffer = function(){
                return a;
            };
        },
        DeleteMsgInput:function(){
         var a = {};
         this.setType = function(b){
           a.type = b;
         };
         this.setConversationId = function(b){
           a.conversationId = b;
         };
         this.setMsgs = function(b){
           a.msgs = b;
         };
         this.toArrayBuffer = function () {
             return a;
         }
        },
        DeleteMsg:function(){
          var a = {};
          this.setMsgId = function(b){
            a.msgId = b;
          };
          this.setMsgDataTime = function(b){
            a.msgDataTime = b;
          };
          this.setDirect = function(b){
            a.direct = b;
          };
          this.toArrayBuffer = function () {
              return a;
          }
        },
        DeleteMsgOutput:function(){
         var a = {};
         this.setNothing = function(b){
           a.nothing = b;
         };
         this.toArrayBuffer = function () {
             return a;
         }
        },
        SearchMpInput:function(){
            var a = {};
            this.setType = function (b) {
                a.type = b;
            };
            this.setId = function (b) {
                a.id = b;
            };
            this.toArrayBuffer = function () {
                return a;
            }
        },
        SearchMpOutput:function(){
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b;
            };
            this.setInfo = function (b) {
                a.info = b;
            };
            this.toArrayBuffer = function () {
                return a;
            }
        },
        MpInfo:function(){
            var a = {};
            this.setMpid = function(b){
                a.mpid = b;
            };
            this.setName = function(b){
                a.name = b;
            };
            this.setType = function(b){
                a.type = b;
            };
            this.setTime = function(b){
                a.time = b;
            };
            this.setPortraitUri = function(b){
                a.portraitUrl = b;
            };
            this.setExtra = function(b){
                a.extra = b;
            };
            this.toArrayBuffer = function () {
                return a;
            }
        },
        PullMpInput:function(){
            var a = {};
            this.setMpid = function(b){
                a.mpid = b;
            };
            this.setTime = function(b){
                a.time = b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        PullMpOutput:function(){
            var a = {};
            this.setStatus = function(b){
                a.status = b;
            }
            this.setInfo = function(b){
                a.info = b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        MPFollowInput:function(){
            var a = {};
            this.setId = function(b){
                a.id = b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        MPFollowOutput:function(){
            var a = {};
            this.setNothing = function(b){
                a.nothing = b;
            };
            this.setInfo = function(b){
                a.info = b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        NotifyMsg: function () {
            var a = {};
            this.setType = function (b) {
                a.type = b;
            };
            this.setTime = function (b) {
                a.time = b;
            };
            this.setChrmId = function(b){
                a.chrmId = b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        SyncRequestMsg: function () {
            var a = {};
            this.setSyncTime = function (b) {
                a.syncTime = b || 0;
            };
            this.setIspolling = function (b) {
                a.ispolling = !!b;
            };
            this.setIsweb = function (b) {
                a.isweb = !!b;
            };
            this.setIsPullSend = function (b) {
                a.isPullSend = !!b;
            };
            this.setSendBoxSyncTime = function (b) {
                a.sendBoxSyncTime = b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        UpStreamMessage: function () {
            var a = {};
            this.setSessionId = function (b) {
                a.sessionId = b
            };
            this.setClassname = function (b) {
                a.classname = b
            };
            this.setContent = function (b) {
                if (b) a.content = b;
            };
            this.setPushText = function (b) {
                a.pushText = b
            };
            this.setUserId = function(b){
                a.userId = b;
            };
            this.setConfigFlag = function (b) {
                a.configFlag = b;
            };
            this.setAppData = function(b){
                a.appData = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        DownStreamMessages: function () {
            var a = {};
            this.setList = function (b) {
                a.list = b
            };
            this.setSyncTime = function (b) {
                a.syncTime = b;
            };
            this.setFinished = function(b){
                a.finished = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        DownStreamMessage: function () {
            var a = {};
            this.setFromUserId = function (b) {
                a.fromUserId = b
            };
            this.setType = function (b) {
                a.type = b
            };
            this.setGroupId = function (b) {
                a.groupId = b
            };
            this.setClassname = function (b) {
                a.classname = b
            };
            this.setContent = function (b) {
                if (b)
                    a.content = b
            };
            this.setDataTime = function (b) {
                a.dataTime = b;
            };
            this.setStatus = function (b) {
                a.status = b;
            };
            this.setMsgId = function (b) {
                a.msgId = b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        CreateDiscussionInput: function () {
            var a = {};
            this.setName = function (b) {
                a.name = b
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        CreateDiscussionOutput: function () {
            var a = {};
            this.setId = function (b) {
                a.id = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        ChannelInvitationInput: function () {
            var a = {};
            this.setUsers = function (b) {
                a.users = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        LeaveChannelInput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        QueryChatroomInfoInput:function(){
            var a = {};
            this.setCount = function (b) {
                a.count = b;
            };
            this.setOrder = function (b) {
                a.order = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        QueryChatroomInfoOutput:function(){
            var a = {};
            this.setUserTotalNums = function (b) {
                a.userTotalNums = b;
            };
            this.setUserInfos = function (b) {
                a.userInfos = b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        ChannelEvictionInput: function () {
            var a = {};
            this.setUser = function (b) {
                a.user = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        RenameChannelInput: function () {
            var a = {};
            this.setName = function (b) {
                a.name = b
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        ChannelInfoInput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        ChannelInfoOutput: function () {
            var a = {};
            this.setType = function (b) {
                a.type = b
            };
            this.setChannelId = function (b) {
                a.channelId = b
            };
            this.setChannelName = function (b) {
                a.channelName = b
            };
            this.setAdminUserId = function (b) {
                a.adminUserId = b
            };
            this.setFirstTenUserIds = function (b) {
                a.firstTenUserIds = b
            };
            this.setOpenStatus = function (b) {
                a.openStatus = b
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        ChannelInfosInput: function () {
            var a = {};
            this.setPage = function (b) {
                a.page = b
            };
            this.setNumber = function (b) {
                a.number = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        ChannelInfosOutput: function () {
            var a = {};
            this.setChannels = function (b) {
                a.channels = b
            };
            this.setTotal = function (b) {
                a.total = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        MemberInfo: function () {
            var a = {};
            this.setUserId = function (b) {
                a.userId = b
            };
            this.setUserName = function (b) {
                a.userName = b
            };
            this.setUserPortrait = function (b) {
                a.userPortrait = b
            };
            this.setExtension = function (b) {
                a.extension = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GroupMembersInput: function () {
            var a = {};
            this.setPage = function (b) {
                a.page = b
            };
            this.setNumber = function (b) {
                a.number = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GroupMembersOutput: function () {
            var a = {};
            this.setMembers = function (b) {
                a.members = b
            };
            this.setTotal = function (b) {
                a.total = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GetUserInfoInput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GetUserInfoOutput: function () {
            var a = {};
            this.setUserId = function (b) {
                a.userId = b
            };
            this.setUserName = function (b) {
                a.userName = b
            };
            this.setUserPortrait = function (b) {
                a.userPortrait = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GetSessionIdInput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GetSessionIdOutput: function () {
            var a = {};
            this.setSessionId = function (b) {
                a.sessionId = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GetQNupTokenInput: function () {
            var a = {};
            this.setType = function (b) {
                a.type = b;
            }
            this.toArrayBuffer = function () {
                return a
            }
        },
        GetQNupTokenOutput: function () {
            var a = {};
            this.setDeadline = function (b) {
                a.deadline = b
            };
            this.setToken = function (b) {
                a.token = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        GetQNdownloadUrlInput: function () {
            var a = {};
            this.setType = function (b) {
                a.type = b;
            };
            this.setKey = function (b) {
                a.key = b;
            };
            this.setFileName = function(b){
                a.fileName = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        GetQNdownloadUrlOutput: function () {
            var a = {};
            this.setDownloadUrl = function (b) {
                a.downloadUrl = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        Add2BlackListInput: function () {
            var a = {};
            this.setUserId = function (b) {
                a.userId = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        RemoveFromBlackListInput: function () {
            var a = {};
            this.setUserId = function (b) {
                a.userId = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        QueryBlackListInput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        QueryBlackListOutput: function () {
            var a = {};
            this.setUserIds = function (b) {
                a.userIds = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        BlackListStatusInput: function () {
            var a = {};
            this.setUserId = function (b) {
                a.userId = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        BlockPushInput: function () {
            var a = {};
            this.setBlockeeId = function (b) {
                a.blockeeId = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        ModifyPermissionInput: function () {
            var a = {};
            this.setOpenStatus = function (b) {
                a.openStatus = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GroupInput: function () {
            var a = {};
            this.setGroupInfo = function (b) {
                for (var i = 0, arr = []; i < b.length; i++) {
                    arr.push({id: b[i].getContent().id, name: b[i].getContent().name})
                }
                a.groupInfo = arr;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GroupOutput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GroupInfo: function () {
            var a = {};
            this.setId = function (b) {
                a.id = b;
            };
            this.setName = function (b) {
                a.name = b;
            };
            this.getContent = function () {
                return a;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GroupHashInput: function () {
            var a = {};
            this.setUserId = function (b) {
                a.userId = b;
            };
            this.setGroupHashCode = function (b) {
                a.groupHashCode = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GroupHashOutput: function () {
            var a = {};
            this.setResult = function (b) {
                a.result = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        ChrmInput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        ChrmOutput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        ChrmPullMsg: function () {
            var a = {};
            this.setSyncTime = function (b) {
                a.syncTime = b
            };
            this.setCount = function (b) {
                a.count = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        RelationsInput: function () {
            var a = {};
            this.setType = function (b) {
                a.type = b;
            };
            this.setMsg = function(b){
                a.msg = b;
            };
            this.setCount = function(b){
              a.count = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        RelationsOutput: function () {
            var a = {};
            this.setInfo = function (b) {
                a.info = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        RelationInfo: function () {
            var a = {};
            this.setType = function (b) {
                a.type = b;
            };
            this.setUserId = function (b) {
                a.userId = b;
            };
            this.setMsg = function(b){
                a.msg = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        HistoryMessageInput: function () {
            var a={};
            this.setTargetId=function(b){
                a.targetId=b;
            };
            this.setDataTime=function(b){
                a.dataTime=b;
            };
            this.setSize=function(b){
                a.size=b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        HistoryMessagesOuput: function () {
            var a={};
            this.setList=function(b){
                a.list=b;
            };
            this.setSyncTime=function(b){
                a.syncTime=b;
            };
            this.setHasMsg=function(b){
                a.hasMsg=b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        HistoryMsgInput: function(){
            var a = {};
            this.setTargetId = function(b){
                a.targetId = b;
            };
            this.setTime = function(b){
                a.time = b;
            };
            this.setCount = function(b){
                a.count = b;
            };
            this.setOrder = function(b){
                a.order = b;
            };
            this.toArrayBuffer = function(){
                return a;
            };
        },
        HistoryMsgOuput: function(){
            var a = {};
            this.setList = function(b){
                a.list = b;
            };
            this.setSyncTime = function(b){
                a.syncTime = b;
            };
            this.setHasMsg = function(b){
                a.hasMsg = b;
            };
            this.toArrayBuffer = function(){
                return a;
            };
        },
        RtcQueryListInput: function () {
            var a = {};
            this.toArrayBuffer = function(){
                return a;
            };
            this.setOrder = function (b) {
                a.order = b;
            };
        },
        RtcKeyDeleteInput: function () {
            var a = {};
            this.toArrayBuffer = function(){
                return a;
            };
            this.setKey = function (b) {
                a.key = b;
            };
        },
        RtcValueInfo: function () {
            var a = {};
            this.toArrayBuffer = function(){
                return a;
            };
            this.setKey = function (b) {
                a.key = b;
            };
            this.setValue = function (b) {
                a.value = b;
            };
        },
        // RtcUserInfo: function () {
        //     var a = {};
        // },
        RtcUserListOutput: function () {
            var a = {};
            this.toArrayBuffer = function(){
                return a;
            };
            this.setList = function (b) {
                a.list = b;
            };
            this.setToken = function (b) {
                a.token = b;
            };
        },
        RtcRoomInfoOutput: function () {
            var a = {};
            this.toArrayBuffer = function(){
                return a;
            };
            this.setRoomId = function (b) {
                a.roomId = b;
            };
            this.setRoomData = function (b) {
                a.roomData = b;
            };
            this.setUserCount = function (b) {
                a.userCount = b;
            };
            this.setList = function (b) {
                a.list = b;
            }
        },
        RtcInput: function () {
            var a = {};
            this.toArrayBuffer = function(){
                return a;
            };
            this.setRoomType = function (b) {
                a.roomType = b;
            };
            this.setBroadcastType = function (b) {
                a.broadcastType = b;
            }
        },
        // RtcQryInput: function () {
        //     var a = {};
        // },
        RtcQryOutput: function () {
            var a = {};
            this.toArrayBuffer = function(){
                return a;
            };
            this.setOutInfo = function (b) {
                a.outInfo = b;
            };
        },
        // RtcDelDataInput: function () {
        //     var a = {};
        // },
        RtcDataInput: function () {
            var a = {};
            this.toArrayBuffer = function(){
                return a;
            };
            this.setInterior = function (b) {
                a.interior = b;
            };
            this.setTarget = function (b) {
                a.target = b;
            };
            this.setKey = function (b) {
                a.key = b;
            };
            this.setObjectName = function (b) {
                a.objectName = b;
            };
            this.setContent = function (b) {
                a.content = b;
            };
        },
        RtcSetDataInput: function () {
            var a = {};
            this.toArrayBuffer = function(){
                return a;
            };
            this.setInterior = function (b) {
                a.interior = b;
            };
            this.setTarget = function (b) {
                a.target = b;
            };
            this.setKey = function (b) {
                a.key = b;
            };
            this.setValue = function (b) {
                a.value = b;
            };
            this.setObjectName = function (b) {
                a.objectName = b;
            };
            this.setContent = function (b) {
                a.content = b;
            };
        },
        RtcOutput: function () {
            var a = {};
            this.toArrayBuffer = function(){
                return a;
            };
            this.setNothing = function (b) {
                a.nothing = b;
            };
        },
        RtcTokenOutput: function () {
            var a = {};
            this.toArrayBuffer = function(){
                return a;
            };
            this.setRtcToken = function (b) {
                a.rtcToken = b;
            }
        },
        /**
         * 聊天室 KV 存储
         */

        ChrmNotifyMsg: function () {
            var a = {};
            this.toArrayBuffer = function () {
                return a;
            };
            this.setType = function (b) {
                a.type = b;
            };
            this.setTime = function (b) {
                a.time = b;
            };
            this.setChrmId = function (b) {
                a.chrmId = b;
            };
        },
        ChrmKVEntity: function () {
            var a = {};
            this.toArrayBuffer = function () {
                return a;
            };
            this.setKey = function (key) {
                a.key = key;
            };
            this.setValue = function (value) {
                a.value = value;
            };
            this.setStatus = function (b) {
                a.status = b;
            };
            this.setTimestamp = function (b) {
                a.timestamp = b;
            };
            this.setUid = function (b) {
                a.uid = b;
            };
        },
        SetChrmKV: function () {
            var a = {};
            this.toArrayBuffer = function () {
                return a;
            };
            this.setEntry = function (b) {
                a.entry = b;
            };
            this.setNotification = function (b) {
                a.notification = b.toArrayBuffer();
            };
            this.setBNotify = function (b) {
                a.bNotify = b;
            };
            this.setType = function (b) {
                a.type = b;
            };
        },
        ChrmKVOutput: function () {
            var a = {};
            this.toArrayBuffer = function () {
                return a;
            };
            this.setEntries = function (b) {
                this.entries = b;
            };
            this.setBFullUpdate = function (b) {
                this.bFullUpdate = b;
            };
            this.setSyncTime = function (b) {
                this.syncTime = b;
            };
        },
        QueryChrmKV: function () {
            var a = {};
            this.toArrayBuffer = function () {
                return a;
            };
            this.setTimestamp = function (b) {
                a.timestamp = b;
            };
        },
        DeleteChrmKV: function () {
            var a = {};
            this.toArrayBuffer = function () {
                return a;
            };
            this.setEntry = function (b) {
                a.entry = b;
            };
            this.setBNotify = function (b) {
                a.bNotify = b;
            };
            this.setNotification = function (b) {
                a.notification = b;
            };
            this.setType = function (b) {
                a.type = b;
            };
        }
    };
    for (var f in Polling) {
        Polling[f].decode = function (b) {
            var back = {}, val = JSON.parse(b) || eval("(" + b + ")");
            for (var i in val) {
                back[i]=val[i];
                back["get"+ i.charAt(0).toUpperCase()+i.slice(1)]=function(){
                    return val[i];
                }
            }
            return back;
        }
    }
