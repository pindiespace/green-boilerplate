/** 
 * dev.js
 * JS utilities for dev tools
 */


var gbpDev = (function () {

	/** 
	 * @method initAccordion
	 * @param {DOMElement} elem the element containing accordion elements
	 * @param {String} hideTagName the individual elements we want to open and close
	 */
	function initAccordion(elem, hideTagName) {
	//overall element with accordion
	
		var accordionCompile = document.getElementById("accordion-compile");
	
		//sub-elements we want to hide
	
		var accordionItems  = accordionCompile.getElementsByTagName(hideTagName);
	
		//event delegation
		
		accordionCompile.onclick = function (e) {
				
			//hide all items
			
			for (var i = 0; i < accordionItems.length; i++) {
			accordionItems[i].className = 'accordion-item hide';
			}
			
			var target = e ? e.target : window.event.srcElement;
			
			var itemClass = this.parentNode.className;
			
			if(target.parentNode.className.indexOf('hide') != -1) {
				target.parentNode.className = 'accordion-item show';	
			}
			else {
				target.parentNode.className = 'accordion-item hide';		
			}
		
		}
	
	}
	
	
	return {
		initAccordion:initAccordion
	}
})();