chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'open_popup') {
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 400,
      height: 600
    });
  }
});
