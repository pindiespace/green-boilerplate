		<section>
		<?php  	
				require_once('lib/php/gbp-analyze.php');
				$ua_analyze = new GBP_ANALYZE;
			?>
			
			<h2>Analyze Client</h2><!--floated right-->
			
			<p class="description"><!--floated left-->
		User-agent:<?php 
					$ua_analyze->clean($_SERVER['HTTP_USER_AGENT']);
					echo $_SERVER['HTTP_USER_AGENT'];
				?>
			</p>
			
			<article class="balloon">
				<h3 class="hide">User-Agent Test Detail</h3>
				<?php 

					
					$browser_info = $ua_analyze->get_client($_SERVER['HTTP_USER_AGENT']); //default user-agent
				?>
			</article>
			
			<article class="balloon">
				<?php
				
					$ua_analyze->print_stats();
				
				?>
			</article>
			
		</section>