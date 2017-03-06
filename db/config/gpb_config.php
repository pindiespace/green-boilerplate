<?php

/** 
 * static GBP properties set during GBP installation that 
 * don't change between transactions. These are mostly 
 * set by the user inputing data during installation. 
 * TODO: mini-cms that lets users modify these values 
 * later on!!!!!!!
 */

$gbp_config = array(

	'useclientdetect' => 'true',

	'useserverdetect' => 'true',
	
	'nofouc' => 'false',
	
	'nofout' => 'false',
	
	'gbpversion' => '1.0',
	
	'overrideclient' => 'false',
	
	'jsonpolyfill' => 'undefined', /* determined at runtime */
	
	'storagepolyfill' => 'undefined', /* determined at runtime */
	
	'usecookies' => 'false',  /* use cookies, even if we have Storage API */
	
	'uselocalstorage' => 'true',
	
	'useheaderstorage' => 'false',
	
	'returntoserver' => 'true',
	
	'useuahash' => 'true',
	
	'vampiregbp' => 'false'
);