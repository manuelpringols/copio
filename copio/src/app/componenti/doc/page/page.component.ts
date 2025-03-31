import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '../../../servizi/page.service';
import { GroupsService } from '../../../servizi/groups.service';
import { GroupPageService } from '../../../servizi/group-page.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthService } from '../../../servizi/auth.service';

@Component({
  selector: 'app-page',
  standalone: false,
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {






  codeContent: string = '';
  formattedCode: string = '';
  namePages: any[] = []; // Lista completa dei gruppi
  selectedGroupId: number | null = null; // ID del gruppo selezionato
  pages: any[] = []; // Pagine filtrate
  page: any = null; // Pagina selezionata
  isModified = false; // Flag per le modifiche
  groupName: string = 'Caricamento...'; // Nome del gruppo selezionato (iniziale)
  groupId: number = 1;
  pageId: any; // ID della pagina selezionata
isModalOpen = false;
isConfirmationModalOpen = false;

newContent = ' ';
newTitle = '';
showModal: any;
userId: any;

private pagesSubject = new BehaviorSubject<any[]>([]);
pages$ = this.pagesSubject.asObservable(); // Esponi l'Observable
 


  constructor(
    private route: ActivatedRoute,
    private pageService: PageService,
    private groupPageService: GroupPageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService : AuthService
  ) {}

  ngOnInit(): void {
    // Carica il groupId dalla route
    this.userId = this.authService.getUserIdFromToken();

    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadGroupPages();  // Carica le pagine in base al groupId

    // Inizializza il groupName
    if (this.groupId) {
      this.groupPageService.getGroupNameById(this.groupId).subscribe(groupTitle => {
        this.groupName = groupTitle;
        console.log("Nome del gruppo:", this.groupName);
      });
    }

    if (this.groupId) {
      // Verifica che il codice sia in esecuzione nel browser
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('groupId', this.groupId.toString()); // Salva come stringa
        console.log("Group ID salvato nel localStorage:", this.groupId);
      }
    } else {
      console.error('Errore: groupId non valido');
    }
  }

  // Funzione per caricare le pagine in base al groupId
  loadGroupPages(): void {
    if (this.groupId !== null) {
      this.pageService.getPagesByUser(this.userId)
        .subscribe((data: any[]) => {
          this.pages = data; // Pagine filtrate dal backend
          this.page = this.pages.length ? this.pages[0] : { content: 'Nessuna pagina disponibile per questo gruppo.' };
          this.pageId = this.page?.id;
          this.cdr.detectChanges();  // Forza la rilevazione dei cambiamenti
          console.log("Pagine caricate dal backend:", this.pages);
        }, (error: any) => {
          this.pages = [];
          this.page = { content: 'Nessuna pagina disponibile per questo gruppo.' };
          console.error('Errore nel recupero delle pagine:', error);
        });
    }
  }

ngAfterViewInit(){



}

formatCode() {
  // Converte i ritorni a capo in <br> per mantenere la formattazione
  this.formattedCode = this.codeContent.replace(/\n/g, '<br>');
}




  // Seleziona una pagina diversa
  selectPage(page: any): void {
    this.page = page;
    this.pageId = page.id; // Assicurati che l'ID della pagina selezionata venga aggiornato
    this.isModified = false; // Reset delle modifiche quando una pagina viene selezionata
  }

  // Rileva modifiche nel testo
  onTextChange() {
    this.isModified = true;
  }

  // Salva la pagina
  saveDocument() {
    if (this.page && this.pageId !== undefined) {
      console.log('Salvataggio della pagina con ID:', this.pageId);
      this.pageService.saveModify(this.pageId, this.page).subscribe(
        (data) => {
          // Aggiorna la pagina con i dati restituiti
          this.page = data;

          // Trova e aggiorna la pagina nell'array pages
          const pageIndex = this.pages.findIndex(p => p.id === this.pageId);
          if (pageIndex !== -1) {
            this.pages[pageIndex] = data;
            this.cdr.detectChanges(); // Forza il rilevamento dei cambiamenti
          }

          this.isModified = false; // Reset delle modifiche
          console.log('Modifiche salvate:', data);
        },
        (error: any) => console.error('Errore nel salvataggio:', error)
      );
    } else {
      console.error('ID pagina non definito!');
    }
  }


  updatePages(newPages: any[]) {
    this.pagesSubject.next(newPages);
  }

  // Torna indietro
  goBack() {
    if (this.isModified && confirm('Vuoi salvare le modifiche?')) {
      this.saveDocument();
    }
    this.router.navigate(['/doc']);
  }

  // Cambia gruppo e aggiorna le pagine
  changePage(index: number): void {
    if (this.pages && this.pages[index]) {
      const selectedPage = this.pages[index];
      console.log('Selezionato:', selectedPage);

      // Imposta la pagina corrente
      this.selectPage(selectedPage);
    } else {
      console.error('Pagina non trovata!');
    }
  }

  deletePage(idPage: number) {
    this.pageService.deletePageByUserId(this.userId,idPage).subscribe(
      (data) => {
        console.log("Pagina eliminata con successo");
        this.pages = this.pages.filter(page => page.id !== idPage); // Rimuove la pagina eliminata
        console.log('Pagine dopo l\'eliminazione:', this.pages);
        this.closeConfirmModal()
      },
      (error) => {
        console.error('Errore durante l\'eliminazione della pagina:', error);
      }
    );
  }





  openConfirmationModal() {
    this.isConfirmationModalOpen = true;
    console.log("asdas",this.isConfirmationModalOpen)
  }

  closeConfirmModal() {
    this.isConfirmationModalOpen = false;
    }


  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newContent = '';
  }
  saveNewContent() {
    // Verifica se siamo nel client (browser)
    if (typeof window !== 'undefined' && window.localStorage) {
      // Recupera il groupId salvato nel localStorage
      const storedGroupId = localStorage.getItem('groupId');

      // Verifica che groupId non sia null o undefined
      if (storedGroupId !== null && storedGroupId !== undefined ) {
        // Converti il valore recuperato dal localStorage in numero
        const groupIdFromLocalStorage = Number(storedGroupId);

        if (!isNaN(groupIdFromLocalStorage)) {
          console.log('Salvataggio del nuovo contenuto per la pagina ID:', groupIdFromLocalStorage);

          // Ora userai groupIdFromLocalStorage come il groupPageId corretto
          const page = {
            pageTitle: this.newTitle,
            content: this.newContent,
            groupPage: {
              id: groupIdFromLocalStorage,
              title: this.groupName // Aggiungi il titolo del gruppo, se necessario
            }
          };

          this.pageService.createPage(this.userId,page).subscribe(
            (data) => {
              console.log('Pagina creata:', data); // Verifica i dati della nuova pagina
              // Aggiungi la nuova pagina alla lista e aggiorna il BehaviorSubject
              this.pages.push(data);
              this.pageService.updatePages(this.pages); // Aggiorna il comportamento
              this.closeModal();
            },
            (error) => console.error('Errore nel salvataggio:', error)
          );
        } else {
          console.error('Errore: groupId recuperato non valido!');
        }
      } else {
        console.error('Errore: ID gruppo pagina non definito o contenuto vuoto!');
      }
    } else {
      console.error('Errore: localStorage non disponibile!');
    }
  }
}
