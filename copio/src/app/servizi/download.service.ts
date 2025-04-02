import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  constructor(private http: HttpClient) {}

   downloadExtension(): void {
    const filePath = 'src/assets/copiextension.crx';
    const fileName = 'CopioExtension.crx';
  
    this.http.get(filePath, { responseType: 'blob' }).subscribe(
      (file: Blob) => {
        const url = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Download failed:', error);
        window.open(filePath, '_blank');
      }
    );
  }
}