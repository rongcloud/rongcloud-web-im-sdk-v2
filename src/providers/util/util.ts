
module RongIMLib {

    export class PublicServiceMap {
        publicServiceList: Array<any>;
        constructor() {
            this.publicServiceList = [];
        }
        get(publicServiceType: ConversationType, publicServiceId: string): PublicServiceProfile {
            for (let i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (this.publicServiceList[i].conversationType == publicServiceType && publicServiceId == this.publicServiceList[i].publicServiceId) {
                    return this.publicServiceList[i];
                }
            }
        }
        add(publicServiceProfile: PublicServiceProfile) {
            var isAdd: boolean = true, me = this;
            for (let i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (me.publicServiceList[i].conversationType == publicServiceProfile.conversationType && publicServiceProfile.publicServiceId == me.publicServiceList[i].publicServiceId) {
                    this.publicServiceList.unshift(this.publicServiceList.splice(i, 1)[0]);
                    isAdd = false;
                    break;
                }
            }
            if (isAdd) {
                this.publicServiceList.unshift(publicServiceProfile);
            }
        }
        replace(publicServiceProfile: PublicServiceProfile) {
            var me = this;
            for (let i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (me.publicServiceList[i].conversationType == publicServiceProfile.conversationType && publicServiceProfile.publicServiceId == me.publicServiceList[i].publicServiceId) {
                    me.publicServiceList.splice(i, 1, publicServiceProfile);
                    break;
                }
            }
        }
        remove(conversationType: ConversationType, publicServiceId: string) {
            var me = this;
            for (let i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (me.publicServiceList[i].conversationType == conversationType && publicServiceId == me.publicServiceList[i].publicServiceId) {
                    this.publicServiceList.splice(i, 1);
                    break;
                }
            }
        }
    }
    /**
     * 会话工具类。
     */
    export class ConversationMap {
        conversationList: Array<Conversation>;
        constructor() {
            this.conversationList = [];
        }
        get(conversavtionType: number, targetId: string): Conversation {
            for (let i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType == conversavtionType && this.conversationList[i].targetId == targetId) {
                    return this.conversationList[i];
                }
            }
            return null;
        }
        add(conversation: Conversation): void {
            var isAdd: boolean = true;
            for (let i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {
                    this.conversationList.unshift(this.conversationList.splice(i, 1)[0]);
                    isAdd = false;
                    break;
                }
            }
            if (isAdd) {
                this.conversationList.unshift(conversation);
            }
        }
        /**
         * [replace 替换会话]
         * 会话数组存在的情况下调用add方法会是当前会话被替换且返回到第一个位置，导致用户本地一些设置失效，所以提供replace方法
         */
        replace(conversation: Conversation) {
            for (let i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {
                    this.conversationList.splice(i, 1, conversation);
                    break;
                }
            }
        }
        remove(conversation: Conversation) {
            for (let i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {
                    this.conversationList.splice(i, 1);
                    break;
                }
            }
        }
    }

    export class CheckParam {
        static _instance: CheckParam;
        static getInstance(): CheckParam {
            if (!CheckParam._instance) {
                CheckParam._instance = new CheckParam();
            }
            return CheckParam._instance;
        }

        logger(code: any, funcName: string, msg: string) {
            RongIMClient.logger({
                code: code,
                funcName: funcName,
                msg: msg
            });
        }

        check(f: any, position: string, d?: any, c?: any) {
            if (RongIMClient._dataAccessProvider || d) {
                for (var g = 0, e = c.length; g < e; g++) {
                    if (!new RegExp(this.getType(c[g])).test(f[g])) {
                        // throw new Error("The index of " + g + " parameter was wrong type " + this.getType(c[g]) + " [" + f[g] + "] -> position:" + position);
                        var msg = "第" + (g + 1) + "个参数错误, 错误类型：" + this.getType(c[g]) + " [" + f[g] + "] -> 位置:" + position;
                        this.logger("-3", position, msg);
                    }
                }
            } else {
                var msg = "该参数不正确或尚未实例化RongIMClient -> 位置:" + position;
                this.logger("-4", position, msg);
                // throw new Error("The parameter is incorrect or was not yet instantiated RongIMClient -> position:" + position);
            }
        }
        getType(str: string): string {
            var temp = Object.prototype.toString.call(str).toLowerCase();
            return temp.slice(8, temp.length - 1);
        }
        checkCookieDisable(): boolean {
            document.cookie = "checkCookie=1";
            var arr = document.cookie.match(new RegExp("(^| )checkCookie=([^;]*)(;|$)")), isDisable = false;
            if (!arr) {
                isDisable = true;
            }
            document.cookie = "checkCookie=1;expires=Thu, 01-Jan-1970 00:00:01 GMT";
            return isDisable;
        }
    }
    export class LimitableMap {
        map: any;
        keys: any;
        limit: number;
        constructor(limit?: number) {
            this.map = {};
            this.keys = [];
            this.limit = limit || 10;
        }
        set(key: string, value: any): void {
            this.map[key] = value;
        }
        get(key: string): number {
            return this.map[key] || 0;
        }
        remove(key: string): void {
            delete this.map[key];
        }
    }

    export class MemoryCache {
        cache: any = {};
        set(key: string, value: any) {
            this.cache[key] = value;
        }
        get(key: string): any {
            return this.cache[key];
        }
        remove(key: string) {
            delete this.cache[key];
        }
    }

    export class RongAjax {
        options: any;
        xmlhttp: any;
        constructor(options: any) {
            var me = this;
            me.xmlhttp = null;
            me.options = options;
            var hasCORS = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
            if ("undefined" != typeof XMLHttpRequest && hasCORS) {
                me.xmlhttp = new XMLHttpRequest();
            } else if ("undefined" != typeof XDomainRequest) {
                me.xmlhttp = new XDomainRequest();
            } else {
                me.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        send(callback: any): void {
            var me = this;
            me.options.url || (me.options.url = "http://upload.qiniu.com/putb64/-1");
            me.xmlhttp.onreadystatechange = function () {
                if (me.xmlhttp.readyState == 4) {
                    if (me.options.type) {
                        callback();
                    } else {
                        callback(JSON.parse(me.xmlhttp.responseText.replace(/'/g, '"')));
                    }
                }
            };
            me.xmlhttp.open("POST", me.options.url, true);
            me.xmlhttp.withCredentials = false;
            if ("setRequestHeader" in me.xmlhttp) {
                if (me.options.type) {
                    me.xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
                } else {
                    me.xmlhttp.setRequestHeader("Content-type", "application/octet-stream");
                    me.xmlhttp.setRequestHeader('Authorization', "UpToken " + me.options.token);
                }
            }

            me.xmlhttp.send(me.options.type ? "appKey=" + me.options.appKey + "&deviceId=" + me.options.deviceId + "&timestamp=" + me.options.timestamp + "&deviceInfo=" + me.options.deviceInfo + "&privateInfo=" + JSON.stringify(me.options.privateInfo) : me.options.base64);
        }
    }

    export class RongUtil {
        static noop() { }
        static isEmpty(obj: any): boolean {
            var empty: boolean = true;
            for (var key in obj) {
                empty = false;
                break;
            }
            return empty;
        }
        static MD5(str: string, key?: string, raw?: string) {
            return md5(str, key, raw);
        }
        static isObject(obj: any) {
            return Object.prototype.toString.call(obj) == '[object Object]';
        }
        static isArray(array: any) {
            return Object.prototype.toString.call(array) == '[object Array]';
        }
        static isString(array: any) {
            return Object.prototype.toString.call(array) == '[object String]';
        }
        static isFunction(fun: any) {
            return Object.prototype.toString.call(fun) == '[object Function]';
        };
        static isUndefined(str: any) {
            return Object.prototype.toString.call(str) == '[object Undefined]';
        };
        static isEqual(a: any, b: any) {
            return a === b;
        };
        static indexOf(arrs: any, item: any) {
            var index = -1;
            for (var i = 0; i < arrs.length; i++) {
                if (item === arrs[i]) {
                    index = i;
                    break;
                }
            }
            return index;
        }
        static stringFormat(tmpl: string, vals: any) {
            for (var i = 0, len = vals.length; i < len; i++) {
                var val = vals[i], reg = new RegExp("\\{" + (i) + "\\}", "g");
                tmpl = tmpl.replace(reg, val);
            }
            return tmpl;
        }
        static tplEngine(temp: any, data: any, regexp?: any) {
            if (!(Object.prototype.toString.call(data) === "[object Array]")) {
                data = [data];
            }
            var ret: any[] = [];
            for (var i = 0, j = data.length; i < j; i++) {
                ret.push(replaceAction(data[i]));
            }
            return ret.join("");

            function replaceAction(object: any) {
                return temp.replace(regexp || (/{([^}]+)}/g), function (match: any, name: any) {
                    if (match.charAt(0) == '\\') {
                        return match.slice(1);
                    }
                    return (object[name] != undefined) ? object[name] : '{' + name + '}';
                });
            }
        };
        static forEach(obj: any, callback: Function) {
            callback = callback || RongUtil.noop;
            var loopObj = function () {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        callback(obj[key], key, obj);
                    }
                }
            };
            var loopArr = function () {
                for (var i = 0, len = obj.length; i < len; i++) {
                    callback(obj[i], i);
                }
            };
            if (RongUtil.isObject(obj)) {
                loopObj();
            }
            if (RongUtil.isArray(obj)) {
                loopArr();
            }
        }
        static extend(source: any, target: any, callback?: any, force?: boolean) {
            RongUtil.forEach(source, function (val: any, key: string) {
                var hasProto = (key in target);
                if (force && hasProto) {
                    target[key] = val;
                }
                if (!hasProto) {
                    target[key] = val;
                }
            });
            return target;
        }
        static createXHR() {
            var item: { [key: string]: any } = {
                XMLHttpRequest: function () {
                    return new XMLHttpRequest();
                },
                XDomainRequest: function () {
                    return new XDomainRequest();
                },
                ActiveXObject: function () {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }
            };
            var isXHR = (typeof XMLHttpRequest == 'function');
            var isXDR = (typeof XDomainRequest == 'function');
            var key = isXHR ? 'XMLHttpRequest' : isXDR ? 'XDomainRequest' : 'ActiveXObject'
            return item[key]();
        }
        static request(opts: any) {
            var url = opts.url;
            var success = opts.success;
            var error = opts.error;
            var method = opts.method || 'GET';
            var xhr = RongUtil.createXHR();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var status = xhr.status;
                    if (status == 200) {
                        success(xhr.responseText);
                    } else {
                        error(status, xhr.responseText);
                    }
                }
            };
            xhr.open(method, url, true);
            xhr.send(null);
            return xhr;
        }
        static formatProtoclPath(config: any) {
            var path = config.path;
            var protocol = config.protocol;
            var tmpl = config.tmpl || '{0}{1}';
            var sub = config.sub;

            var flag = '://';
            var index = path.indexOf(flag);
            var hasProtocol = (index > -1);

            if (hasProtocol) {
                index += flag.length;
                path = path.substring(index);
            }
            if (sub) {
                index = path.indexOf('/');
                var hasPath = (index > -1);
                if (hasPath) {
                    path = path.substr(0, index);
                }
            }
            return RongUtil.stringFormat(tmpl, [protocol, path]);
        };

        static supportLocalStorage(): boolean {
            var support = false;
            if (typeof localStorage == 'object') {
                try {
                    var key = 'RC_TMP_KEY', value = 'RC_TMP_VAL';
                    localStorage.setItem(key, value);
                    var localVal = localStorage.getItem(key);
                    if (localVal == value) {
                        support = true;
                    }
                } catch (err) {
                    console.log('localStorage is disabled.');
                }

            }
            return support;
        }
        /*
            //返回新引用，不破坏原始对象
            rename({n: 'martin'}, {n: 'name'}); => {name: 'martin'}
            rename([{n: 'martin'}, {a: 18}], {n: 'name', a: 'age'});
            => [{name: 'martin'}, {age: 18}]
        */
        static rename(origin: any, newNames: any): any {
            var isObject = RongUtil.isObject(origin);
            if (isObject) {
                origin = [origin];
            }
            origin = JSON.parse(JSON.stringify(origin));
            var updateProperty = function (val: any, key: string, obj: any) {
                delete obj[key];
                key = newNames[key];
                obj[key] = val;
            };
            RongUtil.forEach(origin, function (item: any) {
                RongUtil.forEach(item, function (val: any, key: string, obj: any) {
                    var isRename = (key in newNames);
                    (isRename ? updateProperty : RongUtil.noop)(val, key, obj);
                });
            });
            return isObject ? origin[0] : origin;
        }

        static some(arrs: any, callback: Function): boolean {
            var has: boolean = false;
            for (var i = 0, len = arrs.length; i < len; i++) {
                if (callback(arrs[i])) {
                    has = true;
                    break;
                }
            }
            return has;
        }

        static keys(obj: any): string[] {
            var props: string[] = [];
            for (var key in obj) {
                props.push(key);
            }
            return props;
        }

        static isNumber(num: number): boolean {
            return Object.prototype.toString.call(num) == '[object Number]';
        }

        static getTimestamp(): number {
            var date = new Date();
            return date.getTime()
        }
        static isSupportRequestHeaders(): boolean {
            var userAgent = navigator.userAgent;
            var isIE = (<any>window).ActiveXObject || 'ActiveXObject' in window;
            if (isIE) {
                var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp['$1']);
                return fIEVersion > 9;
            }
            return true;
        }
    }
    /*
        var observer = new RongObserver();
        observer.watch({
            key: 'key',
            func: function(entity){
                
            }
        });

    */
    export class RongObserver {
        watchers: { [key: string]: any } = {};
        genUId(key: string): string {
            var time = new Date().getTime();
            return [key, time].join('_');
        }
        watch(params: any): void {
            var me = this;
            var key = params.key;
            var multiple = params.multiple;
            key = RongUtil.isArray(key) ? key : [key];
            var func = params.func;
            RongUtil.forEach(key, function (k: any) {
                k = multiple ? me.genUId(k) : k;
                me.watchers[k] = func;
            });
        }
        notify(params: any): void {
            var me = this;
            var key = params.key;
            var entity = params.entity;
            for (var k in me.watchers) {
                var isNotify = (k.indexOf(key) == 0);
                if (isNotify) {
                    me.watchers[k](entity);
                }
            }
        }
        remove(): void {

        }
    }

    export class Observer {
        observers: any[] = [];
        add(observer: any, force?: any) {
            if (force) {
                this.observers = [observer];
            }
            this.observers.push(observer);
        }
        clear() {
            this.observers = [];
        }
        emit(data: any) {
            RongUtil.forEach(this.observers, function (observer: any) {
                observer(data);
            });
        }
    }

    export class Timer {
        timeout: number = 0;
        timers: any = [];
        constructor(config: any) {
            this.timeout = config.timeout;
        }
        resume(callback: Function) {
            var timer = setTimeout(callback, this.timeout);
            this.timers.push(timer);
        }
        pause() {
            RongUtil.forEach(this.timers, function (timer: number) {
                clearTimeout(timer);
            });
        }
    }

    export class IndexTools {
        items: any = [];
        index: number = 0;
        onwheel: Function = function () { };
        constructor(config: any) {
            this.items = config.items;
            this.onwheel = config.onwheel;
        }
        get() {
            var context = this;
            var items = context.items;
            var index = context.index;
            var isWheel = index >= items.length;
            if (isWheel) {
                context.onwheel();
            }
            return isWheel ? 0 : index;
        }
        add() {
            this.index += 1;
        }
    }

    export class InnerUtil {
        static getUId(token: string) {
            return md5(token).slice(8, 16)
        }
    }
}
