<?php

/**
 * @class GBP_ANALYZE
 * Analyze client information on the server-side
 * User-Agent
 * other HTTP headers
 *
 * Output a GBP-defined client name and version number 
 * for lookup in the database
 *
 * PHP optimizations guided by benchmarks at:
 * http://www.phpbench.com/
 * 
 */
 
/**
 * LOAD BASE CLASS
 * always load our base class relative to our current working directory
 */ 
$curr_dir = dirname(__FILE__);

if(!class_exists('GBP')) 
{
	require_once($curr_dir.'/gbp.php');
}

/** 
 * LOAD GBP ANALYZE
 */
class GBP_ANALYZE  extends GBP {
	
	
	/** 
	 * MIME type headers, match GBP properties with
	 * the search string to use in $_SERVER['HTTP_ACCEPT']
	 * ALSO SEE: http://adtwirl.com/mobile_http_headers.php?page=2
	 */
	private static $HTTP_ACCEPT = array(
	
		//bitmaps
		'text/plain'     => 'text',               //text
		'text/html'      => 'html',               //generic HTML support
		'xhtml+xml'      => 'xhtml',              //.xhtml
		'wap.xhtml'      => 'xhtmlmp',            //xhtml MP (Mobile Profile) via WAP
		'wap.wmlscriptc' => 'wmlcscript',         //compiled WMLScript
		'wap.wmlc'       => 'wmlc',               //compiled WML 
		'wap.wml'        => 'wml',                //wml
		'image/gif'      => 'gif',                //gif support     
		'image/jpeg'     => 'jpg',                 //JPEG support
		'image/png'      => 'png',                 //PNG support
		'image/webp'     => 'webp',                //webp support
		'image/tiff'     => 'tiff',                //TIFF support
		'bmp'            => 'bmp',                 //BMP support
		'image-x-bmp'    => 'bmp',
		'image/bmp'      => 'bmp',
		'wap.wbmp'       => 'wbmp',                //WBMP support
		'xbitmap'        => 'xbitmap',             //x-xbitmap, .xbm c file in static array, used for cursor by Safari and Opera
		
		//audio
		'mpeg'           => 'mp3',
		'audio/mpeg'     => 'mp3',
		'audio/x-mpeg'   => 'mp3',
		'mp3'            => 'mp3',
		'audio/mp4'      => 'audio.mp4',
		'audio/3gpp'     => 'audio.3gpp',           //audio 3GPP files, audio/3gpp, audio 3gpp2
		'audio/amr'      => 'amr',                //Audio AMR files (.amr) Adaptive Multi-Rate ACELP Codec file. Usually for speech QT and RealPlayer will open
		'audio/amr-wb'   => 'amrwb',             //audio AMR wideband files (.awb) Adaptive Multi-Rate Wideband (AMR-WB). High-quality speech
		'wav'            => 'wav',
		'audio/wav'      => 'wav',
		'audio/x-wav'    => 'wav',
		
		//video
		'video/mp4'      => 'video.mp4',
		'video/x-mp4'    => 'video.mp4',
		'video/3gp'      => 'video.3gp',         //video 3GPP files (mime types are 3gp and 3gpp) there may be encrypted variants
		
		//java support
		'java'           => 'java',
		'java-archive'   => 'javaarchive',
		
		//Symbian SIS files
		'symbian.install'=> 'symbiansis',
		
		'rim.html'       => 'blackberry',       //blackberry browser
		'application/x-obml2d' => 'operamini'   //Opera Mini markup language, must be Opera Mini
	);

