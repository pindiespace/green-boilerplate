/** 
 * dev.js
 * JS utilities for dev tools
 */


var GBPDev = (function () {

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


	/**
	 * @method getElement
	 * get an element, allowing id string to be passed, or the element itself
	 * simplifies DOM access.
	 * NOTE: requires that Object.toType() be defined!
	 * @param {id String|Object} elem the parameter to have its type tests
	 * @returnm {Object|false} a DOMElement, or 'false' if not found
	 */
	function getElement(elem) {
		
		if (Object.toType(elem) === "string") {
			return document.getElementById(elem);
		}
		else if(Object.toType(elem) === "number") {
			console.log("ERROR: getElement() passed a number as an DOMElement"+elem);
		}
		else {
			if(elem && 'nodeType' in elem) { //test if a DOM object
				return elem;	
			}
			else {
				console.log("ERROR: getElement() unknown element:"+elem);
			}
			
		}
		return false;
	}
	
	
	/**
	 * @method getChildElements
	 * determine if an element has another element as its child, cross-browser
	 * http://stackoverflow.com/questions/2161634/how-to-check-if-element-has-any-children-in-javascript
	 * @param {DOMElement} elem a DOMElement with potential children
	 * @return {DOMElement Array}if there are non-text node children, return them in a JS array
	 */
	function getChildElements(elem) {
		var parent = getElement(elem);
		var child, childList = [];
		for (child = parent.firstChild; child; child = child.nextSibling) {
			if (child.nodeType == 1) { //nodeType 1 == Element
				childList[j++] = child;
			}
		}
		
		return childList;
	}

	/**
	 * add and remove class functions
	 * http://www.avoid.org/javascript-addclassremoveclass-functions/
	 */
	function hasClass(el, name) {
		return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className);
	}

	function addClass(el, name) {
		if (!hasClass(el, name)) { el.className += (el.className ? ' ' : '') +name; }
	}

	function removeClass(el, name) {
		if (hasClass(el, name)) {
			el.className = el.className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
		}
	}
	
	/** 
	 * @method initAccordion
	 * @param {DOMElement} elem the element containing accordion elements, or its id in markup
	 * @param {String} hideTagName the individual elements we want to open and close
	 * Markup structure:
	 *   <parent element>
	 *     <!--this can be a descendants at different levels -->
	 *     <visible header element (clicked on)>
	 *     <show/hide hideTagName>
	 *   </parent element>
	 */
	function initAccordion(elem, hideTagName) {
		
		//our local getElement accepts both DOMObjects and the tagName, returning DOMObject
		
		var accordionCompile = getElement(elem);
		var p1 = Object.toType(elem);
			if(p1 !== "string") {
				p1 = "";
			}
			else {
				p1 = " id=\"" + elem + "\"";
			}
		if(!accordionCompile) {
			console.log("invalid param 1: element (" +  typeof elem + ") " + p1 + " passed to accordion");
			return false;
		}
	
		//sub-elements we want to hide
	
		var accordionItems  = accordionCompile.getElementsByTagName(hideTagName);
		
		//window.accordionItems = accordionItems;
		
		if(!accordionItems || accordionItems.length < 1) {
			console.log("invalid param 2: no accordion items in accordion panel using tag \"" + hideTagName + "\"");
			return false;
		}
		
		//hide by default
		
		for (var i = 0; i < accordionItems.length; i++) {
			accordionItems[i].className = 'accordion-item hide';
		}
	
		/** 
		 * event delegation. We listen on the parent element, and show or 
		 * hide the child element
		 */
		accordionCompile.onclick = function (e) {
				
			var target = e ? e.target : window.event.srcElement;
			
			/** 
			 * we will have clicked on something like this
			 * <article>
			 *   <h4>name of panel</h4> <!-- this is clickable -->
			 *   <table class="accordion-item (show or hide)">...</table><!-- show or hide this -->
			 * </article>
			 */
			
			var parent = target.parentNode;
			var panels = parent.getElementsByTagName(hideTagName); //from the parent, get the show/hide element(s)
			
			for(var i = 0; i < panels.length; i++) {
				var targetPanel = panels[i];
				//console.log("class:"+targetPanel.className);
				if(targetPanel.className.indexOf('hide') != -1) {
					removeClass(targetPanel, 'hide');
					addClass(targetPanel, 'show');
					//targetPanel.className = 'accordion-item show';
				}
				else if(targetPanel.className.indexOf('show') !== -1){
					removeClass(targetPanel, 'show');
					addClass(targetPanel, 'hide');
					//targetPanel.className = 'accordion-item hide';
				}
				
			}
		
		}
		
		//init was ok
		
		return true;
	}
	
	
	return {
		initAccordion:initAccordion
	}
})();