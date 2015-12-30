/**@overview 融云 RongCloud Web SDK API 开发文档 2.0.0*/
/**
 *RongIMClient对象，web SDK 核心处理类；SDK 上所有的方法、对象、属性、模块都是依附于该对象。
 * @constructor
 */
 function RongIMClient() {
   /**
      * [schemeType 选择连接方式]
      * SSL需要设置schemeType为ConnectionChannel.HTTPS
      * HTTP或WS需要设置 schemeType为ConnectionChannel.HTTP(默认)
      * 若改变连接方式此属性必须在RongIMClient.init之前赋值
      * RongIMLib.RongIMClient.schemeType = RongIMLib.ConnectionChannel.HTTP。
      */
     RongIMClient.schemeType = RongIMLib.ConnectionChannel.HTTP;
     /**
      * 自定消息存储变量。
      */
     RongIMClient.RegisterMessage = {};
     /**
      * 自消息类型，接收消息用到。
      */
     RongIMClient.MessageType = {
          TextMessage: { typeName: "TextMessage"},
          ImageMessage: { typeName: "ImageMessage"},
          DiscussionNotificationMessage: { typeName: "DiscussionNotificationMessage"},
          VoiceMessage: { typeName: "VoiceMessage"},
          RichContentMessage: { typeName: "RichContentMessage" },
          HandshakeMessage: { typeName: "HandshakeMessage" },
          UnknownMessage: { typeName: "UnknownMessage" },
          SuspendMessage: { typeName: "SuspendMessage" },
          LocationMessage: { typeName: "LocationMessage" },
          InformationNotificationMessage: { typeName: "InformationNotificationMessage"},
          ContactNotificationMessage: { typeName: "ContactNotificationMessage"},
          ProfileNotificationMessage: { typeName: "ProfileNotificationMessage" },
          CommandNotificationMessage: { typeName: "CommandNotificationMessage"},
          CommandMessage: { typeName: "CommandNotificationMessage"}
     };
 }
 /**
  * 获取 RongIMClient 实例。
  * 需在执行 init 方法初始化 SDK 后再获取，否则返回 null 值。
  * @example
  * var rongClient = RongIMClient.getInstance();
  */
 RongIMClient.getInstance = function() {
   if (!RongIMClient._appKey) {
     throw new Error("Not yet instantiated RongIMClient");
   }
   return RongIMClient._instance;
 };
 /**
  * 初始化 SDK，在整个应用全局只需要调用一次。
  * @param  {string} appKey  开发者后台申请的 AppKey，用来标识应用。
  * @param  {boolean} choicePolling 是否选择comet方式连接，默认为false
  * @param {object} dataAccessProvider 必须是DataAccessProvider的实例
  */
 RongIMClient.init = function (appKey, choicePolling, dataAccessProvider) {
 };
 /**
  * 连接服务器，在整个应用全局只需要调用一次，断线后 SDK 会自动重连。
  * @param  {string}   token   从服务端获取的用户身份令牌（Token）。
  * @param  {object}  callback 连接回调，返回连接的成功或者失败状态。
  * @example
  * RongIMClient.connect('TOKEN',{
  * onSuccess:function(){
  * 	//连接成功
  * },
  * onError:function(){
  * 	//连接失败
  * }
  * });
  */
 RongIMClient.connect = function (token, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "object"], "connect", true);
     RongIMClient.bridge = RongIMLib.Bridge.getInstance();
     RongIMClient.bridge.connect(RongIMClient._memoryStore.appKey, token, {
         onSuccess: function (data) {
             callback.onSuccess(data);
         },
         onError: function (e) {
             callback.onTokenIncorrect(e);
         }
     });
     //循环设置监听事件，追加之后清空存放事件数据
     for (var i = 0, len = RongIMClient._memoryStore.listenerList.length; i < len; i++) {
         RongIMClient.bridge["setListener"](RongIMClient._memoryStore.listenerList[i]);
     }
     RongIMClient._memoryStore.listenerList.length = 0;
     return RongIMClient._instance;
 };
 /**
  * 重新连接服务器，需在connect之后才能执行reconnect。
  * @param {object} callback 重连回调函数，与connect的回调函数一致
  * @example
  * RongIMClient.reconnect({
  * onSuccess:function(){
  * 	//重连成功
  * },
  * onError:function(){
  * 	//重连失败
  * }
  * });
  */
 RongIMClient.reconnect = function (callback) {
     RongIMClient.bridge.reconnect(callback);
 };
 /**
  * 注册消息类型，用于注册用户自定义的消息。
  * 内建的消息类型已经注册过，不需要再次注册。
  * 自定义消息声明需放在执行顺序最高的位置（在RongIMClient.init(appkey)之后即可）
  * @param {string}  objectName 内置消息名称。
  * @param {string}  messageType 消息类型（与自定义消息类名一致）。
  * @param {MessageTag}  messageTag设置是否保存是否计数
  * @param {string|array}  messageContent 此参数有一参二用的功效，自定义消息结构及解析方式请传入自定义消息的实例，使用融云内置消息结构及解析方式，直接传入属性数组即可，例如：["col1","col2"]。
  * @example
  * //以下两种方式2选1即可：
  * //(1) 自定义消息结构及解析方式
    //  自定义消息结构，首先要定义消息类，其次是注册，EmptyMessage为自定义消息名称。
    //  以下代码为示例代码，实际应用中可能有不规范之处，敬请谅解，自定义消息类型，格式必须与此一样，可修改的内容有：
  	//  1、消息类名称可修改为 RongIMClient.RegisterMessage.***Message=function(message){
  	  			// do something...
  	//  }。
  	//  2、messageName需要与消息类名称一致。
  	//  3、encode方法的实现可以自定义（封装消息，发送消息时用到）。
  	//  4、decode方法的实现可以自定义（解析消息，接受消息时用到）。
      RongIMClient.RegisterMessage.EmptyMessage = function(message){
         this.messageName = "EmptyMessage";
         this.encode = function(){
            return "name="+message.name+";age="+message.age;
         }
         this.decode = function(message){
           if (typeof message != "string") {
              return message;
           }
           var strArrs = message.split(";"),msg = new RongIMClient.RegisterMessage.EmptyMessage();
           for(var p in strArrs){
              msg[strArrs[p].split("=")[0]]=strArrs[p].split("=")[1];
           }
           return msg;
         }
     }
      RongIMClient.registerMessageType('s:empty','EmptyMessage',new RongIMLib.MessageTag(true,true),new RongIMClient.RegisterMessage.EmptyMessage);
    //(2) SDK内置消息结构及解析方式
      RongIMClient.registerMessageType('s:empty','EmptyMessage',new RongIMLib.MessageTag(true,true),["name","age"]);
  */
 RongIMClient.registerMessageType = function (objectName, messageType, messageTag, messageContent) {
     if (!objectName) {
         throw new Error("objectName can't be empty,postion -> registerMessageType");
     }
     if (!messageType) {
         throw new Error("messageType can't be empty,postion -> registerMessageType");
     }
     if (Object.prototype.toString.call(messageContent) == "[object Array]") {
         var regMsg = RongIMLib.ModelUtil.modleCreate(messageContent);
         RongIMClient.RegisterMessage[messageType] = regMsg;
     }
     else if (Object.prototype.toString.call(messageContent) == "[object Function]" || Object.prototype.toString.call(messageContent) == "[object Object]") {
         if (!messageContent.encode) {
             throw new Error("encode method has not realized or messageName is undefined-> registerMessageType");
         }
         if (!messageContent.decode) {
             throw new Error("decode method has not realized -> registerMessageType");
         }
     }
     else {
         throw new Error("The index of 3 parameter was wrong type  must be object or function or array-> registerMessageType");
     }
     RongIMClient.RegisterMessage[messageType].messageName = messageType;
     RongIMClient.MessageType[messageType] = { typeName: messageType, objectName: objectName, msgTag: messageTag };
     registerMessageTypeMapping[objectName] = messageType;
 };
 /**
   * 设置连接状态变化的监听器。
   * @param  {object} listener 连接状态变化的监听器。
   * @example
   * RongIMClient.getInstance().setConnectionStatusListener({
   *  onChanged:function(status){
   *  }
   * });
   */
 RongIMClient.setConnectionStatusListener = function (listener) {
     if (RongIMClient.bridge) {
         RongIMClient.bridge.setListener(listener);
     }
     else {
         RongIMClient._memoryStore.listenerList.push(listener);
     }
 };
 /**
  * 设置接收消息的监听器。
  * @param {object} listener  接收消息的监听器。
  * @example
  * RongIMClient.getInstance().setOnReceiveMessageListener({
  * onReceived:function(message){
  * //message 为具体的消息对象
  *  }
  * });
  */
 RongIMClient.setOnReceiveMessageListener = function (listener) {
     if (RongIMClient.bridge) {
         RongIMClient.bridge.setListener(listener);
     }
     else {
         RongIMClient._memoryStore.listenerList.push(listener);
     }
 };
 /**
  * 断开连接。
  * @example
  * RongIMClient.getInstance().disconnect();
  */
 RongIMClient.prototype.disconnect = function() {
   RongIMClient.bridge.disconnect();
 };
 /**
  * 清理所有连接相关的变量并关闭连接，执行此方法后，reconnect执行将返回异常。
  */
 RongIMClient.prototype.logout = function () {
     RongIMClient.bridge.disconnect();
     RongIMClient.bridge = null;
 };
 /**
  * 获取当前连接的状态。
  * @example
  * var connectStatus = RongIMClient.getInstance().getCurrentConnectionStatus();
  * console.log(connectStatus);
  * => 已连接（实时的连接状态，不一定是已连接）
  */
 RongIMClient.prototype.getCurrentConnectionStatus = function () {
     return RongIMLib.Bridge._client.channel.connectionStatus;
 };
 /**
  * 获取当前使用的连接通道。
  * @example
  * var connectChannel = RongIMClient.getInstance().getConnectionChannel();
  * console.log(connectChannel);
  * => WebSocket （正在使用的通道，websocket或者xhrpolling）
  */
 RongIMClient.prototype.getConnectionChannel = function () {
     if (RongIMLib.Transports._TransportType == RongIMLib.Socket.XHR_POLLING) {
         return RongIMLib.ConnectionChannel.XHR_POLLING;
     }
     else if (RongIMLib.Transports._TransportType == RongIMLib.Socket.WEBSOCKET) {
         return RongIMLib.ConnectionChannel.WEBSOCKET;
     }
 };
 /**
  * 获取当前连接用户的 UserId。
  * @example
  * var userId = RongIMClient.getInstance().getCurrentUserId();
  * console.log(userId);
  * => 当前登录人的Id
  */
 RongIMClient.prototype.getCurrentUserId = function () {
     return RongIMLib.Bridge._client.userId;
 };
 /**
  * getCurrentUserInfo 获取当前用户信息
  * @param  {ResultCallback<UserInfo>} callback [回调函数]
  * @example
  * RongIMClient.getInstance().getCurrentUserInfo({
  * 		onSuccess:function(info){
  * 				//info 当前登录用户的信息。
  * 		},
  *   	onError:function(){
  *   			//获取当前登录用户信息失败。
  *   	}
  * });
  */
 RongIMClient.prototype.getCurrentUserInfo = function (callback) {
     RongIMLib.CheckParam.getInstance().check(["object"], "getCurrentUserInfo");
     this.getUserInfo(RongIMLib.Bridge._client.userId, callback);
 };
 /**
  * 获得用户信息
  * @param  {string}                   userId [用户Id]
  * @param  {ResultCallback<UserInfo>} callback [回调函数]
  * @example
  * RongIMClient.getInstance().getCurrentUserInfo('targetId',{
  * 		onSuccess:function(info){
  * 				//info 用户的信息。
  * 		},
  *   	onError:function(){
  *   			//获取用户信息失败。
  *   	}
  * });
  */
 RongIMClient.prototype.getUserInfo = function (userId, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "object"], "getUserInfo");
     var user = new Modules.GetUserInfoInput();
     user.setNothing(1);
     RongIMClient.bridge.queryMsg(5, RongIMLib.MessageUtil.ArrayForm(user.toArrayBuffer()), userId, {
         onSuccess: function (info) {
             var userInfo = new RongIMLib.UserInfo(info.userId, info.name, info.portraitUri);
             callback.onSuccess(userInfo);
         },
         onError: function (err) {
             callback.onError(err);
         }
     }, "GetUserInfoOutput");
 };
 /**
  * 获取本地时间与服务器时间的差值，单位为毫秒。
  * @param {object} callback  获取的回调，返回时间差值。
  */
 RongIMClient.prototype.getDeltaTime = function (callback) {

 };
 /**
  * 指定清除本地会话中的历史消息。
  * @param {number} conversationType 会话类型。
  * @param {string} targetId 目标Id。
  * @param {object} callback 获取的回调。
  * @example
  * RongIMClient.getInstance().clearMessages("conversationType","targetId",{
  *    onSuccess:function(isClear){
  *   			// isClear true 清除成功 ， false 清除失败
  *    },
  *    onError:function(){
  *        //清除遇到错误。
  *    }
  *  });
  */
 RongIMClient.prototype.clearMessages = function (conversationType, targetId, callback) {
     RongIMClient._dataAccessProvider.clearMessages(conversationType, targetId, callback);
 };
 /**
  * 指定清除本地会话中的未读消息状态。
  * @param {number} conversationType 会话类型。
  * @param {string} targetId 目标Id。
  * @param {object} callback 获取的回调。
  * @example
  * RongIMClient.getInstance().clearMessagesUnreadStatus("conversationType","targetId",{
  *    onSuccess:function(isClear){
  *   			// isClear true 清除成功 ， false 清除失败
  *    },
  *    onError:function(){
  *        //清除遇到错误。
  *    }
  *  });
  */
 RongIMClient.prototype.clearMessagesUnreadStatus = function (conversationType, targetId, callback) {
     RongIMClient._dataAccessProvider.updateMessages(conversationType, targetId, "readStatus", null, callback);
 };
 /**
  * 指定删除本地会话中的一条货多条消息。
  * @param {number} conversationType 会话类型。
  * @param {string} targetId 目标Id。
  * @param {array}  messageIds 消息Id数组。
  * @param {object} callback获取的回调。
  * @example
  * RongIMClient.getInstance().deleteMessages("conversationType","targetId",["messageId1","messageId2"],{
  *    onSuccess:function(){
  *    },
  *    onError:function(){
  *    }
  *  });
  */
 RongIMClient.prototype.deleteMessages = function (conversationType, targetId, messageIds, callback) {
     RongIMClient._dataAccessProvider.removeMessage(conversationType, targetId, messageIds, callback);
 };
 /**
  * sendMessage 发送消息。
  * @param  {ConversationType}        conversationType 会话类型
  * @param  {string}                  targetId         目标Id
  * @param  {MessageContent}          messageContent   消息类型
  * @param  {SendMessageCallback}     sendCallback
  * @param  {ResultCallback<Message>} resultCallback   返回值，函数回调
  * @example
  * RongIMLib.RongIMClient.getInstance().sendMessage("conversationType", "targetId", "msg对象", null, {
  *  onSuccess: function(data) {
  *    console.log("Send Successfully" +JSON.stringify(data));
  *  },
  *  onError: function(errorcode) {
  *     console.log("SendMessage,errorcode:" + errorcode);
  *   }
  * });
  */
 RongIMClient.prototype.sendMessage = function (conversationType, targetId, messageContent, sendCallback, resultCallback, pushContent, pushData) {
     RongIMLib.CheckParam.getInstance().check(["number", "string", "object", "null|object|global", "object"], "sendMessage");
     if (!RongIMLib.Bridge._client.channel.socket.socket.connected) {
         resultCallback.onError(RongIMLib.ErrorCode.TIMEOUT);
         throw new Error("connect is timeout! postion:sendMessage");
     }
     var modules = new Modules.UpStreamMessage();
     modules.setSessionId(RongIMClient.MessageType[messageContent.messageName].msgTag.getMessageTag());
     modules.setClassname(RongIMClient.MessageType[messageContent.messageName].objectName);
     modules.setContent(messageContent.encode());
     var content = modules.toArrayBuffer();
     if (Object.prototype.toString.call(content) == "[object ArrayBuffer]") {
         content = [].slice.call(new Int8Array(content));
     }
     var c = null, me = this, msg;
     this.getConversation(conversationType, targetId, {
         onSuccess: function (conver) {
             c = conver;
         }
     });
     if (!c) {
         c = me.createConversation(conversationType, targetId, "");
         msg = new RongIMLib.Message();
         msg.conversationType = conversationType;
         msg.sentTime = new Date().getTime(); //TODO getDeltaTime 是否有关系
         c.latestMessage = msg;
     }
     c.sentTime = new Date().getTime();
     c.sentStatus = RongIMLib.SentStatus.SENDING;
     c.senderUserName = "";
     c.senderUserId = RongIMLib.Bridge._client.userId;
     c.notificationStatus = RongIMLib.ConversationNotificationStatus.DO_NOT_DISTURB;
     c.latestMessage.content = messageContent;
     c.unreadMessageCount = 0;
     c.setTop();
     RongIMClient.bridge.pubMsg(conversationType.valueOf(), content, targetId, resultCallback, null);
 };
 /**
  * sendTextMessage 发送TextMessage快捷方式。
  * @param  {string}                  content        消息内容
  * @param  {ResultCallback<Message>} resultCallback 返回值，函数回调
  * @example
  * RongIMLib.RongIMClient.getInstance().sendTextMessage("conversationType", "targetId", "消息内容", {
  *   onSuccess: function(data) {
  *     console.log(JSON.stringify(data));
  *     //=> data {messageUId:"消息唯一Id",timestamp:"发送消息时间戳"}
  *     console.log("SendTextMessage Successfully");
  *   },
  *   onError: function(errorcode) {
  *     console.log("SendTextMessage,errorcode:" + errorcode);
  * }
  * });
  */
 RongIMClient.prototype.sendTextMessage = function (conversationType, targetId, content, resultCallback) {
     var msgContent = RongIMLib.TextMessage.obtain(content);
     this.sendMessage(conversationType, targetId, msgContent, null, resultCallback);
 };
 /**
  * insertMessage 向本地插入一条消息，不发送到服务器。
  * @param  {ConversationType}        conversationType  会话类型
  * @param  {string}                  targetId          目标Id
  * @param  {string}                  senderUserId      发送者Id
  * @param  {MessageContent}          content          消息内容
  * @param  {ResultCallback<Message>} callback         返回值，函数回调
  * @example
  * RongIMClient.getInstance().insertMessage("conversationType","targetId","senderUserId","msg对象",{
  *  onSuccess: function() {
  *    console.log("insertMessage Successfully");
  *  },
  *  onError: function(errorcode) {
  *     console.log("insertMessage,errorcode:" + errorcode);
  *   }
  * });
  */
 RongIMClient.prototype.insertMessage = function (conversationType, targetId, senderUserId, content, callback) {
     RongIMClient._dataAccessProvider.addMessage(conversationType, targetId, content, callback);
 };
 /**
  * getHistoryMessages 拉取本地历史消息记录，如果本地没有历史消息，会自动从融云服务器拉去历史消息。
  * @param  {ConversationType}          conversationType 会话类型
  * @param  {string}                    targetId         用户Id
  * @param  {number|null}               pullMessageTime  拉取历史消息起始位置(格式为毫秒数)，可以为null
  * @param  {number}                    count            历史消息数量
  * @param  {ResultCallback<Message[]>} callback         回调函数
  * @example
  * RongIMLib.RongIMClient.getInstance().getHistoryMessages("conversationType", "targetId","pullMessageTime", "count", {
  *  onSuccess: function(list, hasMsg) {
  *   		//list 历史消息数组，hasMsg为boolean值，如果为true则表示还有剩余历史消息可拉取，为false的话表示没有剩余历史消息可供拉取。
  *  },
  *  onError: function(error) {
  *   	 //GetHistoryMessages error
  *  }
  * });
  */
 RongIMClient.prototype.getHistoryMessages = function (conversationType, targetId, timestamp, count, callback) {
     RongIMLib.CheckParam.getInstance().check(["number", "string", "number|null|global", "number", "object"], "getHistoryMessages");
     if (count > 20) {
         throw new Error("HistroyMessage count must be less than or equal to 20!");
     }
     if (conversationType.valueOf() < 0) {
         throw new Error("ConversationType must be greater than -1");
     }
     RongIMClient._dataAccessProvider.getHistoryMessages(conversationType, targetId, timestamp, count, callback);
 };
 /**
  * 拉取服务器历史消息记录。
  * 拉取历史消息为循环拉取，举例：
  * 条件：历史记录为45条，每次拉取20条
  * 第一次拉取list长度为20，hasMsg为true。
  * 第二次拉取list长度为20，hasMsg为true。
  * 第三次拉取list长度为5，hasMsg为false。
  * 第四次拉取list长度为0，hasMsg为false。
  * 第四次拉取：重复第一次拉取，以此循环
  * @param  {ConversationType}          conversationType 会话类型
  * @param  {string}                    targetId         用户Id
  * @param  {number|null}               pullMessageTime  拉取历史消息起始位置(格式为毫秒数)，可以为null
  * @param  {number}                    count            历史消息数量
  * @param  {ResultCallback<Message[]>} callback         回调函数
  * @example
  * RongIMLib.RongIMClient.getInstance().getRemoteHistoryMessages("conversationType", "targetId","pullMessageTime", "count", {
  *  onSuccess: function(list, hasMsg) {
  *   		//list 历史消息数组，hasMsg为boolean值，如果为true则表示还有剩余历史消息可拉取，为false的话表示没有剩余历史消息可供拉取。
  *  },
  *  onError: function(error) {
  *   	 //getRemoteHistoryMessages error
  *  }
  * });
  */
 RongIMClient.prototype.getRemoteHistoryMessages = function (conversationType, targetId, timestamp, count, callback) {
     RongIMLib.CheckParam.getInstance().check(["number", "string", "number|null|global", "number", "object"], "getRemoteHistoryMessages");
     if (count > 20) {
         console.log("HistroyMessage count must be less than or equal to 20!");
         callback.onError(RongIMLib.ErrorCode.RC_CONN_PROTO_VERSION_ERROR);
         return;
     }
     if (conversationType.valueOf() < 0) {
         console.log("ConversationType must be greater than -1");
         callback.onError(RongIMLib.ErrorCode.RC_CONN_PROTO_VERSION_ERROR);
         return;
     }
     var modules = new Modules.HistoryMessageInput(), self = this;
     modules.setTargetId(targetId);
     if (!timestamp) {
         modules.setDataTime(RongIMClient._memoryStore.lastReadTime.get(conversationType + targetId));
     }
     else {
         modules.setDataTime(timestamp);
     }
     modules.setSize(count);
     RongIMClient.bridge.queryMsg(HistoryMsgType[conversationType], RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), targetId, {
         onSuccess: function (data) {
             var list = data.list.reverse();
             for (var i = 0, len = list.length; i < len; i++) {
                 list[i] = RongIMLib.MessageUtil.messageParser(list[i]);
             }
             callback.onSuccess(list, !!data.hasMsg);
         },
         onError: function () {
             callback.onError(RongIMLib.ErrorCode.UNKNOWN);
         }
     }, "HistoryMessagesOuput");
 };
 /**
  * hasRemoteUnreadMessages 是否有未接收的消息，jsonp方法。
  * @param  {string}          appkey   appkey
  * @param  {string}          token   token
  * @param  {ConnectCallback} callback 返回值，参数回调
  * @example
  *   RongIMClient.getInstance().hasRemoteUnreadMessages(TOKEN", {
  *    onSuccess: function(hasMsg) {
  *       //hasMsg为true表示有未读消息，为false没有未读消息
  *    },
  *    onError: function(error) {
  *      console.log("hasRemoteUnreadMessages,errorcode:" + error);
  *    }
  *  });
  *
  */
 RongIMClient.prototype.hasRemoteUnreadMessages = function (token, callback) {
     var xss = null;
     window.RCcallback = function (x) {
         callback.onSuccess(!!+x.status);
         xss.parentNode.removeChild(xss);
     };
     xss = document.createElement("script");
     xss.src = RongIMLib.MessageUtil.schemeArrs[RongIMClient.schemeType][0] + "://api.cn.rong.io/message/exist.js?appKey=" + encodeURIComponent(RongIMClient._memoryStore.appKey) + "&token=" + encodeURIComponent(token) + "&callBack=RCcallback&_=" + Date.now();
     document.body.appendChild(xss);
     xss.onerror = function () {
         callback.onError(RongIMLib.ErrorCode.UNKNOWN);
         xss.parentNode.removeChild(xss);
     };
 };
 /**
  * getTotalUnreadCount 获取所有会话的未读消息总数。
  * @param  {ConnectCallback} callback 返回值，参数回调
  * @example
  * RongIMClient.getInstance().getTotalUnreadCount({
  *  onSuccess: function(count) {
  *      console.log("count:"+count);
  *  },
  *  onError: function(error) {
  *  }
  * });
  */
 RongIMClient.prototype.getTotalUnreadCount = function (callback) {
     RongIMClient._dataAccessProvider.getTotalUnreadCount(callback);
 };
 /**
  * getConversationUnreadCount 指定多种会话类型获取未读消息数。
  * @param  {ResultCallback<number>} callback             返回值，参数回调。
  * @param  {ConversationType[]}     ...conversationTypes 会话类型。
  * @example
  * RongIMClient.getInstance().getConversationUnreadCount([RongIMClient.ConversationType.PRIVATE],{
  *  onSuccess: function(count) {
  *      console.log("count:"+count);
  *  },
  *  onError: function(error) {
  *  }
  * });
  */
 RongIMClient.prototype.getConversationUnreadCount = function (conversationTypes, callback) {
     RongIMClient._dataAccessProvider.getConversationUnreadCount(conversationTypes, callback);
 };
 /**
  * getUnreadCount 指定用户、会话类型的未读消息总数。
  * @param  {ConversationType} conversationType 会话类型
  * @param  {string}           targetId         用户Id
  * @example
  * RongIMClient.getInstance().getUnreadCount("conversationType","targetId",{
  *  onSuccess: function(count) {
  *      console.log("count:"+count);
  *  },
  *  onError: function(error) {
  *  }
  * });
  */
 RongIMClient.prototype.getUnreadCount = function (conversationType, targetId, callback) {
     RongIMClient._dataAccessProvider.getUnreadCount(conversationType, targetId, callback);
 };
 /**
  * clearTextMessageDraft 清除指定会话和消息类型的草稿。
  * @param  {ConversationType}        conversationType 会话类型
  * @param  {string}                  targetId         目标Id
  * @param  {ResultCallback<boolean>} callback         返回值，参数回调
  * @example
  * RongIMClient.getInstance().clearTextMessageDraft("conversationType","targetId",{
  *  onSuccess: function(isClear) {
  *      // isClear true:清除成功   false:清除失败
  *  },
  *  onError: function(error) {
  *  }
  * });
  */
 RongIMClient.prototype.clearTextMessageDraft = function (conversationType, targetId, callback) {
     RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "clearTextMessageDraft");
     RongIMClient._memoryStore["darf_" + conversationType + "_" + targetId];
     callback.onSuccess(true);
 };
 /**
  * getTextMessageDraft 获取指定消息和会话的草稿。
  * @param  {ConversationType}       conversationType [会话类型]
  * @param  {string}                 targetId         [目标Id]
  * @param  {ResultCallback<string>} callback         [返回值，参数回调]
  * @example
  *   RongIMClient.getInstance().getTextMessageDraft("conversationType", "targetId", {
  *         onSuccess: function(draf) {
  *             //do something
  *         },
  *         onError: function(error) {
  *           //do something
  *         }
  *       });
  */
 RongIMClient.prototype.getTextMessageDraft = function (conversationType, targetId, callback) {
     RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "getTextMessageDraft");
     if (targetId == "" || conversationType < 0) {
         throw new Error("params error : " + RongIMLib.ErrorCode.DRAF_GET_ERROR);
     }
     callback.onSuccess(RongIMClient._memoryStore["darf_" + conversationType + "_" + targetId]);
 };
 /**
  * 保存草稿信息。
  * @param  {ConversationType}        conversationType 会话类型
  * @param  {string}                  targetId         目标Id
  * @param  {string}                  value            草稿值
  * @param  {ResultCallback<boolean>} callback         返回值，参数回调
  * @example
  * RongIMClient.getInstance().saveTextMessageDraft("conversationType", "targetId", "草稿内容", {
  *   onSuccess: function() {
  *      //成功
  *   },
  *   onError: function(error) {
  *     //失败
  *   }
  * });
  */
 RongIMClient.prototype.saveTextMessageDraft = function (conversationType, targetId, value, callback) {
     RongIMLib.CheckParam.getInstance().check(["number", "string", "string", "object"], "saveTextMessageDraft");
     RongIMClient._memoryStore["darf_" + conversationType + "_" + targetId] = value;
     callback.onSuccess(true);
 };
 /**
  * 清除会话列表
  */
 RongIMClient.prototype.clearConversations = function (callback) {
     var conversationTypes = [];
     for (var _i = 1; _i < arguments.length; _i++) {
         conversationTypes[_i - 1] = arguments[_i];
     }
     if (conversationTypes.length == 0) {
         conversationTypes = [RongIMLib.ConversationType.CHATROOM,
             RongIMLib.ConversationType.CUSTOMER_SERVICE,
             RongIMLib.ConversationType.DISCUSSION,
             RongIMLib.ConversationType.GROUP,
             RongIMLib.ConversationType.PRIVATE,
             RongIMLib.ConversationType.SYSTEM,
             RongIMLib.ConversationType.PUBLIC_SERVICE,
             RongIMLib.ConversationType.APP_PUBLIC_SERVICE];
     }
     RongIMClient._dataAccessProvider.clearConversations(conversationTypes, callback);
 };
 /**
  * getConversation 获取指定会话。
  * @param  {ConversationType}             conversationType 会话类型
  * @param  {string}                       targetId        目标Id
  * @param  {ResultCallback<Conversation>} callback         返回值，函数回调
  * @example
  * RongIMClient.getInstance().getConversation("conversationType", "targetId", {
  *   onSuccess: function(conver) {
  *      //成功 conver 为Conversation对象
  *   },
  *   onError: function(error) {
  *     //失败
  *   }
  * });
  */
 RongIMClient.prototype.getConversation = function (conversationType, targetId, callback) {
     RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "getConversation");
     var conver = RongIMClient._dataAccessProvider.getConversation(conversationType, targetId);
     callback.onSuccess(conver);
 };
 /**
  * 从本地拉取会话列表。
  * @param  {ResultCallback} callback 返回值，参数回调
  * @example
  * RongIMClient.getInstance().getConversationList({
  *    onSuccess: function(list) {
  *       //list 会话列表
  *    },
  *    onError: function(error) {
  *      //GetConversationList error
  *    }
  *  });
  *
  */
 RongIMClient.prototype.getConversationList = function (callback) {
     RongIMLib.CheckParam.getInstance().check(["object"], "getConversationList");
     var me = this;
     RongIMClient._dataAccessProvider.getConversationList({
         onSuccess: function (data) {
             me.sortConversationList(RongIMClient._memoryStore.conversationList);
             callback.onSuccess(RongIMClient._memoryStore.conversationList);
         }
     });
 };
 /**
  * 从服务器拉取会话列表。
  * @param  {ResultCallback} callback 返回值，参数回调
  * @example
  * RongIMClient.getInstance().getRemoteConversationList({
  *    onSuccess: function(list) {
  *       //list 会话列表
  *    },
  *    onError: function(error) {
  *      //getRemoteConversationList error
  *    }
  *  });
  */
 RongIMClient.prototype.getRemoteConversationList = function (callback) {
     var conversationTypes = [];
     for (var _i = 1; _i < arguments.length; _i++) {
         conversationTypes[_i - 1] = arguments[_i];
     }
     RongIMLib.CheckParam.getInstance().check(["object"], "getConversationList");
     var modules = new Modules.RelationsInput(), self = this;
     modules.setType(1);
     RongIMClient.bridge.queryMsg(26, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
         onSuccess: function (list) {
             if (list.info) {
                 for (var i = 0, len = list.info.length; i < len; i++) {
                     setTimeout(self.pottingConversation(list.info[i]), 200);
                 }
             }
             callback.onSuccess(RongIMClient._memoryStore.conversationList);
         },
         onError: function () {
             callback.onError(RongIMLib.ErrorCode.CONVER_GETLIST_ERROR);
         }
     }, "RelationsOutput");
 };
 /**
  * 删除会话列表，本地和融云服务器都会删除。
  * @param  {ConversationType}   conversationType 会话类型
  * @param  {string}   targetId        目标Id
  * @param  {ResultCallback} callback        返回值，函数回调
  * @example
  * RongIMClient.getInstance().removeConversation("conversationType", "targetId",{
  *    onSuccess: function(list) {
  *       //list 会话列表
  *    },
  *    onError: function(error) {
  *      //getRemoteConversationList error
  *    }
  *  });
  */
 RongIMClient.prototype.removeConversation = function (conversationType, targetId, callback) {
     RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "removeConversation");
     var mod = new Modules.RelationsInput();
     mod.setType(C2S[conversationType]);
     RongIMClient.bridge.queryMsg(27, RongIMLib.MessageUtil.ArrayForm(mod.toArrayBuffer()), targetId, {
         onSuccess: function () {
             RongIMClient._dataAccessProvider.removeConversation(conversationType, targetId, {
                 onSuccess: function () {
                     callback.onSuccess(true);
                 },
                 onError: function () {
                     callback.onError(RongIMLib.ErrorCode.CONVER_REMOVE_ERROR);
                 }
             });
         }, onError: function () {
             callback.onError(RongIMLib.ErrorCode.CONVER_REMOVE_ERROR);
         }
     });
 };
 /**
  * 会话置顶。
  * @param  {ConversationType}   conversationType 会话类型
  * @param  {string}   targetId        目标Id
  * @param  {ResultCallback} callback        返回值，函数回调
  */
 RongIMClient.prototype.setConversationToTop = function (conversationType, targetId, callback) {
     RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "setConversationToTop");
     RongIMClient._dataAccessProvider.setConversationToTop(conversationType, targetId, callback);
 };
 /**
  * 加入讨论组。
  * @param  {string}            discussionId 讨论组Id
  * @param  {string[]}          userIdList   讨论中成员
  * @param  {OperationCallback} callback     返回值，函数回调
  * @example
  * RongIMClient.getInstance().addMemberToDiscussion("讨论组Id", ["targetId1","targetId2"], {
  *   onSuccess: function() {
  *     //加入成功
  *   },
  *   onError: function(error) {
  *     //加入失败
  *   }
  * });
  */
 RongIMClient.prototype.addMemberToDiscussion = function (discussionId, userIdList, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "array", "object"], "addMemberToDiscussion");
     var modules = new Modules.ChannelInvitationInput();
     modules.setUsers(userIdList);
     RongIMClient.bridge.queryMsg(0, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, {
         onSuccess: function () {
             callback.onSuccess();
         },
         onError: function () {
             callback.onError(RongIMLib.ErrorCode.JOIN_IN_DISCUSSION);
         }
     });
 };
 /**
  * 创建讨论组。
  * @param  {string}                   name       [讨论组名称]
  * @param  {string[]}                 userIdList [讨论组成员]
  * @param  {CreateDiscussionCallback} callback   [返回值，函数回调]
  * @example
  * RongIMClient.getInstance().createDiscussion("讨论组名称", ["targetId1", "targetId2"], {
  *   onSuccess: function(discussId) {
  *     // 创建成功 discussId为讨论组id
  *   },
  *   onError: function(error) {
  *     // 创建失败
  *   }
  * });
  *
  */
 RongIMClient.prototype.createDiscussion = function (name, userIdList, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "array", "object"], "createDiscussion");
     var modules = new Modules.CreateDiscussionInput(), self = this;
     modules.setName(name);
     RongIMClient.bridge.queryMsg(1, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
         onSuccess: function (discussId) {
             if (userIdList.length > 0) {
                 self.addMemberToDiscussion(discussId, userIdList, {
                     onSuccess: function () { },
                     onError: function (error) {
                         callback.onError(error);
                     }
                 });
             }
             callback.onSuccess(discussId);
         },
         onError: function () {
             callback.onError(RongIMLib.ErrorCode.CREATE_DISCUSSION);
         }
     }, "CreateDiscussionOutput");
 };
 /**
  * 获取讨论组信息。
  * @param  {string}                     discussionId 讨论组Id
  * @param  {ResultCallback<Discussion>} callback     返回值，函数回调
  * @example
  * RongIMClient.getInstance().getDiscussion("讨论组Id", {
  *   onSuccess: function(discuss) {
  *     console.log("GetDiscussion successfully");
  *   },
  *   onError: function(error) {
  *     console.log("GetDiscussion:errorcode:" + error);
  *   }
  * });
  */
 RongIMClient.prototype.getDiscussion = function (discussionId, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "object"], "getDiscussion");
     var modules = new Modules.ChannelInfoInput();
     modules.setNothing(1);
     RongIMClient.bridge.queryMsg(4, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback, "ChannelInfoOutput");
 };
 /**
  * 退出讨论组。
  * @param  {string}            discussionId 讨论组Id
  * @param  {OperationCallback} callback     返回值，函数回调
  * @example
  * RongIMClient.getInstance().quitDiscussion("讨论组Id", {
  *   onSuccess: function() {
  *     console.log("QuitDiscussion Successfully");
  *   },
  *   onError: function(error) {
  *     console.log("QuitDiscussion:errorcode:" + error);
  *   }
  * });
  */
 RongIMClient.prototype.quitDiscussion = function (discussionId, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "object"], "quitDiscussion");
     var modules = new Modules.LeaveChannelInput();
     modules.setNothing(1);
     RongIMClient.bridge.queryMsg(7, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback);
 };
 /**
  * 将指定成员移除讨论租。
  * @param  {string}            discussionId 讨论组Id
  * @param  {string}            userId       被移除的用户Id
  * @param  {OperationCallback} callback     返回值，参数回调
  * @example
  * RongIMClient.getInstance().removeMemberFromDiscussion("讨论组Id", "targetId", {
  *   onSuccess: function() {
  *     console.log("RemoveMember Successfully");
  *   },
  *   onError: function(error) {
  *     console.log("RemoveMember:errorcode:" + error);
  *   }
  * });
  */
 RongIMClient.prototype.removeMemberFromDiscussion = function (discussionId, userId, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "string", "object"], "removeMemberFromDiscussion");
     var modules = new Modules.ChannelEvictionInput();
     modules.setUser(userId);
     RongIMClient.bridge.queryMsg(9, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback);
 };
 /**
  * 设置讨论组邀请状态。
  * @param  {string}                 discussionId 讨论组Id
  * @param  {DiscussionInviteStatus} status       邀请状态
  * @param  {OperationCallback}      callback     返回值，函数回调
  * @example
  * RongIMClient.getInstance().setDiscussionInviteStatus("讨论组Id", "讨论组装填", {
  *   onSuccess: function() {
  *     console.log("setDiscussionInviteStatus Successfully");
  *   },
  *   onError: function(error) {
  *     console.log("setDiscussionInviteStatus:errorcode:" + error);
  *   }
  * });
  */
 RongIMClient.prototype.setDiscussionInviteStatus = function (discussionId, status, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "number", "object"], "setDiscussionInviteStatus");
     var modules = new Modules.ModifyPermissionInput();
     modules.setOpenStatus(status.valueOf());
     RongIMClient.bridge.queryMsg(11, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, {
         onSuccess: function (x) {
             callback.onSuccess();
         }, onError: function () {
             callback.onError(RongIMLib.ErrorCode.INVITE_DICUSSION);
         }
     });
 };
 /**
  * 设置讨论组名称。
  * @param  {string}            discussionId 讨论组Id
  * @param  {string}            name         讨论组名称
  * @param  {OperationCallback} callback     返回值，函数回调
  * @example
  * RongIMClient.getInstance().setDiscussionName("讨论组Id", "讨论组名称", {
  *   onSuccess: function() {
  *     console.log("setDiscussionName Successfully");
  *   },
  *   onError: function(error) {
  *     console.log("setDiscussionName:errorcode:" + error);
  *   }
  * });
  */
 RongIMClient.prototype.setDiscussionName = function (discussionId, name, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "string", "object"], "setDiscussionName");
     var modules = new Modules.RenameChannelInput();
     modules.setName(name);
     RongIMClient.bridge.queryMsg(12, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback);
 };
 /**
  * 加入群组。
  * @param  {string}            groupId   群组Id
  * @param  {string}            groupName 群组名称
  * @param  {OperationCallback} callback  返回值，函数回调
  * @example
  * RongIMClient.getInstance().joinGroup("群组Id", "群组名称", {
  *   onSuccess: function() {
  *     console.log("joinGroup Successfully");
  *   },
  *   onError: function(error) {
  *     console.log("joinGroup:errorcode:" + error);
  *   }
  * });
  */
 RongIMClient.prototype.joinGroup = function (groupId, groupName, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "string", "object"], "joinGroup");
     var modules = new Modules.GroupInfo();
     modules.setId(groupId);
     modules.setName(groupName);
     var _mod = new Modules.GroupInput();
     _mod.setGroupInfo([modules]);
     RongIMClient.bridge.queryMsg(6, RongIMLib.MessageUtil.ArrayForm(_mod.toArrayBuffer()), groupId, callback, "GroupOutput");
 };
 /**
  * 退出群组。
  * @param  {string}            groupId  群组Id
  * @param  {OperationCallback} callback 返回值，函数回调
  * @example
  * RongIMClient.getInstance().quitGroup("群组Id", {
  *   onSuccess: function() {
  *     console.log("quitGroup Successfully");
  *   },
  *   onError: function(error) {
  *     console.log("quitGroup:errorcode:" + error);
  *   }
  * });
  */
 RongIMClient.prototype.quitGroup = function (groupId, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "object"], "quitGroup");
     var modules = new Modules.LeaveChannelInput();
     modules.setNothing(1);
     RongIMClient.bridge.queryMsg(8, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), groupId, callback);
 };
 /**
  * 加入聊天室。
  * @param  {string}            chatroomId   聊天室Id
  * @param  {number}            messageCount 拉取消息数量，-1为不拉去消息
  * @param  {OperationCallback} callback     返回值，函数回调
  * @example
  * RongIMClient.getInstance().joinChatRoom("聊天室Id", "拉取消息数", {
  *   onSuccess: function() {
  *     console.log("joinChatRoom Successfully");
  *   },
  *   onError: function(error) {
  *     console.log("joinChatRoom:errorcode:" + error);
  *   }
  * });
  */
 RongIMClient.prototype.joinChatRoom = function (chatroomId, messageCount, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "number", "object"], "joinChatRoom");
     if (chatroomId != "") {
         RongIMLib.Bridge._client.chatroomId = chatroomId;
     }
     else {
         callback.onError(RongIMLib.ErrorCode.CHATROOM_ID_ISNULL);
         return;
     }
     var e = new Modules.ChrmInput();
     e.setNothing(1);
     RongIMClient.bridge.queryMsg(19, RongIMLib.MessageUtil.ArrayForm(e.toArrayBuffer()), chatroomId, {
         onSuccess: function () {
             callback.onSuccess();
             var modules = new Modules.ChrmPullMsg();
             messageCount == 0 && (messageCount = -1);
             modules.setCount(messageCount);
             modules.setSyncTime(0);
             RongIMLib.Bridge._client.queryMessage("chrmPull", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), chatroomId, 1, {
                 onSuccess: function (collection) {
                     var sync = RongIMLib.MessageUtil.int64ToTimestamp(collection.syncTime);
                     RongIMClient._cookieHelper.setItem(RongIMLib.Bridge._client.userId + "CST", sync);
                     var list = collection.list;
                     for (var i = 0, len = list.length; i < len; i++) {
                         RongIMLib.Bridge._client.handler.onReceived(list[i]);
                     }
                 },
                 onError: function (x) {
                     callback.onError(RongIMLib.ErrorCode.CHATROOM_HISMESSAGE_ERROR);
                 }
             }, "DownStreamMessages");
         },
         onError: function () {
             callback.onError(RongIMLib.ErrorCode.CHARTOOM_JOIN_ERROR);
         }
     }, "ChrmOutput");
 };
 /**
  * 退出聊天室。
  * @param  {string}            chatroomId 聊天室Id
  * @param  {OperationCallback} callback   返回值，函数回调
  * @example
  * RongIMClient.getInstance().quitChatRoom("聊天室Id", {
  *  onSuccess: function() {
  *    console.log("quitChatRoom Successfully");
  *  },
  *  onError: function(error) {
  *    console.log("quitChatRoom:errorcode:" + error);
  *  }
  *});
  */
 RongIMClient.prototype.quitChatRoom = function (chatroomId, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "object"], "quitChatRoom");
     var e = new Modules.ChrmInput();
     e.setNothing(1);
     RongIMClient.bridge.queryMsg(17, RongIMLib.MessageUtil.ArrayForm(e.toArrayBuffer()), chatroomId, callback, "ChrmOutput");
 };
 /**
  * 从服务器获取公众账号列表
  * @param  {object} callback   返回值，函数回调
  * @example
  * RongIMClient.getInstance().getRemotePublicServiceList({
  *  onSuccess: function(list) {
  *    console.log(list);
  *  },
  *  onError: function(error) {
  *    console.log("getRemotePublicServiceList:errorcode:" + error);
  *  }
  *});
  */
 RongIMClient.prototype.getRemotePublicServiceList = function (callback) {
     var modules = new Modules.PullMpInput(), self = this;
     if (!pullMessageTime) {
         modules.setTime(0);
     }
     else {
         modules.setTime(RongIMClient._memoryStore.lastReadTime.get(conversationType + RongIMLib.Bridge._client.userId));
     }
     modules.setMpid("");
     RongIMClient.bridge.queryMsg(28, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
         onSuccess: function (data) {
             //TODO 找出最大时间
             // self.lastReadTime.set(conversationType + targetId, MessageUtil.int64ToTimestamp(data.syncTime));
             RongIMClient._memoryStore.publicServiceMap.publicServiceList.length = 0;
             RongIMClient._memoryStore.publicServiceMap.publicServiceList = data;
         },
         onError: function () { }
     }, "PullMpOutput");
 };
 /**
  * 本地获取已经的公共账号列表
  * @param  {ResultCallback<PublicServiceProfile[]>} callback [返回值，参数回调]
  * @example
  * RongIMClient.getInstance().getPublicServiceList({
  * 		onSuccess:function(list){
  *   			console.log(list);
  * 		},
  *   	onError:function(){
  *    			console.log("getPublicServiceList error");
  *   	}
  * });
  */
 RongIMClient.prototype.getPublicServiceList = function (callback) {
     RongIMLib.CheckParam.getInstance().check(["object"], "getPublicServiceList");
     callback.onSuccess(RongIMClient._memoryStore.publicServiceMap.publicServiceList);
 };
 /**
  * 获取某公共服务信息。
  * @param  {PublicServiceType}                    publicServiceType [公众服务类型。]
  * @param  {string}                               publicServiceId   [公共服务 Id。]
  * @param  {ResultCallback<PublicServiceProfile>} callback          [公共账号信息回调。]
  * @example
  * RongIMClient.getInstance().getPublicServiceProfile("conversationType","公众帐号Id",{
  * 		onSuccess:function(profile){
  *   			console.log(profile);
  * 		},
  *   	onError:function(){
  *   			cosnole.log("getPublicServiceProfile error");
  *   	}
  * });
  */
 RongIMClient.prototype.getPublicServiceProfile = function (publicServiceType, publicServiceId, callback) {
     RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "getPublicServiceProfile");
     var profile = RongIMClient._memoryStore.publicServiceMap.get(publicServiceType, publicServiceId);
     callback.onSuccess(profile);
 };
 /**
  * [searchPublicServiceByType ]按公众服务类型搜索公众服务。
  * @param  {PublicServiceType}                      publicServiceType [公众服务类型。]
  * @param  {SearchType}                             searchType        [搜索类型枚举。]
  * @param  {string}                                 keywords          [搜索关键字。]
  * @param  {ResultCallback<PublicServiceProfile[]>} callback          [搜索结果回调。]
  * @example
  * RongIMClient.getInstance().searchPublicServiceByType("conversationType","searchType","keywords",{
  * 		onSuccess:function(list){
  * 				console.log(list);
  * 		},
  *   	onError:function(){
  *   			console.log("searchPublicServiceByType error");
  *   	}
  * });
  */
 RongIMClient.prototype.searchPublicService = function (searchType, keywords, callback) {
     RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "searchPublicService");
     var modules = new Modules.SearchMpInput();
     modules.setType(this.pottingPublicSearchType(0, searchType));
     modules.setId(keywords);
     RongIMClient.bridge.queryMsg(29, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, callback, "SearchMpOutput");
 };
 /**
  * [subscribePublicService ] 订阅公众号。
  * @param  {PublicServiceType} publicServiceType [公众服务类型。]
  * @param  {string}            publicServiceId   [公共服务 Id。]
  * @param  {OperationCallback} callback          [订阅公众号回调。]
  * @example
  * RongIMClient.getInstance().subscribePublicService("conversationType","公众账号Id",{
  * 		onSuccess:function(){
  * 				//关注成功
  * 		},
  *    onError:function(){
  *    		//关注失败
  *    }
  *
  * });
  */
 RongIMClient.prototype.subscribePublicService = function (publicServiceType, publicServiceId, callback) {
     RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "subscribePublicService");
     var modules = new Modules.MPFollowInput(), me = this, follow = publicServiceType == RongIMLib.ConversationType.APP_PUBLIC_SERVICE ? "mcFollow" : "mpFollow";
     modules.setId(publicServiceId);
     RongIMClient.bridge.queryMsg(follow, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
         onSuccess: function () {
             me.getRemotePublicServiceList(null, null, null, {
                 onSuccess: function () { },
                 onError: function () { }
             });
             callback.onSuccess();
         },
         onError: function () {
             callback.onError(RongIMLib.ErrorCode.SUBSCRIBE_ERROR);
         }
     }, "MPFollowOutput");
 };
 /**
  * [unsubscribePublicService ] 取消订阅公众号。
  * @param  {PublicServiceType} publicServiceType [公众服务类型。]
  * @param  {string}            publicServiceId   [公共服务 Id。]
  * @param  {OperationCallback} callback          [取消订阅公众号回调。]
  * @example
  * RongIMClient.getInstance().unsubscribePublicService("conversationType","公众账号Id",{
  * 		onSuccess:function(){
  * 				//取消关注成功
  * 		},
  *    onError:function(){
  *    		//取消关注失败
  *    }
  * });
  */
 RongIMClient.prototype.unsubscribePublicService = function (publicServiceType, publicServiceId, callback) {
     RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "unsubscribePublicService");
     var modules = new Modules.MPFollowInput(), me = this, follow = publicServiceType == RongIMLib.ConversationType.APP_PUBLIC_SERVICE ? "mcUnFollow" : "mpUnFollow";
     modules.setId(publicServiceId);
     RongIMClient.bridge.queryMsg(follow, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
         onSuccess: function () {
             RongIMClient._memoryStore.publicServiceMap.remove(publicServiceType, publicServiceId);
             callback.onSuccess();
         },
         onError: function () {
             callback.onError(RongIMLib.ErrorCode.SUBSCRIBE_ERROR);
         }
     }, "MPFollowOutput");
 };
 /**
  * [加入黑名单]
  * @param  {string}            userId   [将被加入黑名单的用户Id]
  * @param  {OperationCallback} callback [返回值，函数回调]
  * @example
  * RongIMClient.getInstance().addToBlacklist("targetId", {
  *   onSuccess: function() {
  *     console.log("addToBlacklist Successfully");
  *   },
  *   onError: function(error) {
  *     console.log("addToBlacklist:errorcode:" + error);
  *   }
  * });
  */
 RongIMClient.prototype.addToBlacklist = function (userId, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "object"], "addToBlacklist");
     var modules = new Modules.Add2BlackListInput();
     this.getCurrentUserInfo({
         onSuccess: function (info) {
             var uId = info.userId;
             modules.setUserId(userId);
             RongIMClient.bridge.queryMsg(21, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), uId, callback);
         },
         onError: function () {
             callback.onError(RongIMLib.ErrorCode.BLACK_ADD_ERROR);
         }
     });
 };
 /**
  * [获取黑名单列表]
  * @param  {GetBlacklistCallback} callback [返回值，函数回调]
  * @example
  * RongIMClient.getInstance().getBlacklist({
  *  onSuccess: function(data) {
  *     console.log(data);
  *   },
  *   onError: function(error) {
  *     console.log("getBlacklist:errorcode:" + error);
  *   }
  * });
  */
 RongIMClient.prototype.getBlacklist = function (callback) {
     RongIMLib.CheckParam.getInstance().check(["object"], "getBlacklist");
     var modules = new Modules.QueryBlackListInput();
     modules.setNothing(1);
     RongIMClient.bridge.queryMsg(23, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, callback, "QueryBlackListOutput");
 };
 /**
  * [得到指定人员再黑名单中的状态]
  * @param  {string}                          userId   [description]
  * @param  {ResultCallback<BlacklistStatus>} callback [返回值，函数回调]
  * @example
  * RongIMClient.getInstance().getBlacklistStatus({
  *  onSuccess: function(data) {
  *    console.log(data);
  *  },
  *  onError: function(error) {
  *    console.log("getBlacklist:errorcode:" + error);
  *  }
  * });
  */
 RongIMClient.prototype.getBlacklistStatus = function (userId, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "object"], "getBlacklistStatus");
     var modules = new Modules.BlackListStatusInput();
     this.getCurrentUserInfo({
         onSuccess: function (info) {
             var uId = info.userId;
             modules.setUserId(userId);
             RongIMClient.bridge.queryMsg(24, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), uId, {
                 onSuccess: function (status) {
                     callback.onSuccess(RongIMLib.BlacklistStatus[status]);
                 }, onError: function () {
                     callback.onError(RongIMLib.ErrorCode.BLACK_GETSTATUS_ERROR);
                 }
             });
         },
         onError: function () {
             callback.onError(RongIMLib.ErrorCode.BLACK_GETSTATUS_ERROR);
         }
     });
 };
 /**
  * [将指定用户移除黑名单]
  * @param  {string}            userId   [将被移除的用户Id]
  * @param  {OperationCallback} callback [返回值，函数回调]
  * @example
  * RongIMClient.getInstance().removeFromBlacklist("targetId", {
  *   onSuccess: function() {
  *     console.log("removeFromBlacklist Successfully");
  *   },
  *   onError: function(error) {
  *     console.log("removeFromBlacklist:errorcode:" + error);
  *   }
  * });
  */
 RongIMClient.prototype.removeFromBlacklist = function (userId, callback) {
     RongIMLib.CheckParam.getInstance().check(["string", "object"], "removeFromBlacklist");
     var modules = new Modules.RemoveFromBlackListInput();
     this.getCurrentUserInfo({
         onSuccess: function (info) {
             var uId = info.userId;
             modules.setUserId(userId);
             RongIMClient.bridge.queryMsg(22, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), uId, callback);
         },
         onError: function () {
             callback.onError(RongIMLib.ErrorCode.BLACK_REMOVE_ERROR);
         }
     });
 };
  /**
   * TextMessage 文本消息类
   * @constructor
   */
 function TextMessage(message) {
     this.messageName = "TextMessage";
     if (arguments.length == 0) {
         throw new Error("Can not instantiate with empty parameters, use obtain method instead -> TextMessage.");
     }
     /**
      * 消息内容。
      */
     this.content = message.content;
     /**
      * 附加信息。
      */
     this.extra = message.extra;
     /**
      * 用户信息。
      */
     this.userInfo = message.userInfo;
 }
 /**
  * 生成TextMessage对象
  * @param  {string} text 消息内容
  * @return {TextMessage}
  */
 TextMessage.obtain = function (text) {
     return new TextMessage({ extra: "", content: text });
 };
 /**
  * VoiceMessage 声音消息类
  * @constructor
  */
 function VoiceMessage(message) {
    this.messageName = "VoiceMessage";
    if (arguments.length == 0) {
        throw new Error("Can not instantiate with empty parameters, use obtain method instead -> VoiceMessage.");
    }
    /**
     * 声音base64码。
     */
    this.content = message.content;
    /**
     * 播放时长。
     */
    this.duration = message.duration;
    /**
     * 附加信息。
     */
    this.extra = message.extra;
    /**
     * 用户信息。
     */
    this.userInfo = message.userInfo;
}
/**
 * 生成VoiceMessage对象
 * @param  {string} base64Content base64内容
 * @param  {number} duration      持续时长
 * @return {VoiceMessage}
 */
