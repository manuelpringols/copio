import { Component } from '@angular/core';
import { SnippetService } from '../../servizi/snippet.service';

@Component({
  selector: 'app-snippet',
  standalone: false,
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.css']
})
export class SnippetComponent {
  groups = [
    { id: 1, name: 'Python', snippets: [] },
    { id: 2, name: 'JavaScript', snippets: [] },
    { id: 3, name: 'HTML', snippets: [] }
  ];
  selectedGroup: any = this.groups[1]; // Impostiamo il primo gruppo come predefinito
  showCreateGroupModal = false;
  showCreateSnippetModal = false;
  newGroupName = '';
  newSnippet = { title: '', content: '' };
  snippet: any = {};

  message: string = ''; // Messaggio da visualizzare

  constructor(private snippetService: SnippetService) { }

  // Apre la modale per creare un gruppo
  openCreateGroupModal() {
    this.showCreateGroupModal = true;
  }

  // Chiude la modale per creare un gruppo
  closeCreateGroupModal() {
    this.showCreateGroupModal = false;
  }

  // Apre la modale per creare uno snippet
  openCreateSnippetModal() {
    this.showCreateSnippetModal = true;
  }

  // Chiude la modale per creare uno snippet
  closeCreateSnippetModal() {
    this.showCreateSnippetModal = false;
  }

  // Funzione per chiudere tutte le modali
  closeAllModals() {
    this.showCreateGroupModal = false;
    this.showCreateSnippetModal = false;
  }

  // Crea un nuovo gruppo
  createGroup() {
    if (this.newGroupName.trim() !== '') {
      const newGroup = { id: this.groups.length + 1, name: this.newGroupName, snippets: [] };
      this.groups.push(newGroup);
      this.newGroupName = '';
      this.closeAllModals(); // Chiude tutte le modali dopo aver creato un gruppo
    }
  }

  // Seleziona un gruppo dalla sidebar
  selectGroup(group: any) {
    this.selectedGroup = group;
  }

  // Crea uno snippet e lo aggiunge al gruppo selezionato (ora con backend)
  createSnippet() {
    if (this.newSnippet.title.trim() !== '' && this.newSnippet.content.trim() !== '') {
      // Invio i dati al backend per creare uno snippet
      this.snippetService.createSnippet(this.newSnippet).subscribe(
        (response: any) => {
          // Gestisci la risposta dal backend (ad esempio, aggiungi lo snippet alla lista)
          this.selectedGroup.snippets.push({ title: this.newSnippet.title, content: this.newSnippet.content });
          this.newSnippet = { title: '', content: '' };
          this.closeAllModals(); // Chiude tutte le modali dopo aver creato uno snippet
        },

      );
    }
  }




  copyToClipboard(): void {
    const preElement = document.getElementById('snippetContent'); // Prende l'elemento <pre>
    if (preElement) {
      const text = preElement.innerText; // Ottiene il testo all'interno di <pre>
      navigator.clipboard.writeText(text).then(() => {
        // Imposta il messaggio di successo
        this.message = 'Testo copiato!';
        // Dopo 5 secondi, rimuove il messaggio
        setTimeout(() => {
          this.message = ''; // Pulisce il messaggio
        }, 5000); // 5000 ms = 5 secondi
      }).catch(err => {
        // Mostra l'errore sulla console
        console.error('Errore nella copia del testo:', err);
        // Imposta il messaggio di errore
        this.message = 'Errore nella copia del testo';
        // Dopo 5 secondi, rimuove il messaggio
        setTimeout(() => {
          this.message = ''; // Pulisce il messaggio
        }, 3000); // 5000 ms = 5 secondi
      });
    }
  }

}