	/** 
	 * additional HTTP_xxx headers in the PHP $_SERVER array.
	 * SEE User Agent Profiles (for WAP):
	 * http://openmobilealliance.org/wp-content/uploads/2012/12/wap-248-uaprof-20011020-a.pdf
	 * Comprehensive lists at:
	 * http://fukyo-it.blogspot.com/2010/03/useful-x-headers.html
	 * http://mobiforge.com/developing/blog/useful-x-headers
	 * 
	 * NOTE: PHP caps and underscores all headers, whereas headers always use hyphensW
	 */
	private static $HTTP_HEADER_KEYS = array(
	
		'charset'               => 'HTTP_ACCEPT_CHARSET',  //accepted character sets (a list)
		'language'              => 'HTTP_ACCEPT_LANGUAGE', //accepted languages (a list)
		'encoding'              => 'HTTP_ACCEPT_ENCODING', //compressor list, e.g. GZIP, DEFLATE
		
		//no not track
		'httpdnt'               => 'HTTP_DNT', //do not track, http://www.w3.org/Submission/2011/SUBM-web-tracking-protection-20110224/#dnt-uas
		
		//host and client data
		'hostip'                => 'HTTP_X_REAL_IP',            //ip address of host
		'serverip'              => 'SERVER_ADDR',               //server ip address
		'clientip'              => 'REMOTE_ADDR',               //ip of requesting client
		'hostname'              => 'HTTP_HOST',                 //name of host (server)
		'xhr'                   => 'HTTP_X_REQUESTED_WITH',     //we're running with an ajax call, don't know if xhr1 or xhr2
		'varnish'               => 'X-Varnish-IP',              //varnish IP
		
		//network data
		'networktype'            => 'HTTP_X_NETWORK_TYPE',       //="WIFI"
		'networkcarrier'         => 'HTTP_X_CARRIER',            //="SRVC=0 TYPE=7"
		
		//these keys identify the browser (don't need to look at value)
		'operamini'              => 'HTTP_X_OPERAMINI_PHONE_UA',       //mobile, Opera mini
		//'operamini'            => 'HTTP_ALL_HTTP',                   //mobile, Opera mini
		'ucbrowser'              => 'HTTP_X_UCBROWSER_DEVICE_UA',      //mobile, UC browser
		'avantgo'                => 'HTTP_X_AVANTGO_BROWSER',          //mobile, avantgo browser
		'psp'                    => 'HTTP_X_PSP_BROWSER',
		
		//we have WAP
		'wap'                    => 'HTTP_X_WAP_PROFILE',              //mobile, WAP support, link to an XML file describing the device
		
		//user-agent
		//'HTTP_X_DEVICE_USER_AGENT',    => 'useragent',         //mobile, user-agent in transcoded web requests
		//'Device-Stock-UA',             => 'useragent',         //generic re-cast of user-agent
		
		//mobile browser features
		
		'viewportwidth'          => 'HTTP_X_BROWSER_WIDTH',            //="320"
		'viewportheight'         => 'HTTP_X_BROWSER_HEIGHT',           //="480"
		'version'                => 'HTTP_X_BROWSER_VERSION',          //="4.6.0.167"
		
		//mobile os
		'osvers'                 => 'HTTP_X_DEVICE_OS',            //="4.6.0.167 (Platform 4.0.0.157)"
		
		//device features
		'devicename'             => 'HTTP_X_DEVICE_TYPE',        //="BlackBerry 9000"
		'devicecolordepth'       => 'HTTP_X_SCREEN_COLORS',      //="65536"
		'devicescreenwidth'      => 'HTTP_X_SCREEN_WIDTH',       //="320"
		'devicescreenheight'     => 'HTTP_X_SCREEN_HEIGHT',      //="480"
		'devicescreenresolution' => 'HTTP_X_SCREEN_RESOLUTION',  //="Horz=8547PPM Vert=8547 PPM"
		
		//client location (geolocation)
		'devicealtitude'         => 'HTTP_X_GPS_CURRENT_LATITUDE',      //="39.474105"
		'devicelongitude'        => 'HTTP_X_GPS_CURRENT_LONGITUDE',     //="-104.912521"
		'devicelatitude'         => 'HTTP_X_GPS_CURRENT_ALTITUDE',      //="-1962.0 m"
		'devicedirection'        => 'HTTP_X_GPS_CURRENT_DIRECTION',     //="335.5829"
		
		//gateways
		'transcoder'             => 'HTTP_X_DEVICE_MOBILE_GATEWAY',
		
		//user information
		// 'useremail'       => 'HTTP_X_EMAIL_ADDRESS',             //="john.doe@5o9inc.com"
		//'username'        => 'HTTP_X_NAME',                      //="John Doe"
		//'userzipcode'     => 'HTTP_X_ZIPCODE'                    //="96849"
		
		//extinct browsers
		'skyfire'                => 'HTTP_X_SKYFIRE_PHONE',            //mobile, SkyFire browser
		'bolt'                   => 'HTTP_X_BOLT_PHONE_UA',            //mobile, Bolt browser
		
	);
	
	
	/** 
	 * array with our browser
	 * browser[0] = client name in gbp
	 * browser[1] = version in gbp
	 */
	private static $browser = array();
	