VoiceMessage.obtain = function (base64Content, duration) {
    return new VoiceMessage({ content: base64Content, duration: duration, extra: "" });
};
/**
 * ImageMessage 图片消息类
 * @constructor
 */
function ImageMessage(message) {
   this.messageName = "ImageMessage";
   if (arguments.length == 0) {
       throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ImageMessage.");
   }
   /**
    * 缩略图base64码。
    */
   this.content = message.content;
   /**
    * 服务器图片连接地址。
    */
   this.imageUri = message.imageUri;
   /**
    * 附加信息。
    */
   this.extra = message.extra;
   /**
    * 用户信息。
    */
   this.userInfo = message.userInfo;
}
/**
 *
 * 生成ImageMesage对象
 * @param  {stirng} content  消息内容base64
 * @param  {string} imageUri  uri
 * @return {ImageMessage}
 */
ImageMessage.obtain = function (content, imageUri) {
   return new ImageMessage({ content: content, imageUri: imageUri, extra: "" });
};
/**
 * LocationMessage 位置消息类
 * @constructor
 * @example
 * var lm = new RongIMClient.LocationMessage({"content":"地理位置图片的base64内容",
  "latitude":"24.114",
  "longitude":"334.221",
  "poi":"北京市朝阳区北苑路北辰泰岳大厦",
  extra":""});
 * @param {object} 消息json对象，格式{"imgUri":"地理位置图片的base64内容", "latitude":"24.114", "longitude":"334.221", "poi":"北京市朝阳区北苑路北辰泰岳大厦", extra":""}
 */
