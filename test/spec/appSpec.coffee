# describe "Navi Test",->
#   it "1",->
#     #rongSDK为判断是否向服务器发起请求条件之一，本应该设置通道连接成功之后，没有联调，所以设置于此
#     nvai = new RongIMLib.Navigate()
#     callback =
#       onSuccess: ->
#         console.log "connect---successs"
#
#       onError: ->
#         console.log "connect--error"
#
#     nvai.connect  "cpj2xarlj5cdn","0Qs6YHRj2p45jxfKS40Io3U1lgYP6zEv1OpCrfDse9JiBi4BNyqa2E2dH7xIEfEE9lfCByjdxCqYNAuDFMk66A==",callback
#     setTimeout(->
#         console.log RongIMLib.Navigate.Endpoint.host
#         done();
#     ,1000)
#
################################功能模块单元测试############################################
#说明：
#所有功能均已测试通过，若重新测试，删除注释重新运行karma即可(讨论组Id可能需要修改)
describe "RongIMClient",->
    it "Connect&SendMessage",->
###############################getInstance##############################################
    #没有执行init调用getInstance()
    # RongIMLib.RongIMClient.getInstance();
    # window["WEB_XHR_POLLING"] = true;
    # RongIMLib.RongIMClient.schemeType = RongIMLib.SchemeType.SSL
###############################inti#####################################################
    #correct appkey
    RongIMLib.RongIMClient.init "8luwapkvucoil"
    #error appkey
    # RongIMLib.RongIMClient.init "testAppkey"
###############################registerMessageType######################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.registerMessageType 's:empty','EmptyMessage',['Name','Age','Address']
    # ,10);

    RongIMLib.RongIMClient.setOnReceiveMessageListener onReceived: (message) ->
      console.log message.getContent()
    RongIMLib.RongIMClient.setConnectionStatusListener onChanged: (status) ->
      switch status
          when RongIMLib.ConnectionStatus.CONNECTED
            console.log "链接成功"
          when RongIMLib.ConnectionStatus.CONNECTING
            console.log "正在链接"
          when RongIMLib.ConnectionStatus.DISCONNECTED
            console.log "断开连接"
          else console.log "状态为解析:"+status
###############################connect#################################################
        #correct token
    RongIMLib.RongIMClient.connect "gZJPeSu/8FmfBTKw/dWGpMSkAMimzaj6nB20cRPaYWRyLGGbEPHrt1VKGG3VLZ+uNXcegD4ILRafVHKjO9aQ+w==",
        onSuccess:(userId)->
            console.log("loginSuccess,userId."+userId)
        onError:(error)->
           switch error
              when RongIMLib.ConnectionState.SERVER_UNAVAILABLE
                console.log "SERVER_UNAVAILABLE"
              when RongIMLib.ConnectionState.TOKEN_INCORRECT
                console.log "token 无效"
              else
                console.log type
        # error token
        # RongIMLib.RongIMClient.connect "dXOJIInqKDahrpig+TJcq3U1lgYP6zEv1OpCrfDse9JiBi4BNyqa2MRus3mUdaZlHmSaXaVmp5/yPASY0/fWWKnbNZUuYfcEa",
        #     onSuccess:(userId)->
        #         console.log("loginSuccess,userId."+userId)
        #     onError:(error)->
        #         switch error
        #           when RongIMLib.ConnectionState.SERVER_UNAVAILABLE
        #             console.log "SERVER_UNAVAILABLE"
        #           when RongIMLib.ConnectionState.TOKEN_INCORRECT
        #             console.log "token 无效"
        #           else
        #             console.log type
###############################sendMessage- correct parameter##############################
    # setTimeout(->
    #     message = RongIMLib.TextMessage.obtain("测试一下，发给大海飞")
    #     # message = new RongIMLib.EmptyMessage({Name:'RongCloud-101',Age:18,Address:"beijing"});
    #     RongIMLib.RongIMClient.getInstance().sendMessage RongIMLib.ConversationType.PRIVATE, "1005", message,null,
    #       onSuccess: (data)->
    #             console.log "Send Successfully"
    #       onError: (errorcode)->
    #             console.log errorcode
    # ,1000)
