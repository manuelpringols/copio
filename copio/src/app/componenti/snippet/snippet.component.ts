import { Component, OnInit } from '@angular/core';
import { SnippetService } from '../../servizi/snippet.service';
import { GroupsService } from '../../servizi/groups.service'; // Importa il servizio dei gruppi
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs';
import 'prismjs/components/prism-typescript.min.js';  // Aggiungi questa linea
import 'prismjs/components/prism-python.min.js';  // Aggiungi il supporto per Python
import { Router } from '@angular/router';


@Component({
  selector: 'app-snippet',
  standalone: false,
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.css']
})
export class SnippetComponent implements OnInit {


    expandedCards: boolean[] = [];

  snippets: any = [];  // Contiene tutti gli snippet
  currentPage = 1;
  snippetsPerPage = 5;
  totalPages = Math.ceil(this.snippets.length / this.snippetsPerPage);
  groups: any[] = [];
  filteredSnippets: any[] = [];  // Contiene gli snippet filtrati per il gruppo selezionato
  selectedGroup: any;
  showCreateGroupModal = false;
  showCreateSnippetModal = false;
  newGroupName = '';
  isCopied = false
  newSnippet = { title: '', content: '' , groupId: 0};
  message: string = ''; // Messaggio da visualizzare
isDeleteModalVisible: boolean = false;
snippetToDeleteName: any;
  snippetToDeleteId: any;


  constructor(
    private snippetService: SnippetService,
    private groupService: GroupsService,
    private router:Router // Inietta il servizio dei gruppi
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
    console.log("Gruppo selezionato:", group)
    this.selectedGroup = group;
    this.filterSnippetsByGroup(group.idGroup);
  }

  async filterSnippetsByGroup(groupId: number) {
    console.log("Filtrando snippet per gruppo con ID:", groupId);  // Debug
    this.snippetService.getSnippets().subscribe((data) => {
      this.snippets = data;

      this.filteredSnippets = this.snippets
        .filter((snippet: { idGroup: { idGroup: number; }; }) => snippet.idGroup && snippet.idGroup.idGroup === groupId)
        .map((snippet: { content: string; }) => {
          const language = this.getLanguageForSnippet(snippet);
          const formattedContent = Prism.highlight(snippet.content, Prism.languages[language], language);
          return { ...snippet, content: formattedContent, language };
        });

      console.log("Snippets filtrati:", this.filteredSnippets);  // Verifica che contenga gli snippet giusti
      this.updateTotalPages();
    }, error => {
      console.error("Errore nel caricamento degli snippet:", error);
    });
  }



   copyToClipboard(snippetContent: string) {
    // Usa l'API Clipboard per copiare il contenuto negli appunti
    navigator.clipboard.writeText(snippetContent).then(() => {
      this.isCopied = true; // Modifica lo stato dell'icona quando il contenuto è copiato

      // Rimuove lo stato dopo 2 secondi
      setTimeout(() => {
        this.isCopied = false;
      }, 2000);
    }).catch(err => {
      console.error('Errore nella copia negli appunti:', err);
    });
  }




  openCreateGroupModal() {
    this.showCreateGroupModal = true;
  }

  closeCreateGroupModal() {
    this.showCreateGroupModal = false;
  }

  createGroup() {
    if (this.newGroupName.trim()) {
      this.groupService.createGroup(this.newGroupName ).subscribe(() => {
        console.group("GRUPPO NUOVO NOME: " , this.newGroupName)
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
      // Aggiungi l'ID del gruppo selezionato all'oggetto newSnippet
      this.newSnippet['groupId'] = this.selectedGroup.idGroup;// Aggiungi l'ID del gruppo
      console.log("O SNIPPET NUOV : " , this.newSnippet)
      // Ora passa newSnippet al servizio
      this.snippetService.createSnippet(this.newSnippet).subscribe(() => {
        this.filterSnippetsByGroup(this.selectedGroup.groupId); // Ricarica gli snippet per il gruppo selezionato
        this.closeCreateSnippetModal();
      }, error => {
        console.error("Errore nella creazione dello snippet:", error);
      });
    }
  }


  deleteSnippet(): void {
    if (this.snippetToDeleteId !== null) {
      this.snippetService.deleteSnippet(this.snippetToDeleteId).subscribe(
        () => {
          console.log("Gruppo eliminato con id : ", this.snippetToDeleteId);
          this.groups = this.groups.filter((group: { id: number | null; }) => group.id !== this.snippetToDeleteId); // Rimuovi il gruppo
          this.closeDeleteModal(); // Chiudi la modale
        },
        (error: any) => {
          console.error('Errore durante l\'eliminazione del gruppo:', error);
        }
      );
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
    } else if (snippet.content.includes('def ') || snippet.content.includes('import ')) {
      return 'python';  // Se è codice Python
    } else {
      return 'plaintext';  // Linguaggio predefinito
    }
  }

  toggleOverflow(index: number) {
    this.expandedCards[index] = !this.expandedCards[index];
    console.log("metodo toggleOverflow chiamato")
  }

  // Metodo per verificare se la card è espansa
  isExpanded(index: number): boolean {
    return this.expandedCards[index];
  }


  goBack() {
    // Torna alla pagina principale
    this.router.navigate(["/"]);
  }


  copyCode(index: number) {
    const codeBlock = document.getElementById('codeBlock-' + index)?.textContent;
    console.log(codeBlock);  // Verifica che l'elemento venga trovato correttamente
    if (codeBlock) {
      navigator.clipboard.writeText(codeBlock.trim()).then(() => {
        console.log('Contenuto copiato con successo!');
      }).catch((err) => {
        console.error('Errore nella copia: ', err);
      });
    } else {
      console.error('Elemento non trovato');
    }
  }

 

    openDeleteModal(snippetsId : number, i : number) {
      this.snippetToDeleteId = snippetsId;
      this.snippetToDeleteName = this.snippets[i].title;
      this.isDeleteModalVisible = true;
      console.log(this.isDeleteModalVisible)
      }

    closeDeleteModal() {
      this.isDeleteModalVisible = false;
      }


}
