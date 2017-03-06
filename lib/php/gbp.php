<?php

/** 
 * base class for all GBP objects
 * PHP used due to market share
 * http://w3techs.com/technologies/overview/programming_language/all
 * code written for compatibility based on PHP stats (about 2% in 2014 weren't using PHP 5)
 * http://w3techs.com/technologies/details/pl-php/5/all
 * 
 */
class GBP {
	
	/** 
	 * debug state
	 */
	static protected $DEBUG = true;
	
	/**
	 * basic defines
	 */
	static protected $GBP                = 'GBP';        //name of our JavaScript object
	static protected $TRUE               = 'true';
	static protected $FALSE              = 'false';
	static protected $UNDEFINED          = 'undefined';
	static protected $NULL               = 'null';

	static protected $GBP_DIR              = 'gbp/';
	static protected $GBP_DB_DIR           = '';
	static protected $GBP_LIB_DIR          = '';

	static protected $GBP_CLIENT_JS_DIR    = '';
	static protected $GBP_CLIENT_DIR       = '';
	static protected $GBP_CLIENT_VB_DIR    = '';
	
	static protected $GBP_SERVER_DIR       = '';    //server-side detector methods
	static protected $GBP_SERVER_PHP_DIR   = '';    //php
	static protected $GBP_SERVER_PY_DIR    = '';    //python
	static protected $GBP_SERVER_RB_DIR    = '';    //ruby
	
	static protected $GBP_SERVER_LIB_JS_DIR = '';   //polyfills
	
	static protected $GBP_DEV_DIR           = '';
	
	/** 
	 * name of server-side scripts (may contain multiple 
	 * detector functions)
	 * @static
	 */
	static protected $GBP_BROWSER_PROPERTIES_FILE = '000000browser.php';
	static protected $GBP_SERVER_PHP_FNS_FILE     = '00000server.php';
	static protected $GBP_SERVER_PY_FNS_FILE      = '00000server.py';
	
	/**
	 * this value controls how much to multiply the version number by in the user-agent
	 * string in order to compare it to the database
	 */
 	protected static $MULTIPLIER   = 100;
	
	/** 
	 * percent cutoff for individual version matches between user-agent and database group
	 */
	static protected $VERSION_CUTOFF = 0.09;
	
	
	/** 
	 * errors and profiling
	 */
	static protected $stats_arr   = array(); //statistics for the build
	static protected $config_arr  = array(); //configuration
	static protected $ERROR       = array();  //errors

	/** 
	 * standard file and directory locations
	 */


	public function __construct () 
	{
		
		/** 
		 * get the working gbp directory
		 */
		$basedir = $_SERVER['DOCUMENT_ROOT'];
		self::clean($basedir);
		self::$GBP_DIR     = $basedir.'/gbp/';
		self::$GBP_DB_DIR = self::$GBP_DIR.'db/';
		self::$GBP_LIB_DIR = self::$GBP_DIR.'lib/';	
		self::$GBP_DEV_DIR = self::$GBP_DIR.'/dev';
		self::$GBP_CLIENT_JS_DIR = self::$GBP_DB_DIR.'client/js/';
	}
	

	/**
	 * =================================================================
	 * UTILITIES
	 * =================================================================
	 */
	
	
	/** 
	 * --------------------------------------------------------- 
	 * @method microtime_float
	 * return the current server timestamp
	 * @returns {Float} floating-point number seconds + microseconds
	 * --------------------------------------------------------- 
	 */
	public static function microtime_float()
	{
		list($usec, $sec) = explode(" ", microtime());
		return ((float)$usec + (float)$sec);
	}


	/**
	 * --------------------------------------------------------- 
	 * @method clean_str()
	 * remove hacker stuff from client-side input prior to processing
	 * --------------------------------------------------------- 
	 */
	 public static function clean_str(&$str)
	 {
		//remove excess whitespace characters and lower-case
		
		$oldlen = strlen($str);
		
		$str = trim(strtolower($str));
		
		if(!strlen($str) && $oldlen > 0)
		{
			self::print_error(__METHOD__, "ERROR: empty string from:'$oldstr' ");
			return false;
		}
		
		/**
		 * note - this is "two-tier". For ideal screening, we would also implement
		 * Jeff Starr's 'blacklist' Apache rewrite rules
		 * strip out NULL  and other characters starting with %0 inserted between keywords
		 * null  %00 - %07
		 * bsp   %08
		 * tab   %09
		 * \n    %0A
		 * null  %0B
		 * null  %0C
		 * \r    %0D
		 * @see http://perishablepress.com/5g-blacklist-2012/
		 * @see http://psoug.org/snippet/XSS-Sanitizer-Function_17.htm
		 */
		$str = preg_replace('/\0+/', '', $str);
		$str = preg_replace('/(\\\\0)+/', '', $str);
		
		/**
		 * zap stuff written as character entities
		 * for example: mozilla/5.0 %77%77%77%2E%67%6F%6F%67%6C%65%2E%63%6F%6D
		 */
		$str = preg_replace("/%u0([a-z0-9]{3})/i", '', $str);
		
		if(empty($str))
		{
			return true; //an empty string is not evil
		}
		
		//blast anything we missed
		
		$str = filter_var($str, FILTER_UNSAFE_RAW);
		
		//check for explicit evil tags in the url
		
		if ((preg_match('~<[^>]*script*\"?[^>]*>~i', $str))    || (preg_match('~<[^>]*object*\"?[^>]*>~i', $str))
		|| (preg_match('~<[^>]*iframe*\"?[^>]*>~i', $str)) || (preg_match('~<[^>]*applet*\"?[^>]*>~i', $str))
		|| (preg_match('~<[^>]*meta*\"?[^>]*>~i', $str))   || (preg_match('~<[^>]*style*\"?[^>]*>~i', $str))
		|| (preg_match('~<[^>]*form*\"?[^>]*>~i', $str))   || (preg_match('~<[^>]*php*\"?[^>]*>~i', $str))
			)
		{
			self::print_error(__METHOD__, "ERROR: Evil string submitted!");
				return false;
		}
		
		return true;
	}
	
	
	/** 
	 * --------------------------------------------------------- 
	 * @method clean
	 * clean an entire array, typically a $_GET, $_POST or $_REQUEST array
	 * @param {Array} &$arr array to have its strings sanitized (passed by reference)
	 * @return if ok true, if not ok, then false.
	 * --------------------------------------------------------- 
	 */
	public static function clean(&$arr)
	{		
		if(is_array($arr))
		{
			$len = count($arr);
			for($i = 0; $i < $len; $i++)
			{
				if(self::clean_str($arr[$i]) === false)
				{
					return false;
				}
			}
			
			return true;
		}
		else
		{
			return self::clean_str($arr);
		}
		
		return false;
	}
	

