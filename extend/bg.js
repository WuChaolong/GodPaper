// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(browserActionClicked);
var STATUS ={
  disabled: {
    buttonToolTip: 'Add a Paaper to this page',
    buttonIcon: '1464654409058/paper.png'
  },
  enabled: {
    status: "enabled",
    buttonToolTip: 'Remove Paaper from this page',
    buttonIcon: '1464654409058/paaper.png'
  },
  readOnly:{
  	status: "readOnly",
    buttonToolTip: 'Remove Paaper from this page',
    buttonIcon: '1464654409058/paaper.png'
  },
  enabledTabIds:{}
}

function browserActionClicked(tab) {
  // No tabs or host permissions needed!
//   console.log('Turning ' + tab.url + ' red!');
//   chrome.tabs.executeScript({
//     code: 'document.body.style.backgroundColor="red"'
//   });
  
	console.log('Turning ' + tab.url + ' red!');

  var status;
    status = tabStatus(tab.id);
    chrome.browserAction.setTitle({
      tabId: tab.id,
      title: status.buttonToolTip
    });
    chrome.browserAction.setIcon({
		tabId: tab.id,
		path: {
        '19': status.buttonIcon
        }

	});

		console.log(status.status);
	if(status.status == "enabled"){
		executeFiles(['inIfame.js','enabledIfame.js']);
    	local(tab.url,"enabled");
	}else if(status.status =="readOnly"){
		
		executeFiles(['inIfame.js','readOnlyIfame.js']);
			
//     	local(tab.url,"enabled");
	}else{
		chrome.tabs.executeScript({
			file: 'removeIfame.js'
		});
		local(tab.url,"");
	}

}

function executeFiles(files){
	chrome.tabs.executeScript(null,{
		file: files[0]
	},function(){
		files.splice(0, 1);
		if(files.length){
			executeFiles(files);
		}
	});	
}
function tabStatus(id) {
  var _ref;
  var enabledTabIds = STATUS.enabledTabIds;
  if (!enabledTabIds[id]) {
    enabledTabIds[id] = true;
    return STATUS["enabled"];
  }

  
	if (enabledTabIds[id]=="readOnly") {
		enabledTabIds[id] = true;
		return STATUS["readOnly"];
	}
  enabledTabIds[id] = false;
  return STATUS["disabled"];
}
function local(url,status){
	if(status=="enabled"){
// 		sessionStorage.setItem(url, 'enabled');
		var object = {};
		object[url]='enabled';
		chrome.storage.sync.set(object, function() {
          // Notify that we saved.
          console.log('Settings saved '+url);
        });
	}else{
// 		sessionStorage.removeItem(url);
		chrome.storage.sync.remove(url, function() {
          // Notify that we saved.
          console.log('Settings remove');
        })
	}

}

chrome.tabs.onUpdated.addListener(function(tabId , info,updatedTab) {
    if (info.status == "complete") {
		mySuperCallback(updatedTab.url);
		
		function mySuperCallback(newUrl) {
// 			var status = sessionStorage.getItem(newUrl);
			var status;
			chrome.storage.sync.get(newUrl,function(a){
				status = a[newUrl];
				if(status == "enabled"){
					STATUS.enabledTabIds[tabId] = "readOnly";
					browserActionClicked(updatedTab);
				}
			})
			
		}
    }
});
