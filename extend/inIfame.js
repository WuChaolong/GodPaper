console.log(document.readyState);
if(!this.paaper){
	this.paaper = createPaaper();
}


function createPaaper(){
	var htmlElement = document.getElementsByTagName("html")[0];
	
	htmlElement.style["position"]="relative";
    htmlElement.style["min-height"]="100%";
	var protocol = location.protocol=="https:"?"https:":"http:";
	var paaperHTML = '<iframe src="'+protocol+'//wuchaolong.github.io/paaper/?key='+location.href
		+'" style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;z-index: -1;border:0;pointer-events: none; max-height: 2000px;max-width: 2000px;box-shadow: rgb(187, 191, 194) 1px 1px 5px;"></iframe>';
	var paaper = htmlToElement(paaperHTML);
	var cssEle = htmlToElement('<style>@-webkit-keyframes move_eye { from { right:0;}  60%{right:0;} to  { right:-21em;}  }@-moz-keyframes move_eye { from { right:0;}  60%{right:0;} to  { right:-21em;}  }@-o-keyframes move_eye { from { right:0;}  60%{right:0;} to  { right:-21em;}  }@keyframes move_eye { from { right:0;}  60%{right:0;} to  { right:-21em;}  } .show-prompt{position: fixed;bottom: .5em;right: -21em;z-index: 2;box-shadow: 1px 1px 5px #868686;padding: .5em;padding-left: 3.5em;transition: right 2s;background-image: url(//wuchaolong.github.io/paaper/extend/1464654409058/paaper.png);background-size:3.5em 100%;background-repeat: no-repeat;-webkit-animation: 5s ease-in-out move_eye;-moz-animation: 5s ease-in-out move_eye;-o-animation: 5s ease-in-out move_eye;animation: 5s ease-in-out move_eye;font-family: initial;}.show-prompt:hover{right:0;animation-play-state: paused;}</style>');
	document.body.appendChild(paaper);
	document.body.appendChild(cssEle);
	try{
		addDblclik(htmlElement,paaper.contentWindow);
	}catch(e){
		showPrompt('<div class="show-prompt">'+JSON.stringify(e)+'</div>')
	}
	return paaper;
}
function addDblclik(e1,e2){
	e2.ondblclick = null;
	var HAS_TOUCH = ('ontouchstart' in window);
	e1.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
	e1.addEventListener('dbltap', printEvt, false);
	function printEvt(e){
		if(!(window.getSelection().toString() == false||e.target.className=="show-prompt")){
			return;
		}
		var htmlElement = document.getElementsByTagName("html")[0];
		if(paaper.style["pointer-events"] == "none"){
			openWritePaaper();
// 			addDblclik(paaper.contentWindow,htmlElement)
		}else{
			onlyReadPaaper();
// 			addDblclik(htmlElement,paaper.contentWindow);
		}
	}
}
function openWritePaaper(){

    paaper.style["pointer-events"] = "auto";
    paaper.style["z-index"] = 1;
    if(true){
    	showPrompt('<div class="show-prompt">哈哈，你能画了，或者双击这回去<br>Haha,You can write,or dblclick me back</div>')
    }
	
}

function onlyReadPaaper(){

	paaper.style["pointer-events"] = "none";
	paaper.style["z-index"] = -1;
	var prompts = document.getElementsByClassName("show-prompt");
	for(var i = 0;i<prompts.length;i++){
		prompts[i].remove();
	}
}


function showPrompt(html){
	var element = htmlToElement(html);
	document.body.appendChild(element); 
}


/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}



/**
 * Creates a event handler which unifies click and dblclick events between desktop and touch as tap and dbltap.
 * Copyright (c)2012 Stephen M. McKamey.
 * Licensed under The MIT License.
 * 
 * @param {number} speed max delay between multi-clicks in milliseconds (optional, default: 500ms)
 * @param {number} distance max distance between multi-clicks in pixels (optional, default: 40px)
 * @return {function(Event)} touchend/mouseup event handler
 */
