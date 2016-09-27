module RongIMLib {
    export class UserDataProvider implements StorageProvider {
        oPersist: any;
        opersistName: string = 'RongIMLib';
        keyManager: string = 'RongUserDataKeyManager';
        _host: string = "";
        prefix: string = "rong_";
        constructor() {
            this.oPersist = document.createElement("div");
            this.oPersist.style.display = "none";
            this.oPersist.style.behavior = "url('#default#userData')";
            document.body.appendChild(this.oPersist);
            this.oPersist.load(this.opersistName);
        }

        setItem(key: string, value: any): void {
            key && key.indexOf(this.prefix) == -1 && (key = this.prefix + key);
            this.oPersist.setAttribute(key, value);
            var keyNames: string = this.getItem(this.keyManager);
            keyNames ? keyNames.indexOf(key) == -1 && (keyNames += ',' + key) : (keyNames = key);
            this.oPersist.setAttribute(this.prefix + this.keyManager, keyNames);
            this.oPersist.save(this.opersistName);
        }

        getItem(key: string): string {
            key && key.indexOf(this.prefix) == -1 && (key = this.prefix + key);
            return key ? this.oPersist.getAttribute(key) : key;
        }

        removeItem(key: string): void {
            key && key.indexOf(this.prefix) == -1 && (key = this.prefix + key);
            this.oPersist.removeAttribute(key);
            this.oPersist.save(this.opersistName);
            var keyNames: string = this.getItem(this.keyManager), keyNameArray: string[] = keyNames && keyNames.split(',') || [];
            for (let i = 0, len = keyNameArray.length; i < len; i++) {
                if (keyNameArray[i] == key) {
                    keyNameArray.splice(i, 1);
                }
            }
            this.oPersist.setAttribute(this.prefix + this.keyManager, keyNameArray.join(','));
            this.oPersist.save(this.opersistName);
        }

        getItemKey(composedStr: string): string {
            var item: any = null, keyNames: string = this.getItem(this.keyManager), keyNameArray: string[] = keyNames && keyNames.split(',') || [], me = this;
            if (keyNameArray.length) {
                for (let i = 0, len = keyNameArray.length; i < len; i++) {
                    if (keyNameArray[i] && keyNameArray[i].indexOf(composedStr) > -1) {
                        item = keyNameArray[i];
                        break;
                    }
                }
            }
            return item;
        }

        clearItem(): void {
            var keyNames: string = this.getItem(this.keyManager), keyNameArray: string[] = [], me = this;
            keyNames && (keyNameArray = keyNames.split(','));
            if (keyNameArray.length) {
                for (let i = 0, len = keyNameArray.length; i < len; i++) {
                    keyNameArray[i] && me.removeItem(keyNameArray[i]);
                }
                me.removeItem(me.keyManager);
            }
        }

        onOutOfQuota(): number {
            return 10 * 1024 * 1024;
        }
    }
}
