module RongIMLib {
    export class FeaturePatcher {
        patchAll(): void {
            this.patchJSON();
            this.patchForEach();
        }
        patchForEach(): void {
            if (!Array.forEach) {
                Array.forEach = function(arr: any, func: any) {
                    for (var i = 0; i < arr.length; i++) {
                        func.call(arr, arr[i], i, arr);
                    }
                };
            }
        }
        patchJSON(): void {
            if (!window["JSON"]) {
                window["JSON"] = class JSON {
                    static parse(sJSON: string): any {
                        return eval('(' + sJSON + ')');
                    }
                    static stringify(value: any): string {
                        var toString = Object.prototype.toString;
                        var isArray = Array.isArray || function(a) {
                            return toString.call(a) === '[object Array]';
                        }, escMap: any = {
                            '"': '\\"',
                            '\\': '\\\\',
                            '\b': '\\b',
                            '\f': '\\f',
                            '\n': '\\n',
                            '\r': '\\r',
                            '\t': '\\t'
                        }, escFunc = function(m: any) {
                            return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1);
                        }, escRE: any = new RegExp('[\\"-]', 'g');
                        if (value == null) {
                            return 'null';
                        } else if (typeof value === 'number') {
                            return isFinite(value) ? value.toString() : 'null';
                        } else if (typeof value === 'boolean') {
                            return value.toString();
                        } else if (typeof value === 'object') {
                            if (typeof value.toJSON === 'function') {
                                return window["JSON"].stringify(value.toJSON());
                            } else if (isArray(value)) {
                                var res = '[';
                                for (var i = 0, len = value.length; i < len; i++)
                                    res += (i ? ', ' : '') + window["JSON"].stringify(value[i]);
                                return res + ']';
                            } else if (toString.call(value) === '[object Object]') {
                                var tmp: any = [];
                                for (var k in value) {
                                    if (value.hasOwnProperty(k))
                                        tmp.push(window["JSON"].stringify(k) + ': ' + window["JSON"].stringify(value[k]));
                                }
                                return '{' + tmp.join(', ') + '}';
                            }
                        }
                        return '"' + value.toString().replace(escRE, escFunc) + '"';
                    }
                }
            }
        }
    }
}
