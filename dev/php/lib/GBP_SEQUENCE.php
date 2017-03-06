<?php

/*
 * order:
 * child, parent
 */




$pairwise_dependencies = array (
	
	"0" => array (
		"0" => "vendorprefix",
		"1" => "jsprophelper",
		"2" => "property"
	),

	"1" => array (
		"0" => "dom1",
		"1" => "jsprophelper",
		"2" => "property",
	),

	"2" => array (
		"0" => "dom1",
		"1" => "browserhighcontrast",
		"2" => "property"
	),

	"3" => array (
		"0" => "domready",
		"1" => "browserhighcontrast",
		"2" => "property"
	),

	"4" => array (
		"0" => "dom1",
		"1" => "vendorprefix",
		"2" => "property"
	),

	"5" => array (
		"0" => "vendorprefix",
		"1" => "cssprophelper",
		"2" => "property"
	),

	"6" => array (
		"0" => "cssprophelper",
		"1" => "borderradius",
		"2" => "function"
	),

	"7" => array (
		"0" => "dom0",
		"1" => "dom1",
		"2" => "property"
	),

	"8" => array (
		"0" => "dom1",
		"1" => "dom2",
		"2" => "property"
	),

	"9" => array (
		"0" => "dom1",
		"1" => "dom2events",
		"2" => "property"
	),

	"10" => array (
		"0" => "dom2",
		"1" => "dom3",
		"2" => "property"
	),

	"11" => array (
		"0" => "dom1",
		"1" => "dom3xpath",
		"2" => "property"
	),

	"12" => array (
		"0" => "dom0",
		"1" => "dom3xpath",
		"2" => "property"
	),

	"13" => array (
		"0" => "jsprophelper",
		"1" => "menu",
		"2" => "function"
	),

	"14" => array (
		"0" => "dom1",
		"1" => "mathml",
		"2" => "property"
	),

	"15" => array (
		"0" => "domready",
		"1" => "mathml",
		"2" => "property"
	),

	"16" => array (
		"0" => "vendorprefix",
		"1" => "donottrack",
		"2" => "property"
	)

);


$prop_component_arr = array (
	"promise" => "ecma",
	"typedarrays" => "ecma",
	"javascript" => "ecma",
	
	"json" => "javascript",
	"base64" => "javascript",
	"jsprophelper" => "javascript",
	
	"browserhighcontrast" => "browser",
	"imagesoff" => "browser",
	"oldie" => "browser",
	"spdy" => "browser",
	"vendorprefix" => "browser",
	
	"css" => "css1",
	"cssprophelper" => "css1",
	"borderradius" => "css3",
	
	"dom1" => "dom",
	"dom2" => "dom",
	"dom2events" => "dom",
	"dom3" => "dom",
	"dom3xpath" => "dom",
	"nodom" => "dom",
	"dom0" => "dom",
	
	"domready" => "events",
	"canvas" => "html5",
	"menu" => "html5",
	"mathml" => "mathml",
	"java" => "plugins",
	"donottrack" => "security"
	);


