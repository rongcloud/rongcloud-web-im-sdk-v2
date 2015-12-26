/**@overview 融云 RongCloud Web SDK API 开发文档 2.0.0*/
/**
 *RongIMClient对象，web SDK 核心处理类；SDK 上所有的方法、对象、属性、模块都是依附于该对象。
 * @constructor
 */
 function RongIMClient() {
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
 
 RongIMClient.reconnect = function (callback) {
     RongIMClient.bridge.reconnect(callback);
 };
 };
