<?php

/** 
 * ua-validate - validate and analyze the user-agent database, writing relevant javaScript functions 
 * as needed
 * TODO: Scan HTML and CSS files for case-sensitive ID use, score down if they aren't removed.
 */ 
 class GBPTools {
	 
	/** 
	 * version number
	 */
	public static $VERSION = 0.1;
	
	/** 
	 * debug level, used in specific output functions
	 */
	public static $DEBUG_0 = true;   //print_statement(), statements directed as user
	public static $DEBUG_1 = false;  //print_debug(), verbose debugging
	public static $DEBUG_2 = true;   //print_error(), errors
	
	/** 
	 * tally rules, additions to database, errors
	 */
	 public static $num_rules  = 0;
	 public static $num_adds   = 0;
	 public static $num_errors = 0;
	 private static $err_arr  = array(); //errors collected

	/** 
	 * paths to directories
	 * 
	 */
	 
	 private static $PATHS                  = array();
	 
	/**
	 * path to native databases
	 */
	private static $GBP_DB_LIST             = array();	
	
	private static $DB_BROWSER_LIST         = array(); //list of browsers in the database
	private static $DB_VERSION_LIST         = array(); //list of versions for a browser
	
	/** 
	 * import caniuse.com JSON data and rewrite as in our array format
	 */
	private static $CANIUSE_JSON_LIST      = array();
	
	/**
	 * import JavaScript files and test their feature detection
	 */
	private static $JAVASCRIPT_LIST        = array();
	
	/**
	 * group files for self-test
	 */	 
	private static $GROUP_LIST             = array();
	
	/**
	 * group files for security tests
	 */
	private static $SECURITY_LIST          = array();
	
	private static $CONFIG;
	
	/**
	 * @method constructor
	 */
	public function __construct($db_path)
	{
		
		require_once('config.php');
		self::$CONFIG = new GBPConfig();
		
		self::build_ui();
	}
	

	/* 
	 ------------------------------------------------------------------------- 
	 NATIVE GBP DATABASE FUNCTIONS
	 -------------------------------------------------------------------------
	 */
	 
	/** 
	 * @method master_properties() get the master property list
	 * @param {Array} $db the user-agent database array
	 * @param {String} $source from the database file itself, an external file, or from the Excel master or a MySQL master
	 * @return {Array} $USER_AGENT array, otherwise return false
	 */ 
	private static function master_properties($db, $source='')
	{
		if(isset($db['all']['000']))
		{
			return $db['all']['000'];
		}
		
		return false;
	}
	
	/* 
	 ------------------------------------------------------------------------- 
	 TEST A SET OF USER AGENTS OF KNOWN BROWSER GROUP AGAINST THE DATABASE
	 -------------------------------------------------------------------------
	 */


	/**
	 * @method search_db()
	 * applys a user-agent to a search through all databases, returning the result
	 * @param {String} $user_agent the user-agent from a browser
	 */
	private static function search_db($user_agent)
	{
		echo "USER AGENT IS CURRENTLY $user_agent<br />";
		if(!empty($user_agent))
		{
			//load ua-analyze
			if(!isset($ua_analyze))
			{
				require_once(self::$CONFIG->get_path('GBP_UA_ANALYZE_PATH'));
				$ua_analyze = new UAAnalyze(false);
			}
						
			$browser_info = $ua_analyze->get_ua_data($user_agent);
			print_r($browser_info);	
			return true;
		}
		return false;
	}
	
	
	/**
	 * @method test_self()
	 * test the search against defined browser groups to see if they are matched 
	 * correctly, for example, match Avant browser as MSIE
	 * @param {String} $json_file path to current group (JSON) file
	 * @param {Array} $db current user-agent database in memory, $USER_AGENTS
	 */
	private static function test_self($json_file, $db)
	{
		reset($db);
		
		$json_arr = array();
		
		self::print_debug(__METHOD__, "JSON file is $json_file");
		
		
		$file_str = file_get_contents($json_file);
		
		if($file_str === false) //read into array
		{
			self::print_error(__METHOD__, 'Could not read JSON file $json_file');
			return false;
		}
				
		self::print_debug(__METHOD__, "trying a JSON decode");
		
		$json_arr = json_decode($file_str, true);
		
		if($json_arr === false)
		{
			self::print_error(__METHOD__,"could not decode JSON file at ".$json_file);
			return false;
		}
		
		self::print_debug(__METHOD__, "Printing JSON group file");
		print_r($json_arr);
		
		//get the browser name and version
		
		$browser_name    = $json_arr['browserName'];
		$browser_fork    = $json_arr['browserFork'];
		$browser_version = $json_arr['browserVersion'];
		
		//loop through the user-agents in the JSON file
		
		if(count($json_arr['ualist']))
		{
			foreach($json_arr['ualist'] as $ua)
			{
				self::search_db($ua);
				
			}
		}
		
	}


	/* 
	 ------------------------------------------------------------------------- 
	 VALIDATE A NATIVE GBP USER-AGENT FILE (php array)
	 -------------------------------------------------------------------------
	 */
	
	/**
	 * @method validate_php_db() given a GBP PHP database (just a multi-dimensional array)
	 * evaluate it. 
	 * Tests:
	 * - Look for properties in the list that aren't in the master array
	 * - Look for properties defined identically twice when crawling up through the versions
	 * - Look for and isNNN or hasNNN that aren't set to 'true' or 'false'
	 * - 'releaseDate' - confirm it is a valid date
	 * Errors are written to standard output
	 * @param {String} $db path to database
	 * @return if everything valid, return true, else return false. If an individual test fails, the 
	 * overall testing stops at that point.
	 */
	private static function validate_db($db_file)
	{	
		
		if(!file_exists($db_file))
		{
			self::print_error(__METHOD__, "Could not load user-agent database");
			return false;		
		}

		if(!file_exists(self::$CONFIG->get_path('GBP_DB_PROPERTIES')))
		{
			self::print_error(__METHOD__, "Could not load property list for user-agent database");
			return false;
		}
		
		require_once($db_file);
		require_once(self::$CONFIG->get_path('GBP_DB_PROPERTIES'));
				
		if(is_array($USER_AGENTS))
		{
			self::print_statement('Checking database'.basename($db_file));
			if(self::orphan_properties($USER_AGENTS) &&
				self::multiple_defines($USER_AGENTS) && 
				self::property_datatypes($USER_AGENTS))
				{
					self::unused_property($db);
					return true;
				}
		}
		
		return false;
	}
	
	/** 
	 * @method validate_translation() validate a translation table for database conversion to 
	 * GBP format.
	 * @param {String} $translation_file path to file with translation lookup for a given foreign database
	 * @return if valid, true, otherwise false. Invalid translation tables contain properties that are 
	 * not in the master database, most likely because a property name was changed.
	 */
	private static function validate_translation($translation_file, $stop_on_invalid=true)
	{

		if(!file_exists($translation_file))
		{
			self::print_error(__METHOD__, "Could not load translation file");
			return false;
		}
		
		if(!file_exists(self::$CONFIG->get_path('GBP_DB_PROPERTIES')))
		{
			self::print_error(_METHOD__, "Could not load master properties file for user-agent database");
		}
		
		
		require_once($translation_file);
		require_once(self::$CONFIG->get_path('GBP_DB_PROPERTIES'));
		
		//get the array. The key is the foreign database, and the value is the GBP equivalent.
		
		$translation = $TRANSLATE['feature'];
		
		$gbp_properties = array_keys($USER_AGENTS['all']['000']);
		
		//print_r($gbp_properties);
		
		foreach($translation as $translation_property)
		{
			if(!in_array($translation_property, $gbp_properties))
			{
				self::print_error(__METHOD__,"translation file property $translation_property is not in master database");
				if($stop_on_invalid === true)
				{
					return false;					
				}
			}
			
		}
		
		return true;
	}
	
	/**
	 * @method orphan_properties() look for properties in the list that aren't in the master array
	 * @param {Array} $db the $USER_AGENTS database
	 */
	private static function orphan_properties($db)
	{
		//get the first one, 'all', that we cross-compare to other records
		
		self::print_statement('Checking for orphan properties not in the master array...');
		
		$master = self::master_properties($db);
		
		if($master !== false)
		{
			foreach($db as $browser => $versions)
			{
				foreach($versions as $version_key => $version)
				{
					foreach($version as $prop_key => $prop_val)
					{
						if(!isset($master[$prop_key]))
						{
							//error, a browser has a property not in the master list
					
							self::print_error(__METHOD__, "in browser $browser, version $version_key, property $prop_key does NOT appear in the master property table");
							return false;
						}
					}
				}
			}
		}
		
		return true;
	}
	
	
	/**
	 * @method multiple_defines() crawling up from the base browser property list, look for cases where 
	 * a property is reset redundantly
	 */
	private static function multiple_defines($db)
	{
		//get the first one, 'all', that we cross-compare to other records
	
		self::print_statement("Checking for multiple defines of properties in individual browser versions...");
		
		$key_val = array();
			
		foreach($db as $browser => $versions)
		{
			foreach($versions as $version_key => $version)
			{
				foreach($version as $prop_key => $prop_val)
				{
					if(isset($key_val[$prop_key]))
					{
						if($key_val[$prop_key] === $prop_val)
						{
							self::print_error(__METHOD__, "In browser $browser, version $version_key, found duplicate property assignment for [$prop_key] => $prop_val");
							return false;
						}
					}
					else
					{
						//assign value so we remember we saw it
						
						$key_val[$prop_key] = $prop_val;
					}
					
				}
			}
			
			$key_val = array();
			
		}
		
		return true;
	}
	
	/** 
	 * @method unused_property() look for properties defined in the base but not in a specific browser
	 */
	 private static function unused_property($db)
	 {
	 	$master = self::master_properties($db);
		
		$prop_keys     = array();
		$missing_props = array();
		
		if($master !== false)
		{
			self::print_statement('Beginning scan for properties not in browsers, but defined in master list');
			
			foreach($db as $browser => $versions)
			{
				foreach($versions as $version_key => $version)
				{
					foreach($version as $prop_key => $prop_val)
					{
						$prop_keys[$prop_key] = 1;
					}
				}
				
				/** 
				 * Compare the properties across all versions of the browser to
				 * those in the master list
				 */
				$missing_props[$browser] = array_diff_keys($master, $prop_keys);
				
			}			
		}
		
		if(count($missing_props))
		{
			self::print_statemet('Browser List:');
			foreach($missing_props as $browser => $props)
			{
				print_r($props);
			}
		}

		self::print_statement('No browser is missing properties in the master list');
		return true;
	 }
	
	
	/**
	 * @method property_datatypes() check that boolean properties have the correct type, also 
	 * date properties resolve to valid dates
	 */
	private static function property_datatypes($db)
	{
		
		self::print_statement("Checking for correct datatype of all browser version property values...");
		
		//get the first one, 'all', that we cross-compare to other records
		
		$master = self::master_properties($db);
		
		if($master !== false)
		{
			foreach($db as $browser => $versions)
			{
				foreach($versions as $version_key => $version)
				{
					foreach($version as $prop_key => $prop_val)
					{
						if(!isset($master[$prop_key]))
						{
							//error, a browser has a property not in the master list
					
							self::print_error(__METHOD__, "in browser $browser, version $version_key, property $prop_key does NOT appear in the master property table");
						}
						else
						{
							if($prop_val === '')
							{
								self::print_error(__METHOD__, "in browser $browser, version $version_key, property $prop_key is EMPTY (none listed)");
							} 
						
							if(strpos(strtolower($prop_key), 'is') !== false || strpos(strtolower($prop_key), 'has') !== false)
							{
								//boolean
							
								if($prop_val !== 'true' && $prop_val !== 'false' && $prop_val !== 'undefined')
								{
									self::print_error(__METHOD__, "in browser $browser, version $version_key, property $prop_key has invalid value $prop_val (should be boolean)");
								}
							
							
							}
							else if(strpos(strtolower($prop_key), 'date') !== false)
							{
								
								//date	
								/////////////////
							}
						}
					}
				}
			}
		}
		
		return false;
	}
	
	
	/* 
	 ------------------------------------------------------------------------- 
	 VALIDATE A JAVASCRIPT LIBRARY FILE (WITH FEATURE TESTS)
	 -------------------------------------------------------------------------
	 */
	 

	/** 
	 * @method validate_js_db
	 * @param {String} $db_file path to javascript test file
	 * @return a JS object is written with 'dummy' functions for tests which 
	 * haven't been implemented yet.
	 */
	private static function validate_js_db($db_file)
	{
		$js = file($db_file); //load as an array
		
		if(count($js) > 1)
		{	
			$js_fns = self::parse_js_lib($js);
			if(count($js_fns))
			{
				//check properties, write in 'dummy' fns from main properties table
				
				$missing_js = self::write_missing_js_fns($js_fns);
				
				//strip the bottom of the GBPTest object
				
				$ct = count($js) - 1;
				while($ct >= 0 && strpos($js[$ct--], '}') === false)
				{
					array_pop($js);
				}
				array_pop($js);
				
				//insert our missing functions
				$js[] = ",\n";
				$js = array_merge($js, $missing_js);
				
				//add the end
				
				$js[] = "};\n";
				
				//print_r($js);
				
				$js = implode('',$js);
				
				//echo($js);
								
				//write a JS object with all the js functions, plus code to execute functions to output
				
				self::write_js_test($js);
			}
			else
			{
				self::print_error(__METHOD__, "no javascript functions in file $file");
			}
		}

	}


	/**
	 * @method parse_js_lib parse out a JS object, retaining whole functions
	 * @param {Array} $js array holding individual lines from a JavaScript function file
	 * @return {Array} an array of all function names in the library
	 */
	private static function parse_js_lib($js)
	{
		$ua_features = array();
				
		$line_count = 0;
		$file_count = count($js);
		
		if($file_count)
		{	
			for($i = 0; $i < $file_count; $i++)
			{
				/** 
				 * regex getting "function: sometning() {" line - get function name (make sure comment not in front.
				 * return this array. If there's stuff missing, we'll add empty functions
				 */
				preg_match("/[^\w]*([\w]+):[^\w]*function[^\w]*\([^\r\n]*\)[^\w]*\{/", $js[$i], $matches);
				if(!empty($matches[1]))
				{
					$ua_features[] = $matches[1];
				}
			}
		}
		
		return $ua_features;
	}
	
	
	/**
	 * @method write_missing_js_fns()
	 * given a javascript file, and the user-agent database, write 'dummy' tests for all the 
	 * properties in the user-agent database. 
	 * @param {Array} $js array with contents of the JS function file
	 * @param {Array} $js_funs array with names of all functions currently in the $js file
	 * @return {String} a string with the old functions, plus additional functions specified in 
	 * the GBP master list. The latter functions are "dummy"
	 */
	private static function write_missing_js_fns($js_fns)
	{
		//load the properties file
		
		$missing_js = array();
		
		require(self::$CONFIG->get_path('GBP_DB_PROPERTIES'));
		if(is_array($USER_AGENTS))
		{
			foreach($USER_AGENTS['all']['000'] as $key => $value)
			{				
				if(!in_array($key, $js_fns))
				{
					//write a 'dummy' function
					$missing_js[] = "\n\t $key:function () { this.$key = 'no JS function exists for this property'; \n },\n";
				}
			}			
			return $missing_js;
		}
		
		return false;
	}

	/**
	 * @method write_js()
	 * write out the javascript function library, and execute all functions, outputing 
	 * results of test
	 * @param {String} $js string with revised object
	 */
	private static function write_js_test($js)
	{
		echo "\n<script>\n";
		
		echo $js; //the JavaScript functions, in an array
		
		echo '
			var output = "<style>#testresults  li { margin:0px; line-height:1;}</style>\n<ol id=\"testresults\">\n";
			var startTimeClient, endTimeClient, totalTimeClient = 0;
			for (var m in GBPFullTests) {
				if (typeof GBPFullTests[m] == "function") {
					output += ("\t<li>" + m + ":");
					startTimeClient = new Date().getMilliseconds();
					GBPFullTests[m](); //execute the function, should be replaced by simple variable
					endTimeClient = new Date().getMilliseconds() - startTimeClient;
					totalTimeClient += endTimeClient;
					output += GBPFullTests[m] + "("+endTimeClient+" mSec)</li>";
				}
				else {
					output += "<strong>Strange Non-Function:</strong>\n"+m+"\n";
				}
			}
			output += "</ul>\n<strong>Total Elapsed Time:" + totalTimeClient + " mSec";
			var result = document.getElementById("result");
			result.innerHTML = output;';
		
		echo "</script>\n";
		
		return false;
	}
	
	
	/* 
	 ------------------------------------------------------------------------- 
	 CONVERT CANIUSE JSON FILE INTO A NATIVE GBP USER-AGENT RECORD
	 -------------------------------------------------------------------------
	 */


	/**
	 * @method convert caniuse() JUST ONE JSON file
	 * load caniuse, and convert between JSON and our PHP array db
	 */
	private static function convert_caniuse($json_file, &$gbp_user_agents)
	{
		$local_add = 0;
		
		self::print_statement('<hr /><span><strong>Translating <strong class="debug">'.basename($json_file).'</strong> for incorporation in GBP db</strong></span>');
		//make sure we have a valid $USER_AGENTS format database file
					
		if(!is_array($gbp_user_agents))
		{
			self::print_error(__METHOD__, "GBP user-agent database is not a valid PHP array");
			return false;
		}
		
		self::print_debug(__METHOD__,"GBP User agent database is ok");
		
		//reset $gbp_user_agents pointer
		
		reset($gbp_user_agents);
		
		self::print_debug(__METHOD__, "JSON file is $json_file");
		
		//$file_str = file_get_contents(self::$CANIUSE_PATH.self::$CANIUSE_JSON_PATH.$json_file);
		$file_str = file_get_contents($json_file);
		
		if($file_str === false) //read into array
		{
			//self::print_error(__METHOD__, "could not load JSON file at ".self::$CANIUSE_PATH.self::$CANIUSE_JSON_PATH.$json_file);
			self::print_error(__METHOD__, "could not load JSON file at ".$json_file);
			return false;
		}
	
		self::print_debug(__METHOD__, "trying a JSON decode");
		
		$json_arr[] = json_decode($file_str, true);
		
		if($json_arr === false)
		{
			self::print_error(__METHOD__,"could not decode JSON file at ".$json_file);
			return false;
		}

		//get the translation table file (a lookup encoded in a PHP array)
		
		if(!isset($TRANSLATE)) //array defined in $CANIUSE_TRANSLATION_PATH
		{
			if(!require(self::$CONFIG->get_path('CANIUSE_TRANSLATION_PATH')))
			{		
				self::print_error(__METHOD__, "could not load translate file at ".self::$CONFIG->get_path('CANIUSE_TRANSLATION_PATH'));
				return false;
			}
		}
		
		self::print_debug(__METHOD__, "translation file is loaded");

		//we only need the 'stats' section in the caniuse file
			
		if(!isset($json_arr[0][$TRANSLATE['caniuse_browser_list']]))
		{
			self::print_error(__METHOD__, "[".$TRANSLATE['caniuse_browser_list']."] key not found in JSON file, exiting");
			return false;
		}
		
		$json_arr = $json_arr[0][$TRANSLATE['caniuse_browser_list']];
		
		//and we can't map canvastext.json => hasCanvasText, don't continue
		//we have to strip the directory off first
		$json_file = basename($json_file);
		
		if(!isset($TRANSLATE['feature'][$json_file]))
		{
			self::print_error(__METHOD__, "can't find $json_file feature in caniuse translation table, no corresponding GBP feature");
			return false;
		}
		
		//get our GBP feature
				
		$gbp_browser_feature = $TRANSLATE['feature'][$json_file];
		
		self::print_debug(__METHOD__, "updating GBP with from caniuse, browser feature=$gbp_browser_feature");
		self::print_statement("<div id=\"feature-list\">");
		
		//we have a GBP feature in the translation table corresponding to the JSON file. So scan the 
		//file, and add to GBP $USER_AGENTS as necessary
			
		foreach($json_arr as $caniuse_browser => $version_arr)
		{
			if(!isset($TRANSLATE['stats'][$caniuse_browser]))
			{
				self::print_debug(__METHOD__, "$caniuse_browser has no corresponding GBP browser name");
				continue;
			}
			
			$gbp_browser = $TRANSLATE['stats'][$caniuse_browser];
			
			self::print_debug(__METHOD__, "Mapping $caniuse_browser to $gbp_browser");
				
			//now, loop through the versions of the caniuse browser we are looking at
			
			foreach($version_arr as $caniuse_version => $caniuse_feature_flag)
			{
				//convert caniuse version to GBP version
				
				$gbp_version = $caniuse_version * $TRANSLATE['caniuse_version_multiplier'];
				$gbp_version = strval($gbp_version);
				if($gbp_version == '0')
				{
					$gbp_version = '000';
				}
				
				self::print_debug(__METHOD__, "version is $gbp_version");
				
				if($caniuse_feature_flag == 'y')
				{
					if($gbp_user_agents[$gbp_browser]['000'][$gbp_browser_feature] === 'true')
					{
						self::print_debug(__METHOD__, "$gbp_browser_feature defined as 'true' in base version");
						break; //exit foreach loop
					}
						
					if(isset($gbp_user_agents[$gbp_browser][$gbp_version]))
					{
						self::print_debug(__METHOD__, "<span>caniuse first support for <strong class=\"debug\">$gbp_browser_feature</strong> is at [$gbp_browser][$gbp_version][$gbp_browser_feature]</span>");
						
						//clear out old entries in GBP, replace with the caniuse value
						
						$vers_keys = array_keys($gbp_user_agents[$gbp_browser]);
						foreach($vers_keys as $keys)
						{
							unset($gbp_user_agents[$gbp_browser][$keys][$gbp_browser_feature]);
						}

					}
					else 
					{
						self::print_statement("<span><strong>Adding new browser version</strong> <strong class=\"debug\">($gbp_version)</strong> to <strong>$gbp_browser</strong></span>");
						$gbp_user_agents[$gbp_browser][$gbp_version] = array();
					}
					
					//since we found a 'y' and all versions are now cleared, set our base version 
					//to 'false' and the first version with a 'y' returned from caniuse as a 'true'
					self::print_statement("<span>New caniuse feature ($gbp_browser_feature) added at [$gbp_browser][$gbp_version][$gbp_browser_feature]</span>");
					$gbp_user_agents[$gbp_browser]['000'][$gbp_browser_feature] = 'false';
					$gbp_user_agents[$gbp_browser][$gbp_version][$gbp_browser_feature] = 'true';
					self::$num_adds++;
					$local_add++;
						
					break;
				} //end of 'y'
				else 
				{
					if($gbp_user_agents[$gbp_browser][$gbp_version][$gbp_browser_feature] == 'true')
					{
						$err = "feature ($gbp_browser_feature) for $gbp_browser, $gbp_version is 'true' in GBP but 'false' in caniuse";
						self::$err_arr[] = "caniuse feature ($gbp_browser_feature) in $json_file for $gbp_browser, $gbp_version is 'true' in GBP but 'false' in caniuse";
						self::$num_errors++;
					}
				} //end of 'n' or 'a'
						
			} //end of caniuse version loop for a specific browser
						
		} //end of caniuse browser loop
		
		self::$num_rules++;
		
		if($local_add == 0)
		{
			self::print_statement("<span>No updates were made.</span>");
		}
		
		self::print_statement("</div>");

		return true;
		
	}

	

	/* 
	 ------------------------------------------------------------------------- 
	 RUN SCRIPT-INJECTION AND OTHER EVIL STRINGS AGAINST THE PROGRAM
	 -------------------------------------------------------------------------
	 */
	 
 	private static function test_security($test_file, $db_file)
	{
		
	}
	
	
	/* 
	 ------------------------------------------------------------------------- 
	 UPDATE DATABASE(s) FROM REMOTE SITE
	 -------------------------------------------------------------------------
	 */
	 
	 private static function update_dbs()
	 {
		 
	 }
	 
	
	
	/* 
	 ------------------------------------------------------------------------- 
	 WEB INTERFACE
	 -------------------------------------------------------------------------
	 */
	
	/**
	 * @method run_output
	 */
	private static function run_output($option)
	{
		require_once('ui-tools/output.php');
				
		switch($option)
		{
		case 'search-database':
			self::start_output($_POST['title-search-user-agent']);
			self::search_db($_POST['entered-user-agent']);
			self::end_output();
			break;
			
		case 'edit-database': //multistep
			self::start_output($_POST['title-edit-database-list']);
			$output_title = "Editing Database";
			//self::edit_db();
			self::end_output();
			break;
			
		case 'validate-db':
			//get the file name
			self::start_output($_POST['title-validate-db-file']);
			self::validate_db(self::$CONFIG->get_path('GBP_DB_PATH').$_POST['validate-db-file']);
			self::end_output();
			break;
			
		case 'validate-js':
			self::start_output($_POST['title-validate-js-file']);
			$db_file = self::$CONFIG->get_path('JAVASCRIPT_PATH').$_POST['validate-js-file'];
			echo "$db_FILE IS NOW $db_file<br />";
			self::validate_js_db($db_file);
			self::end_output();
			break;
			
		case 'build-caniuse':
			self::start_output($_POST['title-build-caniuse-db-file']);
			
			$db_file   = self::$CONFIG->get_path('GBP_DB_PATH').$_POST['build-caniuse-db-file'];                      //GBP database file
			
			//validate the translation table
			
			if(!self::validate_translation(self::$CONFIG->get_path('CANIUSE_TRANSLATION_PATH'), false))
			{
				self::print_error(__METHOD__, 'invalid translation table, exiting');
				break;
			}
			
			if(!file_exists($db_file))
			{
				self::print_error(__METHOD__, 'user-agent database file not found: $db_file');
			}
			
			require_once($db_file);  //load $USER_AGENTS array (may be several files with this array)
			self::print_statement('Using user-agent database: '.basename($db_file));

			$json_file = $_POST['build-caniuse-json-file'];                //JSON database file
				
			if($json_file === 'all')
			{
				self::$CANIUSE_JSON_LIST = self::get_db_list(self::$CONFIG->get_path('CANIUSE_JSON_PATH'), '.json'); //use all files in the JSON directory
				
				foreach(self::$CANIUSE_JSON_LIST as $json_file)
				{
					self::convert_caniuse(self::$CONFIG->get_path('CANIUSE_JSON_PATH').$json_file, $USER_AGENTS);
				}
			}
			else 
			{
					self::convert_caniuse(self::$CONFIG->get_path('CANIUSE_JSON_PATH').$json_file, $USER_AGENTS);
			}
			//end of load for $gbp_user_agents

			
			self::print_statement("<hr /><span><strong>Number of caniuse JSON files successfully scanned:</strong> ".self::$num_rules."</span>\n<span><strong>Number of GBP database updates:</strong> ".self::$num_adds."</span>\n<span><strong>Errors:</strong> ".self::$num_errors."</span>\n"); //just a linebreak
			
			//write out inconsistencies between GBP database and caniuse database
			
			self::print_error_list(self::$err_arr);
			
			self::print_statement("<span><strong>Writing updated user-agent database to drive...</strong></span>");
			
			//write updated file as literal PHP array code to the drive
			
			$output = self::$CONFIG->get_path('UI_TOOLS_OUTPUT_DIR').$_POST['build-caniuse-db-file'];
			self::print_statement("output file path:".$output);
			$file = fopen($output, "w");
			if($file !== false)
			{
				fwrite($file, "<?php\r\n");
				self::set_array_to_file($file, $USER_AGENTS, '$USER_AGENTS');
				//serialize destroys array names and gives a larger file
				//$str = serialize($USER_AGENTS);
				//fwrite($file, $str);
				
				fwrite($file,"?>");
				fclose($file);
				self::print_debug(__METHOD__, "wrote augmented user-agent db to $output");
			}
			else 
			{
				self::print_error(__METHOD__, "failed to open output at $output");
			}
			
			self::end_output("<span>Update complete.</span>\n\n<hr />\n");
			break;
			
		case 'test-self':
			self::start_output($_POST['title-test-self-group']);
			
			//get the user-agent database
			
			$db_file     = self::$CONFIG->get_path('GBP_DB_PATH').$_POST['test-self-db'];
			
			if(!file_exists($db_file))
			{
				self::print_error(__METHOD__, 'user-agent database file not found:'.$db_file);
				break;
			}

			require_once($db_file);  //load $USER_AGENTS array (may be several files with this array)

			self::print_statement('Using user-agent database: '.basename($db_file));
			
			$json_file  = $_POST['test-self-group'];
			
			if($json_file === 'all')
			{
				self::$GROUP_LIST = self::get_db_list(self::$CONFIG->get_path('GROUP_PATH'), '.json'); //use all files in the JSON directory
				
				foreach(self::$GROUP_LIST as $json_file)
				{
					self::test_self(self::$CONFIG->get_path('GROUP_PATH').$json_file, $USER_AGENTS);
				}
			}
			else
			{				
				self::test_self(self::$CONFIG->get_path('GROUP_PATH').$json_file, $USER_AGENTS);				
			}

			self::end_output();
			break;
			
		case 'test-secure':
			self::start_output($_POST['title-test-secure-group']);
			$db_file     = $_POST['test-secure-group'];
			$secure_file = $_POST['test-secure-db'];
			self::test_security($secure_file, $db_file);
			self::end_output();
			break;
            
		case 'update':
			self::start_output($_POST['title-update']);
			self::update_dbs();
			self::end_output();
			break;
			
		default:
			self::print_error(__METHOD__, "Menu option ($option) not recognized");
			break;
		}

		self::set_return();
		
	}
	
	
	/** 
	 * @method build_ui() create 
	 */
	 private static function build_ui()
	 {
		require_once('ui-tools/header.php');
		  
		if(isset($_POST['select_option']) && $_POST['select_option'] == true)
		{
			
			self::run_output($_POST['select_option']);
		}
		else
		{
			//get the local DB path
						
			self::$GBP_DB_LIST       = self::get_db_list(self::$CONFIG->get_path('GBP_DB_PATH'), '.php');
		
			//get the caniuse JSON file list
			
			self::$CANIUSE_JSON_LIST = self::get_db_list(self::$CONFIG->get_path('CANIUSE_JSON_PATH'), '.json');
			
			//get the JavaScript file option
			
			self::$JAVASCRIPT_LIST   = self::get_db_list(self::$CONFIG->get_path('JAVASCRIPT_PATH'), '.js');
			
			//get the group list
			
			self::$GROUP_LIST        = self::get_db_list(self::$CONFIG->get_path('GROUP_PATH'), '.json');
			
			//get the security list
			
			self::$SECURITY_LIST     = self::get_db_list(self::$CONFIG->get_path('SECURITY_PATH'), '.json');
			
			require_once('ui-tools/section.php');
		}
		
		 require_once('ui-tools/footer.php');
		 
	 }
	 
	 /* 
	 ------------------------------------------------------------------------- 
	 UTILITIES
	 -------------------------------------------------------------------------
	 */
	 
	 
	/**
	 * check if a potential database file has the right kind of filename, filter out
	 * 1. property tables (list of browser property names)
	 * 2. feature tables (keywords used to scan a user-agent, e.g., identify mobile devices)
	 */
	private static function is_gbp_db_file($filename)
	{
		
		if(strpos($filename, self::$CONFIG->get_feature('IS_FEATURE_TABLE')) === false && 
			strpos($filename, self::$CONFIG->get_feature('IS_PROPERTY_TABLE')) === false)
		{
			return true;
		}
		
		return false;
	}
	 
	/**
	 * @method get_db_list() 
	 * get the native DB files for GBP-Tools (PHP array)
	 */
	private static function get_db_list($db_path, $ext)
	{
		if(is_dir($db_path))
		{
			$db_list = self::scanfor_files($db_path, $ext);
			if(!count($db_list))
			{
				self::print_error(__METHOD__, "No GBP DB files ($ext) in path $db_path");
				return false;
			}
		}
		
		return $db_list;
		
	}

	 
	/** 
	 * @method scan_for_files()
	 * scan a directory, and return all files matching an extension, or all
	 * @param {String} $path directory path
	 * @param {String} $ext optional file extension ('.jpg'. '.txt', '.json')
	 * @return {Array} array of filenames
	 */
	 private static function scan_for_files($path, $ext = '', $limit=100)
	 {
		if(is_dir( $path )) {
			
			$file_arr  = glob($path."\*.".$ext);
			$file_list = array();
			$set_limit = 0;
			
			foreach($file_arr as $key => $file)
			{
				if($set_limit == $limit)
				{
					break;
				}
				
				$file_list[$key]['path']    = substr($file, 0, (strrpos( $file, "\\") + 1));
				$file_list[$key]['name']    = substr($file, (strrpos($file, "\\" ) + 1));
				$file_list[$key]['size']    = filesize($file);
				$file_list[$key]['date']    = date('Y-m-d G:i:s', filemtime( $file ));
				$set_limit++;
			}
			
			if(!empty($file_list))
			{
				return $file_list;
			}
	 
		} //end of path exists
		
		return false;
	 }
	 
	 
	/** 
	 * Writes an array to a file.  Can be later used by include/require
	 * http://www.roscripts.com/snippets/show/198
	 * @param resource $file   : A file resource, (as returned from fopen)
	 * @param array    $array  : The array tp be written from
	 * @param string   $string : The initial variable name of the array,
	 *                           as it will appear in the file
	 */
	private static function set_array_to_file($file, $array, $string="\$array") 
	{
   		fwrite($file, $string."=array();\r\n");
		
   		foreach($array as $ind => $val) 
   		{
			$str = $string."[".self::quote($ind)."]";
		
			if(is_array($val)) 
			{
				if(self::has_no_sub_arrays($val)) 
				{
					fwrite($file, $str."=".self::compress_array($val).";\r\n");
				} 
				else 
				{
					self::set_array_to_file($file,$val,$str);
				}
			} 
			else 
      		{
				fwrite($file, $str."=".quote($val).";\r\n");
			}
		}
	}
	
	
	/**
	 * Checks if an array contains no arrays
	 * @param  arary $array : The array to be checked
	 * @return boolean      : true if $array contains no sub arrays
	 *                        false if it does
	 */
	private static function has_no_sub_arrays($array) {
			
		if(!is_array($array)) 
		{
			return true;
		}
		
		foreach($array as $sub) 
		{
			if(is_array($sub)) 
			{
				return false;
			}
		}
		
		return true;
	}
	
	
	/**
	 * Compresses an array into a string:
	 * $array=array();
	 * $array[0]=0;
	 * $array["one"]="one";
	 * compress_array($array) will return 'array(0=>0,"one"=>"one")'
	 * @param array $array : the array to be compressed
	 * @return string      : the "compressed" string representation of $array
	 * @note               : works recursively, so $array can contain arrays
	 */
	private static function compress_array($array) 
	{
		if (!is_array($array)) 
		{
			return self::quote($array);
		}
		
		$strings = array();
		foreach($array as $ind => $val) 
		{
			$strings[] = self::quote($ind)."=>".
                 (is_array($val)?self::compress_array($val):self::quote($val));
		}
		
		return "array(".implode(",",$strings).")";
	}
	
	
	/**
	 * Adds quotes to $val if its not an integer
	 * @param mixed $val : the value to be tested
	 */
	private static function quote($val) 
	{
		return is_int($val)?$val:"\"".$val."\"";
	}
	 
	/**
	 * @method print_error
	 * write errors to output, e.g.
	 * self::print_error(__METHOD__, "Version ($version) is not a number");
	 * @param string $class_method class name and class method reporting an error
	 * @param string $error_string the error message
	 */
	private static function print_error($class_method, $error_string)
	{
		if(self::$DEBUG_2 === true) echo "<strong class=\"error\">$class_method ERROR:</strong>$error_string\n";
	}
	
	private static function print_debug($class_method, $debug_string)
	{
		if(self::$DEBUG_1 === true) echo "<strong class=\"debug\">$class_method DEBUG:</strong>$debug_string\n";
	}
	
	private static function print_statement($statement_string)
	{
		if(self::$DEBUG_0 === true) echo $statement_string."\n";
	}
	
	private static function print_error_list($error_arr)
	{
		if(!count($error_arr)) return;
		
		self::print_statement("<div id=\"error-list\"><strong>ERROR LIST:</strong>");
		foreach($error_arr as $err)
			{
				self::print_statement($err);	
			}

		self::print_statement("</div>");
	}

	private static function start_output($title)
	{
		echo "<h2>$title</h2><div id=\"output\">\n<pre id=\"result\">\n";
	}
	
	private static function end_output($ender='')
	{
		echo $ender."</pre>\n</div>\n";
	}
	
	private static function set_return()
	{
		echo '<div id="nav">
		<ul>
			<li><a href="';
			echo basename(__FILE__);
			if(isset($_POST['select_option'])) 
			{
				echo "?select_option=".$_POST['select_option'];
			}
			echo '">Return to Tools</a></li>
		</ul>
			</div>
			';
	}

	
	
 };

$gbp_tools = new GBPTools('');