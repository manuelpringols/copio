import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doc',
  standalone: false,
  templateUrl: './doc.component.html',
  styleUrl: './doc.component.css'
})
export class DocComponent {

  groups = [
    { id: 1, name: 'Doc Angular', description: 'Introduzione e componenti' },
    { id: 2, name: 'Doc Java', description: 'Spring Boot e REST API' },
    { id: 3, name: 'Doc Docker', description: 'Container e deploy' },
    { id: 4, name: 'Doc Javascript', description: 'Introduzione e componenti' },
    { id: 5, name: 'Doc Java', description: 'Spring Boot e REST API' },
    { id: 6, name: 'Doc Docker', description: 'Container e deploy' }
  ];

  activeTab: string = 'angular'; // Imposta la tab iniziale

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('DocComponent caricato!');
  }

  // Metodo per cambiare la tab attiva
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Metodo per navigare verso una pagina di gruppo
  selectGroup(group: any): void {
    this.router.navigate(['/doc/page', group.id]);
  }

  goBack() {
    this.router.navigate(["/"])
    }
}