//abbreviated GBP propeties array
$full_properties  = array(

	"ecma" => array(

		"trycatch" => "undefined",
		"ecmastrict" => "undefined",
		"promise" => 'function promise () {
	if(window.Promise) {
		this.promise = true;
	}
	this.promise = false;
}',
	"typedarrays" => "undefined",
	"versionecma" => "undefined"
	),

	"javascript" => array (
                    "json" => 'function json () {
	
	if(!window.JSON || typeof JSON.parse !== "function" || typeof JSON.stringify !== "function" ||
		!JSON.parse("{\"h\":\"h\"}") || !JSON.stringify({"h":"h"})) {
		this.json = false;
	}
	this.json = true;
}',
                    "localstorage" => "undefined",
                    "audioapi" => "undefined",
                    "base64" => 'function base64 () {
		
		this.base64 = !!(window.btoa && window.atob);
	}',

                    "xhr2" => "undefined",
                    "jsprophelper" => 	
	'function jsprophelper (prop, elem, attr) {
		console.log("in jsprophelper");
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
	}'
                ),

	"browser" => array (
                    "activex" => "undefined",
                    "ancient" => "undefined",
                    "bot" => "undefined",
                    "browserhighcontrast" => 'function browserhighcontrast() {
console.log("in browserhighcontrast");
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
}',
                    "comments" => "undefined",
                    "datauri" => "undefined",
                    "documentsize" => "undefined",
                    "enginename" => "undefined",
                    "engineversion" => "undefined",
                    "fork" => "undefined",
                    "ftp" => "undefined",
                    "future" => "undefined",
                    "hardwareaccel" => "undefined",
                    "http" => "undefined",
                    "httpacceptcharset" => "undefined",
                    "httpacceptencoding" => "undefined",
                    "httpacceptlanguage" => "undefined",
                    "httpreferer" => "undefined",
                    "https" => "undefined",
                    "httpxrequestedwith" => "undefined",
                    "httpxuacompatible" => "undefined",
                    "imagesoff" => 'function imagesoff () {
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
}',
	"imode" => "undefined",
	"javascriptengine" => "undefined",
	"javascriptengineversion" => "undefined",
	"memleak" => "undefined",
	"name" => "undefined",
	"oldie" => 'function oldie () {

	if(document.createElement) {

		
		
		var x = document.createElement("p");
		if(!!(x.applyElement || x.mergeAttributes || x.clearAttributes)) {

			

			if(!document.getElementsByClassName) {
				
				this.oldie = true;
			}

		}

	x = null;
	}

	this.oldie = false;

}',

	"releasedate" => "undefined",
	"rendercloud" => "undefined",
	"rtsp" => "undefined",
	"searchgroup" => "undefined",
	"spdy" => 'function spdy () {
		
		this.spdy = !!(window.chrome && window.chrome.loadTimes && window.chrome.loadTimes().wasFetchedViaSpdy);
	}',
	"spellcheck" => "undefined",
	"spider" => "undefined",
	"uaregex" => "undefined",
	"unicode" => "undefined",
	"useragent" => "\"server-php-useragent\"",
	"vendorprefix" => 
