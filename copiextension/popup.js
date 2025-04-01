const extensionId = chrome.runtime.id;



document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    // Se il token non esiste, mostra la pagina di login
    showLoginPage();
  } else {
    // Se il token esiste, carica la UI per salvare lo snippet
    loadSnippetUI();
  }
});


function showLoginPage() {
  document.body.innerHTML = `
    <div style:"width: 1000px; min-width: 500px;" id="loginContainer">
      <h3>Login</h3>
      <label for="email">Email:</label>
      <input type="email" id="email" placeholder="Enter your email" />
      
      <label for="password">Password:</label>
      <input type="password" id="password" placeholder="Enter your password" />

      <button id="loginBtn">Login</button>
      <p id="loginError" style="color: red; display: none;">Invalid credentials</p>
    </div>
  `;

  document.getElementById("loginBtn").addEventListener("click", loginUser);
}

function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("https://copio.online:9000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("jwtToken", data.token);
        loadSnippetUI(); // Carica la UI per gli snippet
      } else {
        document.getElementById("loginError").style.display = "block";
      }
    })
    .catch((error) => console.error("Login error:", error));
}


function loadSnippetUI() {
  document.body.innerHTML = `
    <div id="popupContainer">
      <div class="popup-content">
        <span id="closeBtn" class="close-btn">&times;</span>
        <h3>Save Snippet</h3>

        <label for="title">Title:</label>
        <input type="text" id="title" placeholder="Enter title" />

        <label for="content">Content:</label>
        <textarea id="content" placeholder="Enter content"></textarea>

        <label for="groupSelect">Group:</label>
        <select id="groupSelect">
          <option value="">Select a group</option>
        </select>

        <button id="saveBtn">Save Snippet</button>
      </div>
    </div>
  `;

  // Ricarica i gruppi
  fetchGroups();

  // Event listener per salvare snippet
  document.getElementById("saveBtn").addEventListener("click", saveSnippet);
}



document.addEventListener("DOMContentLoaded", function () {
  // Recupera il testo selezionato dal background script
// Quando il popup si apre, inserisci il testo selezionato nella textarea
chrome.storage.local.get("selectedText", (data) => {
  const text = data.selectedText || "Nessun testo copiato";
  const contentArea = document.getElementById("content");

  // Inserisce il testo formattato nella textarea
  contentArea.value = text;

  // Pulizia del testo salvato dopo averlo usato
  chrome.storage.local.remove("selectedText");
});

  // Popola i gruppi nel select effettuando una chiamata GET al backend
  fetch('https://copio.online:9000/api/groups', {
    headers: {
      'Content-Type': 'application/json',
      'X-Extension-ID': extensionId,  // Aggiungi l'ID dell'estensione come header
    }
  })
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
    fetch(`https://copio.online:9000/api/snippets/create?groupId=${selectedGroupId}`, {
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




// Aggiungi funzionalità per salvare lo snippet
document.getElementById('saveBtn').addEventListener('click', () => {
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const group = document.getElementById('groupSelect').value;

  // Salva lo snippet (puoi inviarlo al tuo server o gestirlo localmente)
  console.log("Saving Snippet", { title, content, group });
});


document.addEventListener("DOMContentLoaded", () => {
  const closeButton = document.getElementById("closeBtn");

  if (closeButton) {
    // Aggiunge l'event listener al click
    closeButton.addEventListener("click", () => {
      console.log("Popup chiuso!");
      window.close(); // Chiude il popup
    });
  } else {
    console.error("Bottone di chiusura non trovato!");
  }
});