# ###############################sendMessage- error parameter################################
    # setTimeout(->
    #         message = RongIMLib.TextMessage.obtain("my name is saner")
    #         RongIMLib.RongIMClient.getInstance().sendMessage 4, "1002", message,null,
    #           onSuccess: ()->
    #                 console.log "Send Successfully"
    #           onError: (errorcode)->
    #                 console.log "Send failure"
    # ,1000)
##############################createConversation##########################################
    # setTimeout(->
    #     conversation = RongIMLib.RongIMClient.getInstance().createConversation RongIMLib.ConversationType.PRIVATE,"zhaoliu","小标题",true;
    #     console.log(conversation)
    # ,1000)
##############################getConversationList##########################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().getConversationList
    #         onSuccess:(list)->
    #             console.log list
    #         onError:(error)->
    #             console.log "GetConversationList,errorcode:"+error
    # ,100)
##############################setConversationToTop##########################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().setConversationToTop RongIMLib.ConversationType.PRIVATE,"zhaoliu",
    #         onSuccess:(isTop)->
    #             console.log "setTop:"+isTop
    #         onError:(error)->
    #             console.log "SetConversationToTop,errorcode:"+error
    # ,1000)
##############################removeConversation##########################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().removeConversation RongIMLib.ConversationType.PRIVATE,"1006",
    #         onSuccess:(isRemove)->
    #             console.log "removeConversation:"+isRemove
    #         onError:(error)->
    #             console.log "removeConversation,errorcode:"+error
    # ,1000)
##############################getConversation##########################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().getConversation RongIMLib.ConversationType.PRIVATE,"1002",
    #         onSuccess:(conver,hasConver)->
    #             console.log conver
    #         onError:(error)->
    #             console.log "getConversation,errorcode:"+error
    # ,1000)
##############################getUserInfo-correct user##################################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().getUserInfo "zhangsan",
    #         onSuccess:(info)->
    #             console.log info
    #         onError:(error)->
    #             console.log "GetUserInfo,errorcode:"+error
    # ,500)
##############################getUserInfo-error user##################################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().getUserInfo "zhangsan101",
    #         onSuccess:(info)->
    #             console.log info
    #         onError:(error)->
    #             switch error
    #                 when 20404
    #                     console.log "用户不存在"
    # ,500)
##############################getHistoryMessages-correct size############################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().getHistoryMessages 4,"1005",null,20,
    #         onSuccess:(list,hasMsg)->
    #             console.log(list)
    #         onError:(error)->
    #             console.log "GetHistoryMessages,errorcode:"+error
    # ,1200)
##############################getHistoryMessages-error size############################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().getHistoryMessages 4,"1005",null,21,
    #         onSuccess:(list,hasMsg)->
    #             console.log(list)
    #         onError:(error)->
    #             console.log "GetHistoryMessages,errorcode:"+error
    # ,1300)
##############################getHistoryMessages-pullMessageTime############################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().getHistoryMessages 4,"1005",new Date().getTime(),1,
    #         onSuccess:(list,hasMsg)->
    #             console.log(list[0].message.content)
    #         onError:(error)->
    #             console.log "GetHistoryMessages,errorcode:"+error
    # ,1300)
##############################hasUnreadMessages############################################
    # RongIMLib.RongIMClient.getInstance().hasUnreadMessages "cpj2xarlj5cdn","0Qs6YHRj2p45jxfKS40Io3U1lgYP6zEv1OpCrfDse9JiBi4BNyqa2E2dH7xIEfEE9lfCByjdxCqYNAuDFMk66A==",
    #     onSuccess:(hasMsg)->
    #         console.log hasMsg
    #     onError:(error)->
    #         console.log "HasUnreadMessages,errorcode:"+error
