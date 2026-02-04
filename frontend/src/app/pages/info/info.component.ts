import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type MediaType = 'img' | 'video';

interface MediaItem {
  type: MediaType;
  src: string;
}

interface ExperienceCard {
  title: string;
  text: string;
  img?: string; // opcional para mostrar imagen abajo
}
interface TimelineItem {
  year: string;
  title: string;
  text: string;
  icon: string;
}

interface ExperienceCard {
  title: string;
  text: string;
}

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit, OnDestroy {
  @ViewChild('sliderVideo') sliderVideo!: ElementRef<HTMLVideoElement>;


   // Función para verificar si un item es el último del timeline
  isLast(item: TimelineItem): boolean {
    return this.timeline[this.timeline.length - 1] === item;
  }
  // Galería de imágenes extra (por ejemplo, para sección "Momentos que inspiran")
galleryImages: string[] = [
  '/assets/img/infoYo.jpg',
  '/assets/img/pianoKenneth.jpeg',
  '/assets/img/diploma.jpeg',
  '/assets/img/yo.jpg'
];

  // 🎬 Lista de imágenes y vídeos (slider principal)

  media: MediaItem[] = [
    { type: 'img', src: '/assets/img/infoYo.jpg' },
    { type: 'img', src: '/assets/img/pianoKenneth.jpeg' },
    { type: 'video', src: '/assets/video/pianoManos.mp4' },
    { type: 'img', src: '/assets/img/diploma.jpeg' },
    { type: 'img', src: '/assets/img/yo.jpg' },
    { type: 'video', src: '/assets/video/cifradoExp.mp4' }
  ];
  currentMedia: MediaItem = this.media[0];
  private intervalId: any;
  currentPlayingVideo: HTMLVideoElement | null = null;

   qualities = [
  { title: 'Creatividad', text: 'Siempre encuentro nuevas formas de expresar emociones a través de la música.', color: '#ff6b6b' },
  { title: 'Constancia', text: 'Los años de estudio me enseñaron a mantener disciplina y perseverancia.', color: '#4dabf7' },
  { title: 'Sensibilidad', text: 'La música me conecta con mis emociones y me permite transmitirlas a otros.', color: '#51cf66' },
  { title: 'Inspiración', text: 'Cada acorde es una chispa que motiva a seguir componiendo y creando.', color: '#ffd43b' },
  { title: 'Compartir', text: 'Lo más bonito de la música es transmitirla y verla emocionar a los demás.', color: '#845ef7' },
  { title: 'Resiliencia', text: 'He aprendido a transformar los retos y las caídas en motivación para seguir creciendo.', color: '#ff922b' },
  { title: 'Pasión', text: 'La música no es solo una actividad: es lo que me mueve y me hace sentir vivo.', color: '#20c997' },
  { title: 'Colaboración', text: 'Disfruto crear con otros músicos, intercambiar ideas y construir juntos algo único.', color: '#339af0' }
];


  // Timeline de la historia musical
  timeline: TimelineItem[] = [
    { year: '2010', title: 'Primeros pasos en la música', text: 'Mi familia siempre ha estado rodeada de música. Gracias a ellos empecé cuando tenía unos 5 años.', icon: '🎹' },
    { year: '2013', title: 'Primeras pruebas importantes', text: 'A los 8 años, tras dudar si la música sería lo mío, hice las pruebas y quedé tercero. Fue un momento decisivo que me permitió profundizar en mis estudios y empezar a disfrutar de verdad la música.', icon: '🎼' },
    { year: '2017', title: 'Profesional y presión', text: 'Durante el cuarto año, me preparé para las pruebas de acceso a profesional. La presión era grande: exámenes, trabajos y deberes diarios, pero algo en mí me decía que debía seguir.', icon: '🏆' },
    { year: '2017-2023', title: 'Descubriendo la pasión verdadera', text: 'Cada año que pasaba, la música se volvía más fascinante. Fundamentos de lenguaje musical, canto, composición, producción… Gracias a grandes profesores y compañeros, fui motivándome más y aprendiendo a disfrutarlo plenamente.', icon: '🎧' },
    { year: '2023', title: 'Hoy: música y disfrute', text: 'Actualmente produzco, compongo y disfruto la música cada día. Aprendo de otros músicos y transmito la pasión a quienes me rodean.', icon: '🌟' }
  ];
  toggleCard(card: any) {
    card.isFlipped = !card.isFlipped;
  }
  // Clips de la sección "Momentos que inspiran"
  videoClips: string[] = [
    '/assets/video/6febrero.mp4',
    '/assets/video/beautifulThings.mp4',
    '/assets/video/coldplay.mp4'
  ];

  ngOnInit() {
    // Slider principal
    let index = 0;
    this.intervalId = setInterval(() => {
      index = (index + 1) % this.media.length;
      this.currentMedia = this.media[index];

      // ⚡ Forzar muted en JS para el slider principal
      setTimeout(() => {
        if (this.sliderVideo && this.currentMedia.type === 'video') {
          const vid = this.sliderVideo.nativeElement;
          vid.muted = true;
          vid.volume = 0;
          vid.play();
        }
      }, 50);
    }, 3000);
  }

  // Toggle play/pause para clips
  toggleClip(video: HTMLVideoElement) {
    if (this.currentPlayingVideo && this.currentPlayingVideo !== video) {
      this.currentPlayingVideo.pause();
    }

    if (video.paused) {
      video.play();
      this.currentPlayingVideo = video;
    } else {
      video.pause();
      this.currentPlayingVideo = null;
    }
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
