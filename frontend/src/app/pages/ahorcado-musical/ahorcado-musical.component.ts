import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ahorcado-musical',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ahorcado-musical.component.html',
  styleUrls: ['./ahorcado-musical.component.css']
})
export class AhorcadoMusicalComponent {

  terminosMusicales = [
    { palabra: 'PENTAGRAMA' },
    { palabra: 'CIFRADO' },
    { palabra: 'CLAVE DE SOL' },
    { palabra: 'SEMICORCHEA' },
    { palabra: 'CALDERON' },
    { palabra: 'ARMADURA' },
    { palabra: 'COMPAS' },
    { palabra: 'ACORDE' },
    { palabra: 'INTERVALO' },
    { palabra: 'TONALIDAD' }
  ];

  palabraActual = '';
  palabraOculta: string[] = [];
  letrasFalladas: string[] = [];
  intentosRestantes = 10;

  juegoTerminado = false;
  juegoGanado = false;

  letraInput = '';
  palabraInput = '';

  mostrarMenuFinal = false;

  constructor() {
    this.iniciarJuego();
  }

  iniciarJuego() {
    const randomIndex = Math.floor(Math.random() * this.terminosMusicales.length);

    this.palabraActual =
      this.terminosMusicales[randomIndex].palabra.toUpperCase();

    this.palabraOculta = this.palabraActual.split('').map(() => '_');
    this.letrasFalladas = [];
    this.intentosRestantes = 10;

    this.juegoTerminado = false;
    this.juegoGanado = false;
    this.mostrarMenuFinal = false;

    this.letraInput = '';
    this.palabraInput = '';
  }

  adivinarLetra() {
    if (!this.letraInput || this.juegoTerminado) return;

    const letra = this.letraInput.toUpperCase().trim();
    this.letraInput = '';

    if (letra.length !== 1) return;

    if (this.palabraActual.includes(letra)) {
      for (let i = 0; i < this.palabraActual.length; i++) {
        if (this.palabraActual[i] === letra) {
          this.palabraOculta[i] = letra;
        }
      }

      if (!this.palabraOculta.includes('_')) {
        this.ganar();
      }

    } else {
      this.letrasFalladas.push(letra);
      this.intentosRestantes--;

      if (this.intentosRestantes <= 0) {
        this.perder();
      }
    }
  }

  adivinarPalabraCompleta() {
    if (!this.palabraInput || this.juegoTerminado) return;

    const intento = this.palabraInput.toUpperCase().trim();
    this.palabraInput = '';

    if (intento === this.palabraActual) {
      this.palabraOculta = this.palabraActual.split('');
      this.ganar();
    } else {
      this.intentosRestantes -= 2;

      if (this.intentosRestantes <= 0) {
        this.perder();
      }
    }
  }

  ganar() {
    this.juegoGanado = true;
    this.juegoTerminado = true;
    this.mostrarMenuFinal = true;
  }

  perder() {
    this.juegoTerminado = true;
    this.mostrarMenuFinal = true;
  }

  reiniciar() {
    this.iniciarJuego();
  }
}
