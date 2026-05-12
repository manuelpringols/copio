// content.js — Copio Extension
// Questo script gira nel contesto di ogni pagina web.
// Al momento gestisce solo la copia negli appunti come utility.
// Il testo selezionato viene catturato direttamente in background.js
// tramite info.selectionText nel context menu handler (nessun messaggio necessario).

function copyTextToClipboard(text) {
  if (!text) return;

  navigator.clipboard.writeText(text)
    .then(() => console.log("[Copio] Testo copiato negli appunti."))
    .catch(() => {
      // Fallback per contesti in cui clipboard API non è disponibile
      const area = document.createElement("textarea");
      area.value = text;
      area.style.cssText = "position:absolute;left:-9999px;top:-9999px";
      document.body.appendChild(area);
      area.select();
      try { document.execCommand("copy"); } catch (e) { console.error("[Copio] Fallback copy failed:", e); }
      document.body.removeChild(area);
    });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "copyToClipboard") {
    copyTextToClipboard(message.text);
  }
});