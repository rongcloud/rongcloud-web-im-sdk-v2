module RongIMLib {
    /**
     * 消息基类
     */
    export class BaseMessage {
        _name = "BaseMessage";
        _header: Header;
        _headerCode: any;
        lengthSize = 0;
        ConnectMessage: ConnectMessage;
        PublishMessage: PublishMessage;
        QueryMessage: QueryMessage;
        PingReqMessage: PingReqMessage;
        PingRespMessage: PingRespMessage;
        DisconnectMessage: DisconnectMessage;
        constructor(argu) {
            if (argu instanceof Header) {
                this._header = argu
            } else {
                this._header = new Header(argu, false, Qos.AT_MOST_ONCE, false);
            }
        }
        read(In: any, length: number) {
            this.readMessage(In, length);
        }
        write(Out: any): any {
            var binaryHelper = new BinaryHelper();
            var out = binaryHelper.convertStream(Out);
            this._headerCode = this.getHeaderFlag();
            out.write(this._headerCode);
            this.writeMessage(out);
            return out
        }
        getHeaderFlag(): any {
            return this._header.encode();
        }
        getLengthSize() {
            return this.lengthSize;
        }
        toBytes() {
            return this.write([]).getBytesArray();
        }
        setRetained(retain: any) {
            this._header.retain = retain;
        }
        isRetained() {
            return this._header.retain
        }
        setQos(qos) {
            //this._header.qos = qos instanceof Qos ? qos : Qos.setValue(qos);
            //TODO 枚举setValue()方法未实现
        }
        getQos() {
            return this._header.qos;
        }
        setDup(dup: boolean) {
            this._header.dup = dup;
        }
        isDup() {
            return this._header.dup
        }
        getType() {
            return this._header.type
        }
        messageLength() {
            return 0;
        }
        writeMessage(out: any) {
        }
        readMessage(In: any, length: number) {
        }
        init(args: any) {
            var valName: string, nana: any;
            for (nana in args) {
                if (!args.hasOwnProperty(nana))
                    continue;
                valName = nana.replace(/^\w/, function(x) {
                    var tt = x.charCodeAt(0);
                    return 'set' + (tt >= 0x61 ? String.fromCharCode(tt & ~32) : x)
                });
                if (valName in this) {
                    this[valName](args[nana])
                }
            }
        }

    }
    /**
     *连接消息信令
     */
    export class ConnectMessage {
        _name: string = "ConnectMessage";
        CONNECT_HEADER_SIZE = 12;
        protocolId = "RCloud";
        binaryHelper: BinaryHelper = new BinaryHelper();
        protocolVersion = 3;
        clientId: any;
        keepAlive: any;
        appId: any;
        token: any;
        cleanSession: any;
        willTopic: any;
        will: any;
        willQos: any;
        retainWill: any;
        hasAppId: any;
        hasToken: any;
        hasWill: any;
        constructor(header: RongIMLib.Header) {
            switch (arguments.length) {
                case 0:
                    Message.call(this, Type.CONNECT);
                    break;
                case 1:
                    Message.call(this, arguments[0]);
                    break;
                case 3:
                    Message.call(this, Type.CONNECT);
                    if (!arguments[0] || arguments[0].length > 64) {
                        throw new Error("ConnectMessage:Client Id cannot be null and must be at most 64 characters long: " + arguments[0])
                    }
                    this.clientId = arguments[0];
                    this.cleanSession = arguments[1];
                    this.keepAlive = arguments[2];
                    break;
            }
            BaseMessage.prototype.ConnectMessage = this;
        }
        messageLength(): number {
            var payloadSize = this.binaryHelper.toMQttString(this.clientId).length;
            payloadSize += this.binaryHelper.toMQttString(this.willTopic).length;
            payloadSize += this.binaryHelper.toMQttString(this.will).length;
            payloadSize += this.binaryHelper.toMQttString(this.appId).length;
            payloadSize += this.binaryHelper.toMQttString(this.token).length;
            return payloadSize + this.CONNECT_HEADER_SIZE;
        }
        readMessage(In: any) {
            var stream = this.binaryHelper.convertStream(In);
            this.protocolId = stream.readUTF();
            this.protocolVersion = stream.readByte();
            var cFlags = stream.readByte();
            this.hasAppId = (cFlags & 128) > 0;
            this.hasToken = (cFlags & 64) > 0;
            this.retainWill = (cFlags & 32) > 0;
            this.willQos = cFlags >> 3 & 3;
            this.hasWill = (cFlags & 4) > 0;
            this.cleanSession = (cFlags & 32) > 0;
            this.keepAlive = stream.read() * 256 + stream.read();
            this.clientId = stream.readUTF();
            if (this.hasWill) {
                this.willTopic = stream.readUTF();
                this.will = stream.readUTF()
            }
            if (this.hasAppId) {
                try {
                    this.appId = stream.readUTF()
                } catch (ex) {
                }
            }
            if (this.hasToken) {
                try {
                    this.token = stream.readUTF()
                } catch (ex) {
                }
            }
            return stream
        }
        writeMessage(out) {
            var stream = this.binaryHelper.convertStream(out);
            stream.writeUTF(this.protocolId);
            stream.write(this.protocolVersion);
            var flags = this.cleanSession ? 2 : 0;
            flags |= this.hasWill ? 4 : 0;
            flags |= this.willQos ? this.willQos >> 3 : 0;
            flags |= this.retainWill ? 32 : 0;
            flags |= this.hasToken ? 64 : 0;
            flags |= this.hasAppId ? 128 : 0;
            stream.write(flags);
            stream.writeChar(this.keepAlive);
            stream.writeUTF(this.clientId);
            if (this.hasWill) {
                stream.writeUTF(this.willTopic);
                stream.writeUTF(this.will)
            }
            if (this.hasAppId) {
                stream.writeUTF(this.appId)
            }
            if (this.hasToken) {
                stream.writeUTF(this.token)
            }
            return stream
        }
    }
    /**
     *
     */
    export class ConnAckMessage {
        constructor(header: RongIMLib.Header) {

        }

    }
    /**
     *断开消息信令
     */
    export class DisconnectMessage {
        _name: string = "DisconnectMessage"
        status: any;
        MESSAGE_LENGTH: number = 2;
        binaryHelper: BinaryHelper = new BinaryHelper();
        constructor(header: RongIMLib.Header) {
            if (header instanceof Header) {
                Message.call(this, header)
            } else {
                Message.call(this, Type.DISCONNECT);
                // TODO
                // if (header instanceof RongIMLib.DisconnectionStatus) {
                //     this.status = header
                // }
            }
            BaseMessage.prototype.DisconnectMessage = this;
        }
        messageLength(): number {
            return this.MESSAGE_LENGTH;
        }
        readMessage = function(In) {
            var _in = this.binaryHelper.convertStream(In);
            _in.read();
            var result = +_in.read();
            if (result >= 0 && result <= 5) {
                this.setStatus(result);
            } else {
                throw new Error("Unsupported CONNACK code:" + result)
            }
        }
        writeMessage(Out) {
            var out = this.binaryHelper.convertStream(Out);
            out.write(0);
            if (+status >= 1 && +status <= 3) {
                out.write((+status) - 1);
            } else {
                throw new Error("Unsupported CONNACK code:" + status)
            }
        }
        setStatus(x) {
            //TODO
            //status = x instanceof DisconnectionStatus ? x : DisconnectionStatus.setValue(x);
        };
        getStatus() {
            return this.status;
        };
    }
    /**
     *请求消息信令
     */
    export class PingReqMessage {
        _name: string = "PingReqMessage";
        constructor(header?: RongIMLib.Header) {
            if (header && header instanceof Header) {
                Message.call(this, header)
            } else {
                Message.call(this, Type.PINGREQ)
            }
            BaseMessage.prototype.PingReqMessage = this;
        }
    }
    /**
     *响应消息信令
     */
    export class PingRespMessage {
        _name: string = "PingRespMessage";
        constructor(header: RongIMLib.Header) {
            if (header && header instanceof Header) {
                Message.call(this, header);
            } else {
                Message.call(this, Type.PINGRESP);
            }
            BaseMessage.prototype.PingRespMessage = this;
        }
    }
    /**
     *
     */
    export class RetryableMessage {
        constructor(header: RongIMLib.Header) {

        }
    }
    /**
     *
     */
    export class PubAckMessage {
        constructor(header: RongIMLib.Header) {

        }
    }
    /**
     *发送消息信令
     */
    export class PublishMessage {
        _name = "PublishMessage";
        topic: any;
        data: any;
        targetId: string;
        date: any;
        binaryHelper: BinaryHelper = new BinaryHelper();
        constructor(header: RongIMLib.Header, two?: any, three?: any) {
            if (arguments.length == 1 && header instanceof Header) {
                RetryableMessage.call(this, header)
            } else {
                if (arguments.length == 3) {
                    RetryableMessage.call(this, Type.PUBLISH);
                    this.topic = header;
                    this.targetId = three;
                    this.data = typeof two == "string" ? this.binaryHelper.toMQttString(two) : two;
                }
            }
            BaseMessage.prototype.PublishMessage = this;
        }
        messageLength() {
            var length = 10;
            length += this.binaryHelper.toMQttString(this.topic).length;
            length += this.binaryHelper.toMQttString(this.targetId).length;
            length += this.data.length;
            return length;
        }
        writeMessage(Out: any) {
            var out = this.binaryHelper.convertStream(Out);
            out.writeUTF(this.topic);
            out.writeUTF(this.targetId);
            PublishMessage.prototype.writeMessage.apply(this, arguments);
            out.write(this.data)
        };
        readMessage(In: any, msgLength: number) {
            var pos = 6,
                _in = this.binaryHelper.convertStream(In);
            this.date = _in.readUint();
            this.topic = _in.readUTF();
            pos += this.binaryHelper.toMQttString(this.topic).length;
            PublishMessage.prototype.readMessage.apply(this, arguments);
            this.data = new Array(msgLength - pos);
            _in.read(this.data)
        };
        setTopic(x: any) {
            this.topic = x;
        }
        setData(x: any) {
            this.data = x;
        }
        setTargetId(x: any) {
            this.targetId = x;
        }
        setDate(x: any) {
            this.date = x;
        }
        getTopic() {
            return this.topic;
        }
        getData() {
            return this.data;
        }
        getTargetId() {
            return this.targetId;
        }
        getDate() {
            return this.date;
        }
    }
    /**
     *查询消息信令
     */
    export class QueryMessage {
        topic: any;
        data: any;
        targetId: any;
        binaryHelper: BinaryHelper = new BinaryHelper();
        constructor(header: RongIMLib.Header, two?:any, three?:any) {
            if (header instanceof Header) {
                RetryableMessage.call(this, header);
            } else {
                if (arguments.length == 3) {
                    RetryableMessage.call(this, Type.QUERY);
                    this.data = typeof two == "string" ? this.binaryHelper.toMQttString(two) : two;
                    this.topic = header;
                    this.targetId = three;
                }
            }
        }
        messageLength(): number {
            var length = 0;
            length += this.binaryHelper.toMQttString(this.topic).length;
            length += this.binaryHelper.toMQttString(this.targetId).length;
            length += 2;
            length += this.data.length;
            return length
        }
        writeMessage(Out) {
            var out = this.binaryHelper.convertStream(Out);
            out.writeUTF(this.topic);
            out.writeUTF(this.targetId);
            this.constructor.prototype.writeMessage.call(this, out);
            out.write(this.data)
        }
        readMessage = function(In, msgLength) {
            var pos = 0, _in = this.binaryHelper.convertStream(In);
            this.topic = _in.readUTF();
            this.targetId = _in.readUTF();
            pos += this.binaryHelper.toMQttString(this.topic).length;
            pos += this.binaryHelper.toMQttString(this.targetId).length;
            this.constructor.prototype.readMessage.apply(this, arguments);
            pos += 2;
            this.data = new Array(msgLength - pos);
            _in.read(this.data)
        }
        setTopic(x) {
            this.topic = x;
        }
        setData(x) {
            this.data = x;
        }
        setTargetId(x) {
            this.targetId = x;
        }
        getTopic() {
            return this.topic;
        }
        getData() {
            return this.data;
        }
        getTargetId() {
            return this.targetId;
        }
    }
    /**
     *
     */
    export class QueryConMessage {
        constructor(header: RongIMLib.Header) {

        }
    }
    /**
     *
     */
    export class QueryAckMessage {
        constructor(header: RongIMLib.Header) {

        }
    }
}
