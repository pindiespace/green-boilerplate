		<!--a big accordion array-->
		<section id="accordion-unittests">
		
			<h2>Unit Testing for Clients</h2><!--floated right-->
			
				
				<?php 
				
				//get the base class
				
				require_once('lib/php/gbp-analyze.php');
				
				class GBP_ANALYZE_UNITTESTS extends GBP_ANALYZE {
					
					static protected $GBP_DEV_DB_BROWSER_DIR        = '';
					static protected $GBP_DEV_DB_SECURITY_DIR       = '';
					
					//average processing time
					
					private static $PROCESSING_TIME        = 0.0;
					private static $CLIENT_PROCESSING_TIME = 0.0;
					
					private static $clients = array();
					
					
					public function __construct() 
					{
						parent::__construct();
						
						
						self::$GBP_DEV_DB_BROWSER_DIR  = self::$GBP_DEV_DIR.'/db/browser/';
						self::$GBP_DEV_DB_SECURITY_DIR = self::$GBP_DEV_DIR.'/db/security/';
					}
					
					
					/**
					 * @method open_ua_file
					 */
					public function open_ua_test_file ($db_filename)
					{
						$file_arr = array();
						
						$path = self::$GBP_DEV_DB_BROWSER_DIR;
					
						//check file type (.json, .txt, .xml)
						
						$file_parts = pathinfo($db_filename);
						switch($file_parts['extension'])
						{
							case 'json':
								$path .= 'json';
								break;
							
							case 'txt':
								$path .= 'txt';
								break;
							
							case 'xml':
								$path .= 'xml';
								break;
							
							case "": // Handle file extension for files ending in '.'
							case NULL: // Handle no file extension
							default:
								self::$ERROR[__METHOD__][] = "invalid db file type:$file_name";
							break;
						}
						
						//complete the path, and test if file exists
						
						$path .= '/'.$db_filename;
						
						if(file_exists($path))
						{
							self::$stats_arr[__METHOD__][] = "found file at path:$path";
						}
						else
						{
							self::$ERROR[__METHOD__][] = "db file was not found at path:$path";
						}
						
						
						//try to load the file as an array
						
						$file_arr  = file($path); //this could be quite large
						
						if(!is_array($file_arr))
						{
							self::$ERROR[__METHOD__][] = "failed to load unittest file at $path";
						}
						else
						{
							self::$stats_arr[__METHOD__][] = "opened unittest file";
						}
						
						//check to see the file is the right size
						
						$num_lines = count($file_arr);
						
						if($num_lines < 6)
						{
							self::$ERROR[__METHOD__][] = "unittest file is too small at $path (count:".$num_lines.")";
						}
						
						return $file_arr;
					}
					
					/** 
					 * since versions in a browser group may differ slightly, 
					 * flag only those which differ by a certain percentage
					 */
					private function version_cutoff($db_version, $version)
					{
						$diff = abs($db_version - $version);
						if($diff < (self::$VERSION_CUTOFF * $db_version))
						{
							return true;
						}
						
						return false;
					}
					
					
					
					
					private function init_client()
					{
						$client = array(
							'match_client' => 0,
							'match_version' => 0,
							'match_fork' => 0,
							'num_uas' => 0
						);
						return $client;	
					}
					
					/** 
					 * @method parse_txt_file
					 * scan through a unit test file in text format, 
					 * running our user-agent compare
					 * @param {Array} $file_arr the array from the unit test file of user-agents
					 * @returns {Array|false} if OK, return results, otherwise, false
					 */
					public function parse_txt_file(&$file_arr)
					{
						$COLLECT_START  = 0;
						$COLLECT_STOP   = 1;
						$COLLECT_UAS    = 2;
						
						$num_clients    = 0;
						$num_uas        = 0;
						$tot_uas        = 0;
						
						$milliseconds   = 0;
						
						$client = self::init_client();
						
						$state = $COLLECT_STOP;
						
						
						foreach($file_arr as $line)
						{
							if(strpos($line, '[start]') !== false)
							{
								$state = $COLLECT_START;
							}
							else if(strpos($line, '[end]') !== false)
							{
								$state = $COLLECT_STOP;
							}
							else 
							{
								
								switch($state)
								{
								 	case $COLLECT_START:
										$num_uas = 0;
										$milliseconds = 0;
										if(strpos($line, 'client=') !== false)
										{
											$ln = explode('=', $line);
											$client['client'] = trim($ln[1]);
										}
										else if(strpos($line, 'version') !== false)
										{
											$ln = explode('=', $line);
											
											//convert to look like GBP version
											
											$client['version_raw'] = trim($ln[1]);
											$client['version'] = self::numberize_version($ln[1], self::$MULTIPLIER); //don't need a multiplier
											
											
											
										if(file_exists(self::$GBP_CLIENT_JS_DIR.$client['client'].".php"))
										{
											$client['client_in_db'] = true;
											$string = file_get_contents(self::$GBP_CLIENT_JS_DIR.$client['client'].".php");
											$json_arr = json_decode($string,true);
											if(is_array($json_arr) && isset($json_arr[$client['version']]))
											{
												$client['version_in_db'] = true;
											}
											else
											{
												$client['version_in_db'] = false;
											}
										}
										 else
										{
											$client['client_in_db'] = false;
										}
											
											
											
											
											
											
											
										}
										else if(strpos($line, 'fork') !== false)
										{
											$ln = explode('=',$line);
											$client['fork'] = trim($ln[1]);
										}
										else if(strpos($line, '[ualist]') !== false)
										{
											$state = $COLLECT_UAS;
											$milliseconds = 0;
											$client['ualist'] = array();
										}
										else
										{
											$err_client = "unknown";
											if(isset($client['client']))
											{
												$err_client = $client['client'];
											}
											self::$ERROR[__METHOD__][] = "unrecognized text property $line for:".$err_client;
										}
										break;
										
									case $COLLECT_STOP:
									
										if(is_array($client) && isset($client['ualist']) &&  is_array($client['ualist']))
										{
											//store stats
											
											$num_clients++;
											$tot_uas += $num_uas;
											
											//elapsed time
											
											if($num_uas > 0)
											{
												$client['milliseconds'] = round(($milliseconds/$num_uas) * 1000, 3);
											}
											else
											{
												$client['milliseconds'] = 0;
											}
											
											
											
											//store the completed client
											
											self::$clients[] = $client;
											
											//erase the current client
											
											$client = self::init_client();
											
											
										}
										break;
										
									case $COLLECT_UAS:
									
										if(strlen($line) > 5)
										{
											//ignore spacing lines
											
											$client['ualist'][$num_uas]['ua'] = $line;
											
											
											$client['num_uas'] = $num_uas + 1;
											
											//start time for scan
											
											$cur_time = microtime(true);
											
											////////////////////////
											//test the user agent
											////////////////////////
											
											$client['ualist'][$num_uas]['browser'] = self::get_client($line);
											
											//end time for scan
											
											$milliseconds += (microtime(true) - $cur_time);
											
											$browser_client  = $client['ualist'][$num_uas]['browser'][0];
											$browser_version = $client['ualist'][$num_uas]['browser'][1];
											
											$version_diff    = abs($client['version'] - $browser_version);	
											
											/** 
											 * classify the errors
											 */
											if($browser_version !== self::$UNDEFINED && $browser_version > 0)
											{
												$version_percent_match = intval(($version_diff/$browser_version) * 100);
											}
											else
											{
												$version_percent_match = 0;
											}
											
											
											if($client['client'] === $browser_client)
											{
												$client['match_client'] += 1;
												
												if(self::version_cutoff($client['version'], $browser_version))
												{
													$client['match_version'] += 1;
												}
												else
												{
														$client['ualist'][$num_uas]['errors'] = 
															'Client ('.$client['client'].') is correct, but version <br> mismatch ('.
															$client['version'].') vs. '.$browser_version.', '.$version_percent_match.'%)';
												}
											}
											else
											{
												if(self::version_cutoff($client['version'], $browser_version))
												{
														$client['match_version'] += 1;
														$client['ualist'][$num_uas]['errors'] = 
															'Client does not match ('.$client['client'].' vs. <br>'.$browser_client.
															'), but version does ('.$client['version'].') vs. ('.$browser_version.')';
												}
												else
												{
														$client['ualist'][$num_uas]['errors'] = 
															'No match: Client ('.$client['client'].') vs. <br>('.$browser_client.') and version ('.
															$client['version'].') vs. '.$browser_client.')';
												}
											}
											
											
											/** 
											 * if a fork is listed, see if you get a fork match. Minor browsers 
											 * spoofing major browsers will have a fork
											 */
											if(isset($client['fork']) && $client['fork'] === $client['ualist'][$num_uas]['browser'][0])
											{
												$client['match_fork'] += 1;
											}
											$num_uas++;
										}
										else
										{
											//small link, could just be spacing
										}
										break;
									default:
									
										break;
								} //end of switch
								
								
							} //end of else
							
							
						}
						
						//assign results to stats
						
						self::$stats_arr['clients']['num_clients'] = $num_clients;
						self::$stats_arr['clients']['tot_uas']     = $tot_uas;
						
						//delete the raw file input
						
						unset($file_arr);
						
						return array($num_clients, $tot_uas);
					}
					
					
					public function parse_json_file($file_arr)
					{
						self::$ERROR[__METHOD__][] = "Error: JSON parsing not supported";
					}
					
					
					public function parse_xml_file($file_arr)
					{
						self::$ERROR[__METHOD__][] = "Error: xml parsing not supported";
					}
					
					
					/** 
					 * look at the raw data, and score
					 */
					 
					public function build_results()
					{
						$red = "color:red;";
						$green = "color:green;";
						
						
						//get a list of all client database files from the GBP client/js directory
						
						//self::get_client_list();
						//print_r(self::$client_list);
						
						//output array to print as HTML
						
						$output = array();
						
						//build the internal errors table
						if(count(self::$ERROR) > 0)
						{
						$output_err = '<article>'."\n".
								'<h4 class="accordion-header" style="'.$red.'">'.
								"Internal Errors (".count(self::$ERROR).")</h4>\n<table class=\"hide\"><tr><td><pre>\n";
						$output_err .= print_r(self::$ERROR, true);
						$output_err .= "</pre>\n</td></tr>\n</table>\n</article>\n\n";
						$output[] = $output_err;
						$output_err = ""; //might be huge
						}
						
						
						
						//build the output tables
						
						foreach(self::$clients as &$client)
						{
							$flag = 0;
							$err_header = array();
							$err_table  = "";
							$percent_match = 0;
							if($client['num_uas'] > 0)
							{
								$percent_match = (($client['match_client']+$client['match_version'])/2)/$client['num_uas'];
								
								
								if($percent_match < 0.999)
								{
									$style = $red;
								}
								else
								{
									$style = $green;
								}
								
								
								$header_style = "color:#ccc;font-size:80%;font-family:courier;font-weight:lighter;";
								
								$db_client = "";
								$db_version = "";
								if($client['client_in_db'] === true)
								{
									$db_client .= ' Client:in db, ';
								}
								else
								{
									$db_client .= ' Client:NOT in db, ';
								}
								
								if($client['version_in_db'] === true)
								{
									$db_version .= ' Version: in db';
								}
								else
								{
									$db_version .= ' Version: NOT in db';
								}
								
								/** 
								 * make stats article. The <h4> acts as the panel header, the HTML table holds the 
								 * results. A JavaScript accordion function in GBPDev allows tables to be shown/hidden, 
								 * so initially all tables are set to 'hide'
								 */
								$output_stats = '<article>'."\n".
								'<h4 class="accordion-header" style="'.$style.'">'.
								$client['client'].' '.$client['version_raw'].'('.$client['version'].')'.
								' - <span style="'.$header_style.'">'.
								'Tested:'.$client['num_uas'].' '.intval($percent_match*100).'% Time:'.
								$client['milliseconds'].'msec '.$db_client.$db_version.'</span>'.
								'</h4>'."\n";
								
									/** 
									 * individual user-agents
									 */
									foreach($client['ualist'] as $ua_num => &$ua)
									{
										//append any errors regardless
										
										if(isset($ua['errors']))
										{
											$err_table .= "<tr>\n".'
												<td>'.$ua_num.'</td>
												<td style="'.$red.'">ERROR:</td>
												<td>'.$ua['errors'].'</td>
												<td>'.$ua['ua']."</td></tr>\n";
										}
										else
										{
											$err_table .= "<tr>\n".'
												<td>'.$ua_num.'</td>
												<td style="'.$green.'">OK:</td>
												<td>'.$client['version'].'/'.$ua['browser'][1].'</td>
												<td>'.$ua['ua']."</td></tr>\n";
										}
										
									} //end of loop for all uas for a client
							
							}
							else 
							{
								$err_table .="<tr>\n".'
									<td style="'.$style.'">ERROR:</td>'.'
									<td colspan="2">No User-Agents in group</td></tr>\n';
							}
							
							//beginning creating the table
							
							$output_stats .= "<table class=\"hide\">\n<thead>\n<tr></tr>\n</thead>\n<tfoot>\n</tfoot>\n<tbody>\n";
							$output_stats .= $err_table;
							$output_stats .= "</tbody>\n</table>\n";
							
							$output_stats .= "</article>\n";
							$output[] = $output_stats;
							
						} //end of loop for all clients
						return $output;
					}
					
					public function get_version_cutoff()
					{
						return self::$VERSION_CUTOFF;
					}
					
					
					public function print_client_arr()
					{
						self::print_array(self::$clients, "Client UA List");
					}
					
					
				}; //end of class
				
				
				$gbp_unittests = new GBP_ANALYZE_UNITTESTS();
				
				$file_arr = $gbp_unittests->open_ua_test_file('a_group_common.txt');
				
				$results = $gbp_unittests->parse_txt_file($file_arr);
				
				//$gbp_unittests->print_client_arr();
				?>
				
				<div class="description"><!--floated left-->
					<strong>Results:</strong> 
					<p>
					<?php 
						echo "<p>Clients tested: ".$results[0]."</p>
							<p>User Agents: ".$results[1]."</p>".
							"<p>Version Cutoff:".$gbp_unittests->get_version_cutoff()."</p>";
					?>
					</p>
				</div>
				
				<?php 
				$client_list = $gbp_unittests->build_results();
				
				foreach($client_list as $client)
				{
					echo $client;
				}
				
				?>
				
				
				<script>
					window.onload = function () {
						if(GBPDev) {
							console.log("GBP ready");
							
							//give the accordion the entire <section>
							
							var accordionStatus = GBPDev.initAccordion("accordion-unittests", "table");
							
						}
						else {
							console.log("GBP not ready");
						}
						
					}
				</script>
		
		</section>