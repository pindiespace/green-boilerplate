/**
 * primordial JSON parser
 * http://www.sitepoint.com/javascript-json-serialization/
 */
window.JSON = window.JSON || {};

// implement JSON.stringify serialization

JSON.stringify = JSON.stringify || function (obj) {

	var t = typeof (obj);
	
	var t = Object.prototype.toString.call(retrievedObject).slice(8, -1);
	
	switch (t.toLowerCase()) {
		case null:
		case "string":
		case "number":
			obj = '"'+obj+'"';
			return String(obj);
			break;
		case "object":
			// recurse array or object
			var n, v, json = [], arr = (obj && obj.constructor == Array);
			
			for (n in obj) {
				v = obj[n]; t = typeof(v);
				if (t == "string") {
					v = '"'+v+'"';
				}
				else if (t == "object" && v !== null) {
					v = JSON.stringify(v);
				}
			
				json.push((arr ? "" : '"' + n + '":') + String(v));
			}
		
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
			break;
		case "date":
			return String("date");
			break;
		default:
			break;
		
		
	}
	
	return null;
	
	if (t != "object" || obj === null) {
		
		//simple data type
		
		if (t == "string") {
			obj = '"'+obj+'"';
		}
		return String(obj);	
	}
	else {
		
		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);
		
		for (n in obj) {
			v = obj[n]; t = typeof(v);
			
			if (t == "string") v = '"'+v+'"';
                        
			else if (t == "object" && v !== null) v = JSON.stringify(v);
			
			json.push((arr ? "" : '"' + n + '":') + String(v));
		}
		
		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};

//implement JSON.parse de-serialization

JSON.parse = JSON.parse || function (str) {
	if (str === "") str = '""';
	eval("var p=" + str + ";");
	return p;
};