import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Ronda {
  codigo: string;
  correcta: string;
}

@Component({
  selector: 'app-ruleta-musical',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ruleta-musical.component.html',
  styleUrls: ['./ruleta-musical.component.css']
})
export class RuletaMusicalComponent implements OnInit, OnDestroy {

  // 🎮 GAME STATE
  puntuacion = 0;
  racha = 0;
  multiplicador = 1;

  vidas = 3;
  juegoActivo = true;
  juegoTerminado = false;

  mensaje = '';
  mensajeClass = '';

  // 🎯 CONTROL DE PREGUNTAS
  maxPreguntas = 15;
  preguntasHechas = 0;

  codigoActual = '';
  opciones: string[] = [];

  tiempoRestante = 10;
  temporizador: any;

  rondas: Ronda[] = [];
  rondaActual!: Ronda;

  // 🎵 NOTAS
  notas: any = {
    C: { mayor: 'Do Mayor', menor: 'Do menor' },
    D: { mayor: 'Re Mayor', menor: 'Re menor' },
    E: { mayor: 'Mi Mayor', menor: 'Mi menor' },
    F: { mayor: 'Fa Mayor', menor: 'Fa menor' },
    G: { mayor: 'Sol Mayor', menor: 'Sol menor' },
    A: { mayor: 'La Mayor', menor: 'La menor' },
    B: { mayor: 'Si Mayor', menor: 'Si menor' }
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.iniciarJuego();
  }

  ngOnDestroy() {
    clearInterval(this.temporizador);
  }

  // 🚀 INICIO JUEGO
  iniciarJuego() {

    this.puntuacion = 0;
    this.racha = 0;
    this.multiplicador = 1;
    this.vidas = 3;

    this.preguntasHechas = 0;

    this.juegoActivo = true;
    this.juegoTerminado = false;

    const keys = Object.keys(this.notas);

    // 🎯 15 preguntas fijas
    this.rondas = this.shuffle(
      Array.from({ length: this.maxPreguntas }, () => {
        const k = keys[Math.floor(Math.random() * keys.length)];
        return {
          codigo: Math.random() > 0.5 ? k : k + 'm',
          correcta: ''
        };
      })
    );

    this.nuevaRonda();
  }

  // 🎼 PARSE CIFRADO
  parseCodigo(codigo: string) {
    const esMenor = codigo.endsWith('m');
    const nota = esMenor ? codigo.replace('m', '') : codigo;

    const nombre = this.notas[nota][esMenor ? 'menor' : 'mayor'];

    return { nota, esMenor, nombre };
  }

  // 🎯 NUEVA PREGUNTA
  nuevaRonda() {

    this.preguntasHechas++;

    if (this.vidas <= 0 || this.preguntasHechas > this.maxPreguntas) {
      this.terminarJuego();
      return;
    }

    this.rondaActual = this.rondas.pop()!;
    const parsed = this.parseCodigo(this.rondaActual.codigo);

    this.codigoActual = this.rondaActual.codigo;

    const correcta = parsed.nombre;

    const todas = Object.values(this.notas)
      .flatMap((n: any) => [n.mayor, n.menor])
      .filter((n: string) => n !== correcta);

    this.opciones = this.shuffle([
      correcta,
      ...todas.slice(0, 3)
    ]);

    this.tiempoRestante = 10;
    clearInterval(this.temporizador);
    this.iniciarTemporizador();
  }

  // ⏱ TIMER
  iniciarTemporizador() {
    this.temporizador = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        this.fallo();
      }
    }, 1000);
  }

  // 🎮 RESPUESTA
  verificarRespuesta(opcion: string) {

    const parsed = this.parseCodigo(this.codigoActual);

    const normal = (t: string) =>
      t.toLowerCase().replace(/\s/g, '');

    if (normal(opcion) === normal(parsed.nombre)) {

      this.puntuacion += 10 * this.multiplicador;
      this.racha++;

      this.mensaje = 'Correcto';
      this.mensajeClass = 'text-success';

      if (this.racha >= 3) this.multiplicador = 2;

    } else {
      this.fallo();
      return;
    }

    setTimeout(() => this.nuevaRonda(), 700);
  }

  // 💀 FALLO
  fallo() {

    this.vidas--;
    this.racha = 0;
    this.multiplicador = 1;

    this.mensaje = 'Fallo';
    this.mensajeClass = 'text-danger';

    if (this.vidas <= 0) {
      this.terminarJuego();
      return;
    }

    setTimeout(() => this.nuevaRonda(), 900);
  }

  // 🏁 FINAL
  terminarJuego() {
    this.juegoActivo = false;
    this.juegoTerminado = true;
    clearInterval(this.temporizador);
  }

  // 🔄 REINICIAR
  reiniciarJuego() {
    this.iniciarJuego();
  }

  // 🚪 SALIR
  salirDelJuego() {
    this.router.navigate(['/juegos-musicales']);
  }

  // 🔀 SHUFFLE
  shuffle(arr: any[]) {
    return arr.sort(() => Math.random() - 0.5);
  }
}
