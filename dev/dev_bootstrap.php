<!--beginning of bootstrap-->
		<section>
		
			<h2>Bootstrap Results</h2>

<?php 
	if(!isset($bootstrap))
	{
		echo "\t\t\t<div class=\"description\">ERROR: GBP_BOOTSTRAP class did not load</div>\n";
	}
	else
	{
		echo "\t\t\t<div class=\"description hide\">\nBootstrap configured normally</div>\n";
		echo "\t\t\t<article class=\"balloon\">\n<h3>Configuration</h3>\n";
		$bootstrap->print_config();
		echo "\t\t\t</article>\n";
		echo "\t\t\t<article class=\"balloon\">\n<h3>Stats</h3>\n";
		$bootstrap->print_stats();
		echo "\t\t\t</article>\n";
		echo "\t\t\t<article class=\"balloon\">\n<h3>Errors</h3>\n";
		$bootstrap->print_errors();
		echo "\t\t\t</article>\n";
	}
?>

		</section>
<!--end of bootstrap-->