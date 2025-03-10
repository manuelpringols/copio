import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private apiUrl = "http://localhost:8080/api/groups"; // URL base dell'API

  constructor(private http: HttpClient) { }

  // Ottieni tutti i gruppi
  getAllGroups(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Ottieni un gruppo per ID
  getGroupById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crea un nuovo gruppo
  createGroup(group: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save`, group);
  }

  // Aggiorna un gruppo esistente
  updateGroup(id: number, group: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, group);
  }

  // Elimina un gruppo
  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
