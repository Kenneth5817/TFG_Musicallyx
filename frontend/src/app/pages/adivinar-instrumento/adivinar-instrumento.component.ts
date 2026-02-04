import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Instrumento {
  nombre: string;
  img: string;
  audio: string;
}

@Component({
  selector: 'app-adivinar-instrumento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './adivinar-instrumento.component.html',
  styleUrls: ['./adivinar-instrumento.component.css']
})
export class AdivinarInstrumentoComponent implements OnInit {

  instrumentos: Instrumento[] = [
    { nombre: 'Piano', img: 'assets/img/juegoInstrumentos/ppiano.jpg', audio: 'assets/audio/instrumentos/pianoSonido.mp3' },
    { nombre: 'Guitarra', img: 'assets/img/juegoInstrumentos/guitar.jpg', audio: 'assets/audio/instrumentos/guitarraSonido.mp3' },
    { nombre: 'Violín', img: 'assets/img/juegoInstrumentos/Violin.jpg', audio: 'assets/audio/instrumentos/violinSonido.mp3' },
    { nombre: 'Arpa', img: 'assets/img/juegoInstrumentos/Arpa.jpg', audio: 'assets/audio/instrumentos/arpaSonido.mp3' },
    { nombre: 'Flauta Travesera', img: 'assets/img/juegoInstrumentos/flauta.jpg', audio: 'assets/audio/instrumentos/flautaSonido.mp3' },
    { nombre: 'Trompeta', img: 'assets/img/juegoInstrumentos/Trompeta.jpg', audio: 'assets/audio/instrumentos/trompetaSonido.mp3' },
  ];

  instrumentosRestantes: Instrumento[] = [];
  imagenesMezcladas: Instrumento[] = [];
  rondaActual: number = 0;
  aciertos: number = 0;
  instrumentoCorrecto!: Instrumento;
  ultimoInstrumento!: Instrumento | null;
  audio!: HTMLAudioElement;
  feedback: string = '';
  mostrarNext: boolean = false;
  mostrarResultadoFinal: boolean = false;
  totalRondas: number = this.instrumentos.length;

  ngOnInit(): void {
    this.iniciarJuego();
  }

  shuffleArray(arr: any[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  iniciarJuego() {
    this.rondaActual = 0;
    this.aciertos = 0;
    this.feedback = '';
    this.mostrarNext = false;
    this.mostrarResultadoFinal = false;
    this.instrumentosRestantes = [...this.instrumentos];
    this.shuffleArray(this.instrumentosRestantes);
    this.imagenesMezcladas = [...this.instrumentos];
    this.ultimoInstrumento = null;
    this.siguienteRonda();
  }

  siguienteRonda() {
    this.feedback = '';
    this.mostrarNext = false;

    if (this.instrumentosRestantes.length === 0) {
      this.mostrarResultado();
      return;
    }

    // Seleccionar instrumento aleatorio que no sea el último
    let index = Math.floor(Math.random() * this.instrumentosRestantes.length);
    let instrumento = this.instrumentosRestantes[index];
    if (this.ultimoInstrumento && this.instrumentosRestantes.length > 1) {
      while (instrumento === this.ultimoInstrumento) {
        index = Math.floor(Math.random() * this.instrumentosRestantes.length);
        instrumento = this.instrumentosRestantes[index];
      }
    }

    this.instrumentoCorrecto = instrumento;
    this.ultimoInstrumento = instrumento;
    this.instrumentosRestantes.splice(index, 1);

    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.audio = new Audio();
  this.audio.src = this.instrumentoCorrecto.audio;
  this.audio.load();
  this.audio.oncanplaythrough = () => {
    this.audio.play().catch(() => console.warn('Interacción requerida para reproducir audio.'));
  };

    // Todas las cartas disponibles y sin borde
    const cards = document.querySelectorAll('.instrument-card');
    cards.forEach(card => {
      (card as HTMLElement).style.pointerEvents = 'auto';
      card.classList.remove('correct', 'wrong');
    });
  }

  seleccionarInstrumento(inst: Instrumento, event: Event) {
    const card = event.currentTarget as HTMLElement | null;
    if (!card) return;

    card.style.pointerEvents = 'none';
    if (this.audio) this.audio.pause();

    if (inst.nombre === this.instrumentoCorrecto.nombre) {
      card.classList.add('correct');
      this.feedback = '✅ ¡Correcto!';
      this.aciertos++;
    } else {
      card.classList.add('wrong');
      this.feedback = `❌ Incorrecto. Era: ${this.instrumentoCorrecto.nombre}`;

      const correctoCard = document.querySelector(`.instrument-card[data-nombre="${this.instrumentoCorrecto.nombre}"]`);
      if (correctoCard instanceof HTMLElement) correctoCard.classList.add('correct');
    }

    this.mostrarNext = true;
  }

  reproducirAudio() {
    if (this.audio) {
      this.audio.currentTime = 0;
      this.audio.play();
    }
  }

  mostrarResultado() {
    this.mostrarResultadoFinal = true;
    this.feedback = '';
    this.mostrarNext = false;
  }
}