function LocationMessage(message) {
   this.messageName = "LocationMessage";
   if (arguments.length == 0) {
       throw new Error("Can not instantiate with empty parameters, use obtain method instead -> LocationMessage.");
   }
   /**
    * 纬度。
    */
   this.latiude = message.latitude;
   /**
    * 纬度。
    */
   this.longitude = message.longitude;
   /**
    * 位置信息描述。
    */
   this.poi = message.poi;
   /**
    * 位置图片。
    */
   this.imgUri = message.imgUri;
   /**
    * 附加信息。
    */
   this.extra = message.extra;
   /**
    * 用户信息。
    */
   this.userInfo = message.userInfo;
}
/**
 * 生成LocationMessage对象
 * @param  {string} imgUri    位置图片
 * @param  {string} latitude  纬度
 * @param  {string} longitude 经度
 * @param  {string} poi       位置信息描述
 * @return {LocationMessage}
 */
LocationMessage.obtain = function (latitude, longitude, poi, imgUri) {
   return new LocationMessage({ latitude: longitude, longitude: longitude, poi: poi, imgUri: imgUri, extra: "" });
};
/**
 * RichContentMessage
 * @constructor
 * @param {object} 消息json对象，格式{"title":"Big News", "content":"I'm Ironman.", "imageUri":"http://p1.cdn.com/fds78ruhi.jpg", extra:""}
 */
