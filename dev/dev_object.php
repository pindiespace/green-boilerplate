		<section>
			<h2>GBP Object Readout</h2>
				<div class="description">
					<strong>Local User Agent:</strong> 
					<p>
					<script>
						document.write(navigator.userAgent);
					</script>
					</p>
				</div>		
			<article class="dark-grey">
				
				<h3 class="hide">Property Matrix - Client</h3>
				

				
				<!--create an HTML table with the full spec, similar to Mozilla's -->
				
				<script>
				
				function countProperties(obj) {
					var count = 0;
				
					for(var prop in obj) {
						if(obj.hasOwnProperty(prop))
							++count;
					}
					return count;
				}
				
				
				//styles
				
				var componentClassName = "component";
				var propertyClassName = "property";
				var legendClassName = "property-legend";
				var nameClassName = "property-name";
				var leftBorder = "left-border";
				var rightBorder = "right-border";
				
				//table grid control
				
				var numEntries = 6; //match legendString and propString
				var numCols = 2;
				var totCols = numEntries * numCols;
				
				var tableString = "\t\t<table class=\"formatHTML5\"><thead><tr><th colspan=\"" + totCols + "\">Property List</th></tr></thead>\n<tfoot></tfoot>";
				
				var componentString = "";
				var propString = "";
				var legendString = 
					"<td class=\"" + legendClassName + "\">Name</td>" + 
					"<td class=\"" + legendClassName + "\">Detector</td>" + 
					"<td class=\"" + legendClassName + "\">Db</td>" + 
					"<td class=\"" + legendClassName + "\">Server</td>" +
					"<td class=\"" + legendClassName + "\">Client</td>" +
					"<td class=\"" + legendClassName + "\">Datatype</td>";
				
				var rowNum = 0;
				var colNum = 0;
				
				//if debug arrays aren't present, warn
				
				if(!debug_db_properties) {
					document.write("<p>Warning: user-agent client-version database properties not available.</p>");					
				}
				
				if(!debug_server_properties) {
					document.write("<p>Warning: properties detected on server prior to download not available.</p>");
				}
				
				
				for(var i in GBP) {
					
					//get all the components
					
					var component = GBP[i];
					
					//component name
					
					componentString = "\t\t<tr>\n\t\t\t<td class=\"" + componentClassName + "\" colspan=\"" + totCols + "\">" + i + "</td>\n\t\t</tr>\n";
					
					componentString += "<tr>\n";
					
					//(re) add the legend for the columns
					
					for(var k = 0; k < numCols; k++) {
						componentString += legendString;	
					}
					
					componentString += "</tr>\n";
					
					tableString += componentString;
					componentString = "";
					
					colNum = 0;
					
					var numProps = countProperties(component);
					
					//console.log("Num props: " + numProps);
					
					for(var j in component) {
						
						prop = component[j];
						
						if(colNum == 0) {
							propString = "\t\t<tr>\n";	
						}
						
						//Property name 
						
						propString = "\t\t\t\t<td class=\"" + nameClassName + "\"><strong>" + j + "</strong></td>";
						
						//Property detector language type, passed in from GBP_COMPILE (only in DEBUG version)
									
						if(GBP.detectorTypes && GBP.detectorTypes[i] && GBP.detectorTypes[i][j]) {
							//console.log("GBP detector language for " + j + " is:" + GBP.detectorTypes[i][j]);
							propString += "<td class=\"" + propertyClassName + "\">" + GBP.detectorTypes[i][j] + "</td>";
						}
						else {
							propString += "<td class=\"" + propertyClassName + "\">" + "_" + "</td>";
						}
						
						//propString += "<td class=\"" + propertyClassName + "\">" + "_" + "</td>";
						
						//Property value in the DB for the user agent, passed in from gbp-bootstrap client database, if present
						
						if(debug_db_properties && debug_db_properties[i] && debug_db_properties[i][j]) {
							propString += "<td class=\"" + propertyClassName + "\">" + debug_db_properties[i][j] + "</td>";
						}
						else {
							propString += "<td class=\"" + propertyClassName + "\">" + "_" + "</td>";
						}
						
						//add in the computed server-side value (server-side executing detectors)
						
						if(debug_server_properties && debug_server_properties[i] && debug_server_properties[i][j]) {
							propString += "<td class=\"" + propertyClassName + "\">" + debug_server_properties[i][j] + "</td>";	
						}
						else {
							propString += "<td class=\"" + propertyClassName + "\">" + "_" + "</td>";							
						}
						
						//4. final client-side property value (if not a function)
						
						var type = Object.prototype.toString.call(prop).toLowerCase();
						//console.log("prop:" +  j + " type:"+type);
						
						if(type.indexOf('function') > 0) {
							propString += "\t\t\t\t<td class=\"" + propertyClassName + "\">" + "function" + "</td>\n";	
						}
						else {
							propString += "\t\t\t\t<td class=\"" + propertyClassName + "\">" + prop + "</td>\n";
						}
						
						//3. add in the property datatype
						
						propString += "<td class=\"" + propertyClassName + "\">" + typeof prop + "</td>";
						colNum += numEntries;
						
						//all done with property, see if we need to start a new row
						
						if(colNum >= totCols) {
							colNum = 0;
							propString += "\t\t</tr>\n";	
						}
						
						tableString += propString;
						propString = "";
						
					} //end of prop loop
					
					colNum = 0;
					
					var emptyCells = (numProps * numEntries)%totCols;
					emptyCells = totCols - emptyCells;
					
					if(emptyCells != totCols) {
					//console.log("END of " + i);
					//console.log("emptyCells:" + emptyCells);
					
					for(var k = 0; k < emptyCells; k++) {
						propString += "<td>_</td>";	
					}
					propString += "</tr>\n";
					}
					
					tableString += propString;
					propString = "";
					
				} //end of component loop
				
				tableString += "\t\t</table>\n";
				
				document.write(tableString);
				
				</script>
			
			
			</article>
		
		</section>
		
