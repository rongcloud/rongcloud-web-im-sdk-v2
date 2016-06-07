module RongIMLib {
    export class CookieProvider implements StorageProvider {
        _host: string;
        setItem(composedKey: string, object: any): void {
            // var exp = new Date();
            // exp.setTime(exp.getTime() + 15 * 24 * 3600 * 1000);
            document.cookie = composedKey + "=" + decodeURIComponent(object) + ";path=/;";
        }

        getItem(composedKey: string): string {
            if (composedKey) {
                composedKey = composedKey.replace(/\|/, "\\|");
            }
            var arr = document.cookie.match(new RegExp("(^| )" + composedKey + "=([^;]*)(;|$)"));
            if (arr != null) {
                return (arr[2]);
            }
            return null;
        }

        removeItem(composedKey: string): void {
            if (this.getItem(composedKey)) {
                document.cookie = composedKey + "=;path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT";
            }
        }

        getItemKey(regStr: string): any {
            var arrs = document.cookie.match(new RegExp("(^| )navi\\w+?=([^;]*)(;|$)")), val: string = "";
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
            var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
                for (var i = keys.length; i--;) {
                    //TODO 条件判断，不要删除用户自己的 cookie
                    document.cookie = keys[i] + "=0;path=/;expires=" + new Date(0).toUTCString();
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
