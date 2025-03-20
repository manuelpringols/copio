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

  constructor(
    private route: ActivatedRoute,
    private pageService: PageService,
    private groupPageService: GroupPageService,
    private router: Router,
    private cdr: ChangeDetectorRef

  ) {}

 ngOnInit(): void {

  this.page = { content: '' };

  this.groupId = Number(this.route.snapshot.paramMap.get('id'));

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
        this.page = { content: 'Errore nel caricamento delle pagine.' };
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
}