	/** 
	 * Array with our complete, tokenized user-agent
	 */
	private static $ua_cols = array();
	
	/** 
	 * client name list
	 */
	protected static $client_list;
	
	/** 
	 * if our user-agent parser returns a version number with an impossibly large, e.g. 2.33likj3..33kjljlj
	 * number of characters, flag it in numberize_vesion()
	 */
	protected static $VERSION_SIZE_CUTOFF = 15;
	
	/**
	 * our user-agent string
	 */
	protected static $user_agent;
	
	
	/**
	 * final array for information
	 * feature => value
	 */
	protected static $BROWSER_INFO     = array();
	
	
	/**
	 * @method __construct() constructor
	 */
	public function __construct() 
	{	
		parent::__construct();

		//self::get_client_list();

	}
	
	
	/** 
	 * @method get_client_list
	 * get a list of clients in our current GBP database
	 * self::$client_list[client name] = path to GBP file
	 */
	public function get_client_list()
	{
		self::$client_list = array();
		$files = array_filter(glob(self::$GBP_CLIENT_JS_DIR.'*'), 'is_file');
		foreach($files as &$file_name)
		{
			$file_key = basename($file_name, '.php');
			if($file_key !== self::$GBP_BROWSER_PROPERTIES_FILE) //list of GBP properties, stored in same directory
			{
				self::$client_list[$file_key] = $file_name;
			}
		}
	}
	
	
	/** 
	 * @method get_client
	 * get the client and version
	 */
	public function get_client($ua)
	{
		if(empty($ua))
		{
			self::$ERROR[__METHOD__][] = "No user agent provided";
			return false;
		}
		
		if(self::clean_str($ua)) 
		{
			if(!empty($ua))
			{
				if(self::$DEBUG)
				{
					self::$stats_arr[__METHOD__][] = "default ua:$ua";
				}
				
				if(self::scan_ua($ua))
				{
					self::$browser[1] = self::numberize_version(self::$browser[1], self::$MULTIPLIER);
				}
				
				if(self::$DEBUG)
				{
					self::$stats_arr[__METHOD__]['browser'] = self::$browser;
				}
				
				return self::$browser;
				
			}
		}
		return $browser;
	}
	
	
	/** 
	 * @method numberize_version
	 * convert a raw client-version number into a format suitable
	 * for using as a key in the client-version database, e.g.
	 * user-agent:        Chrome/35.0.1916.114
	 * raw version:       3501.916114
	 * numberized version:3500
	 */
	public static function numberize_version($version, $multiplier=1)
	{
		$orig_version = $version;
		
		if(is_numeric($version))
		{
			return (float)($version * $multiplier);
		}
		else if($version === self::$UNDEFINED)
		{
			self::$ERROR[__METHOD__][] = "incoming version was undefined";
			return $version;
		}
		else if(strlen($version) > self::$VERSION_SIZE_CUTOFF)
		{
			echo "LENGTH WAS".strlen($version)."($version)<br>";
			self::$ERROR[__METHOD__][] = "passed version exceeded size cuttoff:".self::$VERSION_SIZE_CUTOFF."($version)";
			return $version;
		}
		else {			
			$vers = strtolower($version);
		
			//replace versions with stuff like 4_2_3+ with 4.2.31
		
			$version = preg_replace('~[_-]~','.', $version); //underscores and hypens are dots
			$version = str_replace('+', '1', $version);      //a plus indicates a minor jump
			
			//split out version xx.xxsfdsd.xxxdfksdjf
			
			$matches = explode('.', $version);
			$len_matches = count($matches);
			/** 
			 * $matches[0] = major version
			 * $matches[1] = minor version 1
			 * $matches[2] = minor version 2
			 * $matches[3] = minor version 3
			 */
			 
			/** 
			 * remove leading non-numerics from the major version
			 */
			$matches[0] = preg_replace('~[^0-9]*~', '', $matches[0]);
			
			/**
			 * change internal non-numerics to numerics
			 * a = 0, b = 1
			 * matches to 5.3m14 will convert to 
			 * matches 5.31314
			 */
			foreach($matches as &$match)
			{
				$len_submatch = strlen($match);
				
				for($i = 0; $i < $len_submatch; $i++)
				{
					$str_num = ord($match[$i]);
					
					if($str_num > 48 && $str_num < 58)
					{
						$str_num -= 48;
					}
					else if($str_num > 64 && $str_num < 91)
					{
						$str_num -= 64;
					}
					else {
						$match[$i] = 0;
					}
					if($str_num > 9)
					{
						$str_num = 0;
					}
				}
			}
			
			$matches[0] .= '.'; //add back decimal point
			
			for($i = 1; $i < $len_matches; $i++)
			{
				$matches[0] .= $matches[$i];
			}
			
			if(is_numeric($matches[0]))
			{
				return (float)$matches[0]*$multiplier;
			}
			else 
			{
				self::$ERROR[__METHOD__][] = "still failed to numberize for client ".self::$browser[0].", original:'$orig_version', derived:'".$matches[0]."'";
			}
		}
		
		return self::$UNDEFINED;
	}
	
	
	private static function reset_browser()
	{
		self::$browser = array(self::$UNDEFINED, //browser[0] = client name in GBP
				self::$UNDEFINED,        //browser[1] = version in GBP
				self::$UNDEFINED         //browser[2] = os in GBP (normally unused)
						         //browser[3] = form factor (mobile, desktop, console, immoveable)
				);
	}
	

