module RongIMLib {
    export class CookieProvider implements StorageProvider {
        _host: string;
        prefix: string = 'rong_';
        setItem(composedKey: string, object: any, isSave?: boolean): void {
            if (composedKey.indexOf(this.prefix) == -1) {
                composedKey = this.prefix + composedKey;
            }
            if (isSave) {
                var exp = new Date();
                exp.setTime(exp.getTime() + 1 * 24 * 3600 * 1000);
                document.cookie = composedKey + "=" + decodeURIComponent(object) + ";path=/;expires=" + exp.toGMTString();
            } else {
                document.cookie = composedKey + "=" + decodeURIComponent(object) + ";path=/;";
            }
        }

        getItem(composedKey: string): string {
            if (composedKey) {
                if (composedKey.indexOf(this.prefix) == -1) {
                    composedKey = this.prefix + composedKey;
                }
                composedKey = composedKey.replace(/\|/, "\\|");
            }
            var arr = document.cookie.match(new RegExp("(^| )" + composedKey + "=([^;]*)(;|$)"));
            if (arr != null) {
                return (arr[2]);
            }
            return null;
        }

        removeItem(composedKey: string): void {
            if (composedKey.indexOf(this.prefix) == -1) {
                composedKey = this.prefix + composedKey;
            }
            if (this.getItem(composedKey)) {
                document.cookie = composedKey + "=;path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT";
            }
        }

        getItemKey(regStr: string): any {
            var arrs = document.cookie.match(new RegExp("(^| )rong_navi\\w+?=([^;]*)(;|$)")), val: string = "";
            if (arrs) {
                for (let i = 0, len = arrs.length; i < len; i++) {
                    if (arrs[i].indexOf(regStr) > -1) {
                        val = arrs[i];
                        break;
                    }
                }
            }
            return val ? val.split("=")[0].replace(/^\s/, "") : null;
        }
        clearItem(): void {
            var keys = document.cookie.match(/[^ =;]+(?=\=)/g), me = this;
            if (keys) {
                for (var i = keys.length; i--;) {
                    if (keys[i].indexOf(me.prefix) > -1) {
                        document.cookie = keys[i] + "=0;path=/;expires=" + new Date(0).toUTCString();
                    }
                }
            }
        }
        //单位：字节
        onOutOfQuota(): number {
            return 4 * 1024;
        }
    }

    export class MemeoryProvider implements StorageProvider {
        _host: string;
        _memeoryStore: any = {};
        prefix: string = "rong_";
        setItem(composedKey: string, object: any): void {
            this._memeoryStore[composedKey] = decodeURIComponent(object);
        }

        getItem(composedKey: string): string {
            return this._memeoryStore[composedKey];
        }

        removeItem(composedKey: string): void {
            if (this.getItem(composedKey)) {
                delete this._memeoryStore[composedKey];
            }
        }

        getItemKey(regStr: string): any {
            var me = this, item: any = null, reg = new RegExp(regStr + "\\w+");
            for (var key in me._memeoryStore) {
                var arr = key.match(reg);
                if (arr) {
                    item = key;
                }
            }
            return item;
        }
        clearItem(): void {
            var me = this;
            for (var key in me._memeoryStore) {
                delete me._memeoryStore[key];
            }
        }
        //单位：字节
        onOutOfQuota(): number {
            return 4 * 1024;
        }
    }
}
