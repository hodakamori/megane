var yl = Object.defineProperty;
var Tl = (i, t, e) => t in i ? yl(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var _t = (i, t, e) => Tl(i, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
const ai = { ROTATE: 0, DOLLY: 1, PAN: 2 }, ii = { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 }, bl = 0, ma = 1, Al = 2, No = 1, wl = 2, nn = 3, yn = 0, Ae = 1, sn = 2, Sn = 0, oi = 1, _a = 2, ga = 3, va = 4, Rl = 5, Un = 100, Cl = 101, Pl = 102, Dl = 103, Ll = 104, Ul = 200, Il = 201, Nl = 202, Fl = 203, ar = 204, or = 205, Ol = 206, Bl = 207, zl = 208, Hl = 209, Vl = 210, Gl = 211, kl = 212, Wl = 213, Xl = 214, lr = 0, cr = 1, hr = 2, hi = 3, ur = 4, dr = 5, fr = 6, pr = 7, Fo = 0, Yl = 1, ql = 2, En = 0, jl = 1, Zl = 2, Kl = 3, $l = 4, Jl = 5, Ql = 6, tc = 7, Oo = 300, ui = 301, di = 302, mr = 303, _r = 304, Ms = 306, gr = 1e3, Nn = 1001, vr = 1002, qe = 1003, ec = 1004, Ni = 1005, Ze = 1006, ws = 1007, Fn = 1008, cn = 1009, Bo = 1010, zo = 1011, wi = 1012, Zr = 1013, On = 1014, rn = 1015, Ri = 1016, Kr = 1017, $r = 1018, fi = 1020, Ho = 35902, Vo = 1021, Go = 1022, Ye = 1023, ko = 1024, Wo = 1025, li = 1026, pi = 1027, Xo = 1028, Jr = 1029, Yo = 1030, Qr = 1031, ta = 1033, as = 33776, os = 33777, ls = 33778, cs = 33779, xr = 35840, Mr = 35841, Sr = 35842, Er = 35843, yr = 36196, Tr = 37492, br = 37496, Ar = 37808, wr = 37809, Rr = 37810, Cr = 37811, Pr = 37812, Dr = 37813, Lr = 37814, Ur = 37815, Ir = 37816, Nr = 37817, Fr = 37818, Or = 37819, Br = 37820, zr = 37821, hs = 36492, Hr = 36494, Vr = 36495, qo = 36283, Gr = 36284, kr = 36285, Wr = 36286, nc = 3200, ic = 3201, sc = 0, rc = 1, Mn = "", Fe = "srgb", mi = "srgb-linear", fs = "linear", Zt = "srgb", Gn = 7680, xa = 519, ac = 512, oc = 513, lc = 514, jo = 515, cc = 516, hc = 517, uc = 518, dc = 519, an = 35044, si = 35048, ps = "300 es", on = 2e3, ms = 2001;
class Hn {
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
const ve = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"], us = Math.PI / 180, Xr = 180 / Math.PI;
function Ci() {
  const i = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0;
  return (ve[i & 255] + ve[i >> 8 & 255] + ve[i >> 16 & 255] + ve[i >> 24 & 255] + "-" + ve[t & 255] + ve[t >> 8 & 255] + "-" + ve[t >> 16 & 15 | 64] + ve[t >> 24 & 255] + "-" + ve[e & 63 | 128] + ve[e >> 8 & 255] + "-" + ve[e >> 16 & 255] + ve[e >> 24 & 255] + ve[n & 255] + ve[n >> 8 & 255] + ve[n >> 16 & 255] + ve[n >> 24 & 255]).toLowerCase();
}
function Ft(i, t, e) {
  return Math.max(t, Math.min(e, i));
}
function fc(i, t) {
  return (i % t + t) % t;
}
function Rs(i, t, e) {
  return (1 - e) * i + e * t;
}
function xi(i, t) {
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
function Te(i, t) {
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
const pc = {
  DEG2RAD: us
};
class Dt {
  constructor(t = 0, e = 0) {
    Dt.prototype.isVector2 = !0, this.x = t, this.y = e;
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
    return this.x = Ft(this.x, t.x, e.x), this.y = Ft(this.y, t.y, e.y), this;
  }
  clampScalar(t, e) {
    return this.x = Ft(this.x, t, e), this.y = Ft(this.y, t, e), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Ft(n, t, e));
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
    return Math.acos(Ft(n, -1, 1));
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
class Pt {
  constructor(t, e, n, s, r, a, o, l, c) {
    Pt.prototype.isMatrix3 = !0, this.elements = [
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
    const n = t.elements, s = e.elements, r = this.elements, a = n[0], o = n[3], l = n[6], c = n[1], h = n[4], d = n[7], f = n[2], m = n[5], g = n[8], x = s[0], p = s[3], u = s[6], b = s[1], T = s[4], E = s[7], U = s[2], w = s[5], R = s[8];
    return r[0] = a * x + o * b + l * U, r[3] = a * p + o * T + l * w, r[6] = a * u + o * E + l * R, r[1] = c * x + h * b + d * U, r[4] = c * p + h * T + d * w, r[7] = c * u + h * E + d * R, r[2] = f * x + m * b + g * U, r[5] = f * p + m * T + g * w, r[8] = f * u + m * E + g * R, this;
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
    const t = this.elements, e = t[0], n = t[1], s = t[2], r = t[3], a = t[4], o = t[5], l = t[6], c = t[7], h = t[8], d = h * a - o * c, f = o * l - h * r, m = c * r - a * l, g = e * d + n * f + s * m;
    if (g === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const x = 1 / g;
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
    return this.premultiply(Cs.makeScale(t, e)), this;
  }
  rotate(t) {
    return this.premultiply(Cs.makeRotation(-t)), this;
  }
  translate(t, e) {
    return this.premultiply(Cs.makeTranslation(t, e)), this;
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
const Cs = /* @__PURE__ */ new Pt();
function Zo(i) {
  for (let t = i.length - 1; t >= 0; --t)
    if (i[t] >= 65535) return !0;
  return !1;
}
function _s(i) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", i);
}
function mc() {
  const i = _s("canvas");
  return i.style.display = "block", i;
}
const Ma = {};
function ni(i) {
  i in Ma || (Ma[i] = !0, console.warn(i));
}
function _c(i, t, e) {
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
function gc(i) {
  const t = i.elements;
  t[2] = 0.5 * t[2] + 0.5 * t[3], t[6] = 0.5 * t[6] + 0.5 * t[7], t[10] = 0.5 * t[10] + 0.5 * t[11], t[14] = 0.5 * t[14] + 0.5 * t[15];
}
function vc(i) {
  const t = i.elements;
  t[11] === -1 ? (t[10] = -t[10] - 1, t[14] = -t[14]) : (t[10] = -t[10], t[14] = -t[14] + 1);
}
const Sa = /* @__PURE__ */ new Pt().set(
  0.4123908,
  0.3575843,
  0.1804808,
  0.212639,
  0.7151687,
  0.0721923,
  0.0193308,
  0.1191948,
  0.9505322
), Ea = /* @__PURE__ */ new Pt().set(
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
function xc() {
  const i = {
    enabled: !0,
    workingColorSpace: mi,
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
      return this.enabled === !1 || r === a || !r || !a || (this.spaces[r].transfer === Zt && (s.r = ln(s.r), s.g = ln(s.g), s.b = ln(s.b)), this.spaces[r].primaries !== this.spaces[a].primaries && (s.applyMatrix3(this.spaces[r].toXYZ), s.applyMatrix3(this.spaces[a].fromXYZ)), this.spaces[a].transfer === Zt && (s.r = ci(s.r), s.g = ci(s.g), s.b = ci(s.b))), s;
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
      return s === Mn ? fs : this.spaces[s].transfer;
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
    [mi]: {
      primaries: t,
      whitePoint: n,
      transfer: fs,
      toXYZ: Sa,
      fromXYZ: Ea,
      luminanceCoefficients: e,
      workingColorSpaceConfig: { unpackColorSpace: Fe },
      outputColorSpaceConfig: { drawingBufferColorSpace: Fe }
    },
    [Fe]: {
      primaries: t,
      whitePoint: n,
      transfer: Zt,
      toXYZ: Sa,
      fromXYZ: Ea,
      luminanceCoefficients: e,
      outputColorSpaceConfig: { drawingBufferColorSpace: Fe }
    }
  }), i;
}
const Wt = /* @__PURE__ */ xc();
function ln(i) {
  return i < 0.04045 ? i * 0.0773993808 : Math.pow(i * 0.9478672986 + 0.0521327014, 2.4);
}
function ci(i) {
  return i < 31308e-7 ? i * 12.92 : 1.055 * Math.pow(i, 0.41666) - 0.055;
}
let kn;
class Mc {
  static getDataURL(t) {
    if (/^data:/i.test(t.src) || typeof HTMLCanvasElement > "u")
      return t.src;
    let e;
    if (t instanceof HTMLCanvasElement)
      e = t;
    else {
      kn === void 0 && (kn = _s("canvas")), kn.width = t.width, kn.height = t.height;
      const n = kn.getContext("2d");
      t instanceof ImageData ? n.putImageData(t, 0, 0) : n.drawImage(t, 0, 0, t.width, t.height), e = kn;
    }
    return e.width > 2048 || e.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", t), e.toDataURL("image/jpeg", 0.6)) : e.toDataURL("image/png");
  }
  static sRGBToLinear(t) {
    if (typeof HTMLImageElement < "u" && t instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
      const e = _s("canvas");
      e.width = t.width, e.height = t.height;
      const n = e.getContext("2d");
      n.drawImage(t, 0, 0, t.width, t.height);
      const s = n.getImageData(0, 0, t.width, t.height), r = s.data;
      for (let a = 0; a < r.length; a++)
        r[a] = ln(r[a] / 255) * 255;
      return n.putImageData(s, 0, 0), e;
    } else if (t.data) {
      const e = t.data.slice(0);
      for (let n = 0; n < e.length; n++)
        e instanceof Uint8Array || e instanceof Uint8ClampedArray ? e[n] = Math.floor(ln(e[n] / 255) * 255) : e[n] = ln(e[n]);
      return {
        data: e,
        width: t.width,
        height: t.height
      };
    } else
      return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), t;
  }
}
let Sc = 0;
class Ko {
  constructor(t = null) {
    this.isSource = !0, Object.defineProperty(this, "id", { value: Sc++ }), this.uuid = Ci(), this.data = t, this.dataReady = !0, this.version = 0;
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
          s[a].isDataTexture ? r.push(Ps(s[a].image)) : r.push(Ps(s[a]));
      } else
        r = Ps(s);
      n.url = r;
    }
    return e || (t.images[this.uuid] = n), n;
  }
}
function Ps(i) {
  return typeof HTMLImageElement < "u" && i instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && i instanceof ImageBitmap ? Mc.getDataURL(i) : i.data ? {
    data: Array.from(i.data),
    width: i.width,
    height: i.height,
    type: i.data.constructor.name
  } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let Ec = 0;
class we extends Hn {
  constructor(t = we.DEFAULT_IMAGE, e = we.DEFAULT_MAPPING, n = Nn, s = Nn, r = Ze, a = Fn, o = Ye, l = cn, c = we.DEFAULT_ANISOTROPY, h = Mn) {
    super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: Ec++ }), this.uuid = Ci(), this.name = "", this.source = new Ko(t), this.mipmaps = [], this.mapping = e, this.channel = 0, this.wrapS = n, this.wrapT = s, this.magFilter = r, this.minFilter = a, this.anisotropy = c, this.format = o, this.internalFormat = null, this.type = l, this.offset = new Dt(0, 0), this.repeat = new Dt(1, 1), this.center = new Dt(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new Pt(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = h, this.userData = {}, this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = !1, this.pmremVersion = 0;
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
    if (this.mapping !== Oo) return t;
    if (t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1)
      switch (this.wrapS) {
        case gr:
          t.x = t.x - Math.floor(t.x);
          break;
        case Nn:
          t.x = t.x < 0 ? 0 : 1;
          break;
        case vr:
          Math.abs(Math.floor(t.x) % 2) === 1 ? t.x = Math.ceil(t.x) - t.x : t.x = t.x - Math.floor(t.x);
          break;
      }
    if (t.y < 0 || t.y > 1)
      switch (this.wrapT) {
        case gr:
          t.y = t.y - Math.floor(t.y);
          break;
        case Nn:
          t.y = t.y < 0 ? 0 : 1;
          break;
        case vr:
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
we.DEFAULT_IMAGE = null;
we.DEFAULT_MAPPING = Oo;
we.DEFAULT_ANISOTROPY = 1;
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
    const l = t.elements, c = l[0], h = l[4], d = l[8], f = l[1], m = l[5], g = l[9], x = l[2], p = l[6], u = l[10];
    if (Math.abs(h - f) < 0.01 && Math.abs(d - x) < 0.01 && Math.abs(g - p) < 0.01) {
      if (Math.abs(h + f) < 0.1 && Math.abs(d + x) < 0.1 && Math.abs(g + p) < 0.1 && Math.abs(c + m + u - 3) < 0.1)
        return this.set(1, 0, 0, 0), this;
      e = Math.PI;
      const T = (c + 1) / 2, E = (m + 1) / 2, U = (u + 1) / 2, w = (h + f) / 4, R = (d + x) / 4, N = (g + p) / 4;
      return T > E && T > U ? T < 0.01 ? (n = 0, s = 0.707106781, r = 0.707106781) : (n = Math.sqrt(T), s = w / n, r = R / n) : E > U ? E < 0.01 ? (n = 0.707106781, s = 0, r = 0.707106781) : (s = Math.sqrt(E), n = w / s, r = N / s) : U < 0.01 ? (n = 0.707106781, s = 0.707106781, r = 0) : (r = Math.sqrt(U), n = R / r, s = N / r), this.set(n, s, r, e), this;
    }
    let b = Math.sqrt((p - g) * (p - g) + (d - x) * (d - x) + (f - h) * (f - h));
    return Math.abs(b) < 1e-3 && (b = 1), this.x = (p - g) / b, this.y = (d - x) / b, this.z = (f - h) / b, this.w = Math.acos((c + m + u - 1) / 2), this;
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
    return this.x = Ft(this.x, t.x, e.x), this.y = Ft(this.y, t.y, e.y), this.z = Ft(this.z, t.z, e.z), this.w = Ft(this.w, t.w, e.w), this;
  }
  clampScalar(t, e) {
    return this.x = Ft(this.x, t, e), this.y = Ft(this.y, t, e), this.z = Ft(this.z, t, e), this.w = Ft(this.w, t, e), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Ft(n, t, e));
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
class yc extends Hn {
  constructor(t = 1, e = 1, n = {}) {
    super(), this.isRenderTarget = !0, this.width = t, this.height = e, this.depth = 1, this.scissor = new re(0, 0, t, e), this.scissorTest = !1, this.viewport = new re(0, 0, t, e);
    const s = { width: t, height: e, depth: 1 };
    n = Object.assign({
      generateMipmaps: !1,
      internalFormat: null,
      minFilter: Ze,
      depthBuffer: !0,
      stencilBuffer: !1,
      resolveDepthBuffer: !0,
      resolveStencilBuffer: !0,
      depthTexture: null,
      samples: 0,
      count: 1
    }, n);
    const r = new we(s, n.mapping, n.wrapS, n.wrapT, n.magFilter, n.minFilter, n.format, n.type, n.anisotropy, n.colorSpace);
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
    return this.texture.source = new Ko(e), this.depthBuffer = t.depthBuffer, this.stencilBuffer = t.stencilBuffer, this.resolveDepthBuffer = t.resolveDepthBuffer, this.resolveStencilBuffer = t.resolveStencilBuffer, t.depthTexture !== null && (this.depthTexture = t.depthTexture.clone()), this.samples = t.samples, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class Bn extends yc {
  constructor(t = 1, e = 1, n = {}) {
    super(t, e, n), this.isWebGLRenderTarget = !0;
  }
}
class $o extends we {
  constructor(t = null, e = 1, n = 1, s = 1) {
    super(null), this.isDataArrayTexture = !0, this.image = { data: t, width: e, height: n, depth: s }, this.magFilter = qe, this.minFilter = qe, this.wrapR = Nn, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
  }
  addLayerUpdate(t) {
    this.layerUpdates.add(t);
  }
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class Tc extends we {
  constructor(t = null, e = 1, n = 1, s = 1) {
    super(null), this.isData3DTexture = !0, this.image = { data: t, width: e, height: n, depth: s }, this.magFilter = qe, this.minFilter = qe, this.wrapR = Nn, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class zn {
  constructor(t = 0, e = 0, n = 0, s = 1) {
    this.isQuaternion = !0, this._x = t, this._y = e, this._z = n, this._w = s;
  }
  static slerpFlat(t, e, n, s, r, a, o) {
    let l = n[s + 0], c = n[s + 1], h = n[s + 2], d = n[s + 3];
    const f = r[a + 0], m = r[a + 1], g = r[a + 2], x = r[a + 3];
    if (o === 0) {
      t[e + 0] = l, t[e + 1] = c, t[e + 2] = h, t[e + 3] = d;
      return;
    }
    if (o === 1) {
      t[e + 0] = f, t[e + 1] = m, t[e + 2] = g, t[e + 3] = x;
      return;
    }
    if (d !== x || l !== f || c !== m || h !== g) {
      let p = 1 - o;
      const u = l * f + c * m + h * g + d * x, b = u >= 0 ? 1 : -1, T = 1 - u * u;
      if (T > Number.EPSILON) {
        const U = Math.sqrt(T), w = Math.atan2(U, u * b);
        p = Math.sin(p * w) / U, o = Math.sin(o * w) / U;
      }
      const E = o * b;
      if (l = l * p + f * E, c = c * p + m * E, h = h * p + g * E, d = d * p + x * E, p === 1 - o) {
        const U = 1 / Math.sqrt(l * l + c * c + h * h + d * d);
        l *= U, c *= U, h *= U, d *= U;
      }
    }
    t[e] = l, t[e + 1] = c, t[e + 2] = h, t[e + 3] = d;
  }
  static multiplyQuaternionsFlat(t, e, n, s, r, a) {
    const o = n[s], l = n[s + 1], c = n[s + 2], h = n[s + 3], d = r[a], f = r[a + 1], m = r[a + 2], g = r[a + 3];
    return t[e] = o * g + h * d + l * m - c * f, t[e + 1] = l * g + h * f + c * d - o * m, t[e + 2] = c * g + h * m + o * f - l * d, t[e + 3] = h * g - o * d - l * f - c * m, t;
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
    const n = t._x, s = t._y, r = t._z, a = t._order, o = Math.cos, l = Math.sin, c = o(n / 2), h = o(s / 2), d = o(r / 2), f = l(n / 2), m = l(s / 2), g = l(r / 2);
    switch (a) {
      case "XYZ":
        this._x = f * h * d + c * m * g, this._y = c * m * d - f * h * g, this._z = c * h * g + f * m * d, this._w = c * h * d - f * m * g;
        break;
      case "YXZ":
        this._x = f * h * d + c * m * g, this._y = c * m * d - f * h * g, this._z = c * h * g - f * m * d, this._w = c * h * d + f * m * g;
        break;
      case "ZXY":
        this._x = f * h * d - c * m * g, this._y = c * m * d + f * h * g, this._z = c * h * g + f * m * d, this._w = c * h * d - f * m * g;
        break;
      case "ZYX":
        this._x = f * h * d - c * m * g, this._y = c * m * d + f * h * g, this._z = c * h * g - f * m * d, this._w = c * h * d + f * m * g;
        break;
      case "YZX":
        this._x = f * h * d + c * m * g, this._y = c * m * d + f * h * g, this._z = c * h * g - f * m * d, this._w = c * h * d - f * m * g;
        break;
      case "XZY":
        this._x = f * h * d - c * m * g, this._y = c * m * d - f * h * g, this._z = c * h * g + f * m * d, this._w = c * h * d + f * m * g;
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
    return 2 * Math.acos(Math.abs(Ft(this.dot(t), -1, 1)));
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
class I {
  constructor(t = 0, e = 0, n = 0) {
    I.prototype.isVector3 = !0, this.x = t, this.y = e, this.z = n;
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
    return this.applyQuaternion(ya.setFromEuler(t));
  }
  applyAxisAngle(t, e) {
    return this.applyQuaternion(ya.setFromAxisAngle(t, e));
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
    return this.x = Ft(this.x, t.x, e.x), this.y = Ft(this.y, t.y, e.y), this.z = Ft(this.z, t.z, e.z), this;
  }
  clampScalar(t, e) {
    return this.x = Ft(this.x, t, e), this.y = Ft(this.y, t, e), this.z = Ft(this.z, t, e), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Ft(n, t, e));
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
    return Ds.copy(this).projectOnVector(t), this.sub(Ds);
  }
  reflect(t) {
    return this.sub(Ds.copy(t).multiplyScalar(2 * this.dot(t)));
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(Ft(n, -1, 1));
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
const Ds = /* @__PURE__ */ new I(), ya = /* @__PURE__ */ new zn();
class Pi {
  constructor(t = new I(1 / 0, 1 / 0, 1 / 0), e = new I(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = !0, this.min = t, this.max = e;
  }
  set(t, e) {
    return this.min.copy(t), this.max.copy(e), this;
  }
  setFromArray(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e += 3)
      this.expandByPoint(Ge.fromArray(t, e));
    return this;
  }
  setFromBufferAttribute(t) {
    this.makeEmpty();
    for (let e = 0, n = t.count; e < n; e++)
      this.expandByPoint(Ge.fromBufferAttribute(t, e));
    return this;
  }
  setFromPoints(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e++)
      this.expandByPoint(t[e]);
    return this;
  }
  setFromCenterAndSize(t, e) {
    const n = Ge.copy(e).multiplyScalar(0.5);
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
          t.isMesh === !0 ? t.getVertexPosition(a, Ge) : Ge.fromBufferAttribute(r, a), Ge.applyMatrix4(t.matrixWorld), this.expandByPoint(Ge);
      else
        t.boundingBox !== void 0 ? (t.boundingBox === null && t.computeBoundingBox(), Fi.copy(t.boundingBox)) : (n.boundingBox === null && n.computeBoundingBox(), Fi.copy(n.boundingBox)), Fi.applyMatrix4(t.matrixWorld), this.union(Fi);
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
    return this.clampPoint(t.center, Ge), Ge.distanceToSquared(t.center) <= t.radius * t.radius;
  }
  intersectsPlane(t) {
    let e, n;
    return t.normal.x > 0 ? (e = t.normal.x * this.min.x, n = t.normal.x * this.max.x) : (e = t.normal.x * this.max.x, n = t.normal.x * this.min.x), t.normal.y > 0 ? (e += t.normal.y * this.min.y, n += t.normal.y * this.max.y) : (e += t.normal.y * this.max.y, n += t.normal.y * this.min.y), t.normal.z > 0 ? (e += t.normal.z * this.min.z, n += t.normal.z * this.max.z) : (e += t.normal.z * this.max.z, n += t.normal.z * this.min.z), e <= -t.constant && n >= -t.constant;
  }
  intersectsTriangle(t) {
    if (this.isEmpty())
      return !1;
    this.getCenter(Mi), Oi.subVectors(this.max, Mi), Wn.subVectors(t.a, Mi), Xn.subVectors(t.b, Mi), Yn.subVectors(t.c, Mi), dn.subVectors(Xn, Wn), fn.subVectors(Yn, Xn), An.subVectors(Wn, Yn);
    let e = [
      0,
      -dn.z,
      dn.y,
      0,
      -fn.z,
      fn.y,
      0,
      -An.z,
      An.y,
      dn.z,
      0,
      -dn.x,
      fn.z,
      0,
      -fn.x,
      An.z,
      0,
      -An.x,
      -dn.y,
      dn.x,
      0,
      -fn.y,
      fn.x,
      0,
      -An.y,
      An.x,
      0
    ];
    return !Ls(e, Wn, Xn, Yn, Oi) || (e = [1, 0, 0, 0, 1, 0, 0, 0, 1], !Ls(e, Wn, Xn, Yn, Oi)) ? !1 : (Bi.crossVectors(dn, fn), e = [Bi.x, Bi.y, Bi.z], Ls(e, Wn, Xn, Yn, Oi));
  }
  clampPoint(t, e) {
    return e.copy(t).clamp(this.min, this.max);
  }
  distanceToPoint(t) {
    return this.clampPoint(t, Ge).distanceTo(t);
  }
  getBoundingSphere(t) {
    return this.isEmpty() ? t.makeEmpty() : (this.getCenter(t.center), t.radius = this.getSize(Ge).length() * 0.5), t;
  }
  intersect(t) {
    return this.min.max(t.min), this.max.min(t.max), this.isEmpty() && this.makeEmpty(), this;
  }
  union(t) {
    return this.min.min(t.min), this.max.max(t.max), this;
  }
  applyMatrix4(t) {
    return this.isEmpty() ? this : ($e[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t), $e[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t), $e[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t), $e[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t), $e[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t), $e[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t), $e[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t), $e[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t), this.setFromPoints($e), this);
  }
  translate(t) {
    return this.min.add(t), this.max.add(t), this;
  }
  equals(t) {
    return t.min.equals(this.min) && t.max.equals(this.max);
  }
}
const $e = [
  /* @__PURE__ */ new I(),
  /* @__PURE__ */ new I(),
  /* @__PURE__ */ new I(),
  /* @__PURE__ */ new I(),
  /* @__PURE__ */ new I(),
  /* @__PURE__ */ new I(),
  /* @__PURE__ */ new I(),
  /* @__PURE__ */ new I()
], Ge = /* @__PURE__ */ new I(), Fi = /* @__PURE__ */ new Pi(), Wn = /* @__PURE__ */ new I(), Xn = /* @__PURE__ */ new I(), Yn = /* @__PURE__ */ new I(), dn = /* @__PURE__ */ new I(), fn = /* @__PURE__ */ new I(), An = /* @__PURE__ */ new I(), Mi = /* @__PURE__ */ new I(), Oi = /* @__PURE__ */ new I(), Bi = /* @__PURE__ */ new I(), wn = /* @__PURE__ */ new I();
function Ls(i, t, e, n, s) {
  for (let r = 0, a = i.length - 3; r <= a; r += 3) {
    wn.fromArray(i, r);
    const o = s.x * Math.abs(wn.x) + s.y * Math.abs(wn.y) + s.z * Math.abs(wn.z), l = t.dot(wn), c = e.dot(wn), h = n.dot(wn);
    if (Math.max(-Math.max(l, c, h), Math.min(l, c, h)) > o)
      return !1;
  }
  return !0;
}
const bc = /* @__PURE__ */ new Pi(), Si = /* @__PURE__ */ new I(), Us = /* @__PURE__ */ new I();
class Ss {
  constructor(t = new I(), e = -1) {
    this.isSphere = !0, this.center = t, this.radius = e;
  }
  set(t, e) {
    return this.center.copy(t), this.radius = e, this;
  }
  setFromPoints(t, e) {
    const n = this.center;
    e !== void 0 ? n.copy(e) : bc.setFromPoints(t).getCenter(n);
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
    Si.subVectors(t, this.center);
    const e = Si.lengthSq();
    if (e > this.radius * this.radius) {
      const n = Math.sqrt(e), s = (n - this.radius) * 0.5;
      this.center.addScaledVector(Si, s / n), this.radius += s;
    }
    return this;
  }
  union(t) {
    return t.isEmpty() ? this : this.isEmpty() ? (this.copy(t), this) : (this.center.equals(t.center) === !0 ? this.radius = Math.max(this.radius, t.radius) : (Us.subVectors(t.center, this.center).setLength(t.radius), this.expandByPoint(Si.copy(t.center).add(Us)), this.expandByPoint(Si.copy(t.center).sub(Us))), this);
  }
  equals(t) {
    return t.center.equals(this.center) && t.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const Je = /* @__PURE__ */ new I(), Is = /* @__PURE__ */ new I(), zi = /* @__PURE__ */ new I(), pn = /* @__PURE__ */ new I(), Ns = /* @__PURE__ */ new I(), Hi = /* @__PURE__ */ new I(), Fs = /* @__PURE__ */ new I();
class Es {
  constructor(t = new I(), e = new I(0, 0, -1)) {
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
    return this.origin.copy(this.at(t, Je)), this;
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
    const e = Je.subVectors(t, this.origin).dot(this.direction);
    return e < 0 ? this.origin.distanceToSquared(t) : (Je.copy(this.origin).addScaledVector(this.direction, e), Je.distanceToSquared(t));
  }
  distanceSqToSegment(t, e, n, s) {
    Is.copy(t).add(e).multiplyScalar(0.5), zi.copy(e).sub(t).normalize(), pn.copy(this.origin).sub(Is);
    const r = t.distanceTo(e) * 0.5, a = -this.direction.dot(zi), o = pn.dot(this.direction), l = -pn.dot(zi), c = pn.lengthSq(), h = Math.abs(1 - a * a);
    let d, f, m, g;
    if (h > 0)
      if (d = a * l - o, f = a * o - l, g = r * h, d >= 0)
        if (f >= -g)
          if (f <= g) {
            const x = 1 / h;
            d *= x, f *= x, m = d * (d + a * f + 2 * o) + f * (a * d + f + 2 * l) + c;
          } else
            f = r, d = Math.max(0, -(a * f + o)), m = -d * d + f * (f + 2 * l) + c;
        else
          f = -r, d = Math.max(0, -(a * f + o)), m = -d * d + f * (f + 2 * l) + c;
      else
        f <= -g ? (d = Math.max(0, -(-a * r + o)), f = d > 0 ? -r : Math.min(Math.max(-r, -l), r), m = -d * d + f * (f + 2 * l) + c) : f <= g ? (d = 0, f = Math.min(Math.max(-r, -l), r), m = f * (f + 2 * l) + c) : (d = Math.max(0, -(a * r + o)), f = d > 0 ? r : Math.min(Math.max(-r, -l), r), m = -d * d + f * (f + 2 * l) + c);
    else
      f = a > 0 ? -r : r, d = Math.max(0, -(a * f + o)), m = -d * d + f * (f + 2 * l) + c;
    return n && n.copy(this.origin).addScaledVector(this.direction, d), s && s.copy(Is).addScaledVector(zi, f), m;
  }
  intersectSphere(t, e) {
    Je.subVectors(t.center, this.origin);
    const n = Je.dot(this.direction), s = Je.dot(Je) - n * n, r = t.radius * t.radius;
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
    return this.intersectBox(t, Je) !== null;
  }
  intersectTriangle(t, e, n, s, r) {
    Ns.subVectors(e, t), Hi.subVectors(n, t), Fs.crossVectors(Ns, Hi);
    let a = this.direction.dot(Fs), o;
    if (a > 0) {
      if (s) return null;
      o = 1;
    } else if (a < 0)
      o = -1, a = -a;
    else
      return null;
    pn.subVectors(this.origin, t);
    const l = o * this.direction.dot(Hi.crossVectors(pn, Hi));
    if (l < 0)
      return null;
    const c = o * this.direction.dot(Ns.cross(pn));
    if (c < 0 || l + c > a)
      return null;
    const h = -o * pn.dot(Fs);
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
class ee {
  constructor(t, e, n, s, r, a, o, l, c, h, d, f, m, g, x, p) {
    ee.prototype.isMatrix4 = !0, this.elements = [
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
    ], t !== void 0 && this.set(t, e, n, s, r, a, o, l, c, h, d, f, m, g, x, p);
  }
  set(t, e, n, s, r, a, o, l, c, h, d, f, m, g, x, p) {
    const u = this.elements;
    return u[0] = t, u[4] = e, u[8] = n, u[12] = s, u[1] = r, u[5] = a, u[9] = o, u[13] = l, u[2] = c, u[6] = h, u[10] = d, u[14] = f, u[3] = m, u[7] = g, u[11] = x, u[15] = p, this;
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
    return new ee().fromArray(this.elements);
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
    const e = this.elements, n = t.elements, s = 1 / qn.setFromMatrixColumn(t, 0).length(), r = 1 / qn.setFromMatrixColumn(t, 1).length(), a = 1 / qn.setFromMatrixColumn(t, 2).length();
    return e[0] = n[0] * s, e[1] = n[1] * s, e[2] = n[2] * s, e[3] = 0, e[4] = n[4] * r, e[5] = n[5] * r, e[6] = n[6] * r, e[7] = 0, e[8] = n[8] * a, e[9] = n[9] * a, e[10] = n[10] * a, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
  }
  makeRotationFromEuler(t) {
    const e = this.elements, n = t.x, s = t.y, r = t.z, a = Math.cos(n), o = Math.sin(n), l = Math.cos(s), c = Math.sin(s), h = Math.cos(r), d = Math.sin(r);
    if (t.order === "XYZ") {
      const f = a * h, m = a * d, g = o * h, x = o * d;
      e[0] = l * h, e[4] = -l * d, e[8] = c, e[1] = m + g * c, e[5] = f - x * c, e[9] = -o * l, e[2] = x - f * c, e[6] = g + m * c, e[10] = a * l;
    } else if (t.order === "YXZ") {
      const f = l * h, m = l * d, g = c * h, x = c * d;
      e[0] = f + x * o, e[4] = g * o - m, e[8] = a * c, e[1] = a * d, e[5] = a * h, e[9] = -o, e[2] = m * o - g, e[6] = x + f * o, e[10] = a * l;
    } else if (t.order === "ZXY") {
      const f = l * h, m = l * d, g = c * h, x = c * d;
      e[0] = f - x * o, e[4] = -a * d, e[8] = g + m * o, e[1] = m + g * o, e[5] = a * h, e[9] = x - f * o, e[2] = -a * c, e[6] = o, e[10] = a * l;
    } else if (t.order === "ZYX") {
      const f = a * h, m = a * d, g = o * h, x = o * d;
      e[0] = l * h, e[4] = g * c - m, e[8] = f * c + x, e[1] = l * d, e[5] = x * c + f, e[9] = m * c - g, e[2] = -c, e[6] = o * l, e[10] = a * l;
    } else if (t.order === "YZX") {
      const f = a * l, m = a * c, g = o * l, x = o * c;
      e[0] = l * h, e[4] = x - f * d, e[8] = g * d + m, e[1] = d, e[5] = a * h, e[9] = -o * h, e[2] = -c * h, e[6] = m * d + g, e[10] = f - x * d;
    } else if (t.order === "XZY") {
      const f = a * l, m = a * c, g = o * l, x = o * c;
      e[0] = l * h, e[4] = -d, e[8] = c * h, e[1] = f * d + x, e[5] = a * h, e[9] = m * d - g, e[2] = g * d - m, e[6] = o * h, e[10] = x * d + f;
    }
    return e[3] = 0, e[7] = 0, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
  }
  makeRotationFromQuaternion(t) {
    return this.compose(Ac, t, wc);
  }
  lookAt(t, e, n) {
    const s = this.elements;
    return Ce.subVectors(t, e), Ce.lengthSq() === 0 && (Ce.z = 1), Ce.normalize(), mn.crossVectors(n, Ce), mn.lengthSq() === 0 && (Math.abs(n.z) === 1 ? Ce.x += 1e-4 : Ce.z += 1e-4, Ce.normalize(), mn.crossVectors(n, Ce)), mn.normalize(), Vi.crossVectors(Ce, mn), s[0] = mn.x, s[4] = Vi.x, s[8] = Ce.x, s[1] = mn.y, s[5] = Vi.y, s[9] = Ce.y, s[2] = mn.z, s[6] = Vi.z, s[10] = Ce.z, this;
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements, s = e.elements, r = this.elements, a = n[0], o = n[4], l = n[8], c = n[12], h = n[1], d = n[5], f = n[9], m = n[13], g = n[2], x = n[6], p = n[10], u = n[14], b = n[3], T = n[7], E = n[11], U = n[15], w = s[0], R = s[4], N = s[8], S = s[12], M = s[1], C = s[5], k = s[9], z = s[13], X = s[2], K = s[6], G = s[10], Q = s[14], V = s[3], st = s[7], ht = s[11], xt = s[15];
    return r[0] = a * w + o * M + l * X + c * V, r[4] = a * R + o * C + l * K + c * st, r[8] = a * N + o * k + l * G + c * ht, r[12] = a * S + o * z + l * Q + c * xt, r[1] = h * w + d * M + f * X + m * V, r[5] = h * R + d * C + f * K + m * st, r[9] = h * N + d * k + f * G + m * ht, r[13] = h * S + d * z + f * Q + m * xt, r[2] = g * w + x * M + p * X + u * V, r[6] = g * R + x * C + p * K + u * st, r[10] = g * N + x * k + p * G + u * ht, r[14] = g * S + x * z + p * Q + u * xt, r[3] = b * w + T * M + E * X + U * V, r[7] = b * R + T * C + E * K + U * st, r[11] = b * N + T * k + E * G + U * ht, r[15] = b * S + T * z + E * Q + U * xt, this;
  }
  multiplyScalar(t) {
    const e = this.elements;
    return e[0] *= t, e[4] *= t, e[8] *= t, e[12] *= t, e[1] *= t, e[5] *= t, e[9] *= t, e[13] *= t, e[2] *= t, e[6] *= t, e[10] *= t, e[14] *= t, e[3] *= t, e[7] *= t, e[11] *= t, e[15] *= t, this;
  }
  determinant() {
    const t = this.elements, e = t[0], n = t[4], s = t[8], r = t[12], a = t[1], o = t[5], l = t[9], c = t[13], h = t[2], d = t[6], f = t[10], m = t[14], g = t[3], x = t[7], p = t[11], u = t[15];
    return g * (+r * l * d - s * c * d - r * o * f + n * c * f + s * o * m - n * l * m) + x * (+e * l * m - e * c * f + r * a * f - s * a * m + s * c * h - r * l * h) + p * (+e * c * d - e * o * m - r * a * d + n * a * m + r * o * h - n * c * h) + u * (-s * o * h - e * l * d + e * o * f + s * a * d - n * a * f + n * l * h);
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
    const t = this.elements, e = t[0], n = t[1], s = t[2], r = t[3], a = t[4], o = t[5], l = t[6], c = t[7], h = t[8], d = t[9], f = t[10], m = t[11], g = t[12], x = t[13], p = t[14], u = t[15], b = d * p * c - x * f * c + x * l * m - o * p * m - d * l * u + o * f * u, T = g * f * c - h * p * c - g * l * m + a * p * m + h * l * u - a * f * u, E = h * x * c - g * d * c + g * o * m - a * x * m - h * o * u + a * d * u, U = g * d * l - h * x * l - g * o * f + a * x * f + h * o * p - a * d * p, w = e * b + n * T + s * E + r * U;
    if (w === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const R = 1 / w;
    return t[0] = b * R, t[1] = (x * f * r - d * p * r - x * s * m + n * p * m + d * s * u - n * f * u) * R, t[2] = (o * p * r - x * l * r + x * s * c - n * p * c - o * s * u + n * l * u) * R, t[3] = (d * l * r - o * f * r - d * s * c + n * f * c + o * s * m - n * l * m) * R, t[4] = T * R, t[5] = (h * p * r - g * f * r + g * s * m - e * p * m - h * s * u + e * f * u) * R, t[6] = (g * l * r - a * p * r - g * s * c + e * p * c + a * s * u - e * l * u) * R, t[7] = (a * f * r - h * l * r + h * s * c - e * f * c - a * s * m + e * l * m) * R, t[8] = E * R, t[9] = (g * d * r - h * x * r - g * n * m + e * x * m + h * n * u - e * d * u) * R, t[10] = (a * x * r - g * o * r + g * n * c - e * x * c - a * n * u + e * o * u) * R, t[11] = (h * o * r - a * d * r - h * n * c + e * d * c + a * n * m - e * o * m) * R, t[12] = U * R, t[13] = (h * x * s - g * d * s + g * n * f - e * x * f - h * n * p + e * d * p) * R, t[14] = (g * o * s - a * x * s - g * n * l + e * x * l + a * n * p - e * o * p) * R, t[15] = (a * d * s - h * o * s + h * n * l - e * d * l - a * n * f + e * o * f) * R, this;
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
    const s = this.elements, r = e._x, a = e._y, o = e._z, l = e._w, c = r + r, h = a + a, d = o + o, f = r * c, m = r * h, g = r * d, x = a * h, p = a * d, u = o * d, b = l * c, T = l * h, E = l * d, U = n.x, w = n.y, R = n.z;
    return s[0] = (1 - (x + u)) * U, s[1] = (m + E) * U, s[2] = (g - T) * U, s[3] = 0, s[4] = (m - E) * w, s[5] = (1 - (f + u)) * w, s[6] = (p + b) * w, s[7] = 0, s[8] = (g + T) * R, s[9] = (p - b) * R, s[10] = (1 - (f + x)) * R, s[11] = 0, s[12] = t.x, s[13] = t.y, s[14] = t.z, s[15] = 1, this;
  }
  decompose(t, e, n) {
    const s = this.elements;
    let r = qn.set(s[0], s[1], s[2]).length();
    const a = qn.set(s[4], s[5], s[6]).length(), o = qn.set(s[8], s[9], s[10]).length();
    this.determinant() < 0 && (r = -r), t.x = s[12], t.y = s[13], t.z = s[14], ke.copy(this);
    const c = 1 / r, h = 1 / a, d = 1 / o;
    return ke.elements[0] *= c, ke.elements[1] *= c, ke.elements[2] *= c, ke.elements[4] *= h, ke.elements[5] *= h, ke.elements[6] *= h, ke.elements[8] *= d, ke.elements[9] *= d, ke.elements[10] *= d, e.setFromRotationMatrix(ke), n.x = r, n.y = a, n.z = o, this;
  }
  makePerspective(t, e, n, s, r, a, o = on) {
    const l = this.elements, c = 2 * r / (e - t), h = 2 * r / (n - s), d = (e + t) / (e - t), f = (n + s) / (n - s);
    let m, g;
    if (o === on)
      m = -(a + r) / (a - r), g = -2 * a * r / (a - r);
    else if (o === ms)
      m = -a / (a - r), g = -a * r / (a - r);
    else
      throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
    return l[0] = c, l[4] = 0, l[8] = d, l[12] = 0, l[1] = 0, l[5] = h, l[9] = f, l[13] = 0, l[2] = 0, l[6] = 0, l[10] = m, l[14] = g, l[3] = 0, l[7] = 0, l[11] = -1, l[15] = 0, this;
  }
  makeOrthographic(t, e, n, s, r, a, o = on) {
    const l = this.elements, c = 1 / (e - t), h = 1 / (n - s), d = 1 / (a - r), f = (e + t) * c, m = (n + s) * h;
    let g, x;
    if (o === on)
      g = (a + r) * d, x = -2 * d;
    else if (o === ms)
      g = r * d, x = -1 * d;
    else
      throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
    return l[0] = 2 * c, l[4] = 0, l[8] = 0, l[12] = -f, l[1] = 0, l[5] = 2 * h, l[9] = 0, l[13] = -m, l[2] = 0, l[6] = 0, l[10] = x, l[14] = -g, l[3] = 0, l[7] = 0, l[11] = 0, l[15] = 1, this;
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
const qn = /* @__PURE__ */ new I(), ke = /* @__PURE__ */ new ee(), Ac = /* @__PURE__ */ new I(0, 0, 0), wc = /* @__PURE__ */ new I(1, 1, 1), mn = /* @__PURE__ */ new I(), Vi = /* @__PURE__ */ new I(), Ce = /* @__PURE__ */ new I(), Ta = /* @__PURE__ */ new ee(), ba = /* @__PURE__ */ new zn();
class hn {
  constructor(t = 0, e = 0, n = 0, s = hn.DEFAULT_ORDER) {
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
        this._y = Math.asin(Ft(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(-h, m), this._z = Math.atan2(-a, r)) : (this._x = Math.atan2(f, c), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-Ft(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._y = Math.atan2(o, m), this._z = Math.atan2(l, c)) : (this._y = Math.atan2(-d, r), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(Ft(f, -1, 1)), Math.abs(f) < 0.9999999 ? (this._y = Math.atan2(-d, m), this._z = Math.atan2(-a, c)) : (this._y = 0, this._z = Math.atan2(l, r));
        break;
      case "ZYX":
        this._y = Math.asin(-Ft(d, -1, 1)), Math.abs(d) < 0.9999999 ? (this._x = Math.atan2(f, m), this._z = Math.atan2(l, r)) : (this._x = 0, this._z = Math.atan2(-a, c));
        break;
      case "YZX":
        this._z = Math.asin(Ft(l, -1, 1)), Math.abs(l) < 0.9999999 ? (this._x = Math.atan2(-h, c), this._y = Math.atan2(-d, r)) : (this._x = 0, this._y = Math.atan2(o, m));
        break;
      case "XZY":
        this._z = Math.asin(-Ft(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(f, c), this._y = Math.atan2(o, r)) : (this._x = Math.atan2(-h, m), this._y = 0);
        break;
      default:
        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + e);
    }
    return this._order = e, n === !0 && this._onChangeCallback(), this;
  }
  setFromQuaternion(t, e, n) {
    return Ta.makeRotationFromQuaternion(t), this.setFromRotationMatrix(Ta, e, n);
  }
  setFromVector3(t, e = this._order) {
    return this.set(t.x, t.y, t.z, e);
  }
  reorder(t) {
    return ba.setFromEuler(this), this.setFromQuaternion(ba, t);
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
hn.DEFAULT_ORDER = "XYZ";
class ea {
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
let Rc = 0;
const Aa = /* @__PURE__ */ new I(), jn = /* @__PURE__ */ new zn(), Qe = /* @__PURE__ */ new ee(), Gi = /* @__PURE__ */ new I(), Ei = /* @__PURE__ */ new I(), Cc = /* @__PURE__ */ new I(), Pc = /* @__PURE__ */ new zn(), wa = /* @__PURE__ */ new I(1, 0, 0), Ra = /* @__PURE__ */ new I(0, 1, 0), Ca = /* @__PURE__ */ new I(0, 0, 1), Pa = { type: "added" }, Dc = { type: "removed" }, Zn = { type: "childadded", child: null }, Os = { type: "childremoved", child: null };
class pe extends Hn {
  constructor() {
    super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: Rc++ }), this.uuid = Ci(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = pe.DEFAULT_UP.clone();
    const t = new I(), e = new hn(), n = new zn(), s = new I(1, 1, 1);
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
        value: new ee()
      },
      normalMatrix: {
        value: new Pt()
      }
    }), this.matrix = new ee(), this.matrixWorld = new ee(), this.matrixAutoUpdate = pe.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new ea(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.userData = {};
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
    return jn.setFromAxisAngle(t, e), this.quaternion.multiply(jn), this;
  }
  rotateOnWorldAxis(t, e) {
    return jn.setFromAxisAngle(t, e), this.quaternion.premultiply(jn), this;
  }
  rotateX(t) {
    return this.rotateOnAxis(wa, t);
  }
  rotateY(t) {
    return this.rotateOnAxis(Ra, t);
  }
  rotateZ(t) {
    return this.rotateOnAxis(Ca, t);
  }
  translateOnAxis(t, e) {
    return Aa.copy(t).applyQuaternion(this.quaternion), this.position.add(Aa.multiplyScalar(e)), this;
  }
  translateX(t) {
    return this.translateOnAxis(wa, t);
  }
  translateY(t) {
    return this.translateOnAxis(Ra, t);
  }
  translateZ(t) {
    return this.translateOnAxis(Ca, t);
  }
  localToWorld(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(this.matrixWorld);
  }
  worldToLocal(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(Qe.copy(this.matrixWorld).invert());
  }
  lookAt(t, e, n) {
    t.isVector3 ? Gi.copy(t) : Gi.set(t, e, n);
    const s = this.parent;
    this.updateWorldMatrix(!0, !1), Ei.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? Qe.lookAt(Ei, Gi, this.up) : Qe.lookAt(Gi, Ei, this.up), this.quaternion.setFromRotationMatrix(Qe), s && (Qe.extractRotation(s.matrixWorld), jn.setFromRotationMatrix(Qe), this.quaternion.premultiply(jn.invert()));
  }
  add(t) {
    if (arguments.length > 1) {
      for (let e = 0; e < arguments.length; e++)
        this.add(arguments[e]);
      return this;
    }
    return t === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", t), this) : (t && t.isObject3D ? (t.removeFromParent(), t.parent = this, this.children.push(t), t.dispatchEvent(Pa), Zn.child = t, this.dispatchEvent(Zn), Zn.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", t), this);
  }
  remove(t) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++)
        this.remove(arguments[n]);
      return this;
    }
    const e = this.children.indexOf(t);
    return e !== -1 && (t.parent = null, this.children.splice(e, 1), t.dispatchEvent(Dc), Os.child = t, this.dispatchEvent(Os), Os.child = null), this;
  }
  removeFromParent() {
    const t = this.parent;
    return t !== null && t.remove(this), this;
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(t) {
    return this.updateWorldMatrix(!0, !1), Qe.copy(this.matrixWorld).invert(), t.parent !== null && (t.parent.updateWorldMatrix(!0, !1), Qe.multiply(t.parent.matrixWorld)), t.applyMatrix4(Qe), t.removeFromParent(), t.parent = this, this.children.push(t), t.updateWorldMatrix(!1, !0), t.dispatchEvent(Pa), Zn.child = t, this.dispatchEvent(Zn), Zn.child = null, this;
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
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Ei, t, Cc), t;
  }
  getWorldScale(t) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Ei, Pc, t), t;
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
      const o = a(t.geometries), l = a(t.materials), c = a(t.textures), h = a(t.images), d = a(t.shapes), f = a(t.skeletons), m = a(t.animations), g = a(t.nodes);
      o.length > 0 && (n.geometries = o), l.length > 0 && (n.materials = l), c.length > 0 && (n.textures = c), h.length > 0 && (n.images = h), d.length > 0 && (n.shapes = d), f.length > 0 && (n.skeletons = f), m.length > 0 && (n.animations = m), g.length > 0 && (n.nodes = g);
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
pe.DEFAULT_UP = /* @__PURE__ */ new I(0, 1, 0);
pe.DEFAULT_MATRIX_AUTO_UPDATE = !0;
pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
const We = /* @__PURE__ */ new I(), tn = /* @__PURE__ */ new I(), Bs = /* @__PURE__ */ new I(), en = /* @__PURE__ */ new I(), Kn = /* @__PURE__ */ new I(), $n = /* @__PURE__ */ new I(), Da = /* @__PURE__ */ new I(), zs = /* @__PURE__ */ new I(), Hs = /* @__PURE__ */ new I(), Vs = /* @__PURE__ */ new I(), Gs = /* @__PURE__ */ new re(), ks = /* @__PURE__ */ new re(), Ws = /* @__PURE__ */ new re();
class Xe {
  constructor(t = new I(), e = new I(), n = new I()) {
    this.a = t, this.b = e, this.c = n;
  }
  static getNormal(t, e, n, s) {
    s.subVectors(n, e), We.subVectors(t, e), s.cross(We);
    const r = s.lengthSq();
    return r > 0 ? s.multiplyScalar(1 / Math.sqrt(r)) : s.set(0, 0, 0);
  }
  // static/instance method to calculate barycentric coordinates
  // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
  static getBarycoord(t, e, n, s, r) {
    We.subVectors(s, e), tn.subVectors(n, e), Bs.subVectors(t, e);
    const a = We.dot(We), o = We.dot(tn), l = We.dot(Bs), c = tn.dot(tn), h = tn.dot(Bs), d = a * c - o * o;
    if (d === 0)
      return r.set(0, 0, 0), null;
    const f = 1 / d, m = (c * l - o * h) * f, g = (a * h - o * l) * f;
    return r.set(1 - m - g, g, m);
  }
  static containsPoint(t, e, n, s) {
    return this.getBarycoord(t, e, n, s, en) === null ? !1 : en.x >= 0 && en.y >= 0 && en.x + en.y <= 1;
  }
  static getInterpolation(t, e, n, s, r, a, o, l) {
    return this.getBarycoord(t, e, n, s, en) === null ? (l.x = 0, l.y = 0, "z" in l && (l.z = 0), "w" in l && (l.w = 0), null) : (l.setScalar(0), l.addScaledVector(r, en.x), l.addScaledVector(a, en.y), l.addScaledVector(o, en.z), l);
  }
  static getInterpolatedAttribute(t, e, n, s, r, a) {
    return Gs.setScalar(0), ks.setScalar(0), Ws.setScalar(0), Gs.fromBufferAttribute(t, e), ks.fromBufferAttribute(t, n), Ws.fromBufferAttribute(t, s), a.setScalar(0), a.addScaledVector(Gs, r.x), a.addScaledVector(ks, r.y), a.addScaledVector(Ws, r.z), a;
  }
  static isFrontFacing(t, e, n, s) {
    return We.subVectors(n, e), tn.subVectors(t, e), We.cross(tn).dot(s) < 0;
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
    return We.subVectors(this.c, this.b), tn.subVectors(this.a, this.b), We.cross(tn).length() * 0.5;
  }
  getMidpoint(t) {
    return t.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }
  getNormal(t) {
    return Xe.getNormal(this.a, this.b, this.c, t);
  }
  getPlane(t) {
    return t.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(t, e) {
    return Xe.getBarycoord(t, this.a, this.b, this.c, e);
  }
  getInterpolation(t, e, n, s, r) {
    return Xe.getInterpolation(t, this.a, this.b, this.c, e, n, s, r);
  }
  containsPoint(t) {
    return Xe.containsPoint(t, this.a, this.b, this.c);
  }
  isFrontFacing(t) {
    return Xe.isFrontFacing(this.a, this.b, this.c, t);
  }
  intersectsBox(t) {
    return t.intersectsTriangle(this);
  }
  closestPointToPoint(t, e) {
    const n = this.a, s = this.b, r = this.c;
    let a, o;
    Kn.subVectors(s, n), $n.subVectors(r, n), zs.subVectors(t, n);
    const l = Kn.dot(zs), c = $n.dot(zs);
    if (l <= 0 && c <= 0)
      return e.copy(n);
    Hs.subVectors(t, s);
    const h = Kn.dot(Hs), d = $n.dot(Hs);
    if (h >= 0 && d <= h)
      return e.copy(s);
    const f = l * d - h * c;
    if (f <= 0 && l >= 0 && h <= 0)
      return a = l / (l - h), e.copy(n).addScaledVector(Kn, a);
    Vs.subVectors(t, r);
    const m = Kn.dot(Vs), g = $n.dot(Vs);
    if (g >= 0 && m <= g)
      return e.copy(r);
    const x = m * c - l * g;
    if (x <= 0 && c >= 0 && g <= 0)
      return o = c / (c - g), e.copy(n).addScaledVector($n, o);
    const p = h * g - m * d;
    if (p <= 0 && d - h >= 0 && m - g >= 0)
      return Da.subVectors(r, s), o = (d - h) / (d - h + (m - g)), e.copy(s).addScaledVector(Da, o);
    const u = 1 / (p + x + f);
    return a = x * u, o = f * u, e.copy(n).addScaledVector(Kn, a).addScaledVector($n, o);
  }
  equals(t) {
    return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
  }
}
const Jo = {
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
}, _n = { h: 0, s: 0, l: 0 }, ki = { h: 0, s: 0, l: 0 };
function Xs(i, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? i + (t - i) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? i + (t - i) * 6 * (2 / 3 - e) : i;
}
class Xt {
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
  setHex(t, e = Fe) {
    return t = Math.floor(t), this.r = (t >> 16 & 255) / 255, this.g = (t >> 8 & 255) / 255, this.b = (t & 255) / 255, Wt.toWorkingColorSpace(this, e), this;
  }
  setRGB(t, e, n, s = Wt.workingColorSpace) {
    return this.r = t, this.g = e, this.b = n, Wt.toWorkingColorSpace(this, s), this;
  }
  setHSL(t, e, n, s = Wt.workingColorSpace) {
    if (t = fc(t, 1), e = Ft(e, 0, 1), n = Ft(n, 0, 1), e === 0)
      this.r = this.g = this.b = n;
    else {
      const r = n <= 0.5 ? n * (1 + e) : n + e - n * e, a = 2 * n - r;
      this.r = Xs(a, r, t + 1 / 3), this.g = Xs(a, r, t), this.b = Xs(a, r, t - 1 / 3);
    }
    return Wt.toWorkingColorSpace(this, s), this;
  }
  setStyle(t, e = Fe) {
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
  setColorName(t, e = Fe) {
    const n = Jo[t.toLowerCase()];
    return n !== void 0 ? this.setHex(n, e) : console.warn("THREE.Color: Unknown color " + t), this;
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(t) {
    return this.r = t.r, this.g = t.g, this.b = t.b, this;
  }
  copySRGBToLinear(t) {
    return this.r = ln(t.r), this.g = ln(t.g), this.b = ln(t.b), this;
  }
  copyLinearToSRGB(t) {
    return this.r = ci(t.r), this.g = ci(t.g), this.b = ci(t.b), this;
  }
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  getHex(t = Fe) {
    return Wt.fromWorkingColorSpace(xe.copy(this), t), Math.round(Ft(xe.r * 255, 0, 255)) * 65536 + Math.round(Ft(xe.g * 255, 0, 255)) * 256 + Math.round(Ft(xe.b * 255, 0, 255));
  }
  getHexString(t = Fe) {
    return ("000000" + this.getHex(t).toString(16)).slice(-6);
  }
  getHSL(t, e = Wt.workingColorSpace) {
    Wt.fromWorkingColorSpace(xe.copy(this), e);
    const n = xe.r, s = xe.g, r = xe.b, a = Math.max(n, s, r), o = Math.min(n, s, r);
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
  getRGB(t, e = Wt.workingColorSpace) {
    return Wt.fromWorkingColorSpace(xe.copy(this), e), t.r = xe.r, t.g = xe.g, t.b = xe.b, t;
  }
  getStyle(t = Fe) {
    Wt.fromWorkingColorSpace(xe.copy(this), t);
    const e = xe.r, n = xe.g, s = xe.b;
    return t !== Fe ? `color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})` : `rgb(${Math.round(e * 255)},${Math.round(n * 255)},${Math.round(s * 255)})`;
  }
  offsetHSL(t, e, n) {
    return this.getHSL(_n), this.setHSL(_n.h + t, _n.s + e, _n.l + n);
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
    this.getHSL(_n), t.getHSL(ki);
    const n = Rs(_n.h, ki.h, e), s = Rs(_n.s, ki.s, e), r = Rs(_n.l, ki.l, e);
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
const xe = /* @__PURE__ */ new Xt();
Xt.NAMES = Jo;
let Lc = 0;
class Di extends Hn {
  constructor() {
    super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: Lc++ }), this.uuid = Ci(), this.name = "", this.type = "Material", this.blending = oi, this.side = yn, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = ar, this.blendDst = or, this.blendEquation = Un, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new Xt(0, 0, 0), this.blendAlpha = 0, this.depthFunc = hi, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = xa, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = Gn, this.stencilZFail = Gn, this.stencilZPass = Gn, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
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
    n.uuid = this.uuid, n.type = this.type, this.name !== "" && (n.name = this.name), this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(t).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(t).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(t).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.dispersion !== void 0 && (n.dispersion = this.dispersion), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(t).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(t).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(t).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(t).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(t).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(t).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(t).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(t).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(t).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(t).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(t).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(t).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(t).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(t).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(t).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(t).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(t).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(t).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(t).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(t).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(t).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.shadowSide !== null && (n.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), this.blending !== oi && (n.blending = this.blending), this.side !== yn && (n.side = this.side), this.vertexColors === !0 && (n.vertexColors = !0), this.opacity < 1 && (n.opacity = this.opacity), this.transparent === !0 && (n.transparent = !0), this.blendSrc !== ar && (n.blendSrc = this.blendSrc), this.blendDst !== or && (n.blendDst = this.blendDst), this.blendEquation !== Un && (n.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha), this.depthFunc !== hi && (n.depthFunc = this.depthFunc), this.depthTest === !1 && (n.depthTest = this.depthTest), this.depthWrite === !1 && (n.depthWrite = this.depthWrite), this.colorWrite === !1 && (n.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== xa && (n.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== Gn && (n.stencilFail = this.stencilFail), this.stencilZFail !== Gn && (n.stencilZFail = this.stencilZFail), this.stencilZPass !== Gn && (n.stencilZPass = this.stencilZPass), this.stencilWrite === !0 && (n.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n.rotation = this.rotation), this.polygonOffset === !0 && (n.polygonOffset = !0), this.polygonOffsetFactor !== 0 && (n.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n.linewidth = this.linewidth), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.dithering === !0 && (n.dithering = !0), this.alphaTest > 0 && (n.alphaTest = this.alphaTest), this.alphaHash === !0 && (n.alphaHash = !0), this.alphaToCoverage === !0 && (n.alphaToCoverage = !0), this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0), this.forceSinglePass === !0 && (n.forceSinglePass = !0), this.wireframe === !0 && (n.wireframe = !0), this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === !0 && (n.flatShading = !0), this.visible === !1 && (n.visible = !1), this.toneMapped === !1 && (n.toneMapped = !1), this.fog === !1 && (n.fog = !1), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
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
class na extends Di {
  constructor(t) {
    super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new Xt(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new hn(), this.combine = Fo, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.specularMap = t.specularMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.combine = t.combine, this.reflectivity = t.reflectivity, this.refractionRatio = t.refractionRatio, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.fog = t.fog, this;
  }
}
const le = /* @__PURE__ */ new I(), Wi = /* @__PURE__ */ new Dt();
class _e {
  constructor(t, e, n = !1) {
    if (Array.isArray(t))
      throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = !0, this.name = "", this.array = t, this.itemSize = e, this.count = t !== void 0 ? t.length / e : 0, this.normalized = n, this.usage = an, this.updateRanges = [], this.gpuType = rn, this.version = 0;
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
        Wi.fromBufferAttribute(this, e), Wi.applyMatrix3(t), this.setXY(e, Wi.x, Wi.y);
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
    return this.normalized && (n = xi(n, this.array)), n;
  }
  setComponent(t, e, n) {
    return this.normalized && (n = Te(n, this.array)), this.array[t * this.itemSize + e] = n, this;
  }
  getX(t) {
    let e = this.array[t * this.itemSize];
    return this.normalized && (e = xi(e, this.array)), e;
  }
  setX(t, e) {
    return this.normalized && (e = Te(e, this.array)), this.array[t * this.itemSize] = e, this;
  }
  getY(t) {
    let e = this.array[t * this.itemSize + 1];
    return this.normalized && (e = xi(e, this.array)), e;
  }
  setY(t, e) {
    return this.normalized && (e = Te(e, this.array)), this.array[t * this.itemSize + 1] = e, this;
  }
  getZ(t) {
    let e = this.array[t * this.itemSize + 2];
    return this.normalized && (e = xi(e, this.array)), e;
  }
  setZ(t, e) {
    return this.normalized && (e = Te(e, this.array)), this.array[t * this.itemSize + 2] = e, this;
  }
  getW(t) {
    let e = this.array[t * this.itemSize + 3];
    return this.normalized && (e = xi(e, this.array)), e;
  }
  setW(t, e) {
    return this.normalized && (e = Te(e, this.array)), this.array[t * this.itemSize + 3] = e, this;
  }
  setXY(t, e, n) {
    return t *= this.itemSize, this.normalized && (e = Te(e, this.array), n = Te(n, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this;
  }
  setXYZ(t, e, n, s) {
    return t *= this.itemSize, this.normalized && (e = Te(e, this.array), n = Te(n, this.array), s = Te(s, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = s, this;
  }
  setXYZW(t, e, n, s, r) {
    return t *= this.itemSize, this.normalized && (e = Te(e, this.array), n = Te(n, this.array), s = Te(s, this.array), r = Te(r, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = s, this.array[t + 3] = r, this;
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
    return this.name !== "" && (t.name = this.name), this.usage !== an && (t.usage = this.usage), t;
  }
}
class Qo extends _e {
  constructor(t, e, n) {
    super(new Uint16Array(t), e, n);
  }
}
class tl extends _e {
  constructor(t, e, n) {
    super(new Uint32Array(t), e, n);
  }
}
class Be extends _e {
  constructor(t, e, n) {
    super(new Float32Array(t), e, n);
  }
}
let Uc = 0;
const Ne = /* @__PURE__ */ new ee(), Ys = /* @__PURE__ */ new pe(), Jn = /* @__PURE__ */ new I(), Pe = /* @__PURE__ */ new Pi(), yi = /* @__PURE__ */ new Pi(), de = /* @__PURE__ */ new I();
class ze extends Hn {
  constructor() {
    super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: Uc++ }), this.uuid = Ci(), this.name = "", this.type = "BufferGeometry", this.index = null, this.indirect = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
  }
  getIndex() {
    return this.index;
  }
  setIndex(t) {
    return Array.isArray(t) ? this.index = new (Zo(t) ? tl : Qo)(t, 1) : this.index = t, this;
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
      const r = new Pt().getNormalMatrix(t);
      n.applyNormalMatrix(r), n.needsUpdate = !0;
    }
    const s = this.attributes.tangent;
    return s !== void 0 && (s.transformDirection(t), s.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }
  applyQuaternion(t) {
    return Ne.makeRotationFromQuaternion(t), this.applyMatrix4(Ne), this;
  }
  rotateX(t) {
    return Ne.makeRotationX(t), this.applyMatrix4(Ne), this;
  }
  rotateY(t) {
    return Ne.makeRotationY(t), this.applyMatrix4(Ne), this;
  }
  rotateZ(t) {
    return Ne.makeRotationZ(t), this.applyMatrix4(Ne), this;
  }
  translate(t, e, n) {
    return Ne.makeTranslation(t, e, n), this.applyMatrix4(Ne), this;
  }
  scale(t, e, n) {
    return Ne.makeScale(t, e, n), this.applyMatrix4(Ne), this;
  }
  lookAt(t) {
    return Ys.lookAt(t), Ys.updateMatrix(), this.applyMatrix4(Ys.matrix), this;
  }
  center() {
    return this.computeBoundingBox(), this.boundingBox.getCenter(Jn).negate(), this.translate(Jn.x, Jn.y, Jn.z), this;
  }
  setFromPoints(t) {
    const e = this.getAttribute("position");
    if (e === void 0) {
      const n = [];
      for (let s = 0, r = t.length; s < r; s++) {
        const a = t[s];
        n.push(a.x, a.y, a.z || 0);
      }
      this.setAttribute("position", new Be(n, 3));
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
    this.boundingBox === null && (this.boundingBox = new Pi());
    const t = this.attributes.position, e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(
        new I(-1 / 0, -1 / 0, -1 / 0),
        new I(1 / 0, 1 / 0, 1 / 0)
      );
      return;
    }
    if (t !== void 0) {
      if (this.boundingBox.setFromBufferAttribute(t), e)
        for (let n = 0, s = e.length; n < s; n++) {
          const r = e[n];
          Pe.setFromBufferAttribute(r), this.morphTargetsRelative ? (de.addVectors(this.boundingBox.min, Pe.min), this.boundingBox.expandByPoint(de), de.addVectors(this.boundingBox.max, Pe.max), this.boundingBox.expandByPoint(de)) : (this.boundingBox.expandByPoint(Pe.min), this.boundingBox.expandByPoint(Pe.max));
        }
    } else
      this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new Ss());
    const t = this.attributes.position, e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new I(), 1 / 0);
      return;
    }
    if (t) {
      const n = this.boundingSphere.center;
      if (Pe.setFromBufferAttribute(t), e)
        for (let r = 0, a = e.length; r < a; r++) {
          const o = e[r];
          yi.setFromBufferAttribute(o), this.morphTargetsRelative ? (de.addVectors(Pe.min, yi.min), Pe.expandByPoint(de), de.addVectors(Pe.max, yi.max), Pe.expandByPoint(de)) : (Pe.expandByPoint(yi.min), Pe.expandByPoint(yi.max));
        }
      Pe.getCenter(n);
      let s = 0;
      for (let r = 0, a = t.count; r < a; r++)
        de.fromBufferAttribute(t, r), s = Math.max(s, n.distanceToSquared(de));
      if (e)
        for (let r = 0, a = e.length; r < a; r++) {
          const o = e[r], l = this.morphTargetsRelative;
          for (let c = 0, h = o.count; c < h; c++)
            de.fromBufferAttribute(o, c), l && (Jn.fromBufferAttribute(t, c), de.add(Jn)), s = Math.max(s, n.distanceToSquared(de));
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
    this.hasAttribute("tangent") === !1 && this.setAttribute("tangent", new _e(new Float32Array(4 * n.count), 4));
    const a = this.getAttribute("tangent"), o = [], l = [];
    for (let N = 0; N < n.count; N++)
      o[N] = new I(), l[N] = new I();
    const c = new I(), h = new I(), d = new I(), f = new Dt(), m = new Dt(), g = new Dt(), x = new I(), p = new I();
    function u(N, S, M) {
      c.fromBufferAttribute(n, N), h.fromBufferAttribute(n, S), d.fromBufferAttribute(n, M), f.fromBufferAttribute(r, N), m.fromBufferAttribute(r, S), g.fromBufferAttribute(r, M), h.sub(c), d.sub(c), m.sub(f), g.sub(f);
      const C = 1 / (m.x * g.y - g.x * m.y);
      isFinite(C) && (x.copy(h).multiplyScalar(g.y).addScaledVector(d, -m.y).multiplyScalar(C), p.copy(d).multiplyScalar(m.x).addScaledVector(h, -g.x).multiplyScalar(C), o[N].add(x), o[S].add(x), o[M].add(x), l[N].add(p), l[S].add(p), l[M].add(p));
    }
    let b = this.groups;
    b.length === 0 && (b = [{
      start: 0,
      count: t.count
    }]);
    for (let N = 0, S = b.length; N < S; ++N) {
      const M = b[N], C = M.start, k = M.count;
      for (let z = C, X = C + k; z < X; z += 3)
        u(
          t.getX(z + 0),
          t.getX(z + 1),
          t.getX(z + 2)
        );
    }
    const T = new I(), E = new I(), U = new I(), w = new I();
    function R(N) {
      U.fromBufferAttribute(s, N), w.copy(U);
      const S = o[N];
      T.copy(S), T.sub(U.multiplyScalar(U.dot(S))).normalize(), E.crossVectors(w, S);
      const C = E.dot(l[N]) < 0 ? -1 : 1;
      a.setXYZW(N, T.x, T.y, T.z, C);
    }
    for (let N = 0, S = b.length; N < S; ++N) {
      const M = b[N], C = M.start, k = M.count;
      for (let z = C, X = C + k; z < X; z += 3)
        R(t.getX(z + 0)), R(t.getX(z + 1)), R(t.getX(z + 2));
    }
  }
  computeVertexNormals() {
    const t = this.index, e = this.getAttribute("position");
    if (e !== void 0) {
      let n = this.getAttribute("normal");
      if (n === void 0)
        n = new _e(new Float32Array(e.count * 3), 3), this.setAttribute("normal", n);
      else
        for (let f = 0, m = n.count; f < m; f++)
          n.setXYZ(f, 0, 0, 0);
      const s = new I(), r = new I(), a = new I(), o = new I(), l = new I(), c = new I(), h = new I(), d = new I();
      if (t)
        for (let f = 0, m = t.count; f < m; f += 3) {
          const g = t.getX(f + 0), x = t.getX(f + 1), p = t.getX(f + 2);
          s.fromBufferAttribute(e, g), r.fromBufferAttribute(e, x), a.fromBufferAttribute(e, p), h.subVectors(a, r), d.subVectors(s, r), h.cross(d), o.fromBufferAttribute(n, g), l.fromBufferAttribute(n, x), c.fromBufferAttribute(n, p), o.add(h), l.add(h), c.add(h), n.setXYZ(g, o.x, o.y, o.z), n.setXYZ(x, l.x, l.y, l.z), n.setXYZ(p, c.x, c.y, c.z);
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
      let m = 0, g = 0;
      for (let x = 0, p = l.length; x < p; x++) {
        o.isInterleavedBufferAttribute ? m = l[x] * o.data.stride + o.offset : m = l[x] * h;
        for (let u = 0; u < h; u++)
          f[g++] = c[m++];
      }
      return new _e(f, h, d);
    }
    if (this.index === null)
      return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
    const e = new ze(), n = this.index.array, s = this.attributes;
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
const La = /* @__PURE__ */ new ee(), Rn = /* @__PURE__ */ new Es(), Xi = /* @__PURE__ */ new Ss(), Ua = /* @__PURE__ */ new I(), Yi = /* @__PURE__ */ new I(), qi = /* @__PURE__ */ new I(), ji = /* @__PURE__ */ new I(), qs = /* @__PURE__ */ new I(), Zi = /* @__PURE__ */ new I(), Ia = /* @__PURE__ */ new I(), Ki = /* @__PURE__ */ new I();
class De extends pe {
  constructor(t = new ze(), e = new na()) {
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
      Zi.set(0, 0, 0);
      for (let l = 0, c = r.length; l < c; l++) {
        const h = o[l], d = r[l];
        h !== 0 && (qs.fromBufferAttribute(d, t), a ? Zi.addScaledVector(qs, h) : Zi.addScaledVector(qs.sub(e), h));
      }
      e.add(Zi);
    }
    return e;
  }
  raycast(t, e) {
    const n = this.geometry, s = this.material, r = this.matrixWorld;
    s !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), Xi.copy(n.boundingSphere), Xi.applyMatrix4(r), Rn.copy(t.ray).recast(t.near), !(Xi.containsPoint(Rn.origin) === !1 && (Rn.intersectSphere(Xi, Ua) === null || Rn.origin.distanceToSquared(Ua) > (t.far - t.near) ** 2)) && (La.copy(r).invert(), Rn.copy(t.ray).applyMatrix4(La), !(n.boundingBox !== null && Rn.intersectsBox(n.boundingBox) === !1) && this._computeIntersections(t, e, Rn)));
  }
  _computeIntersections(t, e, n) {
    let s;
    const r = this.geometry, a = this.material, o = r.index, l = r.attributes.position, c = r.attributes.uv, h = r.attributes.uv1, d = r.attributes.normal, f = r.groups, m = r.drawRange;
    if (o !== null)
      if (Array.isArray(a))
        for (let g = 0, x = f.length; g < x; g++) {
          const p = f[g], u = a[p.materialIndex], b = Math.max(p.start, m.start), T = Math.min(o.count, Math.min(p.start + p.count, m.start + m.count));
          for (let E = b, U = T; E < U; E += 3) {
            const w = o.getX(E), R = o.getX(E + 1), N = o.getX(E + 2);
            s = $i(this, u, t, n, c, h, d, w, R, N), s && (s.faceIndex = Math.floor(E / 3), s.face.materialIndex = p.materialIndex, e.push(s));
          }
        }
      else {
        const g = Math.max(0, m.start), x = Math.min(o.count, m.start + m.count);
        for (let p = g, u = x; p < u; p += 3) {
          const b = o.getX(p), T = o.getX(p + 1), E = o.getX(p + 2);
          s = $i(this, a, t, n, c, h, d, b, T, E), s && (s.faceIndex = Math.floor(p / 3), e.push(s));
        }
      }
    else if (l !== void 0)
      if (Array.isArray(a))
        for (let g = 0, x = f.length; g < x; g++) {
          const p = f[g], u = a[p.materialIndex], b = Math.max(p.start, m.start), T = Math.min(l.count, Math.min(p.start + p.count, m.start + m.count));
          for (let E = b, U = T; E < U; E += 3) {
            const w = E, R = E + 1, N = E + 2;
            s = $i(this, u, t, n, c, h, d, w, R, N), s && (s.faceIndex = Math.floor(E / 3), s.face.materialIndex = p.materialIndex, e.push(s));
          }
        }
      else {
        const g = Math.max(0, m.start), x = Math.min(l.count, m.start + m.count);
        for (let p = g, u = x; p < u; p += 3) {
          const b = p, T = p + 1, E = p + 2;
          s = $i(this, a, t, n, c, h, d, b, T, E), s && (s.faceIndex = Math.floor(p / 3), e.push(s));
        }
      }
  }
}
function Ic(i, t, e, n, s, r, a, o) {
  let l;
  if (t.side === Ae ? l = n.intersectTriangle(a, r, s, !0, o) : l = n.intersectTriangle(s, r, a, t.side === yn, o), l === null) return null;
  Ki.copy(o), Ki.applyMatrix4(i.matrixWorld);
  const c = e.ray.origin.distanceTo(Ki);
  return c < e.near || c > e.far ? null : {
    distance: c,
    point: Ki.clone(),
    object: i
  };
}
function $i(i, t, e, n, s, r, a, o, l, c) {
  i.getVertexPosition(o, Yi), i.getVertexPosition(l, qi), i.getVertexPosition(c, ji);
  const h = Ic(i, t, e, n, Yi, qi, ji, Ia);
  if (h) {
    const d = new I();
    Xe.getBarycoord(Ia, Yi, qi, ji, d), s && (h.uv = Xe.getInterpolatedAttribute(s, o, l, c, d, new Dt())), r && (h.uv1 = Xe.getInterpolatedAttribute(r, o, l, c, d, new Dt())), a && (h.normal = Xe.getInterpolatedAttribute(a, o, l, c, d, new I()), h.normal.dot(n.direction) > 0 && h.normal.multiplyScalar(-1));
    const f = {
      a: o,
      b: l,
      c,
      normal: new I(),
      materialIndex: 0
    };
    Xe.getNormal(Yi, qi, ji, f.normal), h.face = f, h.barycoord = d;
  }
  return h;
}
class Li extends ze {
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
    g("z", "y", "x", -1, -1, n, e, t, a, r, 0), g("z", "y", "x", 1, -1, n, e, -t, a, r, 1), g("x", "z", "y", 1, 1, t, n, e, s, a, 2), g("x", "z", "y", 1, -1, t, n, -e, s, a, 3), g("x", "y", "z", 1, -1, t, e, n, s, r, 4), g("x", "y", "z", -1, -1, t, e, -n, s, r, 5), this.setIndex(l), this.setAttribute("position", new Be(c, 3)), this.setAttribute("normal", new Be(h, 3)), this.setAttribute("uv", new Be(d, 2));
    function g(x, p, u, b, T, E, U, w, R, N, S) {
      const M = E / R, C = U / N, k = E / 2, z = U / 2, X = w / 2, K = R + 1, G = N + 1;
      let Q = 0, V = 0;
      const st = new I();
      for (let ht = 0; ht < G; ht++) {
        const xt = ht * C - z;
        for (let It = 0; It < K; It++) {
          const $t = It * M - k;
          st[x] = $t * b, st[p] = xt * T, st[u] = X, c.push(st.x, st.y, st.z), st[x] = 0, st[p] = 0, st[u] = w > 0 ? 1 : -1, h.push(st.x, st.y, st.z), d.push(It / R), d.push(1 - ht / N), Q += 1;
        }
      }
      for (let ht = 0; ht < N; ht++)
        for (let xt = 0; xt < R; xt++) {
          const It = f + xt + K * ht, $t = f + xt + K * (ht + 1), Y = f + (xt + 1) + K * (ht + 1), tt = f + (xt + 1) + K * ht;
          l.push(It, $t, tt), l.push($t, Y, tt), V += 6;
        }
      o.addGroup(m, V, S), m += V, f += Q;
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new Li(t.width, t.height, t.depth, t.widthSegments, t.heightSegments, t.depthSegments);
  }
}
function _i(i) {
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
function Ee(i) {
  const t = {};
  for (let e = 0; e < i.length; e++) {
    const n = _i(i[e]);
    for (const s in n)
      t[s] = n[s];
  }
  return t;
}
function Nc(i) {
  const t = [];
  for (let e = 0; e < i.length; e++)
    t.push(i[e].clone());
  return t;
}
function el(i) {
  const t = i.getRenderTarget();
  return t === null ? i.outputColorSpace : t.isXRRenderTarget === !0 ? t.texture.colorSpace : Wt.workingColorSpace;
}
const Fc = { clone: _i, merge: Ee };
var Oc = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, Bc = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class un extends Di {
  constructor(t) {
    super(), this.isShaderMaterial = !0, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = Oc, this.fragmentShader = Bc, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
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
    return super.copy(t), this.fragmentShader = t.fragmentShader, this.vertexShader = t.vertexShader, this.uniforms = _i(t.uniforms), this.uniformsGroups = Nc(t.uniformsGroups), this.defines = Object.assign({}, t.defines), this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.fog = t.fog, this.lights = t.lights, this.clipping = t.clipping, this.extensions = Object.assign({}, t.extensions), this.glslVersion = t.glslVersion, this;
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
class nl extends pe {
  constructor() {
    super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new ee(), this.projectionMatrix = new ee(), this.projectionMatrixInverse = new ee(), this.coordinateSystem = on;
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
const gn = /* @__PURE__ */ new I(), Na = /* @__PURE__ */ new Dt(), Fa = /* @__PURE__ */ new Dt();
class Oe extends nl {
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
    this.fov = Xr * 2 * Math.atan(e), this.updateProjectionMatrix();
  }
  /**
   * Calculates the focal length from the current .fov and .filmGauge.
   *
   * @returns {number}
   */
  getFocalLength() {
    const t = Math.tan(us * 0.5 * this.fov);
    return 0.5 * this.getFilmHeight() / t;
  }
  getEffectiveFOV() {
    return Xr * 2 * Math.atan(
      Math.tan(us * 0.5 * this.fov) / this.zoom
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
    gn.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), e.set(gn.x, gn.y).multiplyScalar(-t / gn.z), gn.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), n.set(gn.x, gn.y).multiplyScalar(-t / gn.z);
  }
  /**
   * Computes the width and height of the camera's viewable rectangle at a given distance along the viewing direction.
   *
   * @param {number} distance
   * @param {Vector2} target - Vector2 target used to store result where x is width and y is height.
   * @returns {Vector2}
   */
  getViewSize(t, e) {
    return this.getViewBounds(t, Na, Fa), e.subVectors(Fa, Na);
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
    let e = t * Math.tan(us * 0.5 * this.fov) / this.zoom, n = 2 * e, s = this.aspect * n, r = -0.5 * s;
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
const Qn = -90, ti = 1;
class zc extends pe {
  constructor(t, e, n) {
    super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
    const s = new Oe(Qn, ti, t, e);
    s.layers = this.layers, this.add(s);
    const r = new Oe(Qn, ti, t, e);
    r.layers = this.layers, this.add(r);
    const a = new Oe(Qn, ti, t, e);
    a.layers = this.layers, this.add(a);
    const o = new Oe(Qn, ti, t, e);
    o.layers = this.layers, this.add(o);
    const l = new Oe(Qn, ti, t, e);
    l.layers = this.layers, this.add(l);
    const c = new Oe(Qn, ti, t, e);
    c.layers = this.layers, this.add(c);
  }
  updateCoordinateSystem() {
    const t = this.coordinateSystem, e = this.children.concat(), [n, s, r, a, o, l] = e;
    for (const c of e) this.remove(c);
    if (t === on)
      n.up.set(0, 1, 0), n.lookAt(1, 0, 0), s.up.set(0, 1, 0), s.lookAt(-1, 0, 0), r.up.set(0, 0, -1), r.lookAt(0, 1, 0), a.up.set(0, 0, 1), a.lookAt(0, -1, 0), o.up.set(0, 1, 0), o.lookAt(0, 0, 1), l.up.set(0, 1, 0), l.lookAt(0, 0, -1);
    else if (t === ms)
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
    const [r, a, o, l, c, h] = this.children, d = t.getRenderTarget(), f = t.getActiveCubeFace(), m = t.getActiveMipmapLevel(), g = t.xr.enabled;
    t.xr.enabled = !1;
    const x = n.texture.generateMipmaps;
    n.texture.generateMipmaps = !1, t.setRenderTarget(n, 0, s), t.render(e, r), t.setRenderTarget(n, 1, s), t.render(e, a), t.setRenderTarget(n, 2, s), t.render(e, o), t.setRenderTarget(n, 3, s), t.render(e, l), t.setRenderTarget(n, 4, s), t.render(e, c), n.texture.generateMipmaps = x, t.setRenderTarget(n, 5, s), t.render(e, h), t.setRenderTarget(d, f, m), t.xr.enabled = g, n.texture.needsPMREMUpdate = !0;
  }
}
class il extends we {
  constructor(t, e, n, s, r, a, o, l, c, h) {
    t = t !== void 0 ? t : [], e = e !== void 0 ? e : ui, super(t, e, n, s, r, a, o, l, c, h), this.isCubeTexture = !0, this.flipY = !1;
  }
  get images() {
    return this.image;
  }
  set images(t) {
    this.image = t;
  }
}
class Hc extends Bn {
  constructor(t = 1, e = {}) {
    super(t, t, e), this.isWebGLCubeRenderTarget = !0;
    const n = { width: t, height: t, depth: 1 }, s = [n, n, n, n, n, n];
    this.texture = new il(s, e.mapping, e.wrapS, e.wrapT, e.magFilter, e.minFilter, e.format, e.type, e.anisotropy, e.colorSpace), this.texture.isRenderTargetTexture = !0, this.texture.generateMipmaps = e.generateMipmaps !== void 0 ? e.generateMipmaps : !1, this.texture.minFilter = e.minFilter !== void 0 ? e.minFilter : Ze;
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
    }, s = new Li(5, 5, 5), r = new un({
      name: "CubemapFromEquirect",
      uniforms: _i(n.uniforms),
      vertexShader: n.vertexShader,
      fragmentShader: n.fragmentShader,
      side: Ae,
      blending: Sn
    });
    r.uniforms.tEquirect.value = e;
    const a = new De(s, r), o = e.minFilter;
    return e.minFilter === Fn && (e.minFilter = Ze), new zc(1, 10, this).update(t, a), e.minFilter = o, a.geometry.dispose(), a.material.dispose(), this;
  }
  clear(t, e, n, s) {
    const r = t.getRenderTarget();
    for (let a = 0; a < 6; a++)
      t.setRenderTarget(this, a), t.clear(e, n, s);
    t.setRenderTarget(r);
  }
}
class Vc extends pe {
  constructor() {
    super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new hn(), this.environmentIntensity = 1, this.environmentRotation = new hn(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  copy(t, e) {
    return super.copy(t, e), t.background !== null && (this.background = t.background.clone()), t.environment !== null && (this.environment = t.environment.clone()), t.fog !== null && (this.fog = t.fog.clone()), this.backgroundBlurriness = t.backgroundBlurriness, this.backgroundIntensity = t.backgroundIntensity, this.backgroundRotation.copy(t.backgroundRotation), this.environmentIntensity = t.environmentIntensity, this.environmentRotation.copy(t.environmentRotation), t.overrideMaterial !== null && (this.overrideMaterial = t.overrideMaterial.clone()), this.matrixAutoUpdate = t.matrixAutoUpdate, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return this.fog !== null && (e.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (e.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (e.object.backgroundIntensity = this.backgroundIntensity), e.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (e.object.environmentIntensity = this.environmentIntensity), e.object.environmentRotation = this.environmentRotation.toArray(), e;
  }
}
class Me extends _e {
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
const js = /* @__PURE__ */ new I(), Gc = /* @__PURE__ */ new I(), kc = /* @__PURE__ */ new Pt();
class xn {
  constructor(t = new I(1, 0, 0), e = 0) {
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
    const s = js.subVectors(n, e).cross(Gc.subVectors(t, e)).normalize();
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
    const n = t.delta(js), s = this.normal.dot(n);
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
    const n = e || kc.getNormalMatrix(t), s = this.coplanarPoint(js).applyMatrix4(t), r = this.normal.applyMatrix3(n).normalize();
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
const Cn = /* @__PURE__ */ new Ss(), Ji = /* @__PURE__ */ new I();
class ia {
  constructor(t = new xn(), e = new xn(), n = new xn(), s = new xn(), r = new xn(), a = new xn()) {
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
  setFromProjectionMatrix(t, e = on) {
    const n = this.planes, s = t.elements, r = s[0], a = s[1], o = s[2], l = s[3], c = s[4], h = s[5], d = s[6], f = s[7], m = s[8], g = s[9], x = s[10], p = s[11], u = s[12], b = s[13], T = s[14], E = s[15];
    if (n[0].setComponents(l - r, f - c, p - m, E - u).normalize(), n[1].setComponents(l + r, f + c, p + m, E + u).normalize(), n[2].setComponents(l + a, f + h, p + g, E + b).normalize(), n[3].setComponents(l - a, f - h, p - g, E - b).normalize(), n[4].setComponents(l - o, f - d, p - x, E - T).normalize(), e === on)
      n[5].setComponents(l + o, f + d, p + x, E + T).normalize();
    else if (e === ms)
      n[5].setComponents(o, d, x, T).normalize();
    else
      throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + e);
    return this;
  }
  intersectsObject(t) {
    if (t.boundingSphere !== void 0)
      t.boundingSphere === null && t.computeBoundingSphere(), Cn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);
    else {
      const e = t.geometry;
      e.boundingSphere === null && e.computeBoundingSphere(), Cn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld);
    }
    return this.intersectsSphere(Cn);
  }
  intersectsSprite(t) {
    return Cn.center.set(0, 0, 0), Cn.radius = 0.7071067811865476, Cn.applyMatrix4(t.matrixWorld), this.intersectsSphere(Cn);
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
      if (Ji.x = s.normal.x > 0 ? t.max.x : t.min.x, Ji.y = s.normal.y > 0 ? t.max.y : t.min.y, Ji.z = s.normal.z > 0 ? t.max.z : t.min.z, s.distanceToPoint(Ji) < 0)
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
class sa extends Di {
  constructor(t) {
    super(), this.isLineBasicMaterial = !0, this.type = "LineBasicMaterial", this.color = new Xt(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.linewidth = t.linewidth, this.linecap = t.linecap, this.linejoin = t.linejoin, this.fog = t.fog, this;
  }
}
const gs = /* @__PURE__ */ new I(), vs = /* @__PURE__ */ new I(), Oa = /* @__PURE__ */ new ee(), Ti = /* @__PURE__ */ new Es(), Qi = /* @__PURE__ */ new Ss(), Zs = /* @__PURE__ */ new I(), Ba = /* @__PURE__ */ new I();
class Yr extends pe {
  constructor(t = new ze(), e = new sa()) {
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
        gs.fromBufferAttribute(e, s - 1), vs.fromBufferAttribute(e, s), n[s] = n[s - 1], n[s] += gs.distanceTo(vs);
      t.setAttribute("lineDistance", new Be(n, 1));
    } else
      console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
  raycast(t, e) {
    const n = this.geometry, s = this.matrixWorld, r = t.params.Line.threshold, a = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), Qi.copy(n.boundingSphere), Qi.applyMatrix4(s), Qi.radius += r, t.ray.intersectsSphere(Qi) === !1) return;
    Oa.copy(s).invert(), Ti.copy(t.ray).applyMatrix4(Oa);
    const o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = o * o, c = this.isLineSegments ? 2 : 1, h = n.index, f = n.attributes.position;
    if (h !== null) {
      const m = Math.max(0, a.start), g = Math.min(h.count, a.start + a.count);
      for (let x = m, p = g - 1; x < p; x += c) {
        const u = h.getX(x), b = h.getX(x + 1), T = ts(this, t, Ti, l, u, b);
        T && e.push(T);
      }
      if (this.isLineLoop) {
        const x = h.getX(g - 1), p = h.getX(m), u = ts(this, t, Ti, l, x, p);
        u && e.push(u);
      }
    } else {
      const m = Math.max(0, a.start), g = Math.min(f.count, a.start + a.count);
      for (let x = m, p = g - 1; x < p; x += c) {
        const u = ts(this, t, Ti, l, x, x + 1);
        u && e.push(u);
      }
      if (this.isLineLoop) {
        const x = ts(this, t, Ti, l, g - 1, m);
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
function ts(i, t, e, n, s, r) {
  const a = i.geometry.attributes.position;
  if (gs.fromBufferAttribute(a, s), vs.fromBufferAttribute(a, r), e.distanceSqToSegment(gs, vs, Zs, Ba) > n) return;
  Zs.applyMatrix4(i.matrixWorld);
  const l = t.ray.origin.distanceTo(Zs);
  if (!(l < t.near || l > t.far))
    return {
      distance: l,
      // What do we want? intersection point on the ray or on the segment??
      // point: raycaster.ray.at( distance ),
      point: Ba.clone().applyMatrix4(i.matrixWorld),
      index: s,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: i
    };
}
const za = /* @__PURE__ */ new I(), Ha = /* @__PURE__ */ new I();
class Wc extends Yr {
  constructor(t, e) {
    super(t, e), this.isLineSegments = !0, this.type = "LineSegments";
  }
  computeLineDistances() {
    const t = this.geometry;
    if (t.index === null) {
      const e = t.attributes.position, n = [];
      for (let s = 0, r = e.count; s < r; s += 2)
        za.fromBufferAttribute(e, s), Ha.fromBufferAttribute(e, s + 1), n[s] = s === 0 ? 0 : n[s - 1], n[s + 1] = n[s] + za.distanceTo(Ha);
      t.setAttribute("lineDistance", new Be(n, 1));
    } else
      console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
}
class bi extends pe {
  constructor() {
    super(), this.isGroup = !0, this.type = "Group";
  }
}
class sl extends we {
  constructor(t, e, n, s, r, a, o, l, c, h = li) {
    if (h !== li && h !== pi)
      throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    n === void 0 && h === li && (n = On), n === void 0 && h === pi && (n = fi), super(null, s, r, a, o, l, h, n, c), this.isDepthTexture = !0, this.image = { width: t, height: e }, this.magFilter = o !== void 0 ? o : qe, this.minFilter = l !== void 0 ? l : qe, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null;
  }
  copy(t) {
    return super.copy(t), this.compareFunction = t.compareFunction, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return this.compareFunction !== null && (e.compareFunction = this.compareFunction), e;
  }
}
class ys extends ze {
  constructor(t = 1, e = 1, n = 1, s = 1) {
    super(), this.type = "PlaneGeometry", this.parameters = {
      width: t,
      height: e,
      widthSegments: n,
      heightSegments: s
    };
    const r = t / 2, a = e / 2, o = Math.floor(n), l = Math.floor(s), c = o + 1, h = l + 1, d = t / o, f = e / l, m = [], g = [], x = [], p = [];
    for (let u = 0; u < h; u++) {
      const b = u * f - a;
      for (let T = 0; T < c; T++) {
        const E = T * d - r;
        g.push(E, -b, 0), x.push(0, 0, 1), p.push(T / o), p.push(1 - u / l);
      }
    }
    for (let u = 0; u < l; u++)
      for (let b = 0; b < o; b++) {
        const T = b + c * u, E = b + c * (u + 1), U = b + 1 + c * (u + 1), w = b + 1 + c * u;
        m.push(T, E, w), m.push(E, U, w);
      }
    this.setIndex(m), this.setAttribute("position", new Be(g, 3)), this.setAttribute("normal", new Be(x, 3)), this.setAttribute("uv", new Be(p, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new ys(t.width, t.height, t.widthSegments, t.heightSegments);
  }
}
class ra extends ze {
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
    const h = [], d = new I(), f = new I(), m = [], g = [], x = [], p = [];
    for (let u = 0; u <= n; u++) {
      const b = [], T = u / n;
      let E = 0;
      u === 0 && a === 0 ? E = 0.5 / e : u === n && l === Math.PI && (E = -0.5 / e);
      for (let U = 0; U <= e; U++) {
        const w = U / e;
        d.x = -t * Math.cos(s + w * r) * Math.sin(a + T * o), d.y = t * Math.cos(a + T * o), d.z = t * Math.sin(s + w * r) * Math.sin(a + T * o), g.push(d.x, d.y, d.z), f.copy(d).normalize(), x.push(f.x, f.y, f.z), p.push(w + E, 1 - T), b.push(c++);
      }
      h.push(b);
    }
    for (let u = 0; u < n; u++)
      for (let b = 0; b < e; b++) {
        const T = h[u][b + 1], E = h[u][b], U = h[u + 1][b], w = h[u + 1][b + 1];
        (u !== 0 || a > 0) && m.push(T, E, w), (u !== n - 1 || l < Math.PI) && m.push(E, U, w);
      }
    this.setIndex(m), this.setAttribute("position", new Be(g, 3)), this.setAttribute("normal", new Be(x, 3)), this.setAttribute("uv", new Be(p, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  static fromJSON(t) {
    return new ra(t.radius, t.widthSegments, t.heightSegments, t.phiStart, t.phiLength, t.thetaStart, t.thetaLength);
  }
}
class rl extends un {
  constructor(t) {
    super(t), this.isRawShaderMaterial = !0, this.type = "RawShaderMaterial";
  }
}
class Xc extends Di {
  constructor(t) {
    super(), this.isMeshDepthMaterial = !0, this.type = "MeshDepthMaterial", this.depthPacking = nc, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.depthPacking = t.depthPacking, this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this;
  }
}
class Yc extends Di {
  constructor(t) {
    super(), this.isMeshDistanceMaterial = !0, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this;
  }
}
class al extends pe {
  constructor(t, e = 1) {
    super(), this.isLight = !0, this.type = "Light", this.color = new Xt(t), this.intensity = e;
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
class qc extends al {
  constructor(t, e, n) {
    super(t, n), this.isHemisphereLight = !0, this.type = "HemisphereLight", this.position.copy(pe.DEFAULT_UP), this.updateMatrix(), this.groundColor = new Xt(e);
  }
  copy(t, e) {
    return super.copy(t, e), this.groundColor.copy(t.groundColor), this;
  }
}
const Ks = /* @__PURE__ */ new ee(), Va = /* @__PURE__ */ new I(), Ga = /* @__PURE__ */ new I();
class jc {
  constructor(t) {
    this.camera = t, this.intensity = 1, this.bias = 0, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new Dt(512, 512), this.map = null, this.mapPass = null, this.matrix = new ee(), this.autoUpdate = !0, this.needsUpdate = !1, this._frustum = new ia(), this._frameExtents = new Dt(1, 1), this._viewportCount = 1, this._viewports = [
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
    Va.setFromMatrixPosition(t.matrixWorld), e.position.copy(Va), Ga.setFromMatrixPosition(t.target.matrixWorld), e.lookAt(Ga), e.updateMatrixWorld(), Ks.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), this._frustum.setFromProjectionMatrix(Ks), n.set(
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
    ), n.multiply(Ks);
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
class ol extends nl {
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
class Zc extends jc {
  constructor() {
    super(new ol(-5, 5, 5, -5, 0.5, 500)), this.isDirectionalLightShadow = !0;
  }
}
class $s extends al {
  constructor(t, e) {
    super(t, e), this.isDirectionalLight = !0, this.type = "DirectionalLight", this.position.copy(pe.DEFAULT_UP), this.updateMatrix(), this.target = new pe(), this.shadow = new Zc();
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(t) {
    return super.copy(t), this.target = t.target.clone(), this.shadow = t.shadow.clone(), this;
  }
}
class ll extends ze {
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
class Kc extends Oe {
  constructor(t = []) {
    super(), this.isArrayCamera = !0, this.cameras = t;
  }
}
const ka = /* @__PURE__ */ new ee();
class $c {
  constructor(t, e, n = 0, s = 1 / 0) {
    this.ray = new Es(t, e), this.near = n, this.far = s, this.camera = null, this.layers = new ea(), this.params = {
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
    return ka.identity().extractRotation(t.matrixWorld), this.ray.origin.setFromMatrixPosition(t.matrixWorld), this.ray.direction.set(0, 0, -1).applyMatrix4(ka), this;
  }
  intersectObject(t, e = !0, n = []) {
    return qr(t, this, n, e), n.sort(Wa), n;
  }
  intersectObjects(t, e = !0, n = []) {
    for (let s = 0, r = t.length; s < r; s++)
      qr(t[s], this, n, e);
    return n.sort(Wa), n;
  }
}
function Wa(i, t) {
  return i.distance - t.distance;
}
function qr(i, t, e, n) {
  let s = !0;
  if (i.layers.test(t.layers) && i.raycast(t, e) === !1 && (s = !1), s === !0 && n === !0) {
    const r = i.children;
    for (let a = 0, o = r.length; a < o; a++)
      qr(r[a], t, e, !0);
  }
}
class Xa {
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
    return this.phi = Ft(this.phi, 1e-6, Math.PI - 1e-6), this;
  }
  setFromVector3(t) {
    return this.setFromCartesianCoords(t.x, t.y, t.z);
  }
  setFromCartesianCoords(t, e, n) {
    return this.radius = Math.sqrt(t * t + e * e + n * n), this.radius === 0 ? (this.theta = 0, this.phi = 0) : (this.theta = Math.atan2(t, n), this.phi = Math.acos(Ft(e / this.radius, -1, 1))), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class Jc extends Hn {
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
function Ya(i, t, e, n) {
  const s = Qc(n);
  switch (e) {
    // https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage2D.xhtml
    case Vo:
      return i * t;
    case ko:
      return i * t;
    case Wo:
      return i * t * 2;
    case Xo:
      return i * t / s.components * s.byteLength;
    case Jr:
      return i * t / s.components * s.byteLength;
    case Yo:
      return i * t * 2 / s.components * s.byteLength;
    case Qr:
      return i * t * 2 / s.components * s.byteLength;
    case Go:
      return i * t * 3 / s.components * s.byteLength;
    case Ye:
      return i * t * 4 / s.components * s.byteLength;
    case ta:
      return i * t * 4 / s.components * s.byteLength;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_s3tc_srgb/
    case as:
    case os:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case ls:
    case cs:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_pvrtc/
    case Mr:
    case Er:
      return Math.max(i, 16) * Math.max(t, 8) / 4;
    case xr:
    case Sr:
      return Math.max(i, 8) * Math.max(t, 8) / 2;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_etc/
    case yr:
    case Tr:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case br:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_astc/
    case Ar:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case wr:
      return Math.floor((i + 4) / 5) * Math.floor((t + 3) / 4) * 16;
    case Rr:
      return Math.floor((i + 4) / 5) * Math.floor((t + 4) / 5) * 16;
    case Cr:
      return Math.floor((i + 5) / 6) * Math.floor((t + 4) / 5) * 16;
    case Pr:
      return Math.floor((i + 5) / 6) * Math.floor((t + 5) / 6) * 16;
    case Dr:
      return Math.floor((i + 7) / 8) * Math.floor((t + 4) / 5) * 16;
    case Lr:
      return Math.floor((i + 7) / 8) * Math.floor((t + 5) / 6) * 16;
    case Ur:
      return Math.floor((i + 7) / 8) * Math.floor((t + 7) / 8) * 16;
    case Ir:
      return Math.floor((i + 9) / 10) * Math.floor((t + 4) / 5) * 16;
    case Nr:
      return Math.floor((i + 9) / 10) * Math.floor((t + 5) / 6) * 16;
    case Fr:
      return Math.floor((i + 9) / 10) * Math.floor((t + 7) / 8) * 16;
    case Or:
      return Math.floor((i + 9) / 10) * Math.floor((t + 9) / 10) * 16;
    case Br:
      return Math.floor((i + 11) / 12) * Math.floor((t + 9) / 10) * 16;
    case zr:
      return Math.floor((i + 11) / 12) * Math.floor((t + 11) / 12) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_bptc/
    case hs:
    case Hr:
    case Vr:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_rgtc/
    case qo:
    case Gr:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 8;
    case kr:
    case Wr:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 16;
  }
  throw new Error(
    `Unable to determine texture byte length for ${e} format.`
  );
}
function Qc(i) {
  switch (i) {
    case cn:
    case Bo:
      return { byteLength: 1, components: 1 };
    case wi:
    case zo:
    case Ri:
      return { byteLength: 2, components: 1 };
    case Kr:
    case $r:
      return { byteLength: 2, components: 4 };
    case On:
    case Zr:
    case rn:
      return { byteLength: 4, components: 1 };
    case Ho:
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
function cl() {
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
function th(i) {
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
      d.sort((m, g) => m.start - g.start);
      let f = 0;
      for (let m = 1; m < d.length; m++) {
        const g = d[f], x = d[m];
        x.start <= g.start + g.count + 1 ? g.count = Math.max(
          g.count,
          x.start + x.count - g.start
        ) : (++f, d[f] = x);
      }
      d.length = f + 1;
      for (let m = 0, g = d.length; m < g; m++) {
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
var eh = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, nh = `#ifdef USE_ALPHAHASH
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
#endif`, ih = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, sh = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, rh = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`, ah = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, oh = `#ifdef USE_AOMAP
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
#endif`, lh = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, ch = `#ifdef USE_BATCHING
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
#endif`, hh = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`, uh = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, dh = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, fh = `float G_BlinnPhong_Implicit( ) {
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
} // validated`, ph = `#ifdef USE_IRIDESCENCE
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
#endif`, mh = `#ifdef USE_BUMPMAP
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
#endif`, _h = `#if NUM_CLIPPING_PLANES > 0
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
#endif`, gh = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, vh = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, xh = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, Mh = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`, Sh = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`, Eh = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`, yh = `#if defined( USE_COLOR_ALPHA )
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
#endif`, Th = `#define PI 3.141592653589793
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
} // validated`, bh = `#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`, Ah = `vec3 transformedNormal = objectNormal;
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
#endif`, wh = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, Rh = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, Ch = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, Ph = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, Dh = "gl_FragColor = linearToOutputTexel( gl_FragColor );", Lh = `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`, Uh = `#ifdef USE_ENVMAP
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
#endif`, Ih = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`, Nh = `#ifdef USE_ENVMAP
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
#endif`, Fh = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, Oh = `#ifdef USE_ENVMAP
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
#endif`, Bh = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, zh = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, Hh = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, Vh = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, Gh = `#ifdef USE_GRADIENTMAP
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
}`, kh = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, Wh = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, Xh = `varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, Yh = `uniform bool receiveShadow;
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
#endif`, qh = `#ifdef USE_ENVMAP
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
#endif`, jh = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, Zh = `varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, Kh = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, $h = `varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, Jh = `PhysicalMaterial material;
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
#endif`, Qh = `struct PhysicalMaterial {
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
}`, tu = `
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
#endif`, eu = `#if defined( RE_IndirectDiffuse )
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
#endif`, nu = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, iu = `#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, su = `#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, ru = `#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, au = `#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`, ou = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, lu = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, cu = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`, hu = `#if defined( USE_POINTS_UV )
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
#endif`, uu = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, du = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, fu = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`, pu = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, mu = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, _u = `#ifdef USE_MORPHTARGETS
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
#endif`, gu = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, vu = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`, xu = `#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`, Mu = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, Su = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, Eu = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, yu = `#ifdef USE_NORMALMAP
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
#endif`, Tu = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, bu = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, Au = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, wu = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, Ru = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, Cu = `vec3 packNormalToRGB( const in vec3 normal ) {
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
}`, Pu = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, Du = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, Lu = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, Uu = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, Iu = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, Nu = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, Fu = `#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`, Ou = `#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`, Bu = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`, zu = `float getShadowMask() {
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
}`, Hu = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, Vu = `#ifdef USE_SKINNING
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
#endif`, Gu = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, ku = `#ifdef USE_SKINNING
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
#endif`, Wu = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, Xu = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, Yu = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, qu = `#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`, ju = `#ifdef USE_TRANSMISSION
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
#endif`, Zu = `#ifdef USE_TRANSMISSION
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
#endif`, Ku = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`, $u = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`, Ju = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`, Qu = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const td = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, ed = `uniform sampler2D t2D;
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
}`, nd = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, id = `#ifdef ENVMAP_TYPE_CUBE
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
}`, sd = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, rd = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, ad = `#include <common>
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
}`, od = `#if DEPTH_PACKING == 3200
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
}`, ld = `#define DISTANCE
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
}`, cd = `#define DISTANCE
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
}`, hd = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, ud = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, dd = `uniform float scale;
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
}`, fd = `uniform vec3 diffuse;
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
}`, pd = `#include <common>
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
}`, md = `uniform vec3 diffuse;
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
}`, _d = `#define LAMBERT
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
}`, gd = `#define LAMBERT
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
}`, vd = `#define MATCAP
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
}`, xd = `#define MATCAP
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
}`, Md = `#define NORMAL
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
}`, Sd = `#define NORMAL
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
}`, Ed = `#define PHONG
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
}`, yd = `#define PHONG
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
}`, Td = `#define STANDARD
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
}`, bd = `#define STANDARD
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
}`, Ad = `#define TOON
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
}`, wd = `#define TOON
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
}`, Rd = `uniform float size;
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
}`, Cd = `uniform vec3 diffuse;
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
}`, Pd = `#include <common>
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
}`, Dd = `uniform vec3 color;
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
}`, Ld = `uniform float rotation;
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
}`, Ud = `uniform vec3 diffuse;
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
  alphahash_fragment: eh,
  alphahash_pars_fragment: nh,
  alphamap_fragment: ih,
  alphamap_pars_fragment: sh,
  alphatest_fragment: rh,
  alphatest_pars_fragment: ah,
  aomap_fragment: oh,
  aomap_pars_fragment: lh,
  batching_pars_vertex: ch,
  batching_vertex: hh,
  begin_vertex: uh,
  beginnormal_vertex: dh,
  bsdfs: fh,
  iridescence_fragment: ph,
  bumpmap_pars_fragment: mh,
  clipping_planes_fragment: _h,
  clipping_planes_pars_fragment: gh,
  clipping_planes_pars_vertex: vh,
  clipping_planes_vertex: xh,
  color_fragment: Mh,
  color_pars_fragment: Sh,
  color_pars_vertex: Eh,
  color_vertex: yh,
  common: Th,
  cube_uv_reflection_fragment: bh,
  defaultnormal_vertex: Ah,
  displacementmap_pars_vertex: wh,
  displacementmap_vertex: Rh,
  emissivemap_fragment: Ch,
  emissivemap_pars_fragment: Ph,
  colorspace_fragment: Dh,
  colorspace_pars_fragment: Lh,
  envmap_fragment: Uh,
  envmap_common_pars_fragment: Ih,
  envmap_pars_fragment: Nh,
  envmap_pars_vertex: Fh,
  envmap_physical_pars_fragment: qh,
  envmap_vertex: Oh,
  fog_vertex: Bh,
  fog_pars_vertex: zh,
  fog_fragment: Hh,
  fog_pars_fragment: Vh,
  gradientmap_pars_fragment: Gh,
  lightmap_pars_fragment: kh,
  lights_lambert_fragment: Wh,
  lights_lambert_pars_fragment: Xh,
  lights_pars_begin: Yh,
  lights_toon_fragment: jh,
  lights_toon_pars_fragment: Zh,
  lights_phong_fragment: Kh,
  lights_phong_pars_fragment: $h,
  lights_physical_fragment: Jh,
  lights_physical_pars_fragment: Qh,
  lights_fragment_begin: tu,
  lights_fragment_maps: eu,
  lights_fragment_end: nu,
  logdepthbuf_fragment: iu,
  logdepthbuf_pars_fragment: su,
  logdepthbuf_pars_vertex: ru,
  logdepthbuf_vertex: au,
  map_fragment: ou,
  map_pars_fragment: lu,
  map_particle_fragment: cu,
  map_particle_pars_fragment: hu,
  metalnessmap_fragment: uu,
  metalnessmap_pars_fragment: du,
  morphinstance_vertex: fu,
  morphcolor_vertex: pu,
  morphnormal_vertex: mu,
  morphtarget_pars_vertex: _u,
  morphtarget_vertex: gu,
  normal_fragment_begin: vu,
  normal_fragment_maps: xu,
  normal_pars_fragment: Mu,
  normal_pars_vertex: Su,
  normal_vertex: Eu,
  normalmap_pars_fragment: yu,
  clearcoat_normal_fragment_begin: Tu,
  clearcoat_normal_fragment_maps: bu,
  clearcoat_pars_fragment: Au,
  iridescence_pars_fragment: wu,
  opaque_fragment: Ru,
  packing: Cu,
  premultiplied_alpha_fragment: Pu,
  project_vertex: Du,
  dithering_fragment: Lu,
  dithering_pars_fragment: Uu,
  roughnessmap_fragment: Iu,
  roughnessmap_pars_fragment: Nu,
  shadowmap_pars_fragment: Fu,
  shadowmap_pars_vertex: Ou,
  shadowmap_vertex: Bu,
  shadowmask_pars_fragment: zu,
  skinbase_vertex: Hu,
  skinning_pars_vertex: Vu,
  skinning_vertex: Gu,
  skinnormal_vertex: ku,
  specularmap_fragment: Wu,
  specularmap_pars_fragment: Xu,
  tonemapping_fragment: Yu,
  tonemapping_pars_fragment: qu,
  transmission_fragment: ju,
  transmission_pars_fragment: Zu,
  uv_pars_fragment: Ku,
  uv_pars_vertex: $u,
  uv_vertex: Ju,
  worldpos_vertex: Qu,
  background_vert: td,
  background_frag: ed,
  backgroundCube_vert: nd,
  backgroundCube_frag: id,
  cube_vert: sd,
  cube_frag: rd,
  depth_vert: ad,
  depth_frag: od,
  distanceRGBA_vert: ld,
  distanceRGBA_frag: cd,
  equirect_vert: hd,
  equirect_frag: ud,
  linedashed_vert: dd,
  linedashed_frag: fd,
  meshbasic_vert: pd,
  meshbasic_frag: md,
  meshlambert_vert: _d,
  meshlambert_frag: gd,
  meshmatcap_vert: vd,
  meshmatcap_frag: xd,
  meshnormal_vert: Md,
  meshnormal_frag: Sd,
  meshphong_vert: Ed,
  meshphong_frag: yd,
  meshphysical_vert: Td,
  meshphysical_frag: bd,
  meshtoon_vert: Ad,
  meshtoon_frag: wd,
  points_vert: Rd,
  points_frag: Cd,
  shadow_vert: Pd,
  shadow_frag: Dd,
  sprite_vert: Ld,
  sprite_frag: Ud
}, et = {
  common: {
    diffuse: { value: /* @__PURE__ */ new Xt(16777215) },
    opacity: { value: 1 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Pt() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Pt() },
    alphaTest: { value: 0 }
  },
  specularmap: {
    specularMap: { value: null },
    specularMapTransform: { value: /* @__PURE__ */ new Pt() }
  },
  envmap: {
    envMap: { value: null },
    envMapRotation: { value: /* @__PURE__ */ new Pt() },
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
    aoMapTransform: { value: /* @__PURE__ */ new Pt() }
  },
  lightmap: {
    lightMap: { value: null },
    lightMapIntensity: { value: 1 },
    lightMapTransform: { value: /* @__PURE__ */ new Pt() }
  },
  bumpmap: {
    bumpMap: { value: null },
    bumpMapTransform: { value: /* @__PURE__ */ new Pt() },
    bumpScale: { value: 1 }
  },
  normalmap: {
    normalMap: { value: null },
    normalMapTransform: { value: /* @__PURE__ */ new Pt() },
    normalScale: { value: /* @__PURE__ */ new Dt(1, 1) }
  },
  displacementmap: {
    displacementMap: { value: null },
    displacementMapTransform: { value: /* @__PURE__ */ new Pt() },
    displacementScale: { value: 1 },
    displacementBias: { value: 0 }
  },
  emissivemap: {
    emissiveMap: { value: null },
    emissiveMapTransform: { value: /* @__PURE__ */ new Pt() }
  },
  metalnessmap: {
    metalnessMap: { value: null },
    metalnessMapTransform: { value: /* @__PURE__ */ new Pt() }
  },
  roughnessmap: {
    roughnessMap: { value: null },
    roughnessMapTransform: { value: /* @__PURE__ */ new Pt() }
  },
  gradientmap: {
    gradientMap: { value: null }
  },
  fog: {
    fogDensity: { value: 25e-5 },
    fogNear: { value: 1 },
    fogFar: { value: 2e3 },
    fogColor: { value: /* @__PURE__ */ new Xt(16777215) }
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
    diffuse: { value: /* @__PURE__ */ new Xt(16777215) },
    opacity: { value: 1 },
    size: { value: 1 },
    scale: { value: 1 },
    map: { value: null },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Pt() },
    alphaTest: { value: 0 },
    uvTransform: { value: /* @__PURE__ */ new Pt() }
  },
  sprite: {
    diffuse: { value: /* @__PURE__ */ new Xt(16777215) },
    opacity: { value: 1 },
    center: { value: /* @__PURE__ */ new Dt(0.5, 0.5) },
    rotation: { value: 0 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Pt() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Pt() },
    alphaTest: { value: 0 }
  }
}, je = {
  basic: {
    uniforms: /* @__PURE__ */ Ee([
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
    uniforms: /* @__PURE__ */ Ee([
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
        emissive: { value: /* @__PURE__ */ new Xt(0) }
      }
    ]),
    vertexShader: Ut.meshlambert_vert,
    fragmentShader: Ut.meshlambert_frag
  },
  phong: {
    uniforms: /* @__PURE__ */ Ee([
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
        emissive: { value: /* @__PURE__ */ new Xt(0) },
        specular: { value: /* @__PURE__ */ new Xt(1118481) },
        shininess: { value: 30 }
      }
    ]),
    vertexShader: Ut.meshphong_vert,
    fragmentShader: Ut.meshphong_frag
  },
  standard: {
    uniforms: /* @__PURE__ */ Ee([
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
        emissive: { value: /* @__PURE__ */ new Xt(0) },
        roughness: { value: 1 },
        metalness: { value: 0 },
        envMapIntensity: { value: 1 }
      }
    ]),
    vertexShader: Ut.meshphysical_vert,
    fragmentShader: Ut.meshphysical_frag
  },
  toon: {
    uniforms: /* @__PURE__ */ Ee([
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
        emissive: { value: /* @__PURE__ */ new Xt(0) }
      }
    ]),
    vertexShader: Ut.meshtoon_vert,
    fragmentShader: Ut.meshtoon_frag
  },
  matcap: {
    uniforms: /* @__PURE__ */ Ee([
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
    uniforms: /* @__PURE__ */ Ee([
      et.points,
      et.fog
    ]),
    vertexShader: Ut.points_vert,
    fragmentShader: Ut.points_frag
  },
  dashed: {
    uniforms: /* @__PURE__ */ Ee([
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
    uniforms: /* @__PURE__ */ Ee([
      et.common,
      et.displacementmap
    ]),
    vertexShader: Ut.depth_vert,
    fragmentShader: Ut.depth_frag
  },
  normal: {
    uniforms: /* @__PURE__ */ Ee([
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
    uniforms: /* @__PURE__ */ Ee([
      et.sprite,
      et.fog
    ]),
    vertexShader: Ut.sprite_vert,
    fragmentShader: Ut.sprite_frag
  },
  background: {
    uniforms: {
      uvTransform: { value: /* @__PURE__ */ new Pt() },
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
      backgroundRotation: { value: /* @__PURE__ */ new Pt() }
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
    uniforms: /* @__PURE__ */ Ee([
      et.common,
      et.displacementmap,
      {
        referencePosition: { value: /* @__PURE__ */ new I() },
        nearDistance: { value: 1 },
        farDistance: { value: 1e3 }
      }
    ]),
    vertexShader: Ut.distanceRGBA_vert,
    fragmentShader: Ut.distanceRGBA_frag
  },
  shadow: {
    uniforms: /* @__PURE__ */ Ee([
      et.lights,
      et.fog,
      {
        color: { value: /* @__PURE__ */ new Xt(0) },
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Ut.shadow_vert,
    fragmentShader: Ut.shadow_frag
  }
};
je.physical = {
  uniforms: /* @__PURE__ */ Ee([
    je.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: /* @__PURE__ */ new Pt() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: /* @__PURE__ */ new Pt() },
      clearcoatNormalScale: { value: /* @__PURE__ */ new Dt(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: /* @__PURE__ */ new Pt() },
      dispersion: { value: 0 },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: /* @__PURE__ */ new Pt() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: /* @__PURE__ */ new Pt() },
      sheen: { value: 0 },
      sheenColor: { value: /* @__PURE__ */ new Xt(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: /* @__PURE__ */ new Pt() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: /* @__PURE__ */ new Pt() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: /* @__PURE__ */ new Pt() },
      transmissionSamplerSize: { value: /* @__PURE__ */ new Dt() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: /* @__PURE__ */ new Pt() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: /* @__PURE__ */ new Xt(0) },
      specularColor: { value: /* @__PURE__ */ new Xt(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: /* @__PURE__ */ new Pt() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: /* @__PURE__ */ new Pt() },
      anisotropyVector: { value: /* @__PURE__ */ new Dt() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: /* @__PURE__ */ new Pt() }
    }
  ]),
  vertexShader: Ut.meshphysical_vert,
  fragmentShader: Ut.meshphysical_frag
};
const es = { r: 0, b: 0, g: 0 }, Pn = /* @__PURE__ */ new hn(), Id = /* @__PURE__ */ new ee();
function Nd(i, t, e, n, s, r, a) {
  const o = new Xt(0);
  let l = r === !0 ? 0 : 1, c, h, d = null, f = 0, m = null;
  function g(T) {
    let E = T.isScene === !0 ? T.background : null;
    return E && E.isTexture && (E = (T.backgroundBlurriness > 0 ? e : t).get(E)), E;
  }
  function x(T) {
    let E = !1;
    const U = g(T);
    U === null ? u(o, l) : U && U.isColor && (u(U, 1), E = !0);
    const w = i.xr.getEnvironmentBlendMode();
    w === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, a) : w === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, a), (i.autoClear || E) && (n.buffers.depth.setTest(!0), n.buffers.depth.setMask(!0), n.buffers.color.setMask(!0), i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil));
  }
  function p(T, E) {
    const U = g(E);
    U && (U.isCubeTexture || U.mapping === Ms) ? (h === void 0 && (h = new De(
      new Li(1, 1, 1),
      new un({
        name: "BackgroundCubeMaterial",
        uniforms: _i(je.backgroundCube.uniforms),
        vertexShader: je.backgroundCube.vertexShader,
        fragmentShader: je.backgroundCube.fragmentShader,
        side: Ae,
        depthTest: !1,
        depthWrite: !1,
        fog: !1
      })
    ), h.geometry.deleteAttribute("normal"), h.geometry.deleteAttribute("uv"), h.onBeforeRender = function(w, R, N) {
      this.matrixWorld.copyPosition(N.matrixWorld);
    }, Object.defineProperty(h.material, "envMap", {
      get: function() {
        return this.uniforms.envMap.value;
      }
    }), s.update(h)), Pn.copy(E.backgroundRotation), Pn.x *= -1, Pn.y *= -1, Pn.z *= -1, U.isCubeTexture && U.isRenderTargetTexture === !1 && (Pn.y *= -1, Pn.z *= -1), h.material.uniforms.envMap.value = U, h.material.uniforms.flipEnvMap.value = U.isCubeTexture && U.isRenderTargetTexture === !1 ? -1 : 1, h.material.uniforms.backgroundBlurriness.value = E.backgroundBlurriness, h.material.uniforms.backgroundIntensity.value = E.backgroundIntensity, h.material.uniforms.backgroundRotation.value.setFromMatrix4(Id.makeRotationFromEuler(Pn)), h.material.toneMapped = Wt.getTransfer(U.colorSpace) !== Zt, (d !== U || f !== U.version || m !== i.toneMapping) && (h.material.needsUpdate = !0, d = U, f = U.version, m = i.toneMapping), h.layers.enableAll(), T.unshift(h, h.geometry, h.material, 0, 0, null)) : U && U.isTexture && (c === void 0 && (c = new De(
      new ys(2, 2),
      new un({
        name: "BackgroundMaterial",
        uniforms: _i(je.background.uniforms),
        vertexShader: je.background.vertexShader,
        fragmentShader: je.background.fragmentShader,
        side: yn,
        depthTest: !1,
        depthWrite: !1,
        fog: !1
      })
    ), c.geometry.deleteAttribute("normal"), Object.defineProperty(c.material, "map", {
      get: function() {
        return this.uniforms.t2D.value;
      }
    }), s.update(c)), c.material.uniforms.t2D.value = U, c.material.uniforms.backgroundIntensity.value = E.backgroundIntensity, c.material.toneMapped = Wt.getTransfer(U.colorSpace) !== Zt, U.matrixAutoUpdate === !0 && U.updateMatrix(), c.material.uniforms.uvTransform.value.copy(U.matrix), (d !== U || f !== U.version || m !== i.toneMapping) && (c.material.needsUpdate = !0, d = U, f = U.version, m = i.toneMapping), c.layers.enableAll(), T.unshift(c, c.geometry, c.material, 0, 0, null));
  }
  function u(T, E) {
    T.getRGB(es, el(i)), n.buffers.color.setClear(es.r, es.g, es.b, E, a);
  }
  function b() {
    h !== void 0 && (h.geometry.dispose(), h.material.dispose()), c !== void 0 && (c.geometry.dispose(), c.material.dispose());
  }
  return {
    getClearColor: function() {
      return o;
    },
    setClearColor: function(T, E = 1) {
      o.set(T), l = E, u(o, l);
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
function Fd(i, t) {
  const e = i.getParameter(i.MAX_VERTEX_ATTRIBS), n = {}, s = f(null);
  let r = s, a = !1;
  function o(M, C, k, z, X) {
    let K = !1;
    const G = d(z, k, C);
    r !== G && (r = G, c(r.object)), K = m(M, z, k, X), K && g(M, z, k, X), X !== null && t.update(X, i.ELEMENT_ARRAY_BUFFER), (K || a) && (a = !1, E(M, C, k, z), X !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, t.get(X).buffer));
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
  function d(M, C, k) {
    const z = k.wireframe === !0;
    let X = n[M.id];
    X === void 0 && (X = {}, n[M.id] = X);
    let K = X[C.id];
    K === void 0 && (K = {}, X[C.id] = K);
    let G = K[z];
    return G === void 0 && (G = f(l()), K[z] = G), G;
  }
  function f(M) {
    const C = [], k = [], z = [];
    for (let X = 0; X < e; X++)
      C[X] = 0, k[X] = 0, z[X] = 0;
    return {
      // for backward compatibility on non-VAO support browser
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: C,
      enabledAttributes: k,
      attributeDivisors: z,
      object: M,
      attributes: {},
      index: null
    };
  }
  function m(M, C, k, z) {
    const X = r.attributes, K = C.attributes;
    let G = 0;
    const Q = k.getAttributes();
    for (const V in Q)
      if (Q[V].location >= 0) {
        const ht = X[V];
        let xt = K[V];
        if (xt === void 0 && (V === "instanceMatrix" && M.instanceMatrix && (xt = M.instanceMatrix), V === "instanceColor" && M.instanceColor && (xt = M.instanceColor)), ht === void 0 || ht.attribute !== xt || xt && ht.data !== xt.data) return !0;
        G++;
      }
    return r.attributesNum !== G || r.index !== z;
  }
  function g(M, C, k, z) {
    const X = {}, K = C.attributes;
    let G = 0;
    const Q = k.getAttributes();
    for (const V in Q)
      if (Q[V].location >= 0) {
        let ht = K[V];
        ht === void 0 && (V === "instanceMatrix" && M.instanceMatrix && (ht = M.instanceMatrix), V === "instanceColor" && M.instanceColor && (ht = M.instanceColor));
        const xt = {};
        xt.attribute = ht, ht && ht.data && (xt.data = ht.data), X[V] = xt, G++;
      }
    r.attributes = X, r.attributesNum = G, r.index = z;
  }
  function x() {
    const M = r.newAttributes;
    for (let C = 0, k = M.length; C < k; C++)
      M[C] = 0;
  }
  function p(M) {
    u(M, 0);
  }
  function u(M, C) {
    const k = r.newAttributes, z = r.enabledAttributes, X = r.attributeDivisors;
    k[M] = 1, z[M] === 0 && (i.enableVertexAttribArray(M), z[M] = 1), X[M] !== C && (i.vertexAttribDivisor(M, C), X[M] = C);
  }
  function b() {
    const M = r.newAttributes, C = r.enabledAttributes;
    for (let k = 0, z = C.length; k < z; k++)
      C[k] !== M[k] && (i.disableVertexAttribArray(k), C[k] = 0);
  }
  function T(M, C, k, z, X, K, G) {
    G === !0 ? i.vertexAttribIPointer(M, C, k, X, K) : i.vertexAttribPointer(M, C, k, z, X, K);
  }
  function E(M, C, k, z) {
    x();
    const X = z.attributes, K = k.getAttributes(), G = C.defaultAttributeValues;
    for (const Q in K) {
      const V = K[Q];
      if (V.location >= 0) {
        let st = X[Q];
        if (st === void 0 && (Q === "instanceMatrix" && M.instanceMatrix && (st = M.instanceMatrix), Q === "instanceColor" && M.instanceColor && (st = M.instanceColor)), st !== void 0) {
          const ht = st.normalized, xt = st.itemSize, It = t.get(st);
          if (It === void 0) continue;
          const $t = It.buffer, Y = It.type, tt = It.bytesPerElement, mt = Y === i.INT || Y === i.UNSIGNED_INT || st.gpuType === Zr;
          if (st.isInterleavedBufferAttribute) {
            const rt = st.data, Tt = rt.stride, wt = st.offset;
            if (rt.isInstancedInterleavedBuffer) {
              for (let Nt = 0; Nt < V.locationSize; Nt++)
                u(V.location + Nt, rt.meshPerAttribute);
              M.isInstancedMesh !== !0 && z._maxInstanceCount === void 0 && (z._maxInstanceCount = rt.meshPerAttribute * rt.count);
            } else
              for (let Nt = 0; Nt < V.locationSize; Nt++)
                p(V.location + Nt);
            i.bindBuffer(i.ARRAY_BUFFER, $t);
            for (let Nt = 0; Nt < V.locationSize; Nt++)
              T(
                V.location + Nt,
                xt / V.locationSize,
                Y,
                ht,
                Tt * tt,
                (wt + xt / V.locationSize * Nt) * tt,
                mt
              );
          } else {
            if (st.isInstancedBufferAttribute) {
              for (let rt = 0; rt < V.locationSize; rt++)
                u(V.location + rt, st.meshPerAttribute);
              M.isInstancedMesh !== !0 && z._maxInstanceCount === void 0 && (z._maxInstanceCount = st.meshPerAttribute * st.count);
            } else
              for (let rt = 0; rt < V.locationSize; rt++)
                p(V.location + rt);
            i.bindBuffer(i.ARRAY_BUFFER, $t);
            for (let rt = 0; rt < V.locationSize; rt++)
              T(
                V.location + rt,
                xt / V.locationSize,
                Y,
                ht,
                xt * tt,
                xt / V.locationSize * rt * tt,
                mt
              );
          }
        } else if (G !== void 0) {
          const ht = G[Q];
          if (ht !== void 0)
            switch (ht.length) {
              case 2:
                i.vertexAttrib2fv(V.location, ht);
                break;
              case 3:
                i.vertexAttrib3fv(V.location, ht);
                break;
              case 4:
                i.vertexAttrib4fv(V.location, ht);
                break;
              default:
                i.vertexAttrib1fv(V.location, ht);
            }
        }
      }
    }
    b();
  }
  function U() {
    N();
    for (const M in n) {
      const C = n[M];
      for (const k in C) {
        const z = C[k];
        for (const X in z)
          h(z[X].object), delete z[X];
        delete C[k];
      }
      delete n[M];
    }
  }
  function w(M) {
    if (n[M.id] === void 0) return;
    const C = n[M.id];
    for (const k in C) {
      const z = C[k];
      for (const X in z)
        h(z[X].object), delete z[X];
      delete C[k];
    }
    delete n[M.id];
  }
  function R(M) {
    for (const C in n) {
      const k = n[C];
      if (k[M.id] === void 0) continue;
      const z = k[M.id];
      for (const X in z)
        h(z[X].object), delete z[X];
      delete k[M.id];
    }
  }
  function N() {
    S(), a = !0, r !== s && (r = s, c(r.object));
  }
  function S() {
    s.geometry = null, s.program = null, s.wireframe = !1;
  }
  return {
    setup: o,
    reset: N,
    resetDefaultState: S,
    dispose: U,
    releaseStatesOfGeometry: w,
    releaseStatesOfProgram: R,
    initAttributes: x,
    enableAttribute: p,
    disableUnusedAttributes: b
  };
}
function Od(i, t, e) {
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
    for (let g = 0; g < d; g++)
      m += h[g];
    e.update(m, n, 1);
  }
  function l(c, h, d, f) {
    if (d === 0) return;
    const m = t.get("WEBGL_multi_draw");
    if (m === null)
      for (let g = 0; g < c.length; g++)
        a(c[g], h[g], f[g]);
    else {
      m.multiDrawArraysInstancedWEBGL(n, c, 0, h, 0, f, 0, d);
      let g = 0;
      for (let x = 0; x < d; x++)
        g += h[x] * f[x];
      e.update(g, n, 1);
    }
  }
  this.setMode = s, this.render = r, this.renderInstances = a, this.renderMultiDraw = o, this.renderMultiDrawInstances = l;
}
function Bd(i, t, e, n) {
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
    return !(R !== Ye && n.convert(R) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT));
  }
  function o(R) {
    const N = R === Ri && (t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"));
    return !(R !== cn && n.convert(R) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE) && // Edge and Chrome Mac < 52 (#9513)
    R !== rn && !N);
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
  const d = e.logarithmicDepthBuffer === !0, f = e.reverseDepthBuffer === !0 && t.has("EXT_clip_control"), m = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS), g = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS), x = i.getParameter(i.MAX_TEXTURE_SIZE), p = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE), u = i.getParameter(i.MAX_VERTEX_ATTRIBS), b = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS), T = i.getParameter(i.MAX_VARYING_VECTORS), E = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS), U = g > 0, w = i.getParameter(i.MAX_SAMPLES);
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
    maxVertexTextures: g,
    maxTextureSize: x,
    maxCubemapSize: p,
    maxAttributes: u,
    maxVertexUniforms: b,
    maxVaryings: T,
    maxFragmentUniforms: E,
    vertexTextures: U,
    maxSamples: w
  };
}
function zd(i) {
  const t = this;
  let e = null, n = 0, s = !1, r = !1;
  const a = new xn(), o = new Pt(), l = { value: null, needsUpdate: !1 };
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
    const g = d.clippingPlanes, x = d.clipIntersection, p = d.clipShadows, u = i.get(d);
    if (!s || g === null || g.length === 0 || r && !p)
      r ? h(null) : c();
    else {
      const b = r ? 0 : n, T = b * 4;
      let E = u.clippingState || null;
      l.value = E, E = h(g, f, T, m);
      for (let U = 0; U !== T; ++U)
        E[U] = e[U];
      u.clippingState = E, this.numIntersection = x ? this.numPlanes : 0, this.numPlanes += b;
    }
  };
  function c() {
    l.value !== e && (l.value = e, l.needsUpdate = n > 0), t.numPlanes = n, t.numIntersection = 0;
  }
  function h(d, f, m, g) {
    const x = d !== null ? d.length : 0;
    let p = null;
    if (x !== 0) {
      if (p = l.value, g !== !0 || p === null) {
        const u = m + x * 4, b = f.matrixWorldInverse;
        o.getNormalMatrix(b), (p === null || p.length < u) && (p = new Float32Array(u));
        for (let T = 0, E = m; T !== x; ++T, E += 4)
          a.copy(d[T]).applyMatrix4(b, o), a.normal.toArray(p, E), p[E + 3] = a.constant;
      }
      l.value = p, l.needsUpdate = !0;
    }
    return t.numPlanes = x, t.numIntersection = 0, p;
  }
}
function Hd(i) {
  let t = /* @__PURE__ */ new WeakMap();
  function e(a, o) {
    return o === mr ? a.mapping = ui : o === _r && (a.mapping = di), a;
  }
  function n(a) {
    if (a && a.isTexture) {
      const o = a.mapping;
      if (o === mr || o === _r)
        if (t.has(a)) {
          const l = t.get(a).texture;
          return e(l, a.mapping);
        } else {
          const l = a.image;
          if (l && l.height > 0) {
            const c = new Hc(l.height);
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
const ri = 4, qa = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582], In = 20, Js = /* @__PURE__ */ new ol(), ja = /* @__PURE__ */ new Xt();
let Qs = null, tr = 0, er = 0, nr = !1;
const Ln = (1 + Math.sqrt(5)) / 2, ei = 1 / Ln, Za = [
  /* @__PURE__ */ new I(-Ln, ei, 0),
  /* @__PURE__ */ new I(Ln, ei, 0),
  /* @__PURE__ */ new I(-ei, 0, Ln),
  /* @__PURE__ */ new I(ei, 0, Ln),
  /* @__PURE__ */ new I(0, Ln, -ei),
  /* @__PURE__ */ new I(0, Ln, ei),
  /* @__PURE__ */ new I(-1, 1, -1),
  /* @__PURE__ */ new I(1, 1, -1),
  /* @__PURE__ */ new I(-1, 1, 1),
  /* @__PURE__ */ new I(1, 1, 1)
];
class Ka {
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
    Qs = this._renderer.getRenderTarget(), tr = this._renderer.getActiveCubeFace(), er = this._renderer.getActiveMipmapLevel(), nr = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(256);
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
    this._cubemapMaterial === null && (this._cubemapMaterial = Qa(), this._compileMaterial(this._cubemapMaterial));
  }
  /**
   * Pre-compiles the equirectangular shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileEquirectangularShader() {
    this._equirectMaterial === null && (this._equirectMaterial = Ja(), this._compileMaterial(this._equirectMaterial));
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
    this._renderer.setRenderTarget(Qs, tr, er), this._renderer.xr.enabled = nr, t.scissorTest = !1, ns(t, 0, 0, t.width, t.height);
  }
  _fromTexture(t, e) {
    t.mapping === ui || t.mapping === di ? this._setSize(t.image.length === 0 ? 16 : t.image[0].width || t.image[0].image.width) : this._setSize(t.image.width / 4), Qs = this._renderer.getRenderTarget(), tr = this._renderer.getActiveCubeFace(), er = this._renderer.getActiveMipmapLevel(), nr = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
    const n = e || this._allocateTargets();
    return this._textureToCubeUV(t, n), this._applyPMREM(n), this._cleanup(n), n;
  }
  _allocateTargets() {
    const t = 3 * Math.max(this._cubeSize, 112), e = 4 * this._cubeSize, n = {
      magFilter: Ze,
      minFilter: Ze,
      generateMipmaps: !1,
      type: Ri,
      format: Ye,
      colorSpace: mi,
      depthBuffer: !1
    }, s = $a(t, e, n);
    if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== t || this._pingPongRenderTarget.height !== e) {
      this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = $a(t, e, n);
      const { _lodMax: r } = this;
      ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = Vd(r)), this._blurMaterial = Gd(r, t, e);
    }
    return s;
  }
  _compileMaterial(t) {
    const e = new De(this._lodPlanes[0], t);
    this._renderer.compile(e, Js);
  }
  _sceneToCubeUV(t, e, n, s) {
    const o = new Oe(90, 1, e, n), l = [1, -1, 1, 1, 1, 1], c = [1, 1, 1, -1, -1, -1], h = this._renderer, d = h.autoClear, f = h.toneMapping;
    h.getClearColor(ja), h.toneMapping = En, h.autoClear = !1;
    const m = new na({
      name: "PMREM.Background",
      side: Ae,
      depthWrite: !1,
      depthTest: !1
    }), g = new De(new Li(), m);
    let x = !1;
    const p = t.background;
    p ? p.isColor && (m.color.copy(p), t.background = null, x = !0) : (m.color.copy(ja), x = !0);
    for (let u = 0; u < 6; u++) {
      const b = u % 3;
      b === 0 ? (o.up.set(0, l[u], 0), o.lookAt(c[u], 0, 0)) : b === 1 ? (o.up.set(0, 0, l[u]), o.lookAt(0, c[u], 0)) : (o.up.set(0, l[u], 0), o.lookAt(0, 0, c[u]));
      const T = this._cubeSize;
      ns(s, b * T, u > 2 ? T : 0, T, T), h.setRenderTarget(s), x && h.render(g, o), h.render(t, o);
    }
    g.geometry.dispose(), g.material.dispose(), h.toneMapping = f, h.autoClear = d, t.background = p;
  }
  _textureToCubeUV(t, e) {
    const n = this._renderer, s = t.mapping === ui || t.mapping === di;
    s ? (this._cubemapMaterial === null && (this._cubemapMaterial = Qa()), this._cubemapMaterial.uniforms.flipEnvMap.value = t.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Ja());
    const r = s ? this._cubemapMaterial : this._equirectMaterial, a = new De(this._lodPlanes[0], r), o = r.uniforms;
    o.envMap.value = t;
    const l = this._cubeSize;
    ns(e, 0, 0, 3 * l, 2 * l), n.setRenderTarget(e), n.render(a, Js);
  }
  _applyPMREM(t) {
    const e = this._renderer, n = e.autoClear;
    e.autoClear = !1;
    const s = this._lodPlanes.length;
    for (let r = 1; r < s; r++) {
      const a = Math.sqrt(this._sigmas[r] * this._sigmas[r] - this._sigmas[r - 1] * this._sigmas[r - 1]), o = Za[(s - r - 1) % Za.length];
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
    const h = 3, d = new De(this._lodPlanes[s], c), f = c.uniforms, m = this._sizeLods[n] - 1, g = isFinite(r) ? Math.PI / (2 * m) : 2 * Math.PI / (2 * In - 1), x = r / g, p = isFinite(r) ? 1 + Math.floor(h * x) : In;
    p > In && console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${In}`);
    const u = [];
    let b = 0;
    for (let R = 0; R < In; ++R) {
      const N = R / x, S = Math.exp(-N * N / 2);
      u.push(S), R === 0 ? b += S : R < p && (b += 2 * S);
    }
    for (let R = 0; R < u.length; R++)
      u[R] = u[R] / b;
    f.envMap.value = t.texture, f.samples.value = p, f.weights.value = u, f.latitudinal.value = a === "latitudinal", o && (f.poleAxis.value = o);
    const { _lodMax: T } = this;
    f.dTheta.value = g, f.mipInt.value = T - n;
    const E = this._sizeLods[s], U = 3 * E * (s > T - ri ? s - T + ri : 0), w = 4 * (this._cubeSize - E);
    ns(e, U, w, 3 * E, 2 * E), l.setRenderTarget(e), l.render(d, Js);
  }
}
function Vd(i) {
  const t = [], e = [], n = [];
  let s = i;
  const r = i - ri + 1 + qa.length;
  for (let a = 0; a < r; a++) {
    const o = Math.pow(2, s);
    e.push(o);
    let l = 1 / o;
    a > i - ri ? l = qa[a - i + ri - 1] : a === 0 && (l = 0), n.push(l);
    const c = 1 / (o - 2), h = -c, d = 1 + c, f = [h, h, d, h, d, d, h, h, d, d, h, d], m = 6, g = 6, x = 3, p = 2, u = 1, b = new Float32Array(x * g * m), T = new Float32Array(p * g * m), E = new Float32Array(u * g * m);
    for (let w = 0; w < m; w++) {
      const R = w % 3 * 2 / 3 - 1, N = w > 2 ? 0 : -1, S = [
        R,
        N,
        0,
        R + 2 / 3,
        N,
        0,
        R + 2 / 3,
        N + 1,
        0,
        R,
        N,
        0,
        R + 2 / 3,
        N + 1,
        0,
        R,
        N + 1,
        0
      ];
      b.set(S, x * g * w), T.set(f, p * g * w);
      const M = [w, w, w, w, w, w];
      E.set(M, u * g * w);
    }
    const U = new ze();
    U.setAttribute("position", new _e(b, x)), U.setAttribute("uv", new _e(T, p)), U.setAttribute("faceIndex", new _e(E, u)), t.push(U), s > ri && s--;
  }
  return { lodPlanes: t, sizeLods: e, sigmas: n };
}
function $a(i, t, e) {
  const n = new Bn(i, t, e);
  return n.texture.mapping = Ms, n.texture.name = "PMREM.cubeUv", n.scissorTest = !0, n;
}
function ns(i, t, e, n, s) {
  i.viewport.set(t, e, n, s), i.scissor.set(t, e, n, s);
}
function Gd(i, t, e) {
  const n = new Float32Array(In), s = new I(0, 1, 0);
  return new un({
    name: "SphericalGaussianBlur",
    defines: {
      n: In,
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
    vertexShader: aa(),
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
    blending: Sn,
    depthTest: !1,
    depthWrite: !1
  });
}
function Ja() {
  return new un({
    name: "EquirectangularToCubeUV",
    uniforms: {
      envMap: { value: null }
    },
    vertexShader: aa(),
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
    blending: Sn,
    depthTest: !1,
    depthWrite: !1
  });
}
function Qa() {
  return new un({
    name: "CubemapToCubeUV",
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 }
    },
    vertexShader: aa(),
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
    blending: Sn,
    depthTest: !1,
    depthWrite: !1
  });
}
function aa() {
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
function kd(i) {
  let t = /* @__PURE__ */ new WeakMap(), e = null;
  function n(o) {
    if (o && o.isTexture) {
      const l = o.mapping, c = l === mr || l === _r, h = l === ui || l === di;
      if (c || h) {
        let d = t.get(o);
        const f = d !== void 0 ? d.texture.pmremVersion : 0;
        if (o.isRenderTargetTexture && o.pmremVersion !== f)
          return e === null && (e = new Ka(i)), d = c ? e.fromEquirectangular(o, d) : e.fromCubemap(o, d), d.texture.pmremVersion = o.pmremVersion, t.set(o, d), d.texture;
        if (d !== void 0)
          return d.texture;
        {
          const m = o.image;
          return c && m && m.height > 0 || h && m && s(m) ? (e === null && (e = new Ka(i)), d = c ? e.fromEquirectangular(o) : e.fromCubemap(o), d.texture.pmremVersion = o.pmremVersion, t.set(o, d), o.addEventListener("dispose", r), d.texture) : null;
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
function Wd(i) {
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
      return s === null && ni("THREE.WebGLRenderer: " + n + " extension not supported."), s;
    }
  };
}
function Xd(i, t, e, n) {
  const s = {}, r = /* @__PURE__ */ new WeakMap();
  function a(d) {
    const f = d.target;
    f.index !== null && t.remove(f.index);
    for (const g in f.attributes)
      t.remove(f.attributes[g]);
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
    const f = [], m = d.index, g = d.attributes.position;
    let x = 0;
    if (m !== null) {
      const b = m.array;
      x = m.version;
      for (let T = 0, E = b.length; T < E; T += 3) {
        const U = b[T + 0], w = b[T + 1], R = b[T + 2];
        f.push(U, w, w, R, R, U);
      }
    } else if (g !== void 0) {
      const b = g.array;
      x = g.version;
      for (let T = 0, E = b.length / 3 - 1; T < E; T += 3) {
        const U = T + 0, w = T + 1, R = T + 2;
        f.push(U, w, w, R, R, U);
      }
    } else
      return;
    const p = new (Zo(f) ? tl : Qo)(f, 1);
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
function Yd(i, t, e) {
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
  function c(f, m, g) {
    g !== 0 && (i.drawElementsInstanced(n, m, r, f * a, g), e.update(m, n, g));
  }
  function h(f, m, g) {
    if (g === 0) return;
    t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, m, 0, r, f, 0, g);
    let p = 0;
    for (let u = 0; u < g; u++)
      p += m[u];
    e.update(p, n, 1);
  }
  function d(f, m, g, x) {
    if (g === 0) return;
    const p = t.get("WEBGL_multi_draw");
    if (p === null)
      for (let u = 0; u < f.length; u++)
        c(f[u] / a, m[u], x[u]);
    else {
      p.multiDrawElementsInstancedWEBGL(n, m, 0, r, f, 0, x, 0, g);
      let u = 0;
      for (let b = 0; b < g; b++)
        u += m[b] * x[b];
      e.update(u, n, 1);
    }
  }
  this.setMode = s, this.setIndex = o, this.render = l, this.renderInstances = c, this.renderMultiDraw = h, this.renderMultiDrawInstances = d;
}
function qd(i) {
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
function jd(i, t, e) {
  const n = /* @__PURE__ */ new WeakMap(), s = new re();
  function r(a, o, l) {
    const c = a.morphTargetInfluences, h = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, d = h !== void 0 ? h.length : 0;
    let f = n.get(o);
    if (f === void 0 || f.count !== d) {
      let S = function() {
        R.dispose(), n.delete(o), o.removeEventListener("dispose", S);
      };
      f !== void 0 && f.texture.dispose();
      const m = o.morphAttributes.position !== void 0, g = o.morphAttributes.normal !== void 0, x = o.morphAttributes.color !== void 0, p = o.morphAttributes.position || [], u = o.morphAttributes.normal || [], b = o.morphAttributes.color || [];
      let T = 0;
      m === !0 && (T = 1), g === !0 && (T = 2), x === !0 && (T = 3);
      let E = o.attributes.position.count * T, U = 1;
      E > t.maxTextureSize && (U = Math.ceil(E / t.maxTextureSize), E = t.maxTextureSize);
      const w = new Float32Array(E * U * 4 * d), R = new $o(w, E, U, d);
      R.type = rn, R.needsUpdate = !0;
      const N = T * 4;
      for (let M = 0; M < d; M++) {
        const C = p[M], k = u[M], z = b[M], X = E * U * 4 * M;
        for (let K = 0; K < C.count; K++) {
          const G = K * N;
          m === !0 && (s.fromBufferAttribute(C, K), w[X + G + 0] = s.x, w[X + G + 1] = s.y, w[X + G + 2] = s.z, w[X + G + 3] = 0), g === !0 && (s.fromBufferAttribute(k, K), w[X + G + 4] = s.x, w[X + G + 5] = s.y, w[X + G + 6] = s.z, w[X + G + 7] = 0), x === !0 && (s.fromBufferAttribute(z, K), w[X + G + 8] = s.x, w[X + G + 9] = s.y, w[X + G + 10] = s.z, w[X + G + 11] = z.itemSize === 4 ? s.w : 1);
        }
      }
      f = {
        count: d,
        texture: R,
        size: new Dt(E, U)
      }, n.set(o, f), o.addEventListener("dispose", S);
    }
    if (a.isInstancedMesh === !0 && a.morphTexture !== null)
      l.getUniforms().setValue(i, "morphTexture", a.morphTexture, e);
    else {
      let m = 0;
      for (let x = 0; x < c.length; x++)
        m += c[x];
      const g = o.morphTargetsRelative ? 1 : 1 - m;
      l.getUniforms().setValue(i, "morphTargetBaseInfluence", g), l.getUniforms().setValue(i, "morphTargetInfluences", c);
    }
    l.getUniforms().setValue(i, "morphTargetsTexture", f.texture, e), l.getUniforms().setValue(i, "morphTargetsTextureSize", f.size);
  }
  return {
    update: r
  };
}
function Zd(i, t, e, n) {
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
const hl = /* @__PURE__ */ new we(), to = /* @__PURE__ */ new sl(1, 1), ul = /* @__PURE__ */ new $o(), dl = /* @__PURE__ */ new Tc(), fl = /* @__PURE__ */ new il(), eo = [], no = [], io = new Float32Array(16), so = new Float32Array(9), ro = new Float32Array(4);
function gi(i, t, e) {
  const n = i[0];
  if (n <= 0 || n > 0) return i;
  const s = t * e;
  let r = eo[s];
  if (r === void 0 && (r = new Float32Array(s), eo[s] = r), t !== 0) {
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
function Ts(i, t) {
  let e = no[t];
  e === void 0 && (e = new Int32Array(t), no[t] = e);
  for (let n = 0; n !== t; ++n)
    e[n] = i.allocateTextureUnit();
  return e;
}
function Kd(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1f(this.addr, t), e[0] = t);
}
function $d(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2f(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (he(e, t)) return;
    i.uniform2fv(this.addr, t), ue(e, t);
  }
}
function Jd(i, t) {
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
function Qd(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4f(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (he(e, t)) return;
    i.uniform4fv(this.addr, t), ue(e, t);
  }
}
function tf(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (he(e, t)) return;
    i.uniformMatrix2fv(this.addr, !1, t), ue(e, t);
  } else {
    if (he(e, n)) return;
    ro.set(n), i.uniformMatrix2fv(this.addr, !1, ro), ue(e, n);
  }
}
function ef(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (he(e, t)) return;
    i.uniformMatrix3fv(this.addr, !1, t), ue(e, t);
  } else {
    if (he(e, n)) return;
    so.set(n), i.uniformMatrix3fv(this.addr, !1, so), ue(e, n);
  }
}
function nf(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (he(e, t)) return;
    i.uniformMatrix4fv(this.addr, !1, t), ue(e, t);
  } else {
    if (he(e, n)) return;
    io.set(n), i.uniformMatrix4fv(this.addr, !1, io), ue(e, n);
  }
}
function sf(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1i(this.addr, t), e[0] = t);
}
function rf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2i(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (he(e, t)) return;
    i.uniform2iv(this.addr, t), ue(e, t);
  }
}
function af(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (i.uniform3i(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else {
    if (he(e, t)) return;
    i.uniform3iv(this.addr, t), ue(e, t);
  }
}
function of(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4i(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (he(e, t)) return;
    i.uniform4iv(this.addr, t), ue(e, t);
  }
}
function lf(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1ui(this.addr, t), e[0] = t);
}
function cf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2ui(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (he(e, t)) return;
    i.uniform2uiv(this.addr, t), ue(e, t);
  }
}
function hf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (i.uniform3ui(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else {
    if (he(e, t)) return;
    i.uniform3uiv(this.addr, t), ue(e, t);
  }
}
function uf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4ui(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (he(e, t)) return;
    i.uniform4uiv(this.addr, t), ue(e, t);
  }
}
function df(i, t, e) {
  const n = this.cache, s = e.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s);
  let r;
  this.type === i.SAMPLER_2D_SHADOW ? (to.compareFunction = jo, r = to) : r = hl, e.setTexture2D(t || r, s);
}
function ff(i, t, e) {
  const n = this.cache, s = e.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), e.setTexture3D(t || dl, s);
}
function pf(i, t, e) {
  const n = this.cache, s = e.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), e.setTextureCube(t || fl, s);
}
function mf(i, t, e) {
  const n = this.cache, s = e.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s), e.setTexture2DArray(t || ul, s);
}
function _f(i) {
  switch (i) {
    case 5126:
      return Kd;
    // FLOAT
    case 35664:
      return $d;
    // _VEC2
    case 35665:
      return Jd;
    // _VEC3
    case 35666:
      return Qd;
    // _VEC4
    case 35674:
      return tf;
    // _MAT2
    case 35675:
      return ef;
    // _MAT3
    case 35676:
      return nf;
    // _MAT4
    case 5124:
    case 35670:
      return sf;
    // INT, BOOL
    case 35667:
    case 35671:
      return rf;
    // _VEC2
    case 35668:
    case 35672:
      return af;
    // _VEC3
    case 35669:
    case 35673:
      return of;
    // _VEC4
    case 5125:
      return lf;
    // UINT
    case 36294:
      return cf;
    // _VEC2
    case 36295:
      return hf;
    // _VEC3
    case 36296:
      return uf;
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
      return df;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return ff;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return pf;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return mf;
  }
}
function gf(i, t) {
  i.uniform1fv(this.addr, t);
}
function vf(i, t) {
  const e = gi(t, this.size, 2);
  i.uniform2fv(this.addr, e);
}
function xf(i, t) {
  const e = gi(t, this.size, 3);
  i.uniform3fv(this.addr, e);
}
function Mf(i, t) {
  const e = gi(t, this.size, 4);
  i.uniform4fv(this.addr, e);
}
function Sf(i, t) {
  const e = gi(t, this.size, 4);
  i.uniformMatrix2fv(this.addr, !1, e);
}
function Ef(i, t) {
  const e = gi(t, this.size, 9);
  i.uniformMatrix3fv(this.addr, !1, e);
}
function yf(i, t) {
  const e = gi(t, this.size, 16);
  i.uniformMatrix4fv(this.addr, !1, e);
}
function Tf(i, t) {
  i.uniform1iv(this.addr, t);
}
function bf(i, t) {
  i.uniform2iv(this.addr, t);
}
function Af(i, t) {
  i.uniform3iv(this.addr, t);
}
function wf(i, t) {
  i.uniform4iv(this.addr, t);
}
function Rf(i, t) {
  i.uniform1uiv(this.addr, t);
}
function Cf(i, t) {
  i.uniform2uiv(this.addr, t);
}
function Pf(i, t) {
  i.uniform3uiv(this.addr, t);
}
function Df(i, t) {
  i.uniform4uiv(this.addr, t);
}
function Lf(i, t, e) {
  const n = this.cache, s = t.length, r = Ts(e, s);
  he(n, r) || (i.uniform1iv(this.addr, r), ue(n, r));
  for (let a = 0; a !== s; ++a)
    e.setTexture2D(t[a] || hl, r[a]);
}
function Uf(i, t, e) {
  const n = this.cache, s = t.length, r = Ts(e, s);
  he(n, r) || (i.uniform1iv(this.addr, r), ue(n, r));
  for (let a = 0; a !== s; ++a)
    e.setTexture3D(t[a] || dl, r[a]);
}
function If(i, t, e) {
  const n = this.cache, s = t.length, r = Ts(e, s);
  he(n, r) || (i.uniform1iv(this.addr, r), ue(n, r));
  for (let a = 0; a !== s; ++a)
    e.setTextureCube(t[a] || fl, r[a]);
}
function Nf(i, t, e) {
  const n = this.cache, s = t.length, r = Ts(e, s);
  he(n, r) || (i.uniform1iv(this.addr, r), ue(n, r));
  for (let a = 0; a !== s; ++a)
    e.setTexture2DArray(t[a] || ul, r[a]);
}
function Ff(i) {
  switch (i) {
    case 5126:
      return gf;
    // FLOAT
    case 35664:
      return vf;
    // _VEC2
    case 35665:
      return xf;
    // _VEC3
    case 35666:
      return Mf;
    // _VEC4
    case 35674:
      return Sf;
    // _MAT2
    case 35675:
      return Ef;
    // _MAT3
    case 35676:
      return yf;
    // _MAT4
    case 5124:
    case 35670:
      return Tf;
    // INT, BOOL
    case 35667:
    case 35671:
      return bf;
    // _VEC2
    case 35668:
    case 35672:
      return Af;
    // _VEC3
    case 35669:
    case 35673:
      return wf;
    // _VEC4
    case 5125:
      return Rf;
    // UINT
    case 36294:
      return Cf;
    // _VEC2
    case 36295:
      return Pf;
    // _VEC3
    case 36296:
      return Df;
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
      return Lf;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return Uf;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return If;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return Nf;
  }
}
class Of {
  constructor(t, e, n) {
    this.id = t, this.addr = n, this.cache = [], this.type = e.type, this.setValue = _f(e.type);
  }
}
class Bf {
  constructor(t, e, n) {
    this.id = t, this.addr = n, this.cache = [], this.type = e.type, this.size = e.size, this.setValue = Ff(e.type);
  }
}
class zf {
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
const ir = /(\w+)(\])?(\[|\.)?/g;
function ao(i, t) {
  i.seq.push(t), i.map[t.id] = t;
}
function Hf(i, t, e) {
  const n = i.name, s = n.length;
  for (ir.lastIndex = 0; ; ) {
    const r = ir.exec(n), a = ir.lastIndex;
    let o = r[1];
    const l = r[2] === "]", c = r[3];
    if (l && (o = o | 0), c === void 0 || c === "[" && a + 2 === s) {
      ao(e, c === void 0 ? new Of(o, i, t) : new Bf(o, i, t));
      break;
    } else {
      let d = e.map[o];
      d === void 0 && (d = new zf(o), ao(e, d)), e = d;
    }
  }
}
class ds {
  constructor(t, e) {
    this.seq = [], this.map = {};
    const n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS);
    for (let s = 0; s < n; ++s) {
      const r = t.getActiveUniform(e, s), a = t.getUniformLocation(e, r.name);
      Hf(r, a, this);
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
function oo(i, t, e) {
  const n = i.createShader(t);
  return i.shaderSource(n, e), i.compileShader(n), n;
}
const Vf = 37297;
let Gf = 0;
function kf(i, t) {
  const e = i.split(`
`), n = [], s = Math.max(t - 6, 0), r = Math.min(t + 6, e.length);
  for (let a = s; a < r; a++) {
    const o = a + 1;
    n.push(`${o === t ? ">" : " "} ${o}: ${e[a]}`);
  }
  return n.join(`
`);
}
const lo = /* @__PURE__ */ new Pt();
function Wf(i) {
  Wt._getMatrix(lo, Wt.workingColorSpace, i);
  const t = `mat3( ${lo.elements.map((e) => e.toFixed(4))} )`;
  switch (Wt.getTransfer(i)) {
    case fs:
      return [t, "LinearTransferOETF"];
    case Zt:
      return [t, "sRGBTransferOETF"];
    default:
      return console.warn("THREE.WebGLProgram: Unsupported color space: ", i), [t, "LinearTransferOETF"];
  }
}
function co(i, t, e) {
  const n = i.getShaderParameter(t, i.COMPILE_STATUS), s = i.getShaderInfoLog(t).trim();
  if (n && s === "") return "";
  const r = /ERROR: 0:(\d+)/.exec(s);
  if (r) {
    const a = parseInt(r[1]);
    return e.toUpperCase() + `

` + s + `

` + kf(i.getShaderSource(t), a);
  } else
    return s;
}
function Xf(i, t) {
  const e = Wf(t);
  return [
    `vec4 ${i}( vec4 value ) {`,
    `	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,
    "}"
  ].join(`
`);
}
function Yf(i, t) {
  let e;
  switch (t) {
    case jl:
      e = "Linear";
      break;
    case Zl:
      e = "Reinhard";
      break;
    case Kl:
      e = "Cineon";
      break;
    case $l:
      e = "ACESFilmic";
      break;
    case Ql:
      e = "AgX";
      break;
    case tc:
      e = "Neutral";
      break;
    case Jl:
      e = "Custom";
      break;
    default:
      console.warn("THREE.WebGLProgram: Unsupported toneMapping:", t), e = "Linear";
  }
  return "vec3 " + i + "( vec3 color ) { return " + e + "ToneMapping( color ); }";
}
const is = /* @__PURE__ */ new I();
function qf() {
  Wt.getLuminanceCoefficients(is);
  const i = is.x.toFixed(4), t = is.y.toFixed(4), e = is.z.toFixed(4);
  return [
    "float luminance( const in vec3 rgb ) {",
    `	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,
    "	return dot( weights, rgb );",
    "}"
  ].join(`
`);
}
function jf(i) {
  return [
    i.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "",
    i.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""
  ].filter(Ai).join(`
`);
}
function Zf(i) {
  const t = [];
  for (const e in i) {
    const n = i[e];
    n !== !1 && t.push("#define " + e + " " + n);
  }
  return t.join(`
`);
}
function Kf(i, t) {
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
function Ai(i) {
  return i !== "";
}
function ho(i, t) {
  const e = t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
  return i.replace(/NUM_DIR_LIGHTS/g, t.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, e).replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function uo(i, t) {
  return i.replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t.numClippingPlanes - t.numClipIntersection);
}
const $f = /^[ \t]*#include +<([\w\d./]+)>/gm;
function jr(i) {
  return i.replace($f, Qf);
}
const Jf = /* @__PURE__ */ new Map();
function Qf(i, t) {
  let e = Ut[t];
  if (e === void 0) {
    const n = Jf.get(t);
    if (n !== void 0)
      e = Ut[n], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', t, n);
    else
      throw new Error("Can not resolve #include <" + t + ">");
  }
  return jr(e);
}
const tp = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function fo(i) {
  return i.replace(tp, ep);
}
function ep(i, t, e, n) {
  let s = "";
  for (let r = parseInt(t); r < parseInt(e); r++)
    s += n.replace(/\[\s*i\s*\]/g, "[ " + r + " ]").replace(/UNROLLED_LOOP_INDEX/g, r);
  return s;
}
function po(i) {
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
function np(i) {
  let t = "SHADOWMAP_TYPE_BASIC";
  return i.shadowMapType === No ? t = "SHADOWMAP_TYPE_PCF" : i.shadowMapType === wl ? t = "SHADOWMAP_TYPE_PCF_SOFT" : i.shadowMapType === nn && (t = "SHADOWMAP_TYPE_VSM"), t;
}
function ip(i) {
  let t = "ENVMAP_TYPE_CUBE";
  if (i.envMap)
    switch (i.envMapMode) {
      case ui:
      case di:
        t = "ENVMAP_TYPE_CUBE";
        break;
      case Ms:
        t = "ENVMAP_TYPE_CUBE_UV";
        break;
    }
  return t;
}
function sp(i) {
  let t = "ENVMAP_MODE_REFLECTION";
  if (i.envMap)
    switch (i.envMapMode) {
      case di:
        t = "ENVMAP_MODE_REFRACTION";
        break;
    }
  return t;
}
function rp(i) {
  let t = "ENVMAP_BLENDING_NONE";
  if (i.envMap)
    switch (i.combine) {
      case Fo:
        t = "ENVMAP_BLENDING_MULTIPLY";
        break;
      case Yl:
        t = "ENVMAP_BLENDING_MIX";
        break;
      case ql:
        t = "ENVMAP_BLENDING_ADD";
        break;
    }
  return t;
}
function ap(i) {
  const t = i.envMapCubeUVHeight;
  if (t === null) return null;
  const e = Math.log2(t) - 2, n = 1 / t;
  return { texelWidth: 1 / (3 * Math.max(Math.pow(2, e), 112)), texelHeight: n, maxMip: e };
}
function op(i, t, e, n) {
  const s = i.getContext(), r = e.defines;
  let a = e.vertexShader, o = e.fragmentShader;
  const l = np(e), c = ip(e), h = sp(e), d = rp(e), f = ap(e), m = jf(e), g = Zf(r), x = s.createProgram();
  let p, u, b = e.glslVersion ? "#version " + e.glslVersion + `
` : "";
  e.isRawShaderMaterial ? (p = [
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    g
  ].filter(Ai).join(`
`), p.length > 0 && (p += `
`), u = [
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    g
  ].filter(Ai).join(`
`), u.length > 0 && (u += `
`)) : (p = [
    po(e),
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    g,
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
  ].filter(Ai).join(`
`), u = [
    po(e),
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    g,
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
    e.toneMapping !== En ? "#define TONE_MAPPING" : "",
    e.toneMapping !== En ? Ut.tonemapping_pars_fragment : "",
    // this code is required here because it is used by the toneMapping() function defined below
    e.toneMapping !== En ? Yf("toneMapping", e.toneMapping) : "",
    e.dithering ? "#define DITHERING" : "",
    e.opaque ? "#define OPAQUE" : "",
    Ut.colorspace_pars_fragment,
    // this code is required here because it is used by the various encoding/decoding function defined below
    Xf("linearToOutputTexel", e.outputColorSpace),
    qf(),
    e.useDepthPacking ? "#define DEPTH_PACKING " + e.depthPacking : "",
    `
`
  ].filter(Ai).join(`
`)), a = jr(a), a = ho(a, e), a = uo(a, e), o = jr(o), o = ho(o, e), o = uo(o, e), a = fo(a), o = fo(o), e.isRawShaderMaterial !== !0 && (b = `#version 300 es
`, p = [
    m,
    "#define attribute in",
    "#define varying out",
    "#define texture2D texture"
  ].join(`
`) + `
` + p, u = [
    "#define varying in",
    e.glslVersion === ps ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
    e.glslVersion === ps ? "" : "#define gl_FragColor pc_fragColor",
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
  const T = b + p + a, E = b + u + o, U = oo(s, s.VERTEX_SHADER, T), w = oo(s, s.FRAGMENT_SHADER, E);
  s.attachShader(x, U), s.attachShader(x, w), e.index0AttributeName !== void 0 ? s.bindAttribLocation(x, 0, e.index0AttributeName) : e.morphTargets === !0 && s.bindAttribLocation(x, 0, "position"), s.linkProgram(x);
  function R(C) {
    if (i.debug.checkShaderErrors) {
      const k = s.getProgramInfoLog(x).trim(), z = s.getShaderInfoLog(U).trim(), X = s.getShaderInfoLog(w).trim();
      let K = !0, G = !0;
      if (s.getProgramParameter(x, s.LINK_STATUS) === !1)
        if (K = !1, typeof i.debug.onShaderError == "function")
          i.debug.onShaderError(s, x, U, w);
        else {
          const Q = co(s, U, "vertex"), V = co(s, w, "fragment");
          console.error(
            "THREE.WebGLProgram: Shader Error " + s.getError() + " - VALIDATE_STATUS " + s.getProgramParameter(x, s.VALIDATE_STATUS) + `

Material Name: ` + C.name + `
Material Type: ` + C.type + `

Program Info Log: ` + k + `
` + Q + `
` + V
          );
        }
      else k !== "" ? console.warn("THREE.WebGLProgram: Program Info Log:", k) : (z === "" || X === "") && (G = !1);
      G && (C.diagnostics = {
        runnable: K,
        programLog: k,
        vertexShader: {
          log: z,
          prefix: p
        },
        fragmentShader: {
          log: X,
          prefix: u
        }
      });
    }
    s.deleteShader(U), s.deleteShader(w), N = new ds(s, x), S = Kf(s, x);
  }
  let N;
  this.getUniforms = function() {
    return N === void 0 && R(this), N;
  };
  let S;
  this.getAttributes = function() {
    return S === void 0 && R(this), S;
  };
  let M = e.rendererExtensionParallelShaderCompile === !1;
  return this.isReady = function() {
    return M === !1 && (M = s.getProgramParameter(x, Vf)), M;
  }, this.destroy = function() {
    n.releaseStatesOfProgram(this), s.deleteProgram(x), this.program = void 0;
  }, this.type = e.shaderType, this.name = e.shaderName, this.id = Gf++, this.cacheKey = t, this.usedTimes = 1, this.program = x, this.vertexShader = U, this.fragmentShader = w, this;
}
let lp = 0;
class cp {
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
    return n === void 0 && (n = new hp(t), e.set(t, n)), n;
  }
}
class hp {
  constructor(t) {
    this.id = lp++, this.code = t, this.usedTimes = 0;
  }
}
function up(i, t, e, n, s, r, a) {
  const o = new ea(), l = new cp(), c = /* @__PURE__ */ new Set(), h = [], d = s.logarithmicDepthBuffer, f = s.vertexTextures;
  let m = s.precision;
  const g = {
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
  function p(S, M, C, k, z) {
    const X = k.fog, K = z.geometry, G = S.isMeshStandardMaterial ? k.environment : null, Q = (S.isMeshStandardMaterial ? e : t).get(S.envMap || G), V = Q && Q.mapping === Ms ? Q.image.height : null, st = g[S.type];
    S.precision !== null && (m = s.getMaxPrecision(S.precision), m !== S.precision && console.warn("THREE.WebGLProgram.getParameters:", S.precision, "not supported, using", m, "instead."));
    const ht = K.morphAttributes.position || K.morphAttributes.normal || K.morphAttributes.color, xt = ht !== void 0 ? ht.length : 0;
    let It = 0;
    K.morphAttributes.position !== void 0 && (It = 1), K.morphAttributes.normal !== void 0 && (It = 2), K.morphAttributes.color !== void 0 && (It = 3);
    let $t, Y, tt, mt;
    if (st) {
      const jt = je[st];
      $t = jt.vertexShader, Y = jt.fragmentShader;
    } else
      $t = S.vertexShader, Y = S.fragmentShader, l.update(S), tt = l.getVertexShaderID(S), mt = l.getFragmentShaderID(S);
    const rt = i.getRenderTarget(), Tt = i.state.buffers.depth.getReversed(), wt = z.isInstancedMesh === !0, Nt = z.isBatchedMesh === !0, ne = !!S.map, Ht = !!S.matcap, ae = !!Q, A = !!S.aoMap, Le = !!S.lightMap, Ot = !!S.bumpMap, Bt = !!S.normalMap, Mt = !!S.displacementMap, Qt = !!S.emissiveMap, vt = !!S.metalnessMap, y = !!S.roughnessMap, _ = S.anisotropy > 0, F = S.clearcoat > 0, q = S.dispersion > 0, Z = S.iridescence > 0, W = S.sheen > 0, gt = S.transmission > 0, at = _ && !!S.anisotropyMap, ut = F && !!S.clearcoatMap, Vt = F && !!S.clearcoatNormalMap, J = F && !!S.clearcoatRoughnessMap, dt = Z && !!S.iridescenceMap, yt = Z && !!S.iridescenceThicknessMap, bt = W && !!S.sheenColorMap, ft = W && !!S.sheenRoughnessMap, zt = !!S.specularMap, Lt = !!S.specularColorMap, Jt = !!S.specularIntensityMap, P = gt && !!S.transmissionMap, nt = gt && !!S.thicknessMap, H = !!S.gradientMap, j = !!S.alphaMap, lt = S.alphaTest > 0, ot = !!S.alphaHash, Ct = !!S.extensions;
    let ie = En;
    S.toneMapped && (rt === null || rt.isXRRenderTarget === !0) && (ie = i.toneMapping);
    const ge = {
      shaderID: st,
      shaderType: S.type,
      shaderName: S.name,
      vertexShader: $t,
      fragmentShader: Y,
      defines: S.defines,
      customVertexShaderID: tt,
      customFragmentShaderID: mt,
      isRawShaderMaterial: S.isRawShaderMaterial === !0,
      glslVersion: S.glslVersion,
      precision: m,
      batching: Nt,
      batchingColor: Nt && z._colorsTexture !== null,
      instancing: wt,
      instancingColor: wt && z.instanceColor !== null,
      instancingMorph: wt && z.morphTexture !== null,
      supportsVertexTextures: f,
      outputColorSpace: rt === null ? i.outputColorSpace : rt.isXRRenderTarget === !0 ? rt.texture.colorSpace : mi,
      alphaToCoverage: !!S.alphaToCoverage,
      map: ne,
      matcap: Ht,
      envMap: ae,
      envMapMode: ae && Q.mapping,
      envMapCubeUVHeight: V,
      aoMap: A,
      lightMap: Le,
      bumpMap: Ot,
      normalMap: Bt,
      displacementMap: f && Mt,
      emissiveMap: Qt,
      normalMapObjectSpace: Bt && S.normalMapType === rc,
      normalMapTangentSpace: Bt && S.normalMapType === sc,
      metalnessMap: vt,
      roughnessMap: y,
      anisotropy: _,
      anisotropyMap: at,
      clearcoat: F,
      clearcoatMap: ut,
      clearcoatNormalMap: Vt,
      clearcoatRoughnessMap: J,
      dispersion: q,
      iridescence: Z,
      iridescenceMap: dt,
      iridescenceThicknessMap: yt,
      sheen: W,
      sheenColorMap: bt,
      sheenRoughnessMap: ft,
      specularMap: zt,
      specularColorMap: Lt,
      specularIntensityMap: Jt,
      transmission: gt,
      transmissionMap: P,
      thicknessMap: nt,
      gradientMap: H,
      opaque: S.transparent === !1 && S.blending === oi && S.alphaToCoverage === !1,
      alphaMap: j,
      alphaTest: lt,
      alphaHash: ot,
      combine: S.combine,
      //
      mapUv: ne && x(S.map.channel),
      aoMapUv: A && x(S.aoMap.channel),
      lightMapUv: Le && x(S.lightMap.channel),
      bumpMapUv: Ot && x(S.bumpMap.channel),
      normalMapUv: Bt && x(S.normalMap.channel),
      displacementMapUv: Mt && x(S.displacementMap.channel),
      emissiveMapUv: Qt && x(S.emissiveMap.channel),
      metalnessMapUv: vt && x(S.metalnessMap.channel),
      roughnessMapUv: y && x(S.roughnessMap.channel),
      anisotropyMapUv: at && x(S.anisotropyMap.channel),
      clearcoatMapUv: ut && x(S.clearcoatMap.channel),
      clearcoatNormalMapUv: Vt && x(S.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: J && x(S.clearcoatRoughnessMap.channel),
      iridescenceMapUv: dt && x(S.iridescenceMap.channel),
      iridescenceThicknessMapUv: yt && x(S.iridescenceThicknessMap.channel),
      sheenColorMapUv: bt && x(S.sheenColorMap.channel),
      sheenRoughnessMapUv: ft && x(S.sheenRoughnessMap.channel),
      specularMapUv: zt && x(S.specularMap.channel),
      specularColorMapUv: Lt && x(S.specularColorMap.channel),
      specularIntensityMapUv: Jt && x(S.specularIntensityMap.channel),
      transmissionMapUv: P && x(S.transmissionMap.channel),
      thicknessMapUv: nt && x(S.thicknessMap.channel),
      alphaMapUv: j && x(S.alphaMap.channel),
      //
      vertexTangents: !!K.attributes.tangent && (Bt || _),
      vertexColors: S.vertexColors,
      vertexAlphas: S.vertexColors === !0 && !!K.attributes.color && K.attributes.color.itemSize === 4,
      pointsUvs: z.isPoints === !0 && !!K.attributes.uv && (ne || j),
      fog: !!X,
      useFog: S.fog === !0,
      fogExp2: !!X && X.isFogExp2,
      flatShading: S.flatShading === !0,
      sizeAttenuation: S.sizeAttenuation === !0,
      logarithmicDepthBuffer: d,
      reverseDepthBuffer: Tt,
      skinning: z.isSkinnedMesh === !0,
      morphTargets: K.morphAttributes.position !== void 0,
      morphNormals: K.morphAttributes.normal !== void 0,
      morphColors: K.morphAttributes.color !== void 0,
      morphTargetsCount: xt,
      morphTextureStride: It,
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
      decodeVideoTexture: ne && S.map.isVideoTexture === !0 && Wt.getTransfer(S.map.colorSpace) === Zt,
      decodeVideoTextureEmissive: Qt && S.emissiveMap.isVideoTexture === !0 && Wt.getTransfer(S.emissiveMap.colorSpace) === Zt,
      premultipliedAlpha: S.premultipliedAlpha,
      doubleSided: S.side === sn,
      flipSided: S.side === Ae,
      useDepthPacking: S.depthPacking >= 0,
      depthPacking: S.depthPacking || 0,
      index0AttributeName: S.index0AttributeName,
      extensionClipCullDistance: Ct && S.extensions.clipCullDistance === !0 && n.has("WEBGL_clip_cull_distance"),
      extensionMultiDraw: (Ct && S.extensions.multiDraw === !0 || Nt) && n.has("WEBGL_multi_draw"),
      rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"),
      customProgramCacheKey: S.customProgramCacheKey()
    };
    return ge.vertexUv1s = c.has(1), ge.vertexUv2s = c.has(2), ge.vertexUv3s = c.has(3), c.clear(), ge;
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
  function E(S) {
    const M = g[S.type];
    let C;
    if (M) {
      const k = je[M];
      C = Fc.clone(k.uniforms);
    } else
      C = S.uniforms;
    return C;
  }
  function U(S, M) {
    let C;
    for (let k = 0, z = h.length; k < z; k++) {
      const X = h[k];
      if (X.cacheKey === M) {
        C = X, ++C.usedTimes;
        break;
      }
    }
    return C === void 0 && (C = new op(i, M, S, r), h.push(C)), C;
  }
  function w(S) {
    if (--S.usedTimes === 0) {
      const M = h.indexOf(S);
      h[M] = h[h.length - 1], h.pop(), S.destroy();
    }
  }
  function R(S) {
    l.remove(S);
  }
  function N() {
    l.dispose();
  }
  return {
    getParameters: p,
    getProgramCacheKey: u,
    getUniforms: E,
    acquireProgram: U,
    releaseProgram: w,
    releaseShaderCache: R,
    // Exposed for resource monitoring & error feedback via renderer.info:
    programs: h,
    dispose: N
  };
}
function dp() {
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
function fp(i, t) {
  return i.groupOrder !== t.groupOrder ? i.groupOrder - t.groupOrder : i.renderOrder !== t.renderOrder ? i.renderOrder - t.renderOrder : i.material.id !== t.material.id ? i.material.id - t.material.id : i.z !== t.z ? i.z - t.z : i.id - t.id;
}
function mo(i, t) {
  return i.groupOrder !== t.groupOrder ? i.groupOrder - t.groupOrder : i.renderOrder !== t.renderOrder ? i.renderOrder - t.renderOrder : i.z !== t.z ? t.z - i.z : i.id - t.id;
}
function _o() {
  const i = [];
  let t = 0;
  const e = [], n = [], s = [];
  function r() {
    t = 0, e.length = 0, n.length = 0, s.length = 0;
  }
  function a(d, f, m, g, x, p) {
    let u = i[t];
    return u === void 0 ? (u = {
      id: d.id,
      object: d,
      geometry: f,
      material: m,
      groupOrder: g,
      renderOrder: d.renderOrder,
      z: x,
      group: p
    }, i[t] = u) : (u.id = d.id, u.object = d, u.geometry = f, u.material = m, u.groupOrder = g, u.renderOrder = d.renderOrder, u.z = x, u.group = p), t++, u;
  }
  function o(d, f, m, g, x, p) {
    const u = a(d, f, m, g, x, p);
    m.transmission > 0 ? n.push(u) : m.transparent === !0 ? s.push(u) : e.push(u);
  }
  function l(d, f, m, g, x, p) {
    const u = a(d, f, m, g, x, p);
    m.transmission > 0 ? n.unshift(u) : m.transparent === !0 ? s.unshift(u) : e.unshift(u);
  }
  function c(d, f) {
    e.length > 1 && e.sort(d || fp), n.length > 1 && n.sort(f || mo), s.length > 1 && s.sort(f || mo);
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
function pp() {
  let i = /* @__PURE__ */ new WeakMap();
  function t(n, s) {
    const r = i.get(n);
    let a;
    return r === void 0 ? (a = new _o(), i.set(n, [a])) : s >= r.length ? (a = new _o(), r.push(a)) : a = r[s], a;
  }
  function e() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: t,
    dispose: e
  };
}
function mp() {
  const i = {};
  return {
    get: function(t) {
      if (i[t.id] !== void 0)
        return i[t.id];
      let e;
      switch (t.type) {
        case "DirectionalLight":
          e = {
            direction: new I(),
            color: new Xt()
          };
          break;
        case "SpotLight":
          e = {
            position: new I(),
            direction: new I(),
            color: new Xt(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0
          };
          break;
        case "PointLight":
          e = {
            position: new I(),
            color: new Xt(),
            distance: 0,
            decay: 0
          };
          break;
        case "HemisphereLight":
          e = {
            direction: new I(),
            skyColor: new Xt(),
            groundColor: new Xt()
          };
          break;
        case "RectAreaLight":
          e = {
            color: new Xt(),
            position: new I(),
            halfWidth: new I(),
            halfHeight: new I()
          };
          break;
      }
      return i[t.id] = e, e;
    }
  };
}
function _p() {
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
            shadowMapSize: new Dt()
          };
          break;
        case "SpotLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Dt()
          };
          break;
        case "PointLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Dt(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3
          };
          break;
      }
      return i[t.id] = e, e;
    }
  };
}
let gp = 0;
function vp(i, t) {
  return (t.castShadow ? 2 : 0) - (i.castShadow ? 2 : 0) + (t.map ? 1 : 0) - (i.map ? 1 : 0);
}
function xp(i) {
  const t = new mp(), e = _p(), n = {
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
  for (let c = 0; c < 9; c++) n.probe.push(new I());
  const s = new I(), r = new ee(), a = new ee();
  function o(c) {
    let h = 0, d = 0, f = 0;
    for (let S = 0; S < 9; S++) n.probe[S].set(0, 0, 0);
    let m = 0, g = 0, x = 0, p = 0, u = 0, b = 0, T = 0, E = 0, U = 0, w = 0, R = 0;
    c.sort(vp);
    for (let S = 0, M = c.length; S < M; S++) {
      const C = c[S], k = C.color, z = C.intensity, X = C.distance, K = C.shadow && C.shadow.map ? C.shadow.map.texture : null;
      if (C.isAmbientLight)
        h += k.r * z, d += k.g * z, f += k.b * z;
      else if (C.isLightProbe) {
        for (let G = 0; G < 9; G++)
          n.probe[G].addScaledVector(C.sh.coefficients[G], z);
        R++;
      } else if (C.isDirectionalLight) {
        const G = t.get(C);
        if (G.color.copy(C.color).multiplyScalar(C.intensity), C.castShadow) {
          const Q = C.shadow, V = e.get(C);
          V.shadowIntensity = Q.intensity, V.shadowBias = Q.bias, V.shadowNormalBias = Q.normalBias, V.shadowRadius = Q.radius, V.shadowMapSize = Q.mapSize, n.directionalShadow[m] = V, n.directionalShadowMap[m] = K, n.directionalShadowMatrix[m] = C.shadow.matrix, b++;
        }
        n.directional[m] = G, m++;
      } else if (C.isSpotLight) {
        const G = t.get(C);
        G.position.setFromMatrixPosition(C.matrixWorld), G.color.copy(k).multiplyScalar(z), G.distance = X, G.coneCos = Math.cos(C.angle), G.penumbraCos = Math.cos(C.angle * (1 - C.penumbra)), G.decay = C.decay, n.spot[x] = G;
        const Q = C.shadow;
        if (C.map && (n.spotLightMap[U] = C.map, U++, Q.updateMatrices(C), C.castShadow && w++), n.spotLightMatrix[x] = Q.matrix, C.castShadow) {
          const V = e.get(C);
          V.shadowIntensity = Q.intensity, V.shadowBias = Q.bias, V.shadowNormalBias = Q.normalBias, V.shadowRadius = Q.radius, V.shadowMapSize = Q.mapSize, n.spotShadow[x] = V, n.spotShadowMap[x] = K, E++;
        }
        x++;
      } else if (C.isRectAreaLight) {
        const G = t.get(C);
        G.color.copy(k).multiplyScalar(z), G.halfWidth.set(C.width * 0.5, 0, 0), G.halfHeight.set(0, C.height * 0.5, 0), n.rectArea[p] = G, p++;
      } else if (C.isPointLight) {
        const G = t.get(C);
        if (G.color.copy(C.color).multiplyScalar(C.intensity), G.distance = C.distance, G.decay = C.decay, C.castShadow) {
          const Q = C.shadow, V = e.get(C);
          V.shadowIntensity = Q.intensity, V.shadowBias = Q.bias, V.shadowNormalBias = Q.normalBias, V.shadowRadius = Q.radius, V.shadowMapSize = Q.mapSize, V.shadowCameraNear = Q.camera.near, V.shadowCameraFar = Q.camera.far, n.pointShadow[g] = V, n.pointShadowMap[g] = K, n.pointShadowMatrix[g] = C.shadow.matrix, T++;
        }
        n.point[g] = G, g++;
      } else if (C.isHemisphereLight) {
        const G = t.get(C);
        G.skyColor.copy(C.color).multiplyScalar(z), G.groundColor.copy(C.groundColor).multiplyScalar(z), n.hemi[u] = G, u++;
      }
    }
    p > 0 && (i.has("OES_texture_float_linear") === !0 ? (n.rectAreaLTC1 = et.LTC_FLOAT_1, n.rectAreaLTC2 = et.LTC_FLOAT_2) : (n.rectAreaLTC1 = et.LTC_HALF_1, n.rectAreaLTC2 = et.LTC_HALF_2)), n.ambient[0] = h, n.ambient[1] = d, n.ambient[2] = f;
    const N = n.hash;
    (N.directionalLength !== m || N.pointLength !== g || N.spotLength !== x || N.rectAreaLength !== p || N.hemiLength !== u || N.numDirectionalShadows !== b || N.numPointShadows !== T || N.numSpotShadows !== E || N.numSpotMaps !== U || N.numLightProbes !== R) && (n.directional.length = m, n.spot.length = x, n.rectArea.length = p, n.point.length = g, n.hemi.length = u, n.directionalShadow.length = b, n.directionalShadowMap.length = b, n.pointShadow.length = T, n.pointShadowMap.length = T, n.spotShadow.length = E, n.spotShadowMap.length = E, n.directionalShadowMatrix.length = b, n.pointShadowMatrix.length = T, n.spotLightMatrix.length = E + U - w, n.spotLightMap.length = U, n.numSpotLightShadowsWithMaps = w, n.numLightProbes = R, N.directionalLength = m, N.pointLength = g, N.spotLength = x, N.rectAreaLength = p, N.hemiLength = u, N.numDirectionalShadows = b, N.numPointShadows = T, N.numSpotShadows = E, N.numSpotMaps = U, N.numLightProbes = R, n.version = gp++);
  }
  function l(c, h) {
    let d = 0, f = 0, m = 0, g = 0, x = 0;
    const p = h.matrixWorldInverse;
    for (let u = 0, b = c.length; u < b; u++) {
      const T = c[u];
      if (T.isDirectionalLight) {
        const E = n.directional[d];
        E.direction.setFromMatrixPosition(T.matrixWorld), s.setFromMatrixPosition(T.target.matrixWorld), E.direction.sub(s), E.direction.transformDirection(p), d++;
      } else if (T.isSpotLight) {
        const E = n.spot[m];
        E.position.setFromMatrixPosition(T.matrixWorld), E.position.applyMatrix4(p), E.direction.setFromMatrixPosition(T.matrixWorld), s.setFromMatrixPosition(T.target.matrixWorld), E.direction.sub(s), E.direction.transformDirection(p), m++;
      } else if (T.isRectAreaLight) {
        const E = n.rectArea[g];
        E.position.setFromMatrixPosition(T.matrixWorld), E.position.applyMatrix4(p), a.identity(), r.copy(T.matrixWorld), r.premultiply(p), a.extractRotation(r), E.halfWidth.set(T.width * 0.5, 0, 0), E.halfHeight.set(0, T.height * 0.5, 0), E.halfWidth.applyMatrix4(a), E.halfHeight.applyMatrix4(a), g++;
      } else if (T.isPointLight) {
        const E = n.point[f];
        E.position.setFromMatrixPosition(T.matrixWorld), E.position.applyMatrix4(p), f++;
      } else if (T.isHemisphereLight) {
        const E = n.hemi[x];
        E.direction.setFromMatrixPosition(T.matrixWorld), E.direction.transformDirection(p), x++;
      }
    }
  }
  return {
    setup: o,
    setupView: l,
    state: n
  };
}
function go(i) {
  const t = new xp(i), e = [], n = [];
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
function Mp(i) {
  let t = /* @__PURE__ */ new WeakMap();
  function e(s, r = 0) {
    const a = t.get(s);
    let o;
    return a === void 0 ? (o = new go(i), t.set(s, [o])) : r >= a.length ? (o = new go(i), a.push(o)) : o = a[r], o;
  }
  function n() {
    t = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: e,
    dispose: n
  };
}
const Sp = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, Ep = `uniform sampler2D shadow_pass;
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
function yp(i, t, e) {
  let n = new ia();
  const s = new Dt(), r = new Dt(), a = new re(), o = new Xc({ depthPacking: ic }), l = new Yc(), c = {}, h = e.maxTextureSize, d = { [yn]: Ae, [Ae]: yn, [sn]: sn }, f = new un({
    defines: {
      VSM_SAMPLES: 8
    },
    uniforms: {
      shadow_pass: { value: null },
      resolution: { value: new Dt() },
      radius: { value: 4 }
    },
    vertexShader: Sp,
    fragmentShader: Ep
  }), m = f.clone();
  m.defines.HORIZONTAL_PASS = 1;
  const g = new ze();
  g.setAttribute(
    "position",
    new _e(
      new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]),
      3
    )
  );
  const x = new De(g, f), p = this;
  this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = No;
  let u = this.type;
  this.render = function(w, R, N) {
    if (p.enabled === !1 || p.autoUpdate === !1 && p.needsUpdate === !1 || w.length === 0) return;
    const S = i.getRenderTarget(), M = i.getActiveCubeFace(), C = i.getActiveMipmapLevel(), k = i.state;
    k.setBlending(Sn), k.buffers.color.setClear(1, 1, 1, 1), k.buffers.depth.setTest(!0), k.setScissorTest(!1);
    const z = u !== nn && this.type === nn, X = u === nn && this.type !== nn;
    for (let K = 0, G = w.length; K < G; K++) {
      const Q = w[K], V = Q.shadow;
      if (V === void 0) {
        console.warn("THREE.WebGLShadowMap:", Q, "has no shadow.");
        continue;
      }
      if (V.autoUpdate === !1 && V.needsUpdate === !1) continue;
      s.copy(V.mapSize);
      const st = V.getFrameExtents();
      if (s.multiply(st), r.copy(V.mapSize), (s.x > h || s.y > h) && (s.x > h && (r.x = Math.floor(h / st.x), s.x = r.x * st.x, V.mapSize.x = r.x), s.y > h && (r.y = Math.floor(h / st.y), s.y = r.y * st.y, V.mapSize.y = r.y)), V.map === null || z === !0 || X === !0) {
        const xt = this.type !== nn ? { minFilter: qe, magFilter: qe } : {};
        V.map !== null && V.map.dispose(), V.map = new Bn(s.x, s.y, xt), V.map.texture.name = Q.name + ".shadowMap", V.camera.updateProjectionMatrix();
      }
      i.setRenderTarget(V.map), i.clear();
      const ht = V.getViewportCount();
      for (let xt = 0; xt < ht; xt++) {
        const It = V.getViewport(xt);
        a.set(
          r.x * It.x,
          r.y * It.y,
          r.x * It.z,
          r.y * It.w
        ), k.viewport(a), V.updateMatrices(Q, xt), n = V.getFrustum(), E(R, N, V.camera, Q, this.type);
      }
      V.isPointLightShadow !== !0 && this.type === nn && b(V, N), V.needsUpdate = !1;
    }
    u = this.type, p.needsUpdate = !1, i.setRenderTarget(S, M, C);
  };
  function b(w, R) {
    const N = t.update(x);
    f.defines.VSM_SAMPLES !== w.blurSamples && (f.defines.VSM_SAMPLES = w.blurSamples, m.defines.VSM_SAMPLES = w.blurSamples, f.needsUpdate = !0, m.needsUpdate = !0), w.mapPass === null && (w.mapPass = new Bn(s.x, s.y)), f.uniforms.shadow_pass.value = w.map.texture, f.uniforms.resolution.value = w.mapSize, f.uniforms.radius.value = w.radius, i.setRenderTarget(w.mapPass), i.clear(), i.renderBufferDirect(R, null, N, f, x, null), m.uniforms.shadow_pass.value = w.mapPass.texture, m.uniforms.resolution.value = w.mapSize, m.uniforms.radius.value = w.radius, i.setRenderTarget(w.map), i.clear(), i.renderBufferDirect(R, null, N, m, x, null);
  }
  function T(w, R, N, S) {
    let M = null;
    const C = N.isPointLight === !0 ? w.customDistanceMaterial : w.customDepthMaterial;
    if (C !== void 0)
      M = C;
    else if (M = N.isPointLight === !0 ? l : o, i.localClippingEnabled && R.clipShadows === !0 && Array.isArray(R.clippingPlanes) && R.clippingPlanes.length !== 0 || R.displacementMap && R.displacementScale !== 0 || R.alphaMap && R.alphaTest > 0 || R.map && R.alphaTest > 0) {
      const k = M.uuid, z = R.uuid;
      let X = c[k];
      X === void 0 && (X = {}, c[k] = X);
      let K = X[z];
      K === void 0 && (K = M.clone(), X[z] = K, R.addEventListener("dispose", U)), M = K;
    }
    if (M.visible = R.visible, M.wireframe = R.wireframe, S === nn ? M.side = R.shadowSide !== null ? R.shadowSide : R.side : M.side = R.shadowSide !== null ? R.shadowSide : d[R.side], M.alphaMap = R.alphaMap, M.alphaTest = R.alphaTest, M.map = R.map, M.clipShadows = R.clipShadows, M.clippingPlanes = R.clippingPlanes, M.clipIntersection = R.clipIntersection, M.displacementMap = R.displacementMap, M.displacementScale = R.displacementScale, M.displacementBias = R.displacementBias, M.wireframeLinewidth = R.wireframeLinewidth, M.linewidth = R.linewidth, N.isPointLight === !0 && M.isMeshDistanceMaterial === !0) {
      const k = i.properties.get(M);
      k.light = N;
    }
    return M;
  }
  function E(w, R, N, S, M) {
    if (w.visible === !1) return;
    if (w.layers.test(R.layers) && (w.isMesh || w.isLine || w.isPoints) && (w.castShadow || w.receiveShadow && M === nn) && (!w.frustumCulled || n.intersectsObject(w))) {
      w.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse, w.matrixWorld);
      const z = t.update(w), X = w.material;
      if (Array.isArray(X)) {
        const K = z.groups;
        for (let G = 0, Q = K.length; G < Q; G++) {
          const V = K[G], st = X[V.materialIndex];
          if (st && st.visible) {
            const ht = T(w, st, S, M);
            w.onBeforeShadow(i, w, R, N, z, ht, V), i.renderBufferDirect(N, null, z, ht, w, V), w.onAfterShadow(i, w, R, N, z, ht, V);
          }
        }
      } else if (X.visible) {
        const K = T(w, X, S, M);
        w.onBeforeShadow(i, w, R, N, z, K, null), i.renderBufferDirect(N, null, z, K, w, null), w.onAfterShadow(i, w, R, N, z, K, null);
      }
    }
    const k = w.children;
    for (let z = 0, X = k.length; z < X; z++)
      E(k[z], R, N, S, M);
  }
  function U(w) {
    w.target.removeEventListener("dispose", U);
    for (const N in c) {
      const S = c[N], M = w.target.uuid;
      M in S && (S[M].dispose(), delete S[M]);
    }
  }
}
const Tp = {
  [lr]: cr,
  [hr]: fr,
  [ur]: pr,
  [hi]: dr,
  [cr]: lr,
  [fr]: hr,
  [pr]: ur,
  [dr]: hi
};
function bp(i, t) {
  function e() {
    let P = !1;
    const nt = new re();
    let H = null;
    const j = new re(0, 0, 0, 0);
    return {
      setMask: function(lt) {
        H !== lt && !P && (i.colorMask(lt, lt, lt, lt), H = lt);
      },
      setLocked: function(lt) {
        P = lt;
      },
      setClear: function(lt, ot, Ct, ie, ge) {
        ge === !0 && (lt *= ie, ot *= ie, Ct *= ie), nt.set(lt, ot, Ct, ie), j.equals(nt) === !1 && (i.clearColor(lt, ot, Ct, ie), j.copy(nt));
      },
      reset: function() {
        P = !1, H = null, j.set(-1, 0, 0, 0);
      }
    };
  }
  function n() {
    let P = !1, nt = !1, H = null, j = null, lt = null;
    return {
      setReversed: function(ot) {
        if (nt !== ot) {
          const Ct = t.get("EXT_clip_control");
          nt ? Ct.clipControlEXT(Ct.LOWER_LEFT_EXT, Ct.ZERO_TO_ONE_EXT) : Ct.clipControlEXT(Ct.LOWER_LEFT_EXT, Ct.NEGATIVE_ONE_TO_ONE_EXT);
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
        H !== ot && !P && (i.depthMask(ot), H = ot);
      },
      setFunc: function(ot) {
        if (nt && (ot = Tp[ot]), j !== ot) {
          switch (ot) {
            case lr:
              i.depthFunc(i.NEVER);
              break;
            case cr:
              i.depthFunc(i.ALWAYS);
              break;
            case hr:
              i.depthFunc(i.LESS);
              break;
            case hi:
              i.depthFunc(i.LEQUAL);
              break;
            case ur:
              i.depthFunc(i.EQUAL);
              break;
            case dr:
              i.depthFunc(i.GEQUAL);
              break;
            case fr:
              i.depthFunc(i.GREATER);
              break;
            case pr:
              i.depthFunc(i.NOTEQUAL);
              break;
            default:
              i.depthFunc(i.LEQUAL);
          }
          j = ot;
        }
      },
      setLocked: function(ot) {
        P = ot;
      },
      setClear: function(ot) {
        lt !== ot && (nt && (ot = 1 - ot), i.clearDepth(ot), lt = ot);
      },
      reset: function() {
        P = !1, H = null, j = null, lt = null, nt = !1;
      }
    };
  }
  function s() {
    let P = !1, nt = null, H = null, j = null, lt = null, ot = null, Ct = null, ie = null, ge = null;
    return {
      setTest: function(jt) {
        P || (jt ? rt(i.STENCIL_TEST) : Tt(i.STENCIL_TEST));
      },
      setMask: function(jt) {
        nt !== jt && !P && (i.stencilMask(jt), nt = jt);
      },
      setFunc: function(jt, He, Ke) {
        (H !== jt || j !== He || lt !== Ke) && (i.stencilFunc(jt, He, Ke), H = jt, j = He, lt = Ke);
      },
      setOp: function(jt, He, Ke) {
        (ot !== jt || Ct !== He || ie !== Ke) && (i.stencilOp(jt, He, Ke), ot = jt, Ct = He, ie = Ke);
      },
      setLocked: function(jt) {
        P = jt;
      },
      setClear: function(jt) {
        ge !== jt && (i.clearStencil(jt), ge = jt);
      },
      reset: function() {
        P = !1, nt = null, H = null, j = null, lt = null, ot = null, Ct = null, ie = null, ge = null;
      }
    };
  }
  const r = new e(), a = new n(), o = new s(), l = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap();
  let h = {}, d = {}, f = /* @__PURE__ */ new WeakMap(), m = [], g = null, x = !1, p = null, u = null, b = null, T = null, E = null, U = null, w = null, R = new Xt(0, 0, 0), N = 0, S = !1, M = null, C = null, k = null, z = null, X = null;
  const K = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let G = !1, Q = 0;
  const V = i.getParameter(i.VERSION);
  V.indexOf("WebGL") !== -1 ? (Q = parseFloat(/^WebGL (\d)/.exec(V)[1]), G = Q >= 1) : V.indexOf("OpenGL ES") !== -1 && (Q = parseFloat(/^OpenGL ES (\d)/.exec(V)[1]), G = Q >= 2);
  let st = null, ht = {};
  const xt = i.getParameter(i.SCISSOR_BOX), It = i.getParameter(i.VIEWPORT), $t = new re().fromArray(xt), Y = new re().fromArray(It);
  function tt(P, nt, H, j) {
    const lt = new Uint8Array(4), ot = i.createTexture();
    i.bindTexture(P, ot), i.texParameteri(P, i.TEXTURE_MIN_FILTER, i.NEAREST), i.texParameteri(P, i.TEXTURE_MAG_FILTER, i.NEAREST);
    for (let Ct = 0; Ct < H; Ct++)
      P === i.TEXTURE_3D || P === i.TEXTURE_2D_ARRAY ? i.texImage3D(nt, 0, i.RGBA, 1, 1, j, 0, i.RGBA, i.UNSIGNED_BYTE, lt) : i.texImage2D(nt + Ct, 0, i.RGBA, 1, 1, 0, i.RGBA, i.UNSIGNED_BYTE, lt);
    return ot;
  }
  const mt = {};
  mt[i.TEXTURE_2D] = tt(i.TEXTURE_2D, i.TEXTURE_2D, 1), mt[i.TEXTURE_CUBE_MAP] = tt(i.TEXTURE_CUBE_MAP, i.TEXTURE_CUBE_MAP_POSITIVE_X, 6), mt[i.TEXTURE_2D_ARRAY] = tt(i.TEXTURE_2D_ARRAY, i.TEXTURE_2D_ARRAY, 1, 1), mt[i.TEXTURE_3D] = tt(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1), r.setClear(0, 0, 0, 1), a.setClear(1), o.setClear(0), rt(i.DEPTH_TEST), a.setFunc(hi), Ot(!1), Bt(ma), rt(i.CULL_FACE), A(Sn);
  function rt(P) {
    h[P] !== !0 && (i.enable(P), h[P] = !0);
  }
  function Tt(P) {
    h[P] !== !1 && (i.disable(P), h[P] = !1);
  }
  function wt(P, nt) {
    return d[P] !== nt ? (i.bindFramebuffer(P, nt), d[P] = nt, P === i.DRAW_FRAMEBUFFER && (d[i.FRAMEBUFFER] = nt), P === i.FRAMEBUFFER && (d[i.DRAW_FRAMEBUFFER] = nt), !0) : !1;
  }
  function Nt(P, nt) {
    let H = m, j = !1;
    if (P) {
      H = f.get(nt), H === void 0 && (H = [], f.set(nt, H));
      const lt = P.textures;
      if (H.length !== lt.length || H[0] !== i.COLOR_ATTACHMENT0) {
        for (let ot = 0, Ct = lt.length; ot < Ct; ot++)
          H[ot] = i.COLOR_ATTACHMENT0 + ot;
        H.length = lt.length, j = !0;
      }
    } else
      H[0] !== i.BACK && (H[0] = i.BACK, j = !0);
    j && i.drawBuffers(H);
  }
  function ne(P) {
    return g !== P ? (i.useProgram(P), g = P, !0) : !1;
  }
  const Ht = {
    [Un]: i.FUNC_ADD,
    [Cl]: i.FUNC_SUBTRACT,
    [Pl]: i.FUNC_REVERSE_SUBTRACT
  };
  Ht[Dl] = i.MIN, Ht[Ll] = i.MAX;
  const ae = {
    [Ul]: i.ZERO,
    [Il]: i.ONE,
    [Nl]: i.SRC_COLOR,
    [ar]: i.SRC_ALPHA,
    [Vl]: i.SRC_ALPHA_SATURATE,
    [zl]: i.DST_COLOR,
    [Ol]: i.DST_ALPHA,
    [Fl]: i.ONE_MINUS_SRC_COLOR,
    [or]: i.ONE_MINUS_SRC_ALPHA,
    [Hl]: i.ONE_MINUS_DST_COLOR,
    [Bl]: i.ONE_MINUS_DST_ALPHA,
    [Gl]: i.CONSTANT_COLOR,
    [kl]: i.ONE_MINUS_CONSTANT_COLOR,
    [Wl]: i.CONSTANT_ALPHA,
    [Xl]: i.ONE_MINUS_CONSTANT_ALPHA
  };
  function A(P, nt, H, j, lt, ot, Ct, ie, ge, jt) {
    if (P === Sn) {
      x === !0 && (Tt(i.BLEND), x = !1);
      return;
    }
    if (x === !1 && (rt(i.BLEND), x = !0), P !== Rl) {
      if (P !== p || jt !== S) {
        if ((u !== Un || E !== Un) && (i.blendEquation(i.FUNC_ADD), u = Un, E = Un), jt)
          switch (P) {
            case oi:
              i.blendFuncSeparate(i.ONE, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case _a:
              i.blendFunc(i.ONE, i.ONE);
              break;
            case ga:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case va:
              i.blendFuncSeparate(i.ZERO, i.SRC_COLOR, i.ZERO, i.SRC_ALPHA);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", P);
              break;
          }
        else
          switch (P) {
            case oi:
              i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case _a:
              i.blendFunc(i.SRC_ALPHA, i.ONE);
              break;
            case ga:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case va:
              i.blendFunc(i.ZERO, i.SRC_COLOR);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", P);
              break;
          }
        b = null, T = null, U = null, w = null, R.set(0, 0, 0), N = 0, p = P, S = jt;
      }
      return;
    }
    lt = lt || nt, ot = ot || H, Ct = Ct || j, (nt !== u || lt !== E) && (i.blendEquationSeparate(Ht[nt], Ht[lt]), u = nt, E = lt), (H !== b || j !== T || ot !== U || Ct !== w) && (i.blendFuncSeparate(ae[H], ae[j], ae[ot], ae[Ct]), b = H, T = j, U = ot, w = Ct), (ie.equals(R) === !1 || ge !== N) && (i.blendColor(ie.r, ie.g, ie.b, ge), R.copy(ie), N = ge), p = P, S = !1;
  }
  function Le(P, nt) {
    P.side === sn ? Tt(i.CULL_FACE) : rt(i.CULL_FACE);
    let H = P.side === Ae;
    nt && (H = !H), Ot(H), P.blending === oi && P.transparent === !1 ? A(Sn) : A(P.blending, P.blendEquation, P.blendSrc, P.blendDst, P.blendEquationAlpha, P.blendSrcAlpha, P.blendDstAlpha, P.blendColor, P.blendAlpha, P.premultipliedAlpha), a.setFunc(P.depthFunc), a.setTest(P.depthTest), a.setMask(P.depthWrite), r.setMask(P.colorWrite);
    const j = P.stencilWrite;
    o.setTest(j), j && (o.setMask(P.stencilWriteMask), o.setFunc(P.stencilFunc, P.stencilRef, P.stencilFuncMask), o.setOp(P.stencilFail, P.stencilZFail, P.stencilZPass)), Qt(P.polygonOffset, P.polygonOffsetFactor, P.polygonOffsetUnits), P.alphaToCoverage === !0 ? rt(i.SAMPLE_ALPHA_TO_COVERAGE) : Tt(i.SAMPLE_ALPHA_TO_COVERAGE);
  }
  function Ot(P) {
    M !== P && (P ? i.frontFace(i.CW) : i.frontFace(i.CCW), M = P);
  }
  function Bt(P) {
    P !== bl ? (rt(i.CULL_FACE), P !== C && (P === ma ? i.cullFace(i.BACK) : P === Al ? i.cullFace(i.FRONT) : i.cullFace(i.FRONT_AND_BACK))) : Tt(i.CULL_FACE), C = P;
  }
  function Mt(P) {
    P !== k && (G && i.lineWidth(P), k = P);
  }
  function Qt(P, nt, H) {
    P ? (rt(i.POLYGON_OFFSET_FILL), (z !== nt || X !== H) && (i.polygonOffset(nt, H), z = nt, X = H)) : Tt(i.POLYGON_OFFSET_FILL);
  }
  function vt(P) {
    P ? rt(i.SCISSOR_TEST) : Tt(i.SCISSOR_TEST);
  }
  function y(P) {
    P === void 0 && (P = i.TEXTURE0 + K - 1), st !== P && (i.activeTexture(P), st = P);
  }
  function _(P, nt, H) {
    H === void 0 && (st === null ? H = i.TEXTURE0 + K - 1 : H = st);
    let j = ht[H];
    j === void 0 && (j = { type: void 0, texture: void 0 }, ht[H] = j), (j.type !== P || j.texture !== nt) && (st !== H && (i.activeTexture(H), st = H), i.bindTexture(P, nt || mt[P]), j.type = P, j.texture = nt);
  }
  function F() {
    const P = ht[st];
    P !== void 0 && P.type !== void 0 && (i.bindTexture(P.type, null), P.type = void 0, P.texture = void 0);
  }
  function q() {
    try {
      i.compressedTexImage2D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function Z() {
    try {
      i.compressedTexImage3D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function W() {
    try {
      i.texSubImage2D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function gt() {
    try {
      i.texSubImage3D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function at() {
    try {
      i.compressedTexSubImage2D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function ut() {
    try {
      i.compressedTexSubImage3D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function Vt() {
    try {
      i.texStorage2D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function J() {
    try {
      i.texStorage3D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function dt() {
    try {
      i.texImage2D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function yt() {
    try {
      i.texImage3D.apply(i, arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function bt(P) {
    $t.equals(P) === !1 && (i.scissor(P.x, P.y, P.z, P.w), $t.copy(P));
  }
  function ft(P) {
    Y.equals(P) === !1 && (i.viewport(P.x, P.y, P.z, P.w), Y.copy(P));
  }
  function zt(P, nt) {
    let H = c.get(nt);
    H === void 0 && (H = /* @__PURE__ */ new WeakMap(), c.set(nt, H));
    let j = H.get(P);
    j === void 0 && (j = i.getUniformBlockIndex(nt, P.name), H.set(P, j));
  }
  function Lt(P, nt) {
    const j = c.get(nt).get(P);
    l.get(nt) !== j && (i.uniformBlockBinding(nt, j, P.__bindingPointIndex), l.set(nt, j));
  }
  function Jt() {
    i.disable(i.BLEND), i.disable(i.CULL_FACE), i.disable(i.DEPTH_TEST), i.disable(i.POLYGON_OFFSET_FILL), i.disable(i.SCISSOR_TEST), i.disable(i.STENCIL_TEST), i.disable(i.SAMPLE_ALPHA_TO_COVERAGE), i.blendEquation(i.FUNC_ADD), i.blendFunc(i.ONE, i.ZERO), i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO), i.blendColor(0, 0, 0, 0), i.colorMask(!0, !0, !0, !0), i.clearColor(0, 0, 0, 0), i.depthMask(!0), i.depthFunc(i.LESS), a.setReversed(!1), i.clearDepth(1), i.stencilMask(4294967295), i.stencilFunc(i.ALWAYS, 0, 4294967295), i.stencilOp(i.KEEP, i.KEEP, i.KEEP), i.clearStencil(0), i.cullFace(i.BACK), i.frontFace(i.CCW), i.polygonOffset(0, 0), i.activeTexture(i.TEXTURE0), i.bindFramebuffer(i.FRAMEBUFFER, null), i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), i.bindFramebuffer(i.READ_FRAMEBUFFER, null), i.useProgram(null), i.lineWidth(1), i.scissor(0, 0, i.canvas.width, i.canvas.height), i.viewport(0, 0, i.canvas.width, i.canvas.height), h = {}, st = null, ht = {}, d = {}, f = /* @__PURE__ */ new WeakMap(), m = [], g = null, x = !1, p = null, u = null, b = null, T = null, E = null, U = null, w = null, R = new Xt(0, 0, 0), N = 0, S = !1, M = null, C = null, k = null, z = null, X = null, $t.set(0, 0, i.canvas.width, i.canvas.height), Y.set(0, 0, i.canvas.width, i.canvas.height), r.reset(), a.reset(), o.reset();
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
    drawBuffers: Nt,
    useProgram: ne,
    setBlending: A,
    setMaterial: Le,
    setFlipSided: Ot,
    setCullFace: Bt,
    setLineWidth: Mt,
    setPolygonOffset: Qt,
    setScissorTest: vt,
    activeTexture: y,
    bindTexture: _,
    unbindTexture: F,
    compressedTexImage2D: q,
    compressedTexImage3D: Z,
    texImage2D: dt,
    texImage3D: yt,
    updateUBOMapping: zt,
    uniformBlockBinding: Lt,
    texStorage2D: Vt,
    texStorage3D: J,
    texSubImage2D: W,
    texSubImage3D: gt,
    compressedTexSubImage2D: at,
    compressedTexSubImage3D: ut,
    scissor: bt,
    viewport: ft,
    reset: Jt
  };
}
function Ap(i, t, e, n, s, r, a) {
  const o = t.has("WEBGL_multisampled_render_to_texture") ? t.get("WEBGL_multisampled_render_to_texture") : null, l = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), c = new Dt(), h = /* @__PURE__ */ new WeakMap();
  let d;
  const f = /* @__PURE__ */ new WeakMap();
  let m = !1;
  try {
    m = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {
  }
  function g(y, _) {
    return m ? (
      // eslint-disable-next-line compat/compat
      new OffscreenCanvas(y, _)
    ) : _s("canvas");
  }
  function x(y, _, F) {
    let q = 1;
    const Z = vt(y);
    if ((Z.width > F || Z.height > F) && (q = F / Math.max(Z.width, Z.height)), q < 1)
      if (typeof HTMLImageElement < "u" && y instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && y instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && y instanceof ImageBitmap || typeof VideoFrame < "u" && y instanceof VideoFrame) {
        const W = Math.floor(q * Z.width), gt = Math.floor(q * Z.height);
        d === void 0 && (d = g(W, gt));
        const at = _ ? g(W, gt) : d;
        return at.width = W, at.height = gt, at.getContext("2d").drawImage(y, 0, 0, W, gt), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + Z.width + "x" + Z.height + ") to (" + W + "x" + gt + ")."), at;
      } else
        return "data" in y && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + Z.width + "x" + Z.height + ")."), y;
    return y;
  }
  function p(y) {
    return y.generateMipmaps;
  }
  function u(y) {
    i.generateMipmap(y);
  }
  function b(y) {
    return y.isWebGLCubeRenderTarget ? i.TEXTURE_CUBE_MAP : y.isWebGL3DRenderTarget ? i.TEXTURE_3D : y.isWebGLArrayRenderTarget || y.isCompressedArrayTexture ? i.TEXTURE_2D_ARRAY : i.TEXTURE_2D;
  }
  function T(y, _, F, q, Z = !1) {
    if (y !== null) {
      if (i[y] !== void 0) return i[y];
      console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + y + "'");
    }
    let W = _;
    if (_ === i.RED && (F === i.FLOAT && (W = i.R32F), F === i.HALF_FLOAT && (W = i.R16F), F === i.UNSIGNED_BYTE && (W = i.R8)), _ === i.RED_INTEGER && (F === i.UNSIGNED_BYTE && (W = i.R8UI), F === i.UNSIGNED_SHORT && (W = i.R16UI), F === i.UNSIGNED_INT && (W = i.R32UI), F === i.BYTE && (W = i.R8I), F === i.SHORT && (W = i.R16I), F === i.INT && (W = i.R32I)), _ === i.RG && (F === i.FLOAT && (W = i.RG32F), F === i.HALF_FLOAT && (W = i.RG16F), F === i.UNSIGNED_BYTE && (W = i.RG8)), _ === i.RG_INTEGER && (F === i.UNSIGNED_BYTE && (W = i.RG8UI), F === i.UNSIGNED_SHORT && (W = i.RG16UI), F === i.UNSIGNED_INT && (W = i.RG32UI), F === i.BYTE && (W = i.RG8I), F === i.SHORT && (W = i.RG16I), F === i.INT && (W = i.RG32I)), _ === i.RGB_INTEGER && (F === i.UNSIGNED_BYTE && (W = i.RGB8UI), F === i.UNSIGNED_SHORT && (W = i.RGB16UI), F === i.UNSIGNED_INT && (W = i.RGB32UI), F === i.BYTE && (W = i.RGB8I), F === i.SHORT && (W = i.RGB16I), F === i.INT && (W = i.RGB32I)), _ === i.RGBA_INTEGER && (F === i.UNSIGNED_BYTE && (W = i.RGBA8UI), F === i.UNSIGNED_SHORT && (W = i.RGBA16UI), F === i.UNSIGNED_INT && (W = i.RGBA32UI), F === i.BYTE && (W = i.RGBA8I), F === i.SHORT && (W = i.RGBA16I), F === i.INT && (W = i.RGBA32I)), _ === i.RGB && F === i.UNSIGNED_INT_5_9_9_9_REV && (W = i.RGB9_E5), _ === i.RGBA) {
      const gt = Z ? fs : Wt.getTransfer(q);
      F === i.FLOAT && (W = i.RGBA32F), F === i.HALF_FLOAT && (W = i.RGBA16F), F === i.UNSIGNED_BYTE && (W = gt === Zt ? i.SRGB8_ALPHA8 : i.RGBA8), F === i.UNSIGNED_SHORT_4_4_4_4 && (W = i.RGBA4), F === i.UNSIGNED_SHORT_5_5_5_1 && (W = i.RGB5_A1);
    }
    return (W === i.R16F || W === i.R32F || W === i.RG16F || W === i.RG32F || W === i.RGBA16F || W === i.RGBA32F) && t.get("EXT_color_buffer_float"), W;
  }
  function E(y, _) {
    let F;
    return y ? _ === null || _ === On || _ === fi ? F = i.DEPTH24_STENCIL8 : _ === rn ? F = i.DEPTH32F_STENCIL8 : _ === wi && (F = i.DEPTH24_STENCIL8, console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : _ === null || _ === On || _ === fi ? F = i.DEPTH_COMPONENT24 : _ === rn ? F = i.DEPTH_COMPONENT32F : _ === wi && (F = i.DEPTH_COMPONENT16), F;
  }
  function U(y, _) {
    return p(y) === !0 || y.isFramebufferTexture && y.minFilter !== qe && y.minFilter !== Ze ? Math.log2(Math.max(_.width, _.height)) + 1 : y.mipmaps !== void 0 && y.mipmaps.length > 0 ? y.mipmaps.length : y.isCompressedTexture && Array.isArray(y.image) ? _.mipmaps.length : 1;
  }
  function w(y) {
    const _ = y.target;
    _.removeEventListener("dispose", w), N(_), _.isVideoTexture && h.delete(_);
  }
  function R(y) {
    const _ = y.target;
    _.removeEventListener("dispose", R), M(_);
  }
  function N(y) {
    const _ = n.get(y);
    if (_.__webglInit === void 0) return;
    const F = y.source, q = f.get(F);
    if (q) {
      const Z = q[_.__cacheKey];
      Z.usedTimes--, Z.usedTimes === 0 && S(y), Object.keys(q).length === 0 && f.delete(F);
    }
    n.remove(y);
  }
  function S(y) {
    const _ = n.get(y);
    i.deleteTexture(_.__webglTexture);
    const F = y.source, q = f.get(F);
    delete q[_.__cacheKey], a.memory.textures--;
  }
  function M(y) {
    const _ = n.get(y);
    if (y.depthTexture && (y.depthTexture.dispose(), n.remove(y.depthTexture)), y.isWebGLCubeRenderTarget)
      for (let q = 0; q < 6; q++) {
        if (Array.isArray(_.__webglFramebuffer[q]))
          for (let Z = 0; Z < _.__webglFramebuffer[q].length; Z++) i.deleteFramebuffer(_.__webglFramebuffer[q][Z]);
        else
          i.deleteFramebuffer(_.__webglFramebuffer[q]);
        _.__webglDepthbuffer && i.deleteRenderbuffer(_.__webglDepthbuffer[q]);
      }
    else {
      if (Array.isArray(_.__webglFramebuffer))
        for (let q = 0; q < _.__webglFramebuffer.length; q++) i.deleteFramebuffer(_.__webglFramebuffer[q]);
      else
        i.deleteFramebuffer(_.__webglFramebuffer);
      if (_.__webglDepthbuffer && i.deleteRenderbuffer(_.__webglDepthbuffer), _.__webglMultisampledFramebuffer && i.deleteFramebuffer(_.__webglMultisampledFramebuffer), _.__webglColorRenderbuffer)
        for (let q = 0; q < _.__webglColorRenderbuffer.length; q++)
          _.__webglColorRenderbuffer[q] && i.deleteRenderbuffer(_.__webglColorRenderbuffer[q]);
      _.__webglDepthRenderbuffer && i.deleteRenderbuffer(_.__webglDepthRenderbuffer);
    }
    const F = y.textures;
    for (let q = 0, Z = F.length; q < Z; q++) {
      const W = n.get(F[q]);
      W.__webglTexture && (i.deleteTexture(W.__webglTexture), a.memory.textures--), n.remove(F[q]);
    }
    n.remove(y);
  }
  let C = 0;
  function k() {
    C = 0;
  }
  function z() {
    const y = C;
    return y >= s.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + y + " texture units while this GPU supports only " + s.maxTextures), C += 1, y;
  }
  function X(y) {
    const _ = [];
    return _.push(y.wrapS), _.push(y.wrapT), _.push(y.wrapR || 0), _.push(y.magFilter), _.push(y.minFilter), _.push(y.anisotropy), _.push(y.internalFormat), _.push(y.format), _.push(y.type), _.push(y.generateMipmaps), _.push(y.premultiplyAlpha), _.push(y.flipY), _.push(y.unpackAlignment), _.push(y.colorSpace), _.join();
  }
  function K(y, _) {
    const F = n.get(y);
    if (y.isVideoTexture && Mt(y), y.isRenderTargetTexture === !1 && y.version > 0 && F.__version !== y.version) {
      const q = y.image;
      if (q === null)
        console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
      else if (q.complete === !1)
        console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        Y(F, y, _);
        return;
      }
    }
    e.bindTexture(i.TEXTURE_2D, F.__webglTexture, i.TEXTURE0 + _);
  }
  function G(y, _) {
    const F = n.get(y);
    if (y.version > 0 && F.__version !== y.version) {
      Y(F, y, _);
      return;
    }
    e.bindTexture(i.TEXTURE_2D_ARRAY, F.__webglTexture, i.TEXTURE0 + _);
  }
  function Q(y, _) {
    const F = n.get(y);
    if (y.version > 0 && F.__version !== y.version) {
      Y(F, y, _);
      return;
    }
    e.bindTexture(i.TEXTURE_3D, F.__webglTexture, i.TEXTURE0 + _);
  }
  function V(y, _) {
    const F = n.get(y);
    if (y.version > 0 && F.__version !== y.version) {
      tt(F, y, _);
      return;
    }
    e.bindTexture(i.TEXTURE_CUBE_MAP, F.__webglTexture, i.TEXTURE0 + _);
  }
  const st = {
    [gr]: i.REPEAT,
    [Nn]: i.CLAMP_TO_EDGE,
    [vr]: i.MIRRORED_REPEAT
  }, ht = {
    [qe]: i.NEAREST,
    [ec]: i.NEAREST_MIPMAP_NEAREST,
    [Ni]: i.NEAREST_MIPMAP_LINEAR,
    [Ze]: i.LINEAR,
    [ws]: i.LINEAR_MIPMAP_NEAREST,
    [Fn]: i.LINEAR_MIPMAP_LINEAR
  }, xt = {
    [ac]: i.NEVER,
    [dc]: i.ALWAYS,
    [oc]: i.LESS,
    [jo]: i.LEQUAL,
    [lc]: i.EQUAL,
    [uc]: i.GEQUAL,
    [cc]: i.GREATER,
    [hc]: i.NOTEQUAL
  };
  function It(y, _) {
    if (_.type === rn && t.has("OES_texture_float_linear") === !1 && (_.magFilter === Ze || _.magFilter === ws || _.magFilter === Ni || _.magFilter === Fn || _.minFilter === Ze || _.minFilter === ws || _.minFilter === Ni || _.minFilter === Fn) && console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), i.texParameteri(y, i.TEXTURE_WRAP_S, st[_.wrapS]), i.texParameteri(y, i.TEXTURE_WRAP_T, st[_.wrapT]), (y === i.TEXTURE_3D || y === i.TEXTURE_2D_ARRAY) && i.texParameteri(y, i.TEXTURE_WRAP_R, st[_.wrapR]), i.texParameteri(y, i.TEXTURE_MAG_FILTER, ht[_.magFilter]), i.texParameteri(y, i.TEXTURE_MIN_FILTER, ht[_.minFilter]), _.compareFunction && (i.texParameteri(y, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE), i.texParameteri(y, i.TEXTURE_COMPARE_FUNC, xt[_.compareFunction])), t.has("EXT_texture_filter_anisotropic") === !0) {
      if (_.magFilter === qe || _.minFilter !== Ni && _.minFilter !== Fn || _.type === rn && t.has("OES_texture_float_linear") === !1) return;
      if (_.anisotropy > 1 || n.get(_).__currentAnisotropy) {
        const F = t.get("EXT_texture_filter_anisotropic");
        i.texParameterf(y, F.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(_.anisotropy, s.getMaxAnisotropy())), n.get(_).__currentAnisotropy = _.anisotropy;
      }
    }
  }
  function $t(y, _) {
    let F = !1;
    y.__webglInit === void 0 && (y.__webglInit = !0, _.addEventListener("dispose", w));
    const q = _.source;
    let Z = f.get(q);
    Z === void 0 && (Z = {}, f.set(q, Z));
    const W = X(_);
    if (W !== y.__cacheKey) {
      Z[W] === void 0 && (Z[W] = {
        texture: i.createTexture(),
        usedTimes: 0
      }, a.memory.textures++, F = !0), Z[W].usedTimes++;
      const gt = Z[y.__cacheKey];
      gt !== void 0 && (Z[y.__cacheKey].usedTimes--, gt.usedTimes === 0 && S(_)), y.__cacheKey = W, y.__webglTexture = Z[W].texture;
    }
    return F;
  }
  function Y(y, _, F) {
    let q = i.TEXTURE_2D;
    (_.isDataArrayTexture || _.isCompressedArrayTexture) && (q = i.TEXTURE_2D_ARRAY), _.isData3DTexture && (q = i.TEXTURE_3D);
    const Z = $t(y, _), W = _.source;
    e.bindTexture(q, y.__webglTexture, i.TEXTURE0 + F);
    const gt = n.get(W);
    if (W.version !== gt.__version || Z === !0) {
      e.activeTexture(i.TEXTURE0 + F);
      const at = Wt.getPrimaries(Wt.workingColorSpace), ut = _.colorSpace === Mn ? null : Wt.getPrimaries(_.colorSpace), Vt = _.colorSpace === Mn || at === ut ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, _.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, _.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, _.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, Vt);
      let J = x(_.image, !1, s.maxTextureSize);
      J = Qt(_, J);
      const dt = r.convert(_.format, _.colorSpace), yt = r.convert(_.type);
      let bt = T(_.internalFormat, dt, yt, _.colorSpace, _.isVideoTexture);
      It(q, _);
      let ft;
      const zt = _.mipmaps, Lt = _.isVideoTexture !== !0, Jt = gt.__version === void 0 || Z === !0, P = W.dataReady, nt = U(_, J);
      if (_.isDepthTexture)
        bt = E(_.format === pi, _.type), Jt && (Lt ? e.texStorage2D(i.TEXTURE_2D, 1, bt, J.width, J.height) : e.texImage2D(i.TEXTURE_2D, 0, bt, J.width, J.height, 0, dt, yt, null));
      else if (_.isDataTexture)
        if (zt.length > 0) {
          Lt && Jt && e.texStorage2D(i.TEXTURE_2D, nt, bt, zt[0].width, zt[0].height);
          for (let H = 0, j = zt.length; H < j; H++)
            ft = zt[H], Lt ? P && e.texSubImage2D(i.TEXTURE_2D, H, 0, 0, ft.width, ft.height, dt, yt, ft.data) : e.texImage2D(i.TEXTURE_2D, H, bt, ft.width, ft.height, 0, dt, yt, ft.data);
          _.generateMipmaps = !1;
        } else
          Lt ? (Jt && e.texStorage2D(i.TEXTURE_2D, nt, bt, J.width, J.height), P && e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, J.width, J.height, dt, yt, J.data)) : e.texImage2D(i.TEXTURE_2D, 0, bt, J.width, J.height, 0, dt, yt, J.data);
      else if (_.isCompressedTexture)
        if (_.isCompressedArrayTexture) {
          Lt && Jt && e.texStorage3D(i.TEXTURE_2D_ARRAY, nt, bt, zt[0].width, zt[0].height, J.depth);
          for (let H = 0, j = zt.length; H < j; H++)
            if (ft = zt[H], _.format !== Ye)
              if (dt !== null)
                if (Lt) {
                  if (P)
                    if (_.layerUpdates.size > 0) {
                      const lt = Ya(ft.width, ft.height, _.format, _.type);
                      for (const ot of _.layerUpdates) {
                        const Ct = ft.data.subarray(
                          ot * lt / ft.data.BYTES_PER_ELEMENT,
                          (ot + 1) * lt / ft.data.BYTES_PER_ELEMENT
                        );
                        e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, H, 0, 0, ot, ft.width, ft.height, 1, dt, Ct);
                      }
                      _.clearLayerUpdates();
                    } else
                      e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, H, 0, 0, 0, ft.width, ft.height, J.depth, dt, ft.data);
                } else
                  e.compressedTexImage3D(i.TEXTURE_2D_ARRAY, H, bt, ft.width, ft.height, J.depth, 0, ft.data, 0, 0);
              else
                console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
            else
              Lt ? P && e.texSubImage3D(i.TEXTURE_2D_ARRAY, H, 0, 0, 0, ft.width, ft.height, J.depth, dt, yt, ft.data) : e.texImage3D(i.TEXTURE_2D_ARRAY, H, bt, ft.width, ft.height, J.depth, 0, dt, yt, ft.data);
        } else {
          Lt && Jt && e.texStorage2D(i.TEXTURE_2D, nt, bt, zt[0].width, zt[0].height);
          for (let H = 0, j = zt.length; H < j; H++)
            ft = zt[H], _.format !== Ye ? dt !== null ? Lt ? P && e.compressedTexSubImage2D(i.TEXTURE_2D, H, 0, 0, ft.width, ft.height, dt, ft.data) : e.compressedTexImage2D(i.TEXTURE_2D, H, bt, ft.width, ft.height, 0, ft.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Lt ? P && e.texSubImage2D(i.TEXTURE_2D, H, 0, 0, ft.width, ft.height, dt, yt, ft.data) : e.texImage2D(i.TEXTURE_2D, H, bt, ft.width, ft.height, 0, dt, yt, ft.data);
        }
      else if (_.isDataArrayTexture)
        if (Lt) {
          if (Jt && e.texStorage3D(i.TEXTURE_2D_ARRAY, nt, bt, J.width, J.height, J.depth), P)
            if (_.layerUpdates.size > 0) {
              const H = Ya(J.width, J.height, _.format, _.type);
              for (const j of _.layerUpdates) {
                const lt = J.data.subarray(
                  j * H / J.data.BYTES_PER_ELEMENT,
                  (j + 1) * H / J.data.BYTES_PER_ELEMENT
                );
                e.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, j, J.width, J.height, 1, dt, yt, lt);
              }
              _.clearLayerUpdates();
            } else
              e.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, 0, J.width, J.height, J.depth, dt, yt, J.data);
        } else
          e.texImage3D(i.TEXTURE_2D_ARRAY, 0, bt, J.width, J.height, J.depth, 0, dt, yt, J.data);
      else if (_.isData3DTexture)
        Lt ? (Jt && e.texStorage3D(i.TEXTURE_3D, nt, bt, J.width, J.height, J.depth), P && e.texSubImage3D(i.TEXTURE_3D, 0, 0, 0, 0, J.width, J.height, J.depth, dt, yt, J.data)) : e.texImage3D(i.TEXTURE_3D, 0, bt, J.width, J.height, J.depth, 0, dt, yt, J.data);
      else if (_.isFramebufferTexture) {
        if (Jt)
          if (Lt)
            e.texStorage2D(i.TEXTURE_2D, nt, bt, J.width, J.height);
          else {
            let H = J.width, j = J.height;
            for (let lt = 0; lt < nt; lt++)
              e.texImage2D(i.TEXTURE_2D, lt, bt, H, j, 0, dt, yt, null), H >>= 1, j >>= 1;
          }
      } else if (zt.length > 0) {
        if (Lt && Jt) {
          const H = vt(zt[0]);
          e.texStorage2D(i.TEXTURE_2D, nt, bt, H.width, H.height);
        }
        for (let H = 0, j = zt.length; H < j; H++)
          ft = zt[H], Lt ? P && e.texSubImage2D(i.TEXTURE_2D, H, 0, 0, dt, yt, ft) : e.texImage2D(i.TEXTURE_2D, H, bt, dt, yt, ft);
        _.generateMipmaps = !1;
      } else if (Lt) {
        if (Jt) {
          const H = vt(J);
          e.texStorage2D(i.TEXTURE_2D, nt, bt, H.width, H.height);
        }
        P && e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, dt, yt, J);
      } else
        e.texImage2D(i.TEXTURE_2D, 0, bt, dt, yt, J);
      p(_) && u(q), gt.__version = W.version, _.onUpdate && _.onUpdate(_);
    }
    y.__version = _.version;
  }
  function tt(y, _, F) {
    if (_.image.length !== 6) return;
    const q = $t(y, _), Z = _.source;
    e.bindTexture(i.TEXTURE_CUBE_MAP, y.__webglTexture, i.TEXTURE0 + F);
    const W = n.get(Z);
    if (Z.version !== W.__version || q === !0) {
      e.activeTexture(i.TEXTURE0 + F);
      const gt = Wt.getPrimaries(Wt.workingColorSpace), at = _.colorSpace === Mn ? null : Wt.getPrimaries(_.colorSpace), ut = _.colorSpace === Mn || gt === at ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, _.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, _.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, _.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, ut);
      const Vt = _.isCompressedTexture || _.image[0].isCompressedTexture, J = _.image[0] && _.image[0].isDataTexture, dt = [];
      for (let j = 0; j < 6; j++)
        !Vt && !J ? dt[j] = x(_.image[j], !0, s.maxCubemapSize) : dt[j] = J ? _.image[j].image : _.image[j], dt[j] = Qt(_, dt[j]);
      const yt = dt[0], bt = r.convert(_.format, _.colorSpace), ft = r.convert(_.type), zt = T(_.internalFormat, bt, ft, _.colorSpace), Lt = _.isVideoTexture !== !0, Jt = W.__version === void 0 || q === !0, P = Z.dataReady;
      let nt = U(_, yt);
      It(i.TEXTURE_CUBE_MAP, _);
      let H;
      if (Vt) {
        Lt && Jt && e.texStorage2D(i.TEXTURE_CUBE_MAP, nt, zt, yt.width, yt.height);
        for (let j = 0; j < 6; j++) {
          H = dt[j].mipmaps;
          for (let lt = 0; lt < H.length; lt++) {
            const ot = H[lt];
            _.format !== Ye ? bt !== null ? Lt ? P && e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt, 0, 0, ot.width, ot.height, bt, ot.data) : e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt, zt, ot.width, ot.height, 0, ot.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : Lt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt, 0, 0, ot.width, ot.height, bt, ft, ot.data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt, zt, ot.width, ot.height, 0, bt, ft, ot.data);
          }
        }
      } else {
        if (H = _.mipmaps, Lt && Jt) {
          H.length > 0 && nt++;
          const j = vt(dt[0]);
          e.texStorage2D(i.TEXTURE_CUBE_MAP, nt, zt, j.width, j.height);
        }
        for (let j = 0; j < 6; j++)
          if (J) {
            Lt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, 0, 0, dt[j].width, dt[j].height, bt, ft, dt[j].data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, zt, dt[j].width, dt[j].height, 0, bt, ft, dt[j].data);
            for (let lt = 0; lt < H.length; lt++) {
              const Ct = H[lt].image[j].image;
              Lt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt + 1, 0, 0, Ct.width, Ct.height, bt, ft, Ct.data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt + 1, zt, Ct.width, Ct.height, 0, bt, ft, Ct.data);
            }
          } else {
            Lt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, 0, 0, bt, ft, dt[j]) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, zt, bt, ft, dt[j]);
            for (let lt = 0; lt < H.length; lt++) {
              const ot = H[lt];
              Lt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt + 1, 0, 0, bt, ft, ot.image[j]) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, lt + 1, zt, bt, ft, ot.image[j]);
            }
          }
      }
      p(_) && u(i.TEXTURE_CUBE_MAP), W.__version = Z.version, _.onUpdate && _.onUpdate(_);
    }
    y.__version = _.version;
  }
  function mt(y, _, F, q, Z, W) {
    const gt = r.convert(F.format, F.colorSpace), at = r.convert(F.type), ut = T(F.internalFormat, gt, at, F.colorSpace), Vt = n.get(_), J = n.get(F);
    if (J.__renderTarget = _, !Vt.__hasExternalTextures) {
      const dt = Math.max(1, _.width >> W), yt = Math.max(1, _.height >> W);
      Z === i.TEXTURE_3D || Z === i.TEXTURE_2D_ARRAY ? e.texImage3D(Z, W, ut, dt, yt, _.depth, 0, gt, at, null) : e.texImage2D(Z, W, ut, dt, yt, 0, gt, at, null);
    }
    e.bindFramebuffer(i.FRAMEBUFFER, y), Bt(_) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, q, Z, J.__webglTexture, 0, Ot(_)) : (Z === i.TEXTURE_2D || Z >= i.TEXTURE_CUBE_MAP_POSITIVE_X && Z <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z) && i.framebufferTexture2D(i.FRAMEBUFFER, q, Z, J.__webglTexture, W), e.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function rt(y, _, F) {
    if (i.bindRenderbuffer(i.RENDERBUFFER, y), _.depthBuffer) {
      const q = _.depthTexture, Z = q && q.isDepthTexture ? q.type : null, W = E(_.stencilBuffer, Z), gt = _.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, at = Ot(_);
      Bt(_) ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, at, W, _.width, _.height) : F ? i.renderbufferStorageMultisample(i.RENDERBUFFER, at, W, _.width, _.height) : i.renderbufferStorage(i.RENDERBUFFER, W, _.width, _.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, gt, i.RENDERBUFFER, y);
    } else {
      const q = _.textures;
      for (let Z = 0; Z < q.length; Z++) {
        const W = q[Z], gt = r.convert(W.format, W.colorSpace), at = r.convert(W.type), ut = T(W.internalFormat, gt, at, W.colorSpace), Vt = Ot(_);
        F && Bt(_) === !1 ? i.renderbufferStorageMultisample(i.RENDERBUFFER, Vt, ut, _.width, _.height) : Bt(_) ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, Vt, ut, _.width, _.height) : i.renderbufferStorage(i.RENDERBUFFER, ut, _.width, _.height);
      }
    }
    i.bindRenderbuffer(i.RENDERBUFFER, null);
  }
  function Tt(y, _) {
    if (_ && _.isWebGLCubeRenderTarget) throw new Error("Depth Texture with cube render targets is not supported");
    if (e.bindFramebuffer(i.FRAMEBUFFER, y), !(_.depthTexture && _.depthTexture.isDepthTexture))
      throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
    const q = n.get(_.depthTexture);
    q.__renderTarget = _, (!q.__webglTexture || _.depthTexture.image.width !== _.width || _.depthTexture.image.height !== _.height) && (_.depthTexture.image.width = _.width, _.depthTexture.image.height = _.height, _.depthTexture.needsUpdate = !0), K(_.depthTexture, 0);
    const Z = q.__webglTexture, W = Ot(_);
    if (_.depthTexture.format === li)
      Bt(_) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, Z, 0, W) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, Z, 0);
    else if (_.depthTexture.format === pi)
      Bt(_) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, Z, 0, W) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, Z, 0);
    else
      throw new Error("Unknown depthTexture format");
  }
  function wt(y) {
    const _ = n.get(y), F = y.isWebGLCubeRenderTarget === !0;
    if (_.__boundDepthTexture !== y.depthTexture) {
      const q = y.depthTexture;
      if (_.__depthDisposeCallback && _.__depthDisposeCallback(), q) {
        const Z = () => {
          delete _.__boundDepthTexture, delete _.__depthDisposeCallback, q.removeEventListener("dispose", Z);
        };
        q.addEventListener("dispose", Z), _.__depthDisposeCallback = Z;
      }
      _.__boundDepthTexture = q;
    }
    if (y.depthTexture && !_.__autoAllocateDepthBuffer) {
      if (F) throw new Error("target.depthTexture not supported in Cube render targets");
      Tt(_.__webglFramebuffer, y);
    } else if (F) {
      _.__webglDepthbuffer = [];
      for (let q = 0; q < 6; q++)
        if (e.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer[q]), _.__webglDepthbuffer[q] === void 0)
          _.__webglDepthbuffer[q] = i.createRenderbuffer(), rt(_.__webglDepthbuffer[q], y, !1);
        else {
          const Z = y.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, W = _.__webglDepthbuffer[q];
          i.bindRenderbuffer(i.RENDERBUFFER, W), i.framebufferRenderbuffer(i.FRAMEBUFFER, Z, i.RENDERBUFFER, W);
        }
    } else if (e.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer), _.__webglDepthbuffer === void 0)
      _.__webglDepthbuffer = i.createRenderbuffer(), rt(_.__webglDepthbuffer, y, !1);
    else {
      const q = y.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, Z = _.__webglDepthbuffer;
      i.bindRenderbuffer(i.RENDERBUFFER, Z), i.framebufferRenderbuffer(i.FRAMEBUFFER, q, i.RENDERBUFFER, Z);
    }
    e.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function Nt(y, _, F) {
    const q = n.get(y);
    _ !== void 0 && mt(q.__webglFramebuffer, y, y.texture, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, 0), F !== void 0 && wt(y);
  }
  function ne(y) {
    const _ = y.texture, F = n.get(y), q = n.get(_);
    y.addEventListener("dispose", R);
    const Z = y.textures, W = y.isWebGLCubeRenderTarget === !0, gt = Z.length > 1;
    if (gt || (q.__webglTexture === void 0 && (q.__webglTexture = i.createTexture()), q.__version = _.version, a.memory.textures++), W) {
      F.__webglFramebuffer = [];
      for (let at = 0; at < 6; at++)
        if (_.mipmaps && _.mipmaps.length > 0) {
          F.__webglFramebuffer[at] = [];
          for (let ut = 0; ut < _.mipmaps.length; ut++)
            F.__webglFramebuffer[at][ut] = i.createFramebuffer();
        } else
          F.__webglFramebuffer[at] = i.createFramebuffer();
    } else {
      if (_.mipmaps && _.mipmaps.length > 0) {
        F.__webglFramebuffer = [];
        for (let at = 0; at < _.mipmaps.length; at++)
          F.__webglFramebuffer[at] = i.createFramebuffer();
      } else
        F.__webglFramebuffer = i.createFramebuffer();
      if (gt)
        for (let at = 0, ut = Z.length; at < ut; at++) {
          const Vt = n.get(Z[at]);
          Vt.__webglTexture === void 0 && (Vt.__webglTexture = i.createTexture(), a.memory.textures++);
        }
      if (y.samples > 0 && Bt(y) === !1) {
        F.__webglMultisampledFramebuffer = i.createFramebuffer(), F.__webglColorRenderbuffer = [], e.bindFramebuffer(i.FRAMEBUFFER, F.__webglMultisampledFramebuffer);
        for (let at = 0; at < Z.length; at++) {
          const ut = Z[at];
          F.__webglColorRenderbuffer[at] = i.createRenderbuffer(), i.bindRenderbuffer(i.RENDERBUFFER, F.__webglColorRenderbuffer[at]);
          const Vt = r.convert(ut.format, ut.colorSpace), J = r.convert(ut.type), dt = T(ut.internalFormat, Vt, J, ut.colorSpace, y.isXRRenderTarget === !0), yt = Ot(y);
          i.renderbufferStorageMultisample(i.RENDERBUFFER, yt, dt, y.width, y.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + at, i.RENDERBUFFER, F.__webglColorRenderbuffer[at]);
        }
        i.bindRenderbuffer(i.RENDERBUFFER, null), y.depthBuffer && (F.__webglDepthRenderbuffer = i.createRenderbuffer(), rt(F.__webglDepthRenderbuffer, y, !0)), e.bindFramebuffer(i.FRAMEBUFFER, null);
      }
    }
    if (W) {
      e.bindTexture(i.TEXTURE_CUBE_MAP, q.__webglTexture), It(i.TEXTURE_CUBE_MAP, _);
      for (let at = 0; at < 6; at++)
        if (_.mipmaps && _.mipmaps.length > 0)
          for (let ut = 0; ut < _.mipmaps.length; ut++)
            mt(F.__webglFramebuffer[at][ut], y, _, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + at, ut);
        else
          mt(F.__webglFramebuffer[at], y, _, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + at, 0);
      p(_) && u(i.TEXTURE_CUBE_MAP), e.unbindTexture();
    } else if (gt) {
      for (let at = 0, ut = Z.length; at < ut; at++) {
        const Vt = Z[at], J = n.get(Vt);
        e.bindTexture(i.TEXTURE_2D, J.__webglTexture), It(i.TEXTURE_2D, Vt), mt(F.__webglFramebuffer, y, Vt, i.COLOR_ATTACHMENT0 + at, i.TEXTURE_2D, 0), p(Vt) && u(i.TEXTURE_2D);
      }
      e.unbindTexture();
    } else {
      let at = i.TEXTURE_2D;
      if ((y.isWebGL3DRenderTarget || y.isWebGLArrayRenderTarget) && (at = y.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY), e.bindTexture(at, q.__webglTexture), It(at, _), _.mipmaps && _.mipmaps.length > 0)
        for (let ut = 0; ut < _.mipmaps.length; ut++)
          mt(F.__webglFramebuffer[ut], y, _, i.COLOR_ATTACHMENT0, at, ut);
      else
        mt(F.__webglFramebuffer, y, _, i.COLOR_ATTACHMENT0, at, 0);
      p(_) && u(at), e.unbindTexture();
    }
    y.depthBuffer && wt(y);
  }
  function Ht(y) {
    const _ = y.textures;
    for (let F = 0, q = _.length; F < q; F++) {
      const Z = _[F];
      if (p(Z)) {
        const W = b(y), gt = n.get(Z).__webglTexture;
        e.bindTexture(W, gt), u(W), e.unbindTexture();
      }
    }
  }
  const ae = [], A = [];
  function Le(y) {
    if (y.samples > 0) {
      if (Bt(y) === !1) {
        const _ = y.textures, F = y.width, q = y.height;
        let Z = i.COLOR_BUFFER_BIT;
        const W = y.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, gt = n.get(y), at = _.length > 1;
        if (at)
          for (let ut = 0; ut < _.length; ut++)
            e.bindFramebuffer(i.FRAMEBUFFER, gt.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ut, i.RENDERBUFFER, null), e.bindFramebuffer(i.FRAMEBUFFER, gt.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ut, i.TEXTURE_2D, null, 0);
        e.bindFramebuffer(i.READ_FRAMEBUFFER, gt.__webglMultisampledFramebuffer), e.bindFramebuffer(i.DRAW_FRAMEBUFFER, gt.__webglFramebuffer);
        for (let ut = 0; ut < _.length; ut++) {
          if (y.resolveDepthBuffer && (y.depthBuffer && (Z |= i.DEPTH_BUFFER_BIT), y.stencilBuffer && y.resolveStencilBuffer && (Z |= i.STENCIL_BUFFER_BIT)), at) {
            i.framebufferRenderbuffer(i.READ_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.RENDERBUFFER, gt.__webglColorRenderbuffer[ut]);
            const Vt = n.get(_[ut]).__webglTexture;
            i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, Vt, 0);
          }
          i.blitFramebuffer(0, 0, F, q, 0, 0, F, q, Z, i.NEAREST), l === !0 && (ae.length = 0, A.length = 0, ae.push(i.COLOR_ATTACHMENT0 + ut), y.depthBuffer && y.resolveDepthBuffer === !1 && (ae.push(W), A.push(W), i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, A)), i.invalidateFramebuffer(i.READ_FRAMEBUFFER, ae));
        }
        if (e.bindFramebuffer(i.READ_FRAMEBUFFER, null), e.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), at)
          for (let ut = 0; ut < _.length; ut++) {
            e.bindFramebuffer(i.FRAMEBUFFER, gt.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ut, i.RENDERBUFFER, gt.__webglColorRenderbuffer[ut]);
            const Vt = n.get(_[ut]).__webglTexture;
            e.bindFramebuffer(i.FRAMEBUFFER, gt.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + ut, i.TEXTURE_2D, Vt, 0);
          }
        e.bindFramebuffer(i.DRAW_FRAMEBUFFER, gt.__webglMultisampledFramebuffer);
      } else if (y.depthBuffer && y.resolveDepthBuffer === !1 && l) {
        const _ = y.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT;
        i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [_]);
      }
    }
  }
  function Ot(y) {
    return Math.min(s.maxSamples, y.samples);
  }
  function Bt(y) {
    const _ = n.get(y);
    return y.samples > 0 && t.has("WEBGL_multisampled_render_to_texture") === !0 && _.__useRenderToTexture !== !1;
  }
  function Mt(y) {
    const _ = a.render.frame;
    h.get(y) !== _ && (h.set(y, _), y.update());
  }
  function Qt(y, _) {
    const F = y.colorSpace, q = y.format, Z = y.type;
    return y.isCompressedTexture === !0 || y.isVideoTexture === !0 || F !== mi && F !== Mn && (Wt.getTransfer(F) === Zt ? (q !== Ye || Z !== cn) && console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", F)), _;
  }
  function vt(y) {
    return typeof HTMLImageElement < "u" && y instanceof HTMLImageElement ? (c.width = y.naturalWidth || y.width, c.height = y.naturalHeight || y.height) : typeof VideoFrame < "u" && y instanceof VideoFrame ? (c.width = y.displayWidth, c.height = y.displayHeight) : (c.width = y.width, c.height = y.height), c;
  }
  this.allocateTextureUnit = z, this.resetTextureUnits = k, this.setTexture2D = K, this.setTexture2DArray = G, this.setTexture3D = Q, this.setTextureCube = V, this.rebindTextures = Nt, this.setupRenderTarget = ne, this.updateRenderTargetMipmap = Ht, this.updateMultisampleRenderTarget = Le, this.setupDepthRenderbuffer = wt, this.setupFrameBufferTexture = mt, this.useMultisampledRTT = Bt;
}
function wp(i, t) {
  function e(n, s = Mn) {
    let r;
    const a = Wt.getTransfer(s);
    if (n === cn) return i.UNSIGNED_BYTE;
    if (n === Kr) return i.UNSIGNED_SHORT_4_4_4_4;
    if (n === $r) return i.UNSIGNED_SHORT_5_5_5_1;
    if (n === Ho) return i.UNSIGNED_INT_5_9_9_9_REV;
    if (n === Bo) return i.BYTE;
    if (n === zo) return i.SHORT;
    if (n === wi) return i.UNSIGNED_SHORT;
    if (n === Zr) return i.INT;
    if (n === On) return i.UNSIGNED_INT;
    if (n === rn) return i.FLOAT;
    if (n === Ri) return i.HALF_FLOAT;
    if (n === Vo) return i.ALPHA;
    if (n === Go) return i.RGB;
    if (n === Ye) return i.RGBA;
    if (n === ko) return i.LUMINANCE;
    if (n === Wo) return i.LUMINANCE_ALPHA;
    if (n === li) return i.DEPTH_COMPONENT;
    if (n === pi) return i.DEPTH_STENCIL;
    if (n === Xo) return i.RED;
    if (n === Jr) return i.RED_INTEGER;
    if (n === Yo) return i.RG;
    if (n === Qr) return i.RG_INTEGER;
    if (n === ta) return i.RGBA_INTEGER;
    if (n === as || n === os || n === ls || n === cs)
      if (a === Zt)
        if (r = t.get("WEBGL_compressed_texture_s3tc_srgb"), r !== null) {
          if (n === as) return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (n === os) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (n === ls) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (n === cs) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else
          return null;
      else if (r = t.get("WEBGL_compressed_texture_s3tc"), r !== null) {
        if (n === as) return r.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === os) return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === ls) return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === cs) return r.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else
        return null;
    if (n === xr || n === Mr || n === Sr || n === Er)
      if (r = t.get("WEBGL_compressed_texture_pvrtc"), r !== null) {
        if (n === xr) return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === Mr) return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === Sr) return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === Er) return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else
        return null;
    if (n === yr || n === Tr || n === br)
      if (r = t.get("WEBGL_compressed_texture_etc"), r !== null) {
        if (n === yr || n === Tr) return a === Zt ? r.COMPRESSED_SRGB8_ETC2 : r.COMPRESSED_RGB8_ETC2;
        if (n === br) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : r.COMPRESSED_RGBA8_ETC2_EAC;
      } else
        return null;
    if (n === Ar || n === wr || n === Rr || n === Cr || n === Pr || n === Dr || n === Lr || n === Ur || n === Ir || n === Nr || n === Fr || n === Or || n === Br || n === zr)
      if (r = t.get("WEBGL_compressed_texture_astc"), r !== null) {
        if (n === Ar) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : r.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === wr) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : r.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === Rr) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : r.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === Cr) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : r.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === Pr) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : r.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === Dr) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : r.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === Lr) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : r.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === Ur) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : r.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === Ir) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : r.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === Nr) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : r.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === Fr) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : r.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === Or) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : r.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === Br) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : r.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === zr) return a === Zt ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : r.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else
        return null;
    if (n === hs || n === Hr || n === Vr)
      if (r = t.get("EXT_texture_compression_bptc"), r !== null) {
        if (n === hs) return a === Zt ? r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : r.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === Hr) return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === Vr) return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else
        return null;
    if (n === qo || n === Gr || n === kr || n === Wr)
      if (r = t.get("EXT_texture_compression_rgtc"), r !== null) {
        if (n === hs) return r.COMPRESSED_RED_RGTC1_EXT;
        if (n === Gr) return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === kr) return r.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === Wr) return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else
        return null;
    return n === fi ? i.UNSIGNED_INT_24_8 : i[n] !== void 0 ? i[n] : null;
  }
  return { convert: e };
}
const Rp = { type: "move" };
class sr {
  constructor() {
    this._targetRay = null, this._grip = null, this._hand = null;
  }
  getHandSpace() {
    return this._hand === null && (this._hand = new bi(), this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = { pinching: !1 }), this._hand;
  }
  getTargetRaySpace() {
    return this._targetRay === null && (this._targetRay = new bi(), this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new I(), this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new I()), this._targetRay;
  }
  getGripSpace() {
    return this._grip === null && (this._grip = new bi(), this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new I(), this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new I()), this._grip;
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
        const h = c.joints["index-finger-tip"], d = c.joints["thumb-tip"], f = h.position.distanceTo(d.position), m = 0.02, g = 5e-3;
        c.inputState.pinching && f > m + g ? (c.inputState.pinching = !1, this.dispatchEvent({
          type: "pinchend",
          handedness: t.handedness,
          target: this
        })) : !c.inputState.pinching && f <= m - g && (c.inputState.pinching = !0, this.dispatchEvent({
          type: "pinchstart",
          handedness: t.handedness,
          target: this
        }));
      } else
        l !== null && t.gripSpace && (r = e.getPose(t.gripSpace, n), r !== null && (l.matrix.fromArray(r.transform.matrix), l.matrix.decompose(l.position, l.rotation, l.scale), l.matrixWorldNeedsUpdate = !0, r.linearVelocity ? (l.hasLinearVelocity = !0, l.linearVelocity.copy(r.linearVelocity)) : l.hasLinearVelocity = !1, r.angularVelocity ? (l.hasAngularVelocity = !0, l.angularVelocity.copy(r.angularVelocity)) : l.hasAngularVelocity = !1));
      o !== null && (s = e.getPose(t.targetRaySpace, n), s === null && r !== null && (s = r), s !== null && (o.matrix.fromArray(s.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = !0, s.linearVelocity ? (o.hasLinearVelocity = !0, o.linearVelocity.copy(s.linearVelocity)) : o.hasLinearVelocity = !1, s.angularVelocity ? (o.hasAngularVelocity = !0, o.angularVelocity.copy(s.angularVelocity)) : o.hasAngularVelocity = !1, this.dispatchEvent(Rp)));
    }
    return o !== null && (o.visible = s !== null), l !== null && (l.visible = r !== null), c !== null && (c.visible = a !== null), this;
  }
  // private method
  _getHandJoint(t, e) {
    if (t.joints[e.jointName] === void 0) {
      const n = new bi();
      n.matrixAutoUpdate = !1, n.visible = !1, t.joints[e.jointName] = n, t.add(n);
    }
    return t.joints[e.jointName];
  }
}
const Cp = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`, Pp = `
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
class Dp {
  constructor() {
    this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
  }
  init(t, e, n) {
    if (this.texture === null) {
      const s = new we(), r = t.properties.get(s);
      r.__webglTexture = e.texture, (e.depthNear !== n.depthNear || e.depthFar !== n.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = s;
    }
  }
  getMesh(t) {
    if (this.texture !== null && this.mesh === null) {
      const e = t.cameras[0].viewport, n = new un({
        vertexShader: Cp,
        fragmentShader: Pp,
        uniforms: {
          depthColor: { value: this.texture },
          depthWidth: { value: e.z },
          depthHeight: { value: e.w }
        }
      });
      this.mesh = new De(new ys(20, 20), n);
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
class Lp extends Hn {
  constructor(t, e) {
    super();
    const n = this;
    let s = null, r = 1, a = null, o = "local-floor", l = 1, c = null, h = null, d = null, f = null, m = null, g = null;
    const x = new Dp(), p = e.getContextAttributes();
    let u = null, b = null;
    const T = [], E = [], U = new Dt();
    let w = null;
    const R = new Oe();
    R.viewport = new re();
    const N = new Oe();
    N.viewport = new re();
    const S = [R, N], M = new Kc();
    let C = null, k = null;
    this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(Y) {
      let tt = T[Y];
      return tt === void 0 && (tt = new sr(), T[Y] = tt), tt.getTargetRaySpace();
    }, this.getControllerGrip = function(Y) {
      let tt = T[Y];
      return tt === void 0 && (tt = new sr(), T[Y] = tt), tt.getGripSpace();
    }, this.getHand = function(Y) {
      let tt = T[Y];
      return tt === void 0 && (tt = new sr(), T[Y] = tt), tt.getHandSpace();
    };
    function z(Y) {
      const tt = E.indexOf(Y.inputSource);
      if (tt === -1)
        return;
      const mt = T[tt];
      mt !== void 0 && (mt.update(Y.inputSource, Y.frame, c || a), mt.dispatchEvent({ type: Y.type, data: Y.inputSource }));
    }
    function X() {
      s.removeEventListener("select", z), s.removeEventListener("selectstart", z), s.removeEventListener("selectend", z), s.removeEventListener("squeeze", z), s.removeEventListener("squeezestart", z), s.removeEventListener("squeezeend", z), s.removeEventListener("end", X), s.removeEventListener("inputsourceschange", K);
      for (let Y = 0; Y < T.length; Y++) {
        const tt = E[Y];
        tt !== null && (E[Y] = null, T[Y].disconnect(tt));
      }
      C = null, k = null, x.reset(), t.setRenderTarget(u), m = null, f = null, d = null, s = null, b = null, $t.stop(), n.isPresenting = !1, t.setPixelRatio(w), t.setSize(U.width, U.height, !1), n.dispatchEvent({ type: "sessionend" });
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
      return g;
    }, this.getSession = function() {
      return s;
    }, this.setSession = async function(Y) {
      if (s = Y, s !== null) {
        if (u = t.getRenderTarget(), s.addEventListener("select", z), s.addEventListener("selectstart", z), s.addEventListener("selectend", z), s.addEventListener("squeeze", z), s.addEventListener("squeezestart", z), s.addEventListener("squeezeend", z), s.addEventListener("end", X), s.addEventListener("inputsourceschange", K), p.xrCompatible !== !0 && await e.makeXRCompatible(), w = t.getPixelRatio(), t.getSize(U), s.enabledFeatures !== void 0 && s.enabledFeatures.includes("layers")) {
          let mt = null, rt = null, Tt = null;
          p.depth && (Tt = p.stencil ? e.DEPTH24_STENCIL8 : e.DEPTH_COMPONENT24, mt = p.stencil ? pi : li, rt = p.stencil ? fi : On);
          const wt = {
            colorFormat: e.RGBA8,
            depthFormat: Tt,
            scaleFactor: r
          };
          d = new XRWebGLBinding(s, e), f = d.createProjectionLayer(wt), s.updateRenderState({ layers: [f] }), t.setPixelRatio(1), t.setSize(f.textureWidth, f.textureHeight, !1), b = new Bn(
            f.textureWidth,
            f.textureHeight,
            {
              format: Ye,
              type: cn,
              depthTexture: new sl(f.textureWidth, f.textureHeight, rt, void 0, void 0, void 0, void 0, void 0, void 0, mt),
              stencilBuffer: p.stencil,
              colorSpace: t.outputColorSpace,
              samples: p.antialias ? 4 : 0,
              resolveDepthBuffer: f.ignoreDepthValues === !1
            }
          );
        } else {
          const mt = {
            antialias: p.antialias,
            alpha: !0,
            depth: p.depth,
            stencil: p.stencil,
            framebufferScaleFactor: r
          };
          m = new XRWebGLLayer(s, e, mt), s.updateRenderState({ baseLayer: m }), t.setPixelRatio(1), t.setSize(m.framebufferWidth, m.framebufferHeight, !1), b = new Bn(
            m.framebufferWidth,
            m.framebufferHeight,
            {
              format: Ye,
              type: cn,
              colorSpace: t.outputColorSpace,
              stencilBuffer: p.stencil
            }
          );
        }
        b.isXRRenderTarget = !0, this.setFoveation(l), c = null, a = await s.requestReferenceSpace(o), $t.setContext(s), $t.start(), n.isPresenting = !0, n.dispatchEvent({ type: "sessionstart" });
      }
    }, this.getEnvironmentBlendMode = function() {
      if (s !== null)
        return s.environmentBlendMode;
    }, this.getDepthTexture = function() {
      return x.getDepthTexture();
    };
    function K(Y) {
      for (let tt = 0; tt < Y.removed.length; tt++) {
        const mt = Y.removed[tt], rt = E.indexOf(mt);
        rt >= 0 && (E[rt] = null, T[rt].disconnect(mt));
      }
      for (let tt = 0; tt < Y.added.length; tt++) {
        const mt = Y.added[tt];
        let rt = E.indexOf(mt);
        if (rt === -1) {
          for (let wt = 0; wt < T.length; wt++)
            if (wt >= E.length) {
              E.push(mt), rt = wt;
              break;
            } else if (E[wt] === null) {
              E[wt] = mt, rt = wt;
              break;
            }
          if (rt === -1) break;
        }
        const Tt = T[rt];
        Tt && Tt.connect(mt);
      }
    }
    const G = new I(), Q = new I();
    function V(Y, tt, mt) {
      G.setFromMatrixPosition(tt.matrixWorld), Q.setFromMatrixPosition(mt.matrixWorld);
      const rt = G.distanceTo(Q), Tt = tt.projectionMatrix.elements, wt = mt.projectionMatrix.elements, Nt = Tt[14] / (Tt[10] - 1), ne = Tt[14] / (Tt[10] + 1), Ht = (Tt[9] + 1) / Tt[5], ae = (Tt[9] - 1) / Tt[5], A = (Tt[8] - 1) / Tt[0], Le = (wt[8] + 1) / wt[0], Ot = Nt * A, Bt = Nt * Le, Mt = rt / (-A + Le), Qt = Mt * -A;
      if (tt.matrixWorld.decompose(Y.position, Y.quaternion, Y.scale), Y.translateX(Qt), Y.translateZ(Mt), Y.matrixWorld.compose(Y.position, Y.quaternion, Y.scale), Y.matrixWorldInverse.copy(Y.matrixWorld).invert(), Tt[10] === -1)
        Y.projectionMatrix.copy(tt.projectionMatrix), Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse);
      else {
        const vt = Nt + Mt, y = ne + Mt, _ = Ot - Qt, F = Bt + (rt - Qt), q = Ht * ne / y * vt, Z = ae * ne / y * vt;
        Y.projectionMatrix.makePerspective(_, F, q, Z, vt, y), Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert();
      }
    }
    function st(Y, tt) {
      tt === null ? Y.matrixWorld.copy(Y.matrix) : Y.matrixWorld.multiplyMatrices(tt.matrixWorld, Y.matrix), Y.matrixWorldInverse.copy(Y.matrixWorld).invert();
    }
    this.updateCamera = function(Y) {
      if (s === null) return;
      let tt = Y.near, mt = Y.far;
      x.texture !== null && (x.depthNear > 0 && (tt = x.depthNear), x.depthFar > 0 && (mt = x.depthFar)), M.near = N.near = R.near = tt, M.far = N.far = R.far = mt, (C !== M.near || k !== M.far) && (s.updateRenderState({
        depthNear: M.near,
        depthFar: M.far
      }), C = M.near, k = M.far), R.layers.mask = Y.layers.mask | 2, N.layers.mask = Y.layers.mask | 4, M.layers.mask = R.layers.mask | N.layers.mask;
      const rt = Y.parent, Tt = M.cameras;
      st(M, rt);
      for (let wt = 0; wt < Tt.length; wt++)
        st(Tt[wt], rt);
      Tt.length === 2 ? V(M, R, N) : M.projectionMatrix.copy(R.projectionMatrix), ht(Y, M, rt);
    };
    function ht(Y, tt, mt) {
      mt === null ? Y.matrix.copy(tt.matrixWorld) : (Y.matrix.copy(mt.matrixWorld), Y.matrix.invert(), Y.matrix.multiply(tt.matrixWorld)), Y.matrix.decompose(Y.position, Y.quaternion, Y.scale), Y.updateMatrixWorld(!0), Y.projectionMatrix.copy(tt.projectionMatrix), Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse), Y.isPerspectiveCamera && (Y.fov = Xr * 2 * Math.atan(1 / Y.projectionMatrix.elements[5]), Y.zoom = 1);
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
    function It(Y, tt) {
      if (h = tt.getViewerPose(c || a), g = tt, h !== null) {
        const mt = h.views;
        m !== null && (t.setRenderTargetFramebuffer(b, m.framebuffer), t.setRenderTarget(b));
        let rt = !1;
        mt.length !== M.cameras.length && (M.cameras.length = 0, rt = !0);
        for (let wt = 0; wt < mt.length; wt++) {
          const Nt = mt[wt];
          let ne = null;
          if (m !== null)
            ne = m.getViewport(Nt);
          else {
            const ae = d.getViewSubImage(f, Nt);
            ne = ae.viewport, wt === 0 && (t.setRenderTargetTextures(
              b,
              ae.colorTexture,
              f.ignoreDepthValues ? void 0 : ae.depthStencilTexture
            ), t.setRenderTarget(b));
          }
          let Ht = S[wt];
          Ht === void 0 && (Ht = new Oe(), Ht.layers.enable(wt), Ht.viewport = new re(), S[wt] = Ht), Ht.matrix.fromArray(Nt.transform.matrix), Ht.matrix.decompose(Ht.position, Ht.quaternion, Ht.scale), Ht.projectionMatrix.fromArray(Nt.projectionMatrix), Ht.projectionMatrixInverse.copy(Ht.projectionMatrix).invert(), Ht.viewport.set(ne.x, ne.y, ne.width, ne.height), wt === 0 && (M.matrix.copy(Ht.matrix), M.matrix.decompose(M.position, M.quaternion, M.scale)), rt === !0 && M.cameras.push(Ht);
        }
        const Tt = s.enabledFeatures;
        if (Tt && Tt.includes("depth-sensing")) {
          const wt = d.getDepthInformation(mt[0]);
          wt && wt.isValid && wt.texture && x.init(t, wt, s.renderState);
        }
      }
      for (let mt = 0; mt < T.length; mt++) {
        const rt = E[mt], Tt = T[mt];
        rt !== null && Tt !== void 0 && Tt.update(rt, tt, c || a);
      }
      xt && xt(Y, tt), tt.detectedPlanes && n.dispatchEvent({ type: "planesdetected", data: tt }), g = null;
    }
    const $t = new cl();
    $t.setAnimationLoop(It), this.setAnimationLoop = function(Y) {
      xt = Y;
    }, this.dispose = function() {
    };
  }
}
const Dn = /* @__PURE__ */ new hn(), Up = /* @__PURE__ */ new ee();
function Ip(i, t) {
  function e(p, u) {
    p.matrixAutoUpdate === !0 && p.updateMatrix(), u.value.copy(p.matrix);
  }
  function n(p, u) {
    u.color.getRGB(p.fogColor.value, el(i)), u.isFog ? (p.fogNear.value = u.near, p.fogFar.value = u.far) : u.isFogExp2 && (p.fogDensity.value = u.density);
  }
  function s(p, u, b, T, E) {
    u.isMeshBasicMaterial || u.isMeshLambertMaterial ? r(p, u) : u.isMeshToonMaterial ? (r(p, u), d(p, u)) : u.isMeshPhongMaterial ? (r(p, u), h(p, u)) : u.isMeshStandardMaterial ? (r(p, u), f(p, u), u.isMeshPhysicalMaterial && m(p, u, E)) : u.isMeshMatcapMaterial ? (r(p, u), g(p, u)) : u.isMeshDepthMaterial ? r(p, u) : u.isMeshDistanceMaterial ? (r(p, u), x(p, u)) : u.isMeshNormalMaterial ? r(p, u) : u.isLineBasicMaterial ? (a(p, u), u.isLineDashedMaterial && o(p, u)) : u.isPointsMaterial ? l(p, u, b, T) : u.isSpriteMaterial ? c(p, u) : u.isShadowMaterial ? (p.color.value.copy(u.color), p.opacity.value = u.opacity) : u.isShaderMaterial && (u.uniformsNeedUpdate = !1);
  }
  function r(p, u) {
    p.opacity.value = u.opacity, u.color && p.diffuse.value.copy(u.color), u.emissive && p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity), u.map && (p.map.value = u.map, e(u.map, p.mapTransform)), u.alphaMap && (p.alphaMap.value = u.alphaMap, e(u.alphaMap, p.alphaMapTransform)), u.bumpMap && (p.bumpMap.value = u.bumpMap, e(u.bumpMap, p.bumpMapTransform), p.bumpScale.value = u.bumpScale, u.side === Ae && (p.bumpScale.value *= -1)), u.normalMap && (p.normalMap.value = u.normalMap, e(u.normalMap, p.normalMapTransform), p.normalScale.value.copy(u.normalScale), u.side === Ae && p.normalScale.value.negate()), u.displacementMap && (p.displacementMap.value = u.displacementMap, e(u.displacementMap, p.displacementMapTransform), p.displacementScale.value = u.displacementScale, p.displacementBias.value = u.displacementBias), u.emissiveMap && (p.emissiveMap.value = u.emissiveMap, e(u.emissiveMap, p.emissiveMapTransform)), u.specularMap && (p.specularMap.value = u.specularMap, e(u.specularMap, p.specularMapTransform)), u.alphaTest > 0 && (p.alphaTest.value = u.alphaTest);
    const b = t.get(u), T = b.envMap, E = b.envMapRotation;
    T && (p.envMap.value = T, Dn.copy(E), Dn.x *= -1, Dn.y *= -1, Dn.z *= -1, T.isCubeTexture && T.isRenderTargetTexture === !1 && (Dn.y *= -1, Dn.z *= -1), p.envMapRotation.value.setFromMatrix4(Up.makeRotationFromEuler(Dn)), p.flipEnvMap.value = T.isCubeTexture && T.isRenderTargetTexture === !1 ? -1 : 1, p.reflectivity.value = u.reflectivity, p.ior.value = u.ior, p.refractionRatio.value = u.refractionRatio), u.lightMap && (p.lightMap.value = u.lightMap, p.lightMapIntensity.value = u.lightMapIntensity, e(u.lightMap, p.lightMapTransform)), u.aoMap && (p.aoMap.value = u.aoMap, p.aoMapIntensity.value = u.aoMapIntensity, e(u.aoMap, p.aoMapTransform));
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
    p.ior.value = u.ior, u.sheen > 0 && (p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen), p.sheenRoughness.value = u.sheenRoughness, u.sheenColorMap && (p.sheenColorMap.value = u.sheenColorMap, e(u.sheenColorMap, p.sheenColorMapTransform)), u.sheenRoughnessMap && (p.sheenRoughnessMap.value = u.sheenRoughnessMap, e(u.sheenRoughnessMap, p.sheenRoughnessMapTransform))), u.clearcoat > 0 && (p.clearcoat.value = u.clearcoat, p.clearcoatRoughness.value = u.clearcoatRoughness, u.clearcoatMap && (p.clearcoatMap.value = u.clearcoatMap, e(u.clearcoatMap, p.clearcoatMapTransform)), u.clearcoatRoughnessMap && (p.clearcoatRoughnessMap.value = u.clearcoatRoughnessMap, e(u.clearcoatRoughnessMap, p.clearcoatRoughnessMapTransform)), u.clearcoatNormalMap && (p.clearcoatNormalMap.value = u.clearcoatNormalMap, e(u.clearcoatNormalMap, p.clearcoatNormalMapTransform), p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale), u.side === Ae && p.clearcoatNormalScale.value.negate())), u.dispersion > 0 && (p.dispersion.value = u.dispersion), u.iridescence > 0 && (p.iridescence.value = u.iridescence, p.iridescenceIOR.value = u.iridescenceIOR, p.iridescenceThicknessMinimum.value = u.iridescenceThicknessRange[0], p.iridescenceThicknessMaximum.value = u.iridescenceThicknessRange[1], u.iridescenceMap && (p.iridescenceMap.value = u.iridescenceMap, e(u.iridescenceMap, p.iridescenceMapTransform)), u.iridescenceThicknessMap && (p.iridescenceThicknessMap.value = u.iridescenceThicknessMap, e(u.iridescenceThicknessMap, p.iridescenceThicknessMapTransform))), u.transmission > 0 && (p.transmission.value = u.transmission, p.transmissionSamplerMap.value = b.texture, p.transmissionSamplerSize.value.set(b.width, b.height), u.transmissionMap && (p.transmissionMap.value = u.transmissionMap, e(u.transmissionMap, p.transmissionMapTransform)), p.thickness.value = u.thickness, u.thicknessMap && (p.thicknessMap.value = u.thicknessMap, e(u.thicknessMap, p.thicknessMapTransform)), p.attenuationDistance.value = u.attenuationDistance, p.attenuationColor.value.copy(u.attenuationColor)), u.anisotropy > 0 && (p.anisotropyVector.value.set(u.anisotropy * Math.cos(u.anisotropyRotation), u.anisotropy * Math.sin(u.anisotropyRotation)), u.anisotropyMap && (p.anisotropyMap.value = u.anisotropyMap, e(u.anisotropyMap, p.anisotropyMapTransform))), p.specularIntensity.value = u.specularIntensity, p.specularColor.value.copy(u.specularColor), u.specularColorMap && (p.specularColorMap.value = u.specularColorMap, e(u.specularColorMap, p.specularColorMapTransform)), u.specularIntensityMap && (p.specularIntensityMap.value = u.specularIntensityMap, e(u.specularIntensityMap, p.specularIntensityMapTransform));
  }
  function g(p, u) {
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
function Np(i, t, e, n) {
  let s = {}, r = {}, a = [];
  const o = i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);
  function l(b, T) {
    const E = T.program;
    n.uniformBlockBinding(b, E);
  }
  function c(b, T) {
    let E = s[b.id];
    E === void 0 && (g(b), E = h(b), s[b.id] = E, b.addEventListener("dispose", p));
    const U = T.program;
    n.updateUBOMapping(b, U);
    const w = t.render.frame;
    r[b.id] !== w && (f(b), r[b.id] = w);
  }
  function h(b) {
    const T = d();
    b.__bindingPointIndex = T;
    const E = i.createBuffer(), U = b.__size, w = b.usage;
    return i.bindBuffer(i.UNIFORM_BUFFER, E), i.bufferData(i.UNIFORM_BUFFER, U, w), i.bindBuffer(i.UNIFORM_BUFFER, null), i.bindBufferBase(i.UNIFORM_BUFFER, T, E), E;
  }
  function d() {
    for (let b = 0; b < o; b++)
      if (a.indexOf(b) === -1)
        return a.push(b), b;
    return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
  }
  function f(b) {
    const T = s[b.id], E = b.uniforms, U = b.__cache;
    i.bindBuffer(i.UNIFORM_BUFFER, T);
    for (let w = 0, R = E.length; w < R; w++) {
      const N = Array.isArray(E[w]) ? E[w] : [E[w]];
      for (let S = 0, M = N.length; S < M; S++) {
        const C = N[S];
        if (m(C, w, S, U) === !0) {
          const k = C.__offset, z = Array.isArray(C.value) ? C.value : [C.value];
          let X = 0;
          for (let K = 0; K < z.length; K++) {
            const G = z[K], Q = x(G);
            typeof G == "number" || typeof G == "boolean" ? (C.__data[0] = G, i.bufferSubData(i.UNIFORM_BUFFER, k + X, C.__data)) : G.isMatrix3 ? (C.__data[0] = G.elements[0], C.__data[1] = G.elements[1], C.__data[2] = G.elements[2], C.__data[3] = 0, C.__data[4] = G.elements[3], C.__data[5] = G.elements[4], C.__data[6] = G.elements[5], C.__data[7] = 0, C.__data[8] = G.elements[6], C.__data[9] = G.elements[7], C.__data[10] = G.elements[8], C.__data[11] = 0) : (G.toArray(C.__data, X), X += Q.storage / Float32Array.BYTES_PER_ELEMENT);
          }
          i.bufferSubData(i.UNIFORM_BUFFER, k, C.__data);
        }
      }
    }
    i.bindBuffer(i.UNIFORM_BUFFER, null);
  }
  function m(b, T, E, U) {
    const w = b.value, R = T + "_" + E;
    if (U[R] === void 0)
      return typeof w == "number" || typeof w == "boolean" ? U[R] = w : U[R] = w.clone(), !0;
    {
      const N = U[R];
      if (typeof w == "number" || typeof w == "boolean") {
        if (N !== w)
          return U[R] = w, !0;
      } else if (N.equals(w) === !1)
        return N.copy(w), !0;
    }
    return !1;
  }
  function g(b) {
    const T = b.uniforms;
    let E = 0;
    const U = 16;
    for (let R = 0, N = T.length; R < N; R++) {
      const S = Array.isArray(T[R]) ? T[R] : [T[R]];
      for (let M = 0, C = S.length; M < C; M++) {
        const k = S[M], z = Array.isArray(k.value) ? k.value : [k.value];
        for (let X = 0, K = z.length; X < K; X++) {
          const G = z[X], Q = x(G), V = E % U, st = V % Q.boundary, ht = V + st;
          E += st, ht !== 0 && U - ht < Q.storage && (E += U - ht), k.__data = new Float32Array(Q.storage / Float32Array.BYTES_PER_ELEMENT), k.__offset = E, E += Q.storage;
        }
      }
    }
    const w = E % U;
    return w > 0 && (E += U - w), b.__size = E, b.__cache = {}, this;
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
    const E = a.indexOf(T.__bindingPointIndex);
    a.splice(E, 1), i.deleteBuffer(s[T.id]), delete s[T.id], delete r[T.id];
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
class Fp {
  constructor(t = {}) {
    const {
      canvas: e = mc(),
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
    const g = new Uint32Array(4), x = new Int32Array(4);
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
    }, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this._outputColorSpace = Fe, this.toneMapping = En, this.toneMappingExposure = 1;
    const E = this;
    let U = !1, w = 0, R = 0, N = null, S = -1, M = null;
    const C = new re(), k = new re();
    let z = null;
    const X = new Xt(0);
    let K = 0, G = e.width, Q = e.height, V = 1, st = null, ht = null;
    const xt = new re(0, 0, G, Q), It = new re(0, 0, G, Q);
    let $t = !1;
    const Y = new ia();
    let tt = !1, mt = !1;
    this.transmissionResolutionScale = 1;
    const rt = new ee(), Tt = new ee(), wt = new I(), Nt = new re(), ne = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: !0 };
    let Ht = !1;
    function ae() {
      return N === null ? V : 1;
    }
    let A = n;
    function Le(v, D) {
      return e.getContext(v, D);
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
      if ("setAttribute" in e && e.setAttribute("data-engine", "three.js r172"), e.addEventListener("webglcontextlost", j, !1), e.addEventListener("webglcontextrestored", lt, !1), e.addEventListener("webglcontextcreationerror", ot, !1), A === null) {
        const D = "webgl2";
        if (A = Le(D, v), A === null)
          throw Le(D) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
      }
    } catch (v) {
      throw console.error("THREE.WebGLRenderer: " + v.message), v;
    }
    let Ot, Bt, Mt, Qt, vt, y, _, F, q, Z, W, gt, at, ut, Vt, J, dt, yt, bt, ft, zt, Lt, Jt, P;
    function nt() {
      Ot = new Wd(A), Ot.init(), Lt = new wp(A, Ot), Bt = new Bd(A, Ot, t, Lt), Mt = new bp(A, Ot), Bt.reverseDepthBuffer && f && Mt.buffers.depth.setReversed(!0), Qt = new qd(A), vt = new dp(), y = new Ap(A, Ot, Mt, vt, Bt, Lt, Qt), _ = new Hd(E), F = new kd(E), q = new th(A), Jt = new Fd(A, q), Z = new Xd(A, q, Qt, Jt), W = new Zd(A, Z, q, Qt), bt = new jd(A, Bt, y), J = new zd(vt), gt = new up(E, _, F, Ot, Bt, Jt, J), at = new Ip(E, vt), ut = new pp(), Vt = new Mp(Ot), yt = new Nd(E, _, F, Mt, W, m, l), dt = new yp(E, W, Bt), P = new Np(A, Qt, Bt, Mt), ft = new Od(A, Ot, Qt), zt = new Yd(A, Ot, Qt), Qt.programs = gt.programs, E.capabilities = Bt, E.extensions = Ot, E.properties = vt, E.renderLists = ut, E.shadowMap = dt, E.state = Mt, E.info = Qt;
    }
    nt();
    const H = new Lp(E, A);
    this.xr = H, this.getContext = function() {
      return A;
    }, this.getContextAttributes = function() {
      return A.getContextAttributes();
    }, this.forceContextLoss = function() {
      const v = Ot.get("WEBGL_lose_context");
      v && v.loseContext();
    }, this.forceContextRestore = function() {
      const v = Ot.get("WEBGL_lose_context");
      v && v.restoreContext();
    }, this.getPixelRatio = function() {
      return V;
    }, this.setPixelRatio = function(v) {
      v !== void 0 && (V = v, this.setSize(G, Q, !1));
    }, this.getSize = function(v) {
      return v.set(G, Q);
    }, this.setSize = function(v, D, O = !0) {
      if (H.isPresenting) {
        console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");
        return;
      }
      G = v, Q = D, e.width = Math.floor(v * V), e.height = Math.floor(D * V), O === !0 && (e.style.width = v + "px", e.style.height = D + "px"), this.setViewport(0, 0, v, D);
    }, this.getDrawingBufferSize = function(v) {
      return v.set(G * V, Q * V).floor();
    }, this.setDrawingBufferSize = function(v, D, O) {
      G = v, Q = D, V = O, e.width = Math.floor(v * O), e.height = Math.floor(D * O), this.setViewport(0, 0, v, D);
    }, this.getCurrentViewport = function(v) {
      return v.copy(C);
    }, this.getViewport = function(v) {
      return v.copy(xt);
    }, this.setViewport = function(v, D, O, B) {
      v.isVector4 ? xt.set(v.x, v.y, v.z, v.w) : xt.set(v, D, O, B), Mt.viewport(C.copy(xt).multiplyScalar(V).round());
    }, this.getScissor = function(v) {
      return v.copy(It);
    }, this.setScissor = function(v, D, O, B) {
      v.isVector4 ? It.set(v.x, v.y, v.z, v.w) : It.set(v, D, O, B), Mt.scissor(k.copy(It).multiplyScalar(V).round());
    }, this.getScissorTest = function() {
      return $t;
    }, this.setScissorTest = function(v) {
      Mt.setScissorTest($t = v);
    }, this.setOpaqueSort = function(v) {
      st = v;
    }, this.setTransparentSort = function(v) {
      ht = v;
    }, this.getClearColor = function(v) {
      return v.copy(yt.getClearColor());
    }, this.setClearColor = function() {
      yt.setClearColor.apply(yt, arguments);
    }, this.getClearAlpha = function() {
      return yt.getClearAlpha();
    }, this.setClearAlpha = function() {
      yt.setClearAlpha.apply(yt, arguments);
    }, this.clear = function(v = !0, D = !0, O = !0) {
      let B = 0;
      if (v) {
        let L = !1;
        if (N !== null) {
          const $ = N.texture.format;
          L = $ === ta || $ === Qr || $ === Jr;
        }
        if (L) {
          const $ = N.texture.type, it = $ === cn || $ === On || $ === wi || $ === fi || $ === Kr || $ === $r, ct = yt.getClearColor(), pt = yt.getClearAlpha(), At = ct.r, Rt = ct.g, St = ct.b;
          it ? (g[0] = At, g[1] = Rt, g[2] = St, g[3] = pt, A.clearBufferuiv(A.COLOR, 0, g)) : (x[0] = At, x[1] = Rt, x[2] = St, x[3] = pt, A.clearBufferiv(A.COLOR, 0, x));
        } else
          B |= A.COLOR_BUFFER_BIT;
      }
      D && (B |= A.DEPTH_BUFFER_BIT), O && (B |= A.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), A.clear(B);
    }, this.clearColor = function() {
      this.clear(!0, !1, !1);
    }, this.clearDepth = function() {
      this.clear(!1, !0, !1);
    }, this.clearStencil = function() {
      this.clear(!1, !1, !0);
    }, this.dispose = function() {
      e.removeEventListener("webglcontextlost", j, !1), e.removeEventListener("webglcontextrestored", lt, !1), e.removeEventListener("webglcontextcreationerror", ot, !1), yt.dispose(), ut.dispose(), Vt.dispose(), vt.dispose(), _.dispose(), F.dispose(), W.dispose(), Jt.dispose(), P.dispose(), gt.dispose(), H.dispose(), H.removeEventListener("sessionstart", la), H.removeEventListener("sessionend", ca), Tn.stop();
    };
    function j(v) {
      v.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), U = !0;
    }
    function lt() {
      console.log("THREE.WebGLRenderer: Context Restored."), U = !1;
      const v = Qt.autoReset, D = dt.enabled, O = dt.autoUpdate, B = dt.needsUpdate, L = dt.type;
      nt(), Qt.autoReset = v, dt.enabled = D, dt.autoUpdate = O, dt.needsUpdate = B, dt.type = L;
    }
    function ot(v) {
      console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", v.statusMessage);
    }
    function Ct(v) {
      const D = v.target;
      D.removeEventListener("dispose", Ct), ie(D);
    }
    function ie(v) {
      ge(v), vt.remove(v);
    }
    function ge(v) {
      const D = vt.get(v).programs;
      D !== void 0 && (D.forEach(function(O) {
        gt.releaseProgram(O);
      }), v.isShaderMaterial && gt.releaseShaderCache(v));
    }
    this.renderBufferDirect = function(v, D, O, B, L, $) {
      D === null && (D = ne);
      const it = L.isMesh && L.matrixWorld.determinant() < 0, ct = gl(v, D, O, B, L);
      Mt.setMaterial(B, it);
      let pt = O.index, At = 1;
      if (B.wireframe === !0) {
        if (pt = Z.getWireframeAttribute(O), pt === void 0) return;
        At = 2;
      }
      const Rt = O.drawRange, St = O.attributes.position;
      let Gt = Rt.start * At, Yt = (Rt.start + Rt.count) * At;
      $ !== null && (Gt = Math.max(Gt, $.start * At), Yt = Math.min(Yt, ($.start + $.count) * At)), pt !== null ? (Gt = Math.max(Gt, 0), Yt = Math.min(Yt, pt.count)) : St != null && (Gt = Math.max(Gt, 0), Yt = Math.min(Yt, St.count));
      const oe = Yt - Gt;
      if (oe < 0 || oe === 1 / 0) return;
      Jt.setup(L, B, ct, O, pt);
      let se, kt = ft;
      if (pt !== null && (se = q.get(pt), kt = zt, kt.setIndex(se)), L.isMesh)
        B.wireframe === !0 ? (Mt.setLineWidth(B.wireframeLinewidth * ae()), kt.setMode(A.LINES)) : kt.setMode(A.TRIANGLES);
      else if (L.isLine) {
        let Et = B.linewidth;
        Et === void 0 && (Et = 1), Mt.setLineWidth(Et * ae()), L.isLineSegments ? kt.setMode(A.LINES) : L.isLineLoop ? kt.setMode(A.LINE_LOOP) : kt.setMode(A.LINE_STRIP);
      } else L.isPoints ? kt.setMode(A.POINTS) : L.isSprite && kt.setMode(A.TRIANGLES);
      if (L.isBatchedMesh)
        if (L._multiDrawInstances !== null)
          kt.renderMultiDrawInstances(L._multiDrawStarts, L._multiDrawCounts, L._multiDrawCount, L._multiDrawInstances);
        else if (Ot.get("WEBGL_multi_draw"))
          kt.renderMultiDraw(L._multiDrawStarts, L._multiDrawCounts, L._multiDrawCount);
        else {
          const Et = L._multiDrawStarts, me = L._multiDrawCounts, qt = L._multiDrawCount, Ve = pt ? q.get(pt).bytesPerElement : 1, Vn = vt.get(B).currentProgram.getUniforms();
          for (let Re = 0; Re < qt; Re++)
            Vn.setValue(A, "_gl_DrawID", Re), kt.render(Et[Re] / Ve, me[Re]);
        }
      else if (L.isInstancedMesh)
        kt.renderInstances(Gt, oe, L.count);
      else if (O.isInstancedBufferGeometry) {
        const Et = O._maxInstanceCount !== void 0 ? O._maxInstanceCount : 1 / 0, me = Math.min(O.instanceCount, Et);
        kt.renderInstances(Gt, oe, me);
      } else
        kt.render(Gt, oe);
    };
    function jt(v, D, O) {
      v.transparent === !0 && v.side === sn && v.forceSinglePass === !1 ? (v.side = Ae, v.needsUpdate = !0, Ii(v, D, O), v.side = yn, v.needsUpdate = !0, Ii(v, D, O), v.side = sn) : Ii(v, D, O);
    }
    this.compile = function(v, D, O = null) {
      O === null && (O = v), u = Vt.get(O), u.init(D), T.push(u), O.traverseVisible(function(L) {
        L.isLight && L.layers.test(D.layers) && (u.pushLight(L), L.castShadow && u.pushShadow(L));
      }), v !== O && v.traverseVisible(function(L) {
        L.isLight && L.layers.test(D.layers) && (u.pushLight(L), L.castShadow && u.pushShadow(L));
      }), u.setupLights();
      const B = /* @__PURE__ */ new Set();
      return v.traverse(function(L) {
        if (!(L.isMesh || L.isPoints || L.isLine || L.isSprite))
          return;
        const $ = L.material;
        if ($)
          if (Array.isArray($))
            for (let it = 0; it < $.length; it++) {
              const ct = $[it];
              jt(ct, O, L), B.add(ct);
            }
          else
            jt($, O, L), B.add($);
      }), T.pop(), u = null, B;
    }, this.compileAsync = function(v, D, O = null) {
      const B = this.compile(v, D, O);
      return new Promise((L) => {
        function $() {
          if (B.forEach(function(it) {
            vt.get(it).currentProgram.isReady() && B.delete(it);
          }), B.size === 0) {
            L(v);
            return;
          }
          setTimeout($, 10);
        }
        Ot.get("KHR_parallel_shader_compile") !== null ? $() : setTimeout($, 10);
      });
    };
    let He = null;
    function Ke(v) {
      He && He(v);
    }
    function la() {
      Tn.stop();
    }
    function ca() {
      Tn.start();
    }
    const Tn = new cl();
    Tn.setAnimationLoop(Ke), typeof self < "u" && Tn.setContext(self), this.setAnimationLoop = function(v) {
      He = v, H.setAnimationLoop(v), v === null ? Tn.stop() : Tn.start();
    }, H.addEventListener("sessionstart", la), H.addEventListener("sessionend", ca), this.render = function(v, D) {
      if (D !== void 0 && D.isCamera !== !0) {
        console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        return;
      }
      if (U === !0) return;
      if (v.matrixWorldAutoUpdate === !0 && v.updateMatrixWorld(), D.parent === null && D.matrixWorldAutoUpdate === !0 && D.updateMatrixWorld(), H.enabled === !0 && H.isPresenting === !0 && (H.cameraAutoUpdate === !0 && H.updateCamera(D), D = H.getCamera()), v.isScene === !0 && v.onBeforeRender(E, v, D, N), u = Vt.get(v, T.length), u.init(D), T.push(u), Tt.multiplyMatrices(D.projectionMatrix, D.matrixWorldInverse), Y.setFromProjectionMatrix(Tt), mt = this.localClippingEnabled, tt = J.init(this.clippingPlanes, mt), p = ut.get(v, b.length), p.init(), b.push(p), H.enabled === !0 && H.isPresenting === !0) {
        const $ = E.xr.getDepthSensingMesh();
        $ !== null && bs($, D, -1 / 0, E.sortObjects);
      }
      bs(v, D, 0, E.sortObjects), p.finish(), E.sortObjects === !0 && p.sort(st, ht), Ht = H.enabled === !1 || H.isPresenting === !1 || H.hasDepthSensing() === !1, Ht && yt.addToRenderList(p, v), this.info.render.frame++, tt === !0 && J.beginShadows();
      const O = u.state.shadowsArray;
      dt.render(O, v, D), tt === !0 && J.endShadows(), this.info.autoReset === !0 && this.info.reset();
      const B = p.opaque, L = p.transmissive;
      if (u.setupLights(), D.isArrayCamera) {
        const $ = D.cameras;
        if (L.length > 0)
          for (let it = 0, ct = $.length; it < ct; it++) {
            const pt = $[it];
            ua(B, L, v, pt);
          }
        Ht && yt.render(v);
        for (let it = 0, ct = $.length; it < ct; it++) {
          const pt = $[it];
          ha(p, v, pt, pt.viewport);
        }
      } else
        L.length > 0 && ua(B, L, v, D), Ht && yt.render(v), ha(p, v, D);
      N !== null && R === 0 && (y.updateMultisampleRenderTarget(N), y.updateRenderTargetMipmap(N)), v.isScene === !0 && v.onAfterRender(E, v, D), Jt.resetDefaultState(), S = -1, M = null, T.pop(), T.length > 0 ? (u = T[T.length - 1], tt === !0 && J.setGlobalState(E.clippingPlanes, u.state.camera)) : u = null, b.pop(), b.length > 0 ? p = b[b.length - 1] : p = null;
    };
    function bs(v, D, O, B) {
      if (v.visible === !1) return;
      if (v.layers.test(D.layers)) {
        if (v.isGroup)
          O = v.renderOrder;
        else if (v.isLOD)
          v.autoUpdate === !0 && v.update(D);
        else if (v.isLight)
          u.pushLight(v), v.castShadow && u.pushShadow(v);
        else if (v.isSprite) {
          if (!v.frustumCulled || Y.intersectsSprite(v)) {
            B && Nt.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Tt);
            const it = W.update(v), ct = v.material;
            ct.visible && p.push(v, it, ct, O, Nt.z, null);
          }
        } else if ((v.isMesh || v.isLine || v.isPoints) && (!v.frustumCulled || Y.intersectsObject(v))) {
          const it = W.update(v), ct = v.material;
          if (B && (v.boundingSphere !== void 0 ? (v.boundingSphere === null && v.computeBoundingSphere(), Nt.copy(v.boundingSphere.center)) : (it.boundingSphere === null && it.computeBoundingSphere(), Nt.copy(it.boundingSphere.center)), Nt.applyMatrix4(v.matrixWorld).applyMatrix4(Tt)), Array.isArray(ct)) {
            const pt = it.groups;
            for (let At = 0, Rt = pt.length; At < Rt; At++) {
              const St = pt[At], Gt = ct[St.materialIndex];
              Gt && Gt.visible && p.push(v, it, Gt, O, Nt.z, St);
            }
          } else ct.visible && p.push(v, it, ct, O, Nt.z, null);
        }
      }
      const $ = v.children;
      for (let it = 0, ct = $.length; it < ct; it++)
        bs($[it], D, O, B);
    }
    function ha(v, D, O, B) {
      const L = v.opaque, $ = v.transmissive, it = v.transparent;
      u.setupLightsView(O), tt === !0 && J.setGlobalState(E.clippingPlanes, O), B && Mt.viewport(C.copy(B)), L.length > 0 && Ui(L, D, O), $.length > 0 && Ui($, D, O), it.length > 0 && Ui(it, D, O), Mt.buffers.depth.setTest(!0), Mt.buffers.depth.setMask(!0), Mt.buffers.color.setMask(!0), Mt.setPolygonOffset(!1);
    }
    function ua(v, D, O, B) {
      if ((O.isScene === !0 ? O.overrideMaterial : null) !== null)
        return;
      u.state.transmissionRenderTarget[B.id] === void 0 && (u.state.transmissionRenderTarget[B.id] = new Bn(1, 1, {
        generateMipmaps: !0,
        type: Ot.has("EXT_color_buffer_half_float") || Ot.has("EXT_color_buffer_float") ? Ri : cn,
        minFilter: Fn,
        samples: 4,
        stencilBuffer: r,
        resolveDepthBuffer: !1,
        resolveStencilBuffer: !1,
        colorSpace: Wt.workingColorSpace
      }));
      const $ = u.state.transmissionRenderTarget[B.id], it = B.viewport || C;
      $.setSize(it.z * E.transmissionResolutionScale, it.w * E.transmissionResolutionScale);
      const ct = E.getRenderTarget();
      E.setRenderTarget($), E.getClearColor(X), K = E.getClearAlpha(), K < 1 && E.setClearColor(16777215, 0.5), E.clear(), Ht && yt.render(O);
      const pt = E.toneMapping;
      E.toneMapping = En;
      const At = B.viewport;
      if (B.viewport !== void 0 && (B.viewport = void 0), u.setupLightsView(B), tt === !0 && J.setGlobalState(E.clippingPlanes, B), Ui(v, O, B), y.updateMultisampleRenderTarget($), y.updateRenderTargetMipmap($), Ot.has("WEBGL_multisampled_render_to_texture") === !1) {
        let Rt = !1;
        for (let St = 0, Gt = D.length; St < Gt; St++) {
          const Yt = D[St], oe = Yt.object, se = Yt.geometry, kt = Yt.material, Et = Yt.group;
          if (kt.side === sn && oe.layers.test(B.layers)) {
            const me = kt.side;
            kt.side = Ae, kt.needsUpdate = !0, da(oe, O, B, se, kt, Et), kt.side = me, kt.needsUpdate = !0, Rt = !0;
          }
        }
        Rt === !0 && (y.updateMultisampleRenderTarget($), y.updateRenderTargetMipmap($));
      }
      E.setRenderTarget(ct), E.setClearColor(X, K), At !== void 0 && (B.viewport = At), E.toneMapping = pt;
    }
    function Ui(v, D, O) {
      const B = D.isScene === !0 ? D.overrideMaterial : null;
      for (let L = 0, $ = v.length; L < $; L++) {
        const it = v[L], ct = it.object, pt = it.geometry, At = B === null ? it.material : B, Rt = it.group;
        ct.layers.test(O.layers) && da(ct, D, O, pt, At, Rt);
      }
    }
    function da(v, D, O, B, L, $) {
      v.onBeforeRender(E, D, O, B, L, $), v.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse, v.matrixWorld), v.normalMatrix.getNormalMatrix(v.modelViewMatrix), L.onBeforeRender(E, D, O, B, v, $), L.transparent === !0 && L.side === sn && L.forceSinglePass === !1 ? (L.side = Ae, L.needsUpdate = !0, E.renderBufferDirect(O, D, B, L, v, $), L.side = yn, L.needsUpdate = !0, E.renderBufferDirect(O, D, B, L, v, $), L.side = sn) : E.renderBufferDirect(O, D, B, L, v, $), v.onAfterRender(E, D, O, B, L, $);
    }
    function Ii(v, D, O) {
      D.isScene !== !0 && (D = ne);
      const B = vt.get(v), L = u.state.lights, $ = u.state.shadowsArray, it = L.state.version, ct = gt.getParameters(v, L.state, $, D, O), pt = gt.getProgramCacheKey(ct);
      let At = B.programs;
      B.environment = v.isMeshStandardMaterial ? D.environment : null, B.fog = D.fog, B.envMap = (v.isMeshStandardMaterial ? F : _).get(v.envMap || B.environment), B.envMapRotation = B.environment !== null && v.envMap === null ? D.environmentRotation : v.envMapRotation, At === void 0 && (v.addEventListener("dispose", Ct), At = /* @__PURE__ */ new Map(), B.programs = At);
      let Rt = At.get(pt);
      if (Rt !== void 0) {
        if (B.currentProgram === Rt && B.lightsStateVersion === it)
          return pa(v, ct), Rt;
      } else
        ct.uniforms = gt.getUniforms(v), v.onBeforeCompile(ct, E), Rt = gt.acquireProgram(ct, pt), At.set(pt, Rt), B.uniforms = ct.uniforms;
      const St = B.uniforms;
      return (!v.isShaderMaterial && !v.isRawShaderMaterial || v.clipping === !0) && (St.clippingPlanes = J.uniform), pa(v, ct), B.needsLights = xl(v), B.lightsStateVersion = it, B.needsLights && (St.ambientLightColor.value = L.state.ambient, St.lightProbe.value = L.state.probe, St.directionalLights.value = L.state.directional, St.directionalLightShadows.value = L.state.directionalShadow, St.spotLights.value = L.state.spot, St.spotLightShadows.value = L.state.spotShadow, St.rectAreaLights.value = L.state.rectArea, St.ltc_1.value = L.state.rectAreaLTC1, St.ltc_2.value = L.state.rectAreaLTC2, St.pointLights.value = L.state.point, St.pointLightShadows.value = L.state.pointShadow, St.hemisphereLights.value = L.state.hemi, St.directionalShadowMap.value = L.state.directionalShadowMap, St.directionalShadowMatrix.value = L.state.directionalShadowMatrix, St.spotShadowMap.value = L.state.spotShadowMap, St.spotLightMatrix.value = L.state.spotLightMatrix, St.spotLightMap.value = L.state.spotLightMap, St.pointShadowMap.value = L.state.pointShadowMap, St.pointShadowMatrix.value = L.state.pointShadowMatrix), B.currentProgram = Rt, B.uniformsList = null, Rt;
    }
    function fa(v) {
      if (v.uniformsList === null) {
        const D = v.currentProgram.getUniforms();
        v.uniformsList = ds.seqWithValue(D.seq, v.uniforms);
      }
      return v.uniformsList;
    }
    function pa(v, D) {
      const O = vt.get(v);
      O.outputColorSpace = D.outputColorSpace, O.batching = D.batching, O.batchingColor = D.batchingColor, O.instancing = D.instancing, O.instancingColor = D.instancingColor, O.instancingMorph = D.instancingMorph, O.skinning = D.skinning, O.morphTargets = D.morphTargets, O.morphNormals = D.morphNormals, O.morphColors = D.morphColors, O.morphTargetsCount = D.morphTargetsCount, O.numClippingPlanes = D.numClippingPlanes, O.numIntersection = D.numClipIntersection, O.vertexAlphas = D.vertexAlphas, O.vertexTangents = D.vertexTangents, O.toneMapping = D.toneMapping;
    }
    function gl(v, D, O, B, L) {
      D.isScene !== !0 && (D = ne), y.resetTextureUnits();
      const $ = D.fog, it = B.isMeshStandardMaterial ? D.environment : null, ct = N === null ? E.outputColorSpace : N.isXRRenderTarget === !0 ? N.texture.colorSpace : mi, pt = (B.isMeshStandardMaterial ? F : _).get(B.envMap || it), At = B.vertexColors === !0 && !!O.attributes.color && O.attributes.color.itemSize === 4, Rt = !!O.attributes.tangent && (!!B.normalMap || B.anisotropy > 0), St = !!O.morphAttributes.position, Gt = !!O.morphAttributes.normal, Yt = !!O.morphAttributes.color;
      let oe = En;
      B.toneMapped && (N === null || N.isXRRenderTarget === !0) && (oe = E.toneMapping);
      const se = O.morphAttributes.position || O.morphAttributes.normal || O.morphAttributes.color, kt = se !== void 0 ? se.length : 0, Et = vt.get(B), me = u.state.lights;
      if (tt === !0 && (mt === !0 || v !== M)) {
        const Se = v === M && B.id === S;
        J.setState(B, v, Se);
      }
      let qt = !1;
      B.version === Et.__version ? (Et.needsLights && Et.lightsStateVersion !== me.state.version || Et.outputColorSpace !== ct || L.isBatchedMesh && Et.batching === !1 || !L.isBatchedMesh && Et.batching === !0 || L.isBatchedMesh && Et.batchingColor === !0 && L.colorTexture === null || L.isBatchedMesh && Et.batchingColor === !1 && L.colorTexture !== null || L.isInstancedMesh && Et.instancing === !1 || !L.isInstancedMesh && Et.instancing === !0 || L.isSkinnedMesh && Et.skinning === !1 || !L.isSkinnedMesh && Et.skinning === !0 || L.isInstancedMesh && Et.instancingColor === !0 && L.instanceColor === null || L.isInstancedMesh && Et.instancingColor === !1 && L.instanceColor !== null || L.isInstancedMesh && Et.instancingMorph === !0 && L.morphTexture === null || L.isInstancedMesh && Et.instancingMorph === !1 && L.morphTexture !== null || Et.envMap !== pt || B.fog === !0 && Et.fog !== $ || Et.numClippingPlanes !== void 0 && (Et.numClippingPlanes !== J.numPlanes || Et.numIntersection !== J.numIntersection) || Et.vertexAlphas !== At || Et.vertexTangents !== Rt || Et.morphTargets !== St || Et.morphNormals !== Gt || Et.morphColors !== Yt || Et.toneMapping !== oe || Et.morphTargetsCount !== kt) && (qt = !0) : (qt = !0, Et.__version = B.version);
      let Ve = Et.currentProgram;
      qt === !0 && (Ve = Ii(B, D, L));
      let Vn = !1, Re = !1, vi = !1;
      const te = Ve.getUniforms(), Ue = Et.uniforms;
      if (Mt.useProgram(Ve.program) && (Vn = !0, Re = !0, vi = !0), B.id !== S && (S = B.id, Re = !0), Vn || M !== v) {
        Mt.buffers.depth.getReversed() ? (rt.copy(v.projectionMatrix), gc(rt), vc(rt), te.setValue(A, "projectionMatrix", rt)) : te.setValue(A, "projectionMatrix", v.projectionMatrix), te.setValue(A, "viewMatrix", v.matrixWorldInverse);
        const ye = te.map.cameraPosition;
        ye !== void 0 && ye.setValue(A, wt.setFromMatrixPosition(v.matrixWorld)), Bt.logarithmicDepthBuffer && te.setValue(
          A,
          "logDepthBufFC",
          2 / (Math.log(v.far + 1) / Math.LN2)
        ), (B.isMeshPhongMaterial || B.isMeshToonMaterial || B.isMeshLambertMaterial || B.isMeshBasicMaterial || B.isMeshStandardMaterial || B.isShaderMaterial) && te.setValue(A, "isOrthographic", v.isOrthographicCamera === !0), M !== v && (M = v, Re = !0, vi = !0);
      }
      if (L.isSkinnedMesh) {
        te.setOptional(A, L, "bindMatrix"), te.setOptional(A, L, "bindMatrixInverse");
        const Se = L.skeleton;
        Se && (Se.boneTexture === null && Se.computeBoneTexture(), te.setValue(A, "boneTexture", Se.boneTexture, y));
      }
      L.isBatchedMesh && (te.setOptional(A, L, "batchingTexture"), te.setValue(A, "batchingTexture", L._matricesTexture, y), te.setOptional(A, L, "batchingIdTexture"), te.setValue(A, "batchingIdTexture", L._indirectTexture, y), te.setOptional(A, L, "batchingColorTexture"), L._colorsTexture !== null && te.setValue(A, "batchingColorTexture", L._colorsTexture, y));
      const Ie = O.morphAttributes;
      if ((Ie.position !== void 0 || Ie.normal !== void 0 || Ie.color !== void 0) && bt.update(L, O, Ve), (Re || Et.receiveShadow !== L.receiveShadow) && (Et.receiveShadow = L.receiveShadow, te.setValue(A, "receiveShadow", L.receiveShadow)), B.isMeshGouraudMaterial && B.envMap !== null && (Ue.envMap.value = pt, Ue.flipEnvMap.value = pt.isCubeTexture && pt.isRenderTargetTexture === !1 ? -1 : 1), B.isMeshStandardMaterial && B.envMap === null && D.environment !== null && (Ue.envMapIntensity.value = D.environmentIntensity), Re && (te.setValue(A, "toneMappingExposure", E.toneMappingExposure), Et.needsLights && vl(Ue, vi), $ && B.fog === !0 && at.refreshFogUniforms(Ue, $), at.refreshMaterialUniforms(Ue, B, V, Q, u.state.transmissionRenderTarget[v.id]), ds.upload(A, fa(Et), Ue, y)), B.isShaderMaterial && B.uniformsNeedUpdate === !0 && (ds.upload(A, fa(Et), Ue, y), B.uniformsNeedUpdate = !1), B.isSpriteMaterial && te.setValue(A, "center", L.center), te.setValue(A, "modelViewMatrix", L.modelViewMatrix), te.setValue(A, "normalMatrix", L.normalMatrix), te.setValue(A, "modelMatrix", L.matrixWorld), B.isShaderMaterial || B.isRawShaderMaterial) {
        const Se = B.uniformsGroups;
        for (let ye = 0, As = Se.length; ye < As; ye++) {
          const bn = Se[ye];
          P.update(bn, Ve), P.bind(bn, Ve);
        }
      }
      return Ve;
    }
    function vl(v, D) {
      v.ambientLightColor.needsUpdate = D, v.lightProbe.needsUpdate = D, v.directionalLights.needsUpdate = D, v.directionalLightShadows.needsUpdate = D, v.pointLights.needsUpdate = D, v.pointLightShadows.needsUpdate = D, v.spotLights.needsUpdate = D, v.spotLightShadows.needsUpdate = D, v.rectAreaLights.needsUpdate = D, v.hemisphereLights.needsUpdate = D;
    }
    function xl(v) {
      return v.isMeshLambertMaterial || v.isMeshToonMaterial || v.isMeshPhongMaterial || v.isMeshStandardMaterial || v.isShadowMaterial || v.isShaderMaterial && v.lights === !0;
    }
    this.getActiveCubeFace = function() {
      return w;
    }, this.getActiveMipmapLevel = function() {
      return R;
    }, this.getRenderTarget = function() {
      return N;
    }, this.setRenderTargetTextures = function(v, D, O) {
      vt.get(v.texture).__webglTexture = D, vt.get(v.depthTexture).__webglTexture = O;
      const B = vt.get(v);
      B.__hasExternalTextures = !0, B.__autoAllocateDepthBuffer = O === void 0, B.__autoAllocateDepthBuffer || Ot.has("WEBGL_multisampled_render_to_texture") === !0 && (console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"), B.__useRenderToTexture = !1);
    }, this.setRenderTargetFramebuffer = function(v, D) {
      const O = vt.get(v);
      O.__webglFramebuffer = D, O.__useDefaultFramebuffer = D === void 0;
    };
    const Ml = A.createFramebuffer();
    this.setRenderTarget = function(v, D = 0, O = 0) {
      N = v, w = D, R = O;
      let B = !0, L = null, $ = !1, it = !1;
      if (v) {
        const pt = vt.get(v);
        if (pt.__useDefaultFramebuffer !== void 0)
          Mt.bindFramebuffer(A.FRAMEBUFFER, null), B = !1;
        else if (pt.__webglFramebuffer === void 0)
          y.setupRenderTarget(v);
        else if (pt.__hasExternalTextures)
          y.rebindTextures(v, vt.get(v.texture).__webglTexture, vt.get(v.depthTexture).__webglTexture);
        else if (v.depthBuffer) {
          const St = v.depthTexture;
          if (pt.__boundDepthTexture !== St) {
            if (St !== null && vt.has(St) && (v.width !== St.image.width || v.height !== St.image.height))
              throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");
            y.setupDepthRenderbuffer(v);
          }
        }
        const At = v.texture;
        (At.isData3DTexture || At.isDataArrayTexture || At.isCompressedArrayTexture) && (it = !0);
        const Rt = vt.get(v).__webglFramebuffer;
        v.isWebGLCubeRenderTarget ? (Array.isArray(Rt[D]) ? L = Rt[D][O] : L = Rt[D], $ = !0) : v.samples > 0 && y.useMultisampledRTT(v) === !1 ? L = vt.get(v).__webglMultisampledFramebuffer : Array.isArray(Rt) ? L = Rt[O] : L = Rt, C.copy(v.viewport), k.copy(v.scissor), z = v.scissorTest;
      } else
        C.copy(xt).multiplyScalar(V).floor(), k.copy(It).multiplyScalar(V).floor(), z = $t;
      if (O !== 0 && (L = Ml), Mt.bindFramebuffer(A.FRAMEBUFFER, L) && B && Mt.drawBuffers(v, L), Mt.viewport(C), Mt.scissor(k), Mt.setScissorTest(z), $) {
        const pt = vt.get(v.texture);
        A.framebufferTexture2D(A.FRAMEBUFFER, A.COLOR_ATTACHMENT0, A.TEXTURE_CUBE_MAP_POSITIVE_X + D, pt.__webglTexture, O);
      } else if (it) {
        const pt = vt.get(v.texture), At = D;
        A.framebufferTextureLayer(A.FRAMEBUFFER, A.COLOR_ATTACHMENT0, pt.__webglTexture, O, At);
      } else if (v !== null && O !== 0) {
        const pt = vt.get(v.texture);
        A.framebufferTexture2D(A.FRAMEBUFFER, A.COLOR_ATTACHMENT0, A.TEXTURE_2D, pt.__webglTexture, O);
      }
      S = -1;
    }, this.readRenderTargetPixels = function(v, D, O, B, L, $, it) {
      if (!(v && v.isWebGLRenderTarget)) {
        console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        return;
      }
      let ct = vt.get(v).__webglFramebuffer;
      if (v.isWebGLCubeRenderTarget && it !== void 0 && (ct = ct[it]), ct) {
        Mt.bindFramebuffer(A.FRAMEBUFFER, ct);
        try {
          const pt = v.texture, At = pt.format, Rt = pt.type;
          if (!Bt.textureFormatReadable(At)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
            return;
          }
          if (!Bt.textureTypeReadable(Rt)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
            return;
          }
          D >= 0 && D <= v.width - B && O >= 0 && O <= v.height - L && A.readPixels(D, O, B, L, Lt.convert(At), Lt.convert(Rt), $);
        } finally {
          const pt = N !== null ? vt.get(N).__webglFramebuffer : null;
          Mt.bindFramebuffer(A.FRAMEBUFFER, pt);
        }
      }
    }, this.readRenderTargetPixelsAsync = async function(v, D, O, B, L, $, it) {
      if (!(v && v.isWebGLRenderTarget))
        throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
      let ct = vt.get(v).__webglFramebuffer;
      if (v.isWebGLCubeRenderTarget && it !== void 0 && (ct = ct[it]), ct) {
        const pt = v.texture, At = pt.format, Rt = pt.type;
        if (!Bt.textureFormatReadable(At))
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
        if (!Bt.textureTypeReadable(Rt))
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
        if (D >= 0 && D <= v.width - B && O >= 0 && O <= v.height - L) {
          Mt.bindFramebuffer(A.FRAMEBUFFER, ct);
          const St = A.createBuffer();
          A.bindBuffer(A.PIXEL_PACK_BUFFER, St), A.bufferData(A.PIXEL_PACK_BUFFER, $.byteLength, A.STREAM_READ), A.readPixels(D, O, B, L, Lt.convert(At), Lt.convert(Rt), 0);
          const Gt = N !== null ? vt.get(N).__webglFramebuffer : null;
          Mt.bindFramebuffer(A.FRAMEBUFFER, Gt);
          const Yt = A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE, 0);
          return A.flush(), await _c(A, Yt, 4), A.bindBuffer(A.PIXEL_PACK_BUFFER, St), A.getBufferSubData(A.PIXEL_PACK_BUFFER, 0, $), A.deleteBuffer(St), A.deleteSync(Yt), $;
        } else
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
      }
    }, this.copyFramebufferToTexture = function(v, D = null, O = 0) {
      v.isTexture !== !0 && (ni("WebGLRenderer: copyFramebufferToTexture function signature has changed."), D = arguments[0] || null, v = arguments[1]);
      const B = Math.pow(2, -O), L = Math.floor(v.image.width * B), $ = Math.floor(v.image.height * B), it = D !== null ? D.x : 0, ct = D !== null ? D.y : 0;
      y.setTexture2D(v, 0), A.copyTexSubImage2D(A.TEXTURE_2D, O, 0, 0, it, ct, L, $), Mt.unbindTexture();
    };
    const Sl = A.createFramebuffer(), El = A.createFramebuffer();
    this.copyTextureToTexture = function(v, D, O = null, B = null, L = 0, $ = null) {
      v.isTexture !== !0 && (ni("WebGLRenderer: copyTextureToTexture function signature has changed."), B = arguments[0] || null, v = arguments[1], D = arguments[2], $ = arguments[3] || 0, O = null), $ === null && (L !== 0 ? (ni("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."), $ = L, L = 0) : $ = 0);
      let it, ct, pt, At, Rt, St, Gt, Yt, oe;
      const se = v.isCompressedTexture ? v.mipmaps[$] : v.image;
      if (O !== null)
        it = O.max.x - O.min.x, ct = O.max.y - O.min.y, pt = O.isBox3 ? O.max.z - O.min.z : 1, At = O.min.x, Rt = O.min.y, St = O.isBox3 ? O.min.z : 0;
      else {
        const Ie = Math.pow(2, -L);
        it = Math.floor(se.width * Ie), ct = Math.floor(se.height * Ie), v.isDataArrayTexture ? pt = se.depth : v.isData3DTexture ? pt = Math.floor(se.depth * Ie) : pt = 1, At = 0, Rt = 0, St = 0;
      }
      B !== null ? (Gt = B.x, Yt = B.y, oe = B.z) : (Gt = 0, Yt = 0, oe = 0);
      const kt = Lt.convert(D.format), Et = Lt.convert(D.type);
      let me;
      D.isData3DTexture ? (y.setTexture3D(D, 0), me = A.TEXTURE_3D) : D.isDataArrayTexture || D.isCompressedArrayTexture ? (y.setTexture2DArray(D, 0), me = A.TEXTURE_2D_ARRAY) : (y.setTexture2D(D, 0), me = A.TEXTURE_2D), A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL, D.flipY), A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL, D.premultiplyAlpha), A.pixelStorei(A.UNPACK_ALIGNMENT, D.unpackAlignment);
      const qt = A.getParameter(A.UNPACK_ROW_LENGTH), Ve = A.getParameter(A.UNPACK_IMAGE_HEIGHT), Vn = A.getParameter(A.UNPACK_SKIP_PIXELS), Re = A.getParameter(A.UNPACK_SKIP_ROWS), vi = A.getParameter(A.UNPACK_SKIP_IMAGES);
      A.pixelStorei(A.UNPACK_ROW_LENGTH, se.width), A.pixelStorei(A.UNPACK_IMAGE_HEIGHT, se.height), A.pixelStorei(A.UNPACK_SKIP_PIXELS, At), A.pixelStorei(A.UNPACK_SKIP_ROWS, Rt), A.pixelStorei(A.UNPACK_SKIP_IMAGES, St);
      const te = v.isDataArrayTexture || v.isData3DTexture, Ue = D.isDataArrayTexture || D.isData3DTexture;
      if (v.isDepthTexture) {
        const Ie = vt.get(v), Se = vt.get(D), ye = vt.get(Ie.__renderTarget), As = vt.get(Se.__renderTarget);
        Mt.bindFramebuffer(A.READ_FRAMEBUFFER, ye.__webglFramebuffer), Mt.bindFramebuffer(A.DRAW_FRAMEBUFFER, As.__webglFramebuffer);
        for (let bn = 0; bn < pt; bn++)
          te && (A.framebufferTextureLayer(A.READ_FRAMEBUFFER, A.COLOR_ATTACHMENT0, vt.get(v).__webglTexture, L, St + bn), A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER, A.COLOR_ATTACHMENT0, vt.get(D).__webglTexture, $, oe + bn)), A.blitFramebuffer(At, Rt, it, ct, Gt, Yt, it, ct, A.DEPTH_BUFFER_BIT, A.NEAREST);
        Mt.bindFramebuffer(A.READ_FRAMEBUFFER, null), Mt.bindFramebuffer(A.DRAW_FRAMEBUFFER, null);
      } else if (L !== 0 || v.isRenderTargetTexture || vt.has(v)) {
        const Ie = vt.get(v), Se = vt.get(D);
        Mt.bindFramebuffer(A.READ_FRAMEBUFFER, Sl), Mt.bindFramebuffer(A.DRAW_FRAMEBUFFER, El);
        for (let ye = 0; ye < pt; ye++)
          te ? A.framebufferTextureLayer(A.READ_FRAMEBUFFER, A.COLOR_ATTACHMENT0, Ie.__webglTexture, L, St + ye) : A.framebufferTexture2D(A.READ_FRAMEBUFFER, A.COLOR_ATTACHMENT0, A.TEXTURE_2D, Ie.__webglTexture, L), Ue ? A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER, A.COLOR_ATTACHMENT0, Se.__webglTexture, $, oe + ye) : A.framebufferTexture2D(A.DRAW_FRAMEBUFFER, A.COLOR_ATTACHMENT0, A.TEXTURE_2D, Se.__webglTexture, $), L !== 0 ? A.blitFramebuffer(At, Rt, it, ct, Gt, Yt, it, ct, A.COLOR_BUFFER_BIT, A.NEAREST) : Ue ? A.copyTexSubImage3D(me, $, Gt, Yt, oe + ye, At, Rt, it, ct) : A.copyTexSubImage2D(me, $, Gt, Yt, At, Rt, it, ct);
        Mt.bindFramebuffer(A.READ_FRAMEBUFFER, null), Mt.bindFramebuffer(A.DRAW_FRAMEBUFFER, null);
      } else
        Ue ? v.isDataTexture || v.isData3DTexture ? A.texSubImage3D(me, $, Gt, Yt, oe, it, ct, pt, kt, Et, se.data) : D.isCompressedArrayTexture ? A.compressedTexSubImage3D(me, $, Gt, Yt, oe, it, ct, pt, kt, se.data) : A.texSubImage3D(me, $, Gt, Yt, oe, it, ct, pt, kt, Et, se) : v.isDataTexture ? A.texSubImage2D(A.TEXTURE_2D, $, Gt, Yt, it, ct, kt, Et, se.data) : v.isCompressedTexture ? A.compressedTexSubImage2D(A.TEXTURE_2D, $, Gt, Yt, se.width, se.height, kt, se.data) : A.texSubImage2D(A.TEXTURE_2D, $, Gt, Yt, it, ct, kt, Et, se);
      A.pixelStorei(A.UNPACK_ROW_LENGTH, qt), A.pixelStorei(A.UNPACK_IMAGE_HEIGHT, Ve), A.pixelStorei(A.UNPACK_SKIP_PIXELS, Vn), A.pixelStorei(A.UNPACK_SKIP_ROWS, Re), A.pixelStorei(A.UNPACK_SKIP_IMAGES, vi), $ === 0 && D.generateMipmaps && A.generateMipmap(me), Mt.unbindTexture();
    }, this.copyTextureToTexture3D = function(v, D, O = null, B = null, L = 0) {
      return v.isTexture !== !0 && (ni("WebGLRenderer: copyTextureToTexture3D function signature has changed."), O = arguments[0] || null, B = arguments[1] || null, v = arguments[2], D = arguments[3], L = arguments[4] || 0), ni('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'), this.copyTextureToTexture(v, D, O, B, L);
    }, this.initRenderTarget = function(v) {
      vt.get(v).__webglFramebuffer === void 0 && y.setupRenderTarget(v);
    }, this.initTexture = function(v) {
      v.isCubeTexture ? y.setTextureCube(v, 0) : v.isData3DTexture ? y.setTexture3D(v, 0) : v.isDataArrayTexture || v.isCompressedArrayTexture ? y.setTexture2DArray(v, 0) : y.setTexture2D(v, 0), Mt.unbindTexture();
    }, this.resetState = function() {
      w = 0, R = 0, N = null, Mt.reset(), Jt.reset();
    }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  get coordinateSystem() {
    return on;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(t) {
    this._outputColorSpace = t;
    const e = this.getContext();
    e.drawingBufferColorspace = Wt._getDrawingBufferColorSpace(t), e.unpackColorSpace = Wt._getUnpackColorSpace();
  }
}
const vo = { type: "change" }, oa = { type: "start" }, pl = { type: "end" }, ss = new Es(), xo = new xn(), Op = Math.cos(70 * pc.DEG2RAD), ce = new I(), be = 2 * Math.PI, Kt = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
}, rr = 1e-6;
class Bp extends Jc {
  constructor(t, e = null) {
    super(t, e), this.state = Kt.NONE, this.enabled = !0, this.target = new I(), this.cursor = new I(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.keyRotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: ai.ROTATE, MIDDLE: ai.DOLLY, RIGHT: ai.PAN }, this.touches = { ONE: ii.ROTATE, TWO: ii.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new I(), this._lastQuaternion = new zn(), this._lastTargetPosition = new I(), this._quat = new zn().setFromUnitVectors(t.up, new I(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new Xa(), this._sphericalDelta = new Xa(), this._scale = 1, this._panOffset = new I(), this._rotateStart = new Dt(), this._rotateEnd = new Dt(), this._rotateDelta = new Dt(), this._panStart = new Dt(), this._panEnd = new Dt(), this._panDelta = new Dt(), this._dollyStart = new Dt(), this._dollyEnd = new Dt(), this._dollyDelta = new Dt(), this._dollyDirection = new I(), this._mouse = new Dt(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = Hp.bind(this), this._onPointerDown = zp.bind(this), this._onPointerUp = Vp.bind(this), this._onContextMenu = jp.bind(this), this._onMouseWheel = Wp.bind(this), this._onKeyDown = Xp.bind(this), this._onTouchStart = Yp.bind(this), this._onTouchMove = qp.bind(this), this._onMouseDown = Gp.bind(this), this._onMouseMove = kp.bind(this), this._interceptControlDown = Zp.bind(this), this._interceptControlUp = Kp.bind(this), this.domElement !== null && this.connect(), this.update();
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
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(vo), this.update(), this.state = Kt.NONE;
  }
  update(t = null) {
    const e = this.object.position;
    ce.copy(e).sub(this.target), ce.applyQuaternion(this._quat), this._spherical.setFromVector3(ce), this.autoRotate && this.state === Kt.NONE && this._rotateLeft(this._getAutoRotationAngle(t)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let n = this.minAzimuthAngle, s = this.maxAzimuthAngle;
    isFinite(n) && isFinite(s) && (n < -Math.PI ? n += be : n > Math.PI && (n -= be), s < -Math.PI ? s += be : s > Math.PI && (s -= be), n <= s ? this._spherical.theta = Math.max(n, Math.min(s, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (n + s) / 2 ? Math.max(n, this._spherical.theta) : Math.min(s, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
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
        const o = new I(this._mouse.x, this._mouse.y, 0);
        o.unproject(this.object);
        const l = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), r = l !== this.object.zoom;
        const c = new I(this._mouse.x, this._mouse.y, 0);
        c.unproject(this.object), this.object.position.sub(c).add(o), this.object.updateMatrixWorld(), a = ce.length();
      } else
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
      a !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position) : (ss.origin.copy(this.object.position), ss.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(ss.direction)) < Op ? this.object.lookAt(this.target) : (xo.setFromNormalAndCoplanarPoint(this.object.up, this.target), ss.intersectPlane(xo, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const a = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), a !== this.object.zoom && (this.object.updateProjectionMatrix(), r = !0);
    }
    return this._scale = 1, this._performCursorZoom = !1, r || this._lastPosition.distanceToSquared(this.object.position) > rr || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > rr || this._lastTargetPosition.distanceToSquared(this.target) > rr ? (this.dispatchEvent(vo), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
  }
  _getAutoRotationAngle(t) {
    return t !== null ? be / 60 * this.autoRotateSpeed * t : be / 60 / 60 * this.autoRotateSpeed;
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
    this._rotateLeft(be * this._rotateDelta.x / e.clientHeight), this._rotateUp(be * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
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
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateUp(be * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, this.keyPanSpeed), e = !0;
        break;
      case this.keys.BOTTOM:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateUp(-be * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, -this.keyPanSpeed), e = !0;
        break;
      case this.keys.LEFT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateLeft(be * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(this.keyPanSpeed, 0), e = !0;
        break;
      case this.keys.RIGHT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateLeft(-be * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(-this.keyPanSpeed, 0), e = !0;
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
    this._rotateLeft(be * this._rotateDelta.x / e.clientHeight), this._rotateUp(be * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd);
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
    e === void 0 && (e = new Dt(), this._pointerPositions[t.pointerId] = e), e.set(t.pageX, t.pageY);
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
function zp(i) {
  this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(i.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.domElement.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(i) && (this._addPointer(i), i.pointerType === "touch" ? this._onTouchStart(i) : this._onMouseDown(i)));
}
function Hp(i) {
  this.enabled !== !1 && (i.pointerType === "touch" ? this._onTouchMove(i) : this._onMouseMove(i));
}
function Vp(i) {
  switch (this._removePointer(i), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(i.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(pl), this.state = Kt.NONE;
      break;
    case 1:
      const t = this._pointers[0], e = this._pointerPositions[t];
      this._onTouchStart({ pointerId: t, pageX: e.x, pageY: e.y });
      break;
  }
}
function Gp(i) {
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
    case ai.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseDownDolly(i), this.state = Kt.DOLLY;
      break;
    case ai.ROTATE:
      if (i.ctrlKey || i.metaKey || i.shiftKey) {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(i), this.state = Kt.PAN;
      } else {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(i), this.state = Kt.ROTATE;
      }
      break;
    case ai.PAN:
      if (i.ctrlKey || i.metaKey || i.shiftKey) {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(i), this.state = Kt.ROTATE;
      } else {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(i), this.state = Kt.PAN;
      }
      break;
    default:
      this.state = Kt.NONE;
  }
  this.state !== Kt.NONE && this.dispatchEvent(oa);
}
function kp(i) {
  switch (this.state) {
    case Kt.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(i);
      break;
    case Kt.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(i);
      break;
    case Kt.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(i);
      break;
  }
}
function Wp(i) {
  this.enabled === !1 || this.enableZoom === !1 || this.state !== Kt.NONE || (i.preventDefault(), this.dispatchEvent(oa), this._handleMouseWheel(this._customWheelEvent(i)), this.dispatchEvent(pl));
}
function Xp(i) {
  this.enabled !== !1 && this._handleKeyDown(i);
}
function Yp(i) {
  switch (this._trackPointer(i), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case ii.ROTATE:
          if (this.enableRotate === !1) return;
          this._handleTouchStartRotate(i), this.state = Kt.TOUCH_ROTATE;
          break;
        case ii.PAN:
          if (this.enablePan === !1) return;
          this._handleTouchStartPan(i), this.state = Kt.TOUCH_PAN;
          break;
        default:
          this.state = Kt.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case ii.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          this._handleTouchStartDollyPan(i), this.state = Kt.TOUCH_DOLLY_PAN;
          break;
        case ii.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          this._handleTouchStartDollyRotate(i), this.state = Kt.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = Kt.NONE;
      }
      break;
    default:
      this.state = Kt.NONE;
  }
  this.state !== Kt.NONE && this.dispatchEvent(oa);
}
function qp(i) {
  switch (this._trackPointer(i), this.state) {
    case Kt.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      this._handleTouchMoveRotate(i), this.update();
      break;
    case Kt.TOUCH_PAN:
      if (this.enablePan === !1) return;
      this._handleTouchMovePan(i), this.update();
      break;
    case Kt.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      this._handleTouchMoveDollyPan(i), this.update();
      break;
    case Kt.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      this._handleTouchMoveDollyRotate(i), this.update();
      break;
    default:
      this.state = Kt.NONE;
  }
}
function jp(i) {
  this.enabled !== !1 && i.preventDefault();
}
function Zp(i) {
  i.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function Kp(i) {
  i.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
const $p = {
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
}, Jp = [0.75, 0.4, 0.75], Qp = {
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
}, tm = 1.5, ml = 0.3, Mo = 0.15, So = 1, Eo = 2, yo = 3, To = 4, rs = 0.18, bo = 0.1, Ao = 0.2, wo = 0.08, Ro = 0.1, Co = 0.06, em = {
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
function xs(i) {
  return $p[i] ?? Jp;
}
function _l(i) {
  return Qp[i] ?? tm;
}
function nm(i) {
  return em[i] ?? `#${i}`;
}
const im = (
  /* glsl */
  `precision highp float;

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
), sm = (
  /* glsl */
  `precision highp float;

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
), rm = (
  /* glsl */
  `precision highp float;

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
), am = (
  /* glsl */
  `precision highp float;

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
class om {
  constructor(t = 1e6) {
    _t(this, "mesh");
    _t(this, "geo");
    _t(this, "material");
    _t(this, "centerAttr");
    _t(this, "radiusAttr");
    _t(this, "colorAttr");
    _t(this, "centerBuf");
    _t(this, "radiusBuf");
    _t(this, "colorBuf");
    _t(this, "nAtoms", 0);
    _t(this, "capacity");
    this.capacity = t, this.geo = new ll();
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
    this.geo.setAttribute("position", new _e(e, 3)), this.geo.setIndex(new _e(n, 1)), this.geo.instanceCount = 0, this.centerBuf = new Float32Array(t * 3), this.radiusBuf = new Float32Array(t), this.colorBuf = new Float32Array(t * 3), this.centerAttr = new Me(this.centerBuf, 3), this.radiusAttr = new Me(this.radiusBuf, 1), this.colorAttr = new Me(this.colorBuf, 3), this.centerAttr.setUsage(si), this.radiusAttr.setUsage(an), this.colorAttr.setUsage(an), this.geo.setAttribute("instanceCenter", this.centerAttr), this.geo.setAttribute("instanceRadius", this.radiusAttr), this.geo.setAttribute("instanceColor", this.colorAttr), this.material = new rl({
      glslVersion: ps,
      vertexShader: im,
      fragmentShader: sm,
      uniforms: {
        uScaleMultiplier: { value: 1 },
        uOpacity: { value: 1 }
      },
      depthWrite: !0,
      depthTest: !0
    }), this.mesh = new De(this.geo, this.material), this.mesh.frustumCulled = !1;
  }
  loadSnapshot(t) {
    const { nAtoms: e, positions: n, elements: s } = t;
    this.nAtoms = e, e > this.capacity && this.grow(e);
    for (let r = 0; r < e; r++) {
      const a = r * 3;
      this.centerBuf[a] = n[a], this.centerBuf[a + 1] = n[a + 1], this.centerBuf[a + 2] = n[a + 2], this.radiusBuf[r] = _l(s[r]) * ml;
      const [o, l, c] = xs(s[r]);
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
    this.capacity = Math.max(t, this.capacity * 2);
    const e = new Float32Array(this.capacity * 3), n = new Float32Array(this.capacity), s = new Float32Array(this.capacity * 3);
    e.set(this.centerBuf), n.set(this.radiusBuf), s.set(this.colorBuf), this.centerBuf = e, this.radiusBuf = n, this.colorBuf = s, this.centerAttr = new Me(this.centerBuf, 3), this.radiusAttr = new Me(this.radiusBuf, 1), this.colorAttr = new Me(this.colorBuf, 3), this.centerAttr.setUsage(si), this.radiusAttr.setUsage(an), this.colorAttr.setUsage(an), this.geo.setAttribute("instanceCenter", this.centerAttr), this.geo.setAttribute("instanceRadius", this.radiusAttr), this.geo.setAttribute("instanceColor", this.colorAttr);
  }
  dispose() {
    this.geo.dispose(), this.material.dispose();
  }
}
const vn = new I(), fe = new I(), Po = new I(0, 1, 0), Do = new I(1, 0, 0);
class lm {
  constructor(t = 3e6) {
    _t(this, "mesh");
    _t(this, "geo");
    _t(this, "bondMaterial");
    _t(this, "startAttr");
    _t(this, "endAttr");
    _t(this, "colorAttr");
    _t(this, "radiusAttr");
    _t(this, "dashedAttr");
    _t(this, "startBuf");
    _t(this, "endBuf");
    _t(this, "colorBuf");
    _t(this, "radiusBuf");
    _t(this, "dashedBuf");
    _t(this, "visualBonds", []);
    _t(this, "capacity");
    this.capacity = t, this.geo = new ll();
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
    this.geo.setAttribute("position", new _e(e, 3)), this.geo.setAttribute("uv", new _e(n, 2)), this.geo.setIndex(new _e(s, 1)), this.geo.instanceCount = 0, this.startBuf = new Float32Array(t * 3), this.endBuf = new Float32Array(t * 3), this.colorBuf = new Float32Array(t * 3), this.radiusBuf = new Float32Array(t), this.dashedBuf = new Float32Array(t), this.startAttr = new Me(this.startBuf, 3), this.endAttr = new Me(this.endBuf, 3), this.colorAttr = new Me(this.colorBuf, 3), this.radiusAttr = new Me(this.radiusBuf, 1), this.dashedAttr = new Me(this.dashedBuf, 1), this.startAttr.setUsage(si), this.endAttr.setUsage(si), this.geo.setAttribute("instanceStart", this.startAttr), this.geo.setAttribute("instanceEnd", this.endAttr), this.geo.setAttribute("instanceColor", this.colorAttr), this.geo.setAttribute("instanceRadius", this.radiusAttr), this.geo.setAttribute("instanceDashed", this.dashedAttr), this.bondMaterial = new rl({
      glslVersion: ps,
      vertexShader: rm,
      fragmentShader: am,
      uniforms: {
        uOpacity: { value: 1 },
        uBondScaleMultiplier: { value: 1 }
      },
      depthWrite: !0,
      depthTest: !0
    }), this.mesh = new De(this.geo, this.bondMaterial), this.mesh.frustumCulled = !1;
  }
  loadSnapshot(t) {
    const { nBonds: e, positions: n, elements: s, bonds: r, bondOrders: a } = t;
    this.visualBonds = [];
    let o = 0;
    for (let c = 0; c < e; c++) {
      const h = a ? a[c] : So;
      h === Eo ? o += 2 : h === yo ? o += 3 : h === To ? o += 2 : o += 1;
    }
    o > this.capacity && this.grow(o);
    let l = 0;
    for (let c = 0; c < e; c++) {
      const h = r[c * 2], d = r[c * 2 + 1], f = a ? a[c] : So;
      vn.set(
        n[d * 3] - n[h * 3],
        n[d * 3 + 1] - n[h * 3 + 1],
        n[d * 3 + 2] - n[h * 3 + 2]
      ).normalize(), fe.crossVectors(vn, Po), fe.lengthSq() < 1e-3 && fe.crossVectors(vn, Do), fe.normalize();
      const [m, g, x] = xs(s[h]), [p, u, b] = xs(s[d]), T = (m + p) * 0.5, E = (g + u) * 0.5, U = (x + b) * 0.5;
      if (f === Eo)
        for (const w of [-1, 1])
          this.visualBonds.push({
            ai: h,
            bi: d,
            radius: bo,
            offsetX: w * rs,
            offsetY: 0,
            dashed: 0
          }), this.setInstance(
            l,
            n,
            h,
            d,
            bo,
            fe,
            w * rs,
            T,
            E,
            U,
            0
          ), l++;
      else if (f === yo) {
        const w = new I().crossVectors(vn, fe).normalize(), R = [0, 2 * Math.PI / 3, 4 * Math.PI / 3];
        for (const N of R) {
          const S = Math.cos(N) * Ao, M = Math.sin(N) * Ao;
          this.visualBonds.push({
            ai: h,
            bi: d,
            radius: wo,
            offsetX: S,
            offsetY: M,
            dashed: 0
          });
          const C = fe.clone().multiplyScalar(S).addScaledVector(w, M);
          this.setInstanceWithOffset(
            l,
            n,
            h,
            d,
            wo,
            C,
            T,
            E,
            U,
            0
          ), l++;
        }
      } else f === To ? (this.visualBonds.push({
        ai: h,
        bi: d,
        radius: Ro,
        offsetX: 0,
        offsetY: 0,
        dashed: 0
      }), this.setInstance(
        l,
        n,
        h,
        d,
        Ro,
        fe,
        0,
        T,
        E,
        U,
        0
      ), l++, this.visualBonds.push({
        ai: h,
        bi: d,
        radius: Co,
        offsetX: rs,
        offsetY: 0,
        dashed: 1
      }), this.setInstance(
        l,
        n,
        h,
        d,
        Co,
        fe,
        rs,
        T,
        E,
        U,
        1
      ), l++) : (this.visualBonds.push({
        ai: h,
        bi: d,
        radius: Mo,
        offsetX: 0,
        offsetY: 0,
        dashed: 0
      }), this.setInstance(
        l,
        n,
        h,
        d,
        Mo,
        fe,
        0,
        T,
        E,
        U,
        0
      ), l++);
    }
    this.startAttr.needsUpdate = !0, this.endAttr.needsUpdate = !0, this.colorAttr.needsUpdate = !0, this.radiusAttr.needsUpdate = !0, this.dashedAttr.needsUpdate = !0, this.geo.instanceCount = l;
  }
  updatePositions(t, e, n) {
    for (let s = 0; s < this.visualBonds.length; s++) {
      const r = this.visualBonds[s], a = r.ai, o = r.bi, l = a * 3, c = o * 3, h = s * 3;
      if (vn.set(
        t[c] - t[l],
        t[c + 1] - t[l + 1],
        t[c + 2] - t[l + 2]
      ).normalize(), fe.crossVectors(vn, Po), fe.lengthSq() < 1e-3 && fe.crossVectors(vn, Do), fe.normalize(), r.offsetX === 0 && r.offsetY === 0)
        this.startBuf[h] = t[l], this.startBuf[h + 1] = t[l + 1], this.startBuf[h + 2] = t[l + 2], this.endBuf[h] = t[c], this.endBuf[h + 1] = t[c + 1], this.endBuf[h + 2] = t[c + 2];
      else {
        const d = new I().crossVectors(vn, fe).normalize(), f = fe.x * r.offsetX + d.x * r.offsetY, m = fe.y * r.offsetX + d.y * r.offsetY, g = fe.z * r.offsetX + d.z * r.offsetY;
        this.startBuf[h] = t[l] + f, this.startBuf[h + 1] = t[l + 1] + m, this.startBuf[h + 2] = t[l + 2] + g, this.endBuf[h] = t[c] + f, this.endBuf[h + 1] = t[c + 1] + m, this.endBuf[h + 2] = t[c + 2] + g;
      }
    }
    this.startAttr.needsUpdate = !0, this.endAttr.needsUpdate = !0;
  }
  setInstance(t, e, n, s, r, a, o, l, c, h, d) {
    const f = n * 3, m = s * 3, g = t * 3, x = a.x * o, p = a.y * o, u = a.z * o;
    this.startBuf[g] = e[f] + x, this.startBuf[g + 1] = e[f + 1] + p, this.startBuf[g + 2] = e[f + 2] + u, this.endBuf[g] = e[m] + x, this.endBuf[g + 1] = e[m + 1] + p, this.endBuf[g + 2] = e[m + 2] + u, this.colorBuf[g] = l, this.colorBuf[g + 1] = c, this.colorBuf[g + 2] = h, this.radiusBuf[t] = r, this.dashedBuf[t] = d;
  }
  setInstanceWithOffset(t, e, n, s, r, a, o, l, c, h) {
    const d = n * 3, f = s * 3, m = t * 3;
    this.startBuf[m] = e[d] + a.x, this.startBuf[m + 1] = e[d + 1] + a.y, this.startBuf[m + 2] = e[d + 2] + a.z, this.endBuf[m] = e[f] + a.x, this.endBuf[m + 1] = e[f + 1] + a.y, this.endBuf[m + 2] = e[f + 2] + a.z, this.colorBuf[m] = o, this.colorBuf[m + 1] = l, this.colorBuf[m + 2] = c, this.radiusBuf[t] = r, this.dashedBuf[t] = h;
  }
  grow(t) {
    this.capacity = Math.max(t, this.capacity * 2);
    const e = new Float32Array(this.capacity * 3), n = new Float32Array(this.capacity * 3), s = new Float32Array(this.capacity * 3), r = new Float32Array(this.capacity), a = new Float32Array(this.capacity);
    e.set(this.startBuf), n.set(this.endBuf), s.set(this.colorBuf), r.set(this.radiusBuf), a.set(this.dashedBuf), this.startBuf = e, this.endBuf = n, this.colorBuf = s, this.radiusBuf = r, this.dashedBuf = a, this.startAttr = new Me(this.startBuf, 3), this.endAttr = new Me(this.endBuf, 3), this.colorAttr = new Me(this.colorBuf, 3), this.radiusAttr = new Me(this.radiusBuf, 1), this.dashedAttr = new Me(this.dashedBuf, 1), this.startAttr.setUsage(si), this.endAttr.setUsage(si), this.colorAttr.setUsage(an), this.radiusAttr.setUsage(an), this.dashedAttr.setUsage(an), this.geo.setAttribute("instanceStart", this.startAttr), this.geo.setAttribute("instanceEnd", this.endAttr), this.geo.setAttribute("instanceColor", this.colorAttr), this.geo.setAttribute("instanceRadius", this.radiusAttr), this.geo.setAttribute("instanceDashed", this.dashedAttr);
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
class cm {
  constructor() {
    _t(this, "mesh");
    _t(this, "geometry");
    this.geometry = new ze();
    const t = new Float32Array(72);
    this.geometry.setAttribute(
      "position",
      new _e(t, 3)
    );
    const e = new sa({
      color: 6710886,
      transparent: !0,
      opacity: 0.5
    });
    this.mesh = new Wc(this.geometry, e), this.mesh.frustumCulled = !1, this.mesh.visible = !1;
  }
  /**
   * Update the cell box from a 3x3 matrix (row-major Float32Array of length 9).
   * Cell vectors: va = box[0..2], vb = box[3..5], vc = box[6..8].
   */
  loadBox(t) {
    const e = new I(t[0], t[1], t[2]), n = new I(t[3], t[4], t[5]), s = new I(t[6], t[7], t[8]), r = new I(0, 0, 0), a = e.clone(), o = n.clone(), l = s.clone(), c = e.clone().add(n), h = e.clone().add(s), d = n.clone().add(s), f = e.clone().add(n).add(s), m = [
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
    ], g = this.geometry.getAttribute(
      "position"
    ), x = g.array;
    for (let p = 0; p < 12; p++) {
      const [u, b] = m[p];
      x[p * 6] = u.x, x[p * 6 + 1] = u.y, x[p * 6 + 2] = u.z, x[p * 6 + 3] = b.x, x[p * 6 + 4] = b.y, x[p * 6 + 5] = b.z;
    }
    g.needsUpdate = !0, this.geometry.computeBoundingSphere(), this.mesh.visible = !0;
  }
  setVisible(t) {
    this.mesh.visible = t;
  }
  dispose() {
    this.geometry.dispose(), this.mesh.material.dispose();
  }
}
const hm = 500, um = "bold 11px sans-serif", Lo = -8;
class dm {
  constructor() {
    _t(this, "canvas");
    _t(this, "ctx");
    _t(this, "labels", null);
    _t(this, "elements", null);
    _t(this, "nAtoms", 0);
    _t(this, "positions", null);
    _t(this, "tmpVec", new I());
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
    const o = Math.min(a.length, hm);
    this.ctx.font = um, this.ctx.textAlign = "center", this.ctx.textBaseline = "bottom";
    for (let l = 0; l < o; l++) {
      const { sx: c, sy: h, idx: d } = a[l], f = this.labels[d], m = this.elements[d], [g, x, p] = xs(m), u = 0.299 * g + 0.587 * x + 0.114 * p, b = u > 0.5 ? "#000000" : "#ffffff", T = u > 0.5 ? "#ffffff" : "#000000";
      this.ctx.strokeStyle = T, this.ctx.lineWidth = 2.5, this.ctx.lineJoin = "round", this.ctx.strokeText(f, c, h + Lo), this.ctx.fillStyle = b, this.ctx.fillText(f, c, h + Lo);
    }
  }
  dispose() {
    this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
  }
}
class fm {
  constructor() {
    _t(this, "container", null);
    _t(this, "renderer");
    _t(this, "scene");
    _t(this, "camera");
    _t(this, "controls");
    _t(this, "atomRenderer", null);
    _t(this, "bondRenderer", null);
    _t(this, "cellRenderer", null);
    _t(this, "labelOverlay", null);
    _t(this, "useImpostor", !1);
    _t(this, "animationId", null);
    _t(this, "snapshot", null);
    _t(this, "lastExtent", 1);
    _t(this, "currentPositions", null);
    _t(this, "atomScale", 1);
    _t(this, "atomOpacity", 1);
    _t(this, "bondScale", 1);
    _t(this, "bondOpacity", 1);
    // Raycasting
    _t(this, "raycaster", new $c());
    _t(this, "mouse", new Dt());
    // Atom selection & measurement
    _t(this, "selectedAtoms", []);
    _t(this, "selectionGroup", new bi());
    _t(this, "animate", () => {
      this.animationId = requestAnimationFrame(this.animate), this.controls.update(), this.renderer.render(this.scene, this.camera), this.labelOverlay && this.container && this.labelOverlay.render(
        this.camera,
        this.container.clientWidth,
        this.container.clientHeight
      );
    });
  }
  /** Mount the viewer into a DOM element. */
  mount(t) {
    this.container = t, this.renderer = new Fp({
      antialias: !0,
      alpha: !0,
      powerPreference: "high-performance",
      preserveDrawingBuffer: !0
    }), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)), this.renderer.setSize(t.clientWidth, t.clientHeight), this.renderer.setClearColor(16777215, 1), t.appendChild(this.renderer.domElement), this.labelOverlay = new dm(), t.appendChild(this.labelOverlay.getCanvas()), this.labelOverlay.resize(
      t.clientWidth,
      t.clientHeight,
      Math.min(window.devicePixelRatio, 2)
    ), this.scene = new Vc(), this.scene.background = new Xt(16777215), this.camera = new Oe(
      50,
      t.clientWidth / t.clientHeight,
      0.1,
      1e4
    ), this.camera.position.set(0, 0, 50), this.controls = new Bp(this.camera, this.renderer.domElement), this.controls.enableDamping = !0, this.controls.dampingFactor = 0.1, this.controls.rotateSpeed = 0.8, this.controls.zoomSpeed = 1.2;
    const e = new qc(14544639, 10057540, 0.4);
    this.scene.add(e);
    const n = new $s(16777215, 0.8);
    n.position.set(50, 50, 50), this.scene.add(n);
    const s = new $s(16777215, 0.4);
    s.position.set(-30, 20, -20), this.scene.add(s);
    const r = new $s(16777215, 0.3);
    r.position.set(0, -30, -50), this.scene.add(r), this.scene.add(this.selectionGroup), new ResizeObserver(() => this.onResize()).observe(t), this.animate();
  }
  /** Load a molecular snapshot (topology + positions). */
  loadSnapshot(t) {
    this.snapshot = t, this.currentPositions = new Float32Array(t.positions), (this.atomRenderer === null || !this.useImpostor) && this.swapRenderers(!0), this.atomRenderer.loadSnapshot(t), this.bondRenderer.loadSnapshot(t), this.atomScale !== 1 && this.atomRenderer.setScale && this.atomRenderer.setScale(this.atomScale, t), this.bondScale !== 1 && this.bondRenderer.setScale && this.bondRenderer.setScale(this.bondScale, t), this.labelOverlay && (this.labelOverlay.setAtomData(t.elements, t.nAtoms), this.labelOverlay.setPositions(t.positions)), t.box && t.box.some((n) => n !== 0) && (this.cellRenderer || (this.cellRenderer = new cm(), this.scene.add(this.cellRenderer.mesh)), this.cellRenderer.loadBox(t.box)), this.fitToView(t);
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
    var s, r, a, o;
    this.atomRenderer && (this.scene.remove(this.atomRenderer.mesh), this.atomRenderer.dispose()), this.bondRenderer && (this.scene.remove(this.bondRenderer.mesh), this.bondRenderer.dispose()), this.useImpostor = t;
    const e = new om(), n = new lm();
    this.atomRenderer = e, this.bondRenderer = n, this.scene.add(this.atomRenderer.mesh), this.scene.add(this.bondRenderer.mesh), this.atomOpacity !== 1 && ((r = (s = this.atomRenderer).setOpacity) == null || r.call(s, this.atomOpacity)), this.bondOpacity !== 1 && ((o = (a = this.bondRenderer).setOpacity) == null || o.call(a, this.bondOpacity));
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
    const g = m * 1.2;
    this.camera.position.set(h, d, f + g), this.camera.near = g * 0.01, this.camera.far = g * 10, this.camera.updateProjectionMatrix(), this.controls.update();
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
          elementSymbol: nm(o),
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
    return null;
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
    const a = t[n * 3] - t[e * 3], o = t[n * 3 + 1] - t[e * 3 + 1], l = t[n * 3 + 2] - t[e * 3 + 2], c = t[s * 3] - t[n * 3], h = t[s * 3 + 1] - t[n * 3 + 1], d = t[s * 3 + 2] - t[n * 3 + 2], f = t[r * 3] - t[s * 3], m = t[r * 3 + 1] - t[s * 3 + 1], g = t[r * 3 + 2] - t[s * 3 + 2], x = o * d - l * h, p = l * c - a * d, u = a * h - o * c, b = h * g - d * m, T = d * f - c * g, E = c * m - h * f, U = Math.sqrt(c * c + h * h + d * d), w = c / U, R = h / U, N = d / U, S = p * N - u * R, M = u * w - x * N, C = x * R - p * w, k = x * b + p * T + u * E, z = S * b + M * T + C * E;
    return Math.atan2(z, k) * (180 / Math.PI);
  }
  updateSelectionVisuals() {
    for (; this.selectionGroup.children.length > 0; ) {
      const n = this.selectionGroup.children[0];
      this.selectionGroup.remove(n), (n instanceof De || n instanceof Yr) && (n.geometry.dispose(), Array.isArray(n.material) ? n.material.forEach((s) => s.dispose()) : n.material.dispose());
    }
    if (!this.snapshot || this.selectedAtoms.length === 0) return;
    const t = this.getCurrentPositions(), e = this.snapshot.elements;
    for (const n of this.selectedAtoms) {
      const s = _l(e[n]) * ml * 1.6, r = new ra(s, 16, 16), a = new na({
        color: 4359668,
        transparent: !0,
        opacity: 0.35,
        depthWrite: !1
      }), o = new De(r, a);
      o.position.set(
        t[n * 3],
        t[n * 3 + 1],
        t[n * 3 + 2]
      ), this.selectionGroup.add(o);
    }
    if (this.selectedAtoms.length >= 2) {
      const n = this.selectedAtoms.map(
        (o) => new I(t[o * 3], t[o * 3 + 1], t[o * 3 + 2])
      ), s = new ze().setFromPoints(n), r = new sa({
        color: 4359668,
        depthTest: !1
      }), a = new Yr(s, r);
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
const Uo = 1313293645, pm = 0, mm = 1, _m = 1, gm = 2;
function Io(i) {
  const t = new DataView(i), e = t.getUint32(0, !0);
  if (e !== Uo)
    throw new Error(
      `Invalid magic: 0x${e.toString(16)}, expected 0x${Uo.toString(16)}`
    );
  return {
    msgType: t.getUint8(4),
    flags: t.getUint8(5)
  };
}
function vm(i) {
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
  e & _m && (c = new Uint8Array(i, n, r), n += r, n += (4 - n % 4) % 4);
  let h = null;
  return e & gm && (h = new Float32Array(i, n, 9), n += 36), { nAtoms: s, nBonds: r, nFileBonds: r, positions: a, elements: o, bonds: l, bondOrders: c, box: h };
}
function xm(i) {
  const t = new DataView(i);
  let e = 8;
  const n = t.getUint32(e, !0);
  e += 4;
  const s = t.getUint32(e, !0);
  e += 4;
  const r = new Float32Array(i, e, s * 3);
  return { frameId: n, nAtoms: s, positions: r };
}
function Mm({ model: i, el: t }) {
  const e = document.createElement("div");
  e.style.width = "100%", e.style.height = "500px", e.style.position = "relative", e.style.background = "#ffffff", e.style.borderRadius = "8px", e.style.overflow = "hidden", t.appendChild(e);
  const n = document.createElement("div");
  n.style.cssText = "position:absolute;top:8px;left:8px;background:rgba(255,255,255,0.85);backdrop-filter:blur(8px);border-radius:6px;padding:4px 12px;font:13px system-ui;color:#495057;z-index:10;", n.innerHTML = "<strong>megane</strong>", e.appendChild(n);
  let s = null, r = null, a = !1;
  function o() {
    if (s || a) return !!s;
    if (e.clientWidth === 0 || e.clientHeight === 0) return !1;
    try {
      return s = new fm(), s.mount(e), c(), !0;
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
    const { msgType: m } = Io(f);
    m === pm && (r = vm(f), s.loadSnapshot(r), n.innerHTML = `<strong>megane</strong> &nbsp; ${r.nAtoms.toLocaleString()} atoms / ${r.nBonds.toLocaleString()} bonds`);
  }
  function h() {
    if (!s) return;
    const d = i.get("_frame_data");
    if (!d || d.byteLength === 0 || !r) return;
    const f = new ArrayBuffer(d.byteLength);
    new Uint8Array(f).set(new Uint8Array(d.buffer, d.byteOffset, d.byteLength));
    const { msgType: m } = Io(f);
    if (m === mm) {
      const g = xm(f);
      s.updateFrame(g);
    }
  }
  return i.on("change:_snapshot_data", () => {
    s ? c() : o();
  }), i.on("change:_frame_data", h), () => {
    a = !0, l.disconnect(), s == null || s.dispose();
  };
}
const Em = { render: Mm };
export {
  Em as default
};
