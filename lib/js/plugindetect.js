/*
PluginDetect v0.8.0
www.pinlady.net/PluginDetect/license/
[ getVersion isMinVersion onWindowLoaded onDetectionDone getInfo beforeInstantiate BetterIE ]
[ AdobeReader DevalVR Flash Java(OTF & NOTF) PDFreader(OTF & NOTF) QuickTime RealPlayer Shockwave Silverlight VLC WMP ]
*/
var PluginDetect = {
    version: "0.8.0",
    name: "PluginDetect",
    openTag: "<",
    isDefined: function (b) {
        return typeof b != "undefined"
    },
    isArray: function (b) {
        return (/array/i).test(Object.prototype.toString.call(b))
    },
    isFunc: function (b) {
        return typeof b == "function"
    },
    isString: function (b) {
        return typeof b == "string"
    },
    isNum: function (b) {
        return typeof b == "number"
    },
    isStrNum: function (b) {
        return (typeof b == "string" && (/\d/).test(b))
    },
    getNumRegx: /[\d][\d\.\_,-]*/,
    splitNumRegx: /[\.\_,-]/g,
    getNum: function (b, c) {
        var d = this,
            a = d.isStrNum(b) ? (d.isDefined(c) ? new RegExp(c) : d.getNumRegx).exec(b) : null;
        return a ? a[0] : null
    },
    compareNums: function (h, f, d) {
        var e = this,
            c, b, a, g = parseInt;
        if (e.isStrNum(h) && e.isStrNum(f)) {
            if (e.isDefined(d) && d.compareNums) {
                return d.compareNums(h, f)
            }
            c = h.split(e.splitNumRegx);
            b = f.split(e.splitNumRegx);
            for (a = 0; a < Math.min(c.length, b.length); a++) {
                if (g(c[a], 10) > g(b[a], 10)) {
                    return 1
                }
                if (g(c[a], 10) < g(b[a], 10)) {
                    return -1
                }
            }
        }
        return 0
    },
    formatNum: function (b, c) {
        var d = this,
            a, e;
        if (!d.isStrNum(b)) {
            return null
        }
        if (!d.isNum(c)) {
            c = 4
        }
        c--;
        e = b.replace(/\s/g, "").split(d.splitNumRegx).concat(["0", "0", "0", "0"]);
        for (a = 0; a < 4; a++) {
            if (/^(0+)(.+)$/.test(e[a])) {
                e[a] = RegExp.$2
            }
            if (a > c || !(/\d/).test(e[a])) {
                e[a] = "0"
            }
        }
        return e.slice(0, 4).join(",")
    },
    $$hasMimeType: function (a) {
        return function (c) {
            if (!a.isIE && c) {
                var f, e, b, d = a.isArray(c) ? c : (a.isString(c) ? [c] : []);
                for (b = 0; b < d.length; b++) {
                    if (a.isString(d[b]) && /[^\s]/.test(d[b])) {
                        f = navigator.mimeTypes[d[b]];
                        e = f ? f.enabledPlugin : 0;
                        if (e && (e.name || e.description)) {
                            return f
                        }
                    }
                }
            }
            return null
        }
    },
    getPROP: function (d, b, a) {
        var c;
        try {
            if (d) {
                a = d[b]
            }
        } catch (c) {}
        return a
    },
    isEnabled: {
        $: 1,
        IEPluginSecurityPopup: function () {
            var a = this,
                b = a.$;
            return b.isIE && b.verIE >= 7 ? 1 : 0
        },
        objectProperty: function (d) {
            var c = this,
                e = c.$,
                b, a = 0;
            if (e.isIE && e.verIE >= 7) {
                b = e.getPROP(d, "object");
                if (e.isDefined(b)) {
                    a = b ? 1 : -1
                }
            }
            return a
        }
    },
    findNavPlugin: function (l, e, c) {
        var j = this,
            h = new RegExp(l, "i"),
            d = (!j.isDefined(e) || e) ? /\d/ : 0,
            k = c ? new RegExp(c, "i") : 0,
            a = navigator.plugins,
            g = "",
            f, b, m;
        for (f = 0; f < a.length; f++) {
            m = a[f].description || g;
            b = a[f].name || g;
            if ((h.test(m) && (!d || d.test(RegExp.leftContext + RegExp.rightContext))) || (h.test(b) && (!d || d.test(RegExp.leftContext + RegExp.rightContext)))) {
                if (!k || !(k.test(m) || k.test(b))) {
                    return a[f]
                }
            }
        }
        return null
    },
    getMimeEnabledPlugin: function (k, m, c) {
        var e = this,
            f, b = new RegExp(m, "i"),
            h = "",
            g = c ? new RegExp(c, "i") : 0,
            a, l, d, j = e.isString(k) ? [k] : k;
        for (d = 0; d < j.length; d++) {
            if ((f = e.hasMimeType(j[d])) && (f = f.enabledPlugin)) {
                l = f.description || h;
                a = f.name || h;
                if (b.test(l) || b.test(a)) {
                    if (!g || !(g.test(l) || g.test(a))) {
                        return f
                    }
                }
            }
        }
        return 0
    },
    init: function (d) {
        var c = this,
            b, d, a = {
                status: -3,
                plugin: 0
            };
        if (!c.isString(d)) {
            return a
        }
        if (d.length == 1) {
            c.getVersionDelimiter = d;
            return a
        }
        d = d.toLowerCase().replace(/\s/g, "");
        b = c.Plugins[d];
        if (!b || !b.getVersion) {
            return a
        }
        a.plugin = b;
        if (!c.isDefined(b.installed)) {
            b.installed = null;
            b.version = null;
            b.version0 = null;
            b.getVersionDone = null;
            b.pluginName = d
        }
        if (c.isIE && !c.ActiveXEnabled && d !== "java") {
            a.status = -2;
            return a
        }
        a.status = 1;
        return a
    },
    getPluginFileVersion: function (f, b) {
        var h = this,
            e, d, g, a, c = -1;
        if (h.OS > 2 || !f || !f.version || !(e = h.getNum(f.version))) {
            return b
        }
        if (!b) {
            return e
        }
        e = h.formatNum(e);
        b = h.formatNum(b);
        d = b.split(h.splitNumRegx);
        g = e.split(h.splitNumRegx);
        for (a = 0; a < d.length; a++) {
            if (c > -1 && a > c && d[a] != "0") {
                return b
            }
            if (g[a] != d[a]) {
                if (c == -1) {
                    c = a
                }
                if (d[a] != "0") {
                    return b
                }
            }
        }
        return e
    },
    AXO: window.ActiveXObject,
    getAXO: function (a) {
        var d = null,
            c, b = this;
        try {
            d = new b.AXO(a)
        } catch (c) {};
        return d
    },
    convertFuncs: function (f) {
        var a, g, d, b = /^[\$][\$]/,
            c = this;
        for (a in f) {
            if (b.test(a)) {
                try {
                    g = a.slice(2);
                    if (g.length > 0 && !f[g]) {
                        f[g] = f[a](f);
                        delete f[a]
                    }
                } catch (d) {}
            }
        }
    },
    initObj: function (e, b, d) {
        var a, c;
        if (e) {
            if (e[b[0]] == 1 || d) {
                for (a = 0; a < b.length; a = a + 2) {
                    e[b[a]] = b[a + 1]
                }
            }
            for (a in e) {
                c = e[a];
                if (c && c[b[0]] == 1) {
                    this.initObj(c, b)
                }
            }
        }
    },
    initScript: function () {
        var $ = this,
            nav = navigator,
            x, doc = document,
            userAgent = nav.userAgent || "",
            vendor = nav.vendor || "",
            platform = nav.platform || "",
            product = nav.product || "";
        $.initObj($, ["$", $]);
        for (x in $.Plugins) {
            if ($.Plugins[x]) {
                $.initObj($.Plugins[x], ["$", $, "$$", $.Plugins[x]], 1)
            }
        }
        $.convertFuncs($);
        $.OS = 100;
        if (platform) {
            var data_plat = ["Win", 1, "Mac", 2, "Linux", 3, "FreeBSD", 4, "iPhone", 21.1, "iPod", 21.2, "iPad", 21.3, "Win.*CE", 22.1, "Win.*Mobile", 22.2, "Pocket\\s*PC", 22.3, "", 100];
            for (x = data_plat.length - 2; x >= 0; x = x - 2) {
                if (data_plat[x] && new RegExp(data_plat[x], "i").test(platform)) {
                    $.OS = data_plat[x + 1];
                    break
                }
            }
        };
        $.head = doc.getElementsByTagName("head")[0] || doc.getElementsByTagName("body")[0] || doc.body || null;
        $.isIE = eval("/*@cc_on!@*/!1");
        $.verIE = $.isIE ? ((/MSIE\s*(\d+\.?\d*)/i).test(userAgent) ? parseFloat(RegExp.$1, 10) : 7) : null;
        $.verIEfull = null;
        $.docModeIE = null;
        if ($.isIE) {
            var e, verFullFloat, obj = document.createElement("div");
            try {
                obj.style.behavior = "url(#default#clientcaps)";
                $.verIEfull = (obj.getComponentVersion("{89820200-ECBD-11CF-8B85-00AA005B4383}", "componentid")).replace(/,/g, ".")
            } catch (e) {}
            verFullFloat = parseFloat($.verIEfull || "0", 10);
            $.docModeIE = doc.documentMode || ((/back/i).test(doc.compatMode || "") ? 5 : verFullFloat) || $.verIE;
            $.verIE = verFullFloat || $.docModeIE
        }
        $.ActiveXEnabled = false;
        if ($.isIE) {
            var x, progid = ["Msxml2.XMLHTTP", "Msxml2.DOMDocument", "Microsoft.XMLDOM", "ShockwaveFlash.ShockwaveFlash", "TDCCtl.TDCCtl", "Shell.UIHelper", "Scripting.Dictionary", "wmplayer.ocx"];
            for (x = 0; x < progid.length; x++) {
                if ($.getAXO(progid[x])) {
                    $.ActiveXEnabled = true;
                    break
                }
            }
            userAgent = ""
        };
        $.isGecko = (/Gecko/i).test(product) && (/Gecko\s*\/\s*\d/i).test(userAgent);
        $.verGecko = $.isGecko ? $.formatNum((/rv\s*\:\s*([\.\,\d]+)/i).test(userAgent) ? RegExp.$1 : "0.9") : null;
        $.isChrome = (/Chrome\s*\/\s*(\d[\d\.]*)/i).test(userAgent);
        $.verChrome = $.isChrome ? $.formatNum(RegExp.$1) : null;
        $.isSafari = ((/Apple/i).test(vendor) || (!vendor && !$.isChrome)) && (/Safari\s*\/\s*(\d[\d\.]*)/i).test(userAgent);
        $.verSafari = $.isSafari && (/Version\s*\/\s*(\d[\d\.]*)/i).test(userAgent) ? $.formatNum(RegExp.$1) : null;
        $.isOpera = (/Opera\s*[\/]?\s*(\d+\.?\d*)/i).test(userAgent);
        $.verOpera = $.isOpera && ((/Version\s*\/\s*(\d+\.?\d*)/i).test(userAgent) || 1) ? parseFloat(RegExp.$1, 10) : null;
        $.addWinEvent("load", $.handler($.runWLfuncs, $))
    },
    handler: function (c, b, a) {
        return function () {
            c(b, a)
        }
    },
    fPush: function (b, a) {
        var c = this;
        if (c.isArray(a) && (c.isFunc(b) || (c.isArray(b) && b.length > 0 && c.isFunc(b[0])))) {
            a.push(b)
        }
    },
    callArray: function (b) {
        var c = this,
            a, d;
        if (c.isArray(b)) {
            d = [].concat(b);
            for (a = 0; a < d.length; a++) {
                c.call(d[a]);
                b.splice(0, 1)
            }
        }
    },
    call: function (c) {
        var b = this,
            a = b.isArray(c) ? c.length : -1;
        if (a > 0 && b.isFunc(c[0])) {
            c[0](b, a > 1 ? c[1] : 0, a > 2 ? c[2] : 0, a > 3 ? c[3] : 0)
        } else {
            if (b.isFunc(c)) {
                c(b)
            }
        }
    },
    $$isMinVersion: function (a) {
        return function (h, g, d, c) {
            var e = a.init(h),
                f, b = -1;
            if (e.status < 0) {
                return e.status
            }
            f = e.plugin;
            g = a.formatNum(a.isNum(g) ? g.toString() : (a.isStrNum(g) ? a.getNum(g) : "0"));
            if (f.getVersionDone != 1) {
                f.getVersion(g, d, c);
                if (f.getVersionDone === null) {
                    f.getVersionDone = 1
                }
            }
            if (f.installed !== null) {
                b = f.installed <= 0.5 ? f.installed : (f.installed == 0.7 ? 1 : (f.version === null ? 0 : (a.compareNums(f.version, g, f) >= 0 ? 1 : -0.1)))
            };
            return b
        }
    },
    getVersionDelimiter: ",",
    $$getVersion: function (a) {
        return function (g, d, c) {
            var e = a.init(g),
                f, b;
            if (e.status < 0) {
                return null
            };
            f = e.plugin;
            if (f.getVersionDone != 1) {
                f.getVersion(null, d, c);
                if (f.getVersionDone === null) {
                    f.getVersionDone = 1
                }
            }
            b = (f.version || f.version0);
            b = b ? b.replace(a.splitNumRegx, a.getVersionDelimiter) : b;
            return b
        }
    },
    $$getInfo: function (a) {
        return function (g, d, c) {
            var b = {}, e = a.init(g),
                f;
            if (e.status < 0) {
                return b
            };
            f = e.plugin;
            if (f.getInfo) {
                if (f.getVersionDone === null) {
                    a.getVersion ? a.getVersion(g, d, c) : a.isMinVersion(g, "0", d, c)
                }
                b = f.getInfo()
            };
            return b
        }
    },
    codebase: {
        $: 1,
        isDisabled: function () {
            var a = this,
                b = a.$;
            return b.ActiveXEnabled && b.isIE && b.verIE >= 7 ? 0 : 1
        },
        checkGarbage: function (d) {
            var b = this,
                c = b.$,
                a;
            if (c.isIE && d && c.isEnabled.objectProperty(d.firstChild) > 0) {
                a = c.getPROP(d.firstChild, "readyState");
                if (c.isNum(a) && a != 4) {
                    b.garbage = 1;
                    return 1
                }
            }
            return 0
        },
        emptyGarbage: function () {
            var a = this,
                b = a.$,
                c;
            if (b.isIE && a.garbage) {
                try {
                    window.CollectGarbage()
                } catch (c) {}
                a.garbage = 0
            }
        },
        init: function (d) {
            if (!d.init) {
                var b = this,
                    c = b.$,
                    a;
                d.init = 1;
                d.min = 0;
                d.max = 0;
                d.hasRun = 0;
                d.version = null;
                d.L = 0;
                d.altHTML = "";
                d.span = document.createElement("span");
                d.tagA = '<object width="1" height="1" style="display:none;" codebase="#version=';
                d.tagB = '" classid="' + d.$$.classID + '">' + d.ParamTags + d.altHTML + c.openTag + "/object>";
                for (a = 0; a < d.Lower.length; a++) {
                    d.Lower[a] = c.formatNum(d.Lower[a]);
                    d.Upper[a] = c.formatNum(d.Upper[a])
                }
            }
        },
        isActiveXObject: function (i, b) {
            var f = this,
                g = f.$,
                a = 0,
                h, d = i.$$,
                c = i.span;
            if (i.min && g.compareNums(b, i.min) <= 0) {
                return 1
            }
            if (i.max && g.compareNums(b, i.max) >= 0) {
                return 0
            }
            if (d.BIfuncs && d.BIfuncs.length) {
                g.callArray(d.BIfuncs)
            }
            c.innerHTML = i.tagA + b + i.tagB;
            if (g.isEnabled.objectProperty(c.firstChild) > 0) {
                a = 1
            };
            f.checkGarbage(c);
            c.innerHTML = "";
            if (a) {
                i.min = b
            } else {
                i.max = b
            }
            return a
        },
        convert_: function (f, a, b, e) {
            var d = f.convert[a],
                c = f.$;
            return d ? (c.isFunc(d) ? c.formatNum(d(b.split(c.splitNumRegx), e).join(",")) : b) : d
        },
        convert: function (h, c, g) {
            var e = this,
                f = h.$,
                b, a, d;
            c = f.formatNum(c);
            a = {
                v: c,
                x: -1
            };
            if (c) {
                for (b = 0; b < h.Lower.length; b++) {
                    d = e.convert_(h, b, h.Lower[b]);
                    if (d && f.compareNums(c, g ? d : h.Lower[b]) >= 0 && (!b || f.compareNums(c, g ? e.convert_(h, b, h.Upper[b]) : h.Upper[b]) < 0)) {
                        a.v = e.convert_(h, b, c, g);
                        a.x = b;
                        break
                    }
                }
            }
            return a
        },
        isMin: function (g, f) {
            var d = this,
                e = g.$,
                c, b, a = 0;
            d.init(g);
            if (!e.isStrNum(f) || d.isDisabled()) {
                return a
            };
            if (!g.L) {
                g.L = {};
                for (c = 0; c < g.Lower.length; c++) {
                    if (d.isActiveXObject(g, g.Lower[c])) {
                        g.L = d.convert(g, g.Lower[c]);
                        break
                    }
                }
            }
            if (g.L.v) {
                b = d.convert(g, f, 1);
                if (b.x >= 0) {
                    a = (g.L.x == b.x ? d.isActiveXObject(g, b.v) : e.compareNums(f, g.L.v) <= 0) ? 1 : -1
                }
            };
            return a
        },
        search: function (g) {
            var k = this,
                h = k.$,
                i = g.$$,
                b = 0,
                c;
            k.init(g);
            c = (g.hasRun || k.isDisabled()) ? 1 : 0;
            g.hasRun = 1;
            if (c) {
                return g.version
            };
            var o, n, m, j = function (q, t) {
                    var r = [].concat(f),
                        s;
                    r[q] = t;
                    s = k.isActiveXObject(g, r.join(","));
                    if (s) {
                        b = 1;
                        f[q] = t
                    } else {
                        p[q] = t
                    }
                    return s
                }, d = g.DIGITMAX,
                e, a, l = 9999999,
                f = [0, 0, 0, 0],
                p = [0, 0, 0, 0];
            for (o = 0; o < p.length; o++) {
                f[o] = g.DIGITMIN[o] || 0;
                e = f.join(",");
                a = f.slice(0, o).concat([l, l, l, l]).slice(0, f.length).join(",");
                for (m = 0; m < d.length; m++) {
                    if (h.isArray(d[m])) {
                        d[m].push(0);
                        if (d[m][o] > p[o] && h.compareNums(a, g.Lower[m]) >= 0 && h.compareNums(e, g.Upper[m]) < 0) {
                            p[o] = d[m][o]
                        }
                    }
                }
                for (n = 0; n < 20; n++) {
                    if (p[o] - f[o] <= 16) {
                        for (m = p[o]; m >= f[o] + (o ? 1 : 0); m--) {
                            if (j(o, m)) {
                                break
                            }
                        }
                        break
                    }
                    j(o, Math.round((p[o] + f[o]) / 2))
                }
                if (!b) {
                    break
                }
                p[o] = f[o]
            }
            if (b) {
                g.version = k.convert(g, f.join(",")).v
            };
            return g.version
        }
    },
    addWinEvent: function (d, c) {
        var e = this,
            a = window,
            b;
        if (e.isFunc(c)) {
            if (a.addEventListener) {
                a.addEventListener(d, c, false)
            } else {
                if (a.attachEvent) {
                    a.attachEvent("on" + d, c)
                } else {
                    b = a["on" + d];
                    a["on" + d] = e.winHandler(c, b)
                }
            }
        }
    },
    winHandler: function (d, c) {
        return function () {
            d();
            if (typeof c == "function") {
                c()
            }
        }
    },
    WLfuncs0: [],
    WLfuncs: [],
    runWLfuncs: function (a) {
        a.winLoaded = true;
        a.callArray(a.WLfuncs0);
        a.callArray(a.WLfuncs);
        if (a.DOM) {
            a.DOM.onDoneEmptyDiv()
        }
    },
    winLoaded: false,
    $$onWindowLoaded: function (a) {
        return function (b) {
            if (a.winLoaded) {
                a.call(b)
            } else {
                a.fPush(b, a.WLfuncs)
            }
        }
    },
    $$beforeInstantiate: function (a) {
        return function (e, d) {
            var b = a.init(e),
                c = b.plugin;
            if (b.status == -3) {
                return
            };
            if (!a.isArray(c.BIfuncs)) {
                c.BIfuncs = []
            }
            a.fPush(d, c.BIfuncs)
        }
    },
    $$onDetectionDone: function (a) {
        return function (h, g, c, b) {
            var d = a.init(h),
                j, e;
            if (d.status == -3) {
                return -1
            }
            e = d.plugin;
            if (!a.isArray(e.funcs)) {
                e.funcs = []
            };
            if (e.getVersionDone != 1) {
                j = a.getVersion ? a.getVersion(h, c, b) : a.isMinVersion(h, "0", c, b)
            }
            if (e.installed != -0.5 && e.installed != 0.5) {
                a.call(g);
                return 1
            }
            if (e.NOTF) {
                a.fPush(g, e.funcs);
                return 0
            }
            return 1
        }
    },
    DOM: {
        $: 1,
        div: null,
        divID: "plugindetect",
        divWidth: 50,
        pluginSize: 1,
        altHTML: "&nbsp;&nbsp;&nbsp;&nbsp;",
        emptyNode: function (c) {
            var b = this,
                d = b.$,
                a, f;
            if (c && c.childNodes) {
                for (a = c.childNodes.length - 1; a >= 0; a--) {
                    try {
                        if (d.isIE) {
                            c.childNodes[a].style.display = "none"
                        }
                    } catch (f) {}
                }
                try {
                    c.innerHTML = ""
                } catch (f) {}
            }
        },
        LASTfuncs: [],
        onDoneEmptyDiv: function () {
            var f = this,
                g = f.$,
                b, d, c, a, h;
            if (!g.winLoaded || g.WLfuncs0.length || g.WLfuncs.length) {
                return
            }
            for (b in g.Plugins) {
                d = g.Plugins[b];
                if (d) {
                    if (d.OTF == 3 || (d.funcs && d.funcs.length)) {
                        return
                    }
                }
            }
            g.callArray(f.LASTfuncs);
            if (f.div && f.div.childNodes) {
                for (b = f.div.childNodes.length - 1; b >= 0; b--) {
                    c = f.div.childNodes[b];
                    f.emptyNode(c)
                }
                try {
                    f.div.innerHTML = ""
                } catch (h) {}
            }
            if (!f.div) {
                a = document.getElementById(f.divID);
                if (a) {
                    f.div = a
                }
            }
            if (f.div && f.div.parentNode) {
                try {
                    f.div.parentNode.removeChild(f.div)
                } catch (h) {}
                f.div = null
            }
        },
        width: function () {
            var e = this,
                c = e.DOM,
                d = c.$,
                a = -1,
                b = e.span;
            return b ? (d.isNum(b.scrollWidth) ? b.scrollWidth : (d.isNum(b.offsetWidth) ? b.offsetWidth : a)) : a
        },
        obj: function (b) {
            var g = this,
                d = g.DOM,
                c = g.span,
                f, a = c && c.firstChild ? c.firstChild : null;
            try {
                if (a && b) {
                    d.div.focus()
                }
            } catch (f) {}
            return a
        },
        getTagStatus: function (i, g, a, b) {
            if (!i || !g || !a) {
                return -2
            }
            var j = this,
                c = j.$,
                f, d = i.width(),
                k = a.width(),
                h = g.width();
            if (!a.span || !g.span || !i.obj()) {
                return -2
            }
            if (d < 0 || k < 0 || h < 0 || h <= j.pluginSize || k < h) {
                return 0
            }
            if (d >= h) {
                return -1
            }
            try {
                if (d == j.pluginSize && (!c.isIE || c.getPROP(i.obj(), "readyState") == 4)) {
                    if (!i.winLoaded && c.winLoaded) {
                        return 1
                    }
                    if (i.winLoaded && c.isNum(b)) {
                        if (!c.isNum(i.count)) {
                            i.count = b
                        }
                        if (b - i.count >= 10) {
                            return 1
                        }
                    }
                }
            } catch (f) {}
            return 0
        },
        setStyle: function (b, h) {
            var c = this,
                d = c.$,
                g = b.style,
                a, f;
            if (g && h) {
                for (a = 0; a < h.length; a = a + 2) {
                    try {
                        g[h[a]] = h[a + 1]
                    } catch (f) {}
                }
            }
        },
        insertDivInBody: function (a, h) {
            var j = this,
                d = j.$,
                g, b = "pd33993399",
                c = null,
                i = h ? window.top.document : window.document,
                f = i.getElementsByTagName("body")[0] || i.body;
            if (!f) {
                try {
                    i.write('<div id="' + b + '">.' + d.openTag + "/div>");
                    c = i.getElementById(b)
                } catch (g) {}
            }
            f = i.getElementsByTagName("body")[0] || i.body;
            if (f) {
                f.insertBefore(a, f.firstChild);
                if (c) {
                    f.removeChild(c)
                }
            }
        },
        insert: function (f, b, g, a, k) {
            var p = this,
                j = p.$,
                l, m = document,
                r, q, o = m.createElement("span"),
                n, i, c = ["outlineStyle", "none", "borderStyle", "none", "padding", "0px", "margin", "0px", "visibility", "visible"],
                h = "outline-style:none;border-style:none;padding:0px;margin:0px;visibility:visible;";
            if (!j.isDefined(a)) {
                a = ""
            }
            if (j.isString(f) && (/[^\s]/).test(f)) {
                f = f.toLowerCase().replace(/\s/g, "");
                r = j.openTag + f + ' width="' + p.pluginSize + '" height="' + p.pluginSize + '" ';
                r += 'style="' + h + 'display:inline;" ';
                for (n = 0; n < b.length; n = n + 2) {
                    if (/[^\s]/.test(b[n + 1])) {
                        r += b[n] + '="' + b[n + 1] + '" '
                    }
                }
                r += ">";
                for (n = 0; n < g.length; n = n + 2) {
                    if (/[^\s]/.test(g[n + 1])) {
                        r += j.openTag + 'param name="' + g[n] + '" value="' + g[n + 1] + '" />'
                    }
                }
                r += a + j.openTag + "/" + f + ">"
            } else {
                f = "";
                r = a
            } if (!p.div) {
                i = m.getElementById(p.divID);
                if (i) {
                    p.div = i
                } else {
                    p.div = m.createElement("div");
                    p.div.id = p.divID
                }
                p.setStyle(p.div, c.concat(["width", p.divWidth + "px", "height", (p.pluginSize + 3) + "px", "fontSize", (p.pluginSize + 3) + "px", "lineHeight", (p.pluginSize + 3) + "px", "verticalAlign", "baseline", "display", "block"]));
                if (!i) {
                    p.setStyle(p.div, ["position", "absolute", "right", "0px", "top", "0px"]);
                    p.insertDivInBody(p.div)
                }
            }
            q = {
                span: null,
                winLoaded: j.winLoaded,
                tagName: f,
                outerHTML: r,
                DOM: p,
                width: p.width,
                obj: p.obj
            };
            if (p.div && p.div.parentNode) {
                if (k && k.BIfuncs && k.BIfuncs.length) {
                    j.callArray(k.BIfuncs)
                }
                p.setStyle(o, c.concat(["fontSize", (p.pluginSize + 3) + "px", "lineHeight", (p.pluginSize + 3) + "px", "verticalAlign", "baseline", "display", "inline"]));
                p.div.appendChild(o);
                try {
                    o.innerHTML = r
                } catch (l) {};
                q.span = o;
                q.winLoaded = j.winLoaded
            }
            return q
        }
    },
    file: {
        $: 1,
        any: "fileStorageAny999",
        valid: "fileStorageValid999",
        save: function (d, f, c) {
            var b = this,
                e = b.$,
                a;
            if (d && e.isDefined(c)) {
                if (!d[b.any]) {
                    d[b.any] = []
                }
                if (!d[b.valid]) {
                    d[b.valid] = []
                }
                d[b.any].push(c);
                a = b.split(f, c);
                if (a) {
                    d[b.valid].push(a)
                }
            }
        },
        getValidLength: function (a) {
            return a && a[this.valid] ? a[this.valid].length : 0
        },
        getAnyLength: function (a) {
            return a && a[this.any] ? a[this.any].length : 0
        },
        getValid: function (c, a) {
            var b = this;
            return c && c[b.valid] ? b.get(c[b.valid], a) : null
        },
        getAny: function (c, a) {
            var b = this;
            return c && c[b.any] ? b.get(c[b.any], a) : null
        },
        get: function (d, a) {
            var c = d.length - 1,
                b = this.$.isNum(a) ? a : c;
            return (b < 0 || b > c) ? null : d[b]
        },
        split: function (g, c) {
            var b = this,
                e = b.$,
                f = null,
                a, d;
            g = g ? g.replace(".", "\\.") : "";
            d = new RegExp("^(.*[^\\/])(" + g + "\\s*)$");
            if (e.isString(c) && d.test(c)) {
                a = (RegExp.$1).split("/");
                f = {
                    name: a[a.length - 1],
                    ext: RegExp.$2,
                    full: c
                };
                a[a.length - 1] = "";
                f.path = a.join("/")
            }
            return f
        },
        z: 0
    },
    Plugins: {
        quicktime: {
            mimeType: ["video/quicktime", "application/x-quicktimeplayer", "image/x-macpaint", "image/x-quicktime"],
            progID: "QuickTimeCheckObject.QuickTimeCheck.1",
            progID0: "QuickTime.QuickTime",
            classID: "clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B",
            codebase: {
                $: 1,
                isMin: function (a) {
                    return this.$.codebase.isMin(this, a)
                },
                search: function () {
                    return this.$.codebase.search(this)
                },
                ParamTags: '<param name="src" value="" /><param name="controller" value="false" />',
                DIGITMAX: [
                    [12, 11, 11],
                    [7, 60],
                    [7, 11, 11], 0, [7, 11, 11]
                ],
                DIGITMIN: [5, 0, 0, 0],
                Upper: ["999", "7,60", "7,50", "7,6", "7,5"],
                Lower: ["7,60", "7,50", "7,6", "7,5", "0"],
                convert: [1,
                    function (b, a) {
                        return a ? [b[0], b[1] + b[2], b[3], "0"] : [b[0], b[1].charAt(0), b[1].charAt(1), b[2]]
                    },
                    1, 0, 1
                ]
            },
            setPluginStatus: function (d, a, f) {
                var e = this,
                    c = e.$,
                    b = e.installed;
                e.installed = a ? 1 : (f ? (f > 0 ? 0.7 : -0.1) : (d ? 0 : -1));
                if (a) {
                    e.version = c.formatNum(a, 3)
                }
                e.getVersionDone = e.installed == 0.7 || e.installed == -0.1 ? 0 : 1;
                c.codebase.emptyGarbage()
            },
            getVersion: function (c) {
                var h = this,
                    d = h.$,
                    a = null,
                    g = null,
                    b, f;
                if (!d.isIE) {
                    if (d.hasMimeType(h.mimeType)) {
                        g = d.OS != 3 ? d.findNavPlugin("QuickTime.*Plug-?in", 0) : null;
                        if (g && g.name) {
                            a = d.getNum(g.name)
                        }
                    }
                } else {
                    if (d.isStrNum(c)) {
                        b = c.split(d.splitNumRegx);
                        if (b.length > 3 && parseInt(b[3], 10) > 0) {
                            b[3] = "9999"
                        }
                        c = b.join(",")
                    }
                    b = h.codebase.isMin(c);
                    if (b) {
                        h.setPluginStatus(0, 0, b);
                        return
                    }
                    if (!a || d.debug) {
                        a = h.codebase.search()
                    }
                    if (!a || d.debug) {
                        g = d.getAXO(h.progID);
                        b = d.getPROP(g, "QuickTimeVersion");
                        if (b && b.toString) {
                            a = b.toString(16);
                            a = parseInt(a.charAt(0) || "0", 16) + "." + parseInt(a.charAt(1) || "0", 16) + "." + parseInt(a.charAt(2) || "0", 16)
                        }
                    }
                }
                h.setPluginStatus(g, a)
            }
        },
        java: {
            mimeType: ["application/x-java-applet", "application/x-java-vm", "application/x-java-bean"],
            classID: "clsid:8AD9C840-044E-11D1-B3E9-00805F499D93",
            navigator: {
                $: 1,
                a: (function () {
                    var b, a = !0;
                    try {
                        a = window.navigator.javaEnabled()
                    } catch (b) {}
                    return a
                })(),
                javaEnabled: function () {
                    return this.a
                },
                mimeObj: 0,
                pluginObj: 0
            },
            OTF: null,
            info: {
                $: 1,
                Plugin2Status: 0,
                setPlugin2Status: function (a) {
                    if (this.$.isNum(a)) {
                        this.Plugin2Status = a
                    }
                },
                getPlugin2Status: function () {
                    var c = this,
                        d = c.$,
                        b = c.$$,
                        i = b.navigator,
                        f, g, k, h, j, a;
                    if (c.Plugin2Status === 0) {
                        if (d.isIE && d.OS == 1 && (/Sun|Oracle/i).test(c.getVendor())) {
                            f = c.isMinJre4Plugin2();
                            if (f > 0) {
                                c.setPlugin2Status(1)
                            } else {
                                if (f < 0) {
                                    c.setPlugin2Status(-1)
                                }
                            }
                        } else {
                            if (!d.isIE && i.pluginObj) {
                                k = /Next.*Generation.*Java.*Plug-?in|Java.*Plug-?in\s*2\s/i;
                                h = /Classic.*Java.*Plug-in/i;
                                j = i.pluginObj.description || "";
                                a = i.pluginObj.name || "";
                                if (k.test(j) || k.test(a)) {
                                    c.setPlugin2Status(1)
                                } else {
                                    if (h.test(j) || h.test(a)) {
                                        c.setPlugin2Status(-1)
                                    }
                                }
                            }
                        }
                    }
                    return c.Plugin2Status
                },
                isMinJre4Plugin2: function (a) {
                    var f = this,
                        e = f.$,
                        c = f.$$,
                        d = "",
                        g = c.applet.codebase,
                        b = c.applet.getResult()[0];
                    if (e.OS == 1) {
                        d = "1,6,0,10"
                    } else {
                        if (e.OS == 2) {
                            d = "1,6,0,12"
                        } else {
                            if (e.OS == 3) {
                                d = "1,6,0,10"
                            } else {
                                d = "1,6,0,10"
                            }
                        }
                    } if (!a) {
                        a = (b && !c.applet.isRange(b) ? b : 0) || c.version || (g.min && d ? (g.isMin(d) > 0 ? d : "0,0,0,0") : 0)
                    }
                    a = e.formatNum(e.getNum(a));
                    return a ? (e.compareNums(a, d) >= 0 ? 1 : -1) : 0
                },
                BrowserForbidsPlugin2: function () {
                    var a = this.$;
                    if (a.OS >= 20) {
                        return 0
                    }
                    if ((a.isIE && a.verIE < 6) || (a.isGecko && a.compareNums(a.verGecko, "1,9,0,0") < 0) || (a.isOpera && a.verOpera && a.verOpera < 10.5)) {
                        return 1
                    }
                    return 0
                },
                BrowserRequiresPlugin2: function () {
                    var a = this.$;
                    if (a.OS >= 20) {
                        return 0
                    }
                    if ((a.isGecko && a.compareNums(a.verGecko, "1,9,2,0") >= 0) || a.isChrome || (a.OS == 1 && a.verOpera && a.verOpera >= 10.6)) {
                        return 1
                    }
                    return 0
                },
                VENDORS: ["Sun Microsystems Inc.", "Apple Computer, Inc.", "Oracle Corporation"],
                OracleMin: "1,7,0,0",
                OracleOrSun: function (a) {
                    var c = this,
                        b = c.$;
                    return c.VENDORS[b.compareNums(b.formatNum(a), c.OracleMin) < 0 ? 0 : 2]
                },
                OracleOrApple: function (a) {
                    var c = this,
                        b = c.$;
                    return c.VENDORS[b.compareNums(b.formatNum(a), c.OracleMin) < 0 ? 1 : 2]
                },
                getVendor: function () {
                    var d = this,
                        c = d.$,
                        b = d.$$,
                        f = b.vendor || b.applet.getResult()[1] || "",
                        e = b.applet.codebase,
                        a;
                    if (!f) {
                        a = b.DTK.version || e.version || (e.min ? (e.isMin(d.OracleMin) > 0 ? d.OracleMin : "0,0,0,0") : 0);
                        if (a) {
                            f = d.OracleOrSun(a)
                        } else {
                            if (b.version) {
                                if (c.OS == 2) {
                                    f = d.OracleOrApple(b.version)
                                } else {
                                    if ((!c.isIE && c.OS == 1) || c.OS == 3) {
                                        f = d.OracleOrSun(b.version)
                                    }
                                }
                            }
                        }
                    }
                    return f
                },
                isPlugin2InstalledEnabled: function () {
                    var b = this,
                        d = b.$,
                        a = b.$$,
                        i = -1,
                        f = a.installed,
                        g = b.getPlugin2Status(),
                        h = b.BrowserRequiresPlugin2(),
                        e = b.BrowserForbidsPlugin2(),
                        c = b.isMinJre4Plugin2();
                    if (f !== null && f >= -0.1) {
                        if (g >= 3) {
                            i = 1
                        } else {
                            if (g <= -3) {} else {
                                if (g == 2) {
                                    i = 1
                                } else {
                                    if (g == -2) {} else {
                                        if (h && g >= 0 && c > 0) {
                                            i = 1
                                        } else {
                                            if (e && g <= 0 && c < 0) {} else {
                                                if (h) {
                                                    i = 1
                                                } else {
                                                    if (e) {} else {
                                                        if (g > 0) {
                                                            i = 1
                                                        } else {
                                                            if (g < 0) {} else {
                                                                if (c < 0) {} else {
                                                                    i = 0
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return i
                }
            },
            getInfo: function () {
                var b = this,
                    d = b.$,
                    a = b.applet,
                    h, j = b.installed,
                    g = b.DTK.query(),
                    f = a.results,
                    k = {
                        All_versions: [],
                        DeployTK_versions: [].concat(d.isArray(g.VERSIONS) ? g.VERSIONS : []),
                        DeploymentToolkitPlugin: (g.status == 0 || !g.HTML ? null : g.HTML.obj()),
                        vendor: b.info.getVendor(),
                        isPlugin2: b.info.isPlugin2InstalledEnabled(),
                        OTF: (b.OTF < 3 ? 0 : (b.OTF == 3 ? 1 : 2)),
                        PLUGIN: null,
                        name: "",
                        description: ""
                    };
                k.All_versions = [].concat((k.DeployTK_versions.length ? k.DeployTK_versions : (d.isString(b.version) ? [b.version] : [])));
                var c = k.All_versions;
                for (h = 0; h < c.length; h++) {
                    c[h] = d.formatNum(d.getNum(c[h]))
                }
                for (h = 0; h < f.length; h++) {
                    if (f[h][0] && a.HTML[h] && a.HTML[h].obj()) {
                        k.PLUGIN = a.HTML[h].obj();
                        break
                    }
                }
                var e = [null, null, null, null];
                for (h = 0; h < f.length; h++) {
                    if (f[h][0]) {
                        e[h] = 1
                    } else {
                        if (f[h][0] !== null) {
                            if (b.NOTF && !(a.HTML[h] && a.HTML[h].DELETE)) {
                                b.NOTF.isAppletActive(h)
                            }
                            if (a.active[h] == 1) {
                                e[h] = 0
                            } else {
                                if (a.allowed[h] >= 1 && b.OTF != 3 && (a.isDisabled.single(h) || j == -0.2 || j == -1 || a.active[h] < 0 || (h == 3 && (!d.isIE || (/Microsoft/i).test(k.vendor))))) {
                                    e[h] = -1
                                }
                            }
                        } else {
                            if (h == 3 && f[0][0]) {
                                e[h] = 0
                            }
                        }
                    }
                }
                k.objectTag = e[1];
                k.appletTag = e[2];
                k.objectTagActiveX = e[3];
                var i = 0;
                if (!d.isIE) {
                    if (b.navMime.query().pluginObj) {
                        i = b.navMime.pluginObj
                    } else {
                        if (b.navigator.pluginObj) {
                            i = b.navigator.pluginObj
                        }
                    } if (i) {
                        k.name = i.name || "";
                        k.description = i.description || ""
                    }
                }
                return k
            },
            getVerifyTagsDefault: function () {
                return [1, this.applet.isDisabled.VerifyTagsDefault_1() ? 0 : 1, 1]
            },
            getVersion: function (j, g, i) {
                var b = this,
                    d = b.$,
                    e, a = b.applet,
                    h = b.verify,
                    k = b.navigator,
                    f = null,
                    l = null,
                    c = null;
                if (b.getVersionDone === null) {
                    b.OTF = 0;
                    k.mimeObj = d.hasMimeType(b.mimeType);
                    if (k.mimeObj) {
                        k.pluginObj = k.mimeObj.enabledPlugin
                    }
                    if (h) {
                        h.begin()
                    }
                }
                a.setVerifyTagsArray(i);
                d.file.save(b, ".jar", g);
                if (b.getVersionDone === 0) {
                    if (a.should_Insert_Query_Any()) {
                        e = a.insert_Query_Any(j);
                        b.setPluginStatus(e[0], e[1], f, j)
                    }
                    return
                }
                if ((!f || d.debug) && b.DTK.query().version) {
                    f = b.DTK.version
                }
                if ((!f || d.debug) && b.navMime.query().version) {
                    f = b.navMime.version
                }
                if ((!f || d.debug) && b.navPlugin.query().version) {
                    f = b.navPlugin.version
                }
                if (b.nonAppletDetectionOk(f)) {
                    c = f
                }
                if (!c || d.debug || a.VerifyTagsHas(2.2) || a.VerifyTagsHas(2.5)) {
                    e = b.lang.System.getProperty();
                    if (e[0]) {
                        f = e[0];
                        c = e[0];
                        l = e[1]
                    }
                }
                b.setPluginStatus(c, l, f, j);
                if (a.should_Insert_Query_Any()) {
                    e = a.insert_Query_Any(j);
                    if (e[0]) {
                        c = e[0];
                        l = e[1]
                    }
                }
                b.setPluginStatus(c, l, f, j)
            },
            nonAppletDetectionOk: function (b) {
                var d = this,
                    e = d.$,
                    a = d.navigator,
                    c = 1;
                if (!b || (!a.javaEnabled() && !d.lang.System.getPropertyHas(b)) || (!e.isIE && !a.mimeObj && !d.lang.System.getPropertyHas(b)) || (e.isIE && !e.ActiveXEnabled)) {
                    c = 0
                } else {
                    if (e.OS >= 20) {} else {
                        if (d.info && d.info.getPlugin2Status() < 0 && d.info.BrowserRequiresPlugin2()) {
                            c = 0
                        }
                    }
                }
                return c
            },
            setPluginStatus: function (d, i, g, h) {
                var b = this,
                    e = b.$,
                    f, c = 0,
                    a = b.applet;
                g = g || b.version0;
                if (b.OTF > 0) {
                    d = d || b.lang.System.getProperty()[0]
                }
                f = a.isRange(d);
                if (f) {
                    if (a.setRange(f, h) == d) {
                        c = f
                    }
                    d = 0
                }
                if (b.OTF < 3) {
                    b.installed = c ? (c > 0 ? 0.7 : -0.1) : (d ? 1 : (g ? -0.2 : -1))
                }
                if (b.OTF == 2 && b.NOTF && !b.applet.getResult()[0] && !b.lang.System.getProperty()[0]) {
                    b.installed = g ? -0.2 : -1
                }
                if (b.OTF == 3 && b.installed != -0.5 && b.installed != 0.5) {
                    b.installed = (b.NOTF.isJavaActive(1) == 1 || b.lang.System.getProperty()[0]) ? 0.5 : -0.5
                }
                if (b.OTF == 4 && (b.installed == -0.5 || b.installed == 0.5)) {
                    if (d) {
                        b.installed = 1
                    } else {
                        if (c) {
                            b.installed = c > 0 ? 0.7 : -0.1
                        } else {
                            if (b.NOTF.isJavaActive(1) == 1) {
                                if (g) {
                                    b.installed = 1;
                                    d = g
                                } else {
                                    b.installed = 0
                                }
                            } else {
                                if (g) {
                                    b.installed = -0.2
                                } else {
                                    b.installed = -1
                                }
                            }
                        }
                    }
                }
                if (g) {
                    b.version0 = e.formatNum(e.getNum(g))
                }
                if (d && !c) {
                    b.version = e.formatNum(e.getNum(d))
                }
                if (i && e.isString(i)) {
                    b.vendor = i
                }
                if (!b.vendor) {
                    b.vendor = ""
                }
                if (b.verify && b.verify.isEnabled()) {
                    b.getVersionDone = 0
                } else {
                    if (b.getVersionDone != 1) {
                        if (b.OTF < 2) {
                            b.getVersionDone = 0
                        } else {
                            b.getVersionDone = b.applet.can_Insert_Query_Any() ? 0 : 1
                        }
                    }
                };
                e.codebase.emptyGarbage()
            },
            DTK: {
                $: 1,
                hasRun: 0,
                status: null,
                VERSIONS: [],
                version: "",
                HTML: null,
                Plugin2Status: null,
                classID: ["clsid:CAFEEFAC-DEC7-0000-0001-ABCDEFFEDCBA", "clsid:CAFEEFAC-DEC7-0000-0000-ABCDEFFEDCBA"],
                mimeType: ["application/java-deployment-toolkit", "application/npruntime-scriptable-plugin;DeploymentToolkit"],
                isDisabled: function () {
                    var a = this,
                        b = a.$;
                    if ((b.isIE && (b.verIE < 6 || !b.ActiveXEnabled)) || (b.isGecko && b.compareNums(b.verGecko, b.formatNum("1.6")) <= 0) || (b.isSafari && b.OS == 1 && (!b.verSafari || b.compareNums(b.verSafari, "5,1,0,0") < 0)) || b.isChrome) {
                        return 1
                    }
                    return 0
                },
                query: function () {
                    var l = this,
                        h = l.$,
                        f = l.$$,
                        k, m, i, a = h.DOM.altHTML,
                        g = {}, b, d = null,
                        j = null,
                        c = (l.hasRun || l.isDisabled());
                    l.hasRun = 1;
                    if (c) {
                        return l
                    }
                    l.status = 0;
                    if (h.isIE) {
                        for (m = 0; m < l.classID.length; m++) {
                            l.HTML = h.DOM.insert("object", ["classid", l.classID[m]], [], a);
                            d = l.HTML.obj();
                            if (h.getPROP(d, "jvms")) {
                                break
                            }
                        }
                    } else {
                        i = h.hasMimeType(l.mimeType);
                        if (i && i.type) {
                            l.HTML = h.DOM.insert("object", ["type", i.type], [], a);
                            d = l.HTML.obj()
                        }
                    } if (d) {
                        try {
                            if (Math.abs(f.info.getPlugin2Status()) < 2) {
                                l.Plugin2Status = d.isPlugin2()
                            }
                        } catch (k) {}
                        if (l.Plugin2Status !== null) {
                            if (l.Plugin2Status) {
                                f.info.setPlugin2Status(2)
                            } else {
                                if (h.isIE || f.info.getPlugin2Status() <= 0) {
                                    f.info.setPlugin2Status(-2)
                                }
                            }
                        }
                        try {
                            b = h.getPROP(d, "jvms");
                            if (b) {
                                j = b.getLength();
                                if (h.isNum(j)) {
                                    l.status = j > 0 ? 1 : -1;
                                    for (m = 0; m < j; m++) {
                                        i = h.getNum(b.get(j - 1 - m).version);
                                        if (i) {
                                            l.VERSIONS.push(i);
                                            g["a" + h.formatNum(i)] = 1
                                        }
                                    }
                                }
                            }
                        } catch (k) {}
                    }
                    i = 0;
                    for (m in g) {
                        i++
                    }
                    if (i && i !== l.VERSIONS.length) {
                        l.VERSIONS = []
                    }
                    if (l.VERSIONS.length) {
                        l.version = h.formatNum(l.VERSIONS[0])
                    };
                    return l
                }
            },
            navMime: {
                $: 1,
                hasRun: 0,
                mimetype: "",
                version: "",
                length: 0,
                mimeObj: 0,
                pluginObj: 0,
                isDisabled: function () {
                    var b = this,
                        d = b.$,
                        c = b.$$,
                        a = c.navigator;
                    if (d.isIE || !a.mimeObj || !a.pluginObj) {
                        return 1
                    }
                    return 0
                },
                query: function () {
                    var i = this,
                        f = i.$,
                        a = i.$$,
                        b = (i.hasRun || i.isDisabled());
                    i.hasRun = 1;
                    if (b) {
                        return i
                    };
                    var n = /^\s*application\/x-java-applet;jpi-version\s*=\s*(\d.*)$/i,
                        g, l, j, d = "",
                        h = "a",
                        o, m, k = {}, c = f.formatNum("0");
                    for (l = 0; l < navigator.mimeTypes.length; l++) {
                        o = navigator.mimeTypes[l];
                        m = o ? o.enabledPlugin : 0;
                        g = o && n.test(o.type || d) ? f.formatNum(f.getNum(RegExp.$1)) : 0;
                        if (g && m && (m.description || m.name)) {
                            if (!k[h + g]) {
                                i.length++
                            }
                            k[h + g] = o.type;
                            if (f.compareNums(g, c) > 0) {
                                c = g
                            }
                        }
                    }
                    g = k[h + c];
                    if (g) {
                        o = f.hasMimeType(g);
                        i.mimeObj = o;
                        i.pluginObj = o ? o.enabledPlugin : 0;
                        i.mimetype = g;
                        i.version = c
                    };
                    return i
                }
            },
            navPlugin: {
                $: 1,
                hasRun: 0,
                version: "",
                isDisabled: function () {
                    var d = this,
                        c = d.$,
                        b = d.$$,
                        a = b.navigator;
                    if (c.isIE || !a.mimeObj || !a.pluginObj) {
                        return 1
                    }
                    return 0
                },
                query: function () {
                    var m = this,
                        e = m.$,
                        c = m.$$,
                        h = c.navigator,
                        j, l, k, g, d, a, i, f = 0,
                        b = (m.hasRun || m.isDisabled());
                    m.hasRun = 1;
                    if (b) {
                        return m
                    };
                    a = h.pluginObj.name || "";
                    i = h.pluginObj.description || "";
                    if (!f || e.debug) {
                        g = /Java.*TM.*Platform[^\d]*(\d+)(?:[\.,_](\d*))?(?:\s*[Update]+\s*(\d*))?/i;
                        if ((g.test(a) || g.test(i)) && parseInt(RegExp.$1, 10) >= 5) {
                            f = "1," + RegExp.$1 + "," + (RegExp.$2 ? RegExp.$2 : "0") + "," + (RegExp.$3 ? RegExp.$3 : "0")
                        }
                    }
                    if (!f || e.debug) {
                        g = /Java[^\d]*Plug-in/i;
                        l = g.test(i) ? e.formatNum(e.getNum(i)) : 0;
                        k = g.test(a) ? e.formatNum(e.getNum(a)) : 0;
                        if (l && (e.compareNums(l, e.formatNum("1,3")) < 0 || e.compareNums(l, e.formatNum("2")) >= 0)) {
                            l = 0
                        }
                        if (k && (e.compareNums(k, e.formatNum("1,3")) < 0 || e.compareNums(k, e.formatNum("2")) >= 0)) {
                            k = 0
                        }
                        d = l && k ? (e.compareNums(l, k) > 0 ? l : k) : (l || k);
                        if (d) {
                            f = d
                        }
                    }
                    if (!f && e.isSafari && e.OS == 2) {
                        j = e.findNavPlugin("Java.*\\d.*Plug-in.*Cocoa", 0);
                        if (j) {
                            l = e.getNum(j.description);
                            if (l) {
                                f = l
                            }
                        }
                    };
                    if (f) {
                        m.version = e.formatNum(f)
                    };
                    return m
                }
            },
            lang: {
                $: 1,
                System: {
                    $: 1,
                    hasRun: 0,
                    result: [null, null],
                    isDisabled: function () {
                        var b = this,
                            c = b.$,
                            a = b.$$;
                        if (!window.java || c.isIE) {
                            return 1
                        }
                        if (c.OS == 2 && c.verOpera && c.verOpera < 9.2 && c.verOpera >= 9) {
                            return 1
                        }
                        return 0
                    },
                    getPropertyHas: function (a) {
                        var b = this,
                            d = b.$,
                            c = b.getProperty()[0];
                        return (a && c && d.compareNums(d.formatNum(a), d.formatNum(c)) === 0) ? 1 : 0
                    },
                    getProperty: function () {
                        var f = this,
                            g = f.$,
                            d = f.$$,
                            h, a = "java_qqq990",
                            c, i = "window.java.lang.System.getProperty",
                            b = f.hasRun || f.isDisabled();
                        f.hasRun = 1;
                        if (!b) {
                            g[a] = 0;
                            try {
                                c = document.createElement("script");
                                c.type = "text/javascript";
                                c.appendChild(document.createTextNode("(function(){var e;try{" + g.name + "." + a + "=[" + i + "('java.version')+''," + i + "('java.vendor')+'']}catch(e){}})();"));
                                g.head.insertBefore(c, g.head.firstChild);
                                g.head.removeChild(c)
                            } catch (h) {}
                            if (g.isArray(g[a])) {
                                f.result = [].concat(g[a])
                            }
                        }
                        return f.result
                    }
                }
            },
            applet: {
                $: 1,
                codebase: {
                    $: 1,
                    isMin: function (a) {
                        return this.$.codebase.isMin(this, a)
                    },
                    search: function () {
                        return this.$.codebase.search(this)
                    },
                    ParamTags: '<param name="code" value="A19999.class" /><param name="codebase_lookup" value="false" />',
                    DIGITMAX: [
                        [16, 64],
                        [6, 0, 512], 0, [1, 5, 2, 256], 0, [1, 4, 1, 1],
                        [1, 4, 0, 64],
                        [1, 3, 2, 32]
                    ],
                    DIGITMIN: [1, 0, 0, 0],
                    Upper: ["999", "10", "5,0,20", "1,5,0,20", "1,4,1,20", "1,4,1,2", "1,4,1", "1,4"],
                    Lower: ["10", "5,0,20", "1,5,0,20", "1,4,1,20", "1,4,1,2", "1,4,1", "1,4", "0"],
                    convert: [
                        function (b, a) {
                            return a ? [parseInt(b[0], 10) > 1 ? "99" : parseInt(b[1], 10) + 3 + "", b[3], "0", "0"] : ["1", parseInt(b[0], 10) - 3 + "", "0", b[1]]
                        },
                        function (b, a) {
                            return a ? [b[1], b[2], b[3] + "0", "0"] : ["1", b[0], b[1], b[2].substring(0, b[2].length - 1 || 1)]
                        },
                        0,
                        function (b, a) {
                            return a ? [b[0], b[1], b[2], b[3] + "0"] : [b[0], b[1], b[2], b[3].substring(0, b[3].length - 1 || 1)]
                        },
                        0, 1,
                        function (b, a) {
                            return a ? [b[0], b[1], b[2], b[3] + "0"] : [b[0], b[1], b[2], b[3].substring(0, b[3].length - 1 || 1)]
                        },
                        1
                    ]
                },
                results: [
                    [null, null],
                    [null, null],
                    [null, null],
                    [null, null]
                ],
                getResult: function () {
                    var b = this,
                        d = b.results,
                        a, c = [];
                    for (a = d.length - 1; a >= 0; a--) {
                        c = d[a];
                        if (c[0]) {
                            break
                        }
                    }
                    c = [].concat(c);
                    return c
                },
                HTML: [0, 0, 0, 0],
                active: [0, 0, 0, 0],
                DummyObjTagHTML: 0,
                DummySpanTagHTML: 0,
                allowed: [1, 1, 1, 1],
                VerifyTagsHas: function (c) {
                    var d = this,
                        b;
                    for (b = 0; b < d.allowed.length; b++) {
                        if (d.allowed[b] === c) {
                            return 1
                        }
                    }
                    return 0
                },
                saveAsVerifyTagsArray: function (c) {
                    var b = this,
                        d = b.$,
                        a;
                    if (d.isArray(c)) {
                        for (a = 1; a < b.allowed.length; a++) {
                            if (c.length > a - 1 && d.isNum(c[a - 1])) {
                                if (c[a - 1] < 0) {
                                    c[a - 1] = 0
                                }
                                if (c[a - 1] > 3) {
                                    c[a - 1] = 3
                                }
                                b.allowed[a] = c[a - 1]
                            }
                        }
                        b.allowed[0] = b.allowed[3]
                    }
                },
                setVerifyTagsArray: function (d) {
                    var b = this,
                        c = b.$,
                        a = b.$$;
                    if (a.getVersionDone === null) {
                        b.saveAsVerifyTagsArray(a.getVerifyTagsDefault())
                    }
                    if (c.debug || (a.verify && a.verify.isEnabled())) {
                        b.saveAsVerifyTagsArray([3, 3, 3])
                    } else {
                        if (d) {
                            b.saveAsVerifyTagsArray(d)
                        }
                    }
                },
                isDisabled: {
                    $: 1,
                    single: function (d) {
                        var a = this,
                            c = a.$,
                            b = a.$$;
                        if (d == 0) {
                            return c.codebase.isDisabled()
                        }
                        if ((d == 3 && !c.isIE) || a.all()) {
                            return 1
                        }
                        if (d == 1 || d == 3) {
                            return a.ObjectTag()
                        }
                        if (d == 2) {
                            return a.AppletTag()
                        }
                    },
                    aA_: null,
                    all: function () {
                        var c = this,
                            e = c.$,
                            d = c.$$,
                            b = d.navigator,
                            a = 0;
                        if (c.aA_ === null) {
                            if (e.OS >= 20) {
                                a = 0
                            } else {
                                if (e.verOpera && e.verOpera < 11 && !b.javaEnabled() && !d.lang.System.getProperty()[0]) {
                                    a = 1
                                } else {
                                    if ((e.verGecko && e.compareNums(e.verGecko, e.formatNum("2")) < 0) && !b.mimeObj && !d.lang.System.getProperty()[0]) {
                                        a = 1
                                    } else {
                                        if (c.AppletTag() && c.ObjectTag()) {
                                            a = 1
                                        }
                                    }
                                }
                            };
                            c.aA_ = a
                        }
                        return c.aA_
                    },
                    AppletTag: function () {
                        var b = this,
                            d = b.$,
                            c = b.$$,
                            a = c.navigator;
                        return d.isIE ? !a.javaEnabled() : 0
                    },
                    ObjectTag: function () {
                        var a = this,
                            c = a.$,
                            b = a.$$;
                        return c.isIE ? !c.ActiveXEnabled : 0
                    },
                    VerifyTagsDefault_1: function () {
                        var a = this.$;
                        if (a.OS >= 20) {
                            return 1
                        }
                        if ((a.isIE && (a.verIE < 9 || !a.ActiveXEnabled)) || (a.verGecko && a.compareNums(a.verGecko, a.formatNum("2")) < 0) || (a.isSafari && (!a.verSafari || a.compareNums(a.verSafari, a.formatNum("4")) < 0)) || (a.verOpera && a.verOpera < 10)) {
                            return 0
                        }
                        return 1
                    },
                    z: 0
                },
                can_Insert_Query: function (d) {
                    var b = this,
                        c = b.results[0][0],
                        a = b.getResult()[0];
                    if (b.HTML[d] || (d == 0 && c !== null && !b.isRange(c)) || (d == 0 && a && !b.isRange(a))) {
                        return 0
                    }
                    return !b.isDisabled.single(d)
                },
                can_Insert_Query_Any: function () {
                    var b = this,
                        a;
                    for (a = 0; a < b.results.length; a++) {
                        if (b.can_Insert_Query(a)) {
                            return 1
                        }
                    }
                    return 0
                },
                should_Insert_Query: function (e) {
                    var c = this,
                        f = c.allowed,
                        d = c.$,
                        b = c.$$,
                        a = c.getResult()[0];
                    a = a && (e > 0 || !c.isRange(a));
                    if (!c.can_Insert_Query(e) || f[e] === 0) {
                        return 0
                    }
                    if (f[e] == 3 || (f[e] == 2.8 && !a) || (f[e] == 2.5 && !b.lang.System.getProperty()[0]) || (f[e] == 2.2 && !b.lang.System.getProperty()[0] && !a)) {
                        return 1
                    }
                    if (!b.nonAppletDetectionOk(b.version0)) {
                        if (f[e] == 2 || (f[e] == 1 && !a)) {
                            return 1
                        }
                    }
                    return 0
                },
                should_Insert_Query_Any: function () {
                    var b = this,
                        a;
                    for (a = 0; a < b.allowed.length; a++) {
                        if (b.should_Insert_Query(a)) {
                            return 1
                        }
                    }
                    return 0
                },
                query: function (f) {
                    var j, a = this,
                        i = a.$,
                        d = a.$$,
                        k = null,
                        l = null,
                        b = a.results,
                        c, h, g = a.HTML[f];
                    if (!g || !g.obj() || b[f][0] || (i.debug && d.OTF < 3)) {
                        return
                    }
                    c = g.obj(true);
                    if (i.isIE) {
                        h = i.getPROP(c, "readyState")
                    };
                    if (!i.isIE || h == 4) {
                        try {
                            k = i.getNum(c.getVersion() + "");
                            l = c.getVendor() + "";
                            c.statusbar(i.winLoaded ? " " : " ")
                        } catch (j) {};
                        if (k && i.isStrNum(k)) {
                            b[f] = [k, l];
                            if (Math.abs(d.info.getPlugin2Status()) < 3) {
                                try {
                                    if (c.Packages.A.isPlugin2()) {
                                        d.info.setPlugin2Status(3)
                                    }
                                } catch (j) {}
                                if (Math.abs(d.info.getPlugin2Status()) < 3) {
                                    d.info.setPlugin2Status(-3)
                                }
                            }
                        }
                    }
                },
                isRange: function (a) {
                    return (/^[<>]/).test(a || "") ? (a.charAt(0) == ">" ? 1 : -1) : 0
                },
                setRange: function (b, a) {
                    return (b ? (b > 0 ? ">" : "<") : "") + (this.$.isString(a) ? a : "")
                },
                insert_Query_Any: function (n) {
                    var e = this,
                        c = e.$,
                        k = e.$$,
                        l = e.results,
                        m = e.HTML,
                        g = c.DOM.altHTML,
                        r = "A.class",
                        o, b = c.file.getValid(k);
                    if (e.should_Insert_Query(0)) {
                        if (k.OTF < 2) {
                            k.OTF = 2
                        };
                        l[0] = [0, 0];
                        o = n ? e.codebase.isMin(n) : e.codebase.search();
                        if (o) {
                            l[0][0] = n ? e.setRange(o, n) : o
                        }
                    }
                    if (!b) {
                        return e.getResult()
                    }
                    var f = b.name + b.ext,
                        q = b.path;
                    var i = ["archive", f, "code", r],
                        j = ["mayscript", "true"],
                        p = ["scriptable", "true", "codebase_lookup", "false"].concat(j),
                        a = k.navigator,
                        d = !c.isIE && a.mimeObj && a.mimeObj.type ? a.mimeObj.type : k.mimeType[0];
                    if (e.should_Insert_Query(1)) {
                        if (k.OTF < 2) {
                            k.OTF = 2
                        };
                        m[1] = c.isIE ? c.DOM.insert("object", ["type", d], ["codebase", q].concat(i).concat(p), g, k) : c.DOM.insert("object", ["type", d], ["codebase", q].concat(i).concat(p), g, k);
                        l[1] = [0, 0];
                        e.query(1)
                    }
                    if (e.should_Insert_Query(2)) {
                        if (k.OTF < 2) {
                            k.OTF = 2
                        };
                        m[2] = c.isIE ? c.DOM.insert("applet", ["alt", g].concat(j).concat(i), ["codebase", q].concat(p), g, k) : c.DOM.insert("applet", ["codebase", q, "alt", g].concat(j).concat(i), [].concat(p), g, k);
                        l[2] = [0, 0];
                        e.query(2)
                    }
                    if (e.should_Insert_Query(3)) {
                        if (k.OTF < 2) {
                            k.OTF = 2
                        };
                        m[3] = c.isIE ? c.DOM.insert("object", ["classid", k.classID], ["codebase", q].concat(i).concat(p), g, k) : c.DOM.insert();
                        l[3] = [0, 0];
                        e.query(3)
                    }
                    if (!e.DummyObjTagHTML && !e.isDisabled.ObjectTag()) {
                        e.DummyObjTagHTML = c.DOM.insert("object", [], [], g)
                    }
                    if (!e.DummySpanTagHTML) {
                        e.DummySpanTagHTML = c.DOM.insert("", [], [], g)
                    }
                    var h = k.NOTF;
                    if (k.OTF < 3 && h.shouldContinueQuery()) {
                        k.OTF = 3;
                        h.onIntervalQuery = c.handler(h.$$onIntervalQuery, h);
                        if (!c.winLoaded) {
                            c.WLfuncs0.push([h.winOnLoadQuery, h])
                        }
                        setTimeout(h.onIntervalQuery, h.intervalLength)
                    }
                    return e.getResult()
                }
            },
            NOTF: {
                $: 1,
                count: 0,
                countMax: 25,
                intervalLength: 250,
                shouldContinueQuery: function () {
                    var f = this,
                        e = f.$,
                        c = f.$$,
                        b = c.applet,
                        a, d = 0;
                    if (e.winLoaded && f.count > f.countMax) {
                        return 0
                    }
                    for (a = 0; a < b.results.length; a++) {
                        if (b.HTML[a]) {
                            if (!e.winLoaded && f.count > f.countMax && e.codebase.checkGarbage(b.HTML[a].span)) {
                                d = 1;
                                b.HTML[a].DELETE = 1
                            }
                            if (!d && !b.results[a][0] && (b.allowed[a] >= 2 || (b.allowed[a] == 1 && !b.getResult()[0])) && f.isAppletActive(a) >= 0) {
                                return 1
                            }
                        }
                    };
                    return 0
                },
                isJavaActive: function (d) {
                    var f = this,
                        c = f.$$,
                        a, b, e = -9;
                    for (a = 0; a < c.applet.HTML.length; a++) {
                        b = f.isAppletActive(a, d);
                        if (b > e) {
                            e = b
                        }
                    }
                    return e
                },
                isAppletActive: function (c, a) {
                    var d = this,
                        b = d.$$.applet.active;
                    if (!a) {
                        b[c] = d.isAppletActive_(c)
                    }
                    return b[c]
                },
                isAppletActive_: function (d) {
                    var g = this,
                        f = g.$,
                        b = g.$$,
                        l = b.navigator,
                        a = b.applet,
                        h = a.HTML[d],
                        i, k, c = 0,
                        j;
                    j = f.DOM.getTagStatus(h, a.DummySpanTagHTML, a.DummyObjTagHTML, g.count);
                    if (j == -2) {
                        return -2
                    }
                    k = f.isEnabled.objectProperty(h.obj());
                    if (k) {
                        return k > 0 ? 1 : -1
                    }
                    for (k = 0; k < a.active.length; k++) {
                        if (a.active[k] > 0) {
                            c = 1
                        }
                    }
                    if (j == 1 && (f.isIE || ((b.version0 && l.javaEnabled() && l.mimeObj && (h.tagName == "object" || c)) || b.lang.System.getProperty()[0]))) {
                        return 1
                    }
                    if (j < 0) {
                        return -1
                    }
                    return 0
                },
                winOnLoadQuery: function (c, d) {
                    var b = d.$$,
                        a;
                    if (b.OTF == 3) {
                        a = d.queryAllApplets();
                        d.queryCompleted(a)
                    }
                },
                $$onIntervalQuery: function (d) {
                    var c = d.$,
                        b = d.$$,
                        a;
                    if (b.OTF == 3) {
                        a = d.queryAllApplets();
                        if (!d.shouldContinueQuery()) {
                            d.queryCompleted(a)
                        }
                    }
                    d.count++;
                    if (b.OTF == 3) {
                        setTimeout(d.onIntervalQuery, d.intervalLength)
                    }
                },
                queryAllApplets: function () {
                    var f = this,
                        e = f.$,
                        d = f.$$,
                        c = d.applet,
                        b, a;
                    for (b = 0; b < c.results.length; b++) {
                        c.query(b)
                    }
                    a = c.getResult();
                    return a
                },
                queryCompleted: function (c) {
                    var g = this,
                        f = g.$,
                        e = g.$$,
                        d = e.applet,
                        b;
                    if (e.OTF >= 4) {
                        return
                    }
                    e.OTF = 4;
                    var a = g.isJavaActive();
                    for (b = 0; b < d.HTML.length; b++) {
                        if (d.HTML[b] && d.HTML[b].DELETE) {
                            f.DOM.emptyNode(d.HTML[b].span)
                        }
                    }
                    e.setPluginStatus(c[0], c[1], 0);
                    if (e.funcs) {
                        f.callArray(e.funcs)
                    }
                    if (f.DOM) {
                        f.DOM.onDoneEmptyDiv()
                    }
                }
            },
            zz: 0
        },
        devalvr: {
            mimeType: "application/x-devalvrx",
            progID: "DevalVRXCtrl.DevalVRXCtrl.1",
            classID: "clsid:5D2CF9D0-113A-476B-986F-288B54571614",
            getVersion: function () {
                var h = this,
                    a = null,
                    f, c = h.$,
                    d, g, b;
                if (!c.isIE) {
                    f = c.findNavPlugin("DevalVR");
                    if (f && f.name && c.hasMimeType(h.mimeType)) {
                        a = f.description.split(" ")[3]
                    }
                    h.installed = a ? 1 : -1
                } else {
                    g = c.getAXO(h.progID);
                    if (g) {
                        b = c.getPROP(c.DOM.insert("object", ["classid", h.classID], ["src", ""], "", h).obj(), "pluginversion");
                        if (b && b.toString) {
                            a = "00000000" + b.toString(16);
                            a = a.substr(a.length - 8, 8);
                            a = parseInt(a.substr(0, 2) || "0", 16) + "," + parseInt(a.substr(2, 2) || "0", 16) + "," + parseInt(a.substr(4, 2) || "0", 16) + "," + parseInt(a.substr(6, 2) || "0", 16)
                        }
                    }
                    h.installed = a ? 1 : (g ? 0 : -1)
                }
                h.version = c.formatNum(a)
            }
        },
        flash: {
            mimeType: "application/x-shockwave-flash",
            progID: "ShockwaveFlash.ShockwaveFlash",
            classID: "clsid:D27CDB6E-AE6D-11CF-96B8-444553540000",
            getVersion: function () {
                var b = function (i) {
                    if (!i) {
                        return null
                    }
                    var e = /[\d][\d\,\.\s]*[rRdD]{0,1}[\d\,]*/.exec(i);
                    return e ? e[0].replace(/[rRdD\.]/g, ",").replace(/\s/g, "") : null
                };
                var j = this,
                    g = j.$,
                    k, h, l = null,
                    c = null,
                    a = null,
                    f, m, d;
                if (!g.isIE) {
                    m = g.hasMimeType(j.mimeType);
                    if (m) {
                        f = g.DOM.insert("object", ["type", j.mimeType], [], "", j).obj();
                        try {
                            l = g.getNum(f.GetVariable("$version"))
                        } catch (k) {}
                    }
                    if (!l) {
                        d = m ? m.enabledPlugin : null;
                        if (d && d.description) {
                            l = b(d.description)
                        }
                        if (l) {
                            l = g.getPluginFileVersion(d, l)
                        }
                    }
                } else {
                    for (h = 15; h > 2; h--) {
                        c = g.getAXO(j.progID + "." + h);
                        if (c) {
                            a = h.toString();
                            break
                        }
                    }
                    if (!c) {
                        c = g.getAXO(j.progID)
                    }
                    if (a == "6") {
                        try {
                            c.AllowScriptAccess = "always"
                        } catch (k) {
                            return "6,0,21,0"
                        }
                    }
                    try {
                        l = b(c.GetVariable("$version"))
                    } catch (k) {}
                    if (!l && a) {
                        l = a
                    }
                }
                j.installed = l ? 1 : -1;
                j.version = g.formatNum(l);
                return true
            }
        },
        shockwave: {
            mimeType: "application/x-director",
            progID: "SWCtl.SWCtl",
            classID: "clsid:166B1BCA-3F9C-11CF-8075-444553540000",
            getVersion: function () {
                var a = null,
                    b = null,
                    g, f, d = this,
                    c = d.$;
                if (!c.isIE) {
                    f = c.findNavPlugin("Shockwave\\s*for\\s*Director");
                    if (f && f.description && c.hasMimeType(d.mimeType)) {
                        a = c.getNum(f.description)
                    }
                    if (a) {
                        a = c.getPluginFileVersion(f, a)
                    }
                } else {
                    try {
                        b = c.getAXO(d.progID).ShockwaveVersion("")
                    } catch (g) {}
                    if (c.isString(b) && b.length > 0) {
                        a = c.getNum(b)
                    } else {
                        if (c.getAXO(d.progID + ".8")) {
                            a = "8"
                        } else {
                            if (c.getAXO(d.progID + ".7")) {
                                a = "7"
                            } else {
                                if (c.getAXO(d.progID + ".1")) {
                                    a = "6"
                                }
                            }
                        }
                    }
                }
                d.installed = a ? 1 : -1;
                d.version = c.formatNum(a)
            }
        },
        windowsmediaplayer: {
            mimeType: ["application/x-mplayer2", "application/asx", "application/x-ms-wmp"],
            navPluginObj: null,
            progID: "wmplayer.ocx",
            classID: "clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6",
            INSTALLED: {
                dfault: null,
                inputMime: {}
            },
            getVersion: function (i, g) {
                var c = this,
                    f = c.$,
                    l, e = null,
                    h = null,
                    j = c.mimeType,
                    k = "Totem|VLC",
                    b, d, a;
                c.installed = -1;
                if (f.isString(g)) {
                    g = g.replace(/\s/g, "");
                    if (g) {
                        j = g
                    }
                } else {
                    g = null
                } if (g) {
                    d = c.INSTALLED.inputMime[g];
                    if (f.isDefined(d)) {
                        c.installed = d;
                        return
                    }
                } else {
                    d = c.INSTALLED.dfault;
                    if (d !== null) {
                        c.installed = d;
                        return
                    }
                } if (!f.isIE) {
                    if (f.OS < 20 && f.OS >= 3) {
                        c.installed = -1;
                        return
                    }
                    a = {
                        wmp: "Windows\\s*Media\\s*Player.*Plug-?in|Flip4Mac.*Windows\\s*Media.*Plug-?in",
                        wmpFirefox: "Windows\\s*Media\\s*Player.*Firefox.*Plug-?in",
                        avoidPlayers: "Totem|VLC|RealPlayer"
                    };
                    if (c.getVersionDone === null) {
                        c.getVersionDone = 0;
                        e = f.getMimeEnabledPlugin(c.mimeType, a.wmp, a.avoidPlayers);
                        if (!g) {
                            l = e
                        }
                        if (!e && f.hasMimeType(c.mimeType)) {
                            e = f.findNavPlugin(a.wmp, 0, a.avoidPlayers)
                        }
                        if (e) {
                            c.navPluginObj = e;
                            b = (f.isGecko && f.compareNums(f.verGecko, f.formatNum("1.8")) < 0);
                            b = b || (f.isOpera && f.verOpera < 10);
                            b = b || f.isChrome;
                            if (!b && f.getMimeEnabledPlugin(c.mimeType[2], a.wmpFirefox, a.avoidPlayers)) {
                                h = f.getPROP(f.DOM.insert("object", ["type", c.mimeType[2], "data", ""], ["src", ""], "", c).obj(), "versionInfo") || h
                            }
                        }
                    } else {
                        h = c.version
                    } if (!f.isDefined(l)) {
                        l = f.getMimeEnabledPlugin(j, a.wmp, a.avoidPlayers)
                    }
                    c.installed = l && h ? 1 : (l ? 0 : (c.navPluginObj ? -0.2 : -1))
                } else {
                    e = f.getAXO(c.progID);
                    h = f.getPROP(e, "versionInfo") || h;
                    c.installed = e && h ? 1 : (e ? 0 : -1)
                } if (!c.version) {
                    c.version = f.formatNum(h)
                }
                if (g) {
                    c.INSTALLED.inputMime[g] = c.installed
                } else {
                    c.INSTALLED.dfault = c.installed
                }
            }
        },
        silverlight: {
            mimeType: "application/x-silverlight",
            progID: "AgControl.AgControl",
            digits: [20, 20, 9, 12, 31],
            getVersion: function () {
                var e = this,
                    c = e.$,
                    k = document,
                    i = null,
                    b = null,
                    f = null,
                    h = true,
                    a = [1, 0, 1, 1, 1],
                    r = [1, 0, 1, 1, 1],
                    j = function (d) {
                        return (d < 10 ? "0" : "") + d.toString()
                    }, n = function (s, d, u, v, t) {
                        return (s + "." + d + "." + u + j(v) + j(t) + ".0")
                    }, o = function (s, d, t) {
                        return q(s, (d == 0 ? t : r[0]), (d == 1 ? t : r[1]), (d == 2 ? t : r[2]), (d == 3 ? t : r[3]), (d == 4 ? t : r[4]))
                    }, q = function (v, t, s, x, w, u) {
                        var u;
                        try {
                            return v.IsVersionSupported(n(t, s, x, w, u))
                        } catch (u) {}
                        return false
                    };
                if (!c.isIE) {
                    var g;
                    if (c.hasMimeType(e.mimeType)) {
                        g = c.isGecko && c.compareNums(c.verGecko, c.formatNum("1.6")) <= 0;
                        if (c.isGecko && g) {
                            h = false
                        }
                        f = c.findNavPlugin("Silverlight.*Plug-?in", 0);
                        if (f && f.description) {
                            i = c.formatNum(f.description)
                        }
                        if (i) {
                            r = i.split(c.splitNumRegx);
                            if (parseInt(r[2], 10) >= 30226 && parseInt(r[0], 10) < 2) {
                                r[0] = "2"
                            }
                            i = r.join(",")
                        }
                    }
                    e.installed = f && h && i ? 1 : (f && h ? 0 : (f ? -0.2 : -1))
                } else {
                    b = c.getAXO(e.progID);
                    var m, l, p;
                    if (b && q(b, a[0], a[1], a[2], a[3], a[4])) {
                        for (m = 0; m < e.digits.length; m++) {
                            p = r[m];
                            for (l = p + (m == 0 ? 0 : 1); l <= e.digits[m]; l++) {
                                if (o(b, m, l)) {
                                    h = true;
                                    r[m] = l
                                } else {
                                    break
                                }
                            }
                            if (!h) {
                                break
                            }
                        }
                        if (h) {
                            i = n(r[0], r[1], r[2], r[3], r[4])
                        }
                    }
                    e.installed = b && h && i ? 1 : (b && h ? 0 : (b ? -0.2 : -1))
                }
                e.version = c.formatNum(i)
            }
        },
        vlc: {
            mimeType: "application/x-vlc-plugin",
            progID: "VideoLAN.VLCPlugin",
            classID: "clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921",
            compareNums: function (e, d) {
                var c = this.$,
                    k = e.split(c.splitNumRegx),
                    i = d.split(c.splitNumRegx),
                    h, b, a, g, f, j;
                for (h = 0; h < Math.min(k.length, i.length); h++) {
                    j = /([\d]+)([a-z]?)/.test(k[h]);
                    b = parseInt(RegExp.$1, 10);
                    g = (h == 2 && RegExp.$2.length > 0) ? RegExp.$2.charCodeAt(0) : -1;
                    j = /([\d]+)([a-z]?)/.test(i[h]);
                    a = parseInt(RegExp.$1, 10);
                    f = (h == 2 && RegExp.$2.length > 0) ? RegExp.$2.charCodeAt(0) : -1;
                    if (b != a) {
                        return (b > a ? 1 : -1)
                    }
                    if (h == 2 && g != f) {
                        return (g > f ? 1 : -1)
                    }
                }
                return 0
            },
            getVersion: function () {
                var c = this,
                    b = c.$,
                    d, a = null;
                if (!b.isIE) {
                    if (b.hasMimeType(c.mimeType)) {
                        d = b.findNavPlugin("VLC.*Plug-?in", 0, "Totem");
                        if (d && d.description) {
                            a = b.getNum(d.description, "[\\d][\\d\\.]*[a-z]*")
                        }
                    }
                    c.installed = a ? 1 : -1
                } else {
                    d = b.getAXO(c.progID);
                    if (d) {
                        a = b.getNum(b.getPROP(d, "VersionInfo"), "[\\d][\\d\\.]*[a-z]*")
                    }
                    c.installed = a ? 1 : (d ? 0 : -1)
                }
                c.version = b.formatNum(a)
            }
        },
        adobereader: {
            mimeType: "application/pdf",
            navPluginObj: null,
            progID: ["AcroPDF.PDF", "PDF.PdfCtrl"],
            classID: "clsid:CA8A9780-280D-11CF-A24D-444553540000",
            INSTALLED: {},
            pluginHasMimeType: function (d, c, f) {
                var b = this,
                    e = b.$,
                    a;
                for (a in d) {
                    if (d[a] && d[a].type && d[a].type == c) {
                        return 1
                    }
                }
                if (e.getMimeEnabledPlugin(c, f)) {
                    return 1
                }
                return 0
            },
            getVersion: function (l, j) {
                var g = this,
                    d = g.$,
                    i, f, m, n, b = null,
                    h = null,
                    k = g.mimeType,
                    a, c;
                if (d.isString(j)) {
                    j = j.replace(/\s/g, "");
                    if (j) {
                        k = j
                    }
                } else {
                    j = null
                } if (d.isDefined(g.INSTALLED[k])) {
                    g.installed = g.INSTALLED[k];
                    return
                }
                if (!d.isIE) {
                    a = "Adobe.*PDF.*Plug-?in|Adobe.*Acrobat.*Plug-?in|Adobe.*Reader.*Plug-?in";
                    if (g.getVersionDone !== 0) {
                        g.getVersionDone = 0;
                        b = d.getMimeEnabledPlugin(g.mimeType, a);
                        if (!j) {
                            n = b
                        }
                        if (!b && d.hasMimeType(g.mimeType)) {
                            b = d.findNavPlugin(a, 0)
                        }
                        if (b) {
                            g.navPluginObj = b;
                            h = d.getNum(b.description) || d.getNum(b.name);
                            h = d.getPluginFileVersion(b, h);
                            if (!h && d.OS == 1) {
                                if (g.pluginHasMimeType(b, "application/vnd.adobe.pdfxml", a)) {
                                    h = "9"
                                } else {
                                    if (g.pluginHasMimeType(b, "application/vnd.adobe.x-mars", a)) {
                                        h = "8"
                                    }
                                }
                            }
                        }
                    } else {
                        h = g.version
                    } if (!d.isDefined(n)) {
                        n = d.getMimeEnabledPlugin(k, a)
                    }
                    g.installed = n && h ? 1 : (n ? 0 : (g.navPluginObj ? -0.2 : -1))
                } else {
                    b = d.getAXO(g.progID[0]) || d.getAXO(g.progID[1]);
                    c = /=\s*([\d\.]+)/g;
                    try {
                        f = (b || d.DOM.insert("object", ["classid", g.classID], ["src", ""], "", g).obj()).GetVersions();
                        for (m = 0; m < 5; m++) {
                            if (c.test(f) && (!h || RegExp.$1 > h)) {
                                h = RegExp.$1
                            }
                        }
                    } catch (i) {}
                    g.installed = h ? 1 : (b ? 0 : -1)
                } if (!g.version) {
                    g.version = d.formatNum(h)
                }
                g.INSTALLED[k] = g.installed
            }
        },
        pdfreader: {
            mimeType: "application/pdf",
            progID: ["AcroPDF.PDF", "PDF.PdfCtrl"],
            classID: "clsid:CA8A9780-280D-11CF-A24D-444553540000",
            OTF: null,
            fileUsed: 0,
            fileEnabled: 1,
            setPluginStatus: function (c, b) {
                var a = this,
                    d = a.$;
                a.version = null;
                if (a.installed !== 0 && a.installed != 1) {
                    if (b == 3) {
                        a.installed = -0.5
                    } else {
                        a.installed = c ? 0 : (d.isIE ? -1.5 : -1)
                    }
                }
                if (a.verify && a.verify.isEnabled()) {
                    a.getVersionDone = 0
                } else {
                    if (a.getVersionDone != 1) {
                        a.getVersionDone = b < 2 && a.fileEnabled && a.installed <= -1 ? 0 : 1
                    }
                }
            },
            getVersion: function (l, f, b) {
                var g = this,
                    c = g.$,
                    i = false,
                    d, a, j, h = g.NOTF,
                    m = g.doc,
                    k = g.verify;
                if (b !== true) {
                    b = false
                }
                if (g.getVersionDone === null) {
                    g.OTF = 0;
                    if (k) {
                        k.begin()
                    }
                }
                if (((c.isGecko && c.compareNums(c.verGecko, "2,0,0,0") <= 0 && c.OS <= 4) || (c.isOpera && c.verOpera <= 11 && c.OS <= 4) || (c.isChrome && c.compareNums(c.verChrome, "10,0,0,0") < 0 && c.OS <= 4) || 0) && !b) {
                    g.fileEnabled = 0
                }
                c.file.save(g, ".pdf", f);
                if (g.getVersionDone === 0) {
                    if (g.OTF < 2 && (g.installed < 0 || b)) {
                        if (m.insertHTMLQuery(b) > 0) {
                            i = true
                        }
                        g.setPluginStatus(i, g.OTF)
                    }
                    return
                }
                if (!b) {
                    if (!c.isIE) {
                        if (c.hasMimeType(g.mimeType)) {
                            i = true
                        }
                    } else {
                        try {
                            if ((c.getAXO(g.progID[0]) || c.getAXO(g.progID[1])).GetVersions()) {
                                i = true
                            }
                        } catch (j) {}
                    }
                }
                if (g.OTF < 2 && (!i || b)) {
                    if (m.insertHTMLQuery(b) > 0) {
                        i = true
                    }
                }
                g.setPluginStatus(i, g.OTF)
            },
            doc: {
                $: 1,
                HTML: 0,
                DummyObjTagHTML: 0,
                DummySpanTagHTML: 0,
                queryObject: function (c) {
                    var g = this,
                        d = g.$,
                        b = g.$$,
                        a;
                    if (d.isIE) {
                        a = -1;
                        try {
                            if (g.HTML.obj().GetVersions()) {
                                a = 1
                            }
                        } catch (f) {}
                    } else {
                        a = d.DOM.getTagStatus(g.HTML, g.DummySpanTagHTML, g.DummyObjTagHTML, c)
                    };
                    return a
                },
                insertHTMLQuery: function (c) {
                    var h = this,
                        d = h.$,
                        f = h.$$,
                        i, b = f.pdf,
                        e = d.file.getValid(f),
                        a = d.DOM.altHTML;
                    if (e) {
                        e = e.full
                    }
                    if (d.isIE) {
                        if (c && (!e || !f.fileEnabled)) {
                            return 0
                        }
                        if (!h.HTML) {
                            h.HTML = d.DOM.insert("object", ["classid", f.classID], ["src", c && e ? e : ""], a, f)
                        }
                        if (c) {
                            f.fileUsed = 1
                        }
                    } else {
                        if (!e || !f.fileEnabled) {
                            return 0
                        }
                        if (!h.HTML) {
                            h.HTML = d.DOM.insert("object", ["type", f.mimeType, "data", e], ["src", e], a, f)
                        }
                        f.fileUsed = 1
                    } if (f.OTF < 2) {
                        f.OTF = 2
                    }
                    if (!h.DummyObjTagHTML) {
                        h.DummyObjTagHTML = d.DOM.insert("object", [], [], a)
                    }
                    if (!h.DummySpanTagHTML) {
                        h.DummySpanTagHTML = d.DOM.insert("", [], [], a)
                    }
                    i = h.queryObject();
                    if (i !== 0) {
                        return i
                    }
                    var g = f.NOTF;
                    if (f.OTF < 3 && h.HTML && g) {
                        f.OTF = 3;
                        g.onIntervalQuery = d.handler(g.$$onIntervalQuery, g);
                        if (!d.winLoaded) {
                            d.WLfuncs0.push([g.winOnLoadQuery, g])
                        }
                        setTimeout(g.onIntervalQuery, g.intervalLength)
                    }
                    return i
                }
            },
            NOTF: {
                $: 1,
                count: 0,
                countMax: 25,
                intervalLength: 250,
                $$onIntervalQuery: function (e) {
                    var c = e.$,
                        b = e.$$,
                        d = b.doc,
                        a;
                    if (b.OTF == 3) {
                        a = d.queryObject(e.count);
                        if (a > 0 || a < 0 || (c.winLoaded && e.count > e.countMax)) {
                            e.queryCompleted(a)
                        }
                    }
                    e.count++;
                    if (b.OTF == 3) {
                        setTimeout(e.onIntervalQuery, e.intervalLength)
                    }
                },
                winOnLoadQuery: function (c, e) {
                    var b = e.$$,
                        d = b.doc,
                        a;
                    if (b.OTF == 3) {
                        a = d.queryObject(e.count);
                        e.queryCompleted(a)
                    }
                },
                queryCompleted: function (b) {
                    var d = this,
                        c = d.$,
                        a = d.$$;
                    if (a.OTF == 4) {
                        return
                    }
                    a.OTF = 4;
                    a.setPluginStatus(b > 0 ? true : false, a.OTF);
                    if (a.funcs) {
                        c.callArray(a.funcs)
                    }
                    if (c.DOM) {
                        c.DOM.onDoneEmptyDiv()
                    }
                }
            },
            getInfo: function () {
                var b = this,
                    c = b.$,
                    a = {
                        OTF: (b.OTF < 3 ? 0 : (b.OTF == 3 ? 1 : 2)),
                        DummyPDFused: (b.fileUsed ? true : false)
                    };
                return a
            },
            zz: 0
        },
        realplayer: {
            mimeType: ["audio/x-pn-realaudio-plugin"],
            progID: ["rmocx.RealPlayer G2 Control", "rmocx.RealPlayer G2 Control.1", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "RealPlayer"],
            classID: "clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA",
            INSTALLED: {},
            q1: [
                [11, 0, 0],
                [999],
                [663],
                [663],
                [663],
                [660],
                [468],
                [468],
                [468],
                [468],
                [468],
                [468],
                [431],
                [431],
                [431],
                [372],
                [180],
                [180],
                [172],
                [172],
                [167],
                [114],
                [0]
            ],
            q3: [
                [6, 0],
                [12, 99],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 46],
                [12, 46],
                [12, 46],
                [11, 3006],
                [11, 2806],
                [11, 2806],
                [11, 2804],
                [11, 2804],
                [11, 2799],
                [11, 2749],
                [11, 2700]
            ],
            compare: function (g, f) {
                var e, d = g.length,
                    i = f.length,
                    c, h;
                for (e = 0; e < Math.max(d, i); e++) {
                    c = e < d ? g[e] : 0;
                    h = e < i ? f[e] : 0;
                    if (c > h) {
                        return 1
                    }
                    if (c < h) {
                        return -1
                    }
                }
                return 0
            },
            convertNum: function (a, f, e) {
                var g = this,
                    c = g.$,
                    d, b, h, i = null;
                if (!a || !(d = c.formatNum(a))) {
                    return i
                }
                d = d.split(c.splitNumRegx);
                for (h = 0; h < d.length; h++) {
                    d[h] = parseInt(d[h], 10)
                }
                if (g.compare(d.slice(0, Math.min(f[0].length, d.length)), f[0]) != 0) {
                    return i
                }
                b = d.length > f[0].length ? d.slice(f[0].length) : [];
                if (g.compare(b, f[1]) > 0 || g.compare(b, f[f.length - 1]) < 0) {
                    return i
                }
                for (h = f.length - 1; h >= 1; h--) {
                    if (h == 1) {
                        break
                    }
                    if (g.compare(f[h], b) == 0 && g.compare(f[h], f[h - 1]) == 0) {
                        break
                    }
                    if (g.compare(b, f[h]) >= 0 && g.compare(b, f[h - 1]) < 0) {
                        break
                    }
                }
                return e[0].join(".") + "." + e[h].join(".")
            },
            getVersion: function (m, n) {
                var j = this,
                    k = null,
                    c = 0,
                    g = 0,
                    d = j.$,
                    q, i, s, a = j.mimeType[0];
                if (d.isString(n)) {
                    n = n.replace(/\s/g, "");
                    if (n) {
                        a = n
                    }
                } else {
                    n = null
                } if (d.isDefined(j.INSTALLED[a])) {
                    j.installed = j.INSTALLED[a];
                    return
                }
                if (!d.isIE) {
                    var l = "RealPlayer.*Plug-?in",
                        h = d.hasMimeType(j.mimeType),
                        o = d.findNavPlugin(l, 0);
                    if (h && o) {
                        c = 1;
                        if (n) {
                            if (d.getMimeEnabledPlugin(n, l)) {
                                g = 1
                            } else {
                                g = 0
                            }
                        } else {
                            g = 1
                        }
                    }
                    if (j.getVersionDone !== 0) {
                        j.getVersionDone = 0;
                        if (h) {
                            var p = 1,
                                b = null,
                                r = null;
                            s = d.hasMimeType("application/vnd.rn-realplayer-javascript");
                            if (s) {
                                b = d.formatNum(d.getNum(s.enabledPlugin.description))
                            }
                            if (d.OS == 1 && b) {
                                var f = b.split(d.splitNumRegx);
                                r = true;
                                if (j.compare(f, [6, 0, 12, 200]) < 0) {
                                    r = false
                                } else {
                                    if (j.compare(f, [6, 0, 12, 1739]) <= 0 && j.compare(f, [6, 0, 12, 857]) >= 0) {
                                        r = false
                                    }
                                }
                            }
                            if (r === false) {
                                p = 0
                            }
                            if (d.OS <= 2) {
                                if (d.isGecko && d.compareNums(d.verGecko, d.formatNum("1,8")) < 0) {
                                    p = 0
                                }
                                if (d.isChrome) {
                                    p = 0
                                }
                                if (d.isOpera && d.verOpera < 10) {
                                    p = 0
                                }
                            } else {
                                p = 0
                            } if (p) {
                                s = d.DOM.insert("object", ["type", j.mimeType[0]], ["src", "", "autostart", "false", "imagestatus", "false", "controls", "stopbutton"], "", j).obj();
                                try {
                                    k = d.getNum(s.GetVersionInfo())
                                } catch (q) {}
                                d.DOM.setStyle(s, ["display", "none"])
                            }
                            if (!k && b && r === false) {
                                s = j.convertNum(b, j.q3, j.q1);
                                k = s ? s : b
                            }
                        }
                    } else {
                        k = j.version
                    }
                    j.installed = c && g && k ? 1 : (c && g ? 0 : (c ? -0.2 : -1))
                } else {
                    s = null;
                    for (i = 0; i < j.progID.length; i++) {
                        s = d.getAXO(j.progID[i]);
                        if (s) {
                            try {
                                k = d.getNum(s.GetVersionInfo());
                                break
                            } catch (q) {}
                        }
                    }
                    j.installed = k ? 1 : -1
                } if (!j.version) {
                    j.version = d.formatNum(k)
                }
                j.INSTALLED[a] = j.installed
            }
        },
        zz: 0
    }
};
PluginDetect.initScript();