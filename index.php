<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />

<title>Green Boilerplate - Dev Tools</title>
<?php require_once('lib/php/gbp-bootstrap.php'); 

//load debug-only page assets

if(file_exists('dev/css')) 
{	echo "<style>\n";
	require_once('dev/css/reset.css');
	require_once('dev/css/type.css');
	require_once('dev/css/page.css');
	require_once('dev/css/table.css');
	require_once('dev/css/d3.css');
	echo "</style>\n";	
}
if(file_exists('dev/js'))
{
	echo "<script>\n";
	require_once('dev/js/dev.js');
	echo "</script>\n";
}

//load the GBP base class

require_once('lib/php/gbp.php');
		
class GBP_DEV extends GBP {
	
	static private $bootstrap;
	
	public function __construct($bootstrap)
	{
		/** 
		 * to make GBP_BOOSTRAP available inside the 
		 * content panels, we have to pull it inside this 
		 * class context and have it "global" to menu_route
		 */
		self::$bootstrap = $bootstrap;
	}
	
	public function menu_route()
	{
		$bootstrap = self::$bootstrap;
		
		if(isset($_GET['gbp_option'])) 
		{
			self::clean_str($_GET['gbp_option']);	
		
			switch($_GET['gbp_option']) 
			{
				case 'about':
					require_once('dev/dev_about.php');
					break;
				
				case 'object':
					require_once('dev/dev_object.php');
					break;
				
				case 'compiler':
					break;
			
				case 'bootstrap':
					require_once('dev/dev_bootstrap.php');
					break;
			
				case 'cookie':
					require_once('dev/dev_cookie.php');
					break;
				
				case 'localstorage':
					require_once('dev/dev_localstorage.php');
					break;
				
				case 'analyze':
					require_once('dev/dev_analyze.php');
					break;
				
				case 'unittest':
					require_once('dev/dev_unittest.php');
					break;
				
				case 'import':
					require_once('dev/dev_import.php');
					break;
				
				default:
					echo "<section>\n<article>\nNo option</article>\n</section>\n";
					break;
					
			} //end of switch
		
		} //end of test of menu choice
		
	} //end of menu_route
	
	
}; //end of class


//create the object

$dev = new GBP_DEV($bootstrap);


?>



</head>

<body>

	<div class="main">
			
		<header>
			<div id="page-heading" class="float-left"><!--50 percent on left-->
				<h1 id="page-title"><a href="index.php?gbp_option=about"><span style="color:#8c6;">G</span>reen Boilerplate</a></h1>
				<h3 id="page-sub-title">Development Tests
				<?php 
				//write the current option here
				$option = "undefined";
				if(isset($_GET['gbp_option'])) 
				{
					$dev->clean($_GET['gbp_option']);
					$option = $_GET['gbp_option'];
					echo '::'.$option; 
				}
				
				function highlight_menu($menu_option)
				{
					global $option;
					if($menu_option == $option)
					{
						return "id=\"top-nav-highlight\"";
					}
					
					return "";
				}
				?></h3>
			</div>
			<div id="page-menu">
			<nav class="float-right">
				<h2><span style="color:#8c6;">T</span>est Menu</h2>
				<ul>
					<li><a href="index.php?gbp_option=analyze"  <?php echo highlight_menu('analyze'); ?>>Client Detector</a></li><!--user agent and header analysis-->
					<li><a href="index.php?gbp_option=unittest" <?php echo highlight_menu('unittest'); ?>>Client Unit Tests</a></li><!--unit testing of user agent analysis-->
					<li ><a href="index.php?gbp_option=import" <?php echo highlight_menu('import'); ?>>Import Client Test</a></li><!--Import client test results-->
				</ul>
			</nav>
				
			<nav class="float-right">
				<h2><span style="color:#8c6;">G</span>BP Elements</h2>
				<ul>
					<li ><a href="index.php?gbp_option=about" <?php echo highlight_menu('about'); ?>>About</a></li>
					<li><a href="index.php?gbp_option=object" <?php echo highlight_menu('object'); ?>>Object</a></li>
					<li>Compiler</li>
					<li><a href="index.php?gbp_option=bootstrap" <?php echo highlight_menu('bootstrap'); ?>>Bootstrap</a></li>
					<li><a href="index.php?gbp_option=cookie" <?php echo highlight_menu('cookie'); ?>>Server-Side Cookie</a></li>
					<li><a href="index.php?gbp_option=localstorage" <?php echo highlight_menu('localstorage'); ?>>LocalStorage</a></li>

				</ul>
				
			</nav>
			</div>
		</header>
		
		<!--the PHP code inserts a <section> with sub <article> divisions based on $_GET['gbp_option'] -->
		
		<?php
			$dev->menu_route();
		?>
	
		<aside>

		</aside>

		<div class="push"></div>  

	</div><!--end of main-->
	
		<footer class="page-footer">
	
			<p>Green Boilerplate. &copy; 2014 Pete Markiewicz. Contact for details.</p>

		</footer>


	<script>
		//since debug may be very long, wait
		
		if(GBPDev) {
		
			console.log("GBPDev loaded");
		}
		else {
			console.log("GBPDev not loaded");
		}
	
	</script>

</body>
</html>