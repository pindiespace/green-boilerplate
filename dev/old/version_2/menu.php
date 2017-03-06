<?php
	//save the incoming url
	
	if (!isset($_SESSION["origin_url"]))
	{
		$referer = filter_input(INPUT_SERVER,'HTTP_REFERER', FILTER_SANITIZE_URL);
		
		$_SESSION['origin_url'] = $referer;
			
	}
?>

<ul class="gbp-menu">
	<li><a href="index.php">&gt;GBP</a></li>
	<li><a href="fulltests.php">&gt;JS Tests</a></li>
	<li><a href="uatest.php">&gt;UA Tests</a></li>
    <li><a href="uaunittest.php">&gt;UA Unit Tests</a></li>
    <li><a href="gbpdbtest.php">&gt;GBP DB Tests</a></li>
</ul>
