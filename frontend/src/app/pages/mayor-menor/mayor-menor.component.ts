import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


interface Cancion {
  titulo: string;
  artista: string;
  audio: string;
  tonalidad: 'Mayor' | 'Menor';
}


@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.css']
})
export class MayorMenorComponent implements OnInit, AfterViewInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;


  // ========== VARIABLES DE JUEGO ==========
  mostrarFinal: boolean = false;
  preguntaActual!: Cancion;
  audioReproduciendo: boolean = false;
  feedbackClass: string = '';
  feedback: string = '';
  aciertos: number = 0;
  errores: number = 0;
  preguntasRestantes: Cancion[] = [];


  // ========== BANCO DE CANCIONES ==========
  canciones: Cancion[] = [
    { titulo: 'Die with a Smile', artista: 'Lady Gaga & Bruno Mars', audio: './assets/audio/juegoMayorMenor/dieWithASmile.mp3', tonalidad: 'Mayor' },
    { titulo: 'Déjame Cuidarte', artista: 'Miriam Rodríguez', audio: './assets/audio/juegoMayorMenor/dejameCuidarte.mp3', tonalidad: 'Menor' },
    { titulo: 'Creo en Mí', artista: 'Lucía (Operación Triunfo)', audio: './assets/audio/juegoMayorMenor/creoEnMi.mp3', tonalidad: 'Mayor' },
    { titulo: 'T Amare', artista: 'Lucicallys', audio: './assets/audio/juegoMayorMenor/tAmare.mp3', tonalidad: 'Mayor' },
    { titulo: 'Someone Like You', artista: 'Adele', audio: './assets/audio/juegoMayorMenor/someoneLikeYou.mp3', tonalidad: 'Menor' },
    { titulo: '6 de Febrero', artista: 'Aitana', audio: './assets/audio/juegoMayorMenor/6febrero.mp3', tonalidad: 'Menor' },
    { titulo: 'Dónde Estás', artista: 'Álvaro de Luna', audio: './assets/audio/juegoMayorMenor/dimeDondeEstas.mp3', tonalidad: 'Menor' },
    { titulo: 'Palabra Prohibida', artista: 'Samuraï', audio: './assets/audio/juegoMayorMenor/palabraProhibida.mp3', tonalidad: 'Menor' },
    { titulo: 'Puzzle', artista: 'Chiara Oliver', audio: './assets/audio/juegoMayorMenor/puzzle.mp3', tonalidad: 'Menor' },
    { titulo: 'La Salvación', artista: 'Arde Bogotá', audio: './assets/audio/juegoMayorMenor/salvacion.mp3', tonalidad: 'Menor' },
    { titulo: 'Es tan fácil', artista: 'Chanel', audio: './assets/audio/juegoMayorMenor/tanFacil.mp3', tonalidad: 'Menor' },
    { titulo: 'Paracaidas', artista: 'Samurai', audio: './assets/audio/juegoMayorMenor/paracaidas.mp3', tonalidad: 'Menor' },
    { titulo: 'Happy', artista: 'Pharrell Williams', audio: './assets/audio/juegoMayorMenor/happy.mp3', tonalidad: 'Mayor' },
    { titulo: 'Uptown Funk', artista: 'Bruno Mars', audio: './assets/audio/juegoMayorMenor/uptownFunk.mp3', tonalidad: 'Mayor' },
    { titulo: 'Radio Baby', artista: 'Don Diablo', audio: './assets/audio/juegoMayorMenor/radioBaby.mp3', tonalidad: 'Mayor' },
    { titulo: 'Can’t Stop the Feeling', artista: 'Justin Timberlake', audio: './assets/audio/juegoMayorMenor/cantStopTheFeeling.mp3', tonalidad: 'Mayor' },
  ];


  constructor(private router: Router) {}


  ngOnInit(): void {
    this.iniciarJuego();
  }


  ngAfterViewInit(): void {
    console.log('Audio player inicializado');
  }


  iniciarJuego() {
    this.preguntasRestantes = [...this.canciones];
    this.aciertos = 0;
    this.errores = 0;
    this.mostrarFinal = false;
    this.feedback = '';
    this.cargarNuevaPregunta();
  }


  cargarNuevaPregunta() {
    this.feedback = '';
    this.audioReproduciendo = false;


    if (this.preguntasRestantes.length === 0) {
      this.mostrarFinal = true;
      return;
    }


    const index = Math.floor(Math.random() * this.preguntasRestantes.length);
    this.preguntaActual = this.preguntasRestantes.splice(index, 1)[0];


    setTimeout(() => {
      if (this.audioPlayer?.nativeElement) {
        this.audioPlayer.nativeElement.load();
      }
    }, 100);
  }


  reproducirAudio() {
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.play()
        .then(() => this.audioReproduciendo = true)
        .catch(err => console.log('Error:', err));
    }
  }

  responder(tonalidad: 'Mayor' | 'Menor') {
    const esCorrecta = this.preguntaActual.tonalidad === tonalidad;

    this.feedback = esCorrecta ? 'Correcto' : 'Incorrecto';
    this.feedbackClass = esCorrecta ? 'correcto' : 'incorrecto';

    if (esCorrecta) this.aciertos++;
    else this.errores++;
  }


  porcentajeExito(): number {
    const total = this.aciertos + this.errores;
    return total > 0 ? Math.round((this.aciertos / total) * 100) : 0;
  }


  reiniciarJuego() {
    this.iniciarJuego();
  }


  irAJuegos() {
    this.router.navigate(['/juegos-musicales']);
  }
}
