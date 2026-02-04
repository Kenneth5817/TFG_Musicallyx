import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as Tone from 'tone';

type Color = 'red' | 'black' | 'white' | 'grey';

@Component({
  selector: 'app-juego-simon',
  templateUrl: './juego-simon.component.html',
  styleUrls: ['./juego-simon.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class JuegoSimonComponent {
  gameStarted = false;
  sequence: Color[] = [];
  playerSequence: Color[] = [];
  colors: Color[] = ['red', 'black', 'white', 'grey'];
  notes: Record<Color, string> = {
    red: 'C4',
    black: 'D4',
    white: 'E4',
    grey: 'F4'
  };

  message = '';
  score = 0;
  synth = new Tone.Synth().toDestination();

  constructor(private router: Router) {}

  async iniciarJuego() {
    await Tone.start();
    this.gameStarted = true;
    this.sequence = [];
    this.playerSequence = [];
    this.score = 0;
    this.message = '¡Juego iniciado!';
    this.agregarColor();
  }

  agregarColor() {
    const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.sequence.push(randomColor);
    this.playerSequence = [];
    this.message = `Secuencia actual: ${this.sequence.length} pasos`;
    this.reproducirSecuencia();
  }

  reproducirSecuencia() {
    let i = 0;
    const interval = setInterval(() => {
      const color = this.sequence[i];
      this.tocar(color);
      i++;
      if (i >= this.sequence.length) clearInterval(interval);
    }, 800);
  }

  pulsar(color: Color) {
    if (!this.gameStarted) return;
    this.tocar(color);
    this.playerSequence.push(color);
    const index = this.playerSequence.length - 1;

    if (color !== this.sequence[index]) {
      this.message = '¡Has perdido!';
      this.gameStarted = false;
      return;
    }

    if (this.playerSequence.length === this.sequence.length) {
      this.score += 1;
      this.message = `¡Correcto! Llevas ${this.score} aciertos`;
      setTimeout(() => this.agregarColor(), 1000);
    }
  }

  tocar(color: Color) {
    this.synth.triggerAttackRelease(this.notes[color], '8n');
    const btn = document.querySelector(`.game-btn.${color}`) as HTMLElement;
    if (btn) {
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 300);
    }
  }

  reiniciarJuego() {
    this.iniciarJuego();
  }

  irATodosLosJuegos() {
    this.router.navigate(['/juegos-musicales']);
  }
}