'function vendorprefix() {
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

}',
	"version" => "undefined",
	"versionname" => "undefined",
	"viewportsize" => "undefined",
	"wap" => "undefined",
	"yuiclass" => "undefined"
                ),

	"html5" => array(
		"canvas" => "undefined",
		"menu" => 'function menu () {
			console.log("in menu");
			var eventName = "menu";
			var el = document.createElement("div");
			eventName = "on" + eventName;
			var isSupported = (eventName in el);
			if (!isSupported) {
				el.setAttribute(eventName, "return;");
				isSupported = typeof el[eventName] == "function";
			}
			el = null;
			return isSupported;
		}'
	),
	
	"plugins" => array(
		"java" => "undefined"
	),
	
	"security" => array(
		"donottrack" => "undefined"
	),

	"css1" => array (
                    "backgroundattachment" => "undefined",
                    "color" => "undefined",
                    "css" => 'function css () {
	console.log("in css");
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
}',
                    "wordspacing" => "undefined",
                    "cssprophelper" => 	'
	function cssprophelper (cssProp, cssVal) {
		console.log("in cssprophelper");
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
		
	}'
                ),

            "css2" => array (
                    "absolute" => "undefined",
                    
                ),

            "css3" => array(
                    
                    "borderradius" => 'function borderradius () {
	console.log("in borderradius");
	this.borderradius = helper.cssprophelper("border-radius", "1px");
}'
                    
                ),


	"dom" => array(

		"dom0" => 'function dom0 (callback) {
			console.log("in dom0");
			this.dom0 = !!(window && document && document.forms && document.images && window.history && document.location && window.setTimeout);
			callback();
		}',

		"dom1" => 'function dom1 (callback) {
			console.log("in dom1");
			if(helper.dom0 === false) {
				this.dom1 = false;
			}
			else {
				this.dom1 = !!(document.implementation && document.implementation.hasFeature("HTML", "1.0") &&
				document.childNodes && (document.documentElement || document.body) && 
				document.getElementById && document.createElement  && document.getElementsByTagName && document.getElementsByName && 
				document.createTextNode && document.insertBefore && document.replaceChild && document.removeChild && document.appendChild);
			}
			callback();
		}',
		
		"dom2" => 'function dom2 (callback) {
			console.log("in dom2");
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
			callback();
		}',

		"dom2events" => 'function dom2events (callback) {
			console.log("in dom2events");
			if(helper.dom1 === false) {
				this.dom2events = false;
			}
			else {
				this.dom2events = !!(document.implementation && 
				document.implementation.hasFeature("Events", "2.0") &&
				document.addEventListener && document.removeEventListener);
			}
			callback();
		}',
		
		"dom3" => 'function dom3 (callback) {
			console.log("in dom3");
			if(helper.dom2 === false) {
				this.dom3 = false;
			}
			else {
				this.dom3 = !!(document.implementation.hasFeature("Core", "3.0") && 
				document.implementation.hasFeature("HTML", 3.0) && document.evaluate
				);
			}
			callback();
		}',

		"dom3xpath" => 'function dom3xpath (callback) { 
			console.log("In dom3xpath");
			if(helper.dom0 && helper.dom1) { 
				if(!!(document.evaluate)) { 
					this.dom3xpath = true;
				} 
			} else { 
				this.dom3xpath = false; 
			}
			callback();
		}',

		"nodom" => 'function nodom () {
			console.log("in nodom");
			if(!window && (!document || !(document.documentElement || !document.body))) {
				this.nodom = true;
			}
			else {
				this.nodom = false;
			}
		}'
		
	),

	"events" => array (
	
		"domready" => 'function domready (callback) {
			
			
			
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
		}',
	
	),

            "mathml" => array (
                    "inline" => "undefined",
                    "mathml" => 'function mathml () {
	console.log("in mathml");
	if(helper.dom1 === true && helper.domready === true) {
		var div = document.createElement("div"), box;
		div.innerHTML = "<math><mspace height=\"23px\" width=\"77px\"/></math>";
		document.body.appendChild(div);
		box = div.firstChild.firstChild.getBoundingClientRect();
		document.body.removeChild(div);
		this.mathml = (Math.abs(box.height - 23) <= 1 && Math.abx(box.width - 77) <= 1);
	}
}',
		),

            "helper" => array (
                    "vendorprefix" => "browser.vendorprefix",
                    "dom1" => "dom.dom1",
                    "domready" => "events.domready",
                    "cssprophelper" => "css1.cssprophelper",
                    "dom0" => "dom.dom0",
                    "dom2" => "dom.dom2",
                    "jsprophelper" => "javascript.jsprophelper"
                )
	);



class GNode {
	
	private $name = "";               //name of node
	public $component = "";           //component (parent object) of dectctor function corresponding to node
	public $parents  = array();       //parent nodes this node depends on for execution
	public $body     = array();       //special code in node body
	public $children = array();       //child nodes dependent on this node
	public $type = "";                //property, function, helper
	public $level    = 0;             //horizontal level in the tree (0 = unrooted, 1 = first horizontal level...)
	public $instance = 0;             //unique number for this node in the overall node collection
	
	//static counter for all nodes cloned from this object
	
	public static $instances = 0;
	
	public function __construct ($name) 
	{
		$this->name = $name;
	}
	
	public function __clone() {
		$this->instance = ++self::$instances;
	}
	
	//add a string corresponding to the component
	
	public function add_component($component) {
		$this->component = $component;
	}
	
	//add a parent node
	
	public function add_parent($name, $obj=NULL) {
		if($obj != NULL)
		{
			$this->parents[$name] = $obj;
		}
		else
		{
			$this->parents[$name] = "placeholder";
		}
	}
	
	//add a function body 
	
	public function add_body($code) {
		$this->body = $code;
	}
	
	//add a child node
	
