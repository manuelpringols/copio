// Ascolta i messaggi dal background.js o dal popup.js

const api = typeof browser !== 'undefined' ? browser : chrome;


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "copyToClipboard") {
    copyTextToClipboard(message.text);
  }
});

// Funzione per copiare il testo negli appunti con fallback
function copyTextToClipboard(text) {
  if (!text) {
    console.warn("Nessun testo da copiare");
    return;
  }

  // Prova a usare l'API moderna
  navigator.clipboard.writeText(text)
    .then(() => console.log("Testo copiato negli appunti!"))
    .catch((err) => {
      console.error("Errore durante la copia negli appunti:", err);
      fallbackCopyText(text);
    });
}

// Fallback: crea un'area di testo nascosta per la copia
function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
    console.log("Testo copiato con metodo fallback!");
  } catch (err) {
    console.error("Fallback copy failed:", err);
  }
  document.body.removeChild(textArea);
}

// 1️⃣ Aggiunge un listener per catturare il testo selezionato
document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    chrome.runtime.sendMessage({ action: "textSelected", text: selectedText });
  }
});
