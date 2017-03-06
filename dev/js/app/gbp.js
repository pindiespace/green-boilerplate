
/** 
 *****************************************************************
 * simple console object
 *****************************************************************
 */
window.console = window.console || (function (str) {
		
		var log = function (str) {
			if(!window.consolelist) {
				window.consolelist = '';
			}
			window.consolelist += str + "\n";
		}
		
		var logshow = function () { 
			alert(window.consolelist);
		}
		
		return {
			log: log,
			logshow: logshow
		}
	})();


var GBP = (function () {

	var ecma = {
		trycatch : undefined,
		ecmastrict : undefined,
		promise : function promise () {
	if(window.Promise) {
		this.promise = true;
	}
	this.promise = false;
},
		typedarrays : undefined,
		versionecma : undefined

	};

	var javascript = {
		json : function json () {
	
	if(!window.JSON || typeof JSON.parse !== "function" || typeof JSON.stringify !== "function" ||
		!JSON.parse("{\"h\":\"h\"}") || !JSON.stringify({"h":"h"})) {
		this.json = false;
	}
	this.json = true;
},
		localstorage : undefined,
		audioapi : undefined,
		base64 : function base64 () {
		
		this.base64 = !!(window.btoa && window.atob);
	},
		battery : undefined,
		blobbuilder : undefined,
		bloburl : undefined,
		canvasdataurljpeg : undefined,
		canvasdataurlwebp : undefined,
		canvastext : undefined,
		classlist : undefined,
		connection : undefined,
		contenteditable : undefined,
		cors : undefined,
		draganddrop : undefined,
		emojicanvas : undefined,
		eventlistener : undefined,
		eventsource : undefined,
		fileapi : undefined,
		filewriter : undefined,
		fullscreen : undefined,
		gamepad : undefined,
		geolocation : undefined,
		getcomputedstyle : undefined,
		getelementbyid : undefined,
		getelementsbyclassname : undefined,
		getusermedia : undefined,
		history : undefined,
		indexeddb : undefined,
		javascript : undefined,
		matchmedia : undefined,
		navtiming : undefined,
		notification : undefined,
		orientationevent : undefined,
		pagevisibility : undefined,
		peerconnection : undefined,
		pointerevent : undefined,
		pointerlock : undefined,
		postmessage : undefined,
		queryselector : undefined,
		queryselectorall : undefined,
		requestanimationframe : undefined,
		sessionstorage : undefined,
		sharedworkers : undefined,
		speechinput : undefined,
		testfeature : undefined,
		touch : undefined,
		versionjavascript : undefined,
		vibrate : undefined,
		webgl : undefined,
		websockets : undefined,
		websqldatabase : undefined,
		webworkers : undefined,
		windowevent : undefined,
		xhr : undefined,
		xhr2 : undefined,
		jsprophelper : 	
	function jsprophelper (prop, elem, attr) {
		var prefixes,
			len,
			val = false;
		
		if (helper.dom1 && prop && elem && attr) {
			
			if (typeof elem === "string") { 
				elem = document.createElement(elem); 
			}
			if (elem) {
				
				
				console.log("analyzing property " + prop);
				if (attr in elem) {
					val = true;
				}
				else if(typeof helper.vendorprefix === "string") {
					
					prefixes = [helper.vendorprefix.toLowerCase()];
					
					len = prefixes.length;
					attr = attr.charAt(0).toUpperCase() + attr.slice(1); 
					for (var i = 0; i < len; i++) {

						if (!!(prefixes[i] + attr in elem)) {
							val = true;
							break;
						}
					}
				}
			}
			elem = null;	
		}
		return val; 
	}

	};

	var accessibility = {
		alttag : undefined,
		aria : undefined,
		hicontrast : undefined,
		labeltags : undefined,
		linearizeok : undefined,
		linkorder : undefined,
		noblink : undefined,
		norichmedia : undefined,
		sensiblenocss : undefined,
		sensiblenojs : undefined,
		tablehead : undefined,
		tablesummary : undefined,
		titletag : undefined

	};

	var audio = {
		aac : undefined,
		aiff : undefined,
		amr : undefined,
		amrwb : undefined,
		audio3gpp : undefined,
		audio3gpp2 : undefined,
		midi : undefined,
		mp3 : undefined,
		mp4 : undefined,
		oggopus : undefined,
		oggvorbis : undefined,
		wav : undefined

	};

	var browser = {
		activex : undefined,
		ancient : undefined,
		bot : undefined,
		browserhighcontrast : function browserhighcontrast() {

	if(helper.dom1 === true && helper.domready === true) {
		var e,c;
		console.log("in browserhighcontrast, at this point, document is:"+document);
		e=document.createElement("div");
		e.style.color="rgb(31,41,59)";
		document.body.appendChild(e);
		c=document.defaultView?document.defaultView.getComputedStyle(e,null).color:e.currentStyle.color;
		document.body.removeChild(e);
		c=c.replace(/ /g,"");
		if (c!="rgb(31,41,59)"){
			this.browserhighcontrast = true;
		}
		else {
			this.browserhighcontrast = false;
		}
	}
	else {
		this.browserhighcontrast = false;
	}
},
		comments : undefined,
		datauri : undefined,
		documentsize : undefined,
		enginename : undefined,
		engineversion : undefined,
		fork : undefined,
		ftp : undefined,
		future : undefined,
		hardwareaccel : undefined,
		http : undefined,
		httpacceptcharset : undefined,
		httpacceptencoding : undefined,
		httpacceptlanguage : undefined,
		httpreferer : undefined,
		https : undefined,
		httpxrequestedwith : undefined,
		httpxuacompatible : undefined,
		imagesoff : function imagesoff () {
	if(!document.images) {
		this.imagesoff = false;
	}
	else {
		var image = new Image();
		image.onload = function() {
		if (image.width > 0) {
			this.imagesoff = false;
			}
		else {
			this.imagesoff = true;
			}
		};
		image.width  = 1;
		image.height = 1;
	image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
		
	}
},
		imode : undefined,
		javascriptengine : undefined,
		javascriptengineversion : undefined,
		memleak : undefined,
		name : undefined,
		oldie : function oldie () {






	if(document.createElement) {

		
		
		var x = document.createElement('p');
		if(!!(x.applyElement || x.mergeAttributes || x.clearAttributes)) {

			

			if(!document.getElementsByClassName) {
				
				this.oldie = true;
			}

		}

	x = null;
	}

	this.oldie = false;

}
,
		releasedate : "2014-06-10",
		rendercloud : undefined,
		rtsp : undefined,
		searchgroup : "common",
		spdy : function spdy () {
		
		this.spdy = !!(window.chrome && window.chrome.loadTimes && window.chrome.loadTimes().wasFetchedViaSpdy);
	},
		spellcheck : undefined,
		spider : undefined,
		uaregex : undefined,
		unicode : undefined,
		useragent : "linux cl01 3.14.5mtv15 #1 smp tue jun 10 15:51:17 pdt 2014 x86_64",
		vendorprefix : 
function vendorprefix() {
	var regex = /^(webkit|Moz|O|ms|Webkit|Khtml|Icab)(?=[A-Z])/,
	val = false,
	num = 0,
	someScript;

console.log("executing vendorprefix");
		
	if (helper.dom1) {
		(function () {
			someScript = document.getElementsByTagName("script")[0];
			
			if (someScript.style) {
				for(var prop in someScript.style) {
					
					num++;
					if(regex.test(prop)) {
						
						
						val = prop.match(regex)[0];
						
						break;
					}
				}
					
				
				
				
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
			
		})();
	}
	
	console.log("finished vendorprefix, value:"+val);
	this.vendorprefix = val;

},
		version : 30.0,
		versionname : "Firefox 30.0",
		viewportsize : undefined,
		wap : undefined,
		yuiclass : undefined

	};

	var chtml = {
		chtml : undefined

	};

	var configuration = {
		gbpversion : undefined,
		jsonpolyfill : undefined,
		nofouc : undefined,
		nofout : undefined,
		overrideclient : undefined,
		returntoserver : undefined,
		storagepolyfill : undefined,
		useclientdetect : undefined,
		usecookies : undefined,
		useheaderstorage : undefined,
		uselocalstorage : undefined,
		useserverdetect : undefined,
		useuahash : undefined,
		vampirelibrary : undefined

	};

	var creators = {
		agileworkflow : undefined

	};

	var css1 = {
		backgroundattachment : undefined,
		backgroundcolor : undefined,
		backgroundimage : undefined,
		backgroundposition : undefined,
		backgroundpositionx : undefined,
		backgroundpositiony : undefined,
		backgroundrepeat : undefined,
		border : undefined,
		borderbottom : undefined,
		borderbottomwidth : undefined,
		bordercolor : undefined,
		borderleft : undefined,
		borderright : undefined,
		borderrightwidth : undefined,
		borderstyle : undefined,
		bordertop : undefined,
		bordertopwidth : undefined,
		borderwidth : undefined,
		clear : undefined,
		color : undefined,
		css : function css () {
	if ("supportsCSS" in window) { 
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
		cssfloat : undefined,
		cssimport : undefined,
		display : undefined,
		font : undefined,
		fontfamily : undefined,
		fontsize : undefined,
		fontstyle : undefined,
		fontvariant : undefined,
		fontweight : undefined,
		height : undefined,
		letterspacing : undefined,
		lineheight : undefined,
		liststyle : undefined,
		liststyleimage : undefined,
		liststyleposition : undefined,
		liststyletype : undefined,
		margin : undefined,
		marginbottom : undefined,
		marginleft : undefined,
		marginright : undefined,
		margintop : undefined,
		padding : undefined,
		paddingbottom : undefined,
		paddingleft : undefined,
		paddingright : undefined,
		paddingtop : undefined,
		textdecoration : undefined,
		textindent : undefined,
		texttransform : undefined,
		verticalalign : undefined,
		whitespace : undefined,
		width : undefined,
		wordspacing : undefined,
		cssprophelper : 	
	function cssprophelper (cssProp, cssVal) {
		
		function testProp (prop, val) {
			var v = false,
			win = window,
			style;
			if("supportsCSS" in win){
				v = win.supportsCSS(prop, val);    
			}
			else if("CSS" in win && "supports" in win.CSS) {
				v = win.CSS.supports(prop, val);   
			}
			else if (document && document.documentElement && document.documentElement.style) {
     
				

				style = document.documentElement.style;
	
				if (prop in style) {
					var elem = win.document.createElement("div");

					if (elem && elem.style) {

						elem.style.cssText = prop + ":" + val;
						v = (elem.style[prop] !== "");
					}
					elem = null;
				}
			}
			return v;
		}; 
		
		
		var val = false;
		if (cssProp && cssVal) {
			if (val === false && helper.vendorprefix) {
				var camelRe = /-([a-z]|[0-9])/ig;
				var camelProp = helper.vendorprefix + cssProp.charAt(0).toUpperCase() + cssProp.slice(1);

				
				
				camelProp = camelProp.replace(camelRe, function(all, c){
					return (c + "").toUpperCase();
					});
				val = testProp(camelProp, cssVal);
			}
			
			return val;
		}
		
	}

	};

	var css2 = {
		absolute : undefined,
		azimuth : undefined,
		background : undefined,
		borderbottomcolor : undefined,
		borderbottomstyle : undefined,
		bordercollapse : undefined,
		borderleftcolor : undefined,
		borderleftstyle : undefined,
		borderleftwidth : undefined,
		borderrightcolor : undefined,
		borderrightstyle : undefined,
		borderspacing : undefined,
		bordertopcolor : undefined,
		bordertopstyle : undefined,
		bottom : undefined,
		captionside : undefined,
		clip : undefined,
		counter : undefined,
		counterreset : undefined,
		css2 : undefined,
		csscharset : undefined,
		csspage : undefined,
		cssselectors2 : undefined,
		cssstatic : undefined,
		cue : undefined,
		cursor : undefined,
		direction : undefined,
		emptycells : undefined,
		filterdirectx : undefined,
		fixed : undefined,
		inherit : undefined,
		inlineblock : undefined,
		left : undefined,
		max : undefined,
		maxheight : undefined,
		mediaqueries : undefined,
		minheight : undefined,
		minwidth : undefined,
		orphans : undefined,
		outline : undefined,
		outlinecolor : undefined,
		outlinestyle : undefined,
		outlinewidth : undefined,
		overflow : undefined,
		pagebreakafter : undefined,
		pagebreakbefore : undefined,
		pagebreakinside : undefined,
		pause : undefined,
		pauseafter : undefined,
		pausebefore : undefined,
		pitch : undefined,
		pitchrange : undefined,
		playduring : undefined,
		quotes : undefined,
		relative : undefined,
		richness : undefined,
		right : undefined,
		speak : undefined,
		speakheader : undefined,
		speaknumeral : undefined,
		speakpunctuation : undefined,
		speechrate : undefined,
		stress : undefined,
		tablelayout : undefined,
		textalign : undefined,
		top : undefined,
		visibility : undefined,
		voicefamily : undefined,
		volume : undefined,
		widows : undefined,
		zindex : undefined

	};

	var css3 = {
		alignmentadjust : undefined,
		alignmentbaseline : undefined,
		animation : undefined,
		appearance : undefined,
		backgroundbreak : undefined,
		backgroundclip : undefined,
		backgroundimagemultiple : undefined,
		backgroundorigin : undefined,
		backgroundsize : undefined,
		base64 : undefined,
		baselineshift : undefined,
		binding : undefined,
		bookmarklabel : undefined,
		bookmarklevel : undefined,
		bookmarktarget : undefined,
		borderbottomleftradius : undefined,
		borderbottomrightradius : undefined,
		borderbreak : undefined,
		borderimage : undefined,
		borderlength : undefined,
		borderradius : function borderradius () {
	this.borderradius = helper.cssprophelper("border-radius", "1px");
},
		bordertopleftradius : undefined,
		bordertoprightradius : undefined,
		boxalign : undefined,
		boxdirection : undefined,
		boxflex : undefined,
		boxflexgroup : undefined,
		boxlines : undefined,
		boxorient : undefined,
		boxpack : undefined,
		boxreflect : undefined,
		boxshadow : undefined,
		boxsizing : undefined,
		calc : undefined,
		canvasbkgnd : undefined,
		columnbreakafter : undefined,
		columnbreakbefore : undefined,
		columncount : undefined,
		columnfill : undefined,
		columngap : undefined,
		columnrule : undefined,
		columnrulecolor : undefined,
		columnrulestyle : undefined,
		columnrulewidth : undefined,
		columns : undefined,
		columnspan : undefined,
		columnwidth : undefined,
		css3 : undefined,
		csskeyframes : undefined,
		cssnamespace : undefined,
		cssselectors3 : undefined,
		csssupports : undefined,
		cssviewport : undefined,
		cssviewportunits : undefined,
		dominantbaseline : undefined,
		dropinitialafteradjust : undefined,
		dropinitialafteralign : undefined,
		dropinitialbeforeadjust : undefined,
		dropinitialbeforealign : undefined,
		dropinitialsize : undefined,
		dropinitialvalue : undefined,
		featurequeries : undefined,
		filter : undefined,
		fit : undefined,
		fitposition : undefined,
		floatoffset : undefined,
		flowinto : undefined,
		fonteffect : undefined,
		fontemphasize : undefined,
		fontemphasizeposition : undefined,
		fontemphasizestyle : undefined,
		fontface : undefined,
		gradient : undefined,
		gridcolumns : undefined,
		hsla : undefined,
		hypenation : undefined,
		objectfit : undefined,
		opacity : undefined,
		overflowx : undefined,
		overflowy : undefined,
		rem : undefined,
		repeatinglineargradient : undefined,
		repeatingradialgradient : undefined,
		resize : undefined,
		rgba : undefined,
		svg : undefined,
		textoverflow : undefined,
		textshadow : undefined,
		textstroke : undefined,
		transforms2d : undefined,
		transition : undefined,
		wordbreak : undefined,
		wordwrap : undefined,
		wrapflow : undefined

	};

	var device = {
		battery : undefined,
		devicecolordepth : undefined,
		devicename : undefined,
		deviceos : undefined,
		deviceosversion : undefined,
		deviceretina : undefined,
		devicescreenresolution : undefined,
		devicescreensize : undefined,
		devicetextureunit : undefined,
		devicetimestamp : undefined,
		devicetype : undefined,
		deviceversion : undefined,
		domainname : undefined,
		geolocation : undefined,
		httpxwapprofile : undefined,
		ip : "96.39.249.179",
		mobile : undefined

	};

	var dom = {
		dom1 : function dom1 () {

	

	if(helper.dom0 === false) {
		this.dom1 = false;
	}
	else {
		this.dom1 = !!(document.implementation && document.implementation.hasFeature("HTML", "1.0") &&
		document.childNodes && (document.documentElement || document.body) && 
		document.getElementById && document.createElement  && document.getElementsByTagName && document.getElementsByName && 
		document.createTextNode && document.insertBefore && document.replaceChild && document.removeChild && document.appendChild);
	}
},
		dom2 : function dom2 () {

	

	if(helper.dom1 === false) {
		this.dom2 = false;
	}
	else {
		this.dom2 = !!(document.implementation && 
		document.implementation.hasFeature("Core", "2.0") && 
		document.implementation.hasFeature("HTML", "2.0") && document.createElementNS && 
		document.implementation.createHTMLDocument && document.createDocumentFragment && 
		window.addEventListener && window.attachEvent);
	}
},
		dom2events : function dom2events () {
	if(helper.dom1 === false) {
		this.dom2events = false;
	}
	else {
		this.dom2events = !!(document.implementation && 
		document.implementation.hasFeature("Events", "2.0") &&
		document.addEventListener && document.removeEventListener);
	}
},
		dom3 : function dom3 () {
	if(helper.dom2 === false) {
		this.dom3 = false;
	}
	else {
		this.dom3 = !!(document.implementation.hasFeature("Core", "3.0") && 
		document.implementation.hasFeature("HTML", 3.0) && document.evaluate
		);
	}
},
		dom3xpath : function dom3xpath () { 

if(helper.dom0 && helper.dom1) { 
if(!!(document.evaluate)) { 
this.dom3xpath = true;
 } 
} else { 
this.dom3xpath = false; 
} 
},
		nodom : function nodom () {

	if(!window && (!document || !(document.documentElement || !document.body))) {
		this.nodom = true;
	}
	else {
		this.nodom = false;
	}
},
		dom0 : function dom0 () {
	
	this.dom0 = !!(window && document && document.forms && document.images && window.history && document.location);
}

	};

	var events = {
		abort : undefined,
		afterprint : undefined,
		animationend : undefined,
		animationiteration : undefined,
		animationstart : undefined,
		audioprocess : undefined,
		beforeprint : undefined,
		beforeunload : undefined,
		beginevent : undefined,
		blur : undefined,
		cached : undefined,
		canplay : undefined,
		canplaythrough : undefined,
		change : undefined,
		chargingchange : undefined,
		chargingtimechange : undefined,
		checking : undefined,
		click : undefined,
		close : undefined,
		compassneedscalibration : undefined,
		complete : undefined,
		compositionend : undefined,
		compositionstart : undefined,
		compositionupdate : undefined,
		contextmenu : undefined,
		copy : undefined,
		cut : undefined,
		dblclick : undefined,
		devicelight : undefined,
		devicemotion : undefined,
		deviceorientation : undefined,
		deviceproximity : undefined,
		dischargingtimechange : undefined,
		domready : function domready (callback) {
			
			var that = this;
			
			that.tmpdomready = {
				id:-1, 
				maxPoll:0,
				callback:callback
				}
			
			function finish () {
				console.log("in finish");
				if(document.body || document.documentElement) {
					console.log("domready is true");
					clearInterval(that.tmpdomready.id);
					delete that.tmpdomready;
					if(callback) {
						callback();
					}
					return (that.domready = true);
				}
				else if(that.tmpdomready.maxPoll > 100) {
					delete that.tmpdomready;
					return (that.domready = false);
				}
			}
			
			if(that.tmpdomready) {
				clearInterval(that.tmpdomready.id);
			}
			else {
				that.tmpdomready.maxPoll++;
			}
			that.tmpdomready.id = setInterval(finish, 40);
		},
		downloading : undefined,
		drag : undefined,
		dragend : undefined,
		dragenter : undefined,
		dragleave : undefined,
		dragover : undefined,
		drop : undefined,
		durationchange : undefined,
		emptied : undefined,
		ended : undefined,
		endevent : undefined,
		error : undefined,
		focus : undefined,
		focusin : undefined,
		focusout : undefined,
		fullscreenchange : undefined,
		fullscreenerror : undefined,
		gamepadconnected : undefined,
		gamepaddisconnected : undefined,
		gotpointercapture : undefined,
		hashchangeevent : undefined,
		input : undefined,
		invalid : undefined,
		keydown : undefined,
		keypress : undefined,
		keyup : undefined,
		levelchange : undefined,
		load : undefined,
		loadeddata : undefined,
		loadedmetadata : undefined,
		loadend : undefined,
		loadstart : undefined,
		lostpointercapture : undefined,
		message : undefined,
		mousedown : undefined,
		mousemove : undefined,
		mouseout : undefined,
		mouseover : undefined,
		mouseup : undefined,
		noupdate : undefined,
		obsolete : undefined,
		offline : undefined,
		open : undefined,
		orientationchange : undefined,
		pagehide : undefined,
		pageshow : undefined,
		paste : undefined,
		pause : undefined,
		play : undefined,
		playing : undefined,
		pointercancel : undefined,
		pointerdown : undefined,
		pointerenter : undefined,
		pointerlockchange : undefined,
		pointerlockerror : undefined,
		pointermove : undefined,
		pointerout : undefined,
		pointerover : undefined,
		pointerup : undefined,
		ponterleave : undefined,
		popstate : undefined,
		progress : undefined,
		ratechange : undefined,
		readystatechange : undefined,
		repeatevent : undefined,
		reset : undefined,
		resize : undefined,
		scroll : undefined,
		select : undefined,
		show : undefined,
		stalled : undefined,
		storage : undefined,
		submit : undefined,
		suspend : undefined,
		svgabort : undefined,
		svgerror : undefined,
		svgresize : undefined,
		svgscroll : undefined,
		svgunload : undefined,
		svgzoom : undefined,
		timeout : undefined,
		timeupdate : undefined,
		touchcancel : undefined,
		touchend : undefined,
		touchenter : undefined,
		touchleave : undefined,
		touchmove : undefined,
		touchstart : undefined,
		transitionend : undefined,
		unload : undefined,
		updateready : undefined,
		userproximity : undefined,
		visibilitychange : undefined,
		volumechange : undefined,
		waiting : undefined,
		wheel : undefined

	};

	var fonts = {
		eot : undefined,
		otf : undefined,
		svg : undefined,
		ttf : undefined,
		woff : undefined

	};

	var html = {
		a : undefined,
		applicationcache : undefined,
		conditionalcomments : undefined,
		dataset : undefined,
		forms : undefined,
		html : undefined,
		html4 : undefined,
		html5 : undefined,
		iframe : undefined,
		img : undefined,
		microdata : undefined,
		ruby : undefined,
		sandbox : undefined,
		scriptasync : undefined,
		scriptdefer : undefined,
		seamless : undefined,
		srcdoc : undefined,
		stylescoped : undefined,
		xhtml : undefined,
		xhtmlmp : undefined

	};

	var html4 = {
		object : undefined

	};

	var html5 = {
		audio : undefined,
		canvas : function canvas () {
		this.canvas =  !!document.createElement('canvas').getContext;
	},
		captions : undefined,
		details : undefined,
		html5forms : undefined,
		html5formvalidation : undefined,
		inputdatalist : undefined,
		menu : function menu () {
		this.menu = helper.jsprophelper("menu", "menu", "type");
},
		menuitem : undefined,
		meter : undefined,
		picture : undefined,
		poster : undefined,
		progress : undefined,
		semantic : undefined,
		template : undefined,
		track : undefined,
		video : undefined

	};

	var image = {
		base64 : undefined,
		bmp : undefined,
		gif : undefined,
		gifanimated : undefined,
		img : undefined,
		jpeg : undefined,
		png : undefined,
		pngalpha : undefined,
		pnganimated : undefined,
		tiff : undefined,
		wbmp : undefined,
		webp : undefined,
		xbitmap : undefined

	};

	var input = {
		inputautocomplete : undefined,
		inputautofocus : undefined,
		inputcolor : undefined,
		inputdate : undefined,
		inputdatetime : undefined,
		inputdatetimelocal : undefined,
		inputemail : undefined,
		inputfile : undefined,
		inputfilemultiple : undefined,
		inputmax : undefined,
		inputmin : undefined,
		inputnumber : undefined,
		inputpattern : undefined,
		inputplaceholder : undefined,
		inputrange : undefined,
		inputrequired : undefined,
		inputsearch : undefined,
		inputstep : undefined,
		inputtel : undefined,
		inputtime : undefined,
		inputurl : undefined

	};

	var isp = {
		isp : undefined,
		ispdomain : undefined,
		ispgreenindex : undefined

	};

	var link = {
		adownload : undefined,
		prefetch : undefined,
		prerender : undefined

	};

	var mathml = {
		inline : undefined,
		mathml : function mathml () {
	
	if(helper.dom1 === true && helper.domready === true) {
console.log("in mathml");
		var div = document.createElement("div"), box;
		div.innerHTML = "<math><mspace height='23px' width='77px'/></math>";
		document.body.appendChild(div);
		box = div.firstChild.firstChild.getBoundingClientRect();
		document.body.removeChild(div);
		this.mathml = (Math.abs(box.height - 23) <= 1 && Math.abx(box.width - 77) <= 1);
	}
}

	};

	var network = {
		index : undefined,
		type : undefined,
		utilityindex : undefined

	};

	var performance = {
		client : undefined,
		server : undefined

	};

	var plugins = {
		acrobat : undefined,
		director : undefined,
		flash : undefined,
		java : function java () {
		this.java = navigator.javaEnabled();
	},
		quicktime : undefined,
		realplayer : undefined,
		silverlight : undefined,
		unity3d : undefined,
		windowsmedia : undefined

	};

	var security = {
		donottrack : function donottrack () {
	
	this.donottrack = !!(navigator && (helper.vendorprefix + "doNotTrack" in navigator));
	},
		hipaa : undefined,
		httpdnt : undefined,
		parentalcontrols : undefined,
		securitywarning : undefined

	};

	var server = {
		adaptscontent : undefined,
		bits : "32bit",
		cloud : undefined,
		cpuload : undefined,
		cpunum : 8,
		domainname : "acmkokecog.gs01.gridserver.com",
		geolocation : undefined,
		hardware : "x86_64",
		ip : undefined,
		memory : undefined,
		os : "linux",
		osversion : "3.14.5mtv15",
		software : "Apache/2.2.22",
		spdy : "",
		timestamp : 1402708192,
		useragent : "linux cl01 3.14.5mtv15 #1 smp tue jun 10 15:51:17 pdt 2014 x86_64",
		utilityindex : undefined

	};

	var smil = {
		inline : undefined,
		smil : undefined,
		svg : undefined

	};

	var svg = {
		clippaths : undefined,
		filter : undefined,
		inline : undefined,
		textpath : undefined

	};

	var tests = {
		acid1 : undefined,
		acid2 : undefined,
		acid3 : undefined,
		css3 : undefined,
		html5test : undefined,
		mathmlacid1 : undefined,
		mathmlacid2 : undefined,
		mathmltest3 : undefined,
		mqtest : undefined,
		palmreadermq : undefined,
		test262 : undefined,
		wctmb2 : undefined

	};

	var video = {
		h264 : undefined,
		m4v : undefined,
		mp4 : undefined,
		oggtheora : undefined,
		video3gpp : undefined,
		video3gpp2 : undefined,
		webm : undefined

	};

	var wml = {
		wml : undefined,
		wmlc : undefined,
		wmlcscript : undefined

	};

	var xml = {
		xml : undefined,
		xslt : undefined

	};

	var helper = {
		vendorprefix : browser.vendorprefix,
		dom1 : dom.dom1,
		domready : events.domready,
		cssprophelper : css1.cssprophelper,
		dom0 : dom.dom0,
		dom2 : dom.dom2,
		jsprophelper : javascript.jsprophelper

	};

	var run = function () {


		//write early exe methods, in order of execution


		if(typeof events.domready == "function") events.domready()
		if(typeof dom.dom0 == "function") dom.dom0()
		if(typeof dom.dom1 == "function") dom.dom1()
		if(typeof browser.browserhighcontrast == "function") browser.browserhighcontrast()
		if(typeof browser.vendorprefix == "function") browser.vendorprefix()
		if(typeof dom.dom2 == "function") dom.dom2()
		if(typeof dom.dom2events == "function") dom.dom2events()
		if(typeof dom.dom3xpath == "function") dom.dom3xpath()
		if(typeof mathml.mathml == "function") mathml.mathml()
		if(typeof security.donottrack == "function") security.donottrack()
		if(typeof dom.dom3 == "function") dom.dom3()
		if(typeof html5.menu == "function") html5.menu()
		if(typeof css3.borderradius == "function") css3.borderradius()
		if(typeof ecma.promise == "function") ecma.promise()
		if(typeof javascript.json == "function") javascript.json()
		if(typeof javascript.base64 == "function") javascript.base64()
		if(typeof browser.imagesoff == "function") browser.imagesoff()
		if(typeof browser.oldie == "function") browser.oldie()
		if(typeof browser.spdy == "function") browser.spdy()
		if(typeof css1.css == "function") css1.css()
		if(typeof dom.nodom == "function") dom.nodom()
		if(typeof html5.canvas == "function") html5.canvas()
		if(typeof plugins.java == "function") plugins.java()


	} //end of run function

	//executing run

	run();


		//debug detector type
		 var detectorTypes = {
			javascript : {
				json : "JavaScript",
				base64 : "JavaScript"
			},
			browser : {
				browserhighcontrast : "JavaScript",
				imagesoff : "JavaScript",
				oldie : "JavaScript",
				spdy : "JavaScript",
				useragent : "PHP",
				vendorprefix : "JavaScript"
			},
			css1 : {
				css : "JavaScript"
			},
			css3 : {
				borderradius : "JavaScript"
			},
			device : {
				ip : "PHP"
			},
			dom : {
				dom1 : "JavaScript",
				dom2 : "JavaScript",
				dom2events : "JavaScript",
				dom3 : "JavaScript",
				dom3xpath : "JavaScript",
				nodom : "JavaScript"
			},
			ecma : {
				promise : "JavaScript"
			},
			events : {
				domready : "JavaScript"
			},
			html5 : {
				canvas : "JavaScript",
				menu : "JavaScript"
			},
			mathml : {
				mathml : "JavaScript"
			},
			plugins : {
				java : "JavaScript"
			},
			security : {
				donottrack : "JavaScript"
			},
			server : {
				bits : "Python",
				cpuload : "PHP",
				cpunum : "Python",
				domainname : "PHP",
				hardware : "PHP",
				memory : "PHP",
				os : "PHP",
				osversion : "PHP",
				software : "PHP",
				spdy : "PHP",
				timestamp : "PHP",
				useragent : "PHP"
			}
	};
	
	
	//adaptation of window.setTimeout to keep context, and allow parameter-passing in old browsers
	//https://developer.mozilla.org/en/docs/Web/API/window.setTimeout
	
	var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;
 
	window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
		var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
		return __nativeST__(vCallback instanceof Function ? function () {
		vCallback.apply(oThis, aArgs);
		} : vCallback, nDelay);
	};

	//returned object

	return {
		ecma : ecma,
		javascript : javascript,
		accessibility : accessibility,
		audio : audio,
		browser : browser,
		chtml : chtml,
		configuration : configuration,
		creators : creators,
		css1 : css1,
		css2 : css2,
		css3 : css3,
		device : device,
		dom : dom,
		events : events,
		fonts : fonts,
		html : html,
		html4 : html4,
		html5 : html5,
		image : image,
		input : input,
		isp : isp,
		link : link,
		mathml : mathml,
		network : network,
		performance : performance,
		plugins : plugins,
		security : security,
		server : server,
		smil : smil,
		svg : svg,
		tests : tests,
		video : video,
		wml : wml,
		xml : xml,
		helper : helper,
		detectorTypes : detectorTypes,
		run : run
		}; //end of returned object


})(); //end of GBP


var debug_db_properties = {"browser":{"releasedate":"\"2014-06-10\"","searchgroup":"\"common\"","version":"30.0","versionname":"\"Firefox 30.0\""}};

var debug_server_properties ={"browser":{"useragent":"\"linux cl01 3.14.5mtv15 #1 smp tue jun 10 15:51:17 pdt 2014 x86_64\""},"device":{"ip":"\"96.39.249.179\""},"server":{"bits":"\"32bit\"","cpuload":"undefined","cpunum":"8","domainname":"\"acmkokecog.gs01.gridserver.com\"","hardware":"\"x86_64\"","memory":"undefined","os":"\"linux\"","osversion":"\"3.14.5mtv15\"","software":"\"Apache\/2.2.22\"","spdy":"\"\"","timestamp":"1402708192","useragent":"\"linux cl01 3.14.5mtv15 #1 smp tue jun 10 15:51:17 pdt 2014 x86_64\""}};
