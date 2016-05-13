



load(self,[]);
// var defaultBoard = new DrawingBoard.Board('canvas');


function load(view,points) {












"use strict";
// The canvas drawing portion of the demo is based off the demo at
// http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/
var
	  document = view.document
	
	, $ = function(id) {
		return document.getElementById(id);
	}
	, session = view.sessionStorage

	, canvas = $("canvas")

	, canvas_clear_button = $("canvas-clear")
	, ctx = canvas.getContext("2d")
	, drawing = false

	, points = points||session.points ||[]
	, add_point = function(x, y, dragging) {
		var point = {
			x:x,
			y:y,
			dragging:dragging
		};
		points.push(point);
	}
	
	, stop_drawing = function() {
		drawing = false;
	}
	
;
// canvas.width = 900;
// canvas.height = 600;

if (typeof points === "string") {
	points = JSON.parse(points);
}
drawing = true;
draw();
drawing = false;
canvas.addEventListener("mousedown", function(event) {
	event.preventDefault();
	drawing = true;
	add_point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop, false);
	draw();
}, false);
canvas.addEventListener("mousemove", function(event) {
	if (drawing) {
		add_point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop, true);
		draw();
	}
}, false);
canvas.addEventListener("mouseup", stop_drawing, false);
canvas.addEventListener("mouseout", stop_drawing, false);

view.addEventListener("unload", function() {
	session.points = JSON.stringify(points);
}, false);
canvas_clear_button.addEventListener("click", function() {
	canvas.width = canvas.width;
	points.length =
		0;
}, false);





var pointsRef = new Firebase("https://canvaswebsocket.firebaseio.com/1462950411082");

var websocketStatus = false;
pointsRef.on("value", function(dataSnapshot,prevChildKey) {
	var value = dataSnapshot.val();
	if(!websocketStatus){
	    var value = dataSnapshot.val();
	    if(value){
	    	var newPoints = Object.keys(value).map(function (key) {return value[key]});
			
	    }
	    points = watch(newPoints);
		draw();
		
	}
   websocketStatus = true;
});
pointsRef.on('child_added', function(childSnapshot, prevChildKey) {
  // code to handle new child.
  if(websocketStatus){
	  var value = childSnapshot.val();
	  var index = points.contains(value);

	  if(!index){
	  	points.push2(value);
	  	draw();
	  }
  }
});
   
function watch(array){
	var x = new ObservableArray(array);
	console.log("original array: %o", x.slice());

	x.addEventListener("itemadded", function(e) {
		console.log("Added %o at index %d.", e.item, e.index);
		if(websocketStatus){
			pointsRef.push(e.item);
		}
	});
	return x;
}


function draw(){
	canvas.width = canvas.width;
	ctx.lineWidth = 6;
	ctx.lineJoin = "round";
	ctx.strokeStyle = "#000000";


	ctx.beginPath();
	var
		  i = 0
		, len = points.length
	;
	for(; i < len; i++) {
		if (i && points[i].dragging) {
			ctx.moveTo(points[i-1].x, points[i-1].y);
		} else {
			ctx.moveTo(points[i].x-1, points[i].y);
		}
		ctx.lineTo(points[i].x, points[i].y);

	}
	ctx.closePath();
	ctx.stroke();
}

};
