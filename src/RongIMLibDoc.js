/**@overview 融云 RongCloud Web SDK API 开发文档 2.0.0*/
        /**
         * Represents a RongIMClient.
         * @constructor
         *
         */
        function RongIMClient() {
          /**
           * 储存上次读取消息时间
           */
          this.lastReadTime = new RongIMLib.LimitableMap();
        }
        /**
         * 获取 RongIMClient 实例。
         * 需在执行 init 方法初始化 SDK 后再获取，否则返回 null 值。
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
         */
        RongIMClient.init = function(appKey) {
          if (!RongIMClient._instance) {
            RongIMClient._instance = new RongIMClient();
          }
          RongIMClient._appKey = appKey;
          RongIMClient._storageProvider = RongIMLib.MessageUtil.createStorageFactory();
          var pather = new RongIMLib.FeaturePatcher();
          pather.patchAll();
        };
        /**
         * 连接服务器，在整个应用全局只需要调用一次，断线后 SDK 会自动重连。
         * @param  {string}   token   从服务端获取的用户身份令牌（Token）。
         * @param  {object}  callback 连接回调，返回连接的成功或者失败状态。
         */
        RongIMClient.connect = function(token, callback) {
          RongIMLib.CheckParam.getInstance().check(["string", "object"], "connect", true);
          RongIMClient.bridge = RongIMLib.Bridge.getInstance();
          RongIMClient.bridge.connect(RongIMClient._appKey, token, callback);
          //循环设置监听事件，追加之后清空存放事件数据
          for (var i = 0, len = RongIMClient.listenerList.length; i < len; i++) {
            RongIMClient.bridge["setListener"](RongIMClient.listenerList[i]);
          }
          RongIMClient.listenerList.length = 0;
          return RongIMClient._instance;
        };
        /**
         * @param  {object} callback 连接回调，返回连接的成功或者失败状态。
         */
        RongIMClient.reconnect = function(callback) {
          RongIMClient.bridge.reconnect(callback);
        };
        /**
         * 注册消息类型，用于注册用户自定义的消息。
         * 内建的消息类型已经注册过，不需要再次注册。
         * 自定义消息声明需放在执行顺序最高的位置（在RongIMClient.init(appkey)之后即可）
         * @param  {string} objectName  内置消息名称，例如 TextMessage的内置消息名称为：RC:TxtMsg。
         * @param  {string} messageType 消息类型，需要和消息名称一致
         * @param  {array} fieldNames   消息属性
         */
        RongIMClient.registerMessageType = function(objectName, messageType, fieldNames) {
          if (objectName == "") {
            throw new Error("objectName can't be empty,postion -> registerMessageType");
          }
          registerMessageTypeMapping[objectName] = messageType;
          RongIMClient.MessageType[messageType] = messageType;
          var str = "var temp = " + messageType + " = function(message) {" +
            "this.message = message;" +
            "for (var i = 0,len=fieldName.length; i < len; i++) {" +
            "var item = fieldName[i];" +
            "this['set' + item] = function(na) {" +
            "this.message[item] = na;" +
            "};" +
            "this['get' + item] = function() {" +
            "return this.message[item];" +
            "};" +
            "}" +
            "this.encode=function(){" +
            "var c = new Modules.UpStreamMessage();" +
            "c.setSessionId(3);" +
            "c.setClassname(objectName);" +
            "c.setContent(JSON.stringify(this.message));" +
            "var val = c.toArrayBuffer();" +
            "if (Object.prototype.toString.call(val) == '[object ArrayBuffer]') {" +
            "return [].slice.call(new Int8Array(val));" +
            "}" +
            "return val;" +
            "}" +
            "};";
          eval(str);
        };
        /**
         *
         * 设置连接状态变化的监听器。
         * @param  {object} listener 连接状态变化的监听器。
         */
        RongIMClient.setConnectionStatusListener = function(listener) {
          if (RongIMClient.bridge) {
            RongIMClient.bridge.setListener(listener);
          } else {
            RongIMClient.listenerList.push(listener);
          }
        };
        /**
         * 设置接收消息的监听器。
         *
         * @param {object} listener  接收消息的监听器。
         */
        RongIMClient.setOnReceiveMessageListener = function(listener) {
          if (RongIMClient.bridge) {
            RongIMClient.bridge.setListener(listener);
          } else {
            RongIMClient.listenerList.push(listener);
          }
        };
        /**
         * 断开连接。
         */
        RongIMClient.prototype.disconnect = function() {
          RongIMClient.bridge.disconnect();
        };
        /**
         * 获取当前连接的状态。
         */
        RongIMClient.prototype.getCurrentConnectionStatus = function() {
          return RongIMLib.Bridge._client.channel.connectionStatus;
        };
        /**
         * 获取当前使用的连接通道。
         */
        RongIMClient.prototype.getConnectionChannel = function() {
          if (RongIMLib.Transports._TransportType == RongIMLib.Socket.XHR_POLLING) {
            RongIMClient._connectionChannel = RongIMLib.ConnectionChannel.XHR_POLLING;
          } else if (RongIMLib.Transports._TransportType == RongIMLib.Socket.WEBSOCKET) {
            RongIMClient._connectionChannel = RongIMLib.ConnectionChannel.WEBSOCKET;
          }
          return RongIMClient._connectionChannel;
        };
        /**
         * 获取当前使用的本地储存提供者。
         */
        RongIMClient.prototype.getStorageProvider = function() {
          return RongIMClient._storageProvider;
        };
        /**
         * 获取当前连接用户的 UserId。
         */
        RongIMClient.prototype.getCurrentUserId = function() {
          return RongIMLib.Bridge._client.userId;
        };
        /**
         * getCurrentUserInfo 获取当前用户信息
         * @param  {ResultCallback<UserInfo>} callback [回调函数]
         */
        RongIMClient.prototype.getCurrentUserInfo = function(callback) {
          RongIMLib.CheckParam.getInstance().check(["object"], "getCurrentUserInfo");
          this.getUserInfo(RongIMLib.Bridge._client.userId, callback);
        };
        /**
         * 获得用户信息
         * @param  {string}                   userId [用户Id]
         * @param  {ResultCallback<UserInfo>} callback [回调函数]
         */
        RongIMClient.prototype.getUserInfo = function(userId, callback) {
          RongIMLib.CheckParam.getInstance().check(["string", "object"], "getUserInfo");
          var user = new Modules.GetUserInfoInput();
          user.setNothing(1);
          RongIMClient.bridge.queryMsg(5, RongIMLib.MessageUtil.ArrayForm(user.toArrayBuffer()), userId, {
            onSuccess: function(info) {
              var userInfo = new RongIMLib.UserInfo();
              userInfo.setUserId(info.userId);
              userInfo.setUserName(info.name);
              userInfo.setPortraitUri(info.portraitUri);
              callback.onSuccess(userInfo);
            },
            onError: function(err) {
              callback.onError(err);
            }
          }, "GetUserInfoOutput");
        };
        /**
         * 提交用户数据到服务器，以便后台业务（如：客服系统）使用。
         *
         * @param {array} userData  用户数据信息。
         * @param {object} callback  操作成功或者失败的回调。
         */
        RongIMClient.prototype.syncUserData = function(userData, callback) {
          throw new Error("Not implemented yet");
        };
        /**
         * 获取本地时间与服务器时间的差值，单位为毫秒。
         *
         * @param {object} callback  获取的回调，返回时间差值。
         */
        RongIMClient.prototype.getDeltaTime = function(callback) {
          throw new Error("Not implemented yet");
        };
        /**TODO
         * 暂未实现。
         */
        RongIMClient.prototype.clearMessages = function(conversationType, targetId, callback) {
          RongIMClient._dataAccessProvider.clearMessages(conversationType, targetId);
        };
        /**
         * clearMessagesUnreadStatus 清空指定会话未读消息。
         * @param  {ConversationType}        conversationType 会话类型
         * @param  {string}                  targetId         用户id
         * @param  {ResultCallback<boolean>} callback         返回值，参数回调
         */
        RongIMClient.prototype.clearMessagesUnreadStatus = function(conversationType, targetId, callback) {
          try {
            RongIMClient.conversationMap.conversationList.forEach(function(conver) {
              if (conver.conversationType == conversationType && conver.targetId == targetId) {
                conver.unreadMessageCount = 0;
              }
            });
          } catch (e) {
            callback.onError(RongIMLib.ErrorCode.CONVER_ID_TYPE_UNREAD_ERROR);
          }
          callback.onSuccess(true);
        };
        /**
         * sendMessage 发送消息。
         * @param  {ConversationType}        conversationType 会话类型
         * @param  {string}                  targetId         目标Id
         * @param  {MessageContent}          messageContent   消息类型
         * @param  {SendMessageCallback}     sendCallback
         * @param  {ResultCallback<Message>} resultCallback   返回值，函数回调
         */
        RongIMClient.prototype.sendMessage = function(conversationType, targetId, messageContent, sendCallback, resultCallback, pushContent, pushData) {
          RongIMLib.CheckParam.getInstance().check(["number", "string", "object", "null|object|global", "object"], "sendMessage");
          if (!RongIMLib.Bridge._client.channel.socket.socket.connected) {
            resultCallback.onError(RongIMLib.ErrorCode.TIMEOUT);
            throw new Error("connect is timeout! postion:sendMessage");
          }
          var content = messageContent.encode(),
            message;
          var me = this;
          this.getConversation(conversationType, targetId, {
            onSuccess: function(c) {
              if (!c) {
                c = me.createConversation(conversationType, targetId, "", true);
              }
              c.sentTime = new Date().getTime();
              c.sentStatus = RongIMLib.SentStatus.SENDING;
              c.senderUserName = "";
              c.senderUserId = RongIMLib.Bridge._client.userId;
              c.notificationStatus = RongIMLib.ConversationNotificationStatus.DO_NOT_DISTURB;
              c.latestMessage = messageContent;
              c.unreadMessageCount = 0;
              c.setTop();
            },
            onError: function() {
              console.log("getConversation-Error->postion:sendMessage");
            }
          });
          RongIMClient.bridge.pubMsg(conversationType.valueOf(), content, targetId, resultCallback, null);
        };
        /**
         * sendTextMessage 发送TextMessage快捷方式。
         * @param  {string}                  content        消息内容
         * @param  {ResultCallback<Message>} resultCallback 返回值，函数回调
         */
        RongIMClient.prototype.sendTextMessage = function(conversationType, targetId, content, resultCallback) {
          var msgContent = RongIMLib.TextMessage.obtain(content);
          this.sendMessage(conversationType, targetId, msgContent, null, resultCallback);
        };
        /**
         * insertMessage 向本地插入一条消息，不发送到服务器(暂未实现)。
         * @param  {ConversationType}        conversationType  会话类型
         * @param  {string}                  targetId          目标Id
         * @param  {string}                  senderUserId      发送者Id
         * @param  {MessageContent}          content          消息内容
         * @param  {ResultCallback<Message>} callback         返回值，函数回调
         */
        RongIMClient.prototype.insertMessage = function(conversationType, targetId, senderUserId, content, callback) {
          throw new Error("Not implemented yet");
        };
        RongIMClient.prototype.resetGetHistoryMessages = function(conversationType, targetId) {
          RongIMLib.CheckParam.getInstance().check(["number", "string"], "resetGetHistoryMessages");
          this.lastReadTime.remove(conversationType + targetId);
          return true;
        };
        /**
         * [getHistoryMessages 拉取历史消息记录。]
         * @param  {ConversationType}          conversationType [会话类型]
         * @param  {string}                    targetId         [用户Id]
         * @param  {number|null}               pullMessageTime  [拉取历史消息起始位置(格式为毫秒数)，可以为null]
         * @param  {number}                    count            [历史消息数量]
         * @param  {ResultCallback<Message[]>} callback         [回调函数]
         * @param  {string}                    objectName       [objectName]
         */
        RongIMClient.prototype.getHistoryMessages = function(conversationType, targetId, pullMessageTime, count, callback, objectName) {
          RongIMLib.CheckParam.getInstance().check(["number", "string", "number|null", "number", "object"], "getHistoryMessages");
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
          var modules = new Modules.HistoryMessageInput(),
            self = this;
          modules.setTargetId(targetId);
          if (!pullMessageTime) {
            modules.setDataTime(this.lastReadTime.get(conversationType + targetId));
          } else {
            modules.setDataTime(pullMessageTime);
          }
          modules.setSize(count);
          RongIMClient.bridge.queryMsg(HistoryMsgType[conversationType], RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), targetId, {
            onSuccess: function(data) {
              var list = data.list.reverse();
              self.lastReadTime.set(conversationType + targetId, RongIMLib.MessageUtil.int64ToTimestamp(data.syncTime));
              for (var i = 0, len = list.length; i < len; i++) {
                list[i] = RongIMLib.MessageUtil.messageParser(list[i]);
              }
              callback.onSuccess(list, !!data.hasMsg);
            },
            onError: function() {
              callback.onError(RongIMLib.ErrorCode.UNKNOWN);
            }
          }, "HistoryMessagesOuput");
        };
        /**
         * hasUnreadMessages 是否有未接收的消息，jsonp方法。
         * @param  {string}          appkey   appkey
         * @param  {string}          token   token
         * @param  {ConnectCallback} callback 返回值，参数回调
         */
        RongIMClient.prototype.hasUnreadMessages = function(appkey, token, callback) {
          var xss = null;
          window.RCcallback = function(x) {
            callback.onSuccess(!!+x.status);
            xss.parentNode.removeChild(xss);
          };
          xss = document.createElement("script");
          xss.src = "http://api.cn.rong.io/message/exist.js?appKey=" + encodeURIComponent(appkey) + "&token=" + encodeURIComponent(token) + "&callBack=RCcallback&_=" + Date.now();
          document.body.appendChild(xss);
          xss.onerror = function() {
            callback.onError(RongIMLib.ErrorCode.UNKNOWN);
            xss.parentNode.removeChild(xss);
          };
        };
        /**
         * 获取所有会话未读消息数的总和。
         * @param  {ResultCallback} callback 返回值，参数回调
         */
        RongIMClient.prototype.getTotalUnreadCount = function(callback) {
          var count = 0;
          try {
            RongIMClient.conversationMap.conversationList.forEach(function(conver) {
              count += conver.unreadMessageCount;
            });
          } catch (e) {
            callback.onError(RongIMLib.ErrorCode.CONVER_TOTAL_UNREAD_ERROR);
          }
          callback.onSuccess(count);
        };
        /**
         * getConversationUnreadCount 指定多种会话类型获取未读消息数。
         * @param  {ResultCallback<number>} callback             返回值，参数回调。
         * @param  {ConversationType[]}     ...conversationTypes 会话类型。
         */
        RongIMClient.prototype.getConversationUnreadCount = function(conversationTypes, callback) {
          var count = 0,
            me = this;
          try {
            conversationTypes.forEach(function(converType) {
              RongIMClient.conversationMap.conversationList.forEach(function(conver) {
                if (conver.conversationType == converType) {
                  count += conver.unreadMessageCount;
                }
              });
            });
          } catch (e) {
            callback.onError(RongIMLib.ErrorCode.CONVER_TYPE_UNREAD_ERROR);
          }
          callback.onSuccess(count);
        };
        /**
         * getUnreadCount 指定用户、会话类型的未读消息总数。
         * @param  {ConversationType} conversationType 会话类型
         * @param  {string}           targetId         用户Id
         */
        RongIMClient.prototype.getUnreadCount = function(conversationType, targetId) {
          var conver = RongIMClient.conversationMap.get(conversationType, targetId);
          return conver ? conver.unreadMessageCount : 0;
        };
        /**
         * TODO 暂未实现
         */
        RongIMClient.prototype.setMessageExtra = function(messageId, value, callback) {
          throw new Error("Not implemented yet");
        };
        /**
         * TODO 暂未实现
         */
        RongIMClient.prototype.setMessageReceivedStatus = function(messageId, receivedStatus, callback) {
          throw new Error("Not implemented yet");
        };
        /**
         * TODO 暂未实现
         */
        RongIMClient.prototype.setMessageSentStatus = function(messageId, sentStatus, callback) {
          throw new Error("Not implemented yet");
        };
        /**
         * clearTextMessageDraft 清除指定会话和消息类型的草稿。
         * @param  {ConversationType}        conversationType 会话类型
         * @param  {string}                  targetId         目标Id
         * @param  {ResultCallback<boolean>} callback         返回值，参数回调
         */
        RongIMClient.prototype.clearTextMessageDraft = function(conversationType, targetId, callback) {
          RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "clearTextMessageDraft");
          try {
            RongIMClient._storageProvider.removeItem(conversationType + "_" + targetId);
          } catch (e) {
            callback.onError(RongIMLib.ErrorCode.DRAF_REMOVE_ERROR);
          }
          callback.onSuccess(true);
        };
        /**
         * getTextMessageDraft 获取指定消息和会话的草稿。
         * @param  {ConversationType}       conversationType [会话类型]
         * @param  {string}                 targetId         [目标Id]
         * @param  {ResultCallback<string>} callback         [返回值，参数回调]
         */
        RongIMClient.prototype.getTextMessageDraft = function(conversationType, targetId, callback) {
          RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "getTextMessageDraft");
          if (targetId == "" || conversationType < 0) {
            callback.onError(RongIMLib.ErrorCode.DRAF_GET_ERROR);
            return;
          }
          callback.onSuccess(RongIMClient._storageProvider.getItem(conversationType + "_" + targetId));
        };
        /**
         * 保存草稿信息。
         * @param  {ConversationType}        conversationType 会话类型
         * @param  {string}                  targetId         目标Id
         * @param  {string}                  value            草稿值
         * @param  {ResultCallback<boolean>} callback         返回值，参数回调
         */
        RongIMClient.prototype.saveTextMessageDraft = function(conversationType, targetId, value, callback) {
          RongIMLib.CheckParam.getInstance().check(["number", "string", "string", "object"], "saveTextMessageDraft");
          try {
            RongIMClient._storageProvider.setItem(conversationType + "_" + targetId, value);
          } catch (e) {
            callback.onError(RongIMLib.ErrorCode.DRAF_SAVE_ERROR);
          }
          callback.onSuccess(true);
        };
        /**
         * 从内存中清除会话列表
         */
        RongIMClient.prototype.clearConversations = function(callback) {
          var conversationTypes = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            conversationTypes[_i - 1] = arguments[_i];
          }
          var arrs = [],
            me = this;
          if (conversationTypes.length == 0) {
            conversationTypes = [RongIMLib.ConversationType.CHATROOM,
              RongIMLib.ConversationType.CUSTOMER_SERVICE,
              RongIMLib.ConversationType.DISCUSSION,
              RongIMLib.ConversationType.GROUP,
              RongIMLib.ConversationType.PRIVATE,
              RongIMLib.ConversationType.SYSTEM,
              RongIMLib.ConversationType.PUBLIC_SERVICE,
              RongIMLib.ConversationType.APP_PUBLIC_SERVICE
            ];
          }
          Array.forEach(conversationTypes, function(conversationType) {
            Array.forEach(RongIMClient.conversationMap.conversationList, function(conver) {
              if (conversationType == conver.conversationType) {
                arrs.push(conver);
              }
            });
          });
          try {
            arrs.forEach(function(conver) {
              me.removeConversation(conver.conversationType, conver.targetId, {
                onSuccess: function() {},
                onError: function() {}
              });
            });
          } catch (e) {
            callback.onError(RongIMLib.ErrorCode.CONVER_REMOVE_ERROR);
          }
          callback.onSuccess(true);
        };
        /**
         * getConversation 获取指定会话，此方法需在getConversationList之后执行。
         * @param  {ConversationType}             conversationType 会话类型
         * @param  {string}                       targetId        目标Id
         * @param  {ResultCallback<Conversation>} callback         返回值，函数回调
         */
        RongIMClient.prototype.getConversation = function(conversationType, targetId, callback) {
          RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "getConversation");
          var conver = RongIMClient.conversationMap.get(conversationType, targetId);
          var hasConver = conver ? true : false;
          callback.onSuccess(conver, hasConver);
        };
        RongIMClient.prototype.pottingConversation = function(tempConver) {
          var conver = RongIMClient.conversationMap.get(S2C[tempConver.type], tempConver.userId),
            self = this,
            isUseReplace = false;
          if (!conver) {
            conver = new RongIMLib.Conversation();
          } else {
            isUseReplace = true;
          }
          conver.conversationType = S2C[tempConver.type];
          conver.targetId = tempConver.userId;
          conver.latestMessage = RongIMLib.MessageUtil.messageParser(tempConver.msg);
          conver.latestMessageId = conver.latestMessage.messageId;
          conver.objectName = conver.latestMessage.objectName;
          conver.receivedStatus = conver.latestMessage.receivedStatus;
          conver.receivedTime = conver.latestMessage.receiveTime;
          conver.sentStatus = conver.latestMessage.sentStatus;
          conver.sentTime = conver.latestMessage.sentTime;
          !isUseReplace ? conver.unreadMessageCount = 0 : null;
          if (conver.conversationType == RongIMLib.ConversationType.PRIVATE) {
            self.getUserInfo(tempConver.userId, {
              onSuccess: function(info) {
                conver.conversationTitle = info.getUserName();
                conver.senderUserName = info.getUserName();
                conver.senderUserId = info.getUserId();
                conver.senderPortraitUri = info.getPortaitUri();
              },
              onError: function(error) {
                console.log("getUserInfo error:" + error + ",postion->getConversationList.getUserInfo");
              }
            });
          } else if (conver.conversationType == RongIMLib.ConversationType.DISCUSSION) {
            self.getDiscussion(tempConver.userId, {
              onSuccess: function(info) {
                conver.conversationTitle = info.getName();
              },
              onError: function(error) {
                console.log("getDiscussion error:" + error + ",postion->getConversationList.getDiscussion");
              }
            });
          }
          if (isUseReplace) {
            RongIMClient.conversationMap.replace(conver);
          } else {
            RongIMClient.conversationMap.add(conver);
          }
        };
        /**
         * 拉取会话列表。
         * @param  {ResultCallback} callback 返回值，参数回调
         */
        RongIMClient.prototype.getConversationList = function(callback) {
          var conversationTypes = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            conversationTypes[_i - 1] = arguments[_i];
          }
          RongIMLib.CheckParam.getInstance().check(["object"], "getConversationList");
          var modules = new Modules.RelationsInput(),
            self = this;
          modules.setType(1);
          RongIMClient.bridge.queryMsg(26, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
            onSuccess: function(list) {
              if (list.info) {
                for (var i = 0, len = list.info.length; i < len; i++) {
                  setTimeout(self.pottingConversation(list.info[i]), 200);
                }
              }
              callback.onSuccess(RongIMClient.conversationMap.conversationList);
            },
            onError: function() {
              callback.onError(RongIMLib.ErrorCode.CONVER_GETLIST_ERROR);
            }
          }, "RelationsOutput");
        };
        /**
         * 删除会话列表，本地和融云服务器都会删除。
         * @param  {ConversationType}   conversationType 会话类型
         * @param  {string}   targetId        目标Id
         * @param  {ResultCallback} callback        返回值，函数回调
         */
        RongIMClient.prototype.removeConversation = function(conversationType, targetId, callback) {
          RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "removeConversation");
          var d = null;
          for (var i = 0, len = RongIMClient.conversationMap.conversationList.length; i < len; i++) {
            var f = RongIMClient.conversationMap.conversationList[i];
            if (f.targetId == targetId && f.conversationType == conversationType) {
              d = f;
            }
          }
          if (!d) {
            return;
          }
          var mod = new Modules.RelationsInput();
          mod.setType(C2S[conversationType]);
          RongIMClient.bridge.queryMsg(27, RongIMLib.MessageUtil.ArrayForm(mod.toArrayBuffer()), targetId, {
            onSuccess: function() {
              //TODO 删除本地存储
              RongIMClient.conversationMap.remove(d);
              callback.onSuccess(true);
            },
            onError: function() {
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
        RongIMClient.prototype.setConversationToTop = function(conversationType, targetId, callback) {
          try {
            RongIMClient.conversationMap.add(RongIMClient.conversationMap.get(conversationType, targetId));
          } catch (e) {
            callback.onError(RongIMLib.ErrorCode.CONVER_SETOP_ERROR);
          }
          callback.onSuccess(true);
        };
        /**
         *
         * TODO 暂未实现。
         * 获取指定用户和会话类型免提醒。
         * @param  {ConversationType}                               conversationType [会话类型]
         * @param  {string}                                         targetId         [目标Id]
         * @param  {ResultCallback<ConversationNotificationStatus>} callback         [返回值，函数回调]
         */
        RongIMClient.prototype.getConversationNotificationStatus = function(conversationType, targetId, callback) {
          throw new Error("Not implemented yet");
        };
        /**
         *
         * TODO 暂未实现。
         * 设置指定用户和会话类型免提醒。
         * @param  {ConversationType}                               conversationType 会话类型
         * @param  {string}                                         targetId         目标Id
         * @param  {ResultCallback<ConversationNotificationStatus>} callback         返回值，函数回调
         */
        RongIMClient.prototype.setConversationNotificationStatus = function(conversationType, targetId, notificationStatus, callback) {
          throw new Error("Not implemented yet");
        };
        /**
         *
         * TODO 暂未实现。
         * 获取免提醒消息时间。
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
        RongIMClient.prototype.getNotificationQuietHours = function(callback) {
          throw new Error("Not implemented yet");
        };
        /**
         *
         * TODO 暂未实现。
         * 移除免提醒消息时间。
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
        RongIMClient.prototype.removeNotificationQuietHours = function(callback) {
          throw new Error("Not implemented yet");
        };
        /**
         *
         *  TODO 暂未实现。
         * 设置免提醒消息时间。
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
        RongIMClient.prototype.setNotificationQuietHours = function(startTime, spanMinutes, callback) {
          throw new Error("Not implemented yet");
        };
        /**
         * 加入讨论组。
         * @param  {string}            discussionId 讨论组Id
         * @param  {string[]}          userIdList   讨论中成员
         * @param  {OperationCallback} callback     返回值，函数回调
         */
        RongIMClient.prototype.addMemberToDiscussion = function(discussionId, userIdList, callback) {
          RongIMLib.CheckParam.getInstance().check(["string", "array", "object"], "addMemberToDiscussion");
          var modules = new Modules.ChannelInvitationInput();
          modules.setUsers(userIdList);
          RongIMClient.bridge.queryMsg(0, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, {
            onSuccess: function() {
              callback.onSuccess();
            },
            onError: function() {
              callback.onError(RongIMLib.ErrorCode.JOIN_IN_DISCUSSION);
            }
          });
        };
        /**
         * 创建讨论组。
         * @param  {string}                   name       [讨论组名称]
         * @param  {string[]}                 userIdList [讨论组成员]
         * @param  {CreateDiscussionCallback} callback   [返回值，函数回调]
         */
        RongIMClient.prototype.createDiscussion = function(name, userIdList, callback) {
          RongIMLib.CheckParam.getInstance().check(["string", "array", "object"], "createDiscussion");
          var modules = new Modules.CreateDiscussionInput(),
            self = this;
          modules.setName(name);
          RongIMClient.bridge.queryMsg(1, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
            onSuccess: function(discussId) {
              if (userIdList.length > 0) {
                self.addMemberToDiscussion(discussId, userIdList, {
                  onSuccess: function() {},
                  onError: function(error) {
                    callback.onError(error);
                  }
                });
              }
              callback.onSuccess(discussId);
            },
            onError: function() {
              callback.onError(RongIMLib.ErrorCode.CREATE_DISCUSSION);
            }
          }, "CreateDiscussionOutput");
        };
        /**
         * 获取讨论组信息。
         * @param  {string}                     discussionId 讨论组Id
         * @param  {ResultCallback<Discussion>} callback     返回值，函数回调
         */
        RongIMClient.prototype.getDiscussion = function(discussionId, callback) {
          RongIMLib.CheckParam.getInstance().check(["string", "object"], "getDiscussion");
          var modules = new Modules.ChannelInfoInput();
          modules.setNothing(1);
          RongIMClient.bridge.queryMsg(4, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback, "ChannelInfoOutput");
        };
        /**
         * 退出讨论组。
         * @param  {string}            discussionId 讨论组Id
         * @param  {OperationCallback} callback     返回值，函数回调
         */
        RongIMClient.prototype.quitDiscussion = function(discussionId, callback) {
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
         */
        RongIMClient.prototype.removeMemberFromDiscussion = function(discussionId, userId, callback) {
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
         */
        RongIMClient.prototype.setDiscussionInviteStatus = function(discussionId, status, callback) {
          RongIMLib.CheckParam.getInstance().check(["string", "number", "object"], "setDiscussionInviteStatus");
          var modules = new Modules.ModifyPermissionInput();
          modules.setOpenStatus(status.valueOf());
          RongIMClient.bridge.queryMsg(11, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, {
            onSuccess: function(x) {
              callback.onSuccess();
            },
            onError: function() {
              callback.onError(RongIMLib.ErrorCode.INVITE_DICUSSION);
            }
          });
        };
        /**
         * 设置讨论组名称。
         * @param  {string}            discussionId 讨论组Id
         * @param  {string}            name         讨论组名称
         * @param  {OperationCallback} callback     返回值，函数回调
         */
        RongIMClient.prototype.setDiscussionName = function(discussionId, name, callback) {
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
         */
        RongIMClient.prototype.joinGroup = function(groupId, groupName, callback) {
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
         */
        RongIMClient.prototype.quitGroup = function(groupId, callback) {
          RongIMLib.CheckParam.getInstance().check(["string", "object"], "quitGroup");
          var modules = new Modules.LeaveChannelInput();
          modules.setNothing(1);
          RongIMClient.bridge.queryMsg(8, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), groupId, callback);
        };
        /**
         * 同步群组信息。
         * @param  {Array<Group>}      groups   群组列表
         * @param  {OperationCallback} callback 返回值，函数回调
         */
        RongIMClient.prototype.syncGroup = function(groups, callback) {
          RongIMLib.CheckParam.getInstance().check(["array", "object"], "syncGroup");
          for (var i = 0, part = [], info = [], len = groups.length; i < len; i++) {
            if (part.length === 0 || !(groups[i].id in part)) {
              part.push(groups[i].id);
              var groupinfo = new Modules.GroupInfo();
              groupinfo.setId(groups[i].id);
              groupinfo.setName(groups[i].name);
              info.push(groupinfo);
            }
          }
          var modules = new Modules.GroupHashInput();
          modules.setUserId(RongIMLib.Bridge._client.userId);
          modules.setGroupHashCode(MD5(part.sort().join("")));
          RongIMClient.bridge.queryMsg(13, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
            onSuccess: function(result) {
              //1为群信息不匹配需要发送给服务器进行同步，0不需要同步
              if (result === 1) {
                var val = new Modules.GroupInput();
                val.setGroupInfo(info);
                RongIMClient.bridge.queryMsg(20, RongIMLib.MessageUtil.ArrayForm(val.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
                  onSuccess: function() {
                    callback.onSuccess();
                  },
                  onError: function() {
                    callback.onError(RongIMLib.ErrorCode.GROUP_MATCH_ERROR);
                  }
                }, "GroupOutput");
              } else {
                callback.onSuccess();
              }
            },
            onError: function() {
              callback.onError(RongIMLib.ErrorCode.GROUP_SYNC_ERROR);
            }
          }, "GroupHashOutput");
        };
        /**
         * 加入聊天室。
         * @param  {string}            chatroomId   聊天室Id
         * @param  {number}            messageCount 拉取消息数量，-1为不拉去消息
         * @param  {OperationCallback} callback     返回值，函数回调
         */
        RongIMClient.prototype.joinChatRoom = function(chatroomId, messageCount, callback) {
          RongIMLib.CheckParam.getInstance().check(["string", "number", "object"], "joinChatRoom");
          if (chatroomId != "") {
            RongIMLib.Bridge._client.chatroomId = chatroomId;
          } else {
            callback.onError(RongIMLib.ErrorCode.CHATROOM_ID_ISNULL);
            return;
          }
          var e = new Modules.ChrmInput();
          e.setNothing(1);
          RongIMClient.bridge.queryMsg(19, RongIMLib.MessageUtil.ArrayForm(e.toArrayBuffer()), chatroomId, {
            onSuccess: function() {
              callback.onSuccess();
              var modules = new Modules.ChrmPullMsg();
              messageCount == 0 && (messageCount = -1);
              modules.setCount(messageCount);
              modules.setSyncTime(0);
              RongIMLib.Bridge._client.queryMessage("chrmPull", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), chatroomId, 1, {
                onSuccess: function(collection) {
                  var sync = RongIMLib.MessageUtil.int64ToTimestamp(collection.syncTime);
                  RongIMClient._storageProvider.setItem(RongIMLib.Bridge._client.userId + "CST", sync);
                  var list = collection.list;
                  for (var i = 0, len = list.length; i < len; i++) {
                    RongIMLib.Bridge._client.handler.onReceived(list[i]);
                  }
                },
                onError: function(x) {
                  callback.onError(RongIMLib.ErrorCode.CHATROOM_HISMESSAGE_ERROR);
                }
              }, "DownStreamMessages");
            },
            onError: function() {
              callback.onError(RongIMLib.ErrorCode.CHARTOOM_JOIN_ERROR);
            }
          }, "ChrmOutput");
        };
        /**
         * 退出聊天室。
         * @param  {string}            chatroomId 聊天室Id
         * @param  {OperationCallback} callback   返回值，函数回调
         */
        RongIMClient.prototype.quitChatRoom = function(chatroomId, callback) {
          RongIMLib.CheckParam.getInstance().check(["string", "object"], "quitChatRoom");
          var e = new Modules.ChrmInput();
          e.setNothing(1);
          RongIMClient.bridge.queryMsg(17, RongIMLib.MessageUtil.ArrayForm(e.toArrayBuffer()), chatroomId, callback, "ChrmOutput");
        };
        RongIMClient.prototype.syncPublicServiceList = function(mpId, conversationType, pullMessageTime, callback) {
          var modules = new Modules.PullMpInput(),
            self = this;
          if (!pullMessageTime) {
            modules.setTime(0);
          } else {
            modules.setTime(this.lastReadTime.get(conversationType + RongIMLib.Bridge._client.userId));
          }
          modules.setMpid("");
          RongIMClient.bridge.queryMsg(28, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
            onSuccess: function(data) {
              //TODO 找出最大时间
              // self.lastReadTime.set(conversationType + targetId, MessageUtil.int64ToTimestamp(data.syncTime));
              RongIMClient.publicServiceMap.publicServiceList.length = 0;
              RongIMClient.publicServiceMap.publicServiceList = data;
            },
            onError: function() {}
          }, "PullMpOutput");
        };
        /**
         * [getPublicServiceList ]获取已经的公共账号列表
         * @param  {ResultCallback<PublicServiceProfile[]>} callback [返回值，参数回调]
         */
        RongIMClient.prototype.getPublicServiceList = function(callback) {
          RongIMLib.CheckParam.getInstance().check(["object"], "getPublicServiceList");
          callback.onSuccess(RongIMClient.publicServiceMap.publicServiceList);
        };
        /**
         * [getPublicServiceProfile ]   获取某公共服务信息。
         * @param  {PublicServiceType}                    publicServiceType [公众服务类型。]
         * @param  {string}                               publicServiceId   [公共服务 Id。]
         * @param  {ResultCallback<PublicServiceProfile>} callback          [公共账号信息回调。]
         */
        RongIMClient.prototype.getPublicServiceProfile = function(publicServiceType, publicServiceId, callback) {
          RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "getPublicServiceProfile");
          var profile = RongIMClient.publicServiceMap.get(publicServiceType, publicServiceId);
          callback.onSuccess(profile);
        };
        /**
         * [pottingPublicSearchType ] 公众好查询类型
         * @param  {number} bussinessType [ 0-all 1-mp 2-mc]
         * @param  {number} searchType    [0-exact 1-fuzzy]
         */
        RongIMClient.prototype.pottingPublicSearchType = function(bussinessType, searchType) {
          var bits = 0;
          if (bussinessType == 0) {
            bits |= 3;
            if (searchType == 0)
              bits |= 12;
            else
              bits |= 48;
          } else if (bussinessType == 1) {
            bits |= 1;
            if (searchType == 0)
              bits |= 8;
            else
              bits |= 32;
          } else {
            bits |= 2;
            if (bussinessType == 0)
              bits |= 4;
            else
              bits |= 16;
          }
          return bits;
        };
        /**
         * [searchPublicService ]按公众服务类型搜索公众服务。
         * @param  {SearchType}                             searchType [搜索类型枚举。]
         * @param  {string}                                 keywords   [搜索关键字。]
         * @param  {ResultCallback<PublicServiceProfile[]>} callback   [搜索结果回调。]
         */
        RongIMClient.prototype.searchPublicService = function(searchType, keywords, callback) {
          RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "searchPublicService");
          var modules = new Modules.SearchMpInput();
          modules.setType(this.pottingPublicSearchType(0, searchType));
          modules.setId(keywords);
          RongIMClient.bridge.queryMsg(29, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, callback, "SearchMpOutput");
        };
        /**
         * [searchPublicServiceByType ]按公众服务类型搜索公众服务。
         * @param  {PublicServiceType}                      publicServiceType [公众服务类型。]
         * @param  {SearchType}                             searchType        [搜索类型枚举。]
         * @param  {string}                                 keywords          [搜索关键字。]
         * @param  {ResultCallback<PublicServiceProfile[]>} callback          [搜索结果回调。]
         */
        RongIMClient.prototype.searchPublicServiceByType = function(publicServiceType, searchType, keywords, callback) {
          RongIMLib.CheckParam.getInstance().check(["number", "number", "string", "object"], "searchPublicServiceByType");
          var type = publicServiceType == RongIMLib.ConversationType.APP_PUBLIC_SERVICE ? 2 : 1;
          var modules = new Modules.SearchMpInput();
          modules.setType(this.pottingPublicSearchType(type, searchType));
          modules.setId(keywords);
          RongIMClient.bridge.queryMsg(29, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, callback, "SearchMpOutput");
        };
        /**
         * [subscribePublicService ] 订阅公众号。
         * @param  {PublicServiceType} publicServiceType [公众服务类型。]
         * @param  {string}            publicServiceId   [公共服务 Id。]
         * @param  {OperationCallback} callback          [订阅公众号回调。]
         */
        RongIMClient.prototype.subscribePublicService = function(publicServiceType, publicServiceId, callback) {
          RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "subscribePublicService");
          var modules = new Modules.MPFollowInput(),
            me = this,
            follow = publicServiceType == RongIMLib.ConversationType.APP_PUBLIC_SERVICE ? "mcFollow" : "mpFollow";
          modules.setId(publicServiceId);
          RongIMClient.bridge.queryMsg(follow, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
            onSuccess: function() {
              me.syncPublicServiceList(null, null, null, {
                onSuccess: function() {},
                onError: function() {}
              });
              callback.onSuccess();
            },
            onError: function() {
              callback.onError(RongIMLib.ErrorCode.SUBSCRIBE_ERROR);
            }
          }, "MPFollowOutput");
        };
        /**
         * [unsubscribePublicService ] 取消订阅公众号。
         * @param  {PublicServiceType} publicServiceType [公众服务类型。]
         * @param  {string}            publicServiceId   [公共服务 Id。]
         * @param  {OperationCallback} callback          [取消订阅公众号回调。]
         */
        RongIMClient.prototype.unsubscribePublicService = function(publicServiceType, publicServiceId, callback) {
          RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "unsubscribePublicService");
          var modules = new Modules.MPFollowInput(),
            me = this,
            follow = publicServiceType == RongIMLib.ConversationType.APP_PUBLIC_SERVICE ? "mcUnFollow" : "mpUnFollow";
          modules.setId(publicServiceId);
          RongIMClient.bridge.queryMsg(follow, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
            onSuccess: function() {
              RongIMClient.publicServiceMap.remove(publicServiceType, publicServiceId);
              callback.onSuccess();
            },
            onError: function() {
              callback.onError(RongIMLib.ErrorCode.SUBSCRIBE_ERROR);
            }
          }, "MPFollowOutput");
        };
        // #endregion Public Service
        // #region Blacklist
        /**
         * [加入黑名单]
         * @param  {string}            userId   [将被加入黑名单的用户Id]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
        RongIMClient.prototype.addToBlacklist = function(userId, callback) {
          RongIMLib.CheckParam.getInstance().check(["string", "object"], "addToBlacklist");
          var modules = new Modules.Add2BlackListInput();
          this.getCurrentUserInfo({
            onSuccess: function(info) {
              var uId = info.getUserId();
              modules.setUserId(userId);
              RongIMClient.bridge.queryMsg(21, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), uId, callback);
            },
            onError: function() {
              callback.onError(RongIMLib.ErrorCode.BLACK_ADD_ERROR);
            }
          });
        };
        /**
         * [获取黑名单列表]
         * @param  {GetBlacklistCallback} callback [返回值，函数回调]
         */
        RongIMClient.prototype.getBlacklist = function(callback) {
          RongIMLib.CheckParam.getInstance().check(["object"], "getBlacklist");
          var modules = new Modules.QueryBlackListInput();
          modules.setNothing(1);
          RongIMClient.bridge.queryMsg(23, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, callback, "QueryBlackListOutput");
        };
        /**
         * [得到指定人员再黑名单中的状态]
         * @param  {string}                          userId   [description]
         * @param  {ResultCallback<BlacklistStatus>} callback [返回值，函数回调]
         */
        //TODO 如果人员不在黑名单中，获取状态会出现异常
        RongIMClient.prototype.getBlacklistStatus = function(userId, callback) {
          RongIMLib.CheckParam.getInstance().check(["string", "object"], "getBlacklistStatus");
          var modules = new Modules.BlackListStatusInput();
          this.getCurrentUserInfo({
            onSuccess: function(info) {
              var uId = info.getUserId();
              modules.setUserId(userId);
              RongIMClient.bridge.queryMsg(24, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), uId, {
                onSuccess: function(status) {
                  callback.onSuccess(RongIMLib.BlacklistStatus[status]);
                },
                onError: function() {
                  callback.onError(RongIMLib.ErrorCode.BLACK_GETSTATUS_ERROR);
                }
              });
            },
            onError: function() {
              callback.onError(RongIMLib.ErrorCode.BLACK_GETSTATUS_ERROR);
            }
          });
        };
        /**
         * [将指定用户移除黑名单]
         * @param  {string}            userId   [将被移除的用户Id]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
        RongIMClient.prototype.removeFromBlacklist = function(userId, callback) {
          RongIMLib.CheckParam.getInstance().check(["string", "object"], "removeFromBlacklist");
          var modules = new Modules.RemoveFromBlackListInput();
          this.getCurrentUserInfo({
            onSuccess: function(info) {
              var uId = info.getUserId();
              modules.setUserId(userId);
              RongIMClient.bridge.queryMsg(22, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), uId, callback);
            },
            onError: function() {
              callback.onError(RongIMLib.ErrorCode.BLACK_REMOVE_ERROR);
            }
          });
        };
/**
 * TODO 暂未实现。
 */
        RongIMClient.prototype.addRealTimeLocationListener = function(conversationType, targetId, listener) {
          throw new Error("Not implemented yet");
        };
        /**
         * TODO 暂未实现。
         */
        RongIMClient.prototype.getRealTimeLocation = function(conversationType, targetId) {
          throw new Error("Not implemented yet");
        };
        /**
         * TODO 暂未实现。
         */
        RongIMClient.prototype.getRealTimeLocationCurrentState = function(conversationType, targetId) {
          throw new Error("Not implemented yet");
        };
        /**
         * TODO 暂未实现。
         */
        RongIMClient.prototype.getRealTimeLocationParticipants = function(conversationType, targetId) {
          throw new Error("Not implemented yet");
        };
        /**
         * TODO 暂未实现。
         */
        RongIMClient.prototype.joinRealTimeLocation = function(conversationType, targetId) {
          throw new Error("Not implemented yet");
        };
        /**
         * TODO 暂未实现。
         */
        RongIMClient.prototype.quitRealTimeLocation = function(conversationType, targetId) {
          throw new Error("Not implemented yet");
        };
        /**
         * TODO 暂未实现。
         */
        RongIMClient.prototype.startRealTimeLocation = function(conversationType, targetId) {
          throw new Error("Not implemented yet");
        };
        /**
         * TODO 暂未实现。
         */
        RongIMClient.prototype.updateRealTimeLocationStatus = function(conversationType, targetId, latitude, longitude) {
          throw new Error("Not implemented yet");
        };
        /**
         * 判断是否推送消息。
         * @type {Boolean}
         */
        RongIMClient.isNotPullMsg = false;
        /**
         * [schemeType 选择连接方式]
         * SSL需要设置schemeType为SchemeType.SSL
         * HTTP或WS需要设置 schemeType为SchemeType.HSL(默认)
         * 若改变连接方式此属性必须在RongIMClient.init之前赋值
         * expmale:
         * RongIMLib.RongIMClient.schemeType = RongIMLib.SchemeType.SSL
         * @type {number}
         */
        RongIMClient.schemeType = RongIMLib.SchemeType.HSL;
        /**
         * 缓存公众号列表。
         * @type {PublicServiceMap}
         */
        RongIMClient.publicServiceMap = new RongIMLib.PublicServiceMap();
        /**
         * 消息类型，用作接收消息进行判断类型。
         */
        RongIMClient.MessageType = {
          TextMessage: "TextMessage",
          ImageMessage: "ImageMessage",
          DiscussionNotificationMessage: "DiscussionNotificationMessage",
          VoiceMessage: "VoiceMessage",
          RichContentMessage: "RichContentMessage",
          HandshakeMessage: "HandshakeMessage",
          UnknownMessage: "UnknownMessage",
          SuspendMessage: "SuspendMessage",
          LocationMessage: "LocationMessage",
          InformationNotificationMessage: "InformationNotificationMessage",
          ContactNotificationMessage: "ContactNotificationMessage",
          ProfileNotificationMessage: "ProfileNotificationMessage",
          CommandNotificationMessage: "CommandNotificationMessage"
        };
        /**
         * 缓存会话列表
         *
         * @type {ConversationMap}
         */
        RongIMClient.conversationMap = new RongIMLib.ConversationMap();
        /**
         * 存放监听数组
         * @type {Array}
         */
        RongIMClient.listenerList = [];
        /**
         * Represents a TextMessage.
         * @constructor
         */
        function TextMessage(message) {
          //persited 0:持久化 1:不持久化
          this.persited = 1;
          //counted 0:不累计未读消息数  2:累计为度消息数
          this.counted = 2;
          if (arguments.length == 0) {
            throw new Error("Can not instantiate with empty parameters, use obtain method instead -> TextMessage.");
          }
          this.message = message;
        }
        TextMessage.obtain = function(text) {
          var msg = new TextMessage({
            extra: "",
            content: text
          });
          return msg;
        };
        TextMessage.prototype.setExtra = function(extra) {
          this.message.extra = extra;
        };
        TextMessage.prototype.setContent = function(content) {
          this.message.content = content;
        };
        TextMessage.prototype.getExtra = function() {
          return this.message.extra;
        };
        TextMessage.prototype.getContent = function() {
          return this.message.content;
        };
        TextMessage.prototype.encode = function() {
          var c = new Modules.UpStreamMessage();
          c.setSessionId(this.persited | this.counted);
          c.setClassname("RC:TxtMsg");
          c.setContent(JSON.stringify(this.message));
          var val = c.toArrayBuffer();
          if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
            return [].slice.call(new Int8Array(val));
          }
          return val;
        };
        /**
         *Represents a VoiceMessage.
         * @constructor
         */
        function VoiceMessage(message) {
          //persited 0:持久化 1:不持久化
          this.persited = 1;
          //counted 0:不累计未读消息数  2:累计为度消息数
          this.counted = 2;
          if (!VoiceMessage.caller && arguments.length == 0) {
            throw new Error("Can not instantiate with empty parameters, use obtain method instead -> VoiceMessage.");
          }
          this.message = message;
        }
        VoiceMessage.obtain = function(base64Content, duration) {
          var msg = new VoiceMessage({
            content: base64Content,
            duration: duration,
            extra: ""
          });
          return msg;
        };
        VoiceMessage.prototype.setBase64 = function(base64) {
          this.message.base64 = base64;
        };
        VoiceMessage.prototype.setDuration = function(duration) {
          this.message.duration = duration;
        };
        VoiceMessage.prototype.setUri = function(uri) {
          this.message.uri = uri;
        };
        VoiceMessage.prototype.setExtra = function(extra) {
          this.message.extra = extra;
        };
        VoiceMessage.prototype.getBase64 = function() {
          return this.message.base64;
        };
        VoiceMessage.prototype.getDuration = function() {
          return this.message.duration;
        };
        VoiceMessage.prototype.getUri = function() {
          return this.message.uri;
        };
        VoiceMessage.prototype.getExtra = function() {
          return this.message.extra;
        };
        VoiceMessage.prototype.encode = function() {
          var c = new Modules.UpStreamMessage();
          c.setSessionId(this.persited | this.counted);
          c.setClassname("RC:VcMsg");
          c.setContent(JSON.stringify(this.message));
          var val = c.toArrayBuffer();
          if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
            return [].slice.call(new Int8Array(val));
          }
          return val;
        };
        /**
         * Represents a ImageMessage.
         * @constructor
         */
        function ImageMessage(message) {
          this.isFull = false;
          this.isUpLoadExp = false;
          //persited 0:持久化 1:不持久化
          this.persited = 1;
          //counted 0:不累计未读消息数  2:累计为度消息数
          this.counted = 2;
          if (!ImageMessage.caller && arguments.length == 0) {
            throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ImageMessage.");
          }
          this.message = message;
        }
        ImageMessage.obtain = function(content, imageUri) {
          var msg = new ImageMessage({
            content: content,
            imageUri: imageUri,
            extra: ""
          });
          return msg;
        };
        ImageMessage.prototype.getBase64 = function() {
          return this.message.base64;
        };
        ImageMessage.prototype.getExtra = function() {
          return this.message.extra;
        };
        ImageMessage.prototype.getLocalUri = function() {
          return this.message.localUri;
        };
        ImageMessage.prototype.getRemoteUri = function() {
          return this.message.remoteUri;
        };
        ImageMessage.prototype.getThumUri = function() {
          return this.message.thumUri;
        };
        ImageMessage.prototype.getIsFull = function() {
          return this.message.isFull;
        };
        ImageMessage.prototype.getIsUpLoadExp = function() {
          return this.message.isUpLoadExp;
        };
        ImageMessage.prototype.setBase64 = function(base64) {
          this.message.base64 = base64;
        };
        ImageMessage.prototype.setExtra = function(extra) {
          this.message.extra = extra;
        };
        ImageMessage.prototype.setLocalUri = function(localUri) {
          this.message.localUri = localUri;
        };
        ImageMessage.prototype.setRemoteUri = function(remoteUri) {
          this.message.remoteUri = remoteUri;
        };
        ImageMessage.prototype.setThumUri = function(thumUri) {
          this.message.thumUri = thumUri;
        };
        ImageMessage.prototype.setIsUpLoadExp = function(isUpLoadExp) {
          this.message.isUpLoadExp = isUpLoadExp;
        };
        ImageMessage.prototype.setIsFull = function(isFull) {
          this.message.isFull = isFull;
        };
        ImageMessage.prototype.encode = function() {
          var c = new Modules.UpStreamMessage();
          c.setSessionId(this.persited | this.counted);
          c.setClassname("RC:ImgMsg");
          c.setContent(JSON.stringify(this.message));
          var val = c.toArrayBuffer();
          if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
            return [].slice.call(new Int8Array(val));
          }
          return val;
        };
        /**
         * Represents a LocationMessage.
         * @constructor
         */
        function LocationMessage(message) {
          //persited 0:持久化 1:不持久化
          this.persited = 1;
          //counted 0:不累计未读消息数  2:累计为度消息数
          this.counted = 2;
          if (!LocationMessage.caller && arguments.length == 0) {
            throw new Error("Can not instantiate with empty parameters, use obtain method instead -> LocationMessage.");
          }
          this.message = message;
        }
        LocationMessage.obtain = function(latitude, longitude, poi, imgUri) {
          var msg = new LocationMessage({
            latitude: longitude,
            longitude: longitude,
            poi: poi,
            imgUri: imgUri,
            extra: ""
          });
          return msg;
        };
        LocationMessage.prototype.getBase64 = function() {
          return this.message.base64;
        };
        LocationMessage.prototype.getExtra = function() {
          return this.message.extra;
        };
        LocationMessage.prototype.getImgUri = function() {
          return this.message.imgUri;
        };
        LocationMessage.prototype.getLat = function() {
          return this.message.lat;
        };
        LocationMessage.prototype.getLng = function() {
          return this.message.lng;
        };
        LocationMessage.prototype.getPoi = function() {
          return this.message.poi;
        };
        LocationMessage.prototype.setBase64 = function(base64) {
          this.message.base64 = base64;
        };
        LocationMessage.prototype.setExtra = function(extra) {
          this.message.extra = extra;
        };
        LocationMessage.prototype.setImgUri = function(imgUri) {
          this.message.imgUri = imgUri;
        };
        LocationMessage.prototype.setLat = function(lat) {
          this.message.lat = lat;
        };
        LocationMessage.prototype.setLng = function(lng) {
          this.message.lng = lng;
        };
        LocationMessage.prototype.setPoi = function(poi) {
          this.message.poi = poi;
        };
        LocationMessage.prototype.encode = function() {
          var c = new Modules.UpStreamMessage();
          c.setSessionId(this.persited | this.counted);
          c.setClassname("RC:LBSMsg");
          c.setContent(JSON.stringify(this.message));
          var val = c.toArrayBuffer();
          if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
            return [].slice.call(new Int8Array(val));
          }
          return val;
        };
        /**
         * Represents a RichContentMessage.
         * @constructor
         */
        function RichContentMessage(message) {
          //persited 0:持久化 1:不持久化
          this.persited = 1;
          //counted 0:不累计未读消息数  2:累计为度消息数
          this.counted = 2;
          if (!LocationMessage.caller && arguments.length == 0) {
            throw new Error("Can not instantiate with empty parameters, use obtain method instead -> RichContentMessage.");
          }
          this.message = message;
        }
        RichContentMessage.obtain = function(title, content, imageUri) {
          var msg = new RichContentMessage({
            title: title,
            content: content,
            imageUri: imageUri
          });
          return msg;
        };
        RichContentMessage.prototype.getContent = function() {
          return this.message.content;
        };
        RichContentMessage.prototype.getExtra = function() {
          return this.message.extra;
        };
        RichContentMessage.prototype.getImgUrl = function() {
          return this.message.imgUrl;
        };
        RichContentMessage.prototype.getTitle = function() {
          return this.message.title;
        };
        RichContentMessage.prototype.getUrl = function() {
          return this.message.url;
        };
        RichContentMessage.prototype.setContent = function(content) {
          return this.message.content = content;
        };
        RichContentMessage.prototype.setExtra = function(extra) {
          return this.message.extra = extra;
        };
        RichContentMessage.prototype.setImgUrl = function(imgUrl) {
          return this.message.imgUrl = imgUrl;
        };
        RichContentMessage.prototype.setTitle = function(title) {
          return this.message.title = title;
        };
        RichContentMessage.prototype.setUrl = function(url) {
          return this.message.url = url;
        };
        RichContentMessage.prototype.encode = function() {
          var c = new Modules.UpStreamMessage();
          c.setSessionId(this.persited | this.counted);
          c.setClassname("RC:ImgTextMsg");
          c.setContent(JSON.stringify(this.message));
          var val = c.toArrayBuffer();
          if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
            return [].slice.call(new Int8Array(val));
          }
          return val;
        };
        /**
         * Represents a UnknownMessage.
         * @constructor
         */
        function UnknownMessage(message) {
          if (!LocationMessage.caller && arguments.length == 0) {
            throw new Error("Can not instantiate with empty parameters, use obtain method instead -> RichContentMessage.");
          }
          this.message = message;
        }
        UnknownMessage.prototype.encode = function() {
          var c = new Modules.UpStreamMessage();
        };
        /**
         * Represents a PublicServiceCommandMessage.
         * @constructor
         */
        function PublicServiceCommandMessage(message) {
          //persited 0:持久化 1:不持久化
          this.persited = 1;
          //counted 0:不累计未读消息数  2:累计为度消息数
          this.counted = 2;
          if (arguments.length == 0) {
            throw new Error("Can not instantiate with empty parameters, use obtain method instead -> TextMessage.");
          }
          this.message = message;
        }
        PublicServiceCommandMessage.obtain = function(item) {
          var msg = new PublicServiceCommandMessage({
            extra: "",
            data: "",
            command: "",
            menuItem: item
          });
          return msg;
        };
        PublicServiceCommandMessage.prototype.encode = function() {
          var c = new Modules.UpStreamMessage();
          c.setSessionId(this.persited | this.counted);
          c.setClassname("RC:PSCmd");
          c.setContent(JSON.stringify(this.message));
          var val = c.toArrayBuffer();
          if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
            return [].slice.call(new Int8Array(val));
          }
          return val;
        };
        /**
         * Represents a PublicServiceMultiRichContentMessage.
         * @constructor
         */
        function PublicServiceMultiRichContentMessage(messages) {
          this.richContentMessages = messages;
        }
        PublicServiceMultiRichContentMessage.prototype.getPublicServiceUserInfo = function() {
          return this.userInfo;
        };
        PublicServiceMultiRichContentMessage.prototype.setPublicServiceUserInfo = function(user) {
          this.userInfo = user;
        };
        PublicServiceMultiRichContentMessage.prototype.encode = function() {
          return null;
        };
        /**
         * Represents a PublicServiceRichContentMessage.
         * @constructor
         */
        function PublicServiceRichContentMessage(message) {
          this.richContentMessage = message;
        }
        PublicServiceRichContentMessage.prototype.getMessage = function() {
          return this.richContentMessage;
        };
        PublicServiceRichContentMessage.prototype.getPublicServiceUserInfo = function() {
          return this.userInfo;
        };
        PublicServiceRichContentMessage.prototype.setPublicServiceUserInfo = function(user) {
          this.userInfo = user;
        };
        PublicServiceRichContentMessage.prototype.encode = function() {
          return null;
        };
        /**
         * Represents a InformationNotificationMessage.
         * @constructor
         */
        function InformationNotificationMessage(message) {
          //persited 0:持久化 1:不持久化
          this.persited = 1;
          //counted 0:不累计未读消息数  2:累计为度消息数
          this.counted = 2;
          this.message = message;
        }
        InformationNotificationMessage.obtain = function(content) {
          var msg = new InformationNotificationMessage({
            content: content,
            extra: ""
          });
          return msg;
        };
        InformationNotificationMessage.prototype.getExtra = function() {
          return this.message.extra;
        };
        InformationNotificationMessage.prototype.getMessage = function() {
          return this.message.content;
        };
        InformationNotificationMessage.prototype.setExtra = function(extra) {
          this.message.extra = extra;
        };
        InformationNotificationMessage.prototype.setMessage = function(content) {
          this.message.content;
        };
        InformationNotificationMessage.prototype.encode = function() {
          var c = new Modules.UpStreamMessage();
          c.setSessionId(this.persited | this.counted);
          c.setClassname("RC:InfoNtf");
          c.setContent(JSON.stringify(this.message));
          var val = c.toArrayBuffer();
          if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
            return [].slice.call(new Int8Array(val));
          }
          return val;
        };
        /**
         * 联系人（好友）通知消息。
         * @constructor
         */
        function ContactNotificationMessage(message) {
          /**
           * 0:持久化 1:不持久化
           * @type {Number}
           */
          this.persited = 1;
          /**
           * 0:不累计未读消息数  2:累计为度消息数
           * @type {Number}
           */
          this.counted = 2;
          this.message = message;
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
         *
         * @example
         *var cnm = new RongIMClient.ContactNotificationMessage({"operation":"Request",
         "sourceUserId":"123",
         "targetUserId":"456",
         "message":"我是小艾，能加一下好友吗？",
         "extra":""})
         * @param  {string} operation    操作字符串
         * @param  {string} sourceUserId 发起人id
         * @param  {string} targetUserId 目标id
         * @param  {string} message      接受拒绝原因
         * @return {ContactNotificationMessage}
         */
        ContactNotificationMessage.obtain = function(operation, sourceUserId, targetUserId, message) {
          return new InformationNotificationMessage({
            operation: operation,
            sourceUserId: sourceUserId,
            targetUserId: targetUserId,
            message: message,
            extra: ""
          });
        };
        /**
         *获取附加信息。
         * @return {string}
         */
        ContactNotificationMessage.prototype.getExtra = function() {
          return this.message.extra;
        };
        /**
         *获取内容。
         * @return {string}
         */
        ContactNotificationMessage.prototype.getMessage = function() {
          return this.message.content;
        };
        /**
         *获取操作字符串。
         * @return {string}
         */
        ContactNotificationMessage.prototype.getOperation = function() {
          return this.message.operation;
        };
        /**
         *获取发起人Id。
         * @return {string}
         */
        ContactNotificationMessage.prototype.getSourceUserId = function() {
          return this.message.sourceUserId;
        };
        /**
         *获取目标Id。
         * @return {string}
         */
        ContactNotificationMessage.prototype.getTargetUserId = function() {
          return this.message.targetUserId;
        };
        /**
         *设置附加信息。
         */
        ContactNotificationMessage.prototype.setExtra = function(extra) {
          this.message.extra = extra;
        };
        /**
         *设置消息内容。
         */
        ContactNotificationMessage.prototype.setMessage = function(content) {
          this.message.content;
        };
        /**
         *设置操作字符串。
         */
        ContactNotificationMessage.prototype.setOperation = function(operation) {
          this.message.operation = operation;
        };
        /**
         *设置发起人Id。
         */
        ContactNotificationMessage.prototype.setSourceUserId = function(sourceUserId) {
          this.message.sourceUserId = sourceUserId;
        };
        /**
         *设置目标Id。
         */
        ContactNotificationMessage.prototype.setTargetUserId = function(targetUserId) {
          this.message.targetUserId = targetUserId;
        };

        /**
         * Represents a ProfileNotificationMessage.
         * @constructor
         */
        function ProfileNotificationMessage(message) {
          //persited 0:持久化 1:不持久化
          this.persited = 1;
          //counted 0:不累计未读消息数  2:累计为度消息数
          this.counted = 2;
          this.message = message;
        }
        ProfileNotificationMessage.obtain = function(operation, data) {
          return new ProfileNotificationMessage({
            operation: operation,
            data: data,
            extra: ""
          });
        };
        ProfileNotificationMessage.prototype.getData = function() {
          return this.message.content;
        };
        ProfileNotificationMessage.prototype.getExtra = function() {
          return this.message.extra;
        };
        ProfileNotificationMessage.prototype.getOperation = function() {
          return this.message.operation;
        };
        ProfileNotificationMessage.prototype.setData = function(content) {
          return this.message.content = content;
        };
        ProfileNotificationMessage.prototype.setExtra = function(extra) {
          return this.message.extra = extra;
        };
        ProfileNotificationMessage.prototype.setOperation = function(operation) {
          return this.message.operation = operation;
        };
        ProfileNotificationMessage.prototype.encode = function() {
          var c = new Modules.UpStreamMessage();
          c.setSessionId(this.persited | this.counted);
          c.setClassname("RC:ProfileNtf");
          c.setContent(JSON.stringify(this.message));
          var val = c.toArrayBuffer();
          if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
            return [].slice.call(new Int8Array(val));
          }
          return val;
        };
        /**
         * 通用命令通知消息。
         * @constructor
         */
        function CommandNotificationMessage(message) {
          /**
           * 0:持久化 1:不持久化。
           * @type {Number}
           */
          this.persited = 1;
          /**
           * 0:不累计未读消息数  2:累计为度消息数。
           * @type {Number}
           */
          this.counted = 2;

          this.message = message;
        }
        /**
         *生成CommandNotificationMessage对象。
         *
         * @example
         * var cnm = RongIMClient.CommandNotificationMessage.obtain('命令','去吃饭');
         * @param  {string} name   命令名称
         * @param  {string} data 内容
         * @return {CommandNotificationMessage}
         *
         */
        CommandNotificationMessage.obtain = function(name, data) {
          return new CommandNotificationMessage({
            name: x,
            data: data,
            extra: ""
          });
        };
        /**
         *获取数据。
         * @return {string}
         */
        CommandNotificationMessage.prototype.getData = function() {
          return this.message.content;
        };
        /**
         * 获取命令名称
         * @return {string}
         */
        CommandNotificationMessage.prototype.getName = function() {
          return this.message.name;
        };
        /**
         *设置数据。
         */
        CommandNotificationMessage.prototype.setData = function(content) {
          return this.message.content = content;
        };
        /**
         *设置命令名称。
         */
        CommandNotificationMessage.prototype.setName = function(name) {
          return this.message.name = name;
        };
        /**
         *编译消息类。
         */
        CommandNotificationMessage.prototype.encode = function() {
          var c = new Modules.UpStreamMessage();
          c.setSessionId(this.persited | this.counted);
          c.setClassname("RC:CmdNtf");
          c.setContent(JSON.stringify(this.message));
          var val = c.toArrayBuffer();
          if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
            return [].slice.call(new Int8Array(val));
          }
          return val;
        };
        /**
         * Represents a DiscussionNotificationMessage.
         * @constructor
         */
        function DiscussionNotificationMessage(message) {
          this.isHasReceived = false;
          //persited 0:持久化 1:不持久化
          this.persited = 1;
          //counted 0:不累计未读消息数  2:累计为度消息数
          this.counted = 2;
          this.message = message;
        }
        DiscussionNotificationMessage.prototype.getExtension = function() {
          return this.message.extension;
        };
        DiscussionNotificationMessage.prototype.getType = function() {
          return this.message.type;
        };
        DiscussionNotificationMessage.prototype.getHasReceived = function() {
          return this.message.isHasReceived;
        };
        DiscussionNotificationMessage.prototype.getOperator = function() {
          return this.message.operation;
        };
        DiscussionNotificationMessage.prototype.setExtension = function(extension) {
          return this.message.extension = extension;
        };
        DiscussionNotificationMessage.prototype.setHasReceived = function(isHasReceived) {
          return this.message.isHasReceived = isHasReceived;
        };
        DiscussionNotificationMessage.prototype.setOperator = function(operation) {
          return this.message.operation = operation;
        };
        DiscussionNotificationMessage.prototype.setType = function(type) {
          return this.message.type = type;
        };
        DiscussionNotificationMessage.prototype.encode = function() {
          var c = new Modules.UpStreamMessage();
          c.setSessionId(this.persited | this.counted);
          c.setClassname("RC:DizNtf");
          c.setContent(JSON.stringify(this.message));
          var val = c.toArrayBuffer();
          if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
            return [].slice.call(new Int8Array(val));
          }
          return val;
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
          RongIMLib.RongIMClient.conversationMap.add(this);
        };
        /**
         *讨论组实体，用来容纳和存储讨论组的信息和设置。
         * @constructor
         */
        function Discussion() {}
        /**
         *设置讨论组Id。
         * @param  {string} 讨论组id
         */
        Discussion.prototype.setId = function(id) {
          this.id = id;
        };
        /**
         * 设置创建人Id。
         * @param  {string} 创建人creatorId
         */
        Discussion.prototype.setCreatorId = function(creatorId) {
          this.creatorId = creatorId;
        };
        /**
         *设置讨论组成员id列表。
         * @param  {array}  memberIdList 成员Id列表
         */
        Discussion.prototype.setMemberIdList = function(memberIdList) {
          this.memberIdList = memberIdList;
        };
        /**
         * 设置讨论组名称
         * @param  {string} name 讨论组名称
         */
        Discussion.prototype.setName = function(name) {
          this.name = name;
        };
        /**
         * 设置是否开发邀请。
         * @param  {Boolean} isOpen 是否开放邀请
         */
        Discussion.prototype.setOpen = function(isOpen) {
          this.isOpen = isOpen;
        };
        /**
         * 获取讨论组Id。
         * @return {string}
         */
        Discussion.prototype.getId = function() {
          return this.id;
        };
        /**
         * 获取创建人Id。
         * @return {string}
         */
        Discussion.prototype.getCreatorId = function() {
          return this.creatorId;
        };
        /**
         * 获取讨论组成员列表。
         * @return {array}
         */
        Discussion.prototype.getMemberIdList = function() {
          return this.memberIdList;
        };
        /**
         * 获取讨论组名称。
         * @return {string}
         */
        Discussion.prototype.getName = function() {
          return this.name;
        };
        /**
         * 获取讨论组邀请状态。
         * @return {string}
         */
        Discussion.prototype.getOpen = function() {
          return this.isOpen;
        };
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
         * 消息上传预处理类（例如发送图片显示的缩略图）。
         * @constructor
         * @example
         * var handler = RongIMClient.MessageHandler(function(){
                // do something ...
           });
           console.log(handler);
         * @param {Client} client 回调处理对象
         */
        function MessageHandler(client) {

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
         * 设置内置消息名称。
         * @param  {string} objectName 内置消息名称
         */
        Message.prototype.setObjectName = function(objectName) {
          this.objectName = objectName;
        };
        /**
         * 设置消息内容
         * @param  {MessageContent} content 消息内容
         */
        Message.prototype.setMessage = function(content) {
          this.content = content;
        };
        /**
         * 公众号Menu类。
         * @constructor
         */
        function PublicServiceMenuItem() {}
        /**
         *获取menu的Id。
         * @return {string} menu的Id
         */
        PublicServiceMenuItem.prototype.getId = function() {
          return this.id;
        };
        /**
         * 获取menu的名称。
         * @return {string}
         */
        PublicServiceMenuItem.prototype.getName = function() {
          return this.name;
        };
        /**
         * 获取下级menu。
         * @return {string}
         */
        PublicServiceMenuItem.prototype.getSubMenuItems = function() {
          return this.sunMenuItems;
        };
        /**
         * 获取url。
         * @return {string}
         */
        PublicServiceMenuItem.prototype.getUrl = function() {
          return this.url;
        };
        /**
         * 获取类型。
         * @return {ConversationType}
         */
        PublicServiceMenuItem.prototype.getType = function() {
          return this.type;
        };
        /**
         * 设置menuId。
         * @param  {string} menu的Id
         */
        PublicServiceMenuItem.prototype.setId = function(id) {
          this.id = id;
        };
        /**
         * 设置类型。
         * @param  {ConversationType} menu的Id
         */
        PublicServiceMenuItem.prototype.setType = function(type) {
          this.type = type;
        };
        /**
         * 设置name。
         * @param  {string} menu的name
         */
        PublicServiceMenuItem.prototype.setName = function(name) {
          this.name = name;
        };
        /**
         * 设置所有下级menu。
         * @param  {string} 下级menu
         */
        PublicServiceMenuItem.prototype.setSunMenuItems = function(sunMenuItems) {
          this.sunMenuItems = sunMenuItems;
        };
        /**
         * 设置Url。
         * @param  {string} menu的Url
         */
        PublicServiceMenuItem.prototype.setUrl = function(url) {
          this.url = url;
        };
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
          this.conversationType = conversationType;
          this.introduction = introduction;
          this.menu = menu;
          this.name = name;
          this.portraitUri = portraitUri;
          this.publicServiceId = publicServiceId;
          this.hasFollowed = hasFollowed;
          this.isGlobal = isGlobal;
        }
        /**
         *用户信息类。
         *@example
         * var info = new RongIMLib.UserInfo();
         * info.setUserName("张三");
         * @constructor
         */
        function UserInfo() {}
        /**
         * 设置id。
         * @param  {string} userId 用户Id
         */
        UserInfo.prototype.setUserId = function(userId) {
          this.userId = userId;
        };
        /**
         * 设置用户名称。
         * @param  {string} name 用户名称
         */
        UserInfo.prototype.setUserName = function(name) {
          this.name = name;
        };
        /**
         * 设置用户头像。
         * @param  {string} portraitUri 用户头像
         */
        UserInfo.prototype.setPortraitUri = function(portraitUri) {
          this.portraitUri = portraitUri;
        };
        /**
         * 获取用户id。
         * @return {string}
         */
        UserInfo.prototype.getUserId = function() {
          return this.userId;
        };
        /**
         * 获取用户名称。
         * @return {string}
         */
        UserInfo.prototype.getUserName = function() {
          return this.name;
        };
        /**
         * 获取用户头像。
         * @return {string}
         */
        UserInfo.prototype.getPortaitUri = function() {
          return this.portraitUri;
        };