	public function add_child($name, $obj=NULL) 
	{
		if($obj != NULL)
		{
			$this->children[$name] = $obj;
		}
		else
		{
			$this->children[$name] = "placeholder";
		}
	}
	
	//add the type (function, property, helper)
	
	public function add_type($type) 
	{
		$this->type = $type;
	}
	
	public function get_component()
	{
		return $this->component;
	}
	
	public function get_name()
	{
		return $this->name;
	}
	
	public function get_instance()
	{
		return $this->instance;
	}
	
	public function get_level()
	{
		return $this->level;
	}
	
	public function get_type()
	{
		return $this->type;
	}
	
	public function set_level($level)
	{
		$this->level = $level;
	}
};


class GTree {
	
	public $dependency_arr = array();       //external dependency list
	public $prop_component_arr = array();   //component for a property
	public $GNodes  = array();              //basic set of depedencies
	public $GRoots  = array();              //standalone trees, starting with an unrooted node
	public $GLevels = array();              //horizontal level of execution in trees
	
	public function __construct ($dependency_arr, $prop_component_arr=array()) 
	{
		$this->dependency_arr = $dependency_arr;
		
		if(count($prop_component_arr) > 0)
		{
			$this->prop_component_arr = $prop_component_arr;
		}
		
		//look for circular dependencies
		
		$this->detect_circular();
	}
	
	
	public function detect_circular()
	{
		foreach($this->dependency_arr as &$arr)
		{
			$child = $arr[0];
			$len = count($arr);
				
				//look at defined parents
				
			for($i = 1; $i < $len; $i++)
			{
				$parent = $arr[$i];
				if($parent == $child)
				{
					echo "ERROR: child names itself as a parent";
					return false;
				}
				
				//now look for any arrays that start with the child
				
				foreach($this->dependency_arr as &$arr2)
				{
					if($arr2[0] == $parent) 
					{
						$len2 = count($arr2);
						for($j = 1; $j < $len2; $j++)
						{
							if($arr2[$j] == $child)
							{
								echo "ERROR: indirect circular dependency";
								echo "<pre>";
								print_r($arr);
								print_r($arr2);
								echo "</pre>";
								return false;
							}
						}
					}
				}
			}
			
			
		}
		
		return true;
	}
	
	
	//assume parent = dependency[0], child = dependency[1], type of call = dependency[2]
	public function init_nodes()
	{
		//create an array of the children first
		
		foreach($this->dependency_arr as &$dependency)
		{
			$this->GNodes[$dependency[1]] = new GNode($dependency[1]);
			$this->GNodes[$dependency[1]]->add_parent($dependency[0]);
			$this->GNodes[$dependency[1]]->add_component($this->prop_component_arr[$dependency[1]]);
			
			//echo "COMPONENT:".$this->prop_component_arr[$dependency[1]]."<br>";
			$this->GNodes[$dependency[1]]->add_type($dependency[2]);
		}
		
		//look for nodes that have no parent (only listed in parent field)
		
		foreach($this->dependency_arr as &$dependency)
		{
			if(!isset($this->GNodes[$dependency[0]])) 
			{
				$this->GRoots[$dependency[0]] = new GNode($dependency[0]);
				$this->GRoots[$dependency[0]]->add_component($this->prop_component_arr[$dependency[0]]);
				$this->GRoots[$dependency[0]]->add_type($dependency[2]);
				//no children
			}
		}
	}
	
	
	public function compute_children()
	{
		foreach($this->dependency_arr as &$dependency)
		{
			if(isset($this->GNodes[$dependency[0]]))
			{
				$this->GNodes[$dependency[0]]->add_child($dependency[1]);
			}
			else if(isset($this->GRoots[$dependency[0]]))
			{
				$this->GRoots[$dependency[0]]->add_child($dependency[1]);
			}
			else
			{
				echo "ERROR:dependency";
			}
		}
	}
	
	
	//starting with unparented root, build local tree
	//TODO: don't use types which remain functions, and rewrite as properties
	//TODO: don't use
	
