// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
//   console.log('Turning ' + tab.url + ' red!');
//   chrome.tabs.executeScript({
//     code: 'document.body.style.backgroundColor="red"'
//   });
  chrome.tabs.executeScript({
    file: 'inIfame.js'
  });
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
});
var STATUS ={
  disabled: {
    buttonToolTip: 'Add a Paaper to this page',
    buttonIcon: '1464654409058/paper.png'
  },
  enabled: {
    buttonEnabled: true,
    buttonToolTip: 'Remove Paaper from this page',
    buttonIcon: '1464654409058/paaper.png'
  },
  enabledTabIds:{}
}
function tabStatus(id) {
  var _ref;
  var enabledTabIds = STATUS.enabledTabIds;
  if (!enabledTabIds[id]) {
    enabledTabIds[id] = true;
    return STATUS["enabled"];
  }
  enabledTabIds[id] = false;
  return STATUS["disabled"];
}