import { CommonModule, NgIf, NgFor, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NgIf,HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // --- Datos principales ---
  title = 'Kenneth Jensen';
  subtitle = 'Productor, compositor y profesor de música';
  objective = 'Convertir la música en tu mejor forma de expresión, donde técnica y emoción van siempre de la mano.';

  // --- Comentarios ---
  comentario: string = '';
  enviado: boolean = false;

  enviarComentario() {
    if (this.comentario.trim()) {
      this.enviado = true;
      this.comentario = '';
      setTimeout(() => (this.enviado = false), 4000);
    }
  }
  constructor(private http: HttpClient) {
    setInterval(() => this.next(), 3000);
  }

  // --- Carrusel de clases ---
  clases = [
    { name: 'Piano', img: 'assets/img/piano.jpg' },
    { name: 'Lenguaje Musical', img: 'assets/img/lenguaje.jpg' },
    { name: 'Composición', img: 'assets/img/composicion.jpg' },
    { name: 'Letrista', img: 'assets/img/letrista.jpg' },
    { name: 'Canto', img: 'assets/img/canto.jpg' },
  ];

  colores = ['#ff6b6b', '#feca57', '#54a0ff', '#1dd1a1', '#ee5253'];
  posiciones = [
    'translateX(-200%) scale(0.8)',
    'translateX(-100%) scale(0.9)',
    'translateX(0) scale(1)',
    'translateX(100%) scale(0.9)',
    'translateX(200%) scale(0.8)'
  ];

  next() {
    this.posiciones.unshift(this.posiciones.pop()!);
    this.clases.unshift(this.clases.pop()!);
    this.colores.unshift(this.colores.pop()!);
  }

  offset = 0;
  velocidad = 1;
  clasesDuplicadas: any[] = [];

  ngOnInit() {
    this.clasesDuplicadas = [...this.clases, ...this.clases];
    const sliderWidth = this.clases.length * (160 + 30);
    const animate = () => {
      this.offset -= this.velocidad;
      if (Math.abs(this.offset) >= sliderWidth) {
        this.offset = 0;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }

  focusSlide(index: number) {
    while (index !== 2) {
      this.next();
      index = (index + 1) % this.clases.length;
    }
  }

  opinion = '';
  keys = Array(50);

  manejarEnvio() {
    if (this.opinion.trim() !== '') {
      this.http.post(
        'http://localhost:8080/api/opinion/enviar',
        { opinion: this.opinion },
        { responseType: 'text' } // 🔹 importante
      ).subscribe({
        next: (res) => {
          console.log(res); // "Opinión enviada correctamente"
          this.enviado = true;
          this.opinion = '';
        },
        error: (err) => {
          console.error('Error enviando la opinión:', err);
          alert('No se pudo enviar la sugerencia, intenta de nuevo.');
        }
      });
    }

}
}