function doubleTap (speed, distance) {
	'use strict';

	// default dblclick speed to half sec (default for Windows & Mac OS X)
	speed = Math.abs(+speed) || 500;//ms
	// default dblclick distance to within 40x40 pixel area
	distance = Math.abs(+distance) || 40;//px

	// Date.now() polyfill
	var now = Date.now || function() {
		return +new Date();
	};

	var cancelEvent = function(e) {
		e = (e || window.event);
	
		if (e) {
			if (e.preventDefault) {
				e.stopPropagation();
				e.preventDefault();
			} else {
				try {
					e.cancelBubble = true;
					e.returnValue = false;
				} catch (ex) {
					// IE6
				}
			}
		}
		return false;
	};

	var taps = 0,
		last = 0,
		// NaN will always test false
		x = NaN,
		y = NaN;

	return function(e) {
			e = (e || window.event);

			var time = now(),
				touch = e.changedTouches ? e.changedTouches[0] : e,
				nextX = +touch.clientX,
				nextY = +touch.clientY,
				target = e.target || e.srcElement,
				e2,
				parent;

			if ((last + speed) > time &&
				Math.abs(nextX-x) < distance &&
				Math.abs(nextY-y) < distance) {
				// continue series
				taps++;

			} else {
				// reset series if too slow or moved
				taps = 1;
			}

			// update starting stats
			last = time;
			x = nextX;
			y = nextY;

			// fire tap event
			if (document.createEvent) {
				e2 = document.createEvent('MouseEvents');
				e2.initMouseEvent(
					'tap',
					true,				// click bubbles
					true,				// click cancelable
					e.view,				// copy view
					taps,				// click count
					touch.screenX,		// copy coordinates
					touch.screenY,
					touch.clientX,
					touch.clientY,
					e.ctrlKey,			// copy key modifiers
					e.altKey,
					e.shiftKey,
					e.metaKey,
					e.button,			// copy button 0: left, 1: middle, 2: right
					e.relatedTarget);	// copy relatedTarget

				if (!target.dispatchEvent(e2)) {
					// pass on cancel
					cancelEvent(e);
				}

			} else {
				e.detail = taps;

				// manually bubble up
				parent = target;
				while (parent && !parent.tap && !parent.ontap) {
					parent = parent.parentNode || parent.parent;
				}
				if (parent && parent.tap) {
					// DOM Level 0
					parent.tap(e);

				} else if (parent && parent.ontap) {
					// DOM Level 0, IE
					parent.ontap(e);

				} else if (typeof jQuery !== 'undefined') {
					// cop out and patch IE6-8 with jQuery
					jQuery(this).trigger('tap', e);
				}
			}

			if (taps === 2) {
				// fire dbltap event only for 2nd click
				if (document.createEvent) {
					e2 = document.createEvent('MouseEvents');
					e2.initMouseEvent(
						'dbltap',
						true,				// dblclick bubbles
						true,				// dblclick cancelable
						e.view,				// copy view
						taps,				// click count
						touch.screenX,		// copy coordinates
						touch.screenY,
						touch.clientX,
						touch.clientY,
						e.ctrlKey,			// copy key modifiers
						e.altKey,
						e.shiftKey,
						e.metaKey,
						e.button,			// copy button 0: left, 1: middle, 2: right
						e.relatedTarget);	// copy relatedTarget

					if (!target.dispatchEvent(e2)) {
						// pass on cancel
						cancelEvent(e);
					}

				} else {
					e.detail = taps;

					// manually bubble up
					parent = target;
					while (parent && !parent.dbltap && !parent.ondbltap) {
						parent = parent.parentNode || parent.parent;
					}
					if (parent && parent.dbltap) {
						// DOM Level 0
						parent.dbltap(e);

					} else if (parent && parent.ondbltap) {
						// DOM Level 0, IE
						parent.ondbltap(e);

					} else if (typeof jQuery !== 'undefined') {
						// cop out and patch IE6-8 with jQuery
						jQuery(this).trigger('dbltap', e);
					}
				}
			}
		};
};

/**
 * Creates a event handler which mutually exclusively responds to either a single or double (or higher) click/tap.
 * Copyright (c)2012 Stephen M. McKamey.
 * Licensed under The MIT License.
 * 
 * @param {function...} actions the possible actions to take in order by number of clicks
 * @param {number} speed max delay between multi-clicks in milliseconds (optional, default: 300ms)
 * @return {function(Event)} mutually exclusive event handler
 */
function xorTap() {
	'use strict';

	var actions = Array.prototype.slice.call(arguments),
		length = actions.length;

	var speed = 300;//ms
	if (typeof actions[length-1] === 'number') {
		length--;
		speed = Math.abs(+actions[length]) || speed;
	}

	var pendingClick = 0,
		kill = function() {
			// kill any pending single clicks
			if (pendingClick) {
				clearTimeout(pendingClick);
				pendingClick = 0;
			}
		},
		xor = function(e) {
			e = (e || window.event);

			kill();

			var elem = this,
				action = actions[e.detail-1];

			if (typeof action === 'function') {
				if (e.detail < length) {
					if (typeof jQuery !== 'undefined' &&
						''+e !== '[object Object]') {
						// NOTE: IE8 freaks if event is kept past its scope
						e = jQuery.extend(new jQuery.Event(), e);
					}
					pendingClick = setTimeout(function() {
						action.call(elem, e);
					}, speed);

				} else {
					action.call(elem, e);
				}
			}
		};

	// expose kill for certain edge cases
	xor.kill = kill;

	return xor;
};
