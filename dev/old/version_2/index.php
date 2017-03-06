<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <!--encoding type for XHTML-->
        <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
        
        <title>GBP - Reporter</title>
        
        <!--SEO-->
        <meta name="description" content="GBP Reporter, output and analytics for Green Boileplate" />
        <meta name="robots" content="index, follow" />
        
        <!--prevent resize on mobile-->
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <!--CSS reset, main and responsive css styles-->
        <!--stylesheets, add CDATA if this is xhtml
		http://www.webdevout.net/articles/escaping-style-and-script-data
	-->		

        <link rel="stylesheet" type="text/css" href="css/gbp_reporter.css" />
        
        <!--our GBP bootstrap script-->

	<?php require_once("gbp/gbp-bootstrap.php"); ?>
            
	<!--our custom debug script for GBP -->
        
	<script type="text/javascript">
	<?php if(stristr($_SERVER["HTTP_ACCEPT"],"application/xhtml+xml")) echo '<!--//--><![CDATA[//><!--'."\n"; ?>
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
		<?php if(stristr($_SERVER["HTTP_ACCEPT"],"application/xhtml+xml")) echo '//--><!]]>'."\n"; ?>
	</script>
                
	<!--
		KNOWN PROBLEMS:
		
		1. On some cloud servers, (Cloud Linux at AISO.NET) communication with
		   very old Mozilla-codebase browsers (Netscape Communicator 4,
		   NCSA Mosaic) is refused by the server, probably due to missing headers.
		   This is not a problem with GBP.
		
	-->

	<!--load our bootloader/sequencer -->
	<!-- <script src="js/lib/gbp/frame.min.js"></script> -->
     
    
  </head>
    
    <body>
        
        <!--page header-->
        <div id="header">
        
                <h1>GBP Reporter</h1>
                <noscript>
                        <p>
                                JavaScript not enabled. GBP cannot run.
                                <?php
                                        echo $_SERVER['HTTP_USER_AGENT']."<br />";
                                        echo "\n<pre>\n".$bootstrap->get_gbp()."\n</pre>\n";
                                ?>
                        </p>
                </noscript>
            
        </div><!--end of page header-->
	
	<div id="nav">
	    <?php
		include("menu.php");
	    ?>
	</div>
            
        <!--outer mask-->
        <div class="mask">
                
                <!--left column-->
                <div class="col1">
                        
                <div id="gbp-table" class="panel">
                        
			<script type="text/javascript">
                                <?php if(stristr($_SERVER["HTTP_ACCEPT"],"application/xhtml+xml")) echo '<!--//--><![CDATA[//><!--'."\n"; ?>
                                
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
			 * not really a patch, a sop to incredibly old DOM0 browsers that don't
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
			 * patching Object to count number of properties in an object
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
                        
                        
			
			///////////////////////////////////////////////////////////////////
			if(!window.localStorage || !window.sessionStorage) {
				log("Error: Storage undefined, localStorage:"+ typeof window.localStorage + " sessionStorage:" + typeof window.sessionStorage);
			}
			var sess1 = sessionStorage.getItem("gbp");
			log("sess after getItem('gbp'):"+ sess1);
			var sess2 = sessionStorage.getItem("beat");
			log("sess after getItem('beat'):"+ sess2); //typeof = string, but alert writes "object"     
			///////////////////////////////////////////////////////////////////
			
			/**
			 * localStorage has unreliable names, so we put a non-standard flag into our polyfill so it can
			 * be distingushed from native Storage
			 * Chrome: localStorage, Firefox, Opera 8+, IE9+ Storage, Opera 7:Object
			 */
			log("about to write out GBP Object properties");
                        
                        if (!GBP) {
                                log("ERROR: GBP not defined");
                        }
			
			if (!GBPDebug || !GBPDebug.serverSideFns) {
				log("ERROR: GBPDebug not defined");
			}
                        else if (!GBPDebug.serverSideFns) {
                                log("ERROR: server-side properties not defined in GBPDebug");
                        }
			/**
			 * echo out the object.
			 * 'GBPDebug.serverSideFns' is the array that lists all the properties defined on the server-side
			 */
			log("GBPDebug.fromLocalStorage is:"+GBPDebug.fromLocalStorage);
			
			var status;
			
			if (GBPDebug.fromLocalStorage === true) {
				
				/**
                                 * we're going to estimate bytes. To do this in one line, we had to coerce the result from
                                 * JSON.stringify to type String(). This is specifically a problem in IE8 but not IE6, IE7, IE9+
                                 */
				var storageBytes = String(JSON.stringify(localStorage)).length;
				
				status = "From Storage "+"("+GBPDebug.storageLength+" items, "+storageBytes+" bytes)";
				
				//we're running our custom GBP polyfill (note .storagepolyfill is a locked property)
				
				if (GBP.storagepolyfill) {
					status += " polyfill";
				}
				else {
					status += " native";
				}
			}
			else {
				status = "Dynamic object created";
				
				/**
				 * if we saved a previous a network time (only when we press the 'clear local GBP' button
				 * below, look at the current time, and compare to serverStart to get a feel for network latency
				 * we don't save this property to localStorage, since it is recalculated on reloads
				 */
				var timeNetwork = localStorage.getItem("timeNetwork");
				
				if (GBP) {
					var dt = new Date();
					var currentTime = dt.getTime(); //milliseconds since jan 1, 1970
					log("CURRENT TIME IS:" + +currentTime + " TIME NETWORK IS:"+timeNetwork);
					if (timeNetwork <= currentTime) {
						log("currentTime:"+currentTime+" timeNetwork:"+timeNetwork);
						GBP.timeNetwork = (currentTime - timeNetwork);
					}
					else {
						log("GBP.timeNetwork couldn't be calculated, start time more recent than end time")
					}
					
				}
			}
			
			/**
			 * If we haven't defined GBP.dom1, do it. .dom1 is optional in GBP, but we need it here to decide what to show
			 */
			if (GBP && !GBP.dom1) {
				GBP.dom1 = !!(document.implementation && document.implementation.hasFeature("HTML", "1.0") &&
			     document.childNodes && document.getElementById && document.createElement &&
			     document.getElementsByTagName);
			}
			
			//set up the header and footer, special rows, with some buttons
			
			if(GBP && GBP.dom1 === true) {
				var listBg     = "class=\"gbp-list\"";
				var rowLabels  = "class=\"location\"";
				var topPadding = "";
			}
			else {
				var listBg     = "padding=\"2\" bgcolor=\"#e8edff\"";
				var rowLabels  = " bgcolor=\"#b9c9fe\"";
				var topPadding = " ";
			}
			
			var table = "<table "+listBg+">\n<thead>\n<tr class=\"nobreak\"><th>JavaScript Object</th><th class=\"status\">"+status+"</th></tr>\n</thead>\n<tbody>\n";
			
			table += "<tr><td "+rowLabels+"><strong>Client Properties</strong></td><td "+rowLabels+">&nbsp;</td>\n";
			var tfoot = "<tfoot><tr><td><form><input type=\"button\" value=\"Clear Local GBP\" onclick=\"reloadGBP();\"></form></td><td id=\"bottom-right\">&nbsp;</td></tr></tfoot>";
			table += tfoot;
                        var tableBold = "",
				tableTime = "",
				tableGBP = "<tr>\n<td "+rowLabels+"><strong>GBP Internal</strong></td><td "+rowLabels+">&nbsp;</td>\n</tr>\n",
				tableServer = "<tr>\n<td "+rowLabels+"><strong>Determined Server-Side</strong></td><td "+rowLabels+">&nbsp;</td>\n</tr>\n",
				tableServerUndefined = "",
				tableClient = "<tr>\n<td "+rowLabels+"><strong>Determined Client-Side</strong></td><td "+rowLabels+">&nbsp;</td>\n</tr>\n",
				tableClientUndefined = "",
				tableLocalStorage = "";
				
				
			//a few configurations properties have to be read dynamically
			var numUndefined = 0;
			for(var i in GBP) {
				if (GBP[i] === undefined) {
					numUndefined++;
				}
			}
			divideProperties("propnumber", Object.keys(GBP).length+" ("+numUndefined+" undefined)");
				
			/**
			 * @method divideProperties
			 * make a function to iterate and classify our properties
			 * @param {String} property name
			 * @param {Mixed} property value
			 */		
			function divideProperties(key, value) {
				if (key == 'name' || key == 'version' || key == 'releasedate') {
					tableBold += "<tr>\n<td><strong>" + key + "</strong></td><td><strong>" + value + "</strong></td>\n</tr>";
				}
				else if (key == 'useuahash') {
					tableBold += "<tr>\n<td><strong>" + key + "</strong></td><td><strong><span>" + value + "</span></strong></td>\n</tr>";
				}
				else if (key == 'timeClient' || key == 'timeServer' || key == 'timeNetwork' || key == 'clientside' || key == 'serverside' || key == 'root') {
					tableTime += "<tr>\n<td>" + key + "</td><td>" + parseInt(value) + "</td>\n</tr>";
				}
				else if (key == 'gbpversion' || key == 'propnumber' || key == 'jsonpolyfill' || key == 'storagepolyfill'|| key == 'usecookies'|| key == 'returntoserver'|| key == 'vampirelibrary') {
					tableGBP += "<tr>\n<td>" + key + "</td><td><span>" + value + "</span></td>\n</tr>";
				}
				else if (GBPDebug && GBPDebug.serverSideFns && GBPDebug.serverSideFns.indexOf(key) > -1) { //global array, written by gbp
					tableServer += "<tr>\n<td class=\"server\">" + key + "</td><td class=\"server\">" + value + "</td>\n</tr>";
				}
				else {
					tableClient += "<tr>\n<td>" + key + "</td><td>" + value + "</td>\n</tr>";
				}	
			}
			
			
			//write according to browser abilities
			
			if(GBP && GBP.dom1 === true) {
				
				for(var i in GBP) {
						
					if(GBP.hasOwnProperty(i)) {
						divideProperties(i, GBP[i]);
						
					}
				}
				
				table += (tableBold + tableGBP + tableTime + tableClient + tableServer);
				table += "</tbody></table>"; //adds rounded border on bottom
				document.getElementById("gbp-table").innerHTML = table;
				log("wrote it in");
			}
			else {
				
				for(var i in GBP) {
					
					divideProperties(i, GBP[i]);
					
				}
				
				table += (tableBold + tableTime + tableClient + tableServer);
				table += "</tbody></table>"; //adds rounded border on bottom
				document.write(table);
				
			}
                        <?php if(stristr($_SERVER["HTTP_ACCEPT"],"application/xhtml+xml")) echo '//--><!]]>'."\n"; ?>
			</script>
                        
                </div><!--end of table-->
                </div><!--end of left column-->
                
               <div class="col3">&nbsp;</div>
               
                <!--right column-->
                <div class="col2">
                        <!--status messages for GBP-->
			<div id="gbp-stage" class="panel">
                                
                                <script type="text/javascript">
                                        table =  "<table "+listBg+">\n<thead>\n<tr><th class=\"nobreak\">Server Processing</th><th>&nbsp;</th></tr>\n</thead>\n";
                                        table += "<tfoot><tr><td>&nbsp;</td><td>&nbsp;</td></tr></tfoot>\n<tbody>\n";
                                        table += "<tr><td "+rowLabels+"><strong>Cookie(s) on Server</strong></td><td "+rowLabels+">&nbsp;</td></tr>\n";
                                        
                                        //print out cookies on server
                                        
                                        table += "<?php
                                                foreach($_COOKIE as $key => $value)
                                                {
                                                        echo '<tr><td><pre>'.$key.'</pre></td><td onclick=\"alert(\''.$_COOKIE[$key].'\')\"><pre>'.$_COOKIE[$key].'</pre></td></tr>';
                                                }
                                        ?>";
					
                                        table += "<tr><td "+rowLabels+"><strong>HTTP Headers</strong></td><td "+rowLabels+">&nbsp;</td></tr>\n";
					table += "<?php
						echo '<tr><td><pre>HTTP_ACCEPT</pre></td><td onclick=\"alert(\''.$_SERVER['HTTP_ACCEPT'].'\')\"><pre>'.$_SERVER['HTTP_ACCEPT'].'\"</pre></td></tr>';
					?>";
					
                                        
                                        table += "<tr><td "+rowLabels+"><strong>Server GBP Object</strong></td><td "+rowLabels+">(from JSON)</td></tr>\n";
                                        
                                        //print out the reconstructed GBP object created by JSON-parsing the "GBPLocStor" cookie
					
					if (GBPDebug) {
						if (GBPDebug.gbpObj) {
							table += "<tr><td></td><td>"+GBPDebug.gbpObj+"</td></tr>\n";
						}
						
						//write out parent, helper, and lag functions
						
						if (GBPDebug.parentFns) {
							var parents = GBPDebug.parentFns;
						        table += "<tr><td "+rowLabels+"><strong>Parent Functions</strong></td><td "+rowLabels+">(accessed as property from another function)</td></tr>\n";
							var len = Object.keys(parents).length
							if (len) {
								for (var i in parents) {
									if(!parents.hasOwnProperty(i)) continue;
									table += "<tr><td>" + i + "</td><td>" + parents[i] + "</td></tr>\n";
								}
							}
							else {
								table += "<tr><td>&nbsp;</td><td>No parents found.</td></tr>\n";
							}
						}
						
						if (GBPDebug.helperFns) {
							var helpers = GBPDebug.helperFns;
							table += "<tr><td "+rowLabels+"><strong>Helper Functions</strong></td><td "+rowLabels+">(accessed as function from another function)</td></tr>\n";
							var len = Object.keys(helpers).length
							if (len) {
								for (var i in helpers) {
									if(!helpers.hasOwnProperty(i)) continue;
									table += "<tr><td>" + i + "</td><td>" + helpers[i] + "</td></tr>\n";
								}
							}
							else {
								table += "<tr><td>&nbsp;</td><td>No helpers found.</td></tr>\n";	
							}
						}
						
						if (GBPDebug.lagFns) {
							var laggers = GBPDebug.lagFns;
							table += "<tr><td "+rowLabels+"><strong>Lagging Functions</strong></td><td "+rowLabels+">(needs to run event handler)</td></tr>\n";
							var len = Object.keys(laggers).length;
							if (len) {
								for (var i in laggers) {
									if(!laggers.hasOwnProperty(i)) continue;
									table += "<tr><td>" + i + "</td><td>" + laggers[i] + "</td></tr>\n";
								}
							}
							else {
								table += "<tr><td>&nbsp;</td><td>No lagging functions found.</td></tr>\n";
							}
						}
						
						if (GBPDebug.orphanFns) {
							var orphans = GBPDebug.orphanFns;
							table += "<tr><td "+rowLabels+"><strong>Orphan Functions</strong></td><td "+rowLabels+">(don't match any property in GBP)</td></tr>\n";
							var len = Object.keys(orphans).length;
							if (len) {
								for (var i in orphans) {
									if(!orphans.hasOwnProperty(i)) continue;
									table += "<tr><td>" + i + "</td><td>" + orphans[i] + "</td></tr>\n";
								}
							}
							else {
								table += "<tr><td>&nbsp;</td><td>No orphan functions found.</td></tr>\n";
							}
						}
						
						if (GBPDebug.initArr && GBPDebug.finalArr) {
							table += "<tr><td "+rowLabels+"><strong>Function Sort</strong></td><td "+rowLabels+">(sorted for correct execution)</td></tr>\n";
							
							for (var i = 0; i < GBPDebug.initArr.length; i++) {
								
								if (GBPDebug.finalArr[i] == GBPDebug.initArr[i]) {
									table += "<tr><td><strong>"+GBPDebug.initArr[i]+"</strong></td><td><strong>"+GBPDebug.finalArr[i]+"</strong></td></tr>\n"; 	
								}
								else {
									table += "<tr><td>"+GBPDebug.initArr[i]+"</td><td>"+GBPDebug.finalArr[i]+"</td></tr>\n"; 										
								}
								
							}
						}
					}
					else {
						table += "<tr><td>ERROR</td><td>NO GBPDebug Object found</td></tr>\n";
					}
                                        
                                        
                                        //server-side errors and warnings
                                        
                                        table += "<tr><td "+rowLabels+"><strong>PHP Errors</strong></td><td "+rowLabels+">(and warnings)</td></tr>\n";
                                        table += "<?php
                                        	$err = $bootstrap->get_gbp_errors();
                                                if($err !== false)
                                                {
                                                        echo "<tr><td></td><td>$err</td></tr>";
                                                }
                                                else {
                                                        echo "<tr><td></td><td>no errors.</td></tr>";
                                                }
                                        ?>";

                                        table += "</tbody></table>";
                                        
                                        if(GBP && GBP.dom1 === true) {
                                                document.getElementById("gbp-stage").innerHTML = table;
                                        }
                                        else {
                                                document.write(table);
                                        }
                                        
                                        
                                </script>
                                
                                
                       </div> <!--end of right-hand panels-->
                </div><!--end of right column-->
                
            
        </div><!--end of mask-->
        
        <!--page footer-->
        <div id="footer">
        Green Boilerplate, http://www.greenboilerplate.com
        </div><!--end of footer-->
        
    </body>
    
</html>
