<?php


class GBPConfigurator {
	
	
	public function __construct() 
	{
		self::build_ui();

	}
	
	
	
	/** 
	 * @method build_ui() create 
	 */
	 private static function build_ui()
	 {
		require_once('ui-configurator/header.php');
			
		require_once('ui-configurator/section.php');
	
	 	require_once('ui-configurator/footer.php');
		 
	 }
	 
	
};

$gbp_configurator = new GBPConfigurator();