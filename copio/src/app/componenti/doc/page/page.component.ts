import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '../../../servizi/page.service';
import { GroupsService } from '../../../servizi/groups.service';
import { GroupPageService } from '../../../servizi/group-page.service';

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

  constructor(
    private route: ActivatedRoute,
    private pageService: PageService,
    private groupPageService: GroupPageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.page = { content: '' }; // Inizializziamo per prevenire l'errore subito

    // Prende l'ID del gruppo dall'URL
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));

    // Otteniamo le pagine per il gruppo selezionato
    if (this.groupId !== null) {
      this.pageService.getPagesByGroupId(this.groupId).subscribe({
        next: (data: any) => {
          console.log('Pagine ricevute:', data);
          this.pages = data; // Assegna le pagine filtrate
          this.page = this.pages.length ? this.pages[0] : { content: 'Nessuna pagina disponibile per questo gruppo.' }; // Imposta la pagina di default
          this.pageId = this.page?.id; // Assegna l'ID della pagina selezionata
        },
        error: () => {
          this.pages = [];
          this.page = { content: 'Errore nel caricamento delle pagine.' };
        }
      });
    }
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
}
