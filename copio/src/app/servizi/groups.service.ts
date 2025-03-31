import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private apiUrl = "http://localhost:9000/api/groups"; // URL mini-pc dell'API

   private apiUrlLocal = "https://copio.online:9000/api/groups"; // URL base dell'API
  constructor(private http: HttpClient) { }

  getAllGroups(): Observable<any> {
    // Recupera il token salvato nel localStorage
    const authToken = localStorage.getItem('auth_token'); 
  
    // Aggiungi l'header Authorization con il token
    const headers = {
      'Authorization': `Bearer ${authToken}`
    };
  
    // Esegui la richiesta GET con l'header di autorizzazione
    return this.http.get<any>(this.apiUrl, { headers });
  }

  

  // Ottieni un gruppo per ID
  getGroupById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crea un nuovo gruppo
  /*createGroup(groupName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save?groupName=${groupName}`, groupName);
  }
    */

  createGroup(groupName: string, userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save?groupName=${groupName}&userId=${userId}`, {});
  }

  // Aggiorna un gruppo esistente
  updateGroup(id: number, group: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, group);
  }

  // Elimina un gruppo
  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getGroupsByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }

  deleteGroupsByUserId(userId : number,groupId : number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/byUser/${userId}/group/${groupId}`);
  }


}