##############################CreateDiscussion#############################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().createDiscussion "WebSDKV2-Dis-Name",["zhangsan","lisi"],
    #         onSuccess:(discussId)->
    #             console.log "Discussion's id is "+discussId
    #         onError:(error)->
    #             console.log "CreateDiscussion:errorcode:"+error
    # ,1300)
##############################addMemberToDiscussion#########################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().addMemberToDiscussion "1aef7b7e-24ac-4740-893c-0914ba3f4bf4",["wangwu"],
    #         onSuccess:()->
    #             console.log "addMemberToDiscussion Successfully"
    #         onError:(error)->
    #             console.log "AddMemberToDiscussion:errorcode:"+error
    # ,1400)
##############################getDiscussion#################################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().getDiscussion "1aef7b7e-24ac-4740-893c-0914ba3f4bf4",
    #         onSuccess:(discuss)->
    #             console.log discuss
    #         onError:(error)->
    #             console.log "GetDiscussion:errorcode:"+error
    # ,1450)
##############################quitDiscussion#################################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().quitDiscussion "a782bc21-68dd-451a-8663-32a530a97315",
    #         onSuccess:()->
    #             console.log "QuitDiscussion Successfully"
    #         onError:(error)->
    #             console.log "QuitDiscussion:errorcode:"+error
    # ,1500)
##############################removeMemberFromDiscussion#####################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().removeMemberFromDiscussion "a782bc21-68dd-451a-8663-32a530a97315","lisi",
    #         onSuccess:()->
    #             console.log "RemoveMember Successfully"
    #         onError:(error)->
    #             console.log "RemoveMember:errorcode:"+error
    # ,1550)
##############################setDiscussionInviteStatus######################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().setDiscussionInviteStatus "a782bc21-68dd-451a-8663-32a530a97315",RongIMLib.DiscussionInviteStatus.CLOSED,
    #         onSuccess:()->
    #             console.log "setDiscussionInviteStatus Successfully"
    #         onError:(error)->
    #             console.log "setDiscussionInviteStatus:errorcode:"+error
    # ,1600)
##############################setDiscussionName##############################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().setDiscussionName "a782bc21-68dd-451a-8663-32a530a97315","大融云",
    #         onSuccess:()->
    #             console.log "setDiscussionName Successfully"
    #         onError:(error)->
    #             console.log "setDiscussionName:errorcode:"+error
    # ,1650)
##############################joinGroup######################################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().joinGroup "cocalGroup","WskTestGroup",
    #         onSuccess:()->
    #             console.log "joinGroup Successfully"
    #         onError:(error)->
    #             console.log "joinGroup:errorcode:"+error
    # ,1700)
##############################quitGroup######################################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().quitGroup "cocalGroup",
    #         onSuccess:()->
    #             console.log "quitGroup Successfully"
    #         onError:(error)->
    #             console.log "quitGroup:errorcode:"+error
    # ,1750)
##############################joinChatRoom###################################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().joinChatRoom "chatRoom2015",2,
    #         onSuccess:()->
    #             console.log "joinChatRoom Successfully"
    #         onError:(error)->
    #             console.log "joinChatRoom:errorcode:"+error
    # ,1800)
##############################quitChatRoom###################################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().quitChatRoom "chatRoom2015",
    #         onSuccess:()->
    #             console.log "quitChatRoom Successfully"
    #         onError:(error)->
    #             console.log "quitChatRoom:errorcode:"+error
    # ,1820)
##############################addToBlacklist#################################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().addToBlacklist "wangwu",
    #         onSuccess:()->
    #             console.log "addToBlacklist Successfully"
    #         onError:(error)->
    #             console.log "addToBlacklist:errorcode:"+error
    # ,1840)
##############################getBlacklist###################################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().getBlacklist
    #         onSuccess:(data)->
    #             console.log data
    #         onError:(error)->
    #             console.log "getBlacklist:errorcode:"+error
    # ,1860)
