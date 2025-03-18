import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupPageService {

  private apiUrl = `http://localhost:8080/api/groupPages`; // Modifica il path se necessario

  constructor(private http: HttpClient) {}

  // Ottieni tutti i GroupPage
  getAllGroupPages(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crea un nuovo GroupPage
  createGroupPage(groupPage: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, groupPage);
  }


}
