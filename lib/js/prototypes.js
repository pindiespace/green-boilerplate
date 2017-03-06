/**
 * JavaScript Polyfills (augment basic language features)
 */

/**
 * patching Array.Prototype.indexOf() for older browsers
 * augmenting prototype seems ok for a diagnostic-only script
 */
if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(needle) {
		for(var i = 0; i < this.length; i++) {
			if(this[i] === needle) {
				return i;
			}
		}
	return -1;
	};
}
	

/**
 * a sop for incredibly old DOM0 browsers that don't
 * support this method
 */
			
if (!Object.prototype.hasOwnProperty) {
	Object.prototype.hasOwnProperty = function (prop) {
		if (prop !== "hasOwnProperty" && prop !== "eval" && prop !== "toString" &&
		    prop !== "isPrototypeOf") {
			return true;
		}
		return false;
	}
}


/**
 * return the property names as keys
 */
if (!Object.keys) {
	Object.keys = function (obj) {
                var unenumerableKeys = "constructor,hasOwnProperty,isPrototypeOf,toLocaleString,toString,valueOf".split(",");
                 var hasOwnProperty = Object.prototype.hasOwnProperty;
                                        
                //TODO: do this check (will require looking at array)
                                        
		var keys = [], k;
		for (k in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, k)) {
				keys.push(k);
				}
			}
		return keys;
	};
}


/**
 * polyfill for getElementsByClassName
 */
document.getElementsByClassName = document.getElementsByClassName || (function (match, tag) {  

	var result = [],
	elements = document.getElementsByTagName(tag || '*'),
	i, elem;
	match = " " + match + " ";
	for (i = 0; i < elements.length; i++) {
		elem = elements[i];
		if ((" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1) {
			result.push(elem);
		}
	}
	return result;
});


/**
 * @method Array.prototype.indexOf
 * polyfill for older browsers lacking indexOf()
 * From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
 * @param searchElement item to look for in array
 */
Array.prototype.indexOf = Array.prototype.indexOf || (function (searchElement /*, fromIndex */) {
		"use strict";
		
		if (this === void 0 || this === null) {
			throw new TypeError();
		}
		
		var t = Object(this);
		var len = t.length >>> 0;
		if (len === 0) {
			return -1;
		}
		
		var n = 0;
		if (arguments.length > 0) {
			n = Number(arguments[1]);
			if (isNaN(n)) {
				n = 0;
			} else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		
		if (n >= len) { return -1; }
		
		var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
		
		for (; k < len; k++) {
			if (k in t && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
});


/**
 * add a replacement for 'typeof' to global space
 * http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
 * Object.toType(window); //"global" (all browsers)
 * Object.toType([1,2,3]); //"array" (all browsers)
 * Object.toType(/a-z/); //"regexp" (all browsers)
 * Object.toType(JSON); //"json" (all browsers)
 */
Object.toType = (function toType(global) {
	return function(obj) {
		if (obj === global) {
			return "global";
		}
	return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
  }
})(this);
