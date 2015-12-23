// TODO: 统一变量、方法等命名规范
module RongIMLib {
    /**
     * 消息基类
     */
    export class BaseMessage {
        _name = "BaseMessage";
        _header: Header;
        _headerCode: any;
        lengthSize: any = 0;
        constructor(arg: any) {
            if (arg instanceof Header) {
                this._header = arg;
            } else {
                this._header = new Header(arg, false, Qos.AT_MOST_ONCE, false);
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
            return out;
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
        isRetained() {
            return this._header.retain;
        }
        setRetained(retain: any) {
            this._header.retain = retain;
        }
        setQos(qos: any) {
            this._header.qos = Object.prototype.toString.call(qos) == "[object Object]" ? qos : Qos[qos];
        }
        setDup(dup: boolean) {
            this._header.dup = dup;
        }
        isDup() {
            return this._header.dup;
        }
        getType() {
            return this._header.type;
        }
        getQos() {
            return this._header.qos;
        }
        messageLength() {
            return 0;
        }
        writeMessage(out: any) { }
        readMessage(In: any, length: number) { }
        init(args: any) {
            var valName: any, nana: any, me: { [s: string]: any; } = this;
            for (nana in args) {
                if (!args.hasOwnProperty(nana)) {
                    continue;
                }

                valName = nana.replace(/^\w/, function(x: any) {
                    var tt = x.charCodeAt(0);
                    return "set" + (tt >= 0x61 ? String.fromCharCode(tt & ~32) : x);
                });
                if (valName in me) {
                    me[valName](args[nana]);
                }
            }
        }

    }
    /**
     *连接消息类型
     */
    export class ConnectMessage extends BaseMessage {
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
            super(arguments.length == 0 || arguments.length == 3 ? Type.CONNECT : arguments[0]);
            switch (arguments.length) {
                case 0:
                case 1:
                case 3:
                    if (!arguments[0] || arguments[0].length > 64) {
                        throw new Error("ConnectMessage:Client Id cannot be null and must be at most 64 characters long: " + arguments[0]);
                    }
                    this.clientId = arguments[0];
                    this.cleanSession = arguments[1];
                    this.keepAlive = arguments[2];
                    break;
            }
        }
        messageLength(): number {
            var payloadSize = this.binaryHelper.toMQttString(this.clientId).length;
            payloadSize += this.binaryHelper.toMQttString(this.willTopic).length;
            payloadSize += this.binaryHelper.toMQttString(this.will).length;
            payloadSize += this.binaryHelper.toMQttString(this.appId).length;
            payloadSize += this.binaryHelper.toMQttString(this.token).length;
            return payloadSize + this.CONNECT_HEADER_SIZE;
        }
        readMessage(stream: any) {
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
                this.will = stream.readUTF();
            }
            if (this.hasAppId) {
                try {
                    this.appId = stream.readUTF();
                } catch (ex) {
                    throw new Error(ex);
                }
            }
            if (this.hasToken) {
                try {
                    this.token = stream.readUTF();
                } catch (ex) {
                    throw new Error(ex);
                }
            }
            return stream;
        }
        writeMessage(out: any) {
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
                stream.writeUTF(this.will);
            }
            if (this.hasAppId) {
                stream.writeUTF(this.appId);
            }
            if (this.hasToken) {
                stream.writeUTF(this.token);
            }
            return stream;
        }
    }
    /**
     *连接应答类型
     */
    export class ConnAckMessage extends BaseMessage {
        _name: string = "ConnAckMessage";
        status: any;
        userId: string;
        MESSAGE_LENGTH = 2;
        binaryHelper: BinaryHelper = new BinaryHelper();
        constructor(header: any) {
            super(arguments.length == 0 ? Type.CONNACK : arguments.length == 1 ? arguments[0] instanceof Header ? arguments[0] : Type.CONNACK : null);
            var me = this;
            switch (arguments.length) {
                case 0:
                case 1:
                    if (!(arguments[0] instanceof Header)) {
                        if (arguments[0] in ConnectionState) {
                            if (arguments[0] == null) {
                                throw new Error("ConnAckMessage:The status of ConnAskMessage can't be null");
                            }
                            me.setStatus(arguments[0]);
                        }
                    }
                    break;
            }
        }
        messageLength(): number {
            var length = this.MESSAGE_LENGTH;
            if (this.userId) {
                length += this.binaryHelper.toMQttString(this.userId).length;
            }
            return length;
        }
        readMessage(_in: any, msglength: number) {
            _in.read();
            var result = +_in.read();
            if (result >= 0 && result <= 9) {
                this.setStatus(result);
            } else {
                throw new Error("Unsupported CONNACK code:" + result);
            }
            if (msglength > this.MESSAGE_LENGTH) {
                this.setUserId(_in.readUTF());
            }
        }
        writeMessage(out: any) {
            var stream = this.binaryHelper.convertStream(out);
            stream.write(128);
            switch (+status) {
                case 0:
                case 1:
                case 2:
                case 5:
                case 6:
                    stream.write(+status);
                    break;
                case 3:
                case 4:
                    stream.write(3);
                    break;
                default:
                    throw new Error("Unsupported CONNACK code:" + status);
            }
            if (this.userId) {
                stream.writeUTF(this.userId);
            }
            return stream;
        }
        setStatus(x: any) {
            this.status = x;
        }
        setUserId(_userId: string) {
            this.userId = _userId;
        }
        getStatus() {
            return this.status;
        }
        getUserId() {
            return this.userId;
        }
    }
    /**
     *断开消息类型
     */
    export class DisconnectMessage extends BaseMessage {
        _name: string = "DisconnectMessage";
        status: any;
        MESSAGE_LENGTH: number = 2;
        binaryHelper: BinaryHelper = new BinaryHelper();
        constructor(header: any) {
            super(header instanceof Header ? header : Type.DISCONNECT);
            if (!(header instanceof Header)) {
                if (header in RongIMLib.DisconnectionStatus) {
                    this.status = header;
                }
            }
        }
        messageLength(): number {
            return this.MESSAGE_LENGTH;
        }
        readMessage(_in: any) {
            _in.read();
            var result = +_in.read();
            if (result >= 0 && result <= 5) {
                this.setStatus(result);
            } else {
                throw new Error("Unsupported CONNACK code:" + result);
            }
        }
        writeMessage(Out: any) {
            var out = this.binaryHelper.convertStream(Out);
            out.write(0);
            if (+status >= 1 && +status <= 3) {
                out.write((+status) - 1);
            } else {
                throw new Error("Unsupported CONNACK code:" + status);
            }
        }
        setStatus(x: any) {
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
    export class PingReqMessage extends BaseMessage {
        _name: string = "PingReqMessage";
        constructor(header?: RongIMLib.Header) {
            super((header && header instanceof Header) ? header : Type.PINGREQ);
        }
    }
    /**
     *响应消息信令
     */
    export class PingRespMessage extends BaseMessage {
        _name: string = "PingRespMessage";
        constructor(header: RongIMLib.Header) {
            super((header && header instanceof Header) ? header : Type.PINGRESP);
        }
    }
    /**
     *封装MesssageId
     */
    export class RetryableMessage extends BaseMessage {
        _name: string = "RetryableMessage";
        messageId: any;
        binaryHelper: BinaryHelper = new BinaryHelper();
        constructor(argu: any) {
            super(argu);
        }
        messageLength(): number {
            return 2;
        }

        writeMessage(Out: any): any {
            var out = this.binaryHelper.convertStream(Out),
                Id = this.getMessageId(),
                lsb = Id & 255,
                msb = (Id & 65280) >> 8;
            out.write(msb);
            out.write(lsb);
            return out;
        }

        readMessage(_in: any, msgLength?: number) {
            var msgId = _in.read() * 256 + _in.read();
            this.setMessageId(parseInt(msgId, 10));
        }

        setMessageId(_messageId: number) {
            this.messageId = _messageId;
        }

        getMessageId(): any {
            return this.messageId;
        }
    }
    /**
     *发送消息应答（双向）
     *qos为1必须给出应答（所有消息类型一样）
     */
    export class PubAckMessage extends RetryableMessage {
        status: any;
        msgLen: number = 2;
        date: number = 0;
        millisecond: number = 0;
        messageUId: string;
        timestamp: number = 0;
        binaryHelper: BinaryHelper = new BinaryHelper();
        _name: string = "PubAckMessage";
        constructor(header: any) {
            super((header instanceof Header) ? header : Type.PUBACK);
            if (!(header instanceof Header)) {
                super.setMessageId(header);
            }
        }
        messageLength(): number {
            return this.msgLen;
        }
        writeMessage(Out: any) {
            var out = this.binaryHelper.convertStream(Out);
            RetryableMessage.prototype.writeMessage.call(this, out);
        }
        readMessage(_in: any, msgLength: number) {
            RetryableMessage.prototype.readMessage.call(this, _in);
            this.date = _in.readInt();
            this.status = _in.read() * 256 + _in.read();
            this.millisecond = _in.read() * 256 + _in.read();
            this.timestamp = this.date * 1000 + this.millisecond;
            this.messageUId = _in.readUTF();
        }
        setStatus(x: any) {
            this.status = x;
        }
        setTimestamp(timestamp: number) {
            this.timestamp = timestamp;
        }
        setMessageUId(messageUId:string) {
            this.messageUId = messageUId;
        }
        getStatus(): any {
            return this.status;
        }
        getDate(): number {
            return this.date;
        }
        getTimestamp(): number {
            return this.timestamp;
        }
        getMessageUId(): string {
            return this.messageUId;
        }
    }
    /**
     *发布消息
     */
    export class PublishMessage extends RetryableMessage {
        _name = "PublishMessage";
        topic: any;
        data: any;
        targetId: string;
        date: any;
        binaryHelper: BinaryHelper = new BinaryHelper();
        constructor(header: any, two?: any, three?: any) {
            super((arguments.length == 1 && header instanceof Header) ? header : arguments.length == 3 ? Type.PUBLISH : 0);
            if (arguments.length == 3) {
                this.topic = header;
                this.targetId = three;
                this.data = typeof two == "string" ? this.binaryHelper.toMQttString(two) : two;
            }
        }
        messageLength(): number {
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
            RetryableMessage.prototype.writeMessage.apply(this, arguments);
            out.write(this.data);
        };
        readMessage(_in: any, msgLength: number) {
            var pos = 6;
            this.date = _in.readInt();
            this.topic = _in.readUTF();
            pos += this.binaryHelper.toMQttString(this.topic).length;
            this.targetId = _in.readUTF();
            pos += this.binaryHelper.toMQttString(this.targetId).length;
            RetryableMessage.prototype.readMessage.apply(this, arguments);
            this.data = new Array(msgLength - pos);
            this.data = _in.read(this.data);
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
     *请求查询
     */
    export class QueryMessage extends RetryableMessage {
        topic: any;
        data: any;
        targetId: any;
        binaryHelper: BinaryHelper = new BinaryHelper();
        _name = "QueryMessage";
        constructor(header: any, two?: any, three?: any) {
            super(header instanceof Header ? header : arguments.length == 3 ? Type.QUERY : null);
            if (arguments.length == 3) {
                this.data = typeof two == "string" ? this.binaryHelper.toMQttString(two) : two;
                this.topic = header;
                this.targetId = three;
            }
        }
        messageLength(): number {
            var length = 0;
            length += this.binaryHelper.toMQttString(this.topic).length;
            length += this.binaryHelper.toMQttString(this.targetId).length;
            length += 2;
            length += this.data.length;
            return length;
        }
        writeMessage(Out: any) {
            var out = this.binaryHelper.convertStream(Out);
            out.writeUTF(this.topic);
            out.writeUTF(this.targetId);
            RetryableMessage.prototype.writeMessage.call(this, out);
            out.write(this.data);
        }
        readMessage(_in: any, msgLength: number) {
            var pos = 0;
            this.topic = _in.readUTF();
            this.targetId = _in.readUTF();
            pos += this.binaryHelper.toMQttString(this.topic).length;
            pos += this.binaryHelper.toMQttString(this.targetId).length;
            this.readMessage.apply(this, arguments);
            pos += 2;
            this.data = new Array(msgLength - pos);
            _in.read(this.data);
        }
        setTopic(x: any) {
            this.topic = x;
        }
        setData(x: any) {
            this.data = x;
        }
        setTargetId(x: any) {
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
     *请求查询确认
     */
    export class QueryConMessage extends RetryableMessage {
        _name: string = "QueryConMessage";
        constructor(messageId: any) {
            super((messageId instanceof Header) ? messageId : Type.QUERYCON);
            if (!(messageId instanceof Header)) {
                super.setMessageId(messageId);
            }
        }
    }
    /**
     *请求查询应答
     */
    export class QueryAckMessage extends RetryableMessage {
        _name: string = "QueryAckMessage";
        data: any;
        status: any;
        date: any;
        binaryHelper: BinaryHelper = new BinaryHelper();
        constructor(header: RongIMLib.Header) {
            super(header);
        }
        readMessage(In: any, msgLength: number) {
            RetryableMessage.prototype.readMessage.call(this, In);
            this.date = In.readInt();
            this.setStatus(In.read() * 256 + In.read());
            if (msgLength > 0) {
                this.data = new Array(msgLength - 8);
                this.data = In.read(this.data);
            }
        }
        getData(): any {
            return this.data;
        }
        getStatus(): any {
            return this.status;
        }
        getDate(): any {
            return this.date;
        }

        setDate(x: any) {
            this.date = x;
        }
        setStatus(x: any) {
            this.status = x;
        }
        setData(x: any) {
            this.data = x;
        }
    }
}
