import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private apiUrl = `http://localhost:8080/api/pages`; // Modifica il path se necessario

  constructor(private http: HttpClient) {}

  // Ottieni tutte le pagine
  getAllPages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crea una nuova pagina
  createPage(page: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, page);
  }

  // Ottieni le pagine per un dato groupId
  getPagesByGroupId(groupId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/byGroup/${groupId}`);
  }


  saveModify(id: number, page: any): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`, page);
  }

}
