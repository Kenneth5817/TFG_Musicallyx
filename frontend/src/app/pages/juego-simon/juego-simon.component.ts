import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as Tone from 'tone';

type Note = 'DO' | 'RE' | 'MI' | 'FA' | 'SOL' | 'LA' | 'SI' | 'DO2';

@Component({
  selector: 'app-juego-simon',
  templateUrl: './juego-simon.component.html',
  styleUrls: ['./juego-simon.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class JuegoSimonComponent {

  gameStarted = false;
  isPlaying = false;

  sequence: Note[] = [];
  playerSequence: Note[] = [];

  colors: Note[] = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI', 'DO2'];
  showBoard = true;

  notes: Record<Note, string> = {
    DO: 'C4',
    RE: 'D4',
    MI: 'E4',
    FA: 'F4',
    SOL: 'G4',
    LA: 'A4',
    SI: 'B4',
    DO2: 'C5'
  };

  message = '';
  score = 0;
  lives = 3;

  synth = new Tone.Synth().toDestination();

  intervalId: any = null;

  constructor(private router: Router) {}

  async iniciarJuego() {
    await Tone.start();

    // reset primero (IMPORTANTÍSIMO)
    this.sequence = [];
    this.playerSequence = [];
    this.score = 0;
    this.lives = 3;

    this.message = '🎵 ¡Memoriza!';

    this.gameStarted = true;
    this.isPlaying = false;
    this.showBoard = true;

    // SOLO UNA VEZ
    setTimeout(() => {
      this.agregarColor();
    }, 600);
  }

  press(note: Note) {
    if (!this.gameStarted) return;
    if (this.isPlaying) return;

    this.tocar(note, false);

    this.playerSequence.push(note);

    const index = this.playerSequence.length - 1;

    if (note !== this.sequence[index]) {
      this.lives--;

      if (this.lives <= 0) {
        this.gameStarted = false;
        this.message = 'GAME OVER';
        return;
      }

      this.message = `❌ Fallo! vidas: ${this.lives}`;
      return;
    }

    if (this.playerSequence.length === this.sequence.length) {
      this.score++;
      this.message = `✅ Correcto!`;

      setTimeout(() => this.agregarColor(), 800);
    }
  }

  goBack() {
    this.router.navigate(['/juegos-musicales']);
  }
  reiniciarJuego() {
    this.gameStarted = false;
    this.isPlaying = false;
    this.sequence = [];
    this.playerSequence = [];
    this.score = 0;
    this.lives = 3;

    this.message = '';

    // IMPORTANTE: forzar un micro delay limpio
    setTimeout(() => {
      this.iniciarJuego();
    }, 0);
  }

  agregarColor() {
    const randomNote = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.sequence.push(randomNote);

    this.playerSequence = [];
    this.message = `Secuencia: ${this.sequence.length}`;

    setTimeout(() => this.reproducirSecuencia(), 600);
  }

  reproducirConVidas() {
    if (!this.gameStarted) return;
    if (this.lives <= 0) return;
    if (this.isPlaying) return;

    this.lives--;

    if (this.lives <= 0) {
      this.message = 'Sin vidas para repetir';
      return;
    }

    this.reproducirSecuencia();
  }

  reproducirSecuencia() {
    if (this.intervalId) clearInterval(this.intervalId);

    this.isPlaying = true;

    let i = 0;

    this.intervalId = setInterval(() => {
      const note = this.sequence[i];
      this.tocar(note, true);

      i++;

      if (i >= this.sequence.length) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.isPlaying = false;
      }
    }, 750);
  }

  pulsar(note: Note) {
    if (!this.gameStarted) return;

    // ❌ SOLO bloquear si está reproduciendo secuencia
    if (this.isPlaying) return;

    this.tocar(note, false);

    this.playerSequence.push(note);

    const index = this.playerSequence.length - 1;

    if (note !== this.sequence[index]) {
      this.lives--;

      if (this.lives <= 0) {
        this.message = 'GAME OVER';
        this.gameStarted = false;
        return;
      }

      this.message = `❌ Fallo! vidas: ${this.lives}`;
      return;
    }

    if (this.playerSequence.length === this.sequence.length) {
      this.score++;
      this.message = `✅ Correcto!`;
      setTimeout(() => this.agregarColor(), 800);
    }
  }

  tocar(note: Note, replay = false) {
    this.synth.triggerAttackRelease(this.notes[note], '8n');

    const btn = document.querySelector(`.game-btn.${note}`) as HTMLElement;

    if (btn) {
      btn.classList.add('active');

      setTimeout(() => {
        btn.classList.remove('active');
      }, 250);
    }
  }

  replay() {
    if (!this.gameStarted) return;
    if (this.isPlaying) return;
    if (this.lives <= 0) return;

    this.lives--;

    if (this.lives < 0) this.lives = 0;

    this.reproducirSecuencia();
  }
  irATodosLosJuegos() {
    this.router.navigate(['/juegos-musicales']);
  }
}
