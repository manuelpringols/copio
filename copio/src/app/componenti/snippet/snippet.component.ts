import { Component, OnInit } from '@angular/core';
import { SnippetService } from '../../servizi/snippet.service';
import { GroupsService } from '../../servizi/groups.service'; // Importa il servizio dei gruppi
import Prism from 'prismjs';
import 'prismjs/components/prism-java';


@Component({
  selector: 'app-snippet',
  standalone: false,
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.css']
})
export class SnippetComponent implements OnInit {
  snippets: any[] = [];  // Contiene tutti gli snippet
  currentPage = 1;
  snippetsPerPage = 5;
  totalPages = Math.ceil(this.snippets.length / this.snippetsPerPage);
  groups: any[] = [];
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

    if (typeof window !== 'undefined') {
      import('prismjs').then(Prism => {
        Prism.highlightAll();  // Evidenzia tutto il codice sulla pagina
      });
    }
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

  async filterSnippetsByGroup(groupId: number) {
    this.snippetService.getSnippets().subscribe((data) => {
      this.snippets = data;

      // Filtra gli snippet per gruppo
      this.filteredSnippets = this.snippets
        .filter(snippet => snippet.idGroup && snippet.idGroup.idGroup === groupId)
        .map((snippet) => {
          // Rileva il linguaggio in base al tipo di snippet o definisci un linguaggio predefinito
          const language = this.getLanguageForSnippet(snippet);
          const formattedContent = Prism.highlight(snippet.content, Prism.languages[language], language);
          return { ...snippet, content: formattedContent, language };  // Salva anche il linguaggio usato
        });

      this.updateTotalPages();
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

  updateTotalPages() {
    this.totalPages = Math.ceil(this.filteredSnippets.length / this.snippetsPerPage);
  }


  changePage(direction: string) {
    if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (direction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  formatCode(code: string): string {
    return Prism.highlight(code, Prism.languages['javascript'], 'javascript');
  }


  // Funzione per determinare il linguaggio (esempio di base)
getLanguageForSnippet(snippet: any): string {
  // Controllo per JavaScript/TypeScript
  if (snippet.content.includes('function') || snippet.content.includes('const') || snippet.content.includes('let')) {
    return 'javascript';  // Se è codice JS o TypeScript
  } else if (snippet.content.includes('<html>')) {
    return 'html';  // Se è codice HTML
  } else if (snippet.content.includes('import')) {
    return 'typescript';  // Se è codice TypeScript
  } else if (snippet.content.includes('class') || snippet.content.includes('public') || snippet.content.includes('void')) {
    return 'java';  // Se è codice Java
  } else {
    return 'plaintext';  // Linguaggio predefinito
  }
}



}
