import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Nota {
  nombre: string;
  audio: string;
}

@Component({
  selector: 'app-oido-absoluto',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './oido-absoluto.component.html',
  styleUrls: ['./oido-absoluto.component.css']
})
export class OidoAbsolutoComponent implements OnInit {

  // Array fijo → botones en orden siempre
  notasFijas: Nota[] = [
    { nombre: 'Do', audio: 'assets/audio/notasMusicales/DO.mp3' },
    { nombre: 'Re', audio: 'assets/audio/notasMusicales/RE.mp3' },
    { nombre: 'Mi', audio: 'assets/audio/notasMusicales/MI.mp3' },
    { nombre: 'Fa', audio: 'assets/audio/notasMusicales/FA.mp3' },
    { nombre: 'Sol', audio: 'assets/audio/notasMusicales/SOL.mp3' },
    { nombre: 'La', audio: 'assets/audio/notasMusicales/LA.mp3' },
    { nombre: 'Si', audio: 'assets/audio/notasMusicales/SI.mp3' }
  ];

  // Array aleatorio → orden de sonidos
  notasAleatorias: Nota[] = [];

  rondaActual: number = 0;
  intentos: number = 0;
  aciertos: number = 0;
  notaCorrecta!: Nota;
  audio!: HTMLAudioElement;
  feedback: string = '';
  mostrarNext: boolean = false;
  juegoTerminado: boolean = false;
  totalRondas: number = this.notasFijas.length;
  notaAnterior!: Nota;

  ngOnInit(): void {
    this.iniciarJuego();
  }

  private shuffleArray(arr: any[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  iniciarJuego() {
    this.juegoTerminado = false;
    this.rondaActual = 0;
    this.aciertos = 0;
    this.intentos = 0;
    this.feedback = '';
    this.mostrarNext = false;
    this.notaAnterior = null as any;

    // Clonar notas fijas y barajar para el orden de juego
    this.notasAleatorias = [...this.notasFijas];
    this.shuffleArray(this.notasAleatorias);

    this.siguienteRonda();
  }

  siguienteRonda() {
    this.feedback = '';
    this.mostrarNext = false;

    if (this.rondaActual >= this.totalRondas) {
      this.mostrarResultado();
      return;
    }

    this.notaCorrecta = this.notasAleatorias[this.rondaActual];
    this.notaAnterior = this.notaCorrecta;
    this.rondaActual++;

    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    this.audio = new Audio(this.notaCorrecta.audio);
    this.audio.play().catch(() => {});
  }

  reproducirNota() {
    if (this.audio) {
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {
        console.warn('El navegador requiere interacción del usuario para reproducir audio.');
      });
    }
  }

  seleccionarNota(nota: Nota) {
    this.intentos++;
    if (this.audio) this.audio.pause();

    if (nota.nombre === this.notaCorrecta.nombre) {
      this.aciertos++;
      this.feedback = `✅ ¡Correcto! Era ${nota.nombre}`;
    } else {
      this.feedback = `❌ Incorrecto. Era ${this.notaCorrecta.nombre}`;
    }

    this.mostrarNext = true;
  }

  mostrarResultado() {
    this.juegoTerminado = true;
    this.feedback = `🎉 Juego terminado. ✅ Aciertos: ${this.aciertos}/${this.totalRondas}, Intentos: ${this.intentos}`;
    this.mostrarNext = false;
  }
}