function RichContentMessage(message) {
    this.messageName = "RichContentMessage";
    if (arguments.length == 0) {
        throw new Error("Can not instantiate with empty parameters, use obtain method instead -> RichContentMessage.");
    }
    /**
     * 消息标题
     */
    this.title = message.title;
    /**
     * 消息内容。
     */
    this.content = message.content;
    /**
     * 图片资源地址。
     */
    this.imageUri = message.imageUri;
    /**
     * 附加信息
     */
    this.extra = message.extra;
    /**
     * 用户信息。
     */
    this.userInfo = message.userInfo;
}
/**
 * 生成RichContentMessage对象。
 * @param  {string} title    消息标题
 * @param  {string} content  消息内容
 * @param  {string} imageUri 图片资源
 * @return {RichContentMessage}
 */
RichContentMessage.obtain = function (title, content, imageUri) {
    return new RichContentMessage({ title: title, content: content, imageUri: imageUri, extra: "" });
};
/**
 * UnknownMessage。
 * @constructor
 * @param {object} message 消息json对象
 *
 */
function UnknownMessage(message) {
    this.messageName = "UnknownMessage";
    if (arguments.length == 0) {
        throw new Error("Can not instantiate with empty parameters, use obtain method instead -> UnknownMessage.");
    }
    /**
     * 未知消息类型，无法判断其属性，所以直接将对象赋值。
     */
    this.message = message;
}
/**
 * 公众帐号发送消息类
 * @constructor
 */
