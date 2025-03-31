import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private apiUrl = `http://localhost:9000/api/pages`; // Modifica il path se necessario

  private apiUrlLocal = `https://copio.online:9000/api/pages`; // Modifica il path se necessario


  private pagesSubject = new BehaviorSubject<any[]>([]); // BehaviorSubject per i gruppi
  pages$ = this.pagesSubject.asObservable(); // Observable per i gruppi

  constructor(private http: HttpClient) {}

  updatePages(newPages: any[]) {
    this.pagesSubject.next(newPages);
  }


  // Ottieni tutte le pagine
  getAllPages() {
    this.http.get<any[]>(this.apiUrl).subscribe((pages) => {
      // Filtra i dati validi
      const validData = pages.filter(page => page.pageTitle && page.content);

      // Passa i dati validi al BehaviorSubject
      this.pagesSubject.next(validData);  // Questo invia i nuovi dati agli osservatori
    });
  }

  // Crea una nuova pagina
  /*createPage(page: any): Observable<any> {
    // Prima inviamo la richiesta per creare la pagina
    return this.http.post<any>(this.apiUrl, page).pipe(
      // Una volta completata, aggiorniamo il BehaviorSubject con la nuova pagina
      catchError((error) => {
        console.error('Error during page creation:', error);
        throw error; // Rilancia l'errore per la gestione a livello di componente
      })
    );
  }

  */

  createPage(userId: number, pageData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userId}`, pageData);
  }

  // Ottieni le pagine per un dato groupId
  getPagesByGroupId(groupId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/byGroup/${groupId}`);
  }


  saveModify(id: number, page: any): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`, page);
  }

   // Elimina una pagina
   deletePage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deletePageByUserId(userId:number,pageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${userId}/page/${pageId}`);

  }

  getPagesByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/byUser/${userId}`);
  }

  




}
