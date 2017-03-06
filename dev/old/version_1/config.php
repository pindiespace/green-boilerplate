<?php

/**
 * configurator for tools
 */
class GBPConfig {
	
	private static $VERSION = 0.1;       //current version
	
	private static $FEATURES = array(
		'IS_FEATURE_TABLE'  => 'feature',  //a filename with this string is NOT a database
		'IS_PROPERTY_TABLE' => 'properties'
	);
	
	private static $DEV_PATHS = array(
		/** 
		 * path to output directories
		 * 
		 */
		'UI_TOOLS_PATH'          => 'ui-tools/',
		'UI_TOOLS_OUTPUT_DIR'    => 'ui-tools/output/',

	
		/** 
		 * import caniuse.com JSON data and rewrite as in our array format
		 */
		'CANIUSE_PATH'             => 'db/caniuse-db/',
		'CANIUSE_TRANSLATION_PATH' => 'db/caniuse-db/translation.php',
		'CANIUSE_JSON_PATH'        => 'db/caniuse-db/features-json/',
		/**
		 * group files for self-test
		 */	 
		'GROUP_PATH'             => 'test/browser-groups/',

		/**
		 * group files for security tests
		 */
		'SECURITY_PATH'          => 'test/security-groups/'
	
	);
	
	private static $PROD_PATHS = array(
		'GBP_UA_ANALYZE_PATH'    => 'php/gbp/ua-analyze.php',
		'GBP_DB_PATH'            => 'php/gbp/db/',
		'GBP_DB_PROPERTIES'      => 'php/gbp/db/user-agents-properties.php',
		
		/**
		 * import JavaScript files and test their feature detection
		 */
		'JAVASCRIPT_PATH'        => 'js/lib/gbp/db/',
	
	);
	
	private static $PATHS = array();
		
	/** 
	 * constructor
	 */
	public function __construct() 
	{				
		
		//get development path
		
		$DEV_PATH = dirname(__FILE__);
		
		foreach(self::$DEV_PATHS as $key => $paths)
		{
			$paths = $DEV_PATH.'/'.$paths;
				
			if(!file_exists($paths)) 
			{
				echo "ERROR: path: $PATHS[$key] ($paths) does not exist<br />";
			}
			else
			{
				self::$PATHS[$key] = $paths;
			}
		}
		
		
		//$PROD_PATH = $DEV_PATH;
		
		$PROD_PATH = dirname(dirname(__FILE__));

		foreach(self::$PROD_PATHS as $key => $paths)
		{
			$paths = $PROD_PATH.'/'.$paths;
				
			if(!file_exists($paths)) 
			{
				echo "ERROR: path: $PATHS[$key] ($paths) does not exist<br />";
			}
			else
			{
				self::$PATHS[$key] = $paths;
			}
			
		}
		
	}
	
	
	/** 
	 * get a path, based on a key
	 */
	public static function get_path($path_key)
	{
		if(isset(self::$PATHS[$path_key])) 
		{
			return self::$PATHS[$path_key];
		}

		return false;
	}
	
	
	/** 
	 * get the whole path array
	 */
	public static function get_paths()
	{
		return self::$PATHS;
	}
	
	
	/**
	 * get feature
	 */
	public static function get_feature($feature_key)
	{
		if(isset(self::$FEATURES[$feature_key]))
		{
			return self::$FEATURES[$feature_key];
		}
		
		return false;
	}
	
	
	/** 
	 * get the whole feature array
	 */
	public static function get_features()
	{
		return self::$FEATURES;
	}
	
	
	/** 
	 * get the current version of the dev tools
	 */
	public static function get_version()
	{
		return self::$VERSION;
	}
	
};