	/**
	 * --------------------------------------------------------- 
	 * @method generate_php_version_key
	 * generate a GBP-compatible version key from the actual browser version
	 * we need this function to generate proper keys. If you try to use
	 * floating-point numbers for keys, they are truncated to integers.
	 * So, we convert all keys to strings
	 * Steps taken:
	 * Multiply numbers, e.g. 1.3 = 0130. The '0' in front prevents
	 * PHP from converting our key to an integer - it stays a string.
	 * If not a number, strip out the number part, multiply, then add
	 * back the non-numeric part.
	 * Multiply by 1000
	 * Version  0.1  = 00010
	 * Version  1.0  = 00100
	 * Version 10.0  = 01000
	 * Version 100.0 = 10000
	 * --------------------------------------------------------- 
	 */
	public static function generate_php_version_key ($raw_key)
	{
		$num  = $raw_key;
		$text = '';
		$key = '';

		//split out text and numeric portions of the raw key

		if(!is_numeric($raw_key))
		{
			$text = preg_replace('/[^\\/\-a-z\s]/i', '', $raw_key);
			$num = preg_replace("/[^0-9\.]/", "", $raw_key);
		}

		$num *= 100;
		$num = intval($num);

		//create a key which won't be parsed to an integer

		if($num < 1)
		{
			$key = '00000'.$num;
		}
		else if($num < 10)
		{
			$key = '0000'.$num;
		}
		else if($num < 100)
		{
			$key = '000'.$num;
		}
		else if($num < 1000)
		{
			$key = '00'.$num;
		}
		else if($num < 10000)
		{
			$key = '0'.$num;
		}
		else //a huge version, e.g. version 200.5 - unlikely?
		{
			if($text == '')
			{
				$text = 'x';
			}
			$key = $num;
		}

		return $key.$text;
	}

	

	/**
	 * @method print_array 
	 * debugging utility for checking the current 
	 * configuraiton of an array
	 * @param {Array} $arr array to print out
	 * @param {String} $title (optional) title for printed array
	 * @param {String} $style (optional) style for printout
	 */
	public function print_array (&$arr, $title='')
	{
		echo "<pre>\n";
		print_r($arr);
		echo "</pre>\n";	
	}	

	
	/**
	 * --------------------------------------------------------- 
	 * @method print_config()
	 * print out GBP bootstrap configuration information
	 * --------------------------------------------------------- 
	 */
	public function print_config ()
	{
		self::$config_arr['database'] = self::$GBP_DB_DIR;
		self::$config_arr['library']  = self::$GBP_LIB_DIR;
		self::$config_arr['client_js'] = self::$GBP_CLIENT_JS_DIR;
		self::$config_arr['server'] = self::$GBP_SERVER_DIR;
		self::$config_arr['server_php'] = self::$GBP_SERVER_PHP_DIR;
		self::$config_arr['server_python'] = self::$GBP_SERVER_PY_DIR;
		self::$config_arr['server_ruby'] = self::$GBP_SERVER_RB_DIR;

		//path to server-side JS polyfills
		
		self::print_array(self::$config_arr, "Configuration");
	}
	

	/**
	 * --------------------------------------------------------- 
	 * @method print_stats()
	 * print out collected statistics
	 * --------------------------------------------------------- 
	 */	
	public function print_stats ()
	{
		self::print_array(self::$stats_arr, "Statistics");  //statistics for the build
	}


	/**
	 * --------------------------------------------------------- 
	 * @method print_errors
	 * print out error array
	 * --------------------------------------------------------- 
	 */	
	public function print_errors () 
	{
		if(count(self::$ERROR) < 1)
		{
			echo "No errors";
		}
		else
		{
			self::print_array(self::$ERROR);
		}
	}
	

};