	/** 
	 * ===============================================
	 * ANALYZE CONTROLLER<br>
	 * ===============================================
	 */
	private static function scan_ua($ua, $spoofs=true)
	{
		//reset the browser array
		
		self::reset_browser();
		
		/** 
		 * Opera && spoofs
		 */
		if(self::opera($ua, $spoofs) === true)
		{
			return true;
		}
		
		/** 
		 * Google Chrome desktop && spoofs
		 */
		if(self::chrome($ua, $spoofs) === true)
		{
			return true;
		}
		
		/** 
		 * MSIE old && new && spoofs
		 */
		if(self::msie($ua, $spoofs) === true)
		{
			return true;
		}
		
		/** 
		 * Mozilla Firefox && spoofs
		 */
		if(self::firefox($ua, $spoofs) === true)
		{
			return true;
		}
		
		/** 
		 * Apple Safari && spoofs
		 */
		if(self::safari($ua, $spoofs) === true)
		{
			return true;
		}
		

		
		
		return false;
	}

	
	/** 
	 * user-agent detection strategy
	 * do in order of major, minor, ancient
	 * scan out spoofs first
	 * use preg_match to fill self::$browser
	 */ 
	
	
	/* 
	 * ===============================================
	 * OPERA
	 * ===============================================
	 */
	private static function opera_spoofs(&$ua)
	{
		if(strpos($ua, 'opera') === false)
		{
			/** 
			 * rewrite client versions with different name,s 
			 * or versions too close to differentiate in GBP tests
			 */
			//$ua = preg_replace('~(something)~', 'opera', $ua);
		}
		else
		{
			/** 
			 * client name is present, but not the same
			 */
		}
		
	}
	
	
	private static function opera($ua, $spoofs=false)
	{
		
		if(preg_match('~(opr|opera)(\/| )([0-9\.]*)~', $ua, $matches))
		{
			self::$browser[0] = 'opera';
			
			if($spoofs && self::opera_spoofs($ua))
			{
				return true;
			}
			
			if(preg_match('~version/([0-9\.]*)~', $ua, $matches_version))
			{
				self::$browser[1] = $matches_version[1];
			}
			
			else
			{
				self::$browser[1] = $matches[3];
			}

			
			return true;
		}
	}
	
	
	/** 
	 * ===============================================
	 * GOOGLE CHROME
	 * ===============================================
	*/
	
	
	/** 
	 * @method chrome_spoofs
	 * detect browsers spoofing Google Chrome
	 */
	private static function chrome_spoofs(&$ua)
	{

		if(strpos($ua, 'chrome') === false)
		{
			/** 
			 * rewrite client versions with different names 
			 * or versions too close to differentiate in GBP tests
			 * 
			 * Superbird
			 * SWare Iron
			 */
			$ua = preg_replace('~(superbird|iron)~', 'chrome', $ua);
		}
		else
		{
			/** 
			 * rewrite clients identical to gbp
			 */
			$ua = preg_replace('~(chromeframe)~', 'chrome', $ua); //!!!!! flag itobsolete extinct IE plugin
			
			/** 
			 * client name is present, but not the same
			 */
			
		}
		
		
		return false;
	}
	
	
	/** 
	 * @method chrome
	 * detect Google Chrome
	 */
	private static function chrome($ua, $spoofs=false)
	{
		if($spoofs && self::chrome_spoofs($ua))
		{
			return true;
		}
		if(strpos($ua, 'chrome/') !== false)
		{
			self::$browser[0] = 'chrome';
			
			if(preg_match('~chrome\/([0-9\.]*)~', $ua, $matches))
			{
				self::$browser[1] = $matches[1];
				return true;
			}
		}
		return false;
	}
	
	
	/** 
	 * ===============================================
	 * MSIE
	 * ===============================================
	*/
	
	
	/** 
	 * @method msie_spoofs
	 * catch browsers pretending to be MSIE, if desired
	 */
	private static function msie_spoofs(&$ua)
	{
		if(strpos($ua, 'trident') !== false)
		{
			/** 
			 * rewrite client versions with different names 
			 * or versions too close to differentiate in GBP tests
			 * 
			 * sitekiosk - detect by rendering engine, since varies with versions of sitekiosk
			 * tencent traveler - ie chinese exact clone
			 */
			$spoof_regex = '~()~';
			
			if(strpos($ua, 'msie') === false)
			{
				//spoofers need a 'msie'
			}
			else
			{
				//
			}
		
		}
		else
		{
			/** 
			 * client name is present, but not the same
			 */
			
		}
				
		return false;
	}
	
	
	/** 
	 * @method msie
	 * detect core Microsoft Internet Explorer
	 */
	private static function msie($ua, $spoofs=false)
	{
		if($spoofs && self::msie_spoofs($ua)) //our spoofers may not have 'msie' in their user-agent
		{
			return true;
		}
		
		if(strpos($ua, 'trident/') !== false)
		{
			/**
			 * versions of trident 7.0 and greater (MSIE 11+)
			 * don't have MSIE in their user agent, instead
			 * listed in rv:
			 */
			self::$browser[0] = 'msie';
			
			if(strpos($ua, 'msie') === false)
			{
				self::$browser[0] = 'msie';
				if(preg_match('~rv:([0-9\.]*)~', $ua, $matches))
				{
					self::$browser[1] = $matches[1];
					return true;
				}
			}
			else
			{
				//'msie' is present in string, possible spoofer
				
				if(preg_match('~msie ([0-9\.]*)~', $ua, $matches))
				{
					self::$browser[1] = $matches[1];
					return true;
				}
			}
			
		}
		else if(strpos($ua, 'msie') !== false)
		{	
			/** 
			 * no Trident, but msie - probably an old version
			 */
			self::$browser[0] = 'msie';
			if(preg_match('~msie ([0-9\.]*)~', $ua, $matches))
			{
				self::$browser[1] = $matches[1];
				return true;
			}
		}
		return false;
	}


