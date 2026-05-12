const extensionId = chrome.runtime.id;

chrome.runtime.onInstalled.addListener(() => {
  console.log("[CopioExtension] Estensione installata o aggiornata.");

  chrome.storage.local.set({ title: "", groupId: "", selectedText: "" });

  chrome.contextMenus.create(
    {
      id: "sendToCopio",
      title: "Send to Copio",
      contexts: ["selection"],
    },
    () => {
      if (chrome.runtime.lastError) {
        console.warn("Context menu:", chrome.runtime.lastError.message);
      }
    }
  );
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "sendToCopio") return;

  const selectedText = info.selectionText || "";

  chrome.storage.local.set({ selectedText }, () => {
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 420,
      height: 560,
      left: 100,
      top: 100,
    });
  });
});