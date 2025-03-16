import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-page',
  standalone: false,
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  group: any;

  lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent justo dui, accumsan ut maximus ut, posuere pulvinar dui. Praesent orci arcu, vehicula at ante quis, tincidunt posuere dolor. Ut eget mi convallis diam lacinia sagittis vel a lorem. Sed elit purus, tincidunt ut mi at, luctus scelerisque dolor. Maecenas pharetra ante enim, vitae tincidunt ante porttitor non. Quisque eu feugiat eros, eu placerat lectus. Morbi tempor velit quis augue lacinia, at tincidunt est mollis. Proin justo ipsum, posuere sed vestibulum porttitor, laoreet at tortor. Sed at mollis massa. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer laoreet convallis nisl.Donec pellentesque erat a massa vulputate dictum. Praesent non tincidunt massa. Proin rutrum ligula eget leo feugiat, vel ornare felis rhoncus. Nulla id elit ut ex posuere commodo. Nam posuere tortor elit, sit amet aliquet ex dapibus scelerisque. Donec pharetra porta nulla, nec pretium massa fermentum eget. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed eu posuere nisl. Vestibulum vulputate sapien ut laoreet feugiat. Donec imperdiet eget neque ac auctor. Praesent et dolor ac tellus posuere vulputate. Curabitur a eros non lectus tempus ultrices in at urna. Aenean nec facilisis ante, sit amet facilisis nisl. Suspendisse dictum purus eu ultrices pharetra. Aliquam turpis enim, auctor sed nulla vel, molestie pellentesque turpis.Donec vel ipsum sed felis mattis sollicitudin. Aenean eget ex aliquam velit pretium pharetra. Pellentesque scelerisque vehicula sem at aliquam. Aenean elementum, nisi vitae hendrerit volutpat, est lacus elementum odio, elementum hendrerit lectus mauris at elit. Ut ornare eros erat, eu lacinia orci vehicula vitae. Vivamus aliquet elit dignissim mauris fermentum condimentum. Pellentesque luctus malesuada nisi, ac pretium eros semper quis.Nam vel molestie turpis. Donec lacinia, tortor non pellentesque semper, urna felis placerat nulla, non tempus est magna vel enim. Fusce aliquet mi consequat, rhoncus est eu, vestibulum elit. Fusce in dapibus mauris. Vestibulum feugiat est quis mi ultricies facilisis. Nunc eget ante pharetra, tincidunt ante et, porta velit. Pellentesque imperdiet id magna a porttitor. Curabitur placerat sagittis ligula, id elementum tellus gravida nec. Sed hendrerit mi nisi, eu vulputate purus tempor eu. Nullam non pretium justo, sit amet rhoncus arcu. Nullam euismod laoreet quam, eget commodo velit volutpat id. Vivamus gravida tellus eu porttitor molestie. Integer sit amet luctus lorem.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet sodales ex, quis faucibus odio. Integer lorem lacus, tincidunt id ligula sit amet, ultrices gravida mi. Etiam finibus molestie orci sed mattis. Proin neque lacus, mollis a odio nec, venenatis consectetur ipsum. Vestibulum vel convallis leo. Curabitur commodo luctus dolor, elementum tincidunt enim tempus ut. Aliquam non metus gravida metus feugiat porta. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent justo dui, accumsan ut maximus ut, posuere pulvinar dui. Praesent orci arcu, vehicula at ante quis, tincidunt posuere dolor. Ut eget mi convallis diam lacinia sagittis vel a lorem. Sed elit purus, tincidunt ut mi at, luctus scelerisque dolor. Maecenas pharetra ante enim, vitae tincidunt ante porttitor non. Quisque eu feugiat eros, eu placerat lectus. Morbi tempor velit quis augue lacinia, at tincidunt est mollis. Proin justo ipsum, posuere sed vestibulum porttitor, laoreet at tortor. Sed at mollis massa. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer laoreet convallis nisl.Donec pellentesque erat a massa vulputate dictum. Praesent non tincidunt massa. Proin rutrum ligula eget leo feugiat, vel ornare felis rhoncus. Nulla id elit ut ex posuere commodo. Nam posuere tortor elit, sit amet aliquet ex dapibus scelerisque. Donec pharetra porta nulla, nec pretium massa fermentum eget. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed eu posuere nisl. Vestibulum vulputate sapien ut laoreet feugiat. Donec imperdiet eget neque ac auctor. Praesent et dolor ac tellus posuere vulputate. Curabitur a eros non lectus tempus ultrices in at urna. Aenean nec facilisis ante, sit amet facilisis nisl. Suspendisse dictum purus eu ultrices pharetra. Aliquam turpis enim, auctor sed nulla vel, molestie pellentesque turpis.Donec vel ipsum sed felis mattis sollicitudin. Aenean eget ex aliquam velit pretium pharetra. Pellentesque scelerisque vehicula sem at aliquam. Aenean elementum, nisi vitae hendrerit volutpat, est lacus elementum odio, elementum hendrerit lectus mauris at elit. Ut ornare eros erat, eu lacinia orci vehicula vitae. Vivamus aliquet elit dignissim mauris fermentum condimentum. Pellentesque luctus malesuada nisi, ac pretium eros semper quis.Nam vel molestie turpis. Donec lacinia, tortor non pellentesque semper, urna felis placerat nulla, non tempus est magna vel enim. Fusce aliquet mi consequat, rhoncus est eu, vestibulum elit. Fusce in dapibus mauris. Vestibulum feugiat est quis mi ultricies facilisis. Nunc eget ante pharetra, tincidunt ante et, porta velit. Pellentesque imperdiet id magna a porttitor. Curabitur placerat sagittis ligula, id elementum tellus gravida nec. Sed hendrerit mi nisi, eu vulputate purus tempor eu. Nullam non pretium justo, sit amet rhoncus arcu. Nullam euismod laoreet quam, eget commodo velit volutpat id. Vivamus gravida tellus eu porttitor molestie. Integer sit amet luctus lorem.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet sodales ex, quis faucibus odio. Integer lorem lacus, tincidunt id ligula sit amet, ultrices gravida mi. Etiam finibus molestie orci sed mattis. Proin neque lacus, mollis a odio nec, venenatis consectetur ipsum. Vestibulum vel convallis leo. Curabitur commodo luctus dolor, elementum tincidunt enim tempus ut. Aliquam non metus gravida metus feugiat porta. Lorem ipsum dolor sit amet, consectetur adipiscing elit. " // esempio di testo
  pages = [];
  groupId: string | null = null;
  isModified = false;
  groups = [
    { id: 1, name: 'Spring security Doc', content: this.lorem },
    { id: 2, name: 'Api Doc', content: 'Api Doc...' },
    { id: 3, name: 'Kafka Doc', content: 'Kafka Doc...' }
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Abboniamoci ai cambiamenti dell'ID della route
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.group = this.groups.find((g) => g.id === id);

      if (!this.group) {
        this.router.navigate(['/doc']); // Se l'id non esiste, torniamo indietro
      }
    });
  }

  onTextChange() {
    this.isModified = true; // Imposta il flag su true quando il testo viene modificato
  }

  saveDocument() {
    // Logica per salvare il documento al backend
    console.log('Salvando documento...', this.group.content);
    // Dopo aver salvato, resettiamo il flag
    this.isModified = false;
  }

  goBack() {
    // Se il testo è stato modificato, chiediamo conferma
    if (this.isModified) {
      if (confirm('Salvare modifiche documento?')) {
        this.saveDocument(); // Salva il documento prima di tornare indietro
      } else {
        // Altrimenti, resetta il contenuto e torna indietro
        this.router.navigate(['/doc']);
        this.isModified = false;
      }
    } else {
      this.router.navigate(['/doc']);
    }
  }

  navigateToGroup(id: number) {
    this.router.navigate(['/doc/page', id]);
  }
}
