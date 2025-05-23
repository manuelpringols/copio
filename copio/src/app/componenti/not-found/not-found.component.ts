import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: false,
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  stars: { x: number, y: number, delay: number, color: string }[] = [];

  ngOnInit() {
    this.generateStars(150); // Numero di stelle
  }

 generateStars(count: number) {
  const colors = ['#ffffff', '#ffdd44', '#ff5544']; // Bianco, Giallo, Rosso
  
  if (typeof window !== 'undefined') {
    this.stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  } else {
    // fallback: posizioni e delay a zero o valori fissi, o array vuoto
    this.stars = Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      delay: 0,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }
}
}