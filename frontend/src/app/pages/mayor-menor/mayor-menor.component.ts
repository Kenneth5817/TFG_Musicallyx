// mayor-o-menor.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.css']
})
export class MayorOMenorComponent {
  canciones = [
    { nombre: "APT. - ROSÉ & Bruno Mars", tonalidad: "Menor", audio: "assets/audio/canciones/APT.mp3" },
    { nombre: "We Are The Champions - Queen", tonalidad: "Mayor", audio: "assets/audio/canciones/weAreTheChampion.mp3" },
    { nombre: "El Danubio Azul - Strauss", tonalidad: "Mayor", audio: "assets/audio/canciones/danubioAzul.mp3" },
    { nombre: "Animals - Martin Garrix", tonalidad: "Menor", audio: "assets/audio/canciones/animals68.mp3" },
    { nombre: "Sonrisas y Lágrimas", tonalidad: "Mayor", audio: "assets/audio/canciones/sonrisasYLagrimas.mp3" },
    { nombre: "Belong Together - Mark Ambor", tonalidad: "Mayor", audio: "assets/audio/canciones/belongTogether.mp3" }
  ];

  cancionActual: any = null;
  puntuacion: number = 0;
  vidas: number = 3;
  juegoActivo: boolean = true;
  juegoTerminado: boolean = false;
  mensaje: string = '';
  audioElement: HTMLAudioElement | null = null;

  constructor() {
    this.nuevaCancion();
  }

  nuevaCancion() {
    const indice = Math.floor(Math.random() * this.canciones.length);
    this.cancionActual = this.canciones[indice];

    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.audioElement = new Audio(this.cancionActual.audio);
  }

  playAudio() {
    if (this.audioElement) {
      this.audioElement.currentTime = 0;
      this.audioElement.play();
    }
  }

  verificar(seleccion: string) {
    if (!this.juegoActivo) return;

    const esCorrecto = seleccion === this.cancionActual.tonalidad;

    if (esCorrecto) {
      this.puntuacion += 10;
      this.mensaje = `✅ ¡Correcto! "${this.cancionActual.nombre}" es ${this.cancionActual.tonalidad}`;

      if (this.puntuacion >= 100) {
        this.terminarJuego(true);
        return;
      }
    } else {
      this.vidas--;
      this.mensaje = `❌ ¡Fallaste! "${this.cancionActual.nombre}" es ${this.cancionActual.tonalidad}. Te quedan ${this.vidas} vidas`;

      if (this.vidas <= 0) {
        this.terminarJuego(false);
        return;
      }
    }

    setTimeout(() => {
      this.nuevaCancion();
    }, 1500);
  }

  terminarJuego(ganado: boolean) {
    this.juegoActivo = false;
    this.juegoTerminado = true;
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  reiniciar() {
    this.puntuacion = 0;
    this.vidas = 3;
    this.juegoActivo = true;
    this.juegoTerminado = false;
    this.mensaje = '';
    this.nuevaCancion();
  }
}
