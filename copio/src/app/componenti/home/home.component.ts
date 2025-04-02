import { Component } from '@angular/core';
import { DownloadService } from '../../servizi/download.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor( private downloadService : DownloadService){

  }


  downloadExtension(): void {
    this.downloadService.downloadExtension()
    console.log("massimo")
  }



 
}


