import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Juego {
  titulo: string;
  descripcion: string;
  ruta: string;
  imagen: string;
  video: string;
  poster: string;
}

@Component({
  selector: 'app-juegos-musicales',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './juegos-musicales.component.html',
  styleUrls: ['./juegos-musicales.component.css']
})
export class JuegosMusicalesComponent implements AfterViewInit {
  juegos: Juego[] = [
    {
      titulo: 'Adivina el compás',
      descripcion: 'Escucha un fragmento de una canción y elige el compás correcto.',
      ruta: '/adivinar-compas',
      imagen: 'assets/img/juego12.jpg',
      video: 'assets/video/chicoMusica.mp4',
      poster: 'assets/img/video-preview1.jpg'
    },
    {
      titulo: 'Oído Absoluto',
      descripcion: 'Escucha una nota musical y di cuál es.',
      ruta: '/oido-absoluto',
      imagen: 'assets/img/juego2.jpg',
      video: 'assets/video/notasMusic.mp4',
      poster: 'assets/img/video-preview2.jpg'
    },
    {
      titulo: 'Adivina el instrumento',
      descripcion: 'Identifica el instrumento que escuchas.',
      ruta: '/adivinar-instrumento',
      imagen: 'assets/img/juego3.avif',
      video: 'assets/video/instruments.mp4',
      poster: 'assets/img/video-preview3.jpg'
    },
    {
      titulo: 'Adivina el estilo',
      descripcion: 'Identifica a qué estilo pertenecen las canciones.',
      ruta: '/adivinar-estilo',
      imagen: 'assets/img/juego4.jpg',
      video: 'assets/video/cantarCoche.mp4',
      poster: 'assets/img/video-preview4.jpg'
    },
    {
      titulo: 'Memoriza los instrumentos',
      descripcion: 'Encuentra todas las parejas de instrumentos en tiempo récord.',
      ruta: '/memorizar-instrumento',
      imagen: 'assets/img/juego5.jpg',
      video: 'assets/video/memory.mp4',
      poster: 'assets/img/video-preview5.jpg'
    },
    {
      titulo: 'Simón dice...',
      descripcion: 'Trabaja la memoria con este juego interactivo.',
      ruta: '/juego-simon',
      imagen: 'assets/img/juego6.jpg',
      video: 'assets/video/simon.mp4',
      poster: 'assets/img/video-preview6.jpg'
    }
  ];

  ngAfterViewInit(): void {
    const videos = document.querySelectorAll<HTMLVideoElement>('video[data-src]');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target as HTMLVideoElement;

        if (window.innerWidth <= 991) {
          video.pause();
          video.src = ''; // evita carga innecesaria en móvil
          return;
        }

        if (entry.isIntersecting) {
          const dataSrc = video.dataset['src'];
          if (dataSrc) {
            video.src = dataSrc;
            video.load();
            observer.unobserve(video);
          }
        }
      });
    }, { threshold: 0.25 });

    videos.forEach(video => observer.observe(video));
  }
}
