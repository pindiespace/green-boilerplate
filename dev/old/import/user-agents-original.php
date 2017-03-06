<?php 

/**
 * include file for ua-analyze.php, database as a PHP array.
 * array keys are written using JavaScript 'camelCase' for rapid 
 * re-writes to the downloaded JavaScript object.
 * @version 1.0  Dec 2012
 * @author Pete Markiewicz
 *
 * SOURCES:
 *
 * Quirksmode CSS support on mobile browsers
 * http://www.quirksmode.org/m/css.html
 *
 * Mobile browser feature list
 * http://mobilehtml5.org/
 * 
 * JavaScript ECMA5 list (http://kangax.github.com/)
 * http://kangax.github.com/es5-compat-table/#showold
 *
 * CAN I Use database (JSON)
 * https://github.com/Fyrd/caniuse#readme
 *
 * HTML4 compliance (nice and old)
 * http://www.robinlionheart.com/stds/html4/results
 *
 * Web Devout (doctypes and older CSS2 testing, very detailed tables)
 * http://www.webdevout.net/
 *
 * ECMA Script engine list
 * http://en.wikipedia.org/wiki/List_of_ECMAScript_engines
 *
 * Doctype switching table
 * http://www.webdevout.net/doctype-switching
 *
 * Another doctype switching table, with detailed summaries
 * http://hsivonen.iki.fi/doctype/
 * 
 * Old Acid2 tests
 * http://www.howtocreate.co.uk/acid/
 *
 * FAQ and use
 * http://caniuse.com/#info_faq
 *
 * CSS3 Selectors test (dynamic per browser)
 * http://tools.css3.info/selectors-test/test.html
 *
 * GIT pull requests
 * https://help.github.com/articles/using-pull-requests
 *
 * GOOGLE MODERATOR (Use ourselves)
 * http://www.google.com/moderator/#15/e=ae425&t=ae425.40&f=ae425.6763b3
 *
 * Current HTML5 browser support (nice subclassing of CSS features)
 * TODO: categorize GBP this way?
 * http://findmebyip.com/litmus
 * 
 * Browser adoption rates
 * http://www.netmagazine.com/features/developers-guide-browser-adoption-rates
 *
 * MSIE:
 * Standards mode only is listed (need to test for standards mode!)
 * 
 * Firefox:
 * http://en.wikipedia.org/wiki/Firefox_release_history
 * 
 * TESTS
 *
 * Test suite (like Acid 3)
 * http://tests.caniuse.com/
 * 
 * 
 * Acid 2
 * http://www.webstandards.org/files/acid2/test.html#top
 * 
 * Acid 3
 * http://acid3.acidtests.org/
 *
 * HTML5 Feature test
 * http://testHTML5.com/index.html
 *
 * Futuremark Peacekeeper (also does system analysis, takes several minutes to complete)
 * http://peacekeeper.futuremark.com/
 *
 * UA 000Detector (VERY SIMILAR TO MY BOOTSTRAP), but GRABS JS feature detection 
 * tests, and adds them to the Database!
 * http://detector.dmolsen.com/
 * PHP Parser at:
 * https://github.com/tobie/ua-parser
 *
 * https://github.com/dmolsen/Detector/tree/v085/lib/Detector
 *
 * Mobile-optimized solutions using server-side (theory)
 * http://www.dmolsen.com/mobile-in-higher-ed/2012/01/18/introducing-detector-combining-browser-feature-detection-for-your-web-app/
 *
 * Modernizr-server
 * Based on Modernizr-server, which is EXACTLY the server-side update idea based on the first
 * download to the client. Saves results in a $_SESSION array
 * https://github.com/jamesgpearce/modernizr-server
 *
 * HTML5 Test
 * http://testHTML5.com/index.html
 *
 * CSS Selectors test
 * http://tools.css3.info/selectors-test/test.html
 *
 * IE "Galactic" space test 
 * http://ie.microsoft.com/testdrive/Performance/Galactic/Default.html
 * 
 * IE Fishtank
 * http://ie.microsoft.com/testdrive/Performance/FishIEtank/
 */
 