function PublicServiceCommandMessage(message) {
    this.messageName = "PublicServiceCommandMessage";
    if (arguments.length == 0) {
        throw new Error("Can not instantiate with empty parameters, use obtain method instead -> PublicServiceCommandMessage.");
    }
    /**
     * 消息内容。
     */
    this.content = message.content;
    /**
     * 附加信息。
     */
    this.extra = message.extra;
    /**
     * 公众账号按钮对象。
     */
    this.menuItem = message.menuItem;
    /**
     * 用户信息。
     */
    this.userInfo = message.userInfo;
}
/**
 * 生成PublicServiceCommandMessage对象。
 * @param  {PublicServiceMenuItem} item    消息标题
 * @return {RichContentMessage}
 */
PublicServiceCommandMessage.obtain = function (item) {
    return new PublicServiceCommandMessage({ content: "", command: "", menuItem: item, extra: "" });
};
/**
 * 提示条（小灰条）通知消息。
 * @constructor
 */
function InformationNotificationMessage(message) {
    this.messageName = "InformationNotificationMessage";
    if (arguments.length == 0) {
        throw new Error("Can not instantiate with empty parameters, use obtain method instead -> InformationNotificationMessage.");
    }
    /**
     * 消息内容。
     */
    this.content = message.content;
    /**
     * 附加消息。
     */
    this.extra = message.extra;
    /**
     * 用户信息。
     */
    this.userInfo = message.userInfo;
}
/**
 * 生成InformationNotificationMessage对象
 * @param  {string} content 消息内容
 * @return {InformationNotificationMessage}
 */
