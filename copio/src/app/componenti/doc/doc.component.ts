import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GroupPageService } from '../../servizi/group-page.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-doc',
  standalone: false,
  templateUrl: './doc.component.html',
  styleUrl: './doc.component.css'
})
export class DocComponent {
  groupToDeleteId: number | null = null; // Salviamo solo l'ID del gruppo da eliminare

  //group = { id: 0, title: "" }; // Oggetto vuoto per il nuovo gruppo
  groups : any = []; // Lista di gruppi
  activeTab: string = 'angular'; // Tab attiva iniziale

  isModalVisible: boolean = false;
  newGroupName: string = "";
  private groupPagesSubscription: Subscription = new Subscription(); // Subscription per il listener
  isDeleteModalVisible: boolean = false; // Gestione della visibilità della modale di eliminazione

  constructor(
    private groupPageService: GroupPageService, // Servizio per gestire i gruppi
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carica i gruppi all'inizio
    this.groupPagesSubscription = this.groupPageService.getAllGroupPages().subscribe(groups => {
      this.groups = groups; // Aggiorna i gruppi in tempo reale
      console.log('Gruppi aggiornati:', this.groups); // Verifica i gruppi caricati
    });
  }

  ngOnDestroy(): void {
    // Annulla l'abbonamento quando il componente viene distrutto
    if (this.groupPagesSubscription) {
      this.groupPagesSubscription.unsubscribe();
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  selectGroup(group: any): void {
    this.router.navigate(['/doc/page', group.id]);
  }

  goBack() {
    this.router.navigate(["/"]);
  }

  addGroup() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  submitGroup(): void {
    const newGroup = { title: this.newGroupName };
    this.groupPageService.createGroupPage(newGroup).subscribe({
      next: (response) => {
        console.log('Nuovo gruppo creato:', response);
        this.groups.push(response); // Aggiungi il nuovo gruppo alla lista
        this.newGroupName = ''; // Resetta il nome del gruppo
        this.isModalVisible = false; // Chiudi la modale
      },
      error: (error) => {
        console.error('Errore durante la creazione del gruppo:', error);
      },
    });
  }

  // Metodo per eliminare il gruppo
  deleteGroup(): void {
    if (this.groupToDeleteId !== null) {
      this.groupPageService.deleteGroupPage(this.groupToDeleteId).subscribe(
        () => {
          console.log("Gruppo eliminato con id : ", this.groupToDeleteId);
          this.groups = this.groups.filter((group: { id: number | null; }) => group.id !== this.groupToDeleteId); // Rimuovi il gruppo
          this.closeDeleteModal(); // Chiudi la modale
        },
        (error) => {
          console.error('Errore durante l\'eliminazione del gruppo:', error);
        }
      );
    }
  }

  // Apre la modale di eliminazione e salva l'ID del gruppo da eliminare
  openDeleteModal(groupId: number): void {
    this.groupToDeleteId = groupId; // Salva l'ID del gruppo da eliminare
    console.log("id da eliminare : ", this.groupToDeleteId)
    this.isDeleteModalVisible = true; // Mostra la modale di eliminazione
  }

  closeDeleteModal() {
    this.isDeleteModalVisible = false;
    this.groupToDeleteId = null; // Reset dell'ID del gruppo da eliminare
  }
}
