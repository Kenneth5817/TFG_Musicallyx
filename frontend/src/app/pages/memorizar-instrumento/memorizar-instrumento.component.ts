import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Card {
  name: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-memoria-musical',
  templateUrl: './memorizar-instrumento.component.html',
  styleUrls: ['./memorizar-instrumento.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MemorizarInstrumentoComponent implements OnInit {
 constructor(private router: Router) {}

  instrumentos: string[] = [
    "Guitarra", "Piano", "Batería", "Violín", "Trompeta", "Saxofón",
    "Arpa", "Bajo", "Flauta", "Acordeón", "Xilófono", "Órgano"
  ];

  cards: Card[] = [];
  flippedCards: Card[] = [];
  matchedPairs: number = 0;
  attempts: number = 0;
  gameTime: number = 0; // contador en aumento
  timerInterval: any;
  gameActive: boolean = false;

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.attempts = 0;
    this.gameTime = 0;
    this.gameActive = true;

    const deck = [...this.instrumentos, ...this.instrumentos]
      .map(name => ({ name, flipped: false, matched: false }));

    this.cards = this.shuffle(deck);

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.tick(), 1000);
  }

  shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  tick() {
    if (this.gameActive) this.gameTime++;
  }

  formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  flipCard(card: Card) {
    if (!this.gameActive || card.flipped || card.matched || this.flippedCards.length === 2) return;

    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.attempts++;
      const [a, b] = this.flippedCards;
      if (a.name === b.name) {
        a.matched = true;
        b.matched = true;
        this.matchedPairs++;
        this.flippedCards = [];
        if (this.matchedPairs === this.instrumentos.length) this.endGame();
      } else {
        setTimeout(() => {
          a.flipped = false;
          b.flipped = false;
          this.flippedCards = [];
        }, 800);
      }
    }
  }

  endGame() {
    this.gameActive = false;
    clearInterval(this.timerInterval);
  }

  goToAllGames() {
    this.router.navigate(['/juegos-musicales']);
  }
}
