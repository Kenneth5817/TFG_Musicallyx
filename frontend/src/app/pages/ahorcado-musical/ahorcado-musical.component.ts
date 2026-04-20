// ahorcado-musical.component.ts
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
    { palabra: 'PENTAGRAMA', pista1: 'Son 5 líneas y 4 espacios', pista2: 'Donde se escriben las notas', pista3: 'Empieza por P y termina por A' },
    { palabra: 'CIFRADO', pista1: 'Sistema de letras para notas', pista2: 'Usa C, D, E, F...', pista3: 'También llamado "americano"' },
    { palabra: 'CLAVIDE SOL', pista1: 'Se usa para notas agudas', pista2: 'Su símbolo es 𝄞', pista3: 'Empieza por C y termina por L' },
    { palabra: 'SEMICORCHEA', pista1: 'Vale 1/16 del compás', pista2: 'Tiene dos corchetes', pista3: 'Es más rápida que la corchea' },
    { palabra: 'CALDERON', pista1: 'Alarga la nota a voluntad', pista2: 'Parece un ojo con ceja', pista3: 'También llamado fermata' },
    { palabra: 'ARMADURA', pista1: 'Alteraciones al inicio', pista2: 'Indica la tonalidad', pista3: 'Puede tener sostenidos o bemoles' },
    { palabra: 'COMPAS', pista1: 'Divide la música en partes iguales', pista2: '2/4, 3/4, 4/4...', pista3: 'Su símbolo es una fracción' },
    { palabra: 'ACORDE', pista1: 'Varias notas sonando juntas', pista2: 'Do Mayor, Sol menor...', pista3: 'Mínimo 3 notas diferentes' },
    { palabra: 'INTERVALO', pista1: 'Distancia entre dos notas', pista2: 'Puede ser 2ª, 3ª, 5ª...', pista3: 'Su inversión es el complemento a 9' },
    { palabra: 'TONALIDAD', pista1: 'Centro de una obra', pista2: 'Puede ser Mayor o menor', pista3: 'Define el conjunto de notas' }
  ];

  palabraActual: string = '';
  palabraOculta: string[] = [];
  letrasFalladas: string[] = [];
  intentosRestantes: number = 10;
  juegoTerminado: boolean = false;
  juegoGanado: boolean = false;
  letraInput: string = '';
  pistasUsadas: number = 0;
  pistasDisponibles: number = 3;
  mensaje: string = '';

  constructor() {
    this.iniciarJuego();
  }

  iniciarJuego() {
    const randomIndex = Math.floor(Math.random() * this.terminosMusicales.length);
    this.palabraActual = this.terminosMusicales[randomIndex].palabra.toUpperCase();
    this.palabraOculta = this.palabraActual.split('').map(() => '_');
    this.letrasFalladas = [];
    this.intentosRestantes = 10;
    this.pistasUsadas = 0;
    this.pistasDisponibles = 3;
    this.juegoTerminado = false;
    this.juegoGanado = false;
    this.letraInput = '';
    this.mensaje = '';
  }

  adivinarLetra() {
    if (!this.letraInput || this.juegoTerminado) return;

    const letra = this.letraInput.toUpperCase();
    this.letraInput = '';

    if (this.palabraOculta.includes(letra) || this.letrasFalladas.includes(letra)) {
      this.mensaje = '⚠️ Ya intentaste esa letra';
      return;
    }

    if (this.palabraActual.includes(letra)) {
      // Letra correcta
      for (let i = 0; i < this.palabraActual.length; i++) {
        if (this.palabraActual[i] === letra) {
          this.palabraOculta[i] = letra;
        }
      }
      this.mensaje = '✅ ¡Bien! La letra está en la palabra';

      // Verificar si ganó
      if (!this.palabraOculta.includes('_')) {
        this.juegoGanado = true;
        this.juegoTerminado = true;
        this.mensaje = '🎉 ¡FELICIDADES! Adivinaste la palabra 🎉';
      }
    } else {
      // Letra incorrecta
      this.letrasFalladas.push(letra);
      this.intentosRestantes--;
      this.mensaje = `❌ La letra "${letra}" no está en la palabra`;

      if (this.intentosRestantes <= 0) {
        this.juegoTerminado = true;
        this.mensaje = `💀 GAME OVER 💀 La palabra era: ${this.palabraActual}`;
      }
    }
  }

  pedirPista() {
    if (this.pistasUsadas >= this.pistasDisponibles) {
      this.mensaje = '⚠️ No te quedan más pistas';
      return;
    }

    const termino = this.terminosMusicales.find(t => t.palabra === this.palabraActual);
    let pista = '';

    switch(this.pistasUsadas) {
      case 0: pista = termino?.pista1 || ''; break;
      case 1: pista = termino?.pista2 || ''; break;
      case 2: pista = termino?.pista3 || ''; break;
    }

    this.pistasUsadas++;
    this.mensaje = `💡 PISTA ${this.pistasUsadas}/${this.pistasDisponibles}: ${pista}`;
  }

  reiniciar() {
    this.iniciarJuego();
  }

  getPartesAhorcado(): string[] {
    const partes = ['cabeza', 'cuerpo', 'brazo_izq', 'brazo_der', 'pierna_izq', 'pierna_der'];
    return partes.slice(0, 10 - this.intentosRestantes);
  }
}
