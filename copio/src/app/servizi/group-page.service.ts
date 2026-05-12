import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupPageService {

  private apiUrlLocal = `http://localhost:9000/api/groupPages`; // Modifica il path se necessario
  //private apiUrl = `https://copio.online:9000/api/groupPages`; // Modifica il path se necessario


  private groupPagesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public groupPage$ = this.groupPagesSubject.asObservable();

  constructor(private http: HttpClient) {
    // Carica inizialmente la lista dei gruppi quando il servizio viene creato
    this.loadGroupPages();
  }

  // Ottieni tutti i GroupPage (con comportamento dinamico)
   // Restituisci un Observable della lista dei gruppi
    getAllGroupPages(): Observable<any[]> {
    return this.groupPage$;
  }

  // Crea un nuovo GroupPage e aggiorna la lista dei gruppi
   // Crea un nuovo GroupPage e aggiorna la lista dei gruppi
   /*createGroupPage(groupPage: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrlLocal}`, groupPage, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      tap(() => {
        // Dopo aver creato il gruppo, ricarica la lista
        this.loadGroupPages();
      })
    );
  }
    */

  createGroupPage(groupPageTitle: any, userId: number): Observable<any> {
    const url = `${this.apiUrlLocal}/create/${userId}`; // Aggiungi l'ID dell'utente come parametro di query
    return this.http.post<any>(url, groupPageTitle, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      tap(() => {
        // Dopo aver creato il gruppo, ricarica la lista delle pagine
        this.loadGroupPages();
      })
    );
  }


    // Carica la lista dei gruppi e aggiorna il BehaviorSubject
    private loadGroupPages(): void {
      this.http.get<any[]>(this.apiUrlLocal).subscribe(
        (groupPages) => {
          this.groupPagesSubject.next(groupPages); // Aggiorna il BehaviorSubject
        },
        (error) => {
          console.error('Errore nel caricare i gruppi', error);
        }
      );
    }

  // Ottieni un gruppo specifico per ID
  getGroupById(groupId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlLocal}/groups/${groupId}`);
  }

  // Ottieni il nome di un gruppo per ID
  getGroupNameById(groupId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrlLocal}/getGroupName/${groupId}`, {
      responseType: 'text' as 'json'  // Specifica che la risposta è di tipo testo
    });
  }


   // Metodo per eliminare un GroupPage
   deleteGroupPage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlLocal}/${id}`).pipe(
      tap(() => {
        // Dopo aver eliminato il gruppo, ricarica la lista dei gruppi
        this.loadGroupPages();
      })
    );
  }


  getGroupPagesByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlLocal}/byUser/${userId}`);
  }





}
