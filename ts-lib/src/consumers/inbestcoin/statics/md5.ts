
export function inbest_md5(i, n?, t?) {
    function e(i, n) {
        var t = (65535 & i) + (65535 & n);
        return (i >> 16) + (n >> 16) + (t >> 16) << 16 | 65535 & t
    }
    function a(i, n) {
        return i << n | i >>> 32 - n
    }
    function s(i, n, t, s, r, o) {
        return e(a(e(e(n, i), e(s, o)), r), t)
    }
    function r(i, n, t, e, a, r, o) {
        return s(n & t | ~n & e, i, n, a, r, o)
    }
    function o(i, n, t, e, a, r, o) {
        return s(n & e | t & ~e, i, n, a, r, o)
    }
    function d(i, n, t, e, a, r, o) {
        return s(n ^ t ^ e, i, n, a, r, o)
    }
    function l(i, n, t, e, a, r, o) {
        return s(t ^ (n | ~e), i, n, a, r, o)
    }
    function c(i, n) {
        i[n >> 5] |= 128 << n % 32,
            i[14 + (n + 64 >>> 9 << 4)] = n;
        var t, a, s, c, u, h = 1732584193, g = -271733879, m = -1732584194, p = 271733878;
        for (t = 0; t < i.length; t += 16)
            a = h,
                s = g,
                c = m,
                u = p,
                h = r(h, g, m, p, i[t], 7, -680876936),
                p = r(p, h, g, m, i[t + 1], 12, -389564586),
                m = r(m, p, h, g, i[t + 2], 17, 606105819),
                g = r(g, m, p, h, i[t + 3], 22, -1044525330),
                h = r(h, g, m, p, i[t + 4], 7, -176418897),
                p = r(p, h, g, m, i[t + 5], 12, 1200080426),
                m = r(m, p, h, g, i[t + 6], 17, -1473231341),
                g = r(g, m, p, h, i[t + 7], 22, -45705983),
                h = r(h, g, m, p, i[t + 8], 7, 1770035416),
                p = r(p, h, g, m, i[t + 9], 12, -1958414417),
                m = r(m, p, h, g, i[t + 10], 17, -42063),
                g = r(g, m, p, h, i[t + 11], 22, -1990404162),
                h = r(h, g, m, p, i[t + 12], 7, 1804603682),
                p = r(p, h, g, m, i[t + 13], 12, -40341101),
                m = r(m, p, h, g, i[t + 14], 17, -1502002290),
                g = r(g, m, p, h, i[t + 15], 22, 1236535329),
                h = o(h, g, m, p, i[t + 1], 5, -165796510),
                p = o(p, h, g, m, i[t + 6], 9, -1069501632),
                m = o(m, p, h, g, i[t + 11], 14, 643717713),
                g = o(g, m, p, h, i[t], 20, -373897302),
                h = o(h, g, m, p, i[t + 5], 5, -701558691),
                p = o(p, h, g, m, i[t + 10], 9, 38016083),
                m = o(m, p, h, g, i[t + 15], 14, -660478335),
                g = o(g, m, p, h, i[t + 4], 20, -405537848),
                h = o(h, g, m, p, i[t + 9], 5, 568446438),
                p = o(p, h, g, m, i[t + 14], 9, -1019803690),
                m = o(m, p, h, g, i[t + 3], 14, -187363961),
                g = o(g, m, p, h, i[t + 8], 20, 1163531501),
                h = o(h, g, m, p, i[t + 13], 5, -1444681467),
                p = o(p, h, g, m, i[t + 2], 9, -51403784),
                m = o(m, p, h, g, i[t + 7], 14, 1735328473),
                g = o(g, m, p, h, i[t + 12], 20, -1926607734),
                h = d(h, g, m, p, i[t + 5], 4, -378558),
                p = d(p, h, g, m, i[t + 8], 11, -2022574463),
                m = d(m, p, h, g, i[t + 11], 16, 1839030562),
                g = d(g, m, p, h, i[t + 14], 23, -35309556),
                h = d(h, g, m, p, i[t + 1], 4, -1530992060),
                p = d(p, h, g, m, i[t + 4], 11, 1272893353),
                m = d(m, p, h, g, i[t + 7], 16, -155497632),
                g = d(g, m, p, h, i[t + 10], 23, -1094730640),
                h = d(h, g, m, p, i[t + 13], 4, 681279174),
                p = d(p, h, g, m, i[t], 11, -358537222),
                m = d(m, p, h, g, i[t + 3], 16, -722521979),
                g = d(g, m, p, h, i[t + 6], 23, 76029189),
                h = d(h, g, m, p, i[t + 9], 4, -640364487),
                p = d(p, h, g, m, i[t + 12], 11, -421815835),
                m = d(m, p, h, g, i[t + 15], 16, 530742520),
                g = d(g, m, p, h, i[t + 2], 23, -995338651),
                h = l(h, g, m, p, i[t], 6, -198630844),
                p = l(p, h, g, m, i[t + 7], 10, 1126891415),
                m = l(m, p, h, g, i[t + 14], 15, -1416354905),
                g = l(g, m, p, h, i[t + 5], 21, -57434055),
                h = l(h, g, m, p, i[t + 12], 6, 1700485571),
                p = l(p, h, g, m, i[t + 3], 10, -1894986606),
                m = l(m, p, h, g, i[t + 10], 15, -1051523),
                g = l(g, m, p, h, i[t + 1], 21, -2054922799),
                h = l(h, g, m, p, i[t + 8], 6, 1873313359),
                p = l(p, h, g, m, i[t + 15], 10, -30611744),
                m = l(m, p, h, g, i[t + 6], 15, -1560198380),
                g = l(g, m, p, h, i[t + 13], 21, 1309151649),
                h = l(h, g, m, p, i[t + 4], 6, -145523070),
                p = l(p, h, g, m, i[t + 11], 10, -1120210379),
                m = l(m, p, h, g, i[t + 2], 15, 718787259),
                g = l(g, m, p, h, i[t + 9], 21, -343485551),
                h = e(h, a),
                g = e(g, s),
                m = e(m, c),
                p = e(p, u);
        return [h, g, m, p]
    }
    function u(i) {
        var n, t = "";
        for (n = 0; n < 32 * i.length; n += 8)
            t += String.fromCharCode(i[n >> 5] >>> n % 32 & 255);
        return t
    }
    function h(i) {
        var n, t = [];
        for (t[(i.length >> 2) - 1] = void 0,
            n = 0; n < t.length; n += 1)
            t[n] = 0;
        for (n = 0; n < 8 * i.length; n += 8)
            t[n >> 5] |= (255 & i.charCodeAt(n / 8)) << n % 32;
        return t
    }
    function g(i) {
        return u(c(h(i), 8 * i.length))
    }
    function m(i, n) {
        var t, e, a = h(i), s = [], r = [];
        for (s[15] = r[15] = void 0,
            a.length > 16 && (a = c(a, 8 * i.length)),
            t = 0; t < 16; t += 1)
            s[t] = 909522486 ^ a[t],
                r[t] = 1549556828 ^ a[t];
        return e = c(s.concat(h(n)), 512 + 8 * n.length),
            u(c(r.concat(e), 640))
    }
    function p(i) {
        var n, t, e = "0123456789abcdef", a = "";
        for (t = 0; t < i.length; t += 1)
            n = i.charCodeAt(t),
                a += e.charAt(n >>> 4 & 15) + e.charAt(15 & n);
        return a
    }
    function f(i) {
        return unescape(encodeURIComponent(i))
    }
    function v(i) {
        return g(f(i))
    }
    function y(i) {
        return p(v(i))
    }
    function b(i, n) {
        return m(f(i), f(n))
    }
    function C(i, n) {
        return p(b(i, n))
    }
    return function (i, n, t) {
        return n ? t ? b(n, i) : C(n, i) : t ? v(i) : y(i)
    }(i + "hello, moto", n, t)
}