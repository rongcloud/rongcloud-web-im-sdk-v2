/// <reference path="../../dts/util.d.ts"/>
module RongIMLib {
    /**
     * 把消息对象写入流中
     * 发送消息时用到
     */
    export class MessageOutputStream {
        out: RongIMLib.RongIMStream;
        constructor(_out: any) {
            var binaryHelper = new RongIMLib.BinaryHelper();
            this.out = binaryHelper.convertStream(_out);
        }
        writeMessage(msg: RongIMLib.BaseMessage) {
            if (msg instanceof RongIMLib.BaseMessage) {
                msg.write(this.out);
            }
        }
    }
    /**
     * 流转换为消息对象
     * 服务器返回消息时用到
     */
    export class MessageInputStream {
        msg: any;
        flags: any;
        header: any;
        isPolling: boolean;
        In: any;
        _in: any;
        constructor(In: any, isPolling?: boolean) {
            if (!isPolling) {
                var _in = new RongIMLib.BinaryHelper().convertStream(In);
                this.flags = _in.readByte();
                this._in = _in;
            } else {
                this.flags = In["headerCode"]
            }
            this.header = new RongIMLib.Header(this.flags);
            this.isPolling = isPolling;
            this.In = In;
        }
        readMessage() {
            switch (this.header.getType()) {
                case 1:
                    this.msg = new ConnectMessage(this.header);
                    break;
                case 2:
                    this.msg = new ConnAckMessage(this.header);
                    break;
                case 3:
                    this.msg = new PublishMessage(this.header);
                    break;
                case 4:
                    this.msg = new PubAckMessage(this.header);
                    break;
                case 5:
                    this.msg = new QueryMessage(this.header);
                    break;
                case 6:
                    this.msg = new QueryAckMessage(this.header);
                    break;
                case 7:
                    this.msg = new QueryConMessage(this.header);
                    break;
                case 9:
                case 11:
                case 13:
                    this.msg = new PingRespMessage(this.header);
                    break;
                case 8:
                case 10:
                case 12:
                    this.msg = new PingReqMessage(this.header);
                    break;
                case 14:
                    this.msg = new DisconnectMessage(this.header);
                    break;
                default:
                    throw new Error("No support for deserializing " + this.header.getType() + " messages")
            }
            if (this.isPolling) {
                this.msg.init(this.In);
            } else {
                this.msg.read(this._in, this.In.length - 1);
            }
            return this.msg
        }
    }
    export class Header {
        type: number;
        retain: boolean = false;
        qos: any = Qos.AT_LEAST_ONCE;
        dup: boolean = false;
        constructor(_type: any, _retain?: any, _qos?: any, _dup?: any) {
            if (_type && +_type == _type && arguments.length == 1) {
                this.retain = (_type & 1) > 0;
                this.qos = (_type & 6) >> 1;
                this.dup = (_type & 8) > 0;
                this.type = (_type >> 4) & 15;
            } else {
                this.type = _type;
                this.retain = _retain;
                this.qos = _qos;
                this.dup = _dup;
            }
        }
        getType(): number {
            return this.type;
        }
        encode(): any {
            var _byte = (this.type << 4);
            _byte |= this.retain ? 1 : 0;
            _byte |= this.qos << 1;
            _byte |= this.dup ? 8 : 0;
            return _byte
        }
        toString(): string {
            return "Header [type=" + this.type + ",retain=" + this.retain + ",qos=" + this.qos + ",dup=" + this.dup + "]";
        }
    }
    /**
     * 二进制帮助对象
     */
    export class BinaryHelper {
        init(array: any): any {
            for (let i = 0, len = array.length; i < len; i++) {
                array[i] *= 1;
                if (array[i] < 0) {
                    array[i] += 256;
                }
            }
            return array;
        }

