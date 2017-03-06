<script type="text/javascript">
	<!--//--><![CDATA[//><!--
        	
	/**
	 * GBP debugging console object, based on
	 * http://www.paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
	 */
        window.log = function(){
		
		var USE_ALERT = 1, USE_POPPUP = 2, USE_EDIT_FIELD = 3,USE_NOTHING = 4;
		
		var method = USE_POPPUP;
		
		log.history = log.history || [];   // store logs to an array for reference
		log.history.push(arguments);
		
		//use Console object
		
		if(this.console){
			console.log( Array.prototype.slice.call(arguments));
		} 
		else {
			//choose an alternate method for display
			
			switch (method) {
				case USE_ALERT:
					alert(Array.prototype.slice.call(arguments));
					break;
				case USE_POPPUP:
					var GBPConsoleWindow = window.open("","GBPConsoleWindow","height=300,width=400,scrollbars=1,resizable=1,menubar=no,status=no");
					if (GBPConsoleWindow) {
						GBPConsoleWindow.document.write('<pre>');
						GBPConsoleWindow.document.write(Array.prototype.slice.call(arguments));
						GBPConsoleWindow.document.write('</pre>');
					}
					break;
				case USE_EDIT_FIELD:
					document.write('<form method="post" action="#"><textarea rows="2" cols="80">');
					document.write(Array.prototype.slice.call(arguments));
					document.write('</textarea></form></body>');			
					break;
				case USE_NOTHING:
					//we have to examing window.log array manually
					break;
				default:
					break;
			}
			
		} //end of don't use Console object
	};

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
 * 
 */

