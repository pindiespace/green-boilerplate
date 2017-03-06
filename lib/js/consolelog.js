<script>
/** 
 *****************************************************************
 * simple console object
 *****************************************************************
 */
window.console = window.console || (function (str) {
		
		var log = function (str) {
			if(!window.consolelist) {
				window.consolelist = '';
			}
			window.consolelist += str + "\n";
		}
		
		var logshow = function () { 
			alert(window.consolelist);
		}
		
		return {
			log: log,
			logshow: logshow
		}
	})();
</script>