	/** 
	 * ===============================================
	 * MOZILLA FIREFOX
	 * ===============================================
	*/
	
	
	/** 
	 * @method firefox_spoofs
	 * detect browsers spoofing Firefox
	 * For browsers that are extremely close, over-write the user-agent
	 * For browsers that are significantly different, catch the spoof
	 */
	private static function firefox_spoofs(&$ua)
	{
		/** 
		 * rewrite development spoofs
		 * also very similar browsers
		 * Palemoon????
		 */
		
		if(strpos($ua, 'gecko') !== false)
		{
			/** 
			 * the spoof_regex includes the browser under different names (e.g. development builds) and 
			 * browsers that are so similar to FF that there is no reason to differentiate them
			 * Palemoon - NOT A SPOOF
			 */
			
			$spoof_regex = '~(alienforce|namoroka|icecat|iceweasel|minefield|shiretoko|namoroka|bonecho|lorentz|granparadiso|aurora|phoenix|firebird|thunderbird)~';
			
			if(strpos($ua, 'firefox') === false)
			{
				$ua = preg_replace($spoof_regex, 'firefox', $ua); //no firefox in user-agent
			}
			else
			{
				//$ua = preg_replace($spoof_regex, '', $ua); //firefox already there, zap the spoof string
			}
		}
		return false;
	}
	
	
	/**
	 * @method firefox
	 * detect Mozilla Firefox core
	 */
	private static function firefox($ua, $spoofs=false)
	{
		if($spoofs && self::firefox_spoofs($ua)) //FF spoofers may not have 'firefox' in their user-agent
		{
			return true;
		}
		
		if(strpos($ua, 'firefox') !== false)
		{
			self::$browser[0] = 'firefox';
			
			if(preg_match('~firefox(\/| )([0-9\.]*)~', $ua, $matches))
			{
				if(isset($matches[2])) self::$browser[1] = $matches[2];
				return true;
			}
		}
		return false;
	}
	
	
	/** 
	 * ===============================================
	 * SAFARI
	 * ===============================================
	*/
	
	
	/**
	 * @method safari_spoofs
	 * detect browsers spoofing Apple safari
	 */
	private static function safari_spoofs(&$ua)
	{
		if(strpos($ua, 'applewebkit') !== false)
		{
			if(strpos($ua, 'safari') === false)
			{
				/** 
				 * handle clients that need inference based on webkit version (only some)
				 * lunascape uses multiple rendering engines, assign based on engine version
				 */
				//$match_regex = '~(wkiosk|lunascape|origyn)~';
				
				//rewrite as safari using webkit verion
				if(preg_match('~applewebkit\/([0-9\.]*)~',$ua, $matches))
				{
					//remove non alphanumerics, since they will mess up AppleWebKit version
					
					$ua .= ' safari/'.$matches[1]." ";
					
					return false; //return rewritten ua for further processing
				}
				
				//$spoof_regex = '~()~';
			}
			else
			{
				/** 
				 * client name is present, but not the same
				 */
			}
		
		}
		
		return false;
	}
	
	
	/** 
	 * @method safari()
	 * detect core Apple Safari
	 */
	private static function safari($ua, $spoofs=false)
	{
		if($spoofs && self::safari_spoofs($ua))
		{
			return true;
		}
		
		if(strpos($ua, 'safari') !== false)
		{
			self::$browser[0] = 'safari';
				
			if(strpos($ua, 'version') !== false)
			{
				if(preg_match('~version\/([0-9\.]*)~', $ua, $matches_version))
				{
					self::$browser[1] = $matches_version[1];
					return true;
				}
			}
			else if(preg_match('~safari\/([0-9\.]*)~', $ua, $matches))
			{
				/** 
				 * some old versions of Safari don't have 'safari' in the 
				 * user agent, so run a regexpto get the int value of webkit
				 * NOTE: this assumes we've pulled out safari spoofs using different webkits
				 */
				 
				$v = self::numberize_version($matches[1], 1);
				
				if($v > 533 && $v < 536)
				{
					$v = '5.0';
				}
				else if($v > 526 && $v < 534)
				{
					$v = '4.0';
				}
				else if($v > 420 && $v < 526)
				{
					$v = '3.0';
				}
				else if($v > 411 && $v < 420)
				{
					$v = '2.0';
				}
				else if($v > 100 && $v < 315)
				{
					$v = '1.2';
				}
				else if($v <= 100)
				{
					$v = '1.0';
				}
				
				//assign the version
				
				self::$browser[1] = $v;
				return true;
			}
		}
		return false;
	}
	
	
	/** 
	 * @method scan_for_browser_features() in the user agent
	 * if we can't identify the user-agent, scan for the rendering engine
	 * and identify a probable vintage of the browser
	 */
	private static function scan_for_browser_features($ua_cols, $len)
	{
		$found_feature = false;
		 
		if(!require_once(self::$DB_LOOKUP_PATH.self::$DB_FEATURE_FILE))
		{
			foreach($ua_cols as $value) //a substring from ua_cols, e.g. 'applewebkit's
			{
				foreach($FEATURES as $feature_key => &$feature_arr) //$feature_key corresponds to GBP property
				{
					foreach($feature_arr as &$feature) //list of possible values for the GBP property
					{
						if($value == $feature)
						{			
							switch($feature_key)
							{
								case 'enginename':
								self::$BROWSER_INFO['enginename'] = $feature;
								self::$BROWSER_INFO['engineversion'] = self::get_version_from_tokens($ua_cols,  $feature, $len);
								break;
								default:
								self::$BROWSER_INFO[$feature_key] = $feature;
								$found_feature++;
								break;
							}
						}
					}
					
				}
				
			}
			 
			if($found_feature)
			{
				return true;
			}
			 
			return false;
		}		 		  
	}