if (!window.JSON ||
    typeof JSON.parse !== "function" ||
    typeof JSON.stringify !== "function" ||
    !JSON.parse("{\"a\":\"a\"}") ||
    !JSON.stringify({"a":"a"})) {
	
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
						try{
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
								log("didn't pass the cleaner test");
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
			
			if (DEBUG) log("in "+storageType+".getItem() getting value for:"+key);
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
				log("in removeItem(), no value for key present");
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

        /**
         * ============================
         * START OF GBP OBJECT
         * TODO: DEBUG IS GLOBAL, AND SHOULD BE REMOVED
         * ============================
         */
        var DEBUG = true;
                
        if(!window.log) window.log = function(msg) { }; //dummy function when in production code
        if(DEBUG) log("Creating GBP object");
        
        /**
         * try getting GBP from localStorage. We augment the Storage class to allow
         * for using objects directly, instead of having to JSON-ify. This allows us
         * to put a tiny alternate polyfill for JSON.stringify that works with almost all browsers,
         * if JSON3 fails
         *
         * We also extend localStorage with a setObject() and getObject(), since the Storage spec only
         * allows strings as values, not objects. Objects do go in, but their name is stringified,
         * e.g., [object Object] as the value, NOT the object itself
         *
         * we have to set the object directly, instead of the prototype, since localStorage and
         * sessionStorage are created via "new" in the localstorage.js file. Adding to the Storage
         * prototype will not work.
         */
        
        
        //if there is a pre-existing GBP object, get it
        
        if(window.localStorage) {
                
                var retrievedObject = localStorage.getItem("GBP");
               
                if(retrievedObject) {
                        
                        if(DEBUG) log("using data from localStorage, should get back GBP object");
                        
                        var GBP = GBP || (function () {
                        
                        if(Object.prototype.toString.call(retrievedObject).slice(8, -1) === "String") {
                                var obj;
                                try {
                                        obj = JSON.parse(retrievedObject);
                                        
                                        this.init = true;
                                        return obj;
                                }
                                catch (e) {
                                        log("Error:"+e+" parsed JSON from localStorage to "+typeof obj+" from (\""+retrievedObject+"\")");
                                        this.init = false;    
                                        }
                                }
                        else {
                                log("Error: retrieved value from localStorage was not a string");
                                }
                                /**
                                 * if we get here, our attempt to read the object which we DID get from Storage failed,
                                 * so fall-through to the dynamic object after deleting the offending cookie or other
                                 * Storage polyfill area.
                                 */
                                if(DEBUG) log("no pre-existing Storage object, make GBP dynamically");
                                localStorage.removeItem("GBP");
                        }()); 
                }
        }

        /**
         * Otherwise, return the dynamic object. We do not use JSON or localStorage
         * to write this, so if they are not present, it is OK
         */       
	var GBP = GBP || (function () {
                
	return {
		name : "chrome",
                releasedate : "2013-06-25",
                engineversion : undefined,
                rendersincloud : false,
                searchgroup : "edge",
                unicode : undefined,
                uaregex : undefined,
                versionname : "Chrome 29",
                wap : undefined,
                memleak : undefined,
                imode : undefined,
                ancient : false,
                bot : undefined,
                future : true,
                spider : undefined,
                aria : undefined,
                aac : true,
                mp3 : true,
                oggopus : true,
                oggvorbis : true,
                wav : true,
                conditionalcomments : undefined,
                dataset : undefined,
                details : undefined,
                svgfonts : undefined,
                forms : undefined,
                gif : undefined,
                gifanimated : undefined,
                html : undefined,
                html4 : undefined,
                audiosynth : undefined,
                html5forms : undefined,
                html5formvalidation : undefined,
                semantic : undefined,
                html5 : undefined,
                iframesandbox : undefined,
                imgbase64 : undefined,
                img : undefined,
                jpeg : undefined,
                a : undefined,
                adownload : undefined,
                mathml : undefined,
                menu : undefined,
                meter : undefined,
                object : undefined,
                pngalpha : true,
                pnganimated : undefined,
                png : undefined,
                picture : undefined,
                progress : undefined,
                ruby : undefined,
                smil : undefined,
                clippaths : undefined,
                svgfilters : undefined,
                svgsmil : undefined,
                svgimg : undefined,
                template : undefined,
                vml : undefined,
                wml : undefined,
                webaudioapi : true,
                xhtml : undefined,
                xml : undefined,
                chtml : undefined,
                fontface : undefined,
                cssbase64 : undefined,
                featurequeries : undefined,
                mediaqueries : undefined,
                fontfeature : undefined,
                rgba : undefined,
                csssvg : undefined,
                ttf : undefined,
                eot : undefined,
                backgroundclip : undefined,
                backgroundorigin : undefined,
                backgroundsize : undefined,
                generatedcontent : undefined,
                hsla : undefined,
                filter : undefined,
                inlineblock : true,
                opacity : undefined,
                fixed : undefined,
                selectors2 : undefined,
                css2 : undefined,
                multibackgrounds : undefined,
                selectors3 : undefined,
                stylescoped : undefined,
                css3 : undefined,
                viewportunits : undefined,
                animation : undefined,
                borderimage : undefined,
                borderradius : undefined,
                boxflex : undefined,
                boxreflect : undefined,
                boxsizing : undefined,
                calc : undefined,
                multicolumns : undefined,
                counter : undefined,
                gradient : undefined,
                grid : undefined,
                hypenation : undefined,
                mask : undefined,
                minmax : undefined,
                objectfit : undefined,
                textellipsis : undefined,
                rem : undefined,
                repeatinggradients : undefined,
                resize : undefined,
                regions : undefined,
                textshadow : undefined,
                textstroke : undefined,
                transforms2d : undefined,
                transition : undefined,
                wordbreak : undefined,
                wordwrap : undefined,
                wrapflow : undefined,
                directxfilters : undefined,
                useclientdetect : undefined,
                useserverdetect : undefined,
                gbpversion : undefined,
                detectorfunction : undefined,
                overrideclient : undefined,
                jsonpolyfill : undefined,
                storagepolyfill : undefined,
                usecookies : undefined,
                returntoserver : undefined,
                useheaderstorage : undefined,
                useserverdb : undefined,
                useuahash : undefined,
                uselocalstorage : undefined,
                vampirelibrary : undefined,
                blobbuilder : undefined,
                bloburl : undefined,
                canvasemoji : undefined,
                dom0 : true,
                dom1 : true,
                contenteditable : undefined,
                touch : undefined,
                eventlistener : undefined,
                devicemotion : undefined,
                fileapi : undefined,
                gamepad : undefined,
                draganddrop : undefined,
                hashchangeevent : undefined,
                indexeddb : undefined,
                json : true,
                versionjavascript : undefined,
                navtiming : undefined,
                notification : undefined,
                pagevisibility : undefined,
                peerconnection : undefined,
                pointerevent : undefined,
                speechinput : undefined,
                websqldatabase : undefined,
                webworkersshared : undefined,
                canvasdataurljpeg : undefined,
                canvasdataurlwebp : undefined,
                classlist : undefined,
                filewriter : undefined,
                getcomputedstyle : undefined,
                getelementbyid : undefined,
                getelementsbyclassname : undefined,
                getusermedia : undefined,
                matchmedia : undefined,
                matchselector : undefined,
                lowbandwidth : undefined,
                queryselector : undefined,
                strict : undefined,
                testfeature : undefined,
                windowevent : undefined,
                activex : function () {
		(typeof (window.ActiveXObject !== undefined)) ? this.activex = true : this.activex = false;
	},
	
	       	enginename : function () {
		var offset;
		if(window.navigator && window.navigator.userAgent) {
			var ua = window.navigator.userAgent.toLowerCase();
			if (~ua.indexOf("webkit")) {
				this.enginename = "webkit";
			}
			else if (~ua.indexOf("presto")) {
				this.enginename = "presto";
			}
			else if (~ua.indexOf("gecko")) {
				this.enginename = "gecko";
			}
			else if (~ua.indexOf("trident")) {
				this.enginename = "trident";
			}
			else if (~ua.indexOf("opr/")) {
				this.enginename = "webkit";
			}
			else if (~ua.indexOf("opera")) {
				this.enginename = "presto";
			}
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
	
	       	spdy : function () {
		this.spdy = !!(window.chrome && window.chrome.loadTimes && window.chrome.loadTimes().wasFetchedViaSpdy);
	},
	

	       	useragent : function () {
		this.useragent = navigator.userAgent;
	},

	       	version : function () {
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
	
	       	applicationcache : function () {
		this.applicationcache = !!window.applicationCache;
	},
	
	       	canvas : function () {
		if (document.createElement) {
			var elem = document.createElement("canvas");
			(elem && elem.getContext && elem.getContext("2d")) ? this.canvas = true : this.canvas = false;
			elem = null;
		}
		else {
			this.canvas = false;
		}
	},
	
	       	opus : function () {
		var audio;
		this.opus = !!((document.createElement && (audio = document.createElement("audio")) && audio.canPlayType
			&& audio.canPlayType("audio/ogg; codecs=\"opus\"")));
	},
	
	       	audio : function () {
		var audio;
		this.audio = !!(document.createElement && (audio = document.createElement("audio")) && audio.canPlayType);
	},
	
	       	captions : function () {
		this.captions = !!(document.createElement && ("src" in document.createElement("track")));
	},
	
	       	poster : function () {
		this.poster = !!(document.createElement && ("poster" in document.createElement("video")));
	},
	
	       	video : function() {
		var video;
		this.video = !!(document.createElement && (video = document.createElement("video")) && video.canPlayType);
	},
	
	       	track : function () {
		this.track = !!(document.createElement && ("track" in document.createElement("track"))); 
	},
	
	       	srcdoc : function () {
		this.srcdoc = (document && document.createElement && ("srcdoc" in document.createElement("iframe")));
	},
	
	       	iframe : function () {
		this.iframe = !!(document && document.createElement && document.createElement("iframe"));
	},
	
	       	seamless : function () {
		if (this.bot) {
			log("js_tests.js: gotta bot in seamless() as " + this.bot);
		} else {
			log("js_tests:js:no bot in seamless()");
		}
		this.seamless = (document && document.createElement && ("seamless" in document.createElement("iframe")));
	},
	

	       	microdata : function () {
		this.microdata = !!document.getItems;
	},
	
	
	       	inlinesvg : function () {
		if(document.createElementNS) {
			var div = document.createElement("div");
			var ns  = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			div.innerHTML = "<svg/>";
			((div.firstChild && div.firstChild.namespaceURI) == ns.svg) ? this.inlinesvg = true : this.inlinesvg = false;
		}
		else {
			this.inlinesvg = false;
		}
	},
	
	       	svg : function () {
		(document.createElementNS && document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect) ? this.svg = true : this.svg = false;
	},
	
	       	svginhtml : function () {
		var svg;
		if(document && document.createElement && (svg = document.createElement("div"))) {
			svg.innerHTML = "<svg></svg>";
			this.svginhtml = !!(window.SVGSVGElement && svg.firstChild instanceof window.SVGSVGElement);
		}
		this.svginhtml = false;
	},
	
	       	scriptasync : function () {
		this.scriptasync = !!(document && document.createElement && ("async" in document.createElement("script")));
	},
	
	       	scriptdefer : function () {
		this.scriptdefer = !!(document && document.createElement && ("defer" in document.createElement("script")));		
	},
	
	       	mp4 : function () {
		var video;
		this.mp4 = !!(document.createElement && (video = document.createElement("video")) && video.canPlayType
			&& video.canPlayType("video/mp4; codecs=\"mp4v.20.8\""));
	},
	
	       	oggtheora : function () {
		var video;
		this.oggtheora = !!(document.createElement && (video = document.createElement("video")) && video.canPlayType
			&& video.canPlayType("video/ogg; codecs=\"theora\""));
	},
	
	       	webm : function () {
		var video;
		this.webm = !!(document.createElement && (video = document.createElement("video")) && video.canPlayType
			&& video.canPlayType("video/webm; codecs=\"vp8, vorbis\""));
	},	
	
	
	       	webp : function () {
		
		var video;
		this.webp = !!(document.createElement && (video = document.createElement("video")) && video.canPlayType
			&& video.canPlayType("video/webm; codecs=\"vp8\""));
	},
	
	
	       	css : function () {
		if (document && document.documentElement && document.documentElement.style) {
			this.css = true;
		}
		else {
			this.css = false;
		}
	},
	
	       	boxshadow : function () {
		this.cssbase("boxshadow", "box-shadow", "1px 1px");
	},
	
	
	       	base64 : function () {
		this.base64 = ("btoa" in window && "atob" in window);
	},
	
	       	cors : function () {
		this.cors = !!(window.XMLHttpRequest && ("withCredentials" in new XMLHttpRequest)); 
	},
	
	       	cookie : function () {
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
	
	       	dom2 : function () {
		this.dom2 = !!(document.implementation && document.implementation.hasFeature("Events", "2.0") &&
			       document.addEventListener);
	},

	       	dom3 : function () {
		this.dom3 = !!(document.evaluate && document.documentElement.getUserData &&
				typeof document.documentElement.textContent);
	},
	
	       	orientationevent : function () {
		this.orientationevent = !!window.DeviceOrientationEvent;
	},
	
	       	eventsource : function () {
		this.eventsource = !!("EventSource" in window);
	},
	
	       	fullscreen : function () {
		this.fullscreen = !!(document.documentElement && document.documentElement.requestFullscreen && document.exitFullscreen);
	},
	
	       	history : function () {
		this.history = !!(window.history && history.pushState);
	},

	       	javascript : function () {
		this.javascript = true;
	},
	
	       	pointerlock : function () {
		this.pointerlock = !!document.pointerLockElement;	
	},
	
	       	requestanimationframe : function () {
		this.requestanimationframe = !!window.requestAnimationFrame;
	},
	
	       	localstorage : function () {
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
	
	       	sessionstorage : function () {
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

	       	vibrate : function () {
		this.vibrate = !!window.navigator.vibrate;
	},
	
	       	webgl : function () {
		if (document.createElement) {
			var elem = document.createElement("canvas");
			(elem && elem.getContext && window.WebGLRenderingContext) ? this.webgl = true : this.webgl = false;
			elem = null;
		}
		else {
			this.webgl = false;
		}
	},
	
	       	websockets : function () {
		this.websockets = !!window.WebSocket;
	},
	
	       	webworkers : function () {
		this.webworkers = !!window.Worker;
	},
	
	       	xhr : function () {
		this.xhr = !!window.XMLHttpRequest;
	},
	
	       	xhr2 : function () {
		this.xhr2 = !!(window.XMLHttpRequest && ("upload" in new XMLHttpRequest())); 
	},
	
	       	canvastext : function () {
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
	
	       	geolocation : function () {
		this.geolocation = ("geolocation" in navigator);
	},
	
	       	battery : function () {
		this.battery = !!(navigator.battery && navigator.battery.level);
	},
	
	       	postmessage : function () {
		this.postmessage = !!window.postMessage;
	},
	
	       	acrobat : function () {
		this.pluginsbase("acrobat", "Adobe Acrobat", "application/pdf", ["AcroPDF.PDF"]);
	},
	
	       	quicktime : function () {
		this.pluginsbase("quicktime", "QuickTime", "video/quicktime", ["QuickTime.QuickTime"]);	
	},

	       	flash : function () {
		this.pluginsbase("flash", "Shockwave Flash", "application/x-shockwave-flash", ["ShockwaveFlash.ShockwaveFlash.7"]);
	},
	

	       	director : function () {
		this.pluginsbase("director", "Shockwave Director", "application/x-director", ["SWCtl.SWCtl.1"]);
	},
	

	       	silverlight : function () {
		this.pluginsbase("silverlight","Silverlight Plug-In", "application/x-silverlight-2","AgControl.AgControl");
	},
	
	       	java : function () {
		this.java = navigator.javaEnabled();
	},
	
	
	       	realplayer : function () {
		this.pluginsbase("realplayer", "RealPlayer", "audio/x-pn-realaudio-plugin", ["rmocx.RealPlayer G2 Control.1"]);
	},
	
	       	windowsmedia : function () {
		this.pluginsbase("windowsmedia", "Windows Media Player", "application/x-mplayer2", ["MediaPlayer.MediaPlayer.1"]);
	},
	
	       	datauri : function () {
		var gif = new Image(),
		that = this;
		try {
			var ua = window.navigator.userAgent.toLowerCase();
			if (ua.indexOf("hotjava") == -1) {
				gif.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";
				gif.onload = gif.onerror = gif.onabort = function () {
				(gif.height == 1 && gif.width == 1) ? that.datauri = true : that.datauri = false;
				}
			}
			else {
				that.datauri = false;
			}
		} catch (e) {
			that.datauri = false;
		}
	},
	
	       	cssbase : function (css, cssProp, cssVal) {
		
		
		if (css && cssProp) {
			
			if(document && document.documentElement && document.documentElement.style) {
				var CSSPrefix = ["Webkit","Moz","O","Ms","Khtml"],
				result = false,
				val = false,
				style = document.documentElement.style;
				
				
				if (typeof style[cssProp] == "string") {
					val = true;
				}
				else {
					
					propName = cssProp.charAt(0).toUpperCase() + cssProp.slice(1);
					for (var i = 0; i < CSSPrefix.length; i++) {
						var prop = CSSPrefix[i] + propName;
						
						if (typeof style[prop] == "string") {
							val = true; 
							break;
						}
					}
				}
			}
			
			this[css] = val;
		}
		
	},
	
	       	pluginsbase : function (plugin, pluginName, mimeType, activeXName) {
		
		
		if (plugin) {			
			var nav = navigator,
			p, pArr, i, len;
			
			if (nav && nav.plugins !== undefined && nav.plugins.length && typeof nav.mimeTypes !== undefined) {
				this[plugin] = false; 
				pArr = nav.plugins,
				len = pArr.length;
				for (i = 0; i < len; i++) {
					p = pArr[i];
					if (~p.name.indexOf(pluginName)) {
						
						
						if (p.description && nav.mimeTypes[mimeType] !== undefined && nav.mimeTypes[mimeType].enabledPlugin) {
							window.enabled = nav.mimeTypes[mimeType].enabledPlugin;
							var regex = new RegExp(/([a-zA-Z -]|\s)+/);
							this[plugin] = parseFloat(p.description.replace(/([a-zA-Z -]|\s)+/, ""));
							if (isNaN(this[plugin])) {
								this[plugin] = parseFloat(p.name.replace(/([a-zA-Z -]|\s)+/, ""));
								if (isNaN(this[plugin])) {
									log("name:"+p.name);
									log("description:"+p.description);
									this[plugin] = true; 
									break;
								}
							}
						}
					}
				}
			}
			
			else {
				if (window.ActiveXObject) {
					
					var vers = false, versObj = null, trueVers; 
					
					switch (plugin) {
					case "silverlight":
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
							log("detect failed");
							vers = false;
						}
						break;
					case "flash":
						try {
							var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
							log("found flash");
							vers = true;
							trueVers = axo.GetVariable("$version").split(" ")[1].split(",");
							trueVers = trueVers[0] + "." + trueVers[1];
							vers = trueVers;
						} catch(e) {
							try {
								axo = null;
								log("trying flash 6"); 
								axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
								axo.AllowScriptAccess = "always"; 
								vers = 6.0;
							} catch(e) {
								vers = false; 
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
						}
						break;
					case "quicktime":
						try {
							var axo = new ActiveXOBject("QuickTime.QuickTime");
							vers = true;
							var versObj = new ActiveXObject("QuickTimeCheckObject.QuickTimeCheck");
							trueVers = versObj.QuickTimeVersion.toString(16); 
							trueVers = trueVers.substring(0, 1) + "." + trueVers.substring(1, 3);
							trueVers = parseFloat(trueVers);
							vers = trueVers;
						} catch(e) {
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
							}
						break;
					default:
						try {
							var axo = new ActiveXObject(activeXName);
							vers = true;
						} catch (e) {
						}
						break;
					}
					axo = null;
					this[plugin] = vers;
				}
				
			}
			
		}
		
	},	
	

	       	
                        
        //run GBP, chaining pattern
                
		init: function () {
                
			this.timeClient = new Date().getMilliseconds();
			if(typeof this.activex === "function") {
						this.activex();
					};
				if(typeof this.name === "function") {
						this.name();
					};
				if(typeof this.releasedate === "function") {
						this.releasedate();
					};
				if(typeof this.engineversion === "function") {
						this.engineversion();
					};
				if(typeof this.enginename === "function") {
						this.enginename();
					};
				if(typeof this.spdy === "function") {
						this.spdy();
					};
				if(typeof this.searchgroup === "function") {
						this.searchgroup();
					};
				if(typeof this.unicode === "function") {
						this.unicode();
					};
				if(typeof this.useragent === "function") {
						this.useragent();
					};
				if(typeof this.uaregex === "function") {
						this.uaregex();
					};
				if(typeof this.version === "function") {
						this.version();
					};
				if(typeof this.versionname === "function") {
						this.versionname();
					};
				if(typeof this.wap === "function") {
						this.wap();
					};
				if(typeof this.memleak === "function") {
						this.memleak();
					};
				if(typeof this.imode === "function") {
						this.imode();
					};
				if(typeof this.bot === "function") {
						this.bot();
					};
				if(typeof this.spider === "function") {
						this.spider();
					};
				if(typeof this.aria === "function") {
						this.aria();
					};
				if(typeof this.applicationcache === "function") {
						this.applicationcache();
					};
				if(typeof this.canvas === "function") {
						this.canvas();
					};
				if(typeof this.conditionalcomments === "function") {
						this.conditionalcomments();
					};
				if(typeof this.datauri === "function") {
						this.datauri();
					};
				if(typeof this.dataset === "function") {
						this.dataset();
					};
				if(typeof this.details === "function") {
						this.details();
					};
				if(typeof this.svgfonts === "function") {
						this.svgfonts();
					};
				if(typeof this.forms === "function") {
						this.forms();
					};
				if(typeof this.gif === "function") {
						this.gif();
					};
				if(typeof this.gifanimated === "function") {
						this.gifanimated();
					};
				if(typeof this.html === "function") {
						this.html();
					};
				if(typeof this.html4 === "function") {
						this.html4();
					};
				if(typeof this.opus === "function") {
						this.opus();
					};
				if(typeof this.audio === "function") {
						this.audio();
					};
				if(typeof this.audiosynth === "function") {
						this.audiosynth();
					};
				if(typeof this.html5forms === "function") {
						this.html5forms();
					};
				if(typeof this.html5formvalidation === "function") {
						this.html5formvalidation();
					};
				if(typeof this.semantic === "function") {
						this.semantic();
					};
				if(typeof this.html5 === "function") {
						this.html5();
					};
				if(typeof this.captions === "function") {
						this.captions();
					};
				if(typeof this.poster === "function") {
						this.poster();
					};
				if(typeof this.video === "function") {
						this.video();
					};
				if(typeof this.track === "function") {
						this.track();
					};
				if(typeof this.iframesandbox === "function") {
						this.iframesandbox();
					};
				if(typeof this.srcdoc === "function") {
						this.srcdoc();
					};
				if(typeof this.iframe === "function") {
						this.iframe();
					};
				if(typeof this.seamless === "function") {
						this.seamless();
					};
				if(typeof this.imgbase64 === "function") {
						this.imgbase64();
					};
				if(typeof this.img === "function") {
						this.img();
					};
				if(typeof this.jpeg === "function") {
						this.jpeg();
					};
				if(typeof this.a === "function") {
						this.a();
					};
				if(typeof this.adownload === "function") {
						this.adownload();
					};
				if(typeof this.mathml === "function") {
						this.mathml();
					};
				if(typeof this.menu === "function") {
						this.menu();
					};
				if(typeof this.meter === "function") {
						this.meter();
					};
				if(typeof this.microdata === "function") {
						this.microdata();
					};
				if(typeof this.object === "function") {
						this.object();
					};
				if(typeof this.pnganimated === "function") {
						this.pnganimated();
					};
				if(typeof this.png === "function") {
						this.png();
					};
				if(typeof this.picture === "function") {
						this.picture();
					};
				if(typeof this.progress === "function") {
						this.progress();
					};
				if(typeof this.ruby === "function") {
						this.ruby();
					};
				if(typeof this.smil === "function") {
						this.smil();
					};
				if(typeof this.clippaths === "function") {
						this.clippaths();
					};
				if(typeof this.svgfilters === "function") {
						this.svgfilters();
					};
				if(typeof this.inlinesvg === "function") {
						this.inlinesvg();
					};
				if(typeof this.svg === "function") {
						this.svg();
					};
				if(typeof this.svginhtml === "function") {
						this.svginhtml();
					};
				if(typeof this.svgsmil === "function") {
						this.svgsmil();
					};
				if(typeof this.svgimg === "function") {
						this.svgimg();
					};
				if(typeof this.scriptasync === "function") {
						this.scriptasync();
					};
				if(typeof this.scriptdefer === "function") {
						this.scriptdefer();
					};
				if(typeof this.template === "function") {
						this.template();
					};
				if(typeof this.vml === "function") {
						this.vml();
					};
				if(typeof this.mp4 === "function") {
						this.mp4();
					};
				if(typeof this.oggtheora === "function") {
						this.oggtheora();
					};
				if(typeof this.webm === "function") {
						this.webm();
					};
				if(typeof this.webp === "function") {
						this.webp();
					};
				if(typeof this.wml === "function") {
						this.wml();
					};
				if(typeof this.xhtml === "function") {
						this.xhtml();
					};
				if(typeof this.xml === "function") {
						this.xml();
					};
				if(typeof this.chtml === "function") {
						this.chtml();
					};
				if(typeof this.fontface === "function") {
						this.fontface();
					};
				if(typeof this.cssbase64 === "function") {
						this.cssbase64();
					};
				if(typeof this.featurequeries === "function") {
						this.featurequeries();
					};
				if(typeof this.mediaqueries === "function") {
						this.mediaqueries();
					};
				if(typeof this.fontfeature === "function") {
						this.fontfeature();
					};
				if(typeof this.rgba === "function") {
						this.rgba();
					};
				if(typeof this.csssvg === "function") {
						this.csssvg();
					};
				if(typeof this.css === "function") {
						this.css();
					};
				if(typeof this.ttf === "function") {
						this.ttf();
					};
				if(typeof this.eot === "function") {
						this.eot();
					};
				if(typeof this.backgroundclip === "function") {
						this.backgroundclip();
					};
				if(typeof this.backgroundorigin === "function") {
						this.backgroundorigin();
					};
				if(typeof this.backgroundsize === "function") {
						this.backgroundsize();
					};
				if(typeof this.generatedcontent === "function") {
						this.generatedcontent();
					};
				if(typeof this.hsla === "function") {
						this.hsla();
					};
				if(typeof this.filter === "function") {
						this.filter();
					};
				if(typeof this.opacity === "function") {
						this.opacity();
					};
				if(typeof this.fixed === "function") {
						this.fixed();
					};
				if(typeof this.selectors2 === "function") {
						this.selectors2();
					};
				if(typeof this.css2 === "function") {
						this.css2();
					};
				if(typeof this.multibackgrounds === "function") {
						this.multibackgrounds();
					};
				if(typeof this.selectors3 === "function") {
						this.selectors3();
					};
				if(typeof this.stylescoped === "function") {
						this.stylescoped();
					};
				if(typeof this.css3 === "function") {
						this.css3();
					};
				if(typeof this.viewportunits === "function") {
						this.viewportunits();
					};
				if(typeof this.animation === "function") {
						this.animation();
					};
				if(typeof this.borderimage === "function") {
						this.borderimage();
					};
				if(typeof this.borderradius === "function") {
						this.borderradius();
					};
				if(typeof this.boxflex === "function") {
						this.boxflex();
					};
				if(typeof this.boxreflect === "function") {
						this.boxreflect();
					};
				if(typeof this.boxshadow === "function") {
						this.boxshadow();
					};
				if(typeof this.boxsizing === "function") {
						this.boxsizing();
					};
				if(typeof this.calc === "function") {
						this.calc();
					};
				if(typeof this.multicolumns === "function") {
						this.multicolumns();
					};
				if(typeof this.counter === "function") {
						this.counter();
					};
				if(typeof this.gradient === "function") {
						this.gradient();
					};
				if(typeof this.grid === "function") {
						this.grid();
					};
				if(typeof this.hypenation === "function") {
						this.hypenation();
					};
				if(typeof this.mask === "function") {
						this.mask();
					};
				if(typeof this.minmax === "function") {
						this.minmax();
					};
				if(typeof this.objectfit === "function") {
						this.objectfit();
					};
				if(typeof this.textellipsis === "function") {
						this.textellipsis();
					};
				if(typeof this.rem === "function") {
						this.rem();
					};
				if(typeof this.repeatinggradients === "function") {
						this.repeatinggradients();
					};
				if(typeof this.resize === "function") {
						this.resize();
					};
				if(typeof this.regions === "function") {
						this.regions();
					};
				if(typeof this.textshadow === "function") {
						this.textshadow();
					};
				if(typeof this.textstroke === "function") {
						this.textstroke();
					};
				if(typeof this.transforms2d === "function") {
						this.transforms2d();
					};
				if(typeof this.transition === "function") {
						this.transition();
					};
				if(typeof this.wordbreak === "function") {
						this.wordbreak();
					};
				if(typeof this.wordwrap === "function") {
						this.wordwrap();
					};
				if(typeof this.wrapflow === "function") {
						this.wrapflow();
					};
				if(typeof this.directxfilters === "function") {
						this.directxfilters();
					};
				if(typeof this.useclientdetect === "function") {
						this.useclientdetect();
					};
				if(typeof this.useserverdetect === "function") {
						this.useserverdetect();
					};
				if(typeof this.gbpversion === "function") {
						this.gbpversion();
					};
				if(typeof this.detectorfunction === "function") {
						this.detectorfunction();
					};
				if(typeof this.overrideclient === "function") {
						this.overrideclient();
					};
				if(typeof this.jsonpolyfill === "function") {
						this.jsonpolyfill();
					};
				if(typeof this.storagepolyfill === "function") {
						this.storagepolyfill();
					};
				if(typeof this.usecookies === "function") {
						this.usecookies();
					};
				if(typeof this.returntoserver === "function") {
						this.returntoserver();
					};
				if(typeof this.useheaderstorage === "function") {
						this.useheaderstorage();
					};
				if(typeof this.useserverdb === "function") {
						this.useserverdb();
					};
				if(typeof this.useuahash === "function") {
						this.useuahash();
					};
				if(typeof this.uselocalstorage === "function") {
						this.uselocalstorage();
					};
				if(typeof this.vampirelibrary === "function") {
						this.vampirelibrary();
					};
				if(typeof this.blobbuilder === "function") {
						this.blobbuilder();
					};
				if(typeof this.bloburl === "function") {
						this.bloburl();
					};
				if(typeof this.base64 === "function") {
						this.base64();
					};
				if(typeof this.cors === "function") {
						this.cors();
					};
				if(typeof this.canvasemoji === "function") {
						this.canvasemoji();
					};
				if(typeof this.cookie === "function") {
						this.cookie();
					};
				if(typeof this.dom2 === "function") {
						this.dom2();
					};
				if(typeof this.dom3 === "function") {
						this.dom3();
					};
				if(typeof this.contenteditable === "function") {
						this.contenteditable();
					};
				if(typeof this.orientationevent === "function") {
						this.orientationevent();
					};
				if(typeof this.touch === "function") {
						this.touch();
					};
				if(typeof this.eventlistener === "function") {
						this.eventlistener();
					};
				if(typeof this.devicemotion === "function") {
						this.devicemotion();
					};
				if(typeof this.eventsource === "function") {
						this.eventsource();
					};
				if(typeof this.fileapi === "function") {
						this.fileapi();
					};
				if(typeof this.fullscreen === "function") {
						this.fullscreen();
					};
				if(typeof this.gamepad === "function") {
						this.gamepad();
					};
				if(typeof this.draganddrop === "function") {
						this.draganddrop();
					};
				if(typeof this.hashchangeevent === "function") {
						this.hashchangeevent();
					};
				if(typeof this.history === "function") {
						this.history();
					};
				if(typeof this.indexeddb === "function") {
						this.indexeddb();
					};
				if(typeof this.javascript === "function") {
						this.javascript();
					};
				if(typeof this.versionjavascript === "function") {
						this.versionjavascript();
					};
				if(typeof this.navtiming === "function") {
						this.navtiming();
					};
				if(typeof this.notification === "function") {
						this.notification();
					};
				if(typeof this.pagevisibility === "function") {
						this.pagevisibility();
					};
				if(typeof this.peerconnection === "function") {
						this.peerconnection();
					};
				if(typeof this.pointerevent === "function") {
						this.pointerevent();
					};
				if(typeof this.pointerlock === "function") {
						this.pointerlock();
					};
				if(typeof this.requestanimationframe === "function") {
						this.requestanimationframe();
					};
				if(typeof this.speechinput === "function") {
						this.speechinput();
					};
				if(typeof this.localstorage === "function") {
						this.localstorage();
					};
				if(typeof this.sessionstorage === "function") {
						this.sessionstorage();
					};
				if(typeof this.vibrate === "function") {
						this.vibrate();
					};
				if(typeof this.webgl === "function") {
						this.webgl();
					};
				if(typeof this.websqldatabase === "function") {
						this.websqldatabase();
					};
				if(typeof this.websockets === "function") {
						this.websockets();
					};
				if(typeof this.webworkersshared === "function") {
						this.webworkersshared();
					};
				if(typeof this.webworkers === "function") {
						this.webworkers();
					};
				if(typeof this.xhr === "function") {
						this.xhr();
					};
				if(typeof this.xhr2 === "function") {
						this.xhr2();
					};
				if(typeof this.canvastext === "function") {
						this.canvastext();
					};
				if(typeof this.canvasdataurljpeg === "function") {
						this.canvasdataurljpeg();
					};
				if(typeof this.canvasdataurlwebp === "function") {
						this.canvasdataurlwebp();
					};
				if(typeof this.classlist === "function") {
						this.classlist();
					};
				if(typeof this.filewriter === "function") {
						this.filewriter();
					};
				if(typeof this.geolocation === "function") {
						this.geolocation();
					};
				if(typeof this.getcomputedstyle === "function") {
						this.getcomputedstyle();
					};
				if(typeof this.getelementbyid === "function") {
						this.getelementbyid();
					};
				if(typeof this.getelementsbyclassname === "function") {
						this.getelementsbyclassname();
					};
				if(typeof this.getusermedia === "function") {
						this.getusermedia();
					};
				if(typeof this.matchmedia === "function") {
						this.matchmedia();
					};
				if(typeof this.matchselector === "function") {
						this.matchselector();
					};
				if(typeof this.battery === "function") {
						this.battery();
					};
				if(typeof this.lowbandwidth === "function") {
						this.lowbandwidth();
					};
				if(typeof this.postmessage === "function") {
						this.postmessage();
					};
				if(typeof this.queryselector === "function") {
						this.queryselector();
					};
				if(typeof this.strict === "function") {
						this.strict();
					};
				if(typeof this.testfeature === "function") {
						this.testfeature();
					};
				if(typeof this.windowevent === "function") {
						this.windowevent();
					};
				if(typeof this.acrobat === "function") {
						this.acrobat();
					};
				if(typeof this.quicktime === "function") {
						this.quicktime();
					};
				if(typeof this.flash === "function") {
						this.flash();
					};
				if(typeof this.director === "function") {
						this.director();
					};
				if(typeof this.silverlight === "function") {
						this.silverlight();
					};
				if(typeof this.java === "function") {
						this.java();
					};
				if(typeof this.realplayer === "function") {
						this.realplayer();
					};
				if(typeof this.windowsmedia === "function") {
						this.windowsmedia();
					};
				if(typeof this.cssbase === "function") {
						this.cssbase();
					};
				if(typeof this.pluginsbase === "function") {
						this.pluginsbase();
					};
				if(String(JSON.parse).indexOf("native") < 0)
                        {
                                this.jsonpolyfill = true;
                        }
                        else {
                                this.jsonpolyfill = false;
                        }
                        if(String(localStorage.getItem).indexOf("native") < 0)
                        {
                                this.storagepolyfill = true;
                        }
                        else {
                                this.storagepolyfill = false;
                        }
                        this.useuahash = "aa9713d2285971ca3a30e91e8a72a94164f9479c";
                
                this.timeServer = 98;
		
                this.timeClient = (parseInt(new Date().getMilliseconds()) - parseInt(this.timeClient));
                        
			//save our current state
                        
			if(window.localStorage && window.JSON) {
                                if(DEBUG) log("about to write dynamically-created GBP to local storage");
                                localStorage.setItem("GBP", JSON.stringify(this));  
                        }
                        
                        //TODO: need to confirm that localStorage worked....
                        
                        this.init = true; //self-destruct for this function, but will not happen until we return
			return this;
			}
	
		} //end of returned object
			
	}()).init();
	
	var GBPDebug = GBPDebug || (function () {
                
                        var fromLocalStorage,storageLength;
                        
                        if(retrievedObject) {
                                fromLocalStorage = true;
                                storageLength = localStorage.length;
                        }
                        else {
                                fromLocalStorage = false;
                                storageLength = -1;
                        };
                var cookieKey = "GBPLocStor";
                var cookieComKey = "GBPComStor";
                var gbpObj = "{}";
                var serverSideFns = ["name","releasedate","engineversion","rendersincloud","searchgroup","unicode","uaregex","versionname","wap","memleak","imode","ancient","bot","future","spider","aria","aac","mp3","oggopus","oggvorbis","wav","conditionalcomments","dataset","details","svgfonts","forms","gif","gifanimated","html","html4","audiosynth","html5forms","html5formvalidation","semantic","html5","iframesandbox","imgbase64","img","jpeg","a","adownload","mathml","menu","meter","object","pngalpha","pnganimated","png","picture","progress","ruby","smil","clippaths","svgfilters","svgsmil","svgimg","template","vml","wml","webaudioapi","xhtml","xml","chtml","fontface","cssbase64","featurequeries","mediaqueries","fontfeature","rgba","csssvg","ttf","eot","backgroundclip","backgroundorigin","backgroundsize","generatedcontent","hsla","filter","inlineblock","opacity","fixed","selectors2","css2","multibackgrounds","selectors3","stylescoped","css3","viewportunits","animation","borderimage","borderradius","boxflex","boxreflect","boxsizing","calc","multicolumns","counter","gradient","grid","hypenation","mask","minmax","objectfit","textellipsis","rem","repeatinggradients","resize","regions","textshadow","textstroke","transforms2d","transition","wordbreak","wordwrap","wrapflow","directxfilters","useclientdetect","useserverdetect","gbpversion","detectorfunction","overrideclient","jsonpolyfill","storagepolyfill","usecookies","returntoserver","useheaderstorage","useserverdb","useuahash","uselocalstorage","vampirelibrary","blobbuilder","bloburl","canvasemoji","dom0","dom1","contenteditable","touch","eventlistener","devicemotion","fileapi","gamepad","draganddrop","hashchangeevent","indexeddb","json","versionjavascript","navtiming","notification","pagevisibility","peerconnection","pointerevent","speechinput","websqldatabase","webworkersshared","canvasdataurljpeg","canvasdataurlwebp","classlist","filewriter","getcomputedstyle","getelementbyid","getelementsbyclassname","getusermedia","matchmedia","matchselector","lowbandwidth","queryselector","strict","testfeature","windowevent"];
                var parentFns = {bot : "2"};
                var helperFns = {cssbase : "1", pluginsbase : "7", };
                var lagFns = {datauri : "1"};
                        
                var initSize=232;
                        var initArr = ["activex","name","releasedate","engineversion","enginename","rendersincloud","spdy","searchgroup","unicode","useragent","uaregex","version","versionname","wap","memleak","imode","ancient","bot","future","spider","aria","applicationcache","aac","mp3","oggopus","oggvorbis","wav","canvas","conditionalcomments","datauri","dataset","details","svgfonts","forms","gif","gifanimated","html","html4","opus","audio","audiosynth","html5forms","html5formvalidation","semantic","html5","captions","poster","video","track","iframesandbox","srcdoc","iframe","seamless","imgbase64","img","jpeg","a","adownload","mathml","menu","meter","microdata","object","pngalpha","pnganimated","png","picture","progress","ruby","smil","clippaths","svgfilters","inlinesvg","svg","svginhtml","svgsmil","svgimg","scriptasync","scriptdefer","template","vml","mp4","oggtheora","webm","webp","wml","webaudioapi","xhtml","xml","chtml","fontface","cssbase64","featurequeries","mediaqueries","fontfeature","rgba","csssvg","css","ttf","eot","backgroundclip","backgroundorigin","backgroundsize","generatedcontent","hsla","filter","inlineblock","opacity","fixed","selectors2","css2","multibackgrounds","selectors3","stylescoped","css3","viewportunits","animation","borderimage","borderradius","boxflex","boxreflect","boxshadow","boxsizing","calc","multicolumns","counter","gradient","grid","hypenation","mask","minmax","objectfit","textellipsis","rem","repeatinggradients","resize","regions","textshadow","textstroke","transforms2d","transition","wordbreak","wordwrap","wrapflow","directxfilters","useclientdetect","useserverdetect","gbpversion","detectorfunction","overrideclient","jsonpolyfill","storagepolyfill","usecookies","returntoserver","useheaderstorage","useserverdb","useuahash","uselocalstorage","vampirelibrary","blobbuilder","bloburl","base64","cors","canvasemoji","cookie","dom0","dom1","dom2","dom3","contenteditable","orientationevent","touch","eventlistener","devicemotion","eventsource","fileapi","fullscreen","gamepad","draganddrop","hashchangeevent","history","indexeddb","json","javascript","versionjavascript","navtiming","notification","pagevisibility","peerconnection","pointerevent","pointerlock","requestanimationframe","speechinput","localstorage","sessionstorage","vibrate","webgl","websqldatabase","websockets","webworkersshared","webworkers","xhr","xhr2","canvastext","canvasdataurljpeg","canvasdataurlwebp","classlist","filewriter","geolocation","getcomputedstyle","getelementbyid","getelementsbyclassname","getusermedia","matchmedia","matchselector","battery","lowbandwidth","postmessage","queryselector","strict","testfeature","windowevent","acrobat","quicktime","flash","director","silverlight","java","realplayer","windowsmedia","cssbase","pluginsbase"];
                var finalSize=232;
                        var finalArr = ["name","releasedate","engineversion","rendersincloud","searchgroup","unicode","uaregex","versionname","wap","memleak","imode","ancient","bot","future","spider","aria","aac","mp3","oggopus","oggvorbis","wav","conditionalcomments","dataset","details","svgfonts","forms","gif","gifanimated","html","html4","audiosynth","html5forms","html5formvalidation","semantic","html5","iframesandbox","imgbase64","img","jpeg","a","adownload","mathml","menu","meter","object","pngalpha","pnganimated","png","picture","progress","ruby","smil","clippaths","svgfilters","svgsmil","svgimg","template","vml","wml","webaudioapi","xhtml","xml","chtml","fontface","cssbase64","featurequeries","mediaqueries","fontfeature","rgba","csssvg","ttf","eot","backgroundclip","backgroundorigin","backgroundsize","generatedcontent","hsla","filter","inlineblock","opacity","fixed","selectors2","css2","multibackgrounds","selectors3","stylescoped","css3","viewportunits","animation","borderimage","borderradius","boxflex","boxreflect","boxsizing","calc","multicolumns","counter","gradient","grid","hypenation","mask","minmax","objectfit","textellipsis","rem","repeatinggradients","resize","regions","textshadow","textstroke","transforms2d","transition","wordbreak","wordwrap","wrapflow","directxfilters","useclientdetect","useserverdetect","gbpversion","detectorfunction","overrideclient","jsonpolyfill","storagepolyfill","usecookies","returntoserver","useheaderstorage","useserverdb","useuahash","uselocalstorage","vampirelibrary","blobbuilder","bloburl","canvasemoji","dom0","dom1","contenteditable","touch","eventlistener","devicemotion","fileapi","gamepad","draganddrop","hashchangeevent","indexeddb","json","versionjavascript","navtiming","notification","pagevisibility","peerconnection","pointerevent","speechinput","websqldatabase","webworkersshared","canvasdataurljpeg","canvasdataurlwebp","classlist","filewriter","getcomputedstyle","getelementbyid","getelementsbyclassname","getusermedia","matchmedia","matchselector","lowbandwidth","queryselector","strict","testfeature","windowevent","activex","enginename","spdy","useragent","version","applicationcache","canvas","opus","audio","captions","poster","video","track","srcdoc","iframe","seamless","microdata","inlinesvg","svg","svginhtml","scriptasync","scriptdefer","mp4","oggtheora","webm","webp","css","boxshadow","base64","cors","cookie","dom2","dom3","orientationevent","eventsource","fullscreen","history","javascript","pointerlock","requestanimationframe","localstorage","sessionstorage","vibrate","webgl","websockets","webworkers","xhr","xhr2","canvastext","geolocation","battery","postmessage","acrobat","quicktime","flash","director","silverlight","java","realplayer","windowsmedia","datauri","cssbase","pluginsbase"];
                return {
                                initArr:initArr,
                                finalArr:finalArr,
                                fromLocalStorage:fromLocalStorage,
                                storageLength:storageLength,
                                serverSideFns:serverSideFns,
                                parentFns:parentFns,
                                helperFns:helperFns,
                                lagFns:lagFns,
                                gbpObj:gbpObj
                        }
                })();
        //--><!]]>
        </script>            
	<!--our custom debug script for GBP -->
        
	<script type="text/javascript">
	<!--//--><![CDATA[//><!--
                function reloadGBP(args) {
			//TODO: fire a request, and compute when
			//we actually come back by looking at GBP.timeClient
			//TODO: we need to store the orignal date here, then
			//check after reload is complete to get latency
			//TODO: this is one of the GBP properties that
			//TODO: we can only compute here
			localStorage.clear();
			if (GBPDebug) {
				var dt = new Date();
				var timeNetwork = dt.getTime(); //milliseconds since jan 1, 1970
				log("timeNetwork:"+timeNetwork);
				localStorage.setItem("timeNetwork", timeNetwork);
			}
				
			location.reload();
		}
		//--><!]]>
	</script>
