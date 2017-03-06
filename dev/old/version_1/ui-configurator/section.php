<div class="wrapper">

<!--area of gbp-tools output-->
<section>

	<!--navigation system-->
	<nav role="navigation">
		<ul id="nav">
			<li><a class="wt current" href="/download/">Download</a></li>
			<li><a class="wt" href="/docs/">Documentation</a></li>
			<li><a class="wt" href="/resources/">Resources</a></li>
			<li><a class="wt" href="/news/">News</a></li>
		</ul>
	</nav>

	<!--top page header-->
	<header id="page-title">
		<hgroup>
			<a href="/" class="banner" role="banner">
				<h1 class="title">Green Boilerplate</h1>
				<h2 class="subtitle"><span>Minimize</span> Your Site's Carbon Footprint</h2>
			</a>
		</hgroup>
	</header>
    
    <section>
    
			<form action="#" class="configurator">
            
            	<fieldset class="features" id="group-footprint">
                
                	<legend class="features-title">Carbon Footprint</legend>
                    
                    <ul>
                    	<li><input id="footprint-server-data" type="checkbox" value="footprint-server-data"><label for="footprint-server-data">Server Data</label></li>
                    	<li><input id="footprint-server-time" type="checkbox" value="footprint-server-time"><label for="footprint-server-time">Server Time</label></li>
                        <li><input id="footprint-client-data" type="checkbox" value="footprint-client-time"><label for="footprint-client-data">Client Data</label></li>
                        <li><input id="footprint-client-time" type="checkbox" value="footprint-client-time"><label for="footprint-client-time">Client Time</label></li>
                    	<li><input id="footprint-isp-quality" type="checkbox" value="footprint-isp-quality"><label for="footprint-isp-quality">ISP</label></li>
                        <li><input id="footprint-network-quality" type="checkbox" value="footprint-network-quality"><label for="footprint-network-quality">Network</label></li>
                        <li><input id="footprint-local-utility" type="checkbox" value="footprint-local-utility"><label for="footprint-local-utility">Local Utility</label></li>
                        <li><input id="footprint-device-power" type="checkbox" value="footprint-device-power"><label for="footprint-device-power">Device Power</label></li>
                        <li><input id="footprint-battery-level" type="checkbox" value="footprint-battery-level"><label for="footprint-battery-level">Battery Level</label></li>
                        <li><input id="footprint-internet-index" type="checkbox" value="footprint-internet-index"><label for="footprint-internet-index">Internet Index</label></li>
                    </ul>
                
                </fieldset>
                
                <fieldset class="features" id="elements">
                
                	<legend class="features-title">Include Components</legend>
                    
                    <ul>
                    	<li><input id="component-server-detect" type="checkbox" value="component-server-detect"><label for="component-server-detect">Server-Side Feature Detection</label></li>
                    	<li><input id="component-client-detect" type="checkbox" value="component-client-detect"><label for="component-client-detect">Browser (JavaScript) Feature Detection</label></li>
                        <li><input id="component-send-to-server" type="checkbox" value="component-send-to-server"><label for="compoment-send-to-server">Update Server with Browser Results</label></li>
                        <li><input id="component-store-cookie" type="checkbox" value="component-store-data-cookie"><label for="component-store-data-cookie">Store locally in a cookie</label></li>
                        <li><input id="compoment-store-localstorage" type="checkbox" value="component-store-localstorage"><label for="component-store-localstorage">Store locally in HTML5 localStorage</label></li>
                    </ul>
                
                </fieldset>
            
            	<fieldset class="features" id="features-device">
                
                	<ul>
						<li><input id="device-res-x" type="checkbox" value="device-res-x"><label for="device-res-x">Device Screen Width</label></li>
						<li><input id="device-res-y" type="checkbox" value="device-res-y"><label for="device-res-y">Device Screen Height</label></li>
						<li><input id="device-has-retina" type="checkbox" value="device-has-retina"><label for="device-has-retina">Has Retina Display</label></li>
						
                     	<li><input id="device-is-mobile" type="checkbox" value="device-is-mobile"><label for="device-is-mobile">Device is Mobile (generic)</label></li>
						<li><input id="device-is-tablet" type="checkbox" value="device-is-tablet"><label for="device-is-tablet">Device is a Tablet(generic)</label></li>
						<li><input id="device-is-textreader" type="checkbox" value="device-is-textreader"><label for="device-is-textreader">Device is Textreader (text-only)</label></li>
						<li><input id="device-is-wap" type="checkbox" value="device-is-wap"><label for="device-is-wap">Device is (old) WAP phone</label></li>
						<li><input id="device-is-featurephone" type="checkbox" value="device-is-featurephone"><label for="device-is-featurephone">Device is Feature Phone</label></li>
						<li><input id="device-is-media-player" type="checkbox" value="device-is-media-player"><label for="device-is-media-player">Media Player</label></li>
						<li><input id="device-is-game-console" type="checkbox" value="device-is-game-console"><label for="device-is-game-console">Game Console</label></li>
						<li><input id="device-is-desktop" type="checkbox" value="device-is-desktop"><label for="device-is-desktop">Desktop</label></li>
						<li><input id="device-os-name" type="checkbox" value="device-os-name"><label for="device-os-name">Operating System</label></li>
						<li><input id="device-os-version" type="checkbox" value="device-os-version"><label for="device-os-version">Operating System Version</label></li>
                    </ul>
                
                </fieldset>
                
                <fieldset class="features" id="features-browser">
                
                	<ul>
                  		<li><input id="browser-name" type="checkbox" value="browser-name"><label for="browser-name">Browser Name</label></li> 
                        <li><input id="browser-fork" type="checkbox" value="browser-fork"><label for="browser-fork">Browser Fork (Parent)</label></li> 
                    	<li><input id="browser-version" type="checkbox" value="browser-vesion"><label for="browser-version">Browser (Major) Version</label></li>
                        <li><input id="browser-release-date" type="checkbox" value="browser-release-date"><label for="browser-release-date">Browser Release Date</label></li>
                        <li><input id="browser-has-cloud-render" type="checkbox" value="browser-has-cloud-render"><label for="browser-has-cloud-render">Uses &quot;Cloud&quot; Rendering</label></li>                        
                    </ul>
                
                </fieldset>
                
                <fieldset class="features" id="features-html">
                
                	<ul>
                        <li><input id="has-wml" type="checkbox" value="has-wml">supports WML</li>
                        <li><input id="has-imode" type="checkbox" value="has-imode"><label for="has-imode">Supports i-Mode</label></li>
                		<li><input id="has-chtml" type="checkbox" value="has-chtml"><label for="has-chtml">Supports cHTML</label></li>
                        <li><input id="has-html4" type="checkbox" value="has-html4"><label for="has-html4">Supports HTML4(XHTML)</label></li>
                        <li><input id="has-html5" type="checkbox" value="has-html5"><label for="has-html5">Supports HTML5</label></li>
                        <li><input id="has-canvas" type="checkbox" value="has-canvas"><label for="has-canvas">Supports Canvas API</label></li>
                        <li><input id="has-canvas-text" type="checkbox" value="has-canvas-text"><label for="has-canvas-text">Canvas Text API</label></li>
						<li><input id="has-html5-audio" type="checkbox" value="has-html5-audio"><label for="has-html5-audio">HTML5 Audio API</label></li>
                        <li><input id="has-html5-video" type="checkbox" value="has-html5-video"><label for="has-html5-video">HTML5 Video API</label></li>
                        <li><input id="has-iframes" type="checkbox" value="has-iframes"><label for="has-iframes">IFrames</label></li>
                        <li><input id="has-svg" type="checkbox" value="has-svg"><label for="has-svg">SVG</label></li>
                        <li><input id="has-inline-svg" type="checkbox" value="has-inline-svg"><label for="has-inline-svg">Inline SVG</label></li>
                        <li><input id="has-webfonts" type="checkbox" value="has-webfonts"><label for="has-webfonts">Web Fonts</label></li>
                        <li><input id="has-geolocation" type="checkbox" value="has-geolocation"><label for="has-geolocation">Geolocation API</label></li>
                        <li><input id="has-web-gl" type="checkbox" value="has-web-gl"><label for="has-web-gl">WebGL</label></li>
                        <li><input id="has-low-battery" type="checkbox" value="has-low-battery"><label for="has-low-battery">Low Battery API</label></li>
                        <li><input id="has-web-workers" type="checkbox" value="has-web-workers"><label for="has-web-workers">WebWorkers API</label></li>
						<li><input id="has-web-sockets" type="checkbox" value="has-web-sockets"><label for="has-web-sockets">Web Sockets API</label></li>
                        <li><input id="has-drag-and-drop" type="checkbox" value="has-drag-and-drop"><label for="has-drag-and-drop">Drag and Drop</label></li>
                    </ul>
                
                </fieldset>
          
				<fieldset class="has" id="features-css">
					<ul>					
                        <li><input id="has-css" type="checkbox" value="has-css"><label for="has-css">CSS (basic)</label></li>
                        <li><input id="has-css2" type="checkbox" value="has-css2"><label for="has-css2">CSS 2.1</label></li>
                        <li><input id="has-css3" type="checkbox" value="has-css3"><label for="has-css3">CSS 3 (full)</label></li>   					
					</ul>

				</fieldset>
                
                <fieldset class="has" id="features-ecma">
               		<ul>
                        <li><input id="has-js" type="checkbox" value="has-js"><label for="has-js">JavaScript (minimal)</label></li>   					               		
                        <li><input id="has-json" type="checkbox" value="has-json"><label for="has-json">JSON</label></li>   					               		
                        <li><input id="has-dom0" type="checkbox" value="has-dom0"><label for="has-dom0"></label>DOM0 Methods</li>   					               		
                        <li><input id="has-dom1" type="checkbox" value="has-dom1"><label for="has-dom1"></label>DOM1 Methods</li>   					               		
                        <li><input id="has-dom2" type="checkbox" value="has-dom2"><label for="has-dom2">DOM2 Methods (complete)</label></li>   					               		
                        <li><input id="has-dom3" type="checkbox" value="has-dom3"><label for="has-dom3">Has DOM3 Methods (complete)</label></li>
						<li><input id="has-queryselector" type="checkbox" value="has-queryselector"><label for="has-queryselector"></label></li>   					               		 					               	
                        <li><input id="has-ecmascript5" type="checkbox" value="has-ecmascript5"><label for="has-ecmascript5">Has ECMAScript 5 (complete)</label></li>   					               		
               		</ul>
                
                </fieldset>
                
                <fieldset class="has" id="features-tests">
                
                	<ul>
                	    <li><input id="tests-acid2" type="checkbox" value="tests-acid2"><label for="tests-acid2">Acid2 Test Result</label></li>
                        <li><input id="tests-acid3" type="checkbox" value="tests-acid3"><label for="tests-acid3">Acid3 Test Result</label></li>
                	</ul>
                
                </fieldset>
                
              <div class="generate-boilerplate">
                     <a href="generate" class="button" id="generate">Generate! <span>(requires JavaScript)</span></a>
                     <a class="btn2">Download custom build</a>
                  </div>

               <div id="source">
                  <textarea readonly="readonly" class="code" id="generated-source">// Minified source</textarea>
                  <div class="dontmin-container"><label for="dontmin"><input type="checkbox" id="dontmin" value="dontmin" /> <small>Don't Minify Source</small></label></div>
               </div>
          
          </form>
    
    </section>
    
    <footer>
    
    </footer>
    


</section><!--end of page section-->

</div><!--end of wrapper-->