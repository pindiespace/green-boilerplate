/**
 * full set of tests and configuration supported by GBP. The JS functions in this library
 * are dynamically embedded, server-side in the GBP object, which is then inserted into
 * the web page during download.
 *
 * We cannot use JSON to download this library
 * since we are incorporating functions as well as properties
 * 
 * NOTE: USE DOUBLE QUOTES IN ALL PLACES - BEST PRACTICE FOR JS (and required by GBP parser)
 * 
 */
var GBPFullTests = {
	
	javascript:function () {
		this.javascript = true;
	},
	
	root: function (){
		/*
		 * browser window, or module in server-side?
		 * http://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
		 */
		
		var _ = new Object();
		
		if(typeof global !== "undefined") {
			this.root = global;
		}
		else if (typeof window !== "undefined") {
			this.root = window;
		}
		else {
			this.root = false;
		}
		
		/**
		 * Export the Underscore object for **CommonJS**, with backwards-compatibility
		 * for the old require() API. If we are not in CommonJS, add _ to the
		 * global object.
		 */
		if (typeof module !== "undefined" && module.exports) {
			module.exports = _;
			this.root._ = _;
		}
		else {
			this.root._ = _;
		}
	},
	
	clientside: function () {
		//in a web browser
		this.clientside = !!window;
	},
	
	loader:function () {
		// Detect the `define` function exposed by asynchronous module loaders. The
		// strict `define` check is necessary for compatibility with `r.js`.
		this.loader = typeof define === "function" && define.amd;
	},
	
	module: function () {
		this.module = !!(typeof module !== "undefined" && module.exports);
	},
	
	serverside: function () {
		//in a server environment (which could be a tricked-up browser)
		//http://timetler.com/2012/10/13/environment-detection-in-javascript/
		this.serverside = !!(typeof exports !== "undefined" && this.exports !== exports);
	},
	
	ancient:function () {
		//we cannot determine this client-side
		this.ancient = undefined;
	},
	
	"name":function () {
		/**
		 * NOTE: property requires quotes around "name"
		 * we can only recover the name accurately in a few cases!
		 * note quotes on property name!
		 * http://help.dottoro.com/ljglevrj.php
		 * Use IE detection by  Andrea Giammarchi
		 * http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
		 */
		if (!+"\v1") {
			this.name = "msie";
		}
		else if(window.navigator && window.navigator.userAgent) {
			var ua = window.navigator.userAgent.toLowerCase();
			if (~ua.indexOf("chrome")) {
				this.name = "chrome";
			}
			else if (~ua.indexOf("firefox")) {
				this.name = "firefox";
			}
			else if (~ua.indexOf("safari")) {
				this.name = "safari";
			}
			else if(~ua.indexOf("opera") || ~ua.indexOf("opr")) {
				this.name = "opera";
			}
			else if (~ua.indexOf("trident")) {
				this.name = "msie"; //get IE 9+
			}
			else {
				this.name = undefined;
			}	
		}
		else {
			this.name = undefined;
		}
		
	},

	/**
	 * ultra-safe and correct typeof replacement
	 * http://mrrena.blogspot.com/2012/05/javascript-better-typeof-accurately.html
	 * @returns the type, as a lower-cased string
	*/
	typehelper: function (obj) {
		if (obj !== undefined) {
			return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
		}
		return obj;
	},
	
	version:function () {
		/**
		 * detected via user-agent sniffing
		 * NOTE: versionname should be left detected on server
		 * check for version/xxx first (newer Opera user-agents)
		 * if not found, use older detection, "browsername/version"
		 * http://stackoverflow.com/questions/5916900/detect-version-of-browser
		 */
		var ua = navigator.userAgent, m;
		m = ua.match(/(version)\/?\s*([\d\.]+)/i) || [];
		if (!m || !m[2]) {
			m = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*([\d\.]+)/i) || [];	
		}
		if (!m || !m[2]) {
			m = ua.match(/trident(.*)rv.(\d+)/i) || [];
		}
		if (m && m[2]) {
			this.version = parseFloat(m[2] ? m[2]:navigator.appVersion);
		}
		else {
			this.version = undefined;
		}
	},
	
	enginename:function () {
		/**
		 * http://help.dottoro.com/ljglevrj.php
		 */
		var offset;
		if(window.navigator && window.navigator.userAgent) {
			var ua = window.navigator.userAgent.toLowerCase();
			//webkit browsers
			if (~ua.indexOf("webkit")) {
				this.enginename = "webkit";
			}
			//opera
			else if (~ua.indexOf("presto")) {
				this.enginename = "presto";
			}
			//firefox
			else if (~ua.indexOf("gecko")) {
				this.enginename = "gecko";
			}
			//IE9+
			else if (~ua.indexOf("trident")) {
				this.enginename = "trident";
			}
			//new webkit opera if webkit not in ua
			else if (~ua.indexOf("opr/")) {
				this.enginename = "webkit";
			}
			//old opera without webkit in UA string
			else if (~ua.indexOf("opera")) {
				this.enginename = "presto";//older opera, very old had another engine
			}
			//not exactly right, macIE 5 had tasman
			else if (~ua.indexOf("msie")) {
				this.enginename = "trident";
			}
			else {
				this.enginename = undefined;
			}
		}
		else {
			this.enginename = undefined;	
		}
	},
	
	useragent:function () {
		this.useragent = navigator.userAgent;
	},
	

	//dom1, dom2, dom3 tests at http://kangax.github.io/js-checker/#dom-3
	dom0:function () {
		this.dom0 = !!(window && document && document.forms);
		
		
	},
	
	dom1:function () {
		/** 
		 * document.implementation.hasFeature("Core", i+".0"));
		 * document.implementation.hasFeature("HTML", i+".0")
		 * //http://www.brothercake.com/Ref/in.html
		 */
		this.dom1 = !!(document.implementation && document.implementation.hasFeature("HTML", "1.0") &&
			     document.childNodes && document.getElementById && document.createElement &&
			     document.getElementsByTagName);
	},
	
	dom2:function () {
		this.dom2 = !!(document.implementation && document.implementation.hasFeature("Events", "2.0") &&
			       document.addEventListener);
	},

	dom3:function () {
		this.dom3 = !!(document.evaluate && document.documentElement.getUserData &&
				typeof document.documentElement.textContent);
	},
	
	cookie:function () {	
		var cookieEnabled = !!(navigator.cookieEnabled);
		if(!cookieEnabled) {
			var testCookie = "testcookiegbp";
			document.cookie = testCookie;
			(document.cookie.indexOf(testCookie) != -1) ? this.cookie = true : this.cookie = false;
			document.cookie = testCookie + "; expires=Thu, 01-Jan-1970 00:00:01 GMT";
		}
		else {
			this.cookie = cookieEnabled;
		}
	},

	/**
	 * vendor prefixes will soon be a thing of the past, and some vendors (e.g. Opera) already
	 * support the prefixes of others.
	 * http://shoutleaf.com/2013/05/blink-rendering-engine/
	 * adapted from http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/
	 * However, we are trying to support old browsers, so...
	 *
	 * NOTE: this function is used by our csshelper() and JS prophelper() methods. So, we force
	 * immediate execution upon parsing with an internal anonymous function. It is possible that
	 * the PHP bootstrap parser will croak here.
	 * 
	 * @returns the vendor prefix (with its case instact), if it exists, or false if it does not
	 */
	vendorprefix:function() {
		var regex = /^(webkit|Moz|O|ms|Webkit|Khtml|Icab)(?=[A-Z])/,
		val = false,
		num = 0,
		someScript;
		
		if (this.dom1) {
			(function () {
				someScript = document.getElementsByTagName("script")[0];
				//log("somescript.style:"+someScript);
				if (someScript.style) {
					for(var prop in someScript.style) {
						//log("PROP:"+prop);
						num++;
						if(regex.test(prop)) {
						
							//.test() is faster than match(), so it's better to perform
							//that on the lot and match only when necessary
							val = prop.match(regex)[0];
							//log("vendorprefix prop:"+prop+" val:"+val);
							break;
						}
					}
					
					//Webkit does not enumerate over the CSS properties of the style object.
					//(prop in style) returns the correct value, so we'll have to test for
					//the precence of a specific property
					if (!val) {
						if("WebkitOpacity" in someScript.style) {
							val = "Webkit";
						}
						if("KhtmlOpacity" in someScript.style)  {
							val = "Khtml";
						}
					}
				}
				someScript = null;
				log("got a prefix:"+val+" num:"+num);
			})();
		}
		
		this.vendorprefix = val;
	},
	
	localstorage:function () {
		/**
		 * better localstorage pattern
		 * http://mathiasbynens.be/notes/localstorage-pattern
		 * accd to localStorage, we can generate an exception here, so enclose in try...catch
		 * NOTE: this will croak on browsers that do not implement try...catch
		 * NOTE: IE 6-8 require UNIQUE variables names in the catch statement
		 * http://weblog.bocoup.com/the-catch-with-try-catch/
		 * TODO: graceful test for sessionStorage when localStorage is used
		 */
		var uid = "12345678", storage, result;
		try {
			if ((storage = window.localStorage)) {
				storage.setItem("uid", uid);
				result = (storage.getItem("uid") == uid);
				storage.removeItem(uid);
				this.localstorage = !!(result && storage);
			}
			else {
				this.localstorage = false;
			}
			
		} catch(e) {
			this.localstorage = false;
		}
		
	},
	
	sessionstorage:function () {
		var uid = "12345678", storage, result;
		try {
			if ((storage = window.sessionStorage)) {
				storage.setItem("uid", uid);
				result = (storage.getItem("uid") == uid);
				storage.removeItem(uid);
				this.sessionstorage = !!(result && storage);
			}
			else {
				this.sessionstorage = false;
			}
			
		} catch(e) {
			this.sessionstorage = false;
		}	
	},

	json: function () {
		/**
		 * similar to has.js
		 */
		if(!window.JSON || typeof JSON.parse !== "function" || typeof JSON.stringify !== "function" ||
			!JSON.parse("{\"g\":\"g\"}") || !JSON.stringify({"g":"g"})) {
			this.json = false;
		}
		this.json = true;
	},
	

	/**
	 * base function for tests involving document.createElement() which
	 * (prop in elem) tests
	 * @param {String} prop GBP property name
	 * @param {String|DOMElement} name of HTML tag, or the actual DOM element
	 * @param {String} attr property "in" the element we test for
	 */
	jsprophelper:function (prop, elem, attr) {
		var prefixes,
			len,
			val = false;
		log("outside prophelper, prop:"+prop+" elem:"+elem+" attr:"+attr+" dom1:"+typeof this.dom1);
		if (this.dom1 && prop && elem && attr) {
			
			log("inside prophelper");
			if (typeof elem === "string") { //dont need this.typehelper()
				elem = document.createElement(elem); //requires dom1
				log("ELEM:"+elem);
			}
			if (elem) {
				
				//try the standard
				
				if (attr in elem) {
					val = true;
				}
				else if(typeof this.vendorprefix === "string") {
					
					//log("this.vendorprefix:"+this.vendorprefix);
					prefixes = [this.vendorprefix.toLowerCase()];
					
					len = prefixes.length;
					attr = attr.charAt(0).toUpperCase() + attr.slice(1); //camelCase the vendor prefix for js
					for (var i = 0; i < len; i++) {
						//log("prophelper trying:"+prefixes[i] + attr+ " in " + elem); 
						if (!!(prefixes[i] + attr in elem)) {
							val = true;
							break;
						}
					}
				}
			}
			elem = null;	
		}
		this[prop] = val; //always set
	},
	
	command:function() {
		//this.command = !!(document && document.createElement && document.createElement("command") && ("type" in document.createElement("command")));
		log(this.prophelper("command", document, "type"));
	},
	
	menu:function () {
		this.prophelper("menu", "menu", "type");
	},
	
	menuitem:function () {
		this.prophelper("menuitem", "menuitem", "type");	
	},
	
	scriptasync:function () {
		//this.scriptasync = !!(document && document.createElement && ("async" in document.createElement("script")));
		this.prophelper("scriptasync", "script", "async");
	},
	
	scriptdefer:function () {
		//this.scriptdefer = !!(document && document.createElement && ("defer" in document.createElement("script")));
		this.prophelper("scriptdefer", "script", "defer");
	},
	
	iframe:function () {
		this.iframe = !!(document && document.createElement && document.createElement("iframe"));
	},
	
	sandbox:function () {
		//this.sandbox = (document && document.createElement && ("sandbox" in document.createElement("iframe")));
		this.prophelper("sandbox", "iframe", "sandbox");
	},
	
	seamless:function () {
		if (this.bot) {
			log("js_tests.js: gotta bot in seamless() as " + this.bot);
		} else {
			log("js_tests:js:no bot in seamless()");
		}
		this.seamless = (document && document.createElement && ("seamless" in document.createElement("iframe")));
	},
	
	srcdoc:function () {
		//this.srcdoc = (document && document.createElement && ("srcdoc" in document.createElement("iframe")));
		this.prophelper("srcdoc", "iframe", "srcdoc");
	},
	
	microdata:function () {
		this.microdata = !!document.getItems;
	},
	
	//form input types
	
	/*
	 * TODO: DATE IS A JS KEYWORD!!!!!
	 * input date, not JS Date object test
	 * 
	date: function () {
		if (document && document.createElement) {
			var input = document.createElement("input");
			if (input) {
				//code
			
			input.type = "date";
			input.value = "f";
			if (input.value === "f") {
				this.date = false;
			}
			else {
				input.value = "2001-01-01";
				if (input.value !== "2001-01-01") {
					this.date = false;
				}
				else {
					this.date = true;
				}
			}
			}
		}
	},
	*/
	
	//CSS
	//TODO: probably needs to run BEFORE csshelper, or only loaded if we
	//only test for css, and nothing besides
	
	css:function () {
		if ("supportsCSS" in window) { //w3 standard
			this.css = true;
		}
		else if ("CSS" in window && "supports" in window.CSS) {
			this.css = true;
		}
		else if (document && document.documentElement && document.documentElement.style) {
			this.css = true;
		}
		else {
			this.css = false;
		}
	},
	
	/**
	 * base function for multiple css tests, http://www.sitepoint.com/detect-css3-property-browser-support/
	 * http://ryanmorr.com/detecting-css-style-support/
	 * http://perfectionkills.com/feature-testing-css-properties/
	 * @param {String} css GBP name for css property, e.g., "boxshadow"
	 * @param {String} cssProp, a css property name, e.g. "box-shadow"
	 * @param {String} cssVal (optional) a value to test with the CSS property, e.g. "5px"
	 * @returns {Boolean} true if style present
	 * We don't try to generate CSS and JS property names from each other. This is slightly inefficient, but
	 * allows us more flexible coupling between GBP property names (always lowercase) and the actual CSS property
	*/
	csshelper:function (css, cssProp, cssVal) {
		
		function testProp (prop, val) {
			var v = false,
			win = window,
			style;
			if("supportsCSS" in win){
				v = win.supportsCSS(prop, val);    //newer W3C method
				}
			else if("CSS" in win && "supports" in win.CSS) {
				v = win.CSS.supports(prop, val);   //alternate
			}
			else if (document && document.documentElement && document.documentElement.style) {      //old method
				//log("PROP:"+prop);
				style = document.documentElement.style;
	
				//log("PROP ARR:"+style[prop]);
				if (prop in style) {
					var elem = win.document.createElement("div");
					//log("ELEM:"+elem);
					if (elem && elem.style) {
						//log("STYLE "+prop+" present, val:"+val);
						elem.style.cssText = prop + ":" + val;
						//log(prop + ":" + val);
						//log("STYLE "+ prop + " cssText:"+elem.style.cssText);
						//v = (prop in elem.style)
						v = (elem.style[prop] !== "");
						//log("VV IS:"+v);
					}
					elem = null;
				}
			}
			//log("returning V:"+v);
			return v;
		}; //end of internal function
		
		/**
		 * try the default property. If it doesn't work, try the
		 * vendorprefix determined previously for this browser
		 */
		var val = false;
		if (css && cssProp && cssVal) {
			val = testProp(cssProp, cssVal);
			//log("first test with "+cssProp);
			if (val === false && this.vendorprefix) {
				var camelRe = /-([a-z]|[0-9])/ig;
				var camelProp = this.vendorprefix + cssProp.charAt(0).toUpperCase() + cssProp.slice(1);

				//this had to be put in multiple lines to parse correct in gbp-bootstrap.php
				
				camelProp = camelProp.replace(camelRe, function(all, c){
					return (c + "").toUpperCase();
					});
				
				//log("second test with "+camelProp);
				val = testProp(camelProp, cssVal);
			}
			
			this[css] = val;
		}
		
	},
	
	color: function () {
		this.csshelper("color", "color", "red"); //should be true for all CSS1, CSS2, CSS3
	},
	
	backgroundclip: function () {
		this.csshelper("backgroundclip", "background-clip", "content-box");
	},
	
	backgroundorigin: function () {
		this.csshelper("backgroundorigin", "background-origin", "content-box");
	},
	
	backgroundsize: function () {
		this.csshelper("backgroundsize", "background-size", "8px 6px");
	},
	
	boxshadow:function () {
		this.csshelper("boxshadow", "box-shadow", "1px 1px");
	},
	
	borderradius:function () {
		this.csshelper("borderradius", "border-radius", "1px");
	},
	
	/**
	borderimage:function () {
		this.csshelper("borderimage", "border-image", "url(border.png) 30 30 round");
	 },
	*/
	
	overflowx:function () {
		this.csshelper("overflowx", "overflow-x", "hidden");
	},

	overflowy:function () {
		this.csshelper("overflowy", "overflow-y", "hidden");
	},
	
	textshadow:function () {
		this.csshelper("textshadow", "text-shadow", "0 -1px 0 rgba(0, 0, 0, 0.6)");
	},
	
	opacity:function () {
		this.csshelper("opacity", "opacity", "0.5");
	},
	
	//EVENTS
	
	//properties
	
	pagevisibility:function () {
		this.prophelper("pagevisibility", document, "hidden");
	},
	
	getusermedia:function () {
		//Ref for camel-case in getusermedia, http://dev.w3.org/2011/webrtc/editor/getusermedia.html
		this.prophelper("getusermedia", navigator, "getUserMedia");
		// (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

	},
	
	touch:function () {
		//potential for support, not whether touch screen is actually present
		//this.touch = !!("ontouchstart" in document.documentElement);
		//NOTE we are checking for a touch event here
		//http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
		if (document && document.documentElement) {
			this.prophelper("touch", document.documentElement, "ontouchstart");
		}
	},
	
	//FORMS
	
	autocomplete:function () {
		var input, autocomplete = false;
		if(document.createElement && (input = document.createElement("input"))) {
			this.autocomplete = ("autocomplete" in input);
		}
		else {
			this.autocomplete = false;
		}
	},
	
	//RICH MEDIA
	
	audio:function () {
		var audio;
		this.audio = !!(document.createElement && (audio = document.createElement("audio")) && audio.canPlayType);
	},
	
	//http://mrcoles.com/detecting-html5-audio-autoplay/
	audioautoplay:function () {
		
 
		// Audio file data URIs from comments in
		// [this gist](https://gist.github.com/westonruter/253174)
		// via [mudcube](https://github.com/mudcube)
		var mp3 = 'data:audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
 
		var ogg = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAADqnjMlAAAAAOyyzPIBHgF2b3JiaXMAAAAAAUAfAABAHwAAQB8AAEAfAACZAU9nZ1MAAAAAAAAAAAAA6p4zJQEAAAANJGeqCj3//////////5ADdm9yYmlzLQAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMTAxMTAxIChTY2hhdWZlbnVnZ2V0KQAAAAABBXZvcmJpcw9CQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBACAAAAYRqF1TCqDEEPKQ4QUY9AzoxBDDEzGHGNONKQMMogzxZAyiFssLqgQBKEhKwKAKAAAwBjEGGIMOeekZFIi55iUTkoDnaPUUcoolRRLjBmlEluJMYLOUeooZZRCjKXFjFKJscRUAABAgAMAQICFUGjIigAgCgCAMAYphZRCjCnmFHOIMeUcgwwxxiBkzinoGJNOSuWck85JiRhjzjEHlXNOSuekctBJyaQTAAAQ4AAAEGAhFBqyIgCIEwAwSJKmWZomipamiaJniqrqiaKqWp5nmp5pqqpnmqpqqqrrmqrqypbnmaZnmqrqmaaqiqbquqaquq6nqrZsuqoum65q267s+rZru77uqapsm6or66bqyrrqyrbuurbtS56nqqKquq5nqq6ruq5uq65r25pqyq6purJtuq4tu7Js664s67pmqq5suqotm64s667s2rYqy7ovuq5uq7Ks+6os+75s67ru2rrwi65r66os674qy74x27bwy7ouHJMnqqqnqq7rmarrqq5r26rr2rqmmq5suq4tm6or26os67Yry7aumaosm64r26bryrIqy77vyrJui67r66Ys67oqy8Lu6roxzLat+6Lr6roqy7qvyrKuu7ru+7JuC7umqrpuyrKvm7Ks+7auC8us27oxuq7vq7It/KosC7+u+8Iy6z5jdF1fV21ZGFbZ9n3d95Vj1nVhWW1b+V1bZ7y+bgy7bvzKrQvLstq2scy6rSyvrxvDLux8W/iVmqratum6um7Ksq/Lui60dd1XRtf1fdW2fV+VZd+3hV9pG8OwjK6r+6os68Jry8ov67qw7MIvLKttK7+r68ow27qw3L6wLL/uC8uq277v6rrStXVluX2fsSu38QsAABhwAAAIMKEMFBqyIgCIEwBAEHIOKQahYgpCCKGkEEIqFWNSMuakZM5JKaWUFEpJrWJMSuaclMwxKaGUlkopqYRSWiqlxBRKaS2l1mJKqcVQSmulpNZKSa2llGJMrcUYMSYlc05K5pyUklJrJZXWMucoZQ5K6iCklEoqraTUYuacpA46Kx2E1EoqMZWUYgupxFZKaq2kFGMrMdXUWo4hpRhLSrGVlFptMdXWWqs1YkxK5pyUzDkqJaXWSiqtZc5J6iC01DkoqaTUYiopxco5SR2ElDLIqJSUWiupxBJSia20FGMpqcXUYq4pxRZDSS2WlFosqcTWYoy1tVRTJ6XFklKMJZUYW6y5ttZqDKXEVkqLsaSUW2sx1xZjjqGkFksrsZWUWmy15dhayzW1VGNKrdYWY40x5ZRrrT2n1mJNMdXaWqy51ZZbzLXnTkprpZQWS0oxttZijTHmHEppraQUWykpxtZara3FXEMpsZXSWiypxNhirLXFVmNqrcYWW62ltVprrb3GVlsurdXcYqw9tZRrrLXmWFNtBQAADDgAAASYUAYKDVkJAEQBAADGMMYYhEYpx5yT0ijlnHNSKucghJBS5hyEEFLKnINQSkuZcxBKSSmUklJqrYVSUmqttQIAAAocAAACbNCUWByg0JCVAEAqAIDBcTRNFFXVdX1fsSxRVFXXlW3jVyxNFFVVdm1b+DVRVFXXtW3bFn5NFFVVdmXZtoWiqrqybduybgvDqKqua9uybeuorqvbuq3bui9UXVmWbVu3dR3XtnXd9nVd+Bmzbeu2buu+8CMMR9/4IeTj+3RCCAAAT3AAACqwYXWEk6KxwEJDVgIAGQAAgDFKGYUYM0gxphhjTDHGmAAAgAEHAIAAE8pAoSErAoAoAADAOeecc84555xzzjnnnHPOOeecc44xxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY0wAwE6EA8BOhIVQaMhKACAcAABACCEpKaWUUkoRU85BSSmllFKqFIOMSkoppZRSpBR1lFJKKaWUIqWgpJJSSimllElJKaWUUkoppYw6SimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaVUSimllFJKKaWUUkoppRQAYPLgAACVYOMMK0lnhaPBhYasBAByAwAAhRiDEEJpraRUUkolVc5BKCWUlEpKKZWUUqqYgxBKKqmlklJKKbXSQSihlFBKKSWUUkooJYQQSgmhlFRCK6mEUkoHoYQSQimhhFRKKSWUzkEoIYUOQkmllNRCSB10VFIpIZVSSiklpZQ6CKGUklJLLZVSWkqpdBJSKamV1FJqqbWSUgmhpFZKSSWl0lpJJbUSSkklpZRSSymFVFJJJYSSUioltZZaSqm11lJIqZWUUkqppdRSSiWlkEpKqZSSUmollZRSaiGVlEpJKaTUSimlpFRCSamlUlpKLbWUSkmptFRSSaWUlEpJKaVSSksppRJKSqmllFpJKYWSUkoplZJSSyW1VEoKJaWUUkmptJRSSymVklIBAEAHDgAAAUZUWoidZlx5BI4oZJiAAgAAQABAgAkgMEBQMApBgDACAQAAAADAAAAfAABHARAR0ZzBAUKCwgJDg8MDAAAAAAAAAAAAAACAT2dnUwAEAAAAAAAAAADqnjMlAgAAADzQPmcBAQA=';
 
		try {
			var audio = new Audio();
			var src = audio.canPlayType('audio/ogg') ? ogg : mp3;
			audio.autoplay = true;
			audio.volume = 0;
 
			// this will only be triggered if autoplay works
			$(audio).on('play', function() {
			AUTOPLAY = true;
			});
 
			audio.src = src;
		} catch(e) {
		console.log('[AUTOPLAY-ERROR]', e);
		
		}

	},
	
	audioapi:function () {
		//webkitAudioContext !== "undefined"
		this.audioapi = !!window.AudioContext;
	},
	
	mp3:function () {
		var audio;
		this.mp3 = !!(document.createElement && (audio = document.createElement("audio")) &&audio.canPlayType
			&& audio.canPlayType("audio/mpeg;").replace(/no/, ""));	
	},
	
	oggvorbis:function () {
		//deprecated!
		var audio;
		this.oggvorbis = !!(document.createElement && (audio = document.createElement("audio")) && audio.canPlayType
			&& audio.canPlayType("audio/ogg; codecs=\"vorbis\"").replace(/no/, ""));
		//this.canPlayType("audio/ogg; codecs=\"vorbis"")
	},
	
	opus:function () {
		var audio;
		this.opus = !!((document.createElement && (audio = document.createElement("audio")) && audio.canPlayType
			&& audio.canPlayType("audio/ogg; codecs=\"opus\"")));
	},
	
	wav:function () {
		var audio;
		this.wav = !!(document.createElement && (audio = document.createElement("audio")) && audio.canPlayType
			&& audio.canPlayType("audio/wav; codecs=\"1\"").replace(/no/, ""));
	},
	
	aac:function () {
		var audio;
		this.aac = !!(document.createElement && (audio = document.createElement("audio")) && audio.canPlayType
			&& audio.canPlayType("audio/mp4; codecs=\"mp4a.40.2\"").replace(/no/, ""));
		//this.canPlayType("audio/mp4; codecs=\"mp4a.40.2\"")
	},
	
	video:function() {
		var video;
		this.video = !!(document.createElement && (video = document.createElement("video")) && video.canPlayType);
	},
		
	h264:function () {
		var video;
		if(document.createElement && (video = document.createElement("video")) && video.canPlayType) {
			this.h264 = !!(video.canPlayType("video/mp4; codecs=\"avc1.42E01E\"") || video.canPlayType("video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\""));
		}
		else {
			this.h264 = false;
		}
	},
	
	mp4:function () {
		var video;
		this.mp4 = !!(document.createElement && (video = document.createElement("video")) && video.canPlayType
			&& video.canPlayType("video/mp4; codecs=\"mp4v.20.8\""));
	},
	
	oggtheora:function () {
		var video;
		this.oggtheora = !!(document.createElement && (video = document.createElement("video")) && video.canPlayType
			&& video.canPlayType("video/ogg; codecs=\"theora\""));
	},
	
	webm:function () {
		var video;
		this.webm = !!(document.createElement && (video = document.createElement("video")) && video.canPlayType
			&& video.canPlayType("video/webm; codecs=\"vp8, vorbis\""));
	},	
	
	
	webp:function () {
		/*
		//this requires some time to detect, may need a delay
		//polyfill at http://webpjs.appspot.com/ and check http://badassjs.com/post/1313384987/weppy
		//CRASHES old browsers which hate the non-url src= 
		var webImg = new Image();
		var that = this;
		try {
			webImg.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
			webImg.onload = webImg.onerror = webImg.onabort = function () {
				(webImg.height === 2) ? that.webp = true : that.webp = false;
			}			
		} catch(e) {
			this.webp = false;
		}
		*/
		
		var video;
		this.webp = !!(document.createElement && (video = document.createElement("video")) && video.canPlayType
			&& video.canPlayType("video/webm; codecs=\"vp8\""));
	},
	
	captions:function () {
		//this.captions = !!(document.createElement && ("src" in document.createElement("track")));
		this.prophelper("captions", "track", "src");
	},
	
	poster: function () {
		//this.poster = !!(document.createElement && ("poster" in document.createElement("video")));
		this.prophelper("poster", "video", "poster");
	},
	
	track: function () {
		//http://www.html5rocks.com/en/tutorials/track/basics/
		//this.track = !!(document.createElement && ("track" in document.createElement("track")));
		this.prophelper("track", "track", "kind");
	},
	
	base64:function () {
		//this.base64 = ("btoa" in window && "atob" in window);
		this.base64 = !!(window.btoa && window.atob);
	},
	
	datauri:function () {
		var gif = new Image(),
		that = this;
		try {
			//NOTE:
			//some browsers complain this is not allowed, smaller published GIFs dont work in IE9
			var ua = window.navigator.userAgent.toLowerCase();
			if (ua.indexOf("hotjava") == -1) {
				gif.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";
				gif.onload = gif.onerror = gif.onabort = function () {
				(gif.height == 1 && gif.width == 1) ? that.datauri = true : that.datauri = false;
				}
			}
			else {
				//NOTE: add a Modernizr style class
				//document.documentElement.className += " no-data-uri";
				that.datauri = false;
			}
		} catch (e) {
			that.datauri = false;
		}
		//from http://proger.i-forge.net/The_smallest_transparent_pixel/eBQ
	},
	
	canvas:function () {
		//(this.canvas.getContext && typeof CanvasRenderingContext2D !== undefined && this.canvas.getContext("2d") instanceof CanvasRenderingContext2D), 
		if (document.createElement) {
			var elem = document.createElement("canvas");
			(elem && elem.getContext && elem.getContext("2d")) ? this.canvas = true : this.canvas = false;
			/*
			 * 	elem.fillStyle = "rgb(0,128,0)";
			 * 	elem.fillRect(0, 0, 1, 1);
			 * 	var cdata = elem.getImageData(0, 0, 1, 1);
			 * 	if (cdata.data[1] === 128) {
			 * 	this.canvas = true;
			 */
			
			elem = null;
		}
		else {
			this.canvas = false;
		}
	},
	
	canvastext:function () {
		if (document.createElement) {
			var context, 
			elem = document.createElement("canvas");
			(elem && elem.getContext && (context = elem.getContext("2d")) && (typeof context.fillText === "function")) ? this.canvastext = true : this.canvastext = false;
			elem = null;
		}
		else {
			this.canvastext = false;
		}
	},
	
	webgl:function () {
		if (document.createElement) {
			var elem = document.createElement("canvas");
			(elem && elem.getContext && window.WebGLRenderingContext) ? this.webgl = true : this.webgl = false;
			elem = null;
		}
		else {
			this.webgl = false;
		}
	},
	
	svg:function () {
		//var svgSupport = !!(window.SVGSVGElement);
		(document.createElementNS && document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect) ? this.svg = true : this.svg = false;
	},
	
	inlinesvg:function () {
		if(document.createElementNS) {
			var div = document.createElement("div");
			var ns  = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			div.innerHTML = "<svg/>";
			((div.firstChild && div.firstChild.namespaceURI) == ns.svg) ? this.inlinesvg = true : this.inlinesvg = false;
			div = null; ns = null;
		}
		else {
			this.inlinesvg = false;
		}
	},
	
	svginhtml:function () {
		//http://diveintohtml5.info/everything.html
		var svg;
		if(document && document.createElement && (svg = document.createElement("div"))) {
			svg.innerHTML = "<svg></svg>";
			this.svginhtml = !!(window.SVGSVGElement && svg.firstChild instanceof window.SVGSVGElement);
			div = null;
		}
		else {
			this.svginhtml = false;
		}
	},
	
	vml:function () {
		if (document && document.createElement && (vml = document.createElement("div"))) {
			vml.innerHTML = "<v:shape adj=\"1\"/>";
			this.vml = ("adj" in vml.firstChild);
			vml = null;
		}
		else {
			this.vml = false;
		}
	},
	
	fullscreen:function () {
		//(!! document.documentElement.requestFullscreen || !! document.documentElement.webkitRequestFullScreen || !! document.documentElement.mozRequestFullScreen || !! document.documentElement.msRequestFullScreen),
		this.fullscreen = !!(document.documentElement && document.documentElement.requestFullscreen && document.exitFullscreen);
	},
	
	requestanimationframe: function () {
		//!! window.webkitRequestAnimationFrame || !! window.mozRequestAnimationFrame || !! window.msRequestAnimationFrame || !! window.oRequestAnimationFrame, 
		this.requestanimationframe = !!window.requestAnimationFrame;
	},
	
	pointerlock: function () {
		//https://developer.mozilla.org/en-US/docs/WebAPI/Pointer_Lock
		this.pointerlock = !!document.pointerLockElement;	
	},
	
	geolocation:function () {
		this.geolocation = ("geolocation" in navigator);
	},
	
	navtiming:function () {
		//http://calendar.perfplanet.com/2011/a-practical-guide-to-the-navigation-timing-api/
		this.navtiming = !!(window.performance && window.performance.timing);
		
	},
	
	orientationevent:function () {
		this.orientationevent = !!window.DeviceOrientationEvent;
	},
	
	websockets:function () {
		this.websockets = !!window.WebSocket;
	},
	
	webworkers:function () {
		this.webworkers = !!window.Worker;
		/**
		 *if (window.Worker) {
			var worker = new Worker('worker.js');
			worker.onmessage = function (e) {
				pass_test('workers');
		};
		*/
	},
	
	sharedworkers:function () {
		this.sharedworkers = !!window.SharedWorker;
	},
	
	postmessage:function () {
		this.postmessage = !!window.postMessage;
	},
	
	eventsource:function () {
		//server-sent events
		//https://developer.mozilla.org/en-US/docs/Web/API/EventSource
		this.eventsource = !!("EventSource" in window);
	},
	
	applicationcache:function () {
		this.applicationcache = !!(window.applicationCache && window.applicationCache.status);
	},
	
	xhr:function () {
		//XMLHttpRequest1
		this.xhr = !!window.XMLHttpRequest;
	},
	
	xhr2:function () {
		//XMLHttpRequest2
		this.xhr2 = !!(window.XMLHttpRequest && ("upload" in new XMLHttpRequest())); //NOT FAST ENOUGH, do something about memory leak
	},
	
	cors:function () {
		//http://www.html5rocks.com/en/tutorials/cors/
		this.cors = !!(window.XMLHttpRequest && ("withCredentials" in new XMLHttpRequest)); //always XHR2, do something about memory leak
	},
	
	history:function () {
		this.history = !!(window.history && history.pushState);
	},

	//http://www.w3.org/TR/battery-status/#navigatorbattery-interface
	battery: function () {
		this.battery = !!(navigator.battery && navigator.battery.level);
	},
	
	gamepad: function () {
		this.gamepad = !!(navigator.gamepads = navigator.webkitGamepads || navigator.MozGamepads);
		
	},
	
	vibrate: function () {
		//EXPERIMENTAL: https://developer.mozilla.org/en-US/docs/Web/Guide/API/Vibration
		this.vibrate = !!window.navigator.vibrate;
	},
	
	connection:function () {
		//measure network speed, speed changes
		//EXPERIMENTAL: https://dvcs.w3.org/hg/dap/raw-file/tip/network-api/Overview.html#widl-NetworkInformation-connection
		this.connection = !!navigator.connection;
	},
	
	activex:function () {
		//(typeof (window.ActiveXObject !== undefined)) ? this.activex = true : this.activex = false;
		this.activex = !!(typeof window.ActiveXObject);
	},
	
	/**
	 * plugin tester, Navigator and ActiveX based browsers
	 * primary tests adapted from:
	 * http://www.browserleaks.com/javascript
	 * detecting-plugins-in-internet-explorer-and-a-few-hints-for-all-the-others
	 * additional Flash 6 test "AllowScriptAcces" from swfobject comments
	 * do minor version lookup in IE, but avoid fp6 crashing issues
	 * see http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
	 */
	pluginshelper:function (plugin, pluginName, mimeType, activeXName) {
		
		//we MUST check for "plugin" since we might be called without parameters
		
		if (plugin) {			
			/////log("trying Netscape:"+pluginName);
			var nav = navigator,
			p, pArr, i, len;
			
			if (nav && nav.plugins !== undefined && nav.plugins.length && typeof nav.mimeTypes !== undefined) {
				this[plugin] = false; //default value, flip to true only if we find it
				pArr = nav.plugins,
				len = pArr.length;
				for (i = 0; i < len; i++) {
					p = pArr[i];
					if (~p.name.indexOf(pluginName)) {
						
						//we scan the .name and .description fields for version
						
						if (p.description && nav.mimeTypes[mimeType] !== undefined && nav.mimeTypes[mimeType].enabledPlugin) {
							window.enabled = nav.mimeTypes[mimeType].enabledPlugin;
							var regex = new RegExp(/([a-zA-Z -]|\s)+/);
							this[plugin] = parseFloat(p.description.replace(/([a-zA-Z -]|\s)+/, ""));
							if (isNaN(this[plugin])) {
								this[plugin] = parseFloat(p.name.replace(/([a-zA-Z -]|\s)+/, ""));
								if (isNaN(this[plugin])) {
									//log("name:"+p.name);
									//log("description:"+p.description);
									this[plugin] = true; //we do not know the version, but plugin is present
									break;
								}
							}
						}
					}
				}
			}
			
			else {
				//log("ActiveX detect of:"+plugin);
				
				var vers = false, versObj = null, trueVers; //putting "axo" here DID NOT WORK
				
				if (window.ActiveXObject) {
					
					switch (plugin) {
					case "silverlight":
						//verify at http://www.silverlightversion.com/
						try {
							var axo = new ActiveXObject("AgControl.AgControl");
							vers = true, trueVers = 0;
							for (var i = 1; i < 100; i++) {
								if(axo.isVersionSupported(i+".0")) {
									trueVers++;
								}
								else {
									break;
								}
							}
							vers = trueVers;
						}
						catch (e) {
							vers = false;
						}
						break;
					case "flash":
						try {
							var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
							vers = true;
							trueVers = axo.GetVariable("$version").split(" ")[1].split(",");
							trueVers = trueVers[0] + "." + trueVers[1];
							vers = trueVers;
						} catch(e) {
							try {
								axo = null;
								//log("trying flash 6");
								axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
								axo.AllowScriptAccess = "always"; //throws if player will crash, for version < 6.0.47
								vers = 6.0;
							} catch(e) {
								vers = false; //flash versions that crash are 6.0.21, 6.0.23, or 6.0.29
							}
						}
						break;
					case "acrobat":
						try {
							var axo = new ActiveXObject("AcroPDF.PDF");
							vers = true;
						} catch(e) {
							try {
								axo = null;
								axo = new ActiveXObject("PDF.Pdfctrl");
								vers = true;
							} catch(e) {
								vers = false;
							}	
						}
						if (vers && axo) {
							try {
								trueVers = axo.GetVersions().split(",");
								trueVers = trueVers[0].split("=");
								trueVers = parseFloat(trueVers[1]);
								vers = trueVers;
							} catch(e) {
								//do nothing
							}
							
						}
						break;
					case "windowsmedia":
						try {
							var axo = new ActiveXObject("WMPlayer.OCX");
							vers = true;
							trueVers = parseFloat(axo.versionInfo);
							vers = trueVers;
						} catch (e) {
							//do nothing
						}
						break;
					case "quicktime":
						try {
							var axo = new ActiveXOBject("QuickTime.QuickTime");
							vers = true;
							var versObj = new ActiveXObject("QuickTimeCheckObject.QuickTimeCheck");
							trueVers = versObj.QuickTimeVersion.toString(16); // Convert to hex
							trueVers = trueVers.substring(0, 1) + "." + trueVers.substring(1, 3);
							trueVers = parseFloat(trueVers);
							vers = trueVers;
						} catch(e) {
							//do nothing
						}
						versObj = null;
						break;
					case "realplayer":
						var definedControls = [
							"rmocx.RealPlayer G2 Control",
							"rmocx.RealPlayer G2 Control.1",
							"RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)",
							"RealVideo.RealVideo(tm) ActiveX Control (32-bit)",
							"RealPlayer"];
						var axo = null;
						for (var i = 0; i < definedControls.length; i++) {
							try {
								axo = new ActiveXObject(definedControls[i]);
								vers = true;
							} catch (e) {
								continue;
							}
							if (vers && axo) {
								try {
									trueVers = axo.GetVersionInfo();
									trueVers = parseFloat(vers);
								} catch (e) {
									//do nothing
								}
							}
						}
						break;
					case "director":
						try {
							var axo = new ActiveXObject("SWCtl.SWCtl");
							vers = true;
							trueVers = control.ShockwaveVersion("").split("r");
							trueVers = parseFloat(trueVers[0]);
							vers = trueVers;
							} catch (e) {
								//do nothing
							}
						break;
					default:
						try {
							var axo = new ActiveXObject(activeXName);
							vers = true;
						} catch (e) {
							//do nothing, version numbers are too inconsistent to test for in unknown plugins
						}
						break;
					}
					axo = null;
					
				}
				this[plugin] = vers; //defined even if no activex
			}
			
		}
		
	},	
	

	silverlight:function () {
		this.pluginshelper("silverlight","Silverlight Plug-In", "application/x-silverlight-2","AgControl.AgControl");
	},
	
	acrobat:function () {
		this.pluginshelper("acrobat", "Adobe Acrobat", "application/pdf", ["AcroPDF.PDF"]);
		//this.pluginshelper("acrobat", "Adobe PDF Plug-in", "application/pdf", "AcroPDF.PDF");
	},
	
	quicktime:function () {
		this.pluginshelper("quicktime", "QuickTime", "video/quicktime", ["QuickTime.QuickTime"]);	
	},

	realplayer:function () {
		this.pluginshelper("realplayer", "RealPlayer", "audio/x-pn-realaudio-plugin", ["rmocx.RealPlayer G2 Control.1"]);
	},
	
	windowsmedia:function () {
		this.pluginshelper("windowsmedia", "Windows Media Player", "application/x-mplayer2", ["MediaPlayer.MediaPlayer.1"]);
	},
	
	//adobe Director from the olden times
	director:function () {
		this.pluginshelper("director", "Shockwave Director", "application/x-director", ["SWCtl.SWCtl.1"]);
	},
	
	unity:function () {
		this.pluginshelper("unity", "Unity Player", "application/vnd.unity", ["UnityWebPlayer.UnityWebPlayer.1"]);
	},
	
	//adobe SVG viewer from the olden times
	//svgviewer:function () {
	//	this.pluginshelper("svgviewer", "SVG Viewer", "image/svg-xml", "Adobe.SVGCtl");
	//},

	flash:function () {
		this.pluginshelper("flash", "Shockwave Flash", "application/x-shockwave-flash", ["ShockwaveFlash.ShockwaveFlash.7"]);
	},
	
	//FEATURE AND BUG TESTER - http://kangax.github.io/cft/
	//OLD JS CHECkER - http://kangax.github.io/js-checker/
	//FIRST IMPRESSION.JS http://www.ravelrumba.com/blog/firstimpression-js-library-detecting-new-visitors/
	//BROWSER FINGERPRINT 
	//BROWSER FINGERPRINT https://github.com/Valve/fingerprintjs

	//a very weak test for Java, since a full test would be very log
	java:function () {
		this.java = navigator.javaEnabled();
	},
	
	//TRACKING AND ANONYMOUS USE
	//http://ie.microsoft.com/testdrive/browser/donottrack/
	
	donottrack:function () {
		//TOOD: NEED VENDOR PREFIX HERE, e.g., navigator.msDoNotTrack
		this.donottrack = !!(navigator && ("doNotTrack" in navigator));
	},
	
	httpdnt:function () {
		//TODO: set server-side at $_SERVER["HTTP_DNT"]
		//TODO: test on server side
		//TODO: MUST be set if "doNotTrack" is set on browser!
		//http://www.w3.org/Submission/2011/SUBM-web-tracking-protection-20110224/#dnt-uas
		this.httpdnt = undefined;
		
	},
	
	mstrackingprotection:function () {
		this.mstrackingprotection = !!(window && window.external && window.external.msTrackingProtectionEnabled &&
			window.msTrackingProtectionEnabled());
	},
	
	//NETWORK TESTS
	
	spdy:function () {
		//chrome-specific, http://japhr.blogspot.com/2011/06/spdy-on-client-side.html
		this.spdy = !!(window.chrome && window.chrome.loadTimes && window.chrome.loadTimes().wasFetchedViaSpdy);
	},
	
	isOldIE : function () {
		if (navigator  &&  navigator.userAgent.match( /MSIE/i ))  { //<IE10
			var rv = -1; // Return value assumes failure.
			if (navigator.appName == 'Microsoft Internet Explorer') {
				var ua = navigator.userAgent;
				var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
				if (re.exec(ua) != null) {
					rv = parseFloat( RegExp.$1 );
					if (rv > -1 && rv < NEW_MSIE) {
						return true;
					}
				}
			}
			
		}
	  
	  return false;
	},
	
	
	/**
	 * @method getScroll
	 * get amount of scrolling for the window, useful for centering
	 * modal windows onscreen
	 * @returns {Object} an object, with x and y values for scrolling, with 0 meaning
	 * no scrolling has occured
	 */
	getScroll : function () {
		var win = window, scrolledX, scrolledY;
		if(win.pageYOffset) {
			scrolledX = win.pageXOffset;
			scrolledY = win.pageYOffset;
		}
		else if(document.documentElement && document.documentElement.scrollTop) { //old IE
			scrolledX = document.documentElement.scrollLeft;
			scrolledY = document.documentElement.scrollTop;
			}
		else if( document.body ) {
			scrolledX = document.body.scrollLeft;
			scrolledY = document.body.scrollTop;
		}
		return {
			x:scrolledX,
			y:scrolledY
		}
	},
	
	
	/**
	 * @method urlMatch
	 * see if a string is a url with a protocol
	 * @param {String} str the string to test
	 * @returns {Boolean} if it is a url, return true, else false
	 */
	isURL : function (url) {
		if (url.length > 0) {
			var matcher = /https?\:\/\/\w+((\:\d+)?\/\S*)?/;
			if (url.match(matcher)) {
				console.log("returning true for:"+url);
				return true;
			}
		}
		console.log("returning false for:"+url);
		return false;
	},
	
	// OLD DOM 0 INFO AT
	//http://oreilly.com/catalog/jscript4/chapter/ch17.html
	
	//IMAGESLOADED
	//https://github.com/desandro/imagesloaded
	
	
	//DOM CORE FEATRES
	//http://www.quirksmode.org/dom/core/
	
	//OBSOLETE DOM LEVELS
	//https://developer.mozilla.org/en-US/docs/DOM_Levels
	
	//DOM THE LIVING STANDARD
	//https://developer.mozilla.org/en-US/docs/DOM/DOM_Reference
	//http://dom.spec.whatwg.org/
	
	//KLANGAX DOM CHECKER
	//http://kangax.github.io/js-checker/#dom-3
	
	//DOM HACKING
	//https://deepsec.net/docs/Slides/2012/DeepSec_2012_Rosario_Valotta_-_Taking_Browsers_Fuzzing_to_the_next_%28DOM%29_Level.pdf
	
	//DOM GRINDER
	//https://github.com/stephenfewer
	
	
	//D3
	
	//D3 Gallery
	//https://github.com/mbostock/d3/wiki/Gallery
	
	//Force Layout docs
	//https://github.com/mbostock/d3/wiki/Force-Layout
	
	
	//Multi-force with attractors
	//http://bl.ocks.org/mbostock/1804919
	
	//force-directed graph with mouseover
	//http://bl.ocks.org/mbostock/2706022
	
	//JavaScript Promises
	//http://www.html5rocks.com/en/tutorials/es6/promises/
	
	
	//FORRST
	//http://forrst.com/
	
	
	domreadyMozilla: function () {
		if (document.addEventListener) {
			function contentLoaded () {
				console.log("all done");
			}
  			document.addEventListener("DOMContentLoaded", contentLoaded, false);
		}
	},
	
	domreadyIE : function () { 
		if (document.all && !window.opera){ //Crude test for IE
			//Define a "blank" external JavaScript tag
			function contentLoaded () {
				console.log("all done");
			}
			document.write('<script type="text/javascript" id="contentloadtag" defer="defer" src="javascript:void(0)"><\/script>')
			var contentloadtag=document.getElementById("contentloaded")
			contentloadtag.onreadystatechange=function() {
				if (this.readyState=="complete")
				contentLoaded()
			}
		}
	},
	
	
	domreadySafari : function () {
		if(/Safari/i.test(navigator.userAgent)){ //Test for Safari
			function contentLoaded () {
				console.log("all done");
			}
			var _timer=setInterval(function(){
				if(/loaded|complete/.test(document.readyState)) {
				clearInterval(_timer)
				walkmydog() // call target function
				}
			}, 10);
		}
	}


};