	public function build_tree(&$root)
	{
		if(is_object($root)) 
		{
			foreach($root->children as $key => &$child)
			{
				$child = clone $this->GNodes[$key];
				$child->set_level($root->get_level() + 1); //set our horizontal level
				$this->build_tree($child);
			}
		}
		else
		{
			echo "Not a child, $root in build_tree";
		}
	}
	
	//convert the unrooted base nodes into full trees, with 
	//their dependents. Some nodes may be represented in multiple trees
	
	public function build_trees()
	{
		foreach($this->GRoots as $key => $root)
		{
			$this->build_tree($root);
		}
	}
	
	
	//add individual nodes to levels of execution
	
	public function build_level($root)
	{
		if(is_object($root))
		{
			foreach($root->children as $key => &$child)
			{
				$child_level = clone $child;
				$level = $child_level->get_level(); //set our horizontal level
				$this->GLevels[$level][$key] = $child_level;
				$this->build_level($child_level);
			}
			
		}
		else
		{
			echo "Not a child, $root in build_level";
		}
	}
	
	
	//build execution levels as a separate set
	//assume that build_trees has executed
	
	public function build_levels()
	{
		$this->GLevels = array();
		
		foreach($this->GRoots as $key => $root)
		{
			//the first node is computed before recursion
			
			$node = clone $root;
			$level = $node->get_level();
			$this->GLevels[$level][$key] = $node;
			
			//recursive build
			
			$this->build_level($root);
		}
	}
	
	
	public function print_linear_tree()
	{
		echo "<hr><h3>Linear Tree</h3><pre>\n";
		print_r($this->GNodes);
		echo "</pre>\n";
	}
	
	
	public function print_roots()
	{
		echo "<hr><h3>Roots</h3><pre>\n";
		print_r($this->GRoots);
		echo "</pre>\n";
	}
	
	
	public function print_levels()
	{
		echo "<hr><h3>Levels</h3><pre>\n";
		print_r($this->GLevels);
		echo "</pre>\n";
	}
};

class GTree_JS extends GTree {
	
	public $js_str_arr = array();
	public $used_nodes_arr = array(); //nodes already fired in callback hierarchy
	
	public function __construct ($dependency_arr, $prop_component_arr=array()) 
	{
		parent::__construct($dependency_arr, $prop_component_arr);
	}
	
	private function make_tabs($num)
	{
		return str_repeat("\t", intval($num) + 1);
	}
	
