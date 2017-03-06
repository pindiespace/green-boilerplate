<?php


class GBP_DEV_BASE {
	
	/** 
	 * errors are stored as a sequential array with class and method name 
	 * along with the error or status message
	 */
	protected static $STATUS        = array(); //normal program flow
	protected static $ERROR         = array(); //errors or exceptions
	
	//GBP standard defs
	
	protected static $UNDEFINED     = "undefined";
	protected static $TRUE          = "true";
	protected static $FALSE         = "false";

	/**
	 * constructor
	 */
	public function __construct()
	{
		
	}
	

	/**
	 * @method init
	 * initialize the error array
	 */
	public function init()
	{
		self::init_error();
		self::$last_insert_id = 0;
	}

	
	/**
	 * @method print_results
	 * print the result directly using PHP print_r
	 * @param {Array} $results a multi-dimensional associative array
	 */
	public function print_results($results)
	{
		print_r($results);
	}
	
	/**
	 * @method print_results_json
	 * print the results to output as a JSON object
	 * @param {Array} $results a multi-dimensional associative array
	 * @returns {String} a printable string that can be turned into a JS object
	 * by JSON.parse()
	 */
	public function print_results_json ($results)
	{
		return "<script>\nvar JSONObject = ".json_encode($results).";\n</script>\n";
	}
	
	
	/** 
	 * GETTERS AND SETTERS
	 */
	
	public function init_status()
	{
		self::$STATUS = array();
	}
	

	/** 
	 * set the status array.
	 */
	public function set_status($method, $err_str)
	{
		self::$STATUS[$method][] = $err_str; //trace[0] is this function, trace[1] is the function with the error
	}
	
	
	/**
	 * @method print_status
	 * print the error using PHP print_r
	 */
	public function print_status ()
	{
		print_r(self::$STATUS);
	}
	
	
	/** 
	 * @method init_err
	 * reset error array
	 */
	protected static function init_error()
	{
		self::$ERROR = array();
	}

	
	/** 
	 * @method get_error
	 * get the error array
	 * @return {Array} return 2d error array. First dimension key is the function
	 * name where the error happened. In some functions, a traceback may be grafted
	 * to the error, or an Exception message.
	 */
	public function get_error()
	{
		$ct = 0;
		foreach(self::$ERROR as $val)
		{
			$ct++;
		}
		if(!$ct)
		{
			return false;
		}
		else
		{
			return self::$ERROR;
		}
	}
	
	
	/** 
	 * set the error array. add api:false for
	 * our downstream JSON calls
	 * TODO: NOT USED YET
	 */
	public function set_error($method, $err_str)
	{
		self::$ERROR[$method][] = $err_str; //trace[0] is this function, trace[1] is the function with the error
	}
	
	
	/**
	 * @method print_error
	 * print the error using PHP print_r
	 */
	public function print_error ()
	{
		print_r(self::$ERROR);
	}
	
	
	/**
	 * @method print_error_json
	 * send error to client as a JavaScript (JSON)string
	 * @returns {String} string, codified to create a JavaScript script defining an
	 * object with the PHP errors.
	 */
	public function print_error_json()
	{
		return "<script>\nvar JSONError = ".json_encode(self::$ERROR).";\n</script>\n";
	}
	
	
	/**
	 * @method clean_str()
	 * remove hacker stuff from form fields prior to processing
	 */
	 protected static function clean_str(&$str)
	 {
		//remove excess whitespace characters and lower-case
		
		$str = trim(strtolower($str));
		
		if(!strlen($str))
		{
			self::print_error(__METHOD__, "ERROR: empty string");
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
	 * @method clean
	 * clean any input, typically a string, $_GET, $_POST or $_REQUEST array
	 * @param {Array} &$arr array to have its strings sanitized (passed by reference)
	 * @return if ok true, if not ok, then false.
	 */
	public static function clean(&$arr)
	{		
		if(is_array($arr))
		{
			for($i = 0; $i < $len; $i++)
			{
				if(self::clean_str($arr[$i]) === false)
				{
					return false;
				}
			}
			return true;
		}
		
		return false;
	}
	
		
	/**
	 * faster replacement for array_unique() 
	 * won't work for floating-point number values
	 * @param array $input associative array (all arrays act that way in PHP)
	 * @return array array a new array with unique values, no duplicate values
	 * @see code documented at: http://www.puremango.co.uk/?p=1039
	 */
	protected static function fast_unique($input_arr) 
	{
		return array_flip(array_flip(array_reverse($input_arr, true)));
	}


	/** 
	 * implementation of array_intersect that is faster than the built-in function, 
	 * since it doesn't sort the arrays first, and we don't check for duplicate values.
	 * @param array $array1 incoming array
	 * @param array $array2 incoming array
	 * @return array containing the intersection of the two arrays
	 * @see http://php.net/manual/en/function.array-intersect.php
	 * @see http://adayinthepit.com/2010/10/19/php-array_diff-vs-foreach-a-battle-for-speed/
	 */
	protected static function array_intersect_fixed($array1, $array2, &$diff_arr) 
	{ 
		$result = array(); 
		
		if(!is_array($array2)) {
			echo "array_intersect_fixed:not an array!<br />";
			exit;
		}

		foreach ($array1 as $val) 
		{ 
			if(($key = array_search($val, $array2, true))!==false) 
			{ 
				$result[] = $val; 
				unset($array2[$key]); 
			} 
		} 
		
		$diff_arr = $array2;
		
    	return $result; 
	}
	

	
}; //end of class