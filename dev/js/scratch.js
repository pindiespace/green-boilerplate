		
		////////////////////////////////////////////////////////
		//http://tech.pro/tutorial/666/javascript-tutorial-using-setinterval-and-settimeout
		//
		//Delegate method (fixes old IE)
		//http://www.skinkers.com/2011/05/31/fixing-internet-explorers-settimeout-setinterval-scoping-issues-and-overcome-apisframeworks-that-dont-allow-arguments-to-be-passed-to-callback-methods/
		
		//////////////////////////////////////
		//only run instants
/*		
		events.domready(
			function () { 
				test.first(function () {
					test.second(function () {
							test.third( function () {
									test.fourth();
									test.fifth(function () {
										test.seventh();
										}
									);
									test.sixth();
									}
								);
							}
						);
					}
				); 
			}
		);
*/
/*		

		when( 
			function(pass){
				events.domready(pass);
			}
			
		).then(function(results){
			console.log(results);
			
			when(
				function(pass) {
					test.first();
				},
				function(pass) {
					test.second();
				}
				).then(function(results) {
						console.log(results);
					}
				)
			
			}
		);
		
*/




	for(var i in propArr) {
		propArr[i]();
	}
	
	function finish () {
		
		for(var i in propArr) {
		
			console.log("checking function " +i);
		
			if(typeof propArr[i] === 'function') {
				propArr[i]();
				console.log("prop " + i + " not done, settimeout");
				setTimeout(finish, 10);
			}
			else {
				array.splice(propArr[i], 1);
				console.log("propArr " + i + " complete, array size:" + propArr.length);
				setTimeout(finish, 10);
				//delete test from children
				//which will be in a later row
			}
			
		}
		
	}
	
	if(propArr && propArr.length > 0) {
		console.log("propArr length is now:" + propArr.length);
		finish(propArr, propWrapper);

	}
	console.log("all done");
// JavaScript Document





		var maxExe = 1000;
		var exe = 0;
/*
		function wait (args) {
			console.log("entering wait, args:" + args);
			if(args) {
			console.log("in wait, length:" + args.length);
			var len = args.length;
			exe += 10;
			if(exe > maxExe) {
				console.log("ERROR:timed out");
				return;
			}
			console.log("running tests");
			for(var i = 0; i < len; i++) {
				console.log("helper " + args[i] + " typeof:" + typeof helper[args[i]]);
				if(typeof helper[args[i]] === 'function') {
					console.log("setting timeout");
					setTimeout(wait, 10);
				}
			}
		}
	}
*/

var propArr1 = [helper.first, helper.second, helper.third, helper.fourth, helper.fifth];
//var propArr2 = [helper.sixth, helper.seventh, helper.eighth];
//var propArr3 = [helper.ninth, helper.tenth, helper.eleventh, "bob"];

//propLevelReady(that, propArr1);
//propLevelReady(that, propArr2);
//propLevelReady(that, propArr3);

	var that = GBP;

	exe = 0;
	helper.first(); 
	helper.second();
	helper.domready();
	//wait(["first", "second", "domready"]);
	
	function wait1 () {
		console.log('starting wait1');
		
		var bobo = typeof that.helper.domready;
		var phil = typeof bobo;
		
		console.log("bobo is " + bobo + " and phil is " + phil);
		compareNames(bobo, "function");
		
		if(bobo == "function") console.log("phil is a function");
		else console.log("phil is not the string 'function'");
		
		if(
		typeof that.helper.first === "function" || 
		typeof that.helper.second === "function" || 
		typeof that.helper.domready === 'function') {
				console.log("setting timeout");
				setTimeout(wait1, 10);
				}
		
		/*
		if(typeof that.helper.first === "function" || 
			typeof that.helper.second === "function" || 
			typeof that.helper.domready === 'function') {
				console.log(
				" first:" + typeof that.helper.first + 
				" second:" + typeof that.helper.second + 
				" third:" + typeof that.helper.domready);
				
				setTimeout(wait1, 10);
			}
		*/
			
		console.log("finished wait1");
		return true;
	}
	
	
	
	/** 
	 * run callback
	 */
	if(GBP.ready && typeof GBP.ready === 'function') {
		GBP.ready();
	}
	
	

/*
	console.log("==========READY TO RETURN ================");

	for(var i in helper) {
		console.log("helper[" + i + "]:" + helper[i]);
	}
	
*/
	return true;
	
} //end of run


