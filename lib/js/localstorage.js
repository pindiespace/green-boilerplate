/**
 * mini-JSON polyfill, in case our preferred polyfill (JSON3) doesn't work.
 * The lower limit of GBP is browsers with try...catch
 * Some browsers with try...catch compile JSON2 or JSON3, but fail to
 * actually stringify andparse
 * 
 * inspired by minimal JSON object at
 * http://www.sitepoint.com/javascript-json-serialization/
 * 
 * JSON3 - https://github.com/bestiejs/json3
 *
 * Sample fails:
 * - Opera 5 croaks on JSON2, JSON3
 * - HotJava croaks on JSON2 and JSON3
 *
 * LIMITATIONS:
 * doesn't support utf8 encryption or unicode characters, e.g., \u0000
 *
 * The first test below gets cases where a JSON polyfill compiled, but fails to operated. This
 * happens with JSON2 and JSON3 on many old browsers. If the native JSON or the JSON3 polyfill
 * fail the test, we load this backup JSON likely to work on old, crappy browsers.
 *
 * TODO: Add 'exports' for these objects, e.g.
 * object = typeof window != 'undefined' ? window : exports,
 *
 */

if (!window.JSON ||
    typeof JSON.parse !== "function" ||
    typeof JSON.stringify !== "function" ||
    !JSON.parse("{\"g\":\"g\"}") ||
    !JSON.stringify({"g":"g"})) {
	
		window.JSON = (function () {
			
			var polyfill = true;  //FLAG FOR USING STORAGE polyfill (nonstandard)
			var DEBUG    = true;
			
			//TODO: DEFINITELY go through Prototype (custom JSON processing)
			//TODO: also utilities (e.g., camelcasers, sanitizers)
			//https://ajax.googleapis.com/ajax/libs/prototype/1.7.1.0/prototype.js
			
			function stringify (obj) {
				
				var rlimit = 0; //recursion limit
				
				if(DEBUG) log("using alternate JSON.stringify");
				
				function objStringify(obj) {
					if (rlimit > 20) {
						log("Error:JSON recursion too deep");
						return null;
					}
					var n, v, json = new Array(), arr = (obj && obj.constructor == Array);
					for (n in obj) {
						var v = obj[n], t = typeof(v);
						if (t == "string") {
							var len = v.length;
							
							/**
							 * whitelist, confine JSON input to alphanumeric and a few other symbols
							 * - lack of '&' should zap character entitites
							 * - lack of  '()' should kill evil functions
							 * - lack of '<>' should kill evil scripts
							 */
							
							v = v.replace(/[^a-z 0-9 -:{}"]+/gi,'');
							if (len != v.length) {
								log("Warning: removed characters from string:"+v);
							}							
							v = v.replace(/["]+/g, '\\"');  //escape internal quotes like JSON3 does
							v = '"'+v+'"';                  //store quote symbols around quoted strings
						}
						else if (t === "function") {
							//log("in function");
							v = '"'+undefined+'"';          //we don't pass functions
						}
						else if (t === "undefined") {
							v = '"'+undefined+'"';
						}
						else if (t == "object" && v !== null) { //recursive call to my parent function
							v = JSON.stringify(v);
						}
						json.push((arr ? "" : '"' + n + '":') + String(v));
					}
					return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");	
				}
				
				switch (String(typeof obj).toLowerCase()) {
					case "string":
						var str = String(obj);
						return str.replace(/[^E+-0-9]+/gi,''); //whitelist, confine to number or exponents
						break;
					case "number":
					case "boolean":
						return obj;               //these can be directly returned
						break;
					case "date":
						return obj.toUTCString(); //stringify the date
						break;
					case "object":
						rlimit = 0;
						return objStringify(obj); //recurse array or object
						break;
					default:
						break;
				}
				
				return null;
			}
			
			//JSON.parse replacement
			
			function parse (objStr) {
				if (String(typeof objStr).toLowerCase() === "string") {
					
					if(DEBUG) log("alternate JSON.parse");
					
					if (objStr !== "") {
						
						/*
						 * we parse by (1)checking JSON sanity with a regex, and (2) use eval. JSON polyfills
						 * without eval (e.g. json_sans_eval.js) fail on many old browsers
						 *
						 * Sanitizing:
						 *
						 * Prototype library 'santize' is too hard for old browsers
						 * https://ajax.googleapis.com/ajax/libs/prototype/1.7.1.0/prototype.js
						 *
						 * Our sanitizer:
						 * 
						 * regexp from http://www.thomasfrank.se/json_stringify_revisited.html
						 */
						var cleaner;
						try {
							cleaner = new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$');
						}
						catch(a){
							try {
								if(DEBUG) log("first JSON sanitize regexp failed to compile, try a simpler one");
								cleaner = new RegExp('^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$');
							} catch(e) {
								log("Error:"+e+"cannot compile sanitize regex, exiting JSON.parse()");
								return null;
							}
						}
						
						//use eval to read the strings
						
						try {
							if (cleaner.test(objStr)) {
								
								if(DEBUG) log("string is valid JSON");
								
								/**
								 * older browsers don't handle the JQuery method
								 * var obj = (new Function("return " + objStr))();
								 * in fact, only an eval with the variable assigned as part of
								 * the eval works, like below
								 */
								eval("var obj ="+objStr+";");
								if (typeof obj === "object") {
									return obj;
								}
								log("JSON.parse(), returned type:"+ typeof obj);
							}
							else {
								log("didn't pass the cleaner test ("+objStr+")");
							}
						} catch(e) {
							log("Error:"+ e + " in JSON.parse()");
						}
							
					}
				}
				
				return null;
			}
			
			return {
				stringify:stringify,
				parse:parse
			}
			
		})();
		
	} //test for functional JSON



/** 
 * GBP local storage polyfill
 * inspired by Storage polyfill by Nurlan-Mammadli
 * https://gist.github.com/2398893/d6327b3ca7b7c50d3f4f784e06bac76cf649fe0f
 *
 * loaded similar to Remy Sharp's polyfill (using the 'new' operator)
 * https://gist.github.com/remy/350433
 *
 * Some similarity to MDN example
 * https://developer.mozilla.org/en-US/docs/Web/Guide/DOM/Storage
 *
 * See also
 * http://code.google.com/p/sessionstorage/source/browse/trunk/src/sessionStorage.js
 *
 * uses cookies for localStorage
 * uses window.name for sessionStorage
 * 
 * http://code.google.com/p/sessionstorage
 * http://blogs.sitepointstatic.com/examples/tech/js-session/session.js
 *
 * Also inspired by:
 * https://github.com/samyk/evercookie
 *
 * TODO: look for optimizations later
 * JSPerf
 * http://jsperf.com/json3/21
 *
 * @requires JSON.stringify and JSON.parse
 * @requires a defined window.log() object
 * @param {String} cookieName  name for the cookie we use for all localStorage
 * @param {String} quoteEntity character string we use to replace any quotes in
 * the JSON string before saving to a HTML cookie. The core (Netscape) spec disallows
 * quotes, but most browsers support having internal quotes in your cookie. Using a
 * single quote entity is more lightweight that a complete encoding (e.g. base64) that
 * would require a polyfill with lots of regular expressions.
 *
 * test, avoiding cases where Storage was declared by not defined (beta browsers?)
 */
if (typeof window.localStorage == "undefined" || typeof window.sessionStorage == "undefined") (function () {
 	
	window.Storage = function (storageName, storageType) {
		
		var length         = 0, data = {};
		var domain         = document.domain;
		var MAX_COOKIE     = 4096; //conservative, but this IS an old browser polyfill!
		var path           = "/";
		var ONE_DAY        =  86400000;
		var TWO_DAYS       = 172800000;
		var FIVE_MINUTES   =  0.003472;
		var PERSIST_DAYS   = 2;
		var polyfill       = true;  //FLAG FOR USING STORAGE polyfill (nonstandard)
		var hasNativeError = false; //flag for avoiding try...catch
		var DEBUG          = false;
		
		if(DEBUG) log("using " + storageType + "Storage polyfill");
		
		if(!data) {
			data = {};
		}
		
		/**
		 * get number of object properties
		 */
		function getLength() {
			var count = 0;
			if (data) {
				for (var i in data) {
					count++;
				}
			}
			return count;
		}
		
		//read out the default value from Storage (cookie or window.name) into our data object during initialization
		
		if (storageName) {
			if (DEBUG) log("initializing, "+storageType+".getFromStorage()");
			data = getFromStorage(storageName);
			if (DEBUG) log(storageType+".getFromStorage() complete");
		}
		
		/**
		 * length is the NUMBER of items stored, not length in bytes
		 * count it as number of local object properties
		 */
		length = getLength(data);
		
		if(DEBUG) log("length for "+storageType+"Storage="+length);
		
		/**
		 * spec says to throw exceptions if we exceed storage size during a .setItem(), so define here.
		 * QUOTA_EXCEEDED_ERR
		 * SECURITY_ERR (not implemented)
		 */
		function QUOTA_EXCEEDED_ERR (message){
			this.name    = "QUOTA_EXCEEDED_ERR";
			this.message = message;
		}		
		
		/**
		 * oddly enough, JS interpreters with working try...catch sometimes don't have
		 * a native Error() object defined. So, create this object if it isn't
		 * present.
		 * 
		 * NOTE: we can't use getType here
		 */
		if (typeof Error !== "undefined") {
			if(DEBUG) log("no native Error object, creating")
			QUOTA_EXCEEDED_ERR.prototype = new Error();
			hasNativeError = false;
		}
		else {
			hasNativeError = true;
		}
		
		/**
		 * if we're in Opera, set navigation so the window onload event functions correctly
		 * makes sense if we fire a Storage event, like real Storage.
		 * NOTE: this doesn't work with Opera 7 and older
		 * http://samuli.hakoniemi.net/onload-issues-with-opera/
		 */
		if (window.opera && opera.setOverrideHistoryNavigationMode)  {
			opera.setOverrideHistoryNavigationMode("compatible");
			history.navigationMode = "compatible";
		}
		
		/**
		 * accurate type detection, .toString() is always defined on Object
		 * http://mrrena.blogspot.com/2012/05/javascript-better-typeof-accurately.html
		 */
		function getType(obj) {
			if (obj) {
				return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
			}
			return null;
		}
		
		
		/**
		 * @method escapeCookieStr
		 * The cookie spec croaks if we have a '\' or '%' or ';' or '"' or ';' in the cookie body. 
		 *
		 * Since we can't use '%' we don't use a standard unescape.
		 * Instead, do a custom replace of these symbols
		 * with character entities. Opera in particular needs the quotes entified to work properly.
		 * @param {String} str the unescaped string
		 * @returns {String} the escaped string
		 */
		function escapeCookieStr (str) {
			if (str) {
				return str.replace(/\\/g, "x19").replace(/%/g, "x20").replace(/;/g, "x21").replace(/"/g, "x22");
			}
			return str;
		}
		
		
		/**
		 * @method unescapeCookieStr
		 * return a string (usually from JSON.stringify) to its original state
		 * @param {String} str the escaped string
		 * @returns {String} the unescaped string
		 */
		function unescapeCookieStr (str) {
			if (str) {
				return str.replace(/x22/g, '"').replace(/x21/g, ";").replace(/x20/g, "%").replace(/x19/g, "\\");
			}
			return str;
		}
		
		
		/**
		 * @method stringify
		 * local wrapper for JSON.stringify, or our fallback stringify routine for very old browsers
		 */
		function stringify(obj) {
			try {
				var objStr = JSON.stringify(obj);
				objStr = escapeCookieStr(objStr);
				return objStr;
			}
			catch (e) {
				log("in stringify(), Error in serializing object type:"+ typeof obj);
				return null;
			}
			return null;
		}
		
		
		/**
		 * @method destringify
		 * de-serialize what comes out of our external storage
		 * @return {Mixed} shout return an object
		 */
		function destringify(str) {
			
			if (DEBUG) log("in destringify");
			
			if (str && getType(str) === "string") {
				str = unescapeCookieStr(str);
				try {
					var obj = JSON.parse(str);
					if(DEBUG) log("in destringify, obj is:"+obj)
					return obj;
				} catch(e) {
					log("Error:"+e+", invalid JSON string in destringify()");
				}
			}
			else {
				log("Error:non-string value passed for str:"+typeof str+" in destringify()");
			}
			return null;
		}
		
		
		/**
		 * @method getFromStorage
		 * get from our outside-object storage
		 * http://lea.verou.me/2009/12/reading-cookies-the-regular-expression-way/
		 */
		function getFromStorage(cookieName) {
			
			cookieName = cookieName.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
			
			var matcher;
			if (storageType === "local") {
				matcher = document.cookie;
			}
			else {
				matcher = window.name;
			}
			
			var regex = new RegExp('(?:^|;)\\s?' + cookieName + '=(.*?)(?:;|$)','i');
			/////////////////////var regex2 = new RegExp('[; ]' + cookieName + '=([^\\s;]*)');
			
			var matchStr = matcher.match(regex);
			if (!matchStr) {
				if(DEBUG) log("in getFromStorage(), first regex didn't work, try a simpler one");
				
				regex = new RegExp(cookieName + '=(.*?)(;|$)');
				matchStr = matcher.match(regex);
			}
			
			//at this point, we should have extracted the data from document.cookie or window.name
			
			if(DEBUG) log("in getFromStorage(), matchStr type is:"+getType(matchStr));
			
			if (!matchStr) {
				if(DEBUG) log("in getFromStorage(), nothing returned from:"+storageType);
				data = {};
				
				return null;
			}
			
			if (matchStr.length) {
				for (var i = 0; i < matchStr.length; i++) {
					if(DEBUG) log("in getFromStorage(), matchStr["+i+"]="+(matchStr[i]).substring(0,50));
				}
			}
			else {
				if(DEBUG) log("in getFromStorage(), matchStr exists, but has length=0");
			}
			
			//convert the stored data back to an object
			
			var storageData;
			if (matchStr[1]) {
				storageData = destringify(matchStr[1]);
			}
			
			if (storageData === null) {
				if(DEBUG) log("in getFromStorage(), nothing in storage");
				data = {};
				if(DEBUG) log("in getFromStorage(), storageData dataType is now:"+getType(storageData));
				return null;
			}
			else {
				if(DEBUG) log("in getFromStorage(), recovering storageData, type is:"+getType(storageData)); //should be 'object'
				data = storageData;
			}
			
			//read out the stored data
			
			if(DEBUG) log("in getFromStorage, (), type of data after assignment is:"+getType(data));
			
			if (DEBUG) {
				log("in getFromStorage(), reading out data{} object now...")
				for (var i in data) {
					log("data["+i+"]="+data[i]+" type:"+getType(data[i]));
				}
			}
			
			length = getLength();
			
			return data;	
		}
		
		
		/**
		 * @method setToStorage();
		 * set outside storage to value in our internal object.
		 * We avoid a try...catch to support very old desktops and mobiles
		 */
		function setToStorage(cookieName) {
			
			//if (DEBUG) {
			//	log("in setToStorage(), caller is " + arguments.callee.caller.toString());
			//}
			
			var str   = stringify(data);           //data to JSON format
			if (DEBUG) log("in setToStorage(), data stringified to:"+str);
			//var value = str;
			
			var dat, expires;
			
			if(PERSIST_DAYS > 0) {
				dat = new Date;
				dat.setTime(dat.getTime()+(PERSIST_DAYS*86400000));
				expires = "; expires="+dat.toUTCString();
			}
			else {
				expires = '';
			}
			
			var cookieStr = cookieName + "=" + str + expires + (path ? "; path=" + path : "") + (domain ? "; domain=." + domain : "");
			
			if (storageType === "local") {
				
				try {
					document.cookie = cookieStr; //set into a cookie
					if (DEBUG) log("in setToStorage(), document.cookie is now:"+document.cookie);					
				} catch(e) {
					log("Error:"+e+" in setToStorage");
					if (hasNativeError) {
						throw QUOTA_EXCEEDED_ERR;
					}
					else {
						log("Error:QUOTA_EXCEEDED_ERR");
					}
				}	
			}
			else {				
				clearStorage();              //delete existing value
				window.name += cookieStr;    //add to existing window.name
			}
			
			length = getLength();
		}
		
		
		/**
		 * @method clearStorage()
		 * clear the storage internally and in the outside storage. Since we
		 * may share outside storage, extract with a regrexp
		 */
		function clearStorage(cookieName) {
			
			if (DEBUG) log("in "+storageType+".clearStorage()");
			
			if (storageType === "local") {
				var d = new Date();
				d.setTime(d.getTime() - TWO_DAYS); //expired two days in the past
				var cookieStr = cookieName + "=; expires=" + d.toUTCString() + (path ? "; path=" + path : "") + (domain ? "; domain=." + domain : "");
			}
			else {
				var regex = new RegExp(cookieName + "(.+)" + (path ? "; path=" + path : "") + (domain ? "; domain=." + domain : ""));
				window.name = window.name.replace(regex, '');
			}
			data   = {};
			length = 0;
		}
		
		/**
		 * =====================================================
		 * API
		 * localStorage interface
		 * =====================================================
		 */
		
		/**
		 * @method getItem
		 * return an item, based on key
		 * since we're storing objects locally as objects, we have to stringify
		 * @param {String} key
		 * @returns (String} value
		 */
		function getItem(key) {
			
			if (DEBUG) log("in "+storageType+"Storage.getItem() getting value for:"+key);
			if (DEBUG) log("current type of data is:"+getType(data));
			if (data && data[key] && getType(data[key]) === "string") {
				return data[key];
			}
			if (DEBUG) log("no object found for key "+key+", returning null")
			return null;
		}
		
		/**
		 * @method setItem
		 * update our local data{} object, then sync to storage(cookie or window.name)
		 * @param String key the key (must be string)
		 * @param String value the value (must be string, objects will be pre-stringified via JSON)
		 * @returns "undefined"
		 */
		function setItem (key, value) {
			
			if(DEBUG) log("in setItem(), key:"+ key + " and value:" + value);
			if(DEBUG) log("in setItem(), type of incoming is:"+getType(value));
			
			/**
			 * some lousy browsers appear to mess up between 'object' and 'null' here when
			 * we use our getType() on an object literal like data = {} in one function and
			 * access the data from another function. getType() examines the .toString value,
			 * and this is apparently being munged. typeof remains object in this case.
			 * 
			 * 
			 * - FF 1.0  gives an 'object' at all times
			 * - Opera 7 gives an 'object' at all times
			 * - HotJava gives 'object' at first, but a 'null' later
			 * - IE 6 gives 'object' at first, but a 'null' later
			 * 
			 */
			 
			if (!data) {
				data = {};
			}
			
			//key must be a string
			
			if (getType(key) !== "string") {
				log("in setItem(), key cannot be a non-string value");
				return;
			}
			
			/**
			 * browsers with native Storage convert "primitives"
			 * 
			 * - Number and Boolean to strings
			 * - Date to a UTC date string
			 * - Objects are not converted, instead their .toString() value is saved.
			 * 
			 * The following switch mimics this behavior
			 */
			switch (getType(value)) {
				case "string":
					data[key] = value;
				case "number":
				case "boolean":
					data[key] = String(value);
					break;
				case "date":
					data[key] = value.toUTCString();
				case "object":
					log("in setItem, value cannot be Object,(it is a"+getType(value)+"), must be String");
					log("current type of data:"+type(data));
					data[key] = "[object Object]"; //convert to string, according to spec
					break;
				default:
					log("unknown dataType, in setItem(), value must be a string, not a:"+ typeof value);
					return;
					break;
			}
			
			setToStorage(storageName);
		}
		
		
		/** 
		 * remove an item from local storage
		 * update our local data{} object, then sync to storage (cookie or window.name)
		 * @param {String} key key
		 * @returns "undefined"
		 */
		function removeItem(key) {
			
			if (getType(key) !== "string") {
				log("in removeItem(), key cannot be a non-string value");
				return;
			}
			
			if(!this.data[key]) {
				log("in removeItem(), no value for key ("+key+") present");
				return;
			}
			
			delete this.data[key];
			
			setToStorage();
		}
		
		/** 
		 * remove all names and value from local storage
		 * update our local data() object, then sync to storage (cookie or window name)
		 */
		function clear() {
			clearStorage(storageName);
		}		
		
		/** 
		 * @method key returns a value for a numeric key
		 * @param {Number} index, ith position in storage array
		 * @returns {String} String object pointed to by index in data[] array
		 */
		function key(i) {
			var idx = parseInt(i);
			return typeof data[idx] === "undefined" ? null : data[idx];
		}
		
		
		/** 
		 * export the localStorage API
		 */
		return {
			length: length, 
			key: key,	
			clear: clear,			
			getItem: getItem,
			setItem: setItem,
			removeItem: removeItem,
			stringify:stringify,
			polyfill:polyfill, //NONSTANDARD, but useful since polyfill has severe cookie-size limits
			data:data         //TODO: remove !!!!!!!!!!!!!!!!!!!!!
		};
		
	}//end of Storage function
	
	/** 
	 * initialize the storage polyfill by reading 
	 * the current cookie on startup
	 */
	var storageName = "GBPLocStor";
	
	/**
	 * create localStorage and sessionStorage if necessary
	 */
	if(!window.localStorage) window.localStorage     = new Storage(storageName, "local");
	if(!window.sessionStorage) window.sessionStorage = new Storage(storageName, "session");

	
	})(); //end of wrapper for localStorage polyfill
