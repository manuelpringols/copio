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

  groups = [{ id : null , title : ""}]; // Variabile per contenere i gruppi
  activeTab: string = 'angular'; // Imposta la tab iniziale

  groupToDelete: any;


  isModalVisible: boolean = false;
  newGroupName :string = "";
  private groupPagesSubscription: Subscription = new Subscription(); // Subscription per il listener
isDeleteModalVisible: any;




  constructor(
    private groupPageService: GroupPageService, // Iniettiamo il servizio
    private router: Router
  ) {}

  ngOnInit(): void {
    // Iscriviti al flusso dei gruppi
    this.groupPagesSubscription = this.groupPageService.getAllGroupPages().subscribe(groups => {
      this.groups = groups; // Aggiorna i gruppi in tempo reale
      console.log('Gruppi aggiornati:', this.groups); // Verifica i gruppi caricati
    });
  }

  ngOnDestroy(): void {
    // Assicurati di annullare l'abbonamento quando il componente viene distrutto
    if (this.groupPagesSubscription) {
      this.groupPagesSubscription.unsubscribe();
    }
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

  addGroup(){
    this.isModalVisible = true;
    console.log("mario")

  }

   // Metodo per chiudere la modale
   closeModal() {
    this.isModalVisible = false;
  }

  // Metodo per creare un gruppo
  submitGroup(): void {
    const newGroup = { title: this.newGroupName };
    this.groupPageService.createGroupPage(newGroup).subscribe({
      next: (response) => {
        console.log('Nuovo gruppo creato:', response);
        this.newGroupName = ''; // Resetta il nome del gruppo
        this.isModalVisible = false; // Chiude la modale
      },
      error: (error) => {
        console.error('Errore:', error);
      },
    });
  }

  deleteGroup(): void {
    if (this.groupToDeleteId !== null) {
      this.groupPageService.deleteGroupPage(this.groupToDeleteId).subscribe(
        () => {
          // Rimuovi il gruppo dalla lista usando l'ID
          this.groups = this.groups.filter(group => group.id !== this.groupToDeleteId);
          this.closeDeleteModal();
        },
        (error) => {
          console.error('Error deleting group', error);
        }
      );
    }
  }

  openDeleteModal(groupId: number): void {
    this.groupToDeleteId = groupId; // Salva solo l'ID del gruppo da eliminare
    this.isDeleteModalVisible = true;
  }


    closeDeleteModal() {
      this.isDeleteModalVisible=false;
    }


}
