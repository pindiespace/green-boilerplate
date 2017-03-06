<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>GBP - Server-Side Tests</title>

<!--prevent resize on mobile-->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!--
    CSS reset, main and responsive css styles
    stylesheets, add CDATA if this is xhtml
    http://www.webdevout.net/articles/escaping-style-and-script-data
-->

<link rel="stylesheet" type="text/css" href="css/gbp_reporter.css">
	
<!--javascript utilities-->
<!--early loading JS greenboilerplate full js-->

<script>	
<?php
    require('dev/js/lib/consolelog.min.js');
?>
</script>

<?php

	//default directories
	
	$ua_db_dir = 'dev/db/browser/txt/';
 
	//load our dev classes
	
	require_once('dev/php/init.php');
	require_once('dev/php/lib/GBP_DEV_BASE.php');
	require_once('dev/php/lib/GBP_DEV.php');

	//create the server-side class
		
	if(class_exists(GBP_DEV_BASE))
	{
		if(class_exists(GBP_DEV))
		{
			$gbp_dev = new GBP_DEV;
		}
		else 
		{
			echo "NO GBP_DEV";
		}
	}
	else
	{
		echo "NO GBP_DEV_BASE";
	}
	
	//process the unit test
	
	if(isset($_POST['user-agent-db-list']))
	{
		$gbp_dev->clean($_POST['user-agent-db-list']);
		require('dev/php/app/gbp_run_unittests.php');
		if(class_exists(GBP_RUN_UNITTESTS))
		{
			$ua_unittests = new GBP_RUN_UNITTESTS();
		}
		else
		{
			echo "GBP_RUN_UNITTESTS not found";
			exit;
		}
		
	}
	else
	{
		//////////////echo "no POST yet";
	}
?>

</head>

<body>
    
	<div id="header">
		<h1>UAAnalyze Unit Tests</h1>
	</div>
    
	<div id="nav">
	<?php
	    include("menu.php");
	?>
	</div>
    
	<div id="section" class="test-panel-controls">
		
		<form method="post" action="uaunittest.php">
			
			<fieldset id="search-database"  class="bootstrap-options">
				
				<h2 style="margin-bottom:16px;">Test User-Agent(s) Against GBP Server-Side Bootstrap</h2>
				<label for="user-agent-db-list" style="font-size:90%;">User Agent Test Databases:</label>
				<select name="user-agent-db-list" id="user-agent-db-list">
				<?php
					//load list of dbs
						
					$db_list = $gbp_dev->get_file_list($ua_db_dir, "txt");
						
					foreach($db_list as $file_name)
					{
						if(isset($_POST['user-agent-db-list']) && $_POST['user-agent-db-list'] == $file_name)
						{
							echo "<option value=\"$file_name\" selected=\"selected\">$file_name</option>\n";	
						}
						else
						{
							echo "<option value=\"$file_name\">$file_name</option>\n";	
						}
						
					}
				?>
				</select>
				<input type="submit" name="submit-search-user-agent" id="submit-search-user-agent" value="Search Database" />
					
			</fieldset>
			
		</form>
			
	</div><!--end of test panel controls-->
    
<!--by default, we list the results for the current browser ua-->
	<div class="test-panel">
		<?php
			if(isset($_POST['user-agent-db-list']))
			{
				$results = $ua_unittests->run_tests($_POST['user-agent-db-list']);
				
				//create an output table for stats
				
				echo "<h2><strong>Results for UAAnalyze against: </strong>".$_POST['user-agent-db-list']."</h2>";
				echo "<table id=\"gbp-fulltest-summary\" class=\"gbp-list\">\n";
				echo "<tr>\n<td>Clients:</td>\n<td>".$results['num_lines']."</td>\n</tr>\n";
				echo "<tr>\n<td>Av. Processing Time (msec):</td>\n<td>".round($results['total_processing_time'], 2)."</td>\n</tr>\n";
				echo "<tr>\n<td>User-Agents:</td>\n<td>".$results['num_uas']."</td>\n</tr>\n";
				echo "<tr>\n<td>Matches:</td>\n<td>".$results['stats']['matches']."</td>\n</tr>\n";
				echo "<tr>\n<td>No Matches:</td>\n<td>".$results['stats']['no_matches']."</td>\n</tr>\n";
				echo "<tr>\n<td>Mismatches:</td>\n<td>".$results['stats']['mismatches']."</td>\n</tr>\n";
				echo "<tr>\n<td>UAAnalyze 'undefined':</td>\n<td>".$results['stats']['undefined']."</td>\n</tr>\n";
				
				echo "</table>\n\n";
				
				echo "<table id=\"gbp-fulltest\" class=\"gbp-list\" style=\"font-size:90%;\">\n
				<thead>\n
					<tr>\n
					<td>Client</td>
					<td>Match</td>
					<td>Av. Time(msec)</td>
					<td>No Match</td>
					<td>Mismatch</td>
					<td>Undefined</td>
					</tr>\n
				</thead>
				<tfoot>
				</tfoot>
				<tbody>\n";
				
				foreach($results['stats']['clients'] as $client_key => $client)
				{
					$total = $client['total'];
					$matches = $client['matches'];
					$av_processing_time = round($client['av_processing_time'], 2);
					$match_percent = round(($matches/$total)*100, 2);
					echo "<tr>\n<td>$client_key</td><td>".$client['matches']."($match_percent%)</td><td>".round($client['av_processing_time'], 2)."</td><td>".$client['no_matches']."</td><td>".$client['mismatches']."</td><td>".$client['undefined']."</td>\n</tr>\n";
					
					if(isset($client['false_uas']) || isset($client['undefined_uas']))
					{
						if(isset($client['false_uas']))
						{
							foreach($client['false_uas'] as $falseua)
							{
								echo "<tr>";
								echo "
								<td class=\"pre\" style=\"background-color:white;text-align:right;\">NOT FOUND - ".$falseua['line_num'].":</td>
								<td class=\"pre\" style=\"background-color:white;\">".$falseua['match_client']."-".$falseua['version_diff']."</td>
								<td class=\"pre\" style=\"background-color:white;\" colspan=\"4\">".$falseua['user_agent']."</td>";
								echo "</tr>";
							}
						}
						else if(isset($client['undefined_uas']))
						{
							foreach($client['undefined_uas'] as $undefinedua)
							{
								echo "<tr>";
								echo "
								<td class=\"pre\" style=\"background-color:white;text-align:right;\">UNDEFINED - ".$undefinedua['line_num'].":</td>
								<td class=\"pre\" style=\"background-color:white;\">".$undefinedua['match_client']."-".$undefinedua['version_diff']."</td>
								<td class=\"pre\" style=\"background-color:white;\" colspan=\"4\">".$undefinedua['user_agent']."</td>";
								echo "</tr>";
							}
						}
					}
					else if(isset($client['undefined_uas']))
					{
						
					}
					
					
				}
				
				echo "</tbody>\n
				</table>\n";
				echo "<div style=\"margin-top:16px;\">\n";
				echo "<h2><strong>Errors</strong></h2>";
				echo "<pre>";
				//$ua_unittests->print_results($results);
				
				//print the results in an HTML table
				
				
				
				$ua_unittests->print_error(); //!!!!!!!!TODO: LOOK AT WHAT IS PRINTED
				echo "</pre>\n";
				echo "</div>\n";
			}
		?>
		
	</div><!--end of section-->
    
	<div id="footer">
		Green Boilerplate.
	</div>
</body>
</html>