	/** 
	 * @method scan_accept_header()
	 * scan HTTP_ACCEPT headers in the $_SERVER array (mostly for mobile devices)
	 * augment database detection by detecting MIME types that can be processed
	 *
	 * we pass a key, which is a GBP property. If the key exists in self::$ACCEPT_HEADER,
	 * we recover the MIME type fragment to scan $_SERVER['HTTP_ACCEPT'] with. If we
	 * find a value, we return true, since we are just testing for the presence of
	 * allowed MIME types for our browser.
	 *
	 * NOTE: we aren't using this header to determine priority. Instead, we are
	 * using it to determine if the client supports a requested type, based on
	 * its appearance in the header.
	 *
	 * @param {String} $key the GBP property we're trying to find
	 * @returns {Boolean} if found, true, else, false
	 */
	private static function scan_accept_header()
	{
		if(strlen($_SERVER['HTTP_ACCEPT']) > 3) //don't bother with */* type stuff, many browser have nothing here
		{
			self::$ACCEPT_HEADER = $_SERVER['HTTP_ACCEPT'];
			self::clean(self::$ACCEPT_HEADER);
			
			if(strlen(self::$ACCEPT_HEADER) > 3)
			{
				foreach(self::$ACCEPT_HEADER_PROPERTIES as $key => $val)
				{
					if(isset(self::$BROWSER_INFO[$key]) && self::$BROWSER_INFO[$key] == self::$UNDEFINED)
					{
						if(strpos(self::$ACCEPT_HEADER, $val) !== false)
					{
							self::$BROWSER_INFO[$key] = 'true';
						}
					}
				}
			}
		}
	}
        
        
        /**
         * @method scan_server_headers()
         * check if certain header keys exist, and return their value if
         * they are found. Done rarely, so not in a big array loop.
         *
         * NOTE: we only use this to find a property. No server-side manipulation
         * occurs based on the presence of the headers
         * 
         * @param {String} $key key to scan server with
         * @returns {String} value of header, or 'undefined' if not found
         */
        private static function scan_server_headers($prop)
        {
                if (isset(self::$HTTP_HEADER_KEYS[$prop]))
                {
                        self::sanitize_str($_SERVER[$HTTP_HEADER_KEYS[$prop]]);
                        return $_SERVER[$HTTP_HEADER_KEYS[$prop]];
                }
                
                return false;
        }
        
       
        /**
         * @method isMobile
         * determine if we have a mobile device, if we haven't been lucky before
         * modified version of detectMobileBrowsers
         * http://detectmobilebrowsers.com/
         */
        private static function is_mobile($ua)
        {
		//return (preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i',$useragent)||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($useragent,0,4)));
        }
	
	/**
	 * look for mobile OS
	 */
	private static function is_mobile_os($ua)
	{
		return preg_match('~(android|ios|bada|windows (ce|phone)|symbian|blackberry|bb\d+|meego|midp|mmp|docomo|webos|wos|palm( os)?|avantgo|hiptop)~', $ua);
	}
	
        /**
         * @method isTablet
         */
        private static function is_tablet($ua)
        {
               return preg_match('/(tablet|android|ipad|playbook|silk|kindle)/', $ua); 
        }


}; //end of class

