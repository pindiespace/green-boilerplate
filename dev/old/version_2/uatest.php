<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>GBP - Bootstrap Unit Tests</title>

<!--prevent resize on mobile-->
<meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!--CSS reset, main and responsive css styles-->
        <!--stylesheets, add CDATA if this is xhtml
	    http://www.webdevout.net/articles/escaping-style-and-script-data
	-->		

<link rel="stylesheet" type="text/css" href="css/gbp_reporter.css">
    
<body>

<!--test the user agent scanner -->

<div id="header">
    <h1>User-Agent Scanner</h1>
</div>

<div id="nav">
    <?php
	include("menu.php");
    ?>
</div>

<pre id="gbp-ua">
<?php 
    require_once('php/gbp/ua-analyze.php');
    $ua_analyze = new UAAnalyze(true);
    $browser_info = $ua_analyze->get_ua_data(); //default user-agent
?>
</pre>

<div id="footer">
    Green Boilerplate.
</div>

</body>
</html>