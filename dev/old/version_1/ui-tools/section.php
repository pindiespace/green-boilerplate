
<div id="wrapper">

<div id="header" class="group">
	<h1>GBP-Tools</h1>
	<p>Testbed for Green Boilerplate</p>
</div>

	<div id="form-options">
    
    	<!--form for selecting app options-->  
    	<form method="post" action="#" enctype="multipart/form-data">
        
        <!--options for program use-->
    	<fieldset id="program-options">
        	<label for="options" id="options">Select a Program Option:</label>
            	<select name="select_option" id="select_option">
                	<option value="select-option">Select an Option</option>
                	<option value="search-database">Search DB</option>
            		<option value="validate-db">Validate Server DB</option>
                    <option value="validate-js">Validate JS Function Library</option>
            		<option value="build-caniuse">Build from CanIUse JSON</option>
                	<option value="test-self">Self-Test DB Against UA Groups</option>
                	<option value="test-secure">Secure Test Against Bots</option>
                	<option value="update">Update</option>
            	</select>
            
        <hr /> <!--gives us some spacing-->
        
        <!--compare a user-agent against the cached similarity matrix for user-agent groups-->
        <fieldset id="search-database"  class="bootstrap-options">
        	<h2>Search User-Agent Against the Database</h2>
        	<input type="hidden" name="title-search-user-agent" value="Search User Agent against database" />
            <label for="search-current-user-agent">Use current user-agent:</label>
            <input type="radio" name="search-current-user-agent" id="search-current-user-agent" value="search-current-user-agent" />&nbsp;
        	<label for="search-entered-user-agent">Type in a user-agent string:</label> 
        	<input type="radio" name="search-user-agent" id="search-entered-user-agent" value="search-entered-user-agent"  />
            <br />
            <label for="entered-user-agent">User Agent:</label>
            <input type="text" name="entered-user-agent" id="entered-user-agent" size="100" maxlength="150" value="" />
            
            <input class="blue-pill" type="submit" name="submit-search-user-agent" id="submit-search-user-agent" value="Search Database" />

        </fieldset>
        
        <!--validate a group file--> 
        <fieldset id="validate-db" class="bootstrap-options">
        	<h2>Validate Database</h2>
        	<input type="hidden" name="title-validate-db-file" value="Validate GBP database format" />
            <label for="validate-db-file">Select File to Validate:</label>
            <select id="validate-db-file" name="validate-db-file">
            	<?php
            		foreach(self::$GBP_DB_LIST as $db_file)
               		{
                		echo "<option value=\"$db_file\">$db_file</option>\n";
                	}
				?>
            </select>
            <input class="blue-pill" type="submit" name="submit-validate-db" id="submit-validate-db" value="Validate" />
        </fieldset>
        
        <!--validate a JavaScript function library--> 
        <fieldset id="validate-js" class="bootstrap-options">
        	<h2>Validate JavaScript Library</h2>
        	<input type="hidden" name="title-validate-js-file" value="Validate JavaScript library" />
            <label for="validate-js-file">Select JS Function Library to Validate</label>
            <select id="validate-js-file" name="validate-js-file">
            	<?php
            		foreach(self::$JAVASCRIPT_LIST as $db_file)
               		{
                		echo "<option value=\"$db_file\">$db_file</option>\n";
                	}
				?>
            </select>
            <input class="blue-pill" type="submit" name="submit-validate-js" id="submit-validate-js" value="Upload" />
        </fieldset>

 		<!--build database records from caniuse.com JSON files-->
    	<fieldset id="build-caniuse"  class="bootstrap-options">
        	<h2>Build Database from caniuse.com JSON File</h2>
        	<input type="hidden" name="title-build-caniuse-db-file" value="Build GBP database from caniuse JSON file" />
        	<label for"build-caniuse-db-file">GPB File</label>
        	<select id="build-caniuse-db-file" name="build-caniuse-db-file">
            	<?php
            		foreach(self::$GBP_DB_LIST as $db_file)
               		{
                		echo "<option value=\"$db_file\">$db_file</option>\n";
                	}
				?> 
			</select>
        	<label for="build-caniuse-json-file">Group File on Server</label>
        	<select id="build-caniuse-json-file" name="build-caniuse-json-file">
        		<option value="all">Entire Database</option>
            	<?php
            		foreach(self::$CANIUSE_JSON_LIST as $json_file)
               		{
                		echo "<option value=\"$json_file\">$json_file</option>\n";
                	}
				?>
            </select>
            

            
            <input class="blue-pill" type="submit" name="submit-build-caniuse" id="submit-build-caniuse" value="Start Build" />
            
        </fieldset>
        
        <!--test the user-agent database against itself. Test each user-agent and confirm it is matched to its group-->
        <fieldset id="test-self"  class="bootstrap-options">
        	<h2>Self-Test Group Database Against User-Agent Groups</h2>
        	<input type="hidden" name="title-test-self-group" value="Test GBP database against browser groups" />
            <label for="test-self-group">Group File</label>
            <select name="test-self-group">
        		<option value="all">Entire Database</option>
            	<?php
					foreach(self::$GROUP_LIST as $db_file)
					{
						echo "<option value=\"$db_file\">$db_file</option>\n";	
					}
				?>
            </select>
            <label for="test-self">Database File</label>
        	<select name="test-self-db">
            	<?php
            		foreach(self::$GBP_DB_LIST as $db_file)
               		{
                		echo "<option value=\"$db_file\">$db_file</option>\n";
                	}
				?>
            </select>
            
            <input class="blue-pill" type="submit" name="submit" id="submit-self-test-database" value="Self-Test Group" />

        </fieldset>
        
        <!--test against user-agent strings that are actually SQL injections and similar hacks-->
        <fieldset id="test-secure" class="bootstrap-options">
        	<h2>Run Security Test with Bogus User-Agents</h2>
        	<input type="hidden" name="title-test-secure-group" value="Test against evil user-agents" />
            <label for="test-secure-group">Evil User-Agents</label>
            <select name="test-secure-group">
            	<?php
					foreach(self::$GROUP_LIST as $db_file)
					{
						echo "<option value=\"$db_file\">$db_file</option>\n";	
					}
				?>
            </select>

            <label for="test-secure">Database File</label>
         	<select name="test-secure-db">
            	<?php
            		foreach(self::$GBP_DB_LIST as $db_file)
               		{
                		echo "<option value=\"$db_file\">$db_file</option>\n";
                	}
				?>
            </select>
       
        	<input class="blue-pill" type="submit" name="submit" id="submit-secure-test" value="Test Security" />

        </fieldset>
        
        <!--update the similarity database and group list-->
        <fieldset id="update" class="bootstrap-options">
        	<h2>Update Database with most Recent Files</h2>
        	<input type="hidden" name="title-update" value="Update database with more recent files" />

        	<input class="blue-pill" type="submit" name="submit-update" id="submit-update" value="Update Database" />

        </fieldset>
        
  	</fieldset><!--end of form-options fieldset-->
	
	</form>
        
    </div><!--end of form wrapper-->

	<div id="description">
    	<div id="description-text">
        <hr />
    Green Boilerplate writes a small "bootstrap" JavaScript object to the page before downloading.
    	<ul>
        	<li>&quot;Search Cache&quot; compares a user-agent against the current database</li>
            <li>&quot;Build Group&quot; creates a database cache from ianiuse.com browser features</li>
            <li>&quot;Self-Test&quot; confirms that the database is self-consistent and doesn&quot;t have errors</li>
            <li>&quot;Secure Test&quot; runs a file with bogus user-agents to confirm that they won't disrupt the program</li>
            <li>&quot;Update&quot; gets the most recent copy of the cache file</li>
        </ul>
        <p>
        	More information is available at <a href="http://www.greenboilerplate.com">Green Boilerplate</a>.
        </p>
        <hr />
    	</div><!--description text-->
    </div><!--description-->
    
	<div id="footer">
    
    </div><!--end of footer-->
    
