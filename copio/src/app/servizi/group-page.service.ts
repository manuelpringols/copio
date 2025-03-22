import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupPageService {

  private apiUrlLocal = `https://copio.online:9000/api/groupPages`; // Modifica il path se necessario

  private apiUrl = `https://copio.online:9000/api/groupPages`; // Modifica il path se neces>

  constructor(private http: HttpClient) {}

  // Ottieni tutti i GroupPage
  getAllGroupPages(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crea un nuovo GroupPage
  createGroupPage(groupPage: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, groupPage);
  }

  getGroupById(groupId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/groups/${groupId}`);
  }

  getGroupNameById(groupId: number): Observable<string> {
    return this.http.get<string>(`https://copio.online:9000/api/groupPages/getGroupName/${groupId}`, {
      responseType: 'text' as 'json'  // Specifica che la risposta è di tipo testo
    });
  }


}