##############################getBlacklistStatus#############################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().getBlacklistStatus "wangwu",
    #         onSuccess:(status)->
    #             console.log status
    #         onError:(error)->
    #             console.log "getBlacklistStatus:errorcode:"+error
    # ,1900)
##############################removeFromBlacklist############################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().removeFromBlacklist "wangwu",
    #         onSuccess:()->
    #             console.log "removeFromBlacklist Successfully"
    #         onError:(error)->
    #             console.log "removeFromBlacklist:errorcode:"+error
    # ,1920)
##############################saveTextMessageDraft############################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().saveTextMessageDraft RongIMLib.ConversationType.PRIVATE,"1002","drafTextMessageTest hello!!!",
    #         onSuccess:()->
    #             console.log "saveTextMessageDraft Successfully"
    #         onError:(error)->
    #             console.log "saveTextMessageDraft:errorcode:"+error
    # ,1930)
##############################getTextMessageDraft############################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().getTextMessageDraft RongIMLib.ConversationType.PRIVATE,"1002",
    #         onSuccess:(draf)->
    #             console.log "GetTextMessageDraf:"+draf
    #         onError:(error)->
    #             console.log "getTextMessageDraft:errorcode:"+error
    # ,1940)
##############################clearTextMessageDraft############################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().clearTextMessageDraft RongIMLib.ConversationType.PRIVATE,"1002",
    #         onSuccess:(isClear)->
    #             console.log "clearTextMessageDraft:"+isClear
    #         onError:(error)->
    #             console.log "clearTextMessageDraft:errorcode:"+error
    # ,1950)
##############################getTotalUnreadCount############################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().getTotalUnreadCount
    #         onSuccess:(count)->
    #             console.log "TotalUnreadCount:"+count
    #         onError:(error)->
    #             console.log "getTotalUnreadCount:errorcode:"+error
    # ,1950)
##############################getConversationUnreadCount#####################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().getConversationUnreadCount [RongIMLib.ConversationType.PRIVATE],
    #         onSuccess:(count)->
    #             console.log "getConversationUnreadCount:"+count
    #         onError:(error)->
    #             console.log "getConversationUnreadCount:errorcode:"+error
    # ,1000)
##############################getUnreadCount#################################################
    # setTimeout(->
    #     count = RongIMLib.RongIMClient.getInstance().getUnreadCount RongIMLib.ConversationType.PRIVATE,"lisi"
    #     console.log count
    # ,1200)
##############################getCurrentConnectionStatus#################################################
    # setTimeout(->
    #     status = RongIMLib.RongIMClient.getInstance().getCurrentConnectionStatus()
    #     switch status
    #         when RongIMLib.ConnectionStatus.CONNECTED
    #           console.log "已连接"
    #         when RongIMLib.ConnectionStatus.DISCONNECTED
    #           console.log "已断开"
    #         else console.log "状态为解析:"+status
    # ,1000)
##############################getConnectionChannel#################################################
    # setTimeout(->
    #     channel = RongIMLib.RongIMClient.getInstance().getConnectionChannel()
    #     switch channel
    #         when 1
    #           console.log "xhr-polling"
    #         when 2
    #           console.log "websocket"
    #         else console.log "状态为解析:"+status
    # ,1000)
##############################getStorageProvider#################################################
    # setTimeout(->
    #     provider = RongIMLib.RongIMClient.getInstance().getStorageProvider()
    #     console.log(provider)
    # ,1000)
##############################getCurrentUserId#################################################
    # setTimeout(->
    #     userId = RongIMLib.RongIMClient.getInstance().getCurrentUserId()
    #     console.log(userId)
    # ,1000)
##############################getCurrentUserInfo#################################################
    # setTimeout(->
    #     RongIMLib.RongIMClient.getInstance().getCurrentUserInfo
    #         onSuccess:(info)->
    #             console.log info
    #         onError:(error)->
    #             console.log "getCurrentUserInfo:errorcode:"+error
    # ,1000)
