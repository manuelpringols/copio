import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GroupPageService } from '../../servizi/group-page.service';

@Component({
  selector: 'app-doc',
  standalone: false,
  templateUrl: './doc.component.html',
  styleUrl: './doc.component.css'
})
export class DocComponent {
  groups = [{title : ""}]; // Variabile per contenere i gruppi
  activeTab: string = 'angular'; // Imposta la tab iniziale

  constructor(
    private groupPageService: GroupPageService, // Iniettiamo il servizio
    private router: Router
  ) {}

  ngOnInit(): void {
    this.groupPageService.getAllGroupPages().subscribe(groups => {
      this.groups = groups; // Assegniamo i gruppi ricevuti dal backend
      console.log('Gruppi caricati:', this.groups); // Verifica i gruppi caricati
    });

  }

  ngAfterViewInit(){

  }

  // Metodo per cambiare la tab attiva
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Metodo per navigare verso una pagina di gruppo
  selectGroup(group: any): void {
    // Naviga alla pagina del gruppo
    this.router.navigate(['/doc/page', group.id]);
  }

  goBack() {
    // Torna alla pagina principale
    this.router.navigate(["/"]);
  }
}
