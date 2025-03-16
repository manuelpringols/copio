//const api = typeof browser !== 'undefined' ? browser : chrome;

// Ascolta l'installazione o l'aggiornamento dell'estensione
const api = chrome;  // Usa chrome direttamente

chrome.runtime.onInstalled.addListener(() => {
  console.log("[CopioExtension] Estensione installata o aggiornata.");
  chrome.storage.local.set({ title: "", groupId: "", selectedText: "" }); // Inizializza lo stato

  // Crea il menu contestuale
  chrome.contextMenus.create({
    id: "sendToCopio",
    title: "Send to Copio",
    contexts: ["selection"],
  }, function() {
    console.log("Menu contestuale creato.");
  });
});

// Gestisce il click sul menu contestuale
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("Cliccato sul menu: ", info.menuItemId);
  if (info.menuItemId === "sendToCopio") {
    const selectedText = info.selectionText;
    console.log("Testo selezionato: ", selectedText);
    chrome.storage.local.set({ selectedText: selectedText });


    // Crea una finestra simile a un popup, senza aprire un nuovo tab.
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),  // Questo carica il popup come finestra separata
      type: "popup",  // Finestra popup
      width: 400,  // Imposta la larghezza
      height: 600,  // Imposta l'altezza
      left: 100,  // Imposta la posizione a sinistra
      top: 100  // Imposta la posizione in alto
    });
  }
});




// Ascolta il messaggio dal popup per salvare lo snippet
api.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveSnippet") {
    const snippet = {
      title: message.title,
      content: message.content
    };

    const groupId = message.groupId;

    // Correzione del link nel fetch
    fetch(`http://localhost:8080/api/snippets/create?groupId=${groupId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
