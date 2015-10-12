#测试方法
#用WebSDK1.0（以下简称：V1.0）的Sever作为测试Sever
#1、获取V1.0的URL
#2、用V2.0的通讯通道发送消息，V1.0接收消息（避免转换二进制等操作）
#3、验证：可互相收发消息为测试通过（通道畅通），后续完善细节
#PS:
#若其他机器测试，需要修改URL中所有内容
#
#XHR-Polling 测试
#connect-url:119.254.108.75:8203/websocket?appId=cpj2xarlj5cdn&token=dXOJIInqKDahrpig%2BTJcq3U1lgYP6zEv1OpCrfDse9JiBi4BNyqa2MRus3mUdaZlHmSaXaVmp5%2FyPASY0%2FfWWKnbNZUuYfcE&sdkVer=1.0.0&apiVer=1.0.0
#send-url:119.254.108.75:8203/websocket?messageid=9&header=50&sessionid=cd6232ee-ec64-46b3-a26c-5c5f21cbd577&topic=ppMsgP&targetid=lisi
##data:{"sessionId":0,"classname":"RC:TxtMsg","content":"{\"content\":\"ssss\",\"extra\":\"\"}"}

# describe '流程测试-webScoket', ->
#   it '测试业务流程-webScoket', ->
#     socketransport = new RongIMLib.SocketTransportation()
#     socketransport.createTransport "119.254.108.75:8103/websocket?appId=cpj2xarlj5cdn&token=dXOJIInqKDahrpig%2BTJcq3U1lgYP6zEv1OpCrfDse9JiBi4BNyqa2MRus3mUdaZlHmSaXaVmp5%2FyPASY0%2FfWWKnbNZUuYfcE&sdkVer=1.0.0&apiVer=1.0.0"
#     #测试内容为 “测试webSocket” （V1.0转换来）
#     binary = new Int8Array( [50, 0, 6, 112, 112, 77, 115, 103, 80, 0, 7, 122, 104, 97, 111, 108, 105, 117, 0, 4, 8, 0, 18, 9, 82, 67, 58, 84, 120, 116, 77, 115, 103, 26, 54, 123, 34, 99, 111, 110, 116, 101, 110, 116, 34, 58, 34, -26, -75, -117, -24, -81, -107, 119, 101, 98, 83, 111, 99, 107, 101, 116, 92, 110, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 34, 44, 34, 101, 120, 116, 114, 97, 34, 58, 34, 34, 125]);
#     #连接成功后自动发送消息
#     socketransport.send binary
#     #间隔3秒自动断开连接
#     setTimeout (->
#       socketransport.disconnect()
#     ), 3000
#     #间隔5秒自动发送消息，报错则为正常
#     setTimeout (->
#       socketransport.send binary
#     ), 5000
#     #间隔7秒自动重连
#     setTimeout (->
#       socketransport.reconnect()
#     ), 7000
# # describe 'just checking',->
# #   it 'Test Socket zhangsan',->
# #     xhrTransport = new RongIMLib.PollingTransportation
# #     connect = xhrTransport.createTransport("http://119.254.108.75:8203/pullmsg.js?sessionid=10ad1579-5645-4ed2-92e8-ad7ad6dd0e05","GET");
# #     xhrTransport.send('{\"sessionId\":0,\"classname\":\"RC:TxtMsg\",\"content\":\"{\\"content\\":\\"yuhongda-010101\\",\\"extra\\":\\"\\"}\"}',"http://119.254.108.75:8203/websocket?messageid=5&header=50&sessionid=10ad1579-5645-4ed2-92e8-ad7ad6dd0e05&topic=ppMsgP&targetid=lisi","POST")
#
# describe "WebScoket", ->
#
#  it "shuld return RongIMlib.SocketTransportation object",->
#     socketransport = new RongIMLib.SocketTransportation()
#     expect(Object::toString.call socketransport).toEqual '[object Object]'
#
#  it "url can't be empty,should return false",->
#      socketransport = new RongIMLib.SocketTransportation()
#      socket = socketransport.createTransport "119.254.108.75:8103/websocket?appId=cpj2xarlj5cdn&token=dXOJIInqKDahrpig%2BTJcq3U1lgYP6zEv1OpCrfDse9JiBi4BNyqa2MRus3mUdaZlHmSaXaVmp5%2FyPASY0%2FfWWKnbNZUuYfcE&sdkVer=1.0.0&apiVer=1.0.0"
#      expect(socketransport.url).not.toEqual("")
#
#  it "should return WebScoket object", ->
#     socketransport = new RongIMLib.SocketTransportation()
#     socket = socketransport.createTransport "119.254.108.75:8103/websocket?appId=cpj2xarlj5cdn&token=dXOJIInqKDahrpig%2BTJcq3U1lgYP6zEv1OpCrfDse9JiBi4BNyqa2MRus3mUdaZlHmSaXaVmp5%2FyPASY0%2FfWWKnbNZUuYfcE&sdkVer=1.0.0&apiVer=1.0.0"
#     expect(Object::toString.call socket).toEqual '[object WebSocket]'
#
#  it "connected should return true",(done)->
#     socketransport = new RongIMLib.SocketTransportation()
#     socket = socketransport.createTransport "119.254.108.75:8103/websocket?appId=cpj2xarlj5cdn&token=dXOJIInqKDahrpig%2BTJcq3U1lgYP6zEv1OpCrfDse9JiBi4BNyqa2MRus3mUdaZlHmSaXaVmp5%2FyPASY0%2FfWWKnbNZUuYfcE&sdkVer=1.0.0&apiVer=1.0.0"
#     setTimeout(->
#         expect(socketransport.connected).toBe true
#         done();
#     ,100)
#
#  it "isClose should return true",(done)->
#      socketransport = new RongIMLib.SocketTransportation()
#      socket = socketransport.createTransport "119.254.108.75:8103/websocket?appId=cpj2xarlj5cdn&token=dXOJIInqKDahrpig%2BTJcq3U1lgYP6zEv1OpCrfDse9JiBi4BNyqa2MRus3mUdaZlHmSaXaVmp5%2FyPASY0%2FfWWKnbNZUuYfcE&sdkVer=1.0.0&apiVer=1.0.0"
#      setTimeout(->
#           socketransport.disconnect()
#           expect(socketransport.isClose).toEqual true
#           done();
#      ,200)
