// ruleta-musical.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ruleta-musical',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ruleta-musical.component.html',
  styleUrls: ['./ruleta-musical.component.css']
})
export class RuletaMusicalComponent implements OnInit, OnDestroy {
  puntuacion: number = 50;
  racha: number = 0;
  multiplicador: number = 1;
  juegoActivo: boolean = true;
  juegoTerminado: boolean = false;
  mensaje: string = '';
  mensajeClass: string = '';

  letras: string[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  notas: { [key: string]: string } = {
    'C': 'Do', 'D': 'Re', 'E': 'Mi', 'F': 'Fa', 'G': 'Sol', 'A': 'La', 'B': 'Si'
  };

  letraActual: string = '';
  opciones: string[] = [];
  tiempoRestante: number = 10;
  temporizador: any;
  girando: boolean = false;

  ngOnInit() {
    this.nuevaRonda();
  }

  ngOnDestroy() {
    if (this.temporizador) clearInterval(this.temporizador);
  }

  nuevaRonda() {
    if (!this.juegoActivo) return;

    // Seleccionar letra aleatoria
    const indice = Math.floor(Math.random() * this.letras.length);
    this.letraActual = this.letras[indice];

    // Generar opciones (1 correcta + 3 incorrectas aleatorias)
    const otrasLetras = this.letras.filter(l => l !== this.letraActual);
    const opcionesInc = [...otrasLetras].sort(() => Math.random() - 0.5).slice(0, 3);
    this.opciones = [this.letraActual, ...opcionesInc].sort(() => Math.random() - 0.5);

    // Reiniciar tiempo
    this.tiempoRestante = 10;
    if (this.temporizador) clearInterval(this.temporizador);
    this.iniciarTemporizador();
  }

  iniciarTemporizador() {
    this.temporizador = setInterval(() => {
      if (this.tiempoRestante > 0 && this.juegoActivo) {
        this.tiempoRestante--;
      } else if (this.tiempoRestante === 0 && this.juegoActivo) {
        this.fallo('⏰ ¡Se acabó el tiempo!');
      }
    }, 1000);
  }

  verificarRespuesta(letraElegida: string) {
    if (!this.juegoActivo) return;

    if (letraElegida === this.letraActual) {
      // ACIERTO
      const puntosGanados = 10 * this.multiplicador;
      this.puntuacion += puntosGanados;
      this.racha++;

      if (this.racha >= 3) {
        this.multiplicador = 2;
        this.mensaje = `✨ ¡RACHA DE ${this.racha}! Multiplicador x2 ✨`;
      } else {
        this.multiplicador = 1;
        this.mensaje = `✅ ¡Correcto! ${this.letraActual} = ${this.notas[this.letraActual]} +${puntosGanados}`;
      }
      this.mensajeClass = 'text-success';

      // Verificar si ganó
      if (this.puntuacion >= 300) {
        this.terminarJuego(true);
        return;
      }

      setTimeout(() => this.nuevaRonda(), 1000);
    } else {
      // FALLO
      this.fallo(`❌ Incorrecto. ${letraElegida} = ${this.notas[letraElegida]}. La correcta era ${this.letraActual} = ${this.notas[this.letraActual]}`);
    }
  }

  fallo(mensajeError: string) {
    this.puntuacion -= 5;
    this.racha = 0;
    this.multiplicador = 1;
    this.mensaje = mensajeError;
    this.mensajeClass = 'text-danger';

    if (this.puntuacion <= 0) {
      this.terminarJuego(false);
    } else {
      setTimeout(() => this.nuevaRonda(), 1500);
    }
  }

  terminarJuego(ganado: boolean) {
    this.juegoActivo = false;
    this.juegoTerminado = true;
    if (this.temporizador) clearInterval(this.temporizador);
  }

  reiniciarJuego() {
    this.puntuacion = 50;
    this.racha = 0;
    this.multiplicador = 1;
    this.juegoActivo = true;
    this.juegoTerminado = false;
    this.nuevaRonda();
  }

  salirDelJuego() {
    if (confirm('¿Seguro que quieres salir? Perderás tu progreso.')) {
      this.juegoActivo = false;
      this.juegoTerminado = true;
    }
  }
}