InformationNotificationMessage.obtain = function (content) {
    return new InformationNotificationMessage({ content: content, extra: "" });
};
/**
 * 联系人（好友）通知消息。
 * @example
 *var cnm = new RongIMLib.ContactNotificationMessage({"operation":"Request",
 "sourceUserId":"123",
 "targetUserId":"456",
 "message":"我是小艾，能加一下好友吗？",
 "extra":""})
 * @constructor
 */
function ContactNotificationMessage(message) {
   this.messageName = "ContactNotificationMessage";
   if (arguments.length == 0) {
       throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ContactNotificationMessage.");
   }
   /**
   * 操作字符串。
   */
   this.operation = message.operation;
   /**
   * 目标Id。
   */
   this.targetUserId = message.targetUserId;
   /**
   * 消息内容。
   */
   this.content = message.content;
   /**
   * 附加消息。
   */
   this.extra = message.extra;
   /**
   * 用户信息。
   */
  this.userInfo = message.userInfo;
  /**
   *同意好友响应。可传入RongIMClient.ContactNotificationMessage对象的setOperation中
   * @static
   * @type {string}
   */
  ContactNotificationMessage.CONTACT_OPERATION_ACCEPT_RESPONSE = "ContactOperationAcceptResponse";
  /**
   *拒绝好友响应。可传入RongIMClient.ContactNotificationMessage对象的setOperation中
   * @static
   * @type {string}
   */
  ContactNotificationMessage.CONTACT_OPERATION_REJECT_RESPONSE = "ContactOperationRejectResponse";
  /**
   *加好友请求。可传入RongIMClient.ContactNotificationMessage对象的setOperation中
   * @static
   * @type {string}
   */
  ContactNotificationMessage.CONTACT_OPERATION_REQUEST = "ContactOperationRequest";
}
/**
* 生成通知消息对象。
* @param  {string} operation    操作字符串
* @param  {string} sourceUserId 发起人id
* @param  {string} targetUserId 目标id
* @param  {string} message      接受拒绝原因
* @return {ContactNotificationMessage}
*/
ContactNotificationMessage.obtain = function (operation, sourceUserId, targetUserId, content) {
   return new InformationNotificationMessage({ operation: operation, sourceUserId: sourceUserId, targetUserId: targetUserId, content: content });
};
/**
 * 资料通知消息.
 * 其中 operation 为资料通知操作，可以自行定义，data 为操作的数据，extra 可以放置任意的数据内容，也可以去掉此属性。
 * @constructor
 */
