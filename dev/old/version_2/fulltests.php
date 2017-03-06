<?php session_start();
$_SESSION['origin_url'] = trim(strip_tags($_SERVER['HTTP_REFERER']));
?><!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>GBP - Full GBP JS Tests</title>

<!--prevent resize on mobile-->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!--
	CSS reset, main and responsive css styles
	stylesheets, add CDATA if this is xhtml
	http://www.webdevout.net/articles/escaping-style-and-script-data
-->

<link rel="stylesheet" type="text/css" href="css/gbp_reporter.css">

<!--insert the script using PHP, so we can debug by line number more easily-->

<script>
<?php
    require('js/lib/gbp/consolelog.min.js'); 
    require('js/lib/gbp/db/js_tests.js');
?>
</script>

</head>

<body>

    <div id="header">
        <h1>Full GBP JavaScript Object
        <?php
		if(isset($_GET['nonajax']))
		{
			echo "(".trim(strip_tags($_GET['response']))." values uploaded, thanks)";
		}
	?>
        </h1>
    </div>
    
    <div id="nav">
	<?php
	    include("menu.php");
	?>
    </div>
    
    <div id="section">
	
	<!-- TODO: add a module that makes a JSON encoding of the results -->
	
    <script>
	
		var results = [],
		num = 0,
		numOk = 0,
		numUndef = 0,
			outStr,
			submitURL = "http://greenboilerplate.com/gbp/dev/php/app/GBP_IMPORT.php",
			resultsURL = "<?php echo strip_tags(trim($_SERVER['PHP_SELF'])); ?>";
                

             
        /**
	 * -----------------------------------------------------
         * check for Ajax
	 * we don't use a try-catch since it will zap old mobile 
	 * and desktop browsers, some of which might even run XMLHttpRequest
	 * -----------------------------------------------------
         */
	function get_ajax () {
		
		var request = null;
		if (window.XMLHttpRequest) {
			request = new XMLHttpRequest();
		}
		else if (window.ActiveXObject) {
			request = new ActiveXObject('MSXML2.XMLHTTP.3.0');
		}
                
		return request;
	}
        
        
        /**
	 * -----------------------------------------------------
         * make the query string
	 * -----------------------------------------------------
         */
	function make_query_string () {
		
		var resultsString = "";
            
		for (var i in GBPFullTests) {
			
			//screen out any results that are xxxhelper() functions
			
			GBPFullTests[i] = String(GBPFullTests[i]); //coerce to string, REQUIRED
			
				if (!~GBPFullTests[i].indexOf('helper') && !~GBPFullTests[i].indexOf('function')) {
					
					if (resultsString !== "") {
						resultsString = resultsString + "&";
					}
					
				resultsString = resultsString + i + "=" + GBPFullTests[i];
			}
		}
                
		return resultsString;
	}
        
	
	/** 
	 * -----------------------------------------------------
	 * make a post string, when Ajax doesn't work
	 * -----------------------------------------------------
	 */
	function make_post_string () {
		
		var resultsString = '';
			
		for (var i in GBPFullTests) {
			
			//screen out any results that are xxxhelper() functions
			
			GBPFullTests[i] = String(GBPFullTests[i]); //coerce to string, REQUIRED
			
			if (!~GBPFullTests[i].indexOf('helper') && !~GBPFullTests[i].indexOf('function')) {
				resultsString  += '<input type="hidden" name="' + i + '" value="' + GBPFullTests[i] + '">\n';
			}
		}
		
		//make special hidden form, saying we're non-ajax
		
		resultsString += '<input type="hidden" name="mode" value="subb">\n';
		
		return resultsString;           
	}

        
	/** 
	 * -----------------------------------------------------
	 * submit the score, either via Ajax or direct form POST
	 * -----------------------------------------------------
	 */
	function submit_score() {
		
		var res = false;
		
		if (request) {
			request.onreadystatechange = function () {
				if (request.readyState === 4) {
					if (request.status == 200) {
						var resultText = request.responseText;
						if (~resultText.indexOf("error")) {
							resultText = "Upload error, please contact GBP";
						}
						var elm = document.getElementById('export');
						elm.parentNode.removeChild(elm);
						document.getElementById("results").innerHTML = resultText; //write back into page
						log(resultText);
						res = true;
					}
					else {
						log(resultsString);
						log(request.status);
						log(request.statusText);
						log(request.getAllResponseHeaders());
						log(request.responseText);
						var errStr = "Failed to submit results (error " + request.status + ")";
						document.getElementById("results").innerHTML = errStr;
						log(errStr);
					}
				request = null; //NULL IT OUT
				}
			};
				
			//make the query string, encode, and send the data to the server
				
			var resultsString = make_query_string();
			submitURL = encodeURI(submitURL);
			request.open('POST', submitURL, true);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.send(resultsString);
		} //end of ajax
		else {
			//straight submit
			log("no xmlhttprequest");
			if (document && document.forms) {
				//document.forms[formId].submit();
				document.forms[0].submit(); //more compatible
				res = true;
			}
			
		} //end of non-ajax
		
		return res;
		
	} //end of functions
	
	
	/**
	 * -------------------------------------------------------
	 * MAIN PROGRAM
	 * start the tests
	 * -------------------------------------------------------
	 */
	
	var start = new Date().getTime();

	//since this isn't an array, we force-fire functions that define minimal GBP function
	
	if(GBPFullTests['dom0']) GBPFullTests['dom0']();
	if(GBPFullTests['dom1']) GBPFullTests['dom1']();
	
	//fire all the functions
	
	for(var i in GBPFullTests) {
		if (typeof GBPFullTests[i] == "function") {
			GBPFullTests[i]();
		}
	}
	
	var end = new Date().getTime() - start;
		
	/**
	 * -----------------------------------------------------
	 * construct the submit results form
	 * -----------------------------------------------------
	 */
	
	//the ID of the form. We abstract it out for very old browsers that must use document.forms
                
	var formId = "subform";
		
	//submission button
		
	var subButt = '<input type="button" name="export" id="export" value="Submit Results" style="border:2px solid #ddd;" onclick="submit_score();">&nbsp;<label for="export" id="results"></label>';
		
	//get the Ajax XMLHttpRequest object, if it exists
		
	var request = get_ajax();
		
	//if we can do Ajax, make a query string. Otherwise, make a HTML form with lots of hidden fields
		
	if(request) {
		subFrm = '<form id='+formId+'">'+subButt+'</form>';
	}
	else {
		var fields = make_post_string();
		subFrm =  '<form id="'+formId+'" method="post" action="'+submitURL+'"  enctype="application/x-www-form-urlencoded">'+fields+subButt+'</form>';
	}
                
	/**
	 * -----------------------------------------------------
	 * write the table to the web page
	 * -----------------------------------------------------
	 */
	
	outStr = '<table id="gbp-fulltest" class="gbp-list">\n<thead>\n<th style="width:20%;">Name</th>\n<th>Value</th>\n</thead>\n<tfoot>\n<td id="percent" style="color:black;"></td><td>'+subFrm+'</td>\n</tr>\n</tfoot>\n<tbody>\n';

	//compute executed vs undefined values returned from the feature detect functions
		
	for(var i in GBPFullTests) {
		
		if (GBPFullTests[i] !== undefined) {
			if (typeof GBPFullTests[i] == "function") {
				GBPFullTests[i] = 'helper ok';
			}
			else if (GBPFullTests[i] !== false) {
				numOk++;num++;
			}
			else {
				num++;
			}
		}
		else {
			numUndef++;
		}
		
		outStr += '<tr>\n<td>'+i+'</td>\n<td>'+ GBPFullTests[i] +'</td>\n</tr>\n';
	}

	//add computed execution time for functions outside of full GBP

	outStr += '<tr>\n<td>Exe Time (msec)</td><td>'+end+'</td></tr>\n';	
	outStr += '</tbody></table>';
	document.write(outStr);
		
	//if browser supports it, write the output 
		
	if (document && document.getElementById && num > 0) {
		var percent = (100*numOk/num).toFixed(2);
		document.getElementById('percent').innerHTML ="Support:"+percent+"%";
	}
	
	</script>

	</div><!--end of section-->
    
    
	<div id="footer">
		Green Boilerplate.
	</div>

</body>
</html>
