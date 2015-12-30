(function () {
    (function (q) {
        function b(a, b, d) {
            this.low = a | 0;
            this.high = b | 0;
            this.unsigned = !!d
        }

        b.isLong = function (a) {
            return !0 === (a && a instanceof b)
        };
        var r = {}, s = {};
        b.fromInt = function (a, c) {
            var d;
            if (c) {
                a >>>= 0;
                if (0 <= a && 256 > a && (d = s[a])) {
                    return d
                }
                d = new b(a, 0 > (a | 0) ? -1 : 0, !0);
                0 <= a && 256 > a && (s[a] = d)
            } else {
                a |= 0;
                if (-128 <= a && 128 > a && (d = r[a])) {
                    return d
                }
                d = new b(a, 0 > a ? -1 : 0, !1);
                -128 <= a && 128 > a && (r[a] = d)
            }
            return d
        };
        b.fromNumber = function (a, c) {
            c = !!c;
            return isNaN(a) || !isFinite(a) ? b.ZERO : !c && a <= -t ? b.MIN_VALUE : !c && a + 1 >= t ? b.MAX_VALUE : c && a >= u ? b.MAX_UNSIGNED_VALUE : 0 > a ? b.fromNumber(-a, c).negate() : new b(a % l | 0, a / l | 0, c)
        };
        b.fromBits = function (a, c, d) {
            return new b(a, c, d)
        };
        b.fromString = function (a, c, d) {
            if (0 === a.length) {
                throw Error("number format error: empty string")
            }
            if ("NaN" === a || "Infinity" === a || "+Infinity" === a || "-Infinity" === a) {
                return b.ZERO
            }
            "number" === typeof c && (d = c, c = !1);
            d = d || 10;
            if (2 > d || 36 < d) {
                throw Error("radix out of range: " + d)
            }
            var e;
            if (0 < (e = a.indexOf("-"))) {
                throw Error('number format error: interior "-" character: ' + a)
            }
            if (0 === e) {
                return b.fromString(a.substring(1), c, d).negate()
            }
            e = b.fromNumber(Math.pow(d, 8));
            for (var f = b.ZERO, g = 0; g < a.length; g += 8) {
                var k = Math.min(8, a.length - g), m = parseInt(a.substring(g, g + k), d);
                8 > k ? (k = b.fromNumber(Math.pow(d, k)), f = f.multiply(k).add(b.fromNumber(m))) : (f = f.multiply(e), f = f.add(b.fromNumber(m)))
            }
            f.unsigned = c;
            return f
        };
        b.fromValue = function (a) {
            return"number" === typeof a ? b.fromNumber(a) : "string" === typeof a ? b.fromString(a) : b.isLong(a) ? a : new b(a.low, a.high, a.unsigned)
        };
        var l = 4294967296, u = l * l, t = u / 2, v = b.fromInt(16777216);
        b.ZERO = b.fromInt(0);
        b.UZERO = b.fromInt(0, !0);
        b.ONE = b.fromInt(1);
        b.UONE = b.fromInt(1, !0);
        b.NEG_ONE = b.fromInt(-1);
        b.MAX_VALUE = b.fromBits(-1, 2147483647, !1);
        b.MAX_UNSIGNED_VALUE = b.fromBits(-1, -1, !0);
        b.MIN_VALUE = b.fromBits(0, -2147483648, !1);
        b.prototype.toInt = function () {
            return this.unsigned ? this.low >>> 0 : this.low
        };
        b.prototype.toNumber = function () {
            return this.unsigned ? (this.high >>> 0) * l + (this.low >>> 0) : this.high * l + (this.low >>> 0)
        };
        b.prototype.toString = function (a) {
            a = a || 10;
            if (2 > a || 36 < a) {
                throw RangeError("radix out of range: " + a)
            }
            if (this.isZero()) {
                return"0"
            }
            var c;
            if (this.isNegative()) {
                if (this.equals(b.MIN_VALUE)) {
                    c = b.fromNumber(a);
                    var d = this.div(c);
                    c = d.multiply(c).subtract(this);
                    return d.toString(a) + c.toInt().toString(a)
                }
                return"-" + this.negate().toString(a)
            }
            d = b.fromNumber(Math.pow(a, 6), this.unsigned);
            c = this;
            for (var e = ""; ;) {
                var f = c.div(d), g = (c.subtract(f.multiply(d)).toInt() >>> 0).toString(a);
                c = f;
                if (c.isZero()) {
                    return g + e
                }
                for (; 6 > g.length;) {
                    g = "0" + g
                }
                e = "" + g + e
            }
        };
        b.prototype.getHighBits = function () {
            return this.high
        };
        b.prototype.getHighBitsUnsigned = function () {
            return this.high >>> 0
        };
        b.prototype.getLowBits = function () {
            return this.low
        };
        b.prototype.getLowBitsUnsigned = function () {
            return this.low >>> 0
        };
        b.prototype.getNumBitsAbs = function () {
            if (this.isNegative()) {
                return this.equals(b.MIN_VALUE) ? 64 : this.negate().getNumBitsAbs()
            }
            for (var a = 0 != this.high ? this.high : this.low, c = 31; 0 < c && 0 == (a & 1 << c); c--) {
            }
            return 0 != this.high ? c + 33 : c + 1
        };
        b.prototype.isZero = function () {
            return 0 === this.high && 0 === this.low
        };
        b.prototype.isNegative = function () {
            return !this.unsigned && 0 > this.high
        };
        b.prototype.isPositive = function () {
            return this.unsigned || 0 <= this.high
        };
        b.prototype.isOdd = function () {
            return 1 === (this.low & 1)
        };
        b.prototype.equals = function (a) {
            b.isLong(a) || (a = b.fromValue(a));
            return this.unsigned !== a.unsigned && this.high >>> 31 !== a.high >>> 31 ? !1 : this.high === a.high && this.low === a.low
        };
        b.prototype.notEquals = function (a) {
            b.isLong(a) || (a = b.fromValue(a));
            return !this.equals(a)
        };
        b.prototype.lessThan = function (a) {
            b.isLong(a) || (a = b.fromValue(a));
            return 0 > this.compare(a)
        };
        b.prototype.lessThanOrEqual = function (a) {
            b.isLong(a) || (a = b.fromValue(a));
            return 0 >= this.compare(a)
        };
        b.prototype.greaterThan = function (a) {
            b.isLong(a) || (a = b.fromValue(a));
            return 0 < this.compare(a)
        };
        b.prototype.greaterThanOrEqual = function (a) {
            return 0 <= this.compare(a)
        };
        b.prototype.compare = function (a) {
            if (this.equals(a)) {
                return 0
            }
            var b = this.isNegative(), d = a.isNegative();
            return b && !d ? -1 : !b && d ? 1 : this.unsigned ? a.high >>> 0 > this.high >>> 0 || a.high === this.high && a.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.subtract(a).isNegative() ? -1 : 1
        };
        b.prototype.negate = function () {
            return !this.unsigned && this.equals(b.MIN_VALUE) ? b.MIN_VALUE : this.not().add(b.ONE)
        };
        b.prototype.add = function (a) {
            b.isLong(a) || (a = b.fromValue(a));
            var c = this.high >>> 16, d = this.high & 65535, e = this.low >>> 16, f = a.high >>> 16, g = a.high & 65535, k = a.low >>> 16, m;
            m = 0 + ((this.low & 65535) + (a.low & 65535));
            a = 0 + (m >>> 16);
            a += e + k;
            e = 0 + (a >>> 16);
            e += d + g;
            d = 0 + (e >>> 16);
            d = d + (c + f) & 65535;
            return b.fromBits((a & 65535) << 16 | m & 65535, d << 16 | e & 65535, this.unsigned)
        };
        b.prototype.subtract = function (a) {
            b.isLong(a) || (a = b.fromValue(a));
            return this.add(a.negate())
        };
        b.prototype.multiply = function (a) {
            if (this.isZero()) {
                return b.ZERO
            }
            b.isLong(a) || (a = b.fromValue(a));
            if (a.isZero()) {
                return b.ZERO
            }
            if (this.equals(b.MIN_VALUE)) {
                return a.isOdd() ? b.MIN_VALUE : b.ZERO
            }
            if (a.equals(b.MIN_VALUE)) {
                return this.isOdd() ? b.MIN_VALUE : b.ZERO
            }
            if (this.isNegative()) {
                return a.isNegative() ? this.negate().multiply(a.negate()) : this.negate().multiply(a).negate()
            }
            if (a.isNegative()) {
                return this.multiply(a.negate()).negate()
            }
            if (this.lessThan(v) && a.lessThan(v)) {
                return b.fromNumber(this.toNumber() * a.toNumber(), this.unsigned)
            }
            var c = this.high >>> 16, d = this.high & 65535, e = this.low >>> 16, f = this.low & 65535, g = a.high >>> 16, k = a.high & 65535, m = a.low >>> 16;
            a = a.low & 65535;
            var p, h, n, l;
            l = 0 + f * a;
            n = 0 + (l >>> 16);
            n += e * a;
            h = 0 + (n >>> 16);
            n = (n & 65535) + f * m;
            h += n >>> 16;
            n &= 65535;
            h += d * a;
            p = 0 + (h >>> 16);
            h = (h & 65535) + e * m;
            p += h >>> 16;
            h &= 65535;
            h += f * k;
            p += h >>> 16;
            h &= 65535;
            p = p + (c * a + d * m + e * k + f * g) & 65535;
            return b.fromBits(n << 16 | l & 65535, p << 16 | h, this.unsigned)
        };
        b.prototype.div = function (a) {
            b.isLong(a) || (a = b.fromValue(a));
            if (a.isZero()) {
                throw Error("division by zero")
            }
            if (this.isZero()) {
                return this.unsigned ? b.UZERO : b.ZERO
            }
            var c, d, e;
            if (this.equals(b.MIN_VALUE)) {
                if (a.equals(b.ONE) || a.equals(b.NEG_ONE)) {
                    return b.MIN_VALUE
                }
                if (a.equals(b.MIN_VALUE)) {
                    return b.ONE
                }
                c = this.shiftRight(1).div(a).shiftLeft(1);
                if (c.equals(b.ZERO)) {
                    return a.isNegative() ? b.ONE : b.NEG_ONE
                }
                d = this.subtract(a.multiply(c));
                return e = c.add(d.div(a))
            }
            if (a.equals(b.MIN_VALUE)) {
                return this.unsigned ? b.UZERO : b.ZERO
            }
            if (this.isNegative()) {
                return a.isNegative() ? this.negate().div(a.negate()) : this.negate().div(a).negate()
            }
            if (a.isNegative()) {
                return this.div(a.negate()).negate()
            }
            e = b.ZERO;
            for (d = this; d.greaterThanOrEqual(a);) {
                c = Math.max(1, Math.floor(d.toNumber() / a.toNumber()));
                for (var f = Math.ceil(Math.log(c) / Math.LN2), f = 48 >= f ? 1 : Math.pow(2, f - 48), g = b.fromNumber(c), k = g.multiply(a); k.isNegative() || k.greaterThan(d);) {
                    c -= f, g = b.fromNumber(c, this.unsigned), k = g.multiply(a)
                }
                g.isZero() && (g = b.ONE);
                e = e.add(g);
                d = d.subtract(k)
            }
            return e
        };
        b.prototype.modulo = function (a) {
            b.isLong(a) || (a = b.fromValue(a));
            return this.subtract(this.div(a).multiply(a))
        };
        b.prototype.not = function () {
            return b.fromBits(~this.low, ~this.high, this.unsigned)
        };
        b.prototype.and = function (a) {
            b.isLong(a) || (a = b.fromValue(a));
            return b.fromBits(this.low & a.low, this.high & a.high, this.unsigned)
        };
        b.prototype.or = function (a) {
            b.isLong(a) || (a = b.fromValue(a));
            return b.fromBits(this.low | a.low, this.high | a.high, this.unsigned)
        };
        b.prototype.xor = function (a) {
            b.isLong(a) || (a = b.fromValue(a));
            return b.fromBits(this.low ^ a.low, this.high ^ a.high, this.unsigned)
        };
        b.prototype.shiftLeft = function (a) {
            b.isLong(a) && (a = a.toInt());
            return 0 === (a &= 63) ? this : 32 > a ? b.fromBits(this.low << a, this.high << a | this.low >>> 32 - a, this.unsigned) : b.fromBits(0, this.low << a - 32, this.unsigned)
        };
        b.prototype.shiftRight = function (a) {
            b.isLong(a) && (a = a.toInt());
            return 0 === (a &= 63) ? this : 32 > a ? b.fromBits(this.low >>> a | this.high << 32 - a, this.high >> a, this.unsigned) : b.fromBits(this.high >> a - 32, 0 <= this.high ? 0 : -1, this.unsigned)
        };
        b.prototype.shiftRightUnsigned = function (a) {
            b.isLong(a) && (a = a.toInt());
            a &= 63;
            if (0 === a) {
                return this
            }
            var c = this.high;
            return 32 > a ? b.fromBits(this.low >>> a | c << 32 - a, c >>> a, this.unsigned) : 32 === a ? b.fromBits(c, 0, this.unsigned) : b.fromBits(c >>> a - 32, 0, this.unsigned)
        };
        b.prototype.toSigned = function () {
            return this.unsigned ? new b(this.low, this.high, !1) : this
        };
        b.prototype.toUnsigned = function () {
            return this.unsigned ? this : new b(this.low, this.high, !0)
        };
        "function" === typeof require && "object" === typeof module && module && module.id && "object" === typeof exports && exports ? module.exports = b : "function" === typeof define && define.amd ? define('Long', [], function () {
            return b
        }) : (q.dcodeIO = q.dcodeIO || {}).Long = b;
    })(this)
})();
(function (s) {
    function u(k) {
        function g(a, b, c) {
            "undefined" === typeof a && (a = g.DEFAULT_CAPACITY);
            "undefined" === typeof b && (b = g.DEFAULT_ENDIAN);
            "undefined" === typeof c && (c = g.DEFAULT_NOASSERT);
            if (!c) {
                a |= 0;
                if (0 > a) {
                    throw RangeError("Illegal capacity")
                }
                b = !!b;
                c = !!c
            }
            this.buffer = 0 === a ? s : new ArrayBuffer(a);
            this.view = 0 === a ? null : new DataView(this.buffer);
            this.offset = 0;
            this.markedOffset = -1;
            this.limit = a;
            this.littleEndian = "undefined" !== typeof b ? !!b : !1;
            this.noAssert = !!c
        }

        function m(a) {
            var b = 0;
            return function () {
                return b < a.length ? a.charCodeAt(b++) : null
            }
        }

        function t() {
            var a = [], b = [];
            return function () {
                if (0 === arguments.length) {
                    return b.join("") + u.apply(String, a)
                }
                1024 < a.length + arguments.length && (b.push(u.apply(String, a)), a.length = 0);
                Array.prototype.push.apply(a, arguments)
            }
        }

        g.VERSION = "3.5.2";
        g.LITTLE_ENDIAN = !0;
        g.BIG_ENDIAN = !1;
        g.DEFAULT_CAPACITY = 16;
        g.DEFAULT_ENDIAN = g.BIG_ENDIAN;
        g.DEFAULT_NOASSERT = !1;
        g.Long = k || null;
        var e = g.prototype, s = new ArrayBuffer(0), u = String.fromCharCode;
        g.allocate = function (a, b, c) {
            return new g(a, b, c)
        };
        g.concat = function (a, b, c, d) {
            if ("boolean" === typeof b || "string" !== typeof b) {
                d = c, c = b, b = void 0
            }
            for (var f = 0, n = 0, h = a.length, e; n < h; ++n) {
                g.isByteBuffer(a[n]) || (a[n] = g.wrap(a[n], b)), e = a[n].limit - a[n].offset, 0 < e && (f += e)
            }
            if (0 === f) {
                return new g(0, c, d)
            }
            b = new g(f, c, d);
            d = new Uint8Array(b.buffer);
            for (n = 0; n < h;) {
                c = a[n++], e = c.limit - c.offset, 0 >= e || (d.set((new Uint8Array(c.buffer)).subarray(c.offset, c.limit), b.offset), b.offset += e)
            }
            b.limit = b.offset;
            b.offset = 0;
            return b
        };
        g.isByteBuffer = function (a) {
            return !0 === (a && a instanceof g)
        };
        g.type = function () {
            return ArrayBuffer
        };
        g.wrap = function (a, b, c, d) {
            "string" !== typeof b && (d = c, c = b, b = void 0);
            if ("string" === typeof a) {
                switch ("undefined" === typeof b && (b = "utf8"), b) {
                    case"base64":
                        return g.fromBase64(a, c);
                    case"hex":
                        return g.fromHex(a, c);
                    case"binary":
                        return g.fromBinary(a, c);
                    case"utf8":
                        return g.fromUTF8(a, c);
                    case"debug":
                        return g.fromDebug(a, c);
                    default:
                        throw Error("Unsupported encoding: " + b)
                }
            }
            if (null === a || "object" !== typeof a) {
                throw TypeError("Illegal buffer")
            }
            if (g.isByteBuffer(a)) {
                return b = e.clone.call(a), b.markedOffset = -1, b
            }
            if (a instanceof Uint8Array) {
                b = new g(0, c, d), 0 < a.length && (b.buffer = a.buffer, b.offset = a.byteOffset, b.limit = a.byteOffset + a.length, b.view = 0 < a.length ? new DataView(a.buffer) : null)
            } else {
                if (a instanceof ArrayBuffer) {
                    b = new g(0, c, d), 0 < a.byteLength && (b.buffer = a, b.offset = 0, b.limit = a.byteLength, b.view = 0 < a.byteLength ? new DataView(a) : null)
                } else {
                    if ("[object Array]" === Object.prototype.toString.call(a)) {
                        for (b = new g(a.length, c, d), b.limit = a.length, i = 0; i < a.length; ++i) {
                            b.view.setUint8(i, a[i])
                        }
                    } else {
                        throw TypeError("Illegal buffer")
                    }
                }
            }
            return b
        };
        e.writeInt8 = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal value: " + a + " (not an integer)")
                }
                a |= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            b += 1;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setInt8(b - 1, a);
            c && (this.offset += 1);
            return this
        };
        e.writeByte = e.writeInt8;
        e.readInt8 = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 1 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength)
                }
            }
            a = this.view.getInt8(a);
            b && (this.offset += 1);
            return a
        };
        e.readByte = e.readInt8;
        e.writeUint8 = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal value: " + a + " (not an integer)")
                }
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            b += 1;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setUint8(b - 1, a);
            c && (this.offset += 1);
            return this
        };
        e.readUint8 = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 1 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength)
                }
            }
            a = this.view.getUint8(a);
            b && (this.offset += 1);
            return a
        };
        e.writeInt16 = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal value: " + a + " (not an integer)")
                }
                a |= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            b += 2;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setInt16(b - 2, a, this.littleEndian);
            c && (this.offset += 2);
            return this
        };
        e.writeShort = e.writeInt16;
        e.readInt16 = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 2 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+2) <= " + this.buffer.byteLength)
                }
            }
            a = this.view.getInt16(a, this.littleEndian);
            b && (this.offset += 2);
            return a
        };
        e.readShort = e.readInt16;
        e.writeUint16 = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal value: " + a + " (not an integer)")
                }
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            b += 2;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setUint16(b - 2, a, this.littleEndian);
            c && (this.offset += 2);
            return this
        };
        e.readUint16 = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 2 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+2) <= " + this.buffer.byteLength)
                }
            }
            a = this.view.getUint16(a, this.littleEndian);
            b && (this.offset += 2);
            return a
        };
        e.writeInt32 = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal value: " + a + " (not an integer)")
                }
                a |= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            b += 4;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setInt32(b - 4, a, this.littleEndian);
            c && (this.offset += 4);
            return this
        };
        e.writeInt = e.writeInt32;
        e.readInt32 = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 4 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength)
                }
            }
            a = this.view.getInt32(a, this.littleEndian);
            b && (this.offset += 4);
            return a
        };
        e.readInt = e.readInt32;
        e.writeUint32 = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal value: " + a + " (not an integer)")
                }
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            b += 4;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setUint32(b - 4, a, this.littleEndian);
            c && (this.offset += 4);
            return this
        };
        e.readUint32 = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 4 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength)
                }
            }
            a = this.view.getUint32(a, this.littleEndian);
            b && (this.offset += 4);
            return a
        };
        k && (e.writeInt64 = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" === typeof a) {
                    a = k.fromNumber(a)
                } else {
                    if (!(a && a instanceof k)) {
                        throw TypeError("Illegal value: " + a + " (not an integer or Long)")
                    }
                }
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            "number" === typeof a && (a = k.fromNumber(a));
            b += 8;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            b -= 8;
            this.littleEndian ? (this.view.setInt32(b, a.low, !0), this.view.setInt32(b + 4, a.high, !0)) : (this.view.setInt32(b, a.high, !1), this.view.setInt32(b + 4, a.low, !1));
            c && (this.offset += 8);
            return this
        }, e.writeLong = e.writeInt64, e.readInt64 = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 8 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+8) <= " + this.buffer.byteLength)
                }
            }
            a = this.littleEndian ? new k(this.view.getInt32(a, !0), this.view.getInt32(a + 4, !0), !1) : new k(this.view.getInt32(a + 4, !1), this.view.getInt32(a, !1), !1);
            b && (this.offset += 8);
            return a
        }, e.readLong = e.readInt64, e.writeUint64 = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" === typeof a) {
                    a = k.fromNumber(a)
                } else {
                    if (!(a && a instanceof k)) {
                        throw TypeError("Illegal value: " + a + " (not an integer or Long)")
                    }
                }
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            "number" === typeof a && (a = k.fromNumber(a));
            b += 8;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            b -= 8;
            this.littleEndian ? (this.view.setInt32(b, a.low, !0), this.view.setInt32(b + 4, a.high, !0)) : (this.view.setInt32(b, a.high, !1), this.view.setInt32(b + 4, a.low, !1));
            c && (this.offset += 8);
            return this
        }, e.readUint64 = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 8 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+8) <= " + this.buffer.byteLength)
                }
            }
            a = this.littleEndian ? new k(this.view.getInt32(a, !0), this.view.getInt32(a + 4, !0), !0) : new k(this.view.getInt32(a + 4, !1), this.view.getInt32(a, !1), !0);
            b && (this.offset += 8);
            return a
        });
        e.writeFloat32 = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a) {
                    throw TypeError("Illegal value: " + a + " (not a number)")
                }
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            b += 4;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setFloat32(b - 4, a, this.littleEndian);
            c && (this.offset += 4);
            return this
        };
        e.writeFloat = e.writeFloat32;
        e.readFloat32 = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 4 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength)
                }
            }
            a = this.view.getFloat32(a, this.littleEndian);
            b && (this.offset += 4);
            return a
        };
        e.readFloat = e.readFloat32;
        e.writeFloat64 = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a) {
                    throw TypeError("Illegal value: " + a + " (not a number)")
                }
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            b += 8;
            var d = this.buffer.byteLength;
            b > d && this.resize((d *= 2) > b ? d : b);
            this.view.setFloat64(b - 8, a, this.littleEndian);
            c && (this.offset += 8);
            return this
        };
        e.writeDouble = e.writeFloat64;
        e.readFloat64 = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 8 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+8) <= " + this.buffer.byteLength)
                }
            }
            a = this.view.getFloat64(a, this.littleEndian);
            b && (this.offset += 8);
            return a
        };
        e.readDouble = e.readFloat64;
        g.MAX_VARINT32_BYTES = 5;
        g.calculateVarint32 = function (a) {
            a >>>= 0;
            return 128 > a ? 1 : 16384 > a ? 2 : 2097152 > a ? 3 : 268435456 > a ? 4 : 5
        };
        g.zigZagEncode32 = function (a) {
            return((a |= 0) << 1 ^ a >> 31) >>> 0
        };
        g.zigZagDecode32 = function (a) {
            return a >>> 1 ^ -(a & 1) | 0
        };
        e.writeVarint32 = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal value: " + a + " (not an integer)")
                }
                a |= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            var d = g.calculateVarint32(a);
            b += d;
            var f = this.buffer.byteLength;
            b > f && this.resize((f *= 2) > b ? f : b);
            b -= d;
            this.view.setUint8(b, d = a | 128);
            a >>>= 0;
            128 <= a ? (d = a >> 7 | 128, this.view.setUint8(b + 1, d), 16384 <= a ? (d = a >> 14 | 128, this.view.setUint8(b + 2, d), 2097152 <= a ? (d = a >> 21 | 128, this.view.setUint8(b + 3, d), 268435456 <= a ? (this.view.setUint8(b + 4, a >> 28 & 15), d = 5) : (this.view.setUint8(b + 3, d & 127), d = 4)) : (this.view.setUint8(b + 2, d & 127), d = 3)) : (this.view.setUint8(b + 1, d & 127), d = 2)) : (this.view.setUint8(b, d & 127), d = 1);
            return c ? (this.offset += d, this) : d
        };
        e.writeVarint32ZigZag = function (a, b) {
            return this.writeVarint32(g.zigZagEncode32(a), b)
        };
        e.readVarint32 = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 1 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength)
                }
            }
            var c = 0, d = 0, f;
            do {
                f = a + c;
                if (!this.noAssert && f > this.limit) {
                    throw a = Error("Truncated"), a.truncated = !0, a
                }
                f = this.view.getUint8(f);
                5 > c && (d |= (f & 127) << 7 * c >>> 0);
                ++c
            } while (128 === (f & 128));
            d |= 0;
            return b ? (this.offset += c, d) : {value: d, length: c}
        };
        e.readVarint32ZigZag = function (a) {
            a = this.readVarint32(a);
            "object" === typeof a ? a.value = g.zigZagDecode32(a.value) : a = g.zigZagDecode32(a);
            return a
        };
        k && (g.MAX_VARINT64_BYTES = 10, g.calculateVarint64 = function (a) {
            "number" === typeof a && (a = k.fromNumber(a));
            var b = a.toInt() >>> 0, c = a.shiftRightUnsigned(28).toInt() >>> 0;
            a = a.shiftRightUnsigned(56).toInt() >>> 0;
            return 0 == a ? 0 == c ? 16384 > b ? 128 > b ? 1 : 2 : 2097152 > b ? 3 : 4 : 16384 > c ? 128 > c ? 5 : 6 : 2097152 > c ? 7 : 8 : 128 > a ? 9 : 10
        }, g.zigZagEncode64 = function (a) {
            "number" === typeof a ? a = k.fromNumber(a, !1) : !1 !== a.unsigned && (a = a.toSigned());
            return a.shiftLeft(1).xor(a.shiftRight(63)).toUnsigned()
        }, g.zigZagDecode64 = function (a) {
            "number" === typeof a ? a = k.fromNumber(a, !1) : !1 !== a.unsigned && (a = a.toSigned());
            return a.shiftRightUnsigned(1).xor(a.and(k.ONE).toSigned().negate()).toSigned()
        }, e.writeVarint64 = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" === typeof a) {
                    a = k.fromNumber(a)
                } else {
                    if (!(a && a instanceof k)) {
                        throw TypeError("Illegal value: " + a + " (not an integer or Long)")
                    }
                }
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            "number" === typeof a ? a = k.fromNumber(a, !1) : !1 !== a.unsigned && (a = a.toSigned());
            var d = g.calculateVarint64(a), f = a.toInt() >>> 0, n = a.shiftRightUnsigned(28).toInt() >>> 0, e = a.shiftRightUnsigned(56).toInt() >>> 0;
            b += d;
            var r = this.buffer.byteLength;
            b > r && this.resize((r *= 2) > b ? r : b);
            b -= d;
            switch (d) {
                case 10:
                    this.view.setUint8(b + 9, e >>> 7 & 1);
                case 9:
                    this.view.setUint8(b + 8, 9 !== d ? e | 128 : e & 127);
                case 8:
                    this.view.setUint8(b + 7, 8 !== d ? n >>> 21 | 128 : n >>> 21 & 127);
                case 7:
                    this.view.setUint8(b + 6, 7 !== d ? n >>> 14 | 128 : n >>> 14 & 127);
                case 6:
                    this.view.setUint8(b + 5, 6 !== d ? n >>> 7 | 128 : n >>> 7 & 127);
                case 5:
                    this.view.setUint8(b + 4, 5 !== d ? n | 128 : n & 127);
                case 4:
                    this.view.setUint8(b + 3, 4 !== d ? f >>> 21 | 128 : f >>> 21 & 127);
                case 3:
                    this.view.setUint8(b + 2, 3 !== d ? f >>> 14 | 128 : f >>> 14 & 127);
                case 2:
                    this.view.setUint8(b + 1, 2 !== d ? f >>> 7 | 128 : f >>> 7 & 127);
                case 1:
                    this.view.setUint8(b, 1 !== d ? f | 128 : f & 127)
            }
            return c ? (this.offset += d, this) : d
        }, e.writeVarint64ZigZag = function (a, b) {
            return this.writeVarint64(g.zigZagEncode64(a), b)
        }, e.readVarint64 = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 1 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength)
                }
            }
            var c = a, d = 0, f = 0, e = 0, h = 0, h = this.view.getUint8(a++), d = h & 127;
            if (h & 128 && (h = this.view.getUint8(a++), d |= (h & 127) << 7, h & 128 && (h = this.view.getUint8(a++), d |= (h & 127) << 14, h & 128 && (h = this.view.getUint8(a++), d |= (h & 127) << 21, h & 128 && (h = this.view.getUint8(a++), f = h & 127, h & 128 && (h = this.view.getUint8(a++), f |= (h & 127) << 7, h & 128 && (h = this.view.getUint8(a++), f |= (h & 127) << 14, h & 128 && (h = this.view.getUint8(a++), f |= (h & 127) << 21, h & 128 && (h = this.view.getUint8(a++), e = h & 127, h & 128 && (h = this.view.getUint8(a++), e |= (h & 127) << 7, h & 128)))))))))) {
                throw Error("Buffer overrun")
            }
            d = k.fromBits(d | f << 28, f >>> 4 | e << 24, !1);
            return b ? (this.offset = a, d) : {value: d, length: a - c}
        }, e.readVarint64ZigZag = function (a) {
            (a = this.readVarint64(a)) && a.value instanceof k ? a.value = g.zigZagDecode64(a.value) : a = g.zigZagDecode64(a);
            return a
        });
        e.writeCString = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            var d, f = a.length;
            if (!this.noAssert) {
                if ("string" !== typeof a) {
                    throw TypeError("Illegal str: Not a string")
                }
                for (d = 0; d < f; ++d) {
                    if (0 === a.charCodeAt(d)) {
                        throw RangeError("Illegal str: Contains NULL-characters")
                    }
                }
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            d = b;
            f = l.a(m(a))[1];
            b += f + 1;
            var e = this.buffer.byteLength;
            b > e && this.resize((e *= 2) > b ? e : b);
            b -= f + 1;
            l.c(m(a), function (a) {
                this.view.setUint8(b++, a)
            }.bind(this));
            this.view.setUint8(b++, 0);
            return c ? (this.offset = b - d, this) : f
        };
        e.readCString = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 1 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength)
                }
            }
            var c = a, d, f = -1;
            l.b(function () {
                if (0 === f) {
                    return null
                }
                if (a >= this.limit) {
                    throw RangeError("Illegal range: Truncated data, " + a + " < " + this.limit)
                }
                return 0 === (f = this.view.getUint8(a++)) ? null : f
            }.bind(this), d = t(), !0);
            return b ? (this.offset = a, d()) : {string: d(), length: a - c}
        };
        e.writeIString = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("string" !== typeof a) {
                    throw TypeError("Illegal str: Not a string")
                }
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            var d = b, f;
            f = l.a(m(a), this.noAssert)[1];
            b += 4 + f;
            var e = this.buffer.byteLength;
            b > e && this.resize((e *= 2) > b ? e : b);
            b -= 4 + f;
            this.view.setUint32(b, f, this.littleEndian);
            b += 4;
            l.c(m(a), function (a) {
                this.view.setUint8(b++, a)
            }.bind(this));
            if (b !== d + 4 + f) {
                throw RangeError("Illegal range: Truncated data, " + b + " == " + (b + 4 + f))
            }
            return c ? (this.offset = b, this) : b - d
        };
        e.readIString = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 4 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength)
                }
            }
            var c = 0, d = a, c = this.view.getUint32(a, this.littleEndian);
            a += 4;
            var f = a + c;
            l.b(function () {
                return a < f ? this.view.getUint8(a++) : null
            }.bind(this), c = t(), this.noAssert);
            c = c();
            return b ? (this.offset = a, c) : {string: c, length: a - d}
        };
        g.METRICS_CHARS = "c";
        g.METRICS_BYTES = "b";
        e.writeUTF8String = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            var d, f = b;
            d = l.a(m(a))[1];
            b += d;
            var e = this.buffer.byteLength;
            b > e && this.resize((e *= 2) > b ? e : b);
            b -= d;
            l.c(m(a), function (a) {
                this.view.setUint8(b++, a)
            }.bind(this));
            return c ? (this.offset = b, this) : b - f
        };
        e.writeString = e.writeUTF8String;
        g.calculateUTF8Chars = function (a) {
            return l.a(m(a))[0]
        };
        g.calculateUTF8Bytes = function (a) {
            return l.a(m(a))[1]
        };
        e.readUTF8String = function (a, b, c) {
            "number" === typeof b && (c = b, b = void 0);
            var d = "undefined" === typeof c;
            d && (c = this.offset);
            "undefined" === typeof b && (b = g.METRICS_CHARS);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal length: " + a + " (not an integer)")
                }
                a |= 0;
                if ("number" !== typeof c || 0 !== c % 1) {
                    throw TypeError("Illegal offset: " + c + " (not an integer)")
                }
                c >>>= 0;
                if (0 > c || c + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength)
                }
            }
            var f = 0, e = c, h;
            if (b === g.METRICS_CHARS) {
                h = t();
                l.g(function () {
                    return f < a && c < this.limit ? this.view.getUint8(c++) : null
                }.bind(this), function (a) {
                    ++f;
                    l.e(a, h)
                }.bind(this));
                if (f !== a) {
                    throw RangeError("Illegal range: Truncated data, " + f + " == " + a)
                }
                return d ? (this.offset = c, h()) : {string: h(), length: c - e}
            }
            if (b === g.METRICS_BYTES) {
                if (!this.noAssert) {
                    if ("number" !== typeof c || 0 !== c % 1) {
                        throw TypeError("Illegal offset: " + c + " (not an integer)")
                    }
                    c >>>= 0;
                    if (0 > c || c + a > this.buffer.byteLength) {
                        throw RangeError("Illegal offset: 0 <= " + c + " (+" + a + ") <= " + this.buffer.byteLength)
                    }
                }
                var r = c + a;
                l.b(function () {
                    return c < r ? this.view.getUint8(c++) : null
                }.bind(this), h = t(), this.noAssert);
                if (c !== r) {
                    throw RangeError("Illegal range: Truncated data, " + c + " == " + r)
                }
                return d ? (this.offset = c, h()) : {string: h(), length: c - e}
            }
            throw TypeError("Unsupported metrics: " + b)
        };
        e.readString = e.readUTF8String;
        e.writeVString = function (a, b) {
            var c = "undefined" === typeof b;
            c && (b = this.offset);
            if (!this.noAssert) {
                if ("string" !== typeof a) {
                    throw TypeError("Illegal str: Not a string")
                }
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: " + b + " (not an integer)")
                }
                b >>>= 0;
                if (0 > b || b + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength)
                }
            }
            var d = b, f, e;
            f = l.a(m(a), this.noAssert)[1];
            e = g.calculateVarint32(f);
            b += e + f;
            var h = this.buffer.byteLength;
            b > h && this.resize((h *= 2) > b ? h : b);
            b -= e + f;
            b += this.writeVarint32(f, b);
            l.c(m(a), function (a) {
                this.view.setUint8(b++, a)
            }.bind(this));
            if (b !== d + f + e) {
                throw RangeError("Illegal range: Truncated data, " + b + " == " + (b + f + e))
            }
            return c ? (this.offset = b, this) : b - d
        };
        e.readVString = function (a) {
            var b = "undefined" === typeof a;
            b && (a = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 1 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength)
                }
            }
            var c = this.readVarint32(a), d = a;
            a += c.length;
            var c = c.value, f = a + c, c = t();
            l.b(function () {
                return a < f ? this.view.getUint8(a++) : null
            }.bind(this), c, this.noAssert);
            c = c();
            return b ? (this.offset = a, c) : {string: c, length: a - d}
        };
        e.append = function (a, b, c) {
            if ("number" === typeof b || "string" !== typeof b) {
                c = b, b = void 0
            }
            var d = "undefined" === typeof c;
            d && (c = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof c || 0 !== c % 1) {
                    throw TypeError("Illegal offset: " + c + " (not an integer)")
                }
                c >>>= 0;
                if (0 > c || c + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength)
                }
            }
            a instanceof g || (a = g.wrap(a, b));
            b = a.limit - a.offset;
            if (0 >= b) {
                return this
            }
            c += b;
            var f = this.buffer.byteLength;
            c > f && this.resize((f *= 2) > c ? f : c);
            (new Uint8Array(this.buffer, c - b)).set((new Uint8Array(a.buffer)).subarray(a.offset, a.limit));
            a.offset += b;
            d && (this.offset += b);
            return this
        };
        e.appendTo = function (a, b) {
            a.append(this, b);
            return this
        };
        e.assert = function (a) {
            this.noAssert = !a;
            return this
        };
        e.capacity = function () {
            return this.buffer.byteLength
        };
        e.clear = function () {
            this.offset = 0;
            this.limit = this.buffer.byteLength;
            this.markedOffset = -1;
            return this
        };
        e.clone = function (a) {
            var b = new g(0, this.littleEndian, this.noAssert);
            a ? (a = new ArrayBuffer(this.buffer.byteLength), (new Uint8Array(a)).set(this.buffer), b.buffer = a, b.view = new DataView(a)) : (b.buffer = this.buffer, b.view = this.view);
            b.offset = this.offset;
            b.markedOffset = this.markedOffset;
            b.limit = this.limit;
            return b
        };
        e.compact = function (a, b) {
            "undefined" === typeof a && (a = this.offset);
            "undefined" === typeof b && (b = this.limit);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal begin: Not an integer")
                }
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal end: Not an integer")
                }
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) {
                    throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength)
                }
            }
            if (0 === a && b === this.buffer.byteLength) {
                return this
            }
            var c = b - a;
            if (0 === c) {
                return this.buffer = s, this.view = null, 0 <= this.markedOffset && (this.markedOffset -= a), this.limit = this.offset = 0, this
            }
            var d = new ArrayBuffer(c);
            (new Uint8Array(d)).set((new Uint8Array(this.buffer)).subarray(a, b));
            this.buffer = d;
            this.view = new DataView(d);
            0 <= this.markedOffset && (this.markedOffset -= a);
            this.offset = 0;
            this.limit = c;
            return this
        };
        e.copy = function (a, b) {
            "undefined" === typeof a && (a = this.offset);
            "undefined" === typeof b && (b = this.limit);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal begin: Not an integer")
                }
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal end: Not an integer")
                }
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) {
                    throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength)
                }
            }
            if (a === b) {
                return new g(0, this.littleEndian, this.noAssert)
            }
            var c = b - a, d = new g(c, this.littleEndian, this.noAssert);
            d.offset = 0;
            d.limit = c;
            0 <= d.markedOffset && (d.markedOffset -= a);
            this.copyTo(d, 0, a, b);
            return d
        };
        e.copyTo = function (a, b, c, d) {
            var f, e;
            if (!this.noAssert && !g.isByteBuffer(a)) {
                throw TypeError("Illegal target: Not a ByteBuffer")
            }
            b = (e = "undefined" === typeof b) ? a.offset : b | 0;
            c = (f = "undefined" === typeof c) ? this.offset : c | 0;
            d = "undefined" === typeof d ? this.limit : d | 0;
            if (0 > b || b > a.buffer.byteLength) {
                throw RangeError("Illegal target range: 0 <= " + b + " <= " + a.buffer.byteLength)
            }
            if (0 > c || d > this.buffer.byteLength) {
                throw RangeError("Illegal source range: 0 <= " + c + " <= " + this.buffer.byteLength)
            }
            var h = d - c;
            if (0 === h) {
                return a
            }
            a.ensureCapacity(b + h);
            (new Uint8Array(a.buffer)).set((new Uint8Array(this.buffer)).subarray(c, d), b);
            f && (this.offset += h);
            e && (a.offset += h);
            return this
        };
        e.ensureCapacity = function (a) {
            var b = this.buffer.byteLength;
            return b < a ? this.resize((b *= 2) > a ? b : a) : this
        };
        e.fill = function (a, b, c) {
            var d = "undefined" === typeof b;
            d && (b = this.offset);
            "string" === typeof a && 0 < a.length && (a = a.charCodeAt(0));
            "undefined" === typeof b && (b = this.offset);
            "undefined" === typeof c && (c = this.limit);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal value: " + a + " (not an integer)")
                }
                a |= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal begin: Not an integer")
                }
                b >>>= 0;
                if ("number" !== typeof c || 0 !== c % 1) {
                    throw TypeError("Illegal end: Not an integer")
                }
                c >>>= 0;
                if (0 > b || b > c || c > this.buffer.byteLength) {
                    throw RangeError("Illegal range: 0 <= " + b + " <= " + c + " <= " + this.buffer.byteLength)
                }
            }
            if (b >= c) {
                return this
            }
            for (; b < c;) {
                this.view.setUint8(b++, a)
            }
            d && (this.offset = b);
            return this
        };
        e.flip = function () {
            this.limit = this.offset;
            this.offset = 0;
            return this
        };
        e.mark = function (a) {
            a = "undefined" === typeof a ? this.offset : a;
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal offset: " + a + " (not an integer)")
                }
                a >>>= 0;
                if (0 > a || a + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + a + " (+0) <= " + this.buffer.byteLength)
                }
            }
            this.markedOffset = a;
            return this
        };
        e.order = function (a) {
            if (!this.noAssert && "boolean" !== typeof a) {
                throw TypeError("Illegal littleEndian: Not a boolean")
            }
            this.littleEndian = !!a;
            return this
        };
        e.LE = function (a) {
            this.littleEndian = "undefined" !== typeof a ? !!a : !0;
            return this
        };
        e.BE = function (a) {
            this.littleEndian = "undefined" !== typeof a ? !a : !1;
            return this
        };
        e.prepend = function (a, b, c) {
            if ("number" === typeof b || "string" !== typeof b) {
                c = b, b = void 0
            }
            var d = "undefined" === typeof c;
            d && (c = this.offset);
            if (!this.noAssert) {
                if ("number" !== typeof c || 0 !== c % 1) {
                    throw TypeError("Illegal offset: " + c + " (not an integer)")
                }
                c >>>= 0;
                if (0 > c || c + 0 > this.buffer.byteLength) {
                    throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength)
                }
            }
            a instanceof g || (a = g.wrap(a, b));
            b = a.limit - a.offset;
            if (0 >= b) {
                return this
            }
            var f = b - c, e;
            if (0 < f) {
                var h = new ArrayBuffer(this.buffer.byteLength + f);
                e = new Uint8Array(h);
                e.set((new Uint8Array(this.buffer)).subarray(c, this.buffer.byteLength), b);
                this.buffer = h;
                this.view = new DataView(h);
                this.offset += f;
                0 <= this.markedOffset && (this.markedOffset += f);
                this.limit += f;
                c += f
            } else {
                e = new Uint8Array(this.buffer)
            }
            e.set((new Uint8Array(a.buffer)).subarray(a.offset, a.limit), c - b);
            a.offset = a.limit;
            d && (this.offset -= b);
            return this
        };
        e.prependTo = function (a, b) {
            a.prepend(this, b);
            return this
        };
        e.printDebug = function (a) {
            "function" !== typeof a && (a = console.log.bind(console));
            a(this.toString() + "\n-------------------------------------------------------------------\n" + this.toDebug(!0))
        };
        e.remaining = function () {
            return this.limit - this.offset
        };
        e.reset = function () {
            0 <= this.markedOffset ? (this.offset = this.markedOffset, this.markedOffset = -1) : this.offset = 0;
            return this
        };
        e.resize = function (a) {
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal capacity: " + a + " (not an integer)")
                }
                a |= 0;
                if (0 > a) {
                    throw RangeError("Illegal capacity: 0 <= " + a)
                }
            }
            this.buffer.byteLength < a && (a = new ArrayBuffer(a), (new Uint8Array(a)).set(new Uint8Array(this.buffer)), this.buffer = a, this.view = new DataView(a));
            return this
        };
        e.reverse = function (a, b) {
            "undefined" === typeof a && (a = this.offset);
            "undefined" === typeof b && (b = this.limit);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal begin: Not an integer")
                }
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal end: Not an integer")
                }
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) {
                    throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength)
                }
            }
            if (a === b) {
                return this
            }
            Array.prototype.reverse.call((new Uint8Array(this.buffer)).subarray(a, b));
            this.view = new DataView(this.buffer);
            return this
        };
        e.skip = function (a) {
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal length: " + a + " (not an integer)")
                }
                a |= 0
            }
            var b = this.offset + a;
            if (!this.noAssert && (0 > b || b > this.buffer.byteLength)) {
                throw RangeError("Illegal length: 0 <= " + this.offset + " + " + a + " <= " + this.buffer.byteLength)
            }
            this.offset = b;
            return this
        };
        e.slice = function (a, b) {
            "undefined" === typeof a && (a = this.offset);
            "undefined" === typeof b && (b = this.limit);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal begin: Not an integer")
                }
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal end: Not an integer")
                }
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) {
                    throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength)
                }
            }
            var c = this.clone();
            c.offset = a;
            c.limit = b;
            return c
        };
        e.toBuffer = function (a) {
            var b = this.offset, c = this.limit;
            if (b > c) {
                var d = b, b = c, c = d
            }
            if (!this.noAssert) {
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal offset: Not an integer")
                }
                b >>>= 0;
                if ("number" !== typeof c || 0 !== c % 1) {
                    throw TypeError("Illegal limit: Not an integer")
                }
                c >>>= 0;
                if (0 > b || b > c || c > this.buffer.byteLength) {
                    throw RangeError("Illegal range: 0 <= " + b + " <= " + c + " <= " + this.buffer.byteLength)
                }
            }
            if (!a && 0 === b && c === this.buffer.byteLength) {
                return this.buffer
            }
            if (b === c) {
                return s
            }
            a = new ArrayBuffer(c - b);
            (new Uint8Array(a)).set((new Uint8Array(this.buffer)).subarray(b, c), 0);
            return a
        };
        e.toArrayBuffer = e.toBuffer;
        e.toString = function (a, b, c) {
            if ("undefined" === typeof a) {
                return"ByteBufferAB(offset=" + this.offset + ",markedOffset=" + this.markedOffset + ",limit=" + this.limit + ",capacity=" + this.capacity() + ")"
            }
            "number" === typeof a && (c = b = a = "utf8");
            switch (a) {
                case"utf8":
                    return this.toUTF8(b, c);
                case"base64":
                    return this.toBase64(b, c);
                case"hex":
                    return this.toHex(b, c);
                case"binary":
                    return this.toBinary(b, c);
                case"debug":
                    return this.toDebug();
                case"columns":
                    return this.m();
                default:
                    throw Error("Unsupported encoding: " + a)
            }
        };
        var v = function () {
            for (var a = {}, b = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47], c = [], d = 0, f = b.length; d < f; ++d) {
                c[b[d]] = d
            }
            a.i = function (a, c) {
                for (var d, f; null !== (d = a());) {
                    c(b[d >> 2 & 63]), f = (d & 3) << 4, null !== (d = a()) ? (f |= d >> 4 & 15, c(b[(f | d >> 4 & 15) & 63]), f = (d & 15) << 2, null !== (d = a()) ? (c(b[(f | d >> 6 & 3) & 63]), c(b[d & 63])) : (c(b[f & 63]), c(61))) : (c(b[f & 63]), c(61), c(61))
                }
            };
            a.h = function (a, b) {
                function d(a) {
                    throw Error("Illegal character code: " + a)
                }

                for (var f, e, g; null !== (f = a());) {
                    if (e = c[f], "undefined" === typeof e && d(f), null !== (f = a()) && (g = c[f], "undefined" === typeof g && d(f), b(e << 2 >>> 0 | (g & 48) >> 4), null !== (f = a()))) {
                        e = c[f];
                        if ("undefined" === typeof e) {
                            if (61 === f) {
                                break
                            } else {
                                d(f)
                            }
                        }
                        b((g & 15) << 4 >>> 0 | (e & 60) >> 2);
                        if (null !== (f = a())) {
                            g = c[f];
                            if ("undefined" === typeof g) {
                                if (61 === f) {
                                    break
                                } else {
                                    d(f)
                                }
                            }
                            b((e & 3) << 6 >>> 0 | g)
                        }
                    }
                }
            };
            a.test = function (a) {
                return/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(a)
            };
            return a
        }();
        e.toBase64 = function (a, b) {
            "undefined" === typeof a && (a = this.offset);
            "undefined" === typeof b && (b = this.limit);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal begin: Not an integer")
                }
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal end: Not an integer")
                }
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) {
                    throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength)
                }
            }
            var c;
            v.i(function () {
                return a < b ? this.view.getUint8(a++) : null
            }.bind(this), c = t());
            return c()
        };
        g.fromBase64 = function (a, b, c) {
            if (!c) {
                if ("string" !== typeof a) {
                    throw TypeError("Illegal str: Not a string")
                }
                if (0 !== a.length % 4) {
                    throw TypeError("Illegal str: Length not a multiple of 4")
                }
            }
            var d = new g(a.length / 4 * 3, b, c), f = 0;
            v.h(m(a), function (a) {
                d.view.setUint8(f++, a)
            });
            d.limit = f;
            return d
        };
        g.btoa = function (a) {
            return g.fromBinary(a).toBase64()
        };
        g.atob = function (a) {
            return g.fromBase64(a).toBinary()
        };
        e.toBinary = function (a, b) {
            a = "undefined" === typeof a ? this.offset : a;
            b = "undefined" === typeof b ? this.limit : b;
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal begin: Not an integer")
                }
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal end: Not an integer")
                }
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) {
                    throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength)
                }
            }
            if (a === b) {
                return""
            }
            for (var c = [], d = []; a < b;) {
                c.push(this.view.getUint8(a++)), 1024 <= c.length && (d.push(String.fromCharCode.apply(String, c)), c = [])
            }
            return d.join("") + String.fromCharCode.apply(String, c)
        };
        g.fromBinary = function (a, b, c) {
            if (!c && "string" !== typeof a) {
                throw TypeError("Illegal str: Not a string")
            }
            for (var d = 0, f = a.length, e = new g(f, b, c); d < f;) {
                b = a.charCodeAt(d);
                if (!c && 255 < b) {
                    throw RangeError("Illegal charCode at " + d + ": 0 <= " + b + " <= 255")
                }
                e.view.setUint8(d++, b)
            }
            e.limit = f;
            return e
        };
        e.toDebug = function (a) {
            for (var b = -1, c = this.buffer.byteLength, d, f = "", e = "", g = ""; b < c;) {
                -1 !== b && (d = this.view.getUint8(b), f = 16 > d ? f + ("0" + d.toString(16).toUpperCase()) : f + d.toString(16).toUpperCase(), a && (e += 32 < d && 127 > d ? String.fromCharCode(d) : "."));
                ++b;
                if (a && 0 < b && 0 === b % 16 && b !== c) {
                    for (; 51 > f.length;) {
                        f += " "
                    }
                    g += f + e + "\n";
                    f = e = ""
                }
                f = b === this.offset && b === this.limit ? f + (b === this.markedOffset ? "!" : "|") : b === this.offset ? f + (b === this.markedOffset ? "[" : "<") : b === this.limit ? f + (b === this.markedOffset ? "]" : ">") : f + (b === this.markedOffset ? "'" : a || 0 !== b && b !== c ? " " : "")
            }
            if (a && " " !== f) {
                for (; 51 > f.length;) {
                    f += " "
                }
                g += f + e + "\n"
            }
            return a ? g : f
        };
        g.fromDebug = function (a, b, c) {
            var d = a.length;
            b = new g((d + 1) / 3 | 0, b, c);
            for (var f = 0, e = 0, h, k = !1, l = !1, m = !1, q = !1, p = !1; f < d;) {
                switch (h = a.charAt(f++)) {
                    case"!":
                        if (!c) {
                            if (l || m || q) {
                                p = !0;
                                break
                            }
                            l = m = q = !0
                        }
                        b.offset = b.markedOffset = b.limit = e;
                        k = !1;
                        break;
                    case"|":
                        if (!c) {
                            if (l || q) {
                                p = !0;
                                break
                            }
                            l = q = !0
                        }
                        b.offset = b.limit = e;
                        k = !1;
                        break;
                    case"[":
                        if (!c) {
                            if (l || m) {
                                p = !0;
                                break
                            }
                            l = m = !0
                        }
                        b.offset = b.markedOffset = e;
                        k = !1;
                        break;
                    case"<":
                        if (!c) {
                            if (l) {
                                p = !0;
                                break
                            }
                            l = !0
                        }
                        b.offset = e;
                        k = !1;
                        break;
                    case"]":
                        if (!c) {
                            if (q || m) {
                                p = !0;
                                break
                            }
                            q = m = !0
                        }
                        b.limit = b.markedOffset = e;
                        k = !1;
                        break;
                    case">":
                        if (!c) {
                            if (q) {
                                p = !0;
                                break
                            }
                            q = !0
                        }
                        b.limit = e;
                        k = !1;
                        break;
                    case"'":
                        if (!c) {
                            if (m) {
                                p = !0;
                                break
                            }
                            m = !0
                        }
                        b.markedOffset = e;
                        k = !1;
                        break;
                    case" ":
                        k = !1;
                        break;
                    default:
                        if (!c && k) {
                            p = !0;
                            break
                        }
                        h = parseInt(h + a.charAt(f++), 16);
                        if (!c && (isNaN(h) || 0 > h || 255 < h)) {
                            throw TypeError("Illegal str: Not a debug encoded string")
                        }
                        b.view.setUint8(e++, h);
                        k = !0
                }
                if (p) {
                    throw TypeError("Illegal str: Invalid symbol at " + f)
                }
            }
            if (!c) {
                if (!l || !q) {
                    throw TypeError("Illegal str: Missing offset or limit")
                }
                if (e < b.buffer.byteLength) {
                    throw TypeError("Illegal str: Not a debug encoded string (is it hex?) " + e + " < " + d)
                }
            }
            return b
        };
        e.toHex = function (a, b) {
            a = "undefined" === typeof a ? this.offset : a;
            b = "undefined" === typeof b ? this.limit : b;
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal begin: Not an integer")
                }
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal end: Not an integer")
                }
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) {
                    throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength)
                }
            }
            for (var c = Array(b - a), d; a < b;) {
                d = this.view.getUint8(a++), 16 > d ? c.push("0", d.toString(16)) : c.push(d.toString(16))
            }
            return c.join("")
        };
        g.fromHex = function (a, b, c) {
            if (!c) {
                if ("string" !== typeof a) {
                    throw TypeError("Illegal str: Not a string")
                }
                if (0 !== a.length % 2) {
                    throw TypeError("Illegal str: Length not a multiple of 2")
                }
            }
            var d = a.length;
            b = new g(d / 2 | 0, b);
            for (var f, e = 0, h = 0; e < d; e += 2) {
                f = parseInt(a.substring(e, e + 2), 16);
                if (!c && (!isFinite(f) || 0 > f || 255 < f)) {
                    throw TypeError("Illegal str: Contains non-hex characters")
                }
                b.view.setUint8(h++, f)
            }
            b.limit = h;
            return b
        };
        var l = function () {
            var a = {k: 1114111, j: function (a, c) {
                var d = null;
                "number" === typeof a && (d = a, a = function () {
                    return null
                });
                for (; null !== d || null !== (d = a());) {
                    128 > d ? c(d & 127) : (2048 > d ? c(d >> 6 & 31 | 192) : (65536 > d ? c(d >> 12 & 15 | 224) : (c(d >> 18 & 7 | 240), c(d >> 12 & 63 | 128)), c(d >> 6 & 63 | 128)), c(d & 63 | 128)), d = null
                }
            }, g: function (a, c) {
                function d(a) {
                    a = a.slice(0, a.indexOf(null));
                    var b = Error(a.toString());
                    b.name = "TruncatedError";
                    b.bytes = a;
                    throw b
                }

                for (var e, g, h, k; null !== (e = a());) {
                    if (0 === (e & 128)) {
                        c(e)
                    } else {
                        if (192 === (e & 224)) {
                            null === (g = a()) && d([e, g]), c((e & 31) << 6 | g & 63)
                        } else {
                            if (224 === (e & 240)) {
                                null !== (g = a()) && null !== (h = a()) || d([e, g, h]), c((e & 15) << 12 | (g & 63) << 6 | h & 63)
                            } else {
                                if (240 === (e & 248)) {
                                    null !== (g = a()) && null !== (h = a()) && null !== (k = a()) || d([e, g, h, k]), c((e & 7) << 18 | (g & 63) << 12 | (h & 63) << 6 | k & 63)
                                } else {
                                    throw RangeError("Illegal starting byte: " + e)
                                }
                            }
                        }
                    }
                }
            }, d: function (a, c) {
                for (var d, e = null; null !== (d = null !== e ? e : a());) {
                    55296 <= d && 57343 >= d && null !== (e = a()) && 56320 <= e && 57343 >= e ? (c(1024 * (d - 55296) + e - 56320 + 65536), e = null) : c(d)
                }
                null !== e && c(e)
            }, e: function (a, c) {
                var d = null;
                "number" === typeof a && (d = a, a = function () {
                    return null
                });
                for (; null !== d || null !== (d = a());) {
                    65535 >= d ? c(d) : (d -= 65536, c((d >> 10) + 55296), c(d % 1024 + 56320)), d = null
                }
            }, c: function (b, c) {
                a.d(b, function (b) {
                    a.j(b, c)
                })
            }, b: function (b, c) {
                a.g(b, function (b) {
                    a.e(b, c)
                })
            }, f: function (a) {
                return 128 > a ? 1 : 2048 > a ? 2 : 65536 > a ? 3 : 4
            }, l: function (b) {
                for (var c, d = 0; null !== (c = b());) {
                    d += a.f(c)
                }
                return d
            }, a: function (b) {
                var c = 0, d = 0;
                a.d(b, function (b) {
                    ++c;
                    d += a.f(b)
                });
                return[c, d]
            }};
            return a
        }();
        e.toUTF8 = function (a, b) {
            "undefined" === typeof a && (a = this.offset);
            "undefined" === typeof b && (b = this.limit);
            if (!this.noAssert) {
                if ("number" !== typeof a || 0 !== a % 1) {
                    throw TypeError("Illegal begin: Not an integer")
                }
                a >>>= 0;
                if ("number" !== typeof b || 0 !== b % 1) {
                    throw TypeError("Illegal end: Not an integer")
                }
                b >>>= 0;
                if (0 > a || a > b || b > this.buffer.byteLength) {
                    throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength)
                }
            }
            var c;
            try {
                l.b(function () {
                    return a < b ? this.view.getUint8(a++) : null
                }.bind(this), c = t())
            } catch (d) {
                if (a !== b) {
                    throw RangeError("Illegal range: Truncated data, " + a + " != " + b)
                }
            }
            return c()
        };
        g.fromUTF8 = function (a, b, c) {
            if (!c && "string" !== typeof a) {
                throw TypeError("Illegal str: Not a string")
            }
            var d = new g(l.a(m(a), !0)[1], b, c), e = 0;
            l.c(m(a), function (a) {
                d.view.setUint8(e++, a)
            });
            d.limit = e;
            return d
        };
        return g
    }

    "function" === typeof require && "object" === typeof module && module && module.id && "object" === typeof exports && exports ? module.exports = function () {
        var k;
        try {
            k = require("Long")
        } catch (g) {
        }
        return u(k)
    }() : "function" === typeof define && define.amd ? define("ByteBuffer", ["Long"], function (k) {
        return u(k)
    }) : (s.dcodeIO = s.dcodeIO || {}).ByteBuffer = u(s.dcodeIO.Long);
})(this);
(function (s) {
    function u(m) {
        var g = {VERSION: "3.7.0", WIRE_TYPES: {}};
        g.WIRE_TYPES.VARINT = 0;
        g.WIRE_TYPES.BITS64 = 1;
        g.WIRE_TYPES.LDELIM = 2;
        g.WIRE_TYPES.STARTGROUP = 3;
        g.WIRE_TYPES.ENDGROUP = 4;
        g.WIRE_TYPES.BITS32 = 5;
        g.PACKABLE_WIRE_TYPES = [g.WIRE_TYPES.VARINT, g.WIRE_TYPES.BITS64, g.WIRE_TYPES.BITS32];
        g.TYPES = {int32: {name: "int32", wireType: g.WIRE_TYPES.VARINT}, uint32: {name: "uint32", wireType: g.WIRE_TYPES.VARINT}, sint32: {name: "sint32", wireType: g.WIRE_TYPES.VARINT}, int64: {name: "int64", wireType: g.WIRE_TYPES.VARINT}, uint64: {name: "uint64", wireType: g.WIRE_TYPES.VARINT}, sint64: {name: "sint64", wireType: g.WIRE_TYPES.VARINT}, bool: {name: "bool", wireType: g.WIRE_TYPES.VARINT}, "double": {name: "double", wireType: g.WIRE_TYPES.BITS64}, string: {name: "string", wireType: g.WIRE_TYPES.LDELIM}, bytes: {name: "bytes", wireType: g.WIRE_TYPES.LDELIM}, fixed32: {name: "fixed32", wireType: g.WIRE_TYPES.BITS32}, sfixed32: {name: "sfixed32", wireType: g.WIRE_TYPES.BITS32}, fixed64: {name: "fixed64", wireType: g.WIRE_TYPES.BITS64}, sfixed64: {name: "sfixed64", wireType: g.WIRE_TYPES.BITS64}, "float": {name: "float", wireType: g.WIRE_TYPES.BITS32}, "enum": {name: "enum", wireType: g.WIRE_TYPES.VARINT}, message: {name: "message", wireType: g.WIRE_TYPES.LDELIM}, group: {name: "group", wireType: g.WIRE_TYPES.STARTGROUP}};
        g.ID_MIN = 1;
        g.ID_MAX = 536870911;
        g.ByteBuffer = m;
        g.Long = m.Long || null;
        g.convertFieldsToCamelCase = !1;
        g.populateAccessors = !0;
        g.Util = function () {
            Object.create || (Object.create = function (e) {
                function d() {
                }

                if (1 < arguments.length) {
                    throw Error("Object.create polyfill only accepts the first parameter.")
                }
                d.prototype = e;
                return new d
            });
            var e = {IS_NODE: !1};
            try {
                e.IS_NODE = "function" === typeof require && "function" === typeof require("fs").readFileSync && "function" === typeof require("path").resolve
            } catch (d) {
            }
            e.XHR = function () {
                for (var e = [function () {
                    return new XMLHttpRequest
                }, function () {
                    return new ActiveXObject("Msxml2.XMLHTTP")
                }, function () {
                    return new ActiveXObject("Msxml3.XMLHTTP")
                }, function () {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                }], d = null, g = 0; g < e.length; g++) {
                    try {
                        d = e[g]()
                    } catch (b) {
                        continue
                    }
                    break
                }
                if (!d) {
                    throw Error("XMLHttpRequest is not supported")
                }
                return d
            };
            e.fetch = function (d, g) {
                g && "function" != typeof g && (g = null);
                if (e.IS_NODE) {
                    if (g) {
                        require("fs").readFile(d, function (f, a) {
                            f ? g(null) : g("" + a)
                        })
                    } else {
                        try {
                            return require("fs").readFileSync(d)
                        } catch (n) {
                            return null
                        }
                    }
                } else {
                    var b = e.XHR();
                    b.open("GET", d, g ? !0 : !1);
                    b.setRequestHeader("Accept", "text/plain");
                    "function" === typeof b.overrideMimeType && b.overrideMimeType("text/plain");
                    if (g) {
                        b.onreadystatechange = function () {
                            4 == b.readyState && (200 == b.status || 0 == b.status && "string" === typeof b.responseText ? g(b.responseText) : g(null))
                        }, 4 != b.readyState && b.send(null)
                    } else {
                        return b.send(null), 200 == b.status || 0 == b.status && "string" === typeof b.responseText ? b.responseText : null
                    }
                }
            };
            e.isArray = Array.isArray || function (e) {
                return"[object Array]" === Object.prototype.toString.call(e)
            };
            return e
        }();
        g.Lang = {OPEN: "{", CLOSE: "}", OPTOPEN: "[", OPTCLOSE: "]", OPTEND: ",", EQUAL: "=", END: ";", STRINGOPEN: '"', STRINGCLOSE: '"', STRINGOPEN_SQ: "'", STRINGCLOSE_SQ: "'", COPTOPEN: "(", COPTCLOSE: ")", DELIM: /[\s\{\}=;\[\],'"\(\)]/g, RULE: /^(?:required|optional|repeated)$/, TYPE: /^(?:double|float|int32|uint32|sint32|int64|uint64|sint64|fixed32|sfixed32|fixed64|sfixed64|bool|string|bytes)$/, NAME: /^[a-zA-Z_][a-zA-Z_0-9]*$/, TYPEDEF: /^[a-zA-Z][a-zA-Z_0-9]*$/, TYPEREF: /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)+$/, FQTYPEREF: /^(?:\.[a-zA-Z][a-zA-Z_0-9]*)+$/, NUMBER: /^-?(?:[1-9][0-9]*|0|0x[0-9a-fA-F]+|0[0-7]+|([0-9]*\.[0-9]+([Ee][+-]?[0-9]+)?))$/, NUMBER_DEC: /^(?:[1-9][0-9]*|0)$/, NUMBER_HEX: /^0x[0-9a-fA-F]+$/, NUMBER_OCT: /^0[0-7]+$/, NUMBER_FLT: /^[0-9]*\.[0-9]+([Ee][+-]?[0-9]+)?$/, ID: /^(?:[1-9][0-9]*|0|0x[0-9a-fA-F]+|0[0-7]+)$/, NEGID: /^\-?(?:[1-9][0-9]*|0|0x[0-9a-fA-F]+|0[0-7]+)$/, WHITESPACE: /\s/, STRING: /['"]([^'"\\]*(\\.[^"\\]*)*)['"]/g, BOOL: /^(?:true|false)$/i};
        g.DotProto = function (e, d) {
            var g = {}, k = function (f) {
                this.source = "" + f;
                this.index = 0;
                this.line = 1;
                this.stack = [];
                this.readingString = !1;
                this.stringEndsWith = d.STRINGCLOSE
            }, n = k.prototype;
            n._readString = function () {
                d.STRING.lastIndex = this.index - 1;
                var f;
                if (null !== (f = d.STRING.exec(this.source))) {
                    return f = f[1], this.index = d.STRING.lastIndex, this.stack.push(this.stringEndsWith), f
                }
                throw Error("Unterminated string at line " + this.line + ", index " + this.index)
            };
            n.next = function () {
                if (0 < this.stack.length) {
                    return this.stack.shift()
                }
                if (this.index >= this.source.length) {
                    return null
                }
                if (this.readingString) {
                    return this.readingString = !1, this._readString()
                }
                var f, a;
                do {
                    for (f = !1; d.WHITESPACE.test(a = this.source.charAt(this.index));) {
                        if (this.index++, "\n" === a && this.line++, this.index === this.source.length) {
                            return null
                        }
                    }
                    if ("/" === this.source.charAt(this.index)) {
                        if ("/" === this.source.charAt(++this.index)) {
                            for (; "\n" !== this.source.charAt(this.index);) {
                                if (this.index++, this.index == this.source.length) {
                                    return null
                                }
                            }
                            this.index++;
                            this.line++;
                            f = !0
                        } else {
                            if ("*" === this.source.charAt(this.index)) {
                                for (a = ""; "*/" !== a + (a = this.source.charAt(this.index));) {
                                    if (this.index++, "\n" === a && this.line++, this.index === this.source.length) {
                                        return null
                                    }
                                }
                                this.index++;
                                f = !0
                            } else {
                                throw Error("Unterminated comment at line " + this.line + ": /" + this.source.charAt(this.index))
                            }
                        }
                    }
                } while (f);
                if (this.index === this.source.length) {
                    return null
                }
                f = this.index;
                d.DELIM.lastIndex = 0;
                if (d.DELIM.test(this.source.charAt(f))) {
                    ++f
                } else {
                    for (++f; f < this.source.length && !d.DELIM.test(this.source.charAt(f));) {
                        f++
                    }
                }
                f = this.source.substring(this.index, this.index = f);
                f === d.STRINGOPEN ? (this.readingString = !0, this.stringEndsWith = d.STRINGCLOSE) : f === d.STRINGOPEN_SQ && (this.readingString = !0, this.stringEndsWith = d.STRINGCLOSE_SQ);
                return f
            };
            n.peek = function () {
                if (0 === this.stack.length) {
                    var f = this.next();
                    if (null === f) {
                        return null
                    }
                    this.stack.push(f)
                }
                return this.stack[0]
            };
            n.toString = function () {
                return"Tokenizer(" + this.index + "/" + this.source.length + " at line " + this.line + ")"
            };
            g.Tokenizer = k;
            var n = function (f) {
                this.tn = new k(f)
            }, b = n.prototype;
            b.parse = function () {
                for (var f = {name: "[ROOT]", "package": null, messages: [], enums: [], imports: [], options: {}, services: []}, a, c = !0; a = this.tn.next();) {
                    switch (a) {
                        case"package":
                            if (!c || null !== f["package"]) {
                                throw Error("Unexpected package at line " + this.tn.line)
                            }
                            f["package"] = this._parsePackage(a);
                            break;
                        case"import":
                            if (!c) {
                                throw Error("Unexpected import at line " + this.tn.line)
                            }
                            f.imports.push(this._parseImport(a));
                            break;
                        case"message":
                            this._parseMessage(f, null, a);
                            c = !1;
                            break;
                        case"enum":
                            this._parseEnum(f, a);
                            c = !1;
                            break;
                        case"option":
                            if (!c) {
                                throw Error("Unexpected option at line " + this.tn.line)
                            }
                            this._parseOption(f, a);
                            break;
                        case"service":
                            this._parseService(f, a);
                            break;
                        case"extend":
                            this._parseExtend(f, a);
                            break;
                        case"syntax":
                            this._parseIgnoredStatement(f, a);
                            break;
                        default:
                            throw Error("Unexpected token at line " + this.tn.line + ": " + a)
                    }
                }
                delete f.name;
                return f
            };
            b._parseNumber = function (f) {
                var a = 1;
                "-" == f.charAt(0) && (a = -1, f = f.substring(1));
                if (d.NUMBER_DEC.test(f)) {
                    return a * parseInt(f, 10)
                }
                if (d.NUMBER_HEX.test(f)) {
                    return a * parseInt(f.substring(2), 16)
                }
                if (d.NUMBER_OCT.test(f)) {
                    return a * parseInt(f.substring(1), 8)
                }
                if (d.NUMBER_FLT.test(f)) {
                    return a * parseFloat(f)
                }
                throw Error("Illegal number at line " + this.tn.line + ": " + (0 > a ? "-" : "") + f)
            };
            b._parseString = function () {
                var f = "", a;
                do {
                    this.tn.next();
                    f += this.tn.next();
                    a = this.tn.next();
                    if (a !== this.tn.stringEndsWith) {
                        throw Error("Illegal end of string at line " + this.tn.line + ": " + a)
                    }
                    a = this.tn.peek()
                } while (a === d.STRINGOPEN || a === d.STRINGOPEN_SQ);
                return f
            };
            b._parseId = function (f, a) {
                var c = -1, b = 1;
                "-" == f.charAt(0) && (b = -1, f = f.substring(1));
                if (d.NUMBER_DEC.test(f)) {
                    c = parseInt(f)
                } else {
                    if (d.NUMBER_HEX.test(f)) {
                        c = parseInt(f.substring(2), 16)
                    } else {
                        if (d.NUMBER_OCT.test(f)) {
                            c = parseInt(f.substring(1), 8)
                        } else {
                            throw Error("Illegal id at line " + this.tn.line + ": " + (0 > b ? "-" : "") + f)
                        }
                    }
                }
                c = b * c | 0;
                if (!a && 0 > c) {
                    throw Error("Illegal id at line " + this.tn.line + ": " + (0 > b ? "-" : "") + f)
                }
                return c
            };
            b._parsePackage = function (f) {
                f = this.tn.next();
                if (!d.TYPEREF.test(f)) {
                    throw Error("Illegal package name at line " + this.tn.line + ": " + f)
                }
                var a = f;
                f = this.tn.next();
                if (f != d.END) {
                    throw Error("Illegal end of package at line " + this.tn.line + ": " + f)
                }
                return a
            };
            b._parseImport = function (f) {
                f = this.tn.peek();
                "public" === f && (this.tn.next(), f = this.tn.peek());
                if (f !== d.STRINGOPEN && f !== d.STRINGOPEN_SQ) {
                    throw Error("Illegal start of import at line " + this.tn.line + ": " + f)
                }
                var a = this._parseString();
                f = this.tn.next();
                if (f !== d.END) {
                    throw Error("Illegal end of import at line " + this.tn.line + ": " + f)
                }
                return a
            };
            b._parseOption = function (f, a) {
                a = this.tn.next();
                var c = !1;
                a == d.COPTOPEN && (c = !0, a = this.tn.next());
                if (!d.TYPEREF.test(a) && !/google\.protobuf\./.test(a)) {
                    throw Error("Illegal option name in message " + f.name + " at line " + this.tn.line + ": " + a)
                }
                var b = a;
                a = this.tn.next();
                if (c) {
                    if (a !== d.COPTCLOSE) {
                        throw Error("Illegal end in message " + f.name + ", option " + b + " at line " + this.tn.line + ": " + a)
                    }
                    b = "(" + b + ")";
                    a = this.tn.next();
                    d.FQTYPEREF.test(a) && (b += a, a = this.tn.next())
                }
                if (a !== d.EQUAL) {
                    throw Error("Illegal operator in message " + f.name + ", option " + b + " at line " + this.tn.line + ": " + a)
                }
                a = this.tn.peek();
                if (a === d.STRINGOPEN || a === d.STRINGOPEN_SQ) {
                    c = this._parseString()
                } else {
                    if (this.tn.next(), d.NUMBER.test(a)) {
                        c = this._parseNumber(a, !0)
                    } else {
                        if (d.BOOL.test(a)) {
                            c = "true" === a
                        } else {
                            if (d.TYPEREF.test(a)) {
                                c = a
                            } else {
                                throw Error("Illegal option value in message " + f.name + ", option " + b + " at line " + this.tn.line + ": " + a)
                            }
                        }
                    }
                }
                a = this.tn.next();
                if (a !== d.END) {
                    throw Error("Illegal end of option in message " + f.name + ", option " + b + " at line " + this.tn.line + ": " + a)
                }
                f.options[b] = c
            };
            b._parseIgnoredStatement = function (f, a) {
                var c;
                do {
                    c = this.tn.next();
                    if (null === c) {
                        throw Error("Unexpected EOF in " + f.name + ", " + a + " at line " + this.tn.line)
                    }
                    if (c === d.END) {
                        break
                    }
                } while (1)
            };
            b._parseService = function (f, a) {
                a = this.tn.next();
                if (!d.NAME.test(a)) {
                    throw Error("Illegal service name at line " + this.tn.line + ": " + a)
                }
                var c = a, b = {name: c, rpc: {}, options: {}};
                a = this.tn.next();
                if (a !== d.OPEN) {
                    throw Error("Illegal start of service " + c + " at line " + this.tn.line + ": " + a)
                }
                do {
                    if (a = this.tn.next(), "option" === a) {
                        this._parseOption(b, a)
                    } else {
                        if ("rpc" === a) {
                            this._parseServiceRPC(b, a)
                        } else {
                            if (a !== d.CLOSE) {
                                throw Error("Illegal type of service " + c + " at line " + this.tn.line + ": " + a)
                            }
                        }
                    }
                } while (a !== d.CLOSE);
                f.services.push(b)
            };
            b._parseServiceRPC = function (f, a) {
                var c = a;
                a = this.tn.next();
                if (!d.NAME.test(a)) {
                    throw Error("Illegal method name in service " + f.name + " at line " + this.tn.line + ": " + a)
                }
                var b = a, e = {request: null, response: null, options: {}};
                a = this.tn.next();
                if (a !== d.COPTOPEN) {
                    throw Error("Illegal start of request type in service " + f.name + "#" + b + " at line " + this.tn.line + ": " + a)
                }
                a = this.tn.next();
                if (!d.TYPEREF.test(a)) {
                    throw Error("Illegal request type in service " + f.name + "#" + b + " at line " + this.tn.line + ": " + a)
                }
                e.request = a;
                a = this.tn.next();
                if (a != d.COPTCLOSE) {
                    throw Error("Illegal end of request type in service " + f.name + "#" + b + " at line " + this.tn.line + ": " + a)
                }
                a = this.tn.next();
                if ("returns" !== a.toLowerCase()) {
                    throw Error("Illegal delimiter in service " + f.name + "#" + b + " at line " + this.tn.line + ": " + a)
                }
                a = this.tn.next();
                if (a != d.COPTOPEN) {
                    throw Error("Illegal start of response type in service " + f.name + "#" + b + " at line " + this.tn.line + ": " + a)
                }
                a = this.tn.next();
                e.response = a;
                a = this.tn.next();
                if (a !== d.COPTCLOSE) {
                    throw Error("Illegal end of response type in service " + f.name + "#" + b + " at line " + this.tn.line + ": " + a)
                }
                a = this.tn.next();
                if (a === d.OPEN) {
                    do {
                        if (a = this.tn.next(), "option" === a) {
                            this._parseOption(e, a)
                        } else {
                            if (a !== d.CLOSE) {
                                throw Error("Illegal start of option inservice " + f.name + "#" + b + " at line " + this.tn.line + ": " + a)
                            }
                        }
                    } while (a !== d.CLOSE);
                    this.tn.peek() === d.END && this.tn.next()
                } else {
                    if (a !== d.END) {
                        throw Error("Illegal delimiter in service " + f.name + "#" + b + " at line " + this.tn.line + ": " + a)
                    }
                }
                "undefined" === typeof f[c] && (f[c] = {});
                f[c][b] = e
            };
            b._parseMessage = function (f, a, c) {
                var b = {}, e = "group" === c;
                c = this.tn.next();
                if (!d.NAME.test(c)) {
                    throw Error("Illegal " + (e ? "group" : "message") + " name" + (f ? " in message " + f.name : "") + " at line " + this.tn.line + ": " + c)
                }
                b.name = c;
                if (e) {
                    c = this.tn.next();
                    if (c !== d.EQUAL) {
                        throw Error("Illegal id assignment after group " + b.name + " at line " + this.tn.line + ": " + c)
                    }
                    c = this.tn.next();
                    try {
                        a.id = this._parseId(c)
                    } catch (g) {
                        throw Error("Illegal field id value for group " + b.name + "#" + a.name + " at line " + this.tn.line + ": " + c)
                    }
                    b.isGroup = !0
                }
                b.fields = [];
                b.enums = [];
                b.messages = [];
                b.options = {};
                b.oneofs = {};
                c = this.tn.next();
                c === d.OPTOPEN && a && (this._parseFieldOptions(b, a, c), c = this.tn.next());
                if (c !== d.OPEN) {
                    throw Error("Illegal start of " + (e ? "group" : "message") + " " + b.name + " at line " + this.tn.line + ": " + c)
                }
                do {
                    if (c = this.tn.next(), c === d.CLOSE) {
                        c = this.tn.peek();
                        c === d.END && this.tn.next();
                        break
                    } else {
                        if (d.RULE.test(c)) {
                            this._parseMessageField(b, c)
                        } else {
                            if ("oneof" === c) {
                                this._parseMessageOneOf(b, c)
                            } else {
                                if ("enum" === c) {
                                    this._parseEnum(b, c)
                                } else {
                                    if ("message" === c) {
                                        this._parseMessage(b, null, c)
                                    } else {
                                        if ("option" === c) {
                                            this._parseOption(b, c)
                                        } else {
                                            if ("extensions" === c) {
                                                b.extensions = this._parseExtensions(b, c)
                                            } else {
                                                if ("extend" === c) {
                                                    this._parseExtend(b, c)
                                                } else {
                                                    throw Error("Illegal token in message " + b.name + " at line " + this.tn.line + ": " + c)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } while (1);
                f.messages.push(b);
                return b
            };
            b._parseMessageField = function (b, a) {
                var c = {}, e = null;
                c.rule = a;
                c.options = {};
                a = this.tn.next();
                if ("group" === a) {
                    e = this._parseMessage(b, c, a);
                    if (!/^[A-Z]/.test(e.name)) {
                        throw Error("Group names must start with a capital letter")
                    }
                    c.type = e.name;
                    c.name = e.name.toLowerCase();
                    a = this.tn.peek();
                    a === d.END && this.tn.next()
                } else {
                    if (!d.TYPE.test(a) && !d.TYPEREF.test(a)) {
                        throw Error("Illegal field type in message " + b.name + " at line " + this.tn.line + ": " + a)
                    }
                    c.type = a;
                    a = this.tn.next();
                    if (!d.NAME.test(a)) {
                        throw Error("Illegal field name in message " + b.name + " at line " + this.tn.line + ": " + a)
                    }
                    c.name = a;
                    a = this.tn.next();
                    if (a !== d.EQUAL) {
                        throw Error("Illegal token in field " + b.name + "#" + c.name + " at line " + this.tn.line + ": " + a)
                    }
                    a = this.tn.next();
                    try {
                        c.id = this._parseId(a)
                    } catch (g) {
                        throw Error("Illegal field id in message " + b.name + "#" + c.name + " at line " + this.tn.line + ": " + a)
                    }
                    a = this.tn.next();
                    a === d.OPTOPEN && (this._parseFieldOptions(b, c, a), a = this.tn.next());
                    if (a !== d.END) {
                        throw Error("Illegal delimiter in message " + b.name + "#" + c.name + " at line " + this.tn.line + ": " + a)
                    }
                }
                b.fields.push(c);
                return c
            };
            b._parseMessageOneOf = function (b, a) {
                a = this.tn.next();
                if (!d.NAME.test(a)) {
                    throw Error("Illegal oneof name in message " + b.name + " at line " + this.tn.line + ": " + a)
                }
                var c = a, e, g = [];
                a = this.tn.next();
                if (a !== d.OPEN) {
                    throw Error("Illegal start of oneof " + c + " at line " + this.tn.line + ": " + a)
                }
                for (; this.tn.peek() !== d.CLOSE;) {
                    e = this._parseMessageField(b, "optional"), e.oneof = c, g.push(e.id)
                }
                this.tn.next();
                b.oneofs[c] = g
            };
            b._parseFieldOptions = function (b, a, c) {
                var e = !0;
                do {
                    c = this.tn.next();
                    if (c === d.OPTCLOSE) {
                        break
                    } else {
                        if (c === d.OPTEND) {
                            if (e) {
                                throw Error("Illegal start of options in message " + b.name + "#" + a.name + " at line " + this.tn.line + ": " + c)
                            }
                            c = this.tn.next()
                        }
                    }
                    this._parseFieldOption(b, a, c);
                    e = !1
                } while (1)
            };
            b._parseFieldOption = function (b, a, c) {
                var e = !1;
                c === d.COPTOPEN && (c = this.tn.next(), e = !0);
                if (!d.TYPEREF.test(c)) {
                    throw Error("Illegal field option in " + b.name + "#" + a.name + " at line " + this.tn.line + ": " + c)
                }
                var g = c;
                c = this.tn.next();
                if (e) {
                    if (c !== d.COPTCLOSE) {
                        throw Error("Illegal delimiter in " + b.name + "#" + a.name + " at line " + this.tn.line + ": " + c)
                    }
                    g = "(" + g + ")";
                    c = this.tn.next();
                    d.FQTYPEREF.test(c) && (g += c, c = this.tn.next())
                }
                if (c !== d.EQUAL) {
                    throw Error("Illegal token in " + b.name + "#" + a.name + " at line " + this.tn.line + ": " + c)
                }
                c = this.tn.peek();
                if (c === d.STRINGOPEN || c === d.STRINGOPEN_SQ) {
                    b = this._parseString()
                } else {
                    if (d.NUMBER.test(c, !0)) {
                        b = this._parseNumber(this.tn.next(), !0)
                    } else {
                        if (d.BOOL.test(c)) {
                            b = "true" === this.tn.next().toLowerCase()
                        } else {
                            if (d.TYPEREF.test(c)) {
                                b = this.tn.next()
                            } else {
                                throw Error("Illegal value in message " + b.name + "#" + a.name + ", option " + g + " at line " + this.tn.line + ": " + c)
                            }
                        }
                    }
                }
                a.options[g] = b
            };
            b._parseEnum = function (b, a) {
                var c = {};
                a = this.tn.next();
                if (!d.NAME.test(a)) {
                    throw Error("Illegal enum name in message " + b.name + " at line " + this.tn.line + ": " + a)
                }
                c.name = a;
                a = this.tn.next();
                if (a !== d.OPEN) {
                    throw Error("Illegal start of enum " + c.name + " at line " + this.tn.line + ": " + a)
                }
                c.values = [];
                c.options = {};
                do {
                    a = this.tn.next();
                    if (a === d.CLOSE) {
                        a = this.tn.peek();
                        a === d.END && this.tn.next();
                        break
                    }
                    if ("option" == a) {
                        this._parseOption(c, a)
                    } else {
                        if (!d.NAME.test(a)) {
                            throw Error("Illegal name in enum " + c.name + " at line " + this.tn.line + ": " + a)
                        }
                        this._parseEnumValue(c, a)
                    }
                } while (1);
                b.enums.push(c)
            };
            b._parseEnumValue = function (b, a) {
                var c = {};
                c.name = a;
                a = this.tn.next();
                if (a !== d.EQUAL) {
                    throw Error("Illegal token in enum " + b.name + " at line " + this.tn.line + ": " + a)
                }
                a = this.tn.next();
                try {
                    c.id = this._parseId(a, !0)
                } catch (e) {
                    throw Error("Illegal id in enum " + b.name + " at line " + this.tn.line + ": " + a)
                }
                b.values.push(c);
                a = this.tn.next();
                a === d.OPTOPEN && (this._parseFieldOptions(b, {options: {}}, a), a = this.tn.next());
                if (a !== d.END) {
                    throw Error("Illegal delimiter in enum " + b.name + " at line " + this.tn.line + ": " + a)
                }
            };
            b._parseExtensions = function (b, a) {
                var c = [];
                a = this.tn.next();
                "min" === a ? c.push(e.ID_MIN) : "max" === a ? c.push(e.ID_MAX) : c.push(this._parseNumber(a));
                a = this.tn.next();
                if ("to" !== a) {
                    throw Error("Illegal extensions delimiter in message " + b.name + " at line " + this.tn.line + ": " + a)
                }
                a = this.tn.next();
                "min" === a ? c.push(e.ID_MIN) : "max" === a ? c.push(e.ID_MAX) : c.push(this._parseNumber(a));
                a = this.tn.next();
                if (a !== d.END) {
                    throw Error("Illegal extensions delimiter in message " + b.name + " at line " + this.tn.line + ": " + a)
                }
                return c
            };
            b._parseExtend = function (b, a) {
                a = this.tn.next();
                if (!d.TYPEREF.test(a)) {
                    throw Error("Illegal message name at line " + this.tn.line + ": " + a)
                }
                var c = {};
                c.ref = a;
                c.fields = [];
                a = this.tn.next();
                if (a !== d.OPEN) {
                    throw Error("Illegal start of extend " + c.name + " at line " + this.tn.line + ": " + a)
                }
                do {
                    if (a = this.tn.next(), a === d.CLOSE) {
                        a = this.tn.peek();
                        a == d.END && this.tn.next();
                        break
                    } else {
                        if (d.RULE.test(a)) {
                            this._parseMessageField(c, a)
                        } else {
                            throw Error("Illegal token in extend " + c.name + " at line " + this.tn.line + ": " + a)
                        }
                    }
                } while (1);
                b.messages.push(c);
                return c
            };
            b.toString = function () {
                return"Parser"
            };
            g.Parser = n;
            return g
        }(g, g.Lang);
        g.Reflect = function (e) {
            function d(a, b) {
                var c = b.readVarint32(), f = c & 7, c = c >> 3;
                switch (f) {
                    case e.WIRE_TYPES.VARINT:
                        do {
                            c = b.readUint8()
                        } while (128 === (c & 128));
                        break;
                    case e.WIRE_TYPES.BITS64:
                        b.offset += 8;
                        break;
                    case e.WIRE_TYPES.LDELIM:
                        c = b.readVarint32();
                        b.offset += c;
                        break;
                    case e.WIRE_TYPES.STARTGROUP:
                        d(c, b);
                        break;
                    case e.WIRE_TYPES.ENDGROUP:
                        if (c === a) {
                            return !1
                        }
                        throw Error("Illegal GROUPEND after unknown group: " + c + " (" + a + " expected)");
                    case e.WIRE_TYPES.BITS32:
                        b.offset += 4;
                        break;
                    default:
                        throw Error("Illegal wire type in unknown group " + a + ": " + f)
                }
                return !0
            }

            function g(a, b) {
                if (a && "number" === typeof a.low && "number" === typeof a.high && "boolean" === typeof a.unsigned && a.low === a.low && a.high === a.high) {
                    return new e.Long(a.low, a.high, "undefined" === typeof b ? a.unsigned : b)
                }
                if ("string" === typeof a) {
                    return e.Long.fromString(a, b || !1, 10)
                }
                if ("number" === typeof a) {
                    return e.Long.fromNumber(a, b || !1)
                }
                throw Error("not convertible to Long")
            }

            var k = {}, n = function (a, b, c) {
                this.builder = a;
                this.parent = b;
                this.name = c
            }, b = n.prototype;
            b.fqn = function () {
                var a = this.name, b = this;
                do {
                    b = b.parent;
                    if (null == b) {
                        break
                    }
                    a = b.name + "." + a
                } while (1);
                return a
            };
            b.toString = function (a) {
                return(a ? this.className + " " : "") + this.fqn()
            };
            b.build = function () {
                throw Error(this.toString(!0) + " cannot be built directly")
            };
            k.T = n;
            var f = function (a, b, c, e) {
                n.call(this, a, b, c);
                this.className = "Namespace";
                this.children = [];
                this.options = e || {}
            }, b = f.prototype = Object.create(n.prototype);
            b.getChildren = function (a) {
                a = a || null;
                if (null == a) {
                    return this.children.slice()
                }
                for (var b = [], c = 0, e = this.children.length; c < e; ++c) {
                    this.children[c] instanceof a && b.push(this.children[c])
                }
                return b
            };
            b.addChild = function (b) {
                var c;
                if (c = this.getChild(b.name)) {
                    if (c instanceof a.Field && c.name !== c.originalName && null === this.getChild(c.originalName)) {
                        c.name = c.originalName
                    } else {
                        if (b instanceof a.Field && b.name !== b.originalName && null === this.getChild(b.originalName)) {
                            b.name = b.originalName
                        } else {
                            throw Error("Duplicate name in namespace " + this.toString(!0) + ": " + b.name)
                        }
                    }
                }
                this.children.push(b)
            };
            b.getChild = function (a) {
                for (var b = "number" === typeof a ? "id" : "name", c = 0, e = this.children.length; c < e; ++c) {
                    if (this.children[c][b] === a) {
                        return this.children[c]
                    }
                }
                return null
            };
            b.resolve = function (a, b) {
                var c = a.split("."), e = this, f = 0;
                if ("" === c[f]) {
                    for (; null !== e.parent;) {
                        e = e.parent
                    }
                    f++
                }
                do {
                    do {
                        e = e.getChild(c[f]);
                        if (!(e && e instanceof k.T) || b && e instanceof k.Message.Field) {
                            e = null;
                            break
                        }
                        f++
                    } while (f < c.length);
                    if (null != e) {
                        break
                    }
                    if (null !== this.parent) {
                        return this.parent.resolve(a, b)
                    }
                } while (null != e);
                return e
            };
            b.build = function () {
                for (var a = {}, b = this.children, c = 0, e = b.length, d; c < e; ++c) {
                    d = b[c], d instanceof f && (a[d.name] = d.build())
                }
                Object.defineProperty && Object.defineProperty(a, "$options", {value: this.buildOpt()});
                return a
            };
            b.buildOpt = function () {
                for (var a = {}, b = Object.keys(this.options), c = 0, e = b.length; c < e; ++c) {
                    a[b[c]] = this.options[b[c]]
                }
                return a
            };
            b.getOption = function (a) {
                return"undefined" === typeof a ? this.options : "undefined" !== typeof this.options[a] ? this.options[a] : null
            };
            k.Namespace = f;
            var a = function (a, b, c, d, g) {
                f.call(this, a, b, c, d);
                this.className = "Message";
                this.extensions = [e.ID_MIN, e.ID_MAX];
                this.clazz = null;
                this.isGroup = !!g;
                this._fieldsByName = this._fieldsById = this._fields = null
            }, c = a.prototype = Object.create(f.prototype);
            c.build = function (b) {
                if (this.clazz && !b) {
                    return this.clazz
                }
                b = function (a, b) {
                    function c(a, b) {
                        var e = {}, l;
                        for (l in a) {
                            a.hasOwnProperty(l) && (null === a[l] || "object" !== typeof a[l] ? e[l] = a[l] : a[l] instanceof m ? b && (e[l] = a.toBuffer()) : e[l] = c(a[l], b))
                        }
                        return e
                    }

                    var e = b.getChildren(a.Reflect.Message.Field), l = b.getChildren(a.Reflect.Message.OneOf), f = function (b, c) {
                        a.Builder.Message.call(this);
                        for (var d = 0, f = l.length; d < f; ++d) {
                            this[l[d].name] = null
                        }
                        d = 0;
                        for (f = e.length; d < f; ++d) {
                            var q = e[d];
                            this[q.name] = q.repeated ? [] : null;
                            q.required && null !== q.defaultValue && (this[q.name] = q.defaultValue)
                        }
                        if (0 < arguments.length) {
                            if (1 !== arguments.length || "object" !== typeof b || "function" === typeof b.encode || a.Util.isArray(b) || b instanceof m || b instanceof ArrayBuffer || a.Long && b instanceof a.Long) {
                                for (d = 0, f = arguments.length; d < f; ++d) {
                                    this.$set(e[d].name, arguments[d])
                                }
                            } else {
                                for (q = Object.keys(b), d = 0, f = q.length; d < f; ++d) {
                                    this.$set(q[d], b[q[d]])
                                }
                            }
                        }
                    }, d = f.prototype = Object.create(a.Builder.Message.prototype);
                    d.add = function (c, e, d) {
                        var l = b._fieldsByName[c];
                        if (!d) {
                            if (!l) {
                                throw Error(this + "#" + c + " is undefined")
                            }
                            if (!(l instanceof a.Reflect.Message.Field)) {
                                throw Error(this + "#" + c + " is not a field: " + l.toString(!0))
                            }
                            if (!l.repeated) {
                                throw Error(this + "#" + c + " is not a repeated field")
                            }
                        }
                        null === this[l.name] && (this[l.name] = []);
                        this[l.name].push(d ? e : l.verifyValue(e, !0))
                    };
                    d.$add = d.add;
                    d.set = function (c, e, d) {
                        if (c && "object" === typeof c) {
                            for (var l in c) {
                                c.hasOwnProperty(l) && this.$set(l, c[l], d)
                            }
                            return this
                        }
                        l = b._fieldsByName[c];
                        if (d) {
                            this[l.name] = e
                        } else {
                            if (!l) {
                                throw Error(this + "#" + c + " is not a field: undefined")
                            }
                            if (!(l instanceof a.Reflect.Message.Field)) {
                                throw Error(this + "#" + c + " is not a field: " + l.toString(!0))
                            }
                            this[l.name] = e = l.verifyValue(e)
                        }
                        l.oneof && (null !== e ? (null !== this[l.oneof.name] && (this[this[l.oneof.name]] = null), this[l.oneof.name] = l.name) : l.oneof.name === c && (this[l.oneof.name] = null));
                        return this
                    };
                    d.$set = d.set;
                    d.get = function (c, l) {
                        if (l) {
                            return this[c]
                        }
                        var e = b._fieldsByName[c];
                        if (!(e && e instanceof a.Reflect.Message.Field)) {
                            throw Error(this + "#" + c + " is not a field: undefined")
                        }
                        if (!(e instanceof a.Reflect.Message.Field)) {
                            throw Error(this + "#" + c + " is not a field: " + e.toString(!0))
                        }
                        return this[e.name]
                    };
                    d.$get = d.get;
                    for (var q = 0; q < e.length; q++) {
                        var g = e[q];
                        g instanceof a.Reflect.Message.ExtensionField || b.builder.options.populateAccessors && function (a) {
                            var c = a.originalName.replace(/(_[a-zA-Z])/g, function (a) {
                                return a.toUpperCase().replace("_", "")
                            }), c = c.substring(0, 1).toUpperCase() + c.substring(1), l = a.originalName.replace(/([A-Z])/g, function (a) {
                                return"_" + a
                            }), e = function (b, c) {
                                this[a.name] = c ? b : a.verifyValue(b);
                                return this
                            }, f = function () {
                                return this[a.name]
                            };
                            null === b.getChild("set" + c) && (d["set" + c] = e);
                            null === b.getChild("set_" + l) && (d["set_" + l] = e);
                            null === b.getChild("get" + c) && (d["get" + c] = f);
                            null === b.getChild("get_" + l) && (d["get_" + l] = f)
                        }(g)
                    }
                    d.encode = function (a, c) {
                        "boolean" === typeof a && (c = a, a = void 0);
                        var l = !1;
                        a || (a = new m, l = !0);
                        var e = a.littleEndian;
                        try {
                            return b.encode(this, a.LE(), c), (l ? a.flip() : a).LE(e)
                        } catch (d) {
                            throw a.LE(e), d
                        }
                    };
                    d.calculate = function () {
                        return b.calculate(this)
                    };
                    d.encodeDelimited = function (a) {
                        var c = !1;
                        a || (a = new m, c = !0);
                        var l = (new m).LE();
                        b.encode(this, l).flip();
                        a.writeVarint32(l.remaining());
                        a.append(l);
                        return c ? a.flip() : a
                    };
                    d.encodeAB = function () {
                        try {
                            return this.encode().toArrayBuffer()
                        } catch (a) {
                            throw a.encoded && (a.encoded = a.encoded.toArrayBuffer()), a
                        }
                    };
                    d.toArrayBuffer = d.encodeAB;
                    d.encodeNB = function () {
                        try {
                            return this.encode().toBuffer()
                        } catch (a) {
                            throw a.encoded && (a.encoded = a.encoded.toBuffer()), a
                        }
                    };
                    d.toBuffer = d.encodeNB;
                    d.encode64 = function () {
                        try {
                            return this.encode().toBase64()
                        } catch (a) {
                            throw a.encoded && (a.encoded = a.encoded.toBase64()), a
                        }
                    };
                    d.toBase64 = d.encode64;
                    d.encodeHex = function () {
                        try {
                            return this.encode().toHex()
                        } catch (a) {
                            throw a.encoded && (a.encoded = a.encoded.toHex()), a
                        }
                    };
                    d.toHex = d.encodeHex;
                    d.toRaw = function (a) {
                        return c(this, !!a)
                    };
                    f.decode = function (a, c) {
                        "string" === typeof a && (a = m.wrap(a, c ? c : "base64"));
                        a = a instanceof m ? a : m.wrap(a);
                        var l = a.littleEndian;
                        try {
                            var e = b.decode(a.LE());
                            a.LE(l);
                            return e
                        } catch (d) {
                            throw a.LE(l), d
                        }
                    };
                    f.decodeDelimited = function (a, c) {
                        "string" === typeof a && (a = m.wrap(a, c ? c : "base64"));
                        a = a instanceof m ? a : m.wrap(a);
                        if (1 > a.remaining()) {
                            return null
                        }
                        var l = a.offset, e = a.readVarint32();
                        if (a.remaining() < e) {
                            return a.offset = l, null
                        }
                        try {
                            var d = b.decode(a.slice(a.offset, a.offset + e).LE());
                            a.offset += e;
                            return d
                        } catch (f) {
                            throw a.offset += e, f
                        }
                    };
                    f.decode64 = function (a) {
                        return f.decode(a, "base64")
                    };
                    f.decodeHex = function (a) {
                        return f.decode(a, "hex")
                    };
                    d.toString = function () {
                        return b.toString()
                    };
                    Object.defineProperty && (Object.defineProperty(f, "$options", {value: b.buildOpt()}), Object.defineProperty(d, "$type", {get: function () {
                        return b
                    }}));
                    return f
                }(e, this);
                this._fields = [];
                this._fieldsById = {};
                this._fieldsByName = {};
                for (var c = 0, f = this.children.length, d; c < f; c++) {
                    if (d = this.children[c], d instanceof p) {
                        b[d.name] = d.build()
                    } else {
                        if (d instanceof a) {
                            b[d.name] = d.build()
                        } else {
                            if (d instanceof a.Field) {
                                d.build(), this._fields.push(d), this._fieldsById[d.id] = d, this._fieldsByName[d.name] = d
                            } else {
                                if (!(d instanceof a.OneOf || d instanceof h)) {
                                    throw Error("Illegal reflect child of " + this.toString(!0) + ": " + children[c].toString(!0))
                                }
                            }
                        }
                    }
                }
                return this.clazz = b
            };
            c.encode = function (a, b, c) {
                for (var e = null, d, f = 0, g = this._fields.length, h; f < g; ++f) {
                    d = this._fields[f], h = a[d.name], d.required && null === h ? null === e && (e = d) : d.encode(c ? h : d.verifyValue(h), b)
                }
                if (null !== e) {
                    throw a = Error("Missing at least one required field for " + this.toString(!0) + ": " + e), a.encoded = b, a
                }
                return b
            };
            c.calculate = function (a) {
                for (var b = 0, c = 0, e = this._fields.length, d, f; c < e; ++c) {
                    d = this._fields[c];
                    f = a[d.name];
                    if (d.required && null === f) {
                        throw Error("Missing at least one required field for " + this.toString(!0) + ": " + d)
                    }
                    b += d.calculate(f)
                }
                return b
            };
            c.decode = function (a, b, c) {
                b = "number" === typeof b ? b : -1;
                for (var f = a.offset, g = new this.clazz, h, p, k; a.offset < f + b || -1 === b && 0 < a.remaining();) {
                    h = a.readVarint32();
                    p = h & 7;
                    k = h >> 3;
                    if (p === e.WIRE_TYPES.ENDGROUP) {
                        if (k !== c) {
                            throw Error("Illegal group end indicator for " + this.toString(!0) + ": " + k + " (" + (c ? c + " expected" : "not a group") + ")")
                        }
                        break
                    }
                    if (h = this._fieldsById[k]) {
                        h.repeated && !h.options.packed ? g[h.name].push(h.decode(p, a)) : (g[h.name] = h.decode(p, a), h.oneof && (null !== this[h.oneof.name] && (this[this[h.oneof.name]] = null), g[h.oneof.name] = h.name))
                    } else {
                        switch (p) {
                            case e.WIRE_TYPES.VARINT:
                                a.readVarint32();
                                break;
                            case e.WIRE_TYPES.BITS32:
                                a.offset += 4;
                                break;
                            case e.WIRE_TYPES.BITS64:
                                a.offset += 8;
                                break;
                            case e.WIRE_TYPES.LDELIM:
                                h = a.readVarint32();
                                a.offset += h;
                                break;
                            case e.WIRE_TYPES.STARTGROUP:
                                for (; d(k, a);) {
                                }
                                break;
                            default:
                                throw Error("Illegal wire type for unknown field " + k + " in " + this.toString(!0) + "#decode: " + p)
                        }
                    }
                }
                a = 0;
                for (b = this._fields.length; a < b; ++a) {
                    if (h = this._fields[a], null === g[h.name]) {
                        if (h.required) {
                            throw a = Error("Missing at least one required field for " + this.toString(!0) + ": " + h.name), a.decoded = g, a
                        }
                        null !== h.defaultValue && (g[h.name] = h.defaultValue)
                    }
                }
                return g
            };
            k.Message = a;
            var r = function (b, c, e, d, f, g, h, p) {
                n.call(this, b, c, f);
                this.className = "Message.Field";
                this.required = "required" === e;
                this.repeated = "repeated" === e;
                this.type = d;
                this.resolvedType = null;
                this.id = g;
                this.options = h || {};
                this.defaultValue = null;
                this.oneof = p || null;
                this.originalName = this.name;
                !this.builder.options.convertFieldsToCamelCase || this instanceof a.ExtensionField || (this.name = r._toCamelCase(this.name))
            };
            r._toCamelCase = function (a) {
                return a.replace(/_([a-zA-Z])/g, function (a, b) {
                    return b.toUpperCase()
                })
            };
            c = r.prototype = Object.create(n.prototype);
            c.build = function () {
                this.defaultValue = "undefined" !== typeof this.options["default"] ? this.verifyValue(this.options["default"]) : null
            };
            c.verifyValue = function (a, b) {
                b = b || !1;
                var c = function (a, b) {
                    throw Error("Illegal value for " + this.toString(!0) + " of type " + this.type.name + ": " + a + " (" + b + ")")
                }.bind(this);
                if (null === a) {
                    return this.required && c(typeof a, "required"), null
                }
                var d;
                if (this.repeated && !b) {
                    e.Util.isArray(a) || (a = [a]);
                    c = [];
                    for (d = 0; d < a.length; d++) {
                        c.push(this.verifyValue(a[d], !0))
                    }
                    return c
                }
                !this.repeated && e.Util.isArray(a) && c(typeof a, "no array expected");
                switch (this.type) {
                    case e.TYPES.int32:
                    case e.TYPES.sint32:
                    case e.TYPES.sfixed32:
                        return("number" !== typeof a || a === a && 0 !== a % 1) && c(typeof a, "not an integer"), 4294967295 < a ? a | 0 : a;
                    case e.TYPES.uint32:
                    case e.TYPES.fixed32:
                        return("number" !== typeof a || a === a && 0 !== a % 1) && c(typeof a, "not an integer"), 0 > a ? a >>> 0 : a;
                    case e.TYPES.int64:
                    case e.TYPES.sint64:
                    case e.TYPES.sfixed64:
                        if (e.Long) {
                            try {
                                return g(a, !1)
                            } catch (f) {
                                c(typeof a, f.message)
                            }
                        } else {
                            c(typeof a, "requires Long.js")
                        }
                    case e.TYPES.uint64:
                    case e.TYPES.fixed64:
                        if (e.Long) {
                            try {
                                return g(a, !0)
                            } catch (h) {
                                c(typeof a, h.message)
                            }
                        } else {
                            c(typeof a, "requires Long.js")
                        }
                    case e.TYPES.bool:
                        return"boolean" !== typeof a && c(typeof a, "not a boolean"), a;
                    case e.TYPES["float"]:
                    case e.TYPES["double"]:
                        return"number" !== typeof a && c(typeof a, "not a number"), a;
                    case e.TYPES.string:
                        return"string" === typeof a || a && a instanceof String || c(typeof a, "not a string"), "" + a;
                    case e.TYPES.bytes:
                        return a && a instanceof m ? a : m.wrap(a);
                    case e.TYPES["enum"]:
                        var k = this.resolvedType.getChildren(p.Value);
                        for (d = 0; d < k.length; d++) {
                            if (k[d].name == a || k[d].id == a) {
                                return k[d].id
                            }
                        }
                        c(a, "not a valid enum value");
                    case e.TYPES.group:
                    case e.TYPES.message:
                        a && "object" === typeof a || c(typeof a, "object expected");
                        if (a instanceof this.resolvedType.clazz) {
                            return a
                        }
                        if (a instanceof e.Builder.Message) {
                            c = {};
                            for (d in a) {
                                a.hasOwnProperty(d) && (c[d] = a[d])
                            }
                            a = c
                        }
                        return new this.resolvedType.clazz(a)
                }
                throw Error("[INTERNAL] Illegal value for " + this.toString(!0) + ": " + a + " (undefined type " + this.type + ")")
            };
            c.encode = function (a, b) {
                if (null === this.type || "object" !== typeof this.type) {
                    throw Error("[INTERNAL] Unresolved type in " + this.toString(!0) + ": " + this.type)
                }
                if (null === a || this.repeated && 0 == a.length) {
                    return b
                }
                try {
                    if (this.repeated) {
                        var c;
                        if (this.options.packed && 0 <= e.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType)) {
                            b.writeVarint32(this.id << 3 | e.WIRE_TYPES.LDELIM);
                            b.ensureCapacity(b.offset += 1);
                            var d = b.offset;
                            for (c = 0; c < a.length; c++) {
                                this.encodeValue(a[c], b)
                            }
                            var f = b.offset - d, g = m.calculateVarint32(f);
                            if (1 < g) {
                                var h = b.slice(d, b.offset), d = d + (g - 1);
                                b.offset = d;
                                b.append(h)
                            }
                            b.writeVarint32(f, d - g)
                        } else {
                            for (c = 0; c < a.length; c++) {
                                b.writeVarint32(this.id << 3 | this.type.wireType), this.encodeValue(a[c], b)
                            }
                        }
                    } else {
                        b.writeVarint32(this.id << 3 | this.type.wireType), this.encodeValue(a, b)
                    }
                } catch (k) {
                    throw Error("Illegal value for " + this.toString(!0) + ": " + a + " (" + k + ")")
                }
                return b
            };
            c.encodeValue = function (a, b) {
                if (null === a) {
                    return b
                }
                switch (this.type) {
                    case e.TYPES.int32:
                        0 > a ? b.writeVarint64(a) : b.writeVarint32(a);
                        break;
                    case e.TYPES.uint32:
                        b.writeVarint32(a);
                        break;
                    case e.TYPES.sint32:
                        b.writeVarint32ZigZag(a);
                        break;
                    case e.TYPES.fixed32:
                        b.writeUint32(a);
                        break;
                    case e.TYPES.sfixed32:
                        b.writeInt32(a);
                        break;
                    case e.TYPES.int64:
                    case e.TYPES.uint64:
                        b.writeVarint64(a);
                        break;
                    case e.TYPES.sint64:
                        b.writeVarint64ZigZag(a);
                        break;
                    case e.TYPES.fixed64:
                        b.writeUint64(a);
                        break;
                    case e.TYPES.sfixed64:
                        b.writeInt64(a);
                        break;
                    case e.TYPES.bool:
                        "string" === typeof a ? b.writeVarint32("false" === a.toLowerCase() ? 0 : !!a) : b.writeVarint32(a ? 1 : 0);
                        break;
                    case e.TYPES["enum"]:
                        b.writeVarint32(a);
                        break;
                    case e.TYPES["float"]:
                        b.writeFloat32(a);
                        break;
                    case e.TYPES["double"]:
                        b.writeFloat64(a);
                        break;
                    case e.TYPES.string:
                        b.writeVString(a);
                        break;
                    case e.TYPES.bytes:
                        if (0 > a.remaining()) {
                            throw Error("Illegal value for " + this.toString(!0) + ": " + a.remaining() + " bytes remaining")
                        }
                        var c = a.offset;
                        b.writeVarint32(a.remaining());
                        b.append(a);
                        a.offset = c;
                        break;
                    case e.TYPES.message:
                        c = (new m).LE();
                        this.resolvedType.encode(a, c);
                        b.writeVarint32(c.offset);
                        b.append(c.flip());
                        break;
                    case e.TYPES.group:
                        this.resolvedType.encode(a, b);
                        b.writeVarint32(this.id << 3 | e.WIRE_TYPES.ENDGROUP);
                        break;
                    default:
                        throw Error("[INTERNAL] Illegal value to encode in " + this.toString(!0) + ": " + a + " (unknown type)")
                }
                return b
            };
            c.calculate = function (a) {
                a = this.verifyValue(a);
                if (null === this.type || "object" !== typeof this.type) {
                    throw Error("[INTERNAL] Unresolved type in " + this.toString(!0) + ": " + this.type)
                }
                if (null === a || this.repeated && 0 == a.length) {
                    return 0
                }
                var b = 0;
                try {
                    if (this.repeated) {
                        var c, d;
                        if (this.options.packed && 0 <= e.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType)) {
                            b += m.calculateVarint32(this.id << 3 | e.WIRE_TYPES.LDELIM);
                            for (c = d = 0; c < a.length; c++) {
                                d += this.calculateValue(a[c])
                            }
                            b += m.calculateVarint32(d);
                            b += d
                        } else {
                            for (c = 0; c < a.length; c++) {
                                b += m.calculateVarint32(this.id << 3 | this.type.wireType), b += this.calculateValue(a[c])
                            }
                        }
                    } else {
                        b += m.calculateVarint32(this.id << 3 | this.type.wireType), b += this.calculateValue(a)
                    }
                } catch (f) {
                    throw Error("Illegal value for " + this.toString(!0) + ": " + a + " (" + f + ")")
                }
                return b
            };
            c.calculateValue = function (a) {
                if (null === a) {
                    return 0
                }
                switch (this.type) {
                    case e.TYPES.int32:
                        return 0 > a ? m.calculateVarint64(a) : m.calculateVarint32(a);
                    case e.TYPES.uint32:
                        return m.calculateVarint32(a);
                    case e.TYPES.sint32:
                        return m.calculateVarint32(m.zigZagEncode32(a));
                    case e.TYPES.fixed32:
                    case e.TYPES.sfixed32:
                    case e.TYPES["float"]:
                        return 4;
                    case e.TYPES.int64:
                    case e.TYPES.uint64:
                        return m.calculateVarint64(a);
                    case e.TYPES.sint64:
                        return m.calculateVarint64(m.zigZagEncode64(a));
                    case e.TYPES.fixed64:
                    case e.TYPES.sfixed64:
                        return 8;
                    case e.TYPES.bool:
                        return 1;
                    case e.TYPES["enum"]:
                        return m.calculateVarint32(a);
                    case e.TYPES["double"]:
                        return 8;
                    case e.TYPES.string:
                        return a = m.calculateUTF8Bytes(a), m.calculateVarint32(a) + a;
                    case e.TYPES.bytes:
                        if (0 > a.remaining()) {
                            throw Error("Illegal value for " + this.toString(!0) + ": " + a.remaining() + " bytes remaining")
                        }
                        return m.calculateVarint32(a.remaining()) + a.remaining();
                    case e.TYPES.message:
                        return a = this.resolvedType.calculate(a), m.calculateVarint32(a) + a;
                    case e.TYPES.group:
                        return a = this.resolvedType.calculate(a), a + m.calculateVarint32(this.id << 3 | e.WIRE_TYPES.ENDGROUP)
                }
                throw Error("[INTERNAL] Illegal value to encode in " + this.toString(!0) + ": " + a + " (unknown type)")
            };
            c.decode = function (a, b, c) {
                if (a != this.type.wireType && (c || a != e.WIRE_TYPES.LDELIM || !this.repeated)) {
                    throw Error("Illegal wire type for field " + this.toString(!0) + ": " + a + " (" + this.type.wireType + " expected)")
                }
                if (a == e.WIRE_TYPES.LDELIM && this.repeated && this.options.packed && 0 <= e.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) && !c) {
                    a = b.readVarint32();
                    a = b.offset + a;
                    for (c = []; b.offset < a;) {
                        c.push(this.decode(this.type.wireType, b, !0))
                    }
                    return c
                }
                switch (this.type) {
                    case e.TYPES.int32:
                        return b.readVarint32() | 0;
                    case e.TYPES.uint32:
                        return b.readVarint32() >>> 0;
                    case e.TYPES.sint32:
                        return b.readVarint32ZigZag() | 0;
                    case e.TYPES.fixed32:
                        return b.readUint32() >>> 0;
                    case e.TYPES.sfixed32:
                        return b.readInt32() | 0;
                    case e.TYPES.int64:
                        return b.readVarint64();
                    case e.TYPES.uint64:
                        return b.readVarint64().toUnsigned();
                    case e.TYPES.sint64:
                        return b.readVarint64ZigZag();
                    case e.TYPES.fixed64:
                        return b.readUint64();
                    case e.TYPES.sfixed64:
                        return b.readInt64();
                    case e.TYPES.bool:
                        return !!b.readVarint32();
                    case e.TYPES["enum"]:
                        return b.readVarint32();
                    case e.TYPES["float"]:
                        return b.readFloat();
                    case e.TYPES["double"]:
                        return b.readDouble();
                    case e.TYPES.string:
                        return b.readVString();
                    case e.TYPES.bytes:
                        a = b.readVarint32();
                        if (b.remaining() < a) {
                            throw Error("Illegal number of bytes for " + this.toString(!0) + ": " + a + " required but got only " + b.remaining())
                        }
                        c = b.clone();
                        c.limit = c.offset + a;
                        b.offset += a;
                        return c;
                    case e.TYPES.message:
                        return a = b.readVarint32(), this.resolvedType.decode(b, a);
                    case e.TYPES.group:
                        return this.resolvedType.decode(b, -1, this.id)
                }
                throw Error("[INTERNAL] Illegal wire type for " + this.toString(!0) + ": " + a)
            };
            k.Message.Field = r;
            c = function (a, b, c, d, e, f, g) {
                r.call(this, a, b, c, d, e, f, g)
            };
            c.prototype = Object.create(r.prototype);
            k.Message.ExtensionField = c;
            k.Message.OneOf = function (a, b, c) {
                n.call(this, a, b, c);
                this.fields = []
            };
            var p = function (a, b, c, d) {
                f.call(this, a, b, c, d);
                this.className = "Enum";
                this.object = null
            };
            (p.prototype = Object.create(f.prototype)).build = function () {
                for (var a = {}, b = this.getChildren(p.Value), c = 0, d = b.length; c < d; ++c) {
                    a[b[c].name] = b[c].id
                }
                Object.defineProperty && Object.defineProperty(a, "$options", {value: this.buildOpt()});
                return this.object = a
            };
            k.Enum = p;
            c = function (a, b, c, d) {
                n.call(this, a, b, c);
                this.className = "Enum.Value";
                this.id = d
            };
            c.prototype = Object.create(n.prototype);
            k.Enum.Value = c;
            var h = function (a, b, c, d) {
                n.call(this, a, b, c);
                this.field = d
            };
            h.prototype = Object.create(n.prototype);
            k.Extension = h;
            c = function (a, b, c, d) {
                f.call(this, a, b, c, d);
                this.className = "Service";
                this.clazz = null
            };
            (c.prototype = Object.create(f.prototype)).build = function (a) {
                return this.clazz && !a ? this.clazz : this.clazz = function (a, b) {
                    var c = function (b) {
                        a.Builder.Service.call(this);
                        this.rpcImpl = b || function (a, b, c) {
                            setTimeout(c.bind(this, Error("Not implemented, see: https://github.com/dcodeIO/ProtoBuf.js/wiki/Services")), 0)
                        }
                    }, d = c.prototype = Object.create(a.Builder.Service.prototype);
                    Object.defineProperty && (Object.defineProperty(c, "$options", {value: b.buildOpt()}), Object.defineProperty(d, "$options", {value: c.$options}));
                    for (var e = b.getChildren(a.Reflect.Service.RPCMethod), f = 0; f < e.length; f++) {
                        (function (a) {
                            d[a.name] = function (c, d) {
                                try {
                                    c && c instanceof a.resolvedRequestType.clazz ? this.rpcImpl(a.fqn(), c, function (c, e) {
                                        if (c) {
                                            d(c)
                                        } else {
                                            try {
                                                e = a.resolvedResponseType.clazz.decode(e)
                                            } catch (f) {
                                            }
                                            e && e instanceof a.resolvedResponseType.clazz ? d(null, e) : d(Error("Illegal response type received in service method " + b.name + "#" + a.name))
                                        }
                                    }) : setTimeout(d.bind(this, Error("Illegal request type provided to service method " + b.name + "#" + a.name)), 0)
                                } catch (e) {
                                    setTimeout(d.bind(this, e), 0)
                                }
                            };
                            c[a.name] = function (b, d, e) {
                                (new c(b))[a.name](d, e)
                            };
                            Object.defineProperty && (Object.defineProperty(c[a.name], "$options", {value: a.buildOpt()}), Object.defineProperty(d[a.name], "$options", {value: c[a.name].$options}))
                        })(e[f])
                    }
                    return c
                }(e, this)
            };
            k.Service = c;
            var t = function (a, b, c, d) {
                n.call(this, a, b, c);
                this.className = "Service.Method";
                this.options = d || {}
            };
            (t.prototype = Object.create(n.prototype)).buildOpt = b.buildOpt;
            k.Service.Method = t;
            b = function (a, b, c, d, e, f) {
                t.call(this, a, b, c, f);
                this.className = "Service.RPCMethod";
                this.requestName = d;
                this.responseName = e;
                this.resolvedResponseType = this.resolvedRequestType = null
            };
            b.prototype = Object.create(t.prototype);
            k.Service.RPCMethod = b;
            return k
        }(g);
        g.Builder = function (e, d, g) {
            var k = function (b) {
                this.ptr = this.ns = new g.Namespace(this, null, "");
                this.resolved = !1;
                this.result = null;
                this.files = {};
                this.importRoot = null;
                this.options = b || {}
            }, n = k.prototype;
            n.reset = function () {
                this.ptr = this.ns
            };
            n.define = function (b, e) {
                if ("string" !== typeof b || !d.TYPEREF.test(b)) {
                    throw Error("Illegal package: " + b)
                }
                var a = b.split("."), c;
                for (c = 0; c < a.length; c++) {
                    if (!d.NAME.test(a[c])) {
                        throw Error("Illegal package: " + a[c])
                    }
                }
                for (c = 0; c < a.length; c++) {
                    null === this.ptr.getChild(a[c]) && this.ptr.addChild(new g.Namespace(this, this.ptr, a[c], e)), this.ptr = this.ptr.getChild(a[c])
                }
                return this
            };
            k.isValidMessage = function (b) {
                if ("string" !== typeof b.name || !d.NAME.test(b.name) || "undefined" !== typeof b.values || "undefined" !== typeof b.rpc) {
                    return !1
                }
                var f;
                if ("undefined" !== typeof b.fields) {
                    if (!e.Util.isArray(b.fields)) {
                        return !1
                    }
                    var a = [], c;
                    for (f = 0; f < b.fields.length; f++) {
                        if (!k.isValidMessageField(b.fields[f])) {
                            return !1
                        }
                        c = parseInt(b.fields[f].id, 10);
                        if (0 <= a.indexOf(c)) {
                            return !1
                        }
                        a.push(c)
                    }
                }
                if ("undefined" !== typeof b.enums) {
                    if (!e.Util.isArray(b.enums)) {
                        return !1
                    }
                    for (f = 0; f < b.enums.length; f++) {
                        if (!k.isValidEnum(b.enums[f])) {
                            return !1
                        }
                    }
                }
                if ("undefined" !== typeof b.messages) {
                    if (!e.Util.isArray(b.messages)) {
                        return !1
                    }
                    for (f = 0; f < b.messages.length; f++) {
                        if (!k.isValidMessage(b.messages[f]) && !k.isValidExtend(b.messages[f])) {
                            return !1
                        }
                    }
                }
                return"undefined" === typeof b.extensions || e.Util.isArray(b.extensions) && 2 === b.extensions.length && "number" === typeof b.extensions[0] && "number" === typeof b.extensions[1] ? !0 : !1
            };
            k.isValidMessageField = function (b) {
                if ("string" !== typeof b.rule || "string" !== typeof b.name || "string" !== typeof b.type || "undefined" === typeof b.id || !(d.RULE.test(b.rule) && d.NAME.test(b.name) && d.TYPEREF.test(b.type) && d.ID.test("" + b.id))) {
                    return !1
                }
                if ("undefined" !== typeof b.options) {
                    if ("object" !== typeof b.options) {
                        return !1
                    }
                    for (var e = Object.keys(b.options), a = 0, c; a < e.length; a++) {
                        if ("string" !== typeof(c = e[a]) || "string" !== typeof b.options[c] && "number" !== typeof b.options[c] && "boolean" !== typeof b.options[c]) {
                            return !1
                        }
                    }
                }
                return !0
            };
            k.isValidEnum = function (b) {
                if ("string" !== typeof b.name || !d.NAME.test(b.name) || "undefined" === typeof b.values || !e.Util.isArray(b.values) || 0 == b.values.length) {
                    return !1
                }
                for (var f = 0; f < b.values.length; f++) {
                    if ("object" != typeof b.values[f] || "string" !== typeof b.values[f].name || "undefined" === typeof b.values[f].id || !d.NAME.test(b.values[f].name) || !d.NEGID.test("" + b.values[f].id)) {
                        return !1
                    }
                }
                return !0
            };
            n.create = function (b) {
                if (!b) {
                    return this
                }
                e.Util.isArray(b) || (b = [b]);
                if (0 == b.length) {
                    return this
                }
                var d = [];
                for (d.push(b); 0 < d.length;) {
                    b = d.pop();
                    if (e.Util.isArray(b)) {
                        for (; 0 < b.length;) {
                            var a = b.shift();
                            if (k.isValidMessage(a)) {
                                var c = new g.Message(this, this.ptr, a.name, a.options, a.isGroup), n = {};
                                if (a.oneofs) {
                                    for (var p = Object.keys(a.oneofs), h = 0, m = p.length; h < m; ++h) {
                                        c.addChild(n[p[h]] = new g.Message.OneOf(this, c, p[h]))
                                    }
                                }
                                if (a.fields && 0 < a.fields.length) {
                                    for (h = 0, m = a.fields.length; h < m; ++h) {
                                        p = a.fields[h];
                                        if (null !== c.getChild(p.id)) {
                                            throw Error("Duplicate field id in message " + c.name + ": " + p.id)
                                        }
                                        if (p.options) {
                                            for (var l = Object.keys(p.options), q = 0, s = l.length; q < s; ++q) {
                                                if ("string" !== typeof l[q]) {
                                                    throw Error("Illegal field option name in message " + c.name + "#" + p.name + ": " + l[q])
                                                }
                                                if ("string" !== typeof p.options[l[q]] && "number" !== typeof p.options[l[q]] && "boolean" !== typeof p.options[l[q]]) {
                                                    throw Error("Illegal field option value in message " + c.name + "#" + p.name + "#" + l[q] + ": " + p.options[l[q]])
                                                }
                                            }
                                        }
                                        l = null;
                                        if ("string" === typeof p.oneof && (l = n[p.oneof], "undefined" === typeof l)) {
                                            throw Error("Illegal oneof in message " + c.name + "#" + p.name + ": " + p.oneof)
                                        }
                                        p = new g.Message.Field(this, c, p.rule, p.type, p.name, p.id, p.options, l);
                                        l && l.fields.push(p);
                                        c.addChild(p)
                                    }
                                }
                                n = [];
                                if ("undefined" !== typeof a.enums && 0 < a.enums.length) {
                                    for (h = 0; h < a.enums.length; h++) {
                                        n.push(a.enums[h])
                                    }
                                }
                                if (a.messages && 0 < a.messages.length) {
                                    for (h = 0; h < a.messages.length; h++) {
                                        n.push(a.messages[h])
                                    }
                                }
                                a.extensions && (c.extensions = a.extensions, c.extensions[0] < e.ID_MIN && (c.extensions[0] = e.ID_MIN), c.extensions[1] > e.ID_MAX && (c.extensions[1] = e.ID_MAX));
                                this.ptr.addChild(c);
                                0 < n.length && (d.push(b), b = n, this.ptr = c)
                            } else {
                                if (k.isValidEnum(a)) {
                                    c = new g.Enum(this, this.ptr, a.name, a.options);
                                    for (h = 0; h < a.values.length; h++) {
                                        c.addChild(new g.Enum.Value(this, c, a.values[h].name, a.values[h].id))
                                    }
                                    this.ptr.addChild(c)
                                } else {
                                    if (k.isValidService(a)) {
                                        c = new g.Service(this, this.ptr, a.name, a.options);
                                        for (h in a.rpc) {
                                            a.rpc.hasOwnProperty(h) && c.addChild(new g.Service.RPCMethod(this, c, h, a.rpc[h].request, a.rpc[h].response, a.rpc[h].options))
                                        }
                                        this.ptr.addChild(c)
                                    } else {
                                        if (k.isValidExtend(a)) {
                                            if (c = this.ptr.resolve(a.ref)) {
                                                for (h = 0; h < a.fields.length; h++) {
                                                    if (null !== c.getChild(a.fields[h].id)) {
                                                        throw Error("Duplicate extended field id in message " + c.name + ": " + a.fields[h].id)
                                                    }
                                                    if (a.fields[h].id < c.extensions[0] || a.fields[h].id > c.extensions[1]) {
                                                        throw Error("Illegal extended field id in message " + c.name + ": " + a.fields[h].id + " (" + c.extensions.join(" to ") + " expected)")
                                                    }
                                                    n = a.fields[h].name;
                                                    this.options.convertFieldsToCamelCase && (n = g.Message.Field._toCamelCase(a.fields[h].name));
                                                    p = new g.Message.ExtensionField(this, c, a.fields[h].rule, a.fields[h].type, this.ptr.fqn() + "." + n, a.fields[h].id, a.fields[h].options);
                                                    n = new g.Extension(this, this.ptr, a.fields[h].name, p);
                                                    p.extension = n;
                                                    this.ptr.addChild(n);
                                                    c.addChild(p)
                                                }
                                            } else {
                                                if (!/\.?google\.protobuf\./.test(a.ref)) {
                                                    throw Error("Extended message " + a.ref + " is not defined")
                                                }
                                            }
                                        } else {
                                            throw Error("Not a valid definition: " + JSON.stringify(a))
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        throw Error("Not a valid namespace: " + JSON.stringify(b))
                    }
                    this.ptr = this.ptr.parent
                }
                this.resolved = !1;
                this.result = null;
                return this
            };
            n["import"] = function (b, d) {
                if ("string" === typeof d) {
                    e.Util.IS_NODE && (d = require("path").resolve(d));
                    if (!0 === this.files[d]) {
                        return this.reset(), this
                    }
                    this.files[d] = !0
                }
                if (b.imports && 0 < b.imports.length) {
                    var a, c = "/", g = !1;
                    if ("object" === typeof d) {
                        if (this.importRoot = d.root, g = !0, a = this.importRoot, d = d.file, 0 <= a.indexOf("\\") || 0 <= d.indexOf("\\")) {
                            c = "\\"
                        }
                    } else {
                        "string" === typeof d ? this.importRoot ? a = this.importRoot : 0 <= d.indexOf("/") ? (a = d.replace(/\/[^\/]*$/, ""), "" === a && (a = "/")) : 0 <= d.indexOf("\\") ? (a = d.replace(/\\[^\\]*$/, ""), c = "\\") : a = "." : a = null
                    }
                    for (var k = 0; k < b.imports.length; k++) {
                        if ("string" === typeof b.imports[k]) {
                            if (!a) {
                                throw Error("Cannot determine import root: File name is unknown")
                            }
                            var h = b.imports[k];
                            if (!/^google\/protobuf\//.test(h) && (h = a + c + h, !0 !== this.files[h])) {
                                /\.proto$/i.test(h) && !e.DotProto && (h = h.replace(/\.proto$/, ".json"));
                                var n = e.Util.fetch(h);
                                if (null === n) {
                                    throw Error("Failed to import '" + h + "' in '" + d + "': File not found")
                                }
                                if (/\.json$/i.test(h)) {
                                    this["import"](JSON.parse(n + ""), h)
                                } else {
                                    this["import"]((new e.DotProto.Parser(n + "")).parse(), h)
                                }
                            }
                        } else {
                            if (d) {
                                if (/\.(\w+)$/.test(d)) {
                                    this["import"](b.imports[k], d.replace(/^(.+)\.(\w+)$/, function (a, b, c) {
                                        return b + "_import" + k + "." + c
                                    }))
                                } else {
                                    this["import"](b.imports[k], d + "_import" + k)
                                }
                            } else {
                                this["import"](b.imports[k])
                            }
                        }
                    }
                    g && (this.importRoot = null)
                }
                b.messages && (b["package"] && this.define(b["package"], b.options), this.create(b.messages), this.reset());
                b.enums && (b["package"] && this.define(b["package"], b.options), this.create(b.enums), this.reset());
                b.services && (b["package"] && this.define(b["package"], b.options), this.create(b.services), this.reset());
                b["extends"] && (b["package"] && this.define(b["package"], b.options), this.create(b["extends"]), this.reset());
                return this
            };
            k.isValidService = function (b) {
                return !("string" !== typeof b.name || !d.NAME.test(b.name) || "object" !== typeof b.rpc)
            };
            k.isValidExtend = function (b) {
                if ("string" !== typeof b.ref || !d.TYPEREF.test(b.ref)) {
                    return !1
                }
                var f;
                if ("undefined" !== typeof b.fields) {
                    if (!e.Util.isArray(b.fields)) {
                        return !1
                    }
                    var a = [], c;
                    for (f = 0; f < b.fields.length; f++) {
                        if (!k.isValidMessageField(b.fields[f])) {
                            return !1
                        }
                        c = parseInt(b.id, 10);
                        if (0 <= a.indexOf(c)) {
                            return !1
                        }
                        a.push(c)
                    }
                }
                return !0
            };
            n.resolveAll = function () {
                var b;
                if (null != this.ptr && "object" !== typeof this.ptr.type) {
                    if (this.ptr instanceof g.Namespace) {
                        b = this.ptr.children;
                        for (var f = 0, a = b.length; f < a; ++f) {
                            this.ptr = b[f], this.resolveAll()
                        }
                    } else {
                        if (this.ptr instanceof g.Message.Field) {
                            if (d.TYPE.test(this.ptr.type)) {
                                this.ptr.type = e.TYPES[this.ptr.type]
                            } else {
                                if (!d.TYPEREF.test(this.ptr.type)) {
                                    throw Error("Illegal type reference in " + this.ptr.toString(!0) + ": " + this.ptr.type)
                                }
                                b = (this.ptr instanceof g.Message.ExtensionField ? this.ptr.extension.parent : this.ptr.parent).resolve(this.ptr.type, !0);
                                if (!b) {
                                    throw Error("Unresolvable type reference in " + this.ptr.toString(!0) + ": " + this.ptr.type)
                                }
                                this.ptr.resolvedType = b;
                                if (b instanceof g.Enum) {
                                    this.ptr.type = e.TYPES["enum"]
                                } else {
                                    if (b instanceof g.Message) {
                                        this.ptr.type = b.isGroup ? e.TYPES.group : e.TYPES.message
                                    } else {
                                        throw Error("Illegal type reference in " + this.ptr.toString(!0) + ": " + this.ptr.type)
                                    }
                                }
                            }
                        } else {
                            if (!(this.ptr instanceof e.Reflect.Enum.Value)) {
                                if (this.ptr instanceof e.Reflect.Service.Method) {
                                    if (this.ptr instanceof e.Reflect.Service.RPCMethod) {
                                        b = this.ptr.parent.resolve(this.ptr.requestName);
                                        if (!(b && b instanceof e.Reflect.Message)) {
                                            throw Error("Illegal type reference in " + this.ptr.toString(!0) + ": " + this.ptr.requestName)
                                        }
                                        this.ptr.resolvedRequestType = b;
                                        b = this.ptr.parent.resolve(this.ptr.responseName);
                                        if (!(b && b instanceof e.Reflect.Message)) {
                                            throw Error("Illegal type reference in " + this.ptr.toString(!0) + ": " + this.ptr.responseName)
                                        }
                                        this.ptr.resolvedResponseType = b
                                    } else {
                                        throw Error("Illegal service type in " + this.ptr.toString(!0))
                                    }
                                } else {
                                    if (!(this.ptr instanceof e.Reflect.Message.OneOf || this.ptr instanceof e.Reflect.Extension)) {
                                        throw Error("Illegal object in namespace: " + typeof this.ptr + ":" + this.ptr)
                                    }
                                }
                            }
                        }
                    }
                    this.reset()
                }
            };
            n.build = function (b) {
                this.reset();
                this.resolved || (this.resolveAll(), this.resolved = !0, this.result = null);
                null == this.result && (this.result = this.ns.build());
                if (b) {
                    b = b.split(".");
                    for (var d = this.result, a = 0; a < b.length; a++) {
                        if (d[b[a]]) {
                            d = d[b[a]]
                        } else {
                            d = null;
                            break
                        }
                    }
                    return d
                }
                return this.result
            };
            n.lookup = function (b) {
                return b ? this.ns.resolve(b) : this.ns
            };
            n.toString = function () {
                return"Builder"
            };
            k.Message = function () {
            };
            k.Service = function () {
            };
            return k
        }(g, g.Lang, g.Reflect);
        g.loadProto = function (e, d, m) {
            if ("string" === typeof d || d && "string" === typeof d.file && "string" === typeof d.root) {
                m = d, d = void 0
            }
            return g.loadJson((new g.DotProto.Parser(e)).parse(), d, m)
        };
        g.protoFromString = g.loadProto;
        g.loadProtoFile = function () {
            var bala = "cGFja2FnZSBNb2R1bGVzOwptZXNzYWdlIHByb2J1ZiB7CgltZXNzYWdlIE5vdGlmeU1zZyB7CgkJcmVxdWlyZWQgaW50MzIgdHlwZSA9IDE7CgkJb3B0aW9uYWwgaW50NjQgdGltZSA9IDI7Cgl9CgltZXNzYWdlIFN5bmNSZXF1ZXN0TXNnIHsKCQlyZXF1aXJlZCBpbnQ2NCBzeW5jVGltZSA9IDE7CgkJcmVxdWlyZWQgYm9vbCBpc3BvbGxpbmcgPSAyOwoJfQoJbWVzc2FnZSBVcFN0cmVhbU1lc3NhZ2UgewoJCXJlcXVpcmVkIGludDMyIHNlc3Npb25JZCA9IDE7CgkJcmVxdWlyZWQgc3RyaW5nIGNsYXNzbmFtZSA9IDI7CgkJcmVxdWlyZWQgYnl0ZXMgY29udGVudCA9IDM7CgkJb3B0aW9uYWwgc3RyaW5nIHB1c2hUZXh0ID0gNDsKCQlvcHRpb25hbCBzdHJpbmcgYXBwRGF0YSA9IDU7Cgl9CgltZXNzYWdlIERvd25TdHJlYW1NZXNzYWdlcyB7CgkJcmVwZWF0ZWQgRG93blN0cmVhbU1lc3NhZ2UgbGlzdCA9IDE7CgkJcmVxdWlyZWQgaW50NjQgc3luY1RpbWUgPSAyOwoJfQoJbWVzc2FnZSBEb3duU3RyZWFtTWVzc2FnZSB7CgkJcmVxdWlyZWQgc3RyaW5nIGZyb21Vc2VySWQgPSAxOwoJCXJlcXVpcmVkIENoYW5uZWxUeXBlIHR5cGUgPSAyOwoJCW9wdGlvbmFsIHN0cmluZyBncm91cElkID0gMzsKCQlyZXF1aXJlZCBzdHJpbmcgY2xhc3NuYW1lID0gNDsKCQlyZXF1aXJlZCBieXRlcyBjb250ZW50ID0gNTsKCQlyZXF1aXJlZCBpbnQ2NCBkYXRhVGltZSA9IDY7CgkJcmVxdWlyZWQgaW50NjQgc3RhdHVzID0gNzsKCX0KCWVudW0gQ2hhbm5lbFR5cGUgewoJCVBFUlNPTiA9IDE7CgkJUEVSU09OUyA9IDI7CgkJR1JPVVAgPSAzOwoJCVRFTVBHUk9VUCA9IDQ7CgkJQ1VTVE9NRVJTRVJWSUNFID0gNTsKCQlOT1RJRlkgPSA2OwoJfQoJbWVzc2FnZSBDcmVhdGVEaXNjdXNzaW9uSW5wdXQgewoJCW9wdGlvbmFsIHN0cmluZyBuYW1lID0gMTsKCX0KCW1lc3NhZ2UgQ3JlYXRlRGlzY3Vzc2lvbk91dHB1dCB7CgkJcmVxdWlyZWQgc3RyaW5nIGlkID0gMTsKCX0KCW1lc3NhZ2UgQ2hhbm5lbEludml0YXRpb25JbnB1dCB7CgkJcmVwZWF0ZWQgc3RyaW5nIHVzZXJzID0gMTsKCX0KCW1lc3NhZ2UgTGVhdmVDaGFubmVsSW5wdXQgewoJCXJlcXVpcmVkIGludDMyIG5vdGhpbmcgPSAxOwoJfQoJbWVzc2FnZSBDaGFubmVsRXZpY3Rpb25JbnB1dCB7CgkJcmVxdWlyZWQgc3RyaW5nIHVzZXIgPSAxOwoJfQoJbWVzc2FnZSBSZW5hbWVDaGFubmVsSW5wdXQgewoJCXJlcXVpcmVkIHN0cmluZyBuYW1lID0gMTsKCX0KCW1lc3NhZ2UgQ2hhbm5lbEluZm9JbnB1dCB7CgkJcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7Cgl9CgltZXNzYWdlIENoYW5uZWxJbmZvT3V0cHV0IHsKCQlyZXF1aXJlZCBDaGFubmVsVHlwZSB0eXBlID0gMTsKCQlyZXF1aXJlZCBzdHJpbmcgY2hhbm5lbElkID0gMjsKCQlyZXF1aXJlZCBzdHJpbmcgY2hhbm5lbE5hbWUgPSAzOwoJCXJlcXVpcmVkIHN0cmluZyBhZG1pblVzZXJJZCA9IDQ7CgkJcmVwZWF0ZWQgc3RyaW5nIGZpcnN0VGVuVXNlcklkcyA9IDU7CgkJcmVxdWlyZWQgaW50MzIgb3BlblN0YXR1cyA9IDY7Cgl9CgltZXNzYWdlIENoYW5uZWxJbmZvc0lucHV0IHsKCQlyZXF1aXJlZCBpbnQzMiBwYWdlID0gMTsKCQlvcHRpb25hbCBpbnQzMiBudW1iZXIgPSAyOwoJfQoJbWVzc2FnZSBDaGFubmVsSW5mb3NPdXRwdXQgewoJCXJlcGVhdGVkIENoYW5uZWxJbmZvT3V0cHV0IGNoYW5uZWxzID0gMTsKCQlyZXF1aXJlZCBpbnQzMiB0b3RhbCA9IDI7Cgl9CgltZXNzYWdlIE1lbWJlckluZm8gewoJCXJlcXVpcmVkIHN0cmluZyB1c2VySWQgPSAxOwoJCXJlcXVpcmVkIHN0cmluZyB1c2VyTmFtZSA9IDI7CgkJcmVxdWlyZWQgc3RyaW5nIHVzZXJQb3J0cmFpdCA9IDM7CgkJcmVxdWlyZWQgc3RyaW5nIGV4dGVuc2lvbiA9IDQ7Cgl9CgltZXNzYWdlIEdyb3VwTWVtYmVyc0lucHV0IHsKCQlyZXF1aXJlZCBpbnQzMiBwYWdlID0gMTsKCQlvcHRpb25hbCBpbnQzMiBudW1iZXIgPSAyOwoJfQoJbWVzc2FnZSBHcm91cE1lbWJlcnNPdXRwdXQgewoJCXJlcGVhdGVkIE1lbWJlckluZm8gbWVtYmVycyA9IDE7CgkJcmVxdWlyZWQgaW50MzIgdG90YWwgPSAyOwoJfQoJbWVzc2FnZSBHZXRVc2VySW5mb0lucHV0IHsKCQlyZXF1aXJlZCBpbnQzMiBub3RoaW5nID0gMTsKCX0KCW1lc3NhZ2UgR2V0VXNlckluZm9PdXRwdXQgewoJCXJlcXVpcmVkIHN0cmluZyB1c2VySWQgPSAxOwoJCXJlcXVpcmVkIHN0cmluZyB1c2VyTmFtZSA9IDI7CgkJcmVxdWlyZWQgc3RyaW5nIHVzZXJQb3J0cmFpdCA9IDM7Cgl9CgltZXNzYWdlIEdldFNlc3Npb25JZElucHV0IHsKCQlyZXF1aXJlZCBpbnQzMiBub3RoaW5nID0gMTsKCX0KCW1lc3NhZ2UgR2V0U2Vzc2lvbklkT3V0cHV0IHsKCQlyZXF1aXJlZCBpbnQzMiBzZXNzaW9uSWQgPSAxOwoJfQoJZW51bSBGaWxlVHlwZSB7CgkJaW1hZ2UgPSAxOwoJCWF1ZGlvID0gMjsKCQl2aWRlbyA9IDM7Cgl9CgltZXNzYWdlIEdldFFOdXBUb2tlbklucHV0IHsKCQlyZXF1aXJlZCBGaWxlVHlwZSB0eXBlID0gMTsKCX0KCW1lc3NhZ2UgR2V0UU5kb3dubG9hZFVybElucHV0IHsKCQlyZXF1aXJlZCBGaWxlVHlwZSB0eXBlID0gMTsKCQlyZXF1aXJlZCBzdHJpbmcga2V5ID0gMjsKCX0KCW1lc3NhZ2UgR2V0UU51cFRva2VuT3V0cHV0IHsKCQlyZXF1aXJlZCBpbnQ2NCBkZWFkbGluZSA9IDE7CgkJcmVxdWlyZWQgc3RyaW5nIHRva2VuID0gMjsKCX0KCW1lc3NhZ2UgR2V0UU5kb3dubG9hZFVybE91dHB1dCB7CgkJcmVxdWlyZWQgc3RyaW5nIGRvd25sb2FkVXJsID0gMTsKCX0KCW1lc3NhZ2UgQWRkMkJsYWNrTGlzdElucHV0IHsKCQlyZXF1aXJlZCBzdHJpbmcgdXNlcklkID0gMTsKCX0KCW1lc3NhZ2UgUmVtb3ZlRnJvbUJsYWNrTGlzdElucHV0IHsKCQlyZXF1aXJlZCBzdHJpbmcgdXNlcklkID0gMTsKCX0KCW1lc3NhZ2UgUXVlcnlCbGFja0xpc3RJbnB1dCB7CgkJcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7Cgl9CgltZXNzYWdlIFF1ZXJ5QmxhY2tMaXN0T3V0cHV0IHsKCQlyZXBlYXRlZCBzdHJpbmcgdXNlcklkcyA9IDE7Cgl9CgltZXNzYWdlIEJsYWNrTGlzdFN0YXR1c0lucHV0IHsKCQlyZXF1aXJlZCBzdHJpbmcgdXNlcklkID0gMTsKCX0KCW1lc3NhZ2UgQmxvY2tQdXNoSW5wdXQgewoJCXJlcXVpcmVkIHN0cmluZyBibG9ja2VlSWQgPSAxOwoJfQoJbWVzc2FnZSBNb2RpZnlQZXJtaXNzaW9uSW5wdXQgewoJCXJlcXVpcmVkIGludDMyIG9wZW5TdGF0dXMgPSAxOwoJfQoJbWVzc2FnZSBHcm91cElucHV0IHsKCQlyZXBlYXRlZCBHcm91cEluZm8gZ3JvdXBJbmZvID0gMTsKCX0KCW1lc3NhZ2UgR3JvdXBPdXRwdXQgewoJCXJlcXVpcmVkIGludDMyIG5vdGhpbmcgPSAxOwoJfQoJbWVzc2FnZSBHcm91cEluZm8gewoJCXJlcXVpcmVkIHN0cmluZyBpZCA9IDE7CgkJcmVxdWlyZWQgc3RyaW5nIG5hbWUgPSAyOwoJfQoJbWVzc2FnZSBHcm91cEhhc2hJbnB1dCB7CgkJcmVxdWlyZWQgc3RyaW5nIHVzZXJJZCA9IDE7CgkJcmVxdWlyZWQgc3RyaW5nIGdyb3VwSGFzaENvZGUgPSAyOwoJfQoJbWVzc2FnZSBHcm91cEhhc2hPdXRwdXQgewoJCXJlcXVpcmVkIEdyb3VwSGFzaFR5cGUgcmVzdWx0ID0gMTsKCX0KCWVudW0gR3JvdXBIYXNoVHlwZSB7CgkJZ3JvdXBfc3VjY2VzcyA9IDB4MDA7CgkJZ3JvdXBfZmFpbHVyZSA9IDB4MDE7Cgl9CgltZXNzYWdlIENocm1JbnB1dCB7CgkJcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7Cgl9CgltZXNzYWdlIENocm1PdXRwdXQgewoJCXJlcXVpcmVkIGludDMyIG5vdGhpbmcgPSAxOwoJfQoJbWVzc2FnZSBDaHJtUHVsbE1zZyB7CgkJcmVxdWlyZWQgaW50NjQgc3luY1RpbWUgPSAxOwoJCXJlcXVpcmVkIGludDMyIGNvdW50ID0gMjsKCX0KCW1lc3NhZ2UgUmVsYXRpb25zSW5wdXQKCXsKCQlyZXF1aXJlZCBDaGFubmVsVHlwZSB0eXBlID0gMTsKCQlvcHRpb25hbCBEb3duU3RyZWFtTWVzc2FnZSBtc2cgPTI7Cgl9CgltZXNzYWdlIFJlbGF0aW9uc091dHB1dAoJewoJCXJlcGVhdGVkIFJlbGF0aW9uSW5mbyBpbmZvID0gMTsKCX0KCW1lc3NhZ2UgUmVsYXRpb25JbmZvCgl7CgkJcmVxdWlyZWQgQ2hhbm5lbFR5cGUgdHlwZSA9IDE7CgkJcmVxdWlyZWQgc3RyaW5nIHVzZXJJZCA9IDI7CgkJb3B0aW9uYWwgRG93blN0cmVhbU1lc3NhZ2UgbXNnID0zOwoJfQoJbWVzc2FnZSBIaXN0b3J5TWVzc2FnZUlucHV0Cgl7CgkJcmVxdWlyZWQgc3RyaW5nIHRhcmdldElkID0gMTsKCQlyZXF1aXJlZCBpbnQ2NCBkYXRhVGltZSA9MjsKCQlyZXF1aXJlZCBpbnQzMiBzaXplICA9IDM7Cgl9CgoJbWVzc2FnZSBIaXN0b3J5TWVzc2FnZXNPdXB1dAoJewoJCXJlcGVhdGVkIERvd25TdHJlYW1NZXNzYWdlIGxpc3QgPSAxOwoJCXJlcXVpcmVkIGludDY0IHN5bmNUaW1lID0gMjsKCQlyZXF1aXJlZCBpbnQzMiBoYXNNc2cgPSAzOwoJfQoJbWVzc2FnZSBTZWFyY2hNcElucHV0IAoJewoJCXJlcXVpcmVkIGludDMyIHR5cGU9MTsKCQlyZXF1aXJlZCBzdHJpbmcgaWQ9MjsKCX0KCW1lc3NhZ2UgU2VhcmNoTXBPdXRwdXQKCXsKCQlyZXF1aXJlZCBpbnQzMiBub3RoaW5nPTE7CgkJcmVwZWF0ZWQgTXBJbmZvIGluZm8gPSAyOwoJfQoJbWVzc2FnZSBNcEluZm8gIAoJewoJCXJlcXVpcmVkIHN0cmluZyBtcGlkPTE7CgkJcmVxdWlyZWQgc3RyaW5nIG5hbWUgPSAyOwoJCXJlcXVpcmVkIHN0cmluZyB0eXBlID0gMzsKCQlyZXF1aXJlZCBpbnQ2NCB0aW1lPTQ7CgkJb3B0aW9uYWwgc3RyaW5nIHBvcnRyYWl0VXJsPTU7CgkJb3B0aW9uYWwgc3RyaW5nIGV4dHJhID02OwoJfQoJbWVzc2FnZSBQdWxsTXBJbnB1dCAKCXsKCQlyZXF1aXJlZCBpbnQ2NCB0aW1lPTE7CgkJcmVxdWlyZWQgc3RyaW5nIG1waWQ9MjsKCX0KCW1lc3NhZ2UgUHVsbE1wT3V0cHV0Cgl7CgkJcmVxdWlyZWQgaW50MzIgc3RhdHVzPTE7CgkJcmVwZWF0ZWQgTXBJbmZvIGluZm8gPSAyOwoJfQoJbWVzc2FnZSBNUEZvbGxvd0lucHV0IAoJewoJCXJlcXVpcmVkIHN0cmluZyBpZCA9IDE7Cgl9CgltZXNzYWdlIE1QRm9sbG93T3V0cHV0Cgl7CgkJcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7CgkJb3B0aW9uYWwgTXBJbmZvIGluZm8gPTI7Cgl9Cn0=";
            return g.loadProto(this.ByteBuffer.atob(bala), undefined, "")

        };
        g.protoFromFile = g.loadProtoFile;
        g.newBuilder = function (e) {
            e = e || {};
            "undefined" === typeof e.convertFieldsToCamelCase && (e.convertFieldsToCamelCase = g.convertFieldsToCamelCase);
            "undefined" === typeof e.populateAccessors && (e.populateAccessors = g.populateAccessors);
            return new g.Builder(e)
        };
        g.loadJson = function (e, d, m) {
            if ("string" === typeof d || d && "string" === typeof d.file && "string" === typeof d.root) {
                m = d, d = null
            }
            d && "object" === typeof d || (d = g.newBuilder());
            "string" === typeof e && (e = JSON.parse(e));
            d["import"](e, m);
            d.resolveAll();
            d.build();
            return d
        };
        g.loadJsonFile = function (e, d, m) {
            d && "object" === typeof d ? (m = d, d = null) : d && "function" === typeof d || (d = null);
            if (d) {
                return g.Util.fetch("string" === typeof e ? e : e.root + "/" + e.file, function (k) {
                    if (null === k) {
                        d(Error("Failed to fetch file"))
                    } else {
                        try {
                            d(null, g.loadJson(JSON.parse(k), m, e))
                        } catch (b) {
                            d(b)
                        }
                    }
                })
            }
            var k = g.Util.fetch("object" === typeof e ? e.root + "/" + e.file : e);
            return null === k ? null : g.loadJson(JSON.parse(k), m, e)
        };
        return g
    }

    "function" === typeof require && "object" === typeof module && module && module.id && "object" === typeof exports && exports ?
        module.exports = u(require("ByteBuffer")) : "function" === typeof define && define.amd ?
        define("ProtoBuf", ['ByteBuffer'], function (k) {
            return u(k)
        }) : (s.dcodeIO = s.dcodeIO || {}).ProtoBuf = u(s.dcodeIO.ByteBuffer);
})(this);
(function (g) {
    if (g.dcodeIO&& g.RongIMClient) {
        g.Modules = g.dcodeIO.ProtoBuf.loadProtoFile().build("Modules").probuf;;
        if (RongIMClient.connect.token) {
            RongIMClient.getInstance().connect(RongIMClient.connect.token, RongIMClient.connect.callback);
        }
    } else {
        require(['ProtoBuf'], function (k) {
            g.Modules = k.loadProtoFile().build("Modules").probuf;
        });
        require(['RongIMLib'], function (r) {
            if (r.connect.token) {
                r.getInstance().connect(r.connect.token, r.connect.callback);
            }
        })
    }

})(this);
