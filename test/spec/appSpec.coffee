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
describe "RongIMClient",->
    it "Connect&SendMessage",->
    # window["WEB_XHR_POLLING"] = true;
    # RongIMLib.RongIMClient.schemeType = RongIMLib.SchemeType.SSL
    RongIMLib.RongIMClient.init "cpj2xarlj5cdn"
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
    RongIMLib.RongIMClient.connect "0Qs6YHRj2p45jxfKS40Io3U1lgYP6zEv1OpCrfDse9JiBi4BNyqa2E2dH7xIEfEE9lfCByjdxCqYNAuDFMk66A==",
            onSuccess:(userId)->
                console.log("loginSuccess,userId."+userId)
            onError:(error)->
                console.log("loginError,errorcode:"+error)
###############################sendMessage##########################################
    setTimeout(->
        message = RongIMLib.TextMessage.obtain("my name is saner")
        RongIMLib.RongIMClient.getInstance().sendMessage RongIMLib.ConversationType.PRIVATE, "wangwu", message,null,
          onSuccess: (data)->
                console.log "Send Successfully"
          onError: (errorcode)->
                console.log errorcode
    ,1000)
    #
    # setTimeout(->
    #         message = RongIMLib.TextMessage.obtain("my name is saner")
    #         RongIMLib.RongIMClient.getInstance().sendMessage 4, "lisi", message,null,
    #           onSuccess: ()->
    #                 console.log "Send Successfully"
    #           onError: (errorcode)->
    #                 console.log errorcode
    # ,3000)
##############################getConversationList##########################################
    setTimeout(->
        RongIMLib.RongIMClient.getInstance().getConversationList
            onSuccess:(list)->
                console.log list
            onError:(error)->
                console.log "GetConversationList,errorcode:"+error
    ,1000)
