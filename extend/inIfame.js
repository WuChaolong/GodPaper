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
	e1.ondblclick = function(e){
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