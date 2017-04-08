main();

function main() {
  var currentTabs = {};
  var MAX_TABS = 100;

  chrome.browserAction.onClicked.addListener(openLastTab);
  chrome.tabs.onRemoved.addListener(saveTab);
  chrome.tabs.onUpdated.addListener(updateTab);

  function updateTab(tabId, changeInfo, tab) {
    currentTabs[tabId] = tab.url;
  }

  function openLastTab() {
    var tabs = getTabs();
    var lastTab = tabs.pop();
    chrome.tabs.create({
      'url': lastTab,
      'selected': true
    }, function () {
      setTabs(tabs);
    });
  }

  function saveTab(tabId) {
    var tabUrl = currentTabs[tabId];
    if (!tabUrl || tabUrl === 'chrome://newtab/') return;

    var tabs = getTabs();
    tabs.push(tabUrl);
    setTabs(tabs);

    delete currentTabs[tabId];
  }

  function setTabs(tabs) {
    if (!Array.isArray(tabs)) {
      tabs = []
    }
    tabs = tabs.slice((tabs.length - MAX_TABS), tabs.length);
    localStorage.setItem('lastTabs', JSON.stringify(tabs));
  }

  function getTabs() {
    var tabs = [];

    try {
      tabs = JSON.parse(localStorage['lastTabs']);
    } catch (e) { }

    if (Array.isArray(tabs)) {
      return tabs;
    } else {
      return [];
    }
  }
}