/**
 * all browsers earlier than 2007 are automatically "ancient"
 * all browsers being used > 5 years after their release date 
 * are automatically considered "ancient"
 *
 * user-agent database. This file contains common definitions, rare and 
 * extinct browsers (< 0.1% in 2012) are in a separate file with the same format
 * browsers are listed in order of uniqueness, so if iron is a clone of chrome, it is 
 * listed before chrome.
 * 
 * Properties starting with 'is' or 'has' are Boolean
 * Other properties are string, numbers, or dates
 */
$USER_AGENTS = array(

/*
	'all'    => array(
			'000' => array(
				'browserName'          => 'undefined', //we get it from the second dimension of this array
				'browserFork'          => 'undefined', //close browser browserFork, skip to base browser if browserFork is defined with same version numbers
				'browserVersion'       => 'undefined',
				'browserEngineName'    => 'undefined',
				'browserEngineVersion' => 'undefined', //rendering engine
				'browserReleaseDate'   => 'undefined', //release by month/day/year
				'browserIsAncient'     => 'undefined', //modern by default
				'browserIsFuture'      => 'undefined', //NOT SET HERE true if version is newer than anything in our db
				'browserRendersInCloud'=> 'undefined',
				'deviceResX'           => 'undefined',
				'deviceResY'           => 'undefined',
				'deviceIsMobile'       => 'undefined', //mobile and tablet
				'deviceIsTablet'       => 'undefined', //tablets, but also always mobile
				'deviceIsTV'           => 'undefined', //television
				'deviceIsSurface'      => 'undefined', //surface of desk, wall, windows, etc
				'deviceIsTextReader'   => 'undefined',
				'deviceIsWAP'          => 'undefined',
				'deviceIsFeaturephone' => 'undefined',
				'deviceIsMediaPlayer'  => 'undefined',
				'deviceIsGameConsole'  => 'undefined',
				'deviceIsDesktop'      => 'undefined',
				'hasHTTPS'             => 'undefined',
				'hasWML'               => 'undefined',
				'hasCHTML'             => 'undefined',
				'hasIMode'             => 'undefined',
				'hasHTML'              => 'undefined',
				'hasHTML4'             => 'undefined',
				'hasHTML5'             => 'undefined',
				'hasCookies'           => 'undefined', //NEW
				'hasJavaScript'        => 'undefined',
				'hasAjax'              => 'undefined', //NEW
				'hasXMLHttpRequest'    => 'undefined', //NEW
				'hasXMLHttpRequest2'   => 'undefined',
				'hasCanvas'            => 'undefined',
				'hasCanvasText'        => 'undefined', //NEW
				'hasHTML5Audio'        => 'undefined', //NEW
				'hasHTML5Video'        => 'undefined', //NEW
				'hasIFrames'           => 'undefined',
				'hasSVG'               => 'undefined', //NEW
				'hasInlineSVG'         => 'undefined', //NEW
				'hasCSSFontFace'          => 'undefined',
				'hasGeolocation'       => 'undefined',
				'hasWebGL'             => 'undefined', //only newer versions
				'hasLowBattery'        => 'undefined', //NEW
				'hasWebWorkers'        => 'undefined',
				'hasWebSockets'        => 'undefined',
				'hasDragAndDrop'       => 'undefined',
				'hasCSS'               => 'undefined',
				'hasCSS2'              => 'undefined', //really CSS 2.1 TODO MODIFY THIS
				'hasCSS3'              => 'undefined',
				'hasJS'                => 'undefined',
				'hasJSON'              => 'undefined', //NEW
				'hasQuerySelector'     => 'undefined', //NEW
				'hasDOM0'              => 'undefined',
				'hasDOM1'              => 'undefined',
				'hasDOM2'              => 'undefined',
				'hasDOM3'              => 'undefined',
				'hasECMAScript5'       => 'undefined',
				'testAcid2'            => '0',         //testAcid3 is numerical
				'testAcid3'            => '0',
				'testHTML5'            => '0',
				)	
	),
	*/
	'iron' => array(
			'000' => array(
				'browserFork'   => 'chrome',
				),
	),
	
	'chrome' => array(
			'000' => array(
				'browserFork'          => 'chrome',
				'browserEngineName'    => 'applewebkit',
				'browserEngineVersion' => '0.0',
				'browserIsAncient'     => 'undefined', //if release date is past 2007, we must test
				'deviceIsMobile'       => 'false',
				'deviceIsWAP'          => 'false',
				'deviceIsFeaturephone' => 'false',
				'deviceIsMediaPlayer'  => 'false',
				'deviceIsGameConsole'  => 'false',
				'hasHTTPS'      => 'true',  //NEW
				'hasWML'        => 'false',
				'hasHTML'       => 'true',
				'hasCHTML'      => 'false',
				'hasHTML4'      => 'true',
				'hasHTML5'      => 'true',
				'hasCookies'    => 'true', //NEW
				'hasAjax'       => 'true', //NEW
				'hasCanvas'     => 'false',
				'hasWebGL'      => 'false', //only newer versions
				'hasCSS'        => 'true',
				'hasCSS2'       => 'true',
				'hasJavaScript' => 'true',
				'hasQuerySelector' => 'true' //NEW
				),
			'100'  => array(
				'browserVersion'=> '1.0',
				'browserEngineVersion' => '525',
				'browserReleaseDate'   => 'dec 11, 2008'
				),
			'200'  => array(
				'browserVersion'=> '2.0',
				'browserEngineVersion' => '530',
				'browserReleaseDate'   => 'may 24, 2009'
				),
			'300'  => array(
				'browserVersion'=> '3.0',
				'browserEngineVersion' => '531',
				'browserReleaseDate'   => 'oct 12, 2009'
				),
			'400'  => array(
				'browserVersion'=> '4.0',
				'browserEngineVersion' => '532',
				'browserReleaseDate'   => 'jan 25, 2010',
				'hasCanvas'     => 'true',
				'hasHTML5Audio' => 'true',
				'hasHTML5Video' => 'true',
				'hasGeolocation'=> 'true',
				'hasSVG'        => 'true'
				),
			'500'  => array(
				'browserVersion'=> '5.0',
				'browserEngineVersion' => '533',
				'browserReleaseDate'   => 'may 21, 2010',
				),
			'600'  => array(
				'browserVersion'=> '6.0',
				'browserEngineVersion' => '534',
				'browserReleaseDate'   => 'sep 02, 2010',
				'testHTML5'            => '284',
				),
			'700'  => array(
				'browserVersion'=> '7.0',
				'browserReleaseDate'   => 'oct 01, 2010',
				),
			'800'  => array(
				'browserVersion'=> '8.0',
				'browserReleaseDate'   => 'dec 02, 2010',
				),
			'900'  => array(
				'browserVersion'=> '9.0',
				'browserReleaseDate'   => 'feb 03, 2011',
				),
			'1000' => array(
				'browserVersion'       => '10.0',
				'browserReleaseDate'   => 'mar 18, 2011',
				'testHTML5'            => '371',
				),
			'1100' => array(
				'browserVersion'=> '11.0',
				'browserReleaseDate'   => 'apr 27, 2011'
				),
			'1200' => array(
				'browserVersion'=> '12.0',
				'browserReleaseDate'   => 'jun 07, 2011'
				),
			'1300' => array(
				'browserVersion'=> '12.0',
				'browserEngineVersion' => '535',
				'browserReleaseDate'   => 'aug 02, 2011'
				),
			'1400' => array(
				'browserVersion'=> '14.0',
				'browserReleaseDate'   => 'nov 09, 2011',
				'testHTML5'            => '383',
				),
			'1500' => array(
				'browserVersion'=> '15.0',
				'browserReleaseDate'   => 'sep 16, 2011'
				),
			'1600' => array(
				'browserVersion'=> '16.0',
				'browserReleaseDate'   => 'dec 13, 2011',
				'testHTML5'            => '392',
				),
			'1700' => array(
				'browserVersion'=> '17.0',
				'browserReleaseDate'   => 'feb 18, 2012'
				),
			'1800' => array(
				'browserVersion'=> '18.0',
				'browserReleaseDate'   => 'mar 28, 2012',
				'hasWebGL'      => 'true',  //first browser to solve video driver problem
				'testHTML5'            => '399',
				),
			'1900' => array(
				'browserVersion'=> '19.0',
				'browserEngineVersion' => '536',
				'browserReleaseDate'   => 'may 23, 2012'
				),
			'2000' => array(
				'browserVersion'=> '20.0',
				'browserReleaseDate'   => 'jun 28, 2012',
				'testHTML5'            => '418',
				),
			'2100' => array(
				'browserVersion'=> '21.0',
				'browserReleaseDate'   => 'jul 31, 2012',
				'testHTML5'            => '431',
				),
			'2200' => array(
				'browserVersion'=> '22.0',
				'browserEngineVersion' => '537',
				'browserReleaseDate'   => 'sep 25, 2012',
				'testHTML5'            => '434',
				),
			'2300' => array(
				'browserVersion'=> '23.0',
				'browserEngineVersion' => '537',
				'browserReleaseDate'   => 'nov 11, 2012',
				'testHTML5'            => '448',
				),

	),

	'msie' => array(
			'000' => array(
				'browserFork'          => 'msie',
				'browserEngineName'    => 'libwww',
				'browserEngineVersion' => '1.0',
				'browserIsAncient'     => 'true',
				'deviceIsMobile'       => 'false',
				'deviceIsWAP'          => 'false',
				'deviceIsFeaturephone' => 'false',
				'deviceIsMediaPlayer'  => 'false',
				'deviceIsGameConsole'  => 'false',
				'hasWML'        => 'false',
				'hasIMode'      => 'false',
				'hasHTML'       => 'true',
				'hasHTML4'      => 'false',
				'hasCHTML'      => 'false',
				'hasCanvas'     => 'false',
				'hasWebGL'      => 'false',
				'hasCSS'        => 'false',
				'hasJavaScript' => 'true',
				),
			'100'  => array(
				'browserVersion' => '1.0',
				),
			'200'  => array(
				'browserVersion' => '2.0',
				),
			'300'  => array(
				'browserVersion' => '3.0',
				),
			'400'  => array(
				'browserVersion' => '4.0',
				'hasHTML4'  => 'true', //pretty good support as low as IE4
				'browserEngineName' => 'trident',
				),
			'500'  => array(
				'browserVersion'       => '5.0',
				'browserReleaseDate'   => 'mar 18, 1999',
				),
			'550'  => array(
				'browserVersion'       => '5.5',
				'browserReleaseDate'   => 'jun 08, 2000',
				),
				
			'600'  => array(
				'browserVersion'       => '6.0',
				'browserReleaseDate'   => 'aug 27, 2001',
				'hasHTML4'             => 'true',
				'hasCSS'               => 'true', //reasonably good CSS support
				'testHTML5'            => '26',
				),
			'700'  => array(
				'browserVersion'=> '7.0',
				'browserEngineVersion' => '3.1',
				'browserReleaseDate'   => 'oct 18, 2006',
				'testHTML5'            => '27',
				),
			'800'  => array(
				'browserVersion'=> '8.0',
				'browserEngineVersion' => '4.0',
				'browserReleaseDate'   => 'mar 19, 2009',
				'browserIsAncient'     => 'undefined', //if more recent than 2007, we don't know
				'testAcid2'            => '100', //acid2 pass
				'testHTML5'            => '42',
				'hasQuerySelector'     => 'true', //within limits, MUST BE IN STANDARDS MODE TODO: test for IE standards mode to ensure renering
				),
			'900'  => array(
				'browserVersion'=> '9.0',
				'browserEngineVersion' => '5.0',
				'browserReleaseDate'   => 'mar 14, 2011',
				'hasHTML5'       => 'true',
				'hasCanvas'      => 'true',   //HTML5
				'hasSVG'         => 'true',
				'hasHTML5Audio'  => 'true',
				'hasHTML5Video'  => 'true',
				'hasGeolocation' => 'true',
				'testHTML5'      => '138',

				),
			'1000' => array(
				'browserVersion'=> '10.0',
				'browserEngineVersion' => '6.0',
				)
	),

	'firefox' => array(
			'000' => array(
				'browserFork'          => 'firefox',
				'browserEngineName'    => 'gecko',
				'browserEngineVersion' => '1.0',
				'browserIsAncient'     => 'true',		
				'deviceIsMobile'      => 'false',		
				'deviceIsWAP'         => 'false',
				'deviceIsFeaturephone'   => 'false',
				'deviceIsMediaPlayer' => 'false',
				'deviceIsGameConsole' => 'false',
				'hasWML'        => 'false',
				'hasIMode'      => 'false',
				'hasCHTML'      => 'false',
				'hasHTML'       => 'true',
				'hasHTML4'      => 'true',
				'hasCanvas'     => 'false',
				'hasWebGL'      => 'false',
				'hasCSS'        => 'true',
				'hasCSS2'       => 'true',
				'hasJavaScript' => 'true',
				),
			'50'  => array(
				'browserVersion'=> '0.5',
				'browserEngineVersion' => '1.3',
				'browserReleaseDate'   => 'dec 07, 2002', //phoenix
			),
			'70'  => array(
				'browserVersion'=> '0.7',
				'browserEngineVersion' => '1.5',
				'browserReleaseDate'   => 'oct 15, 2003', //indio
			),
			'100'  => array(
				'browserVersion'=> '1.0',
				'browserEngineVersion' => '1.7',
				'browserReleaseDate'   => 'nov 09, 2004', //official 1.0 release
			),
			'150'  => array(
				'browserVersion'=> '1.5',
				'browserEngineVersion' => '1.8',
				'browserReleaseDate'   => 'nov 29, 2005',
			),
			'200'  => array(
				'browserVersion'=> '2.0',
				'browserEngineVersion' => '1.8.1',
				'browserReleaseDate'   => 'oct 24, 2006',
				'hasCanvas'            => 'true',       //first appearance of canvas
				'hasSVG'               => 'true',
				'testAcid3'            => '40',
				'testHTML5'            => '47'
			),
			'300'  => array(
				'browserVersion'=> '3.0',
				'browserEngineVersion' => '1.9.0',
				'browserReleaseDate'   => 'jun 07, 2008',
				'browserIsAncient'     => 'undefined', //if more recent that 2007, we don't know
				'testAcid2'            => '100',       //first to pass testAcid2
				'testAcid3'            => '55',
				'testHTML5'            => '78',
			),
			'350'  => array(
				'browserVersion'=> '3.5',
				'browserEngineVersion' => '1.9.1',
				'browserReleaseDate'   => 'jun 30, 2009',
				'hasCanvasText' => 'true',      //Canvas text API
				'hasHTML5Audio' => 'true',
				'hasHTML5Video' => 'true',
				'hasCSSFontFace'   => 'true',
				'hasGeolocation'=> 'true',
				'hasQuerySelector' => 'undefined', //NEW
				'testAcid3'         => '98'
			),
			'360'  => array(
				'browserVersion'=> '3.6',
				'browserEngineVersion' => '1.9.2',
				'browserReleaseDate'   => 'jan 21, 2010',
				'hasHTML5'             => 'true',
				'testAcid3'            => '99',
				'testHTML5'            => '174',
			),
			'400'  => array(
				'browserVersion'=> '4.0',
				'browserEngineVersion' => '2.0',
				'browserReleaseDate'   => 'mar 22, 2011',
				'testAcid3'            => '100',
				'testHTML5'            => '281',
			),
			'500'  => array(
				'browserVersion'=> '5.0',
				'browserEngineVersion' => '5.0',
				'browserReleaseDate'   => 'jun 21, 2011',
			),
			'600'  => array(
				'browserVersion'=> '6.0',
				'browserEngineVersion' => '6.0',
				'browserReleaseDate'   => 'aug 26, 2011',
			),
			'700'  => array(
				'browserVersion'=> '7.0',
				'browserEngineVersion' => '7.0',
				'browserReleaseDate'   => 'sep 27, 2011',
			),
			'800'  => array(
				'browserVersion'=> '8.0',
				'browserEngineVersion' => '8.0',
				'browserReleaseDate'   => 'nov 18, 2011',
				'testHTML5'            => '337',
			),
			'900'  => array(
				'browserVersion'=> '9.0',
				'browserEngineVersion' => '9.0',
				'browserReleaseDate'   => 'dec 20, 2011',
			),
			'1000' => array(
				'browserVersion'=> '10.0',
				'browserEngineVersion' => '10.0',
				'browserReleaseDate'   => 'jan 21, 2012',
				'testHTML5'            => '343',
			),
			'1100' => array(
				'browserVersion'=> '11.0',
				'browserEngineVersion' => '11.0',
				'browserReleaseDate'   => 'mar 13, 2012',
			),
			'1200' => array(
				'browserVersion'=> '12.0',
				'browserEngineVersion' => '12.0',
				'browserReleaseDate'   => 'apr 22, 2012',
			),
			'1300' => array(
				'browserVersion'=> '13.0',
				'browserEngineVersion' => '13.0',
				'browserReleaseDate'   => 'jun 04, 2012',
				'testHTML5'            => '346',
			),
			'1400' => array(
				'browserVersion'=> '14.0',
				'browserEngineVersion' => '14.0',
				'browserReleaseDate'   => 'jul 17, 2012',
				'testHTML5'            => '352',
			),
			'1500' => array(
				'browserVersion'=> '15.0',
				'browserEngineVersion' => '15.0',
				'browserReleaseDate'   => 'aug 28, 2012',
				'testHTML5'            => '353',
			),
			'1600' => array(
				'browserVersion'=> '16.0',
				'browserEngineVersion' => '16.0',
				'browserReleaseDate'   => 'oct 09, 2012',
				'testHTML5'            => '372',
			),

	),

	'safari' => array(
			'000' => array(
				'browserFork'   => 'safari',
				'browserEngineName'    => 'applewebkit',
				'browserEngineVersion' => '48',
				'browserIsAncient'     => 'true',
				'deviceIsMobile'      => 'false',
				'deviceIsWAP'         => 'false',
				'deviceIsFeaturephone'   => 'false',
				'deviceIsMediaPlayer' => 'false',
				'deviceIsGameConsole' => 'false',
				'hasWML'        => 'false',
				'hasIMode'      => 'false',
				'hasCHTML'      => 'false',
				'hasHTML'       => 'true',
				'hasHTML4'      => 'false', //early versions did not support tables properly
				'hasCanvas'     => 'false',
				'hasWebGL'      => 'false',
				'hasCSS'        => 'true',
				'hasJavaScript' => 'true',
				'hasXMLHttpRequest'  => 'false',
				'hasXMLHttpRequest2' => 'true',
				),
			'100'  => array(
				'browserVersion'=> '1.0',
				'browserEngineVersion' => '85',
				'browserReleaseDate'   => 'jun 23, 2003'
				),
			'110'  => array(
				'browserVersion' => '1.1',
				'browserEngineVersion' => '100',
				'browserReleaseDate'   => 'oct 24, 2003'
			),
			'120'  => array(
				'browserVersion' => '1.2',
				'browserEngineVersion' => '125',
				'browserReleaseDate'   => 'feb 2, 2004',
				'hasXMLHttpRequest'    => 'true',
			),
			'200'  => array(
				'browserVersion'=> '2.0',
				'browserEngineVersion' => '412',
				'browserReleaseDate'   => 'apr 29, 2005',
				'hasHTML4'           => 'true',
				'testAcid2'         => '100' //first to pass acid2
				),
			'300'  => array(
				'browserVersion'=> '3.0',
				'browserEngineVersion' => '522',
				'browserReleaseDate'   => 'jun 11, 2007',
				'browserIsAncient'     => 'undefined',
				'hasSVG'               => 'true', //first appearance of SVG
				'hasCanvas'            => 'true', //first appearance of canvas
				'testHTML5'            => '46',
				),
			'310'  => array(
				'browserVersion'=> '3.1',
				'browserEngineVersion' => '525.13',
				'browserReleaseDate'   => 'mar 18, 2008',
				'browserIsAncient'   => 'false',
				'hasQuerySelector' => 'true', //NEW
				'hasCSSFontFace' => 'true',
				),
			'320'  => array(
				'browserVersion'=> '3.2',
				'browserEngineVersion' => '525.26',
				'browserReleaseDate'   => 'nov 13, 2008',
				),			
			'400'  => array(
				'browserVersion'=> '4.0',
				'browserEngineVersion' => '530',
				'browserReleaseDate'   => 'feb 24, 2009',
				'hasHTML5'      => 'true',
				'hasHTML5Audio' => 'true',
				'hasHTML5Video' => 'true',
				'testAcid3'     => 'true',
				),
			'500'  => array(
				'browserVersion'=> '5.0',
				'browserEngineVersion' => '533',
				'browserReleaseDate'   => 'jun 07, 2010',
				'hasGeolocation'=> 'true',
				'testHTML5'            => '258',
				),
			'510'  => array(
				'browserVersion'=> '5.1',
				'browserEngineVersion' => '534',
				'browserReleaseDate'   => 'jun 20, 2011',
				'testHTML5'            => '319',
				),
			'600' => array(
				'browserVersion' => '6.0',
				'browserEngineVersion' => '536',
				'browserReleaseDate' => 'jul 25m 2012',
			),
	),
	
	'opera' => array(
			'000' => array(
				'browserFork'   => 'opera',
				'browserEngineName'    => 'presto',
				'browserEngineVersion' => '0.0',
				'browserIsAncient'     => 'true',
				'deviceIsWAP'         => 'false',
				'hasWML'        => 'false',
				'hasIMode'      => 'false',
				'hasCHTML'      => 'false',
				'hasHTML'      => 'true',
				'hasCanvas'     => 'false',
				'hasWebGL'      => 'false',
				'hasCSS'        => 'true',
				'hasJavaScript' => 'true',
				),
			'200'  => array(
				'browserVersion'=> '2.0',
				'browserReleaseDate'   => 'jun 20, 1996'
			),
			'300'  => array(
				'browserVersion'=> '1.0',
				'browserReleaseDate'   => 'dec 31, 1997'
			),
			'400'  => array(
				'browserVersion'=> '4.0',
				'browserReleaseDate'   => 'jun 28, 2000'
			),
			'500'  => array(
				'browserVersion'=> '1.0',
				'browserReleaseDate'   => 'dec 26, /2000'
			),
			'600'  => array(
				'browserVersion'=> '1.0',
				'browserReleaseDate'   => 'nov 29, 2001',
			),
			'700'  => array(
				'browserVersion'=> '7.0',
				'browserEngineVersion' => '1.0',
				'browserReleaseDate'   => 'jan 28, 2003',
				'hasHTML4'             => 'true'  //full support for HTML4
			),
			'800'  => array(
				'browserVersion'=> '8.0',
				'browserReleaseDate'   => 'apr 19, 2005',
			),
			'850'  => array(
				'browserVersion'=> '8.5',
				'browserReleaseDate'   => '09/20/2005',
				'testAcid2'            => '100', //http://www.howtocreate.co.uk/acid/
			),
			'900'  => array(
				'browserVersion'=> '9.0',
				'browserEngineVersion' => '2.0',
				'browserReleaseDate'   => 'jun 20, 2006',
				'hasCanvas'            => 'true',  //first appearance of canvas
				'hasSVG'               => 'true',
				'testHTML5'            => '116',
			),
			'910'  => array(
				'browserVersion'=> '9.1',
				'browserReleaseDate'   => 'jun 18, 2006',
			),
			'920'  => array(
				'browserVersion'=> '9.2',
				'browserReleaseDate'   => 'apr 11, 2007',
			),
			'950'  => array(
				'browserVersion'=> '9.5',
				'browserEngineVersion' => '2.1',
				'browserReleaseDate'   => 'jun 12, 2008',
				'browserIsAncient'     => 'undefined' //if it is past 2008, we don't know
			),
			'1000' => array(
				'browserVersion'=> '9.8',
				'browserEngineVersion' => '2.1.1',
				'browserReleaseDate'   => 'sep 01, 2009',
				'hasQuerySelector' => 'true', //NEW
				'testHTML5'            => '132',
			),
			'1050' => array(
				'browserVersion'=> '10.5',
				'browserEngineVersion' => '2.5',
				'browserReleaseDate'   => 'mar 02, 2010',
			),
			'1060' => array(
				'browserVersion'=> '10.6',
				'browserEngineVersion' => '2.6.3',
				'browserReleaseDate'   => 'jul 1, 2010',
				'hasHTML5Audio' => 'true',
				'hasHTML5Video' => 'true',
				'hasGeolocation'=> 'true',
				'testHTML5'            => '248',
			),
			'1100' => array(
				'browserVersion'=> '11.0',
				'browserEngineVersion' => '2.7.6',
				'browserReleaseDate'   => 'dec 16, 2010',
			),
			'1110' => array(
				'browserVersion'=> '11.1',
				'browserEngineVersion' => '',
				'browserReleaseDate'   => 'dec 16, 2010',
				'testHTML5'            => '301',
			),
			'1150' => array(
				'browserVersion'=> '11.5',
				'browserEngineVersion' => '2.9.1',
				'browserReleaseDate'   => 'jun 28, 2011',
				'testHTML5'            => '314',
			),
			'1160' => array(
				'browserVersion'=> '11.6',
				'browserEngineVersion' => '2.10.2',
				'browserReleaseDate'   => 'jun 28, 2011',
				'testHTML5'            => '356',
			),
			'1200' => array(
				'browserVersion'=> '12.0',
				'browserReleaseDate'   => 'jun 14, 2012',
				'testHTML5'            => '404',
			)
	
	),
	
	'android' => array(
			'000' => array(
				'browserEngineName'    => 'applewebkit',
				'browserEngineVersion' => '',
				'browserIsAncient'     => 'false',
				'deviceIsWAP'         => 'false',
				'hasHTML4'      => 'true',
				'hasHTML5'      => 'true',
				'hasCSS'        => 'true',
				'hasCSS2'       => 'true',
				'hasJavaScript' => 'true'
				),
			'100'  => array(
				'browserVersion'=> '1.0',
			),
			'200'  => array(
				'browserVersion'=> '2.0',
			)
	
	),
	
	'mobile_safari'=> array(
			'000' => array(
				'browserFork'   => 'safari',
				'browserEngineName'    => 'applewebkit',
				'browserEngineVersion' => '',
				'deviceIsWAP'         => 'false',
				'browserIsAncient'     => 'false',
				'hasHTML4'      => 'true',
				'hasHTML5'      => 'true',
				'hasCSS'        => 'true',
				'hasCSS2'       => 'true',
				'hasJavaScript' => 'true'
				),
			'100'  => array(
				'browserVersion'=> '1.0',
			),
			'980'  => array(
				'browserVersion'=> '9.8',
			)
	
	),
	
	'opera_mini' =>  array(
			'000' => array(
				'browserFork'          => 'opera',
				'browserEngineName'    => 'presto',
				'browserEngineVersion' => '',
				'browserIsAncient'     => 'true',
				'hasHTML4'      => 'true',
				'hasCanvas'     => 'false',
				'hasCSS'        => 'true',
				'hasJavaScript' => 'true',
				'browserRendersInCloud'=> 'true'
				),
			'100'  => array(
				'browserVersion'=> '1.0',
			),
			'980'  => array(
				'browserVersion'=> '9.8',
			)
	
	),
	
	'opera_mobi' =>  array(
			'000' => array(
				'browserFork'   => 'opera',
				'browserEngineName'    => 'presto',
				'browserEngineVersion' => '',
				'browserIsAncient'     => 'true',
				'hasHTML4'      => 'true',
				'hasCanvas'     => 'false',
				'hasCSS'        => 'true',
				'hasJavaScript' => 'true'
				),
			'100'  => array(
				'browserVersion'=> '1.0',
			),
			'980'  => array(
				'browserVersion'=> '9.8',
			)
	
	),
	
	'chromeframe'  =>  array(
			'000' => array(
				'browserFork'   => 'chrome',
				'browserEngineName'    => 'applewebkit',
				'browserEngineVersion' => '',
				'browserIsAncient'     => 'false',
				'deviceIsWAP'         => 'false',
				'hasHTML'       => 'true',
				'hasHTML4'      => 'true',
				'hasHTML5'      => 'true',
				'hasCSS'        => 'true',
				'hasCSS2'       => 'true',
				'hasJavaScript' => 'true'
				),
			'100'  => array(
				'browserVersion'=> '1.0',
			),
			'980'  => array(
				'browserVersion'=> '9.8',
			)
	
	)


);
