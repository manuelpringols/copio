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
  selectedGroup: any = this.groups[0]; // Impostiamo il primo gruppo come predefinito
  showCreateGroupModal = false;
  showCreateSnippetModal = false;
  newGroupName = '';
  newSnippet = { title: '', content: '' };

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
        (error: any) => {
          // Gestisci gli errori, ad esempio un messaggio di errore
          console.error('Errore durante la creazione dello snippet', error);
        }
      );
    }
  }
}
