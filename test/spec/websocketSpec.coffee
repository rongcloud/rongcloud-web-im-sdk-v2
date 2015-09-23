#测试方法
#用WebSDK1.0（以下简称：V1.0）的Sever作为测试Sever
#1、获取V1.0的URL
#2、用V2.0的通讯通道发送消息，V1.0接收消息（避免转换二进制等操作）
#3、验证：可互相收发消息为测试通过（通道畅通），后续完善细节
#PS:
#若其他机器测试，需要修改URL中所有内容
# 119.254.108.75:8203/websocket?messageid=43&header=82&sessionid=6e75790f-6743-4804-b4fa-00f668304a5d&topic=pullMsg&targetid=zhangsan
# 119.254.108.75:8203/pullmsg.js?sessionid=6e75790f-6743-4804-b4fa-00f668304a5d

# describe 'just checking', ->
#   it 'Test Socket zhangsan', ->
#     socketransport = new RongIMLib.SocketTransportation "119.254.108.75:8103/websocket?appId=cpj2xarlj5cdn&token=dXOJIInqKDahrpig%2BTJcq3U1lgYP6zEv1OpCrfDse9JiBi4BNyqa2MRus3mUdaZlHmSaXaVmp5%2FyPASY0%2FfWWKnbNZUuYfcE&sdkVer=1.0.0&apiVer=1.0.0"
#     socketransport.createTransport()
#     #测试内容为 “测试webSocket” （V1.0转换惹来）
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
describe 'just checking',->
  it 'Test Socket zhangsan',->
    polling = new RongIMLib.PollingTransportation "119.254.108.75:8203/websocket?messageid=43&header=82&sessionid=6e75790f-6743-4804-b4fa-00f668304a5d&topic=pullMsg&targetid=zhangsan"
    polling.createTransport();
