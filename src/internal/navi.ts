module RongIMLib {
    export class Navigation {
        static Endpoint: any = new Object;
        static clear() {
            var storage = RongIMClient._storageProvider;
            storage.removeItem('rc_uid');
            storage.removeItem('serverIndex');
            storage.removeItem('rongSDK');
        }
        constructor() {
        }
        getNaviSuccess(result: any) {
            var storage = RongIMClient._storageProvider;
            storage.setItem('fullnavi', JSON.stringify(result));
            var server = result.server;
            if (server) {
                server += ','
            }
            var backupServer = result.backupServer || '';

            var tpl = '{server}{backupServer}';
            var servers: any = RongUtil.tplEngine(tpl, {
                server: server,
                backupServer: backupServer
            });

            servers = servers.split(',');
            storage.setItem('servers', JSON.stringify(servers));

            var token = RongIMClient._memoryStore.token;
            var uid = InnerUtil.getUId(token);
            storage.setItem('rc_uid', uid);

            var userId = result.userId;
            storage.setItem('current_user', userId);

            if (result.voipCallInfo) {
                var callInfo = JSON.parse(result.voipCallInfo);
                RongIMClient._memoryStore.voipStategy = callInfo.strategy;
                storage.setItem("voipStrategy", callInfo.strategy);
            }

            //替换本地存储的导航信息 
            var openMp = result.openMp;
            storage.setItem('openMp' + uid, openMp);
            RongIMClient._memoryStore.depend.openMp = openMp;
        };
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
            this.requestNavi(token, appId, function () {
                client.connect(callback);
            }, callback.onError, true);
            return client;
        }
        requestNavi(token: string, appId: string, _onsuccess?: any, _onerror?: any, unignore?: any) {
            if (unignore) {
                //根据token生成MD5截取8-16下标的数据与本地存储的导航信息进行比对
                //如果信息和上次的通道类型都一样，不执行navi请求，用本地存储的导航信息连接服务器
                var uId = md5(token).slice(8, 16);
                var storage = RongIMClient._storageProvider;
                var transportType = storage.getItem("rongSDK");
                var isSameType = (Transportations._TransportType == transportType);
                var _old = storage.getItem('rc_uid');
                var isSameUser = (_old == uId);
                var servers = storage.getItem('servers');
                var hasServers = (typeof servers == 'string')
                if (isSameUser && isSameType && hasServers) {
                    RongIMClient._memoryStore.voipStategy = storage.getItem("voipStrategy");
                    var openMp = storage.getItem('openMp' + uId);
                    RongIMClient._memoryStore.depend.openMp = openMp;
                    _onsuccess()
                    return;
                }
            }
            Navigation.clear();
            var StatusEvent = Channel._ConnectionStatusListener;

            var depend = RongIMClient._memoryStore.depend
            var navigaters = depend.navigaters;
            var naviTimeout = depend.naviTimeout;
            var maxNaviRetry = depend.maxNaviRetry;

            var context = this;
            var timer = new Timer({
                timeout: naviTimeout
            });
            var internalRetry = 1;
            var isRange = function () {
                return internalRetry >= maxNaviRetry;
            };
            var indexTools = new IndexTools({
                items: navigaters,
                onwheel: function () {
                    internalRetry += 1;
                }
            });
            var consume = function () {
                if (isRange()) {
                    _onerror(ConnectionStatus.RESPONSE_NAVI_ERROR);
                    return;
                }
                var index = indexTools.get();
                var navi = navigaters[index];
                indexTools.add();

                var success = function (result: any) {
                    timer.pause();
                    StatusEvent.onChanged(ConnectionStatus.RESPONSE_NAVI);
                    var code = result.code;
                    if (RongUtil.isEqual(code, 200)) {
                        context.getNaviSuccess(result);
                        _onsuccess();
                    }
                    if (RongUtil.isEqual(code, 401)) {
                        _onerror(ConnectionState.TOKEN_INCORRECT);
                    }
                    if (RongUtil.isEqual(code, 403)) {
                        StatusEvent.onChanged(ConnectionStatus.APPKEY_IS_FAKE);
                    }
                };
                var error = function (status: number) {
                    if (RongUtil.isEqual(status, 0)) {
                        return;
                    }
                    timer.pause();
                    StatusEvent.onChanged(ConnectionStatus.RESPONSE_NAVI_ERROR);
                    consume();
                };
                StatusEvent.onChanged(ConnectionStatus.REQUEST_NAVI);
                var xhr = context.request(navi, appId, token, success, error);
                timer.resume(function () {
                    StatusEvent.onChanged(ConnectionStatus.RESPONSE_NAVI_TIMEOUT);
                    xhr.abort();
                    consume();
                });
            };
            consume();
        }
        request(navi: string, appId: string, token: string, success: Function, error: Function): any {
            var depend = RongIMClient._memoryStore.depend;
            var path = (depend.isPolling ? 'cometnavi' : 'navi');
            token = encodeURIComponent(token);
            var sdkver = RongIMClient.sdkver;
            var random = RongUtil.getTimestamp();
            var tpl = '{navi}/{path}.js?appId={appId}&token={token}&callBack=null&v={sdkver}&r={random}';
            var url = RongUtil.tplEngine(tpl, {
                navi: navi,
                path: path,
                appId: appId,
                token: token,
                sdkver: sdkver,
                random: random
            });
            return RongUtil.request({
                url: url,
                success: function (result: string) {
                    result = result.replace('null(', '').replace(');', '');
                    success(JSON.parse(result));
                },
                error: function (status: number, result: string) {
                    if (status == 401 || status == 403) {
                        success(JSON.parse(result));
                    } else {
                        error(status);
                    }
                }
            });
        }
    }
}