</div><!--end of page wrapper-->

<!--because of the way this is used, there should NEVER be anything else on the page. 
so, global functions should be OK. For the same reason, we leave the JS embedded in this 
page, since it is specific to the page, and not an attempt at a library-->
<script type="text/javascript">
//<![CDATA[
	//extremely cross-compatible getElementsByClassName for old browsers
	if(!document.getElementsByClassName) {
		document.getElementsByClassName =  function (className) {
			var found = [];
  			var elements = document.all || document.getElementsByTagName("*"); //support really old browsers, e.g. IE 5.5
  			for (var i = 0; i < elements.length; i++) {
    			var names = elements[i].className.split(' ');
    			for (var j = 0; j < names.length; j++) {
      				if (names[j] == className) found.push(elements[i]);
    				}
  			}
 		 return found;
		}
	}

	//store the current user agent, and create a variable for one that might be typed or copied in
	var userAgent  = <?php echo '"'.$_SERVER['HTTP_USER_AGENT'].'"'; ?>;
	var typedAgent = '';

	//initialize click-link to options pulldown menu
	var uaOptionTag = document.getElementById("select_option");
	uaOptionTag.onchange = function () {
		var selectedOption = uaOptionTag.options[uaOptionTag.selectedIndex].value;
		showOption(document.getElementById(selectedOption));
	}
	
	//initialize radio button for search entered user-agent
	var searchEnteredUserAgent = document.getElementById("search-entered-user-agent");
	searchEnteredUserAgent.onclick = function () {
		//put in typed value, whatever it is
		document.getElementById("entered-user-agent").value = typedAgent;
	}
	
	//initialize for current user agent of browser
	var searchCurrentUserAgent = document.getElementById("search-current-user-agent");
	document.getElementById("entered-user-agent").value = userAgent;
	searchCurrentUserAgent.checked = true;

	searchCurrentUserAgent.onclick = function () {
		//store typed value
		typedAgent = document.getElementById("entered-user-agent").value;
		//replace with current user agent
		document.getElementById("entered-user-agent").value = userAgent;
	}
	
	//hide everything with the given class
	function hideAllByClassName(className) {
		var bootstrapOptions = document.getElementsByClassName(className);
		for(var i = 0; i < bootstrapOptions.length; i++) {
			bootstrapOptions[i].style.visibility = "hidden";
			bootstrapOptions[i].style.display    = "none";
		}
	}
	
	//control visibility of each option
	function showOption(elem) {
		hideAllByClassName("bootstrap-options");
		elem.style.visibility = "visible";
		elem.style.display    = "block";
	}
	
	//select an index for the pulldown menu
	function selectIndex(optionTxt) {
		for(var i=0; i < uaOptionTag.length-1; i++) {
			if(optionTxt == uaOptionTag.options[i].value) {
				uaOptionTag.selectedIndex = i;
			}	
		}
	}
	
	//load the javascript when page is finished rendering only
	window.onload = function () {
		
		<?php if(isset($_GET['select_option']))
			{
				$select_option = $_GET['select_option'];
			}
		?>
		//set the default option, and show the default option form
		selectIndex(<?php echo '"'.$select_option.'"'; ?>);
		showOption(document.getElementById(<?php echo '"'.$select_option.'"'; ?>));
		
	}
	
//]]>
</script>
