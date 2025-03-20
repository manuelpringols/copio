const extensionId = chrome.runtime.id;




chrome.runtime.onInstalled.addListener(() => {
  console.log("[CopioExtension] Estensione installata o aggiornata.");
  chrome.storage.local.set({ title: "", groupId: "", selectedText: "" }); // Inizializza lo stato
});

// Crea il menu contestuale
chrome.contextMenus.create({
  id: "sendToCopio",
  title: "Send to Copio",
  contexts: ["selection"],
});

// Gestisce il click sul menu contestuale
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendToCopio") {
    const selectedText = info.selectionText;
    // Salva il testo selezionato nella memoria locale
    chrome.storage.local.set({ selectedText: selectedText }, function() {
      console.log("Testo selezionato salvato:", selectedText);
    });
    // Apre il popup (assumendo che il popup si apra con la dimensione corretta)
    chrome.action.openPopup(); // Questo aprirà il popup direttamente (se supportato)
  }
});

// Ascolta il messaggio dal popup per salvare lo snippet
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveSnippet") {
    const snippet = {
      title: message.title,
      content: message.content
    };

    const groupId = message.groupId;

    // Correzione del link nel fetch
    fetch(`http://192.168.1.111:8080/api/snippets/create?groupId=${groupId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Extension-ID': extensionId,
      },
      body: JSON.stringify(snippet)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Snippet creato con successo', data);
    })
    .catch(error => {
      console.error('Errore durante la creazione dello snippet', error);
    });
  }
});
