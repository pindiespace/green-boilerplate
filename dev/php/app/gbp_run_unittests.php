<?php
	
class GBP_RUN_UNITTESTS {
	
	/**
	 * variables
	 */
	private static $FILENAME         = '';
	
	//error reporting
	
	private static $STATUS           = array(); //normal program flow
	private static $ERROR            = array(); //errors or exceptions
	
	//GBP standard defs
	
	private static $UNDEFINED        = "undefined";
	private static $TRUE             = "true";
	private static $FALSE            = "false";
	
	//number of decimal positions to truncate versions
	
	private static $MAX_VERSION_DIFF = 1;   
	
	//we assume that the calling file is in the GBP root directory
	
	private static $DB_DIR           = 'dev/db/browser/';
	private static $UAANALYZE_DIR    = 'php/gbp/ua-analyze.php';
	private static $ua_analyze       = NULL;
	
	//average processing time
	
	private static $PROCESSING_TIME        = 0.0;
	private static $CLIENT_PROCESSING_TIME = 0.0;
	
	
	/**
	 * @constructor
	 * runs once, if file is correct format
	 */
	public function __construct ()
	{

	}
	
	
	/**
	 * @method init_uaanalyze
	 * confirm we can load our UAAnalyze class, and do any
	 * required initialition of the class
	 */
	private function init_uaanalyze ($file_name)
	{
		self::$ERROR[__METHOD__][] = "DB file name:$file_name";
		self::$ERROR[__METHOD__][] = "UAAnalyze path:".self::$UAANALYZE_DIR;
		self::$ERROR[__METHOD__][] = "cwd:".getcwd();
		
		if(!file_exists(self::$UAANALYZE_DIR))
		{
			throw new Exception(__METHOD__.":failed to find UAAnalyze class file at:".self::$UAANALYZE_DIR);
		}
		else
		{
			self::$ERROR[__METHOD__][] = "found UAAnalyze class file";
		}
		
		
		require_once(self::$UAANALYZE_DIR);
		if(class_exists(UAAnalyze))
		{
			self::$ERROR[__METHOD__][] = "UAAnalyze initialized";
			self::$ua_analyze = new UAAnalyze(false); //false = NO DEBUG
		}
		else
		{
			throw new Exception(__METHOD__.":failed to load UAAnalyze class at:".self::$UAANALYZE_DIR);
		}
		
		$file_name = trim(strip_tags($file_name));
		return $file_name;
	}
	
	
	/**
	 * @method run_unittests
	 * runs the unit-tests for all clients in the unit-test file
	 */
	public function run_unittests ($file_name)
	{
		try {
			$file_arr = self::open_unittest_file($file_name);
			$results  = self::parse_unittest_file($file_arr);
			if(is_array($results))
			{
				$results['stats'] = self::compute_stats($results['clients']);
				unset($results['clients']); //initialize
				//PRINT JSON IF DESIRED HERE
			}
			
		}
		catch (Exception $e)
		{
			self::$ERROR[__METHOD__][] = $e->getMessage();
			self::print_error_json();
		}
		
		return $results;
	}

	
	/**
	 * @method open_unittest_file
	 */
	public function open_unittest_file ($file_name)
	{
		$file_arr = array();
		
		$path = self::$DB_DIR;
		
		//check file type (.json, .txt, .xml)
		
		$file_parts = pathinfo($file_name);
		switch($file_parts['extension'])
		{
			case "json":
				$path .= 'json';
				break;
			
			case "txt":
				$path .= 'txt';
				break;
			
			case "xml":
				$path .= 'xml';
				break;
			
			case "": // Handle file extension for files ending in '.'
			case NULL: // Handle no file extension
			default:
				throw new Exception(__METHOD__.":invalid db file type:$file_name");
				break;
		}
		
		//complete the path, and test if file exists
		
		$path .= '/'.$file_name;
		
		if(file_exists($path))
		{
			self::$ERROR[__METHOD__][] = "db file path:$path";
		}
		else
		{
			throw new Exception(__METHOD__.":db file was not found at path:$path");
		}
	
		
		//try to load the file as an array
		
		$file_arr  = file($path); //this could be quite large
		
		if(!is_array($file_arr))
		{
			throw new Exception("filed to load unittest file at $path");
		}
		
		//check to see the file is the right size
		
		$num_lines = count($file_arr);
		
		if($num_lines < 6)
		{
			throw new Exception ("unittest file is too small at $path (count:".$num_lines.")");
		}
		
		return $file_arr;	
	}

	
	/**
	 * @clear_client_arr
	 * clear the client array object between unit tests for a particular client.
	 * Defines the object structure of the client array
	 * @returns {Array} an empty client array
	 */
	private function clear_client_arr()
	{
		$client_arr = array();
		$client['uas'] = array();
		$client['uaresults'] = array();
		$client['name'] = self::$UNDEFINED;
		$client['version'] = self::$UNDEFINED;
		
		return $client_arr;
	}
	
	
	/**
	 * @method read_unittest_file
	 */
	private function parse_unittest_file ($file_arr)
	{
		$results = array();
		
		$COLLECT_NOTHING = -1;
		$COLLECT_UAS     =  0;
		$COLLECT_INFO    =  1;
		$PROCESS         =  2;
		
		//zero processing time
		
		self::$PROCESSING_TIME = 0.0;
		
		/**
		 * get a list of clients and versions from the file. This allows us
		 * to look for mismatches.
		 */
		$client_mismatch = array();
		$len = count($file_arr);
		$num_clients = 0;
		for($i = 0; $i < $len; $i++)
		{
			if(strpos($file_arr[$i], 'client=') !== false)
			{
				$arr = explode('=', $file_arr[$i]);
				if(($i + 1) < $len)
				{
					$arr1 = explode('=', $file_arr[$i+1]);
					$client_mismatch[] = array('name' => trim($arr[1]), 'version' => trim($arr1[1]));
					$num_clients++;
				}
				else
				{
					self::$ERROR[__METHOD__][] = 'No version for client:'.$file_arr[$i].' at line #'.$i;	
				}
			}
		}
		
		//no clients should trigger exit
		
		if($num_clients == 0)
		{
			throw new Exception("no clients found in unittest file, line count:".count($file_arr));
		}
		
		//clear our working client array
		
		$client = self::clear_client_arr();
		
		//client-results
		
		$client_results                  = array();    //individual client results
		$client_results['num_uas']       = 0;
		
		//create results array and local results array
		
		$results                         = array();       //overall
		$results['clients']              = array();
		$num_clients                     = 0;
		$num_uas                         = 0;
		$num_lines                       = 0;
		
		$state = $COLLECT_NOTHING;
		
		foreach($file_arr as $line)
		{
			if($state === $COLLECT_UAS)
			{
				if(strpos($line, '[end]') === false) //otherwise, we add [end] to uas
				{
					$client['uas'][] = trim($line);
					$num_uas++;
				}
			}
			
			//set state
			
			if(strpos($line, '[start]') !== false)
			{
				$state = $COLLECT_INFO;
			}
			else if(strpos($line, '[ualist]') !== false)
			{
				$state = $COLLECT_UAS;
			}
			else if(strpos($line, '[end]') !== false)
			{
				//in-place addition of client scores
				
				$client['uaresults'] = self::process_uas($client['uas'], array($client['name'], $client['version']), $client_mismatch, $num_lines);
				$client['uas'] = array();
				$results['clients'][$client['name'].'-'.$client['version']] = $client;
				$client = self::clear_client_arr();
				$num_clients++;
				$state  = $COLLECT_NOTHING;
			}
			else if(strpos($line, 'client=') !== false)
			{
				if($state === $COLLECT_INFO)
				{
					$arr = explode('=', $line);
					$client['name'] = trim($arr[1]);
				}
				else
				{
					self::set_error(__METHOD__, "at line $num_lines, client info in wrong position");
				}
			}
			else if(strpos($line, 'version=') !== false)
			{
				if($state === $COLLECT_INFO)
				{
					$arr = explode('=', $line);
					$client['version'] = trim($arr[1]);
				}
				else
				{
					self::set_error(__METHOD__, "at line $num_lines, version info in wrong position");
				}
			}
			
			$num_lines++;
		}
		
		if($num_lines == 0)
		{
			throw new Exception("no readable lines in unittest user-agent file:".count($file_arr));
		}
		
		if($num_clients == 0)
		{
			throw new Exception("no clients found in unittest file, line count:".count($file_arr));
		}
		
		$results['num_lines']   = $num_lines;
		$results['num_clients'] = $num_clients;
		$results['num_uas']     = $num_uas;
		$results['total_processing_time'] = self::$PROCESSING_TIME/$num_uas;
		
		return $results;
	}
	
	
	/**
	 * @method parse_json_file
	 */
	private function parse_json_file($dir)
	{
		
	}
	
	
	/**
	 * @method parse_xml_file
	 */
	private function parse_xml_file($dir)
	{
		
	}
	
	
	/**
	 * @method clear_compare_results
	 * create the default array (object) results of a test of a user-agent against
	 * the UAAnalyze program
	 * @returns {Array} default compare_results array with initialized values
	 */
	private function clear_compare_results()
	{
		$compare = array();
		$compare['match_client']     = self::$UNDEFINED;
		$compare['version_diff']    = 0;
		$compare['test_client']      = self::$UNDEFINED;
		$compare['test_version']     = 0;
		$compare['user_agent']       = '';
		$compare['mismatch_client']  = self::$UNDEFINED;
		$compare['mismatch_version'] = 0;
		
		return $compare;
	}
	
	
	/**
	 * @method process_ua()
	 * check each user-agent against UAAnalyze, and return the results.
	 * @param {Array} $ua_arr an array of user-agent strings
	 * @param {Array} $true_browser client and version from the unittest file associate with user-agents in array
	 * @param {Array} $client_mismatch a list of clients and versions. If we fail to match the correct client and
	 * version, this array allows a search to see if the UAAnalyze mis-identified the user-agent as another client/verison
	 * verus no client/version at all
	 * @param {Array} $line_num if set, the line number in the original file where the bad ua match occurred
	 * @returns {Boolean}, if no error, return true, else false
	 */
	private function process_uas ($ua_arr, $true_browser, $client_mismatch, $line_num)
	{
		$client_results = array();
		$len = count($ua_arr);
		self::$CLIENT_PROCESSING_TIME = 0.0;
		
		for($i = 0; $i < $len; $i++)
		{
			//get the start time
			
			$curTime = microtime(true);
			
			//run UAAnalyze
			
			$browser = self::$ua_analyze->get_ua_data($ua_arr[$i], true); //true = browser name and version only
			
			//record time elapsed
			
			self::$PROCESSING_TIME += round(microtime(true) - $curTime,3)*1000;
			self::$CLIENT_PROCESSING_TIME += round(microtime(true) - $curTime,3)*1000;
			
			$compare = self::clear_compare_results();
			
			//check client name
			
			if($browser[0] === self::$UNDEFINED)
			{
				$compare['match_client'] = self::$UNDEFINED;
			}
			else if($browser[0] !== $true_browser[0]) //client name  doesn't match expected name
			{
				$compare['match_client'] = self::$FALSE;
			}
			else
			{
				$compare['match_client'] = self::$TRUE;
			}
			
			
			//check version
			
			if($browser[1] !== $true_browser[1]) //client version
			{
				$compare['version_diff'] = round(floatval($browser[1])/100 - floatval($true_browser[1]), 2); //number of versions apart
			}
			else
			{
				$compare['version_diff'] = self::$TRUE;
			}
			
			$compare['test_client'] = $browser[0];
			
			//round version from user-agent, and compare to test file version
			
			$compare['test_version'] = round($browser[1]/100, self::$MAX_VERSION_DIFF);
			if($compare['match_client'] !== self::$TRUE || $compare['version_diff'] > 1.0)
			{
				$compare['user_agent'] = $ua_arr[$i];
				$compare['line_num']   = $line_num;
				
				foreach($client_mismatch as $clm)
				{
					if($clm['name'] === $browser[0] &&
					   $clm['version'] === $browser[1])
					{
						$compare['mismatch_client']  = $clm['name'];
						$compare['mismatch_version'] = $clm['version'];
					}
				}
				
			}
			
			//attach the results to the array
			
			$client_results[] = $compare;
			
		}
		
		$client_results['av_processing_time'] = self::$CLIENT_PROCESSING_TIME/$len;
		
		return $client_results;	
	}
	
	
	/**
	 * @method compute_stats()
	 * compute stats for individual clients
	 */
	private function compute_stats ($clients)
	{
		$stats = array();
		$stats['clients_tested'] = 0;
		$stats['matches']        = 0;
		$stats['no_matches']     = 0;
		$stats['mismatches']     = 0;
		$stats['undefined']      = 0;
		
		$stats['clients']        = array();
		$client_count            = 0;
		
		foreach($clients as $client_key => $client)
		{
			$ua_count = 0;
			
			$stats['clients'][$client_key] = array();
			$stats['clients'][$client_key]['matches']    = 0;
			$stats['clients'][$client_key]['no_matches'] = 0;
			$stats['clients'][$client_key]['mismatches'] = 0;
			$stats['clients'][$client_key]['undefined']  = 0;
			
			$stats['clients'][$client_key]['av_processing_time'] = $client['uaresults']['av_processing_time'];
			
			//this was attached to uaresults, remove to simplfy processing $client['uaresults'] below
			
			unset($client['uaresults']['av_processing_time']);
			
			//loop through results for each user-agent, collecting stats
			
			foreach($client['uaresults'] as $uaresults)
			{	
				if($uaresults['match_client'] === self::$TRUE)
				{
					$stats['matches']++;
					$stats['clients'][$client_key]['matches']++;
				}
				else if($uaresults['match_client'] === self::$UNDEFINED)
				{
					$stats['undefined']++;
					$stats['clients'][$client_key]['undefined']++;
					$stats['clients'][$client_key]['undefined_uas'][] = $uaresults;
				}
				else
				{
					$stats['no_matches']++;
					$stats['clients'][$client_key]['no_matches']++;
					$stats['clients'][$client_key]['false_uas'][] = $uaresults;
				}
				
				$ua_count++;
				
			} //end of uatest loop
			
			$stats['clients'][$client_key]['total'] = $ua_count;
			
			$client_count++;
			
		} //end of client list loop
		
		$stats['clients_tested'] = $client_count;
		
		return $stats;
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
	 * set the error array.
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
	public function print_error_json ()
	{
		return "<script>\nvar JSONError = ".json_encode(self::$ERROR).";\n</script>\n";
	}
	
	
	/**
	 * @method run
	 * run the unit test
	 * @returns {Array} a PHP array with the results, by client
	 */
	public function run_tests ($file_name) {
		
		$results = array();
		
		try {
			$file_name = self::init_uaanalyze($file_name);
			if($file_name !== false)
			{
				$results = self::run_unittests($file_name);	
			}
			else
			{
				throw new Exception(__METHOD__.":file name was not set ($file_name)");
			}
		}
		catch (Exception $e)
		{
			self::$ERROR[__METHOD__][] = $e->getMessage();
			self::print_error_json();
		}
		
		return $results;
	}
	
	
}; //end of class
	

?>