describe "RongIMClient",->
    RongIMLib.RongIMClient.init("8luwapkvucoil",new RongIMLib.WebSQLDataProvider)
    RongIMLib.RongIMClient.setOnReceiveMessageListener onReceived: (message) ->
      console.log message.content.content
      console.log message
    RongIMLib.RongIMClient.setConnectionStatusListener onChanged: (status) ->
      switch status
          when RongIMLib.ConnectionStatus.CONNECTED
            console.log "链接成功"
          when RongIMLib.ConnectionStatus.CONNECTING
            console.log "正在链接"
          when RongIMLib.ConnectionStatus.DISCONNECTED
            console.log "断开连接"
          else console.log "状态为解析:"+status
    RongIMLib.RongIMClient.connect "BIG85AHHpMAXYvnD2DSgnLrkPG6U/xPk3zvPIWf9le1hEGTTL55/U07yY3a+mzGazeB0RzEl9Y46MnCyDLVMAw==",
        onSuccess:(userId)->
            console.log("loginSuccess,userId."+userId)
        onError:(error)->
           switch error
              when RongIMLib.ConnectionState.SERVER_UNAVAILABLE
                console.log "SERVER_UNAVAILABLE"
              when RongIMLib.ConnectionState.TOKEN_INCORRECT
                console.log "token 无效"
              else
                console.log error
    it "sendMessage",(done)->
        setTimeout(->
            message = RongIMLib.TextMessage.obtain "rongcloud"
            #message = new EmptyMessage({Name:'悲伤2015',Age:18,Address:"beijing"});
            RongIMLib.RongIMClient.getInstance().sendMessage RongIMLib.ConversationType.PRIVATE, "1005", message,
              onSuccess: (data)->
                console.log JSON.stringify(data)
                done()
              onError: (errorcode)->
                console.log errorcode
        ,1000)
