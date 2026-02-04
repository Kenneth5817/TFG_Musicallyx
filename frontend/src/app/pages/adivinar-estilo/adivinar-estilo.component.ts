import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Cancion {
  audio: string;
  estilo: string | string[];
}

@Component({
  selector: 'app-adivinar-estilo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adivinar-estilo.component.html',
  styleUrls: ['./adivinar-estilo.component.css']
})
export class AdivinarEstiloComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  canciones: Cancion[] = [
    { audio: './assets/audio/estilosCanciones/capaz.mp3', estilo: ['regueton', 'merengue'] },
    { audio: './assets/audio/estilosCanciones/celiaCruz.mp3', estilo: 'salsa' },
    { audio: './assets/audio/estilosCanciones/discoRayado.mp3', estilo: 'pop' },
    { audio: './assets/audio/estilosCanciones/flyMeToTheMoon.mp3', estilo: 'jazz' },
    { audio: './assets/audio/estilosCanciones/noTieneSentido.mp3', estilo: ['urbano', 'regueton'] },
    { audio: './assets/audio/estilosCanciones/odioQueTeQuiero.mp3', estilo: 'pop' },
    { audio: './assets/audio/estilosCanciones/tontipopSiQuieres.mp3', estilo: ['pop', 'tontipop'] },
    { audio: './assets/audio/estilosCanciones/rompe.mp3', estilo: ['electronica', 'pop'] },
    { audio: './assets/audio/estilosCanciones/techno.mp3', estilo: ['techno', 'electronica'] },
    { audio: './assets/audio/estilosCanciones/shallow.mp3', estilo: 'balada' },
    { audio: './assets/audio/estilosCanciones/perfect.mp3', estilo: 'balada' },
    { audio: './assets/audio/estilosCanciones/tango.mp3', estilo: 'tango' }
  ];

  estilosDisponibles: string[] = [
    'pop', 'rock', 'regueton', 'tango', 'techno', 'country',
    'jazz', 'electronica', 'merengue', 'tontipop', 'balada',
    'salsa', 'cumbia', 'urbano'
  ];

  preguntasRestantes: Cancion[] = [];
  preguntaActual!: Cancion;
  aciertos = 0;
  errores = 0;

  feedback: string = '';
  feedbackClass: string = '';
  mostrarFinal = false;

  ngOnInit(): void {
    this.preguntasRestantes = [...this.canciones];
    this.cargarNuevaPregunta();
  }

  cargarNuevaPregunta() {
    this.feedback = '';
    if (this.preguntasRestantes.length === 0) {
      this.mostrarResultadoFinal();
      return;
    }
    const index = Math.floor(Math.random() * this.preguntasRestantes.length);
    this.preguntaActual = this.preguntasRestantes.splice(index, 1)[0];

    // Forzar recarga del audio
    setTimeout(() => {
      this.audioPlayer.nativeElement.load();
      this.audioPlayer.nativeElement.play().catch(() => {});
    }, 0);
  }

  responder(estilo: string) {
    const estilosCorrectos = Array.isArray(this.preguntaActual.estilo)
      ? this.preguntaActual.estilo
      : [this.preguntaActual.estilo];

    const esCorrecta = estilosCorrectos.includes(estilo);

    this.feedback = esCorrecta
      ? `✅ ¡Correcto! Es estilo(s): ${estilosCorrectos.join(', ').toUpperCase()}`
      : `❌ Incorrecto. El estilo correcto era: ${estilosCorrectos.join(', ').toUpperCase()}`;

    this.feedbackClass = esCorrecta ? 'text-success' : 'text-danger';

    if (esCorrecta) this.aciertos++;
    else this.errores++;
  }

  mostrarResultadoFinal() {
    this.mostrarFinal = true;
  }

  porcentajeExito(): number {
    const total = this.aciertos + this.errores;
    return total ? Math.round((this.aciertos / total) * 100) : 0;
  }


  constructor(private router: Router) {}

  irAJuegos() {
    this.router.navigate(['/juegos-musicales']);
  }
}
