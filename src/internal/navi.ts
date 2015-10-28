module RongIMLib {
    export class Navigate {
        static Endpoint: any = new Object
        constructor() {
            window.getServerEndpoint = function(x: any) {
                //把导航返回的server字段赋值给CookieHelper._host，因为flash widget需要使用
                RongIMClient._storageProvider._host = Navigate.Endpoint.host = x["server"];
                // Navigate.Endpoint.userId = x.userId;
                //替换本地存储的导航信息
                var temp = RongIMClient._storageProvider.getItemKey("navi");
                temp !== null && RongIMClient._storageProvider.removeItem(temp);
                RongIMClient._storageProvider.setItem("navi" + MD5(RongIMLib.Bridge._client.token).slice(8, 16), x["server"] + "," + (x.userId || ""));
            }
        }
        connect(appId?: string, token?: string, callback?: any) {
            var oldAppId = RongIMClient._storageProvider.getItem("appId");
            //如果appid和本地存储的不一样，清空所有本地存储数据
            if (oldAppId && oldAppId != appId) {
                RongIMClient._storageProvider.clearItem();
                RongIMClient._storageProvider.setItem("appId", appId);
            }
            if (!oldAppId) {
                RongIMClient._storageProvider.setItem("appId", appId);
            }
            var client = new Client(token, appId);
            var me = this;
            this.getServerEndpoint(token, appId, function() {
                client.connect(callback);
            }, callback.OnError, true)
            return client;
        }
        getServerEndpoint(_token: string, _appId: string, _onsuccess?: any, _onerror?: any, unignore?: any) {
            if (unignore) {
                //根据token生成MD5截取8-16下标的数据与本地存储的导航信息进行比对
                //如果信息和上次的通道类型都一样，不执行navi请求，用本地存储的导航信息连接服务器
                var naviStr = MD5(_token).slice(8, 16),
                    _old = RongIMClient._storageProvider.getItem(RongIMClient._storageProvider.getItemKey("navi")),
                    _new = RongIMClient._storageProvider.getItem("navi" + naviStr);
                if (_old == _new && _new !== null && RongIMClient._storageProvider.getItem("rongSDK") == Transports._TransportType) {
                    var obj = unescape(_old).split(",");
                    setTimeout(function() {
                        RongIMClient._storageProvider._host = Navigate.Endpoint.host = obj[0];
                        Navigate.Endpoint.userId = obj[1];
                        _onsuccess();
                    }, 500);
                    return;
                }
            }
            //导航信息，切换Url对象的key进行线上线下测试操作
            var Url: any = {
                //测试环境
                "navUrl-Debug": "http://119.254.111.49:9100/",
                //线上环境
                "navUrl-Release": "http://nav.cn.rong.io/"
            }, xss = document.createElement("script");
            //进行jsonp请求
            xss.src = Url["navUrl-Release"] + (window["WEB_XHR_POLLING"] ? "cometnavi.js" : "navi.js") + "?appId=" + _appId + "&token=" + encodeURIComponent(_token) + "&" + "callBack=getServerEndpoint&t=" + (new Date).getTime();
            document.body.appendChild(xss);
            xss.onerror = function() {
                _onerror(ConnectionState.TOKEN_INCORRECT);
            };
            if ("onload" in xss) {
                xss.onload = _onsuccess;
            } else {
                xss.onreadystatechange = function() {
                    xss.readyState == "loaded" && _onsuccess();
                }
            }
        }
    }
}