function propLevelReady (context, fnArr) {
	console.log("in propReady");

	var that = this;
	console.log("that in propLevelReady:" + that);
	var fnLength = fnArr.length;
	var maxExe = 1000;
	var exe = 0;
	
	function processComplete (i) {
		exe++;
		console.log("deleting:" + i + " exe is " + exe);
		
		//fnArr.splice(i, 1);
		//var len = fnArr.length;
		//console.log("New length:" + fnArr.length);
		
	}
	
	function wait () {
		if(exe < fnLength || exe > maxExe) {
			setTimeout(wait, 10);
		}
	}
	
	for(var i in fnArr) {
		//console.log("outside initial loop for:" + i);
		(function () { 
		//	console.log("inside wrapper function for initial loop for:" + i);
			if(typeof fnArr[i] === 'function') {
				//fnArr[i].call(context);
				fnArr[i]();
		//		console.log("done with executing function:" + i);
				processComplete(i);
			}
		})();
		
		wait();
	}
	

}






===========================================

//var propArr4 = ["first", "second", "third", "fourth", "fifth"];
//var propArr5 = ["sixth", "seventh", "eighth"];
//var propArr6 = ["ninth", "tenth", "eleventh", "bob"];

//propReady(propArr1, that);
//propReady(propArr2, that);
//propReady(propArr3, that);


/*
function propWrapper (propArr, context) {
	
	if(!context) context = this;
	
	if(propArr.length > 0) {
		
		for(var i in propArr) {
			if(Object.toType(propArr[i]) === "function") {
				if(!~propArr[i].toString().indexOf("this.")) {
					console.log("ERROR, not a self-rewriting function at position:" + i);
					propArr.splice(i, 1);
				}
				else { 
					console.log("executing propArr[" + i + "]");
					propArr[i]();
					//////////////////////////////////////propArr[i].call(context);
				}
			}
			else {
				console.log("ERROR, not a function at position:" + i + ", it is " + Object.toType(propArr[i]));
				propArr.splice(i, -1);
			}
		}
		
		function finish () {
			//console.log("that.propArr.length is :" + that.propArr.length);
			//console.log("propArr.length is " + propArr.length);
			
			for(var i in propArr) {
				//if(typeof propArr[i] !== 'function') {
				//if(Object.toType.call(context, propArr[i]) !== 'function') {
				if(Object.toType(propArr[i]) !== 'function') {
					console.log("prop " + i + " done, is now " + propArr[i] + ", removing prop");
					/////////////////////////propArr.splice.call(context, i, 1);
					propArr.splice(i, 1);
					console.log("propArr length is now:" + propArr.length);
				}
				else {
					//////////////////////console.log("object is a " + Object.toType.call(context, propArr[i]));
					console.log("object is a " + Object.toType(propArr[i]));
				}
			
			}
			
			if(propArr.length > 0) {
				console.log("propArr length is:" + propArr.length);
				setTimeout(finish, 10);
			}
			
		}
		
		finish();
		
	}
	else {
		console.log("propArr.length is:" + propArr.length);
	}


}




var time1 = new Date();
var time1ms = time1.getTime(time1); //i get the time in ms  



propWrapper(propArr1);
propWrapper(propArr2);
propWrapper(propArr3);



var time2 = new Date();
var time2ms = time2.getTime(time2); //i get the time in ms  

var difference = time2ms - time1ms;
console.log("Computation Time:"+difference+" msec");

*/

/** 
 * IMPORTANT: we have to use the Array context to 
 * get the right answer. Using the global context will not work
 */
//console.log(propArr3["eleventh"]);
//console.log(eleventh);

//console.log("PropArr1:");
//for(var i in propArr1) {
//	console.log("propArr1[" + i + "]:" + propArr1[i]);
//}
//console.log("PropArr2:");
//for(var i in propArr2) {
//	console.log("propArr2[" + i + "]:" + propArr2[i]);
//}
//console.log("PropArr3:");
//for(var i in propArr3) {
//	console.log("propArr3[" + i + "]:" + propArr3[i]);
//}



	events.domready(callback);
	function callback() {
		dom.dom0(callback);
		function callback() {
			dom.dom1(callback);
			function callback() {
				dom.dom2();
			}
		}
	}

