var pointsRefKey = getParameterByName("key");

if(!pointsRefKey){
	var time = new Date().getTime();
	setParameterByName("key",false,time);
} 
setTitle(pointsRefKey);
var primaryColor = getParameterByName("primaryColor");

var  backgroundShapesUrl= "https://canvaswebsocket.firebaseio.com/lcs/"+stringToHex(pointsRefKey)+"/backgroundShapes";
var backgroundShapesRef = new Firebase(backgroundShapesUrl);

var literallyDiv = document.getElementsByClassName('literally')[0];
LC.init(
  literallyDiv
  ,{
      onInit:function(lc){
		lc.shapes =  sessionGet();

		lc.repaintAllLayers();
		backgroundShapesRef.limitToLast(3).on('child_added', function(childSnapshot, prevChildKey) {
			backgroundShapesPush(childSnapshot.val());
			lc.repaintLayer('background');
		});
		backgroundShapesRef.limitToLast(200).once("value", function(snapshot) {
			snapshot.forEach(function(data) {
				backgroundShapesPush(data.val());
			});
			lc.repaintLayer('background');
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
// 		LC.gotData=function(data){
// 			console.log(data);
// 			for(var key in data){
// 				LC.backgroundShapesPush(data[key]);
// 			}
// 			lc.repaintLayer('background');
// 		}
		function backgroundShapesPush(value){
			var shape = LC.JSONToShape({className:"LinePath",data:value});
			lc.backgroundShapes.push(shape);
			value = null;
			shape = null;
		}
// 		var jsonP = htmlToElement('<script src="'+backgroundShapesUrl+'.json?orderBy=%22$key%22&limitToLast=2&callback=LC.gotData"></script>');
// 		document.body.appendChild(jsonP); 
		
      }
      ,primaryColor:primaryColor?"#"+primaryColor:"hsla(0, 0%, 0%, 1)"
  }
);



if ("onhashchange" in window) {
    var setTransform = function(){
        literallyDiv.style.transform = window.location.hash.substring(1);
    };
    setTransform();
    window.onhashchange = setTransform;
}

document.smsForm.text.value +=("+"+location.href);
document.smsForm.onsubmit=function(e){
	e.preventDefault();
	smsShowStatus(100);
	var url = "http://charon-node.herokuapp.com/cross?api="+this.action+"&"+serialize(this);
	httpGetAsync(url,function(text){
		var data = JSON.parse(text);
		smsShowStatus(data.messages[0].status);
	});
}



function refSave(shape) {
	var copy = Object.assign({}, shape);
    var points = copy.points;
    
    copy["smoothedPoints"]=[];
    copy["tail"]=[];
    copy["sampleColor"]=copy.points[0].color;
    for(var i = 0;i<points.length;i++){
    	delete points[i].color;
    	delete points[i].id;
    }
    backgroundShapesRef.push(copy);
//     copy = null;
//     backgroundShapesRef.child("help").on("value", function(snapshot) {
// 		backgroundShapesRef.push(copy);
// 	});
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
	return "u" + arr.join("u");
}
function hexToString(str) {
	return unescape(str.replace(/u/g, "%u"));
}
function danghua(color){
	if(color.indexOf("#")==0){
		return color;
	}
	return "hsla(0, 0%, 0%, 0.5)";
} 
function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}
function setTitle(title){
	var titleDom = document.getElementsByTagName("title")[0];
	titleDom.innerHTML=title;
}
function httpGetAsync(theUrl, callback,data)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(data?data:null);
}
function smsShowStatus(status){
	var statusEle = document.getElementById("statusSms");
	var statusText;
	if(status===0){
		statusText="sucess";
	}else if(status===100){
		statusText="sending";
	}else{
		statusText = "error "+status;
	}
	statusEle.innerHTML=statusText;
}
 function serialize (form) {
        if (!form || form.nodeName !== "FORM") {
                return;
        }
        var i, j, q = [];
        for (i = form.elements.length - 1; i >= 0; i = i - 1) {
                if (form.elements[i].name === "") {
                        continue;
                }
                switch (form.elements[i].nodeName) {
                case 'INPUT':
                        switch (form.elements[i].type) {
                       	case '':
                        case 'number':
                        case 'text':
                        case 'hidden':
                        case 'password':
                        case 'button':
                        case 'reset':
                        case 'submit':
                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                                break;
                        case 'checkbox':
                        case 'radio':
                                if (form.elements[i].checked) {
                                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                                }                                               
                                break;
                        }
                        break;
                        case 'file':
                        break; 
                case 'TEXTAREA':
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                        break;
                case 'SELECT':
                        switch (form.elements[i].type) {
                        case 'select-one':
                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                                break;
                        case 'select-multiple':
                                for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                                        if (form.elements[i].options[j].selected) {
                                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
                                        }
                                }
                                break;
                        }
                        break;
                case 'BUTTON':
                        switch (form.elements[i].type) {
                        case 'reset':
                        case 'submit':
                        case 'button':
                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                                break;
                        }
                        break;
                }
        }
        return q.join("&");
}