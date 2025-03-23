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
    // Esegue uno script nel tab attuale per ottenere il testo formattato
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const selection = window.getSelection().toString();
        chrome.storage.local.set({ selectedText: selection });
      }
    })
    .then(() => {
      // Dopo aver salvato il testo, apre il popup
      chrome.action.openPopup();
    });
  }
});

function copyFormattedText() {
  try {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    // Crea un elemento temporaneo per contenere la selezione
    const range = selection.getRangeAt(0);
    const tempDiv = document.createElement("div");
    tempDiv.appendChild(range.cloneContents());

    // Crea un'area nascosta per copiare
    const hiddenArea = document.createElement("textarea");
    hiddenArea.style.position = "absolute";
    hiddenArea.style.left = "-9999px";
    hiddenArea.value = tempDiv.innerText;

    document.body.appendChild(hiddenArea);
    hiddenArea.select();

    // Esegui la copia simulando il comportamento di CTRL + C
    document.execCommand("copy");
    document.body.removeChild(hiddenArea);

    console.log("Testo copiato con la formattazione!");
  } catch (err) {
    console.error("Errore nella copia con formattazione: ", err);
  }
}


// Funzione che gestisce la formattazione (escape dei ritorni a capo e spazi multipli)
function escapeFormatting(text) {
  return text
    .replace(/\n/g, '<br>')  // Sostituisce i ritorni a capo con <br>
    .replace(/\s{2,}/g, function(match) {
      return '&nbsp;'.repeat(match.length);  // Sostituisce gli spazi multipli con &nbsp;
    });
}




// Ascolta il messaggio dal popup per salvare lo snippet
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveSnippet") {
    const snippet = {
      title: message.title,
      content: message.content
    };

    const groupId = message.groupId;

    // Correzione del link nel fetch
    fetch(`https://copio.online:9000/*/api/snippets/create?groupId=${groupId}`, {
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
