var $l = Object.defineProperty;
var Jl = (i, t, e) => t in i ? $l(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var ct = (i, t, e) => Jl(i, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
const mi = { ROTATE: 0, DOLLY: 1, PAN: 2 }, di = { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 }, Ql = 0, Ga = 1, tc = 2, cl = 1, ec = 2, ln = 3, wn = 0, Ce = 1, cn = 2, bn = 0, _i = 1, ka = 2, Wa = 3, Xa = 4, nc = 5, Bn = 100, ic = 101, sc = 102, rc = 103, ac = 104, oc = 200, lc = 201, cc = 202, hc = 203, Rr = 204, Cr = 205, uc = 206, dc = 207, fc = 208, pc = 209, mc = 210, _c = 211, gc = 212, vc = 213, xc = 214, Pr = 0, Dr = 1, Lr = 2, xi = 3, Ur = 4, Ir = 5, Nr = 6, Fr = 7, hl = 0, Mc = 1, Sc = 2, An = 0, yc = 1, Ec = 2, Tc = 3, bc = 4, Ac = 5, wc = 6, Rc = 7, ul = 300, Mi = 301, Si = 302, Or = 303, Br = 304, Vs = 306, zr = 1e3, Hn = 1001, Hr = 1002, Ue = 1003, Cc = 1004, ji = 1005, Ke = 1006, js = 1007, Vn = 1008, dn = 1009, dl = 1010, fl = 1011, Gi = 1012, Sa = 1013, Gn = 1014, $e = 1015, ki = 1016, ya = 1017, Ea = 1018, yi = 1020, pl = 35902, ml = 1021, _l = 1022, qe = 1023, gl = 1024, vl = 1025, gi = 1026, Ei = 1027, Ta = 1028, ba = 1029, xl = 1030, Aa = 1031, wa = 1033, Ms = 33776, Ss = 33777, ys = 33778, Es = 33779, Vr = 35840, Gr = 35841, kr = 35842, Wr = 35843, Xr = 36196, Yr = 37492, qr = 37496, jr = 37808, Zr = 37809, Kr = 37810, $r = 37811, Jr = 37812, Qr = 37813, ta = 37814, ea = 37815, na = 37816, ia = 37817, sa = 37818, ra = 37819, aa = 37820, oa = 37821, Ts = 36492, la = 36494, ca = 36495, Ml = 36283, ha = 36284, ua = 36285, da = 36286, Pc = 3200, Dc = 3201, Sl = 0, Lc = 1, En = "", ze = "srgb", Ti = "srgb-linear", ws = "linear", Kt = "srgb", jn = 7680, Ya = 519, Uc = 512, Ic = 513, Nc = 514, yl = 515, Fc = 516, Oc = 517, Bc = 518, zc = 519, Rs = 35044, fi = 35048, qa = "300 es", hn = 2e3, Cs = 2001;
class Xn {
  addEventListener(t, e) {
    this._listeners === void 0 && (this._listeners = {});
    const n = this._listeners;
    n[t] === void 0 && (n[t] = []), n[t].indexOf(e) === -1 && n[t].push(e);
  }
  hasEventListener(t, e) {
    if (this._listeners === void 0) return !1;
    const n = this._listeners;
    return n[t] !== void 0 && n[t].indexOf(e) !== -1;
  }
  removeEventListener(t, e) {
    if (this._listeners === void 0) return;
    const s = this._listeners[t];
    if (s !== void 0) {
      const r = s.indexOf(e);
      r !== -1 && s.splice(r, 1);
    }
  }
  dispatchEvent(t) {
    if (this._listeners === void 0) return;
    const n = this._listeners[t.type];
    if (n !== void 0) {
      t.target = this;
      const s = n.slice(0);
      for (let r = 0, a = s.length; r < a; r++)
        s[r].call(this, t);
      t.target = null;
    }
  }
}
const xe = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"], bs = Math.PI / 180, fa = 180 / Math.PI;
function Wi() {
  const i = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0;
  return (xe[i & 255] + xe[i >> 8 & 255] + xe[i >> 16 & 255] + xe[i >> 24 & 255] + "-" + xe[t & 255] + xe[t >> 8 & 255] + "-" + xe[t >> 16 & 15 | 64] + xe[t >> 24 & 255] + "-" + xe[e & 63 | 128] + xe[e >> 8 & 255] + "-" + xe[e >> 16 & 255] + xe[e >> 24 & 255] + xe[n & 255] + xe[n >> 8 & 255] + xe[n >> 16 & 255] + xe[n >> 24 & 255]).toLowerCase();
}
function Nt(i, t, e) {
  return Math.max(t, Math.min(e, i));
}
function Hc(i, t) {
  return (i % t + t) % t;
}
function Zs(i, t, e) {
  return (1 - e) * i + e * t;
}
function Pi(i, t) {
  switch (t.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return i / 4294967295;
    case Uint16Array:
      return i / 65535;
    case Uint8Array:
      return i / 255;
    case Int32Array:
      return Math.max(i / 2147483647, -1);
    case Int16Array:
      return Math.max(i / 32767, -1);
    case Int8Array:
      return Math.max(i / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function we(i, t) {
  switch (t.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return Math.round(i * 4294967295);
    case Uint16Array:
      return Math.round(i * 65535);
    case Uint8Array:
      return Math.round(i * 255);
    case Int32Array:
      return Math.round(i * 2147483647);
    case Int16Array:
      return Math.round(i * 32767);
    case Int8Array:
      return Math.round(i * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
const Vc = {
  DEG2RAD: bs
};
class Ct {
  constructor(t = 0, e = 0) {
    Ct.prototype.isVector2 = !0, this.x = t, this.y = e;
  }
  get width() {
    return this.x;
  }
  set width(t) {
    this.x = t;
  }
  get height() {
    return this.y;
  }
  set height(t) {
    this.y = t;
  }
  set(t, e) {
    return this.x = t, this.y = e, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this;
  }
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  applyMatrix3(t) {
    const e = this.x, n = this.y, s = t.elements;
    return this.x = s[0] * e + s[3] * n + s[6], this.y = s[1] * e + s[4] * n + s[7], this;
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this;
  }
  clamp(t, e) {
    return this.x = Nt(this.x, t.x, e.x), this.y = Nt(this.y, t.y, e.y), this;
  }
  clampScalar(t, e) {
    return this.x = Nt(this.x, t, e), this.y = Nt(this.y, t, e), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Nt(n, t, e));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  cross(t) {
    return this.x * t.y - this.y * t.x;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(Nt(n, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x, n = this.y - t.y;
    return e * e + n * n;
  }
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this;
  }
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this;
  }
  rotateAround(t, e) {
    const n = Math.cos(e), s = Math.sin(e), r = this.x - t.x, a = this.y - t.y;
    return this.x = r * n - a * s + t.x, this.y = r * s + a * n + t.y, this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
class Dt {
  constructor(t, e, n, s, r, a, o, l, c) {
    Dt.prototype.isMatrix3 = !0, this.elements = [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ], t !== void 0 && this.set(t, e, n, s, r, a, o, l, c);
  }
  set(t, e, n, s, r, a, o, l, c) {
    const h = this.elements;
    return h[0] = t, h[1] = s, h[2] = o, h[3] = e, h[4] = r, h[5] = l, h[6] = n, h[7] = a, h[8] = c, this;
  }
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ), this;
  }
  copy(t) {
    const e = this.elements, n = t.elements;
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], this;
  }
  extractBasis(t, e, n) {
    return t.setFromMatrix3Column(this, 0), e.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this;
  }
  setFromMatrix4(t) {
    const e = t.elements;
    return this.set(
      e[0],
      e[4],
      e[8],
      e[1],
      e[5],
      e[9],
      e[2],
      e[6],
      e[10]
    ), this;
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements, s = e.elements, r = this.elements, a = n[0], o = n[3], l = n[6], c = n[1], h = n[4], d = n[7], f = n[2], m = n[5], _ = n[8], x = s[0], p = s[3], u = s[6], b = s[1], T = s[4], y = s[7], P = s[2], A = s[5], R = s[8];
    return r[0] = a * x + o * b + l * P, r[3] = a * p + o * T + l * A, r[6] = a * u + o * y + l * R, r[1] = c * x + h * b + d * P, r[4] = c * p + h * T + d * A, r[7] = c * u + h * y + d * R, r[2] = f * x + m * b + _ * P, r[5] = f * p + m * T + _ * A, r[8] = f * u + m * y + _ * R, this;
  }
  multiplyScalar(t) {
    const e = this.elements;
    return e[0] *= t, e[3] *= t, e[6] *= t, e[1] *= t, e[4] *= t, e[7] *= t, e[2] *= t, e[5] *= t, e[8] *= t, this;
  }
  determinant() {
    const t = this.elements, e = t[0], n = t[1], s = t[2], r = t[3], a = t[4], o = t[5], l = t[6], c = t[7], h = t[8];
    return e * a * h - e * o * c - n * r * h + n * o * l + s * r * c - s * a * l;
  }
  invert() {
    const t = this.elements, e = t[0], n = t[1], s = t[2], r = t[3], a = t[4], o = t[5], l = t[6], c = t[7], h = t[8], d = h * a - o * c, f = o * l - h * r, m = c * r - a * l, _ = e * d + n * f + s * m;
    if (_ === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const x = 1 / _;
    return t[0] = d * x, t[1] = (s * c - h * n) * x, t[2] = (o * n - s * a) * x, t[3] = f * x, t[4] = (h * e - s * l) * x, t[5] = (s * r - o * e) * x, t[6] = m * x, t[7] = (n * l - c * e) * x, t[8] = (a * e - n * r) * x, this;
  }
  transpose() {
    let t;
    const e = this.elements;
    return t = e[1], e[1] = e[3], e[3] = t, t = e[2], e[2] = e[6], e[6] = t, t = e[5], e[5] = e[7], e[7] = t, this;
  }
  getNormalMatrix(t) {
    return this.setFromMatrix4(t).invert().transpose();
  }
  transposeIntoArray(t) {
    const e = this.elements;
    return t[0] = e[0], t[1] = e[3], t[2] = e[6], t[3] = e[1], t[4] = e[4], t[5] = e[7], t[6] = e[2], t[7] = e[5], t[8] = e[8], this;
  }
  setUvTransform(t, e, n, s, r, a, o) {
    const l = Math.cos(r), c = Math.sin(r);
    return this.set(
      n * l,
      n * c,
      -n * (l * a + c * o) + a + t,
      -s * c,
      s * l,
      -s * (-c * a + l * o) + o + e,
      0,
      0,
      1
    ), this;
  }
  //
  scale(t, e) {
    return this.premultiply(Ks.makeScale(t, e)), this;
  }
  rotate(t) {
    return this.premultiply(Ks.makeRotation(-t)), this;
  }
  translate(t, e) {
    return this.premultiply(Ks.makeTranslation(t, e)), this;
  }
  // for 2D Transforms
  makeTranslation(t, e) {
    return t.isVector2 ? this.set(
      1,
      0,
      t.x,
      0,
      1,
      t.y,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      t,
      0,
      1,
      e,
      0,
      0,
      1
    ), this;
  }
  makeRotation(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      e,
      -n,
      0,
      n,
      e,
      0,
      0,
      0,
      1
    ), this;
  }
  makeScale(t, e) {
    return this.set(
      t,
      0,
      0,
      0,
      e,
      0,
      0,
      0,
      1
    ), this;
  }
  //
  equals(t) {
    const e = this.elements, n = t.elements;
    for (let s = 0; s < 9; s++)
      if (e[s] !== n[s]) return !1;
    return !0;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 9; n++)
      this.elements[n] = t[n + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.elements;
    return t[e] = n[0], t[e + 1] = n[1], t[e + 2] = n[2], t[e + 3] = n[3], t[e + 4] = n[4], t[e + 5] = n[5], t[e + 6] = n[6], t[e + 7] = n[7], t[e + 8] = n[8], t;
  }
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const Ks = /* @__PURE__ */ new Dt();
function El(i) {
  for (let t = i.length - 1; t >= 0; --t)
    if (i[t] >= 65535) return !0;
  return !1;
}
function Ps(i) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", i);
}
function Gc() {
  const i = Ps("canvas");
  return i.style.display = "block", i;
}
const ja = {};
function ui(i) {
  i in ja || (ja[i] = !0, console.warn(i));
}
function kc(i, t, e) {
  return new Promise(function(n, s) {
    function r() {
      switch (i.clientWaitSync(t, i.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case i.WAIT_FAILED:
          s();
          break;
        case i.TIMEOUT_EXPIRED:
          setTimeout(r, e);
          break;
        default:
          n();
      }
    }
    setTimeout(r, e);
  });
}
function Wc(i) {
  const t = i.elements;
  t[2] = 0.5 * t[2] + 0.5 * t[3], t[6] = 0.5 * t[6] + 0.5 * t[7], t[10] = 0.5 * t[10] + 0.5 * t[11], t[14] = 0.5 * t[14] + 0.5 * t[15];
}
function Xc(i) {
  const t = i.elements;
  t[11] === -1 ? (t[10] = -t[10] - 1, t[14] = -t[14]) : (t[10] = -t[10], t[14] = -t[14] + 1);
}
const Za = /* @__PURE__ */ new Dt().set(
  0.4123908,
  0.3575843,
  0.1804808,
  0.212639,
  0.7151687,
  0.0721923,
  0.0193308,
  0.1191948,
  0.9505322
), Ka = /* @__PURE__ */ new Dt().set(
  3.2409699,
  -1.5373832,
  -0.4986108,
  -0.9692436,
  1.8759675,
  0.0415551,
  0.0556301,
  -0.203977,
  1.0569715
);
function Yc() {
  const i = {
    enabled: !0,
    workingColorSpace: Ti,
    /**
     * Implementations of supported color spaces.
     *
     * Required:
     *	- primaries: chromaticity coordinates [ rx ry gx gy bx by ]
     *	- whitePoint: reference white [ x y ]
     *	- transfer: transfer function (pre-defined)
     *	- toXYZ: Matrix3 RGB to XYZ transform
     *	- fromXYZ: Matrix3 XYZ to RGB transform
     *	- luminanceCoefficients: RGB luminance coefficients
     *
     * Optional:
     *  - outputColorSpaceConfig: { drawingBufferColorSpace: ColorSpace }
     *  - workingColorSpaceConfig: { unpackColorSpace: ColorSpace }
     *
     * Reference:
     * - https://www.russellcottrell.com/photo/matrixCalculator.htm
     */
    spaces: {},
    convert: function(s, r, a) {
      return this.enabled === !1 || r === a || !r || !a || (this.spaces[r].transfer === Kt && (s.r = un(s.r), s.g = un(s.g), s.b = un(s.b)), this.spaces[r].primaries !== this.spaces[a].primaries && (s.applyMatrix3(this.spaces[r].toXYZ), s.applyMatrix3(this.spaces[a].fromXYZ)), this.spaces[a].transfer === Kt && (s.r = vi(s.r), s.g = vi(s.g), s.b = vi(s.b))), s;
    },
    fromWorkingColorSpace: function(s, r) {
      return this.convert(s, this.workingColorSpace, r);
    },
    toWorkingColorSpace: function(s, r) {
      return this.convert(s, r, this.workingColorSpace);
    },
    getPrimaries: function(s) {
      return this.spaces[s].primaries;
    },
    getTransfer: function(s) {
      return s === En ? ws : this.spaces[s].transfer;
    },
    getLuminanceCoefficients: function(s, r = this.workingColorSpace) {
      return s.fromArray(this.spaces[r].luminanceCoefficients);
    },
    define: function(s) {
      Object.assign(this.spaces, s);
    },
    // Internal APIs
    _getMatrix: function(s, r, a) {
      return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ);
    },
    _getDrawingBufferColorSpace: function(s) {
      return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace;
    },
    _getUnpackColorSpace: function(s = this.workingColorSpace) {
      return this.spaces[s].workingColorSpaceConfig.unpackColorSpace;
    }
  }, t = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06], e = [0.2126, 0.7152, 0.0722], n = [0.3127, 0.329];
  return i.define({
    [Ti]: {
      primaries: t,
      whitePoint: n,
      transfer: ws,
      toXYZ: Za,
      fromXYZ: Ka,
      luminanceCoefficients: e,
      workingColorSpaceConfig: { unpackColorSpace: ze },
      outputColorSpaceConfig: { drawingBufferColorSpace: ze }
    },
    [ze]: {
      primaries: t,
      whitePoint: n,
      transfer: Kt,
      toXYZ: Za,
      fromXYZ: Ka,
      luminanceCoefficients: e,
      outputColorSpaceConfig: { drawingBufferColorSpace: ze }
    }
  }), i;
}
const Xt = /* @__PURE__ */ Yc();
function un(i) {
  return i < 0.04045 ? i * 0.0773993808 : Math.pow(i * 0.9478672986 + 0.0521327014, 2.4);
}
function vi(i) {
  return i < 31308e-7 ? i * 12.92 : 1.055 * Math.pow(i, 0.41666) - 0.055;
}
let Zn;
class qc {
  static getDataURL(t) {
    if (/^data:/i.test(t.src) || typeof HTMLCanvasElement > "u")
      return t.src;
    let e;
    if (t instanceof HTMLCanvasElement)
      e = t;
    else {
      Zn === void 0 && (Zn = Ps("canvas")), Zn.width = t.width, Zn.height = t.height;
      const n = Zn.getContext("2d");
      t instanceof ImageData ? n.putImageData(t, 0, 0) : n.drawImage(t, 0, 0, t.width, t.height), e = Zn;
    }
    return e.width > 2048 || e.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", t), e.toDataURL("image/jpeg", 0.6)) : e.toDataURL("image/png");
  }
  static sRGBToLinear(t) {
    if (typeof HTMLImageElement < "u" && t instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
      const e = Ps("canvas");
      e.width = t.width, e.height = t.height;
      const n = e.getContext("2d");
      n.drawImage(t, 0, 0, t.width, t.height);
      const s = n.getImageData(0, 0, t.width, t.height), r = s.data;
      for (let a = 0; a < r.length; a++)
        r[a] = un(r[a] / 255) * 255;
      return n.putImageData(s, 0, 0), e;
    } else if (t.data) {
      const e = t.data.slice(0);
      for (let n = 0; n < e.length; n++)
        e instanceof Uint8Array || e instanceof Uint8ClampedArray ? e[n] = Math.floor(un(e[n] / 255) * 255) : e[n] = un(e[n]);
      return {
        data: e,
        width: t.width,
        height: t.height
      };
    } else
      return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), t;
  }
}
let jc = 0;
class Tl {
  constructor(t = null) {
    this.isSource = !0, Object.defineProperty(this, "id", { value: jc++ }), this.uuid = Wi(), this.data = t, this.dataReady = !0, this.version = 0;
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.images[this.uuid] !== void 0)
      return t.images[this.uuid];
    const n = {
      uuid: this.uuid,
      url: ""
    }, s = this.data;
    if (s !== null) {
      let r;
      if (Array.isArray(s)) {
        r = [];
        for (let a = 0, o = s.length; a < o; a++)
          s[a].isDataTexture ? r.push($s(s[a].image)) : r.push($s(s[a]));
      } else
        r = $s(s);
      n.url = r;
    }
    return e || (t.images[this.uuid] = n), n;
  }
}
function $s(i) {
  return typeof HTMLImageElement < "u" && i instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && i instanceof ImageBitmap ? qc.getDataURL(i) : i.data ? {
    data: Array.from(i.data),
    width: i.width,
    height: i.height,
    type: i.data.constructor.name
  } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let Zc = 0;
class Te extends Xn {
  constructor(t = Te.DEFAULT_IMAGE, e = Te.DEFAULT_MAPPING, n = Hn, s = Hn, r = Ke, a = Vn, o = qe, l = dn, c = Te.DEFAULT_ANISOTROPY, h = En) {
    super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: Zc++ }), this.uuid = Wi(), this.name = "", this.source = new Tl(t), this.mipmaps = [], this.mapping = e, this.channel = 0, this.wrapS = n, this.wrapT = s, this.magFilter = r, this.minFilter = a, this.anisotropy = c, this.format = o, this.internalFormat = null, this.type = l, this.offset = new Ct(0, 0), this.repeat = new Ct(1, 1), this.center = new Ct(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new Dt(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = h, this.userData = {}, this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = !1, this.pmremVersion = 0;
  }
  get image() {
    return this.source.data;
  }
  set image(t = null) {
    this.source.data = t;
  }
  updateMatrix() {
    this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.name = t.name, this.source = t.source, this.mipmaps = t.mipmaps.slice(0), this.mapping = t.mapping, this.channel = t.channel, this.wrapS = t.wrapS, this.wrapT = t.wrapT, this.magFilter = t.magFilter, this.minFilter = t.minFilter, this.anisotropy = t.anisotropy, this.format = t.format, this.internalFormat = t.internalFormat, this.type = t.type, this.offset.copy(t.offset), this.repeat.copy(t.repeat), this.center.copy(t.center), this.rotation = t.rotation, this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrix.copy(t.matrix), this.generateMipmaps = t.generateMipmaps, this.premultiplyAlpha = t.premultiplyAlpha, this.flipY = t.flipY, this.unpackAlignment = t.unpackAlignment, this.colorSpace = t.colorSpace, this.renderTarget = t.renderTarget, this.isRenderTargetTexture = t.isRenderTargetTexture, this.userData = JSON.parse(JSON.stringify(t.userData)), this.needsUpdate = !0, this;
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.textures[this.uuid] !== void 0)
      return t.textures[this.uuid];
    const n = {
      metadata: {
        version: 4.6,
        type: "Texture",
        generator: "Texture.toJSON"
      },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(t).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment
    };
    return Object.keys(this.userData).length > 0 && (n.userData = this.userData), e || (t.textures[this.uuid] = n), n;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  transformUv(t) {
    if (this.mapping !== ul) return t;
    if (t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1)
      switch (this.wrapS) {
        case zr:
          t.x = t.x - Math.floor(t.x);
          break;
        case Hn:
          t.x = t.x < 0 ? 0 : 1;
          break;
        case Hr:
          Math.abs(Math.floor(t.x) % 2) === 1 ? t.x = Math.ceil(t.x) - t.x : t.x = t.x - Math.floor(t.x);
          break;
      }
    if (t.y < 0 || t.y > 1)
      switch (this.wrapT) {
        case zr:
          t.y = t.y - Math.floor(t.y);
          break;
        case Hn:
          t.y = t.y < 0 ? 0 : 1;
          break;
        case Hr:
          Math.abs(Math.floor(t.y) % 2) === 1 ? t.y = Math.ceil(t.y) - t.y : t.y = t.y - Math.floor(t.y);
          break;
      }
    return this.flipY && (t.y = 1 - t.y), t;
  }
  set needsUpdate(t) {
    t === !0 && (this.version++, this.source.needsUpdate = !0);
  }
  set needsPMREMUpdate(t) {
    t === !0 && this.pmremVersion++;
  }
}
Te.DEFAULT_IMAGE = null;
Te.DEFAULT_MAPPING = ul;
Te.DEFAULT_ANISOTROPY = 1;
class re {
  constructor(t = 0, e = 0, n = 0, s = 1) {
    re.prototype.isVector4 = !0, this.x = t, this.y = e, this.z = n, this.w = s;
  }
  get width() {
    return this.z;
  }
  set width(t) {
    this.z = t;
  }
  get height() {
    return this.w;
  }
  set height(t) {
    this.w = t;
  }
  set(t, e, n, s) {
    return this.x = t, this.y = e, this.z = n, this.w = s, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this.z = t, this.w = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setZ(t) {
    return this.z = t, this;
  }
  setW(t) {
    return this.w = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      case 3:
        this.w = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w !== void 0 ? t.w : 1, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this.w += t.w, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this.z += t, this.w += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this.w = t.w + e.w, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this.w += t.w * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this.z -= t.z, this.w -= t.w, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this.z -= t, this.w -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this.w = t.w - e.w, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this.z *= t.z, this.w *= t.w, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this.z *= t, this.w *= t, this;
  }
  applyMatrix4(t) {
    const e = this.x, n = this.y, s = this.z, r = this.w, a = t.elements;
    return this.x = a[0] * e + a[4] * n + a[8] * s + a[12] * r, this.y = a[1] * e + a[5] * n + a[9] * s + a[13] * r, this.z = a[2] * e + a[6] * n + a[10] * s + a[14] * r, this.w = a[3] * e + a[7] * n + a[11] * s + a[15] * r, this;
  }
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this.z /= t.z, this.w /= t.w, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  setAxisAngleFromQuaternion(t) {
    this.w = 2 * Math.acos(t.w);
    const e = Math.sqrt(1 - t.w * t.w);
    return e < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = t.x / e, this.y = t.y / e, this.z = t.z / e), this;
  }
  setAxisAngleFromRotationMatrix(t) {
    let e, n, s, r;
    const l = t.elements, c = l[0], h = l[4], d = l[8], f = l[1], m = l[5], _ = l[9], x = l[2], p = l[6], u = l[10];
    if (Math.abs(h - f) < 0.01 && Math.abs(d - x) < 0.01 && Math.abs(_ - p) < 0.01) {
      if (Math.abs(h + f) < 0.1 && Math.abs(d + x) < 0.1 && Math.abs(_ + p) < 0.1 && Math.abs(c + m + u - 3) < 0.1)
        return this.set(1, 0, 0, 0), this;
      e = Math.PI;
      const T = (c + 1) / 2, y = (m + 1) / 2, P = (u + 1) / 2, A = (h + f) / 4, R = (d + x) / 4, I = (_ + p) / 4;
      return T > y && T > P ? T < 0.01 ? (n = 0, s = 0.707106781, r = 0.707106781) : (n = Math.sqrt(T), s = A / n, r = R / n) : y > P ? y < 0.01 ? (n = 0.707106781, s = 0, r = 0.707106781) : (s = Math.sqrt(y), n = A / s, r = I / s) : P < 0.01 ? (n = 0.707106781, s = 0.707106781, r = 0) : (r = Math.sqrt(P), n = R / r, s = I / r), this.set(n, s, r, e), this;
    }
    let b = Math.sqrt((p - _) * (p - _) + (d - x) * (d - x) + (f - h) * (f - h));
    return Math.abs(b) < 1e-3 && (b = 1), this.x = (p - _) / b, this.y = (d - x) / b, this.z = (f - h) / b, this.w = Math.acos((c + m + u - 1) / 2), this;
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return this.x = e[12], this.y = e[13], this.z = e[14], this.w = e[15], this;
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this.w = Math.min(this.w, t.w), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this.w = Math.max(this.w, t.w), this;
  }
  clamp(t, e) {
    return this.x = Nt(this.x, t.x, e.x), this.y = Nt(this.y, t.y, e.y), this.z = Nt(this.z, t.z, e.z), this.w = Nt(this.w, t.w, e.w), this;
  }
  clampScalar(t, e) {
    return this.x = Nt(this.x, t, e), this.y = Nt(this.y, t, e), this.z = Nt(this.z, t, e), this.w = Nt(this.w, t, e), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Nt(n, t, e));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this.w += (t.w - this.w) * e, this;
  }
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this.z = t.z + (e.z - t.z) * n, this.w = t.w + (e.w - t.w) * n, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z && t.w === this.w;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this.w = t[e + 3], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t[e + 3] = this.w, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this.w = t.getW(e), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
}
class Kc extends Xn {
  constructor(t = 1, e = 1, n = {}) {
    super(), this.isRenderTarget = !0, this.width = t, this.height = e, this.depth = 1, this.scissor = new re(0, 0, t, e), this.scissorTest = !1, this.viewport = new re(0, 0, t, e);
    const s = { width: t, height: e, depth: 1 };
    n = Object.assign({
      generateMipmaps: !1,
      internalFormat: null,
      minFilter: Ke,
      depthBuffer: !0,
      stencilBuffer: !1,
      resolveDepthBuffer: !0,
      resolveStencilBuffer: !0,
      depthTexture: null,
      samples: 0,
      count: 1
    }, n);
    const r = new Te(s, n.mapping, n.wrapS, n.wrapT, n.magFilter, n.minFilter, n.format, n.type, n.anisotropy, n.colorSpace);
    r.flipY = !1, r.generateMipmaps = n.generateMipmaps, r.internalFormat = n.internalFormat, this.textures = [];
    const a = n.count;
    for (let o = 0; o < a; o++)
      this.textures[o] = r.clone(), this.textures[o].isRenderTargetTexture = !0, this.textures[o].renderTarget = this;
    this.depthBuffer = n.depthBuffer, this.stencilBuffer = n.stencilBuffer, this.resolveDepthBuffer = n.resolveDepthBuffer, this.resolveStencilBuffer = n.resolveStencilBuffer, this._depthTexture = null, this.depthTexture = n.depthTexture, this.samples = n.samples;
  }
  get texture() {
    return this.textures[0];
  }
  set texture(t) {
    this.textures[0] = t;
  }
  set depthTexture(t) {
    this._depthTexture !== null && (this._depthTexture.renderTarget = null), t !== null && (t.renderTarget = this), this._depthTexture = t;
  }
  get depthTexture() {
    return this._depthTexture;
  }
  setSize(t, e, n = 1) {
    if (this.width !== t || this.height !== e || this.depth !== n) {
      this.width = t, this.height = e, this.depth = n;
      for (let s = 0, r = this.textures.length; s < r; s++)
        this.textures[s].image.width = t, this.textures[s].image.height = e, this.textures[s].image.depth = n;
      this.dispose();
    }
    this.viewport.set(0, 0, t, e), this.scissor.set(0, 0, t, e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.width = t.width, this.height = t.height, this.depth = t.depth, this.scissor.copy(t.scissor), this.scissorTest = t.scissorTest, this.viewport.copy(t.viewport), this.textures.length = 0;
    for (let n = 0, s = t.textures.length; n < s; n++)
      this.textures[n] = t.textures[n].clone(), this.textures[n].isRenderTargetTexture = !0, this.textures[n].renderTarget = this;
    const e = Object.assign({}, t.texture.image);
    return this.texture.source = new Tl(e), this.depthBuffer = t.depthBuffer, this.stencilBuffer = t.stencilBuffer, this.resolveDepthBuffer = t.resolveDepthBuffer, this.resolveStencilBuffer = t.resolveStencilBuffer, t.depthTexture !== null && (this.depthTexture = t.depthTexture.clone()), this.samples = t.samples, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class kn extends Kc {
  constructor(t = 1, e = 1, n = {}) {
    super(t, e, n), this.isWebGLRenderTarget = !0;
  }
}
class bl extends Te {
  constructor(t = null, e = 1, n = 1, s = 1) {
    super(null), this.isDataArrayTexture = !0, this.image = { data: t, width: e, height: n, depth: s }, this.magFilter = Ue, this.minFilter = Ue, this.wrapR = Hn, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
  }
  addLayerUpdate(t) {
    this.layerUpdates.add(t);
  }
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class $c extends Te {
  constructor(t = null, e = 1, n = 1, s = 1) {
    super(null), this.isData3DTexture = !0, this.image = { data: t, width: e, height: n, depth: s }, this.magFilter = Ue, this.minFilter = Ue, this.wrapR = Hn, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class Je {
  constructor(t = 0, e = 0, n = 0, s = 1) {
    this.isQuaternion = !0, this._x = t, this._y = e, this._z = n, this._w = s;
  }
  static slerpFlat(t, e, n, s, r, a, o) {
    let l = n[s + 0], c = n[s + 1], h = n[s + 2], d = n[s + 3];
    const f = r[a + 0], m = r[a + 1], _ = r[a + 2], x = r[a + 3];
    if (o === 0) {
      t[e + 0] = l, t[e + 1] = c, t[e + 2] = h, t[e + 3] = d;
      return;
    }
    if (o === 1) {
      t[e + 0] = f, t[e + 1] = m, t[e + 2] = _, t[e + 3] = x;
      return;
    }
    if (d !== x || l !== f || c !== m || h !== _) {
      let p = 1 - o;
      const u = l * f + c * m + h * _ + d * x, b = u >= 0 ? 1 : -1, T = 1 - u * u;
      if (T > Number.EPSILON) {
        const P = Math.sqrt(T), A = Math.atan2(P, u * b);
        p = Math.sin(p * A) / P, o = Math.sin(o * A) / P;
      }
      const y = o * b;
      if (l = l * p + f * y, c = c * p + m * y, h = h * p + _ * y, d = d * p + x * y, p === 1 - o) {
        const P = 1 / Math.sqrt(l * l + c * c + h * h + d * d);
        l *= P, c *= P, h *= P, d *= P;
      }
    }
    t[e] = l, t[e + 1] = c, t[e + 2] = h, t[e + 3] = d;
  }
  static multiplyQuaternionsFlat(t, e, n, s, r, a) {
    const o = n[s], l = n[s + 1], c = n[s + 2], h = n[s + 3], d = r[a], f = r[a + 1], m = r[a + 2], _ = r[a + 3];
    return t[e] = o * _ + h * d + l * m - c * f, t[e + 1] = l * _ + h * f + c * d - o * m, t[e + 2] = c * _ + h * m + o * f - l * d, t[e + 3] = h * _ - o * d - l * f - c * m, t;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    this._x = t, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    this._y = t, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    this._z = t, this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(t) {
    this._w = t, this._onChangeCallback();
  }
  set(t, e, n, s) {
    return this._x = t, this._y = e, this._z = n, this._w = s, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(t) {
    return this._x = t.x, this._y = t.y, this._z = t.z, this._w = t.w, this._onChangeCallback(), this;
  }
  setFromEuler(t, e = !0) {
    const n = t._x, s = t._y, r = t._z, a = t._order, o = Math.cos, l = Math.sin, c = o(n / 2), h = o(s / 2), d = o(r / 2), f = l(n / 2), m = l(s / 2), _ = l(r / 2);
    switch (a) {
      case "XYZ":
        this._x = f * h * d + c * m * _, this._y = c * m * d - f * h * _, this._z = c * h * _ + f * m * d, this._w = c * h * d - f * m * _;
        break;
      case "YXZ":
        this._x = f * h * d + c * m * _, this._y = c * m * d - f * h * _, this._z = c * h * _ - f * m * d, this._w = c * h * d + f * m * _;
        break;
      case "ZXY":
        this._x = f * h * d - c * m * _, this._y = c * m * d + f * h * _, this._z = c * h * _ + f * m * d, this._w = c * h * d - f * m * _;
        break;
      case "ZYX":
        this._x = f * h * d - c * m * _, this._y = c * m * d + f * h * _, this._z = c * h * _ - f * m * d, this._w = c * h * d + f * m * _;
        break;
      case "YZX":
        this._x = f * h * d + c * m * _, this._y = c * m * d + f * h * _, this._z = c * h * _ - f * m * d, this._w = c * h * d - f * m * _;
        break;
      case "XZY":
        this._x = f * h * d - c * m * _, this._y = c * m * d - f * h * _, this._z = c * h * _ + f * m * d, this._w = c * h * d + f * m * _;
        break;
      default:
        console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + a);
    }
    return e === !0 && this._onChangeCallback(), this;
  }
  setFromAxisAngle(t, e) {
    const n = e / 2, s = Math.sin(n);
    return this._x = t.x * s, this._y = t.y * s, this._z = t.z * s, this._w = Math.cos(n), this._onChangeCallback(), this;
  }
  setFromRotationMatrix(t) {
    const e = t.elements, n = e[0], s = e[4], r = e[8], a = e[1], o = e[5], l = e[9], c = e[2], h = e[6], d = e[10], f = n + o + d;
    if (f > 0) {
      const m = 0.5 / Math.sqrt(f + 1);
      this._w = 0.25 / m, this._x = (h - l) * m, this._y = (r - c) * m, this._z = (a - s) * m;
    } else if (n > o && n > d) {
      const m = 2 * Math.sqrt(1 + n - o - d);
      this._w = (h - l) / m, this._x = 0.25 * m, this._y = (s + a) / m, this._z = (r + c) / m;
    } else if (o > d) {
      const m = 2 * Math.sqrt(1 + o - n - d);
      this._w = (r - c) / m, this._x = (s + a) / m, this._y = 0.25 * m, this._z = (l + h) / m;
    } else {
      const m = 2 * Math.sqrt(1 + d - n - o);
      this._w = (a - s) / m, this._x = (r + c) / m, this._y = (l + h) / m, this._z = 0.25 * m;
    }
    return this._onChangeCallback(), this;
  }
  setFromUnitVectors(t, e) {
    let n = t.dot(e) + 1;
    return n < Number.EPSILON ? (n = 0, Math.abs(t.x) > Math.abs(t.z) ? (this._x = -t.y, this._y = t.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -t.z, this._z = t.y, this._w = n)) : (this._x = t.y * e.z - t.z * e.y, this._y = t.z * e.x - t.x * e.z, this._z = t.x * e.y - t.y * e.x, this._w = n), this.normalize();
  }
  angleTo(t) {
    return 2 * Math.acos(Math.abs(Nt(this.dot(t), -1, 1)));
  }
  rotateTowards(t, e) {
    const n = this.angleTo(t);
    if (n === 0) return this;
    const s = Math.min(1, e / n);
    return this.slerp(t, s), this;
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
  }
  dot(t) {
    return this._x * t._x + this._y * t._y + this._z * t._z + this._w * t._w;
  }
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  normalize() {
    let t = this.length();
    return t === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (t = 1 / t, this._x = this._x * t, this._y = this._y * t, this._z = this._z * t, this._w = this._w * t), this._onChangeCallback(), this;
  }
  multiply(t) {
    return this.multiplyQuaternions(this, t);
  }
  premultiply(t) {
    return this.multiplyQuaternions(t, this);
  }
  multiplyQuaternions(t, e) {
    const n = t._x, s = t._y, r = t._z, a = t._w, o = e._x, l = e._y, c = e._z, h = e._w;
    return this._x = n * h + a * o + s * c - r * l, this._y = s * h + a * l + r * o - n * c, this._z = r * h + a * c + n * l - s * o, this._w = a * h - n * o - s * l - r * c, this._onChangeCallback(), this;
  }
  slerp(t, e) {
    if (e === 0) return this;
    if (e === 1) return this.copy(t);
    const n = this._x, s = this._y, r = this._z, a = this._w;
    let o = a * t._w + n * t._x + s * t._y + r * t._z;
    if (o < 0 ? (this._w = -t._w, this._x = -t._x, this._y = -t._y, this._z = -t._z, o = -o) : this.copy(t), o >= 1)
      return this._w = a, this._x = n, this._y = s, this._z = r, this;
    const l = 1 - o * o;
    if (l <= Number.EPSILON) {
      const m = 1 - e;
      return this._w = m * a + e * this._w, this._x = m * n + e * this._x, this._y = m * s + e * this._y, this._z = m * r + e * this._z, this.normalize(), this;
    }
    const c = Math.sqrt(l), h = Math.atan2(c, o), d = Math.sin((1 - e) * h) / c, f = Math.sin(e * h) / c;
    return this._w = a * d + this._w * f, this._x = n * d + this._x * f, this._y = s * d + this._y * f, this._z = r * d + this._z * f, this._onChangeCallback(), this;
  }
  slerpQuaternions(t, e, n) {
    return this.copy(t).slerp(e, n);
  }
  random() {
    const t = 2 * Math.PI * Math.random(), e = 2 * Math.PI * Math.random(), n = Math.random(), s = Math.sqrt(1 - n), r = Math.sqrt(n);
    return this.set(
      s * Math.sin(t),
      s * Math.cos(t),
      r * Math.sin(e),
      r * Math.cos(e)
    );
  }
  equals(t) {
    return t._x === this._x && t._y === this._y && t._z === this._z && t._w === this._w;
  }
  fromArray(t, e = 0) {
    return this._x = t[e], this._y = t[e + 1], this._z = t[e + 2], this._w = t[e + 3], this._onChangeCallback(), this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._w, t;
  }
  fromBufferAttribute(t, e) {
    return this._x = t.getX(e), this._y = t.getY(e), this._z = t.getZ(e), this._w = t.getW(e), this._onChangeCallback(), this;
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(t) {
    return this._onChangeCallback = t, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
class D {
  constructor(t = 0, e = 0, n = 0) {
    D.prototype.isVector3 = !0, this.x = t, this.y = e, this.z = n;
  }
  set(t, e, n) {
    return n === void 0 && (n = this.z), this.x = t, this.y = e, this.z = n, this;
  }
  setScalar(t) {
    return this.x = t, this.y = t, this.z = t, this;
  }
  setX(t) {
    return this.x = t, this;
  }
  setY(t) {
    return this.y = t, this;
  }
  setZ(t) {
    return this.z = t, this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this;
  }
  addScalar(t) {
    return this.x += t, this.y += t, this.z += t, this;
  }
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this;
  }
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
  }
  subScalar(t) {
    return this.x -= t, this.y -= t, this.z -= t, this;
  }
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this;
  }
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this.z *= t.z, this;
  }
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this.z *= t, this;
  }
  multiplyVectors(t, e) {
    return this.x = t.x * e.x, this.y = t.y * e.y, this.z = t.z * e.z, this;
  }
  applyEuler(t) {
    return this.applyQuaternion($a.setFromEuler(t));
  }
  applyAxisAngle(t, e) {
    return this.applyQuaternion($a.setFromAxisAngle(t, e));
  }
  applyMatrix3(t) {
    const e = this.x, n = this.y, s = this.z, r = t.elements;
    return this.x = r[0] * e + r[3] * n + r[6] * s, this.y = r[1] * e + r[4] * n + r[7] * s, this.z = r[2] * e + r[5] * n + r[8] * s, this;
  }
  applyNormalMatrix(t) {
    return this.applyMatrix3(t).normalize();
  }
  applyMatrix4(t) {
    const e = this.x, n = this.y, s = this.z, r = t.elements, a = 1 / (r[3] * e + r[7] * n + r[11] * s + r[15]);
    return this.x = (r[0] * e + r[4] * n + r[8] * s + r[12]) * a, this.y = (r[1] * e + r[5] * n + r[9] * s + r[13]) * a, this.z = (r[2] * e + r[6] * n + r[10] * s + r[14]) * a, this;
  }
  applyQuaternion(t) {
    const e = this.x, n = this.y, s = this.z, r = t.x, a = t.y, o = t.z, l = t.w, c = 2 * (a * s - o * n), h = 2 * (o * e - r * s), d = 2 * (r * n - a * e);
    return this.x = e + l * c + a * d - o * h, this.y = n + l * h + o * c - r * d, this.z = s + l * d + r * h - a * c, this;
  }
  project(t) {
    return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix);
  }
  unproject(t) {
    return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld);
  }
  transformDirection(t) {
    const e = this.x, n = this.y, s = this.z, r = t.elements;
    return this.x = r[0] * e + r[4] * n + r[8] * s, this.y = r[1] * e + r[5] * n + r[9] * s, this.z = r[2] * e + r[6] * n + r[10] * s, this.normalize();
  }
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this.z /= t.z, this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this;
  }
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this;
  }
  clamp(t, e) {
    return this.x = Nt(this.x, t.x, e.x), this.y = Nt(this.y, t.y, e.y), this.z = Nt(this.z, t.z, e.z), this;
  }
  clampScalar(t, e) {
    return this.x = Nt(this.x, t, e), this.y = Nt(this.y, t, e), this.z = Nt(this.z, t, e), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Nt(n, t, e));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  // TODO lengthSquared?
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this;
  }
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this.z = t.z + (e.z - t.z) * n, this;
  }
  cross(t) {
    return this.crossVectors(this, t);
  }
  crossVectors(t, e) {
    const n = t.x, s = t.y, r = t.z, a = e.x, o = e.y, l = e.z;
    return this.x = s * l - r * o, this.y = r * a - n * l, this.z = n * o - s * a, this;
  }
  projectOnVector(t) {
    const e = t.lengthSq();
    if (e === 0) return this.set(0, 0, 0);
    const n = t.dot(this) / e;
    return this.copy(t).multiplyScalar(n);
  }
  projectOnPlane(t) {
    return Js.copy(this).projectOnVector(t), this.sub(Js);
  }
  reflect(t) {
    return this.sub(Js.copy(t).multiplyScalar(2 * this.dot(t)));
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(Nt(n, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x, n = this.y - t.y, s = this.z - t.z;
    return e * e + n * n + s * s;
  }
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y) + Math.abs(this.z - t.z);
  }
  setFromSpherical(t) {
    return this.setFromSphericalCoords(t.radius, t.phi, t.theta);
  }
  setFromSphericalCoords(t, e, n) {
    const s = Math.sin(e) * t;
    return this.x = s * Math.sin(n), this.y = Math.cos(e) * t, this.z = s * Math.cos(n), this;
  }
  setFromCylindrical(t) {
    return this.setFromCylindricalCoords(t.radius, t.theta, t.y);
  }
  setFromCylindricalCoords(t, e, n) {
    return this.x = t * Math.sin(e), this.y = n, this.z = t * Math.cos(e), this;
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return this.x = e[12], this.y = e[13], this.z = e[14], this;
  }
  setFromMatrixScale(t) {
    const e = this.setFromMatrixColumn(t, 0).length(), n = this.setFromMatrixColumn(t, 1).length(), s = this.setFromMatrixColumn(t, 2).length();
    return this.x = e, this.y = n, this.z = s, this;
  }
  setFromMatrixColumn(t, e) {
    return this.fromArray(t.elements, e * 4);
  }
  setFromMatrix3Column(t, e) {
    return this.fromArray(t.elements, e * 3);
  }
  setFromEuler(t) {
    return this.x = t._x, this.y = t._y, this.z = t._z, this;
  }
  setFromColor(t) {
    return this.x = t.r, this.y = t.g, this.z = t.b, this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z;
  }
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t;
  }
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
  }
  randomDirection() {
    const t = Math.random() * Math.PI * 2, e = Math.random() * 2 - 1, n = Math.sqrt(1 - e * e);
    return this.x = n * Math.cos(t), this.y = e, this.z = n * Math.sin(t), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
}
const Js = /* @__PURE__ */ new D(), $a = /* @__PURE__ */ new Je();
class Yn {
  constructor(t = new D(1 / 0, 1 / 0, 1 / 0), e = new D(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = !0, this.min = t, this.max = e;
  }
  set(t, e) {
    return this.min.copy(t), this.max.copy(e), this;
  }
  setFromArray(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e += 3)
      this.expandByPoint(ke.fromArray(t, e));
    return this;
  }
  setFromBufferAttribute(t) {
    this.makeEmpty();
    for (let e = 0, n = t.count; e < n; e++)
      this.expandByPoint(ke.fromBufferAttribute(t, e));
    return this;
  }
  setFromPoints(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e++)
      this.expandByPoint(t[e]);
    return this;
  }
  setFromCenterAndSize(t, e) {
    const n = ke.copy(e).multiplyScalar(0.5);
    return this.min.copy(t).sub(n), this.max.copy(t).add(n), this;
  }
  setFromObject(t, e = !1) {
    return this.makeEmpty(), this.expandByObject(t, e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.min.copy(t.min), this.max.copy(t.max), this;
  }
  makeEmpty() {
    return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  getCenter(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.subVectors(this.max, this.min);
  }
  expandByPoint(t) {
    return this.min.min(t), this.max.max(t), this;
  }
  expandByVector(t) {
    return this.min.sub(t), this.max.add(t), this;
  }
  expandByScalar(t) {
    return this.min.addScalar(-t), this.max.addScalar(t), this;
  }
  expandByObject(t, e = !1) {
    t.updateWorldMatrix(!1, !1);
    const n = t.geometry;
    if (n !== void 0) {
      const r = n.getAttribute("position");
      if (e === !0 && r !== void 0 && t.isInstancedMesh !== !0)
        for (let a = 0, o = r.count; a < o; a++)
          t.isMesh === !0 ? t.getVertexPosition(a, ke) : ke.fromBufferAttribute(r, a), ke.applyMatrix4(t.matrixWorld), this.expandByPoint(ke);
      else
        t.boundingBox !== void 0 ? (t.boundingBox === null && t.computeBoundingBox(), Zi.copy(t.boundingBox)) : (n.boundingBox === null && n.computeBoundingBox(), Zi.copy(n.boundingBox)), Zi.applyMatrix4(t.matrixWorld), this.union(Zi);
    }
    const s = t.children;
    for (let r = 0, a = s.length; r < a; r++)
      this.expandByObject(s[r], e);
    return this;
  }
  containsPoint(t) {
    return t.x >= this.min.x && t.x <= this.max.x && t.y >= this.min.y && t.y <= this.max.y && t.z >= this.min.z && t.z <= this.max.z;
  }
  containsBox(t) {
    return this.min.x <= t.min.x && t.max.x <= this.max.x && this.min.y <= t.min.y && t.max.y <= this.max.y && this.min.z <= t.min.z && t.max.z <= this.max.z;
  }
  getParameter(t, e) {
    return e.set(
      (t.x - this.min.x) / (this.max.x - this.min.x),
      (t.y - this.min.y) / (this.max.y - this.min.y),
      (t.z - this.min.z) / (this.max.z - this.min.z)
    );
  }
  intersectsBox(t) {
    return t.max.x >= this.min.x && t.min.x <= this.max.x && t.max.y >= this.min.y && t.min.y <= this.max.y && t.max.z >= this.min.z && t.min.z <= this.max.z;
  }
  intersectsSphere(t) {
    return this.clampPoint(t.center, ke), ke.distanceToSquared(t.center) <= t.radius * t.radius;
  }
  intersectsPlane(t) {
    let e, n;
    return t.normal.x > 0 ? (e = t.normal.x * this.min.x, n = t.normal.x * this.max.x) : (e = t.normal.x * this.max.x, n = t.normal.x * this.min.x), t.normal.y > 0 ? (e += t.normal.y * this.min.y, n += t.normal.y * this.max.y) : (e += t.normal.y * this.max.y, n += t.normal.y * this.min.y), t.normal.z > 0 ? (e += t.normal.z * this.min.z, n += t.normal.z * this.max.z) : (e += t.normal.z * this.max.z, n += t.normal.z * this.min.z), e <= -t.constant && n >= -t.constant;
  }
  intersectsTriangle(t) {
    if (this.isEmpty())
      return !1;
    this.getCenter(Di), Ki.subVectors(this.max, Di), Kn.subVectors(t.a, Di), $n.subVectors(t.b, Di), Jn.subVectors(t.c, Di), pn.subVectors($n, Kn), mn.subVectors(Jn, $n), Pn.subVectors(Kn, Jn);
    let e = [
      0,
      -pn.z,
      pn.y,
      0,
      -mn.z,
      mn.y,
      0,
      -Pn.z,
      Pn.y,
      pn.z,
      0,
      -pn.x,
      mn.z,
      0,
      -mn.x,
      Pn.z,
      0,
      -Pn.x,
      -pn.y,
      pn.x,
      0,
      -mn.y,
      mn.x,
      0,
      -Pn.y,
      Pn.x,
      0
    ];
    return !Qs(e, Kn, $n, Jn, Ki) || (e = [1, 0, 0, 0, 1, 0, 0, 0, 1], !Qs(e, Kn, $n, Jn, Ki)) ? !1 : ($i.crossVectors(pn, mn), e = [$i.x, $i.y, $i.z], Qs(e, Kn, $n, Jn, Ki));
  }
  clampPoint(t, e) {
    return e.copy(t).clamp(this.min, this.max);
  }
  distanceToPoint(t) {
    return this.clampPoint(t, ke).distanceTo(t);
  }
  getBoundingSphere(t) {
    return this.isEmpty() ? t.makeEmpty() : (this.getCenter(t.center), t.radius = this.getSize(ke).length() * 0.5), t;
  }
  intersect(t) {
    return this.min.max(t.min), this.max.min(t.max), this.isEmpty() && this.makeEmpty(), this;
  }
  union(t) {
    return this.min.min(t.min), this.max.max(t.max), this;
  }
  applyMatrix4(t) {
    return this.isEmpty() ? this : (en[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t), en[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t), en[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t), en[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t), en[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t), en[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t), en[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t), en[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t), this.setFromPoints(en), this);
  }
  translate(t) {
    return this.min.add(t), this.max.add(t), this;
  }
  equals(t) {
    return t.min.equals(this.min) && t.max.equals(this.max);
  }
}
const en = [
  /* @__PURE__ */ new D(),
  /* @__PURE__ */ new D(),
  /* @__PURE__ */ new D(),
  /* @__PURE__ */ new D(),
  /* @__PURE__ */ new D(),
  /* @__PURE__ */ new D(),
  /* @__PURE__ */ new D(),
  /* @__PURE__ */ new D()
], ke = /* @__PURE__ */ new D(), Zi = /* @__PURE__ */ new Yn(), Kn = /* @__PURE__ */ new D(), $n = /* @__PURE__ */ new D(), Jn = /* @__PURE__ */ new D(), pn = /* @__PURE__ */ new D(), mn = /* @__PURE__ */ new D(), Pn = /* @__PURE__ */ new D(), Di = /* @__PURE__ */ new D(), Ki = /* @__PURE__ */ new D(), $i = /* @__PURE__ */ new D(), Dn = /* @__PURE__ */ new D();
function Qs(i, t, e, n, s) {
  for (let r = 0, a = i.length - 3; r <= a; r += 3) {
    Dn.fromArray(i, r);
    const o = s.x * Math.abs(Dn.x) + s.y * Math.abs(Dn.y) + s.z * Math.abs(Dn.z), l = t.dot(Dn), c = e.dot(Dn), h = n.dot(Dn);
    if (Math.max(-Math.max(l, c, h), Math.min(l, c, h)) > o)
      return !1;
  }
  return !0;
}
const Jc = /* @__PURE__ */ new Yn(), Li = /* @__PURE__ */ new D(), tr = /* @__PURE__ */ new D();
class Ai {
  constructor(t = new D(), e = -1) {
    this.isSphere = !0, this.center = t, this.radius = e;
  }
  set(t, e) {
    return this.center.copy(t), this.radius = e, this;
  }
  setFromPoints(t, e) {
    const n = this.center;
    e !== void 0 ? n.copy(e) : Jc.setFromPoints(t).getCenter(n);
    let s = 0;
    for (let r = 0, a = t.length; r < a; r++)
      s = Math.max(s, n.distanceToSquared(t[r]));
    return this.radius = Math.sqrt(s), this;
  }
  copy(t) {
    return this.center.copy(t.center), this.radius = t.radius, this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return this.center.set(0, 0, 0), this.radius = -1, this;
  }
  containsPoint(t) {
    return t.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(t) {
    return t.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(t) {
    const e = this.radius + t.radius;
    return t.center.distanceToSquared(this.center) <= e * e;
  }
  intersectsBox(t) {
    return t.intersectsSphere(this);
  }
  intersectsPlane(t) {
    return Math.abs(t.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(t, e) {
    const n = this.center.distanceToSquared(t);
    return e.copy(t), n > this.radius * this.radius && (e.sub(this.center).normalize(), e.multiplyScalar(this.radius).add(this.center)), e;
  }
  getBoundingBox(t) {
    return this.isEmpty() ? (t.makeEmpty(), t) : (t.set(this.center, this.center), t.expandByScalar(this.radius), t);
  }
  applyMatrix4(t) {
    return this.center.applyMatrix4(t), this.radius = this.radius * t.getMaxScaleOnAxis(), this;
  }
  translate(t) {
    return this.center.add(t), this;
  }
  expandByPoint(t) {
    if (this.isEmpty())
      return this.center.copy(t), this.radius = 0, this;
    Li.subVectors(t, this.center);
    const e = Li.lengthSq();
    if (e > this.radius * this.radius) {
      const n = Math.sqrt(e), s = (n - this.radius) * 0.5;
      this.center.addScaledVector(Li, s / n), this.radius += s;
    }
    return this;
  }
  union(t) {
    return t.isEmpty() ? this : this.isEmpty() ? (this.copy(t), this) : (this.center.equals(t.center) === !0 ? this.radius = Math.max(this.radius, t.radius) : (tr.subVectors(t.center, this.center).setLength(t.radius), this.expandByPoint(Li.copy(t.center).add(tr)), this.expandByPoint(Li.copy(t.center).sub(tr))), this);
  }
  equals(t) {
    return t.center.equals(this.center) && t.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const nn = /* @__PURE__ */ new D(), er = /* @__PURE__ */ new D(), Ji = /* @__PURE__ */ new D(), _n = /* @__PURE__ */ new D(), nr = /* @__PURE__ */ new D(), Qi = /* @__PURE__ */ new D(), ir = /* @__PURE__ */ new D();
class Gs {
  constructor(t = new D(), e = new D(0, 0, -1)) {
    this.origin = t, this.direction = e;
  }
  set(t, e) {
    return this.origin.copy(t), this.direction.copy(e), this;
  }
  copy(t) {
    return this.origin.copy(t.origin), this.direction.copy(t.direction), this;
  }
  at(t, e) {
    return e.copy(this.origin).addScaledVector(this.direction, t);
  }
  lookAt(t) {
    return this.direction.copy(t).sub(this.origin).normalize(), this;
  }
  recast(t) {
    return this.origin.copy(this.at(t, nn)), this;
  }
  closestPointToPoint(t, e) {
    e.subVectors(t, this.origin);
    const n = e.dot(this.direction);
    return n < 0 ? e.copy(this.origin) : e.copy(this.origin).addScaledVector(this.direction, n);
  }
  distanceToPoint(t) {
    return Math.sqrt(this.distanceSqToPoint(t));
  }
  distanceSqToPoint(t) {
    const e = nn.subVectors(t, this.origin).dot(this.direction);
    return e < 0 ? this.origin.distanceToSquared(t) : (nn.copy(this.origin).addScaledVector(this.direction, e), nn.distanceToSquared(t));
  }
  distanceSqToSegment(t, e, n, s) {
    er.copy(t).add(e).multiplyScalar(0.5), Ji.copy(e).sub(t).normalize(), _n.copy(this.origin).sub(er);
    const r = t.distanceTo(e) * 0.5, a = -this.direction.dot(Ji), o = _n.dot(this.direction), l = -_n.dot(Ji), c = _n.lengthSq(), h = Math.abs(1 - a * a);
    let d, f, m, _;
    if (h > 0)
      if (d = a * l - o, f = a * o - l, _ = r * h, d >= 0)
        if (f >= -_)
          if (f <= _) {
            const x = 1 / h;
            d *= x, f *= x, m = d * (d + a * f + 2 * o) + f * (a * d + f + 2 * l) + c;
          } else
            f = r, d = Math.max(0, -(a * f + o)), m = -d * d + f * (f + 2 * l) + c;
        else
          f = -r, d = Math.max(0, -(a * f + o)), m = -d * d + f * (f + 2 * l) + c;
      else
        f <= -_ ? (d = Math.max(0, -(-a * r + o)), f = d > 0 ? -r : Math.min(Math.max(-r, -l), r), m = -d * d + f * (f + 2 * l) + c) : f <= _ ? (d = 0, f = Math.min(Math.max(-r, -l), r), m = f * (f + 2 * l) + c) : (d = Math.max(0, -(a * r + o)), f = d > 0 ? r : Math.min(Math.max(-r, -l), r), m = -d * d + f * (f + 2 * l) + c);
    else
      f = a > 0 ? -r : r, d = Math.max(0, -(a * f + o)), m = -d * d + f * (f + 2 * l) + c;
    return n && n.copy(this.origin).addScaledVector(this.direction, d), s && s.copy(er).addScaledVector(Ji, f), m;
  }
  intersectSphere(t, e) {
    nn.subVectors(t.center, this.origin);
    const n = nn.dot(this.direction), s = nn.dot(nn) - n * n, r = t.radius * t.radius;
    if (s > r) return null;
    const a = Math.sqrt(r - s), o = n - a, l = n + a;
    return l < 0 ? null : o < 0 ? this.at(l, e) : this.at(o, e);
  }
  intersectsSphere(t) {
    return this.distanceSqToPoint(t.center) <= t.radius * t.radius;
  }
  distanceToPlane(t) {
    const e = t.normal.dot(this.direction);
    if (e === 0)
      return t.distanceToPoint(this.origin) === 0 ? 0 : null;
    const n = -(this.origin.dot(t.normal) + t.constant) / e;
    return n >= 0 ? n : null;
  }
  intersectPlane(t, e) {
    const n = this.distanceToPlane(t);
    return n === null ? null : this.at(n, e);
  }
  intersectsPlane(t) {
    const e = t.distanceToPoint(this.origin);
    return e === 0 || t.normal.dot(this.direction) * e < 0;
  }
  intersectBox(t, e) {
    let n, s, r, a, o, l;
    const c = 1 / this.direction.x, h = 1 / this.direction.y, d = 1 / this.direction.z, f = this.origin;
    return c >= 0 ? (n = (t.min.x - f.x) * c, s = (t.max.x - f.x) * c) : (n = (t.max.x - f.x) * c, s = (t.min.x - f.x) * c), h >= 0 ? (r = (t.min.y - f.y) * h, a = (t.max.y - f.y) * h) : (r = (t.max.y - f.y) * h, a = (t.min.y - f.y) * h), n > a || r > s || ((r > n || isNaN(n)) && (n = r), (a < s || isNaN(s)) && (s = a), d >= 0 ? (o = (t.min.z - f.z) * d, l = (t.max.z - f.z) * d) : (o = (t.max.z - f.z) * d, l = (t.min.z - f.z) * d), n > l || o > s) || ((o > n || n !== n) && (n = o), (l < s || s !== s) && (s = l), s < 0) ? null : this.at(n >= 0 ? n : s, e);
  }
  intersectsBox(t) {
    return this.intersectBox(t, nn) !== null;
  }
  intersectTriangle(t, e, n, s, r) {
    nr.subVectors(e, t), Qi.subVectors(n, t), ir.crossVectors(nr, Qi);
    let a = this.direction.dot(ir), o;
    if (a > 0) {
      if (s) return null;
      o = 1;
    } else if (a < 0)
      o = -1, a = -a;
    else
      return null;
    _n.subVectors(this.origin, t);
    const l = o * this.direction.dot(Qi.crossVectors(_n, Qi));
    if (l < 0)
      return null;
    const c = o * this.direction.dot(nr.cross(_n));
    if (c < 0 || l + c > a)
      return null;
    const h = -o * _n.dot(ir);
    return h < 0 ? null : this.at(h / a, r);
  }
  applyMatrix4(t) {
    return this.origin.applyMatrix4(t), this.direction.transformDirection(t), this;
  }
  equals(t) {
    return t.origin.equals(this.origin) && t.direction.equals(this.direction);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class Yt {
  constructor(t, e, n, s, r, a, o, l, c, h, d, f, m, _, x, p) {
    Yt.prototype.isMatrix4 = !0, this.elements = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], t !== void 0 && this.set(t, e, n, s, r, a, o, l, c, h, d, f, m, _, x, p);
  }
  set(t, e, n, s, r, a, o, l, c, h, d, f, m, _, x, p) {
    const u = this.elements;
    return u[0] = t, u[4] = e, u[8] = n, u[12] = s, u[1] = r, u[5] = a, u[9] = o, u[13] = l, u[2] = c, u[6] = h, u[10] = d, u[14] = f, u[3] = m, u[7] = _, u[11] = x, u[15] = p, this;
  }
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  clone() {
    return new Yt().fromArray(this.elements);
  }
  copy(t) {
    const e = this.elements, n = t.elements;
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], e[9] = n[9], e[10] = n[10], e[11] = n[11], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15], this;
  }
  copyPosition(t) {
    const e = this.elements, n = t.elements;
    return e[12] = n[12], e[13] = n[13], e[14] = n[14], this;
  }
  setFromMatrix3(t) {
    const e = t.elements;
    return this.set(
      e[0],
      e[3],
      e[6],
      0,
      e[1],
      e[4],
      e[7],
      0,
      e[2],
      e[5],
      e[8],
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  extractBasis(t, e, n) {
    return t.setFromMatrixColumn(this, 0), e.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this;
  }
  makeBasis(t, e, n) {
    return this.set(
      t.x,
      e.x,
      n.x,
      0,
      t.y,
      e.y,
      n.y,
      0,
      t.z,
      e.z,
      n.z,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  extractRotation(t) {
    const e = this.elements, n = t.elements, s = 1 / Qn.setFromMatrixColumn(t, 0).length(), r = 1 / Qn.setFromMatrixColumn(t, 1).length(), a = 1 / Qn.setFromMatrixColumn(t, 2).length();
    return e[0] = n[0] * s, e[1] = n[1] * s, e[2] = n[2] * s, e[3] = 0, e[4] = n[4] * r, e[5] = n[5] * r, e[6] = n[6] * r, e[7] = 0, e[8] = n[8] * a, e[9] = n[9] * a, e[10] = n[10] * a, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
  }
  makeRotationFromEuler(t) {
    const e = this.elements, n = t.x, s = t.y, r = t.z, a = Math.cos(n), o = Math.sin(n), l = Math.cos(s), c = Math.sin(s), h = Math.cos(r), d = Math.sin(r);
    if (t.order === "XYZ") {
      const f = a * h, m = a * d, _ = o * h, x = o * d;
      e[0] = l * h, e[4] = -l * d, e[8] = c, e[1] = m + _ * c, e[5] = f - x * c, e[9] = -o * l, e[2] = x - f * c, e[6] = _ + m * c, e[10] = a * l;
    } else if (t.order === "YXZ") {
      const f = l * h, m = l * d, _ = c * h, x = c * d;
      e[0] = f + x * o, e[4] = _ * o - m, e[8] = a * c, e[1] = a * d, e[5] = a * h, e[9] = -o, e[2] = m * o - _, e[6] = x + f * o, e[10] = a * l;
    } else if (t.order === "ZXY") {
      const f = l * h, m = l * d, _ = c * h, x = c * d;
      e[0] = f - x * o, e[4] = -a * d, e[8] = _ + m * o, e[1] = m + _ * o, e[5] = a * h, e[9] = x - f * o, e[2] = -a * c, e[6] = o, e[10] = a * l;
    } else if (t.order === "ZYX") {
      const f = a * h, m = a * d, _ = o * h, x = o * d;
      e[0] = l * h, e[4] = _ * c - m, e[8] = f * c + x, e[1] = l * d, e[5] = x * c + f, e[9] = m * c - _, e[2] = -c, e[6] = o * l, e[10] = a * l;
    } else if (t.order === "YZX") {
      const f = a * l, m = a * c, _ = o * l, x = o * c;
      e[0] = l * h, e[4] = x - f * d, e[8] = _ * d + m, e[1] = d, e[5] = a * h, e[9] = -o * h, e[2] = -c * h, e[6] = m * d + _, e[10] = f - x * d;
    } else if (t.order === "XZY") {
      const f = a * l, m = a * c, _ = o * l, x = o * c;
      e[0] = l * h, e[4] = -d, e[8] = c * h, e[1] = f * d + x, e[5] = a * h, e[9] = m * d - _, e[2] = _ * d - m, e[6] = o * h, e[10] = x * d + f;
    }
    return e[3] = 0, e[7] = 0, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
  }
  makeRotationFromQuaternion(t) {
    return this.compose(Qc, t, th);
  }
  lookAt(t, e, n) {
    const s = this.elements;
    return De.subVectors(t, e), De.lengthSq() === 0 && (De.z = 1), De.normalize(), gn.crossVectors(n, De), gn.lengthSq() === 0 && (Math.abs(n.z) === 1 ? De.x += 1e-4 : De.z += 1e-4, De.normalize(), gn.crossVectors(n, De)), gn.normalize(), ts.crossVectors(De, gn), s[0] = gn.x, s[4] = ts.x, s[8] = De.x, s[1] = gn.y, s[5] = ts.y, s[9] = De.y, s[2] = gn.z, s[6] = ts.z, s[10] = De.z, this;
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements, s = e.elements, r = this.elements, a = n[0], o = n[4], l = n[8], c = n[12], h = n[1], d = n[5], f = n[9], m = n[13], _ = n[2], x = n[6], p = n[10], u = n[14], b = n[3], T = n[7], y = n[11], P = n[15], A = s[0], R = s[4], I = s[8], S = s[12], M = s[1], C = s[5], H = s[9], B = s[13], k = s[2], Z = s[6], W = s[10], Q = s[14], G = s[3], st = s[7], ut = s[11], xt = s[15];
    return r[0] = a * A + o * M + l * k + c * G, r[4] = a * R + o * C + l * Z + c * st, r[8] = a * I + o * H + l * W + c * ut, r[12] = a * S + o * B + l * Q + c * xt, r[1] = h * A + d * M + f * k + m * G, r[5] = h * R + d * C + f * Z + m * st, r[9] = h * I + d * H + f * W + m * ut, r[13] = h * S + d * B + f * Q + m * xt, r[2] = _ * A + x * M + p * k + u * G, r[6] = _ * R + x * C + p * Z + u * st, r[10] = _ * I + x * H + p * W + u * ut, r[14] = _ * S + x * B + p * Q + u * xt, r[3] = b * A + T * M + y * k + P * G, r[7] = b * R + T * C + y * Z + P * st, r[11] = b * I + T * H + y * W + P * ut, r[15] = b * S + T * B + y * Q + P * xt, this;
  }
  multiplyScalar(t) {
    const e = this.elements;
    return e[0] *= t, e[4] *= t, e[8] *= t, e[12] *= t, e[1] *= t, e[5] *= t, e[9] *= t, e[13] *= t, e[2] *= t, e[6] *= t, e[10] *= t, e[14] *= t, e[3] *= t, e[7] *= t, e[11] *= t, e[15] *= t, this;
  }
  determinant() {
    const t = this.elements, e = t[0], n = t[4], s = t[8], r = t[12], a = t[1], o = t[5], l = t[9], c = t[13], h = t[2], d = t[6], f = t[10], m = t[14], _ = t[3], x = t[7], p = t[11], u = t[15];
    return _ * (+r * l * d - s * c * d - r * o * f + n * c * f + s * o * m - n * l * m) + x * (+e * l * m - e * c * f + r * a * f - s * a * m + s * c * h - r * l * h) + p * (+e * c * d - e * o * m - r * a * d + n * a * m + r * o * h - n * c * h) + u * (-s * o * h - e * l * d + e * o * f + s * a * d - n * a * f + n * l * h);
  }
  transpose() {
    const t = this.elements;
    let e;
    return e = t[1], t[1] = t[4], t[4] = e, e = t[2], t[2] = t[8], t[8] = e, e = t[6], t[6] = t[9], t[9] = e, e = t[3], t[3] = t[12], t[12] = e, e = t[7], t[7] = t[13], t[13] = e, e = t[11], t[11] = t[14], t[14] = e, this;
  }
  setPosition(t, e, n) {
    const s = this.elements;
    return t.isVector3 ? (s[12] = t.x, s[13] = t.y, s[14] = t.z) : (s[12] = t, s[13] = e, s[14] = n), this;
  }
  invert() {
    const t = this.elements, e = t[0], n = t[1], s = t[2], r = t[3], a = t[4], o = t[5], l = t[6], c = t[7], h = t[8], d = t[9], f = t[10], m = t[11], _ = t[12], x = t[13], p = t[14], u = t[15], b = d * p * c - x * f * c + x * l * m - o * p * m - d * l * u + o * f * u, T = _ * f * c - h * p * c - _ * l * m + a * p * m + h * l * u - a * f * u, y = h * x * c - _ * d * c + _ * o * m - a * x * m - h * o * u + a * d * u, P = _ * d * l - h * x * l - _ * o * f + a * x * f + h * o * p - a * d * p, A = e * b + n * T + s * y + r * P;
    if (A === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const R = 1 / A;
    return t[0] = b * R, t[1] = (x * f * r - d * p * r - x * s * m + n * p * m + d * s * u - n * f * u) * R, t[2] = (o * p * r - x * l * r + x * s * c - n * p * c - o * s * u + n * l * u) * R, t[3] = (d * l * r - o * f * r - d * s * c + n * f * c + o * s * m - n * l * m) * R, t[4] = T * R, t[5] = (h * p * r - _ * f * r + _ * s * m - e * p * m - h * s * u + e * f * u) * R, t[6] = (_ * l * r - a * p * r - _ * s * c + e * p * c + a * s * u - e * l * u) * R, t[7] = (a * f * r - h * l * r + h * s * c - e * f * c - a * s * m + e * l * m) * R, t[8] = y * R, t[9] = (_ * d * r - h * x * r - _ * n * m + e * x * m + h * n * u - e * d * u) * R, t[10] = (a * x * r - _ * o * r + _ * n * c - e * x * c - a * n * u + e * o * u) * R, t[11] = (h * o * r - a * d * r - h * n * c + e * d * c + a * n * m - e * o * m) * R, t[12] = P * R, t[13] = (h * x * s - _ * d * s + _ * n * f - e * x * f - h * n * p + e * d * p) * R, t[14] = (_ * o * s - a * x * s - _ * n * l + e * x * l + a * n * p - e * o * p) * R, t[15] = (a * d * s - h * o * s + h * n * l - e * d * l - a * n * f + e * o * f) * R, this;
  }
  scale(t) {
    const e = this.elements, n = t.x, s = t.y, r = t.z;
    return e[0] *= n, e[4] *= s, e[8] *= r, e[1] *= n, e[5] *= s, e[9] *= r, e[2] *= n, e[6] *= s, e[10] *= r, e[3] *= n, e[7] *= s, e[11] *= r, this;
  }
  getMaxScaleOnAxis() {
    const t = this.elements, e = t[0] * t[0] + t[1] * t[1] + t[2] * t[2], n = t[4] * t[4] + t[5] * t[5] + t[6] * t[6], s = t[8] * t[8] + t[9] * t[9] + t[10] * t[10];
    return Math.sqrt(Math.max(e, n, s));
  }
  makeTranslation(t, e, n) {
    return t.isVector3 ? this.set(
      1,
      0,
      0,
      t.x,
      0,
      1,
      0,
      t.y,
      0,
      0,
      1,
      t.z,
      0,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      0,
      t,
      0,
      1,
      0,
      e,
      0,
      0,
      1,
      n,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationX(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      1,
      0,
      0,
      0,
      0,
      e,
      -n,
      0,
      0,
      n,
      e,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationY(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      e,
      0,
      n,
      0,
      0,
      1,
      0,
      0,
      -n,
      0,
      e,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationZ(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      e,
      -n,
      0,
      0,
      n,
      e,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationAxis(t, e) {
    const n = Math.cos(e), s = Math.sin(e), r = 1 - n, a = t.x, o = t.y, l = t.z, c = r * a, h = r * o;
    return this.set(
      c * a + n,
      c * o - s * l,
      c * l + s * o,
      0,
      c * o + s * l,
      h * o + n,
      h * l - s * a,
      0,
      c * l - s * o,
      h * l + s * a,
      r * l * l + n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeScale(t, e, n) {
    return this.set(
      t,
      0,
      0,
      0,
      0,
      e,
      0,
      0,
      0,
      0,
      n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeShear(t, e, n, s, r, a) {
    return this.set(
      1,
      n,
      r,
      0,
      t,
      1,
      a,
      0,
      e,
      s,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  compose(t, e, n) {
    const s = this.elements, r = e._x, a = e._y, o = e._z, l = e._w, c = r + r, h = a + a, d = o + o, f = r * c, m = r * h, _ = r * d, x = a * h, p = a * d, u = o * d, b = l * c, T = l * h, y = l * d, P = n.x, A = n.y, R = n.z;
    return s[0] = (1 - (x + u)) * P, s[1] = (m + y) * P, s[2] = (_ - T) * P, s[3] = 0, s[4] = (m - y) * A, s[5] = (1 - (f + u)) * A, s[6] = (p + b) * A, s[7] = 0, s[8] = (_ + T) * R, s[9] = (p - b) * R, s[10] = (1 - (f + x)) * R, s[11] = 0, s[12] = t.x, s[13] = t.y, s[14] = t.z, s[15] = 1, this;
  }
  decompose(t, e, n) {
    const s = this.elements;
    let r = Qn.set(s[0], s[1], s[2]).length();
    const a = Qn.set(s[4], s[5], s[6]).length(), o = Qn.set(s[8], s[9], s[10]).length();
    this.determinant() < 0 && (r = -r), t.x = s[12], t.y = s[13], t.z = s[14], We.copy(this);
    const c = 1 / r, h = 1 / a, d = 1 / o;
    return We.elements[0] *= c, We.elements[1] *= c, We.elements[2] *= c, We.elements[4] *= h, We.elements[5] *= h, We.elements[6] *= h, We.elements[8] *= d, We.elements[9] *= d, We.elements[10] *= d, e.setFromRotationMatrix(We), n.x = r, n.y = a, n.z = o, this;
  }
  makePerspective(t, e, n, s, r, a, o = hn) {
    const l = this.elements, c = 2 * r / (e - t), h = 2 * r / (n - s), d = (e + t) / (e - t), f = (n + s) / (n - s);
    let m, _;
    if (o === hn)
      m = -(a + r) / (a - r), _ = -2 * a * r / (a - r);
    else if (o === Cs)
      m = -a / (a - r), _ = -a * r / (a - r);
    else
      throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
    return l[0] = c, l[4] = 0, l[8] = d, l[12] = 0, l[1] = 0, l[5] = h, l[9] = f, l[13] = 0, l[2] = 0, l[6] = 0, l[10] = m, l[14] = _, l[3] = 0, l[7] = 0, l[11] = -1, l[15] = 0, this;
  }
  makeOrthographic(t, e, n, s, r, a, o = hn) {
    const l = this.elements, c = 1 / (e - t), h = 1 / (n - s), d = 1 / (a - r), f = (e + t) * c, m = (n + s) * h;
    let _, x;
    if (o === hn)
      _ = (a + r) * d, x = -2 * d;
    else if (o === Cs)
      _ = r * d, x = -1 * d;
    else
      throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
    return l[0] = 2 * c, l[4] = 0, l[8] = 0, l[12] = -f, l[1] = 0, l[5] = 2 * h, l[9] = 0, l[13] = -m, l[2] = 0, l[6] = 0, l[10] = x, l[14] = -_, l[3] = 0, l[7] = 0, l[11] = 0, l[15] = 1, this;
  }
  equals(t) {
    const e = this.elements, n = t.elements;
    for (let s = 0; s < 16; s++)
      if (e[s] !== n[s]) return !1;
    return !0;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 16; n++)
      this.elements[n] = t[n + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.elements;
    return t[e] = n[0], t[e + 1] = n[1], t[e + 2] = n[2], t[e + 3] = n[3], t[e + 4] = n[4], t[e + 5] = n[5], t[e + 6] = n[6], t[e + 7] = n[7], t[e + 8] = n[8], t[e + 9] = n[9], t[e + 10] = n[10], t[e + 11] = n[11], t[e + 12] = n[12], t[e + 13] = n[13], t[e + 14] = n[14], t[e + 15] = n[15], t;
  }
}
const Qn = /* @__PURE__ */ new D(), We = /* @__PURE__ */ new Yt(), Qc = /* @__PURE__ */ new D(0, 0, 0), th = /* @__PURE__ */ new D(1, 1, 1), gn = /* @__PURE__ */ new D(), ts = /* @__PURE__ */ new D(), De = /* @__PURE__ */ new D(), Ja = /* @__PURE__ */ new Yt(), Qa = /* @__PURE__ */ new Je();
class Qe {
  constructor(t = 0, e = 0, n = 0, s = Qe.DEFAULT_ORDER) {
    this.isEuler = !0, this._x = t, this._y = e, this._z = n, this._order = s;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    this._x = t, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    this._y = t, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    this._z = t, this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(t) {
    this._order = t, this._onChangeCallback();
  }
  set(t, e, n, s = this._order) {
    return this._x = t, this._y = e, this._z = n, this._order = s, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(t) {
    return this._x = t._x, this._y = t._y, this._z = t._z, this._order = t._order, this._onChangeCallback(), this;
  }
  setFromRotationMatrix(t, e = this._order, n = !0) {
    const s = t.elements, r = s[0], a = s[4], o = s[8], l = s[1], c = s[5], h = s[9], d = s[2], f = s[6], m = s[10];
    switch (e) {
      case "XYZ":
        this._y = Math.asin(Nt(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(-h, m), this._z = Math.atan2(-a, r)) : (this._x = Math.atan2(f, c), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-Nt(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._y = Math.atan2(o, m), this._z = Math.atan2(l, c)) : (this._y = Math.atan2(-d, r), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(Nt(f, -1, 1)), Math.abs(f) < 0.9999999 ? (this._y = Math.atan2(-d, m), this._z = Math.atan2(-a, c)) : (this._y = 0, this._z = Math.atan2(l, r));
        break;
      case "ZYX":
        this._y = Math.asin(-Nt(d, -1, 1)), Math.abs(d) < 0.9999999 ? (this._x = Math.atan2(f, m), this._z = Math.atan2(l, r)) : (this._x = 0, this._z = Math.atan2(-a, c));
        break;
      case "YZX":
        this._z = Math.asin(Nt(l, -1, 1)), Math.abs(l) < 0.9999999 ? (this._x = Math.atan2(-h, c), this._y = Math.atan2(-d, r)) : (this._x = 0, this._y = Math.atan2(o, m));
        break;
      case "XZY":
        this._z = Math.asin(-Nt(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(f, c), this._y = Math.atan2(o, r)) : (this._x = Math.atan2(-h, m), this._y = 0);
        break;
      default:
        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + e);
    }
    return this._order = e, n === !0 && this._onChangeCallback(), this;
  }
  setFromQuaternion(t, e, n) {
    return Ja.makeRotationFromQuaternion(t), this.setFromRotationMatrix(Ja, e, n);
  }
  setFromVector3(t, e = this._order) {
    return this.set(t.x, t.y, t.z, e);
  }
  reorder(t) {
    return Qa.setFromEuler(this), this.setFromQuaternion(Qa, t);
  }
  equals(t) {
    return t._x === this._x && t._y === this._y && t._z === this._z && t._order === this._order;
  }
  fromArray(t) {
    return this._x = t[0], this._y = t[1], this._z = t[2], t[3] !== void 0 && (this._order = t[3]), this._onChangeCallback(), this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._order, t;
  }
  _onChange(t) {
    return this._onChangeCallback = t, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
Qe.DEFAULT_ORDER = "XYZ";
class Ra {
  constructor() {
    this.mask = 1;
  }
  set(t) {
    this.mask = (1 << t | 0) >>> 0;
  }
  enable(t) {
    this.mask |= 1 << t | 0;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(t) {
    this.mask ^= 1 << t | 0;
  }
  disable(t) {
    this.mask &= ~(1 << t | 0);
  }
  disableAll() {
    this.mask = 0;
  }
  test(t) {
    return (this.mask & t.mask) !== 0;
  }
  isEnabled(t) {
    return (this.mask & (1 << t | 0)) !== 0;
  }
}
let eh = 0;
const to = /* @__PURE__ */ new D(), ti = /* @__PURE__ */ new Je(), sn = /* @__PURE__ */ new Yt(), es = /* @__PURE__ */ new D(), Ui = /* @__PURE__ */ new D(), nh = /* @__PURE__ */ new D(), ih = /* @__PURE__ */ new Je(), eo = /* @__PURE__ */ new D(1, 0, 0), no = /* @__PURE__ */ new D(0, 1, 0), io = /* @__PURE__ */ new D(0, 0, 1), so = { type: "added" }, sh = { type: "removed" }, ei = { type: "childadded", child: null }, sr = { type: "childremoved", child: null };
class me extends Xn {
  constructor() {
    super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: eh++ }), this.uuid = Wi(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = me.DEFAULT_UP.clone();
    const t = new D(), e = new Qe(), n = new Je(), s = new D(1, 1, 1);
    function r() {
      n.setFromEuler(e, !1);
    }
    function a() {
      e.setFromQuaternion(n, void 0, !1);
    }
    e._onChange(r), n._onChange(a), Object.defineProperties(this, {
      position: {
        configurable: !0,
        enumerable: !0,
        value: t
      },
      rotation: {
        configurable: !0,
        enumerable: !0,
        value: e
      },
      quaternion: {
        configurable: !0,
        enumerable: !0,
        value: n
      },
      scale: {
        configurable: !0,
        enumerable: !0,
        value: s
      },
      modelViewMatrix: {
        value: new Yt()
      },
      normalMatrix: {
        value: new Dt()
      }
    }), this.matrix = new Yt(), this.matrixWorld = new Yt(), this.matrixAutoUpdate = me.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = me.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new Ra(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.userData = {};
  }
  onBeforeShadow() {
  }
  onAfterShadow() {
  }
  onBeforeRender() {
  }
  onAfterRender() {
  }
  applyMatrix4(t) {
    this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(t), this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  applyQuaternion(t) {
    return this.quaternion.premultiply(t), this;
  }
  setRotationFromAxisAngle(t, e) {
    this.quaternion.setFromAxisAngle(t, e);
  }
  setRotationFromEuler(t) {
    this.quaternion.setFromEuler(t, !0);
  }
  setRotationFromMatrix(t) {
    this.quaternion.setFromRotationMatrix(t);
  }
  setRotationFromQuaternion(t) {
    this.quaternion.copy(t);
  }
  rotateOnAxis(t, e) {
    return ti.setFromAxisAngle(t, e), this.quaternion.multiply(ti), this;
  }
  rotateOnWorldAxis(t, e) {
    return ti.setFromAxisAngle(t, e), this.quaternion.premultiply(ti), this;
  }
  rotateX(t) {
    return this.rotateOnAxis(eo, t);
  }
  rotateY(t) {
    return this.rotateOnAxis(no, t);
  }
  rotateZ(t) {
    return this.rotateOnAxis(io, t);
  }
  translateOnAxis(t, e) {
    return to.copy(t).applyQuaternion(this.quaternion), this.position.add(to.multiplyScalar(e)), this;
  }
  translateX(t) {
    return this.translateOnAxis(eo, t);
  }
  translateY(t) {
    return this.translateOnAxis(no, t);
  }
  translateZ(t) {
    return this.translateOnAxis(io, t);
  }
  localToWorld(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(this.matrixWorld);
  }
  worldToLocal(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(sn.copy(this.matrixWorld).invert());
  }
  lookAt(t, e, n) {
    t.isVector3 ? es.copy(t) : es.set(t, e, n);
    const s = this.parent;
    this.updateWorldMatrix(!0, !1), Ui.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? sn.lookAt(Ui, es, this.up) : sn.lookAt(es, Ui, this.up), this.quaternion.setFromRotationMatrix(sn), s && (sn.extractRotation(s.matrixWorld), ti.setFromRotationMatrix(sn), this.quaternion.premultiply(ti.invert()));
  }
  add(t) {
    if (arguments.length > 1) {
      for (let e = 0; e < arguments.length; e++)
        this.add(arguments[e]);
      return this;
    }
    return t === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", t), this) : (t && t.isObject3D ? (t.removeFromParent(), t.parent = this, this.children.push(t), t.dispatchEvent(so), ei.child = t, this.dispatchEvent(ei), ei.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", t), this);
  }
  remove(t) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++)
        this.remove(arguments[n]);
      return this;
    }
    const e = this.children.indexOf(t);
    return e !== -1 && (t.parent = null, this.children.splice(e, 1), t.dispatchEvent(sh), sr.child = t, this.dispatchEvent(sr), sr.child = null), this;
  }
  removeFromParent() {
    const t = this.parent;
    return t !== null && t.remove(this), this;
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(t) {
    return this.updateWorldMatrix(!0, !1), sn.copy(this.matrixWorld).invert(), t.parent !== null && (t.parent.updateWorldMatrix(!0, !1), sn.multiply(t.parent.matrixWorld)), t.applyMatrix4(sn), t.removeFromParent(), t.parent = this, this.children.push(t), t.updateWorldMatrix(!1, !0), t.dispatchEvent(so), ei.child = t, this.dispatchEvent(ei), ei.child = null, this;
  }
  getObjectById(t) {
    return this.getObjectByProperty("id", t);
  }
  getObjectByName(t) {
    return this.getObjectByProperty("name", t);
  }
  getObjectByProperty(t, e) {
    if (this[t] === e) return this;
    for (let n = 0, s = this.children.length; n < s; n++) {
      const a = this.children[n].getObjectByProperty(t, e);
      if (a !== void 0)
        return a;
    }
  }
  getObjectsByProperty(t, e, n = []) {
    this[t] === e && n.push(this);
    const s = this.children;
    for (let r = 0, a = s.length; r < a; r++)
      s[r].getObjectsByProperty(t, e, n);
    return n;
  }
  getWorldPosition(t) {
    return this.updateWorldMatrix(!0, !1), t.setFromMatrixPosition(this.matrixWorld);
  }
  getWorldQuaternion(t) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Ui, t, nh), t;
  }
  getWorldScale(t) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Ui, ih, t), t;
  }
  getWorldDirection(t) {
    this.updateWorldMatrix(!0, !1);
    const e = this.matrixWorld.elements;
    return t.set(e[8], e[9], e[10]).normalize();
  }
  raycast() {
  }
  traverse(t) {
    t(this);
    const e = this.children;
    for (let n = 0, s = e.length; n < s; n++)
      e[n].traverse(t);
  }
  traverseVisible(t) {
    if (this.visible === !1) return;
    t(this);
    const e = this.children;
    for (let n = 0, s = e.length; n < s; n++)
      e[n].traverseVisible(t);
  }
  traverseAncestors(t) {
    const e = this.parent;
    e !== null && (t(e), e.traverseAncestors(t));
  }
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0;
  }
  updateMatrixWorld(t) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || t) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, t = !0);
    const e = this.children;
    for (let n = 0, s = e.length; n < s; n++)
      e[n].updateMatrixWorld(t);
  }
  updateWorldMatrix(t, e) {
    const n = this.parent;
    if (t === !0 && n !== null && n.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), e === !0) {
      const s = this.children;
      for (let r = 0, a = s.length; r < a; r++)
        s[r].updateWorldMatrix(!1, !0);
    }
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string", n = {};
    e && (t = {
      geometries: {},
      materials: {},
      textures: {},
      images: {},
      shapes: {},
      skeletons: {},
      animations: {},
      nodes: {}
    }, n.metadata = {
      version: 4.6,
      type: "Object",
      generator: "Object3D.toJSON"
    });
    const s = {};
    s.uuid = this.uuid, s.type = this.type, this.name !== "" && (s.name = this.name), this.castShadow === !0 && (s.castShadow = !0), this.receiveShadow === !0 && (s.receiveShadow = !0), this.visible === !1 && (s.visible = !1), this.frustumCulled === !1 && (s.frustumCulled = !1), this.renderOrder !== 0 && (s.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (s.userData = this.userData), s.layers = this.layers.mask, s.matrix = this.matrix.toArray(), s.up = this.up.toArray(), this.matrixAutoUpdate === !1 && (s.matrixAutoUpdate = !1), this.isInstancedMesh && (s.type = "InstancedMesh", s.count = this.count, s.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (s.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (s.type = "BatchedMesh", s.perObjectFrustumCulled = this.perObjectFrustumCulled, s.sortObjects = this.sortObjects, s.drawRanges = this._drawRanges, s.reservedRanges = this._reservedRanges, s.visibility = this._visibility, s.active = this._active, s.bounds = this._bounds.map((o) => ({
      boxInitialized: o.boxInitialized,
      boxMin: o.box.min.toArray(),
      boxMax: o.box.max.toArray(),
      sphereInitialized: o.sphereInitialized,
      sphereRadius: o.sphere.radius,
      sphereCenter: o.sphere.center.toArray()
    })), s.maxInstanceCount = this._maxInstanceCount, s.maxVertexCount = this._maxVertexCount, s.maxIndexCount = this._maxIndexCount, s.geometryInitialized = this._geometryInitialized, s.geometryCount = this._geometryCount, s.matricesTexture = this._matricesTexture.toJSON(t), this._colorsTexture !== null && (s.colorsTexture = this._colorsTexture.toJSON(t)), this.boundingSphere !== null && (s.boundingSphere = {
      center: s.boundingSphere.center.toArray(),
      radius: s.boundingSphere.radius
    }), this.boundingBox !== null && (s.boundingBox = {
      min: s.boundingBox.min.toArray(),
      max: s.boundingBox.max.toArray()
    }));
    function r(o, l) {
      return o[l.uuid] === void 0 && (o[l.uuid] = l.toJSON(t)), l.uuid;
    }
    if (this.isScene)
      this.background && (this.background.isColor ? s.background = this.background.toJSON() : this.background.isTexture && (s.background = this.background.toJSON(t).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (s.environment = this.environment.toJSON(t).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      s.geometry = r(t.geometries, this.geometry);
      const o = this.geometry.parameters;
      if (o !== void 0 && o.shapes !== void 0) {
        const l = o.shapes;
        if (Array.isArray(l))
          for (let c = 0, h = l.length; c < h; c++) {
            const d = l[c];
            r(t.shapes, d);
          }
        else
          r(t.shapes, l);
      }
    }
    if (this.isSkinnedMesh && (s.bindMode = this.bindMode, s.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (r(t.skeletons, this.skeleton), s.skeleton = this.skeleton.uuid)), this.material !== void 0)
      if (Array.isArray(this.material)) {
        const o = [];
        for (let l = 0, c = this.material.length; l < c; l++)
          o.push(r(t.materials, this.material[l]));
        s.material = o;
      } else
        s.material = r(t.materials, this.material);
    if (this.children.length > 0) {
      s.children = [];
      for (let o = 0; o < this.children.length; o++)
        s.children.push(this.children[o].toJSON(t).object);
    }
    if (this.animations.length > 0) {
      s.animations = [];
      for (let o = 0; o < this.animations.length; o++) {
        const l = this.animations[o];
        s.animations.push(r(t.animations, l));
      }
    }
    if (e) {
      const o = a(t.geometries), l = a(t.materials), c = a(t.textures), h = a(t.images), d = a(t.shapes), f = a(t.skeletons), m = a(t.animations), _ = a(t.nodes);
      o.length > 0 && (n.geometries = o), l.length > 0 && (n.materials = l), c.length > 0 && (n.textures = c), h.length > 0 && (n.images = h), d.length > 0 && (n.shapes = d), f.length > 0 && (n.skeletons = f), m.length > 0 && (n.animations = m), _.length > 0 && (n.nodes = _);
    }
    return n.object = s, n;
    function a(o) {
      const l = [];
      for (const c in o) {
        const h = o[c];
        delete h.metadata, l.push(h);
      }
      return l;
    }
  }
  clone(t) {
    return new this.constructor().copy(this, t);
  }
  copy(t, e = !0) {
    if (this.name = t.name, this.up.copy(t.up), this.position.copy(t.position), this.rotation.order = t.rotation.order, this.quaternion.copy(t.quaternion), this.scale.copy(t.scale), this.matrix.copy(t.matrix), this.matrixWorld.copy(t.matrixWorld), this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrixWorldAutoUpdate = t.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate, this.layers.mask = t.layers.mask, this.visible = t.visible, this.castShadow = t.castShadow, this.receiveShadow = t.receiveShadow, this.frustumCulled = t.frustumCulled, this.renderOrder = t.renderOrder, this.animations = t.animations.slice(), this.userData = JSON.parse(JSON.stringify(t.userData)), e === !0)
      for (let n = 0; n < t.children.length; n++) {
        const s = t.children[n];
        this.add(s.clone());
      }
    return this;
  }
}
me.DEFAULT_UP = /* @__PURE__ */ new D(0, 1, 0);
me.DEFAULT_MATRIX_AUTO_UPDATE = !0;
me.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
const Xe = /* @__PURE__ */ new D(), rn = /* @__PURE__ */ new D(), rr = /* @__PURE__ */ new D(), an = /* @__PURE__ */ new D(), ni = /* @__PURE__ */ new D(), ii = /* @__PURE__ */ new D(), ro = /* @__PURE__ */ new D(), ar = /* @__PURE__ */ new D(), or = /* @__PURE__ */ new D(), lr = /* @__PURE__ */ new D(), cr = /* @__PURE__ */ new re(), hr = /* @__PURE__ */ new re(), ur = /* @__PURE__ */ new re();
class Ye {
  constructor(t = new D(), e = new D(), n = new D()) {
    this.a = t, this.b = e, this.c = n;
  }
  static getNormal(t, e, n, s) {
    s.subVectors(n, e), Xe.subVectors(t, e), s.cross(Xe);
    const r = s.lengthSq();
    return r > 0 ? s.multiplyScalar(1 / Math.sqrt(r)) : s.set(0, 0, 0);
  }
  // static/instance method to calculate barycentric coordinates
  // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
  static getBarycoord(t, e, n, s, r) {
    Xe.subVectors(s, e), rn.subVectors(n, e), rr.subVectors(t, e);
    const a = Xe.dot(Xe), o = Xe.dot(rn), l = Xe.dot(rr), c = rn.dot(rn), h = rn.dot(rr), d = a * c - o * o;
    if (d === 0)
      return r.set(0, 0, 0), null;
    const f = 1 / d, m = (c * l - o * h) * f, _ = (a * h - o * l) * f;
    return r.set(1 - m - _, _, m);
  }
  static containsPoint(t, e, n, s) {
    return this.getBarycoord(t, e, n, s, an) === null ? !1 : an.x >= 0 && an.y >= 0 && an.x + an.y <= 1;
  }
  static getInterpolation(t, e, n, s, r, a, o, l) {
    return this.getBarycoord(t, e, n, s, an) === null ? (l.x = 0, l.y = 0, "z" in l && (l.z = 0), "w" in l && (l.w = 0), null) : (l.setScalar(0), l.addScaledVector(r, an.x), l.addScaledVector(a, an.y), l.addScaledVector(o, an.z), l);
  }
  static getInterpolatedAttribute(t, e, n, s, r, a) {
    return cr.setScalar(0), hr.setScalar(0), ur.setScalar(0), cr.fromBufferAttribute(t, e), hr.fromBufferAttribute(t, n), ur.fromBufferAttribute(t, s), a.setScalar(0), a.addScaledVector(cr, r.x), a.addScaledVector(hr, r.y), a.addScaledVector(ur, r.z), a;
  }
  static isFrontFacing(t, e, n, s) {
    return Xe.subVectors(n, e), rn.subVectors(t, e), Xe.cross(rn).dot(s) < 0;
  }
  set(t, e, n) {
    return this.a.copy(t), this.b.copy(e), this.c.copy(n), this;
  }
  setFromPointsAndIndices(t, e, n, s) {
    return this.a.copy(t[e]), this.b.copy(t[n]), this.c.copy(t[s]), this;
  }
  setFromAttributeAndIndices(t, e, n, s) {
    return this.a.fromBufferAttribute(t, e), this.b.fromBufferAttribute(t, n), this.c.fromBufferAttribute(t, s), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.a.copy(t.a), this.b.copy(t.b), this.c.copy(t.c), this;
  }
  getArea() {
    return Xe.subVectors(this.c, this.b), rn.subVectors(this.a, this.b), Xe.cross(rn).length() * 0.5;
  }
  getMidpoint(t) {
    return t.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }
  getNormal(t) {
    return Ye.getNormal(this.a, this.b, this.c, t);
  }
  getPlane(t) {
    return t.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(t, e) {
    return Ye.getBarycoord(t, this.a, this.b, this.c, e);
  }
  getInterpolation(t, e, n, s, r) {
    return Ye.getInterpolation(t, this.a, this.b, this.c, e, n, s, r);
  }
  containsPoint(t) {
    return Ye.containsPoint(t, this.a, this.b, this.c);
  }
  isFrontFacing(t) {
    return Ye.isFrontFacing(this.a, this.b, this.c, t);
  }
  intersectsBox(t) {
    return t.intersectsTriangle(this);
  }
  closestPointToPoint(t, e) {
    const n = this.a, s = this.b, r = this.c;
    let a, o;
    ni.subVectors(s, n), ii.subVectors(r, n), ar.subVectors(t, n);
    const l = ni.dot(ar), c = ii.dot(ar);
    if (l <= 0 && c <= 0)
      return e.copy(n);
    or.subVectors(t, s);
    const h = ni.dot(or), d = ii.dot(or);
    if (h >= 0 && d <= h)
      return e.copy(s);
    const f = l * d - h * c;
    if (f <= 0 && l >= 0 && h <= 0)
      return a = l / (l - h), e.copy(n).addScaledVector(ni, a);
    lr.subVectors(t, r);
    const m = ni.dot(lr), _ = ii.dot(lr);
    if (_ >= 0 && m <= _)
      return e.copy(r);
    const x = m * c - l * _;
    if (x <= 0 && c >= 0 && _ <= 0)
      return o = c / (c - _), e.copy(n).addScaledVector(ii, o);
    const p = h * _ - m * d;
    if (p <= 0 && d - h >= 0 && m - _ >= 0)
      return ro.subVectors(r, s), o = (d - h) / (d - h + (m - _)), e.copy(s).addScaledVector(ro, o);
    const u = 1 / (p + x + f);
    return a = x * u, o = f * u, e.copy(n).addScaledVector(ni, a).addScaledVector(ii, o);
  }
  equals(t) {
    return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
  }
}
const Al = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
}, vn = { h: 0, s: 0, l: 0 }, ns = { h: 0, s: 0, l: 0 };
function dr(i, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? i + (t - i) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? i + (t - i) * 6 * (2 / 3 - e) : i;
}
class It {
  constructor(t, e, n) {
    return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(t, e, n);
  }
  set(t, e, n) {
    if (e === void 0 && n === void 0) {
      const s = t;
      s && s.isColor ? this.copy(s) : typeof s == "number" ? this.setHex(s) : typeof s == "string" && this.setStyle(s);
    } else
      this.setRGB(t, e, n);
    return this;
  }
  setScalar(t) {
    return this.r = t, this.g = t, this.b = t, this;
  }
  setHex(t, e = ze) {
    return t = Math.floor(t), this.r = (t >> 16 & 255) / 255, this.g = (t >> 8 & 255) / 255, this.b = (t & 255) / 255, Xt.toWorkingColorSpace(this, e), this;
  }
  setRGB(t, e, n, s = Xt.workingColorSpace) {
    return this.r = t, this.g = e, this.b = n, Xt.toWorkingColorSpace(this, s), this;
  }
  setHSL(t, e, n, s = Xt.workingColorSpace) {
    if (t = Hc(t, 1), e = Nt(e, 0, 1), n = Nt(n, 0, 1), e === 0)
      this.r = this.g = this.b = n;
    else {
      const r = n <= 0.5 ? n * (1 + e) : n + e - n * e, a = 2 * n - r;
      this.r = dr(a, r, t + 1 / 3), this.g = dr(a, r, t), this.b = dr(a, r, t - 1 / 3);
    }
    return Xt.toWorkingColorSpace(this, s), this;
  }
  setStyle(t, e = ze) {
    function n(r) {
      r !== void 0 && parseFloat(r) < 1 && console.warn("THREE.Color: Alpha component of " + t + " will be ignored.");
    }
    let s;
    if (s = /^(\w+)\(([^\)]*)\)/.exec(t)) {
      let r;
      const a = s[1], o = s[2];
      switch (a) {
        case "rgb":
        case "rgba":
          if (r = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(r[4]), this.setRGB(
              Math.min(255, parseInt(r[1], 10)) / 255,
              Math.min(255, parseInt(r[2], 10)) / 255,
              Math.min(255, parseInt(r[3], 10)) / 255,
              e
            );
          if (r = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(r[4]), this.setRGB(
              Math.min(100, parseInt(r[1], 10)) / 100,
              Math.min(100, parseInt(r[2], 10)) / 100,
              Math.min(100, parseInt(r[3], 10)) / 100,
              e
            );
          break;
        case "hsl":
        case "hsla":
          if (r = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(r[4]), this.setHSL(
              parseFloat(r[1]) / 360,
              parseFloat(r[2]) / 100,
              parseFloat(r[3]) / 100,
              e
            );
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + t);
      }
    } else if (s = /^\#([A-Fa-f\d]+)$/.exec(t)) {
      const r = s[1], a = r.length;
      if (a === 3)
        return this.setRGB(
          parseInt(r.charAt(0), 16) / 15,
          parseInt(r.charAt(1), 16) / 15,
          parseInt(r.charAt(2), 16) / 15,
          e
        );
      if (a === 6)
        return this.setHex(parseInt(r, 16), e);
      console.warn("THREE.Color: Invalid hex color " + t);
    } else if (t && t.length > 0)
      return this.setColorName(t, e);
    return this;
  }
  setColorName(t, e = ze) {
    const n = Al[t.toLowerCase()];
    return n !== void 0 ? this.setHex(n, e) : console.warn("THREE.Color: Unknown color " + t), this;
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(t) {
    return this.r = t.r, this.g = t.g, this.b = t.b, this;
  }
  copySRGBToLinear(t) {
    return this.r = un(t.r), this.g = un(t.g), this.b = un(t.b), this;
  }
  copyLinearToSRGB(t) {
    return this.r = vi(t.r), this.g = vi(t.g), this.b = vi(t.b), this;
  }
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  getHex(t = ze) {
    return Xt.fromWorkingColorSpace(Me.copy(this), t), Math.round(Nt(Me.r * 255, 0, 255)) * 65536 + Math.round(Nt(Me.g * 255, 0, 255)) * 256 + Math.round(Nt(Me.b * 255, 0, 255));
  }
  getHexString(t = ze) {
    return ("000000" + this.getHex(t).toString(16)).slice(-6);
  }
  getHSL(t, e = Xt.workingColorSpace) {
    Xt.fromWorkingColorSpace(Me.copy(this), e);
    const n = Me.r, s = Me.g, r = Me.b, a = Math.max(n, s, r), o = Math.min(n, s, r);
    let l, c;
    const h = (o + a) / 2;
    if (o === a)
      l = 0, c = 0;
    else {
      const d = a - o;
      switch (c = h <= 0.5 ? d / (a + o) : d / (2 - a - o), a) {
        case n:
          l = (s - r) / d + (s < r ? 6 : 0);
          break;
        case s:
          l = (r - n) / d + 2;
          break;
        case r:
          l = (n - s) / d + 4;
          break;
      }
      l /= 6;
    }
    return t.h = l, t.s = c, t.l = h, t;
  }
  getRGB(t, e = Xt.workingColorSpace) {
    return Xt.fromWorkingColorSpace(Me.copy(this), e), t.r = Me.r, t.g = Me.g, t.b = Me.b, t;
  }
  getStyle(t = ze) {
    Xt.fromWorkingColorSpace(Me.copy(this), t);
    const e = Me.r, n = Me.g, s = Me.b;
    return t !== ze ? `color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})` : `rgb(${Math.round(e * 255)},${Math.round(n * 255)},${Math.round(s * 255)})`;
  }
  offsetHSL(t, e, n) {
    return this.getHSL(vn), this.setHSL(vn.h + t, vn.s + e, vn.l + n);
  }
  add(t) {
    return this.r += t.r, this.g += t.g, this.b += t.b, this;
  }
  addColors(t, e) {
    return this.r = t.r + e.r, this.g = t.g + e.g, this.b = t.b + e.b, this;
  }
  addScalar(t) {
    return this.r += t, this.g += t, this.b += t, this;
  }
  sub(t) {
    return this.r = Math.max(0, this.r - t.r), this.g = Math.max(0, this.g - t.g), this.b = Math.max(0, this.b - t.b), this;
  }
  multiply(t) {
    return this.r *= t.r, this.g *= t.g, this.b *= t.b, this;
  }
  multiplyScalar(t) {
    return this.r *= t, this.g *= t, this.b *= t, this;
  }
  lerp(t, e) {
    return this.r += (t.r - this.r) * e, this.g += (t.g - this.g) * e, this.b += (t.b - this.b) * e, this;
  }
  lerpColors(t, e, n) {
    return this.r = t.r + (e.r - t.r) * n, this.g = t.g + (e.g - t.g) * n, this.b = t.b + (e.b - t.b) * n, this;
  }
  lerpHSL(t, e) {
    this.getHSL(vn), t.getHSL(ns);
    const n = Zs(vn.h, ns.h, e), s = Zs(vn.s, ns.s, e), r = Zs(vn.l, ns.l, e);
    return this.setHSL(n, s, r), this;
  }
  setFromVector3(t) {
    return this.r = t.x, this.g = t.y, this.b = t.z, this;
  }
  applyMatrix3(t) {
    const e = this.r, n = this.g, s = this.b, r = t.elements;
    return this.r = r[0] * e + r[3] * n + r[6] * s, this.g = r[1] * e + r[4] * n + r[7] * s, this.b = r[2] * e + r[5] * n + r[8] * s, this;
  }
  equals(t) {
    return t.r === this.r && t.g === this.g && t.b === this.b;
  }
  fromArray(t, e = 0) {
    return this.r = t[e], this.g = t[e + 1], this.b = t[e + 2], this;
  }
  toArray(t = [], e = 0) {
    return t[e] = this.r, t[e + 1] = this.g, t[e + 2] = this.b, t;
  }
  fromBufferAttribute(t, e) {
    return this.r = t.getX(e), this.g = t.getY(e), this.b = t.getZ(e), this;
  }
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const Me = /* @__PURE__ */ new It();
It.NAMES = Al;
let rh = 0;
class wi extends Xn {
  constructor() {
    super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: rh++ }), this.uuid = Wi(), this.name = "", this.type = "Material", this.blending = _i, this.side = wn, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = Rr, this.blendDst = Cr, this.blendEquation = Bn, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new It(0, 0, 0), this.blendAlpha = 0, this.depthFunc = xi, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = Ya, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = jn, this.stencilZFail = jn, this.stencilZPass = jn, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
  }
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(t) {
    this._alphaTest > 0 != t > 0 && this.version++, this._alphaTest = t;
  }
  // onBeforeRender and onBeforeCompile only supported in WebGLRenderer
  onBeforeRender() {
  }
  onBeforeCompile() {
  }
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  setValues(t) {
    if (t !== void 0)
      for (const e in t) {
        const n = t[e];
        if (n === void 0) {
          console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);
          continue;
        }
        const s = this[e];
        if (s === void 0) {
          console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);
          continue;
        }
        s && s.isColor ? s.set(n) : s && s.isVector3 && n && n.isVector3 ? s.copy(n) : this[e] = n;
      }
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    e && (t = {
      textures: {},
      images: {}
    });
    const n = {
      metadata: {
        version: 4.6,
        type: "Material",
        generator: "Material.toJSON"
      }
    };
    n.uuid = this.uuid, n.type = this.type, this.name !== "" && (n.name = this.name), this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(t).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(t).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(t).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.dispersion !== void 0 && (n.dispersion = this.dispersion), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(t).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(t).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(t).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(t).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(t).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(t).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(t).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(t).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(t).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(t).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(t).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(t).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(t).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(t).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(t).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(t).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(t).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(t).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(t).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(t).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(t).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.shadowSide !== null && (n.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), this.blending !== _i && (n.blending = this.blending), this.side !== wn && (n.side = this.side), this.vertexColors === !0 && (n.vertexColors = !0), this.opacity < 1 && (n.opacity = this.opacity), this.transparent === !0 && (n.transparent = !0), this.blendSrc !== Rr && (n.blendSrc = this.blendSrc), this.blendDst !== Cr && (n.blendDst = this.blendDst), this.blendEquation !== Bn && (n.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha), this.depthFunc !== xi && (n.depthFunc = this.depthFunc), this.depthTest === !1 && (n.depthTest = this.depthTest), this.depthWrite === !1 && (n.depthWrite = this.depthWrite), this.colorWrite === !1 && (n.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== Ya && (n.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== jn && (n.stencilFail = this.stencilFail), this.stencilZFail !== jn && (n.stencilZFail = this.stencilZFail), this.stencilZPass !== jn && (n.stencilZPass = this.stencilZPass), this.stencilWrite === !0 && (n.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n.rotation = this.rotation), this.polygonOffset === !0 && (n.polygonOffset = !0), this.polygonOffsetFactor !== 0 && (n.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n.linewidth = this.linewidth), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.dithering === !0 && (n.dithering = !0), this.alphaTest > 0 && (n.alphaTest = this.alphaTest), this.alphaHash === !0 && (n.alphaHash = !0), this.alphaToCoverage === !0 && (n.alphaToCoverage = !0), this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0), this.forceSinglePass === !0 && (n.forceSinglePass = !0), this.wireframe === !0 && (n.wireframe = !0), this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === !0 && (n.flatShading = !0), this.visible === !1 && (n.visible = !1), this.toneMapped === !1 && (n.toneMapped = !1), this.fog === !1 && (n.fog = !1), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
    function s(r) {
      const a = [];
      for (const o in r) {
        const l = r[o];
        delete l.metadata, a.push(l);
      }
      return a;
    }
    if (e) {
      const r = s(t.textures), a = s(t.images);
      r.length > 0 && (n.textures = r), a.length > 0 && (n.images = a);
    }
    return n;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.name = t.name, this.blending = t.blending, this.side = t.side, this.vertexColors = t.vertexColors, this.opacity = t.opacity, this.transparent = t.transparent, this.blendSrc = t.blendSrc, this.blendDst = t.blendDst, this.blendEquation = t.blendEquation, this.blendSrcAlpha = t.blendSrcAlpha, this.blendDstAlpha = t.blendDstAlpha, this.blendEquationAlpha = t.blendEquationAlpha, this.blendColor.copy(t.blendColor), this.blendAlpha = t.blendAlpha, this.depthFunc = t.depthFunc, this.depthTest = t.depthTest, this.depthWrite = t.depthWrite, this.stencilWriteMask = t.stencilWriteMask, this.stencilFunc = t.stencilFunc, this.stencilRef = t.stencilRef, this.stencilFuncMask = t.stencilFuncMask, this.stencilFail = t.stencilFail, this.stencilZFail = t.stencilZFail, this.stencilZPass = t.stencilZPass, this.stencilWrite = t.stencilWrite;
    const e = t.clippingPlanes;
    let n = null;
    if (e !== null) {
      const s = e.length;
      n = new Array(s);
      for (let r = 0; r !== s; ++r)
        n[r] = e[r].clone();
    }
    return this.clippingPlanes = n, this.clipIntersection = t.clipIntersection, this.clipShadows = t.clipShadows, this.shadowSide = t.shadowSide, this.colorWrite = t.colorWrite, this.precision = t.precision, this.polygonOffset = t.polygonOffset, this.polygonOffsetFactor = t.polygonOffsetFactor, this.polygonOffsetUnits = t.polygonOffsetUnits, this.dithering = t.dithering, this.alphaTest = t.alphaTest, this.alphaHash = t.alphaHash, this.alphaToCoverage = t.alphaToCoverage, this.premultipliedAlpha = t.premultipliedAlpha, this.forceSinglePass = t.forceSinglePass, this.visible = t.visible, this.toneMapped = t.toneMapped, this.userData = JSON.parse(JSON.stringify(t.userData)), this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  onBuild() {
    console.warn("Material: onBuild() has been removed.");
  }
}
class Ca extends wi {
  constructor(t) {
    super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new It(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new Qe(), this.combine = hl, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.specularMap = t.specularMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.combine = t.combine, this.reflectivity = t.reflectivity, this.refractionRatio = t.refractionRatio, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.fog = t.fog, this;
  }
}
const le = /* @__PURE__ */ new D(), is = /* @__PURE__ */ new Ct();
class ge {
  constructor(t, e, n = !1) {
    if (Array.isArray(t))
      throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = !0, this.name = "", this.array = t, this.itemSize = e, this.count = t !== void 0 ? t.length / e : 0, this.normalized = n, this.usage = Rs, this.updateRanges = [], this.gpuType = $e, this.version = 0;
  }
  onUploadCallback() {
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  setUsage(t) {
    return this.usage = t, this;
  }
  addUpdateRange(t, e) {
    this.updateRanges.push({ start: t, count: e });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(t) {
    return this.name = t.name, this.array = new t.array.constructor(t.array), this.itemSize = t.itemSize, this.count = t.count, this.normalized = t.normalized, this.usage = t.usage, this.gpuType = t.gpuType, this;
  }
  copyAt(t, e, n) {
    t *= this.itemSize, n *= e.itemSize;
    for (let s = 0, r = this.itemSize; s < r; s++)
      this.array[t + s] = e.array[n + s];
    return this;
  }
  copyArray(t) {
    return this.array.set(t), this;
  }
  applyMatrix3(t) {
    if (this.itemSize === 2)
      for (let e = 0, n = this.count; e < n; e++)
        is.fromBufferAttribute(this, e), is.applyMatrix3(t), this.setXY(e, is.x, is.y);
    else if (this.itemSize === 3)
      for (let e = 0, n = this.count; e < n; e++)
        le.fromBufferAttribute(this, e), le.applyMatrix3(t), this.setXYZ(e, le.x, le.y, le.z);
    return this;
  }
  applyMatrix4(t) {
    for (let e = 0, n = this.count; e < n; e++)
      le.fromBufferAttribute(this, e), le.applyMatrix4(t), this.setXYZ(e, le.x, le.y, le.z);
    return this;
  }
  applyNormalMatrix(t) {
    for (let e = 0, n = this.count; e < n; e++)
      le.fromBufferAttribute(this, e), le.applyNormalMatrix(t), this.setXYZ(e, le.x, le.y, le.z);
    return this;
  }
  transformDirection(t) {
    for (let e = 0, n = this.count; e < n; e++)
      le.fromBufferAttribute(this, e), le.transformDirection(t), this.setXYZ(e, le.x, le.y, le.z);
    return this;
  }
  set(t, e = 0) {
    return this.array.set(t, e), this;
  }
  getComponent(t, e) {
    let n = this.array[t * this.itemSize + e];
    return this.normalized && (n = Pi(n, this.array)), n;
  }
  setComponent(t, e, n) {
    return this.normalized && (n = we(n, this.array)), this.array[t * this.itemSize + e] = n, this;
  }
  getX(t) {
    let e = this.array[t * this.itemSize];
    return this.normalized && (e = Pi(e, this.array)), e;
  }
  setX(t, e) {
    return this.normalized && (e = we(e, this.array)), this.array[t * this.itemSize] = e, this;
  }
  getY(t) {
    let e = this.array[t * this.itemSize + 1];
    return this.normalized && (e = Pi(e, this.array)), e;
  }
  setY(t, e) {
    return this.normalized && (e = we(e, this.array)), this.array[t * this.itemSize + 1] = e, this;
  }
  getZ(t) {
    let e = this.array[t * this.itemSize + 2];
    return this.normalized && (e = Pi(e, this.array)), e;
  }
  setZ(t, e) {
    return this.normalized && (e = we(e, this.array)), this.array[t * this.itemSize + 2] = e, this;
  }
  getW(t) {
    let e = this.array[t * this.itemSize + 3];
    return this.normalized && (e = Pi(e, this.array)), e;
  }
  setW(t, e) {
    return this.normalized && (e = we(e, this.array)), this.array[t * this.itemSize + 3] = e, this;
  }
  setXY(t, e, n) {
    return t *= this.itemSize, this.normalized && (e = we(e, this.array), n = we(n, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this;
  }
  setXYZ(t, e, n, s) {
    return t *= this.itemSize, this.normalized && (e = we(e, this.array), n = we(n, this.array), s = we(s, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = s, this;
  }
  setXYZW(t, e, n, s, r) {
    return t *= this.itemSize, this.normalized && (e = we(e, this.array), n = we(n, this.array), s = we(s, this.array), r = we(r, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = s, this.array[t + 3] = r, this;
  }
  onUpload(t) {
    return this.onUploadCallback = t, this;
  }
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  toJSON() {
    const t = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized
    };
    return this.name !== "" && (t.name = this.name), this.usage !== Rs && (t.usage = this.usage), t;
  }
}
class wl extends ge {
  constructor(t, e, n) {
    super(new Uint16Array(t), e, n);
  }
}
class Rl extends ge {
  constructor(t, e, n) {
    super(new Uint32Array(t), e, n);
  }
}
class be extends ge {
  constructor(t, e, n) {
    super(new Float32Array(t), e, n);
  }
}
let ah = 0;
const Be = /* @__PURE__ */ new Yt(), fr = /* @__PURE__ */ new me(), si = /* @__PURE__ */ new D(), Le = /* @__PURE__ */ new Yn(), Ii = /* @__PURE__ */ new Yn(), de = /* @__PURE__ */ new D();
class Ie extends Xn {
  constructor() {
    super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: ah++ }), this.uuid = Wi(), this.name = "", this.type = "BufferGeometry", this.index = null, this.indirect = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
  }
  getIndex() {
    return this.index;
  }
  setIndex(t) {
    return Array.isArray(t) ? this.index = new (El(t) ? Rl : wl)(t, 1) : this.index = t, this;
  }
  setIndirect(t) {
    return this.indirect = t, this;
  }
  getIndirect() {
    return this.indirect;
  }
  getAttribute(t) {
    return this.attributes[t];
  }
  setAttribute(t, e) {
    return this.attributes[t] = e, this;
  }
  deleteAttribute(t) {
    return delete this.attributes[t], this;
  }
  hasAttribute(t) {
    return this.attributes[t] !== void 0;
  }
  addGroup(t, e, n = 0) {
    this.groups.push({
      start: t,
      count: e,
      materialIndex: n
    });
  }
  clearGroups() {
    this.groups = [];
  }
  setDrawRange(t, e) {
    this.drawRange.start = t, this.drawRange.count = e;
  }
  applyMatrix4(t) {
    const e = this.attributes.position;
    e !== void 0 && (e.applyMatrix4(t), e.needsUpdate = !0);
    const n = this.attributes.normal;
    if (n !== void 0) {
      const r = new Dt().getNormalMatrix(t);
      n.applyNormalMatrix(r), n.needsUpdate = !0;
    }
    const s = this.attributes.tangent;
    return s !== void 0 && (s.transformDirection(t), s.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }
  applyQuaternion(t) {
    return Be.makeRotationFromQuaternion(t), this.applyMatrix4(Be), this;
  }
  rotateX(t) {
    return Be.makeRotationX(t), this.applyMatrix4(Be), this;
  }
  rotateY(t) {
    return Be.makeRotationY(t), this.applyMatrix4(Be), this;
  }
  rotateZ(t) {
    return Be.makeRotationZ(t), this.applyMatrix4(Be), this;
  }
  translate(t, e, n) {
    return Be.makeTranslation(t, e, n), this.applyMatrix4(Be), this;
  }
  scale(t, e, n) {
    return Be.makeScale(t, e, n), this.applyMatrix4(Be), this;
  }
  lookAt(t) {
    return fr.lookAt(t), fr.updateMatrix(), this.applyMatrix4(fr.matrix), this;
  }
  center() {
    return this.computeBoundingBox(), this.boundingBox.getCenter(si).negate(), this.translate(si.x, si.y, si.z), this;
  }
  setFromPoints(t) {
    const e = this.getAttribute("position");
    if (e === void 0) {
      const n = [];
      for (let s = 0, r = t.length; s < r; s++) {
        const a = t[s];
        n.push(a.x, a.y, a.z || 0);
      }
      this.setAttribute("position", new be(n, 3));
    } else {
      const n = Math.min(t.length, e.count);
      for (let s = 0; s < n; s++) {
        const r = t[s];
        e.setXYZ(s, r.x, r.y, r.z || 0);
      }
      t.length > e.count && console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."), e.needsUpdate = !0;
    }
    return this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new Yn());
    const t = this.attributes.position, e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(
        new D(-1 / 0, -1 / 0, -1 / 0),
        new D(1 / 0, 1 / 0, 1 / 0)
      );
      return;
    }
    if (t !== void 0) {
      if (this.boundingBox.setFromBufferAttribute(t), e)
        for (let n = 0, s = e.length; n < s; n++) {
          const r = e[n];
          Le.setFromBufferAttribute(r), this.morphTargetsRelative ? (de.addVectors(this.boundingBox.min, Le.min), this.boundingBox.expandByPoint(de), de.addVectors(this.boundingBox.max, Le.max), this.boundingBox.expandByPoint(de)) : (this.boundingBox.expandByPoint(Le.min), this.boundingBox.expandByPoint(Le.max));
        }
    } else
      this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new Ai());
    const t = this.attributes.position, e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new D(), 1 / 0);
      return;
    }
    if (t) {
      const n = this.boundingSphere.center;
      if (Le.setFromBufferAttribute(t), e)
        for (let r = 0, a = e.length; r < a; r++) {
          const o = e[r];
          Ii.setFromBufferAttribute(o), this.morphTargetsRelative ? (de.addVectors(Le.min, Ii.min), Le.expandByPoint(de), de.addVectors(Le.max, Ii.max), Le.expandByPoint(de)) : (Le.expandByPoint(Ii.min), Le.expandByPoint(Ii.max));
        }
      Le.getCenter(n);
      let s = 0;
      for (let r = 0, a = t.count; r < a; r++)
        de.fromBufferAttribute(t, r), s = Math.max(s, n.distanceToSquared(de));
      if (e)
        for (let r = 0, a = e.length; r < a; r++) {
          const o = e[r], l = this.morphTargetsRelative;
          for (let c = 0, h = o.count; c < h; c++)
            de.fromBufferAttribute(o, c), l && (si.fromBufferAttribute(t, c), de.add(si)), s = Math.max(s, n.distanceToSquared(de));
        }
      this.boundingSphere.radius = Math.sqrt(s), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
    }
  }
  computeTangents() {
    const t = this.index, e = this.attributes;
    if (t === null || e.position === void 0 || e.normal === void 0 || e.uv === void 0) {
      console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      return;
    }
    const n = e.position, s = e.normal, r = e.uv;
    this.hasAttribute("tangent") === !1 && this.setAttribute("tangent", new ge(new Float32Array(4 * n.count), 4));
    const a = this.getAttribute("tangent"), o = [], l = [];
    for (let I = 0; I < n.count; I++)
      o[I] = new D(), l[I] = new D();
    const c = new D(), h = new D(), d = new D(), f = new Ct(), m = new Ct(), _ = new Ct(), x = new D(), p = new D();
    function u(I, S, M) {
      c.fromBufferAttribute(n, I), h.fromBufferAttribute(n, S), d.fromBufferAttribute(n, M), f.fromBufferAttribute(r, I), m.fromBufferAttribute(r, S), _.fromBufferAttribute(r, M), h.sub(c), d.sub(c), m.sub(f), _.sub(f);
      const C = 1 / (m.x * _.y - _.x * m.y);
      isFinite(C) && (x.copy(h).multiplyScalar(_.y).addScaledVector(d, -m.y).multiplyScalar(C), p.copy(d).multiplyScalar(m.x).addScaledVector(h, -_.x).multiplyScalar(C), o[I].add(x), o[S].add(x), o[M].add(x), l[I].add(p), l[S].add(p), l[M].add(p));
    }
    let b = this.groups;
    b.length === 0 && (b = [{
      start: 0,
      count: t.count
    }]);
    for (let I = 0, S = b.length; I < S; ++I) {
      const M = b[I], C = M.start, H = M.count;
      for (let B = C, k = C + H; B < k; B += 3)
        u(
          t.getX(B + 0),
          t.getX(B + 1),
          t.getX(B + 2)
        );
    }
    const T = new D(), y = new D(), P = new D(), A = new D();
    function R(I) {
      P.fromBufferAttribute(s, I), A.copy(P);
      const S = o[I];
      T.copy(S), T.sub(P.multiplyScalar(P.dot(S))).normalize(), y.crossVectors(A, S);
      const C = y.dot(l[I]) < 0 ? -1 : 1;
      a.setXYZW(I, T.x, T.y, T.z, C);
    }
    for (let I = 0, S = b.length; I < S; ++I) {
      const M = b[I], C = M.start, H = M.count;
      for (let B = C, k = C + H; B < k; B += 3)
        R(t.getX(B + 0)), R(t.getX(B + 1)), R(t.getX(B + 2));
    }
  }
  computeVertexNormals() {
    const t = this.index, e = this.getAttribute("position");
    if (e !== void 0) {
      let n = this.getAttribute("normal");
      if (n === void 0)
        n = new ge(new Float32Array(e.count * 3), 3), this.setAttribute("normal", n);
      else
        for (let f = 0, m = n.count; f < m; f++)
          n.setXYZ(f, 0, 0, 0);
      const s = new D(), r = new D(), a = new D(), o = new D(), l = new D(), c = new D(), h = new D(), d = new D();
      if (t)
        for (let f = 0, m = t.count; f < m; f += 3) {
          const _ = t.getX(f + 0), x = t.getX(f + 1), p = t.getX(f + 2);
          s.fromBufferAttribute(e, _), r.fromBufferAttribute(e, x), a.fromBufferAttribute(e, p), h.subVectors(a, r), d.subVectors(s, r), h.cross(d), o.fromBufferAttribute(n, _), l.fromBufferAttribute(n, x), c.fromBufferAttribute(n, p), o.add(h), l.add(h), c.add(h), n.setXYZ(_, o.x, o.y, o.z), n.setXYZ(x, l.x, l.y, l.z), n.setXYZ(p, c.x, c.y, c.z);
        }
      else
        for (let f = 0, m = e.count; f < m; f += 3)
          s.fromBufferAttribute(e, f + 0), r.fromBufferAttribute(e, f + 1), a.fromBufferAttribute(e, f + 2), h.subVectors(a, r), d.subVectors(s, r), h.cross(d), n.setXYZ(f + 0, h.x, h.y, h.z), n.setXYZ(f + 1, h.x, h.y, h.z), n.setXYZ(f + 2, h.x, h.y, h.z);
      this.normalizeNormals(), n.needsUpdate = !0;
    }
  }
  normalizeNormals() {
    const t = this.attributes.normal;
    for (let e = 0, n = t.count; e < n; e++)
      de.fromBufferAttribute(t, e), de.normalize(), t.setXYZ(e, de.x, de.y, de.z);
  }
  toNonIndexed() {
    function t(o, l) {
      const c = o.array, h = o.itemSize, d = o.normalized, f = new c.constructor(l.length * h);
      let m = 0, _ = 0;
      for (let x = 0, p = l.length; x < p; x++) {
        o.isInterleavedBufferAttribute ? m = l[x] * o.data.stride + o.offset : m = l[x] * h;
        for (let u = 0; u < h; u++)
          f[_++] = c[m++];
      }
      return new ge(f, h, d);
    }
    if (this.index === null)
      return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
    const e = new Ie(), n = this.index.array, s = this.attributes;
    for (const o in s) {
      const l = s[o], c = t(l, n);
      e.setAttribute(o, c);
    }
    const r = this.morphAttributes;
    for (const o in r) {
      const l = [], c = r[o];
      for (let h = 0, d = c.length; h < d; h++) {
        const f = c[h], m = t(f, n);
        l.push(m);
      }
      e.morphAttributes[o] = l;
    }
    e.morphTargetsRelative = this.morphTargetsRelative;
    const a = this.groups;
    for (let o = 0, l = a.length; o < l; o++) {
      const c = a[o];
      e.addGroup(c.start, c.count, c.materialIndex);
    }
    return e;
  }
  toJSON() {
    const t = {
      metadata: {
        version: 4.6,
        type: "BufferGeometry",
        generator: "BufferGeometry.toJSON"
      }
    };
    if (t.uuid = this.uuid, t.type = this.type, this.name !== "" && (t.name = this.name), Object.keys(this.userData).length > 0 && (t.userData = this.userData), this.parameters !== void 0) {
      const l = this.parameters;
      for (const c in l)
        l[c] !== void 0 && (t[c] = l[c]);
      return t;
    }
    t.data = { attributes: {} };
    const e = this.index;
    e !== null && (t.data.index = {
      type: e.array.constructor.name,
      array: Array.prototype.slice.call(e.array)
    });
    const n = this.attributes;
    for (const l in n) {
      const c = n[l];
      t.data.attributes[l] = c.toJSON(t.data);
    }
    const s = {};
    let r = !1;
    for (const l in this.morphAttributes) {
      const c = this.morphAttributes[l], h = [];
      for (let d = 0, f = c.length; d < f; d++) {
        const m = c[d];
        h.push(m.toJSON(t.data));
      }
      h.length > 0 && (s[l] = h, r = !0);
    }
    r && (t.data.morphAttributes = s, t.data.morphTargetsRelative = this.morphTargetsRelative);
    const a = this.groups;
    a.length > 0 && (t.data.groups = JSON.parse(JSON.stringify(a)));
    const o = this.boundingSphere;
    return o !== null && (t.data.boundingSphere = {
      center: o.center.toArray(),
      radius: o.radius
    }), t;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
    const e = {};
    this.name = t.name;
    const n = t.index;
    n !== null && this.setIndex(n.clone(e));
    const s = t.attributes;
    for (const c in s) {
      const h = s[c];
      this.setAttribute(c, h.clone(e));
    }
    const r = t.morphAttributes;
    for (const c in r) {
      const h = [], d = r[c];
      for (let f = 0, m = d.length; f < m; f++)
        h.push(d[f].clone(e));
      this.morphAttributes[c] = h;
    }
    this.morphTargetsRelative = t.morphTargetsRelative;
    const a = t.groups;
    for (let c = 0, h = a.length; c < h; c++) {
      const d = a[c];
      this.addGroup(d.start, d.count, d.materialIndex);
    }
    const o = t.boundingBox;
    o !== null && (this.boundingBox = o.clone());
    const l = t.boundingSphere;
    return l !== null && (this.boundingSphere = l.clone()), this.drawRange.start = t.drawRange.start, this.drawRange.count = t.drawRange.count, this.userData = t.userData, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
const ao = /* @__PURE__ */ new Yt(), Ln = /* @__PURE__ */ new Gs(), ss = /* @__PURE__ */ new Ai(), oo = /* @__PURE__ */ new D(), rs = /* @__PURE__ */ new D(), as = /* @__PURE__ */ new D(), os = /* @__PURE__ */ new D(), pr = /* @__PURE__ */ new D(), ls = /* @__PURE__ */ new D(), lo = /* @__PURE__ */ new D(), cs = /* @__PURE__ */ new D();
class Ee extends me {
  constructor(t = new Ie(), e = new Ca()) {
    super(), this.isMesh = !0, this.type = "Mesh", this.geometry = t, this.material = e, this.updateMorphTargets();
  }
  copy(t, e) {
    return super.copy(t, e), t.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = t.morphTargetInfluences.slice()), t.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, t.morphTargetDictionary)), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, n = Object.keys(e);
    if (n.length > 0) {
      const s = e[n[0]];
      if (s !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, a = s.length; r < a; r++) {
          const o = s[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = r;
        }
      }
    }
  }
  getVertexPosition(t, e) {
    const n = this.geometry, s = n.attributes.position, r = n.morphAttributes.position, a = n.morphTargetsRelative;
    e.fromBufferAttribute(s, t);
    const o = this.morphTargetInfluences;
    if (r && o) {
      ls.set(0, 0, 0);
      for (let l = 0, c = r.length; l < c; l++) {
        const h = o[l], d = r[l];
        h !== 0 && (pr.fromBufferAttribute(d, t), a ? ls.addScaledVector(pr, h) : ls.addScaledVector(pr.sub(e), h));
      }
      e.add(ls);
    }
    return e;
  }
  raycast(t, e) {
    const n = this.geometry, s = this.material, r = this.matrixWorld;
    s !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), ss.copy(n.boundingSphere), ss.applyMatrix4(r), Ln.copy(t.ray).recast(t.near), !(ss.containsPoint(Ln.origin) === !1 && (Ln.intersectSphere(ss, oo) === null || Ln.origin.distanceToSquared(oo) > (t.far - t.near) ** 2)) && (ao.copy(r).invert(), Ln.copy(t.ray).applyMatrix4(ao), !(n.boundingBox !== null && Ln.intersectsBox(n.boundingBox) === !1) && this._computeIntersections(t, e, Ln)));
  }
  _computeIntersections(t, e, n) {
    let s;
    const r = this.geometry, a = this.material, o = r.index, l = r.attributes.position, c = r.attributes.uv, h = r.attributes.uv1, d = r.attributes.normal, f = r.groups, m = r.drawRange;
    if (o !== null)
      if (Array.isArray(a))
        for (let _ = 0, x = f.length; _ < x; _++) {
          const p = f[_], u = a[p.materialIndex], b = Math.max(p.start, m.start), T = Math.min(o.count, Math.min(p.start + p.count, m.start + m.count));
          for (let y = b, P = T; y < P; y += 3) {
            const A = o.getX(y), R = o.getX(y + 1), I = o.getX(y + 2);
            s = hs(this, u, t, n, c, h, d, A, R, I), s && (s.faceIndex = Math.floor(y / 3), s.face.materialIndex = p.materialIndex, e.push(s));
          }
        }
      else {
        const _ = Math.max(0, m.start), x = Math.min(o.count, m.start + m.count);
        for (let p = _, u = x; p < u; p += 3) {
          const b = o.getX(p), T = o.getX(p + 1), y = o.getX(p + 2);
          s = hs(this, a, t, n, c, h, d, b, T, y), s && (s.faceIndex = Math.floor(p / 3), e.push(s));
        }
      }
    else if (l !== void 0)
      if (Array.isArray(a))
        for (let _ = 0, x = f.length; _ < x; _++) {
          const p = f[_], u = a[p.materialIndex], b = Math.max(p.start, m.start), T = Math.min(l.count, Math.min(p.start + p.count, m.start + m.count));
          for (let y = b, P = T; y < P; y += 3) {
            const A = y, R = y + 1, I = y + 2;
            s = hs(this, u, t, n, c, h, d, A, R, I), s && (s.faceIndex = Math.floor(y / 3), s.face.materialIndex = p.materialIndex, e.push(s));
          }
        }
      else {
        const _ = Math.max(0, m.start), x = Math.min(l.count, m.start + m.count);
        for (let p = _, u = x; p < u; p += 3) {
          const b = p, T = p + 1, y = p + 2;
          s = hs(this, a, t, n, c, h, d, b, T, y), s && (s.faceIndex = Math.floor(p / 3), e.push(s));
        }
      }
  }
}
function oh(i, t, e, n, s, r, a, o) {
  let l;
  if (t.side === Ce ? l = n.intersectTriangle(a, r, s, !0, o) : l = n.intersectTriangle(s, r, a, t.side === wn, o), l === null) return null;
  cs.copy(o), cs.applyMatrix4(i.matrixWorld);
  const c = e.ray.origin.distanceTo(cs);
  return c < e.near || c > e.far ? null : {
    distance: c,
    point: cs.clone(),
    object: i
  };
}
function hs(i, t, e, n, s, r, a, o, l, c) {
  i.getVertexPosition(o, rs), i.getVertexPosition(l, as), i.getVertexPosition(c, os);
  const h = oh(i, t, e, n, rs, as, os, lo);
  if (h) {
    const d = new D();
    Ye.getBarycoord(lo, rs, as, os, d), s && (h.uv = Ye.getInterpolatedAttribute(s, o, l, c, d, new Ct())), r && (h.uv1 = Ye.getInterpolatedAttribute(r, o, l, c, d, new Ct())), a && (h.normal = Ye.getInterpolatedAttribute(a, o, l, c, d, new D()), h.normal.dot(n.direction) > 0 && h.normal.multiplyScalar(-1));
    const f = {
      a: o,
      b: l,
      c,
      normal: new D(),
      materialIndex: 0
    };
    Ye.getNormal(rs, as, os, f.normal), h.face = f, h.barycoord = d;
  }
  return h;
}
class Xi extends Ie {
  constructor(t = 1, e = 1, n = 1, s = 1, r = 1, a = 1) {
    super(), this.type = "BoxGeometry", this.parameters = {
      width: t,
      height: e,
      depth: n,
      widthSegments: s,
      heightSegments: r,
      depthSegments: a
    };
    const o = this;
    s = Math.floor(s), r = Math.floor(r), a = Math.floor(a);
    const l = [], c = [], h = [], d = [];
    let f = 0, m = 0;
    _("z", "y", "x", -1, -1, n, e, t, a, r, 0), _("z", "y", "x", 1, -1, n, e, -t, a, r, 1), _("x", "z", "y", 1, 1, t, n, e, s, a, 2), _("x", "z", "y", 1, -1, t, n, -e, s, a, 3), _("x", "y", "z", 1, -1, t, e, n, s, r, 4), _("x", "y", "z", -1, -1, t, e, -n, s, r, 5), this.setIndex(l), this.setAttribute("position", new be(c, 3)), this.setAttribute("normal", new be(h, 3)), this.setAttribute("uv", new be(d, 2));
    function _(x, p, u, b, T, y, P, A, R, I, S) {
      const M = y / R, C = P / I, H = y / 2, B = P / 2, k = A / 2, Z = R + 1, W = I + 1;
      let Q = 0, G = 0;
      const st = new D();
      for (let ut = 0; ut < W; ut++) {
        const xt = ut * C - B;
        for (let Ft = 0; Ft < Z; Ft++) {
          const Jt = Ft * M - H;
          st[x] = Jt * b, st[p] = xt * T, st[u] = k, c.push(st.x, st.y, st.z), st[x] = 0, st[p] = 0, st[u] = A > 0 ? 1 : -1, h.push(st.x, st.y, st.z), d.push(Ft / R), d.push(1 - ut / I), Q += 1;
        }
      }
      for (let ut = 0; ut < I; ut++)
        for (let xt = 0; xt < R; xt++) {
          const Ft = f + xt + Z * ut, Jt = f + xt + Z * (ut + 1), Y = f + (xt + 1) + Z * (ut + 1), tt = f + (xt + 1) + Z * ut;
          l.push(Ft, Jt, tt), l.push(Jt, Y, tt), G += 6;
        }
      o.addGroup(m, G, S), m += G, f += Q;
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new Xi(t.width, t.height, t.depth, t.widthSegments, t.heightSegments, t.depthSegments);
  }
}
function bi(i) {
  const t = {};
  for (const e in i) {
    t[e] = {};
    for (const n in i[e]) {
      const s = i[e][n];
      s && (s.isColor || s.isMatrix3 || s.isMatrix4 || s.isVector2 || s.isVector3 || s.isVector4 || s.isTexture || s.isQuaternion) ? s.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), t[e][n] = null) : t[e][n] = s.clone() : Array.isArray(s) ? t[e][n] = s.slice() : t[e][n] = s;
    }
  }
  return t;
}
function ye(i) {
  const t = {};
  for (let e = 0; e < i.length; e++) {
    const n = bi(i[e]);
    for (const s in n)
      t[s] = n[s];
  }
  return t;
}
function lh(i) {
  const t = [];
  for (let e = 0; e < i.length; e++)
    t.push(i[e].clone());
  return t;
}
function Cl(i) {
  const t = i.getRenderTarget();
  return t === null ? i.outputColorSpace : t.isXRRenderTarget === !0 ? t.texture.colorSpace : Xt.workingColorSpace;
}
const ch = { clone: bi, merge: ye };
var hh = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, uh = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class fn extends wi {
  constructor(t) {
    super(), this.isShaderMaterial = !0, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = hh, this.fragmentShader = uh, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
      clipCullDistance: !1,
      // set to use vertex shader clipping
      multiDraw: !1
      // set to use vertex shader multi_draw / enable gl_DrawID
    }, this.defaultAttributeValues = {
      color: [1, 1, 1],
      uv: [0, 0],
      uv1: [0, 0]
    }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = !1, this.glslVersion = null, t !== void 0 && this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.fragmentShader = t.fragmentShader, this.vertexShader = t.vertexShader, this.uniforms = bi(t.uniforms), this.uniformsGroups = lh(t.uniformsGroups), this.defines = Object.assign({}, t.defines), this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.fog = t.fog, this.lights = t.lights, this.clipping = t.clipping, this.extensions = Object.assign({}, t.extensions), this.glslVersion = t.glslVersion, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    e.glslVersion = this.glslVersion, e.uniforms = {};
    for (const s in this.uniforms) {
      const a = this.uniforms[s].value;
      a && a.isTexture ? e.uniforms[s] = {
        type: "t",
        value: a.toJSON(t).uuid
      } : a && a.isColor ? e.uniforms[s] = {
        type: "c",
        value: a.getHex()
      } : a && a.isVector2 ? e.uniforms[s] = {
        type: "v2",
        value: a.toArray()
      } : a && a.isVector3 ? e.uniforms[s] = {
        type: "v3",
        value: a.toArray()
      } : a && a.isVector4 ? e.uniforms[s] = {
        type: "v4",
        value: a.toArray()
      } : a && a.isMatrix3 ? e.uniforms[s] = {
        type: "m3",
        value: a.toArray()
      } : a && a.isMatrix4 ? e.uniforms[s] = {
        type: "m4",
        value: a.toArray()
      } : e.uniforms[s] = {
        value: a
      };
    }
    Object.keys(this.defines).length > 0 && (e.defines = this.defines), e.vertexShader = this.vertexShader, e.fragmentShader = this.fragmentShader, e.lights = this.lights, e.clipping = this.clipping;
    const n = {};
    for (const s in this.extensions)
      this.extensions[s] === !0 && (n[s] = !0);
    return Object.keys(n).length > 0 && (e.extensions = n), e;
  }
}
class Pl extends me {
  constructor() {
    super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new Yt(), this.projectionMatrix = new Yt(), this.projectionMatrixInverse = new Yt(), this.coordinateSystem = hn;
  }
  copy(t, e) {
    return super.copy(t, e), this.matrixWorldInverse.copy(t.matrixWorldInverse), this.projectionMatrix.copy(t.projectionMatrix), this.projectionMatrixInverse.copy(t.projectionMatrixInverse), this.coordinateSystem = t.coordinateSystem, this;
  }
  getWorldDirection(t) {
    return super.getWorldDirection(t).negate();
  }
  updateMatrixWorld(t) {
    super.updateMatrixWorld(t), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  updateWorldMatrix(t, e) {
    super.updateWorldMatrix(t, e), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const xn = /* @__PURE__ */ new D(), co = /* @__PURE__ */ new Ct(), ho = /* @__PURE__ */ new Ct();
class He extends Pl {
  constructor(t = 50, e = 1, n = 0.1, s = 2e3) {
    super(), this.isPerspectiveCamera = !0, this.type = "PerspectiveCamera", this.fov = t, this.zoom = 1, this.near = n, this.far = s, this.focus = 10, this.aspect = e, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
  }
  copy(t, e) {
    return super.copy(t, e), this.fov = t.fov, this.zoom = t.zoom, this.near = t.near, this.far = t.far, this.focus = t.focus, this.aspect = t.aspect, this.view = t.view === null ? null : Object.assign({}, t.view), this.filmGauge = t.filmGauge, this.filmOffset = t.filmOffset, this;
  }
  /**
   * Sets the FOV by focal length in respect to the current .filmGauge.
   *
   * The default film gauge is 35, so that the focal length can be specified for
   * a 35mm (full frame) camera.
   *
   * @param {number} focalLength - Values for focal length and film gauge must have the same unit.
   */
  setFocalLength(t) {
    const e = 0.5 * this.getFilmHeight() / t;
    this.fov = fa * 2 * Math.atan(e), this.updateProjectionMatrix();
  }
  /**
   * Calculates the focal length from the current .fov and .filmGauge.
   *
   * @returns {number}
   */
  getFocalLength() {
    const t = Math.tan(bs * 0.5 * this.fov);
    return 0.5 * this.getFilmHeight() / t;
  }
  getEffectiveFOV() {
    return fa * 2 * Math.atan(
      Math.tan(bs * 0.5 * this.fov) / this.zoom
    );
  }
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  /**
   * Computes the 2D bounds of the camera's viewable rectangle at a given distance along the viewing direction.
   * Sets minTarget and maxTarget to the coordinates of the lower-left and upper-right corners of the view rectangle.
   *
   * @param {number} distance
   * @param {Vector2} minTarget
   * @param {Vector2} maxTarget
   */
  getViewBounds(t, e, n) {
    xn.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), e.set(xn.x, xn.y).multiplyScalar(-t / xn.z), xn.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), n.set(xn.x, xn.y).multiplyScalar(-t / xn.z);
  }
  /**
   * Computes the width and height of the camera's viewable rectangle at a given distance along the viewing direction.
   *
   * @param {number} distance
   * @param {Vector2} target - Vector2 target used to store result where x is width and y is height.
   * @returns {Vector2}
   */
  getViewSize(t, e) {
    return this.getViewBounds(t, co, ho), e.subVectors(ho, co);
  }
  /**
   * Sets an offset in a larger frustum. This is useful for multi-window or
   * multi-monitor/multi-machine setups.
   *
   * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
   * the monitors are in grid like this
   *
   *   +---+---+---+
   *   | A | B | C |
   *   +---+---+---+
   *   | D | E | F |
   *   +---+---+---+
   *
   * then for each monitor you would call it like this
   *
   *   const w = 1920;
   *   const h = 1080;
   *   const fullWidth = w * 3;
   *   const fullHeight = h * 2;
   *
   *   --A--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
   *   --B--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
   *   --C--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
   *   --D--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
   *   --E--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
   *   --F--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
   *
   *   Note there is no reason monitors have to be the same size or in a grid.
   *
   * @param {number} fullWidth
   * @param {number} fullHeight
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  setViewOffset(t, e, n, s, r, a) {
    this.aspect = t / e, this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = t, this.view.fullHeight = e, this.view.offsetX = n, this.view.offsetY = s, this.view.width = r, this.view.height = a, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const t = this.near;
    let e = t * Math.tan(bs * 0.5 * this.fov) / this.zoom, n = 2 * e, s = this.aspect * n, r = -0.5 * s;
    const a = this.view;
    if (this.view !== null && this.view.enabled) {
      const l = a.fullWidth, c = a.fullHeight;
      r += a.offsetX * s / l, e -= a.offsetY * n / c, s *= a.width / l, n *= a.height / c;
    }
    const o = this.filmOffset;
    o !== 0 && (r += t * o / this.getFilmWidth()), this.projectionMatrix.makePerspective(r, r + s, e, e - n, t, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.fov = this.fov, e.object.zoom = this.zoom, e.object.near = this.near, e.object.far = this.far, e.object.focus = this.focus, e.object.aspect = this.aspect, this.view !== null && (e.object.view = Object.assign({}, this.view)), e.object.filmGauge = this.filmGauge, e.object.filmOffset = this.filmOffset, e;
  }
}
const ri = -90, ai = 1;
class dh extends me {
  constructor(t, e, n) {
    super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
    const s = new He(ri, ai, t, e);
    s.layers = this.layers, this.add(s);
    const r = new He(ri, ai, t, e);
    r.layers = this.layers, this.add(r);
    const a = new He(ri, ai, t, e);
    a.layers = this.layers, this.add(a);
    const o = new He(ri, ai, t, e);
    o.layers = this.layers, this.add(o);
    const l = new He(ri, ai, t, e);
    l.layers = this.layers, this.add(l);
    const c = new He(ri, ai, t, e);
    c.layers = this.layers, this.add(c);
  }
  updateCoordinateSystem() {
    const t = this.coordinateSystem, e = this.children.concat(), [n, s, r, a, o, l] = e;
    for (const c of e) this.remove(c);
    if (t === hn)
      n.up.set(0, 1, 0), n.lookAt(1, 0, 0), s.up.set(0, 1, 0), s.lookAt(-1, 0, 0), r.up.set(0, 0, -1), r.lookAt(0, 1, 0), a.up.set(0, 0, 1), a.lookAt(0, -1, 0), o.up.set(0, 1, 0), o.lookAt(0, 0, 1), l.up.set(0, 1, 0), l.lookAt(0, 0, -1);
    else if (t === Cs)
      n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), s.up.set(0, -1, 0), s.lookAt(1, 0, 0), r.up.set(0, 0, 1), r.lookAt(0, 1, 0), a.up.set(0, 0, -1), a.lookAt(0, -1, 0), o.up.set(0, -1, 0), o.lookAt(0, 0, 1), l.up.set(0, -1, 0), l.lookAt(0, 0, -1);
    else
      throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + t);
    for (const c of e)
      this.add(c), c.updateMatrixWorld();
  }
  update(t, e) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: n, activeMipmapLevel: s } = this;
    this.coordinateSystem !== t.coordinateSystem && (this.coordinateSystem = t.coordinateSystem, this.updateCoordinateSystem());
    const [r, a, o, l, c, h] = this.children, d = t.getRenderTarget(), f = t.getActiveCubeFace(), m = t.getActiveMipmapLevel(), _ = t.xr.enabled;
    t.xr.enabled = !1;
    const x = n.texture.generateMipmaps;
    n.texture.generateMipmaps = !1, t.setRenderTarget(n, 0, s), t.render(e, r), t.setRenderTarget(n, 1, s), t.render(e, a), t.setRenderTarget(n, 2, s), t.render(e, o), t.setRenderTarget(n, 3, s), t.render(e, l), t.setRenderTarget(n, 4, s), t.render(e, c), n.texture.generateMipmaps = x, t.setRenderTarget(n, 5, s), t.render(e, h), t.setRenderTarget(d, f, m), t.xr.enabled = _, n.texture.needsPMREMUpdate = !0;
  }
}
class Dl extends Te {
  constructor(t, e, n, s, r, a, o, l, c, h) {
    t = t !== void 0 ? t : [], e = e !== void 0 ? e : Mi, super(t, e, n, s, r, a, o, l, c, h), this.isCubeTexture = !0, this.flipY = !1;
  }
  get images() {
    return this.image;
  }
  set images(t) {
    this.image = t;
  }
}
class fh extends kn {
  constructor(t = 1, e = {}) {
    super(t, t, e), this.isWebGLCubeRenderTarget = !0;
    const n = { width: t, height: t, depth: 1 }, s = [n, n, n, n, n, n];
    this.texture = new Dl(s, e.mapping, e.wrapS, e.wrapT, e.magFilter, e.minFilter, e.format, e.type, e.anisotropy, e.colorSpace), this.texture.isRenderTargetTexture = !0, this.texture.generateMipmaps = e.generateMipmaps !== void 0 ? e.generateMipmaps : !1, this.texture.minFilter = e.minFilter !== void 0 ? e.minFilter : Ke;
  }
  fromEquirectangularTexture(t, e) {
    this.texture.type = e.type, this.texture.colorSpace = e.colorSpace, this.texture.generateMipmaps = e.generateMipmaps, this.texture.minFilter = e.minFilter, this.texture.magFilter = e.magFilter;
    const n = {
      uniforms: {
        tEquirect: { value: null }
      },
      vertexShader: (
        /* glsl */
        `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`
      ),
      fragmentShader: (
        /* glsl */
        `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`
      )
    }, s = new Xi(5, 5, 5), r = new fn({
      name: "CubemapFromEquirect",
      uniforms: bi(n.uniforms),
      vertexShader: n.vertexShader,
      fragmentShader: n.fragmentShader,
      side: Ce,
      blending: bn
    });
    r.uniforms.tEquirect.value = e;
    const a = new Ee(s, r), o = e.minFilter;
    return e.minFilter === Vn && (e.minFilter = Ke), new dh(1, 10, this).update(t, a), e.minFilter = o, a.geometry.dispose(), a.material.dispose(), this;
  }
  clear(t, e, n, s) {
    const r = t.getRenderTarget();
    for (let a = 0; a < 6; a++)
      t.setRenderTarget(this, a), t.clear(e, n, s);
    t.setRenderTarget(r);
  }
}
class ph extends me {
  constructor() {
    super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new Qe(), this.environmentIntensity = 1, this.environmentRotation = new Qe(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  copy(t, e) {
    return super.copy(t, e), t.background !== null && (this.background = t.background.clone()), t.environment !== null && (this.environment = t.environment.clone()), t.fog !== null && (this.fog = t.fog.clone()), this.backgroundBlurriness = t.backgroundBlurriness, this.backgroundIntensity = t.backgroundIntensity, this.backgroundRotation.copy(t.backgroundRotation), this.environmentIntensity = t.environmentIntensity, this.environmentRotation.copy(t.environmentRotation), t.overrideMaterial !== null && (this.overrideMaterial = t.overrideMaterial.clone()), this.matrixAutoUpdate = t.matrixAutoUpdate, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return this.fog !== null && (e.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (e.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (e.object.backgroundIntensity = this.backgroundIntensity), e.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (e.object.environmentIntensity = this.environmentIntensity), e.object.environmentRotation = this.environmentRotation.toArray(), e;
  }
}
class mh extends Te {
  constructor(t = null, e = 1, n = 1, s, r, a, o, l, c = Ue, h = Ue, d, f) {
    super(null, a, o, l, c, h, s, r, d, f), this.isDataTexture = !0, this.image = { data: t, width: e, height: n }, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class pe extends ge {
  constructor(t, e, n, s = 1) {
    super(t, e, n), this.isInstancedBufferAttribute = !0, this.meshPerAttribute = s;
  }
  copy(t) {
    return super.copy(t), this.meshPerAttribute = t.meshPerAttribute, this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.meshPerAttribute = this.meshPerAttribute, t.isInstancedBufferAttribute = !0, t;
  }
}
const oi = /* @__PURE__ */ new Yt(), uo = /* @__PURE__ */ new Yt(), us = [], fo = /* @__PURE__ */ new Yn(), _h = /* @__PURE__ */ new Yt(), Ni = /* @__PURE__ */ new Ee(), Fi = /* @__PURE__ */ new Ai();
class Ll extends Ee {
  constructor(t, e, n) {
    super(t, e), this.isInstancedMesh = !0, this.instanceMatrix = new pe(new Float32Array(n * 16), 16), this.instanceColor = null, this.morphTexture = null, this.count = n, this.boundingBox = null, this.boundingSphere = null;
    for (let s = 0; s < n; s++)
      this.setMatrixAt(s, _h);
  }
  computeBoundingBox() {
    const t = this.geometry, e = this.count;
    this.boundingBox === null && (this.boundingBox = new Yn()), t.boundingBox === null && t.computeBoundingBox(), this.boundingBox.makeEmpty();
    for (let n = 0; n < e; n++)
      this.getMatrixAt(n, oi), fo.copy(t.boundingBox).applyMatrix4(oi), this.boundingBox.union(fo);
  }
  computeBoundingSphere() {
    const t = this.geometry, e = this.count;
    this.boundingSphere === null && (this.boundingSphere = new Ai()), t.boundingSphere === null && t.computeBoundingSphere(), this.boundingSphere.makeEmpty();
    for (let n = 0; n < e; n++)
      this.getMatrixAt(n, oi), Fi.copy(t.boundingSphere).applyMatrix4(oi), this.boundingSphere.union(Fi);
  }
  copy(t, e) {
    return super.copy(t, e), this.instanceMatrix.copy(t.instanceMatrix), t.morphTexture !== null && (this.morphTexture = t.morphTexture.clone()), t.instanceColor !== null && (this.instanceColor = t.instanceColor.clone()), this.count = t.count, t.boundingBox !== null && (this.boundingBox = t.boundingBox.clone()), t.boundingSphere !== null && (this.boundingSphere = t.boundingSphere.clone()), this;
  }
  getColorAt(t, e) {
    e.fromArray(this.instanceColor.array, t * 3);
  }
  getMatrixAt(t, e) {
    e.fromArray(this.instanceMatrix.array, t * 16);
  }
  getMorphAt(t, e) {
    const n = e.morphTargetInfluences, s = this.morphTexture.source.data.data, r = n.length + 1, a = t * r + 1;
    for (let o = 0; o < n.length; o++)
      n[o] = s[a + o];
  }
  raycast(t, e) {
    const n = this.matrixWorld, s = this.count;
    if (Ni.geometry = this.geometry, Ni.material = this.material, Ni.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), Fi.copy(this.boundingSphere), Fi.applyMatrix4(n), t.ray.intersectsSphere(Fi) !== !1))
      for (let r = 0; r < s; r++) {
        this.getMatrixAt(r, oi), uo.multiplyMatrices(n, oi), Ni.matrixWorld = uo, Ni.raycast(t, us);
        for (let a = 0, o = us.length; a < o; a++) {
          const l = us[a];
          l.instanceId = r, l.object = this, e.push(l);
        }
        us.length = 0;
      }
  }
  setColorAt(t, e) {
    this.instanceColor === null && (this.instanceColor = new pe(new Float32Array(this.instanceMatrix.count * 3).fill(1), 3)), e.toArray(this.instanceColor.array, t * 3);
  }
  setMatrixAt(t, e) {
    e.toArray(this.instanceMatrix.array, t * 16);
  }
  setMorphAt(t, e) {
    const n = e.morphTargetInfluences, s = n.length + 1;
    this.morphTexture === null && (this.morphTexture = new mh(new Float32Array(s * this.count), s, this.count, Ta, $e));
    const r = this.morphTexture.source.data.data;
    let a = 0;
    for (let c = 0; c < n.length; c++)
      a += n[c];
    const o = this.geometry.morphTargetsRelative ? 1 : 1 - a, l = s * t;
    r[l] = o, r.set(n, l + 1);
  }
  updateMorphTargets() {
  }
  dispose() {
    return this.dispatchEvent({ type: "dispose" }), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null), this;
  }
}
const mr = /* @__PURE__ */ new D(), gh = /* @__PURE__ */ new D(), vh = /* @__PURE__ */ new Dt();
class yn {
  constructor(t = new D(1, 0, 0), e = 0) {
    this.isPlane = !0, this.normal = t, this.constant = e;
  }
  set(t, e) {
    return this.normal.copy(t), this.constant = e, this;
  }
  setComponents(t, e, n, s) {
    return this.normal.set(t, e, n), this.constant = s, this;
  }
  setFromNormalAndCoplanarPoint(t, e) {
    return this.normal.copy(t), this.constant = -e.dot(this.normal), this;
  }
  setFromCoplanarPoints(t, e, n) {
    const s = mr.subVectors(n, e).cross(gh.subVectors(t, e)).normalize();
    return this.setFromNormalAndCoplanarPoint(s, t), this;
  }
  copy(t) {
    return this.normal.copy(t.normal), this.constant = t.constant, this;
  }
  normalize() {
    const t = 1 / this.normal.length();
    return this.normal.multiplyScalar(t), this.constant *= t, this;
  }
  negate() {
    return this.constant *= -1, this.normal.negate(), this;
  }
  distanceToPoint(t) {
    return this.normal.dot(t) + this.constant;
  }
  distanceToSphere(t) {
    return this.distanceToPoint(t.center) - t.radius;
  }
  projectPoint(t, e) {
    return e.copy(t).addScaledVector(this.normal, -this.distanceToPoint(t));
  }
  intersectLine(t, e) {
    const n = t.delta(mr), s = this.normal.dot(n);
    if (s === 0)
      return this.distanceToPoint(t.start) === 0 ? e.copy(t.start) : null;
    const r = -(t.start.dot(this.normal) + this.constant) / s;
    return r < 0 || r > 1 ? null : e.copy(t.start).addScaledVector(n, r);
  }
  intersectsLine(t) {
    const e = this.distanceToPoint(t.start), n = this.distanceToPoint(t.end);
    return e < 0 && n > 0 || n < 0 && e > 0;
  }
  intersectsBox(t) {
    return t.intersectsPlane(this);
  }
  intersectsSphere(t) {
    return t.intersectsPlane(this);
  }
  coplanarPoint(t) {
    return t.copy(this.normal).multiplyScalar(-this.constant);
  }
  applyMatrix4(t, e) {
    const n = e || vh.getNormalMatrix(t), s = this.coplanarPoint(mr).applyMatrix4(t), r = this.normal.applyMatrix3(n).normalize();
    return this.constant = -s.dot(r), this;
  }
  translate(t) {
    return this.constant -= t.dot(this.normal), this;
  }
  equals(t) {
    return t.normal.equals(this.normal) && t.constant === this.constant;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const Un = /* @__PURE__ */ new Ai(), ds = /* @__PURE__ */ new D();
class Pa {
  constructor(t = new yn(), e = new yn(), n = new yn(), s = new yn(), r = new yn(), a = new yn()) {
    this.planes = [t, e, n, s, r, a];
  }
  set(t, e, n, s, r, a) {
    const o = this.planes;
    return o[0].copy(t), o[1].copy(e), o[2].copy(n), o[3].copy(s), o[4].copy(r), o[5].copy(a), this;
  }
  copy(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++)
      e[n].copy(t.planes[n]);
    return this;
  }
  setFromProjectionMatrix(t, e = hn) {
    const n = this.planes, s = t.elements, r = s[0], a = s[1], o = s[2], l = s[3], c = s[4], h = s[5], d = s[6], f = s[7], m = s[8], _ = s[9], x = s[10], p = s[11], u = s[12], b = s[13], T = s[14], y = s[15];
    if (n[0].setComponents(l - r, f - c, p - m, y - u).normalize(), n[1].setComponents(l + r, f + c, p + m, y + u).normalize(), n[2].setComponents(l + a, f + h, p + _, y + b).normalize(), n[3].setComponents(l - a, f - h, p - _, y - b).normalize(), n[4].setComponents(l - o, f - d, p - x, y - T).normalize(), e === hn)
      n[5].setComponents(l + o, f + d, p + x, y + T).normalize();
    else if (e === Cs)
      n[5].setComponents(o, d, x, T).normalize();
    else
      throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + e);
    return this;
  }
  intersectsObject(t) {
    if (t.boundingSphere !== void 0)
      t.boundingSphere === null && t.computeBoundingSphere(), Un.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);
    else {
      const e = t.geometry;
      e.boundingSphere === null && e.computeBoundingSphere(), Un.copy(e.boundingSphere).applyMatrix4(t.matrixWorld);
    }
    return this.intersectsSphere(Un);
  }
  intersectsSprite(t) {
    return Un.center.set(0, 0, 0), Un.radius = 0.7071067811865476, Un.applyMatrix4(t.matrixWorld), this.intersectsSphere(Un);
  }
  intersectsSphere(t) {
    const e = this.planes, n = t.center, s = -t.radius;
    for (let r = 0; r < 6; r++)
      if (e[r].distanceToPoint(n) < s)
        return !1;
    return !0;
  }
  intersectsBox(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) {
      const s = e[n];
      if (ds.x = s.normal.x > 0 ? t.max.x : t.min.x, ds.y = s.normal.y > 0 ? t.max.y : t.min.y, ds.z = s.normal.z > 0 ? t.max.z : t.min.z, s.distanceToPoint(ds) < 0)
        return !1;
    }
    return !0;
  }
  containsPoint(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++)
      if (e[n].distanceToPoint(t) < 0)
        return !1;
    return !0;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class Da extends wi {
  constructor(t) {
    super(), this.isLineBasicMaterial = !0, this.type = "LineBasicMaterial", this.color = new It(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.linewidth = t.linewidth, this.linecap = t.linecap, this.linejoin = t.linejoin, this.fog = t.fog, this;
  }
}
const Ds = /* @__PURE__ */ new D(), Ls = /* @__PURE__ */ new D(), po = /* @__PURE__ */ new Yt(), Oi = /* @__PURE__ */ new Gs(), fs = /* @__PURE__ */ new Ai(), _r = /* @__PURE__ */ new D(), mo = /* @__PURE__ */ new D();
class pa extends me {
  constructor(t = new Ie(), e = new Da()) {
    super(), this.isLine = !0, this.type = "Line", this.geometry = t, this.material = e, this.updateMorphTargets();
  }
  copy(t, e) {
    return super.copy(t, e), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
  }
  computeLineDistances() {
    const t = this.geometry;
    if (t.index === null) {
      const e = t.attributes.position, n = [0];
      for (let s = 1, r = e.count; s < r; s++)
        Ds.fromBufferAttribute(e, s - 1), Ls.fromBufferAttribute(e, s), n[s] = n[s - 1], n[s] += Ds.distanceTo(Ls);
      t.setAttribute("lineDistance", new be(n, 1));
    } else
      console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
  raycast(t, e) {
    const n = this.geometry, s = this.matrixWorld, r = t.params.Line.threshold, a = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), fs.copy(n.boundingSphere), fs.applyMatrix4(s), fs.radius += r, t.ray.intersectsSphere(fs) === !1) return;
    po.copy(s).invert(), Oi.copy(t.ray).applyMatrix4(po);
    const o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = o * o, c = this.isLineSegments ? 2 : 1, h = n.index, f = n.attributes.position;
    if (h !== null) {
      const m = Math.max(0, a.start), _ = Math.min(h.count, a.start + a.count);
      for (let x = m, p = _ - 1; x < p; x += c) {
        const u = h.getX(x), b = h.getX(x + 1), T = ps(this, t, Oi, l, u, b);
        T && e.push(T);
      }
      if (this.isLineLoop) {
        const x = h.getX(_ - 1), p = h.getX(m), u = ps(this, t, Oi, l, x, p);
        u && e.push(u);
      }
    } else {
      const m = Math.max(0, a.start), _ = Math.min(f.count, a.start + a.count);
      for (let x = m, p = _ - 1; x < p; x += c) {
        const u = ps(this, t, Oi, l, x, x + 1);
        u && e.push(u);
      }
      if (this.isLineLoop) {
        const x = ps(this, t, Oi, l, _ - 1, m);
        x && e.push(x);
      }
    }
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, n = Object.keys(e);
    if (n.length > 0) {
      const s = e[n[0]];
      if (s !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let r = 0, a = s.length; r < a; r++) {
          const o = s[r].name || String(r);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = r;
        }
      }
    }
  }
}
function ps(i, t, e, n, s, r) {
  const a = i.geometry.attributes.position;
  if (Ds.fromBufferAttribute(a, s), Ls.fromBufferAttribute(a, r), e.distanceSqToSegment(Ds, Ls, _r, mo) > n) return;
  _r.applyMatrix4(i.matrixWorld);
  const l = t.ray.origin.distanceTo(_r);
  if (!(l < t.near || l > t.far))
    return {
      distance: l,
      // What do we want? intersection point on the ray or on the segment??
      // point: raycaster.ray.at( distance ),
      point: mo.clone().applyMatrix4(i.matrixWorld),
      index: s,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: i
    };
}
const _o = /* @__PURE__ */ new D(), go = /* @__PURE__ */ new D();
class xh extends pa {
  constructor(t, e) {
    super(t, e), this.isLineSegments = !0, this.type = "LineSegments";
  }
  computeLineDistances() {
    const t = this.geometry;
    if (t.index === null) {
      const e = t.attributes.position, n = [];
      for (let s = 0, r = e.count; s < r; s += 2)
        _o.fromBufferAttribute(e, s), go.fromBufferAttribute(e, s + 1), n[s] = s === 0 ? 0 : n[s - 1], n[s + 1] = n[s] + _o.distanceTo(go);
      t.setAttribute("lineDistance", new be(n, 1));
    } else
      console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
}
class Hi extends me {
  constructor() {
    super(), this.isGroup = !0, this.type = "Group";
  }
}
class Ul extends Te {
  constructor(t, e, n, s, r, a, o, l, c, h = gi) {
    if (h !== gi && h !== Ei)
      throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    n === void 0 && h === gi && (n = Gn), n === void 0 && h === Ei && (n = yi), super(null, s, r, a, o, l, h, n, c), this.isDepthTexture = !0, this.image = { width: t, height: e }, this.magFilter = o !== void 0 ? o : Ue, this.minFilter = l !== void 0 ? l : Ue, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null;
  }
  copy(t) {
    return super.copy(t), this.compareFunction = t.compareFunction, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return this.compareFunction !== null && (e.compareFunction = this.compareFunction), e;
  }
}
class La extends Ie {
  constructor(t = 1, e = 1, n = 1, s = 32, r = 1, a = !1, o = 0, l = Math.PI * 2) {
    super(), this.type = "CylinderGeometry", this.parameters = {
      radiusTop: t,
      radiusBottom: e,
      height: n,
      radialSegments: s,
      heightSegments: r,
      openEnded: a,
      thetaStart: o,
      thetaLength: l
    };
    const c = this;
    s = Math.floor(s), r = Math.floor(r);
    const h = [], d = [], f = [], m = [];
    let _ = 0;
    const x = [], p = n / 2;
    let u = 0;
    b(), a === !1 && (t > 0 && T(!0), e > 0 && T(!1)), this.setIndex(h), this.setAttribute("position", new be(d, 3)), this.setAttribute("normal", new be(f, 3)), this.setAttribute("uv", new be(m, 2));
    function b() {
      const y = new D(), P = new D();
      let A = 0;
      const R = (e - t) / n;
      for (let I = 0; I <= r; I++) {
        const S = [], M = I / r, C = M * (e - t) + t;
        for (let H = 0; H <= s; H++) {
          const B = H / s, k = B * l + o, Z = Math.sin(k), W = Math.cos(k);
          P.x = C * Z, P.y = -M * n + p, P.z = C * W, d.push(P.x, P.y, P.z), y.set(Z, R, W).normalize(), f.push(y.x, y.y, y.z), m.push(B, 1 - M), S.push(_++);
        }
        x.push(S);
      }
      for (let I = 0; I < s; I++)
        for (let S = 0; S < r; S++) {
          const M = x[S][I], C = x[S + 1][I], H = x[S + 1][I + 1], B = x[S][I + 1];
          (t > 0 || S !== 0) && (h.push(M, C, B), A += 3), (e > 0 || S !== r - 1) && (h.push(C, H, B), A += 3);
        }
      c.addGroup(u, A, 0), u += A;
    }
    function T(y) {
      const P = _, A = new Ct(), R = new D();
      let I = 0;
      const S = y === !0 ? t : e, M = y === !0 ? 1 : -1;
      for (let H = 1; H <= s; H++)
        d.push(0, p * M, 0), f.push(0, M, 0), m.push(0.5, 0.5), _++;
      const C = _;
      for (let H = 0; H <= s; H++) {
        const k = H / s * l + o, Z = Math.cos(k), W = Math.sin(k);
        R.x = S * W, R.y = p * M, R.z = S * Z, d.push(R.x, R.y, R.z), f.push(0, M, 0), A.x = Z * 0.5 + 0.5, A.y = W * 0.5 * M + 0.5, m.push(A.x, A.y), _++;
      }
      for (let H = 0; H < s; H++) {
        const B = P + H, k = C + H;
        y === !0 ? h.push(k, k + 1, B) : h.push(k + 1, k, B), I += 3;
      }
      c.addGroup(u, I, y === !0 ? 1 : 2), u += I;
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new La(t.radiusTop, t.radiusBottom, t.height, t.radialSegments, t.heightSegments, t.openEnded, t.thetaStart, t.thetaLength);
  }
}
class ks extends Ie {
  constructor(t = 1, e = 1, n = 1, s = 1) {
    super(), this.type = "PlaneGeometry", this.parameters = {
      width: t,
      height: e,
      widthSegments: n,
      heightSegments: s
    };
    const r = t / 2, a = e / 2, o = Math.floor(n), l = Math.floor(s), c = o + 1, h = l + 1, d = t / o, f = e / l, m = [], _ = [], x = [], p = [];
    for (let u = 0; u < h; u++) {
      const b = u * f - a;
      for (let T = 0; T < c; T++) {
        const y = T * d - r;
        _.push(y, -b, 0), x.push(0, 0, 1), p.push(T / o), p.push(1 - u / l);
      }
    }
    for (let u = 0; u < l; u++)
      for (let b = 0; b < o; b++) {
        const T = b + c * u, y = b + c * (u + 1), P = b + 1 + c * (u + 1), A = b + 1 + c * u;
        m.push(T, y, A), m.push(y, P, A);
      }
    this.setIndex(m), this.setAttribute("position", new be(_, 3)), this.setAttribute("normal", new be(x, 3)), this.setAttribute("uv", new be(p, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new ks(t.width, t.height, t.widthSegments, t.heightSegments);
  }
}
class Ws extends Ie {
  constructor(t = 1, e = 32, n = 16, s = 0, r = Math.PI * 2, a = 0, o = Math.PI) {
    super(), this.type = "SphereGeometry", this.parameters = {
      radius: t,
      widthSegments: e,
      heightSegments: n,
      phiStart: s,
      phiLength: r,
      thetaStart: a,
      thetaLength: o
    }, e = Math.max(3, Math.floor(e)), n = Math.max(2, Math.floor(n));
    const l = Math.min(a + o, Math.PI);
    let c = 0;
    const h = [], d = new D(), f = new D(), m = [], _ = [], x = [], p = [];
    for (let u = 0; u <= n; u++) {
      const b = [], T = u / n;
      let y = 0;
      u === 0 && a === 0 ? y = 0.5 / e : u === n && l === Math.PI && (y = -0.5 / e);
      for (let P = 0; P <= e; P++) {
        const A = P / e;
        d.x = -t * Math.cos(s + A * r) * Math.sin(a + T * o), d.y = t * Math.cos(a + T * o), d.z = t * Math.sin(s + A * r) * Math.sin(a + T * o), _.push(d.x, d.y, d.z), f.copy(d).normalize(), x.push(f.x, f.y, f.z), p.push(A + y, 1 - T), b.push(c++);
      }
      h.push(b);
    }
    for (let u = 0; u < n; u++)
      for (let b = 0; b < e; b++) {
        const T = h[u][b + 1], y = h[u][b], P = h[u + 1][b], A = h[u + 1][b + 1];
        (u !== 0 || a > 0) && m.push(T, y, A), (u !== n - 1 || l < Math.PI) && m.push(y, P, A);
      }
    this.setIndex(m), this.setAttribute("position", new be(_, 3)), this.setAttribute("normal", new be(x, 3)), this.setAttribute("uv", new be(p, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new Ws(t.radius, t.widthSegments, t.heightSegments, t.phiStart, t.phiLength, t.thetaStart, t.thetaLength);
  }
}
class Il extends fn {
  constructor(t) {
    super(t), this.isRawShaderMaterial = !0, this.type = "RawShaderMaterial";
  }
}
class Mh extends wi {
  constructor(t) {
    super(), this.isMeshStandardMaterial = !0, this.type = "MeshStandardMaterial", this.defines = { STANDARD: "" }, this.color = new It(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new It(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = Sl, this.normalScale = new Ct(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new Qe(), this.envMapIntensity = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.defines = { STANDARD: "" }, this.color.copy(t.color), this.roughness = t.roughness, this.metalness = t.metalness, this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.emissive.copy(t.emissive), this.emissiveMap = t.emissiveMap, this.emissiveIntensity = t.emissiveIntensity, this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.roughnessMap = t.roughnessMap, this.metalnessMap = t.metalnessMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.envMapIntensity = t.envMapIntensity, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.flatShading = t.flatShading, this.fog = t.fog, this;
  }
}
class Nl extends Mh {
  constructor(t) {
    super(), this.isMeshPhysicalMaterial = !0, this.defines = {
      STANDARD: "",
      PHYSICAL: ""
    }, this.type = "MeshPhysicalMaterial", this.anisotropyRotation = 0, this.anisotropyMap = null, this.clearcoatMap = null, this.clearcoatRoughness = 0, this.clearcoatRoughnessMap = null, this.clearcoatNormalScale = new Ct(1, 1), this.clearcoatNormalMap = null, this.ior = 1.5, Object.defineProperty(this, "reflectivity", {
      get: function() {
        return Nt(2.5 * (this.ior - 1) / (this.ior + 1), 0, 1);
      },
      set: function(e) {
        this.ior = (1 + 0.4 * e) / (1 - 0.4 * e);
      }
    }), this.iridescenceMap = null, this.iridescenceIOR = 1.3, this.iridescenceThicknessRange = [100, 400], this.iridescenceThicknessMap = null, this.sheenColor = new It(0), this.sheenColorMap = null, this.sheenRoughness = 1, this.sheenRoughnessMap = null, this.transmissionMap = null, this.thickness = 0, this.thicknessMap = null, this.attenuationDistance = 1 / 0, this.attenuationColor = new It(1, 1, 1), this.specularIntensity = 1, this.specularIntensityMap = null, this.specularColor = new It(1, 1, 1), this.specularColorMap = null, this._anisotropy = 0, this._clearcoat = 0, this._dispersion = 0, this._iridescence = 0, this._sheen = 0, this._transmission = 0, this.setValues(t);
  }
  get anisotropy() {
    return this._anisotropy;
  }
  set anisotropy(t) {
    this._anisotropy > 0 != t > 0 && this.version++, this._anisotropy = t;
  }
  get clearcoat() {
    return this._clearcoat;
  }
  set clearcoat(t) {
    this._clearcoat > 0 != t > 0 && this.version++, this._clearcoat = t;
  }
  get iridescence() {
    return this._iridescence;
  }
  set iridescence(t) {
    this._iridescence > 0 != t > 0 && this.version++, this._iridescence = t;
  }
  get dispersion() {
    return this._dispersion;
  }
  set dispersion(t) {
    this._dispersion > 0 != t > 0 && this.version++, this._dispersion = t;
  }
  get sheen() {
    return this._sheen;
  }
  set sheen(t) {
    this._sheen > 0 != t > 0 && this.version++, this._sheen = t;
  }
  get transmission() {
    return this._transmission;
  }
  set transmission(t) {
    this._transmission > 0 != t > 0 && this.version++, this._transmission = t;
  }
  copy(t) {
    return super.copy(t), this.defines = {
      STANDARD: "",
      PHYSICAL: ""
    }, this.anisotropy = t.anisotropy, this.anisotropyRotation = t.anisotropyRotation, this.anisotropyMap = t.anisotropyMap, this.clearcoat = t.clearcoat, this.clearcoatMap = t.clearcoatMap, this.clearcoatRoughness = t.clearcoatRoughness, this.clearcoatRoughnessMap = t.clearcoatRoughnessMap, this.clearcoatNormalMap = t.clearcoatNormalMap, this.clearcoatNormalScale.copy(t.clearcoatNormalScale), this.dispersion = t.dispersion, this.ior = t.ior, this.iridescence = t.iridescence, this.iridescenceMap = t.iridescenceMap, this.iridescenceIOR = t.iridescenceIOR, this.iridescenceThicknessRange = [...t.iridescenceThicknessRange], this.iridescenceThicknessMap = t.iridescenceThicknessMap, this.sheen = t.sheen, this.sheenColor.copy(t.sheenColor), this.sheenColorMap = t.sheenColorMap, this.sheenRoughness = t.sheenRoughness, this.sheenRoughnessMap = t.sheenRoughnessMap, this.transmission = t.transmission, this.transmissionMap = t.transmissionMap, this.thickness = t.thickness, this.thicknessMap = t.thicknessMap, this.attenuationDistance = t.attenuationDistance, this.attenuationColor.copy(t.attenuationColor), this.specularIntensity = t.specularIntensity, this.specularIntensityMap = t.specularIntensityMap, this.specularColor.copy(t.specularColor), this.specularColorMap = t.specularColorMap, this;
  }
}
class Sh extends wi {
  constructor(t) {
    super(), this.isMeshDepthMaterial = !0, this.type = "MeshDepthMaterial", this.depthPacking = Pc, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.depthPacking = t.depthPacking, this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this;
  }
}
class yh extends wi {
  constructor(t) {
    super(), this.isMeshDistanceMaterial = !0, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this;
  }
}
class Fl extends me {
  constructor(t, e = 1) {
    super(), this.isLight = !0, this.type = "Light", this.color = new It(t), this.intensity = e;
  }
  dispose() {
  }
  copy(t, e) {
    return super.copy(t, e), this.color.copy(t.color), this.intensity = t.intensity, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.color = this.color.getHex(), e.object.intensity = this.intensity, this.groundColor !== void 0 && (e.object.groundColor = this.groundColor.getHex()), this.distance !== void 0 && (e.object.distance = this.distance), this.angle !== void 0 && (e.object.angle = this.angle), this.decay !== void 0 && (e.object.decay = this.decay), this.penumbra !== void 0 && (e.object.penumbra = this.penumbra), this.shadow !== void 0 && (e.object.shadow = this.shadow.toJSON()), this.target !== void 0 && (e.object.target = this.target.uuid), e;
  }
}
class Eh extends Fl {
  constructor(t, e, n) {
    super(t, n), this.isHemisphereLight = !0, this.type = "HemisphereLight", this.position.copy(me.DEFAULT_UP), this.updateMatrix(), this.groundColor = new It(e);
  }
  copy(t, e) {
    return super.copy(t, e), this.groundColor.copy(t.groundColor), this;
  }
}
const gr = /* @__PURE__ */ new Yt(), vo = /* @__PURE__ */ new D(), xo = /* @__PURE__ */ new D();
class Th {
  constructor(t) {
    this.camera = t, this.intensity = 1, this.bias = 0, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new Ct(512, 512), this.map = null, this.mapPass = null, this.matrix = new Yt(), this.autoUpdate = !0, this.needsUpdate = !1, this._frustum = new Pa(), this._frameExtents = new Ct(1, 1), this._viewportCount = 1, this._viewports = [
      new re(0, 0, 1, 1)
    ];
  }
  getViewportCount() {
    return this._viewportCount;
  }
  getFrustum() {
    return this._frustum;
  }
  updateMatrices(t) {
    const e = this.camera, n = this.matrix;
    vo.setFromMatrixPosition(t.matrixWorld), e.position.copy(vo), xo.setFromMatrixPosition(t.target.matrixWorld), e.lookAt(xo), e.updateMatrixWorld(), gr.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), this._frustum.setFromProjectionMatrix(gr), n.set(
      0.5,
      0,
      0,
      0.5,
      0,
      0.5,
      0,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0,
      0,
      1
    ), n.multiply(gr);
  }
  getViewport(t) {
    return this._viewports[t];
  }
  getFrameExtents() {
    return this._frameExtents;
  }
  dispose() {
    this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
  }
  copy(t) {
    return this.camera = t.camera.clone(), this.intensity = t.intensity, this.bias = t.bias, this.radius = t.radius, this.mapSize.copy(t.mapSize), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  toJSON() {
    const t = {};
    return this.intensity !== 1 && (t.intensity = this.intensity), this.bias !== 0 && (t.bias = this.bias), this.normalBias !== 0 && (t.normalBias = this.normalBias), this.radius !== 1 && (t.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (t.mapSize = this.mapSize.toArray()), t.camera = this.camera.toJSON(!1).object, delete t.camera.matrix, t;
  }
}
class Ol extends Pl {
  constructor(t = -1, e = 1, n = 1, s = -1, r = 0.1, a = 2e3) {
    super(), this.isOrthographicCamera = !0, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = t, this.right = e, this.top = n, this.bottom = s, this.near = r, this.far = a, this.updateProjectionMatrix();
  }
  copy(t, e) {
    return super.copy(t, e), this.left = t.left, this.right = t.right, this.top = t.top, this.bottom = t.bottom, this.near = t.near, this.far = t.far, this.zoom = t.zoom, this.view = t.view === null ? null : Object.assign({}, t.view), this;
  }
  setViewOffset(t, e, n, s, r, a) {
    this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = t, this.view.fullHeight = e, this.view.offsetX = n, this.view.offsetY = s, this.view.width = r, this.view.height = a, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const t = (this.right - this.left) / (2 * this.zoom), e = (this.top - this.bottom) / (2 * this.zoom), n = (this.right + this.left) / 2, s = (this.top + this.bottom) / 2;
    let r = n - t, a = n + t, o = s + e, l = s - e;
    if (this.view !== null && this.view.enabled) {
      const c = (this.right - this.left) / this.view.fullWidth / this.zoom, h = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      r += c * this.view.offsetX, a = r + c * this.view.width, o -= h * this.view.offsetY, l = o - h * this.view.height;
    }
    this.projectionMatrix.makeOrthographic(r, a, o, l, this.near, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.zoom = this.zoom, e.object.left = this.left, e.object.right = this.right, e.object.top = this.top, e.object.bottom = this.bottom, e.object.near = this.near, e.object.far = this.far, this.view !== null && (e.object.view = Object.assign({}, this.view)), e;
  }
}
class bh extends Th {
  constructor() {
    super(new Ol(-5, 5, 5, -5, 0.5, 500)), this.isDirectionalLightShadow = !0;
  }
}
class vr extends Fl {
  constructor(t, e) {
    super(t, e), this.isDirectionalLight = !0, this.type = "DirectionalLight", this.position.copy(me.DEFAULT_UP), this.updateMatrix(), this.target = new me(), this.shadow = new bh();
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(t) {
    return super.copy(t), this.target = t.target.clone(), this.shadow = t.shadow.clone(), this;
  }
}
class Bl extends Ie {
  constructor() {
    super(), this.isInstancedBufferGeometry = !0, this.type = "InstancedBufferGeometry", this.instanceCount = 1 / 0;
  }
  copy(t) {
    return super.copy(t), this.instanceCount = t.instanceCount, this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.instanceCount = this.instanceCount, t.isInstancedBufferGeometry = !0, t;
  }
}
class Ah extends He {
  constructor(t = []) {
    super(), this.isArrayCamera = !0, this.cameras = t;
  }
}
const Mo = /* @__PURE__ */ new Yt();
class wh {
  constructor(t, e, n = 0, s = 1 / 0) {
    this.ray = new Gs(t, e), this.near = n, this.far = s, this.camera = null, this.layers = new Ra(), this.params = {
      Mesh: {},
      Line: { threshold: 1 },
      LOD: {},
      Points: { threshold: 1 },
      Sprite: {}
    };
  }
  set(t, e) {
    this.ray.set(t, e);
  }
  setFromCamera(t, e) {
    e.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(e.matrixWorld), this.ray.direction.set(t.x, t.y, 0.5).unproject(e).sub(this.ray.origin).normalize(), this.camera = e) : e.isOrthographicCamera ? (this.ray.origin.set(t.x, t.y, (e.near + e.far) / (e.near - e.far)).unproject(e), this.ray.direction.set(0, 0, -1).transformDirection(e.matrixWorld), this.camera = e) : console.error("THREE.Raycaster: Unsupported camera type: " + e.type);
  }
  setFromXRController(t) {
    return Mo.identity().extractRotation(t.matrixWorld), this.ray.origin.setFromMatrixPosition(t.matrixWorld), this.ray.direction.set(0, 0, -1).applyMatrix4(Mo), this;
  }
  intersectObject(t, e = !0, n = []) {
    return ma(t, this, n, e), n.sort(So), n;
  }
  intersectObjects(t, e = !0, n = []) {
    for (let s = 0, r = t.length; s < r; s++)
      ma(t[s], this, n, e);
    return n.sort(So), n;
  }
}
function So(i, t) {
  return i.distance - t.distance;
}
function ma(i, t, e, n) {
  let s = !0;
  if (i.layers.test(t.layers) && i.raycast(t, e) === !1 && (s = !1), s === !0 && n === !0) {
    const r = i.children;
    for (let a = 0, o = r.length; a < o; a++)
      ma(r[a], t, e, !0);
  }
}
class yo {
  constructor(t = 1, e = 0, n = 0) {
    return this.radius = t, this.phi = e, this.theta = n, this;
  }
  set(t, e, n) {
    return this.radius = t, this.phi = e, this.theta = n, this;
  }
  copy(t) {
    return this.radius = t.radius, this.phi = t.phi, this.theta = t.theta, this;
  }
  // restrict phi to be between EPS and PI-EPS
  makeSafe() {
    return this.phi = Nt(this.phi, 1e-6, Math.PI - 1e-6), this;
  }
  setFromVector3(t) {
    return this.setFromCartesianCoords(t.x, t.y, t.z);
  }
  setFromCartesianCoords(t, e, n) {
    return this.radius = Math.sqrt(t * t + e * e + n * n), this.radius === 0 ? (this.theta = 0, this.phi = 0) : (this.theta = Math.atan2(t, n), this.phi = Math.acos(Nt(e / this.radius, -1, 1))), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class Rh extends Xn {
  constructor(t, e = null) {
    super(), this.object = t, this.domElement = e, this.enabled = !0, this.state = -1, this.keys = {}, this.mouseButtons = { LEFT: null, MIDDLE: null, RIGHT: null }, this.touches = { ONE: null, TWO: null };
  }
  connect() {
  }
  disconnect() {
  }
  dispose() {
  }
  update() {
  }
}
function Eo(i, t, e, n) {
  const s = Ch(n);
  switch (e) {
    // https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage2D.xhtml
    case ml:
      return i * t;
    case gl:
      return i * t;
    case vl:
      return i * t * 2;
    case Ta:
      return i * t / s.components * s.byteLength;
    case ba:
      return i * t / s.components * s.byteLength;
    case xl:
      return i * t * 2 / s.components * s.byteLength;
    case Aa:
      return i * t * 2 / s.components * s.byteLength;
    case _l:
      return i * t * 3 / s.components * s.byteLength;
    case qe:
      return i * t * 4 / s.components * s.byteLength;
    case wa:
      return i * t * 4 / s.components * s.byteLength;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_s3tc_srgb/
    case Ms:
    case Ss:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case ys:
    case Es:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_pvrtc/
    case Gr:
    case Wr:
      return Math.max(i, 16) * Math.max(t, 8) / 4;
    case Vr:
    case kr:
      return Math.max(i, 8) * Math.max(t, 8) / 2;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_etc/
    case Xr:
    case Yr:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case qr:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_astc/
    case jr:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case Zr:
      return Math.floor((i + 4) / 5) * Math.floor((t + 3) / 4) * 16;
    case Kr:
      return Math.floor((i + 4) / 5) * Math.floor((t + 4) / 5) * 16;
    case $r:
      return Math.floor((i + 5) / 6) * Math.floor((t + 4) / 5) * 16;
    case Jr:
      return Math.floor((i + 5) / 6) * Math.floor((t + 5) / 6) * 16;
    case Qr:
      return Math.floor((i + 7) / 8) * Math.floor((t + 4) / 5) * 16;
    case ta:
      return Math.floor((i + 7) / 8) * Math.floor((t + 5) / 6) * 16;
    case ea:
      return Math.floor((i + 7) / 8) * Math.floor((t + 7) / 8) * 16;
    case na:
      return Math.floor((i + 9) / 10) * Math.floor((t + 4) / 5) * 16;
    case ia:
      return Math.floor((i + 9) / 10) * Math.floor((t + 5) / 6) * 16;
    case sa:
      return Math.floor((i + 9) / 10) * Math.floor((t + 7) / 8) * 16;
    case ra:
      return Math.floor((i + 9) / 10) * Math.floor((t + 9) / 10) * 16;
    case aa:
      return Math.floor((i + 11) / 12) * Math.floor((t + 9) / 10) * 16;
    case oa:
      return Math.floor((i + 11) / 12) * Math.floor((t + 11) / 12) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_bptc/
    case Ts:
    case la:
    case ca:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_rgtc/
    case Ml:
    case ha:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 8;
    case ua:
    case da:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 16;
  }
  throw new Error(
    `Unable to determine texture byte length for ${e} format.`
  );
}
function Ch(i) {
  switch (i) {
    case dn:
    case dl:
      return { byteLength: 1, components: 1 };
    case Gi:
    case fl:
    case ki:
      return { byteLength: 2, components: 1 };
    case ya:
    case Ea:
      return { byteLength: 2, components: 4 };
    case Gn:
    case Sa:
    case $e:
      return { byteLength: 4, components: 1 };
    case pl:
      return { byteLength: 4, components: 3 };
  }
  throw new Error(`Unknown texture type ${i}.`);
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: {
  revision: "172"
} }));
typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = "172");
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
function zl() {
  let i = null, t = !1, e = null, n = null;
  function s(r, a) {
    e(r, a), n = i.requestAnimationFrame(s);
  }
  return {
    start: function() {
      t !== !0 && e !== null && (n = i.requestAnimationFrame(s), t = !0);
    },
    stop: function() {
      i.cancelAnimationFrame(n), t = !1;
    },
    setAnimationLoop: function(r) {
      e = r;
    },
    setContext: function(r) {
      i = r;
    }
  };
}
function Ph(i) {
  const t = /* @__PURE__ */ new WeakMap();
  function e(o, l) {
    const c = o.array, h = o.usage, d = c.byteLength, f = i.createBuffer();
    i.bindBuffer(l, f), i.bufferData(l, c, h), o.onUploadCallback();
    let m;
    if (c instanceof Float32Array)
      m = i.FLOAT;
    else if (c instanceof Uint16Array)
      o.isFloat16BufferAttribute ? m = i.HALF_FLOAT : m = i.UNSIGNED_SHORT;
    else if (c instanceof Int16Array)
      m = i.SHORT;
    else if (c instanceof Uint32Array)
      m = i.UNSIGNED_INT;
    else if (c instanceof Int32Array)
      m = i.INT;
    else if (c instanceof Int8Array)
      m = i.BYTE;
    else if (c instanceof Uint8Array)
      m = i.UNSIGNED_BYTE;
    else if (c instanceof Uint8ClampedArray)
      m = i.UNSIGNED_BYTE;
    else
      throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + c);
    return {
      buffer: f,
      type: m,
      bytesPerElement: c.BYTES_PER_ELEMENT,
      version: o.version,
      size: d
    };
  }
  function n(o, l, c) {
    const h = l.array, d = l.updateRanges;
    if (i.bindBuffer(c, o), d.length === 0)
      i.bufferSubData(c, 0, h);
    else {
      d.sort((m, _) => m.start - _.start);
      let f = 0;
      for (let m = 1; m < d.length; m++) {
        const _ = d[f], x = d[m];
        x.start <= _.start + _.count + 1 ? _.count = Math.max(
          _.count,
          x.start + x.count - _.start
        ) : (++f, d[f] = x);
      }
      d.length = f + 1;
      for (let m = 0, _ = d.length; m < _; m++) {
        const x = d[m];
        i.bufferSubData(
          c,
          x.start * h.BYTES_PER_ELEMENT,
          h,
          x.start,
          x.count
        );
      }
      l.clearUpdateRanges();
    }
    l.onUploadCallback();
  }
  function s(o) {
    return o.isInterleavedBufferAttribute && (o = o.data), t.get(o);
  }
  function r(o) {
    o.isInterleavedBufferAttribute && (o = o.data);
    const l = t.get(o);
    l && (i.deleteBuffer(l.buffer), t.delete(o));
  }
  function a(o, l) {
    if (o.isInterleavedBufferAttribute && (o = o.data), o.isGLBufferAttribute) {
      const h = t.get(o);
      (!h || h.version < o.version) && t.set(o, {
        buffer: o.buffer,
        type: o.type,
        bytesPerElement: o.elementSize,
        version: o.version
      });
      return;
    }
    const c = t.get(o);
    if (c === void 0)
      t.set(o, e(o, l));
    else if (c.version < o.version) {
      if (c.size !== o.array.byteLength)
        throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
      n(c.buffer, o, l), c.version = o.version;
    }
  }
  return {
    get: s,
    remove: r,
    update: a
  };
}
var Dh = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, Lh = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`, Uh = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, Ih = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, Nh = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`, Fh = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, Oh = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`, Bh = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, zh = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`, Hh = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`, Vh = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, Gh = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, kh = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`, Wh = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`, Xh = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`, Yh = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`, qh = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, jh = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, Zh = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, Kh = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`, $h = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`, Jh = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`, Qh = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`, tu = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`, eu = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`, nu = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`, iu = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, su = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, ru = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, au = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, ou = "gl_FragColor = linearToOutputTexel( gl_FragColor );", lu = `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`, cu = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`, hu = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`, uu = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`, du = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, fu = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`, pu = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, mu = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, _u = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, gu = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, vu = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`, xu = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, Mu = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, Su = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, yu = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`, Eu = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`, Tu = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, bu = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, Au = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, wu = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, Ru = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`, Cu = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`, Pu = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`, Du = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`, Lu = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, Uu = `#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, Iu = `#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Nu = `#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Fu = `#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`, Ou = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, Bu = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, zu = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`, Hu = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, Vu = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, Gu = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, ku = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`, Wu = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, Xu = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, Yu = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`, qu = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, ju = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`, Zu = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`, Ku = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, $u = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, Ju = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, Qu = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`, td = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, ed = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, nd = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, id = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, sd = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, rd = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`, ad = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, od = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, ld = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, cd = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, hd = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, ud = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, dd = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`, fd = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`, pd = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`, md = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`, _d = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, gd = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, vd = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, xd = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`, Md = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, Sd = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, yd = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, Ed = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`, Td = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`, bd = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`, Ad = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, wd = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, Rd = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`, Cd = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const Pd = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, Dd = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Ld = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, Ud = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Id = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, Nd = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Fd = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`, Od = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`, Bd = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`, zd = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`, Hd = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, Vd = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Gd = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, kd = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, Wd = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`, Xd = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Yd = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, qd = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, jd = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`, Zd = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Kd = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`, $d = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`, Jd = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Qd = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, tf = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`, ef = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, nf = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, sf = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, rf = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`, af = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, of = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, lf = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, cf = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, hf = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Ut = {
  alphahash_fragment: Dh,
  alphahash_pars_fragment: Lh,
  alphamap_fragment: Uh,
  alphamap_pars_fragment: Ih,
  alphatest_fragment: Nh,
  alphatest_pars_fragment: Fh,
  aomap_fragment: Oh,
  aomap_pars_fragment: Bh,
  batching_pars_vertex: zh,
  batching_vertex: Hh,
  begin_vertex: Vh,
  beginnormal_vertex: Gh,
  bsdfs: kh,
  iridescence_fragment: Wh,
  bumpmap_pars_fragment: Xh,
  clipping_planes_fragment: Yh,
  clipping_planes_pars_fragment: qh,
  clipping_planes_pars_vertex: jh,
  clipping_planes_vertex: Zh,
  color_fragment: Kh,
  color_pars_fragment: $h,
  color_pars_vertex: Jh,
  color_vertex: Qh,
  common: tu,
  cube_uv_reflection_fragment: eu,
  defaultnormal_vertex: nu,
  displacementmap_pars_vertex: iu,
  displacementmap_vertex: su,
  emissivemap_fragment: ru,
  emissivemap_pars_fragment: au,
  colorspace_fragment: ou,
  colorspace_pars_fragment: lu,
  envmap_fragment: cu,
  envmap_common_pars_fragment: hu,
  envmap_pars_fragment: uu,
  envmap_pars_vertex: du,
  envmap_physical_pars_fragment: Eu,
  envmap_vertex: fu,
  fog_vertex: pu,
  fog_pars_vertex: mu,
  fog_fragment: _u,
  fog_pars_fragment: gu,
  gradientmap_pars_fragment: vu,
  lightmap_pars_fragment: xu,
  lights_lambert_fragment: Mu,
  lights_lambert_pars_fragment: Su,
  lights_pars_begin: yu,
  lights_toon_fragment: Tu,
  lights_toon_pars_fragment: bu,
  lights_phong_fragment: Au,
  lights_phong_pars_fragment: wu,
  lights_physical_fragment: Ru,
  lights_physical_pars_fragment: Cu,
  lights_fragment_begin: Pu,
  lights_fragment_maps: Du,
  lights_fragment_end: Lu,
  logdepthbuf_fragment: Uu,
  logdepthbuf_pars_fragment: Iu,
  logdepthbuf_pars_vertex: Nu,
  logdepthbuf_vertex: Fu,
  map_fragment: Ou,
  map_pars_fragment: Bu,
  map_particle_fragment: zu,
  map_particle_pars_fragment: Hu,
  metalnessmap_fragment: Vu,
  metalnessmap_pars_fragment: Gu,
  morphinstance_vertex: ku,
  morphcolor_vertex: Wu,
  morphnormal_vertex: Xu,
  morphtarget_pars_vertex: Yu,
  morphtarget_vertex: qu,
  normal_fragment_begin: ju,
  normal_fragment_maps: Zu,
  normal_pars_fragment: Ku,
  normal_pars_vertex: $u,
  normal_vertex: Ju,
  normalmap_pars_fragment: Qu,
  clearcoat_normal_fragment_begin: td,
  clearcoat_normal_fragment_maps: ed,
  clearcoat_pars_fragment: nd,
  iridescence_pars_fragment: id,
  opaque_fragment: sd,
  packing: rd,
  premultiplied_alpha_fragment: ad,
  project_vertex: od,
  dithering_fragment: ld,
  dithering_pars_fragment: cd,
  roughnessmap_fragment: hd,
  roughnessmap_pars_fragment: ud,
  shadowmap_pars_fragment: dd,
  shadowmap_pars_vertex: fd,
  shadowmap_vertex: pd,
  shadowmask_pars_fragment: md,
  skinbase_vertex: _d,
  skinning_pars_vertex: gd,
  skinning_vertex: vd,
  skinnormal_vertex: xd,
  specularmap_fragment: Md,
  specularmap_pars_fragment: Sd,
  tonemapping_fragment: yd,
  tonemapping_pars_fragment: Ed,
  transmission_fragment: Td,
  transmission_pars_fragment: bd,
  uv_pars_fragment: Ad,
  uv_pars_vertex: wd,
  uv_vertex: Rd,
  worldpos_vertex: Cd,
  background_vert: Pd,
  background_frag: Dd,
  backgroundCube_vert: Ld,
  backgroundCube_frag: Ud,
  cube_vert: Id,
  cube_frag: Nd,
  depth_vert: Fd,
  depth_frag: Od,
  distanceRGBA_vert: Bd,
  distanceRGBA_frag: zd,
  equirect_vert: Hd,
  equirect_frag: Vd,
  linedashed_vert: Gd,
  linedashed_frag: kd,
  meshbasic_vert: Wd,
  meshbasic_frag: Xd,
  meshlambert_vert: Yd,
  meshlambert_frag: qd,
  meshmatcap_vert: jd,
  meshmatcap_frag: Zd,
  meshnormal_vert: Kd,
  meshnormal_frag: $d,
  meshphong_vert: Jd,
  meshphong_frag: Qd,
  meshphysical_vert: tf,
  meshphysical_frag: ef,
  meshtoon_vert: nf,
  meshtoon_frag: sf,
  points_vert: rf,
  points_frag: af,
  shadow_vert: of,
  shadow_frag: lf,
  sprite_vert: cf,
  sprite_frag: hf
}, et = {
  common: {
    diffuse: { value: /* @__PURE__ */ new It(16777215) },
    opacity: { value: 1 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Dt() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Dt() },
    alphaTest: { value: 0 }
  },
  specularmap: {
    specularMap: { value: null },
    specularMapTransform: { value: /* @__PURE__ */ new Dt() }
  },
  envmap: {
    envMap: { value: null },
    envMapRotation: { value: /* @__PURE__ */ new Dt() },
    flipEnvMap: { value: -1 },
    reflectivity: { value: 1 },
    // basic, lambert, phong
    ior: { value: 1.5 },
    // physical
    refractionRatio: { value: 0.98 }
    // basic, lambert, phong
  },
  aomap: {
    aoMap: { value: null },
    aoMapIntensity: { value: 1 },
    aoMapTransform: { value: /* @__PURE__ */ new Dt() }
  },
  lightmap: {
    lightMap: { value: null },
    lightMapIntensity: { value: 1 },
    lightMapTransform: { value: /* @__PURE__ */ new Dt() }
  },
  bumpmap: {
    bumpMap: { value: null },
    bumpMapTransform: { value: /* @__PURE__ */ new Dt() },
    bumpScale: { value: 1 }
  },
  normalmap: {
    normalMap: { value: null },
    normalMapTransform: { value: /* @__PURE__ */ new Dt() },
    normalScale: { value: /* @__PURE__ */ new Ct(1, 1) }
  },
  displacementmap: {
    displacementMap: { value: null },
    displacementMapTransform: { value: /* @__PURE__ */ new Dt() },
    displacementScale: { value: 1 },
    displacementBias: { value: 0 }
  },
  emissivemap: {
    emissiveMap: { value: null },
    emissiveMapTransform: { value: /* @__PURE__ */ new Dt() }
  },
  metalnessmap: {
    metalnessMap: { value: null },
    metalnessMapTransform: { value: /* @__PURE__ */ new Dt() }
  },
  roughnessmap: {
    roughnessMap: { value: null },
    roughnessMapTransform: { value: /* @__PURE__ */ new Dt() }
  },
  gradientmap: {
    gradientMap: { value: null }
  },
  fog: {
    fogDensity: { value: 25e-5 },
    fogNear: { value: 1 },
    fogFar: { value: 2e3 },
    fogColor: { value: /* @__PURE__ */ new It(16777215) }
  },
  lights: {
    ambientLightColor: { value: [] },
    lightProbe: { value: [] },
    directionalLights: { value: [], properties: {
      direction: {},
      color: {}
    } },
    directionalLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    directionalShadowMap: { value: [] },
    directionalShadowMatrix: { value: [] },
    spotLights: { value: [], properties: {
      color: {},
      position: {},
      direction: {},
      distance: {},
      coneCos: {},
      penumbraCos: {},
      decay: {}
    } },
    spotLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    spotLightMap: { value: [] },
    spotShadowMap: { value: [] },
    spotLightMatrix: { value: [] },
    pointLights: { value: [], properties: {
      color: {},
      position: {},
      decay: {},
      distance: {}
    } },
    pointLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {},
      shadowCameraNear: {},
      shadowCameraFar: {}
    } },
    pointShadowMap: { value: [] },
    pointShadowMatrix: { value: [] },
    hemisphereLights: { value: [], properties: {
      direction: {},
      skyColor: {},
      groundColor: {}
    } },
    // TODO (abelnation): RectAreaLight BRDF data needs to be moved from example to main src
    rectAreaLights: { value: [], properties: {
      color: {},
      position: {},
      width: {},
      height: {}
    } },
    ltc_1: { value: null },
    ltc_2: { value: null }
  },
  points: {
    diffuse: { value: /* @__PURE__ */ new It(16777215) },
    opacity: { value: 1 },
    size: { value: 1 },
    scale: { value: 1 },
    map: { value: null },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Dt() },
    alphaTest: { value: 0 },
    uvTransform: { value: /* @__PURE__ */ new Dt() }
  },
  sprite: {
    diffuse: { value: /* @__PURE__ */ new It(16777215) },
    opacity: { value: 1 },
    center: { value: /* @__PURE__ */ new Ct(0.5, 0.5) },
    rotation: { value: 0 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Dt() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Dt() },
    alphaTest: { value: 0 }
  }
}, Ze = {
  basic: {
    uniforms: /* @__PURE__ */ ye([
      et.common,
      et.specularmap,
      et.envmap,
      et.aomap,
      et.lightmap,
      et.fog
    ]),
    vertexShader: Ut.meshbasic_vert,
    fragmentShader: Ut.meshbasic_frag
  },
  lambert: {
    uniforms: /* @__PURE__ */ ye([
      et.common,
      et.specularmap,
      et.envmap,
      et.aomap,
      et.lightmap,
      et.emissivemap,
      et.bumpmap,
      et.normalmap,
      et.displacementmap,
      et.fog,
      et.lights,
      {
        emissive: { value: /* @__PURE__ */ new It(0) }
      }
    ]),
    vertexShader: Ut.meshlambert_vert,
    fragmentShader: Ut.meshlambert_frag
  },
  phong: {
    uniforms: /* @__PURE__ */ ye([
      et.common,
      et.specularmap,
      et.envmap,
      et.aomap,
      et.lightmap,
      et.emissivemap,
      et.bumpmap,
      et.normalmap,
      et.displacementmap,
      et.fog,
      et.lights,
      {
        emissive: { value: /* @__PURE__ */ new It(0) },
        specular: { value: /* @__PURE__ */ new It(1118481) },
        shininess: { value: 30 }
      }
    ]),
    vertexShader: Ut.meshphong_vert,
    fragmentShader: Ut.meshphong_frag
  },
  standard: {
    uniforms: /* @__PURE__ */ ye([
      et.common,
      et.envmap,
      et.aomap,
      et.lightmap,
      et.emissivemap,
      et.bumpmap,
      et.normalmap,
      et.displacementmap,
      et.roughnessmap,
      et.metalnessmap,
      et.fog,
      et.lights,
      {
        emissive: { value: /* @__PURE__ */ new It(0) },
        roughness: { value: 1 },
        metalness: { value: 0 },
        envMapIntensity: { value: 1 }
      }
    ]),
    vertexShader: Ut.meshphysical_vert,
    fragmentShader: Ut.meshphysical_frag
  },
  toon: {
    uniforms: /* @__PURE__ */ ye([
      et.common,
      et.aomap,
      et.lightmap,
      et.emissivemap,
      et.bumpmap,
      et.normalmap,
      et.displacementmap,
      et.gradientmap,
      et.fog,
      et.lights,
      {
        emissive: { value: /* @__PURE__ */ new It(0) }
      }
    ]),
    vertexShader: Ut.meshtoon_vert,
    fragmentShader: Ut.meshtoon_frag
  },
  matcap: {
    uniforms: /* @__PURE__ */ ye([
      et.common,
      et.bumpmap,
      et.normalmap,
      et.displacementmap,
      et.fog,
      {
        matcap: { value: null }
      }
    ]),
    vertexShader: Ut.meshmatcap_vert,
    fragmentShader: Ut.meshmatcap_frag
  },
  points: {
    uniforms: /* @__PURE__ */ ye([
      et.points,
      et.fog
    ]),
    vertexShader: Ut.points_vert,
    fragmentShader: Ut.points_frag
  },
  dashed: {
    uniforms: /* @__PURE__ */ ye([
      et.common,
      et.fog,
      {
        scale: { value: 1 },
        dashSize: { value: 1 },
        totalSize: { value: 2 }
      }
    ]),
    vertexShader: Ut.linedashed_vert,
    fragmentShader: Ut.linedashed_frag
  },
  depth: {
    uniforms: /* @__PURE__ */ ye([
      et.common,
      et.displacementmap
    ]),
    vertexShader: Ut.depth_vert,
    fragmentShader: Ut.depth_frag
  },
  normal: {
    uniforms: /* @__PURE__ */ ye([
      et.common,
      et.bumpmap,
      et.normalmap,
      et.displacementmap,
      {
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Ut.meshnormal_vert,
    fragmentShader: Ut.meshnormal_frag
  },
  sprite: {
    uniforms: /* @__PURE__ */ ye([
      et.sprite,
      et.fog
    ]),
    vertexShader: Ut.sprite_vert,
    fragmentShader: Ut.sprite_frag
  },
  background: {
    uniforms: {
      uvTransform: { value: /* @__PURE__ */ new Dt() },
      t2D: { value: null },
      backgroundIntensity: { value: 1 }
    },
    vertexShader: Ut.background_vert,
    fragmentShader: Ut.background_frag
  },
  backgroundCube: {
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 },
      backgroundBlurriness: { value: 0 },
      backgroundIntensity: { value: 1 },
      backgroundRotation: { value: /* @__PURE__ */ new Dt() }
    },
    vertexShader: Ut.backgroundCube_vert,
    fragmentShader: Ut.backgroundCube_frag
  },
  cube: {
    uniforms: {
      tCube: { value: null },
      tFlip: { value: -1 },
      opacity: { value: 1 }
    },
    vertexShader: Ut.cube_vert,
    fragmentShader: Ut.cube_frag
  },
  equirect: {
    uniforms: {
      tEquirect: { value: null }
    },
    vertexShader: Ut.equirect_vert,
    fragmentShader: Ut.equirect_frag
  },
  distanceRGBA: {
    uniforms: /* @__PURE__ */ ye([
      et.common,
      et.displacementmap,
      {
        referencePosition: { value: /* @__PURE__ */ new D() },
        nearDistance: { value: 1 },
        farDistance: { value: 1e3 }
      }
    ]),
    vertexShader: Ut.distanceRGBA_vert,
    fragmentShader: Ut.distanceRGBA_frag
  },
  shadow: {
    uniforms: /* @__PURE__ */ ye([
      et.lights,
      et.fog,
      {
        color: { value: /* @__PURE__ */ new It(0) },
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Ut.shadow_vert,
    fragmentShader: Ut.shadow_frag
  }
};
Ze.physical = {
  uniforms: /* @__PURE__ */ ye([
    Ze.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: /* @__PURE__ */ new Dt() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: /* @__PURE__ */ new Dt() },
      clearcoatNormalScale: { value: /* @__PURE__ */ new Ct(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: /* @__PURE__ */ new Dt() },
      dispersion: { value: 0 },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: /* @__PURE__ */ new Dt() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: /* @__PURE__ */ new Dt() },
      sheen: { value: 0 },
      sheenColor: { value: /* @__PURE__ */ new It(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: /* @__PURE__ */ new Dt() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: /* @__PURE__ */ new Dt() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: /* @__PURE__ */ new Dt() },
      transmissionSamplerSize: { value: /* @__PURE__ */ new Ct() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: /* @__PURE__ */ new Dt() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: /* @__PURE__ */ new It(0) },
      specularColor: { value: /* @__PURE__ */ new It(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: /* @__PURE__ */ new Dt() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: /* @__PURE__ */ new Dt() },
      anisotropyVector: { value: /* @__PURE__ */ new Ct() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: /* @__PURE__ */ new Dt() }
    }
  ]),
  vertexShader: Ut.meshphysical_vert,
  fragmentShader: Ut.meshphysical_frag
};
const ms = { r: 0, b: 0, g: 0 }, In = /* @__PURE__ */ new Qe(), uf = /* @__PURE__ */ new Yt();
function df(i, t, e, n, s, r, a) {
  const o = new It(0);
  let l = r === !0 ? 0 : 1, c, h, d = null, f = 0, m = null;
  function _(T) {
    let y = T.isScene === !0 ? T.background : null;
    return y && y.isTexture && (y = (T.backgroundBlurriness > 0 ? e : t).get(y)), y;
  }
  function x(T) {
    let y = !1;
    const P = _(T);
    P === null ? u(o, l) : P && P.isColor && (u(P, 1), y = !0);
    const A = i.xr.getEnvironmentBlendMode();
    A === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, a) : A === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, a), (i.autoClear || y) && (n.buffers.depth.setTest(!0), n.buffers.depth.setMask(!0), n.buffers.color.setMask(!0), i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil));
  }
  function p(T, y) {
    const P = _(y);
    P && (P.isCubeTexture || P.mapping === Vs) ? (h === void 0 && (h = new Ee(
      new Xi(1, 1, 1),
      new fn({
        name: "BackgroundCubeMaterial",
        uniforms: bi(Ze.backgroundCube.uniforms),
        vertexShader: Ze.backgroundCube.vertexShader,
        fragmentShader: Ze.backgroundCube.fragmentShader,
        side: Ce,
        depthTest: !1,
        depthWrite: !1,
        fog: !1
      })
    ), h.geometry.deleteAttribute("normal"), h.geometry.deleteAttribute("uv"), h.onBeforeRender = function(A, R, I) {
      this.matrixWorld.copyPosition(I.matrixWorld);
    }, Object.defineProperty(h.material, "envMap", {
      get: function() {
        return this.uniforms.envMap.value;
      }
    }), s.update(h)), In.copy(y.backgroundRotation), In.x *= -1, In.y *= -1, In.z *= -1, P.isCubeTexture && P.isRenderTargetTexture === !1 && (In.y *= -1, In.z *= -1), h.material.uniforms.envMap.value = P, h.material.uniforms.flipEnvMap.value = P.isCubeTexture && P.isRenderTargetTexture === !1 ? -1 : 1, h.material.uniforms.backgroundBlurriness.value = y.backgroundBlurriness, h.material.uniforms.backgroundIntensity.value = y.backgroundIntensity, h.material.uniforms.backgroundRotation.value.setFromMatrix4(uf.makeRotationFromEuler(In)), h.material.toneMapped = Xt.getTransfer(P.colorSpace) !== Kt, (d !== P || f !== P.version || m !== i.toneMapping) && (h.material.needsUpdate = !0, d = P, f = P.version, m = i.toneMapping), h.layers.enableAll(), T.unshift(h, h.geometry, h.material, 0, 0, null)) : P && P.isTexture && (c === void 0 && (c = new Ee(
      new ks(2, 2),
      new fn({
        name: "BackgroundMaterial",
        uniforms: bi(Ze.background.uniforms),
        vertexShader: Ze.background.vertexShader,
        fragmentShader: Ze.background.fragmentShader,
        side: wn,
        depthTest: !1,
        depthWrite: !1,
        fog: !1
      })
    ), c.geometry.deleteAttribute("normal"), Object.defineProperty(c.material, "map", {
      get: function() {
        return this.uniforms.t2D.value;
      }
    }), s.update(c)), c.material.uniforms.t2D.value = P, c.material.uniforms.backgroundIntensity.value = y.backgroundIntensity, c.material.toneMapped = Xt.getTransfer(P.colorSpace) !== Kt, P.matrixAutoUpdate === !0 && P.updateMatrix(), c.material.uniforms.uvTransform.value.copy(P.matrix), (d !== P || f !== P.version || m !== i.toneMapping) && (c.material.needsUpdate = !0, d = P, f = P.version, m = i.toneMapping), c.layers.enableAll(), T.unshift(c, c.geometry, c.material, 0, 0, null));
  }
  function u(T, y) {
    T.getRGB(ms, Cl(i)), n.buffers.color.setClear(ms.r, ms.g, ms.b, y, a);
  }
  function b() {
    h !== void 0 && (h.geometry.dispose(), h.material.dispose()), c !== void 0 && (c.geometry.dispose(), c.material.dispose());
  }
  return {
    getClearColor: function() {
      return o;
    },
    setClearColor: function(T, y = 1) {
      o.set(T), l = y, u(o, l);
    },
    getClearAlpha: function() {
      return l;
    },
    setClearAlpha: function(T) {
      l = T, u(o, l);
    },
    render: x,
    addToRenderList: p,
    dispose: b
  };
}
function ff(i, t) {
  const e = i.getParameter(i.MAX_VERTEX_ATTRIBS), n = {}, s = f(null);
  let r = s, a = !1;
  function o(M, C, H, B, k) {
    let Z = !1;
    const W = d(B, H, C);
    r !== W && (r = W, c(r.object)), Z = m(M, B, H, k), Z && _(M, B, H, k), k !== null && t.update(k, i.ELEMENT_ARRAY_BUFFER), (Z || a) && (a = !1, y(M, C, H, B), k !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, t.get(k).buffer));
  }
  function l() {
    return i.createVertexArray();
  }
  function c(M) {
    return i.bindVertexArray(M);
  }
  function h(M) {
    return i.deleteVertexArray(M);
  }
  function d(M, C, H) {
    const B = H.wireframe === !0;
    let k = n[M.id];
    k === void 0 && (k = {}, n[M.id] = k);
    let Z = k[C.id];
    Z === void 0 && (Z = {}, k[C.id] = Z);
    let W = Z[B];
    return W === void 0 && (W = f(l()), Z[B] = W), W;
  }
  function f(M) {
    const C = [], H = [], B = [];
    for (let k = 0; k < e; k++)
      C[k] = 0, H[k] = 0, B[k] = 0;
    return {
      // for backward compatibility on non-VAO support browser
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: C,
      enabledAttributes: H,
      attributeDivisors: B,
      object: M,
      attributes: {},
      index: null
    };
  }
  function m(M, C, H, B) {
    const k = r.attributes, Z = C.attributes;
    let W = 0;
    const Q = H.getAttributes();
    for (const G in Q)
      if (Q[G].location >= 0) {
        const ut = k[G];
        let xt = Z[G];
        if (xt === void 0 && (G === "instanceMatrix" && M.instanceMatrix && (xt = M.instanceMatrix), G === "instanceColor" && M.instanceColor && (xt = M.instanceColor)), ut === void 0 || ut.attribute !== xt || xt && ut.data !== xt.data) return !0;
        W++;
      }
    return r.attributesNum !== W || r.index !== B;
  }
  function _(M, C, H, B) {
    const k = {}, Z = C.attributes;
    let W = 0;
    const Q = H.getAttributes();
    for (const G in Q)
      if (Q[G].location >= 0) {
        let ut = Z[G];
        ut === void 0 && (G === "instanceMatrix" && M.instanceMatrix && (ut = M.instanceMatrix), G === "instanceColor" && M.instanceColor && (ut = M.instanceColor));
        const xt = {};
        xt.attribute = ut, ut && ut.data && (xt.data = ut.data), k[G] = xt, W++;
      }
    r.attributes = k, r.attributesNum = W, r.index = B;
  }
  function x() {
    const M = r.newAttributes;
    for (let C = 0, H = M.length; C < H; C++)
      M[C] = 0;
  }
  function p(M) {
    u(M, 0);
  }
  function u(M, C) {
    const H = r.newAttributes, B = r.enabledAttributes, k = r.attributeDivisors;
    H[M] = 1, B[M] === 0 && (i.enableVertexAttribArray(M), B[M] = 1), k[M] !== C && (i.vertexAttribDivisor(M, C), k[M] = C);
  }
  function b() {
    const M = r.newAttributes, C = r.enabledAttributes;
    for (let H = 0, B = C.length; H < B; H++)
      C[H] !== M[H] && (i.disableVertexAttribArray(H), C[H] = 0);
  }
  function T(M, C, H, B, k, Z, W) {
    W === !0 ? i.vertexAttribIPointer(M, C, H, k, Z) : i.vertexAttribPointer(M, C, H, B, k, Z);
  }
  function y(M, C, H, B) {
    x();
    const k = B.attributes, Z = H.getAttributes(), W = C.defaultAttributeValues;
    for (const Q in Z) {
      const G = Z[Q];
      if (G.location >= 0) {
        let st = k[Q];
        if (st === void 0 && (Q === "instanceMatrix" && M.instanceMatrix && (st = M.instanceMatrix), Q === "instanceColor" && M.instanceColor && (st = M.instanceColor)), st !== void 0) {
          const ut = st.normalized, xt = st.itemSize, Ft = t.get(st);
          if (Ft === void 0) continue;
          const Jt = Ft.buffer, Y = Ft.type, tt = Ft.bytesPerElement, _t = Y === i.INT || Y === i.UNSIGNED_INT || st.gpuType === Sa;
          if (st.isInterleavedBufferAttribute) {
            const rt = st.data, Tt = rt.stride, wt = st.offset;
            if (rt.isInstancedInterleavedBuffer) {
              for (let Ot = 0; Ot < G.locationSize; Ot++)
                u(G.location + Ot, rt.meshPerAttribute);
              M.isInstancedMesh !== !0 && B._maxInstanceCount === void 0 && (B._maxInstanceCount = rt.meshPerAttribute * rt.count);
            } else
              for (let Ot = 0; Ot < G.locationSize; Ot++)
                p(G.location + Ot);
            i.bindBuffer(i.ARRAY_BUFFER, Jt);
            for (let Ot = 0; Ot < G.locationSize; Ot++)
              T(
                G.location + Ot,
                xt / G.locationSize,
                Y,
                ut,
                Tt * tt,
                (wt + xt / G.locationSize * Ot) * tt,
                _t
              );
          } else {
            if (st.isInstancedBufferAttribute) {
              for (let rt = 0; rt < G.locationSize; rt++)
                u(G.location + rt, st.meshPerAttribute);
              M.isInstancedMesh !== !0 && B._maxInstanceCount === void 0 && (B._maxInstanceCount = st.meshPerAttribute * st.count);
            } else
              for (let rt = 0; rt < G.locationSize; rt++)
                p(G.location + rt);
            i.bindBuffer(i.ARRAY_BUFFER, Jt);
            for (let rt = 0; rt < G.locationSize; rt++)
              T(
                G.location + rt,
                xt / G.locationSize,
                Y,
                ut,
                xt * tt,
                xt / G.locationSize * rt * tt,
                _t
              );
          }
        } else if (W !== void 0) {
          const ut = W[Q];
          if (ut !== void 0)
            switch (ut.length) {
              case 2:
                i.vertexAttrib2fv(G.location, ut);
                break;
              case 3:
                i.vertexAttrib3fv(G.location, ut);
                break;
              case 4:
                i.vertexAttrib4fv(G.location, ut);
                break;
              default:
                i.vertexAttrib1fv(G.location, ut);
            }
        }
      }
    }
    b();
  }
  function P() {
    I();
    for (const M in n) {
      const C = n[M];
      for (const H in C) {
        const B = C[H];
        for (const k in B)
          h(B[k].object), delete B[k];
        delete C[H];
      }
      delete n[M];
    }
  }
  function A(M) {
    if (n[M.id] === void 0) return;
    const C = n[M.id];
    for (const H in C) {
      const B = C[H];
      for (const k in B)
        h(B[k].object), delete B[k];
      delete C[H];
    }
    delete n[M.id];
  }
  function R(M) {
    for (const C in n) {
      const H = n[C];
      if (H[M.id] === void 0) continue;
      const B = H[M.id];
      for (const k in B)
        h(B[k].object), delete B[k];
      delete H[M.id];
    }
  }
  function I() {
    S(), a = !0, r !== s && (r = s, c(r.object));
  }
  function S() {
    s.geometry = null, s.program = null, s.wireframe = !1;
  }
  return {
    setup: o,
    reset: I,
    resetDefaultState: S,
    dispose: P,
    releaseStatesOfGeometry: A,
    releaseStatesOfProgram: R,
    initAttributes: x,
    enableAttribute: p,
    disableUnusedAttributes: b
  };
}
function pf(i, t, e) {
  let n;
  function s(c) {
    n = c;
  }
  function r(c, h) {
    i.drawArrays(n, c, h), e.update(h, n, 1);
  }
  function a(c, h, d) {
    d !== 0 && (i.drawArraysInstanced(n, c, h, d), e.update(h, n, d));
  }
  function o(c, h, d) {
    if (d === 0) return;
    t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, c, 0, h, 0, d);
    let m = 0;
    for (let _ = 0; _ < d; _++)
      m += h[_];
    e.update(m, n, 1);
  }
  function l(c, h, d, f) {
    if (d === 0) return;
    const m = t.get("WEBGL_multi_draw");
    if (m === null)
      for (let _ = 0; _ < c.length; _++)
        a(c[_], h[_], f[_]);
    else {
      m.multiDrawArraysInstancedWEBGL(n, c, 0, h, 0, f, 0, d);
      let _ = 0;
      for (let x = 0; x < d; x++)
        _ += h[x] * f[x];
      e.update(_, n, 1);
    }
  }
  this.setMode = s, this.render = r, this.renderInstances = a, this.renderMultiDraw = o, this.renderMultiDrawInstances = l;
}
function mf(i, t, e, n) {
  let s;
  function r() {
    if (s !== void 0) return s;
    if (t.has("EXT_texture_filter_anisotropic") === !0) {
      const R = t.get("EXT_texture_filter_anisotropic");
      s = i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else
      s = 0;
    return s;
  }
  function a(R) {
    return !(R !== qe && n.convert(R) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT));
  }
  function o(R) {
    const I = R === ki && (t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"));
    return !(R !== dn && n.convert(R) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE) && // Edge and Chrome Mac < 52 (#9513)
    R !== $e && !I);
  }
  function l(R) {
    if (R === "highp") {
      if (i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.HIGH_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision > 0)
        return "highp";
      R = "mediump";
    }
    return R === "mediump" && i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.MEDIUM_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
  }
  let c = e.precision !== void 0 ? e.precision : "highp";
  const h = l(c);
  h !== c && (console.warn("THREE.WebGLRenderer:", c, "not supported, using", h, "instead."), c = h);
  const d = e.logarithmicDepthBuffer === !0, f = e.reverseDepthBuffer === !0 && t.has("EXT_clip_control"), m = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS), _ = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS), x = i.getParameter(i.MAX_TEXTURE_SIZE), p = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE), u = i.getParameter(i.MAX_VERTEX_ATTRIBS), b = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS), T = i.getParameter(i.MAX_VARYING_VECTORS), y = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS), P = _ > 0, A = i.getParameter(i.MAX_SAMPLES);
  return {
    isWebGL2: !0,
    // keeping this for backwards compatibility
    getMaxAnisotropy: r,
    getMaxPrecision: l,
    textureFormatReadable: a,
    textureTypeReadable: o,
    precision: c,
    logarithmicDepthBuffer: d,
    reverseDepthBuffer: f,
    maxTextures: m,
    maxVertexTextures: _,
    maxTextureSize: x,
    maxCubemapSize: p,
    maxAttributes: u,
    maxVertexUniforms: b,
    maxVaryings: T,
    maxFragmentUniforms: y,
    vertexTextures: P,
    maxSamples: A
  };
}
function _f(i) {
  const t = this;
  let e = null, n = 0, s = !1, r = !1;
  const a = new yn(), o = new Dt(), l = { value: null, needsUpdate: !1 };
  this.uniform = l, this.numPlanes = 0, this.numIntersection = 0, this.init = function(d, f) {
    const m = d.length !== 0 || f || // enable state of previous frame - the clipping code has to
    // run another frame in order to reset the state:
    n !== 0 || s;
    return s = f, n = d.length, m;
  }, this.beginShadows = function() {
    r = !0, h(null);
  }, this.endShadows = function() {
    r = !1;
  }, this.setGlobalState = function(d, f) {
    e = h(d, f, 0);
  }, this.setState = function(d, f, m) {
    const _ = d.clippingPlanes, x = d.clipIntersection, p = d.clipShadows, u = i.get(d);
    if (!s || _ === null || _.length === 0 || r && !p)
      r ? h(null) : c();
    else {
      const b = r ? 0 : n, T = b * 4;
      let y = u.clippingState || null;
      l.value = y, y = h(_, f, T, m);
      for (let P = 0; P !== T; ++P)
        y[P] = e[P];
      u.clippingState = y, this.numIntersection = x ? this.numPlanes : 0, this.numPlanes += b;
    }
  };
  function c() {
    l.value !== e && (l.value = e, l.needsUpdate = n > 0), t.numPlanes = n, t.numIntersection = 0;
  }
  function h(d, f, m, _) {
    const x = d !== null ? d.length : 0;
    let p = null;
    if (x !== 0) {
      if (p = l.value, _ !== !0 || p === null) {
        const u = m + x * 4, b = f.matrixWorldInverse;
        o.getNormalMatrix(b), (p === null || p.length < u) && (p = new Float32Array(u));
        for (let T = 0, y = m; T !== x; ++T, y += 4)
          a.copy(d[T]).applyMatrix4(b, o), a.normal.toArray(p, y), p[y + 3] = a.constant;
      }
      l.value = p, l.needsUpdate = !0;
    }
    return t.numPlanes = x, t.numIntersection = 0, p;
  }
}
function gf(i) {
  let t = /* @__PURE__ */ new WeakMap();
  function e(a, o) {
    return o === Or ? a.mapping = Mi : o === Br && (a.mapping = Si), a;
  }
  function n(a) {
    if (a && a.isTexture) {
      const o = a.mapping;
      if (o === Or || o === Br)
        if (t.has(a)) {
          const l = t.get(a).texture;
          return e(l, a.mapping);
        } else {
          const l = a.image;
          if (l && l.height > 0) {
            const c = new fh(l.height);
            return c.fromEquirectangularTexture(i, a), t.set(a, c), a.addEventListener("dispose", s), e(c.texture, a.mapping);
          } else
            return null;
        }
    }
    return a;
  }
  function s(a) {
    const o = a.target;
    o.removeEventListener("dispose", s);
    const l = t.get(o);
    l !== void 0 && (t.delete(o), l.dispose());
  }
  function r() {
    t = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: n,
    dispose: r
  };
}
const pi = 4, To = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582], zn = 20, xr = /* @__PURE__ */ new Ol(), bo = /* @__PURE__ */ new It();
let Mr = null, Sr = 0, yr = 0, Er = !1;
const On = (1 + Math.sqrt(5)) / 2, li = 1 / On, Ao = [
  /* @__PURE__ */ new D(-On, li, 0),
  /* @__PURE__ */ new D(On, li, 0),
  /* @__PURE__ */ new D(-li, 0, On),
  /* @__PURE__ */ new D(li, 0, On),
  /* @__PURE__ */ new D(0, On, -li),
  /* @__PURE__ */ new D(0, On, li),
  /* @__PURE__ */ new D(-1, 1, -1),
  /* @__PURE__ */ new D(1, 1, -1),
  /* @__PURE__ */ new D(-1, 1, 1),
  /* @__PURE__ */ new D(1, 1, 1)
];
class wo {
  constructor(t) {
    this._renderer = t, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
  }
  /**
   * Generates a PMREM from a supplied Scene, which can be faster than using an
   * image if networking bandwidth is low. Optional sigma specifies a blur radius
   * in radians to be applied to the scene before PMREM generation. Optional near
   * and far planes ensure the scene is rendered in its entirety (the cubeCamera
   * is placed at the origin).
   *
   * @param {Scene} scene
   * @param {number} sigma
   * @param {number} near
   * @param {number} far
   * @return {WebGLRenderTarget}
   */
  fromScene(t, e = 0, n = 0.1, s = 100) {
    Mr = this._renderer.getRenderTarget(), Sr = this._renderer.getActiveCubeFace(), yr = this._renderer.getActiveMipmapLevel(), Er = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(256);
    const r = this._allocateTargets();
    return r.depthBuffer = !0, this._sceneToCubeUV(t, n, s, r), e > 0 && this._blur(r, 0, 0, e), this._applyPMREM(r), this._cleanup(r), r;
  }
  /**
   * Generates a PMREM from an equirectangular texture, which can be either LDR
   * or HDR. The ideal input image size is 1k (1024 x 512),
   * as this matches best with the 256 x 256 cubemap output.
   * The smallest supported equirectangular image size is 64 x 32.
   *
   * @param {Texture} equirectangular
   * @param {WebGLRenderTarget} [renderTarget=null] - Optional render target.
   * @return {WebGLRenderTarget}
   */
  fromEquirectangular(t, e = null) {
    return this._fromTexture(t, e);
  }
  /**
   * Generates a PMREM from an cubemap texture, which can be either LDR
   * or HDR. The ideal input cube size is 256 x 256,
   * as this matches best with the 256 x 256 cubemap output.
   * The smallest supported cube size is 16 x 16.
   *
   * @param {Texture} cubemap
   * @param {null} [renderTarget=null] - Optional render target.
   * @return {WebGLRenderTarget}
   */
  fromCubemap(t, e = null) {
    return this._fromTexture(t, e);
  }
  /**
   * Pre-compiles the cubemap shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileCubemapShader() {
    this._cubemapMaterial === null && (this._cubemapMaterial = Po(), this._compileMaterial(this._cubemapMaterial));
  }
  /**
   * Pre-compiles the equirectangular shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileEquirectangularShader() {
    this._equirectMaterial === null && (this._equirectMaterial = Co(), this._compileMaterial(this._equirectMaterial));
  }
  /**
   * Disposes of the PMREMGenerator's internal memory. Note that PMREMGenerator is a static class,
   * so you should not need more than one PMREMGenerator object. If you do, calling dispose() on
   * one of them will cause any others to also become unusable.
   */
  dispose() {
    this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose();
  }
  // private interface
  _setSize(t) {
    this._lodMax = Math.floor(Math.log2(t)), this._cubeSize = Math.pow(2, this._lodMax);
  }
  _dispose() {
    this._blurMaterial !== null && this._blurMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
    for (let t = 0; t < this._lodPlanes.length; t++)
      this._lodPlanes[t].dispose();
  }
  _cleanup(t) {
    this._renderer.setRenderTarget(Mr, Sr, yr), this._renderer.xr.enabled = Er, t.scissorTest = !1, _s(t, 0, 0, t.width, t.height);
  }
  _fromTexture(t, e) {
    t.mapping === Mi || t.mapping === Si ? this._setSize(t.image.length === 0 ? 16 : t.image[0].width || t.image[0].image.width) : this._setSize(t.image.width / 4), Mr = this._renderer.getRenderTarget(), Sr = this._renderer.getActiveCubeFace(), yr = this._renderer.getActiveMipmapLevel(), Er = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
    const n = e || this._allocateTargets();
    return this._textureToCubeUV(t, n), this._applyPMREM(n), this._cleanup(n), n;
  }
  _allocateTargets() {
    const t = 3 * Math.max(this._cubeSize, 112), e = 4 * this._cubeSize, n = {
      magFilter: Ke,
      minFilter: Ke,
      generateMipmaps: !1,
      type: ki,
      format: qe,
      colorSpace: Ti,
      depthBuffer: !1
    }, s = Ro(t, e, n);
    if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== t || this._pingPongRenderTarget.height !== e) {
      this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = Ro(t, e, n);
      const { _lodMax: r } = this;
      ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = vf(r)), this._blurMaterial = xf(r, t, e);
    }
    return s;
  }
  _compileMaterial(t) {
    const e = new Ee(this._lodPlanes[0], t);
    this._renderer.compile(e, xr);
  }
  _sceneToCubeUV(t, e, n, s) {
    const o = new He(90, 1, e, n), l = [1, -1, 1, 1, 1, 1], c = [1, 1, 1, -1, -1, -1], h = this._renderer, d = h.autoClear, f = h.toneMapping;
    h.getClearColor(bo), h.toneMapping = An, h.autoClear = !1;
    const m = new Ca({
      name: "PMREM.Background",
      side: Ce,
      depthWrite: !1,
      depthTest: !1
    }), _ = new Ee(new Xi(), m);
    let x = !1;
    const p = t.background;
    p ? p.isColor && (m.color.copy(p), t.background = null, x = !0) : (m.color.copy(bo), x = !0);
    for (let u = 0; u < 6; u++) {
      const b = u % 3;
      b === 0 ? (o.up.set(0, l[u], 0), o.lookAt(c[u], 0, 0)) : b === 1 ? (o.up.set(0, 0, l[u]), o.lookAt(0, c[u], 0)) : (o.up.set(0, l[u], 0), o.lookAt(0, 0, c[u]));
      const T = this._cubeSize;
      _s(s, b * T, u > 2 ? T : 0, T, T), h.setRenderTarget(s), x && h.render(_, o), h.render(t, o);
    }
    _.geometry.dispose(), _.material.dispose(), h.toneMapping = f, h.autoClear = d, t.background = p;
  }
  _textureToCubeUV(t, e) {
    const n = this._renderer, s = t.mapping === Mi || t.mapping === Si;
    s ? (this._cubemapMaterial === null && (this._cubemapMaterial = Po()), this._cubemapMaterial.uniforms.flipEnvMap.value = t.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Co());
    const r = s ? this._cubemapMaterial : this._equirectMaterial, a = new Ee(this._lodPlanes[0], r), o = r.uniforms;
    o.envMap.value = t;
    const l = this._cubeSize;
    _s(e, 0, 0, 3 * l, 2 * l), n.setRenderTarget(e), n.render(a, xr);
  }
  _applyPMREM(t) {
    const e = this._renderer, n = e.autoClear;
    e.autoClear = !1;
    const s = this._lodPlanes.length;
    for (let r = 1; r < s; r++) {
      const a = Math.sqrt(this._sigmas[r] * this._sigmas[r] - this._sigmas[r - 1] * this._sigmas[r - 1]), o = Ao[(s - r - 1) % Ao.length];
      this._blur(t, r - 1, r, a, o);
    }
    e.autoClear = n;
  }
  /**
   * This is a two-pass Gaussian blur for a cubemap. Normally this is done
   * vertically and horizontally, but this breaks down on a cube. Here we apply
   * the blur latitudinally (around the poles), and then longitudinally (towards
   * the poles) to approximate the orthogonally-separable blur. It is least
   * accurate at the poles, but still does a decent job.
   *
   * @param {WebGLRenderTarget} cubeUVRenderTarget
   * @param {number} lodIn
   * @param {number} lodOut
   * @param {number} sigma
   * @param {Vector3} [poleAxis]
   */
  _blur(t, e, n, s, r) {
    const a = this._pingPongRenderTarget;
    this._halfBlur(
      t,
      a,
      e,
      n,
      s,
      "latitudinal",
      r
    ), this._halfBlur(
      a,
      t,
      n,
      n,
      s,
      "longitudinal",
      r
    );
  }
  _halfBlur(t, e, n, s, r, a, o) {
    const l = this._renderer, c = this._blurMaterial;
    a !== "latitudinal" && a !== "longitudinal" && console.error(
      "blur direction must be either latitudinal or longitudinal!"
    );
    const h = 3, d = new Ee(this._lodPlanes[s], c), f = c.uniforms, m = this._sizeLods[n] - 1, _ = isFinite(r) ? Math.PI / (2 * m) : 2 * Math.PI / (2 * zn - 1), x = r / _, p = isFinite(r) ? 1 + Math.floor(h * x) : zn;
    p > zn && console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${zn}`);
    const u = [];
    let b = 0;
    for (let R = 0; R < zn; ++R) {
      const I = R / x, S = Math.exp(-I * I / 2);
      u.push(S), R === 0 ? b += S : R < p && (b += 2 * S);
    }
    for (let R = 0; R < u.length; R++)
      u[R] = u[R] / b;
    f.envMap.value = t.texture, f.samples.value = p, f.weights.value = u, f.latitudinal.value = a === "latitudinal", o && (f.poleAxis.value = o);
    const { _lodMax: T } = this;
    f.dTheta.value = _, f.mipInt.value = T - n;
    const y = this._sizeLods[s], P = 3 * y * (s > T - pi ? s - T + pi : 0), A = 4 * (this._cubeSize - y);
    _s(e, P, A, 3 * y, 2 * y), l.setRenderTarget(e), l.render(d, xr);
  }
}
function vf(i) {
  const t = [], e = [], n = [];
  let s = i;
  const r = i - pi + 1 + To.length;
  for (let a = 0; a < r; a++) {
    const o = Math.pow(2, s);
    e.push(o);
    let l = 1 / o;
    a > i - pi ? l = To[a - i + pi - 1] : a === 0 && (l = 0), n.push(l);
    const c = 1 / (o - 2), h = -c, d = 1 + c, f = [h, h, d, h, d, d, h, h, d, d, h, d], m = 6, _ = 6, x = 3, p = 2, u = 1, b = new Float32Array(x * _ * m), T = new Float32Array(p * _ * m), y = new Float32Array(u * _ * m);
    for (let A = 0; A < m; A++) {
      const R = A % 3 * 2 / 3 - 1, I = A > 2 ? 0 : -1, S = [
        R,
        I,
        0,
        R + 2 / 3,
        I,
        0,
        R + 2 / 3,
        I + 1,
        0,
        R,
        I,
        0,
        R + 2 / 3,
        I + 1,
        0,
        R,
        I + 1,
        0
      ];
      b.set(S, x * _ * A), T.set(f, p * _ * A);
      const M = [A, A, A, A, A, A];
      y.set(M, u * _ * A);
    }
    const P = new Ie();
    P.setAttribute("position", new ge(b, x)), P.setAttribute("uv", new ge(T, p)), P.setAttribute("faceIndex", new ge(y, u)), t.push(P), s > pi && s--;
  }
  return { lodPlanes: t, sizeLods: e, sigmas: n };
}
function Ro(i, t, e) {
  const n = new kn(i, t, e);
  return n.texture.mapping = Vs, n.texture.name = "PMREM.cubeUv", n.scissorTest = !0, n;
}
function _s(i, t, e, n, s) {
  i.viewport.set(t, e, n, s), i.scissor.set(t, e, n, s);
}
function xf(i, t, e) {
  const n = new Float32Array(zn), s = new D(0, 1, 0);
  return new fn({
    name: "SphericalGaussianBlur",
    defines: {
      n: zn,
      CUBEUV_TEXEL_WIDTH: 1 / t,
      CUBEUV_TEXEL_HEIGHT: 1 / e,
      CUBEUV_MAX_MIP: `${i}.0`
    },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: n },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: s }
    },
    vertexShader: Ua(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`
    ),
    blending: bn,
    depthTest: !1,
    depthWrite: !1
  });
}
function Co() {
  return new fn({
    name: "EquirectangularToCubeUV",
    uniforms: {
      envMap: { value: null }
    },
    vertexShader: Ua(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`
    ),
    blending: bn,
    depthTest: !1,
    depthWrite: !1
  });
}
function Po() {
  return new fn({
    name: "CubemapToCubeUV",
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 }
    },
    vertexShader: Ua(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`
    ),
    blending: bn,
    depthTest: !1,
    depthWrite: !1
  });
}
function Ua() {
  return (
    /* glsl */
    `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`
  );
}
function Mf(i) {
  let t = /* @__PURE__ */ new WeakMap(), e = null;
  function n(o) {
    if (o && o.isTexture) {
      const l = o.mapping, c = l === Or || l === Br, h = l === Mi || l === Si;
      if (c || h) {
        let d = t.get(o);
        const f = d !== void 0 ? d.texture.pmremVersion : 0;
        if (o.isRenderTargetTexture && o.pmremVersion !== f)
          return e === null && (e = new wo(i)), d = c ? e.fromEquirectangular(o, d) : e.fromCubemap(o, d), d.texture.pmremVersion = o.pmremVersion, t.set(o, d), d.texture;
        if (d !== void 0)
          return d.texture;
        {
          const m = o.image;
          return c && m && m.height > 0 || h && m && s(m) ? (e === null && (e = new wo(i)), d = c ? e.fromEquirectangular(o) : e.fromCubemap(o), d.texture.pmremVersion = o.pmremVersion, t.set(o, d), o.addEventListener("dispose", r), d.texture) : null;
        }
      }
    }
    return o;
  }
  function s(o) {
    let l = 0;
    const c = 6;
    for (let h = 0; h < c; h++)
      o[h] !== void 0 && l++;
    return l === c;
  }
  function r(o) {
    const l = o.target;
    l.removeEventListener("dispose", r);
    const c = t.get(l);
    c !== void 0 && (t.delete(l), c.dispose());
  }
  function a() {
    t = /* @__PURE__ */ new WeakMap(), e !== null && (e.dispose(), e = null);
  }
  return {
    get: n,
    dispose: a
  };
}
function Sf(i) {
  const t = {};
  function e(n) {
    if (t[n] !== void 0)
      return t[n];
    let s;
    switch (n) {
      case "WEBGL_depth_texture":
        s = i.getExtension("WEBGL_depth_texture") || i.getExtension("MOZ_WEBGL_depth_texture") || i.getExtension("WEBKIT_WEBGL_depth_texture");
        break;
      case "EXT_texture_filter_anisotropic":
        s = i.getExtension("EXT_texture_filter_anisotropic") || i.getExtension("MOZ_EXT_texture_filter_anisotropic") || i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        break;
      case "WEBGL_compressed_texture_s3tc":
        s = i.getExtension("WEBGL_compressed_texture_s3tc") || i.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
        break;
      case "WEBGL_compressed_texture_pvrtc":
        s = i.getExtension("WEBGL_compressed_texture_pvrtc") || i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
        break;
      default:
        s = i.getExtension(n);
    }
    return t[n] = s, s;
  }
  return {
    has: function(n) {
      return e(n) !== null;
    },
    init: function() {
      e("EXT_color_buffer_float"), e("WEBGL_clip_cull_distance"), e("OES_texture_float_linear"), e("EXT_color_buffer_half_float"), e("WEBGL_multisampled_render_to_texture"), e("WEBGL_render_shared_exponent");
    },
    get: function(n) {
      const s = e(n);
      return s === null && ui("THREE.WebGLRenderer: " + n + " extension not supported."), s;
    }
  };
}
function yf(i, t, e, n) {
  const s = {}, r = /* @__PURE__ */ new WeakMap();
  function a(d) {
    const f = d.target;
    f.index !== null && t.remove(f.index);
    for (const _ in f.attributes)
      t.remove(f.attributes[_]);
    f.removeEventListener("dispose", a), delete s[f.id];
    const m = r.get(f);
    m && (t.remove(m), r.delete(f)), n.releaseStatesOfGeometry(f), f.isInstancedBufferGeometry === !0 && delete f._maxInstanceCount, e.memory.geometries--;
  }
  function o(d, f) {
    return s[f.id] === !0 || (f.addEventListener("dispose", a), s[f.id] = !0, e.memory.geometries++), f;
  }
  function l(d) {
    const f = d.attributes;
    for (const m in f)
      t.update(f[m], i.ARRAY_BUFFER);
  }
  function c(d) {
    const f = [], m = d.index, _ = d.attributes.position;
    let x = 0;
    if (m !== null) {
      const b = m.array;
      x = m.version;
      for (let T = 0, y = b.length; T < y; T += 3) {
        const P = b[T + 0], A = b[T + 1], R = b[T + 2];
        f.push(P, A, A, R, R, P);
      }
    } else if (_ !== void 0) {
      const b = _.array;
      x = _.version;
      for (let T = 0, y = b.length / 3 - 1; T < y; T += 3) {
        const P = T + 0, A = T + 1, R = T + 2;
        f.push(P, A, A, R, R, P);
      }
    } else
      return;
    const p = new (El(f) ? Rl : wl)(f, 1);
    p.version = x;
    const u = r.get(d);
    u && t.remove(u), r.set(d, p);
  }
  function h(d) {
    const f = r.get(d);
    if (f) {
      const m = d.index;
      m !== null && f.version < m.version && c(d);
    } else
      c(d);
    return r.get(d);
  }
  return {
    get: o,
    update: l,
    getWireframeAttribute: h
  };
}
function Ef(i, t, e) {
  let n;
  function s(f) {
    n = f;
  }
  let r, a;
  function o(f) {
    r = f.type, a = f.bytesPerElement;
  }
  function l(f, m) {
    i.drawElements(n, m, r, f * a), e.update(m, n, 1);
  }
  function c(f, m, _) {
    _ !== 0 && (i.drawElementsInstanced(n, m, r, f * a, _), e.update(m, n, _));
  }
  function h(f, m, _) {
    if (_ === 0) return;
    t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, m, 0, r, f, 0, _);
    let p = 0;
    for (let u = 0; u < _; u++)
      p += m[u];
    e.update(p, n, 1);
  }
  function d(f, m, _, x) {
    if (_ === 0) return;
    const p = t.get("WEBGL_multi_draw");
    if (p === null)
      for (let u = 0; u < f.length; u++)
        c(f[u] / a, m[u], x[u]);
    else {
      p.multiDrawElementsInstancedWEBGL(n, m, 0, r, f, 0, x, 0, _);
      let u = 0;
      for (let b = 0; b < _; b++)
        u += m[b] * x[b];
      e.update(u, n, 1);
    }
  }
  this.setMode = s, this.setIndex = o, this.render = l, this.renderInstances = c, this.renderMultiDraw = h, this.renderMultiDrawInstances = d;
}
function Tf(i) {
  const t = {
    geometries: 0,
    textures: 0
  }, e = {
    frame: 0,
    calls: 0,
    triangles: 0,
    points: 0,
    lines: 0
  };
  function n(r, a, o) {
    switch (e.calls++, a) {
      case i.TRIANGLES:
        e.triangles += o * (r / 3);
        break;
      case i.LINES:
        e.lines += o * (r / 2);
        break;
      case i.LINE_STRIP:
        e.lines += o * (r - 1);
        break;
      case i.LINE_LOOP:
        e.lines += o * r;
        break;
      case i.POINTS:
        e.points += o * r;
        break;
      default:
        console.error("THREE.WebGLInfo: Unknown draw mode:", a);
        break;
    }
  }
  function s() {
    e.calls = 0, e.triangles = 0, e.points = 0, e.lines = 0;
  }
  return {
    memory: t,
    render: e,
    programs: null,
    autoReset: !0,
    reset: s,
    update: n
  };
}
function bf(i, t, e) {
  const n = /* @__PURE__ */ new WeakMap(), s = new re();
  function r(a, o, l) {
    const c = a.morphTargetInfluences, h = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, d = h !== void 0 ? h.length : 0;
    let f = n.get(o);
    if (f === void 0 || f.count !== d) {
      let S = function() {
        R.dispose(), n.delete(o), o.removeEventListener("dispose", S);
      };
      f !== void 0 && f.texture.dispose();
      const m = o.morphAttributes.position !== void 0, _ = o.morphAttributes.normal !== void 0, x = o.morphAttributes.color !== void 0, p = o.morphAttributes.position || [], u = o.morphAttributes.normal || [], b = o.morphAttributes.color || [];
      let T = 0;
      m === !0 && (T = 1), _ === !0 && (T = 2), x === !0 && (T = 3);
      let y = o.attributes.position.count * T, P = 1;
      y > t.maxTextureSize && (P = Math.ceil(y / t.maxTextureSize), y = t.maxTextureSize);
      const A = new Float32Array(y * P * 4 * d), R = new bl(A, y, P, d);
      R.type = $e, R.needsUpdate = !0;
      const I = T * 4;
      for (let M = 0; M < d; M++) {
        const C = p[M], H = u[M], B = b[M], k = y * P * 4 * M;
        for (let Z = 0; Z < C.count; Z++) {
          const W = Z * I;
          m === !0 && (s.fromBufferAttribute(C, Z), A[k + W + 0] = s.x, A[k + W + 1] = s.y, A[k + W + 2] = s.z, A[k + W + 3] = 0), _ === !0 && (s.fromBufferAttribute(H, Z), A[k + W + 4] = s.x, A[k + W + 5] = s.y, A[k + W + 6] = s.z, A[k + W + 7] = 0), x === !0 && (s.fromBufferAttribute(B, Z), A[k + W + 8] = s.x, A[k + W + 9] = s.y, A[k + W + 10] = s.z, A[k + W + 11] = B.itemSize === 4 ? s.w : 1);
        }
      }
      f = {
        count: d,
        texture: R,
        size: new Ct(y, P)
      }, n.set(o, f), o.addEventListener("dispose", S);
    }
    if (a.isInstancedMesh === !0 && a.morphTexture !== null)
      l.getUniforms().setValue(i, "morphTexture", a.morphTexture, e);
    else {
      let m = 0;
      for (let x = 0; x < c.length; x++)
        m += c[x];
      const _ = o.morphTargetsRelative ? 1 : 1 - m;
      l.getUniforms().setValue(i, "morphTargetBaseInfluence", _), l.getUniforms().setValue(i, "morphTargetInfluences", c);
    }
    l.getUniforms().setValue(i, "morphTargetsTexture", f.texture, e), l.getUniforms().setValue(i, "morphTargetsTextureSize", f.size);
  }
  return {
    update: r
  };
}
function Af(i, t, e, n) {
  let s = /* @__PURE__ */ new WeakMap();
  function r(l) {
    const c = n.render.frame, h = l.geometry, d = t.get(l, h);
    if (s.get(d) !== c && (t.update(d), s.set(d, c)), l.isInstancedMesh && (l.hasEventListener("dispose", o) === !1 && l.addEventListener("dispose", o), s.get(l) !== c && (e.update(l.instanceMatrix, i.ARRAY_BUFFER), l.instanceColor !== null && e.update(l.instanceColor, i.ARRAY_BUFFER), s.set(l, c))), l.isSkinnedMesh) {
      const f = l.skeleton;
      s.get(f) !== c && (f.update(), s.set(f, c));
    }
    return d;
  }
  function a() {
    s = /* @__PURE__ */ new WeakMap();
  }
  function o(l) {
    const c = l.target;
    c.removeEventListener("dispose", o), e.remove(c.instanceMatrix), c.instanceColor !== null && e.remove(c.instanceColor);
  }
  return {
    update: r,
    dispose: a
  };
}
const Hl = /* @__PURE__ */ new Te(), Do = /* @__PURE__ */ new Ul(1, 1), Vl = /* @__PURE__ */ new bl(), Gl = /* @__PURE__ */ new $c(), kl = /* @__PURE__ */ new Dl(), Lo = [], Uo = [], Io = new Float32Array(16), No = new Float32Array(9), Fo = new Float32Array(4);
function Ri(i, t, e) {
  const n = i[0];
  if (n <= 0 || n > 0) return i;
  const s = t * e;
  let r = Lo[s];
  if (r === void 0 && (r = new Float32Array(s), Lo[s] = r), t !== 0) {
    n.toArray(r, 0);
    for (let a = 1, o = 0; a !== t; ++a)
      o += e, i[a].toArray(r, o);
  }
  return r;
}
function he(i, t) {
  if (i.length !== t.length) return !1;
  for (let e = 0, n = i.length; e < n; e++)
    if (i[e] !== t[e]) return !1;
  return !0;
}
function ue(i, t) {
  for (let e = 0, n = t.length; e < n; e++)
    i[e] = t[e];
}
function Xs(i, t) {
  let e = Uo[t];
  e === void 0 && (e = new Int32Array(t), Uo[t] = e);
  for (let n = 0; n !== t; ++n)
    e[n] = i.allocateTextureUnit();
  return e;
}
function wf(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1f(this.addr, t), e[0] = t);
}
function Rf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2f(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (he(e, t)) return;
    i.uniform2fv(this.addr, t), ue(e, t);
  }
}
function Cf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (i.uniform3f(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else if (t.r !== void 0)
    (e[0] !== t.r || e[1] !== t.g || e[2] !== t.b) && (i.uniform3f(this.addr, t.r, t.g, t.b), e[0] = t.r, e[1] = t.g, e[2] = t.b);
  else {
    if (he(e, t)) return;
    i.uniform3fv(this.addr, t), ue(e, t);
  }
}
function Pf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4f(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (he(e, t)) return;
    i.uniform4fv(this.addr, t), ue(e, t);
  }
}
function Df(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (he(e, t)) return;
    i.uniformMatrix2fv(this.addr, !1, t), ue(e, t);
  } else {
    if (he(e, n)) return;
    Fo.set(n), i.uniformMatrix2fv(this.addr, !1, Fo), ue(e, n);
  }
}
function Lf(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (he(e, t)) return;
    i.uniformMatrix3fv(this.addr, !1, t), ue(e, t);
  } else {
    if (he(e, n)) return;
    No.set(n), i.uniformMatrix3fv(this.addr, !1, No), ue(e, n);
  }
}
function Uf(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (he(e, t)) return;
    i.uniformMatrix4fv(this.addr, !1, t), ue(e, t);
  } else {
    if (he(e, n)) return;
    Io.set(n), i.uniformMatrix4fv(this.addr, !1, Io), ue(e, n);
  }
}
function If(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1i(this.addr, t), e[0] = t);
}
function Nf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2i(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (he(e, t)) return;
    i.uniform2iv(this.addr, t), ue(e, t);
  }
}
function Ff(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (i.uniform3i(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else {
    if (he(e, t)) return;
    i.uniform3iv(this.addr, t), ue(e, t);
  }
}
function Of(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4i(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (he(e, t)) return;
    i.uniform4iv(this.addr, t), ue(e, t);
  }
}
function Bf(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1ui(this.addr, t), e[0] = t);
}
function zf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2ui(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (he(e, t)) return;
    i.uniform2uiv(this.addr, t), ue(e, t);
  }
}
function Hf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (i.uniform3ui(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else {
    if (he(e, t)) return;
    i.uniform3uiv(this.addr, t), ue(e, t);
  }
}
function Vf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4ui(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (he(e, t)) return;
    i.uniform4uiv(this.addr, t), ue(e, t);
  }
}
function Gf(i, t, e) {
  const n = this.cache, s = e.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s);
  let r;
  this.type === i.SAMPLER_2D_SHADOW ? (Do.compareFunction = yl, r = Do) : r = Hl, e.setTexture2D(t || r, s);
}
function kf(i, t, e) {
  const n = this.cache, s = e.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), e.setTexture3D(t || Gl, s);
}
function Wf(i, t, e) {
  const n = this.cache, s = e.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), e.setTextureCube(t || kl, s);
}
function Xf(i, t, e) {
  const n = this.cache, s = e.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), e.setTexture2DArray(t || Vl, s);
}
function Yf(i) {
  switch (i) {
    case 5126:
      return wf;
    // FLOAT
    case 35664:
      return Rf;
    // _VEC2
    case 35665:
      return Cf;
    // _VEC3
    case 35666:
      return Pf;
    // _VEC4
    case 35674:
      return Df;
    // _MAT2
    case 35675:
      return Lf;
    // _MAT3
    case 35676:
      return Uf;
    // _MAT4
    case 5124:
    case 35670:
      return If;
    // INT, BOOL
    case 35667:
    case 35671:
      return Nf;
    // _VEC2
    case 35668:
    case 35672:
      return Ff;
    // _VEC3
    case 35669:
    case 35673:
      return Of;
    // _VEC4
    case 5125:
      return Bf;
    // UINT
    case 36294:
      return zf;
    // _VEC2
    case 36295:
      return Hf;
    // _VEC3
    case 36296:
      return Vf;
    // _VEC4
    case 35678:
    // SAMPLER_2D
    case 36198:
    // SAMPLER_EXTERNAL_OES
    case 36298:
    // INT_SAMPLER_2D
    case 36306:
    // UNSIGNED_INT_SAMPLER_2D
    case 35682:
      return Gf;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return kf;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return Wf;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return Xf;
  }
}
function qf(i, t) {
  i.uniform1fv(this.addr, t);
}
function jf(i, t) {
  const e = Ri(t, this.size, 2);
  i.uniform2fv(this.addr, e);
}
function Zf(i, t) {
  const e = Ri(t, this.size, 3);
  i.uniform3fv(this.addr, e);
}
function Kf(i, t) {
  const e = Ri(t, this.size, 4);
  i.uniform4fv(this.addr, e);
}
function $f(i, t) {
  const e = Ri(t, this.size, 4);
  i.uniformMatrix2fv(this.addr, !1, e);
}
function Jf(i, t) {
  const e = Ri(t, this.size, 9);
  i.uniformMatrix3fv(this.addr, !1, e);
}
function Qf(i, t) {
  const e = Ri(t, this.size, 16);
  i.uniformMatrix4fv(this.addr, !1, e);
}
function tp(i, t) {
  i.uniform1iv(this.addr, t);
}
function ep(i, t) {
  i.uniform2iv(this.addr, t);
}
function np(i, t) {
  i.uniform3iv(this.addr, t);
}
function ip(i, t) {
  i.uniform4iv(this.addr, t);
}
function sp(i, t) {
  i.uniform1uiv(this.addr, t);
}
function rp(i, t) {
  i.uniform2uiv(this.addr, t);
}
function ap(i, t) {
  i.uniform3uiv(this.addr, t);
}
function op(i, t) {
  i.uniform4uiv(this.addr, t);
}
function lp(i, t, e) {
  const n = this.cache, s = t.length, r = Xs(e, s);
  he(n, r) || (i.uniform1iv(this.addr, r), ue(n, r));
  for (let a = 0; a !== s; ++a)
    e.setTexture2D(t[a] || Hl, r[a]);
}
function cp(i, t, e) {
  const n = this.cache, s = t.length, r = Xs(e, s);
  he(n, r) || (i.uniform1iv(this.addr, r), ue(n, r));
  for (let a = 0; a !== s; ++a)
    e.setTexture3D(t[a] || Gl, r[a]);
}
function hp(i, t, e) {
  const n = this.cache, s = t.length, r = Xs(e, s);
  he(n, r) || (i.uniform1iv(this.addr, r), ue(n, r));
  for (let a = 0; a !== s; ++a)
    e.setTextureCube(t[a] || kl, r[a]);
}
function up(i, t, e) {
  const n = this.cache, s = t.length, r = Xs(e, s);
  he(n, r) || (i.uniform1iv(this.addr, r), ue(n, r));
  for (let a = 0; a !== s; ++a)
    e.setTexture2DArray(t[a] || Vl, r[a]);
}
function dp(i) {
  switch (i) {
    case 5126:
      return qf;
    // FLOAT
    case 35664:
      return jf;
    // _VEC2
    case 35665:
      return Zf;
    // _VEC3
    case 35666:
      return Kf;
    // _VEC4
    case 35674:
      return $f;
    // _MAT2
    case 35675:
      return Jf;
    // _MAT3
    case 35676:
      return Qf;
    // _MAT4
    case 5124:
    case 35670:
      return tp;
    // INT, BOOL
    case 35667:
    case 35671:
      return ep;
    // _VEC2
    case 35668:
    case 35672:
      return np;
    // _VEC3
    case 35669:
    case 35673:
      return ip;
    // _VEC4
    case 5125:
      return sp;
    // UINT
    case 36294:
      return rp;
    // _VEC2
    case 36295:
      return ap;
    // _VEC3
    case 36296:
      return op;
    // _VEC4
    case 35678:
    // SAMPLER_2D
    case 36198:
    // SAMPLER_EXTERNAL_OES
    case 36298:
    // INT_SAMPLER_2D
    case 36306:
    // UNSIGNED_INT_SAMPLER_2D
    case 35682:
      return lp;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return cp;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return hp;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return up;
  }
}
class fp {
  constructor(t, e, n) {
    this.id = t, this.addr = n, this.cache = [], this.type = e.type, this.setValue = Yf(e.type);
  }
}
class pp {
  constructor(t, e, n) {
    this.id = t, this.addr = n, this.cache = [], this.type = e.type, this.size = e.size, this.setValue = dp(e.type);
  }
}
class mp {
  constructor(t) {
    this.id = t, this.seq = [], this.map = {};
  }
  setValue(t, e, n) {
    const s = this.seq;
    for (let r = 0, a = s.length; r !== a; ++r) {
      const o = s[r];
      o.setValue(t, e[o.id], n);
    }
  }
}
const Tr = /(\w+)(\])?(\[|\.)?/g;
function Oo(i, t) {
  i.seq.push(t), i.map[t.id] = t;
}
function _p(i, t, e) {
  const n = i.name, s = n.length;
  for (Tr.lastIndex = 0; ; ) {
    const r = Tr.exec(n), a = Tr.lastIndex;
    let o = r[1];
    const l = r[2] === "]", c = r[3];
    if (l && (o = o | 0), c === void 0 || c === "[" && a + 2 === s) {
      Oo(e, c === void 0 ? new fp(o, i, t) : new pp(o, i, t));
      break;
    } else {
      let d = e.map[o];
      d === void 0 && (d = new mp(o), Oo(e, d)), e = d;
    }
  }
}
class As {
  constructor(t, e) {
    this.seq = [], this.map = {};
    const n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS);
    for (let s = 0; s < n; ++s) {
      const r = t.getActiveUniform(e, s), a = t.getUniformLocation(e, r.name);
      _p(r, a, this);
    }
  }
  setValue(t, e, n, s) {
    const r = this.map[e];
    r !== void 0 && r.setValue(t, n, s);
  }
  setOptional(t, e, n) {
    const s = e[n];
    s !== void 0 && this.setValue(t, n, s);
  }
  static upload(t, e, n, s) {
    for (let r = 0, a = e.length; r !== a; ++r) {
      const o = e[r], l = n[o.id];
      l.needsUpdate !== !1 && o.setValue(t, l.value, s);
    }
  }
  static seqWithValue(t, e) {
    const n = [];
    for (let s = 0, r = t.length; s !== r; ++s) {
      const a = t[s];
      a.id in e && n.push(a);
    }
    return n;
  }
}
function Bo(i, t, e) {
  const n = i.createShader(t);
  return i.shaderSource(n, e), i.compileShader(n), n;
}
const gp = 37297;
let vp = 0;
function xp(i, t) {
  const e = i.split(`
`), n = [], s = Math.max(t - 6, 0), r = Math.min(t + 6, e.length);
  for (let a = s; a < r; a++) {
    const o = a + 1;
    n.push(`${o === t ? ">" : " "} ${o}: ${e[a]}`);
  }
  return n.join(`
`);
}
const zo = /* @__PURE__ */ new Dt();
function Mp(i) {
  Xt._getMatrix(zo, Xt.workingColorSpace, i);
  const t = `mat3( ${zo.elements.map((e) => e.toFixed(4))} )`;
  switch (Xt.getTransfer(i)) {
    case ws:
      return [t, "LinearTransferOETF"];
    case Kt:
      return [t, "sRGBTransferOETF"];
    default:
      return console.warn("THREE.WebGLProgram: Unsupported color space: ", i), [t, "LinearTransferOETF"];
  }
}
function Ho(i, t, e) {
  const n = i.getShaderParameter(t, i.COMPILE_STATUS), s = i.getShaderInfoLog(t).trim();
  if (n && s === "") return "";
  const r = /ERROR: 0:(\d+)/.exec(s);
  if (r) {
    const a = parseInt(r[1]);
    return e.toUpperCase() + `

` + s + `

` + xp(i.getShaderSource(t), a);
  } else
    return s;
}
function Sp(i, t) {
  const e = Mp(t);
  return [
    `vec4 ${i}( vec4 value ) {`,
    `	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,
    "}"
  ].join(`
`);
}
function yp(i, t) {
  let e;
  switch (t) {
    case yc:
      e = "Linear";
      break;
    case Ec:
      e = "Reinhard";
      break;
    case Tc:
      e = "Cineon";
      break;
    case bc:
      e = "ACESFilmic";
      break;
    case wc:
      e = "AgX";
      break;
    case Rc:
      e = "Neutral";
      break;
    case Ac:
      e = "Custom";
      break;
    default:
      console.warn("THREE.WebGLProgram: Unsupported toneMapping:", t), e = "Linear";
  }
  return "vec3 " + i + "( vec3 color ) { return " + e + "ToneMapping( color ); }";
}
const gs = /* @__PURE__ */ new D();
function Ep() {
  Xt.getLuminanceCoefficients(gs);
  const i = gs.x.toFixed(4), t = gs.y.toFixed(4), e = gs.z.toFixed(4);
  return [
    "float luminance( const in vec3 rgb ) {",
    `	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,
    "	return dot( weights, rgb );",
    "}"
  ].join(`
`);
}
function Tp(i) {
  return [
    i.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "",
    i.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""
  ].filter(Vi).join(`
`);
}
function bp(i) {
  const t = [];
  for (const e in i) {
    const n = i[e];
    n !== !1 && t.push("#define " + e + " " + n);
  }
  return t.join(`
`);
}
function Ap(i, t) {
  const e = {}, n = i.getProgramParameter(t, i.ACTIVE_ATTRIBUTES);
  for (let s = 0; s < n; s++) {
    const r = i.getActiveAttrib(t, s), a = r.name;
    let o = 1;
    r.type === i.FLOAT_MAT2 && (o = 2), r.type === i.FLOAT_MAT3 && (o = 3), r.type === i.FLOAT_MAT4 && (o = 4), e[a] = {
      type: r.type,
      location: i.getAttribLocation(t, a),
      locationSize: o
    };
  }
  return e;
}
function Vi(i) {
  return i !== "";
}
function Vo(i, t) {
  const e = t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
  return i.replace(/NUM_DIR_LIGHTS/g, t.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, e).replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function Go(i, t) {
  return i.replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t.numClippingPlanes - t.numClipIntersection);
}
const wp = /^[ \t]*#include +<([\w\d./]+)>/gm;
function _a(i) {
  return i.replace(wp, Cp);
}
const Rp = /* @__PURE__ */ new Map();
function Cp(i, t) {
  let e = Ut[t];
  if (e === void 0) {
    const n = Rp.get(t);
    if (n !== void 0)
      e = Ut[n], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', t, n);
    else
      throw new Error("Can not resolve #include <" + t + ">");
  }
  return _a(e);
}
const Pp = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function ko(i) {
  return i.replace(Pp, Dp);
}
function Dp(i, t, e, n) {
  let s = "";
  for (let r = parseInt(t); r < parseInt(e); r++)
    s += n.replace(/\[\s*i\s*\]/g, "[ " + r + " ]").replace(/UNROLLED_LOOP_INDEX/g, r);
  return s;
}
function Wo(i) {
  let t = `precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;
  return i.precision === "highp" ? t += `
#define HIGH_PRECISION` : i.precision === "mediump" ? t += `
#define MEDIUM_PRECISION` : i.precision === "lowp" && (t += `
#define LOW_PRECISION`), t;
}
function Lp(i) {
  let t = "SHADOWMAP_TYPE_BASIC";
  return i.shadowMapType === cl ? t = "SHADOWMAP_TYPE_PCF" : i.shadowMapType === ec ? t = "SHADOWMAP_TYPE_PCF_SOFT" : i.shadowMapType === ln && (t = "SHADOWMAP_TYPE_VSM"), t;
}
function Up(i) {
  let t = "ENVMAP_TYPE_CUBE";
  if (i.envMap)
    switch (i.envMapMode) {
      case Mi:
      case Si:
        t = "ENVMAP_TYPE_CUBE";
        break;
      case Vs:
        t = "ENVMAP_TYPE_CUBE_UV";
        break;
    }
  return t;
}
function Ip(i) {
  let t = "ENVMAP_MODE_REFLECTION";
  if (i.envMap)
    switch (i.envMapMode) {
      case Si:
        t = "ENVMAP_MODE_REFRACTION";
        break;
    }
  return t;
}
function Np(i) {
  let t = "ENVMAP_BLENDING_NONE";
  if (i.envMap)
    switch (i.combine) {
      case hl:
        t = "ENVMAP_BLENDING_MULTIPLY";
        break;
      case Mc:
        t = "ENVMAP_BLENDING_MIX";
        break;
      case Sc:
        t = "ENVMAP_BLENDING_ADD";
        break;
    }
  return t;
}
function Fp(i) {
  const t = i.envMapCubeUVHeight;
  if (t === null) return null;
  const e = Math.log2(t) - 2, n = 1 / t;
  return { texelWidth: 1 / (3 * Math.max(Math.pow(2, e), 112)), texelHeight: n, maxMip: e };
}
function Op(i, t, e, n) {
  const s = i.getContext(), r = e.defines;
  let a = e.vertexShader, o = e.fragmentShader;
  const l = Lp(e), c = Up(e), h = Ip(e), d = Np(e), f = Fp(e), m = Tp(e), _ = bp(r), x = s.createProgram();
  let p, u, b = e.glslVersion ? "#version " + e.glslVersion + `
` : "";
  e.isRawShaderMaterial ? (p = [
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    _
  ].filter(Vi).join(`
`), p.length > 0 && (p += `
`), u = [
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    _
  ].filter(Vi).join(`
`), u.length > 0 && (u += `
`)) : (p = [
    Wo(e),
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    _,
    e.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
    e.batching ? "#define USE_BATCHING" : "",
    e.batchingColor ? "#define USE_BATCHING_COLOR" : "",
    e.instancing ? "#define USE_INSTANCING" : "",
    e.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
    e.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
    e.useFog && e.fog ? "#define USE_FOG" : "",
    e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
    e.map ? "#define USE_MAP" : "",
    e.envMap ? "#define USE_ENVMAP" : "",
    e.envMap ? "#define " + h : "",
    e.lightMap ? "#define USE_LIGHTMAP" : "",
    e.aoMap ? "#define USE_AOMAP" : "",
    e.bumpMap ? "#define USE_BUMPMAP" : "",
    e.normalMap ? "#define USE_NORMALMAP" : "",
    e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    e.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
    e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    e.anisotropy ? "#define USE_ANISOTROPY" : "",
    e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    e.specularMap ? "#define USE_SPECULARMAP" : "",
    e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    e.metalnessMap ? "#define USE_METALNESSMAP" : "",
    e.alphaMap ? "#define USE_ALPHAMAP" : "",
    e.alphaHash ? "#define USE_ALPHAHASH" : "",
    e.transmission ? "#define USE_TRANSMISSION" : "",
    e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    //
    e.mapUv ? "#define MAP_UV " + e.mapUv : "",
    e.alphaMapUv ? "#define ALPHAMAP_UV " + e.alphaMapUv : "",
    e.lightMapUv ? "#define LIGHTMAP_UV " + e.lightMapUv : "",
    e.aoMapUv ? "#define AOMAP_UV " + e.aoMapUv : "",
    e.emissiveMapUv ? "#define EMISSIVEMAP_UV " + e.emissiveMapUv : "",
    e.bumpMapUv ? "#define BUMPMAP_UV " + e.bumpMapUv : "",
    e.normalMapUv ? "#define NORMALMAP_UV " + e.normalMapUv : "",
    e.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + e.displacementMapUv : "",
    e.metalnessMapUv ? "#define METALNESSMAP_UV " + e.metalnessMapUv : "",
    e.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + e.roughnessMapUv : "",
    e.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + e.anisotropyMapUv : "",
    e.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + e.clearcoatMapUv : "",
    e.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + e.clearcoatNormalMapUv : "",
    e.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + e.clearcoatRoughnessMapUv : "",
    e.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + e.iridescenceMapUv : "",
    e.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + e.iridescenceThicknessMapUv : "",
    e.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + e.sheenColorMapUv : "",
    e.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + e.sheenRoughnessMapUv : "",
    e.specularMapUv ? "#define SPECULARMAP_UV " + e.specularMapUv : "",
    e.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + e.specularColorMapUv : "",
    e.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + e.specularIntensityMapUv : "",
    e.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + e.transmissionMapUv : "",
    e.thicknessMapUv ? "#define THICKNESSMAP_UV " + e.thicknessMapUv : "",
    //
    e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
    e.vertexColors ? "#define USE_COLOR" : "",
    e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    e.vertexUv1s ? "#define USE_UV1" : "",
    e.vertexUv2s ? "#define USE_UV2" : "",
    e.vertexUv3s ? "#define USE_UV3" : "",
    e.pointsUvs ? "#define USE_POINTS_UV" : "",
    e.flatShading ? "#define FLAT_SHADED" : "",
    e.skinning ? "#define USE_SKINNING" : "",
    e.morphTargets ? "#define USE_MORPHTARGETS" : "",
    e.morphNormals && e.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
    e.morphColors ? "#define USE_MORPHCOLORS" : "",
    e.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + e.morphTextureStride : "",
    e.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + e.morphTargetsCount : "",
    e.doubleSided ? "#define DOUBLE_SIDED" : "",
    e.flipSided ? "#define FLIP_SIDED" : "",
    e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    e.shadowMapEnabled ? "#define " + l : "",
    e.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
    e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    e.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
    "uniform mat4 modelMatrix;",
    "uniform mat4 modelViewMatrix;",
    "uniform mat4 projectionMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat3 normalMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    "#ifdef USE_INSTANCING",
    "	attribute mat4 instanceMatrix;",
    "#endif",
    "#ifdef USE_INSTANCING_COLOR",
    "	attribute vec3 instanceColor;",
    "#endif",
    "#ifdef USE_INSTANCING_MORPH",
    "	uniform sampler2D morphTexture;",
    "#endif",
    "attribute vec3 position;",
    "attribute vec3 normal;",
    "attribute vec2 uv;",
    "#ifdef USE_UV1",
    "	attribute vec2 uv1;",
    "#endif",
    "#ifdef USE_UV2",
    "	attribute vec2 uv2;",
    "#endif",
    "#ifdef USE_UV3",
    "	attribute vec2 uv3;",
    "#endif",
    "#ifdef USE_TANGENT",
    "	attribute vec4 tangent;",
    "#endif",
    "#if defined( USE_COLOR_ALPHA )",
    "	attribute vec4 color;",
    "#elif defined( USE_COLOR )",
    "	attribute vec3 color;",
    "#endif",
    "#ifdef USE_SKINNING",
    "	attribute vec4 skinIndex;",
    "	attribute vec4 skinWeight;",
    "#endif",
    `
`
  ].filter(Vi).join(`
`), u = [
    Wo(e),
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    _,
    e.useFog && e.fog ? "#define USE_FOG" : "",
    e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
    e.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
    e.map ? "#define USE_MAP" : "",
    e.matcap ? "#define USE_MATCAP" : "",
    e.envMap ? "#define USE_ENVMAP" : "",
    e.envMap ? "#define " + c : "",
    e.envMap ? "#define " + h : "",
    e.envMap ? "#define " + d : "",
    f ? "#define CUBEUV_TEXEL_WIDTH " + f.texelWidth : "",
    f ? "#define CUBEUV_TEXEL_HEIGHT " + f.texelHeight : "",
    f ? "#define CUBEUV_MAX_MIP " + f.maxMip + ".0" : "",
    e.lightMap ? "#define USE_LIGHTMAP" : "",
    e.aoMap ? "#define USE_AOMAP" : "",
    e.bumpMap ? "#define USE_BUMPMAP" : "",
    e.normalMap ? "#define USE_NORMALMAP" : "",
    e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    e.anisotropy ? "#define USE_ANISOTROPY" : "",
    e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    e.clearcoat ? "#define USE_CLEARCOAT" : "",
    e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    e.dispersion ? "#define USE_DISPERSION" : "",
    e.iridescence ? "#define USE_IRIDESCENCE" : "",
    e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    e.specularMap ? "#define USE_SPECULARMAP" : "",
    e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    e.metalnessMap ? "#define USE_METALNESSMAP" : "",
    e.alphaMap ? "#define USE_ALPHAMAP" : "",
    e.alphaTest ? "#define USE_ALPHATEST" : "",
    e.alphaHash ? "#define USE_ALPHAHASH" : "",
    e.sheen ? "#define USE_SHEEN" : "",
    e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    e.transmission ? "#define USE_TRANSMISSION" : "",
    e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
    e.vertexColors || e.instancingColor || e.batchingColor ? "#define USE_COLOR" : "",
    e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    e.vertexUv1s ? "#define USE_UV1" : "",
    e.vertexUv2s ? "#define USE_UV2" : "",
    e.vertexUv3s ? "#define USE_UV3" : "",
    e.pointsUvs ? "#define USE_POINTS_UV" : "",
    e.gradientMap ? "#define USE_GRADIENTMAP" : "",
    e.flatShading ? "#define FLAT_SHADED" : "",
    e.doubleSided ? "#define DOUBLE_SIDED" : "",
    e.flipSided ? "#define FLIP_SIDED" : "",
    e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    e.shadowMapEnabled ? "#define " + l : "",
    e.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
    e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    e.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
    e.decodeVideoTextureEmissive ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE" : "",
    e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    e.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
    "uniform mat4 viewMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    e.toneMapping !== An ? "#define TONE_MAPPING" : "",
    e.toneMapping !== An ? Ut.tonemapping_pars_fragment : "",
    // this code is required here because it is used by the toneMapping() function defined below
    e.toneMapping !== An ? yp("toneMapping", e.toneMapping) : "",
    e.dithering ? "#define DITHERING" : "",
    e.opaque ? "#define OPAQUE" : "",
    Ut.colorspace_pars_fragment,
    // this code is required here because it is used by the various encoding/decoding function defined below
    Sp("linearToOutputTexel", e.outputColorSpace),
    Ep(),
    e.useDepthPacking ? "#define DEPTH_PACKING " + e.depthPacking : "",
    `
`
  ].filter(Vi).join(`
`)), a = _a(a), a = Vo(a, e), a = Go(a, e), o = _a(o), o = Vo(o, e), o = Go(o, e), a = ko(a), o = ko(o), e.isRawShaderMaterial !== !0 && (b = `#version 300 es
`, p = [
    m,
    "#define attribute in",
    "#define varying out",
    "#define texture2D texture"
  ].join(`
`) + `
` + p, u = [
    "#define varying in",
    e.glslVersion === qa ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
    e.glslVersion === qa ? "" : "#define gl_FragColor pc_fragColor",
    "#define gl_FragDepthEXT gl_FragDepth",
    "#define texture2D texture",
    "#define textureCube texture",
    "#define texture2DProj textureProj",
    "#define texture2DLodEXT textureLod",
    "#define texture2DProjLodEXT textureProjLod",
    "#define textureCubeLodEXT textureLod",
    "#define texture2DGradEXT textureGrad",
    "#define texture2DProjGradEXT textureProjGrad",
    "#define textureCubeGradEXT textureGrad"
  ].join(`
`) + `
` + u);
  const T = b + p + a, y = b + u + o, P = Bo(s, s.VERTEX_SHADER, T), A = Bo(s, s.FRAGMENT_SHADER, y);
  s.attachShader(x, P), s.attachShader(x, A), e.index0AttributeName !== void 0 ? s.bindAttribLocation(x, 0, e.index0AttributeName) : e.morphTargets === !0 && s.bindAttribLocation(x, 0, "position"), s.linkProgram(x);
  function R(C) {
    if (i.debug.checkShaderErrors) {
      const H = s.getProgramInfoLog(x).trim(), B = s.getShaderInfoLog(P).trim(), k = s.getShaderInfoLog(A).trim();
      let Z = !0, W = !0;
      if (s.getProgramParameter(x, s.LINK_STATUS) === !1)
        if (Z = !1, typeof i.debug.onShaderError == "function")
          i.debug.onShaderError(s, x, P, A);
        else {
          const Q = Ho(s, P, "vertex"), G = Ho(s, A, "fragment");
          console.error(
            "THREE.WebGLProgram: Shader Error " + s.getError() + " - VALIDATE_STATUS " + s.getProgramParameter(x, s.VALIDATE_STATUS) + `

Material Name: ` + C.name + `
Material Type: ` + C.type + `

Program Info Log: ` + H + `
` + Q + `
` + G
          );
        }
      else H !== "" ? console.warn("THREE.WebGLProgram: Program Info Log:", H) : (B === "" || k === "") && (W = !1);
      W && (C.diagnostics = {
        runnable: Z,
        programLog: H,
        vertexShader: {
          log: B,
          prefix: p
        },
        fragmentShader: {
          log: k,
          prefix: u
        }
      });
    }
    s.deleteShader(P), s.deleteShader(A), I = new As(s, x), S = Ap(s, x);
  }
  let I;
  this.getUniforms = function() {
    return I === void 0 && R(this), I;
  };
  let S;
  this.getAttributes = function() {
    return S === void 0 && R(this), S;
  };
  let M = e.rendererExtensionParallelShaderCompile === !1;
  return this.isReady = function() {
    return M === !1 && (M = s.getProgramParameter(x, gp)), M;
  }, this.destroy = function() {
    n.releaseStatesOfProgram(this), s.deleteProgram(x), this.program = void 0;
  }, this.type = e.shaderType, this.name = e.shaderName, this.id = vp++, this.cacheKey = t, this.usedTimes = 1, this.program = x, this.vertexShader = P, this.fragmentShader = A, this;
}
let Bp = 0;
class zp {
  constructor() {
    this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
  }
  update(t) {
    const e = t.vertexShader, n = t.fragmentShader, s = this._getShaderStage(e), r = this._getShaderStage(n), a = this._getShaderCacheForMaterial(t);
    return a.has(s) === !1 && (a.add(s), s.usedTimes++), a.has(r) === !1 && (a.add(r), r.usedTimes++), this;
  }
  remove(t) {
    const e = this.materialCache.get(t);
    for (const n of e)
      n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code);
    return this.materialCache.delete(t), this;
  }
  getVertexShaderID(t) {
    return this._getShaderStage(t.vertexShader).id;
  }
  getFragmentShaderID(t) {
    return this._getShaderStage(t.fragmentShader).id;
  }
  dispose() {
    this.shaderCache.clear(), this.materialCache.clear();
  }
  _getShaderCacheForMaterial(t) {
    const e = this.materialCache;
    let n = e.get(t);
    return n === void 0 && (n = /* @__PURE__ */ new Set(), e.set(t, n)), n;
  }
  _getShaderStage(t) {
    const e = this.shaderCache;
    let n = e.get(t);
    return n === void 0 && (n = new Hp(t), e.set(t, n)), n;
  }
}
class Hp {
  constructor(t) {
    this.id = Bp++, this.code = t, this.usedTimes = 0;
  }
}
function Vp(i, t, e, n, s, r, a) {
  const o = new Ra(), l = new zp(), c = /* @__PURE__ */ new Set(), h = [], d = s.logarithmicDepthBuffer, f = s.vertexTextures;
  let m = s.precision;
  const _ = {
    MeshDepthMaterial: "depth",
    MeshDistanceMaterial: "distanceRGBA",
    MeshNormalMaterial: "normal",
    MeshBasicMaterial: "basic",
    MeshLambertMaterial: "lambert",
    MeshPhongMaterial: "phong",
    MeshToonMaterial: "toon",
    MeshStandardMaterial: "physical",
    MeshPhysicalMaterial: "physical",
    MeshMatcapMaterial: "matcap",
    LineBasicMaterial: "basic",
    LineDashedMaterial: "dashed",
    PointsMaterial: "points",
    ShadowMaterial: "shadow",
    SpriteMaterial: "sprite"
  };
  function x(S) {
    return c.add(S), S === 0 ? "uv" : `uv${S}`;
  }
  function p(S, M, C, H, B) {
    const k = H.fog, Z = B.geometry, W = S.isMeshStandardMaterial ? H.environment : null, Q = (S.isMeshStandardMaterial ? e : t).get(S.envMap || W), G = Q && Q.mapping === Vs ? Q.image.height : null, st = _[S.type];
    S.precision !== null && (m = s.getMaxPrecision(S.precision), m !== S.precision && console.warn("THREE.WebGLProgram.getParameters:", S.precision, "not supported, using", m, "instead."));
    const ut = Z.morphAttributes.position || Z.morphAttributes.normal || Z.morphAttributes.color, xt = ut !== void 0 ? ut.length : 0;
    let Ft = 0;
    Z.morphAttributes.position !== void 0 && (Ft = 1), Z.morphAttributes.normal !== void 0 && (Ft = 2), Z.morphAttributes.color !== void 0 && (Ft = 3);
    let Jt, Y, tt, _t;
    if (st) {
      const Zt = Ze[st];
      Jt = Zt.vertexShader, Y = Zt.fragmentShader;
    } else
      Jt = S.vertexShader, Y = S.fragmentShader, l.update(S), tt = l.getVertexShaderID(S), _t = l.getFragmentShaderID(S);
    const rt = i.getRenderTarget(), Tt = i.state.buffers.depth.getReversed(), wt = B.isInstancedMesh === !0, Ot = B.isBatchedMesh === !0, ne = !!S.map, Vt = !!S.matcap, ae = !!Q, w = !!S.aoMap, Ne = !!S.lightMap, Bt = !!S.bumpMap, zt = !!S.normalMap, Mt = !!S.displacementMap, te = !!S.emissiveMap, vt = !!S.metalnessMap, E = !!S.roughnessMap, g = S.anisotropy > 0, F = S.clearcoat > 0, q = S.dispersion > 0, K = S.iridescence > 0, X = S.sheen > 0, gt = S.transmission > 0, at = g && !!S.anisotropyMap, dt = F && !!S.clearcoatMap, Gt = F && !!S.clearcoatNormalMap, J = F && !!S.clearcoatRoughnessMap, ft = K && !!S.iridescenceMap, Et = K && !!S.iridescenceThicknessMap, bt = X && !!S.sheenColorMap, pt = X && !!S.sheenRoughnessMap, Ht = !!S.specularMap, Lt = !!S.specularColorMap, Qt = !!S.specularIntensityMap, L = gt && !!S.transmissionMap, nt = gt && !!S.thicknessMap, V = !!S.gradientMap, j = !!S.alphaMap, lt = S.alphaTest > 0, ot = !!S.alphaHash, Pt = !!S.extensions;
    let ie = An;
    S.toneMapped && (rt === null || rt.isXRRenderTarget === !0) && (ie = i.toneMapping);
    const ve = {
      shaderID: st,
      shaderType: S.type,
      shaderName: S.name,
      vertexShader: Jt,
      fragmentShader: Y,
      defines: S.defines,
      customVertexShaderID: tt,
      customFragmentShaderID: _t,
      isRawShaderMaterial: S.isRawShaderMaterial === !0,
      glslVersion: S.glslVersion,
      precision: m,
      batching: Ot,
      batchingColor: Ot && B._colorsTexture !== null,
      instancing: wt,
      instancingColor: wt && B.instanceColor !== null,
      instancingMorph: wt && B.morphTexture !== null,
      supportsVertexTextures: f,
      outputColorSpace: rt === null ? i.outputColorSpace : rt.isXRRenderTarget === !0 ? rt.texture.colorSpace : Ti,
      alphaToCoverage: !!S.alphaToCoverage,
      map: ne,
      matcap: Vt,
      envMap: ae,
      envMapMode: ae && Q.mapping,
      envMapCubeUVHeight: G,
      aoMap: w,
      lightMap: Ne,
      bumpMap: Bt,
      normalMap: zt,
      displacementMap: f && Mt,
      emissiveMap: te,
      normalMapObjectSpace: zt && S.normalMapType === Lc,
      normalMapTangentSpace: zt && S.normalMapType === Sl,
      metalnessMap: vt,
      roughnessMap: E,
      anisotropy: g,
      anisotropyMap: at,
      clearcoat: F,
      clearcoatMap: dt,
      clearcoatNormalMap: Gt,
      clearcoatRoughnessMap: J,
      dispersion: q,
      iridescence: K,
      iridescenceMap: ft,
      iridescenceThicknessMap: Et,
      sheen: X,
      sheenColorMap: bt,
      sheenRoughnessMap: pt,
      specularMap: Ht,
      specularColorMap: Lt,
      specularIntensityMap: Qt,
      transmission: gt,
      transmissionMap: L,
      thicknessMap: nt,
      gradientMap: V,
      opaque: S.transparent === !1 && S.blending === _i && S.alphaToCoverage === !1,
      alphaMap: j,
      alphaTest: lt,
      alphaHash: ot,
      combine: S.combine,
      //
      mapUv: ne && x(S.map.channel),
      aoMapUv: w && x(S.aoMap.channel),
      lightMapUv: Ne && x(S.lightMap.channel),
      bumpMapUv: Bt && x(S.bumpMap.channel),
      normalMapUv: zt && x(S.normalMap.channel),
      displacementMapUv: Mt && x(S.displacementMap.channel),
      emissiveMapUv: te && x(S.emissiveMap.channel),
      metalnessMapUv: vt && x(S.metalnessMap.channel),
      roughnessMapUv: E && x(S.roughnessMap.channel),
      anisotropyMapUv: at && x(S.anisotropyMap.channel),
      clearcoatMapUv: dt && x(S.clearcoatMap.channel),
      clearcoatNormalMapUv: Gt && x(S.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: J && x(S.clearcoatRoughnessMap.channel),
      iridescenceMapUv: ft && x(S.iridescenceMap.channel),
      iridescenceThicknessMapUv: Et && x(S.iridescenceThicknessMap.channel),
      sheenColorMapUv: bt && x(S.sheenColorMap.channel),
      sheenRoughnessMapUv: pt && x(S.sheenRoughnessMap.channel),
      specularMapUv: Ht && x(S.specularMap.channel),
      specularColorMapUv: Lt && x(S.specularColorMap.channel),
      specularIntensityMapUv: Qt && x(S.specularIntensityMap.channel),
      transmissionMapUv: L && x(S.transmissionMap.channel),
      thicknessMapUv: nt && x(S.thicknessMap.channel),
      alphaMapUv: j && x(S.alphaMap.channel),
      //
      vertexTangents: !!Z.attributes.tangent && (zt || g),
      vertexColors: S.vertexColors,
      vertexAlphas: S.vertexColors === !0 && !!Z.attributes.color && Z.attributes.color.itemSize === 4,
      pointsUvs: B.isPoints === !0 && !!Z.attributes.uv && (ne || j),
      fog: !!k,
      useFog: S.fog === !0,
      fogExp2: !!k && k.isFogExp2,
      flatShading: S.flatShading === !0,
      sizeAttenuation: S.sizeAttenuation === !0,
      logarithmicDepthBuffer: d,
      reverseDepthBuffer: Tt,
      skinning: B.isSkinnedMesh === !0,
      morphTargets: Z.morphAttributes.position !== void 0,
      morphNormals: Z.morphAttributes.normal !== void 0,
      morphColors: Z.morphAttributes.color !== void 0,
      morphTargetsCount: xt,
      morphTextureStride: Ft,
      numDirLights: M.directional.length,
      numPointLights: M.point.length,
      numSpotLights: M.spot.length,
      numSpotLightMaps: M.spotLightMap.length,
      numRectAreaLights: M.rectArea.length,
      numHemiLights: M.hemi.length,
      numDirLightShadows: M.directionalShadowMap.length,
      numPointLightShadows: M.pointShadowMap.length,
      numSpotLightShadows: M.spotShadowMap.length,
      numSpotLightShadowsWithMaps: M.numSpotLightShadowsWithMaps,
      numLightProbes: M.numLightProbes,
      numClippingPlanes: a.numPlanes,
      numClipIntersection: a.numIntersection,
      dithering: S.dithering,
      shadowMapEnabled: i.shadowMap.enabled && C.length > 0,
      shadowMapType: i.shadowMap.type,
      toneMapping: ie,
      decodeVideoTexture: ne && S.map.isVideoTexture === !0 && Xt.getTransfer(S.map.colorSpace) === Kt,
      decodeVideoTextureEmissive: te && S.emissiveMap.isVideoTexture === !0 && Xt.getTransfer(S.emissiveMap.colorSpace) === Kt,
      premultipliedAlpha: S.premultipliedAlpha,
      doubleSided: S.side === cn,
      flipSided: S.side === Ce,
      useDepthPacking: S.depthPacking >= 0,
      depthPacking: S.depthPacking || 0,
      index0AttributeName: S.index0AttributeName,
      extensionClipCullDistance: Pt && S.extensions.clipCullDistance === !0 && n.has("WEBGL_clip_cull_distance"),
      extensionMultiDraw: (Pt && S.extensions.multiDraw === !0 || Ot) && n.has("WEBGL_multi_draw"),
      rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"),
      customProgramCacheKey: S.customProgramCacheKey()
    };
    return ve.vertexUv1s = c.has(1), ve.vertexUv2s = c.has(2), ve.vertexUv3s = c.has(3), c.clear(), ve;
  }
  function u(S) {
    const M = [];
    if (S.shaderID ? M.push(S.shaderID) : (M.push(S.customVertexShaderID), M.push(S.customFragmentShaderID)), S.defines !== void 0)
      for (const C in S.defines)
        M.push(C), M.push(S.defines[C]);
    return S.isRawShaderMaterial === !1 && (b(M, S), T(M, S), M.push(i.outputColorSpace)), M.push(S.customProgramCacheKey), M.join();
  }
  function b(S, M) {
    S.push(M.precision), S.push(M.outputColorSpace), S.push(M.envMapMode), S.push(M.envMapCubeUVHeight), S.push(M.mapUv), S.push(M.alphaMapUv), S.push(M.lightMapUv), S.push(M.aoMapUv), S.push(M.bumpMapUv), S.push(M.normalMapUv), S.push(M.displacementMapUv), S.push(M.emissiveMapUv), S.push(M.metalnessMapUv), S.push(M.roughnessMapUv), S.push(M.anisotropyMapUv), S.push(M.clearcoatMapUv), S.push(M.clearcoatNormalMapUv), S.push(M.clearcoatRoughnessMapUv), S.push(M.iridescenceMapUv), S.push(M.iridescenceThicknessMapUv), S.push(M.sheenColorMapUv), S.push(M.sheenRoughnessMapUv), S.push(M.specularMapUv), S.push(M.specularColorMapUv), S.push(M.specularIntensityMapUv), S.push(M.transmissionMapUv), S.push(M.thicknessMapUv), S.push(M.combine), S.push(M.fogExp2), S.push(M.sizeAttenuation), S.push(M.morphTargetsCount), S.push(M.morphAttributeCount), S.push(M.numDirLights), S.push(M.numPointLights), S.push(M.numSpotLights), S.push(M.numSpotLightMaps), S.push(M.numHemiLights), S.push(M.numRectAreaLights), S.push(M.numDirLightShadows), S.push(M.numPointLightShadows), S.push(M.numSpotLightShadows), S.push(M.numSpotLightShadowsWithMaps), S.push(M.numLightProbes), S.push(M.shadowMapType), S.push(M.toneMapping), S.push(M.numClippingPlanes), S.push(M.numClipIntersection), S.push(M.depthPacking);
  }
  function T(S, M) {
    o.disableAll(), M.supportsVertexTextures && o.enable(0), M.instancing && o.enable(1), M.instancingColor && o.enable(2), M.instancingMorph && o.enable(3), M.matcap && o.enable(4), M.envMap && o.enable(5), M.normalMapObjectSpace && o.enable(6), M.normalMapTangentSpace && o.enable(7), M.clearcoat && o.enable(8), M.iridescence && o.enable(9), M.alphaTest && o.enable(10), M.vertexColors && o.enable(11), M.vertexAlphas && o.enable(12), M.vertexUv1s && o.enable(13), M.vertexUv2s && o.enable(14), M.vertexUv3s && o.enable(15), M.vertexTangents && o.enable(16), M.anisotropy && o.enable(17), M.alphaHash && o.enable(18), M.batching && o.enable(19), M.dispersion && o.enable(20), M.batchingColor && o.enable(21), S.push(o.mask), o.disableAll(), M.fog && o.enable(0), M.useFog && o.enable(1), M.flatShading && o.enable(2), M.logarithmicDepthBuffer && o.enable(3), M.reverseDepthBuffer && o.enable(4), M.skinning && o.enable(5), M.morphTargets && o.enable(6), M.morphNormals && o.enable(7), M.morphColors && o.enable(8), M.premultipliedAlpha && o.enable(9), M.shadowMapEnabled && o.enable(10), M.doubleSided && o.enable(11), M.flipSided && o.enable(12), M.useDepthPacking && o.enable(13), M.dithering && o.enable(14), M.transmission && o.enable(15), M.sheen && o.enable(16), M.opaque && o.enable(17), M.pointsUvs && o.enable(18), M.decodeVideoTexture && o.enable(19), M.decodeVideoTextureEmissive && o.enable(20), M.alphaToCoverage && o.enable(21), S.push(o.mask);
  }
  function y(S) {
    const M = _[S.type];
    let C;
    if (M) {
      const H = Ze[M];
      C = ch.clone(H.uniforms);
    } else
      C = S.uniforms;
    return C;
  }
  function P(S, M) {
    let C;
    for (let H = 0, B = h.length; H < B; H++) {
      const k = h[H];
      if (k.cacheKey === M) {
        C = k, ++C.usedTimes;
        break;
      }
    }
    return C === void 0 && (C = new Op(i, M, S, r), h.push(C)), C;
  }
  function A(S) {
    if (--S.usedTimes === 0) {
      const M = h.indexOf(S);
      h[M] = h[h.length - 1], h.pop(), S.destroy();
    }
  }
  function R(S) {
    l.remove(S);
  }
  function I() {
    l.dispose();
  }
  return {
    getParameters: p,
    getProgramCacheKey: u,
    getUniforms: y,
    acquireProgram: P,
    releaseProgram: A,
    releaseShaderCache: R,
    // Exposed for resource monitoring & error feedback via renderer.info:
    programs: h,
    dispose: I
  };
}
function Gp() {
  let i = /* @__PURE__ */ new WeakMap();
  function t(a) {
    return i.has(a);
  }
  function e(a) {
    let o = i.get(a);
    return o === void 0 && (o = {}, i.set(a, o)), o;
  }
  function n(a) {
    i.delete(a);
  }
  function s(a, o, l) {
    i.get(a)[o] = l;
  }
  function r() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return {
    has: t,
    get: e,
    remove: n,
    update: s,
    dispose: r
  };
}
function kp(i, t) {
  return i.groupOrder !== t.groupOrder ? i.groupOrder - t.groupOrder : i.renderOrder !== t.renderOrder ? i.renderOrder - t.renderOrder : i.material.id !== t.material.id ? i.material.id - t.material.id : i.z !== t.z ? i.z - t.z : i.id - t.id;
}
function Xo(i, t) {
  return i.groupOrder !== t.groupOrder ? i.groupOrder - t.groupOrder : i.renderOrder !== t.renderOrder ? i.renderOrder - t.renderOrder : i.z !== t.z ? t.z - i.z : i.id - t.id;
}
function Yo() {
  const i = [];
  let t = 0;
  const e = [], n = [], s = [];
  function r() {
    t = 0, e.length = 0, n.length = 0, s.length = 0;
  }
  function a(d, f, m, _, x, p) {
    let u = i[t];
    return u === void 0 ? (u = {
      id: d.id,
      object: d,
      geometry: f,
      material: m,
      groupOrder: _,
      renderOrder: d.renderOrder,
      z: x,
      group: p
    }, i[t] = u) : (u.id = d.id, u.object = d, u.geometry = f, u.material = m, u.groupOrder = _, u.renderOrder = d.renderOrder, u.z = x, u.group = p), t++, u;
  }
  function o(d, f, m, _, x, p) {
    const u = a(d, f, m, _, x, p);
    m.transmission > 0 ? n.push(u) : m.transparent === !0 ? s.push(u) : e.push(u);
  }
  function l(d, f, m, _, x, p) {
    const u = a(d, f, m, _, x, p);
    m.transmission > 0 ? n.unshift(u) : m.transparent === !0 ? s.unshift(u) : e.unshift(u);
  }
  function c(d, f) {
    e.length > 1 && e.sort(d || kp), n.length > 1 && n.sort(f || Xo), s.length > 1 && s.sort(f || Xo);
  }
  function h() {
    for (let d = t, f = i.length; d < f; d++) {
      const m = i[d];
      if (m.id === null) break;
      m.id = null, m.object = null, m.geometry = null, m.material = null, m.group = null;
    }
  }
  return {
    opaque: e,
    transmissive: n,
    transparent: s,
    init: r,
    push: o,
    unshift: l,
    finish: h,
    sort: c
  };
}
function Wp() {
  let i = /* @__PURE__ */ new WeakMap();
  function t(n, s) {
    const r = i.get(n);
    let a;
    return r === void 0 ? (a = new Yo(), i.set(n, [a])) : s >= r.length ? (a = new Yo(), r.push(a)) : a = r[s], a;
  }
  function e() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: t,
    dispose: e
  };
}
function Xp() {
  const i = {};
  return {
    get: function(t) {
      if (i[t.id] !== void 0)
        return i[t.id];
      let e;
      switch (t.type) {
        case "DirectionalLight":
          e = {
            direction: new D(),
            color: new It()
          };
          break;
        case "SpotLight":
          e = {
            position: new D(),
            direction: new D(),
            color: new It(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0
          };
          break;
        case "PointLight":
          e = {
            position: new D(),
            color: new It(),
            distance: 0,
            decay: 0
          };
          break;
        case "HemisphereLight":
          e = {
            direction: new D(),
            skyColor: new It(),
            groundColor: new It()
          };
          break;
        case "RectAreaLight":
          e = {
            color: new It(),
            position: new D(),
            halfWidth: new D(),
            halfHeight: new D()
          };
          break;
      }
      return i[t.id] = e, e;
    }
  };
}
function Yp() {
  const i = {};
  return {
    get: function(t) {
      if (i[t.id] !== void 0)
        return i[t.id];
      let e;
      switch (t.type) {
        case "DirectionalLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Ct()
          };
          break;
        case "SpotLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Ct()
          };
          break;
        case "PointLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Ct(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3
          };
          break;
      }
      return i[t.id] = e, e;
    }
  };
}
let qp = 0;
function jp(i, t) {
  return (t.castShadow ? 2 : 0) - (i.castShadow ? 2 : 0) + (t.map ? 1 : 0) - (i.map ? 1 : 0);
}
function Zp(i) {
  const t = new Xp(), e = Yp(), n = {
    version: 0,
    hash: {
      directionalLength: -1,
      pointLength: -1,
      spotLength: -1,
      rectAreaLength: -1,
      hemiLength: -1,
      numDirectionalShadows: -1,
      numPointShadows: -1,
      numSpotShadows: -1,
      numSpotMaps: -1,
      numLightProbes: -1
    },
    ambient: [0, 0, 0],
    probe: [],
    directional: [],
    directionalShadow: [],
    directionalShadowMap: [],
    directionalShadowMatrix: [],
    spot: [],
    spotLightMap: [],
    spotShadow: [],
    spotShadowMap: [],
    spotLightMatrix: [],
    rectArea: [],
    rectAreaLTC1: null,
    rectAreaLTC2: null,
    point: [],
    pointShadow: [],
    pointShadowMap: [],
    pointShadowMatrix: [],
    hemi: [],
    numSpotLightShadowsWithMaps: 0,
    numLightProbes: 0
  };
  for (let c = 0; c < 9; c++) n.probe.push(new D());
  const s = new D(), r = new Yt(), a = new Yt();
  function o(c) {
    let h = 0, d = 0, f = 0;
    for (let S = 0; S < 9; S++) n.probe[S].set(0, 0, 0);
    let m = 0, _ = 0, x = 0, p = 0, u = 0, b = 0, T = 0, y = 0, P = 0, A = 0, R = 0;
    c.sort(jp);
    for (let S = 0, M = c.length; S < M; S++) {
      const C = c[S], H = C.color, B = C.intensity, k = C.distance, Z = C.shadow && C.shadow.map ? C.shadow.map.texture : null;
      if (C.isAmbientLight)
        h += H.r * B, d += H.g * B, f += H.b * B;
      else if (C.isLightProbe) {
        for (let W = 0; W < 9; W++)
          n.probe[W].addScaledVector(C.sh.coefficients[W], B);
        R++;
      } else if (C.isDirectionalLight) {
        const W = t.get(C);
        if (W.color.copy(C.color).multiplyScalar(C.intensity), C.castShadow) {
          const Q = C.shadow, G = e.get(C);
          G.shadowIntensity = Q.intensity, G.shadowBias = Q.bias, G.shadowNormalBias = Q.normalBias, G.shadowRadius = Q.radius, G.shadowMapSize = Q.mapSize, n.directionalShadow[m] = G, n.directionalShadowMap[m] = Z, n.directionalShadowMatrix[m] = C.shadow.matrix, b++;
        }
        n.directional[m] = W, m++;
      } else if (C.isSpotLight) {
        const W = t.get(C);
        W.position.setFromMatrixPosition(C.matrixWorld), W.color.copy(H).multiplyScalar(B), W.distance = k, W.coneCos = Math.cos(C.angle), W.penumbraCos = Math.cos(C.angle * (1 - C.penumbra)), W.decay = C.decay, n.spot[x] = W;
        const Q = C.shadow;
        if (C.map && (n.spotLightMap[P] = C.map, P++, Q.updateMatrices(C), C.castShadow && A++), n.spotLightMatrix[x] = Q.matrix, C.castShadow) {
          const G = e.get(C);
          G.shadowIntensity = Q.intensity, G.shadowBias = Q.bias, G.shadowNormalBias = Q.normalBias, G.shadowRadius = Q.radius, G.shadowMapSize = Q.mapSize, n.spotShadow[x] = G, n.spotShadowMap[x] = Z, y++;
        }
        x++;
      } else if (C.isRectAreaLight) {
        const W = t.get(C);
        W.color.copy(H).multiplyScalar(B), W.halfWidth.set(C.width * 0.5, 0, 0), W.halfHeight.set(0, C.height * 0.5, 0), n.rectArea[p] = W, p++;
      } else if (C.isPointLight) {
        const W = t.get(C);
        if (W.color.copy(C.color).multiplyScalar(C.intensity), W.distance = C.distance, W.decay = C.decay, C.castShadow) {
          const Q = C.shadow, G = e.get(C);
          G.shadowIntensity = Q.intensity, G.shadowBias = Q.bias, G.shadowNormalBias = Q.normalBias, G.shadowRadius = Q.radius, G.shadowMapSize = Q.mapSize, G.shadowCameraNear = Q.camera.near, G.shadowCameraFar = Q.camera.far, n.pointShadow[_] = G, n.pointShadowMap[_] = Z, n.pointShadowMatrix[_] = C.shadow.matrix, T++;
        }
        n.point[_] = W, _++;
      } else if (C.isHemisphereLight) {
        const W = t.get(C);
        W.skyColor.copy(C.color).multiplyScalar(B), W.groundColor.copy(C.groundColor).multiplyScalar(B), n.hemi[u] = W, u++;
      }
    }
    p > 0 && (i.has("OES_texture_float_linear") === !0 ? (n.rectAreaLTC1 = et.LTC_FLOAT_1, n.rectAreaLTC2 = et.LTC_FLOAT_2) : (n.rectAreaLTC1 = et.LTC_HALF_1, n.rectAreaLTC2 = et.LTC_HALF_2)), n.ambient[0] = h, n.ambient[1] = d, n.ambient[2] = f;
    const I = n.hash;
    (I.directionalLength !== m || I.pointLength !== _ || I.spotLength !== x || I.rectAreaLength !== p || I.hemiLength !== u || I.numDirectionalShadows !== b || I.numPointShadows !== T || I.numSpotShadows !== y || I.numSpotMaps !== P || I.numLightProbes !== R) && (n.directional.length = m, n.spot.length = x, n.rectArea.length = p, n.point.length = _, n.hemi.length = u, n.directionalShadow.length = b, n.directionalShadowMap.length = b, n.pointShadow.length = T, n.pointShadowMap.length = T, n.spotShadow.length = y, n.spotShadowMap.length = y, n.directionalShadowMatrix.length = b, n.pointShadowMatrix.length = T, n.spotLightMatrix.length = y + P - A, n.spotLightMap.length = P, n.numSpotLightShadowsWithMaps = A, n.numLightProbes = R, I.directionalLength = m, I.pointLength = _, I.spotLength = x, I.rectAreaLength = p, I.hemiLength = u, I.numDirectionalShadows = b, I.numPointShadows = T, I.numSpotShadows = y, I.numSpotMaps = P, I.numLightProbes = R, n.version = qp++);
  }
  function l(c, h) {
    let d = 0, f = 0, m = 0, _ = 0, x = 0;
    const p = h.matrixWorldInverse;
    for (let u = 0, b = c.length; u < b; u++) {
      const T = c[u];
      if (T.isDirectionalLight) {
        const y = n.directional[d];
        y.direction.setFromMatrixPosition(T.matrixWorld), s.setFromMatrixPosition(T.target.matrixWorld), y.direction.sub(s), y.direction.transformDirection(p), d++;
      } else if (T.isSpotLight) {
        const y = n.spot[m];
        y.position.setFromMatrixPosition(T.matrixWorld), y.position.applyMatrix4(p), y.direction.setFromMatrixPosition(T.matrixWorld), s.setFromMatrixPosition(T.target.matrixWorld), y.direction.sub(s), y.direction.transformDirection(p), m++;
      } else if (T.isRectAreaLight) {
        const y = n.rectArea[_];
        y.position.setFromMatrixPosition(T.matrixWorld), y.position.applyMatrix4(p), a.identity(), r.copy(T.matrixWorld), r.premultiply(p), a.extractRotation(r), y.halfWidth.set(T.width * 0.5, 0, 0), y.halfHeight.set(0, T.height * 0.5, 0), y.halfWidth.applyMatrix4(a), y.halfHeight.applyMatrix4(a), _++;
      } else if (T.isPointLight) {
        const y = n.point[f];
        y.position.setFromMatrixPosition(T.matrixWorld), y.position.applyMatrix4(p), f++;
      } else if (T.isHemisphereLight) {
        const y = n.hemi[x];
        y.direction.setFromMatrixPosition(T.matrixWorld), y.direction.transformDirection(p), x++;
      }
    }
  }
  return {
    setup: o,
    setupView: l,
    state: n
  };
}
function qo(i) {
  const t = new Zp(i), e = [], n = [];
  function s(h) {
    c.camera = h, e.length = 0, n.length = 0;
  }
  function r(h) {
    e.push(h);
  }
  function a(h) {
    n.push(h);
  }
  function o() {
    t.setup(e);
  }
  function l(h) {
    t.setupView(e, h);
  }
  const c = {
    lightsArray: e,
    shadowsArray: n,
    camera: null,
    lights: t,
    transmissionRenderTarget: {}
  };
  return {
    init: s,
    state: c,
    setupLights: o,
    setupLightsView: l,
    pushLight: r,
    pushShadow: a
  };
}
function Kp(i) {
  let t = /* @__PURE__ */ new WeakMap();
  function e(s, r = 0) {
    const a = t.get(s);
    let o;
    return a === void 0 ? (o = new qo(i), t.set(s, [o])) : r >= a.length ? (o = new qo(i), a.push(o)) : o = a[r], o;
  }
  function n() {
    t = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: e,
    dispose: n
  };
}
const $p = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, Jp = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
function Qp(i, t, e) {
  let n = new Pa();
  const s = new Ct(), r = new Ct(), a = new re(), o = new Sh({ depthPacking: Dc }), l = new yh(), c = {}, h = e.maxTextureSize, d = { [wn]: Ce, [Ce]: wn, [cn]: cn }, f = new fn({
    defines: {
      VSM_SAMPLES: 8
    },
    uniforms: {
      shadow_pass: { value: null },
      resolution: { value: new Ct() },
      radius: { value: 4 }
    },
    vertexShader: $p,
    fragmentShader: Jp
  }), m = f.clone();
  m.defines.HORIZONTAL_PASS = 1;
  const _ = new Ie();
  _.setAttribute(
    "position",
    new ge(
      new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]),
      3
    )
  );
  const x = new Ee(_, f), p = this;
  this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = cl;
  let u = this.type;
  this.render = function(A, R, I) {
    if (p.enabled === !1 || p.autoUpdate === !1 && p.needsUpdate === !1 || A.length === 0) return;
    const S = i.getRenderTarget(), M = i.getActiveCubeFace(), C = i.getActiveMipmapLevel(), H = i.state;
    H.setBlending(bn), H.buffers.color.setClear(1, 1, 1, 1), H.buffers.depth.setTest(!0), H.setScissorTest(!1);
    const B = u !== ln && this.type === ln, k = u === ln && this.type !== ln;
    for (let Z = 0, W = A.length; Z < W; Z++) {
      const Q = A[Z], G = Q.shadow;
      if (G === void 0) {
        console.warn("THREE.WebGLShadowMap:", Q, "has no shadow.");
        continue;
      }
      if (G.autoUpdate === !1 && G.needsUpdate === !1) continue;
      s.copy(G.mapSize);
      const st = G.getFrameExtents();
      if (s.multiply(st), r.copy(G.mapSize), (s.x > h || s.y > h) && (s.x > h && (r.x = Math.floor(h / st.x), s.x = r.x * st.x, G.mapSize.x = r.x), s.y > h && (r.y = Math.floor(h / st.y), s.y = r.y * st.y, G.mapSize.y = r.y)), G.map === null || B === !0 || k === !0) {
        const xt = this.type !== ln ? { minFilter: Ue, magFilter: Ue } : {};
        G.map !== null && G.map.dispose(), G.map = new kn(s.x, s.y, xt), G.map.texture.name = Q.name + ".shadowMap", G.camera.updateProjectionMatrix();
      }
      i.setRenderTarget(G.map), i.clear();
      const ut = G.getViewportCount();
      for (let xt = 0; xt < ut; xt++) {
        const Ft = G.getViewport(xt);
        a.set(
          r.x * Ft.x,
          r.y * Ft.y,
          r.x * Ft.z,
          r.y * Ft.w
        ), H.viewport(a), G.updateMatrices(Q, xt), n = G.getFrustum(), y(R, I, G.camera, Q, this.type);
      }
      G.isPointLightShadow !== !0 && this.type === ln && b(G, I), G.needsUpdate = !1;
    }
    u = this.type, p.needsUpdate = !1, i.setRenderTarget(S, M, C);
  };
  function b(A, R) {
    const I = t.update(x);
    f.defines.VSM_SAMPLES !== A.blurSamples && (f.defines.VSM_SAMPLES = A.blurSamples, m.defines.VSM_SAMPLES = A.blurSamples, f.needsUpdate = !0, m.needsUpdate = !0), A.mapPass === null && (A.mapPass = new kn(s.x, s.y)), f.uniforms.shadow_pass.value = A.map.texture, f.uniforms.resolution.value = A.mapSize, f.uniforms.radius.value = A.radius, i.setRenderTarget(A.mapPass), i.clear(), i.renderBufferDirect(R, null, I, f, x, null), m.uniforms.shadow_pass.value = A.mapPass.texture, m.uniforms.resolution.value = A.mapSize, m.uniforms.radius.value = A.radius, i.setRenderTarget(A.map), i.clear(), i.renderBufferDirect(R, null, I, m, x, null);
  }
  function T(A, R, I, S) {
    let M = null;
    const C = I.isPointLight === !0 ? A.customDistanceMaterial : A.customDepthMaterial;
    if (C !== void 0)
      M = C;
    else if (M = I.isPointLight === !0 ? l : o, i.localClippingEnabled && R.clipShadows === !0 && Array.isArray(R.clippingPlanes) && R.clippingPlanes.length !== 0 || R.displacementMap && R.displacementScale !== 0 || R.alphaMap && R.alphaTest > 0 || R.map && R.alphaTest > 0) {
      const H = M.uuid, B = R.uuid;
      let k = c[H];
      k === void 0 && (k = {}, c[H] = k);
      let Z = k[B];
      Z === void 0 && (Z = M.clone(), k[B] = Z, R.addEventListener("dispose", P)), M = Z;
    }
    if (M.visible = R.visible, M.wireframe = R.wireframe, S === ln ? M.side = R.shadowSide !== null ? R.shadowSide : R.side : M.side = R.shadowSide !== null ? R.shadowSide : d[R.side], M.alphaMap = R.alphaMap, M.alphaTest = R.alphaTest, M.map = R.map, M.clipShadows = R.clipShadows, M.clippingPlanes = R.clippingPlanes, M.clipIntersection = R.clipIntersection, M.displacementMap = R.displacementMap, M.displacementScale = R.displacementScale, M.displacementBias = R.displacementBias, M.wireframeLinewidth = R.wireframeLinewidth, M.linewidth = R.linewidth, I.isPointLight === !0 && M.isMeshDistanceMaterial === !0) {
      const H = i.properties.get(M);
      H.light = I;
    }
    return M;
  }
  function y(A, R, I, S, M) {
    if (A.visible === !1) return;
    if (A.layers.test(R.layers) && (A.isMesh || A.isLine || A.isPoints) && (A.castShadow || A.receiveShadow && M === ln) && (!A.frustumCulled || n.intersectsObject(A))) {
      A.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse, A.matrixWorld);
      const B = t.update(A), k = A.material;
      if (Array.isArray(k)) {
        const Z = B.groups;
        for (let W = 0, Q = Z.length; W < Q; W++) {
          const G = Z[W], st = k[G.materialIndex];
          if (st && st.visible) {
            const ut = T(A, st, S, M);
            A.onBeforeShadow(i, A, R, I, B, ut, G), i.renderBufferDirect(I, null, B, ut, A, G), A.onAfterShadow(i, A, R, I, B, ut, G);
          }
        }
      } else if (k.visible) {
        const Z = T(A, k, S, M);
        A.onBeforeShadow(i, A, R, I, B, Z, null), i.renderBufferDirect(I, null, B, Z, A, null), A.onAfterShadow(i, A, R, I, B, Z, null);
      }
    }
    const H = A.children;
    for (let B = 0, k = H.length; B < k; B++)
      y(H[B], R, I, S, M);
  }
  function P(A) {
    A.target.removeEventListener("dispose", P);
    for (const I in c) {
      const S = c[I], M = A.target.uuid;
      M in S && (S[M].dispose(), delete S[M]);
    }
  }
}
const tm = {
  [Pr]: Dr,
  [Lr]: Nr,
  [Ur]: Fr,
  [xi]: Ir,
  [Dr]: Pr,
  [Nr]: Lr,
  [Fr]: Ur,
  [Ir]: xi
};
function em(i, t) {
  function e() {
    let L = !1;
    const nt = new re();
    let V = null;
    const j = new re(0, 0, 0, 0);
    return {
      setMask: function(lt) {
        V !== lt && !L && (i.colorMask(lt, lt, lt, lt), V = lt);
      },
      setLocked: function(lt) {
        L = lt;
      },
      setClear: function(lt, ot, Pt, ie, ve) {
        ve === !0 && (lt *= ie, ot *= ie, Pt *= ie), nt.set(lt, ot, Pt, ie), j.equals(nt) === !1 && (i.clearColor(lt, ot, Pt, ie), j.copy(nt));
      },
      reset: function() {
        L = !1, V = null, j.set(-1, 0, 0, 0);
      }
    };
  }
  function n() {
    let L = !1, nt = !1, V = null, j = null, lt = null;
    return {
      setReversed: function(ot) {
        if (nt !== ot) {
          const Pt = t.get("EXT_clip_control");
          nt ? Pt.clipControlEXT(Pt.LOWER_LEFT_EXT, Pt.ZERO_TO_ONE_EXT) : Pt.clipControlEXT(Pt.LOWER_LEFT_EXT, Pt.NEGATIVE_ONE_TO_ONE_EXT);
          const ie = lt;
          lt = null, this.setClear(ie);
        }
        nt = ot;
      },
      getReversed: function() {
        return nt;
      },
      setTest: function(ot) {
        ot ? rt(i.DEPTH_TEST) : Tt(i.DEPTH_TEST);
      },
      setMask: function(ot) {
        V !== ot && !L && (i.depthMask(ot), V = ot);
      },
      setFunc: function(ot) {
        if (nt && (ot = tm[ot]), j !== ot) {
          switch (ot) {
            case Pr:
              i.depthFunc(i.NEVER);
              break;
            case Dr:
              i.depthFunc(i.ALWAYS);
              break;
            case Lr:
              i.depthFunc(i.LESS);
              break;
            case xi:
              i.depthFunc(i.LEQUAL);
              break;
            case Ur:
              i.depthFunc(i.EQUAL);
              break;
            case Ir:
              i.depthFunc(i.GEQUAL);
              break;
            case Nr:
              i.depthFunc(i.GREATER);
              break;
            case Fr:
              i.depthFunc(i.NOTEQUAL);
              break;
            default:
              i.depthFunc(i.LEQUAL);
          }
          j = ot;
        }
      },
      setLocked: function(ot) {
        L = ot;
      },
      setClear: function(ot) {
        lt !== ot && (nt && (ot = 1 - ot), i.clearDepth(ot), lt = ot);
      },
      reset: function() {
        L = !1, V = null, j = null, lt = null, nt = !1;
      }
    };
  }
  function s() {
    let L = !1, nt = null, V = null, j = null, lt = null, ot = null, Pt = null, ie = null, ve = null;
    return {
      setTest: function(Zt) {
        L || (Zt ? rt(i.STENCIL_TEST) : Tt(i.STENCIL_TEST));
      },
      setMask: function(Zt) {
        nt !== Zt && !L && (i.stencilMask(Zt), nt = Zt);
      },
      setFunc: function(Zt, Ve, tn) {
        (V !== Zt || j !== Ve || lt !== tn) && (i.stencilFunc(Zt, Ve, tn), V = Zt, j = Ve, lt = tn);
      },
      setOp: function(Zt, Ve, tn) {
        (ot !== Zt || Pt !== Ve || ie !== tn) && (i.stencilOp(Zt, Ve, tn), ot = Zt, Pt = Ve, ie = tn);
      },
      setLocked: function(Zt) {
        L = Zt;
      },
      setClear: function(Zt) {
        ve !== Zt && (i.clearStencil(Zt), ve = Zt);
      },
      reset: function() {
        L = !1, nt = null, V = null, j = null, lt = null, ot = null, Pt = null, ie = null, ve = null;
      }
    };
  }
  const r = new e(), a = new n(), o = new s(), l = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap();
  let h = {}, d = {}, f = /* @__PURE__ */ new WeakMap(), m = [], _ = null, x = !1, p = null, u = null, b = null, T = null, y = null, P = null, A = null, R = new It(0, 0, 0), I = 0, S = !1, M = null, C = null, H = null, B = null, k = null;
  const Z = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let W = !1, Q = 0;
  const G = i.getParameter(i.VERSION);
  G.indexOf("WebGL") !== -1 ? (Q = parseFloat(/^WebGL (\d)/.exec(G)[1]), W = Q >= 1) : G.indexOf("OpenGL ES") !== -1 && (Q = parseFloat(/^OpenGL ES (\d)/.exec(G)[1]), W = Q >= 2);
  let st = null, ut = {};
  const xt = i.getParameter(i.SCISSOR_BOX), Ft = i.getParameter(i.VIEWPORT), Jt = new re().fromArray(xt), Y = new re().fromArray(Ft);
  function tt(L, nt, V, j) {
    const lt = new Uint8Array(4), ot = i.createTexture();
    i.bindTexture(L, ot), i.texParameteri(L, i.TEXTURE_MIN_FILTER, i.NEAREST), i.texParameteri(L, i.TEXTURE_MAG_FILTER, i.NEAREST);
    for (let Pt = 0; Pt < V; Pt++)
      L === i.TEXTURE_3D || L === i.TEXTURE_2D_ARRAY ? i.texImage3D(nt, 0, i.RGBA, 1, 1, j, 0, i.RGBA, i.UNSIGNED_BYTE, lt) : i.texImage2D(nt + Pt, 0, i.RGBA, 1, 1, 0, i.RGBA, i.UNSIGNED_BYTE, lt);
    return ot;
  }
  const _t = {};
  _t[i.TEXTURE_2D] = tt(i.TEXTURE_2D, i.TEXTURE_2D, 1), _t[i.TEXTURE_CUBE_MAP] = tt(i.TEXTURE_CUBE_MAP, i.TEXTURE_CUBE_MAP_POSITIVE_X, 6), _t[i.TEXTURE_2D_ARRAY] = tt(i.TEXTURE_2D_ARRAY, i.TEXTURE_2D_ARRAY, 1, 1), _t[i.TEXTURE_3D] = tt(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1), r.setClear(0, 0, 0, 1), a.setClear(1), o.setClear(0), rt(i.DEPTH_TEST), a.setFunc(xi), Bt(!1), zt(Ga), rt(i.CULL_FACE), w(bn);
  function rt(L) {
    h[L] !== !0 && (i.enable(L), h[L] = !0);
  }
  function Tt(L) {
    h[L] !== !1 && (i.disable(L), h[L] = !1);
  }
  function wt(L, nt) {
    return d[L] !== nt ? (i.bindFramebuffer(L, nt), d[L] = nt, L === i.DRAW_FRAMEBUFFER && (d[i.FRAMEBUFFER] = nt), L === i.FRAMEBUFFER && (d[i.DRAW_FRAMEBUFFER] = nt), !0) : !1;
  }
  function Ot(L, nt) {
    let V = m, j = !1;
    if (L) {
      V = f.get(nt), V === void 0 && (V = [], f.set(nt, V));
      const lt = L.textures;
      if (V.length !== lt.length || V[0] !== i.COLOR_ATTACHMENT0) {
        for (let ot = 0, Pt = lt.length; ot < Pt; ot++)
          V[ot] = i.COLOR_ATTACHMENT0 + ot;
        V.length = lt.length, j = !0;
      }
    } else
      V[0] !== i.BACK && (V[0] = i.BACK, j = !0);
    j && i.drawBuffers(V);
  }
  function ne(L) {
    return _ !== L ? (i.useProgram(L), _ = L, !0) : !1;
  }
  const Vt = {
    [Bn]: i.FUNC_ADD,
    [ic]: i.FUNC_SUBTRACT,
    [sc]: i.FUNC_REVERSE_SUBTRACT
  };
  Vt[rc] = i.MIN, Vt[ac] = i.MAX;
  const ae = {
    [oc]: i.ZERO,
    [lc]: i.ONE,
    [cc]: i.SRC_COLOR,
    [Rr]: i.SRC_ALPHA,
    [mc]: i.SRC_ALPHA_SATURATE,
    [fc]: i.DST_COLOR,
    [uc]: i.DST_ALPHA,
    [hc]: i.ONE_MINUS_SRC_COLOR,
    [Cr]: i.ONE_MINUS_SRC_ALPHA,
    [pc]: i.ONE_MINUS_DST_COLOR,
    [dc]: i.ONE_MINUS_DST_ALPHA,
    [_c]: i.CONSTANT_COLOR,
    [gc]: i.ONE_MINUS_CONSTANT_COLOR,
    [vc]: i.CONSTANT_ALPHA,
    [xc]: i.ONE_MINUS_CONSTANT_ALPHA
  };
  function w(L, nt, V, j, lt, ot, Pt, ie, ve, Zt) {
    if (L === bn) {
      x === !0 && (Tt(i.BLEND), x = !1);
      return;
    }
    if (x === !1 && (rt(i.BLEND), x = !0), L !== nc) {
      if (L !== p || Zt !== S) {
        if ((u !== Bn || y !== Bn) && (i.blendEquation(i.FUNC_ADD), u = Bn, y = Bn), Zt)
          switch (L) {
            case _i:
              i.blendFuncSeparate(i.ONE, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case ka:
              i.blendFunc(i.ONE, i.ONE);
              break;
            case Wa:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case Xa:
              i.blendFuncSeparate(i.ZERO, i.SRC_COLOR, i.ZERO, i.SRC_ALPHA);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", L);
              break;
          }
        else
          switch (L) {
            case _i:
              i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case ka:
              i.blendFunc(i.SRC_ALPHA, i.ONE);
              break;
            case Wa:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case Xa:
              i.blendFunc(i.ZERO, i.SRC_COLOR);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", L);
              break;
          }
        b = null, T = null, P = null, A = null, R.set(0, 0, 0), I = 0, p = L, S = Zt;
      }
      return;
    }
    lt = lt || nt, ot = ot || V, Pt = Pt || j, (nt !== u || lt !== y) && (i.blendEquationSeparate(Vt[nt], Vt[lt]), u = nt, y = lt), (V !== b || j !== T || ot !== P || Pt !== A) && (i.blendFuncSeparate(ae[V], ae[j], ae[ot], ae[Pt]), b = V, T = j, P = ot, A = Pt), (ie.equals(R) === !1 || ve !== I) && (i.blendColor(ie.r, ie.g, ie.b, ve), R.copy(ie), I = ve), p = L, S = !1;
  }
  function Ne(L, nt) {
    L.side === cn ? Tt(i.CULL_FACE) : rt(i.CULL_FACE);
    let V = L.side === Ce;
    nt && (V = !V), Bt(V), L.blending === _i && L.transparent === !1 ? w(bn) : w(L.blending, L.blendEquation, L.blendSrc, L.blendDst, L.blendEquationAlpha, L.blendSrcAlpha, L.blendDstAlpha, L.blendColor, L.blendAlpha, L.premultipliedAlpha), a.setFunc(L.depthFunc), a.setTest(L.depthTest), a.setMask(L.depthWrite), r.setMask(L.colorWrite);
    const j = L.stencilWrite;
    o.setTest(j), j && (o.setMask(L.stencilWriteMask), o.setFunc(L.stencilFunc, L.stencilRef, L.stencilFuncMask), o.setOp(L.stencilFail, L.stencilZFail, L.stencilZPass)), te(L.polygonOffset, L.polygonOffsetFactor, L.polygonOffsetUnits), L.alphaToCoverage === !0 ? rt(i.SAMPLE_ALPHA_TO_COVERAGE) : Tt(i.SAMPLE_ALPHA_TO_COVERAGE);
  }
  function Bt(L) {
    M !== L && (L ? i.frontFace(i.CW) : i.frontFace(i.CCW), M = L);
  }
  function zt(L) {
    L !== Ql ? (rt(i.CULL_FACE), L !== C && (L === Ga ? i.cullFace(i.BACK) : L === tc ? i.cullFace(i.FRONT) : i.cullFace(i.FRONT_AND_BACK))) : Tt(i.CULL_FACE), C = L;
  }
  function Mt(L) {
    L !== H && (W && i.lineWidth(L), H = L);
  }
  function te(L, nt, V) {
    L ? (rt(i.POLYGON_OFFSET_FILL), (B !== nt || k !== V) && (i.polygonOffset(nt, V), B = nt, k = V)) : Tt(i.POLYGON_OFFSET_FILL);
  }
  function vt(L) {
    L ? rt(i.SCISSOR_TEST) : Tt(i.SCISSOR_TEST);
  }
  function E(L) {
    L === void 0 && (L = i.TEXTURE0 + Z - 1), st !== L && (i.activeTexture(L), st = L);
  }
  function g(L, nt, V) {
    V === void 0 && (st === null ? V = i.TEXTURE0 + Z - 1 : V = st);
    let j = ut[V];
    j === void 0 && (j = { type: void 0, texture: void 0 }, ut[V] = j), (j.type !== L || j.texture !== nt) && (st !== V && (i.activeTexture(V), st = V), i.bindTexture(L, nt || _t[L]), j.type = L, j.texture = nt);
  }
  function F() {
    const L = ut[st];
    L !== void 0 && L.type !== void 0 && (i.bindTexture(L.type, null), L.type = void 0, L.texture = void 0);
  }
  function q() {
    try {
      i.compressedTexImage2D.apply(i, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function K() {
    try {
      i.compressedTexImage3D.apply(i, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function X() {
    try {
      i.texSubImage2D.apply(i, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function gt() {
    try {
      i.texSubImage3D.apply(i, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function at() {
    try {
      i.compressedTexSubImage2D.apply(i, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function dt() {
    try {
      i.compressedTexSubImage3D.apply(i, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function Gt() {
    try {
      i.texStorage2D.apply(i, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function J() {
    try {
      i.texStorage3D.apply(i, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function ft() {
    try {
      i.texImage2D.apply(i, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function Et() {
    try {
      i.texImage3D.apply(i, arguments);
    } catch (L) {
      console.error("THREE.WebGLState:", L);
    }
  }
  function bt(L) {
    Jt.equals(L) === !1 && (i.scissor(L.x, L.y, L.z, L.w), Jt.copy(L));
  }
  function pt(L) {
    Y.equals(L) === !1 && (i.viewport(L.x, L.y, L.z, L.w), Y.copy(L));
  }
  function Ht(L, nt) {
    let V = c.get(nt);
    V === void 0 && (V = /* @__PURE__ */ new WeakMap(), c.set(nt, V));
    let j = V.get(L);
    j === void 0 && (j = i.getUniformBlockIndex(nt, L.name), V.set(L, j));
  }
  function Lt(L, nt) {
    const j = c.get(nt).get(L);
    l.get(nt) !== j && (i.uniformBlockBinding(nt, j, L.__bindingPointIndex), l.set(nt, j));
  }
  function Qt() {
    i.disable(i.BLEND), i.disable(i.CULL_FACE), i.disable(i.DEPTH_TEST), i.disable(i.POLYGON_OFFSET_FILL), i.disable(i.SCISSOR_TEST), i.disable(i.STENCIL_TEST), i.disable(i.SAMPLE_ALPHA_TO_COVERAGE), i.blendEquation(i.FUNC_ADD), i.blendFunc(i.ONE, i.ZERO), i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO), i.blendColor(0, 0, 0, 0), i.colorMask(!0, !0, !0, !0), i.clearColor(0, 0, 0, 0), i.depthMask(!0), i.depthFunc(i.LESS), a.setReversed(!1), i.clearDepth(1), i.stencilMask(4294967295), i.stencilFunc(i.ALWAYS, 0, 4294967295), i.stencilOp(i.KEEP, i.KEEP, i.KEEP), i.clearStencil(0), i.cullFace(i.BACK), i.frontFace(i.CCW), i.polygonOffset(0, 0), i.activeTexture(i.TEXTURE0), i.bindFramebuffer(i.FRAMEBUFFER, null), i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), i.bindFramebuffer(i.READ_FRAMEBUFFER, null), i.useProgram(null), i.lineWidth(1), i.scissor(0, 0, i.canvas.width, i.canvas.height), i.viewport(0, 0, i.canvas.width, i.canvas.height), h = {}, st = null, ut = {}, d = {}, f = /* @__PURE__ */ new WeakMap(), m = [], _ = null, x = !1, p = null, u = null, b = null, T = null, y = null, P = null, A = null, R = new It(0, 0, 0), I = 0, S = !1, M = null, C = null, H = null, B = null, k = null, Jt.set(0, 0, i.canvas.width, i.canvas.height), Y.set(0, 0, i.canvas.width, i.canvas.height), r.reset(), a.reset(), o.reset();
  }
  return {
    buffers: {
      color: r,
      depth: a,
      stencil: o
    },
    enable: rt,
    disable: Tt,
    bindFramebuffer: wt,
    drawBuffers: Ot,
    useProgram: ne,
    setBlending: w,
    setMaterial: Ne,
    setFlipSided: Bt,
    setCullFace: zt,
    setLineWidth: Mt,
    setPolygonOffset: te,
    setScissorTest: vt,
    activeTexture: E,
    bindTexture: g,
    unbindTexture: F,
    compressedTexImage2D: q,
    compressedTexImage3D: K,
    texImage2D: ft,
    texImage3D: Et,
    updateUBOMapping: Ht,
    uniformBlockBinding: Lt,
    texStorage2D: Gt,
    texStorage3D: J,
    texSubImage2D: X,
    texSubImage3D: gt,
    compressedTexSubImage2D: at,
    compressedTexSubImage3D: dt,
    scissor: bt,
    viewport: pt,
    reset: Qt
  };
}
function nm(i, t, e, n, s, r, a) {
  const o = t.has("WEBGL_multisampled_render_to_texture") ? t.get("WEBGL_multisampled_render_to_texture") : null, l = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), c = new Ct(), h = /* @__PURE__ */ new WeakMap();
  let d;
  const f = /* @__PURE__ */ new WeakMap();
  let m = !1;
  try {
    m = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {
  }
  function _(E, g) {
    return m ? (
      // eslint-disable-next-line compat/compat
      new OffscreenCanvas(E, g)
    ) : Ps("canvas");
  }
  function x(E, g, F) {
    let q = 1;
    const K = vt(E);
    if ((K.width > F || K.height > F) && (q = F / Math.max(K.width, K.height)), q < 1)
      if (typeof HTMLImageElement < "u" && E instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && E instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && E instanceof ImageBitmap || typeof VideoFrame < "u" && E instanceof VideoFrame) {
        const X = Math.floor(q * K.width), gt = Math.floor(q * K.height);
        d === void 0 && (d = _(X, gt));
        const at = g ? _(X, gt) : d;
        return at.width = X, at.height = gt, at.getContext("2d").drawImage(E, 0, 0, X, gt), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + K.width + "x" + K.height + ") to (" + X + "x" + gt + ")."), at;
      } else
        return "data" in E && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + K.width + "x" + K.height + ")."), E;
    return E;
  }
  function p(E) {
    return E.generateMipmaps;
  }
  function u(E) {
    i.generateMipmap(E);
  }
  function b(E) {
    return E.isWebGLCubeRenderTarget ? i.TEXTURE_CUBE_MAP : E.isWebGL3DRenderTarget ? i.TEXTURE_3D : E.isWebGLArrayRenderTarget || E.isCompressedArrayTexture ? i.TEXTURE_2D_ARRAY : i.TEXTURE_2D;
  }
  function T(E, g, F, q, K = !1) {
    if (E !== null) {
      if (i[E] !== void 0) return i[E];
      console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + E + "'");
    }
    let X = g;
    if (g === i.RED && (F === i.FLOAT && (X = i.R32F), F === i.HALF_FLOAT && (X = i.R16F), F === i.UNSIGNED_BYTE && (X = i.R8)), g === i.RED_INTEGER && (F === i.UNSIGNED_BYTE && (X = i.R8UI), F === i.UNSIGNED_SHORT && (X = i.R16UI), F === i.UNSIGNED_INT && (X = i.R32UI), F === i.BYTE && (X = i.R8I), F === i.SHORT && (X = i.R16I), F === i.INT && (X = i.R32I)), g === i.RG && (F === i.FLOAT && (X = i.RG32F), F === i.HALF_FLOAT && (X = i.RG16F), F === i.UNSIGNED_BYTE && (X = i.RG8)), g === i.RG_INTEGER && (F === i.UNSIGNED_BYTE && (X = i.RG8UI), F === i.UNSIGNED_SHORT && (X = i.RG16UI), F === i.UNSIGNED_INT && (X = i.RG32UI), F === i.BYTE && (X = i.RG8I), F === i.SHORT && (X = i.RG16I), F === i.INT && (X = i.RG32I)), g === i.RGB_INTEGER && (F === i.UNSIGNED_BYTE && (X = i.RGB8UI), F === i.UNSIGNED_SHORT && (X = i.RGB16UI), F === i.UNSIGNED_INT && (X = i.RGB32UI), F === i.BYTE && (X = i.RGB8I), F === i.SHORT && (X = i.RGB16I), F === i.INT && (X = i.RGB32I)), g === i.RGBA_INTEGER && (F === i.UNSIGNED_BYTE && (X = i.RGBA8UI), F === i.UNSIGNED_SHORT && (X = i.RGBA16UI), F === i.UNSIGNED_INT && (X = i.RGBA32UI), F === i.BYTE && (X = i.RGBA8I), F === i.SHORT && (X = i.RGBA16I), F === i.INT && (X = i.RGBA32I)), g === i.RGB && F === i.UNSIGNED_INT_5_9_9_9_REV && (X = i.RGB9_E5), g === i.RGBA) {
      const gt = K ? ws : Xt.getTransfer(q);
      F === i.FLOAT && (X = i.RGBA32F), F === i.HALF_FLOAT && (X = i.RGBA16F), F === i.UNSIGNED_BYTE && (X = gt === Kt ? i.SRGB8_ALPHA8 : i.RGBA8), F === i.UNSIGNED_SHORT_4_4_4_4 && (X = i.RGBA4), F === i.UNSIGNED_SHORT_5_5_5_1 && (X = i.RGB5_A1);
    }
    return (X === i.R16F || X === i.R32F || X === i.RG16F || X === i.RG32F || X === i.RGBA16F || X === i.RGBA32F) && t.get("EXT_color_buffer_float"), X;
  }
  function y(E, g) {
    let F;
    return E ? g === null || g === Gn || g === yi ? F = i.DEPTH24_STENCIL8 : g === $e ? F = i.DEPTH32F_STENCIL8 : g === Gi && (F = i.DEPTH24_STENCIL8, console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : g === null || g === Gn || g === yi ? F = i.DEPTH_COMPONENT24 : g === $e ? F = i.DEPTH_COMPONENT32F : g === Gi && (F = i.DEPTH_COMPONENT16), F;
  }
  function P(E, g) {
    return p(E) === !0 || E.isFramebufferTexture && E.minFilter !== Ue && E.minFilter !== Ke ? Math.log2(Math.max(g.width, g.height)) + 1 : E.mipmaps !== void 0 && E.mipmaps.length > 0 ? E.mipmaps.length : E.isCompressedTexture && Array.isArray(E.image) ? g.mipmaps.length : 1;
  }
  function A(E) {
    const g = E.target;
    g.removeEventListener("dispose", A), I(g), g.isVideoTexture && h.delete(g);
  }
  function R(E) {
    const g = E.target;
    g.removeEventListener("dispose", R), M(g);
  }
  function I(E) {
    const g = n.get(E);
    if (g.__webglInit === void 0) return;
    const F = E.source, q = f.get(F);
    if (q) {
      const K = q[g.__cacheKey];
      K.usedTimes--, K.usedTimes === 0 && S(E), Object.keys(q).length === 0 && f.delete(F);
    }
    n.remove(E);
  }
  function S(E) {
    const g = n.get(E);
    i.deleteTexture(g.__webglTexture);
    const F = E.source, q = f.get(F);
    delete q[g.__cacheKey], a.memory.textures--;
  }
  function M(E) {
    const g = n.get(E);
    if (E.depthTexture && (E.depthTexture.dispose(), n.remove(E.depthTexture)), E.isWebGLCubeRenderTarget)
      for (let q = 0; q < 6; q++) {
        if (Array.isArray(g.__webglFramebuffer[q]))
          for (let K = 0; K < g.__webglFramebuffer[q].length; K++) i.deleteFramebuffer(g.__webglFramebuffer[q][K]);
        else
          i.deleteFramebuffer(g.__webglFramebuffer[q]);
        g.__webglDepthbuffer && i.deleteRenderbuffer(g.__webglDepthbuffer[q]);
      }
    else {
      if (Array.isArray(g.__webglFramebuffer))
        for (let q = 0; q < g.__webglFramebuffer.length; q++) i.deleteFramebuffer(g.__webglFramebuffer[q]);
      else
        i.deleteFramebuffer(g.__webglFramebuffer);
      if (g.__webglDepthbuffer && i.deleteRenderbuffer(g.__webglDepthbuffer), g.__webglMultisampledFramebuffer && i.deleteFramebuffer(g.__webglMultisampledFramebuffer), g.__webglColorRenderbuffer)
        for (let q = 0; q < g.__webglColorRenderbuffer.length; q++)
          g.__webglColorRenderbuffer[q] && i.deleteRenderbuffer(g.__webglColorRenderbuffer[q]);
      g.__webglDepthRenderbuffer && i.deleteRenderbuffer(g.__webglDepthRenderbuffer);
    }
    const F = E.textures;
    for (let q = 0, K = F.length; q < K; q++) {
      const X = n.get(F[q]);
      X.__webglTexture && (i.deleteTexture(X.__webglTexture), a.memory.textures--), n.remove(F[q]);
    }
    n.remove(E);
  }
  let C = 0;
  function H() {
    C = 0;
  }
  function B() {
    const E = C;
    return E >= s.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + E + " texture units while this GPU supports only " + s.maxTextures), C += 1, E;
  }
  function k(E) {
    const g = [];
    return g.push(E.wrapS), g.push(E.wrapT), g.push(E.wrapR || 0), g.push(E.magFilter), g.push(E.minFilter), g.push(E.anisotropy), g.push(E.internalFormat), g.push(E.format), g.push(E.type), g.push(E.generateMipmaps), g.push(E.premultiplyAlpha), g.push(E.flipY), g.push(E.unpackAlignment), g.push(E.colorSpace), g.join();
  }
  function Z(E, g) {
    const F = n.get(E);
    if (E.isVideoTexture && Mt(E), E.isRenderTargetTexture === !1 && E.version > 0 && F.__version !== E.version) {
      const q = E.image;
      if (q === null)
        console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
      else if (q.complete === !1)
        console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        Y(F, E, g);
        return;
      }
    }
    e.bindTexture(i.TEXTURE_2D, F.__webglTexture, i.TEXTURE0 + g);
  }
  function W(E, g) {
    const F = n.get(E);
    if (E.version > 0 && F.__version !== E.version) {
      Y(F, E, g);
      return;
    }
    e.bindTexture(i.TEXTURE_2D_ARRAY, F.__webglTexture, i.TEXTURE0 + g);
  }
  function Q(E, g) {
    const F = n.get(E);
    if (E.version > 0 && F.__version !== E.version) {
      Y(F, E, g);
      return;
    }
    e.bindTexture(i.TEXTURE_3D, F.__webglTexture, i.TEXTURE0 + g);
  }
  function G(E, g) {
    const F = n.get(E);
    if (E.version > 0 && F.__version !== E.version) {
      tt(F, E, g);
      return;
    }
    e.bindTexture(i.TEXTURE_CUBE_MAP, F.__webglTexture, i.TEXTURE0 + g);
  }
  const st = {
    [zr]: i.REPEAT,
    [Hn]: i.CLAMP_TO_EDGE,
    [Hr]: i.MIRRORED_REPEAT
  }, ut = {
    [Ue]: i.NEAREST,
    [Cc]: i.NEAREST_MIPMAP_NEAREST,
    [ji]: i.NEAREST_MIPMAP_LINEAR,
    [Ke]: i.LINEAR,
    [js]: i.LINEAR_MIPMAP_NEAREST,
    [Vn]: i.LINEAR_MIPMAP_LINEAR
  }, xt = {
    [Uc]: i.NEVER,
    [zc]: i.ALWAYS,
    [Ic]: i.LESS,
    [yl]: i.LEQUAL,
    [Nc]: i.EQUAL,
    [Bc]: i.GEQUAL,
    [Fc]: i.GREATER,
    [Oc]: i.NOTEQUAL
  };
  function Ft(E, g) {
    if (g.type === $e && t.has("OES_texture_float_linear") === !1 && (g.magFilter === Ke || g.magFilter === js || g.magFilter === ji || g.magFilter === Vn || g.minFilter === Ke || g.minFilter === js || g.minFilter === ji || g.minFilter === Vn) && console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), i.texParameteri(E, i.TEXTURE_WRAP_S, st[g.wrapS]), i.texParameteri(E, i.TEXTURE_WRAP_T, st[g.wrapT]), (E === i.TEXTURE_3D || E === i.TEXTURE_2D_ARRAY) && i.texParameteri(E, i.TEXTURE_WRAP_R, st[g.wrapR]), i.texParameteri(E, i.TEXTURE_MAG_FILTER, ut[g.magFilter]), i.texParameteri(E, i.TEXTURE_MIN_FILTER, ut[g.minFilter]), g.compareFunction && (i.texParameteri(E, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE), i.texParameteri(E, i.TEXTURE_COMPARE_FUNC, xt[g.compareFunction])), t.has("EXT_texture_filter_anisotropic") === !0) {
      if (g.magFilter === Ue || g.minFilter !== ji && g.minFilter !== Vn || g.type === $e && t.has("OES_texture_float_linear") === !1) return;
      if (g.anisotropy > 1 || n.get(g).__currentAnisotropy) {
        const F = t.get("EXT_texture_filter_anisotropic");
        i.texParameterf(E, F.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(g.anisotropy, s.getMaxAnisotropy())), n.get(g).__currentAnisotropy = g.anisotropy;
      }
    }
  }
  function Jt(E, g) {
    let F = !1;
    E.__webglInit === void 0 && (E.__webglInit = !0, g.addEventListener("dispose", A));
    const q = g.source;
    let K = f.get(q);
    K === void 0 && (K = {}, f.set(q, K));
    const X = k(g);
    if (X !== E.__cacheKey) {
      K[X] === void 0 && (K[X] = {
        texture: i.createTexture(),
        usedTimes: 0
      }, a.memory.textures++, F = !0), K[X].usedTimes++;
      const gt = K[E.__cacheKey];
      gt !== void 0 && (K[E.__cacheKey].usedTimes--, gt.usedTimes === 0 && S(g)), E.__cacheKey = X, E.__webglTexture = K[X].texture;
    }
    return F;
  }
  function Y(E, g, F) {
    let q = i.TEXTURE_2D;
    (g.isDataArrayTexture || g.isCompressedArrayTexture) && (q = i.TEXTURE_2D_ARRAY), g.isData3DTexture && (q = i.TEXTURE_3D);
    const K = Jt(E, g), X = g.source;
    e.bindTexture(q, E.__webglTexture, i.TEXTURE0 + F);
    const gt = n.get(X);
    if (X.version !== gt.__version || K === !0) {
      e.activeTexture(i.TEXTURE0 + F);
      const at = Xt.getPrimaries(Xt.workingColorSpace), dt = g.colorSpace === En ? null : Xt.getPrimaries(g.colorSpace), Gt = g.colorSpace === En || at === dt ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, g.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, g.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, g.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, Gt);
      let J = x(g.image, !1, s.maxTextureSize);
      J = te(g, J);
      const ft = r.convert(g.format, g.colorSpace), Et = r.convert(g.type);
      let bt = T(g.internalFormat, ft, Et, g.colorSpace, g.isVideoTexture);
      Ft(q, g);
      let pt;
      const Ht = g.mipmaps, Lt = g.isVideoTexture !== !0, Qt = gt.__version === void 0 || K === !0, L = X.dataReady, nt = P(g, J);
      if (g.isDepthTexture)
        bt = y(g.format === Ei, g.type), Qt && (Lt ? e.texStorage2D(i.TEXTURE_2D, 1, bt, J.width, J.height) : e.texImage2D(i.TEXTURE_2D, 0, bt, J.width, J.height, 0, ft, Et, null));
      else if (g.isDataTexture)
        if (Ht.length > 0) {
          Lt && Qt && e.texStorage2D(i.TEXTURE_2D, nt, bt, Ht[0].width, Ht[0].height);
          for (let V = 0, j = Ht.length; V < j; V++)
            pt = Ht[V], Lt ? L && e.texSubImage2D(i.TEXTURE_2D, V, 0, 0, pt.width, pt.height, ft, Et, pt.data) : e.texImage2D(i.TEXTURE_2D, V, bt, pt.width, pt.height, 0, ft, Et, pt.data);
          g.generateMipmaps = !1;
        } else
          Lt ? (Qt && e.texStorage2D(i.TEXTURE_2D, nt, bt, J.width, J.height), L && e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, J.width, J.height, ft, Et, J.data)) : e.texImage2D(i.TEXTURE_2D, 0, bt, J.width, J.height, 0, ft, Et, J.data);
      else if (g.isCompressedTexture)
        if (g.isCompressedArrayTexture) {
          Lt && Qt && e.texStorage3D(i.TEXTURE_2D_ARRAY, nt, bt, Ht[0].width, Ht[0].height, J.depth);
          for (let V = 0, j = Ht.length; V < j; V++)
            if (pt = Ht[V], g.format !== qe)
              if (ft !== null)
                if (Lt) {
                  if (L)
                    if (g.layerUpdates.size > 0) {
                      const lt = Eo(pt.width, pt.height, g.format, g.type);
                      for (const ot of g.layerUpdates) {
                        const Pt = pt.data.subarray(
                          ot * lt / pt.data.BYTES_PER_ELEMENT,
                          (ot + 1) * lt / pt.data.BYTES_PER_ELEMENT
                        );
                        e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, V, 0, 0, ot, pt.width, pt.height, 1, ft, Pt);
                      }
                      g.clearLayerUpdates();
                    } else
                      e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, V, 0, 0, 0, pt.width, pt.height, J.depth, ft, pt.data);
                } else
                  e.compressedTexImage3D(i.TEXTURE_2D_ARRAY, V, bt, pt.width, pt.height, J.depth, 0, pt.data, 0, 0);
              else
                console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
            else
              Lt ? L && e.texSubImage3D(i.TEXTURE_2D_ARRAY, V, 0, 0, 0, pt.width, pt.height, J.depth, ft, Et, pt.data) : e.texImage3D(i.TEXTURE_2D_ARRAY, V, bt, pt.width, pt.height, J.depth, 0, ft, Et, pt.data);
        } else {
          Lt && Qt && e.texStorage2D(i.TEXTURE_2D, nt, bt, Ht[0].width, Ht[0].height);
          for (let V = 0, j = Ht.length; V < j; V++)
            pt = Ht[V], g.format !== qe ? ft !== null ? Lt ? L && e.compressedTexSubImage2D(i.TEXTURE_2D, V, 0, 0, pt.width, pt.height, ft, pt.data) : e.compressedTexImage2D(i.TEXTURE_2D, V, bt, pt.width, pt.height, 0, pt.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Lt ? L && e.texSubImage2D(i.TEXTURE_2D, V, 0, 0, pt.width, pt.height, ft, Et, pt.data) : e.texImage2D(i.TEXTURE_2D, V, bt, pt.width, pt.height, 0, ft, Et, pt.data);
        }
      else if (g.isDataArrayTexture)
        if (Lt) {
          if (Qt && e.texStorage3D(i.TEXTURE_2D_ARRAY, nt, bt, J.width, J.height, J.depth), L)
            if (g.layerUpdates.size > 0) {
              const V = Eo(J.width, J.height, g.format, g.type);
              for (const j of g.layerUpdates) {
                const lt = J.data.subarray(
                  j * V / J.data.BYTES_PER_ELEMENT,
                  (j + 1) * V / J.data.BYTES_PER_ELEMENT
                );
                e.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, j, J.width, J.height, 1, ft, Et, lt);
              }
              g.clearLayerUpdates();
            } else
              e.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, 0, J.width, J.height, J.depth, ft, Et, J.data);
        } else
          e.texImage3D(i.TEXTURE_2D_ARRAY, 0, bt, J.width, J.height, J.depth, 0, ft, Et, J.data);
      else if (g.isData3DTexture)
        Lt ? (Qt && e.texStorage3D(i.TEXTURE_3D, nt, bt, J.width, J.height, J.depth), L && e.texSubImage3D(i.TEXTURE_3D, 0, 0, 0, 0, J.width, J.height, J.depth, ft, Et, J.data)) : e.texImage3D(i.TEXTURE_3D, 0, bt, J.width, J.height, J.depth, 0, ft, Et, J.data);
      else if (g.isFramebufferTexture) {
        if (Qt)
          if (Lt)
            e.texStorage2D(i.TEXTURE_2D, nt, bt, J.width, J.height);
          else {
            let V = J.width, j = J.height;
            for (let lt = 0; lt < nt; lt++)
              e.texImage2D(i.TEXTURE_2D, lt, bt, V, j, 0, ft, Et, null), V >>= 1, j >>= 1;
          }
      } else if (Ht.length > 0) {
        if (Lt && Qt) {
          const V = vt(Ht[0]);
          e.texStorage2D(i.TEXTURE_2D, nt, bt, V.width, V.height);
        }
        for (let V = 0, j = Ht.length; V < j; V++)
          pt = Ht[V], Lt ? L && e.texSubImage2D(i.TEXTURE_2D, V, 0, 0, ft, Et, pt) : e.texImage2D(i.TEXTURE_2D, V, bt, ft, Et, pt);
        g.generateMipmaps = !1;
      } else if (Lt) {
        if (Qt) {
          const V = vt(J);
          e.texStorage2D(i.TEXTURE_2D, nt, bt, V.width, V.height);
        }
        L && e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, ft, Et, J);
      } else
        e.texImage2D(i.TEXTURE_2D, 0, bt, ft, Et, J);
      p(g) && u(q), gt.__version = X.version, g.onUpdate && g.onUpdate(g);
    }
    E.__version = g.version;
  }
  function tt(E, g, F) {
    if (g.image.length !== 6) return;
    const q = Jt(E, g), K = g.source;
    e.bindTexture(i.TEXTURE_CUBE_MAP, E.__webglTexture, i.TEXTURE0 + F);
    const X = n.get(K);
    if (K.version !== X.__version || q === !0) {
      e.activeTexture(i.TEXTURE0 + F);
      const gt = Xt.getPrimaries(Xt.workingColorSpace), at = g.colorSpace === En ? null : Xt.getPrimaries(g.colorSpace), dt = g.colorSpace === En || gt === at ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, g.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, g.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, g.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, dt);
      const Gt = g.isCompressedTexture || g.image[0].isCompressedTexture, J = g.image[0] && g.image[0].isDataTexture, ft = [];
      for (let j = 0; j < 6; j++)
        !Gt && !J ? ft[j] = x(g.image[j], !0, s.maxCubemapSize) : ft[j] = J ? g.image[j].image : g.image[j], ft[j] = te(g, ft[j]);
      const Et = ft[0], bt = r.convert(g.format, g.colorSpace), pt = r.convert(g.type), Ht = T(g.internalFormat, bt, pt, g.colorSpace), Lt = g.isVideoTexture !== !0, Qt = X.__version === void 0 || q === !0, L = K.dataReady;
      let nt = P(g, Et);
      Ft(i.TEXTURE_CUBE_MAP, g);
      let V;
      if (Gt) {
        Lt && Qt && e.texStorage2D(i.TEXTURE_CUBE_MAP, nt, Ht, Et.width, Et.height);
        for (let j = 0; j < 6; j++) {
          V = ft[j].mipmaps;
          for (let lt = 0; lt < V.length; lt++) {
            const ot = V[lt];
            g.format !== qe ? bt !== null ? Lt ? L && e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt, 0, 0, ot.width, ot.height, bt, ot.data) : e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt, Ht, ot.width, ot.height, 0, ot.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : Lt ? L && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt, 0, 0, ot.width, ot.height, bt, pt, ot.data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt, Ht, ot.width, ot.height, 0, bt, pt, ot.data);
          }
        }
      } else {
        if (V = g.mipmaps, Lt && Qt) {
          V.length > 0 && nt++;
          const j = vt(ft[0]);
          e.texStorage2D(i.TEXTURE_CUBE_MAP, nt, Ht, j.width, j.height);
        }
        for (let j = 0; j < 6; j++)
          if (J) {
            Lt ? L && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, 0, 0, ft[j].width, ft[j].height, bt, pt, ft[j].data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, Ht, ft[j].width, ft[j].height, 0, bt, pt, ft[j].data);
            for (let lt = 0; lt < V.length; lt++) {
              const Pt = V[lt].image[j].image;
              Lt ? L && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt + 1, 0, 0, Pt.width, Pt.height, bt, pt, Pt.data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt + 1, Ht, Pt.width, Pt.height, 0, bt, pt, Pt.data);
            }
          } else {
            Lt ? L && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, 0, 0, bt, pt, ft[j]) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, Ht, bt, pt, ft[j]);
            for (let lt = 0; lt < V.length; lt++) {
              const ot = V[lt];
              Lt ? L && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt + 1, 0, 0, bt, pt, ot.image[j]) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt + 1, Ht, bt, pt, ot.image[j]);
            }
          }
      }
      p(g) && u(i.TEXTURE_CUBE_MAP), X.__version = K.version, g.onUpdate && g.onUpdate(g);
    }
    E.__version = g.version;
  }
  function _t(E, g, F, q, K, X) {
    const gt = r.convert(F.format, F.colorSpace), at = r.convert(F.type), dt = T(F.internalFormat, gt, at, F.colorSpace), Gt = n.get(g), J = n.get(F);
    if (J.__renderTarget = g, !Gt.__hasExternalTextures) {
      const ft = Math.max(1, g.width >> X), Et = Math.max(1, g.height >> X);
      K === i.TEXTURE_3D || K === i.TEXTURE_2D_ARRAY ? e.texImage3D(K, X, dt, ft, Et, g.depth, 0, gt, at, null) : e.texImage2D(K, X, dt, ft, Et, 0, gt, at, null);
    }
    e.bindFramebuffer(i.FRAMEBUFFER, E), zt(g) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, q, K, J.__webglTexture, 0, Bt(g)) : (K === i.TEXTURE_2D || K >= i.TEXTURE_CUBE_MAP_POSITIVE_X && K <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z) && i.framebufferTexture2D(i.FRAMEBUFFER, q, K, J.__webglTexture, X), e.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function rt(E, g, F) {
    if (i.bindRenderbuffer(i.RENDERBUFFER, E), g.depthBuffer) {
      const q = g.depthTexture, K = q && q.isDepthTexture ? q.type : null, X = y(g.stencilBuffer, K), gt = g.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, at = Bt(g);
      zt(g) ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, at, X, g.width, g.height) : F ? i.renderbufferStorageMultisample(i.RENDERBUFFER, at, X, g.width, g.height) : i.renderbufferStorage(i.RENDERBUFFER, X, g.width, g.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, gt, i.RENDERBUFFER, E);
    } else {
      const q = g.textures;
      for (let K = 0; K < q.length; K++) {
        const X = q[K], gt = r.convert(X.format, X.colorSpace), at = r.convert(X.type), dt = T(X.internalFormat, gt, at, X.colorSpace), Gt = Bt(g);
        F && zt(g) === !1 ? i.renderbufferStorageMultisample(i.RENDERBUFFER, Gt, dt, g.width, g.height) : zt(g) ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, Gt, dt, g.width, g.height) : i.renderbufferStorage(i.RENDERBUFFER, dt, g.width, g.height);
      }
    }
    i.bindRenderbuffer(i.RENDERBUFFER, null);
  }
  function Tt(E, g) {
    if (g && g.isWebGLCubeRenderTarget) throw new Error("Depth Texture with cube render targets is not supported");
    if (e.bindFramebuffer(i.FRAMEBUFFER, E), !(g.depthTexture && g.depthTexture.isDepthTexture))
      throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
    const q = n.get(g.depthTexture);
    q.__renderTarget = g, (!q.__webglTexture || g.depthTexture.image.width !== g.width || g.depthTexture.image.height !== g.height) && (g.depthTexture.image.width = g.width, g.depthTexture.image.height = g.height, g.depthTexture.needsUpdate = !0), Z(g.depthTexture, 0);
    const K = q.__webglTexture, X = Bt(g);
    if (g.depthTexture.format === gi)
      zt(g) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, K, 0, X) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, K, 0);
    else if (g.depthTexture.format === Ei)
      zt(g) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, K, 0, X) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, K, 0);
    else
      throw new Error("Unknown depthTexture format");
  }
  function wt(E) {
    const g = n.get(E), F = E.isWebGLCubeRenderTarget === !0;
    if (g.__boundDepthTexture !== E.depthTexture) {
      const q = E.depthTexture;
      if (g.__depthDisposeCallback && g.__depthDisposeCallback(), q) {
        const K = () => {
          delete g.__boundDepthTexture, delete g.__depthDisposeCallback, q.removeEventListener("dispose", K);
        };
        q.addEventListener("dispose", K), g.__depthDisposeCallback = K;
      }
      g.__boundDepthTexture = q;
    }
    if (E.depthTexture && !g.__autoAllocateDepthBuffer) {
      if (F) throw new Error("target.depthTexture not supported in Cube render targets");
      Tt(g.__webglFramebuffer, E);
    } else if (F) {
      g.__webglDepthbuffer = [];
      for (let q = 0; q < 6; q++)
        if (e.bindFramebuffer(i.FRAMEBUFFER, g.__webglFramebuffer[q]), g.__webglDepthbuffer[q] === void 0)
          g.__webglDepthbuffer[q] = i.createRenderbuffer(), rt(g.__webglDepthbuffer[q], E, !1);
        else {
          const K = E.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, X = g.__webglDepthbuffer[q];
          i.bindRenderbuffer(i.RENDERBUFFER, X), i.framebufferRenderbuffer(i.FRAMEBUFFER, K, i.RENDERBUFFER, X);
        }
    } else if (e.bindFramebuffer(i.FRAMEBUFFER, g.__webglFramebuffer), g.__webglDepthbuffer === void 0)
      g.__webglDepthbuffer = i.createRenderbuffer(), rt(g.__webglDepthbuffer, E, !1);
    else {
      const q = E.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, K = g.__webglDepthbuffer;
      i.bindRenderbuffer(i.RENDERBUFFER, K), i.framebufferRenderbuffer(i.FRAMEBUFFER, q, i.RENDERBUFFER, K);
    }
    e.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function Ot(E, g, F) {
    const q = n.get(E);
    g !== void 0 && _t(q.__webglFramebuffer, E, E.texture, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, 0), F !== void 0 && wt(E);
  }
  function ne(E) {
    const g = E.texture, F = n.get(E), q = n.get(g);
    E.addEventListener("dispose", R);
    const K = E.textures, X = E.isWebGLCubeRenderTarget === !0, gt = K.length > 1;
    if (gt || (q.__webglTexture === void 0 && (q.__webglTexture = i.createTexture()), q.__version = g.version, a.memory.textures++), X) {
      F.__webglFramebuffer = [];
      for (let at = 0; at < 6; at++)
        if (g.mipmaps && g.mipmaps.length > 0) {
          F.__webglFramebuffer[at] = [];
          for (let dt = 0; dt < g.mipmaps.length; dt++)
            F.__webglFramebuffer[at][dt] = i.createFramebuffer();
        } else
          F.__webglFramebuffer[at] = i.createFramebuffer();
    } else {
      if (g.mipmaps && g.mipmaps.length > 0) {
        F.__webglFramebuffer = [];
        for (let at = 0; at < g.mipmaps.length; at++)
          F.__webglFramebuffer[at] = i.createFramebuffer();
      } else
        F.__webglFramebuffer = i.createFramebuffer();
      if (gt)
        for (let at = 0, dt = K.length; at < dt; at++) {
          const Gt = n.get(K[at]);
          Gt.__webglTexture === void 0 && (Gt.__webglTexture = i.createTexture(), a.memory.textures++);
        }
      if (E.samples > 0 && zt(E) === !1) {
        F.__webglMultisampledFramebuffer = i.createFramebuffer(), F.__webglColorRenderbuffer = [], e.bindFramebuffer(i.FRAMEBUFFER, F.__webglMultisampledFramebuffer);
        for (let at = 0; at < K.length; at++) {
          const dt = K[at];
          F.__webglColorRenderbuffer[at] = i.createRenderbuffer(), i.bindRenderbuffer(i.RENDERBUFFER, F.__webglColorRenderbuffer[at]);
          const Gt = r.convert(dt.format, dt.colorSpace), J = r.convert(dt.type), ft = T(dt.internalFormat, Gt, J, dt.colorSpace, E.isXRRenderTarget === !0), Et = Bt(E);
          i.renderbufferStorageMultisample(i.RENDERBUFFER, Et, ft, E.width, E.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + at, i.RENDERBUFFER, F.__webglColorRenderbuffer[at]);
        }
        i.bindRenderbuffer(i.RENDERBUFFER, null), E.depthBuffer && (F.__webglDepthRenderbuffer = i.createRenderbuffer(), rt(F.__webglDepthRenderbuffer, E, !0)), e.bindFramebuffer(i.FRAMEBUFFER, null);
      }
    }
    if (X) {
      e.bindTexture(i.TEXTURE_CUBE_MAP, q.__webglTexture), Ft(i.TEXTURE_CUBE_MAP, g);
      for (let at = 0; at < 6; at++)
        if (g.mipmaps && g.mipmaps.length > 0)
          for (let dt = 0; dt < g.mipmaps.length; dt++)
            _t(F.__webglFramebuffer[at][dt], E, g, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + at, dt);
        else
          _t(F.__webglFramebuffer[at], E, g, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + at, 0);
      p(g) && u(i.TEXTURE_CUBE_MAP), e.unbindTexture();
    } else if (gt) {
      for (let at = 0, dt = K.length; at < dt; at++) {
        const Gt = K[at], J = n.get(Gt);
        e.bindTexture(i.TEXTURE_2D, J.__webglTexture), Ft(i.TEXTURE_2D, Gt), _t(F.__webglFramebuffer, E, Gt, i.COLOR_ATTACHMENT0 + at, i.TEXTURE_2D, 0), p(Gt) && u(i.TEXTURE_2D);
      }
      e.unbindTexture();
    } else {
      let at = i.TEXTURE_2D;
      if ((E.isWebGL3DRenderTarget || E.isWebGLArrayRenderTarget) && (at = E.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY), e.bindTexture(at, q.__webglTexture), Ft(at, g), g.mipmaps && g.mipmaps.length > 0)
        for (let dt = 0; dt < g.mipmaps.length; dt++)
          _t(F.__webglFramebuffer[dt], E, g, i.COLOR_ATTACHMENT0, at, dt);
      else
        _t(F.__webglFramebuffer, E, g, i.COLOR_ATTACHMENT0, at, 0);
      p(g) && u(at), e.unbindTexture();
    }
    E.depthBuffer && wt(E);
  }
  function Vt(E) {
    const g = E.textures;
    for (let F = 0, q = g.length; F < q; F++) {
      const K = g[F];
      if (p(K)) {
        const X = b(E), gt = n.get(K).__webglTexture;
        e.bindTexture(X, gt), u(X), e.unbindTexture();
      }
    }
  }
  const ae = [], w = [];
  function Ne(E) {
    if (E.samples > 0) {
      if (zt(E) === !1) {
        const g = E.textures, F = E.width, q = E.height;
        let K = i.COLOR_BUFFER_BIT;
        const X = E.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, gt = n.get(E), at = g.length > 1;
        if (at)
          for (let dt = 0; dt < g.length; dt++)
            e.bindFramebuffer(i.FRAMEBUFFER, gt.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + dt, i.RENDERBUFFER, null), e.bindFramebuffer(i.FRAMEBUFFER, gt.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + dt, i.TEXTURE_2D, null, 0);
        e.bindFramebuffer(i.READ_FRAMEBUFFER, gt.__webglMultisampledFramebuffer), e.bindFramebuffer(i.DRAW_FRAMEBUFFER, gt.__webglFramebuffer);
        for (let dt = 0; dt < g.length; dt++) {
          if (E.resolveDepthBuffer && (E.depthBuffer && (K |= i.DEPTH_BUFFER_BIT), E.stencilBuffer && E.resolveStencilBuffer && (K |= i.STENCIL_BUFFER_BIT)), at) {
            i.framebufferRenderbuffer(i.READ_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.RENDERBUFFER, gt.__webglColorRenderbuffer[dt]);
            const Gt = n.get(g[dt]).__webglTexture;
            i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, Gt, 0);
          }
          i.blitFramebuffer(0, 0, F, q, 0, 0, F, q, K, i.NEAREST), l === !0 && (ae.length = 0, w.length = 0, ae.push(i.COLOR_ATTACHMENT0 + dt), E.depthBuffer && E.resolveDepthBuffer === !1 && (ae.push(X), w.push(X), i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, w)), i.invalidateFramebuffer(i.READ_FRAMEBUFFER, ae));
        }
        if (e.bindFramebuffer(i.READ_FRAMEBUFFER, null), e.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), at)
          for (let dt = 0; dt < g.length; dt++) {
            e.bindFramebuffer(i.FRAMEBUFFER, gt.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + dt, i.RENDERBUFFER, gt.__webglColorRenderbuffer[dt]);
            const Gt = n.get(g[dt]).__webglTexture;
            e.bindFramebuffer(i.FRAMEBUFFER, gt.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + dt, i.TEXTURE_2D, Gt, 0);
          }
        e.bindFramebuffer(i.DRAW_FRAMEBUFFER, gt.__webglMultisampledFramebuffer);
      } else if (E.depthBuffer && E.resolveDepthBuffer === !1 && l) {
        const g = E.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT;
        i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [g]);
      }
    }
  }
  function Bt(E) {
    return Math.min(s.maxSamples, E.samples);
  }
  function zt(E) {
    const g = n.get(E);
    return E.samples > 0 && t.has("WEBGL_multisampled_render_to_texture") === !0 && g.__useRenderToTexture !== !1;
  }
  function Mt(E) {
    const g = a.render.frame;
    h.get(E) !== g && (h.set(E, g), E.update());
  }
  function te(E, g) {
    const F = E.colorSpace, q = E.format, K = E.type;
    return E.isCompressedTexture === !0 || E.isVideoTexture === !0 || F !== Ti && F !== En && (Xt.getTransfer(F) === Kt ? (q !== qe || K !== dn) && console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", F)), g;
  }
  function vt(E) {
    return typeof HTMLImageElement < "u" && E instanceof HTMLImageElement ? (c.width = E.naturalWidth || E.width, c.height = E.naturalHeight || E.height) : typeof VideoFrame < "u" && E instanceof VideoFrame ? (c.width = E.displayWidth, c.height = E.displayHeight) : (c.width = E.width, c.height = E.height), c;
  }
  this.allocateTextureUnit = B, this.resetTextureUnits = H, this.setTexture2D = Z, this.setTexture2DArray = W, this.setTexture3D = Q, this.setTextureCube = G, this.rebindTextures = Ot, this.setupRenderTarget = ne, this.updateRenderTargetMipmap = Vt, this.updateMultisampleRenderTarget = Ne, this.setupDepthRenderbuffer = wt, this.setupFrameBufferTexture = _t, this.useMultisampledRTT = zt;
}
function im(i, t) {
  function e(n, s = En) {
    let r;
    const a = Xt.getTransfer(s);
    if (n === dn) return i.UNSIGNED_BYTE;
    if (n === ya) return i.UNSIGNED_SHORT_4_4_4_4;
    if (n === Ea) return i.UNSIGNED_SHORT_5_5_5_1;
    if (n === pl) return i.UNSIGNED_INT_5_9_9_9_REV;
    if (n === dl) return i.BYTE;
    if (n === fl) return i.SHORT;
    if (n === Gi) return i.UNSIGNED_SHORT;
    if (n === Sa) return i.INT;
    if (n === Gn) return i.UNSIGNED_INT;
    if (n === $e) return i.FLOAT;
    if (n === ki) return i.HALF_FLOAT;
    if (n === ml) return i.ALPHA;
    if (n === _l) return i.RGB;
    if (n === qe) return i.RGBA;
    if (n === gl) return i.LUMINANCE;
    if (n === vl) return i.LUMINANCE_ALPHA;
    if (n === gi) return i.DEPTH_COMPONENT;
    if (n === Ei) return i.DEPTH_STENCIL;
    if (n === Ta) return i.RED;
    if (n === ba) return i.RED_INTEGER;
    if (n === xl) return i.RG;
    if (n === Aa) return i.RG_INTEGER;
    if (n === wa) return i.RGBA_INTEGER;
    if (n === Ms || n === Ss || n === ys || n === Es)
      if (a === Kt)
        if (r = t.get("WEBGL_compressed_texture_s3tc_srgb"), r !== null) {
          if (n === Ms) return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (n === Ss) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (n === ys) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (n === Es) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else
          return null;
      else if (r = t.get("WEBGL_compressed_texture_s3tc"), r !== null) {
        if (n === Ms) return r.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === Ss) return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === ys) return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === Es) return r.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else
        return null;
    if (n === Vr || n === Gr || n === kr || n === Wr)
      if (r = t.get("WEBGL_compressed_texture_pvrtc"), r !== null) {
        if (n === Vr) return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === Gr) return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === kr) return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === Wr) return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else
        return null;
    if (n === Xr || n === Yr || n === qr)
      if (r = t.get("WEBGL_compressed_texture_etc"), r !== null) {
        if (n === Xr || n === Yr) return a === Kt ? r.COMPRESSED_SRGB8_ETC2 : r.COMPRESSED_RGB8_ETC2;
        if (n === qr) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : r.COMPRESSED_RGBA8_ETC2_EAC;
      } else
        return null;
    if (n === jr || n === Zr || n === Kr || n === $r || n === Jr || n === Qr || n === ta || n === ea || n === na || n === ia || n === sa || n === ra || n === aa || n === oa)
      if (r = t.get("WEBGL_compressed_texture_astc"), r !== null) {
        if (n === jr) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : r.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === Zr) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : r.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === Kr) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : r.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === $r) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : r.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === Jr) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : r.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === Qr) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : r.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === ta) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : r.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === ea) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : r.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === na) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : r.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === ia) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : r.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === sa) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : r.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === ra) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : r.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === aa) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : r.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === oa) return a === Kt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : r.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else
        return null;
    if (n === Ts || n === la || n === ca)
      if (r = t.get("EXT_texture_compression_bptc"), r !== null) {
        if (n === Ts) return a === Kt ? r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : r.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === la) return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === ca) return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else
        return null;
    if (n === Ml || n === ha || n === ua || n === da)
      if (r = t.get("EXT_texture_compression_rgtc"), r !== null) {
        if (n === Ts) return r.COMPRESSED_RED_RGTC1_EXT;
        if (n === ha) return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === ua) return r.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === da) return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else
        return null;
    return n === yi ? i.UNSIGNED_INT_24_8 : i[n] !== void 0 ? i[n] : null;
  }
  return { convert: e };
}
const sm = { type: "move" };
class br {
  constructor() {
    this._targetRay = null, this._grip = null, this._hand = null;
  }
  getHandSpace() {
    return this._hand === null && (this._hand = new Hi(), this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = { pinching: !1 }), this._hand;
  }
  getTargetRaySpace() {
    return this._targetRay === null && (this._targetRay = new Hi(), this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new D(), this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new D()), this._targetRay;
  }
  getGripSpace() {
    return this._grip === null && (this._grip = new Hi(), this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new D(), this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new D()), this._grip;
  }
  dispatchEvent(t) {
    return this._targetRay !== null && this._targetRay.dispatchEvent(t), this._grip !== null && this._grip.dispatchEvent(t), this._hand !== null && this._hand.dispatchEvent(t), this;
  }
  connect(t) {
    if (t && t.hand) {
      const e = this._hand;
      if (e)
        for (const n of t.hand.values())
          this._getHandJoint(e, n);
    }
    return this.dispatchEvent({ type: "connected", data: t }), this;
  }
  disconnect(t) {
    return this.dispatchEvent({ type: "disconnected", data: t }), this._targetRay !== null && (this._targetRay.visible = !1), this._grip !== null && (this._grip.visible = !1), this._hand !== null && (this._hand.visible = !1), this;
  }
  update(t, e, n) {
    let s = null, r = null, a = null;
    const o = this._targetRay, l = this._grip, c = this._hand;
    if (t && e.session.visibilityState !== "visible-blurred") {
      if (c && t.hand) {
        a = !0;
        for (const x of t.hand.values()) {
          const p = e.getJointPose(x, n), u = this._getHandJoint(c, x);
          p !== null && (u.matrix.fromArray(p.transform.matrix), u.matrix.decompose(u.position, u.rotation, u.scale), u.matrixWorldNeedsUpdate = !0, u.jointRadius = p.radius), u.visible = p !== null;
        }
        const h = c.joints["index-finger-tip"], d = c.joints["thumb-tip"], f = h.position.distanceTo(d.position), m = 0.02, _ = 5e-3;
        c.inputState.pinching && f > m + _ ? (c.inputState.pinching = !1, this.dispatchEvent({
          type: "pinchend",
          handedness: t.handedness,
          target: this
        })) : !c.inputState.pinching && f <= m - _ && (c.inputState.pinching = !0, this.dispatchEvent({
          type: "pinchstart",
          handedness: t.handedness,
          target: this
        }));
      } else
        l !== null && t.gripSpace && (r = e.getPose(t.gripSpace, n), r !== null && (l.matrix.fromArray(r.transform.matrix), l.matrix.decompose(l.position, l.rotation, l.scale), l.matrixWorldNeedsUpdate = !0, r.linearVelocity ? (l.hasLinearVelocity = !0, l.linearVelocity.copy(r.linearVelocity)) : l.hasLinearVelocity = !1, r.angularVelocity ? (l.hasAngularVelocity = !0, l.angularVelocity.copy(r.angularVelocity)) : l.hasAngularVelocity = !1));
      o !== null && (s = e.getPose(t.targetRaySpace, n), s === null && r !== null && (s = r), s !== null && (o.matrix.fromArray(s.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = !0, s.linearVelocity ? (o.hasLinearVelocity = !0, o.linearVelocity.copy(s.linearVelocity)) : o.hasLinearVelocity = !1, s.angularVelocity ? (o.hasAngularVelocity = !0, o.angularVelocity.copy(s.angularVelocity)) : o.hasAngularVelocity = !1, this.dispatchEvent(sm)));
    }
    return o !== null && (o.visible = s !== null), l !== null && (l.visible = r !== null), c !== null && (c.visible = a !== null), this;
  }
  // private method
  _getHandJoint(t, e) {
    if (t.joints[e.jointName] === void 0) {
      const n = new Hi();
      n.matrixAutoUpdate = !1, n.visible = !1, t.joints[e.jointName] = n, t.add(n);
    }
    return t.joints[e.jointName];
  }
}
const rm = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`, am = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
class om {
  constructor() {
    this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
  }
  init(t, e, n) {
    if (this.texture === null) {
      const s = new Te(), r = t.properties.get(s);
      r.__webglTexture = e.texture, (e.depthNear !== n.depthNear || e.depthFar !== n.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = s;
    }
  }
  getMesh(t) {
    if (this.texture !== null && this.mesh === null) {
      const e = t.cameras[0].viewport, n = new fn({
        vertexShader: rm,
        fragmentShader: am,
        uniforms: {
          depthColor: { value: this.texture },
          depthWidth: { value: e.z },
          depthHeight: { value: e.w }
        }
      });
      this.mesh = new Ee(new ks(20, 20), n);
    }
    return this.mesh;
  }
  reset() {
    this.texture = null, this.mesh = null;
  }
  getDepthTexture() {
    return this.texture;
  }
}
class lm extends Xn {
  constructor(t, e) {
    super();
    const n = this;
    let s = null, r = 1, a = null, o = "local-floor", l = 1, c = null, h = null, d = null, f = null, m = null, _ = null;
    const x = new om(), p = e.getContextAttributes();
    let u = null, b = null;
    const T = [], y = [], P = new Ct();
    let A = null;
    const R = new He();
    R.viewport = new re();
    const I = new He();
    I.viewport = new re();
    const S = [R, I], M = new Ah();
    let C = null, H = null;
    this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(Y) {
      let tt = T[Y];
      return tt === void 0 && (tt = new br(), T[Y] = tt), tt.getTargetRaySpace();
    }, this.getControllerGrip = function(Y) {
      let tt = T[Y];
      return tt === void 0 && (tt = new br(), T[Y] = tt), tt.getGripSpace();
    }, this.getHand = function(Y) {
      let tt = T[Y];
      return tt === void 0 && (tt = new br(), T[Y] = tt), tt.getHandSpace();
    };
    function B(Y) {
      const tt = y.indexOf(Y.inputSource);
      if (tt === -1)
        return;
      const _t = T[tt];
      _t !== void 0 && (_t.update(Y.inputSource, Y.frame, c || a), _t.dispatchEvent({ type: Y.type, data: Y.inputSource }));
    }
    function k() {
      s.removeEventListener("select", B), s.removeEventListener("selectstart", B), s.removeEventListener("selectend", B), s.removeEventListener("squeeze", B), s.removeEventListener("squeezestart", B), s.removeEventListener("squeezeend", B), s.removeEventListener("end", k), s.removeEventListener("inputsourceschange", Z);
      for (let Y = 0; Y < T.length; Y++) {
        const tt = y[Y];
        tt !== null && (y[Y] = null, T[Y].disconnect(tt));
      }
      C = null, H = null, x.reset(), t.setRenderTarget(u), m = null, f = null, d = null, s = null, b = null, Jt.stop(), n.isPresenting = !1, t.setPixelRatio(A), t.setSize(P.width, P.height, !1), n.dispatchEvent({ type: "sessionend" });
    }
    this.setFramebufferScaleFactor = function(Y) {
      r = Y, n.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.");
    }, this.setReferenceSpaceType = function(Y) {
      o = Y, n.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.");
    }, this.getReferenceSpace = function() {
      return c || a;
    }, this.setReferenceSpace = function(Y) {
      c = Y;
    }, this.getBaseLayer = function() {
      return f !== null ? f : m;
    }, this.getBinding = function() {
      return d;
    }, this.getFrame = function() {
      return _;
    }, this.getSession = function() {
      return s;
    }, this.setSession = async function(Y) {
      if (s = Y, s !== null) {
        if (u = t.getRenderTarget(), s.addEventListener("select", B), s.addEventListener("selectstart", B), s.addEventListener("selectend", B), s.addEventListener("squeeze", B), s.addEventListener("squeezestart", B), s.addEventListener("squeezeend", B), s.addEventListener("end", k), s.addEventListener("inputsourceschange", Z), p.xrCompatible !== !0 && await e.makeXRCompatible(), A = t.getPixelRatio(), t.getSize(P), s.enabledFeatures !== void 0 && s.enabledFeatures.includes("layers")) {
          let _t = null, rt = null, Tt = null;
          p.depth && (Tt = p.stencil ? e.DEPTH24_STENCIL8 : e.DEPTH_COMPONENT24, _t = p.stencil ? Ei : gi, rt = p.stencil ? yi : Gn);
          const wt = {
            colorFormat: e.RGBA8,
            depthFormat: Tt,
            scaleFactor: r
          };
          d = new XRWebGLBinding(s, e), f = d.createProjectionLayer(wt), s.updateRenderState({ layers: [f] }), t.setPixelRatio(1), t.setSize(f.textureWidth, f.textureHeight, !1), b = new kn(
            f.textureWidth,
            f.textureHeight,
            {
              format: qe,
              type: dn,
              depthTexture: new Ul(f.textureWidth, f.textureHeight, rt, void 0, void 0, void 0, void 0, void 0, void 0, _t),
              stencilBuffer: p.stencil,
              colorSpace: t.outputColorSpace,
              samples: p.antialias ? 4 : 0,
              resolveDepthBuffer: f.ignoreDepthValues === !1
            }
          );
        } else {
          const _t = {
            antialias: p.antialias,
            alpha: !0,
            depth: p.depth,
            stencil: p.stencil,
            framebufferScaleFactor: r
          };
          m = new XRWebGLLayer(s, e, _t), s.updateRenderState({ baseLayer: m }), t.setPixelRatio(1), t.setSize(m.framebufferWidth, m.framebufferHeight, !1), b = new kn(
            m.framebufferWidth,
            m.framebufferHeight,
            {
              format: qe,
              type: dn,
              colorSpace: t.outputColorSpace,
              stencilBuffer: p.stencil
            }
          );
        }
        b.isXRRenderTarget = !0, this.setFoveation(l), c = null, a = await s.requestReferenceSpace(o), Jt.setContext(s), Jt.start(), n.isPresenting = !0, n.dispatchEvent({ type: "sessionstart" });
      }
    }, this.getEnvironmentBlendMode = function() {
      if (s !== null)
        return s.environmentBlendMode;
    }, this.getDepthTexture = function() {
      return x.getDepthTexture();
    };
    function Z(Y) {
      for (let tt = 0; tt < Y.removed.length; tt++) {
        const _t = Y.removed[tt], rt = y.indexOf(_t);
        rt >= 0 && (y[rt] = null, T[rt].disconnect(_t));
      }
      for (let tt = 0; tt < Y.added.length; tt++) {
        const _t = Y.added[tt];
        let rt = y.indexOf(_t);
        if (rt === -1) {
          for (let wt = 0; wt < T.length; wt++)
            if (wt >= y.length) {
              y.push(_t), rt = wt;
              break;
            } else if (y[wt] === null) {
              y[wt] = _t, rt = wt;
              break;
            }
          if (rt === -1) break;
        }
        const Tt = T[rt];
        Tt && Tt.connect(_t);
      }
    }
    const W = new D(), Q = new D();
    function G(Y, tt, _t) {
      W.setFromMatrixPosition(tt.matrixWorld), Q.setFromMatrixPosition(_t.matrixWorld);
      const rt = W.distanceTo(Q), Tt = tt.projectionMatrix.elements, wt = _t.projectionMatrix.elements, Ot = Tt[14] / (Tt[10] - 1), ne = Tt[14] / (Tt[10] + 1), Vt = (Tt[9] + 1) / Tt[5], ae = (Tt[9] - 1) / Tt[5], w = (Tt[8] - 1) / Tt[0], Ne = (wt[8] + 1) / wt[0], Bt = Ot * w, zt = Ot * Ne, Mt = rt / (-w + Ne), te = Mt * -w;
      if (tt.matrixWorld.decompose(Y.position, Y.quaternion, Y.scale), Y.translateX(te), Y.translateZ(Mt), Y.matrixWorld.compose(Y.position, Y.quaternion, Y.scale), Y.matrixWorldInverse.copy(Y.matrixWorld).invert(), Tt[10] === -1)
        Y.projectionMatrix.copy(tt.projectionMatrix), Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse);
      else {
        const vt = Ot + Mt, E = ne + Mt, g = Bt - te, F = zt + (rt - te), q = Vt * ne / E * vt, K = ae * ne / E * vt;
        Y.projectionMatrix.makePerspective(g, F, q, K, vt, E), Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert();
      }
    }
    function st(Y, tt) {
      tt === null ? Y.matrixWorld.copy(Y.matrix) : Y.matrixWorld.multiplyMatrices(tt.matrixWorld, Y.matrix), Y.matrixWorldInverse.copy(Y.matrixWorld).invert();
    }
    this.updateCamera = function(Y) {
      if (s === null) return;
      let tt = Y.near, _t = Y.far;
      x.texture !== null && (x.depthNear > 0 && (tt = x.depthNear), x.depthFar > 0 && (_t = x.depthFar)), M.near = I.near = R.near = tt, M.far = I.far = R.far = _t, (C !== M.near || H !== M.far) && (s.updateRenderState({
        depthNear: M.near,
        depthFar: M.far
      }), C = M.near, H = M.far), R.layers.mask = Y.layers.mask | 2, I.layers.mask = Y.layers.mask | 4, M.layers.mask = R.layers.mask | I.layers.mask;
      const rt = Y.parent, Tt = M.cameras;
      st(M, rt);
      for (let wt = 0; wt < Tt.length; wt++)
        st(Tt[wt], rt);
      Tt.length === 2 ? G(M, R, I) : M.projectionMatrix.copy(R.projectionMatrix), ut(Y, M, rt);
    };
    function ut(Y, tt, _t) {
      _t === null ? Y.matrix.copy(tt.matrixWorld) : (Y.matrix.copy(_t.matrixWorld), Y.matrix.invert(), Y.matrix.multiply(tt.matrixWorld)), Y.matrix.decompose(Y.position, Y.quaternion, Y.scale), Y.updateMatrixWorld(!0), Y.projectionMatrix.copy(tt.projectionMatrix), Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse), Y.isPerspectiveCamera && (Y.fov = fa * 2 * Math.atan(1 / Y.projectionMatrix.elements[5]), Y.zoom = 1);
    }
    this.getCamera = function() {
      return M;
    }, this.getFoveation = function() {
      if (!(f === null && m === null))
        return l;
    }, this.setFoveation = function(Y) {
      l = Y, f !== null && (f.fixedFoveation = Y), m !== null && m.fixedFoveation !== void 0 && (m.fixedFoveation = Y);
    }, this.hasDepthSensing = function() {
      return x.texture !== null;
    }, this.getDepthSensingMesh = function() {
      return x.getMesh(M);
    };
    let xt = null;
    function Ft(Y, tt) {
      if (h = tt.getViewerPose(c || a), _ = tt, h !== null) {
        const _t = h.views;
        m !== null && (t.setRenderTargetFramebuffer(b, m.framebuffer), t.setRenderTarget(b));
        let rt = !1;
        _t.length !== M.cameras.length && (M.cameras.length = 0, rt = !0);
        for (let wt = 0; wt < _t.length; wt++) {
          const Ot = _t[wt];
          let ne = null;
          if (m !== null)
            ne = m.getViewport(Ot);
          else {
            const ae = d.getViewSubImage(f, Ot);
            ne = ae.viewport, wt === 0 && (t.setRenderTargetTextures(
              b,
              ae.colorTexture,
              f.ignoreDepthValues ? void 0 : ae.depthStencilTexture
            ), t.setRenderTarget(b));
          }
          let Vt = S[wt];
          Vt === void 0 && (Vt = new He(), Vt.layers.enable(wt), Vt.viewport = new re(), S[wt] = Vt), Vt.matrix.fromArray(Ot.transform.matrix), Vt.matrix.decompose(Vt.position, Vt.quaternion, Vt.scale), Vt.projectionMatrix.fromArray(Ot.projectionMatrix), Vt.projectionMatrixInverse.copy(Vt.projectionMatrix).invert(), Vt.viewport.set(ne.x, ne.y, ne.width, ne.height), wt === 0 && (M.matrix.copy(Vt.matrix), M.matrix.decompose(M.position, M.quaternion, M.scale)), rt === !0 && M.cameras.push(Vt);
        }
        const Tt = s.enabledFeatures;
        if (Tt && Tt.includes("depth-sensing")) {
          const wt = d.getDepthInformation(_t[0]);
          wt && wt.isValid && wt.texture && x.init(t, wt, s.renderState);
        }
      }
      for (let _t = 0; _t < T.length; _t++) {
        const rt = y[_t], Tt = T[_t];
        rt !== null && Tt !== void 0 && Tt.update(rt, tt, c || a);
      }
      xt && xt(Y, tt), tt.detectedPlanes && n.dispatchEvent({ type: "planesdetected", data: tt }), _ = null;
    }
    const Jt = new zl();
    Jt.setAnimationLoop(Ft), this.setAnimationLoop = function(Y) {
      xt = Y;
    }, this.dispose = function() {
    };
  }
}
const Nn = /* @__PURE__ */ new Qe(), cm = /* @__PURE__ */ new Yt();
function hm(i, t) {
  function e(p, u) {
    p.matrixAutoUpdate === !0 && p.updateMatrix(), u.value.copy(p.matrix);
  }
  function n(p, u) {
    u.color.getRGB(p.fogColor.value, Cl(i)), u.isFog ? (p.fogNear.value = u.near, p.fogFar.value = u.far) : u.isFogExp2 && (p.fogDensity.value = u.density);
  }
  function s(p, u, b, T, y) {
    u.isMeshBasicMaterial || u.isMeshLambertMaterial ? r(p, u) : u.isMeshToonMaterial ? (r(p, u), d(p, u)) : u.isMeshPhongMaterial ? (r(p, u), h(p, u)) : u.isMeshStandardMaterial ? (r(p, u), f(p, u), u.isMeshPhysicalMaterial && m(p, u, y)) : u.isMeshMatcapMaterial ? (r(p, u), _(p, u)) : u.isMeshDepthMaterial ? r(p, u) : u.isMeshDistanceMaterial ? (r(p, u), x(p, u)) : u.isMeshNormalMaterial ? r(p, u) : u.isLineBasicMaterial ? (a(p, u), u.isLineDashedMaterial && o(p, u)) : u.isPointsMaterial ? l(p, u, b, T) : u.isSpriteMaterial ? c(p, u) : u.isShadowMaterial ? (p.color.value.copy(u.color), p.opacity.value = u.opacity) : u.isShaderMaterial && (u.uniformsNeedUpdate = !1);
  }
  function r(p, u) {
    p.opacity.value = u.opacity, u.color && p.diffuse.value.copy(u.color), u.emissive && p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity), u.map && (p.map.value = u.map, e(u.map, p.mapTransform)), u.alphaMap && (p.alphaMap.value = u.alphaMap, e(u.alphaMap, p.alphaMapTransform)), u.bumpMap && (p.bumpMap.value = u.bumpMap, e(u.bumpMap, p.bumpMapTransform), p.bumpScale.value = u.bumpScale, u.side === Ce && (p.bumpScale.value *= -1)), u.normalMap && (p.normalMap.value = u.normalMap, e(u.normalMap, p.normalMapTransform), p.normalScale.value.copy(u.normalScale), u.side === Ce && p.normalScale.value.negate()), u.displacementMap && (p.displacementMap.value = u.displacementMap, e(u.displacementMap, p.displacementMapTransform), p.displacementScale.value = u.displacementScale, p.displacementBias.value = u.displacementBias), u.emissiveMap && (p.emissiveMap.value = u.emissiveMap, e(u.emissiveMap, p.emissiveMapTransform)), u.specularMap && (p.specularMap.value = u.specularMap, e(u.specularMap, p.specularMapTransform)), u.alphaTest > 0 && (p.alphaTest.value = u.alphaTest);
    const b = t.get(u), T = b.envMap, y = b.envMapRotation;
    T && (p.envMap.value = T, Nn.copy(y), Nn.x *= -1, Nn.y *= -1, Nn.z *= -1, T.isCubeTexture && T.isRenderTargetTexture === !1 && (Nn.y *= -1, Nn.z *= -1), p.envMapRotation.value.setFromMatrix4(cm.makeRotationFromEuler(Nn)), p.flipEnvMap.value = T.isCubeTexture && T.isRenderTargetTexture === !1 ? -1 : 1, p.reflectivity.value = u.reflectivity, p.ior.value = u.ior, p.refractionRatio.value = u.refractionRatio), u.lightMap && (p.lightMap.value = u.lightMap, p.lightMapIntensity.value = u.lightMapIntensity, e(u.lightMap, p.lightMapTransform)), u.aoMap && (p.aoMap.value = u.aoMap, p.aoMapIntensity.value = u.aoMapIntensity, e(u.aoMap, p.aoMapTransform));
  }
  function a(p, u) {
    p.diffuse.value.copy(u.color), p.opacity.value = u.opacity, u.map && (p.map.value = u.map, e(u.map, p.mapTransform));
  }
  function o(p, u) {
    p.dashSize.value = u.dashSize, p.totalSize.value = u.dashSize + u.gapSize, p.scale.value = u.scale;
  }
  function l(p, u, b, T) {
    p.diffuse.value.copy(u.color), p.opacity.value = u.opacity, p.size.value = u.size * b, p.scale.value = T * 0.5, u.map && (p.map.value = u.map, e(u.map, p.uvTransform)), u.alphaMap && (p.alphaMap.value = u.alphaMap, e(u.alphaMap, p.alphaMapTransform)), u.alphaTest > 0 && (p.alphaTest.value = u.alphaTest);
  }
  function c(p, u) {
    p.diffuse.value.copy(u.color), p.opacity.value = u.opacity, p.rotation.value = u.rotation, u.map && (p.map.value = u.map, e(u.map, p.mapTransform)), u.alphaMap && (p.alphaMap.value = u.alphaMap, e(u.alphaMap, p.alphaMapTransform)), u.alphaTest > 0 && (p.alphaTest.value = u.alphaTest);
  }
  function h(p, u) {
    p.specular.value.copy(u.specular), p.shininess.value = Math.max(u.shininess, 1e-4);
  }
  function d(p, u) {
    u.gradientMap && (p.gradientMap.value = u.gradientMap);
  }
  function f(p, u) {
    p.metalness.value = u.metalness, u.metalnessMap && (p.metalnessMap.value = u.metalnessMap, e(u.metalnessMap, p.metalnessMapTransform)), p.roughness.value = u.roughness, u.roughnessMap && (p.roughnessMap.value = u.roughnessMap, e(u.roughnessMap, p.roughnessMapTransform)), u.envMap && (p.envMapIntensity.value = u.envMapIntensity);
  }
  function m(p, u, b) {
    p.ior.value = u.ior, u.sheen > 0 && (p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen), p.sheenRoughness.value = u.sheenRoughness, u.sheenColorMap && (p.sheenColorMap.value = u.sheenColorMap, e(u.sheenColorMap, p.sheenColorMapTransform)), u.sheenRoughnessMap && (p.sheenRoughnessMap.value = u.sheenRoughnessMap, e(u.sheenRoughnessMap, p.sheenRoughnessMapTransform))), u.clearcoat > 0 && (p.clearcoat.value = u.clearcoat, p.clearcoatRoughness.value = u.clearcoatRoughness, u.clearcoatMap && (p.clearcoatMap.value = u.clearcoatMap, e(u.clearcoatMap, p.clearcoatMapTransform)), u.clearcoatRoughnessMap && (p.clearcoatRoughnessMap.value = u.clearcoatRoughnessMap, e(u.clearcoatRoughnessMap, p.clearcoatRoughnessMapTransform)), u.clearcoatNormalMap && (p.clearcoatNormalMap.value = u.clearcoatNormalMap, e(u.clearcoatNormalMap, p.clearcoatNormalMapTransform), p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale), u.side === Ce && p.clearcoatNormalScale.value.negate())), u.dispersion > 0 && (p.dispersion.value = u.dispersion), u.iridescence > 0 && (p.iridescence.value = u.iridescence, p.iridescenceIOR.value = u.iridescenceIOR, p.iridescenceThicknessMinimum.value = u.iridescenceThicknessRange[0], p.iridescenceThicknessMaximum.value = u.iridescenceThicknessRange[1], u.iridescenceMap && (p.iridescenceMap.value = u.iridescenceMap, e(u.iridescenceMap, p.iridescenceMapTransform)), u.iridescenceThicknessMap && (p.iridescenceThicknessMap.value = u.iridescenceThicknessMap, e(u.iridescenceThicknessMap, p.iridescenceThicknessMapTransform))), u.transmission > 0 && (p.transmission.value = u.transmission, p.transmissionSamplerMap.value = b.texture, p.transmissionSamplerSize.value.set(b.width, b.height), u.transmissionMap && (p.transmissionMap.value = u.transmissionMap, e(u.transmissionMap, p.transmissionMapTransform)), p.thickness.value = u.thickness, u.thicknessMap && (p.thicknessMap.value = u.thicknessMap, e(u.thicknessMap, p.thicknessMapTransform)), p.attenuationDistance.value = u.attenuationDistance, p.attenuationColor.value.copy(u.attenuationColor)), u.anisotropy > 0 && (p.anisotropyVector.value.set(u.anisotropy * Math.cos(u.anisotropyRotation), u.anisotropy * Math.sin(u.anisotropyRotation)), u.anisotropyMap && (p.anisotropyMap.value = u.anisotropyMap, e(u.anisotropyMap, p.anisotropyMapTransform))), p.specularIntensity.value = u.specularIntensity, p.specularColor.value.copy(u.specularColor), u.specularColorMap && (p.specularColorMap.value = u.specularColorMap, e(u.specularColorMap, p.specularColorMapTransform)), u.specularIntensityMap && (p.specularIntensityMap.value = u.specularIntensityMap, e(u.specularIntensityMap, p.specularIntensityMapTransform));
  }
  function _(p, u) {
    u.matcap && (p.matcap.value = u.matcap);
  }
  function x(p, u) {
    const b = t.get(u).light;
    p.referencePosition.value.setFromMatrixPosition(b.matrixWorld), p.nearDistance.value = b.shadow.camera.near, p.farDistance.value = b.shadow.camera.far;
  }
  return {
    refreshFogUniforms: n,
    refreshMaterialUniforms: s
  };
}
function um(i, t, e, n) {
  let s = {}, r = {}, a = [];
  const o = i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);
  function l(b, T) {
    const y = T.program;
    n.uniformBlockBinding(b, y);
  }
  function c(b, T) {
    let y = s[b.id];
    y === void 0 && (_(b), y = h(b), s[b.id] = y, b.addEventListener("dispose", p));
    const P = T.program;
    n.updateUBOMapping(b, P);
    const A = t.render.frame;
    r[b.id] !== A && (f(b), r[b.id] = A);
  }
  function h(b) {
    const T = d();
    b.__bindingPointIndex = T;
    const y = i.createBuffer(), P = b.__size, A = b.usage;
    return i.bindBuffer(i.UNIFORM_BUFFER, y), i.bufferData(i.UNIFORM_BUFFER, P, A), i.bindBuffer(i.UNIFORM_BUFFER, null), i.bindBufferBase(i.UNIFORM_BUFFER, T, y), y;
  }
  function d() {
    for (let b = 0; b < o; b++)
      if (a.indexOf(b) === -1)
        return a.push(b), b;
    return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
  }
  function f(b) {
    const T = s[b.id], y = b.uniforms, P = b.__cache;
    i.bindBuffer(i.UNIFORM_BUFFER, T);
    for (let A = 0, R = y.length; A < R; A++) {
      const I = Array.isArray(y[A]) ? y[A] : [y[A]];
      for (let S = 0, M = I.length; S < M; S++) {
        const C = I[S];
        if (m(C, A, S, P) === !0) {
          const H = C.__offset, B = Array.isArray(C.value) ? C.value : [C.value];
          let k = 0;
          for (let Z = 0; Z < B.length; Z++) {
            const W = B[Z], Q = x(W);
            typeof W == "number" || typeof W == "boolean" ? (C.__data[0] = W, i.bufferSubData(i.UNIFORM_BUFFER, H + k, C.__data)) : W.isMatrix3 ? (C.__data[0] = W.elements[0], C.__data[1] = W.elements[1], C.__data[2] = W.elements[2], C.__data[3] = 0, C.__data[4] = W.elements[3], C.__data[5] = W.elements[4], C.__data[6] = W.elements[5], C.__data[7] = 0, C.__data[8] = W.elements[6], C.__data[9] = W.elements[7], C.__data[10] = W.elements[8], C.__data[11] = 0) : (W.toArray(C.__data, k), k += Q.storage / Float32Array.BYTES_PER_ELEMENT);
          }
          i.bufferSubData(i.UNIFORM_BUFFER, H, C.__data);
        }
      }
    }
    i.bindBuffer(i.UNIFORM_BUFFER, null);
  }
  function m(b, T, y, P) {
    const A = b.value, R = T + "_" + y;
    if (P[R] === void 0)
      return typeof A == "number" || typeof A == "boolean" ? P[R] = A : P[R] = A.clone(), !0;
    {
      const I = P[R];
      if (typeof A == "number" || typeof A == "boolean") {
        if (I !== A)
          return P[R] = A, !0;
      } else if (I.equals(A) === !1)
        return I.copy(A), !0;
    }
    return !1;
  }
  function _(b) {
    const T = b.uniforms;
    let y = 0;
    const P = 16;
    for (let R = 0, I = T.length; R < I; R++) {
      const S = Array.isArray(T[R]) ? T[R] : [T[R]];
      for (let M = 0, C = S.length; M < C; M++) {
        const H = S[M], B = Array.isArray(H.value) ? H.value : [H.value];
        for (let k = 0, Z = B.length; k < Z; k++) {
          const W = B[k], Q = x(W), G = y % P, st = G % Q.boundary, ut = G + st;
          y += st, ut !== 0 && P - ut < Q.storage && (y += P - ut), H.__data = new Float32Array(Q.storage / Float32Array.BYTES_PER_ELEMENT), H.__offset = y, y += Q.storage;
        }
      }
    }
    const A = y % P;
    return A > 0 && (y += P - A), b.__size = y, b.__cache = {}, this;
  }
  function x(b) {
    const T = {
      boundary: 0,
      // bytes
      storage: 0
      // bytes
    };
    return typeof b == "number" || typeof b == "boolean" ? (T.boundary = 4, T.storage = 4) : b.isVector2 ? (T.boundary = 8, T.storage = 8) : b.isVector3 || b.isColor ? (T.boundary = 16, T.storage = 12) : b.isVector4 ? (T.boundary = 16, T.storage = 16) : b.isMatrix3 ? (T.boundary = 48, T.storage = 48) : b.isMatrix4 ? (T.boundary = 64, T.storage = 64) : b.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", b), T;
  }
  function p(b) {
    const T = b.target;
    T.removeEventListener("dispose", p);
    const y = a.indexOf(T.__bindingPointIndex);
    a.splice(y, 1), i.deleteBuffer(s[T.id]), delete s[T.id], delete r[T.id];
  }
  function u() {
    for (const b in s)
      i.deleteBuffer(s[b]);
    a = [], s = {}, r = {};
  }
  return {
    bind: l,
    update: c,
    dispose: u
  };
}
class dm {
  constructor(t = {}) {
    const {
      canvas: e = Gc(),
      context: n = null,
      depth: s = !0,
      stencil: r = !1,
      alpha: a = !1,
      antialias: o = !1,
      premultipliedAlpha: l = !0,
      preserveDrawingBuffer: c = !1,
      powerPreference: h = "default",
      failIfMajorPerformanceCaveat: d = !1,
      reverseDepthBuffer: f = !1
    } = t;
    this.isWebGLRenderer = !0;
    let m;
    if (n !== null) {
      if (typeof WebGLRenderingContext < "u" && n instanceof WebGLRenderingContext)
        throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
      m = n.getContextAttributes().alpha;
    } else
      m = a;
    const _ = new Uint32Array(4), x = new Int32Array(4);
    let p = null, u = null;
    const b = [], T = [];
    this.domElement = e, this.debug = {
      /**
       * Enables error checking and reporting when shader programs are being compiled
       * @type {boolean}
       */
      checkShaderErrors: !0,
      /**
       * Callback for custom error reporting.
       * @type {?Function}
       */
      onShaderError: null
    }, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this._outputColorSpace = ze, this.toneMapping = An, this.toneMappingExposure = 1;
    const y = this;
    let P = !1, A = 0, R = 0, I = null, S = -1, M = null;
    const C = new re(), H = new re();
    let B = null;
    const k = new It(0);
    let Z = 0, W = e.width, Q = e.height, G = 1, st = null, ut = null;
    const xt = new re(0, 0, W, Q), Ft = new re(0, 0, W, Q);
    let Jt = !1;
    const Y = new Pa();
    let tt = !1, _t = !1;
    this.transmissionResolutionScale = 1;
    const rt = new Yt(), Tt = new Yt(), wt = new D(), Ot = new re(), ne = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: !0 };
    let Vt = !1;
    function ae() {
      return I === null ? G : 1;
    }
    let w = n;
    function Ne(v, U) {
      return e.getContext(v, U);
    }
    try {
      const v = {
        alpha: !0,
        depth: s,
        stencil: r,
        antialias: o,
        premultipliedAlpha: l,
        preserveDrawingBuffer: c,
        powerPreference: h,
        failIfMajorPerformanceCaveat: d
      };
      if ("setAttribute" in e && e.setAttribute("data-engine", "three.js r172"), e.addEventListener("webglcontextlost", j, !1), e.addEventListener("webglcontextrestored", lt, !1), e.addEventListener("webglcontextcreationerror", ot, !1), w === null) {
        const U = "webgl2";
        if (w = Ne(U, v), w === null)
          throw Ne(U) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
      }
    } catch (v) {
      throw console.error("THREE.WebGLRenderer: " + v.message), v;
    }
    let Bt, zt, Mt, te, vt, E, g, F, q, K, X, gt, at, dt, Gt, J, ft, Et, bt, pt, Ht, Lt, Qt, L;
    function nt() {
      Bt = new Sf(w), Bt.init(), Lt = new im(w, Bt), zt = new mf(w, Bt, t, Lt), Mt = new em(w, Bt), zt.reverseDepthBuffer && f && Mt.buffers.depth.setReversed(!0), te = new Tf(w), vt = new Gp(), E = new nm(w, Bt, Mt, vt, zt, Lt, te), g = new gf(y), F = new Mf(y), q = new Ph(w), Qt = new ff(w, q), K = new yf(w, q, te, Qt), X = new Af(w, K, q, te), bt = new bf(w, zt, E), J = new _f(vt), gt = new Vp(y, g, F, Bt, zt, Qt, J), at = new hm(y, vt), dt = new Wp(), Gt = new Kp(Bt), Et = new df(y, g, F, Mt, X, m, l), ft = new Qp(y, X, zt), L = new um(w, te, zt, Mt), pt = new pf(w, Bt, te), Ht = new Ef(w, Bt, te), te.programs = gt.programs, y.capabilities = zt, y.extensions = Bt, y.properties = vt, y.renderLists = dt, y.shadowMap = ft, y.state = Mt, y.info = te;
    }
    nt();
    const V = new lm(y, w);
    this.xr = V, this.getContext = function() {
      return w;
    }, this.getContextAttributes = function() {
      return w.getContextAttributes();
    }, this.forceContextLoss = function() {
      const v = Bt.get("WEBGL_lose_context");
      v && v.loseContext();
    }, this.forceContextRestore = function() {
      const v = Bt.get("WEBGL_lose_context");
      v && v.restoreContext();
    }, this.getPixelRatio = function() {
      return G;
    }, this.setPixelRatio = function(v) {
      v !== void 0 && (G = v, this.setSize(W, Q, !1));
    }, this.getSize = function(v) {
      return v.set(W, Q);
    }, this.setSize = function(v, U, O = !0) {
      if (V.isPresenting) {
        console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");
        return;
      }
      W = v, Q = U, e.width = Math.floor(v * G), e.height = Math.floor(U * G), O === !0 && (e.style.width = v + "px", e.style.height = U + "px"), this.setViewport(0, 0, v, U);
    }, this.getDrawingBufferSize = function(v) {
      return v.set(W * G, Q * G).floor();
    }, this.setDrawingBufferSize = function(v, U, O) {
      W = v, Q = U, G = O, e.width = Math.floor(v * O), e.height = Math.floor(U * O), this.setViewport(0, 0, v, U);
    }, this.getCurrentViewport = function(v) {
      return v.copy(C);
    }, this.getViewport = function(v) {
      return v.copy(xt);
    }, this.setViewport = function(v, U, O, z) {
      v.isVector4 ? xt.set(v.x, v.y, v.z, v.w) : xt.set(v, U, O, z), Mt.viewport(C.copy(xt).multiplyScalar(G).round());
    }, this.getScissor = function(v) {
      return v.copy(Ft);
    }, this.setScissor = function(v, U, O, z) {
      v.isVector4 ? Ft.set(v.x, v.y, v.z, v.w) : Ft.set(v, U, O, z), Mt.scissor(H.copy(Ft).multiplyScalar(G).round());
    }, this.getScissorTest = function() {
      return Jt;
    }, this.setScissorTest = function(v) {
      Mt.setScissorTest(Jt = v);
    }, this.setOpaqueSort = function(v) {
      st = v;
    }, this.setTransparentSort = function(v) {
      ut = v;
    }, this.getClearColor = function(v) {
      return v.copy(Et.getClearColor());
    }, this.setClearColor = function() {
      Et.setClearColor.apply(Et, arguments);
    }, this.getClearAlpha = function() {
      return Et.getClearAlpha();
    }, this.setClearAlpha = function() {
      Et.setClearAlpha.apply(Et, arguments);
    }, this.clear = function(v = !0, U = !0, O = !0) {
      let z = 0;
      if (v) {
        let N = !1;
        if (I !== null) {
          const $ = I.texture.format;
          N = $ === wa || $ === Aa || $ === ba;
        }
        if (N) {
          const $ = I.texture.type, it = $ === dn || $ === Gn || $ === Gi || $ === yi || $ === ya || $ === Ea, ht = Et.getClearColor(), mt = Et.getClearAlpha(), At = ht.r, Rt = ht.g, St = ht.b;
          it ? (_[0] = At, _[1] = Rt, _[2] = St, _[3] = mt, w.clearBufferuiv(w.COLOR, 0, _)) : (x[0] = At, x[1] = Rt, x[2] = St, x[3] = mt, w.clearBufferiv(w.COLOR, 0, x));
        } else
          z |= w.COLOR_BUFFER_BIT;
      }
      U && (z |= w.DEPTH_BUFFER_BIT), O && (z |= w.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), w.clear(z);
    }, this.clearColor = function() {
      this.clear(!0, !1, !1);
    }, this.clearDepth = function() {
      this.clear(!1, !0, !1);
    }, this.clearStencil = function() {
      this.clear(!1, !1, !0);
    }, this.dispose = function() {
      e.removeEventListener("webglcontextlost", j, !1), e.removeEventListener("webglcontextrestored", lt, !1), e.removeEventListener("webglcontextcreationerror", ot, !1), Et.dispose(), dt.dispose(), Gt.dispose(), vt.dispose(), g.dispose(), F.dispose(), X.dispose(), Qt.dispose(), L.dispose(), gt.dispose(), V.dispose(), V.removeEventListener("sessionstart", Na), V.removeEventListener("sessionend", Fa), Rn.stop();
    };
    function j(v) {
      v.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), P = !0;
    }
    function lt() {
      console.log("THREE.WebGLRenderer: Context Restored."), P = !1;
      const v = te.autoReset, U = ft.enabled, O = ft.autoUpdate, z = ft.needsUpdate, N = ft.type;
      nt(), te.autoReset = v, ft.enabled = U, ft.autoUpdate = O, ft.needsUpdate = z, ft.type = N;
    }
    function ot(v) {
      console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", v.statusMessage);
    }
    function Pt(v) {
      const U = v.target;
      U.removeEventListener("dispose", Pt), ie(U);
    }
    function ie(v) {
      ve(v), vt.remove(v);
    }
    function ve(v) {
      const U = vt.get(v).programs;
      U !== void 0 && (U.forEach(function(O) {
        gt.releaseProgram(O);
      }), v.isShaderMaterial && gt.releaseShaderCache(v));
    }
    this.renderBufferDirect = function(v, U, O, z, N, $) {
      U === null && (U = ne);
      const it = N.isMesh && N.matrixWorld.determinant() < 0, ht = Xl(v, U, O, z, N);
      Mt.setMaterial(z, it);
      let mt = O.index, At = 1;
      if (z.wireframe === !0) {
        if (mt = K.getWireframeAttribute(O), mt === void 0) return;
        At = 2;
      }
      const Rt = O.drawRange, St = O.attributes.position;
      let kt = Rt.start * At, qt = (Rt.start + Rt.count) * At;
      $ !== null && (kt = Math.max(kt, $.start * At), qt = Math.min(qt, ($.start + $.count) * At)), mt !== null ? (kt = Math.max(kt, 0), qt = Math.min(qt, mt.count)) : St != null && (kt = Math.max(kt, 0), qt = Math.min(qt, St.count));
      const oe = qt - kt;
      if (oe < 0 || oe === 1 / 0) return;
      Qt.setup(N, z, ht, O, mt);
      let se, Wt = pt;
      if (mt !== null && (se = q.get(mt), Wt = Ht, Wt.setIndex(se)), N.isMesh)
        z.wireframe === !0 ? (Mt.setLineWidth(z.wireframeLinewidth * ae()), Wt.setMode(w.LINES)) : Wt.setMode(w.TRIANGLES);
      else if (N.isLine) {
        let yt = z.linewidth;
        yt === void 0 && (yt = 1), Mt.setLineWidth(yt * ae()), N.isLineSegments ? Wt.setMode(w.LINES) : N.isLineLoop ? Wt.setMode(w.LINE_LOOP) : Wt.setMode(w.LINE_STRIP);
      } else N.isPoints ? Wt.setMode(w.POINTS) : N.isSprite && Wt.setMode(w.TRIANGLES);
      if (N.isBatchedMesh)
        if (N._multiDrawInstances !== null)
          Wt.renderMultiDrawInstances(N._multiDrawStarts, N._multiDrawCounts, N._multiDrawCount, N._multiDrawInstances);
        else if (Bt.get("WEBGL_multi_draw"))
          Wt.renderMultiDraw(N._multiDrawStarts, N._multiDrawCounts, N._multiDrawCount);
        else {
          const yt = N._multiDrawStarts, _e = N._multiDrawCounts, jt = N._multiDrawCount, Ge = mt ? q.get(mt).bytesPerElement : 1, qn = vt.get(z).currentProgram.getUniforms();
          for (let Pe = 0; Pe < jt; Pe++)
            qn.setValue(w, "_gl_DrawID", Pe), Wt.render(yt[Pe] / Ge, _e[Pe]);
        }
      else if (N.isInstancedMesh)
        Wt.renderInstances(kt, oe, N.count);
      else if (O.isInstancedBufferGeometry) {
        const yt = O._maxInstanceCount !== void 0 ? O._maxInstanceCount : 1 / 0, _e = Math.min(O.instanceCount, yt);
        Wt.renderInstances(kt, oe, _e);
      } else
        Wt.render(kt, oe);
    };
    function Zt(v, U, O) {
      v.transparent === !0 && v.side === cn && v.forceSinglePass === !1 ? (v.side = Ce, v.needsUpdate = !0, qi(v, U, O), v.side = wn, v.needsUpdate = !0, qi(v, U, O), v.side = cn) : qi(v, U, O);
    }
    this.compile = function(v, U, O = null) {
      O === null && (O = v), u = Gt.get(O), u.init(U), T.push(u), O.traverseVisible(function(N) {
        N.isLight && N.layers.test(U.layers) && (u.pushLight(N), N.castShadow && u.pushShadow(N));
      }), v !== O && v.traverseVisible(function(N) {
        N.isLight && N.layers.test(U.layers) && (u.pushLight(N), N.castShadow && u.pushShadow(N));
      }), u.setupLights();
      const z = /* @__PURE__ */ new Set();
      return v.traverse(function(N) {
        if (!(N.isMesh || N.isPoints || N.isLine || N.isSprite))
          return;
        const $ = N.material;
        if ($)
          if (Array.isArray($))
            for (let it = 0; it < $.length; it++) {
              const ht = $[it];
              Zt(ht, O, N), z.add(ht);
            }
          else
            Zt($, O, N), z.add($);
      }), T.pop(), u = null, z;
    }, this.compileAsync = function(v, U, O = null) {
      const z = this.compile(v, U, O);
      return new Promise((N) => {
        function $() {
          if (z.forEach(function(it) {
            vt.get(it).currentProgram.isReady() && z.delete(it);
          }), z.size === 0) {
            N(v);
            return;
          }
          setTimeout($, 10);
        }
        Bt.get("KHR_parallel_shader_compile") !== null ? $() : setTimeout($, 10);
      });
    };
    let Ve = null;
    function tn(v) {
      Ve && Ve(v);
    }
    function Na() {
      Rn.stop();
    }
    function Fa() {
      Rn.start();
    }
    const Rn = new zl();
    Rn.setAnimationLoop(tn), typeof self < "u" && Rn.setContext(self), this.setAnimationLoop = function(v) {
      Ve = v, V.setAnimationLoop(v), v === null ? Rn.stop() : Rn.start();
    }, V.addEventListener("sessionstart", Na), V.addEventListener("sessionend", Fa), this.render = function(v, U) {
      if (U !== void 0 && U.isCamera !== !0) {
        console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        return;
      }
      if (P === !0) return;
      if (v.matrixWorldAutoUpdate === !0 && v.updateMatrixWorld(), U.parent === null && U.matrixWorldAutoUpdate === !0 && U.updateMatrixWorld(), V.enabled === !0 && V.isPresenting === !0 && (V.cameraAutoUpdate === !0 && V.updateCamera(U), U = V.getCamera()), v.isScene === !0 && v.onBeforeRender(y, v, U, I), u = Gt.get(v, T.length), u.init(U), T.push(u), Tt.multiplyMatrices(U.projectionMatrix, U.matrixWorldInverse), Y.setFromProjectionMatrix(Tt), _t = this.localClippingEnabled, tt = J.init(this.clippingPlanes, _t), p = dt.get(v, b.length), p.init(), b.push(p), V.enabled === !0 && V.isPresenting === !0) {
        const $ = y.xr.getDepthSensingMesh();
        $ !== null && Ys($, U, -1 / 0, y.sortObjects);
      }
      Ys(v, U, 0, y.sortObjects), p.finish(), y.sortObjects === !0 && p.sort(st, ut), Vt = V.enabled === !1 || V.isPresenting === !1 || V.hasDepthSensing() === !1, Vt && Et.addToRenderList(p, v), this.info.render.frame++, tt === !0 && J.beginShadows();
      const O = u.state.shadowsArray;
      ft.render(O, v, U), tt === !0 && J.endShadows(), this.info.autoReset === !0 && this.info.reset();
      const z = p.opaque, N = p.transmissive;
      if (u.setupLights(), U.isArrayCamera) {
        const $ = U.cameras;
        if (N.length > 0)
          for (let it = 0, ht = $.length; it < ht; it++) {
            const mt = $[it];
            Ba(z, N, v, mt);
          }
        Vt && Et.render(v);
        for (let it = 0, ht = $.length; it < ht; it++) {
          const mt = $[it];
          Oa(p, v, mt, mt.viewport);
        }
      } else
        N.length > 0 && Ba(z, N, v, U), Vt && Et.render(v), Oa(p, v, U);
      I !== null && R === 0 && (E.updateMultisampleRenderTarget(I), E.updateRenderTargetMipmap(I)), v.isScene === !0 && v.onAfterRender(y, v, U), Qt.resetDefaultState(), S = -1, M = null, T.pop(), T.length > 0 ? (u = T[T.length - 1], tt === !0 && J.setGlobalState(y.clippingPlanes, u.state.camera)) : u = null, b.pop(), b.length > 0 ? p = b[b.length - 1] : p = null;
    };
    function Ys(v, U, O, z) {
      if (v.visible === !1) return;
      if (v.layers.test(U.layers)) {
        if (v.isGroup)
          O = v.renderOrder;
        else if (v.isLOD)
          v.autoUpdate === !0 && v.update(U);
        else if (v.isLight)
          u.pushLight(v), v.castShadow && u.pushShadow(v);
        else if (v.isSprite) {
          if (!v.frustumCulled || Y.intersectsSprite(v)) {
            z && Ot.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Tt);
            const it = X.update(v), ht = v.material;
            ht.visible && p.push(v, it, ht, O, Ot.z, null);
          }
        } else if ((v.isMesh || v.isLine || v.isPoints) && (!v.frustumCulled || Y.intersectsObject(v))) {
          const it = X.update(v), ht = v.material;
          if (z && (v.boundingSphere !== void 0 ? (v.boundingSphere === null && v.computeBoundingSphere(), Ot.copy(v.boundingSphere.center)) : (it.boundingSphere === null && it.computeBoundingSphere(), Ot.copy(it.boundingSphere.center)), Ot.applyMatrix4(v.matrixWorld).applyMatrix4(Tt)), Array.isArray(ht)) {
            const mt = it.groups;
            for (let At = 0, Rt = mt.length; At < Rt; At++) {
              const St = mt[At], kt = ht[St.materialIndex];
              kt && kt.visible && p.push(v, it, kt, O, Ot.z, St);
            }
          } else ht.visible && p.push(v, it, ht, O, Ot.z, null);
        }
      }
      const $ = v.children;
      for (let it = 0, ht = $.length; it < ht; it++)
        Ys($[it], U, O, z);
    }
    function Oa(v, U, O, z) {
      const N = v.opaque, $ = v.transmissive, it = v.transparent;
      u.setupLightsView(O), tt === !0 && J.setGlobalState(y.clippingPlanes, O), z && Mt.viewport(C.copy(z)), N.length > 0 && Yi(N, U, O), $.length > 0 && Yi($, U, O), it.length > 0 && Yi(it, U, O), Mt.buffers.depth.setTest(!0), Mt.buffers.depth.setMask(!0), Mt.buffers.color.setMask(!0), Mt.setPolygonOffset(!1);
    }
    function Ba(v, U, O, z) {
      if ((O.isScene === !0 ? O.overrideMaterial : null) !== null)
        return;
      u.state.transmissionRenderTarget[z.id] === void 0 && (u.state.transmissionRenderTarget[z.id] = new kn(1, 1, {
        generateMipmaps: !0,
        type: Bt.has("EXT_color_buffer_half_float") || Bt.has("EXT_color_buffer_float") ? ki : dn,
        minFilter: Vn,
        samples: 4,
        stencilBuffer: r,
        resolveDepthBuffer: !1,
        resolveStencilBuffer: !1,
        colorSpace: Xt.workingColorSpace
      }));
      const $ = u.state.transmissionRenderTarget[z.id], it = z.viewport || C;
      $.setSize(it.z * y.transmissionResolutionScale, it.w * y.transmissionResolutionScale);
      const ht = y.getRenderTarget();
      y.setRenderTarget($), y.getClearColor(k), Z = y.getClearAlpha(), Z < 1 && y.setClearColor(16777215, 0.5), y.clear(), Vt && Et.render(O);
      const mt = y.toneMapping;
      y.toneMapping = An;
      const At = z.viewport;
      if (z.viewport !== void 0 && (z.viewport = void 0), u.setupLightsView(z), tt === !0 && J.setGlobalState(y.clippingPlanes, z), Yi(v, O, z), E.updateMultisampleRenderTarget($), E.updateRenderTargetMipmap($), Bt.has("WEBGL_multisampled_render_to_texture") === !1) {
        let Rt = !1;
        for (let St = 0, kt = U.length; St < kt; St++) {
          const qt = U[St], oe = qt.object, se = qt.geometry, Wt = qt.material, yt = qt.group;
          if (Wt.side === cn && oe.layers.test(z.layers)) {
            const _e = Wt.side;
            Wt.side = Ce, Wt.needsUpdate = !0, za(oe, O, z, se, Wt, yt), Wt.side = _e, Wt.needsUpdate = !0, Rt = !0;
          }
        }
        Rt === !0 && (E.updateMultisampleRenderTarget($), E.updateRenderTargetMipmap($));
      }
      y.setRenderTarget(ht), y.setClearColor(k, Z), At !== void 0 && (z.viewport = At), y.toneMapping = mt;
    }
    function Yi(v, U, O) {
      const z = U.isScene === !0 ? U.overrideMaterial : null;
      for (let N = 0, $ = v.length; N < $; N++) {
        const it = v[N], ht = it.object, mt = it.geometry, At = z === null ? it.material : z, Rt = it.group;
        ht.layers.test(O.layers) && za(ht, U, O, mt, At, Rt);
      }
    }
    function za(v, U, O, z, N, $) {
      v.onBeforeRender(y, U, O, z, N, $), v.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse, v.matrixWorld), v.normalMatrix.getNormalMatrix(v.modelViewMatrix), N.onBeforeRender(y, U, O, z, v, $), N.transparent === !0 && N.side === cn && N.forceSinglePass === !1 ? (N.side = Ce, N.needsUpdate = !0, y.renderBufferDirect(O, U, z, N, v, $), N.side = wn, N.needsUpdate = !0, y.renderBufferDirect(O, U, z, N, v, $), N.side = cn) : y.renderBufferDirect(O, U, z, N, v, $), v.onAfterRender(y, U, O, z, N, $);
    }
    function qi(v, U, O) {
      U.isScene !== !0 && (U = ne);
      const z = vt.get(v), N = u.state.lights, $ = u.state.shadowsArray, it = N.state.version, ht = gt.getParameters(v, N.state, $, U, O), mt = gt.getProgramCacheKey(ht);
      let At = z.programs;
      z.environment = v.isMeshStandardMaterial ? U.environment : null, z.fog = U.fog, z.envMap = (v.isMeshStandardMaterial ? F : g).get(v.envMap || z.environment), z.envMapRotation = z.environment !== null && v.envMap === null ? U.environmentRotation : v.envMapRotation, At === void 0 && (v.addEventListener("dispose", Pt), At = /* @__PURE__ */ new Map(), z.programs = At);
      let Rt = At.get(mt);
      if (Rt !== void 0) {
        if (z.currentProgram === Rt && z.lightsStateVersion === it)
          return Va(v, ht), Rt;
      } else
        ht.uniforms = gt.getUniforms(v), v.onBeforeCompile(ht, y), Rt = gt.acquireProgram(ht, mt), At.set(mt, Rt), z.uniforms = ht.uniforms;
      const St = z.uniforms;
      return (!v.isShaderMaterial && !v.isRawShaderMaterial || v.clipping === !0) && (St.clippingPlanes = J.uniform), Va(v, ht), z.needsLights = ql(v), z.lightsStateVersion = it, z.needsLights && (St.ambientLightColor.value = N.state.ambient, St.lightProbe.value = N.state.probe, St.directionalLights.value = N.state.directional, St.directionalLightShadows.value = N.state.directionalShadow, St.spotLights.value = N.state.spot, St.spotLightShadows.value = N.state.spotShadow, St.rectAreaLights.value = N.state.rectArea, St.ltc_1.value = N.state.rectAreaLTC1, St.ltc_2.value = N.state.rectAreaLTC2, St.pointLights.value = N.state.point, St.pointLightShadows.value = N.state.pointShadow, St.hemisphereLights.value = N.state.hemi, St.directionalShadowMap.value = N.state.directionalShadowMap, St.directionalShadowMatrix.value = N.state.directionalShadowMatrix, St.spotShadowMap.value = N.state.spotShadowMap, St.spotLightMatrix.value = N.state.spotLightMatrix, St.spotLightMap.value = N.state.spotLightMap, St.pointShadowMap.value = N.state.pointShadowMap, St.pointShadowMatrix.value = N.state.pointShadowMatrix), z.currentProgram = Rt, z.uniformsList = null, Rt;
    }
    function Ha(v) {
      if (v.uniformsList === null) {
        const U = v.currentProgram.getUniforms();
        v.uniformsList = As.seqWithValue(U.seq, v.uniforms);
      }
      return v.uniformsList;
    }
    function Va(v, U) {
      const O = vt.get(v);
      O.outputColorSpace = U.outputColorSpace, O.batching = U.batching, O.batchingColor = U.batchingColor, O.instancing = U.instancing, O.instancingColor = U.instancingColor, O.instancingMorph = U.instancingMorph, O.skinning = U.skinning, O.morphTargets = U.morphTargets, O.morphNormals = U.morphNormals, O.morphColors = U.morphColors, O.morphTargetsCount = U.morphTargetsCount, O.numClippingPlanes = U.numClippingPlanes, O.numIntersection = U.numClipIntersection, O.vertexAlphas = U.vertexAlphas, O.vertexTangents = U.vertexTangents, O.toneMapping = U.toneMapping;
    }
    function Xl(v, U, O, z, N) {
      U.isScene !== !0 && (U = ne), E.resetTextureUnits();
      const $ = U.fog, it = z.isMeshStandardMaterial ? U.environment : null, ht = I === null ? y.outputColorSpace : I.isXRRenderTarget === !0 ? I.texture.colorSpace : Ti, mt = (z.isMeshStandardMaterial ? F : g).get(z.envMap || it), At = z.vertexColors === !0 && !!O.attributes.color && O.attributes.color.itemSize === 4, Rt = !!O.attributes.tangent && (!!z.normalMap || z.anisotropy > 0), St = !!O.morphAttributes.position, kt = !!O.morphAttributes.normal, qt = !!O.morphAttributes.color;
      let oe = An;
      z.toneMapped && (I === null || I.isXRRenderTarget === !0) && (oe = y.toneMapping);
      const se = O.morphAttributes.position || O.morphAttributes.normal || O.morphAttributes.color, Wt = se !== void 0 ? se.length : 0, yt = vt.get(z), _e = u.state.lights;
      if (tt === !0 && (_t === !0 || v !== M)) {
        const Se = v === M && z.id === S;
        J.setState(z, v, Se);
      }
      let jt = !1;
      z.version === yt.__version ? (yt.needsLights && yt.lightsStateVersion !== _e.state.version || yt.outputColorSpace !== ht || N.isBatchedMesh && yt.batching === !1 || !N.isBatchedMesh && yt.batching === !0 || N.isBatchedMesh && yt.batchingColor === !0 && N.colorTexture === null || N.isBatchedMesh && yt.batchingColor === !1 && N.colorTexture !== null || N.isInstancedMesh && yt.instancing === !1 || !N.isInstancedMesh && yt.instancing === !0 || N.isSkinnedMesh && yt.skinning === !1 || !N.isSkinnedMesh && yt.skinning === !0 || N.isInstancedMesh && yt.instancingColor === !0 && N.instanceColor === null || N.isInstancedMesh && yt.instancingColor === !1 && N.instanceColor !== null || N.isInstancedMesh && yt.instancingMorph === !0 && N.morphTexture === null || N.isInstancedMesh && yt.instancingMorph === !1 && N.morphTexture !== null || yt.envMap !== mt || z.fog === !0 && yt.fog !== $ || yt.numClippingPlanes !== void 0 && (yt.numClippingPlanes !== J.numPlanes || yt.numIntersection !== J.numIntersection) || yt.vertexAlphas !== At || yt.vertexTangents !== Rt || yt.morphTargets !== St || yt.morphNormals !== kt || yt.morphColors !== qt || yt.toneMapping !== oe || yt.morphTargetsCount !== Wt) && (jt = !0) : (jt = !0, yt.__version = z.version);
      let Ge = yt.currentProgram;
      jt === !0 && (Ge = qi(z, U, N));
      let qn = !1, Pe = !1, Ci = !1;
      const ee = Ge.getUniforms(), Fe = yt.uniforms;
      if (Mt.useProgram(Ge.program) && (qn = !0, Pe = !0, Ci = !0), z.id !== S && (S = z.id, Pe = !0), qn || M !== v) {
        Mt.buffers.depth.getReversed() ? (rt.copy(v.projectionMatrix), Wc(rt), Xc(rt), ee.setValue(w, "projectionMatrix", rt)) : ee.setValue(w, "projectionMatrix", v.projectionMatrix), ee.setValue(w, "viewMatrix", v.matrixWorldInverse);
        const Ae = ee.map.cameraPosition;
        Ae !== void 0 && Ae.setValue(w, wt.setFromMatrixPosition(v.matrixWorld)), zt.logarithmicDepthBuffer && ee.setValue(
          w,
          "logDepthBufFC",
          2 / (Math.log(v.far + 1) / Math.LN2)
        ), (z.isMeshPhongMaterial || z.isMeshToonMaterial || z.isMeshLambertMaterial || z.isMeshBasicMaterial || z.isMeshStandardMaterial || z.isShaderMaterial) && ee.setValue(w, "isOrthographic", v.isOrthographicCamera === !0), M !== v && (M = v, Pe = !0, Ci = !0);
      }
      if (N.isSkinnedMesh) {
        ee.setOptional(w, N, "bindMatrix"), ee.setOptional(w, N, "bindMatrixInverse");
        const Se = N.skeleton;
        Se && (Se.boneTexture === null && Se.computeBoneTexture(), ee.setValue(w, "boneTexture", Se.boneTexture, E));
      }
      N.isBatchedMesh && (ee.setOptional(w, N, "batchingTexture"), ee.setValue(w, "batchingTexture", N._matricesTexture, E), ee.setOptional(w, N, "batchingIdTexture"), ee.setValue(w, "batchingIdTexture", N._indirectTexture, E), ee.setOptional(w, N, "batchingColorTexture"), N._colorsTexture !== null && ee.setValue(w, "batchingColorTexture", N._colorsTexture, E));
      const Oe = O.morphAttributes;
      if ((Oe.position !== void 0 || Oe.normal !== void 0 || Oe.color !== void 0) && bt.update(N, O, Ge), (Pe || yt.receiveShadow !== N.receiveShadow) && (yt.receiveShadow = N.receiveShadow, ee.setValue(w, "receiveShadow", N.receiveShadow)), z.isMeshGouraudMaterial && z.envMap !== null && (Fe.envMap.value = mt, Fe.flipEnvMap.value = mt.isCubeTexture && mt.isRenderTargetTexture === !1 ? -1 : 1), z.isMeshStandardMaterial && z.envMap === null && U.environment !== null && (Fe.envMapIntensity.value = U.environmentIntensity), Pe && (ee.setValue(w, "toneMappingExposure", y.toneMappingExposure), yt.needsLights && Yl(Fe, Ci), $ && z.fog === !0 && at.refreshFogUniforms(Fe, $), at.refreshMaterialUniforms(Fe, z, G, Q, u.state.transmissionRenderTarget[v.id]), As.upload(w, Ha(yt), Fe, E)), z.isShaderMaterial && z.uniformsNeedUpdate === !0 && (As.upload(w, Ha(yt), Fe, E), z.uniformsNeedUpdate = !1), z.isSpriteMaterial && ee.setValue(w, "center", N.center), ee.setValue(w, "modelViewMatrix", N.modelViewMatrix), ee.setValue(w, "normalMatrix", N.normalMatrix), ee.setValue(w, "modelMatrix", N.matrixWorld), z.isShaderMaterial || z.isRawShaderMaterial) {
        const Se = z.uniformsGroups;
        for (let Ae = 0, qs = Se.length; Ae < qs; Ae++) {
          const Cn = Se[Ae];
          L.update(Cn, Ge), L.bind(Cn, Ge);
        }
      }
      return Ge;
    }
    function Yl(v, U) {
      v.ambientLightColor.needsUpdate = U, v.lightProbe.needsUpdate = U, v.directionalLights.needsUpdate = U, v.directionalLightShadows.needsUpdate = U, v.pointLights.needsUpdate = U, v.pointLightShadows.needsUpdate = U, v.spotLights.needsUpdate = U, v.spotLightShadows.needsUpdate = U, v.rectAreaLights.needsUpdate = U, v.hemisphereLights.needsUpdate = U;
    }
    function ql(v) {
      return v.isMeshLambertMaterial || v.isMeshToonMaterial || v.isMeshPhongMaterial || v.isMeshStandardMaterial || v.isShadowMaterial || v.isShaderMaterial && v.lights === !0;
    }
    this.getActiveCubeFace = function() {
      return A;
    }, this.getActiveMipmapLevel = function() {
      return R;
    }, this.getRenderTarget = function() {
      return I;
    }, this.setRenderTargetTextures = function(v, U, O) {
      vt.get(v.texture).__webglTexture = U, vt.get(v.depthTexture).__webglTexture = O;
      const z = vt.get(v);
      z.__hasExternalTextures = !0, z.__autoAllocateDepthBuffer = O === void 0, z.__autoAllocateDepthBuffer || Bt.has("WEBGL_multisampled_render_to_texture") === !0 && (console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"), z.__useRenderToTexture = !1);
    }, this.setRenderTargetFramebuffer = function(v, U) {
      const O = vt.get(v);
      O.__webglFramebuffer = U, O.__useDefaultFramebuffer = U === void 0;
    };
    const jl = w.createFramebuffer();
    this.setRenderTarget = function(v, U = 0, O = 0) {
      I = v, A = U, R = O;
      let z = !0, N = null, $ = !1, it = !1;
      if (v) {
        const mt = vt.get(v);
        if (mt.__useDefaultFramebuffer !== void 0)
          Mt.bindFramebuffer(w.FRAMEBUFFER, null), z = !1;
        else if (mt.__webglFramebuffer === void 0)
          E.setupRenderTarget(v);
        else if (mt.__hasExternalTextures)
          E.rebindTextures(v, vt.get(v.texture).__webglTexture, vt.get(v.depthTexture).__webglTexture);
        else if (v.depthBuffer) {
          const St = v.depthTexture;
          if (mt.__boundDepthTexture !== St) {
            if (St !== null && vt.has(St) && (v.width !== St.image.width || v.height !== St.image.height))
              throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");
            E.setupDepthRenderbuffer(v);
          }
        }
        const At = v.texture;
        (At.isData3DTexture || At.isDataArrayTexture || At.isCompressedArrayTexture) && (it = !0);
        const Rt = vt.get(v).__webglFramebuffer;
        v.isWebGLCubeRenderTarget ? (Array.isArray(Rt[U]) ? N = Rt[U][O] : N = Rt[U], $ = !0) : v.samples > 0 && E.useMultisampledRTT(v) === !1 ? N = vt.get(v).__webglMultisampledFramebuffer : Array.isArray(Rt) ? N = Rt[O] : N = Rt, C.copy(v.viewport), H.copy(v.scissor), B = v.scissorTest;
      } else
        C.copy(xt).multiplyScalar(G).floor(), H.copy(Ft).multiplyScalar(G).floor(), B = Jt;
      if (O !== 0 && (N = jl), Mt.bindFramebuffer(w.FRAMEBUFFER, N) && z && Mt.drawBuffers(v, N), Mt.viewport(C), Mt.scissor(H), Mt.setScissorTest(B), $) {
        const mt = vt.get(v.texture);
        w.framebufferTexture2D(w.FRAMEBUFFER, w.COLOR_ATTACHMENT0, w.TEXTURE_CUBE_MAP_POSITIVE_X + U, mt.__webglTexture, O);
      } else if (it) {
        const mt = vt.get(v.texture), At = U;
        w.framebufferTextureLayer(w.FRAMEBUFFER, w.COLOR_ATTACHMENT0, mt.__webglTexture, O, At);
      } else if (v !== null && O !== 0) {
        const mt = vt.get(v.texture);
        w.framebufferTexture2D(w.FRAMEBUFFER, w.COLOR_ATTACHMENT0, w.TEXTURE_2D, mt.__webglTexture, O);
      }
      S = -1;
    }, this.readRenderTargetPixels = function(v, U, O, z, N, $, it) {
      if (!(v && v.isWebGLRenderTarget)) {
        console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        return;
      }
      let ht = vt.get(v).__webglFramebuffer;
      if (v.isWebGLCubeRenderTarget && it !== void 0 && (ht = ht[it]), ht) {
        Mt.bindFramebuffer(w.FRAMEBUFFER, ht);
        try {
          const mt = v.texture, At = mt.format, Rt = mt.type;
          if (!zt.textureFormatReadable(At)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
            return;
          }
          if (!zt.textureTypeReadable(Rt)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
            return;
          }
          U >= 0 && U <= v.width - z && O >= 0 && O <= v.height - N && w.readPixels(U, O, z, N, Lt.convert(At), Lt.convert(Rt), $);
        } finally {
          const mt = I !== null ? vt.get(I).__webglFramebuffer : null;
          Mt.bindFramebuffer(w.FRAMEBUFFER, mt);
        }
      }
    }, this.readRenderTargetPixelsAsync = async function(v, U, O, z, N, $, it) {
      if (!(v && v.isWebGLRenderTarget))
        throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
      let ht = vt.get(v).__webglFramebuffer;
      if (v.isWebGLCubeRenderTarget && it !== void 0 && (ht = ht[it]), ht) {
        const mt = v.texture, At = mt.format, Rt = mt.type;
        if (!zt.textureFormatReadable(At))
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
        if (!zt.textureTypeReadable(Rt))
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
        if (U >= 0 && U <= v.width - z && O >= 0 && O <= v.height - N) {
          Mt.bindFramebuffer(w.FRAMEBUFFER, ht);
          const St = w.createBuffer();
          w.bindBuffer(w.PIXEL_PACK_BUFFER, St), w.bufferData(w.PIXEL_PACK_BUFFER, $.byteLength, w.STREAM_READ), w.readPixels(U, O, z, N, Lt.convert(At), Lt.convert(Rt), 0);
          const kt = I !== null ? vt.get(I).__webglFramebuffer : null;
          Mt.bindFramebuffer(w.FRAMEBUFFER, kt);
          const qt = w.fenceSync(w.SYNC_GPU_COMMANDS_COMPLETE, 0);
          return w.flush(), await kc(w, qt, 4), w.bindBuffer(w.PIXEL_PACK_BUFFER, St), w.getBufferSubData(w.PIXEL_PACK_BUFFER, 0, $), w.deleteBuffer(St), w.deleteSync(qt), $;
        } else
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
      }
    }, this.copyFramebufferToTexture = function(v, U = null, O = 0) {
      v.isTexture !== !0 && (ui("WebGLRenderer: copyFramebufferToTexture function signature has changed."), U = arguments[0] || null, v = arguments[1]);
      const z = Math.pow(2, -O), N = Math.floor(v.image.width * z), $ = Math.floor(v.image.height * z), it = U !== null ? U.x : 0, ht = U !== null ? U.y : 0;
      E.setTexture2D(v, 0), w.copyTexSubImage2D(w.TEXTURE_2D, O, 0, 0, it, ht, N, $), Mt.unbindTexture();
    };
    const Zl = w.createFramebuffer(), Kl = w.createFramebuffer();
    this.copyTextureToTexture = function(v, U, O = null, z = null, N = 0, $ = null) {
      v.isTexture !== !0 && (ui("WebGLRenderer: copyTextureToTexture function signature has changed."), z = arguments[0] || null, v = arguments[1], U = arguments[2], $ = arguments[3] || 0, O = null), $ === null && (N !== 0 ? (ui("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."), $ = N, N = 0) : $ = 0);
      let it, ht, mt, At, Rt, St, kt, qt, oe;
      const se = v.isCompressedTexture ? v.mipmaps[$] : v.image;
      if (O !== null)
        it = O.max.x - O.min.x, ht = O.max.y - O.min.y, mt = O.isBox3 ? O.max.z - O.min.z : 1, At = O.min.x, Rt = O.min.y, St = O.isBox3 ? O.min.z : 0;
      else {
        const Oe = Math.pow(2, -N);
        it = Math.floor(se.width * Oe), ht = Math.floor(se.height * Oe), v.isDataArrayTexture ? mt = se.depth : v.isData3DTexture ? mt = Math.floor(se.depth * Oe) : mt = 1, At = 0, Rt = 0, St = 0;
      }
      z !== null ? (kt = z.x, qt = z.y, oe = z.z) : (kt = 0, qt = 0, oe = 0);
      const Wt = Lt.convert(U.format), yt = Lt.convert(U.type);
      let _e;
      U.isData3DTexture ? (E.setTexture3D(U, 0), _e = w.TEXTURE_3D) : U.isDataArrayTexture || U.isCompressedArrayTexture ? (E.setTexture2DArray(U, 0), _e = w.TEXTURE_2D_ARRAY) : (E.setTexture2D(U, 0), _e = w.TEXTURE_2D), w.pixelStorei(w.UNPACK_FLIP_Y_WEBGL, U.flipY), w.pixelStorei(w.UNPACK_PREMULTIPLY_ALPHA_WEBGL, U.premultiplyAlpha), w.pixelStorei(w.UNPACK_ALIGNMENT, U.unpackAlignment);
      const jt = w.getParameter(w.UNPACK_ROW_LENGTH), Ge = w.getParameter(w.UNPACK_IMAGE_HEIGHT), qn = w.getParameter(w.UNPACK_SKIP_PIXELS), Pe = w.getParameter(w.UNPACK_SKIP_ROWS), Ci = w.getParameter(w.UNPACK_SKIP_IMAGES);
      w.pixelStorei(w.UNPACK_ROW_LENGTH, se.width), w.pixelStorei(w.UNPACK_IMAGE_HEIGHT, se.height), w.pixelStorei(w.UNPACK_SKIP_PIXELS, At), w.pixelStorei(w.UNPACK_SKIP_ROWS, Rt), w.pixelStorei(w.UNPACK_SKIP_IMAGES, St);
      const ee = v.isDataArrayTexture || v.isData3DTexture, Fe = U.isDataArrayTexture || U.isData3DTexture;
      if (v.isDepthTexture) {
        const Oe = vt.get(v), Se = vt.get(U), Ae = vt.get(Oe.__renderTarget), qs = vt.get(Se.__renderTarget);
        Mt.bindFramebuffer(w.READ_FRAMEBUFFER, Ae.__webglFramebuffer), Mt.bindFramebuffer(w.DRAW_FRAMEBUFFER, qs.__webglFramebuffer);
        for (let Cn = 0; Cn < mt; Cn++)
          ee && (w.framebufferTextureLayer(w.READ_FRAMEBUFFER, w.COLOR_ATTACHMENT0, vt.get(v).__webglTexture, N, St + Cn), w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER, w.COLOR_ATTACHMENT0, vt.get(U).__webglTexture, $, oe + Cn)), w.blitFramebuffer(At, Rt, it, ht, kt, qt, it, ht, w.DEPTH_BUFFER_BIT, w.NEAREST);
        Mt.bindFramebuffer(w.READ_FRAMEBUFFER, null), Mt.bindFramebuffer(w.DRAW_FRAMEBUFFER, null);
      } else if (N !== 0 || v.isRenderTargetTexture || vt.has(v)) {
        const Oe = vt.get(v), Se = vt.get(U);
        Mt.bindFramebuffer(w.READ_FRAMEBUFFER, Zl), Mt.bindFramebuffer(w.DRAW_FRAMEBUFFER, Kl);
        for (let Ae = 0; Ae < mt; Ae++)
          ee ? w.framebufferTextureLayer(w.READ_FRAMEBUFFER, w.COLOR_ATTACHMENT0, Oe.__webglTexture, N, St + Ae) : w.framebufferTexture2D(w.READ_FRAMEBUFFER, w.COLOR_ATTACHMENT0, w.TEXTURE_2D, Oe.__webglTexture, N), Fe ? w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER, w.COLOR_ATTACHMENT0, Se.__webglTexture, $, oe + Ae) : w.framebufferTexture2D(w.DRAW_FRAMEBUFFER, w.COLOR_ATTACHMENT0, w.TEXTURE_2D, Se.__webglTexture, $), N !== 0 ? w.blitFramebuffer(At, Rt, it, ht, kt, qt, it, ht, w.COLOR_BUFFER_BIT, w.NEAREST) : Fe ? w.copyTexSubImage3D(_e, $, kt, qt, oe + Ae, At, Rt, it, ht) : w.copyTexSubImage2D(_e, $, kt, qt, At, Rt, it, ht);
        Mt.bindFramebuffer(w.READ_FRAMEBUFFER, null), Mt.bindFramebuffer(w.DRAW_FRAMEBUFFER, null);
      } else
        Fe ? v.isDataTexture || v.isData3DTexture ? w.texSubImage3D(_e, $, kt, qt, oe, it, ht, mt, Wt, yt, se.data) : U.isCompressedArrayTexture ? w.compressedTexSubImage3D(_e, $, kt, qt, oe, it, ht, mt, Wt, se.data) : w.texSubImage3D(_e, $, kt, qt, oe, it, ht, mt, Wt, yt, se) : v.isDataTexture ? w.texSubImage2D(w.TEXTURE_2D, $, kt, qt, it, ht, Wt, yt, se.data) : v.isCompressedTexture ? w.compressedTexSubImage2D(w.TEXTURE_2D, $, kt, qt, se.width, se.height, Wt, se.data) : w.texSubImage2D(w.TEXTURE_2D, $, kt, qt, it, ht, Wt, yt, se);
      w.pixelStorei(w.UNPACK_ROW_LENGTH, jt), w.pixelStorei(w.UNPACK_IMAGE_HEIGHT, Ge), w.pixelStorei(w.UNPACK_SKIP_PIXELS, qn), w.pixelStorei(w.UNPACK_SKIP_ROWS, Pe), w.pixelStorei(w.UNPACK_SKIP_IMAGES, Ci), $ === 0 && U.generateMipmaps && w.generateMipmap(_e), Mt.unbindTexture();
    }, this.copyTextureToTexture3D = function(v, U, O = null, z = null, N = 0) {
      return v.isTexture !== !0 && (ui("WebGLRenderer: copyTextureToTexture3D function signature has changed."), O = arguments[0] || null, z = arguments[1] || null, v = arguments[2], U = arguments[3], N = arguments[4] || 0), ui('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'), this.copyTextureToTexture(v, U, O, z, N);
    }, this.initRenderTarget = function(v) {
      vt.get(v).__webglFramebuffer === void 0 && E.setupRenderTarget(v);
    }, this.initTexture = function(v) {
      v.isCubeTexture ? E.setTextureCube(v, 0) : v.isData3DTexture ? E.setTexture3D(v, 0) : v.isDataArrayTexture || v.isCompressedArrayTexture ? E.setTexture2DArray(v, 0) : E.setTexture2D(v, 0), Mt.unbindTexture();
    }, this.resetState = function() {
      A = 0, R = 0, I = null, Mt.reset(), Qt.reset();
    }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  get coordinateSystem() {
    return hn;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(t) {
    this._outputColorSpace = t;
    const e = this.getContext();
    e.drawingBufferColorspace = Xt._getDrawingBufferColorSpace(t), e.unpackColorSpace = Xt._getUnpackColorSpace();
  }
}
const jo = { type: "change" }, Ia = { type: "start" }, Wl = { type: "end" }, vs = new Gs(), Zo = new yn(), fm = Math.cos(70 * Vc.DEG2RAD), ce = new D(), Re = 2 * Math.PI, $t = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
}, Ar = 1e-6;
class pm extends Rh {
  constructor(t, e = null) {
    super(t, e), this.state = $t.NONE, this.enabled = !0, this.target = new D(), this.cursor = new D(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.keyRotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: mi.ROTATE, MIDDLE: mi.DOLLY, RIGHT: mi.PAN }, this.touches = { ONE: di.ROTATE, TWO: di.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new D(), this._lastQuaternion = new Je(), this._lastTargetPosition = new D(), this._quat = new Je().setFromUnitVectors(t.up, new D(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new yo(), this._sphericalDelta = new yo(), this._scale = 1, this._panOffset = new D(), this._rotateStart = new Ct(), this._rotateEnd = new Ct(), this._rotateDelta = new Ct(), this._panStart = new Ct(), this._panEnd = new Ct(), this._panDelta = new Ct(), this._dollyStart = new Ct(), this._dollyEnd = new Ct(), this._dollyDelta = new Ct(), this._dollyDirection = new D(), this._mouse = new Ct(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = _m.bind(this), this._onPointerDown = mm.bind(this), this._onPointerUp = gm.bind(this), this._onContextMenu = Tm.bind(this), this._onMouseWheel = Mm.bind(this), this._onKeyDown = Sm.bind(this), this._onTouchStart = ym.bind(this), this._onTouchMove = Em.bind(this), this._onMouseDown = vm.bind(this), this._onMouseMove = xm.bind(this), this._interceptControlDown = bm.bind(this), this._interceptControlUp = Am.bind(this), this.domElement !== null && this.connect(), this.update();
  }
  connect() {
    this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointercancel", this._onPointerUp), this.domElement.addEventListener("contextmenu", this._onContextMenu), this.domElement.addEventListener("wheel", this._onMouseWheel, { passive: !1 }), this.domElement.getRootNode().addEventListener("keydown", this._interceptControlDown, { passive: !0, capture: !0 }), this.domElement.style.touchAction = "none";
  }
  disconnect() {
    this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.domElement.removeEventListener("pointercancel", this._onPointerUp), this.domElement.removeEventListener("wheel", this._onMouseWheel), this.domElement.removeEventListener("contextmenu", this._onContextMenu), this.stopListenToKeyEvents(), this.domElement.getRootNode().removeEventListener("keydown", this._interceptControlDown, { capture: !0 }), this.domElement.style.touchAction = "auto";
  }
  dispose() {
    this.disconnect();
  }
  getPolarAngle() {
    return this._spherical.phi;
  }
  getAzimuthalAngle() {
    return this._spherical.theta;
  }
  getDistance() {
    return this.object.position.distanceTo(this.target);
  }
  listenToKeyEvents(t) {
    t.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = t;
  }
  stopListenToKeyEvents() {
    this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
  }
  saveState() {
    this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
  }
  reset() {
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(jo), this.update(), this.state = $t.NONE;
  }
  update(t = null) {
    const e = this.object.position;
    ce.copy(e).sub(this.target), ce.applyQuaternion(this._quat), this._spherical.setFromVector3(ce), this.autoRotate && this.state === $t.NONE && this._rotateLeft(this._getAutoRotationAngle(t)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let n = this.minAzimuthAngle, s = this.maxAzimuthAngle;
    isFinite(n) && isFinite(s) && (n < -Math.PI ? n += Re : n > Math.PI && (n -= Re), s < -Math.PI ? s += Re : s > Math.PI && (s -= Re), n <= s ? this._spherical.theta = Math.max(n, Math.min(s, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (n + s) / 2 ? Math.max(n, this._spherical.theta) : Math.min(s, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
    let r = !1;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera)
      this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const a = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), r = a != this._spherical.radius;
    }
    if (ce.setFromSpherical(this._spherical), ce.applyQuaternion(this._quatInverse), e.copy(this.target).add(ce), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
      let a = null;
      if (this.object.isPerspectiveCamera) {
        const o = ce.length();
        a = this._clampDistance(o * this._scale);
        const l = o - a;
        this.object.position.addScaledVector(this._dollyDirection, l), this.object.updateMatrixWorld(), r = !!l;
      } else if (this.object.isOrthographicCamera) {
        const o = new D(this._mouse.x, this._mouse.y, 0);
        o.unproject(this.object);
        const l = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), r = l !== this.object.zoom;
        const c = new D(this._mouse.x, this._mouse.y, 0);
        c.unproject(this.object), this.object.position.sub(c).add(o), this.object.updateMatrixWorld(), a = ce.length();
      } else
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
      a !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position) : (vs.origin.copy(this.object.position), vs.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(vs.direction)) < fm ? this.object.lookAt(this.target) : (Zo.setFromNormalAndCoplanarPoint(this.object.up, this.target), vs.intersectPlane(Zo, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const a = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), a !== this.object.zoom && (this.object.updateProjectionMatrix(), r = !0);
    }
    return this._scale = 1, this._performCursorZoom = !1, r || this._lastPosition.distanceToSquared(this.object.position) > Ar || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > Ar || this._lastTargetPosition.distanceToSquared(this.target) > Ar ? (this.dispatchEvent(jo), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
  }
  _getAutoRotationAngle(t) {
    return t !== null ? Re / 60 * this.autoRotateSpeed * t : Re / 60 / 60 * this.autoRotateSpeed;
  }
  _getZoomScale(t) {
    const e = Math.abs(t * 0.01);
    return Math.pow(0.95, this.zoomSpeed * e);
  }
  _rotateLeft(t) {
    this._sphericalDelta.theta -= t;
  }
  _rotateUp(t) {
    this._sphericalDelta.phi -= t;
  }
  _panLeft(t, e) {
    ce.setFromMatrixColumn(e, 0), ce.multiplyScalar(-t), this._panOffset.add(ce);
  }
  _panUp(t, e) {
    this.screenSpacePanning === !0 ? ce.setFromMatrixColumn(e, 1) : (ce.setFromMatrixColumn(e, 0), ce.crossVectors(this.object.up, ce)), ce.multiplyScalar(t), this._panOffset.add(ce);
  }
  // deltaX and deltaY are in pixels; right and down are positive
  _pan(t, e) {
    const n = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const s = this.object.position;
      ce.copy(s).sub(this.target);
      let r = ce.length();
      r *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * t * r / n.clientHeight, this.object.matrix), this._panUp(2 * e * r / n.clientHeight, this.object.matrix);
    } else this.object.isOrthographicCamera ? (this._panLeft(t * (this.object.right - this.object.left) / this.object.zoom / n.clientWidth, this.object.matrix), this._panUp(e * (this.object.top - this.object.bottom) / this.object.zoom / n.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
  }
  _dollyOut(t) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= t : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _dollyIn(t) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= t : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _updateZoomParameters(t, e) {
    if (!this.zoomToCursor)
      return;
    this._performCursorZoom = !0;
    const n = this.domElement.getBoundingClientRect(), s = t - n.left, r = e - n.top, a = n.width, o = n.height;
    this._mouse.x = s / a * 2 - 1, this._mouse.y = -(r / o) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
  }
  _clampDistance(t) {
    return Math.max(this.minDistance, Math.min(this.maxDistance, t));
  }
  //
  // event callbacks - update the object state
  //
  _handleMouseDownRotate(t) {
    this._rotateStart.set(t.clientX, t.clientY);
  }
  _handleMouseDownDolly(t) {
    this._updateZoomParameters(t.clientX, t.clientX), this._dollyStart.set(t.clientX, t.clientY);
  }
  _handleMouseDownPan(t) {
    this._panStart.set(t.clientX, t.clientY);
  }
  _handleMouseMoveRotate(t) {
    this._rotateEnd.set(t.clientX, t.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const e = this.domElement;
    this._rotateLeft(Re * this._rotateDelta.x / e.clientHeight), this._rotateUp(Re * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
  }
  _handleMouseMoveDolly(t) {
    this._dollyEnd.set(t.clientX, t.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.update();
  }
  _handleMouseMovePan(t) {
    this._panEnd.set(t.clientX, t.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
  }
  _handleMouseWheel(t) {
    this._updateZoomParameters(t.clientX, t.clientY), t.deltaY < 0 ? this._dollyIn(this._getZoomScale(t.deltaY)) : t.deltaY > 0 && this._dollyOut(this._getZoomScale(t.deltaY)), this.update();
  }
  _handleKeyDown(t) {
    let e = !1;
    switch (t.code) {
      case this.keys.UP:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateUp(Re * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, this.keyPanSpeed), e = !0;
        break;
      case this.keys.BOTTOM:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateUp(-Re * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, -this.keyPanSpeed), e = !0;
        break;
      case this.keys.LEFT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateLeft(Re * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(this.keyPanSpeed, 0), e = !0;
        break;
      case this.keys.RIGHT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateLeft(-Re * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(-this.keyPanSpeed, 0), e = !0;
        break;
    }
    e && (t.preventDefault(), this.update());
  }
  _handleTouchStartRotate(t) {
    if (this._pointers.length === 1)
      this._rotateStart.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), n = 0.5 * (t.pageX + e.x), s = 0.5 * (t.pageY + e.y);
      this._rotateStart.set(n, s);
    }
  }
  _handleTouchStartPan(t) {
    if (this._pointers.length === 1)
      this._panStart.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), n = 0.5 * (t.pageX + e.x), s = 0.5 * (t.pageY + e.y);
      this._panStart.set(n, s);
    }
  }
  _handleTouchStartDolly(t) {
    const e = this._getSecondPointerPosition(t), n = t.pageX - e.x, s = t.pageY - e.y, r = Math.sqrt(n * n + s * s);
    this._dollyStart.set(0, r);
  }
  _handleTouchStartDollyPan(t) {
    this.enableZoom && this._handleTouchStartDolly(t), this.enablePan && this._handleTouchStartPan(t);
  }
  _handleTouchStartDollyRotate(t) {
    this.enableZoom && this._handleTouchStartDolly(t), this.enableRotate && this._handleTouchStartRotate(t);
  }
  _handleTouchMoveRotate(t) {
    if (this._pointers.length == 1)
      this._rotateEnd.set(t.pageX, t.pageY);
    else {
      const n = this._getSecondPointerPosition(t), s = 0.5 * (t.pageX + n.x), r = 0.5 * (t.pageY + n.y);
      this._rotateEnd.set(s, r);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const e = this.domElement;
    this._rotateLeft(Re * this._rotateDelta.x / e.clientHeight), this._rotateUp(Re * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd);
  }
  _handleTouchMovePan(t) {
    if (this._pointers.length === 1)
      this._panEnd.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), n = 0.5 * (t.pageX + e.x), s = 0.5 * (t.pageY + e.y);
      this._panEnd.set(n, s);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(t) {
    const e = this._getSecondPointerPosition(t), n = t.pageX - e.x, s = t.pageY - e.y, r = Math.sqrt(n * n + s * s);
    this._dollyEnd.set(0, r), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
    const a = (t.pageX + e.x) * 0.5, o = (t.pageY + e.y) * 0.5;
    this._updateZoomParameters(a, o);
  }
  _handleTouchMoveDollyPan(t) {
    this.enableZoom && this._handleTouchMoveDolly(t), this.enablePan && this._handleTouchMovePan(t);
  }
  _handleTouchMoveDollyRotate(t) {
    this.enableZoom && this._handleTouchMoveDolly(t), this.enableRotate && this._handleTouchMoveRotate(t);
  }
  // pointers
  _addPointer(t) {
    this._pointers.push(t.pointerId);
  }
  _removePointer(t) {
    delete this._pointerPositions[t.pointerId];
    for (let e = 0; e < this._pointers.length; e++)
      if (this._pointers[e] == t.pointerId) {
        this._pointers.splice(e, 1);
        return;
      }
  }
  _isTrackingPointer(t) {
    for (let e = 0; e < this._pointers.length; e++)
      if (this._pointers[e] == t.pointerId) return !0;
    return !1;
  }
  _trackPointer(t) {
    let e = this._pointerPositions[t.pointerId];
    e === void 0 && (e = new Ct(), this._pointerPositions[t.pointerId] = e), e.set(t.pageX, t.pageY);
  }
  _getSecondPointerPosition(t) {
    const e = t.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[e];
  }
  //
  _customWheelEvent(t) {
    const e = t.deltaMode, n = {
      clientX: t.clientX,
      clientY: t.clientY,
      deltaY: t.deltaY
    };
    switch (e) {
      case 1:
        n.deltaY *= 16;
        break;
      case 2:
        n.deltaY *= 100;
        break;
    }
    return t.ctrlKey && !this._controlActive && (n.deltaY *= 10), n;
  }
}
function mm(i) {
  this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(i.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.domElement.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(i) && (this._addPointer(i), i.pointerType === "touch" ? this._onTouchStart(i) : this._onMouseDown(i)));
}
function _m(i) {
  this.enabled !== !1 && (i.pointerType === "touch" ? this._onTouchMove(i) : this._onMouseMove(i));
}
function gm(i) {
  switch (this._removePointer(i), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(i.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(Wl), this.state = $t.NONE;
      break;
    case 1:
      const t = this._pointers[0], e = this._pointerPositions[t];
      this._onTouchStart({ pointerId: t, pageX: e.x, pageY: e.y });
      break;
  }
}
function vm(i) {
  let t;
  switch (i.button) {
    case 0:
      t = this.mouseButtons.LEFT;
      break;
    case 1:
      t = this.mouseButtons.MIDDLE;
      break;
    case 2:
      t = this.mouseButtons.RIGHT;
      break;
    default:
      t = -1;
  }
  switch (t) {
    case mi.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseDownDolly(i), this.state = $t.DOLLY;
      break;
    case mi.ROTATE:
      if (i.ctrlKey || i.metaKey || i.shiftKey) {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(i), this.state = $t.PAN;
      } else {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(i), this.state = $t.ROTATE;
      }
      break;
    case mi.PAN:
      if (i.ctrlKey || i.metaKey || i.shiftKey) {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(i), this.state = $t.ROTATE;
      } else {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(i), this.state = $t.PAN;
      }
      break;
    default:
      this.state = $t.NONE;
  }
  this.state !== $t.NONE && this.dispatchEvent(Ia);
}
function xm(i) {
  switch (this.state) {
    case $t.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(i);
      break;
    case $t.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(i);
      break;
    case $t.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(i);
      break;
  }
}
function Mm(i) {
  this.enabled === !1 || this.enableZoom === !1 || this.state !== $t.NONE || (i.preventDefault(), this.dispatchEvent(Ia), this._handleMouseWheel(this._customWheelEvent(i)), this.dispatchEvent(Wl));
}
function Sm(i) {
  this.enabled !== !1 && this._handleKeyDown(i);
}
function ym(i) {
  switch (this._trackPointer(i), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case di.ROTATE:
          if (this.enableRotate === !1) return;
          this._handleTouchStartRotate(i), this.state = $t.TOUCH_ROTATE;
          break;
        case di.PAN:
          if (this.enablePan === !1) return;
          this._handleTouchStartPan(i), this.state = $t.TOUCH_PAN;
          break;
        default:
          this.state = $t.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case di.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          this._handleTouchStartDollyPan(i), this.state = $t.TOUCH_DOLLY_PAN;
          break;
        case di.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          this._handleTouchStartDollyRotate(i), this.state = $t.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = $t.NONE;
      }
      break;
    default:
      this.state = $t.NONE;
  }
  this.state !== $t.NONE && this.dispatchEvent(Ia);
}
function Em(i) {
  switch (this._trackPointer(i), this.state) {
    case $t.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      this._handleTouchMoveRotate(i), this.update();
      break;
    case $t.TOUCH_PAN:
      if (this.enablePan === !1) return;
      this._handleTouchMovePan(i), this.update();
      break;
    case $t.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      this._handleTouchMoveDollyPan(i), this.update();
      break;
    case $t.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      this._handleTouchMoveDollyRotate(i), this.update();
      break;
    default:
      this.state = $t.NONE;
  }
}
function Tm(i) {
  this.enabled !== !1 && i.preventDefault();
}
function bm(i) {
  i.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function Am(i) {
  i.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
const wm = {
  1: [1, 1, 1],
  // H  - white
  2: [0.851, 1, 1],
  // He - light cyan
  5: [1, 0.71, 0.71],
  // B  - pink
  6: [0.565, 0.565, 0.565],
  // C  - gray
  7: [0.188, 0.314, 0.973],
  // N  - blue
  8: [1, 0.051, 0.051],
  // O  - red
  9: [0.565, 0.878, 0.314],
  // F  - green
  11: [0.671, 0.361, 0.949],
  // Na - purple
  12: [0.541, 1, 0],
  // Mg - green
  13: [0.749, 0.651, 0.651],
  // Al - gray-pink
  14: [0.941, 0.784, 0.627],
  // Si - tan
  15: [1, 0.502, 0],
  // P  - orange
  16: [1, 1, 0.188],
  // S  - yellow
  17: [0.122, 0.941, 0.122],
  // Cl - green
  18: [0.502, 0.82, 0.89],
  // Ar - light blue
  19: [0.561, 0.251, 0.831],
  // K  - purple
  20: [0.239, 1, 0],
  // Ca - green
  26: [0.878, 0.4, 0.2],
  // Fe - orange
  29: [0.784, 0.502, 0.2],
  // Cu - copper
  30: [0.49, 0.502, 0.69],
  // Zn - slate
  34: [1, 0.631, 0],
  // Se - orange
  35: [0.651, 0.161, 0.161],
  // Br - dark red
  53: [0.58, 0, 0.58]
  // I  - purple
}, Rm = [0.75, 0.4, 0.75], Cm = {
  1: 1.2,
  6: 1.7,
  7: 1.55,
  8: 1.52,
  9: 1.47,
  11: 2.27,
  12: 1.73,
  15: 1.8,
  16: 1.8,
  17: 1.75,
  19: 2.75,
  20: 2.31,
  26: 2.04,
  29: 1.4,
  30: 1.39
}, Pm = 1.5, Us = 0.3, Is = 0.15, ga = 1, va = 2, xa = 3, Ma = 4, Tn = 0.18, Ns = 0.1, Fs = 0.2, Os = 0.08, Bs = 0.1, zs = 0.06, Dm = {
  1: "H",
  6: "C",
  7: "N",
  8: "O",
  9: "F",
  11: "Na",
  12: "Mg",
  15: "P",
  16: "S",
  17: "Cl",
  19: "K",
  20: "Ca",
  26: "Fe",
  29: "Cu",
  30: "Zn"
};
function Wn(i) {
  return wm[i] ?? Rm;
}
function Hs(i) {
  return Cm[i] ?? Pm;
}
function Lm(i) {
  return Dm[i] ?? `#${i}`;
}
const on = new Yt(), xs = new Yt(), Bi = new D(), Ko = new Je(), zi = new D(), $o = new It(), Jo = 32;
class Um {
  constructor(t = 5e3) {
    ct(this, "mesh");
    ct(this, "material");
    ct(this, "nAtoms", 0);
    ct(this, "elements", null);
    ct(this, "scaleFactor", 1);
    const e = new Ws(1, Jo, Jo);
    this.material = new Nl({
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.1,
      envMapIntensity: 0.4
    }), this.mesh = new Ll(e, this.material, t), this.mesh.count = 0, this.mesh.frustumCulled = !1;
  }
  /** Update atom positions and colors from a snapshot. */
  loadSnapshot(t) {
    const { nAtoms: e, positions: n, elements: s } = t;
    this.nAtoms = e, this.elements = s, this.mesh.count = e;
    for (let r = 0; r < e; r++) {
      const a = n[r * 3], o = n[r * 3 + 1], l = n[r * 3 + 2], c = Hs(s[r]) * Us * this.scaleFactor;
      on.makeScale(c, c, c), on.setPosition(a, o, l), this.mesh.setMatrixAt(r, on);
      const [h, d, f] = Wn(s[r]);
      $o.setRGB(h, d, f), this.mesh.setColorAt(r, $o);
    }
    this.mesh.instanceMatrix.needsUpdate = !0, this.mesh.instanceColor && (this.mesh.instanceColor.needsUpdate = !0);
  }
  /** Update only positions (for trajectory frames). */
  updatePositions(t) {
    for (let e = 0; e < this.nAtoms; e++) {
      const n = t[e * 3], s = t[e * 3 + 1], r = t[e * 3 + 2];
      this.mesh.getMatrixAt(e, xs), xs.decompose(Bi, Ko, zi), on.makeScale(zi.x, zi.y, zi.z), on.setPosition(n, s, r), this.mesh.setMatrixAt(e, on);
    }
    this.mesh.instanceMatrix.needsUpdate = !0;
  }
  /** Update atom radius scale factor. */
  setScale(t, e) {
    this.scaleFactor = t;
    const { nAtoms: n, elements: s } = e;
    for (let r = 0; r < n; r++) {
      this.mesh.getMatrixAt(r, xs), xs.decompose(Bi, Ko, zi);
      const a = Hs(s[r]) * Us * t;
      on.makeScale(a, a, a), on.setPosition(Bi.x, Bi.y, Bi.z), this.mesh.setMatrixAt(r, on);
    }
    this.mesh.instanceMatrix.needsUpdate = !0;
  }
  /** Set global atom opacity. */
  setOpacity(t) {
    this.material.opacity = t, this.material.transparent = t < 1, this.material.depthWrite = t >= 1, this.material.needsUpdate = !0;
  }
  dispose() {
    this.mesh.geometry.dispose(), this.material.dispose();
  }
}
const ci = new D(), hi = new D(), Qo = new D(), Mn = new D(), Fn = new D(), tl = new D(0, 1, 0), Im = new D(1, 0, 0), el = new Je(), nl = new Yt(), je = new It(), il = new D(), wr = new D();
class Nm {
  constructor(t = 3e6) {
    ct(this, "mesh");
    ct(this, "visualBonds", []);
    ct(this, "scaleFactor", 1);
    const e = new La(1, 1, 1, 6, 1), n = new Nl({
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.1,
      envMapIntensity: 0.4
    });
    this.mesh = new Ll(e, n, t), this.mesh.count = 0, this.mesh.frustumCulled = !1;
  }
  /** Build bond instances from snapshot data. */
  loadSnapshot(t) {
    const { nBonds: e, positions: n, elements: s, bonds: r, bondOrders: a } = t;
    this.visualBonds.length = 0;
    let o = 0;
    for (let l = 0; l < e; l++) {
      const c = r[l * 2], h = r[l * 2 + 1], d = a ? a[l] : ga;
      ci.set(n[c * 3], n[c * 3 + 1], n[c * 3 + 2]), hi.set(n[h * 3], n[h * 3 + 1], n[h * 3 + 2]), Mn.subVectors(hi, ci).normalize(), Fn.crossVectors(Mn, tl), Fn.lengthSq() < 1e-3 && Fn.crossVectors(Mn, Im), Fn.normalize();
      const [f, m, _] = Wn(s[c]), [x, p, u] = Wn(s[h]), b = (f + x) / 2, T = (m + p) / 2, y = (_ + u) / 2;
      if (d === va)
        for (const P of [-1, 1]) {
          const A = Fn.clone();
          this.visualBonds.push({
            ai: c,
            bi: h,
            radius: Ns,
            offsetDir: A,
            offsetMag: P * Tn
          }), this.setCylinderAt(
            o,
            n,
            c,
            h,
            Ns,
            A,
            P * Tn
          ), je.setRGB(b, T, y), this.mesh.setColorAt(o, je), o++;
        }
      else if (d === xa) {
        const P = [0, 2 * Math.PI / 3, 4 * Math.PI / 3], A = Fn.clone(), R = new D().crossVectors(Mn, A).normalize();
        for (const I of P) {
          const S = A.clone().multiplyScalar(Math.cos(I)).addScaledVector(R, Math.sin(I));
          this.visualBonds.push({
            ai: c,
            bi: h,
            radius: Os,
            offsetDir: S,
            offsetMag: Fs
          }), this.setCylinderAt(
            o,
            n,
            c,
            h,
            Os,
            S,
            Fs
          ), je.setRGB(b, T, y), this.mesh.setColorAt(o, je), o++;
        }
      } else if (d === Ma) {
        const P = new D(0, 0, 0);
        this.visualBonds.push({
          ai: c,
          bi: h,
          radius: Bs,
          offsetDir: P,
          offsetMag: 0
        }), this.setCylinderAt(
          o,
          n,
          c,
          h,
          Bs,
          P,
          0
        ), je.setRGB(b, T, y), this.mesh.setColorAt(o, je), o++;
        const A = Fn.clone();
        this.visualBonds.push({
          ai: c,
          bi: h,
          radius: zs,
          offsetDir: A,
          offsetMag: Tn
        }), this.setCylinderAt(
          o,
          n,
          c,
          h,
          zs,
          A,
          Tn
        ), je.setRGB(
          Math.min(1, b + 0.3),
          Math.min(1, T + 0.3),
          Math.min(1, y + 0.3)
        ), this.mesh.setColorAt(o, je), o++;
      } else {
        const P = new D(0, 0, 0);
        this.visualBonds.push({
          ai: c,
          bi: h,
          radius: Is,
          offsetDir: P,
          offsetMag: 0
        }), this.setCylinderAt(
          o,
          n,
          c,
          h,
          Is,
          P,
          0
        ), je.setRGB(b, T, y), this.mesh.setColorAt(o, je), o++;
      }
    }
    this.mesh.count = o, this.mesh.instanceMatrix.needsUpdate = !0, this.mesh.instanceColor && (this.mesh.instanceColor.needsUpdate = !0);
  }
  /** Update bond positions for a new frame. */
  updatePositions(t, e, n) {
    for (let s = 0; s < this.visualBonds.length; s++) {
      const r = this.visualBonds[s];
      this.setCylinderAt(
        s,
        t,
        r.ai,
        r.bi,
        r.radius,
        r.offsetDir,
        r.offsetMag
      );
    }
    this.mesh.instanceMatrix.needsUpdate = !0;
  }
  /** Set a cylinder instance at the given index. */
  setCylinderAt(t, e, n, s, r, a, o) {
    ci.set(e[n * 3], e[n * 3 + 1], e[n * 3 + 2]), hi.set(e[s * 3], e[s * 3 + 1], e[s * 3 + 2]), o !== 0 && (wr.copy(a).multiplyScalar(o), ci.add(wr), hi.add(wr)), Qo.addVectors(ci, hi).multiplyScalar(0.5), Mn.subVectors(hi, ci);
    const l = Mn.length();
    Mn.normalize(), el.setFromUnitVectors(tl, Mn), il.set(r * this.scaleFactor, l, r * this.scaleFactor), nl.compose(Qo, el, il), this.mesh.setMatrixAt(t, nl);
  }
  /** Set global bond opacity. */
  setOpacity(t) {
    const e = this.mesh.material;
    e.opacity = t, e.transparent = t < 1, e.depthWrite = t >= 1, e.needsUpdate = !0;
  }
  /** Set bond radius scale multiplier. Iterates all instance matrices. */
  setScale(t) {
    this.scaleFactor = t;
    const e = new Yt(), n = new D(), s = new Je(), r = new D();
    for (let a = 0; a < this.visualBonds.length; a++) {
      this.mesh.getMatrixAt(a, e), e.decompose(n, s, r);
      const o = this.visualBonds[a].radius * t;
      r.x = o, r.z = o, e.compose(n, s, r), this.mesh.setMatrixAt(a, e);
    }
    this.mesh.instanceMatrix.needsUpdate = !0;
  }
  dispose() {
    this.mesh.geometry.dispose(), this.mesh.material.dispose();
  }
}
const Fm = (
  /* glsl */
  `#version 300 es
  precision highp float;

  // Three.js built-in uniforms (must declare explicitly for RawShaderMaterial)
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uScaleMultiplier;

  // Per-vertex (quad corners)
  in vec3 position;

  // Per-instance
  in vec3 instanceCenter;
  in float instanceRadius;
  in vec3 instanceColor;

  out vec3 vColor;
  out vec2 vUv;
  out float vRadius;
  out vec3 vViewCenter;

  void main() {
    vColor = instanceColor;
    vUv = position.xy;
    float scaledRadius = instanceRadius * uScaleMultiplier;
    vRadius = scaledRadius;

    vec4 viewCenter = modelViewMatrix * vec4(instanceCenter, 1.0);
    vViewCenter = viewCenter.xyz;

    vec3 viewPos = viewCenter.xyz;
    viewPos.xy += position.xy * scaledRadius;

    gl_Position = projectionMatrix * vec4(viewPos, 1.0);
  }
`
), Om = (
  /* glsl */
  `#version 300 es
  precision highp float;

  in vec3 vColor;
  in vec2 vUv;
  in float vRadius;
  in vec3 vViewCenter;

  uniform mat4 projectionMatrix;
  uniform float uOpacity;

  out vec4 fragColor;

  void main() {
    float dist2 = dot(vUv, vUv);
    if (dist2 > 1.0) discard;

    float z = sqrt(1.0 - dist2);
    vec3 normal = vec3(vUv, z);

    // Correct depth
    vec3 fragViewPos = vViewCenter + normal * vRadius;
    vec4 clipPos = projectionMatrix * vec4(fragViewPos, 1.0);
    float ndcDepth = clipPos.z / clipPos.w;
    gl_FragDepth = ndcDepth * 0.5 + 0.5;

    // Hemisphere ambient: sky blue on top, warm brown on bottom
    vec3 skyColor = vec3(0.87, 0.92, 1.0);
    vec3 groundColor = vec3(0.6, 0.47, 0.27);
    float hemiMix = normal.y * 0.5 + 0.5;
    vec3 ambient = mix(groundColor, skyColor, hemiMix) * 0.35;

    // Dual-light diffuse
    vec3 lightDir1 = normalize(vec3(0.5, 0.5, 1.0));
    vec3 lightDir2 = normalize(vec3(-0.3, 0.3, 0.8));
    float diffuse1 = max(dot(normal, lightDir1), 0.0);
    float diffuse2 = max(dot(normal, lightDir2), 0.0);
    float diffuse = diffuse1 * 0.55 + diffuse2 * 0.2;

    // Specular (Blinn-Phong)
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir1 + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);

    // Fresnel rim
    float fresnel = pow(1.0 - z, 3.0) * 0.15;

    // Edge darkening (stronger for Speck-like depth)
    float edgeFactor = mix(0.7, 1.0, z);

    vec3 color = vColor * (ambient + diffuse) * edgeFactor
               + vec3(1.0) * spec * 0.3
               + vec3(0.15) * fresnel;
    fragColor = vec4(color, uOpacity);
  }
`
), Bm = (
  /* glsl */
  `#version 300 es
  precision highp float;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uBondScaleMultiplier;

  in vec3 position;
  in vec2 uv;

  in vec3 instanceStart;
  in vec3 instanceEnd;
  in vec3 instanceColor;
  in float instanceRadius;
  in float instanceDashed;

  out vec3 vColor;
  out vec2 vCylUv;
  out float vDashed;

  void main() {
    vColor = instanceColor;
    vCylUv = uv;
    vDashed = instanceDashed;

    vec4 viewStart = modelViewMatrix * vec4(instanceStart, 1.0);
    vec4 viewEnd = modelViewMatrix * vec4(instanceEnd, 1.0);

    vec3 viewMid = (viewStart.xyz + viewEnd.xyz) * 0.5;
    vec3 axis = viewEnd.xyz - viewStart.xyz;
    float len = length(axis);
    vec3 dir = axis / max(len, 0.0001);

    vec3 side = normalize(cross(dir, vec3(0.0, 0.0, 1.0)));

    vec3 viewPos = viewMid
      + dir * (position.y * len * 0.5)
      + side * (position.x * instanceRadius * uBondScaleMultiplier);

    gl_Position = projectionMatrix * vec4(viewPos, 1.0);
  }
`
), zm = (
  /* glsl */
  `#version 300 es
  precision highp float;

  in vec3 vColor;
  in vec2 vCylUv;
  in float vDashed;

  uniform float uOpacity;

  out vec4 fragColor;

  void main() {
    // Dashed bond: discard alternate segments along bond length
    if (vDashed > 0.5) {
      if (sin(vCylUv.y * 30.0) < 0.0) discard;
    }

    float nx = vCylUv.x;
    float nz = sqrt(max(0.0, 1.0 - nx * nx));
    vec3 normal = vec3(nx, 0.0, nz);

    // Hemisphere ambient
    vec3 skyColor = vec3(0.87, 0.92, 1.0);
    vec3 groundColor = vec3(0.6, 0.47, 0.27);
    float hemiMix = normal.y * 0.5 + 0.5;
    vec3 ambient = mix(groundColor, skyColor, hemiMix) * 0.35;

    // Dual-light diffuse
    vec3 lightDir1 = normalize(vec3(0.5, 0.5, 1.0));
    vec3 lightDir2 = normalize(vec3(-0.3, 0.3, 0.8));
    float diffuse1 = max(dot(normal, lightDir1), 0.0);
    float diffuse2 = max(dot(normal, lightDir2), 0.0);
    float diffuse = diffuse1 * 0.55 + diffuse2 * 0.2;

    // Specular
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir1 + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);

    // Fresnel rim
    float fresnel = pow(1.0 - nz, 3.0) * 0.1;

    vec3 color = vColor * (ambient + diffuse)
               + vec3(1.0) * spec * 0.2
               + vec3(0.1) * fresnel;
    fragColor = vec4(color, uOpacity);
  }
`
);
class Hm {
  constructor(t = 1e6) {
    ct(this, "mesh");
    ct(this, "geo");
    ct(this, "material");
    ct(this, "centerAttr");
    ct(this, "radiusAttr");
    ct(this, "colorAttr");
    ct(this, "centerBuf");
    ct(this, "radiusBuf");
    ct(this, "colorBuf");
    ct(this, "nAtoms", 0);
    ct(this, "capacity");
    this.capacity = t, this.geo = new Bl();
    const e = new Float32Array([
      -1,
      -1,
      0,
      1,
      -1,
      0,
      1,
      1,
      0,
      -1,
      1,
      0
    ]), n = new Uint16Array([0, 1, 2, 0, 2, 3]);
    this.geo.setAttribute("position", new ge(e, 3)), this.geo.setIndex(new ge(n, 1)), this.geo.instanceCount = 0, this.centerBuf = new Float32Array(t * 3), this.radiusBuf = new Float32Array(t), this.colorBuf = new Float32Array(t * 3), this.centerAttr = new pe(this.centerBuf, 3), this.radiusAttr = new pe(this.radiusBuf, 1), this.colorAttr = new pe(this.colorBuf, 3), this.centerAttr.setUsage(fi), this.radiusAttr.setUsage(Rs), this.colorAttr.setUsage(Rs), this.geo.setAttribute("instanceCenter", this.centerAttr), this.geo.setAttribute("instanceRadius", this.radiusAttr), this.geo.setAttribute("instanceColor", this.colorAttr), this.material = new Il({
      vertexShader: Fm,
      fragmentShader: Om,
      uniforms: {
        uScaleMultiplier: { value: 1 },
        uOpacity: { value: 1 }
      },
      depthWrite: !0,
      depthTest: !0
    }), this.mesh = new Ee(this.geo, this.material), this.mesh.frustumCulled = !1;
  }
  loadSnapshot(t) {
    const { nAtoms: e, positions: n, elements: s } = t;
    this.nAtoms = e, e > this.capacity && this.grow(e);
    for (let r = 0; r < e; r++) {
      const a = r * 3;
      this.centerBuf[a] = n[a], this.centerBuf[a + 1] = n[a + 1], this.centerBuf[a + 2] = n[a + 2], this.radiusBuf[r] = Hs(s[r]) * Us;
      const [o, l, c] = Wn(s[r]);
      this.colorBuf[a] = o, this.colorBuf[a + 1] = l, this.colorBuf[a + 2] = c;
    }
    this.centerAttr.needsUpdate = !0, this.radiusAttr.needsUpdate = !0, this.colorAttr.needsUpdate = !0, this.geo.instanceCount = e;
  }
  updatePositions(t) {
    this.centerBuf.set(t.subarray(0, this.nAtoms * 3)), this.centerAttr.needsUpdate = !0;
  }
  /** Update atom radius scale (O(1) via shader uniform). */
  setScale(t, e) {
    this.material.uniforms.uScaleMultiplier.value = t;
  }
  /** Set global atom opacity. */
  setOpacity(t) {
    this.material.uniforms.uOpacity.value = t, this.material.transparent = t < 1, this.material.depthWrite = t >= 1, this.material.needsUpdate = !0;
  }
  grow(t) {
    this.capacity = Math.max(t, this.capacity * 2), this.centerBuf = new Float32Array(this.capacity * 3), this.radiusBuf = new Float32Array(this.capacity), this.colorBuf = new Float32Array(this.capacity * 3), this.centerAttr = new pe(this.centerBuf, 3), this.radiusAttr = new pe(this.radiusBuf, 1), this.colorAttr = new pe(this.colorBuf, 3), this.centerAttr.setUsage(fi), this.geo.setAttribute("instanceCenter", this.centerAttr), this.geo.setAttribute("instanceRadius", this.radiusAttr), this.geo.setAttribute("instanceColor", this.colorAttr);
  }
  dispose() {
    this.geo.dispose(), this.material.dispose();
  }
}
const Sn = new D(), fe = new D(), sl = new D(0, 1, 0), rl = new D(1, 0, 0);
class Vm {
  constructor(t = 3e6) {
    ct(this, "mesh");
    ct(this, "geo");
    ct(this, "bondMaterial");
    ct(this, "startAttr");
    ct(this, "endAttr");
    ct(this, "colorAttr");
    ct(this, "radiusAttr");
    ct(this, "dashedAttr");
    ct(this, "startBuf");
    ct(this, "endBuf");
    ct(this, "colorBuf");
    ct(this, "radiusBuf");
    ct(this, "dashedBuf");
    ct(this, "visualBonds", []);
    ct(this, "capacity");
    this.capacity = t, this.geo = new Bl();
    const e = new Float32Array([
      -1,
      -1,
      0,
      1,
      -1,
      0,
      1,
      1,
      0,
      -1,
      1,
      0
    ]), n = new Float32Array([
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      1
    ]), s = new Uint16Array([0, 1, 2, 0, 2, 3]);
    this.geo.setAttribute("position", new ge(e, 3)), this.geo.setAttribute("uv", new ge(n, 2)), this.geo.setIndex(new ge(s, 1)), this.geo.instanceCount = 0, this.startBuf = new Float32Array(t * 3), this.endBuf = new Float32Array(t * 3), this.colorBuf = new Float32Array(t * 3), this.radiusBuf = new Float32Array(t), this.dashedBuf = new Float32Array(t), this.startAttr = new pe(this.startBuf, 3), this.endAttr = new pe(this.endBuf, 3), this.colorAttr = new pe(this.colorBuf, 3), this.radiusAttr = new pe(this.radiusBuf, 1), this.dashedAttr = new pe(this.dashedBuf, 1), this.startAttr.setUsage(fi), this.endAttr.setUsage(fi), this.geo.setAttribute("instanceStart", this.startAttr), this.geo.setAttribute("instanceEnd", this.endAttr), this.geo.setAttribute("instanceColor", this.colorAttr), this.geo.setAttribute("instanceRadius", this.radiusAttr), this.geo.setAttribute("instanceDashed", this.dashedAttr), this.bondMaterial = new Il({
      vertexShader: Bm,
      fragmentShader: zm,
      uniforms: {
        uOpacity: { value: 1 },
        uBondScaleMultiplier: { value: 1 }
      },
      depthWrite: !0,
      depthTest: !0
    }), this.mesh = new Ee(this.geo, this.bondMaterial), this.mesh.frustumCulled = !1;
  }
  loadSnapshot(t) {
    const { nBonds: e, positions: n, elements: s, bonds: r, bondOrders: a } = t;
    this.visualBonds = [];
    let o = 0;
    for (let c = 0; c < e; c++) {
      const h = a ? a[c] : ga;
      h === va ? o += 2 : h === xa ? o += 3 : h === Ma ? o += 2 : o += 1;
    }
    o > this.capacity && this.grow(o);
    let l = 0;
    for (let c = 0; c < e; c++) {
      const h = r[c * 2], d = r[c * 2 + 1], f = a ? a[c] : ga;
      Sn.set(
        n[d * 3] - n[h * 3],
        n[d * 3 + 1] - n[h * 3 + 1],
        n[d * 3 + 2] - n[h * 3 + 2]
      ).normalize(), fe.crossVectors(Sn, sl), fe.lengthSq() < 1e-3 && fe.crossVectors(Sn, rl), fe.normalize();
      const [m, _, x] = Wn(s[h]), [p, u, b] = Wn(s[d]), T = (m + p) * 0.5, y = (_ + u) * 0.5, P = (x + b) * 0.5;
      if (f === va)
        for (const A of [-1, 1])
          this.visualBonds.push({
            ai: h,
            bi: d,
            radius: Ns,
            offsetX: A * Tn,
            offsetY: 0,
            dashed: 0
          }), this.setInstance(
            l,
            n,
            h,
            d,
            Ns,
            fe,
            A * Tn,
            T,
            y,
            P,
            0
          ), l++;
      else if (f === xa) {
        const A = new D().crossVectors(Sn, fe).normalize(), R = [0, 2 * Math.PI / 3, 4 * Math.PI / 3];
        for (const I of R) {
          const S = Math.cos(I) * Fs, M = Math.sin(I) * Fs;
          this.visualBonds.push({
            ai: h,
            bi: d,
            radius: Os,
            offsetX: S,
            offsetY: M,
            dashed: 0
          });
          const C = fe.clone().multiplyScalar(S).addScaledVector(A, M);
          this.setInstanceWithOffset(
            l,
            n,
            h,
            d,
            Os,
            C,
            T,
            y,
            P,
            0
          ), l++;
        }
      } else f === Ma ? (this.visualBonds.push({
        ai: h,
        bi: d,
        radius: Bs,
        offsetX: 0,
        offsetY: 0,
        dashed: 0
      }), this.setInstance(
        l,
        n,
        h,
        d,
        Bs,
        fe,
        0,
        T,
        y,
        P,
        0
      ), l++, this.visualBonds.push({
        ai: h,
        bi: d,
        radius: zs,
        offsetX: Tn,
        offsetY: 0,
        dashed: 1
      }), this.setInstance(
        l,
        n,
        h,
        d,
        zs,
        fe,
        Tn,
        T,
        y,
        P,
        1
      ), l++) : (this.visualBonds.push({
        ai: h,
        bi: d,
        radius: Is,
        offsetX: 0,
        offsetY: 0,
        dashed: 0
      }), this.setInstance(
        l,
        n,
        h,
        d,
        Is,
        fe,
        0,
        T,
        y,
        P,
        0
      ), l++);
    }
    this.startAttr.needsUpdate = !0, this.endAttr.needsUpdate = !0, this.colorAttr.needsUpdate = !0, this.radiusAttr.needsUpdate = !0, this.dashedAttr.needsUpdate = !0, this.geo.instanceCount = l;
  }
  updatePositions(t, e, n) {
    for (let s = 0; s < this.visualBonds.length; s++) {
      const r = this.visualBonds[s], a = r.ai, o = r.bi, l = a * 3, c = o * 3, h = s * 3;
      if (Sn.set(
        t[c] - t[l],
        t[c + 1] - t[l + 1],
        t[c + 2] - t[l + 2]
      ).normalize(), fe.crossVectors(Sn, sl), fe.lengthSq() < 1e-3 && fe.crossVectors(Sn, rl), fe.normalize(), r.offsetX === 0 && r.offsetY === 0)
        this.startBuf[h] = t[l], this.startBuf[h + 1] = t[l + 1], this.startBuf[h + 2] = t[l + 2], this.endBuf[h] = t[c], this.endBuf[h + 1] = t[c + 1], this.endBuf[h + 2] = t[c + 2];
      else {
        const d = new D().crossVectors(Sn, fe).normalize(), f = fe.x * r.offsetX + d.x * r.offsetY, m = fe.y * r.offsetX + d.y * r.offsetY, _ = fe.z * r.offsetX + d.z * r.offsetY;
        this.startBuf[h] = t[l] + f, this.startBuf[h + 1] = t[l + 1] + m, this.startBuf[h + 2] = t[l + 2] + _, this.endBuf[h] = t[c] + f, this.endBuf[h + 1] = t[c + 1] + m, this.endBuf[h + 2] = t[c + 2] + _;
      }
    }
    this.startAttr.needsUpdate = !0, this.endAttr.needsUpdate = !0;
  }
  setInstance(t, e, n, s, r, a, o, l, c, h, d) {
    const f = n * 3, m = s * 3, _ = t * 3, x = a.x * o, p = a.y * o, u = a.z * o;
    this.startBuf[_] = e[f] + x, this.startBuf[_ + 1] = e[f + 1] + p, this.startBuf[_ + 2] = e[f + 2] + u, this.endBuf[_] = e[m] + x, this.endBuf[_ + 1] = e[m + 1] + p, this.endBuf[_ + 2] = e[m + 2] + u, this.colorBuf[_] = l, this.colorBuf[_ + 1] = c, this.colorBuf[_ + 2] = h, this.radiusBuf[t] = r, this.dashedBuf[t] = d;
  }
  setInstanceWithOffset(t, e, n, s, r, a, o, l, c, h) {
    const d = n * 3, f = s * 3, m = t * 3;
    this.startBuf[m] = e[d] + a.x, this.startBuf[m + 1] = e[d + 1] + a.y, this.startBuf[m + 2] = e[d + 2] + a.z, this.endBuf[m] = e[f] + a.x, this.endBuf[m + 1] = e[f + 1] + a.y, this.endBuf[m + 2] = e[f + 2] + a.z, this.colorBuf[m] = o, this.colorBuf[m + 1] = l, this.colorBuf[m + 2] = c, this.radiusBuf[t] = r, this.dashedBuf[t] = h;
  }
  grow(t) {
    this.capacity = Math.max(t, this.capacity * 2), this.startBuf = new Float32Array(this.capacity * 3), this.endBuf = new Float32Array(this.capacity * 3), this.colorBuf = new Float32Array(this.capacity * 3), this.radiusBuf = new Float32Array(this.capacity), this.dashedBuf = new Float32Array(this.capacity), this.startAttr = new pe(this.startBuf, 3), this.endAttr = new pe(this.endBuf, 3), this.colorAttr = new pe(this.colorBuf, 3), this.radiusAttr = new pe(this.radiusBuf, 1), this.dashedAttr = new pe(this.dashedBuf, 1), this.startAttr.setUsage(fi), this.endAttr.setUsage(fi), this.geo.setAttribute("instanceStart", this.startAttr), this.geo.setAttribute("instanceEnd", this.endAttr), this.geo.setAttribute("instanceColor", this.colorAttr), this.geo.setAttribute("instanceRadius", this.radiusAttr), this.geo.setAttribute("instanceDashed", this.dashedAttr);
  }
  /** Set global bond opacity. */
  setOpacity(t) {
    this.bondMaterial.uniforms.uOpacity.value = t, this.bondMaterial.transparent = t < 1, this.bondMaterial.depthWrite = t >= 1, this.bondMaterial.needsUpdate = !0;
  }
  /** Set bond radius scale multiplier (O(1) via shader uniform). */
  setScale(t) {
    this.bondMaterial.uniforms.uBondScaleMultiplier.value = t;
  }
  dispose() {
    this.geo.dispose(), this.bondMaterial.dispose();
  }
}
class Gm {
  constructor() {
    ct(this, "mesh");
    ct(this, "geometry");
    this.geometry = new Ie();
    const t = new Float32Array(72);
    this.geometry.setAttribute(
      "position",
      new ge(t, 3)
    );
    const e = new Da({
      color: 6710886,
      transparent: !0,
      opacity: 0.5
    });
    this.mesh = new xh(this.geometry, e), this.mesh.frustumCulled = !1, this.mesh.visible = !1;
  }
  /**
   * Update the cell box from a 3x3 matrix (row-major Float32Array of length 9).
   * Cell vectors: va = box[0..2], vb = box[3..5], vc = box[6..8].
   */
  loadBox(t) {
    const e = new D(t[0], t[1], t[2]), n = new D(t[3], t[4], t[5]), s = new D(t[6], t[7], t[8]), r = new D(0, 0, 0), a = e.clone(), o = n.clone(), l = s.clone(), c = e.clone().add(n), h = e.clone().add(s), d = n.clone().add(s), f = e.clone().add(n).add(s), m = [
      // Bottom face
      [r, a],
      [r, o],
      [a, c],
      [o, c],
      // Top face
      [l, h],
      [l, d],
      [h, f],
      [d, f],
      // Vertical edges
      [r, l],
      [a, h],
      [o, d],
      [c, f]
    ], _ = this.geometry.getAttribute(
      "position"
    ), x = _.array;
    for (let p = 0; p < 12; p++) {
      const [u, b] = m[p];
      x[p * 6] = u.x, x[p * 6 + 1] = u.y, x[p * 6 + 2] = u.z, x[p * 6 + 3] = b.x, x[p * 6 + 4] = b.y, x[p * 6 + 5] = b.z;
    }
    _.needsUpdate = !0, this.geometry.computeBoundingSphere(), this.mesh.visible = !0;
  }
  setVisible(t) {
    this.mesh.visible = t;
  }
  dispose() {
    this.geometry.dispose(), this.mesh.material.dispose();
  }
}
const km = 500, Wm = "bold 11px sans-serif", al = -8;
class Xm {
  constructor() {
    ct(this, "canvas");
    ct(this, "ctx");
    ct(this, "labels", null);
    ct(this, "elements", null);
    ct(this, "nAtoms", 0);
    ct(this, "positions", null);
    ct(this, "tmpVec", new D());
    this.canvas = document.createElement("canvas"), this.canvas.style.position = "absolute", this.canvas.style.top = "0", this.canvas.style.left = "0", this.canvas.style.pointerEvents = "none", this.ctx = this.canvas.getContext("2d");
  }
  getCanvas() {
    return this.canvas;
  }
  setLabels(t) {
    this.labels = t;
  }
  setAtomData(t, e) {
    this.elements = t, this.nAtoms = e;
  }
  setPositions(t) {
    this.positions = t;
  }
  resize(t, e, n) {
    this.canvas.width = t * n, this.canvas.height = e * n, this.canvas.style.width = `${t}px`, this.canvas.style.height = `${e}px`, this.ctx.setTransform(n, 0, 0, n, 0, 0);
  }
  render(t, e, n) {
    if (this.ctx.clearRect(0, 0, e, n), !this.labels || !this.positions || !this.elements || this.nAtoms === 0)
      return;
    const s = e / 2, r = n / 2, a = [];
    for (let l = 0; l < this.nAtoms; l++) {
      if (!this.labels[l] || (this.tmpVec.set(
        this.positions[l * 3],
        this.positions[l * 3 + 1],
        this.positions[l * 3 + 2]
      ), this.tmpVec.project(t), this.tmpVec.z < -1 || this.tmpVec.z > 1)) continue;
      const h = this.tmpVec.x * s + s, d = -(this.tmpVec.y * r) + r;
      h < -50 || h > e + 50 || d < -20 || d > n + 20 || a.push({ sx: h, sy: d, z: this.tmpVec.z, idx: l });
    }
    a.sort((l, c) => l.z - c.z);
    const o = Math.min(a.length, km);
    this.ctx.font = Wm, this.ctx.textAlign = "center", this.ctx.textBaseline = "bottom";
    for (let l = 0; l < o; l++) {
      const { sx: c, sy: h, idx: d } = a[l], f = this.labels[d], m = this.elements[d], [_, x, p] = Wn(m), u = 0.299 * _ + 0.587 * x + 0.114 * p, b = u > 0.5 ? "#000000" : "#ffffff", T = u > 0.5 ? "#ffffff" : "#000000";
      this.ctx.strokeStyle = T, this.ctx.lineWidth = 2.5, this.ctx.lineJoin = "round", this.ctx.strokeText(f, c, h + al), this.ctx.fillStyle = b, this.ctx.fillText(f, c, h + al);
    }
  }
  dispose() {
    this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
  }
}
const Ym = 5e3;
class qm {
  constructor() {
    ct(this, "container", null);
    ct(this, "renderer");
    ct(this, "scene");
    ct(this, "camera");
    ct(this, "controls");
    ct(this, "atomRenderer", null);
    ct(this, "bondRenderer", null);
    ct(this, "cellRenderer", null);
    ct(this, "labelOverlay", null);
    ct(this, "useImpostor", !1);
    ct(this, "animationId", null);
    ct(this, "snapshot", null);
    ct(this, "lastExtent", 1);
    ct(this, "currentPositions", null);
    ct(this, "atomScale", 1);
    ct(this, "atomOpacity", 1);
    ct(this, "bondScale", 1);
    ct(this, "bondOpacity", 1);
    // Raycasting
    ct(this, "raycaster", new wh());
    ct(this, "mouse", new Ct());
    // Atom selection & measurement
    ct(this, "selectedAtoms", []);
    ct(this, "selectionGroup", new Hi());
    ct(this, "animate", () => {
      this.animationId = requestAnimationFrame(this.animate), this.controls.update(), this.renderer.render(this.scene, this.camera), this.labelOverlay && this.container && this.labelOverlay.render(
        this.camera,
        this.container.clientWidth,
        this.container.clientHeight
      );
    });
  }
  /** Mount the viewer into a DOM element. */
  mount(t) {
    this.container = t, this.renderer = new dm({
      antialias: !0,
      alpha: !0,
      powerPreference: "high-performance"
    }), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)), this.renderer.setSize(t.clientWidth, t.clientHeight), this.renderer.setClearColor(16777215, 1), t.appendChild(this.renderer.domElement), this.labelOverlay = new Xm(), t.appendChild(this.labelOverlay.getCanvas()), this.labelOverlay.resize(
      t.clientWidth,
      t.clientHeight,
      Math.min(window.devicePixelRatio, 2)
    ), this.scene = new ph(), this.scene.background = new It(16777215), this.camera = new He(
      50,
      t.clientWidth / t.clientHeight,
      0.1,
      1e4
    ), this.camera.position.set(0, 0, 50), this.controls = new pm(this.camera, this.renderer.domElement), this.controls.enableDamping = !0, this.controls.dampingFactor = 0.1, this.controls.rotateSpeed = 0.8, this.controls.zoomSpeed = 1.2;
    const e = new Eh(14544639, 10057540, 0.4);
    this.scene.add(e);
    const n = new vr(16777215, 0.8);
    n.position.set(50, 50, 50), this.scene.add(n);
    const s = new vr(16777215, 0.4);
    s.position.set(-30, 20, -20), this.scene.add(s);
    const r = new vr(16777215, 0.3);
    r.position.set(0, -30, -50), this.scene.add(r), this.scene.add(this.selectionGroup), new ResizeObserver(() => this.onResize()).observe(t), this.animate();
  }
  /** Load a molecular snapshot (topology + positions). */
  loadSnapshot(t) {
    this.snapshot = t, this.currentPositions = new Float32Array(t.positions);
    const e = t.nAtoms > Ym;
    (this.atomRenderer === null || e !== this.useImpostor) && this.swapRenderers(e), this.atomRenderer.loadSnapshot(t), this.bondRenderer.loadSnapshot(t), this.atomScale !== 1 && this.atomRenderer.setScale && this.atomRenderer.setScale(this.atomScale, t), this.bondScale !== 1 && this.bondRenderer.setScale && this.bondRenderer.setScale(this.bondScale, t), this.labelOverlay && (this.labelOverlay.setAtomData(t.elements, t.nAtoms), this.labelOverlay.setPositions(t.positions)), t.box && t.box.some((s) => s !== 0) && (this.cellRenderer || (this.cellRenderer = new Gm(), this.scene.add(this.cellRenderer.mesh)), this.cellRenderer.loadBox(t.box)), this.fitToView(t);
  }
  /** Update positions from a trajectory frame. */
  updateFrame(t) {
    var e;
    !this.snapshot || !this.atomRenderer || !this.bondRenderer || (this.currentPositions = new Float32Array(t.positions), this.atomRenderer.updatePositions(t.positions), (e = this.labelOverlay) == null || e.setPositions(t.positions), this.bondRenderer.updatePositions(
      t.positions,
      this.snapshot.bonds,
      this.snapshot.nBonds
    ), this.selectedAtoms.length > 0 && this.updateSelectionVisuals());
  }
  /** Set per-atom labels for overlay display. */
  setLabels(t) {
    var e;
    (e = this.labelOverlay) == null || e.setLabels(t);
  }
  /** Set atom radius scale multiplier. */
  setAtomScale(t) {
    var e;
    this.atomScale = t, (e = this.atomRenderer) != null && e.setScale && this.snapshot && this.atomRenderer.setScale(t, this.snapshot);
  }
  /** Set atom opacity (independent of bonds). */
  setAtomOpacity(t) {
    var e, n;
    this.atomOpacity = t, (n = (e = this.atomRenderer) == null ? void 0 : e.setOpacity) == null || n.call(e, t);
  }
  /** Set bond radius scale multiplier. */
  setBondScale(t) {
    var e;
    this.bondScale = t, (e = this.bondRenderer) != null && e.setScale && this.snapshot && this.bondRenderer.setScale(t, this.snapshot);
  }
  /** Set bond opacity (independent of atoms). */
  setBondOpacity(t) {
    var e, n;
    this.bondOpacity = t, (n = (e = this.bondRenderer) == null ? void 0 : e.setOpacity) == null || n.call(e, t);
  }
  /** Toggle bond visibility. */
  setBondsVisible(t) {
    this.bondRenderer && (this.bondRenderer.mesh.visible = t);
  }
  /** Toggle simulation cell visibility. */
  setCellVisible(t) {
    this.cellRenderer && this.cellRenderer.setVisible(t);
  }
  /** Check if cell data exists. */
  hasCell() {
    return this.cellRenderer !== null && this.cellRenderer.mesh.visible;
  }
  /** Swap between InstancedMesh and Impostor renderers. */
  swapRenderers(t) {
    var e, n, s, r;
    if (this.atomRenderer && (this.scene.remove(this.atomRenderer.mesh), this.atomRenderer.dispose()), this.bondRenderer && (this.scene.remove(this.bondRenderer.mesh), this.bondRenderer.dispose()), this.useImpostor = t, t) {
      const a = new Hm(), o = new Vm();
      this.atomRenderer = a, this.bondRenderer = o;
    } else {
      const a = new Um(), o = new Nm();
      this.atomRenderer = a, this.bondRenderer = o;
    }
    this.scene.add(this.atomRenderer.mesh), this.scene.add(this.bondRenderer.mesh), this.atomOpacity !== 1 && ((n = (e = this.atomRenderer).setOpacity) == null || n.call(e, this.atomOpacity)), this.bondOpacity !== 1 && ((r = (s = this.bondRenderer).setOpacity) == null || r.call(s, this.bondOpacity));
  }
  /** Fit camera to show all atoms. */
  fitToView(t) {
    const { positions: e, nAtoms: n } = t;
    let s = 1 / 0, r = 1 / 0, a = 1 / 0, o = -1 / 0, l = -1 / 0, c = -1 / 0;
    for (let x = 0; x < n; x++) {
      const p = e[x * 3], u = e[x * 3 + 1], b = e[x * 3 + 2];
      s = Math.min(s, p), r = Math.min(r, u), a = Math.min(a, b), o = Math.max(o, p), l = Math.max(l, u), c = Math.max(c, b);
    }
    const h = (s + o) / 2, d = (r + l) / 2, f = (a + c) / 2, m = Math.max(o - s, l - r, c - a);
    this.lastExtent = m, this.controls.target.set(h, d, f);
    const _ = m * 1.2;
    this.camera.position.set(h, d, f + _), this.camera.near = _ * 0.01, this.camera.far = _ * 10, this.camera.updateProjectionMatrix(), this.controls.update();
  }
  /** Reset view to fit all atoms. */
  resetView() {
    this.snapshot && this.fitToView(this.snapshot);
  }
  /** Get the canvas element for event listener attachment. */
  getCanvas() {
    var t;
    return ((t = this.renderer) == null ? void 0 : t.domElement) ?? null;
  }
  /** Get current atom positions (may reflect trajectory frame). */
  getCurrentPositions() {
    return this.currentPositions ?? this.snapshot.positions;
  }
  // ---- Raycasting ----
  /** Perform a raycast at the given screen coordinates. */
  raycastAtPixel(t, e) {
    if (!this.container || !this.snapshot) return null;
    const n = this.container.getBoundingClientRect();
    if (this.mouse.x = (t - n.left) / n.width * 2 - 1, this.mouse.y = -((e - n.top) / n.height) * 2 + 1, this.raycaster.setFromCamera(this.mouse, this.camera), this.atomRenderer && !this.useImpostor) {
      const s = this.raycaster.intersectObject(this.atomRenderer.mesh, !1);
      if (s.length > 0 && s[0].instanceId !== void 0) {
        const r = s[0].instanceId, a = this.getCurrentPositions(), o = this.snapshot.elements[r];
        return {
          kind: "atom",
          atomIndex: r,
          elementSymbol: Lm(o),
          atomicNumber: o,
          position: [a[r * 3], a[r * 3 + 1], a[r * 3 + 2]],
          screenX: t,
          screenY: e
        };
      }
    }
    if (this.bondRenderer && !this.useImpostor) {
      const s = this.raycaster.intersectObject(this.bondRenderer.mesh, !1);
      if (s.length > 0 && s[0].instanceId !== void 0) {
        const r = this.getBondInfoFromInstance(s[0].instanceId);
        if (r)
          return { kind: "bond", ...r, screenX: t, screenY: e };
      }
    }
    return null;
  }
  getBondInfoFromInstance(t) {
    if (!this.snapshot || !this.bondRenderer || this.useImpostor) return null;
    const e = this.bondRenderer;
    if (t >= e.visualBonds.length) return null;
    const n = e.visualBonds[t], s = this.getCurrentPositions(), r = s[n.bi * 3] - s[n.ai * 3], a = s[n.bi * 3 + 1] - s[n.ai * 3 + 1], o = s[n.bi * 3 + 2] - s[n.ai * 3 + 2], l = Math.sqrt(r * r + a * a + o * o);
    let c = 1;
    if (this.snapshot.bondOrders) {
      const h = this.snapshot.bonds;
      for (let d = 0; d < this.snapshot.nBonds; d++) {
        const f = h[d * 2], m = h[d * 2 + 1];
        if (f === n.ai && m === n.bi || f === n.bi && m === n.ai) {
          c = this.snapshot.bondOrders[d];
          break;
        }
      }
    }
    return { atomA: n.ai, atomB: n.bi, bondOrder: c, bondLength: l };
  }
  // ---- Selection & Measurement ----
  /** Toggle atom selection (right-click). Returns new selection state. */
  toggleAtomSelection(t) {
    const e = this.selectedAtoms.indexOf(t);
    return e >= 0 ? this.selectedAtoms.splice(e, 1) : (this.selectedAtoms.length >= 4 && this.selectedAtoms.shift(), this.selectedAtoms.push(t)), this.updateSelectionVisuals(), { atoms: [...this.selectedAtoms] };
  }
  /** Clear all selected atoms. */
  clearSelection() {
    this.selectedAtoms = [], this.updateSelectionVisuals();
  }
  /** Compute the current geometric measurement based on selected atoms. */
  getMeasurement() {
    if (!this.snapshot || this.selectedAtoms.length < 2) return null;
    const t = this.getCurrentPositions(), e = this.selectedAtoms;
    if (e.length === 2) {
      const n = this.computeDistance(t, e[0], e[1]);
      return { atoms: [...e], type: "distance", value: n, label: `${n.toFixed(3)} Å` };
    }
    if (e.length === 3) {
      const n = this.computeAngle(t, e[0], e[1], e[2]);
      return { atoms: [...e], type: "angle", value: n, label: `${n.toFixed(1)}°` };
    }
    if (e.length === 4) {
      const n = this.computeDihedral(t, e[0], e[1], e[2], e[3]);
      return { atoms: [...e], type: "dihedral", value: n, label: `${n.toFixed(1)}°` };
    }
    return null;
  }
  computeDistance(t, e, n) {
    const s = t[n * 3] - t[e * 3], r = t[n * 3 + 1] - t[e * 3 + 1], a = t[n * 3 + 2] - t[e * 3 + 2];
    return Math.sqrt(s * s + r * r + a * a);
  }
  computeAngle(t, e, n, s) {
    const r = t[e * 3] - t[n * 3], a = t[e * 3 + 1] - t[n * 3 + 1], o = t[e * 3 + 2] - t[n * 3 + 2], l = t[s * 3] - t[n * 3], c = t[s * 3 + 1] - t[n * 3 + 1], h = t[s * 3 + 2] - t[n * 3 + 2], d = r * l + a * c + o * h, f = Math.sqrt(r * r + a * a + o * o), m = Math.sqrt(l * l + c * c + h * h);
    return Math.acos(Math.max(-1, Math.min(1, d / (f * m)))) * (180 / Math.PI);
  }
  computeDihedral(t, e, n, s, r) {
    const a = t[n * 3] - t[e * 3], o = t[n * 3 + 1] - t[e * 3 + 1], l = t[n * 3 + 2] - t[e * 3 + 2], c = t[s * 3] - t[n * 3], h = t[s * 3 + 1] - t[n * 3 + 1], d = t[s * 3 + 2] - t[n * 3 + 2], f = t[r * 3] - t[s * 3], m = t[r * 3 + 1] - t[s * 3 + 1], _ = t[r * 3 + 2] - t[s * 3 + 2], x = o * d - l * h, p = l * c - a * d, u = a * h - o * c, b = h * _ - d * m, T = d * f - c * _, y = c * m - h * f, P = Math.sqrt(c * c + h * h + d * d), A = c / P, R = h / P, I = d / P, S = p * I - u * R, M = u * A - x * I, C = x * R - p * A, H = x * b + p * T + u * y, B = S * b + M * T + C * y;
    return Math.atan2(B, H) * (180 / Math.PI);
  }
  updateSelectionVisuals() {
    for (; this.selectionGroup.children.length > 0; ) {
      const n = this.selectionGroup.children[0];
      this.selectionGroup.remove(n), (n instanceof Ee || n instanceof pa) && (n.geometry.dispose(), Array.isArray(n.material) ? n.material.forEach((s) => s.dispose()) : n.material.dispose());
    }
    if (!this.snapshot || this.selectedAtoms.length === 0) return;
    const t = this.getCurrentPositions(), e = this.snapshot.elements;
    for (const n of this.selectedAtoms) {
      const s = Hs(e[n]) * Us * 1.6, r = new Ws(s, 16, 16), a = new Ca({
        color: 4359668,
        transparent: !0,
        opacity: 0.35,
        depthWrite: !1
      }), o = new Ee(r, a);
      o.position.set(
        t[n * 3],
        t[n * 3 + 1],
        t[n * 3 + 2]
      ), this.selectionGroup.add(o);
    }
    if (this.selectedAtoms.length >= 2) {
      const n = this.selectedAtoms.map(
        (o) => new D(t[o * 3], t[o * 3 + 1], t[o * 3 + 2])
      ), s = new Ie().setFromPoints(n), r = new Da({
        color: 4359668,
        depthTest: !1
      }), a = new pa(s, r);
      a.renderOrder = 999, this.selectionGroup.add(a);
    }
  }
  onResize() {
    var n;
    if (!this.container) return;
    const t = this.container.clientWidth, e = this.container.clientHeight;
    this.camera.aspect = t / e, this.camera.updateProjectionMatrix(), this.renderer.setSize(t, e), (n = this.labelOverlay) == null || n.resize(t, e, Math.min(window.devicePixelRatio, 2));
  }
  /** Clean up all resources. */
  dispose() {
    this.animationId !== null && cancelAnimationFrame(this.animationId), this.clearSelection(), this.atomRenderer && this.atomRenderer.dispose(), this.bondRenderer && this.bondRenderer.dispose(), this.cellRenderer && this.cellRenderer.dispose(), this.labelOverlay && this.labelOverlay.dispose(), this.controls.dispose(), this.renderer.dispose(), this.container && this.renderer.domElement.parentNode && this.container.removeChild(this.renderer.domElement);
  }
}
const ol = 1313293645, jm = 0, Zm = 1, Km = 1, $m = 2;
function ll(i) {
  const t = new DataView(i), e = t.getUint32(0, !0);
  if (e !== ol)
    throw new Error(
      `Invalid magic: 0x${e.toString(16)}, expected 0x${ol.toString(16)}`
    );
  return {
    msgType: t.getUint8(4),
    flags: t.getUint8(5)
  };
}
function Jm(i) {
  const t = new DataView(i), e = t.getUint8(5);
  let n = 8;
  const s = t.getUint32(n, !0);
  n += 4;
  const r = t.getUint32(n, !0);
  n += 4;
  const a = new Float32Array(i, n, s * 3);
  n += s * 3 * 4;
  const o = new Uint8Array(i, n, s);
  n += s, n += (4 - n % 4) % 4;
  const l = new Uint32Array(i, n, r * 2);
  n += r * 2 * 4;
  let c = null;
  e & Km && (c = new Uint8Array(i, n, r), n += r, n += (4 - n % 4) % 4);
  let h = null;
  return e & $m && (h = new Float32Array(i, n, 9), n += 36), { nAtoms: s, nBonds: r, nFileBonds: r, positions: a, elements: o, bonds: l, bondOrders: c, box: h };
}
function Qm(i) {
  const t = new DataView(i);
  let e = 8;
  const n = t.getUint32(e, !0);
  e += 4;
  const s = t.getUint32(e, !0);
  e += 4;
  const r = new Float32Array(i, e, s * 3);
  return { frameId: n, nAtoms: s, positions: r };
}
function t_({ model: i, el: t }) {
  const e = document.createElement("div");
  e.style.width = "100%", e.style.height = "500px", e.style.position = "relative", e.style.background = "#ffffff", e.style.borderRadius = "8px", e.style.overflow = "hidden", t.appendChild(e);
  const n = document.createElement("div");
  n.style.cssText = "position:absolute;top:8px;left:8px;background:rgba(255,255,255,0.85);backdrop-filter:blur(8px);border-radius:6px;padding:4px 12px;font:13px system-ui;color:#495057;z-index:10;", n.innerHTML = "<strong>megane</strong>", e.appendChild(n);
  let s = null, r = null, a = !1;
  function o() {
    if (s || a) return !!s;
    if (e.clientWidth === 0 || e.clientHeight === 0) return !1;
    try {
      return s = new qm(), s.mount(e), c(), !0;
    } catch (d) {
      return console.error("megane: failed to initialize renderer", d), n.innerHTML = "<strong>megane</strong> &mdash; WebGL not available", !1;
    }
  }
  const l = new ResizeObserver(() => {
    !s && !a && o();
  });
  l.observe(e), o();
  function c() {
    if (!s) return;
    const d = i.get("_snapshot_data");
    if (!d || d.byteLength === 0) return;
    const f = new ArrayBuffer(d.byteLength);
    new Uint8Array(f).set(new Uint8Array(d.buffer, d.byteOffset, d.byteLength));
    const { msgType: m } = ll(f);
    m === jm && (r = Jm(f), s.loadSnapshot(r), n.innerHTML = `<strong>megane</strong> &nbsp; ${r.nAtoms.toLocaleString()} atoms / ${r.nBonds.toLocaleString()} bonds`);
  }
  function h() {
    if (!s) return;
    const d = i.get("_frame_data");
    if (!d || d.byteLength === 0 || !r) return;
    const f = new ArrayBuffer(d.byteLength);
    new Uint8Array(f).set(new Uint8Array(d.buffer, d.byteOffset, d.byteLength));
    const { msgType: m } = ll(f);
    if (m === Zm) {
      const _ = Qm(f);
      s.updateFrame(_);
    }
  }
  return i.on("change:_snapshot_data", () => {
    s ? c() : o();
  }), i.on("change:_frame_data", h), () => {
    a = !0, l.disconnect(), s == null || s.dispose();
  };
}
const n_ = { render: t_ };
export {
  n_ as default
};