function ProfileNotificationMessage(message) {
  this.messageName = "ProfileNotificationMessage";
  if (arguments.length == 0) {
      throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ProfileNotificationMessage.");
  }
  /**
   * 操作。
   */
  this.operation = message.operation;
  /**
   * 内容。
   */
  this.data = message.data;
  /**
   * 附加信息。
   */
  this.extra = message.extra;
  /**
   * 用户信息。
   */
  this.userInfo = message.userInfo;
}
/**
 * 生成InformationNotificationMessage对象
 * @param  {string} operation 操作
 * @param  {string} operation 内容
 * @return {ProfileNotificationMessage}
 */
ProfileNotificationMessage.obtain = function (operation, data) {
  return new ProfileNotificationMessage({ operation: operation, data: data });
};
/**
 * 通用命令通知消息。
 * @constructor
 */
function CommandNotificationMessage(message) {
     this.messageName = "CommandNotificationMessage";
     if (arguments.length == 0) {
         throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ProfileNotificationMessage.");
     }
     /**
      * 命令内容。
      */
     this.data = message.data;
     /**
      * 命令名称。
      */
     this.name = message.name;
     /**
      * 附加信息。
      */
     this.extra = message.extra;
     /**
      * 用户信息。
      */
    this.userInfo = message.userInfo;
 }
 /**
 *生成CommandNotificationMessage对象。
 * @example
 * var cnm = RongIMLib.CommandNotificationMessage.obtain('命令','去吃饭');
 * @param  {string} name   命令名称
 * @param  {string} data 内容
 * @return {CommandNotificationMessage}
 *
 */
 CommandNotificationMessage.obtain = function (name, data) {
     return new CommandNotificationMessage({ name: name, data: data, extra: "" });
 };
 /**
  * 讨论组通知消息类。
  * @constructor
  */
 function DiscussionNotificationMessage(message) {
   this.messageName = "DiscussionNotificationMessage";
   if (arguments.length == 0) {
       throw new Error("Can not instantiate with empty parameters, use obtain method instead -> DiscussionNotificationMessage.");
   }
   /**
    * 扩展信息。
    */
   this.extension = message.extension;
   /**
    * 通知类型。
    * 1:加入讨论组 2：退出讨论组 3:讨论组改名 4：讨论组群主T人
    */
   this.type = message.type;
   /**
    * 是否接收。
    */
   this.isHasReceived = message.isHasReceived;
   /**
    * 操作
    */
   this.operation = message.operation;
   /**
    * 用户信息。
    */
   this.userInfo = message.userInfo;
}
/**
 * 消息内容处理抽象类。
 * @constructor
 */
  function MessageContent(data) {
    throw new Error("This method is abstract, you must implement this method in inherited class.");
  }
  /**
   * 所有消息类会继承并实现此方法，在此不作处理。
   */
  MessageContent.obtain = function() {
    throw new Error("This method is abstract, you must implement this method in inherited class.");
  };
