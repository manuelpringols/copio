document.addEventListener("DOMContentLoaded", function () {
  // Recupera il testo selezionato dal background script
  chrome.storage.local.get("selectedText", function (data) {
    const selectedText = data.selectedText || ""; // Se non c'è testo selezionato, metti una stringa vuota
    document.getElementById("content").value = selectedText; // Inserisci il testo nel campo "content"
  });

  // Popola i gruppi nel select effettuando una chiamata GET al backend
  fetch('http://localhost:8080/api/groups')
  .then(response => response.json()) // Risponde con un array di gruppi
  .then(groups => {
    const groupSelect = document.getElementById("groupSelect");

    if (groups && groups.length > 0) {
      const groupMapping = {};

      // Mappa ogni gruppo con il suo ID come chiave e il nome come valore
      groups.forEach(group => {
        const option = document.createElement("option");
        option.value = group.idGroup;  // Cambia da group.id a group.idGroup
        option.textContent = group.name;  // Il nome del gruppo è il testo visibile
        groupSelect.appendChild(option);
        groupMapping[group.name] = group.idGroup;  // Aggiungi alla mappatura con idGroup
      });

      // Salva la mappatura aggiornata in chrome.storage
      chrome.storage.local.set({ groupMapping: groupMapping });

      // Verifica se i gruppi sono stati aggiunti correttamente
      console.log("Groups populated in select:", groups);
    } else {
      console.error("No groups found in the API response!");
      alert("No groups available.");
    }
  })
  .catch(error => {
    console.error("Error fetching groups:", error);
    alert("Error fetching groups: " + error.message);
  });


  // Gestisci il click del pulsante "Save"
  document.getElementById("saveBtn").addEventListener("click", function () {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const selectedGroupId = document.getElementById("groupSelect").value.trim();

    // Aggiungi un log per monitorare il valore di selectedGroupId
    console.log("Selected Group ID:", selectedGroupId);

    // Controllo se tutti i campi sono stati riempiti
    if (!title || !content || !selectedGroupId || selectedGroupId === "undefined") {
      alert("Please provide a title, content, and select a valid group.");
      return;
    }

    // Invia la richiesta al backend per salvare lo snippet
    fetch(`http://localhost:8080/api/snippets/create?groupId=${selectedGroupId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Snippet saved:", data);
      alert("Snippet saved successfully!");
      document.getElementById("title").value = "";
      document.getElementById("content").value = "";
      document.getElementById("groupSelect").value = "";
    })
    .catch(error => {
      console.error("Error saving snippet:", error);
      alert("Error saving snippet: " + error.message);
    });
  });
});