	public function walk_js(&$root, &$str)
	{
		if(is_object($root)) 
		{
			//DO SOMETHING HERE
			//echo "ROOT NAME:".$root->get_name()."<br>";
			$instance = $root->get_instance();
			$level = $root->get_level();
			$name = $root->get_name();
			$component = $root->get_component();
			
			/* 
			 * see if we've already fired the function. If so, it should 
			 * have converted to a property
			 */
			if(in_array($name, $this->used_nodes_arr))
			{
				$used = true;
			}
			else
			{
				$used = false;
			}
			
			//only list the function once (outer) assuming it will resolve by the time we reach inner loops
			
			if(!$used)
			{
				$tabs = $this->make_tabs($level);
				$str .= $tabs.$component.".".$name." (callback".$instance.");\n";
				$str .= $tabs."function callback".$instance." () {\n";
			}
			//record the firing so we don't duplicate later
			
			$this->used_nodes_arr[] = $name;
			
			foreach($root->children as $key => &$child)
			{
				//DO SOMETHING HERE
				
				$tabs."\t".$this->walk_js($child, $str);
			}
			
			if(!$used) 
			{
			
				$str .= $tabs."};\n";
			}
			//echo "Adding to string, now $str<br>";
		}
		else
		{
			echo "Not a child, $root in build_tree";
		}
	}
	
	
	public function build_js($root)
	{
		//build the call
		
		$run_callbacks = "";
		
		//build the callbacks
		$count = 0;
		
		foreach($this->GRoots as $key => $root)
		{
			$this->js_str_arr[$key] = '';
			$this->js_str_arr[$key] .= "function run".$count." (callback) {\n";
			$this->js_str_arr[$key] .= "console.log(\"in run$count\");\n";
			$this->walk_js($root, $this->js_str_arr[$key]);
			$this->js_str_arr[$key] .= "};\n";
			$count_next = $count + 1;
			$run_callbacks .= "\trun".$count."();\n";
			$count++;
		}
		
		$this->js_str_arr["run"]  = "function run () {\n";
		$this->js_str_arr["run"] .= "\n\t//run dependent detectors with callbacks\n";
		$this->js_str_arr["run"] .= $run_callbacks;
		

		//////////////////////////////////////////
		//HANDLE UNROOTED PROPERTIES THAT DON'T HAVE ANY DEPENDENCIES
		//TODO:
		//TODO:
		//TODO:
		//TODO:
		//TODO: NEED TO CHECK IF WE HAVE A DETECTOR, SO WE DON'T DO UNNECESSARY TYPEOFS
		//TODO:
		//TODO: undefineds don't actually have to be written
		//TODO:
		//TODO: don't include undefineds when a dependency test fails
		//TODO:
		$this->js_str_arr["run"] .= "\n\t//run independent detectors\n";
		$unrooted = array();
		$props = array_keys($this->prop_component_arr);
		foreach($props as $prop)
		{
			if(!in_array($prop, $this->used_nodes_arr))
			{
				$unrooted[$prop] = $prop;
			}
		}
		foreach($unrooted as $un)
		{
			$prop_call = $this->prop_component_arr[$un].".".$un;
			$this->js_str_arr["run"] .= "\t if(typeof $prop_call == \"function\") $prop_call();"."\n";
		}
		///////////////////////////////////////////

		///////////////////////////////////////////
		//WRITE COMPONENT RETURN
		$this->js_str_arr["run"] .= "\n\t//return components\n";
		$this->js_str_arr["run"] .= "\treturn {\n";
		//$this->prop_component_arr = array_unique($this->prop_component_arr);
		//TODO: DIFFERENT IN ACTUAL GBP COMPILER
		//TODO: LEAVE COMPONENTS ALONE
		$this->prop_component_arr = array_unique($this->prop_component_arr);
		foreach($this->prop_component_arr as $component)
		{
			$this->js_str_arr["run"] .= "\t\t$component: $component,\n";
		}
		//////////////////////////////////////////
		
		$this->js_str_arr["run"] .= "\t\t};\n"; //end of return {}
		
		$this->js_str_arr["run"] .= "\t}; //end of primary run function\n";
		//////////////////$this->js_str_arr["run"] .= "\treturn run();\n";
	}
	
	public function print_used_nodes()
	{
		echo "<hr><h3>USED_NODES</h3><pre>\n";
		print_r($this->used_nodes_arr);
		echo "</pre>\n";
	}
	
	
	public function print_js_strs()
	{
		echo "<hr><h3>FINAL_JS_STRING</h3><pre>\n";
		print_r($this->js_str_arr);
		echo "</pre>\n";
	}
};


$tree = new GTree_JS($pairwise_dependencies, $prop_component_arr);

$tree->init_nodes();
//$tree->print_linear_tree();
$tree->compute_children();
//$tree->print_linear_tree();
$tree->print_roots();
$tree->build_trees();
//$tree->build_levels();
//$tree->print_levels();


//generate the JS
$tree->build_js($tree->GRoots);
$tree->print_js_strs();
$tree->print_used_nodes();

//test it
echo "<hr><h3>JS CODE</h3>\n<script>";
echo "var GBP = (function () {\n\n";

//print out some dummy methods

foreach($full_properties as $component_name => $component)
{
	echo "var $component_name = {\n";
	foreach($component as $method_name => $method) 
	{
		echo "$method_name:$method,\n";	
	}
	echo "\t};\n";
}



foreach($tree->js_str_arr as $str) 
{
	echo $str."\n";
}


echo "})();\n";

echo "</script>\n";