/**
 * 会话的实体，用来容纳和存储客户端的会话信息，对应会话列表中的会话。
 * @constructor
 */
function Conversation(conversationTitle, conversationType, draft, isTop, latestMessage, latestMessageId, notificationStatus, objectName, receivedStatus, receivedTime, senderUserId, senderUserName, sentStatus, sentTime, targetId, unreadMessageCount, senderPortraitUri) {
  /**
   * 会话标题。
   * @type {string}
   */
  this.conversationTitle = conversationTitle;
  /**
   * 会话类型。
   * @type {number}
   */
  this.conversationType = conversationType;
  /**
   * 草稿信息。
   * @type {string}
   */
  this.draft = draft;
  /**
   * 是否置顶。
   * @type {boolean}
   */
  this.isTop = isTop;
  /**
   * 最后一条消息。
   * @type {Message}
   */
  this.latestMessage = latestMessage;
  /**
   * 最后一条消息的Id。
   * @type {string}
   */
  this.latestMessageId = latestMessageId;
  /**
   * 通知状态。
   * @type {string}
   */
  this.notificationStatus = notificationStatus;
  /**
   * 消息对象名称。
   * @type {string}
   */
  this.objectName = objectName;
  /**
   * 消息接受状态。
   * @type {string}
   */
  this.receivedStatus = receivedStatus;
  /**
   * 消息接收时间。
   * @type {number}
   */
  this.receivedTime = receivedTime;
  /**
   * 发送者Id。
   * @type {string}
   */
  this.senderUserId = senderUserId;
  /**
   * 发送者名称。
   * @type {string}
   */
  this.senderUserName = senderUserName;
  /**
   * 消息发送状态。
   * @type {boolean}
   */
  this.sentStatus = sentStatus;
  /**
   * 消息发送时间。
   * @type {number}
   */
  this.sentTime = sentTime;
  /**
   * 目标Id。
   * @type {string}
   */
  this.targetId = targetId;
  /**
   * 未读消息数。
   * @type {number}
   */
  this.unreadMessageCount = unreadMessageCount;
  /**
   * 发送者头像。
   * @type {string}
   */
  this.senderPortraitUri = senderPortraitUri;
}
/**
 * 把当前会话置顶。
 */
Conversation.prototype.setTop = function() {
  RongIMLib.RongIMClient._dataAccessProvider.addConversation(this, { onSuccess: function (data) { } });
};
/**
 *讨论组实体，用来容纳和存储讨论组的信息和设置。
 * @constructor
 */
function Discussion(creatorId,id,memberIdList,name,isOpen) {
  /**
   * 创建人Id。
   * @type {string}
   */
  this.creatorId = creatorId;
  /**
   * 讨论组Id。
   * @type {string}
   */
  this.id = id;
  /**
   * 讨论成员。
   * @type {array}
   */
  this.memberIdList = memberIdList;
  /**
   * 讨论组名称。
   * @type {string}
   */
  this.name = name;
  /**
   * 讨论组邀请状态。
   * @type {boolean}
   */
  this.isOpen = isOpen;
}
/**
 * 群组实体，用来容纳和存储群组的信息。
 * @constructor
 */
function Group(id, name, portraitUri) {
  /**
   * 群组Id
   * @type {string}
   */
  this.id = id;
  /**
   * 群组名称
   * @type {string}
   */
  this.name = name;
  /**
   * 群组头像
   * @type {string}
   */
  this.portraitUri = portraitUri;
}
/**
 * 消息模型。
 *
 * @constructor
 * @param {MessageContent} content         消息内容
 * @param {ConversationType} conversationType 会话类型
 * @param {string} extra           附件消息
 * @param {string} objectName       内置消息名称
 * @param {string} messageDirection 消息方向
 * @param {string} messageId        消息Id
 * @param {ReceivedStatus} receivedStatus   消息接收状态
 * @param {number} receivedTime     消息接收时间
 * @param {string} senderUserId     发送者Id
 * @param {SentStatus} sentStatus    消息发送状态
 * @param {number} sentTime        消息发送时间
 * @param {string} targetId         目标Id
 * @param {string} messageType     消息类型
 */
function Message(content, conversationType, extra, objectName, messageDirection, messageId, receivedStatus, receivedTime, senderUserId, sentStatus, sentTime, targetId, messageType) {
  /**
   *消息内容。
   * @type {MessageContent}
   */
  this.content = content;
  /**
   * 会话类型。
   * @type {ConversationType}
   */
  this.conversationType = conversationType;
  /**
   *附加消息。
   * @type {string}
   */
  this.extra = extra;
  /**
   *内置消息名称。
   * @type {string}
   */
  this.objectName = objectName;
  /**
   * 消息方向。
   * @type {MessageDirection}
   */
  this.messageDirection = messageDirection;
  /**
   * 消息Id。
   * @type {string}
   */
  this.messageId = messageId;
  /**
   * 消息接收状态。
   * @type {ReceivedStatus}
   */
  this.receivedStatus = receivedStatus;
  /**
   * 消息接收时间
   * @type {number}
   */
  this.receivedTime = receivedTime;
  /**
   * 发送者Id
   * @type {string}
   */
  this.senderUserId = senderUserId;
  /**
   * 消息发送状态。
   * @type {SentStatus}
   */
  this.sentStatus = sentStatus;
  /**
   * 消息发送时间。
   * @type {number}
   */
  this.sentTime = sentTime;
  /**
   * 目标Id
   * @type {string}
   */
  this.targetId = targetId;
  /**
   * 消息类型
   * @type {string}
   */
  this.messageType = messageType;
}
/**
 * 公众号Menu类。
 * @constructor
 */
function PublicServiceMenuItem(id,name,type,sunMenuItems, url) {
  /**
   * 按钮Id
   * @type {string}
   */
  this.id = id;
  /**
   * 按钮名称
   * @type {string}
   */
  this.name = name;
  /**
   * 公众帐号类型
   * @type {number}
   */
  this.type = type;
  /**
   * 下级menu数组
   * @type {array}
   */
  this.sunMenuItems = sunMenuItems;
  /**
   * url
   * @type {string}
   */
  this.url = url;
}
/**
 * 公众帐号模型。
 * @constructor
 * @param {ConversationType}  conversationType 公众帐号类型
 * @param {string}  introduction     公众帐号描述
 * @param {PublicServiceMenuItem}  menu             公众帐号菜单
 * @param {string}  name             公众帐号名称
 * @param {string}  portraitUri      公众帐号头像
 * @param {string}  publicServiceId  公众Id
 * @param {Boolean} hasFollowed      是否关注
 * @param {Boolean} isGlobal         是否为默认关注
 */
function PublicServiceProfile(conversationType, introduction, menu, name, portraitUri, publicServiceId, hasFollowed, isGlobal) {
  /**
   * 公众帐号类型。
   * @type {number}
   */
  this.conversationType = conversationType;
  /**
   * 公众帐号描述。
   * @type {string}
   */
  this.introduction = introduction;
  /**
   * 公众帐号菜单。
   * @type {PublicServiceMenuItem}
   */
  this.menu = menu;
  /**
   * 公众帐号名称。
   * @type {string}
   */
  this.name = name;
  /**
   * 公众帐号头像。
   * @type {string}
   */
  this.portraitUri = portraitUri;
  /**
   * 公众Id。
   * @type {string}
   */
  this.publicServiceId = publicServiceId;
  /**
   * 是否关注。
   * @type {string}
   */
  this.hasFollowed = hasFollowed;
  /**
   * 是否默认关注。
   * @type {string}
   */
  this.isGlobal = isGlobal;
}
/**
 *用户信息类。
 * @constructor
 */
function UserInfo(userId,name,portraitUri) {
  /**
   * 用户Id
   * @type {string}
   */
  this.userId = userId;
  /**
   * 用户名称。
   * @type {string}
   */
  this.name = name;
  /**
   * 用户头像。
   * @type {string}
   */
  this.portraitUri = portraitUri;
}