        writeUTF(str: string, isGetBytes?: any): any {
            var back: any = [], byteSize = 0;
            for (let i = 0, len = str.length; i < len; i++) {
                var code = str.charCodeAt(i);
                if (code >= 0 && code <= 127) {
                    byteSize += 1;
                    back.push(code);
                } else if (code >= 128 && code <= 2047) {
                    byteSize += 2;
                    back.push((192 | (31 & (code >> 6))));
                    back.push((128 | (63 & code)))
                } else if (code >= 2048 && code <= 65535) {
                    byteSize += 3;
                    back.push((224 | (15 & (code >> 12))));
                    back.push((128 | (63 & (code >> 6))));
                    back.push((128 | (63 & code)))
                }
            }
            for (let i = 0, len = back.length; i < len; i++) {
                if (back[i] > 255) {
                    back[i] &= 255
                }
            }
            if (isGetBytes) {
                return back
            }
            if (byteSize <= 255) {
                return [0, byteSize].concat(back);
            } else {
                return [byteSize >> 8, byteSize & 255].concat(back);
            }
        }
        readUTF(arr: any): string {
            if (Object.prototype.toString.call(arr) == "[object String]") {
                return arr;
            }
            var UTF = "", _arr = this.init(arr)
            for (let i = 0, len = _arr.length; i < len; i++) {
                var one = _arr[i].toString(2), v = one.match(/^1+?(?=0)/);
                if (v && one.length == 8) {
                    var bytesLength = v[0].length,
                        store = _arr[i].toString(2).slice(7 - bytesLength);
                    for (var st = 1; st < bytesLength; st++) {
                        store += _arr[st + i].toString(2).slice(2)
                    }
                    UTF += String.fromCharCode(parseInt(store, 2));
                    i += bytesLength - 1
                } else {
                    UTF += String.fromCharCode(_arr[i])
                }
            }
            return UTF;
        }
        /**
         * [convertStream 将参数x转化为RongIMStream对象]
         * @param  {any}    x [参数]
         * @return {[RongIMStream]}   [RongIMStream]
         */
        convertStream(x: any): RongIMLib.RongIMStream {
            if (x instanceof RongIMStream) {
                return x;
            } else {
                return new RongIMLib.RongIMStream(x)
            }
        }
        toMQttString(str: string): any {
            return this.writeUTF(str);
        }
    }
    export class RongIMStream {
        pool: any;
        //当前流执行的起始位置
        position = 0;
        //当前流写入的多少字节
        writen = 0;
        constructor(arr: any) {
            var binaryHelper = new RongIMLib.BinaryHelper();
            this.pool = binaryHelper.init(arr);
        }
        check(): boolean {
            return this.position >= this.pool.length;
        }
        baseRead(m: any, i: number, a: Array<any>) {
            var t = a ? a : [];
            for (var start = 0; start < i; start++) {
                t[start] = this.pool[m.position++]
            }
            return t
        }
        readInt(): any {
            if (this.check()) {
                return -1
            }
            var end = "";
            for (var i = 0; i < 4; i++) {
                end += this.pool[this.position++].toString(16)
            }
            return parseInt(end, 16);
        }
        readByte(): any {
            if (this.check()) {
                return -1
            }
            var val = this.pool[this.position++];
            if (val > 255) {
                val &= 255;
            }
            return val;
        }
        read(bytesArray?: any): any {
            if (this.check()) {
                return -1;
            }
            if (bytesArray) {
                this.baseRead(this, bytesArray.length, bytesArray)
            } else {
                return this.readByte();
            }
        }
        readUTF(): any {
            var big = (this.readByte() << 8) | this.readByte();
            return new BinaryHelper().readUTF(this.pool.slice(this.position, this.position += big));
        }
        write(_byte: any): any {
            var b = _byte;
            if (Object.prototype.toString.call(b).toLowerCase() == "[object array]") {
                [].push.apply(this.pool, b)
            } else {
                if (+b == b) {
                    if (b > 255) {
                        b &= 255;
                    }
                    this.pool.push(b);
                    this.writen++
                }
            }
            return b
        }
        writeChar(v: any): any {
            if (+v != v) {
                throw new Error("writeChar:arguments type is error")
            }
            this.write((v >> 8) & 255);
            this.write(v & 255);
            this.writen += 2
        }
        writeUTF(str: any): any {
            var val = new BinaryHelper().writeUTF(str);
            [].push.apply(this.pool, val);
            this.writen += val.length;
        }
        toComplements(): any {
            var _tPool = this.pool;
            for (var i = 0; i < _tPool.length; i++) {
                if (_tPool[i] > 128) {
                    _tPool[i] -= 256
                }
            }
            return _tPool
        }
        getBytesArray(isCom: boolean): any {
            if (isCom) {
                return this.toComplements()
            }
            return this.pool;
        }
    }
}
