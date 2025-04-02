const extensionId = chrome.runtime.id;

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    showLoginPage(); // Se il token non esiste, mostra la pagina di login
  } else {
    loadSnippetUI(); // Se il token esiste, carica la UI per salvare lo snippet
  }
});

function showLoginPage() {
  document.body.innerHTML = `
    <div id="loginContainer">
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
        loadSnippetUI();
      } else {
        document.getElementById("loginError").style.display = "block";
      }
    })
    .catch((error) => console.error("Login error:", error));
}

// Funzione per decodificare il token JWT e ottenere l'userId
function getUserIdFromToken() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1]; // Estrai il payload dal token
    const decodedPayload = JSON.parse(atob(payloadBase64)); // Decodifica Base64
    return decodedPayload.userId; // Restituisce l'ID utente
  } catch (error) {
    console.error("Errore nella decodifica del token:", error);
    return null;
  }
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

  fetchGroups();
  document.getElementById("saveBtn").addEventListener("click", saveSnippet);
}

function fetchGroups() {
  const userId = getUserIdFromToken();
  if (!userId) {
    alert("Errore: impossibile ottenere l'ID utente.");
    return;
  }

  fetch(`https://copio.online:9000/api/groups/user/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`, 
      "X-Extension-ID": extensionId,
    },
  })
    .then((response) => response.json())
    .then((groups) => {
      const groupSelect = document.getElementById("groupSelect");

      if (groups && groups.length > 0) {
        groups.forEach((group) => {
          const option = document.createElement("option");
          option.value = group.idGroup;
          option.textContent = group.name;
          groupSelect.appendChild(option);
        });

        console.log("Groups populated:", groups);
      } else {
        console.error("No groups found.");
        alert("No groups available.");
      }
    })
    .catch((error) => {
      console.error("Error fetching groups:", error);
      alert("Error fetching groups: " + error.message);
    });
}

function saveSnippet() {
  const userId = getUserIdFromToken();
  if (!userId) {
    alert("Errore: impossibile ottenere l'ID utente.");
    return;
  }

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const groupId = document.getElementById("groupSelect").value.trim();

  if (!title || !content || !groupId) {
    alert("Please provide a title, content, and select a valid group.");
    return;
  }

  fetch(`https://copio.online:9000/api/snippets/user/${userId}/group/${groupId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`, 
    },
    body: JSON.stringify({ title, content }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Snippet saved:", data);
      alert("Snippet saved successfully!");
      document.getElementById("title").value = "";
      document.getElementById("content").value = "";
      document.getElementById("groupSelect").value = "";
    })
    .catch((error) => {
      console.error("Error saving snippet:", error);
      alert("Error saving snippet: " + error.message);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get("selectedText", (data) => {
    const text = data.selectedText || "Nessun testo copiato";
    const contentArea = document.getElementById("content");
    contentArea.value = text;
    chrome.storage.local.remove("selectedText");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const closeButton = document.getElementById("closeBtn");

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      console.log("Popup chiuso!");
      window.close();
    });
  } else {
    console.error("Bottone di chiusura non trovato!");
  }
});
