<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title>Green Boilerplate - Bootstrap</title>

<meta name="viewport" content="width=device-width, initial-scale=1" />

<?php require_once("lib/php/gbp-bootstrap.php"); ?>

</head>

<body>

	<div id="main">

		<header>

			<h1>GBP Tests - Bootstrap</h1>

                        <nav>
				<h2>GBP Tests</h2>
                		<ul>
                                	<li><a href="index.php">About</a></li>
                        		<li><a href="gbp.php">Object</a></li>
                                	<li>Compiler</li>
                                	<li><a href="bootstrap.php">Boostraap</a></li>
                                	<li>Server-Side Cookie</li>
                                	<li>LocalStorage</li>
                        	</ul>

			</nav>

		</header>

		<section>
        	
        		<h2>Bootstrap Results</h2>
                                
			<article>
<?php 
	echo "<section><h3>Bootstrap Config</h3>\n";
	$bootstrap->print_config();
	echo "</section>\n";
	echo "<section><h3>Bootstrap Stats</h3>\n";
	$bootstrap->print_stats();
	echo "</section>\n";
	echo "<section><h3>Bootstrap Errors</h3>\n";
	$bootstrap->print_errors();
	echo "</section>\n";
?>
			</article>
                                
		</section>
                
		<aside>

                </aside>

		<footer>
        
        		<p>Green Boilerplate.</p>

		</footer>
                

	</div><!--end of main-->

</body>
</html>