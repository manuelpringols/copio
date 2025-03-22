import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '../../../servizi/page.service';
import { GroupsService } from '../../../servizi/groups.service';
import { GroupPageService } from '../../../servizi/group-page.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-page',
  standalone: false,
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {



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

newContent = '';
newTitle = '';
showModal: any;


  constructor(
    private route: ActivatedRoute,
    private pageService: PageService,
    private groupPageService: GroupPageService,
    private router: Router,
    private cdr: ChangeDetectorRef

  ) {}

 ngOnInit(): void {

  console.log("Group Id Selezionato",  this.groupId)

  this.page = { content: '' };

  this.groupId = Number(this.route.snapshot.paramMap.get('id'));

  if (this.groupId !== null) {
    firstValueFrom(this.groupPageService.getGroupById(this.groupId)).then(groupData => {
      this.groupName = groupData.name; // Supponiamo che `name` sia il campo che contiene il nome del gruppo
      console.log("Nome del gruppo:", this.groupName);
    }).catch(() => {
      this.groupName = 'Gruppo non trovato';
      console.error('Errore nel recupero del nome del gruppo');
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

  console.log("Group Id Selezionato",  this.groupId)


  if (this.groupId !== null) {

    firstValueFrom(this.pageService.getPagesByGroupId(this.groupId))
      .then(data => {
        this.pages = data;
        this.page = this.pages.length ? this.pages[0] : { content: 'Nessuna pagina disponibile per questo gruppo.' };
        this.pageId = this.page?.id;
        this.cdr.detectChanges();



      })
      .catch(() => {
        this.pages = [];
        this.page = { content: 'Nessuna pagina disponibile per questo gruppo.' };
      });
  }

}

ngAfterViewInit(){



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
      this.pageService.saveModify(this.pageId,this.page, ).subscribe(
        (data) => {
          this.isModified = false;
          console.log('Modifiche salvate :',data);
        },
        (error: any) => console.error('Errore nel salvataggio:', error)
      );
    } else {
      console.error('ID pagina non definito!');
    }
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
      this.pageService.deletePage(idPage).subscribe((data)=>{
        console.log("mammeta")
        this.closeConfirmModal()

      })


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

      // Verifica che groupId non sia null o undefined e che newContent non sia vuoto
      if (storedGroupId !== null && storedGroupId !== undefined && this.newContent.trim() !== '') {
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

          this.pageService.createPage(page).subscribe(
            (data) => {
              console.log('Contenuto salvato:', data);
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
