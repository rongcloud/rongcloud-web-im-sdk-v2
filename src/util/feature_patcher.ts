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
                    private static rx_escapable = new RegExp('[\\\"\\\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]', "g");
                    private static meta: any = {
                        "\b": "\\b",
                        "	": "\\t",
                        "\n": "\\n",
                        "\f": "\\f",
                        "\r": "\\r",
                        '"': '\\"',
                        "''": "\\''",
                        "\\": "\\\\"
                    };
                    static parse(sJSON: string): any {
                        return eval('(' + sJSON + ')');
                    }
                    static stringify(value: any): string {
                        return this.str("", { "": value });
                    }
                    static str(key: string, holder: any): string {
                        var i: any, k: any, v: string, length: number, mind = "", partial: any, value = holder[key], me = this;
                        if (value && typeof value === "object" && typeof value.toJSON === "function") {
                            value = value.toJSON(key);
                        }
                        switch (typeof value) {
                            case "string":
                                return me.quote(value);

                            case "number":
                                return isFinite(value) ? String(value) : "null";

                            case "boolean":
                            case "null":
                                return String(value);

                            case "object":
                                if (!value) {
                                    return "null";
                                }
                                partial = [];
                                if (Object.prototype.toString.apply(value) === "[object Array]") {
                                    length = value.length;
                                    for (i = 0; i < length; i += 1) {
                                        partial[i] = me.str(i, value) || "null";
                                    }
                                    v = partial.length === 0 ? "[]" : "[" + partial.join(",") + "]";
                                    return v;
                                }

                                for (k in value) {
                                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                                        v = me.str(k, value);
                                        if (v) {
                                            partial.push(me.quote(k) + ":" + v);
                                        }
                                    }
                                }
                                v = partial.length === 0 ? "{}" : "{" + partial.join(",") + "}";
                                return v;
                        }
                    }
                    static quote(string: any): string {
                          var me = this;
                          me.rx_escapable.lastIndex = 0;
                          return me.rx_escapable.test(string) ? '"' + string.replace(me.rx_escapable, function (a:any) {
                              var c = me.meta[a];
                              return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                          }) + '"' : '"' + string + '"';
                    }
                }
            }
        }
    }
}
