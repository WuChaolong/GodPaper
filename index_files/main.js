var pointsRefKey = getParameterByName("key");

if(!pointsRefKey){
	var time = new Date().getTime();
	setParameterByName("key",false,time);
} 
var primaryColor = getParameterByName("primaryColor");


var shapesRef = new Firebase("https://canvaswebsocket.firebaseio.com/"+stringToHex(pointsRefKey));

var literallyDiv = document.getElementsByClassName('literally')[0];
LC.init(
  literallyDiv
  ,{
      onInit:function(lc){
		lc.shapes =  sessionGet();

		lc.repaintAllLayers();
		shapesRef.limitToLast(3).on('child_added', function(childSnapshot, prevChildKey) {
			
			shapesPush(childSnapshot);
			lc.repaintAllLayers();
		});


		shapesRef.on("value", function(snapshot) {
			snapshot.forEach(function(data) {
				shapesPush(data);
			});
			lc.repaintAllLayers();
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});


		function shapesPush(childSnapshot){
			var value = childSnapshot.val();
			var shape = LC.JSONToShape({className:"LinePath",data:value});
			lc.shapes.push(shape);
			value = null;
			shape = null;
		}
      }
      ,primaryColor:primaryColor?"#"+primaryColor:null
  }
);



if ("onhashchange" in window) {
    var setTransform = function(){
        literallyDiv.style.transform = window.location.hash.substring(1);
    };
    setTransform();
    window.onhashchange = setTransform;
}




function refSave(shape) {
	var copy = Object.assign({}, shape);
    copy["smoothedPoints"]=[];
    copy["tail"]=[];
    shapesRef.push(copy);
};
function sessionSave(shape) {
    var shapes = JSON.parse(sessionStorage[pointsRefKey]||"[]");
    shapes.push(shape);
    sessionStorage[pointsRefKey] = JSON.stringify(shapes);
    shapes = null;
};
function sessionGet() {
    var shapes = JSON.parse(sessionStorage[pointsRefKey]||"[]");
    var i,l=shapes.length;
    for(i = 0;i<l;i++){
        
        shapes[i] = LC.JSONToShape({className:"LinePath",data:shapes[i]});
    }
    return shapes;
};
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function setParameterByName(name, url ,value) {
    if (!url) url = window.location.href;
	
	window.location.href = replaceUrlParam(url, name, value);
    
}
function replaceUrlParam(url, paramName, paramValue){

    var pattern = new RegExp('\\b('+paramName+'=).*?(&|$)')
    if(url.search(pattern)>=0){
        return url.replace(pattern,'$1' + paramValue + '$2');
    }
    return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue 
}
if (!Object.assign) {
  Object.defineProperty(Object, "assign", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      "use strict";
      if (target === undefined || target === null)
        throw new TypeError("Cannot convert first argument to object");
      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) continue;
        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
        }
      }
      return to;
    }
  });
}
function stringToHex(str) {
	var arr = [];
	for (var i = 0; i < str.length; i++) {
	  arr[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
	}
	return "\\u" + arr.join("\\u");
}
function hexToString(str) {
	return unescape(str.replace(/\\/g, "%"));
}