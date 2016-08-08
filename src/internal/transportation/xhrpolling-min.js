var Polling = {
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
