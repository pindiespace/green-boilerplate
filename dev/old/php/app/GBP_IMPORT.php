<?php
session_start();

class GBP_IMPORT {

	/** 
	 * variables
	 */
	static private $ERROR = array();
	
	static private $hostname;
	static private $username;
	static private $password;
	static private $db_name;
	
	static private $test_path = "http://www.greenboilerplate.com/gbp/dev/fulltests.php";
	
	static private $SECONDS_BETWEEN_QUERY = 5;
	
	function __construct()
	{
		//get our database info
		
		require("db.php");
		if(isset($host) && isset($user) && isset($pass))
		{
			self::$hostname = $host;
			self::$username = $user;
			self::$password = $pass;
			self::$db_name  = $db;
			
			self::import(); //import the values
		}
		
	}
	
	

	/**
	 * -------------------------------------------------------------------------
	 * @method clean_str()
	 * remove hacker stuff from form fields prior to processing, convert
	 * the string in-place. Multi-tier, meaning that cleans are applied
	 * in several steps.
	 * @param {&String} $str reference to string
	 * -------------------------------------------------------------------------
	 */
	private static function clean_str(&$str)
	{
		//remove excess whitespace characters and lower-case
		
		$oldlen = strlen($str);
		
		//remove whitespace, php and sql tags
		
		$str = strip_tags(trim(strtolower($str)));
		
		if(!strlen($str) && $oldlen > 0)
		{
			self::print_error(__METHOD__, "ERROR: empty string from:'$oldstr' ");
			return false;
		}
		
		/**
		 * Note - this is "two-tier". For ideal screening, we would also implement
		 * Jeff Starr's 'blacklist' Apache rewrite rules, but this should be implemented in
		 * this site's .htaccess file.
		 * 
		 * Strip out NULL  and other characters starting with %0 inserted between keywords. Since
		 * we already zapped PHP and SQL characters
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
		
		//blast anything we missed with another cleaning function
		
		$str = filter_var($str, FILTER_UNSAFE_RAW);
		
		//check for explicit evil tags in the url that somehow squeaked through 
		
		if ((preg_match('~<[^>]*script*\"?[^>]*>~i', $str))    || (preg_match('~<[^>]*object*\"?[^>]*>~i', $str))
        	|| (preg_match('~<[^>]*iframe*\"?[^>]*>~i', $str)) || (preg_match('~<[^>]*applet*\"?[^>]*>~i', $str))
        	|| (preg_match('~<[^>]*meta*\"?[^>]*>~i', $str))   || (preg_match('~<[^>]*style*\"?[^>]*>~i', $str))
        	|| (preg_match('~<[^>]*form*\"?[^>]*>~i', $str))   || (preg_match('~<[^>]*php*\"?[^>]*>~i', $str))
			)
			{
			self::$ERROR[__METHOD__][] = "ERROR: Evil string submitted!";
    			return false;
    		}
		
		return true;
	}
	
	
	/** 
	 * -------------------------------------------------------------------------
	 * @method clean
	 * clean an entire array, typically a $_GET, $_POST or $_REQUEST array
	 * @param {Array} &$arr array to have its strings sanitized (passed by reference)
	 * @return if ok true, if not ok, then false.
	 * -------------------------------------------------------------------------
	 */
	private static function clean(&$arr)
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
	 * @get_ip
	 * get client's IP address when HTTP_REFERER not available
	 * try several HTTP headers
	 * http://techtalk.virendrachandak.com/getting-real-client-ip-address-in-php-2/#ixzz2mR862vV0 
	 */
	private static function get_ip()
	{
		$ipaddress = '';
		if ($_SERVER['HTTP_CLIENT_IP']) $ipaddress = self::clean($_SERVER['HTTP_CLIENT_IP']);
		else if($_SERVER['HTTP_X_FORWARDED_FOR']) $ipaddress = self::clean($_SERVER['HTTP_X_FORWARDED_FOR']);
		else if($_SERVER['HTTP_X_FORWARDED']) $ipaddress = self::clean($_SERVER['HTTP_X_FORWARDED']);
		else if($_SERVER['HTTP_FORWARDED_FOR']) $ipaddress = self::clean($_SERVER['HTTP_FORWARDED_FOR']);
		else if($_SERVER['HTTP_FORWARDED']) $ipaddress = self::clean($_SERVER['HTTP_FORWARDED']);
		else if($_SERVER['REMOTE_ADDR']) $ipaddress = self::clean($_SERVER['REMOTE_ADDR']);
		else $ipaddress = 'UNKNOWN';
		
		return $ipaddress;
	}

	/**
	 * --------------------------------------------------------------------------
	 * get the PDO object
	 * @return {PDO} PDO data object
	 * --------------------------------------------------------------------------
	 */
	private static function get_pdo()
	{
		$dbh = new PDO('mysql:host='.self::$hostname.';dbname='.self::$db_name.';charset=UTF8', self::$username, self::$password);
		$dbh->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
		return $dbh;
	}


       /**
	 * --------------------------------------------------------------------------
         * @method compare dates
         * run a search on a table to see if a MySQL date in a 'date' column
         * has a very close date to the current date. This prevents multiple submissions
         * @returns {Boolean} if true, we have a very close submission (don't allow a re-submit).
         * if false, it is ok to insert a new record.
	 * --------------------------------------------------------------------------
         */
        private static function date_too_close()
        {
                $db = self::get_pdo();
		
		//get current datetime
		
		$curr_date = date("Y-m-d H:i:s", (time() - self::$SECONDS_BETWEEN_QUERY));
		
		$select_list = 'SELECT * FROM `import_fulltests` WHERE date_test > ('."'".$curr_date."'".')'; //worked correctly
		try {
			$statement = $db->prepare($select_list);
			$statement->execute();		
			$statement->setFetchMode(PDO::FETCH_ASSOC);
			$row = $statement->fetchAll();
			
			if(is_array($row) && count($row) > 0)
			{
				return true; //at least one record was created more recently than one second ago
			}
		} 
		catch(Exception $e) { 
			self::$ERROR[__METHOD__][] = $e->getMessage()." in compare_dates for table $table_name"; //return exception 
		}
                return false;
        }

	
	/**
	 * @method insert_new_fulltest
	 * insert browser results into 'import_fulltests' from a user-accessed form
	 * (not part of initializr). A way of getting full browser test input into
	 * initialzr. This functions does NOT work with the standard GBP test, only
	 * the full JavaScript test suite.
	 * @param {String} $user_agent user agent recorded for the test
	 * @param {String} $referer site referring the test
	 * @param {date} $date_test date and time of test
	 * @param {Array} $property_arr the array with the results of the fulltest
	 * @returns {Array|false} if inserted, number of properties imported, else false
	 */
	private static function insert_new_fulltest($user_agent, $referer, $date_test, $import_arr)
	{
		$ct = 0;
		
		/**
		 * this is redundant, for the calling function also cleans
		 * but gives us 'heavy handed' security
		 */
		foreach(get_defined_vars() as $key => $val){ self::clean($val); $ct++; } //heavy-handed security, clean anything that comes in	
		
		/**
		 * find the closest date in our list.
		 * if our request was too recent, according to the lag defined
		 * in self::$SECONDS_BETWEEN_QUERY, don't submit
		 */
			
		if(self::date_too_close() === true)
		{
			return false;
		}
		
		$dt = date("Y-m-d H:i:s", time());
		
		//insert the fulltest record
		
		$sql = 'INSERT INTO `import_fulltests` (user_agent, referer, date_test) VALUES (:ua, :rf, :dt)';
		$execute_arr = array(':ua' => $user_agent, ':rf' => $referer, ':dt' => $dt);
		
		try {
			$db = self::get_pdo();
			$statement = $db->prepare($sql);
			$result = $statement->execute($execute_arr);
			$fulltest_id = $db->lastInsertId(); //need for the related tables
			if($result == false)
			{
				self::$ERROR[__METHOD__][] = "import_fulltests error:user_agent:$user agent, referer:$referer, date_test:$dt";
				return false;
			}
		} 
		catch(Exception $e) { 
			self::$ERROR[__METHOD__][] = $e->getMessage()." for table import_fulltests";
			self::$ERROR[__METHOD__][] = "INSERT_LIST:$execute_arr";
			return false;
		}
		
		/**
		 * initial insert must be ok, so insert property values
		 */
		//loop through the reported properties, and insert them into import_fulltests_results
		
		if($fulltest_id != 0)
		{
			$ct = 0;$badct = 0;
			
			foreach($import_arr as $prop => $val)
			{
				$sql = "INSERT INTO `import_fulltests_results` (fulltest_id, property, result) VALUES (:fid, :prp, :res)";
				$execute_arr = array(':fid' => $fulltest_id, ':prp' => $prop, ':res' => $val);
				try {
					$statement = $db->prepare($sql);
					$result = $statement->execute($execute_arr);
					if($result === false)
					{
						self::$ERROR[__METHOD__][] = "import insert error:last_insert_id:self::$fulltest_id, property:$key, result:$value";
						$badct++;
					}
					$ct++;
				} 
				catch(Exception $e) { 
					self::$ERROR[__METHOD__][] = $e->getMessage()." for table import_fulltests at pos $ct"; //return exception
					self::$ERROR[__METHOD__][] = "INSERT_LIST:$execute_arr";
					return false;
				}
				
			} //end of property add loop
			
			//confirm all properties were uploaded
			
			if($badct === 0)
			{
				return $ct; //number of values successfully uploaded
			}
			else {
				//if error, delete the entire entry - the values in import_fulltests_results will also CASCADE delete
				
				try {
					$statement = $db->prepare("DELETE FROM `import_fulltests` WHERE $column_name=:fid");
					$result = $statement->execute(array(':fid' => $fulltest_id));	
					return $result;
				} 
				catch(Exception $e) { 
					self::$ERROR[__METHOD__][] = $e->getMessage()." for table $table_name, column_name=$column_name, column_value=$column_value"; //return exception 
				}
			}
			
		} //end of $fulltest_id not 0
		
		
	} //end of function
	
	
	/**
	 * @method import()
	 * import a fulltest generated from GBP - all javascript functions "fired"
	 * @returns {String|header redirect} return a string for Ajax, or redirect back to original page if no Ajax
	 */
	private static function import()
	{
		$import_arr = array();
		$ct = 0;
		
		//clean everything that comes in
		
		foreach(get_defined_vars() as $key => $val) //local environment only
		{
			if(!self::clean($key))
			{
				self::$ERROR[__METHOD__][] = "empty or invalid key in get_defined_vars at $ct,";
				exit;
			}
		}
		foreach($_POST as $key => $val)
		{
			if(!self::clean($key))
			{
				self::$ERROR[__METHOD__][] = "empty or invalid key in POST";
				exit;
			}
			
			if(!self::clean($val))
			{
				self::$ERROR[__METHOD__][] = "empty or invalid val in POST";
			}
			
			if(!empty($key) && !empty($val) && ($val !== 'undefined') && (strpos($val, 'function') === false))
			{
				$import_arr[$key] = $val;						
			}
			$ct++;
		}
		
		
		/**
		 * strip the 'mode' value from import_arr, used to tell the script
		 * if we are Ajax, or non-Ajax
		 */
		$non_ajax = false;
		if($import_arr['mode'] == 'subb') //HARD-CODED GBP PROPERTY NAME
		{
			unset($import_arr['mode']);
			$non_ajax = true;
		}
		
		$referer = $_SERVER['HTTP_REFERER'];
		if(!self::clean($referer) || strlen($referer) < 4)  //HARDED-CODED into calling form
		{
			$referer = self::get_ip();
		}
		
		$date_test   = date("Y-m-d H:i:s");
		
		//echo "useragent:".$import_arr['useragent']." referer:".$_SESSION['ORIGIN_URL'];
		
		if(isset($import_arr['useragent']) && (strlen($import_arr['useragent']) > 4))
		{
			$ct = self::insert_new_fulltest($import_arr['useragent'], $referer, $date_test, $import_arr);
			
			//if ajax, return value, otherwise redirect with a value to the query string
			
			/**
			 * strip the 'mode' value from import_arr, used to tell the script
			 * if we are Ajax, or non-Ajax
			 */
			$non_ajax = false;
			if(isset($import_arr['mode']) && $import_arr['mode'] == 'subb') //HARD-CODED GBP PROPERTY NAME
			{
				unset($import_arr['mode']);
				$non_ajax = true;
			}
			if($non_ajax === true)
			{
				header("Location: ".self::$test_path."?nonajax=true&response=".$ct);
			}
			else
			{
				echo $ct." values uploaded, thanks";
			}	
		}
		
	} //end of import()
	
}; //end of class

if(class_exists(GBP_IMPORT))
{
	$GBP_IMPORT = new GBP_IMPORT;
}

?>