import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-adivinar-compas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./adivinar-compas.component.css'],
  template: `
  <div class="game-card shadow-lg p-4 text-center">
    <h2>Adivina el compás</h2>
    <audio #audioCompas controls></audio>

    <div class="d-flex flex-wrap justify-content-center mt-3" *ngIf="!juegoTerminado">
      <button class="btn btn-compas m-1" data-answer="2/4" (click)="elegirCompas($event)">2/4</button>
      <button class="btn btn-compas m-1" data-answer="3/4" (click)="elegirCompas($event)">3/4</button>
      <button class="btn btn-compas m-1" data-answer="4/4" (click)="elegirCompas($event)">4/4</button>
      <button class="btn btn-compas m-1" data-answer="6/8" (click)="elegirCompas($event)">6/8</button>
    </div>

    <div id="feedback" class="mt-3" [ngClass]="feedbackClass">{{ feedback }}</div>

    <button id="nextBtn" class="btn btn-primary mt-3" (click)="cargarNuevaPregunta()" *ngIf="mostrarNext && !juegoTerminado">
      Siguiente ➡
    </button>

    <div id="finalResult" class="text-center mt-4" *ngIf="juegoTerminado">
      <h4>🎉 ¡Juego terminado!</h4>
      <p>✅ Aciertos: <strong>{{ aciertos }}</strong></p>
      <p>❌ Errores: <strong>{{ errores }}</strong></p>
      <p>📊 Porcentaje de éxito: <strong>{{ porcentaje }}%</strong></p>
      <a [routerLink]="['/juegos-musicales']" class="btn btn-outline-primary mt-4">🔙 Volver a todos los juegos</a>
    </div>
  </div>
  `,
  styles: [
    `
    .btn-success { background-color: #28a745 !important; color: white; }
    .btn-danger { background-color: #dc3545 !important; color: white; }
    `
  ]
})
export class AdivinarCompasComponent implements AfterViewInit {
  @ViewChild('audioCompas') audioCompas!: ElementRef<HTMLAudioElement>;

  todasLasPreguntas = [
    { audio: 'assets/audio/canciones/APT.mp3', compas: ['2/4', '4/4'] },
    { audio: 'assets/audio/canciones/belongTogether.mp3', compas: ['2/4', '4/4'] },
    { audio: 'assets/audio/canciones/DamianoDavid.mp3', compas: ['2/4', '4/4'] },
    { audio: 'assets/audio/canciones/DaniFernandez.mp3', compas: ['2/4', '4/4'] },
    { audio: 'assets/audio/canciones/mariposas.mp3', compas: ['2/4', '4/4'] },
    { audio: 'assets/audio/canciones/Camilo.mp3', compas: ['2/4', '4/4'] },
    { audio: 'assets/audio/canciones/weAreTheChampion.mp3', compas: ['6/8','2/4', '4/4'] },
    { audio: 'assets/audio/canciones/animals68.mp3', compas: ['6/8', '2/4', '4/4'] },
    { audio: 'assets/audio/canciones/sonrisasYLagrimas.mp3', compas: ['3/4'] },
    { audio: 'assets/audio/canciones/danubioAzul.mp3', compas: ['3/4'] },
  ];

  preguntasRestantes = [...this.todasLasPreguntas];
  preguntaActual: any = null;
  aciertos = 0;
  errores = 0;
  feedback = '';
  feedbackClass = '';
  mostrarNext = false;
  juegoTerminado = false;
  porcentaje = 0;
  private primerClick = false;

  ngAfterViewInit() {
    this.cargarNuevaPregunta();
  }

  cargarNuevaPregunta() {
    this.feedback = '';
    this.feedbackClass = '';
    this.mostrarNext = false;

    const botones = document.querySelectorAll('.btn-compas');
    botones.forEach(b => {
      (b as HTMLButtonElement).disabled = false;
      b.classList.remove('btn-success', 'btn-danger');
    });

    if (this.preguntasRestantes.length === 0) {
      this.mostrarResultadoFinal();
      return;
    }

    const index = Math.floor(Math.random() * this.preguntasRestantes.length);
    this.preguntaActual = this.preguntasRestantes.splice(index, 1)[0];

    const audioEl = this.audioCompas.nativeElement;
    audioEl.src = this.preguntaActual.audio;
    audioEl.load();
    if (this.primerClick) {
      audioEl.play().catch(() => {});
    }
  }

  elegirCompas(event: Event) {
    const boton = event.target as HTMLButtonElement;
    const eleccion = boton.dataset['answer'] || '';
    const esCorrecta = this.preguntaActual.compas.includes(eleccion);

    if (!this.primerClick) {
      this.primerClick = true;
      this.audioCompas.nativeElement.play().catch(() => {});
    }

    //Para que indique la respuesta
    this.feedback = esCorrecta
      ? `✅ ¡Correcto! El compás es ${this.preguntaActual.compas.join(', ')}`
      : `❌ Incorrecto. El compás correcto era ${this.preguntaActual.compas.join(', ')}`;

    this.feedbackClass = esCorrecta ? 'text-success' : 'text-danger';
    if (esCorrecta) this.aciertos++;
    else this.errores++;

    const botones = document.querySelectorAll('.btn-compas');
    botones.forEach(b => {
      const btn = b as HTMLButtonElement;
      btn.disabled = true;
      const answer = btn.dataset['answer'] || '';
      if (this.preguntaActual.compas.includes(answer)) {
        btn.classList.add('btn-success');
      } else if (btn === boton && !esCorrecta) {
        btn.classList.add('btn-danger');
      }
    });

    this.mostrarNext = true;
  }

  mostrarResultadoFinal() {
    this.juegoTerminado = true;
    const total = this.aciertos + this.errores;
    this.porcentaje = total > 0 ? Math.round((this.aciertos / total) * 100) : 0;

    //Para ocultar audio y botones al terminar
    this.audioCompas.nativeElement.style.display = 'none';
    const botones = document.querySelectorAll('.btn-compas');
    botones.forEach(b => (b as HTMLElement).style.display = 'none');
    this.mostrarNext = false;
  }
}
