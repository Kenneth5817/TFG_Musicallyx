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
  { title: 'Creatividad', text: 'Siempre encuentro nuevas formas de expresar emociones a través de la música.', color: 'linear-gradient(135deg, #dc3545 0%, #a71d2a 100%)' },
  { title: 'Constancia', text: 'Los años de estudio me enseñaron a mantener disciplina y perseverancia.', color: 'linear-gradient(135deg, #0dcaf0 0%, #087990 100%)' },
  { title: 'Sensibilidad', text: 'La música me conecta con mis emociones y me permite transmitirlas a otros.', color: 'linear-gradient(135deg, #198754 0%, #0f5132 100%)' },
  { title: 'Inspiración', text: 'Cada acorde me motiva a seguir componiendo y creando. ¡Es increíble!', color: 'linear-gradient(135deg, #ffc107 0%, #ffca2c 100%)' },
  { title: 'Compartir', text: 'Lo más bonito de la música es transmitirla y verla emocionar a los demás.', color: 'linear-gradient(135deg, #6f42c1 0%, #4a1d96 100%)' },
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
    { year: '2026', title: 'Hoy: música y disfrute', text: 'Actualmente produzco, compongo y disfruto la música cada día. Aprendo de otros músicos y transmito la pasión a quienes me rodean.', icon: '🌟' }
  ];
  toggleCard(card: any) {
    card.isFlipped = !card.isFlipped;
  }
  // Clips de la sección "Momentos que inspiran"
  videoClips: string[] = [
    '/assets/video/CancionMusicTeam.mp4',
    '/assets/video/6febrero.mp4',
    //'/assets/video/Edelweiss.mp4',
    '/assets/video/cancion2musicteam.mp4',
    '/assets/video/coldplay.mp4',
    '/assets/video/carolPiano.mp4',
    '/assets/video/beautifulThings.mp4',
    '/assets/video/cancionBetel.mp4',
    '/assets/video/pabloPiano.mp4',
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
          vid.volume = 100;
          vid.play();
        }
      }, 50);
    }, 3000);
  }
toggleClip(event: MouseEvent) {
  const overlay = event.currentTarget as HTMLElement;
  const video = overlay.parentElement?.querySelector('video') as HTMLVideoElement;
  const icon = overlay.querySelector('i') as HTMLElement;

  if (!video || !icon) return;

  // Pausar video anterior
  if (this.currentPlayingVideo && this.currentPlayingVideo !== video) {
    this.currentPlayingVideo.pause();

    const prevIcon = this.currentPlayingVideo.parentElement
      ?.querySelector('.overlay-text i') as HTMLElement;

    if (prevIcon) {
      prevIcon.classList.remove('hidden');
      prevIcon.classList.remove('fa-pause-circle');
      prevIcon.classList.add('fa-play-circle');
    }
  }

  if (video.paused) {
    video.play();

    icon.classList.add('hidden'); // 👈 ocultar icono
    this.currentPlayingVideo = video;

  } else {
    video.pause();

    icon.classList.remove('hidden'); // 👈 volver a mostrar
    icon.classList.remove('fa-pause-circle');
    icon.classList.add('fa-play-circle');

    this.currentPlayingVideo = null;
  }
}

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  slides = [
  {
    year: '2010',
    text: 'Mis primeros pasos en la música gracias a mi familia. Empiezo piano con 5 añitos en la Casa de la Cultura',
    img: 'assets/img/pequeño_piano.jpeg',
    bg: 'linear-gradient(135deg, #20c997, #0f5132)'
  },
  {
    year: '2013',
    text: 'Supero mis primeras pruebas musicales y entro con 8 años al conservatorio.',
    img: 'assets/img/kennethChico.jpeg',
    bg: 'linear-gradient(135deg, #ffc107, #ffca2c)'
  },
  {
    year: '2017',
    text: 'Empiezo a prepararme para estudios profesionales.',
    img: 'assets/img/pianofoto.JPG',
    bg: 'linear-gradient(135deg, #0dcaf0, #087990)'
  },
  {
    year: '2020',
    text: 'Disfrutando cada vez más de la música.',
    img: 'assets/img/yo piano.jpeg',
    bg: 'linear-gradient(135deg, #ff416c, #ff4b2b)'
  },
  {
    year: '2022',
    text: 'Compongo mis primeras canciones',
    img: 'assets/img/ldc.jpeg',
    bg: 'linear-gradient(135deg, #9e78e4, #d3ccdf)'
  },
  {
    year: '2023',
    text: 'Graduación del conservatorio y obtención del título profesional.',
    img: 'assets/img/graduacion_compis.jpeg',
    bg: 'linear-gradient(135deg, #3745af, #d3ccdf)'
  },
  /**{
    text: 'Obtención del título profesional.',
    img: 'assets/img/titulo.jpeg',
    bg: 'linear-gradient(135deg, #003994, #0062ff)'
  },
  {
    year: '2025',
    text: 'Disfrutando de tocar con amigos.',
    img: 'assets/img/amigos.jpeg',
    bg: 'linear-gradient(135deg, #ff6a00, #f76c16)'
  },
  {
    text: 'Disfrutando de tocar con amigos.',
    img: 'assets/img/friend.jpeg',
    bg: 'linear-gradient(135deg, #ff6a00, #f76c16)'
  },**/
  {
    year: '2024-hoy',
    text: 'Colaborando como voluntario (Vocal Coach) en un equipo musical (Portugal–España)',
    img: 'assets/img/music_team.jpeg',
    bg:'linear-gradient(135deg, #ff922b, #ff0000)'
  },
  {
    year: '2026',
    text: 'Me encanta poder enseñar a otros de música.',
    img: 'assets/img/clases.jpeg',
    bg: 'linear-gradient(135deg, #000000, #aaaabf)'
  }
];

  ngAfterViewInit() {
    const slides = document.querySelectorAll('.story-slide');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const content = entry.target.querySelector('.story-content') as HTMLElement;
        if (!content) return;

        if (entry.isIntersecting) {
          content.classList.remove('animate-slide-up');
          void content.offsetWidth;
          content.classList.add('animate-slide-up');
        }
      });
    }, {
      threshold: 0.3
    });

    slides.forEach(slide => observer.observe(slide));
  }
}




