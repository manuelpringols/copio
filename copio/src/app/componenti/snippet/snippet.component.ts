import { Component, OnInit } from '@angular/core';
import { SnippetService } from '../../servizi/snippet.service';
import { GroupsService } from '../../servizi/groups.service'; // Importa il servizio dei gruppi

@Component({
  selector: 'app-snippet',
  standalone: false,
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.css']
})
export class SnippetComponent implements OnInit {
  groups: any[] = [];
  snippets: any[] = [];  // Contiene tutti gli snippet
  filteredSnippets: any[] = [];  // Contiene gli snippet filtrati per il gruppo selezionato
  selectedGroup: any;
  showCreateGroupModal = false;
  showCreateSnippetModal = false;
  newGroupName = '';
  newSnippet = { title: '', content: '' };
  message: string = ''; // Messaggio da visualizzare

  constructor(
    private snippetService: SnippetService,
    private groupService: GroupsService // Inietta il servizio dei gruppi
  ) {}

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getAllGroups().subscribe((data) => {
      this.groups = data;
      if (this.groups.length > 0) {
        this.selectedGroup = this.groups[0];
        this.filterSnippetsByGroup(this.selectedGroup.idGroup);
      }
    }, error => {
      console.error("Errore nel caricamento dei gruppi:", error);
    });
  }

  selectGroup(group: any) {
    this.selectedGroup = group;
    this.filterSnippetsByGroup(group.idGroup);
  }

  filterSnippetsByGroup(groupId: number) {
    this.snippetService.getSnippets().subscribe((data) => {
      this.snippets = data;
      this.filteredSnippets = this.snippets.filter(snippet => snippet.idGroup && snippet.idGroup.idGroup === groupId);


    }, error => {
      console.error("Errore nel caricamento degli snippet:", error);
    });
  }

  copyToClipboard() {
    // Aggiungi la logica per copiare il contenuto negli appunti
    this.message = 'Testo copiato!';
    setTimeout(() => this.message == null, 2000);
  }

  openCreateGroupModal() {
    this.showCreateGroupModal = true;
  }

  closeCreateGroupModal() {
    this.showCreateGroupModal = false;
  }

  createGroup() {
    if (this.newGroupName.trim()) {
      this.groupService.createGroup({ name: this.newGroupName }).subscribe(() => {
        this.loadGroups();  // Ricarica i gruppi dopo aver creato uno nuovo
        this.closeCreateGroupModal();
      }, error => {
        console.error("Errore nella creazione del gruppo:", error);
      });
    }
  }

  openCreateSnippetModal() {
    this.showCreateSnippetModal = true;
  }

  closeCreateSnippetModal() {
    this.showCreateSnippetModal = false;
  }

  createSnippet() {
    if (this.newSnippet.title.trim() && this.newSnippet.content.trim()) {
      this.snippetService.createSnippet(this.newSnippet).subscribe(() => {
        this.filterSnippetsByGroup(this.selectedGroup.idGroup); // Ricarica gli snippet per il gruppo selezionato
        this.closeCreateSnippetModal();
      }, error => {
        console.error("Errore nella creazione dello snippet:", error);
      });
    }
  }

   // Funzione per chiudere tutte le modali
   closeAllModals() {
    this.showCreateGroupModal = false;
    this.showCreateSnippetModal = false;
  }

  escapeHtml(text: string): string {
    return text.replace(/[&<>"']/g, function (char) {
      switch (char) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return char;
      }
    });
  }
}
